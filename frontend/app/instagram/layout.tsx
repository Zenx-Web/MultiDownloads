import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Instagram Downloader | Save Reels, Stories & IGTV',
  description:
    'Download Instagram Reels, Stories, IGTV, and photo posts in original quality. ToolsHub works on any device with no login required.',
  path: '/instagram',
  keywords: [
    'instagram downloader',
    'download instagram reels',
    'save instagram stories',
    'igtv downloader',
  ],
});

export default function InstagramLayout({ children }: { children: ReactNode }) {
  return children;
}
