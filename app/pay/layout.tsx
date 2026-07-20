import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activate Cover & Pay',
  description: 'Securely activate your Takaful home insurance cover.',
  robots: { index: false, follow: false },
};

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
