import crypto from 'crypto';
import { base64UrlDecodeToBuffer, base64UrlEncode, hmacSha256Base64Url } from '../shared/hmac';

export interface DownloadTokenPayload {
  jobId: string;
  exp: number;
  nonce: string;
}

export function signDownloadToken(secret: string, payload: DownloadTokenPayload): string {
  const json = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(json);
  const sig = hmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifyDownloadToken(secret: string, token: string): DownloadTokenPayload {
  const parts = token.split('.');
  if (parts.length !== 2) throw new Error('Invalid token');

  const [payloadB64, sig] = parts;
  const expected = hmacSha256Base64Url(secret, payloadB64);

  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Invalid token');
  }

  const payloadJson = base64UrlDecodeToBuffer(payloadB64).toString('utf8');
  const payload = JSON.parse(payloadJson) as DownloadTokenPayload;
  if (!payload?.jobId || !payload?.exp || !payload?.nonce) throw new Error('Invalid token');
  return payload;
}
