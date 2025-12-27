import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Color Palette Generator | Extract Brand Colors',
  description:
    'Upload an image and instantly extract matching color palettes, hex codes, and gradients for your design projects using ToolsHub.',
  path: '/tools/color-palette',
  keywords: [
    'color palette generator',
    'extract colors from image',
    'hex color finder',
    'brand palette maker',
  ],
});

export default function ColorPaletteLayout({ children }: { children: ReactNode }) {
  return children;
}
