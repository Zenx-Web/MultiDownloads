import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'PDF Merger | Combine Multiple PDFs Online',
  description:
    'Merge multiple PDF documents into a single organized file with drag-and-drop ordering using the ToolsHub PDF merger.',
  path: '/tools/pdf-merger',
  keywords: [
    'merge pdf',
    'pdf combiner',
    'join pdf files',
    'combine pdf online',
  ],
});

export default function PdfMergerLayout({ children }: { children: ReactNode }) {
  return children;
}
