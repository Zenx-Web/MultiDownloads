import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Audio Converter | Convert MP3, WAV, AAC, FLAC, OGG',
  description:
    'Convert any audio file to MP3, WAV, AAC, FLAC, or OGG, control bitrate, and process media quickly in your browser with the ToolsHub audio converter.',
  path: '/tools/audio-converter',
  keywords: [
    'audio converter online',
    'mp3 converter',
    'wav to mp3',
    'flac converter',
    'audio bitrate changer',
  ],
});

export default function AudioConverterLayout({ children }: { children: ReactNode }) {
  return children;
}
