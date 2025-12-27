import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'YouTube Video Downloader | Save HD & 4K Videos',
  description:
    'Download YouTube videos in 720p, 1080p, or 4K, extract MP3 audio, and save playlists fast with the free ToolsHub YouTube Downloader.',
  path: '/youtube',
  keywords: [
    'youtube downloader',
    'download youtube videos',
    'youtube to mp3',
    '4k video downloader',
    'save youtube playlist',
  ],
});

export default function YouTubeLayout({ children }: { children: ReactNode }) {
  return children;
}
