import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Favicon Generator | Create .ICO & PNG Icons',
  description:
    'Create multi-size favicon.ico and PNG icons from any image or text. Download ready-made favicon packages for your website.',
  path: '/tools/favicon-generator',
  keywords: [
    'favicon generator',
    'create favicon online',
    'ico converter',
    'website icon maker',
  ],
});

export default function FaviconGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
