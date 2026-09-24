import type { Metadata, Viewport } from 'next';
import { Inter, Barlow, Instrument_Serif } from 'next/font/google';
import NavProgress from '@/components/ui/nav-progress';
import './globals.css';

const getAppUrl = () => {
  try {
    if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) {
      return new URL(process.env.APP_URL).toString().replace(/\/$/, '');
    }
  } catch {
    // fallback
  }
  return 'https://takaful.com';
};

const APP_URL = getAppUrl();

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: ['400'],
  style: ['normal', 'italic'],
});

export const viewport: Viewport = {
  themeColor: '#00c685',
  colorScheme: 'light dark',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${barlow.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Theme: apply .dark class before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('takaful_dashboard_theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();` }} />

        {/* Preload critical LCP background images */}
        <link rel="preload" href="/home-hero/hero-bg.webp" as="image" type="image/webp" />
        <link rel="preload" href="/home-hero/bg-image-2.webp" as="image" type="image/webp" />

        {/* Preconnect for external images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
      </head>
      <body
        suppressHydrationWarning
        className="font-body antialiased"
      >
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
