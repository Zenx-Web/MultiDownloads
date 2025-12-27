import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact ToolsHub | Support & Partnerships',
  description:
    'Reach the ToolsHub team for product questions, technical support, partnerships, or media inquiries. We reply to every message within 24 hours.',
  path: '/contact',
  keywords: ['toolshub contact', 'toolshub support', 'contact online tool'],
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
