import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Text Formatter | Change Case & Clean Text Online',
  description:
    'Format text to uppercase, lowercase, title case, remove duplicates, and clean whitespace instantly with the ToolsHub text formatter.',
  path: '/tools/text-formatter',
  keywords: [
    'text formatter',
    'change text case',
    'uppercase converter',
    'text cleaner',
  ],
});

export default function TextFormatterLayout({ children }: { children: ReactNode }) {
  return children;
}
