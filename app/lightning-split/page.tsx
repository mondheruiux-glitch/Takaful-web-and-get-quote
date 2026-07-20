'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

const BG_IMAGE_1 = '/bg-image-1.png';
const BG_IMAGE_2 = '/bg-image-2.png';
const SPOTLIGHT_R = 260;

const tooltipPeople = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  },
];

export default function DemoOne() {
  const revealRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });

  useEffect(() => {
    let rafId: number;

    const updateMask = (x: number, y: number) => {
      if (revealRef.current) {
        const mask = `radial-gradient(circle ${SPOTLIGHT_R}px at ${x}px ${y}px, black 0%, black 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, transparent 100%)`;
        revealRef.current.style.maskImage = mask;
        revealRef.current.style.webkitMaskImage = mask;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (smooth.current.x === -999) {
        smooth.current = { x: e.clientX, y: e.clientY };
        updateMask(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      if (smooth.current.x !== -999) {
        const dx = mouse.current.x - smooth.current.x;
        const dy = mouse.current.y - smooth.current.y;
        
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          smooth.current.x += dx * 0.1;
          smooth.current.y += dy * 0.1;
          updateMask(smooth.current.x, smooth.current.y);
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-black select-none">
      <section className="relative w-full overflow-hidden min-h-screen bg-black flex flex-col justify-between pt-[14%] pb-12 sm:pb-24 px-5 sm:px-10 md:px-14">
        
        {/* Layers */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom" 
          style={{ backgroundImage: `url('${BG_IMAGE_2}')` }} 
        />
        <div
          ref={revealRef}
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
          style={{
            backgroundImage: `url('${BG_IMAGE_1}')`,
            maskImage: `radial-gradient(circle 260px at -999px -999px, black 0%, black 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 260px at -999px -999px, black 0%, black 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, transparent 100%)`,
          }}
        />

        {/* Top Text content */}
        <div className="relative w-full flex flex-col items-center text-center pointer-events-none z-50 mb-12 sm:mb-0">
          <h1 className="leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-playfair italic font-normal tracking-tight">
            <span 
              className="block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Protect your home,
            </span>
            <span 
              className="block text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.05em', animationDelay: '0.42s' }}
            >
              protect your values.
            </span>
          </h1>
        </div>

        {/* Bottom Flex Container (Auto-Layout Row on desktop, Column on mobile) */}
        <div className="relative w-full flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-6 z-50 mt-auto">
          
          {/* Left card section */}
          <div 
            className="w-full md:w-[22rem] hero-anim hero-fade pointer-events-auto flex flex-col gap-4" 
            style={{ animationDelay: '0.7s' }}
          >
            <div className="flex items-center gap-3">
              <AnimatedTooltip items={tooltipPeople} className="mb-0" />
              <span className="text-white/90 text-sm font-medium ml-4">50K+ Happy Users</span>
            </div>
            
            <div className="flex items-center bg-white rounded-full p-1.5 shadow-xl shadow-black/10 w-full">
              <div className="pl-3 pr-2 text-gray-400">
                <MapPin size={18} strokeWidth={2} />
              </div>
              <input 
                type="text" 
                placeholder="Enter your postcode" 
                className="flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400/50 text-sm w-full font-medium"
              />
              <Link href="/signup" className="bg-[#62D2A2] hover:bg-[#4bbd8b] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#62D2A2]/30 shrink-0 flex items-center gap-1 pointer-events-auto">
                Get Quote
                <ChevronRight size={16} strokeWidth={2} />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#00c685] text-white rounded-full p-0.5 shadow-md">
                <Check size={12} strokeWidth={4} />
              </div>
              <span className="text-white/90 text-sm font-medium">No credit card required for quote</span>
            </div>
          </div>

          {/* Right card section */}
          <div 
            className="w-full md:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade pointer-events-auto"
            style={{ animationDelay: '0.85s' }}
          >
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Experience interest-free home protection that aligns with your principles. Fair pricing, community-backed security, and zero hidden fees.
            </p>
            <Link
              href="/signup"
              className="bg-[#62D2A2] hover:bg-[#4bbd8b] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#62D2A2]/30 pointer-events-auto cursor-pointer"
            >
              Start now
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
