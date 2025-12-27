import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering to avoid build-time Supabase issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ToolsHub - Free Online Tools for Video Download, File Conversion & More',
  description:
    'ToolsHub offers 29+ free online tools including YouTube video downloader, Instagram downloader, PDF converter, image resizer, QR code generator, and more. No installation required. Convert videos, audio, images, and documents instantly.',
  keywords: [
    'free online tools',
    'video downloader',
    'youtube downloader',
    'instagram downloader',
    'facebook downloader',
    'tiktok downloader',
    'media converter',
    'video converter',
    'audio converter',
    'image converter',
    'pdf to word converter',
    'word to pdf converter',
    'image resizer',
    'image compressor',
    'qr code generator',
    'hash generator',
    'text formatter',
    'color palette extractor',
    'favicon generator',
    'video trimmer',
    'watermark tool',
    'background remover',
    'screenshot tool',
    'text to speech',
    'pdf merger',
    'pdf splitter',
    'thumbnail creator',
    'online tools',
    'free tools',
    'web tools',
  ],
  authors: [{ name: 'ToolsHub Team' }],
  creator: 'ToolsHub',
  publisher: 'ToolsHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multidownload.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ToolsHub - Free Online Tools for Video Download & File Conversion',
    description:
      'Access 29+ free online tools including video downloaders, file converters, image tools, PDF tools, and utility tools. Download from YouTube, Instagram, Facebook, TikTok. Convert any file format instantly.',
    url: 'https://multidownload.in',
    siteName: 'ToolsHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolsHub - Free Online Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolsHub - Free Online Tools for Video Download & File Conversion',
    description:
      '29+ free online tools including video downloaders, file converters, image tools, PDF tools, and more. No installation required.',
    images: ['/twitter-image.png'],
    creator: '@toolshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ToolsHub',
              url: 'https://multidownload.in',
              description:
                'Free online tools for video download, file conversion, image editing, PDF tools, and more. 29+ tools available instantly.',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'ToolsHub',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SubscriptionProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
