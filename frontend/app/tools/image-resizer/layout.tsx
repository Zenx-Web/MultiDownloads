import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Image Resizer | Resize Photos to Exact Dimensions',
  description:
    'Resize images to custom pixel dimensions or aspect ratios while keeping quality high using the ToolsHub image resizer.',
  path: '/tools/image-resizer',
  keywords: [
    'image resizer',
    'resize photo online',
    'change image dimensions',
    'bulk image resize',
  ],
});

export default function ImageResizerLayout({ children }: { children: ReactNode }) {
  return children;
}
