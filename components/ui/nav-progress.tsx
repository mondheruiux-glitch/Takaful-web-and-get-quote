'use client';

/**
 * NavProgress — slim top progress bar that fires on every Next.js route change.
 * Pure CSS animation, zero dependencies beyond React + next/navigation.
 * Shows a green loading bar at the top of the viewport during navigation.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ProgressBar({ running }: { running: boolean }) {
  return (
    <>
      <style>{`
        @keyframes nav-progress-indeterminate {
          0%   { transform: translateX(-100%) scaleX(0.3); }
          40%  { transform: translateX(-10%)  scaleX(0.6); }
          100% { transform: translateX(100%)  scaleX(0.3); }
        }
        .nav-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          z-index: 9999;
          pointer-events: none;
          background: #00c685;
          transform-origin: left center;
          will-change: opacity, transform;
          transition: opacity 300ms ease;
        }
        .nav-progress-bar.running {
          opacity: 1;
          animation: nav-progress-indeterminate 1.2s ease-in-out infinite;
        }
        .nav-progress-bar.done {
          opacity: 0;
          transform: translateX(0) scaleX(1);
          animation: none;
        }
      `}</style>
      <div className={`nav-progress-bar ${running ? 'running' : 'done'}`} />
    </>
  );
}

export function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [running, setRunning] = useState(false);
  const prevPathRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fire on pathname/searchParams change
  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (prevPathRef.current === null) {
      prevPathRef.current = current;
      return;
    }
    if (prevPathRef.current === current) return;

    prevPathRef.current = current;

    // Show bar
    setRunning(true);

    // Auto-hide after navigation settles
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setRunning(false);
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  return <ProgressBar running={running} />;
}
