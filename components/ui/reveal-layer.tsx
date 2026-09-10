'use client';

import React, { useRef, useEffect } from 'react';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
  spotlightRadius?: number;
  opacity?: number;
}

/**
 * Cursor-following spotlight that reveals a second image through a soft circular mask.
 * Uses a hidden canvas to build a radial-gradient alpha mask, then applies it as
 * CSS mask-image on the reveal div.
 */
export function RevealLayer({ image, cursorX, cursorY, spotlightRadius = 240, opacity = 0.8 }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Resize canvas to match viewport
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Draw the mask on every cursor update
  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Build radial gradient: 100% solid inside the spotlight, smoothly feathered at the edge
    const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, spotlightRadius);
    grad.addColorStop(0, `rgba(255,255,255,${opacity})`);
    grad.addColorStop(0.75, `rgba(255,255,255,${opacity})`);
    grad.addColorStop(0.9, `rgba(255,255,255,${opacity * 0.5})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, spotlightRadius, 0, Math.PI * 2);
    ctx.fill();

    // Apply canvas as mask to reveal div
    const dataUrl = canvas.toDataURL();
    reveal.style.maskImage = `url(${dataUrl})`;
    reveal.style.webkitMaskImage = `url(${dataUrl})`;
    reveal.style.maskSize = '100% 100%';
    reveal.style.webkitMaskSize = '100% 100%';
    reveal.style.maskRepeat = 'no-repeat';
    reveal.style.webkitMaskRepeat = 'no-repeat';
  }, [cursorX, cursorY, spotlightRadius, opacity]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      {/* Revealed image with boosted brightness and clarity */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          filter: 'brightness(1.4) contrast(1.08) saturate(1.15)',
        }}
      />
      {/* Luminous ambient light on the spot to make it naturally illuminated */}
      {cursorX > -100 && (
        <div
          className="absolute inset-0 z-35 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle at ${cursorX}px ${cursorY}px, rgba(255,235,200,0.3) 0%, rgba(255,190,120,0.12) ${spotlightRadius * 0.6}px, transparent ${spotlightRadius}px)`,
          }}
        />
      )}
    </>
  );
}

export default RevealLayer;
