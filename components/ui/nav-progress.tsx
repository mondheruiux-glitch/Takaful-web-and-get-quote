'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function NavProgressTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const trickleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (trickleIntervalRef.current) clearInterval(trickleIntervalRef.current);

    setVisible(true);
    setIsNavigating(true);
    setProgress(18);

    // Smooth trickle effect
    trickleIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          if (trickleIntervalRef.current) clearInterval(trickleIntervalRef.current);
          return 88;
        }
        const step = Math.max((88 - prev) * 0.12, 1.2);
        return Math.min(prev + step, 88);
      });
    }, 120);
  };

  const completeProgress = () => {
    if (trickleIntervalRef.current) clearInterval(trickleIntervalRef.current);
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setIsNavigating(false);
      timerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 180);
  };

  // Complete progress on route change
  useEffect(() => {
    if (isNavigating) {
      completeProgress();
    }
  }, [pathname, searchParams]);

  // Click interceptor for instant user feedback on every link click
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Ignore clicks with modifier keys or default prevented
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore hash-only links, protocols, or external targets
      if (
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      try {
        const nextUrl = new URL(target.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Ignore different origins
        if (nextUrl.origin !== currentUrl.origin) return;

        // Ignore same page clicks
        if (
          nextUrl.pathname === currentUrl.pathname &&
          nextUrl.search === currentUrl.search
        ) {
          return;
        }

        // Fire instantly!
        startProgress();
      } catch {
        // Fallback or invalid URL
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (trickleIntervalRef.current) clearInterval(trickleIntervalRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[2.5px] bg-transparent"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}
    >
      <div
        className="h-full bg-[#00c685]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 0
              ? 'none'
              : progress === 100
              ? 'width 140ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'width 240ms cubic-bezier(0.1, 0.7, 0.1, 1)',
          boxShadow: '0 0 10px #00c685, 0 0 4px #00c685',
        }}
      />
      {visible && progress < 100 && (
        <div
          className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/50 to-[#00c685] blur-[1px]"
          style={{
            left: `calc(${progress}% - 96px)`,
            transition: 'left 240ms cubic-bezier(0.1, 0.7, 0.1, 1)',
          }}
        />
      )}
    </div>
  );
}

export default function NavProgress() {
  return (
    <Suspense fallback={null}>
      <NavProgressTracker />
    </Suspense>
  );
}
