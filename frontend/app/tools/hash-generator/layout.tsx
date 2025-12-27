import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Hash Generator | MD5, SHA-1, SHA-256, SHA-512',
  description:
    'Generate secure MD5, SHA-1, SHA-256, and SHA-512 hashes for any string or file directly in your browser with ToolsHub.',
  path: '/tools/hash-generator',
  keywords: [
    'hash generator',
    'md5 online',
    'sha256 generator',
    'checksum tool',
  ],
});

export default function HashGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
