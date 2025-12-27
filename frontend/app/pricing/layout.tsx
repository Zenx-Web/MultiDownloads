import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Pricing Plans | Free & Premium ToolsHub Access',
  description:
    'Compare the free plan and premium subscription for ToolsHub. Unlock unlimited downloads, 4K quality, and priority support with Premium.',
  path: '/pricing',
  keywords: ['toolshub pricing', 'download premium plan', 'online tools subscription'],
});

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
