import crypto from 'crypto';

export function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function base64UrlDecodeToBuffer(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const finalStr = padded + '='.repeat(padLen);
  return Buffer.from(finalStr, 'base64');
}

export function hmacSha256Base64Url(secret: string, message: string): string {
  const mac = crypto.createHmac('sha256', secret).update(message, 'utf8').digest();
  return base64UrlEncode(mac);
}
