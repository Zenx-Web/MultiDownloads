import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Image Converter | Convert JPG, PNG, WebP, AVIF, GIF',
  description:
    'Convert and resize images between JPG, PNG, WebP, AVIF, and GIF formats right inside your browser with the ToolsHub image converter.',
  path: '/tools/image-converter',
  keywords: [
    'image converter',
    'jpg to png',
    'png to webp',
    'avif converter',
  ],
});

export default function ImageConverterLayout({ children }: { children: ReactNode }) {
  return children;
}
