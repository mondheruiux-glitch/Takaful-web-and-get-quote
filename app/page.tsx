'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Menu, MapPin, ChevronRight, ArrowRight, Check, Shield, Scale, Lock, Star, X, ChevronDown, Facebook, Twitter, Instagram, Linkedin, Users, PieChart, UserPlus, RefreshCcw, Building2, TrendingDown, PiggyBank, ArrowRightLeft, EyeOff, Percent, HeartHandshake, Gift, Leaf, Eye, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { PillBadge } from '@/components/ui/pill-badge';
import { cn } from '@/lib/utils';
import { RotatingText } from '@/components/ui/hero-section-nexus';
import { UKAddressAutocomplete } from '@/components/ui/uk-address-autocomplete';

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

// Critical above-the-fold components (eagerly loaded)
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Input } from '@/components/ui/input';
import { Component as LightningSplit } from '@/components/ui/lightning-split';

// Below-the-fold: lazy loaded to speed up initial paint
const Testimonial1 = dynamic(() => import('@/components/ui/testimonial-1'), { ssr: false });
const Features8 = dynamic(() => import('@/components/blocks/features-8').then(m => ({ default: m.Features8 })), { ssr: false });
const FeaturedSectionStats = dynamic(() => import('@/components/ui/featured-section-stats'), { ssr: false });
const StickyFeatureSection = dynamic(() => import('@/components/ui/sticky-scroll-cards-section').then(m => ({ default: m.StickyFeatureSection })), { ssr: false });
const HoverFooter = dynamic(() => import('@/components/ui/hover-footer-demo').then(m => ({ default: m.HoverFooter })), { ssr: false });

// Inline section fallback
const SectionFallback = () => <div className="h-48 bg-white animate-pulse" />;

const BG_IMAGE_1 = '/hero-bg.webp';
const BG_IMAGE_2 = '/bg-image-2.webp';
const SPOTLIGHT_R = 260;

function ScrollAwareNav({ hoveredSide }: { hoveredSide?: 'left' | 'right' | 'center' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Throttled scroll handler using requestAnimationFrame ────────────────────
  // Avoids forced layout reflow (getComputedStyle) on every scroll tick.
  // Sections that want to signal "dark background" should carry data-dark="true".
  useEffect(() => {
    let rafId: number | null = null;

    const checkScroll = () => {
      const isInitialDark = window.scrollY <= window.innerHeight * 0.7;

      // Use data-dark attribute instead of getComputedStyle — no forced reflow
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-dark="true"]')
      );
      let isOverlappingDark = false;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom >= 20) {
          isOverlappingDark = true;
          break;
        }
      }

      setScrolled(!isInitialDark && !isOverlappingDark);
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;           // already scheduled — skip
      rafId = requestAnimationFrame(checkScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    checkScroll();                          // run once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);


  const onDark = !scrolled && hoveredSide !== 'left';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Compare Plans', href: '/compare-plans' },
    { label: 'About Us', href: '/about' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-500`}
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <img
              src={onDark ? "/logo-light.png" : "/logo-dark.png"}
              alt="Takaful Logo"
              className="h-6 transition-all duration-500 cursor-pointer"
            />
          </Link>
        </div>

        <div
          className={`hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-2 items-center gap-1 transition-all duration-500 ${onDark
              ? 'bg-white/20 backdrop-blur-md border border-white/30 shadow-sm'
              : 'bg-gray-100/80 border border-gray-200'
            }`}
        >
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${i === 0
                  ? onDark ? 'bg-white/20 text-white' : 'bg-white text-gray-900 shadow-sm'
                  : onDark
                    ? 'text-white/80 hover:bg-white/30 hover:text-white'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={`hidden md:block text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-300 ${onDark
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
              }`}
          >
            Dashboard
          </Link>
          <Link
            href="/signup"
            className={`hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${onDark
                ? 'bg-white text-gray-900 hover:bg-gray-50'
                : 'bg-[#00c685] text-white hover:bg-[#00a871]'
              }`}
          >
            Sign Up
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden p-2 transition-colors ${onDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-black/5'} rounded-full`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop & Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-6 mt-12">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-dark.png" alt="Takaful Logo" className="h-6" />
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-[#00c685] hover:bg-[#00a871] text-white font-bold rounded-full transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold rounded-full transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeroSection({ onSideChange, hoveredSide }: { onSideChange?: (side: 'left' | 'right' | 'center') => void; hoveredSide?: 'left' | 'right' | 'center' }) {
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
          <h1 
            className="leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-playfair italic font-normal tracking-tight flex flex-col items-center"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
          >
            <span 
              className="block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Protect Your Home,
            </span>
            <span 
              className="inline-block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.05em', animationDelay: '0.42s', color: GREEN }}
            >
              <RotatingText
                texts={['Confidently.', 'Securely.', 'Ethically.', 'Digitally.']}
                mainClassName="text-[#00c685] transition-colors duration-500"
                staggerFrom="last"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                staggerDuration={0.015}
                transition={{ type: "spring", damping: 18, stiffness: 250 }}
                rotationInterval={2200}
                splitBy="characters"
                auto={true}
                loop={true}
              />
            </span>
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
              <AnimatedTooltip items={tooltipPeople} className="mb-0" />
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

// Dynamic import of framer-motion for the Comparison section
import { motion } from 'framer-motion';

// Inline imports for sections defined in this file


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const Comparison = () => {
  const [sliderPct, setSliderPct] = React.useState(50);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const updateSlider = React.useCallback((clientX: number) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updateSlider(e.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [updateSlider]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">

        {/* ── Section header — one focal point, F-scan front-loaded ── */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="Side by Side" className="mb-5" />
          </motion.div>
          {/* H2 at ≥2.5× body (body=16px → H2≥40px). Tight display tracking per principle #9 */}
          <motion.h2 variants={itemVariants} className="text-[clamp(2.2rem,1.2rem+3vw,3.2rem)] font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            Conventional <span className="text-[#00c685] font-playfair not-italic font-normal">vs</span> Takaful
          </motion.h2>
          {/* Body muted, not shrunk — principle #2 scale-based emphasis */}
          <motion.p variants={itemVariants} className="text-[clamp(1rem,0.9rem+0.3vw,1.125rem)] text-gray-500 leading-[1.65] max-w-[65ch] mx-auto">
            See the difference a community-first approach makes — drag the slider to compare.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* ── Outer card ── */}
          <motion.div
            className="p-3 rounded-[2rem] bg-neutral-100 border border-neutral-200 shadow-2xl shadow-black/10"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            {/* ── Inner viewport ── */}
            <div
              className="relative rounded-[1.4rem] overflow-hidden select-none h-[940px] md:h-[720px]"
              style={{ cursor: 'col-resize' }}
            >
              {/* Mac titlebar */}
              <div className="absolute top-0 left-0 right-0 z-50 flex items-center gap-1.5 px-4 h-10 bg-[#161720] border-b border-white/[0.06] pointer-events-none">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="absolute left-1/2 -translate-x-1/2 text-white/20 text-[11px] font-mono tracking-[0.12em]">comparison.takaful.app</span>
              </div>

              {/* ────────────────── BEFORE — Conventional ────────────────── */}
              <div
                ref={boxRef}
                className="absolute inset-0 bg-[#13141f] flex flex-col items-center justify-start pt-16 pb-6"
                onMouseDown={(e) => { dragging.current = true; updateSlider(e.clientX); }}
                onTouchMove={(e) => updateSlider(e.touches[0].clientX)}
              >
                {/* Subtle red ambient */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-[#ff5555] rounded-full blur-[140px] opacity-5 pointer-events-none" />

                <div className="w-full max-w-[900px] px-4 sm:px-8 flex flex-col items-center">
                  {/* Panel identity badge */}
                  <div className="inline-flex items-center gap-2 border border-[#ff5555]/20 rounded-full px-4 py-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#ff5555] animate-pulse" />
                    <span className="text-[#ff5555] text-[11px] font-bold tracking-[0.12em] uppercase">Conventional</span>
                  </div>

                  {/* Panel title — H3 ≥1.5× body */}
                  <p className="text-white text-[1.35rem] font-bold tracking-[-0.02em] leading-tight mb-1">Traditional Insurance</p>
                  <p className="text-[#6272a4] text-[0.8rem] mb-4 leading-[1.6]">Profit-driven. Shareholders before people.</p>

                  {/* Score bar — visual focal point */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff5555]/80 to-[#ff5555]/40 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '35%' }}
                      transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6272a4] font-mono mb-4 w-full">
                    <span>Community Score</span><span className="text-[#ff5555] font-semibold">35 / 100</span>
                  </div>

                  {/* Keyword tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    {['Opaque', 'Interest-based', 'Profit-first'].map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold text-[#ff5555] border border-[#ff5555]/20 rounded-full px-3 py-1 tracking-wide">{tag}</span>
                    ))}
                  </div>

                  {/* Conventional Grid Features */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full text-left">
                    {[
                      { title: 'Profit-driven Company', desc: 'Maximising shareholder returns is the primary goal.', icon: Building2, status: "Shareholder", tags: ["Profit"] },
                      { title: 'Investment Uncertainty', desc: 'Funds may be placed in non-halal, high-risk assets.', icon: TrendingDown, status: "Non-halal", tags: ["Assets"] },
                      { title: 'Company keeps surplus', desc: 'Unused premiums become the insurer\'s profit.', icon: PiggyBank, status: "Surplus", tags: ["Retained"] },
                      { title: 'Risk fully transferred', desc: 'You pay to hand the risk over — no shared stake.', icon: ArrowRightLeft, status: "Transferred", tags: ["No-share"] },
                      { title: 'No fund visibility', desc: 'No insight into how your premiums are deployed.', icon: EyeOff, status: "Opaque", tags: ["Hidden"] },
                      { title: 'Interest-based returns', desc: 'Investments regularly involve ribā/interest.', icon: Percent, status: "Riba", tags: ["Interest"] },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.05 * i }}
                        viewport={{ once: true }}
                        className={cn(
                          "group relative p-3 rounded-xl overflow-hidden transition-all duration-300",
                          "border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
                          "hover:shadow-[0_2px_12px_rgba(255,85,85,0.03)]",
                          "hover:-translate-y-0.5 will-change-transform col-span-1"
                        )}
                      >
                        {/* Dot grid bg on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,85,85,0.03)_1px,transparent_1px)] bg-[length:4px_4px]" />
                        </div>

                        <div className="relative flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#ff5555]/10 group-hover:border-[#ff5555]/20 transition-all duration-300">
                              <item.icon size={14} className="text-white/60 group-hover:text-[#ff5555] transition-colors" />
                            </div>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-gray-400 group-hover:bg-[#ff5555]/10 group-hover:text-[#ff5555] transition-colors">
                              {item.status}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="font-semibold text-white tracking-tight text-[12px]">
                              {item.title}
                            </h3>
                            <p className="text-[10px] text-[#6272a4] leading-snug group-hover:text-gray-300 transition-colors">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/5">
                            <div className="flex items-center space-x-1">
                              {item.tags?.map((tag, tIdx) => (
                                <span key={tIdx} className="text-[8px] px-1 rounded bg-white/5 text-[#6272a4] group-hover:bg-[#ff5555]/5 group-hover:text-[#ff5555] transition-colors">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[8px] text-[#ff5555] opacity-0 group-hover:opacity-100 transition-opacity">
                              Risk ✕
                            </span>
                          </div>
                        </div>

                        {/* Outer glowing border outline */}
                        <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/5 to-transparent group-hover:via-[#ff5555]/10 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ────────────────── AFTER — Takaful ────────────────── */}
              <div
                className="absolute inset-0 bg-[#0a1109] flex flex-col items-center justify-start pt-16 pb-6"
                style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
              >
                {/* Ambient green glow — two layers for depth */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c685] rounded-full blur-[140px] opacity-[0.08] pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-56 h-56 bg-[#62D2A2] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />

                <div className="w-full max-w-[900px] px-4 sm:px-8 flex flex-col items-center relative z-10">
                  {/* Panel identity badge */}
                  <div className="inline-flex items-center gap-2 border border-[#00c685]/25 rounded-full px-4 py-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#00c685] animate-pulse" />
                    <span className="text-[#00c685] text-[11px] font-bold tracking-[0.12em] uppercase">Takaful</span>
                  </div>

                  {/* Logo as title focal point */}
                  <img src="/logo-light.png" alt="Takaful" className="h-7 mb-1" />
                  <p className="text-[#4d7a5e] text-[0.8rem] mb-4 leading-[1.6]">Community-first. Built on Islamic principles.</p>

                  {/* Score bar */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00c685] to-[#62D2A2] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '96%' }}
                      transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#4d7a5e] font-mono mb-4 w-full">
                    <span>Community Score</span><span className="text-[#00c685] font-semibold">96 / 100</span>
                  </div>

                  {/* Keyword tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    {['Transparent', 'Interest-free', 'Community'].map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold text-[#00c685] border border-[#00c685]/25 rounded-full px-3 py-1 tracking-wide">{tag}</span>
                    ))}
                  </div>

                  {/* Bento Grid Features */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full text-left">
                    {[
                      { title: 'Mutual Risk Sharing', desc: 'Members protect each other collectively.', icon: Users, status: "Active", tags: ["Community"] },
                      { title: 'Community Fund', desc: 'Pool belongs to participants, not a company.', icon: HeartHandshake, status: "Ethical", tags: ["Fund"] },
                      { title: 'Surplus Return', desc: 'Unused funds returned to members.', icon: Gift, status: "Refund", tags: ["Surplus"] },
                      { title: 'Ethical Sharia', desc: 'Halal-screened assets and investments.', icon: Leaf, status: "Halal", tags: ["Compliance"] },
                      { title: 'Full Visibility', desc: 'Real-time clarity on pool health.', icon: Eye, status: "Transparent", tags: ["Audit"] },
                      { title: 'Zero Interest', desc: 'Strictly ribā-free and certified.', icon: ShieldCheck, status: "Certified", tags: ["Riba-free"] },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.05 * i }}
                        viewport={{ once: true }}
                        className={cn(
                          "group relative p-3 rounded-xl overflow-hidden transition-all duration-300",
                          "border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
                          "hover:shadow-[0_2px_12px_rgba(0,198,133,0.04)]",
                          "hover:-translate-y-0.5 will-change-transform col-span-1"
                        )}
                      >
                        {/* Dot grid bg on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,198,133,0.03)_1px,transparent_1px)] bg-[length:4px_4px]" />
                        </div>

                        <div className="relative flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#00c685]/10 group-hover:border-[#00c685]/20 transition-all duration-300">
                              <item.icon size={14} className="text-white/60 group-hover:text-[#00c685] transition-colors" />
                            </div>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-[#4d7a5e] group-hover:bg-[#00c685]/10 group-hover:text-[#00c685] transition-colors">
                              {item.status}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="font-semibold text-white tracking-tight text-[12px]">
                              {item.title}
                            </h3>
                            <p className="text-[10px] text-[#4d7a5e] leading-snug group-hover:text-gray-400 transition-colors">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/5">
                            <div className="flex items-center space-x-1">
                              {item.tags?.map((tag, tIdx) => (
                                <span key={tIdx} className="text-[8px] px-1 rounded bg-white/5 text-[#4d7a5e] group-hover:bg-[#00c685]/5 group-hover:text-[#00c685] transition-colors">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[8px] text-[#00c685] opacity-0 group-hover:opacity-100 transition-opacity">
                              Verify →
                            </span>
                          </div>
                        </div>

                        {/* Outer glowing border outline */}
                        <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/5 to-transparent group-hover:via-[#00c685]/10 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Divider & handle ── */}
              <div
                className="absolute top-0 bottom-0 z-40 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPct}%`, transform: 'translateX(-50%)' }}
              >
                {/* Line */}
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#00c685]/60 to-transparent" />
                {/* Glow halos */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-gradient-to-r from-[#00c685]/25 via-transparent to-transparent [mask-image:radial-gradient(80px_at_left,white,transparent)]" />
                {/* Handle — 44×44 tap target (principle #4), 5 states via CSS group */}
                <div className="absolute w-10 h-10 rounded-full bg-white shadow-xl shadow-[#00c685]/25 border border-[#00c685]/40 flex items-center justify-center gap-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#00c685]" aria-hidden="true">
                    <path d="M9 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Corner labels */}
              <div className="absolute bottom-4 left-5 z-30 pointer-events-none">
                <span className="text-[#6272a4] text-[10px] font-mono tracking-wide">← conventional</span>
              </div>
              <div className="absolute bottom-4 right-5 z-30 pointer-events-none">
                <span className="text-[#00c685] text-[10px] font-mono tracking-wide">takaful →</span>
              </div>
            </div>
          </motion.div>

          {/* Hint */}
          <p className="text-center text-gray-400 text-[11px] mt-3 mb-10 font-mono tracking-[0.08em]">// drag left or right to compare</p>

          {/* Button to Compare Plans */}
          <div className="text-center">
            <Link
              href="/compare-plans"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold text-sm shadow-[0_4px_20px_rgba(0,198,133,0.25)] hover:shadow-[0_4px_25px_rgba(0,198,133,0.4)] transition-all hover:scale-105"
            >
              Compare Detailed Plans <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};




const Waitlist = () => (
  <section className="bg-[#0a1a14]">
    <div className="h-[40rem] w-full relative flex flex-col items-center justify-center antialiased overflow-hidden">
      <motion.div
        className="max-w-2xl mx-auto p-4 z-10 text-center"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants}>
          <PillBadge text="Coming Soon" className="mb-6" dark />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-playfair italic font-normal mb-4 tracking-tight">
          Join the Takaful Waitlist
        </motion.h2>
        <motion.p variants={itemVariants} className="text-neutral-400 max-w-lg mx-auto my-4 text-base leading-relaxed">
          Be among the first to experience a fairer, community-driven approach to protection. Sign up to get early access and exclusive updates as we prepare to launch.
        </motion.p>
        <motion.div variants={itemVariants} className="flex w-full max-w-md mx-auto items-center space-x-2 mt-8">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-[#00c685] rounded-full px-5"
          />
          <button className="bg-[#00c685] hover:bg-[#00a871] text-white px-8 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00c685]/20 text-sm h-10 shrink-0">
            Join
          </button>
        </motion.div>
      </motion.div>
      <BackgroundBeams />
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const questions = [
    { q: "What is Takaful?", a: "Takaful is a co-operative system of reimbursement or repayment in case of loss, organized as an Islamic or sharia compliant alternative to conventional insurance." },
    { q: "How does it differ from conventional insurance?", a: "Conventional insurance involves risk transfer and uncertainty (gharar), while Takaful is based on shared risk and mutual assistance, with transparent pooling of funds." },
    { q: "Is it Sharia-compliant?", a: "Yes, our Takaful model is strictly overseen by Sharia scholars to ensure all operations, investments, and rules comply with Islamic financial principles." },
    { q: "When will it be available?", a: "We are currently finalizing regulatory approvals and plan to launch in the UK very soon. Join our waitlist to be the first to know." },
    { q: "How are claims handled?", a: "Claims are assessed and paid directly from the participant's fund. We manage the process transparently, ensuring fairness for all community members." }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-5">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="FAQ" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-6 tracking-tight">
            We're here to answer all your questions
          </motion.h2>
        </motion.div>



        <div className="space-y-4">
          {questions.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-gray-900 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 bg-[#00c685]/10 text-[#00c685]' : 'text-gray-500'}`}>
                  <ChevronDown size={18} />
                </div>
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | 'center'>('center');
  return (
    <main className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ScrollAwareNav hoveredSide={hoveredSide} />
      <HeroSection onSideChange={setHoveredSide} hoveredSide={hoveredSide} />
      <Suspense fallback={<SectionFallback />}>
        <Testimonial1 />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Features8 />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedSectionStats />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <StickyFeatureSection />
      </Suspense>
      <Comparison />
      <Waitlist />
      <FAQ />
      <Suspense fallback={<SectionFallback />}>
        <HoverFooter />
      </Suspense>
    </main>
  );
}
