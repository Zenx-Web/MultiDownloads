import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Image Compressor | Reduce JPG, PNG, WebP File Size',
  description:
    'Compress JPG, PNG, or WebP images without losing detail. Control quality, preview results, and download optimized files instantly.',
  path: '/tools/image-compressor',
  keywords: [
    'image compressor',
    'compress jpg online',
    'reduce png size',
    'webp compressor',
  ],
});

export default function ImageCompressorLayout({ children }: { children: ReactNode }) {
  return children;
}
