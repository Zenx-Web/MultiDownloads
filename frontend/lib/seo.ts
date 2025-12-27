import type { Metadata } from 'next';

const SITE_NAME = 'ToolsHub';
const DEFAULT_IMAGE = '/og-image.png';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://multidownload.in';

export type PageSeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
};

export const buildPageMetadata = ({ title, description, path, keywords = [], image }: PageSeoConfig): Metadata => {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const absoluteUrl = new URL(canonicalPath, BASE_URL).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath === '//' ? '/' : canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || DEFAULT_IMAGE],
    },
  };
};
