import { z } from 'zod';

export const submitJobSchema = z.object({
  url: z.string().url(),
  kind: z.enum(['audio', 'video']).default('video')
});

export function isHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
