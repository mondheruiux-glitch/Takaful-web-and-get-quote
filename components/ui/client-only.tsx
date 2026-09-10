'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  /** Height to reserve during SSR so layout doesn't shift. Defaults to 'auto'. */
  fallbackHeight?: string;
  className?: string;
}

/**
 * Renders `children` only on the client after hydration.
 * During SSR an invisible placeholder of the specified height is rendered so
 * page layout is preserved and the IntersectionObserver fires correctly after mount.
 */
export function ClientOnly({ children, fallbackHeight = 'auto', className }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        style={{ minHeight: fallbackHeight }}
        className={className}
      />
    );
  }

  return <>{children}</>;
}
