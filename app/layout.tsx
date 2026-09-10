import type { Metadata, Viewport } from 'next';
import './globals.css';

const APP_URL = process.env.APP_URL || 'https://takaful.com';

export const viewport: Viewport = {
  themeColor: '#00c685',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Takaful — Ethical Home Insurance',
    template: '%s | Takaful',
  },
  description:
    'Sharia-compliant, community-backed home protection. No interest, no hidden fees. Get an instant quote in under 2 minutes.',
  keywords: ['takaful', 'islamic home insurance', 'sharia compliant insurance', 'ethical insurance', 'halal insurance', 'home protection uk'],
  authors: [{ name: 'Takaful UK' }],
  creator: 'Takaful UK',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: APP_URL,
    siteName: 'Takaful',
    title: 'Takaful — Ethical Home Insurance',
    description: 'Community-backed, Sharia-compliant home cover. No interest, no hidden fees.',
    images: [{ url: '/brand/logo-takaful.svg', width: 1200, height: 630, alt: 'Takaful Home Insurance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Takaful — Ethical Home Insurance',
    description: 'Community-backed, Sharia-compliant home cover. No interest, no hidden fees.',
    images: ['/brand/logo-takaful.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Non-blocking font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts — non-blocking, font-display=swap prevents FOIT */}
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Preload critical LCP background images */}
        <link rel="preload" href="/home-hero/hero-bg.webp" as="image" type="image/webp" />
        <link rel="preload" href="/home-hero/bg-image-2.webp" as="image" type="image/webp" />

        {/* Preconnect for external images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
      </head>
      <body
        suppressHydrationWarning
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
