import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Facebook Video Downloader | Save Watch & Live Videos',
  description:
    'Download Facebook videos, Watch clips, and live streams in HD without installing software. Paste the link and save instantly with ToolsHub.',
  path: '/facebook',
  keywords: [
    'facebook video downloader',
    'download facebook watch',
    'save facebook live',
    'facebook to mp4',
  ],
});

export default function FacebookLayout({ children }: { children: ReactNode }) {
  return children;
}
