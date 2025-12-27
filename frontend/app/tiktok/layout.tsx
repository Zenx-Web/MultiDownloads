import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'TikTok Video Downloader | Save HD Videos Without Watermark',
  description:
    'Download TikTok videos without the watermark in HD quality. Paste the link and save instantly on any device using ToolsHub.',
  path: '/tiktok',
  keywords: [
    'tiktok downloader',
    'download tiktok without watermark',
    'save tiktok video',
    'tiktok to mp4',
  ],
});

export default function TikTokLayout({ children }: { children: ReactNode }) {
  return children;
}
