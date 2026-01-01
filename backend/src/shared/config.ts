import path from 'path';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 8080}`,

  downloadSigningSecret: requireEnv('DOWNLOAD_SIGNING_SECRET'),

  dataDir: path.resolve(process.env.DATA_DIR ?? './data'),
  storageDir: path.resolve(process.env.STORAGE_DIR ?? './storage'),
  fileTtlSeconds: optionalInt('FILE_TTL_SECONDS', 600),

  workerPollIntervalMs: optionalInt('WORKER_POLL_INTERVAL_MS', 1500),
  freeQueueDelaySeconds: optionalInt('FREE_QUEUE_DELAY_SECONDS', 30),

  freeMaxRequestsPerHour: optionalInt('FREE_MAX_REQUESTS_PER_HOUR', 2),
  premiumMaxRequestsPerHour: optionalInt('PREMIUM_MAX_REQUESTS_PER_HOUR', 10),
  freeMaxDurationSeconds: optionalInt('FREE_MAX_DURATION_SECONDS', 900),
  premiumMaxDurationSeconds: optionalInt('PREMIUM_MAX_DURATION_SECONDS', 3600),

  freeMaxActiveJobs: optionalInt('FREE_MAX_ACTIVE_JOBS', 1),
  premiumMaxActiveJobs: optionalInt('PREMIUM_MAX_ACTIVE_JOBS', 2),

  premiumToken: process.env.PREMIUM_TOKEN ?? '',

  ffprobePath: process.env.FFPROBE_PATH ?? 'ffprobe',
  ffprobeTimeoutMs: optionalInt('FFPROBE_TIMEOUT_MS', 8000)
};
