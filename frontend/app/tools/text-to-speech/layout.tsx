import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Text to Speech | Convert Text into Natural Audio',
  description:
    'Enter any text and generate natural-sounding speech in multiple voices and languages using the ToolsHub text-to-speech tool.',
  path: '/tools/text-to-speech',
  keywords: [
    'text to speech online',
    'tts generator',
    'text to mp3',
    'ai voice generator',
  ],
});

export default function TextToSpeechLayout({ children }: { children: ReactNode }) {
  return children;
}
