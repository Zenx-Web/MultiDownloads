import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Thumbnail Creator | Design YouTube & Social Thumbnails',
  description:
    'Design custom video thumbnails with text, overlays, and brand colors. Export ready-to-upload images for YouTube, Shorts, and Reels.',
  path: '/tools/thumbnail-creator',
  keywords: [
    'thumbnail creator',
    'youtube thumbnail maker',
    'social media thumbnail',
  ],
});

export default function ThumbnailCreatorLayout({ children }: { children: ReactNode }) {
  return children;
}
