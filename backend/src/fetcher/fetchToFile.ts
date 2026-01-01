import fs from 'fs';
import { pipeline } from 'stream/promises';
import { setTimeout as delay } from 'timers/promises';

export async function fetchToFile(params: {
  url: string;
  outputPath: string;
  timeoutMs: number;
}): Promise<{ bytes: number; mimeType: string }>
{
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs);

  try {
    const res = await fetch(params.url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow'
    });

    if (!res.ok || !res.body) {
      throw new Error(`Upstream fetch failed (${res.status})`);
    }

    // Sequential streaming write (no parallel chunks)
    const fileStream = fs.createWriteStream(params.outputPath, { flags: 'w' });
    await pipeline(res.body as unknown as NodeJS.ReadableStream, fileStream);

    // Small, predictable pause to avoid aggressive throughput
    await delay(250);

    const mimeType = res.headers.get('content-type') ?? 'application/octet-stream';

    const stat = fs.statSync(params.outputPath);
    return { bytes: stat.size, mimeType };
  } finally {
    clearTimeout(timeout);
  }
}
