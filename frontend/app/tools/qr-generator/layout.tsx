import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'QR Code Generator | Create Custom QR Codes',
  description:
    'Create QR codes for URLs, text, contact info, Wi-Fi passwords, and more. Customize colors and download PNG/SVG files instantly.',
  path: '/tools/qr-generator',
  keywords: [
    'qr code generator',
    'create qr online',
    'wifi qr code',
    'custom qr maker',
  ],
});

export default function QrGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}
