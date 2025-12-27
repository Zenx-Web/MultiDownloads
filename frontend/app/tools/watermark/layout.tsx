import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Watermark Tool | Protect Images with Text Overlays',
  description:
    'Add customizable text watermarks, choose fonts, colors, and positions to protect your images online with the ToolsHub watermark tool.',
  path: '/tools/watermark',
  keywords: [
    'add watermark online',
    'image watermark tool',
    'text watermark generator',
  ],
});

export default function WatermarkLayout({ children }: { children: ReactNode }) {
  return children;
}
