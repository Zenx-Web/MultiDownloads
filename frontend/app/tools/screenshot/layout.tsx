import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Website Screenshot Tool | Capture Full Page Images',
  description:
    'Capture pixel-perfect website screenshots, full-page captures, and responsive previews directly from any URL using ToolsHub.',
  path: '/tools/screenshot',
  keywords: [
    'website screenshot',
    'capture webpage',
    'full page screenshot',
    'url to image',
  ],
});

export default function ScreenshotLayout({ children }: { children: ReactNode }) {
  return children;
}
