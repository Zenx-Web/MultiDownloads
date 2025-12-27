import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Video Trimmer | Cut & Trim Clips Online',
  description:
    'Trim and cut video segments precisely, remove unwanted sections, and export polished clips with the ToolsHub video trimmer.',
  path: '/tools/video-trimmer',
  keywords: [
    'video trimmer',
    'trim video online',
    'cut mp4',
    'video cutter',
  ],
});

export default function VideoTrimmerLayout({ children }: { children: ReactNode }) {
  return children;
}
