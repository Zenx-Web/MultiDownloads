import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Word to PDF Converter | Turn DOCX into PDF',
  description:
    'Convert Word documents and Google Docs to polished, shareable PDF files in seconds using the ToolsHub word to PDF converter.',
  path: '/tools/word-to-pdf',
  keywords: [
    'word to pdf',
    'docx to pdf',
    'convert word online',
  ],
});

export default function WordToPdfLayout({ children }: { children: ReactNode }) {
  return children;
}
