'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import FadeThrough from '@/components/ui/fade-through';
import { UKAddressAutocomplete } from '@/components/ui/uk-address-autocomplete';
import { Component as LightningSplit } from '@/components/ui/lightning-split';

export const tooltipPeopleBackup = [
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

export interface HeroSectionBackupProps {
  onSideChange?: (side: 'left' | 'right' | 'center') => void;
  hoveredSide?: 'left' | 'right' | 'center';
}

/**
 * ORIGINAL HERO SECTION BACKUP
 * Saved on: 2026-09-08
 * Contains the LightningSplit background slider with dynamic headline FadeThrough,
 * UKAddressAutocomplete, Tooltip avatars, and CTA buttons.
 */
export function HeroSectionBackup({ onSideChange, hoveredSide }: HeroSectionBackupProps) {
  const GREEN = '#00c685';

  return (
    <section 
      data-dark="true"
      className="relative w-full overflow-hidden min-h-screen bg-black flex flex-col justify-between pt-[8%] pb-12 sm:pb-24 px-5 sm:px-10 md:px-14">
      {/* Background Layer (Lightning Split Image Slider) */}
      <div className="absolute inset-0 z-0">
        <LightningSplit onSideChange={onSideChange} />
      </div>

      {/* Foreground Hero Overlay (Text content & Action panels) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pt-28 sm:pt-32 md:pt-36 lg:pt-[8%] pb-12 sm:pb-24 px-5 sm:px-10 md:px-14">
        
        {/* Top Text content */}
        <div className="relative w-full flex flex-col items-center text-center pointer-events-none z-50 mb-12 sm:mb-0">
          <h1 className="leading-[1.05] font-heading font-normal tracking-tight flex flex-col items-center select-none">
            <span 
              className="block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/80" 
              style={{ letterSpacing: '-0.03em', animationDelay: '0.2s' }}
            >
              Protect Your Home,
            </span>
            <div 
              className="inline-flex justify-center items-center text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal mt-1 sm:mt-2" 
              style={{ letterSpacing: '-0.03em', animationDelay: '0.35s' }}
            >
              <FadeThrough
                phrases={['Confidently.', 'Securely.', 'Ethically.', 'Digitally.']}
                className="text-5xl sm:text-7xl md:text-8xl font-heading font-normal tracking-tight text-center justify-center"
                innerClassName="bg-gradient-to-r from-[#00c685] via-[#2ee6a8] to-[#6ee7b7] text-transparent bg-clip-text px-3 py-0.5 inline-block drop-shadow-[0_2px_24px_rgba(0,198,133,0.35)]"
                interval={2800}
              />
            </div>
          </h1>
        </div>

        {/* Bottom Flex Container (Auto-Layout Row on desktop, Column on mobile) */}
        <div className="relative w-full flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-6 z-50 mt-auto">
          
          {/* Left card section */}
          <div 
            className="w-full md:w-[22rem] hero-anim hero-fade pointer-events-auto flex flex-col gap-4 order-2 md:order-1" 
            style={{ animationDelay: '0.7s' }}
          >
            <div className="flex items-center gap-3">
              <AnimatedTooltip items={tooltipPeopleBackup} className="mb-0" />
              <span className="text-white/90 text-sm font-medium ml-4">50K+ Happy Users</span>
            </div>

            <UKAddressAutocomplete />

            <div className="flex items-center gap-2">
              <div className="bg-[#00c685] text-white rounded-full p-0.5 shadow-md">
                <Check size={12} strokeWidth={4} />
              </div>
              <span className="text-white/90 text-sm font-medium">No credit card required for quote</span>
            </div>
          </div>

          {/* Right card section */}
          <div 
            className="w-full md:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade pointer-events-auto order-1 md:order-2"
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
      </div>
    </section>
  );
}

export default HeroSectionBackup;
