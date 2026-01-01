import crypto from 'crypto';

export function newJobId(): string {
  return crypto.randomUUID();
}

export function safeFilenameFromUrl(url: string, fallbackBase: string): string {
  try {
    const u = new URL(url);
    const last = u.pathname.split('/').filter(Boolean).pop() ?? '';
    const cleaned = last.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
    return cleaned || fallbackBase;
  } catch {
    return fallbackBase;
  }
}
