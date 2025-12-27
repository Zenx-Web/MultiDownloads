import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Video Converter | Convert MP4, AVI, MKV, WebM',
  description:
    'Convert videos between MP4, AVI, MKV, MOV, and WebM, adjust resolution, and optimize files for any device using the ToolsHub video converter.',
  path: '/tools/video-converter',
  keywords: [
    'video converter online',
    'mp4 to avi',
    'mkv converter',
    'webm to mp4',
  ],
});

export default function VideoConverterLayout({ children }: { children: ReactNode }) {
  return children;
}
