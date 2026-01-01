import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { config } from '../shared/config';
import { submitJobSchema, isHttpUrl } from '../shared/validation';
import { newJobId, safeFilenameFromUrl } from '../shared/ids';
import { JobRecord, UserPlan } from '../types';
import { JobStore } from '../storage/jobStore';
import { ensureDir } from '../storage/fsUtil';
import { jobOutputPath, prepareJobStorage, deleteJobStorage } from '../storage/files';
import { RateLimiter } from '../ratelimit/rateLimiter';
import { probeDurationSeconds } from '../metadata/ffprobe';
import { verifyDownloadToken } from '../download/tokens';

function getIp(req: Request): string {
  // Express `req.ip` respects `trust proxy`.
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function getUserId(req: Request, ip: string): string {
  const header = req.header('x-user-id');
  return (header && header.trim()) || ip;
}

function resolvePlan(req: Request): UserPlan {
  const planHeader = (req.header('x-user-plan') || 'free').toLowerCase();
  if (planHeader !== 'premium') return 'free';

  // Premium is only accepted if token matches (prevents clients from self-assigning premium)
  if (!config.premiumToken) return 'free';
  const token = req.header('x-premium-token') || '';
  return token === config.premiumToken ? 'premium' : 'free';
}

function userKey(userId: string, ip: string): string {
  // Key both dimensions to make abuse harder.
  return `${userId}::${ip}`;
}

export async function createApiServer(): Promise<express.Express> {
  await ensureDir(config.dataDir);
  await ensureDir(config.storageDir);

  const app = express();
  app.set('trust proxy', true);

  const corsOriginsRaw = (process.env.CORS_ORIGINS ?? '').trim();
  const corsOrigins = corsOriginsRaw
    ? corsOriginsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  app.use(
    cors({
      // If allowlist is empty, reflect the request origin.
      origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    })
  );

  app.use(helmet());
  app.use(express.json({ limit: '32kb' }));

  const jobStore = new JobStore(JobStore.jobsDirFromDataDir(config.dataDir));
  await jobStore.init();

  const rateLimiter = new RateLimiter(config.dataDir);

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  // Legacy/unsupported endpoints from earlier versions of the product.
  // We return structured JSON to avoid confusing 404s in the UI.
  app.all('/api/media/*', (_req, res) => {
    return res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Media tools are not available in this deployment.'
      }
    });
  });

  app.all('/api/status/*', (_req, res) => {
    return res.status(410).json({
      error: {
        code: 'GONE',
        message: 'This endpoint is deprecated. Use GET /api/jobs/:jobId instead.'
      }
    });
  });

  app.all('/api/download/info', (_req, res) => {
    return res.status(410).json({
      error: {
        code: 'GONE',
        message: 'This endpoint is deprecated. Submit a job via POST /api/jobs.'
      }
    });
  });

  app.post('/api/jobs', async (req, res, next) => {
    try {
      const parsed = submitJobSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid request.' } });
      }

      const ip = getIp(req);
      const userId = getUserId(req, ip);
      const plan = resolvePlan(req);
      const key = userKey(userId, ip);
      const nowMs = Date.now();

      const blocked = await rateLimiter.checkBlocked(key, nowMs);
      if (blocked) {
        return res.status(429).json({
          error: {
            code: 'BLOCKED',
            message: 'Too many attempts. Please wait before trying again.'
          }
        });
      }

      // Per-user job caps (queued + processing)
      const existingJobs = await jobStore.listAll();
      const activeCount = existingJobs.filter(
        (j) =>
          j.requester.userId === userId &&
          j.requester.ip === ip &&
          (j.status === 'queued' || j.status === 'processing')
      ).length;
      const maxActive = plan === 'premium' ? config.premiumMaxActiveJobs : config.freeMaxActiveJobs;
      if (activeCount >= maxActive) {
        return res.status(429).json({
          error: {
            code: 'JOB_CAP',
            message: 'You already have a request in progress. Please wait until it finishes.'
          }
        });
      }

      const url = parsed.data.url;
      const kind = parsed.data.kind;

      if (!isHttpUrl(url)) {
        return res.status(400).json({ error: { code: 'INVALID_URL', message: 'Please submit a valid public URL.' } });
      }

      // Rate limit (count attempts; controlled system prefers strictness)
      const rl = await rateLimiter.incrementAndCheckLimit({
        userKey: key,
        plan,
        nowMs,
        freeLimit: config.freeMaxRequestsPerHour,
        premiumLimit: config.premiumMaxRequestsPerHour
      });

      if (!rl.allowed) {
        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT',
            message: 'Hourly limit reached. Please try again later.'
          }
        });
      }

      // Metadata-only duration validation (public access only)
      let durationSeconds: number;
      try {
        durationSeconds = await probeDurationSeconds({
          ffprobePath: config.ffprobePath,
          timeoutMs: config.ffprobeTimeoutMs,
          url
        });
      } catch {
        return res.status(400).json({
          error: {
            code: 'DURATION_UNAVAILABLE',
            message: 'Could not read media duration from public data. Please try a different URL.'
          }
        });
      }

      const maxDuration = plan === 'premium' ? config.premiumMaxDurationSeconds : config.freeMaxDurationSeconds;
      if (durationSeconds > maxDuration) {
        return res.status(400).json({
          error: {
            code: 'DURATION_LIMIT',
            message: plan === 'premium'
              ? 'This media is longer than the premium limit.'
              : 'This media is longer than the free limit.'
          }
        });
      }

      const jobId = newJobId();
      const delaySeconds = plan === 'free' ? config.freeQueueDelaySeconds : 0;
      const availableAt = nowMs + delaySeconds * 1000;

      const job: JobRecord = {
        id: jobId,
        url,
        kind,
        createdAt: nowMs,
        availableAt,
        status: 'queued',
        priority: plan === 'premium' ? 1 : 0,
        requester: { userId, plan, ip },
        metadata: { durationSeconds }
      };

      await jobStore.create(job);

      res.status(202).json({
        jobId: job.id,
        status: job.status,
        availableAt: job.availableAt,
        durationSeconds: job.metadata?.durationSeconds
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/jobs/:jobId', async (req, res, next) => {
    try {
      const job = await jobStore.get(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found.' } });
      }

      res.status(200).json({
        id: job.id,
        status: job.status,
        createdAt: job.createdAt,
        availableAt: job.availableAt,
        result: job.result
          ? {
              filename: job.result.filename,
              mimeType: job.result.mimeType,
              bytes: job.result.bytes,
              readyAt: job.result.readyAt,
              expiresAt: job.result.expiresAt,
              downloadUsed: job.result.downloadUsed
            }
          : undefined,
        error: job.error ? { code: job.error.code, message: job.error.message } : undefined
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/jobs/:jobId/download-link', async (req, res, next) => {
    try {
      const nowMs = Date.now();
      const job = await jobStore.get(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found.' } });
      }
      if (job.status !== 'ready' || !job.result) {
        return res.status(409).json({ error: { code: 'NOT_READY', message: 'Job is not ready yet.' } });
      }
      if (job.result.expiresAt <= nowMs) {
        return res.status(410).json({ error: { code: 'EXPIRED', message: 'This download has expired.' } });
      }
      if (job.result.downloadUsed) {
        return res.status(410).json({ error: { code: 'USED', message: 'This download link has already been used.' } });
      }

      const url = `${config.publicBaseUrl}/api/download/${encodeURIComponent(job.id)}?token=${encodeURIComponent(job.result.downloadToken)}`;
      res.status(200).json({ url, expiresAt: job.result.expiresAt });
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/download/:jobId', async (req, res, next) => {
    try {
      const token = String(req.query.token || '');
      if (!token) {
        return res.status(400).json({ error: { code: 'MISSING_TOKEN', message: 'Missing download token.' } });
      }

      let payload: { jobId: string; exp: number };
      try {
        payload = verifyDownloadToken(config.downloadSigningSecret, token);
      } catch {
        return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Invalid download token.' } });
      }

      const nowMs = Date.now();
      if (payload.jobId !== req.params.jobId) {
        return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Invalid download token.' } });
      }
      if (payload.exp <= nowMs) {
        return res.status(410).json({ error: { code: 'EXPIRED', message: 'This download has expired.' } });
      }

      const job = await jobStore.get(req.params.jobId);
      if (!job || job.status !== 'ready' || !job.result) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Download not available.' } });
      }
      if (job.result.expiresAt <= nowMs) {
        return res.status(410).json({ error: { code: 'EXPIRED', message: 'This download has expired.' } });
      }
      if (job.result.downloadUsed) {
        return res.status(410).json({ error: { code: 'USED', message: 'This download link has already been used.' } });
      }

      const filePath = jobOutputPath(config.storageDir, job.id);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Download not available.' } });
      }

      const fallbackName = safeFilenameFromUrl(job.url, `${job.id}.${job.kind}`);
      res.setHeader('Content-Type', job.result.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fallbackName}"`);

      const stream = fs.createReadStream(filePath);

      // Delete after successful delivery.
      stream.on('error', () => {
        // don't leak details
        if (!res.headersSent) res.status(500).end();
      });

      res.on('finish', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Mark used and cleanup storage.
          await jobStore.update(job.id, (j) => ({
            ...j,
            status: 'expired',
            result: j.result
              ? { ...j.result, downloadUsed: true }
              : j.result
          }));
          await deleteJobStorage(config.storageDir, job.id);
        }
      });

      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  });

  // Generic error handler (never expose stack traces)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again later.'
      }
    });
  });

  return app;
}
