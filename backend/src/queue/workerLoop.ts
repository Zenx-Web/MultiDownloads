import { setTimeout as delay } from 'timers/promises';
import path from 'path';
import fs from 'fs/promises';

import { config } from '../shared/config';
import { ensureDir } from '../storage/fsUtil';
import { JobStore } from '../storage/jobStore';
import { deleteJobStorage, jobOutputPath, prepareJobStorage } from '../storage/files';
import { fetchToFile } from '../fetcher/fetchToFile';
import { safeFilenameFromUrl } from '../shared/ids';
import { RateLimiter } from '../ratelimit/rateLimiter';
import { cleanupExpired } from '../cleanup/cleanup';
import { JobRecord } from '../types';
import { signDownloadToken } from '../download/tokens';

function sortJobs(a: JobRecord, b: JobRecord): number {
  if (a.priority !== b.priority) return b.priority - a.priority;
  return a.createdAt - b.createdAt;
}

export async function runWorkerLoop(): Promise<void> {
  await ensureDir(config.dataDir);
  await ensureDir(config.storageDir);

  // Ensure only one worker process is active.
  const workerLockPath = path.join(config.dataDir, 'worker.lock');
  try {
    const handle = await fs.open(workerLockPath, 'wx');
    await handle.writeFile(String(process.pid), { encoding: 'utf8' });
    await handle.close();
  } catch {
    // eslint-disable-next-line no-console
    console.error('Another worker is already running');
    return;
  }

  const cleanupWorkerLock = async () => {
    try {
      await fs.unlink(workerLockPath);
    } catch {
      // ignore
    }
  };

  process.on('SIGINT', () => {
    void cleanupWorkerLock().finally(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    void cleanupWorkerLock().finally(() => process.exit(0));
  });
  process.on('exit', () => {
    void cleanupWorkerLock();
  });

  const jobStore = new JobStore(JobStore.jobsDirFromDataDir(config.dataDir));
  await jobStore.init();

  const rateLimiter = new RateLimiter(config.dataDir);

  let lastCleanup = 0;

  // eslint-disable-next-line no-console
  console.log('Worker started');

  while (true) {
    const nowMs = Date.now();

    // Periodic cleanup (best-effort)
    if (nowMs - lastCleanup > 30_000) {
      await cleanupExpired({ jobStore, storageDir: config.storageDir, nowMs });
      lastCleanup = nowMs;
    }

    const jobs = await jobStore.listAll();
    const candidates = jobs
      .filter((j) => j.status === 'queued' && j.availableAt <= nowMs)
      .sort(sortJobs);

    const nextJob = candidates[0];
    if (!nextJob) {
      await delay(config.workerPollIntervalMs);
      continue;
    }

    const locked = await jobStore.tryAcquireLock(nextJob.id);
    if (!locked) {
      await delay(200);
      continue;
    }

    try {
      await jobStore.update(nextJob.id, (j) => ({ ...j, status: 'processing', error: undefined }));

      await prepareJobStorage(config.storageDir, nextJob.id);
      const outputPath = jobOutputPath(config.storageDir, nextJob.id);

      // Strict timeouts; sequential streaming write; no retries.
      const { bytes, mimeType } = await fetchToFile({
        url: nextJob.url,
        outputPath,
        timeoutMs: 120_000
      });

      const filename = safeFilenameFromUrl(nextJob.url, `${nextJob.id}.${nextJob.kind}`);
      const expiresAt = Date.now() + config.fileTtlSeconds * 1000;
      const downloadToken = signDownloadToken(config.downloadSigningSecret, {
        jobId: nextJob.id,
        exp: expiresAt,
        nonce: String(Date.now())
      });

      await jobStore.update(nextJob.id, (j) => ({
        ...j,
        status: 'ready',
        result: {
          filename,
          mimeType,
          bytes,
          readyAt: Date.now(),
          expiresAt,
          downloadUsed: false,
          downloadToken
        }
      }));
    } catch {
      const nowFail = Date.now();
      const key = `${nextJob.requester.userId}::${nextJob.requester.ip}`;
      await rateLimiter.recordFailureAndMaybeBlock(key, nowFail);

      await jobStore.update(nextJob.id, (j) => ({
        ...j,
        status: 'failed',
        error: {
          code: 'FETCH_FAILED',
          message: 'We could not fetch that media from public sources. Please try a different URL.'
        }
      }));

      await deleteJobStorage(config.storageDir, nextJob.id);
    } finally {
      await jobStore.releaseLock(nextJob.id);
    }

    // Predictability > speed
    await delay(500);
  }
}
