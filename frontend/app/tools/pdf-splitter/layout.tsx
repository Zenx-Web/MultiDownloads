import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'PDF Splitter | Split Pages into Separate PDFs',
  description:
    'Split a PDF into individual pages or custom ranges with ToolsHub. Reorder, preview, and download only the pages you need.',
  path: '/tools/pdf-splitter',
  keywords: [
    'split pdf',
    'pdf splitter',
    'extract pdf pages',
    'separate pdf online',
  ],
});

export default function PdfSplitterLayout({ children }: { children: ReactNode }) {
  return children;
}
