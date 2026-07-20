import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: 'Get an instant Sharia-compliant home insurance quote. Takes under 2 minutes.',
  robots: { index: false, follow: false },
};

export default function GetQuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
