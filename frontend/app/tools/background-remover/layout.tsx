import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Background Remover | Erase Image Backgrounds Online',
  description:
    'Remove backgrounds from product photos, portraits, or graphics automatically with the AI-powered ToolsHub background remover.',
  path: '/tools/background-remover',
  keywords: [
    'remove image background',
    'background remover online',
    'cutout tool',
    'transparent background maker',
  ],
});

export default function BackgroundRemoverLayout({ children }: { children: ReactNode }) {
  return children;
}
