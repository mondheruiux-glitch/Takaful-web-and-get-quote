'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface Dot {
  x: number; y: number;
  targetOpacity: number; currentOpacity: number; opacitySpeed: number;
  baseRadius: number; currentRadius: number;
}

/**
 * DotCanvas — full-area animated green dot grid with mouse interaction.
 * Mount inside a `position: relative / fixed / absolute` container.
 * The canvas sizes itself to fill its parent element.
 */
export function DotCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const sizeRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const DOT_SPACING = 25;
  const BASE_MIN = 0.40;
  const BASE_MAX = 0.65;
  const BASE_R = 1.5;
  const INT_R = 150;
  const INT_R_SQ = INT_R * INT_R;
  const O_BOOST = 0.6;
  const R_BOOST = 2.5;
  const CELL = Math.max(50, Math.floor(INT_R / 1.5));

  const onMouseMove = useCallback((e: globalThis.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) { mouseRef.current = { x: null, y: null }; return; }
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const createDots = useCallback(() => {
    const { width, height } = sizeRef.current;
    if (!width || !height) return;
    const dots: Dot[] = [];
    const grid: Record<string, number[]> = {};
    for (let i = 0; i < Math.ceil(width / DOT_SPACING); i++) {
      for (let j = 0; j < Math.ceil(height / DOT_SPACING); j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const key = `${Math.floor(x / CELL)}_${Math.floor(y / CELL)}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(dots.length);
        const op = Math.random() * (BASE_MAX - BASE_MIN) + BASE_MIN;
        dots.push({
          x, y,
          targetOpacity: op, currentOpacity: op,
          opacitySpeed: Math.random() * 0.005 + 0.002,
          baseRadius: BASE_R, currentRadius: BASE_R,
        });
      }
    }
    dotsRef.current = dots;
    gridRef.current = grid;
  }, [DOT_SPACING, CELL, BASE_MIN, BASE_MAX, BASE_R]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = canvas.parentElement;
    const w = p ? p.clientWidth : window.innerWidth;
    const h = p ? p.clientHeight : window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { width: w, height: h };
      createDots();
    }
  }, [createDots]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = sizeRef.current;
    const { x: mx, y: my } = mouseRef.current;

    if (!ctx || !dots.length || !width) {
      rafId.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const active = new Set<number>();

    if (mx !== null && my !== null) {
      const cx = Math.floor(mx / CELL);
      const cy = Math.floor(my / CELL);
      const sr = Math.ceil(INT_R / CELL);
      for (let i = -sr; i <= sr; i++) {
        for (let j = -sr; j <= sr; j++) {
          const k = `${cx + i}_${cy + j}`;
          if (grid[k]) grid[k].forEach(d => active.add(d));
        }
      }
    }

    dots.forEach((dot, idx) => {
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_MIN, Math.min(dot.currentOpacity, BASE_MAX));
        dot.targetOpacity = Math.random() * (BASE_MAX - BASE_MIN) + BASE_MIN;
      }

      let factor = 0;
      dot.currentRadius = dot.baseRadius;

      if (mx !== null && my !== null && active.has(idx)) {
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dsq = dx * dx + dy * dy;
        if (dsq < INT_R_SQ) {
          const f = 1 - Math.sqrt(dsq) / INT_R;
          factor = f * f;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 198, 133, ${Math.min(1, dot.currentOpacity + factor * O_BOOST).toFixed(3)})`;
      dot.currentRadius = dot.baseRadius + factor * R_BOOST;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId.current = requestAnimationFrame(animate);
  }, [CELL, INT_R, INT_R_SQ, O_BOOST, R_BOOST, BASE_MIN, BASE_MAX]);

  useEffect(() => {
    handleResize();
    const onLeave = () => { mouseRef.current = { x: null, y: null }; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.documentElement.addEventListener('mouseleave', onLeave);
    rafId.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleResize, onMouseMove, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none${className ? ` ${className}` : ''}`}
    />
  );
}
