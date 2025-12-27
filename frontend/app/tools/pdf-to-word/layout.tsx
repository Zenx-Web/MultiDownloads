import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'PDF to Word Converter | Turn PDFs into Editable Docs',
  description:
    'Convert PDF documents into fully editable Word files (DOCX) while preserving formatting, fonts, and images with ToolsHub.',
  path: '/tools/pdf-to-word',
  keywords: [
    'pdf to word',
    'convert pdf to docx',
    'pdf editor',
    'editable pdf',
  ],
});

export default function PdfToWordLayout({ children }: { children: ReactNode }) {
  return children;
}
