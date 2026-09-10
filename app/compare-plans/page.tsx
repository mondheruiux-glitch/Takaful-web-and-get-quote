'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import NumberFlow from '@number-flow/react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Check, X, Info, Menu, Award, RefreshCw, HeartHandshake,
  Building, Home, Key, ChevronDown,
  ArrowRight, ShieldCheck, Wrench, DollarSign, ExternalLink,
  Gift, Eye, Users, Leaf, ChevronRight, Star, CircleCheck,
  Building2, TrendingDown, PiggyBank, ArrowRightLeft, EyeOff, Percent
} from 'lucide-react';
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { PillBadge } from '@/components/ui/pill-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  PricingTable,
  PricingTableHeader,
  PricingTableBody,
  PricingTableRow,
  PricingTableCell,
  PricingTableHead,
  PricingTablePlan
} from '@/components/ui/pricing-table';
import { cn } from '@/lib/utils';

// ─── ANIMATED DOT GRID (same as how-it-works hero) ────────────────────────────
interface Dot {
  x: number; y: number;
  targetOpacity: number; currentOpacity: number; opacitySpeed: number;
  baseRadius: number; currentRadius: number;
}

function DotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const sizeRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const DOT_SPACING = 25, BASE_MIN = 0.40, BASE_MAX = 0.65, BASE_R = 1.5;
  const INT_R = 150, INT_R_SQ = INT_R * INT_R, O_BOOST = 0.6, R_BOOST = 2.5;
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
    const dots: Dot[] = [], grid: Record<string, number[]> = {};
    for (let i = 0; i < Math.ceil(width / DOT_SPACING); i++) {
      for (let j = 0; j < Math.ceil(height / DOT_SPACING); j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const key = `${Math.floor(x / CELL)}_${Math.floor(y / CELL)}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(dots.length);
        const op = Math.random() * (BASE_MAX - BASE_MIN) + BASE_MIN;
        dots.push({ x, y, targetOpacity: op, currentOpacity: op, opacitySpeed: Math.random() * 0.005 + 0.002, baseRadius: BASE_R, currentRadius: BASE_R });
      }
    }
    dotsRef.current = dots; gridRef.current = grid;
  }, [DOT_SPACING, CELL, BASE_MIN, BASE_MAX, BASE_R]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const p = canvas.parentElement;
    const w = p ? p.clientWidth : window.innerWidth;
    const h = p ? p.clientHeight : window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      sizeRef.current = { width: w, height: h };
      createDots();
    }
  }, [createDots]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current; const grid = gridRef.current;
    const { width, height } = sizeRef.current;
    const { x: mx, y: my } = mouseRef.current;
    if (!ctx || !dots.length || !width) { rafId.current = requestAnimationFrame(animate); return; }
    ctx.clearRect(0, 0, width, height);
    const active = new Set<number>();
    if (mx !== null && my !== null) {
      const cx = Math.floor(mx / CELL), cy = Math.floor(my / CELL), sr = Math.ceil(INT_R / CELL);
      for (let i = -sr; i <= sr; i++) for (let j = -sr; j <= sr; j++) { const k = `${cx + i}_${cy + j}`; if (grid[k]) grid[k].forEach(d => active.add(d)); }
    }
    dots.forEach((dot, idx) => {
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_MIN, Math.min(dot.currentOpacity, BASE_MAX));
        dot.targetOpacity = Math.random() * (BASE_MAX - BASE_MIN) + BASE_MIN;
      }
      let factor = 0; dot.currentRadius = dot.baseRadius;
      if (mx !== null && my !== null && active.has(idx)) {
        const dx = dot.x - mx, dy = dot.y - my, dsq = dx * dx + dy * dy;
        if (dsq < INT_R_SQ) { const f = 1 - Math.sqrt(dsq) / INT_R; factor = f * f; }
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

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />;
}

// Lazy loaded
const BackgroundBeams = dynamic(
  () => import('@/components/ui/background-beams').then((m) => ({ default: m.BackgroundBeams })),
  { ssr: false }
);
const HoverFooter = dynamic(
  () => import('@/components/ui/hover-footer-demo').then((m) => ({ default: m.HoverFooter })),
  { ssr: false }
);
const ShaderAnimation = dynamic(
  () => import('@/components/ui/shader-animation').then((m) => m.ShaderAnimation),
  { ssr: false }
);

// ─── ANIMATION VARIANTS (matching homepage) ────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────
type HomeType = 'apartment' | 'villa' | 'renter';

const PLAN_TIERS = [
  {
    id: 'basic' as const,
    name: 'Basic Shield',
    tagline: 'Essential Sharia-compliant protection for peace of mind.',
    basePrice: { apartment: 16, villa: 26, renter: 11 },
    popular: false,
    color: 'border-white/10',
    accentColor: 'text-white/60',
  },
  {
    id: 'comfort' as const,
    name: 'Home Comfort',
    badge: 'Most Popular',
    tagline: 'Comprehensive mutual cover with enhanced emergency limits.',
    basePrice: { apartment: 32, villa: 48, renter: 22 },
    popular: true,
    color: 'border-[#00c685]/60',
    accentColor: 'text-[#00c685]',
  },
  {
    id: 'executive' as const,
    name: 'Executive',
    badge: 'Luxury Suite',
    tagline: 'Full-suite high-value coverage with zero excess.',
    basePrice: { apartment: 56, villa: 82, renter: 42 },
    popular: false,
    color: 'border-amber-400/30',
    accentColor: 'text-amber-400',
  },
];

const MATRIX_DATA = [
  {
    category: 'Property & Structure',
    icon: Building,
    rows: [
      { feature: 'Buildings Cover Limit', tooltip: 'Covers structure, walls, roof, and permanent fixtures.', basic: 'Up to £200,000', comfort: 'Up to £500,000', executive: 'Up to £1,500,000' },
      { feature: 'Contents & Belongings', tooltip: 'Furniture, appliances, electronics, and personal items.', basic: 'Up to £25,000', comfort: 'Up to £75,000', executive: 'Up to £200,000' },
      { feature: 'Accidental Damage', tooltip: 'Unintentional mishaps like spilled liquids or broken glass.', basic: 'Fixtures Only', comfort: 'Full Cover', executive: 'Full + Tech Devices' },
      { feature: 'Natural Disasters & Perils', tooltip: 'Storm, Flood, Subsidence, Fire, Burst Pipes.', basic: true, comfort: true, executive: true },
      { feature: 'High-Value Single Items', tooltip: 'Jewellery, fine art, high-end electronics.', basic: 'Up to £1,500', comfort: 'Up to £5,000', executive: 'Up to £20,000' },
    ],
  },
  {
    category: 'Takaful & Sharia',
    icon: ShieldCheck,
    rows: [
      { feature: 'Tabarru\' Mutual Fund', tooltip: 'Contribution pooled as mutual donation for community members in need.', basic: '100% Halal Pool', comfort: '100% Halal Pool', executive: '100% Halal Pool' },
      { feature: 'Annual Surplus Refund', tooltip: 'Unspent mutual fund reserves returned to policyholders.', basic: 'Standard Rate', comfort: '+15% Bonus Weight', executive: '+30% Bonus Weight' },
      { feature: 'Sharia Board Certified', tooltip: 'Independently audited and certified to AAOIFI standards.', basic: true, comfort: true, executive: true },
      { feature: 'Riba-Free Investments', tooltip: 'Reserves invested in Sharia-compliant Sukuk and ethical assets only.', basic: true, comfort: true, executive: true },
    ],
  },
  {
    category: '24/7 Emergency Services',
    icon: Wrench,
    rows: [
      { feature: 'Emergency Locksmith', tooltip: 'Immediate dispatch for lost keys or broken locks.', basic: true, comfort: true, executive: true },
      { feature: 'Plumbing & Drainage', tooltip: 'Rapid response for leaks, blocked drains, or burst pipes.', basic: 'Up to £500', comfort: 'Up to £1,000', executive: 'Unlimited' },
      { feature: 'Alternative Accommodation', tooltip: 'Hotel cover if your home becomes uninhabitable.', basic: 'Up to £10,000', comfort: 'Up to £30,000', executive: 'Up to £100,000' },
      { feature: 'Boiler & Heating Cover', tooltip: 'Emergency repair for boiler breakdown in winter.', basic: false, comfort: true, executive: true },
    ],
  },
  {
    category: 'Excess & Claims',
    icon: DollarSign,
    rows: [
      { feature: 'Standard Excess', tooltip: 'Amount you pay when making a claim.', basic: '£250', comfort: '£100', executive: '£0 Zero Excess' },
      { feature: 'Digital Claim Approval', tooltip: 'AI-assisted automated verification with rapid payouts.', basic: '48 hrs', comfort: '< 24 hrs', executive: 'Concierge < 4 hrs' },
      { feature: 'Dedicated Claims Manager', tooltip: 'Personal 1-on-1 specialist throughout your claim.', basic: false, comfort: true, executive: 'Concierge Team' },
    ],
  },
];

const FAQS = [
  { q: 'How does Takaful differ from conventional insurance?', a: "Unlike conventional insurance where you pay premiums to a profit-seeking corporation, Takaful operates on a cooperative mutual model. Your contribution goes into a shared community pool (Tabarru') used solely to pay claims for members in need. Any unspent surplus is distributed back to policyholders rather than retained as corporate profit." },
  { q: 'What is the Surplus Refund and how do I receive it?', a: "At year-end, an independent audit calculates total claims paid versus contributions received. If the mutual pool has excess funds after reserving required balances, the surplus is refunded back to members as direct cashback or renewal discounts." },
  { q: 'Is Takaful certified by recognised Islamic scholars?', a: 'Yes. All financial structures, Wakalah fees, and underwriting pools are audited and approved by our independent Sharia Supervisory Board in compliance with AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) standards.' },
  { q: 'Can I switch from my current conventional insurer?', a: 'Absolutely. Switching is seamless. Select a cover start date aligned to your existing policy expiration. We provide a hassle-free cancellation guide for your previous insurer at no extra charge.' },
];

// ─── NAV (exact match to homepage) ────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onDark = !scrolled;
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
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-500">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img
              src={onDark ? '/brand/logo-light.png' : '/brand/logo-dark.png'}
              alt="Takaful Logo"
              className="h-6 transition-all duration-500 cursor-pointer"
            />
          </Link>
        </div>

        <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-2 items-center gap-1 transition-all duration-500 ${onDark ? 'bg-white/20 backdrop-blur-md border border-white/30 shadow-sm' : 'bg-gray-100/80 border border-gray-200'}`}>
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${i === 2
                ? onDark ? 'bg-white/20 text-white font-semibold' : 'bg-white text-gray-900 shadow-sm font-semibold'
                : onDark ? 'text-white/80 hover:bg-white/30 hover:text-white' : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={`hidden md:block text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-300 ${onDark ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}
          >
            Dashboard
          </Link>
          <Link
            href="/signup"
            className={`hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${onDark ? 'bg-white text-gray-900 hover:bg-gray-50' : 'bg-[#00c685] text-white hover:bg-[#00a871]'}`}
          >
            Sign Up
          </Link>
          <button onClick={() => setMobileMenuOpen(true)} className={`md:hidden p-2 transition-colors ${onDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-black/5'} rounded-full`}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
              <X size={24} />
            </button>
            <div className="flex flex-col gap-6 mt-12">
              <img src="/brand/logo-dark.png" alt="Takaful Logo" className="h-6 w-auto self-start" />
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 bg-[#00c685] hover:bg-[#00a871] text-white font-bold rounded-full transition-all">Sign Up</Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold rounded-full transition-all">Sign In</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── VALUE RENDERER ────────────────────────────────────────────────────────────
function CellValue({ val, highlight }: { val: string | boolean; highlight?: boolean }) {
  if (typeof val === 'boolean') {
    return val
      ? <div className="w-6 h-6 rounded-full bg-[#00c685]/15 border border-[#00c685]/30 flex items-center justify-center mx-auto"><Check className="w-3.5 h-3.5 text-[#00c685]" /></div>
      : <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto"><X className="w-3.5 h-3.5 text-white/20" /></div>;
  }
  return (
    <span className={cn(
      "text-xs font-semibold leading-snug",
      highlight ? 'text-[#00c685]' : 'text-white/70'
    )}>
      {val}
    </span>
  );
}

const Comparison = () => {
  const [sliderPct, setSliderPct] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updateSlider(e.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [updateSlider]);

  return (
    <section className="py-24 bg-white overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-5">

        {/* ── Section header — one focal point ── */}
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
          <motion.h2 variants={itemVariants} className="text-[clamp(2.2rem,1.2rem+3vw,3.2rem)] font-normal font-heading text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            Conventional <span className="text-[#00c685] font-heading not-italic font-normal">vs</span> Takaful
          </motion.h2>
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

                  <p className="text-white text-[1.35rem] font-bold tracking-[-0.02em] leading-tight mb-1">Traditional Insurance</p>
                  <p className="text-[#6272a4] text-[0.8rem] mb-4 leading-[1.6]">Profit-driven. Shareholders before people.</p>

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
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c685] rounded-full blur-[140px] opacity-[0.08] pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-56 h-56 bg-[#62D2A2] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />

                <div className="w-full max-w-[900px] px-4 sm:px-8 flex flex-col items-center relative z-10">
                  <div className="inline-flex items-center gap-2 border border-[#00c685]/25 rounded-full px-4 py-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#00c685] animate-pulse" />
                    <span className="text-[#00c685] text-[11px] font-bold tracking-[0.12em] uppercase">Takaful</span>
                  </div>

                  <img src="/brand/logo-light.png" alt="Takaful" className="h-7 mb-1" />
                  <p className="text-[#4d7a5e] text-[0.8rem] mb-4 leading-[1.6]">Community-first. Built on Islamic principles.</p>

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
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#00c685]/60 to-transparent" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-gradient-to-r from-[#00c685]/25 via-transparent to-transparent [mask-image:radial-gradient(80px_at_left,white,transparent)]" />
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
          <p className="text-center text-gray-400 text-[11px] mt-3 font-mono tracking-[0.08em]">// drag left or right to compare</p>
        </div>
      </div>
    </section>
  );
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function PlanComparisonPage() {
  const [homeType, setHomeType] = useState<HomeType>('villa');
  const [coverageLimit, setCoverageLimit] = useState(250000);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeMobileTier, setActiveMobileTier] = useState<'basic' | 'comfort' | 'executive'>('comfort');
  const [showShariaModal, setShowShariaModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [stickyVisible, setStickyVisible] = useState(false);

  const matrixRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (matrixRef.current) {
        const rect = matrixRef.current.getBoundingClientRect();
        setStickyVisible(rect.top < 72 && rect.bottom > 200);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const calcPrice = (base: number) => Math.round(base * (1 + ((coverageLimit - 50000) / 450000) * 0.4));

  return (
    <div
      className="min-h-screen bg-[#0a1a14] text-white overflow-x-hidden tracking-[-0.02em] relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* 1. Animated dot canvas — covers the entire page background (Nexus-style) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotCanvas />
      </div>
      {/* 2. Nexus-style vignette — fades dots at bottom and edges so content stays readable */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, #0a1a14 90%), radial-gradient(ellipse at center, transparent 40%, #0a1a14 95%)',
        }}
      />

      <Nav />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION — same bg & text style as how-it-works
      ═══════════════════════════════════════════════════════════════════════ */}
      <header ref={heroRef} className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-24">
        {/* hero-zoom subtle scale animation on the bg — transparent so page canvas shows */}
        <div className="absolute inset-0 z-0 hero-zoom" />

        {/* Content */}
        <div className="relative z-50 flex flex-col items-center text-center px-5 max-w-4xl mx-auto">

          {/* Badge — same markup as how-it-works */}
          <div className="hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/90 text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all hover:bg-white/10 mb-8">
              <span className="text-[#00c685] font-bold">✨</span>
              <span>Compare Plans</span>
            </div>
          </div>

          {/* H1 — exact same classes as how-it-works */}
          <h1 className="leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-heading font-normal tracking-tight mb-6 flex flex-col items-center hero-anim hero-reveal">
            <span
              className="block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Protect Your Home
            </span>
            <span
              className="block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.38s', color: '#00c685' }}
            >
              the Ethical Way
            </span>
          </h1>

          {/* Subtitle — exact same classes as how-it-works */}
          <p
            className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl hero-anim hero-fade mb-8"
            style={{ animationDelay: '0.65s' }}
          >
            Find the right plan for your needs and choose the coverage that works best for you.{' '}

          </p>

          {/* Trust badges */}
          <div className="hero-anim hero-fade flex flex-wrap items-center justify-center gap-3 mb-6" style={{ animationDelay: '0.75s' }}>
            {[
              { icon: ShieldCheck, label: 'AAOIFI Certified' },
              { icon: RefreshCw, label: 'Annual Surplus Refund' },
              { icon: Star, label: '4.9 / 5 Trustpilot' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/50 border border-white/10 px-3 py-1.5 rounded-full bg-white/[0.03]">
                <Icon className="w-3.5 h-3.5 text-[#00c685]" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── INTERACTIVE FILTER ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 w-full max-w-xl mx-auto px-5"
        >
          <div className="relative bg-[#09120e]/95 backdrop-blur-xl border border-white/8 rounded-2xl p-5 shadow-xl overflow-hidden mt-8">

            <div className="flex flex-col gap-4 text-left">

              {/* Property Type */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {([
                  { id: 'apartment' as const, label: 'Apartment', icon: Building },
                  { id: 'villa' as const, label: 'Villa', icon: Home },
                  { id: 'renter' as const, label: 'Renter', icon: Key },
                ]).map(({ id, label, icon: Icon }) => {
                  const isSelected = homeType === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setHomeType(id)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-medium transition-all duration-200 select-none',
                        isSelected
                          ? 'bg-white text-[#0a1a14] shadow-sm'
                          : 'text-white/40 hover:text-white/70'
                      )}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Coverage */}
              <div className="border-t border-white/[0.06] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Cover Limit</span>
                  <motion.span
                    key={coverageLimit}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-bold text-white font-mono tabular-nums"
                  >
                    £{coverageLimit.toLocaleString()}
                  </motion.span>
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full rounded-full bg-white/[0.06] mb-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#00c685]"
                    animate={{ width: `${((coverageLimit - 50000) / (500000 - 50000)) * 100}%` }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <Slider
                  value={[coverageLimit]}
                  min={50000}
                  max={500000}
                  step={25000}
                  onValueChange={(value) => setCoverageLimit(value[0])}
                  aria-label="Coverage limit"
                  className="my-2"
                />

                <div className="flex justify-between text-[9px] text-white/20 font-mono mt-1">
                  <span>£50k</span>
                  <span>£250k</span>
                  <span>£500k</span>
                </div>
              </div>

              {/* Plan Price Tiles */}
              <div className="grid grid-cols-3 gap-1.5 pt-4 border-t border-white/[0.06]">
                {PLAN_TIERS.map((tier) => {
                  const price = calcPrice(tier.basePrice[homeType]);
                  return (
                    <div
                      key={tier.id}
                      className={cn(
                        'relative flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all duration-200',
                        tier.popular
                          ? 'border-[#00c685]/25 bg-[#00c685]/[0.06]'
                          : 'border-white/[0.05] bg-white/[0.02]'
                      )}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-[#00c685] text-[#0a1a14] px-1.5 py-px rounded-full whitespace-nowrap">
                          Popular
                        </span>
                      )}
                      <span className={cn('text-[9px] font-medium', tier.popular ? 'text-[#00c685]' : 'text-white/30')}>
                        {tier.name}
                      </span>
                      <div className="flex items-baseline gap-px">
                        <span className="text-[9px] text-white/30">£</span>
                        <NumberFlow value={price} className="text-base font-bold text-white tabular-nums" />
                        <span className="text-[8px] text-white/25">/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </motion.div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          STICKY PLAN HEADER BAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={cn(
        'fixed top-[64px] left-0 right-0 z-50 px-5 transition-all duration-400',
        stickyVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
      )}>
        <div className="max-w-7xl mx-auto bg-[#09120e]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
          <div className="hidden lg:block text-xs font-semibold text-white/30 font-mono shrink-0 uppercase tracking-widest">
            Takaful Plans
          </div>
          <div className="flex-1 grid grid-cols-3 gap-3">
            {PLAN_TIERS.map((tier) => (
              <div key={tier.id} className={cn(
                'flex items-center justify-between gap-2 px-3 py-2 rounded-xl border',
                tier.popular ? 'border-[#00c685]/30 bg-[#00c685]/5' : 'border-white/8 bg-white/[0.03]'
              )}>
                <div>
                  <div className="text-[11px] font-bold text-white truncate">{tier.name}</div>
                  <div className={cn('text-xs font-bold font-mono', tier.accentColor)}>
                    £{calcPrice(tier.basePrice[homeType])}<span className="text-white/25 font-normal text-[10px]">/mo</span>
                  </div>
                </div>
                <Link
                  href={`/get-quote?plan=${tier.id}&type=${homeType}&cover=${coverageLimit}`}
                  className={cn(
                    'text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
                    tier.popular ? 'bg-[#00c685] text-[#0a1a14] hover:bg-[#00a871]' : 'bg-white/8 text-white hover:bg-white/15'
                  )}
                >
                  Choose
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PLAN CARDS + COMPARISON MATRIX
      ═══════════════════════════════════════════════════════════════════════ */}
      <section ref={matrixRef} className="relative px-5 sm:px-10 md:px-14 pb-24 max-w-7xl mx-auto z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <PillBadge text="Sharia-Compliant Plans" dark dot />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white font-normal tracking-tight">
            Flexible &amp; Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl">
            Select the plan that best suits your home protection needs.
          </p>

          {/* Billing Toggle */}
          <div className="mt-2 inline-flex items-center gap-1 p-1 rounded-2xl border border-white/8 bg-white/[0.04]">
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={cn(
                  'relative px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 capitalize',
                  billingPeriod === period
                    ? 'bg-white text-[#0a1a14] shadow-lg'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {period}
                {period === 'yearly' && (
                  <span className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors',
                    billingPeriod === 'yearly' ? 'text-[#00c685]' : 'text-white/30'
                  )}>
                    −17%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Premium Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLAN_TIERS.map((tier, idx) => {
            const baseMonthly = calcPrice(tier.basePrice[homeType]);
            const priceVal = billingPeriod === 'yearly' ? Math.round(baseMonthly * 10) : baseMonthly;
            const isFeatured = tier.popular;

            const fireConfetti = () => {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00c685', '#ffffff', '#a3f7d4'],
                disableForReducedMotion: true,
              });
            };

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.012 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'relative rounded-[1.6rem] border p-2 transition-all duration-300',
                  isFeatured
                    ? 'border-white/20 shadow-[0_0_60px_rgba(0,198,133,0.08)]'
                    : 'border-white/8'
                )}
              >
                {/* Glowing stroke border on hover */}
                <GlowingEffect
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  spread={40}
                  blur={0}
                  borderWidth={2}
                />

                {/* Inner card content */}
                <div
                  className={cn(
                    'relative flex flex-col rounded-[1.3rem] overflow-hidden p-6 h-full transition-all duration-300 group',
                    isFeatured
                      ? 'bg-[#09120e]'
                      : 'bg-white/[0.03] hover:bg-white/[0.05]'
                  )}
                >
                  {/* Featured shader background animation */}
                  {isFeatured && (
                    <>
                      <div className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none overflow-hidden rounded-[1.3rem]">
                        <ShaderAnimation />
                      </div>
                      <div className="absolute inset-0 rounded-[1.3rem] bg-gradient-to-br from-[#0a1a14]/60 via-[#0a1a14]/40 to-transparent pointer-events-none z-0" />
                    </>
                  )}

                  {/* Badge */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3 border",
                        tier.id === 'basic' && "bg-white/5 text-white/50 border-white/10",
                        tier.id === 'comfort' && "bg-[#00c685]/10 text-[#00c685] border-[#00c685]/20",
                        tier.id === 'executive' && "bg-amber-400/10 text-amber-400 border-amber-400/20"
                      )}>
                        {isFeatured && <span className="w-1.5 h-1.5 rounded-full bg-[#00c685] animate-pulse" />}
                        {tier.id === 'basic' ? 'Basic Shield' : tier.badge || 'Most Popular'}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight">{tier.name}</h3>
                      <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-[200px]">{tier.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[13px] font-medium text-white/40">From</span>
                      <span className="text-4xl font-extrabold font-mono text-white tabular-nums leading-none">
                        £<NumberFlow value={priceVal} />
                      </span>
                      <span className="text-xs text-white/30">
                        {billingPeriod === 'yearly' ? '/yr' : '/mo'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-[11px] text-white/30 mt-1 font-mono">
                        (Est. £{Math.round(baseMonthly * 12)}/yr full rate)
                      </p>
                    )}
                    <p className="text-[10px] text-white/20 mt-1">(Est. — final quote varies)</p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/get-quote?plan=${tier.id}&type=${homeType}&cover=${coverageLimit}`}
                    className="block w-full mt-auto relative z-10"
                    onClick={isFeatured ? fireConfetti : undefined}
                  >
                    <button className={cn(
                      'w-full py-3 rounded-xl text-sm font-bold transition-all duration-300',
                      isFeatured
                        ? 'bg-white text-[#0a1a14] hover:bg-white/90 shadow-lg'
                        : 'bg-white/8 text-white/70 border border-white/10 hover:bg-white/14 hover:text-white hover:border-white/20'
                    )}>
                      Get Custom Quote
                    </button>
                  </Link>

                  {/* Key feature chips */}
                  <div className="mt-5 pt-5 border-t border-white/8 flex flex-col gap-2 relative z-10">
                    {(tier.id === 'basic'
                      ? ['Buildings up to £200k', 'Contents up to £25k', 'Sharia Board Certified']
                      : tier.id === 'comfort'
                        ? ['Buildings up to £500k', 'Contents up to £75k', '+15% Surplus Bonus', 'Priority Claims']
                        : ['Buildings up to £1.5M', 'Contents up to £200k', '+30% Surplus Bonus', 'Concierge Service']
                    ).map((feat) => (
                      <div key={feat} className="flex items-center gap-2">
                        <Check className={cn('w-3.5 h-3.5 shrink-0', isFeatured ? 'text-white/60' : 'text-white/30')} />
                        <span className="text-[12px] text-white/50">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Feature Comparison Table ── */}
        <div className="relative rounded-[1.6rem] border border-white/[0.03] p-2">
          <GlowingEffect
            glow={true}
            disabled={false}
            proximity={80}
            inactiveZone={0.01}
            spread={50}
            blur={0}
            borderWidth={2}
          />
          <div className="bg-[#09120e]/70 backdrop-blur-xl rounded-[1.3rem] overflow-hidden shadow-2xl">

            <div className="lg:hidden p-4 border-b border-white/[0.02]">
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.02]">
                {PLAN_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setActiveMobileTier(tier.id)}
                    className={cn(
                      'py-2.5 px-2 rounded-lg text-xs font-bold transition-all',
                      activeMobileTier === tier.id ? 'bg-white text-[#0a1a14]' : 'text-white/40 hover:text-white'
                    )}
                  >
                    {tier.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Table body */}
            <PricingTable>
              <PricingTableHeader className="hidden lg:table-header-group">
                <PricingTableRow className="border-b border-white/[0.005]">
                  <PricingTableHead className="p-4 text-xs font-bold text-white/20 uppercase tracking-[0.12em] align-middle">
                    Features &amp; Limits
                  </PricingTableHead>
                  {PLAN_TIERS.map((tier) => (
                    <PricingTableHead key={tier.id} className="p-4 text-center text-xs font-bold text-white/70 uppercase tracking-[0.12em] align-middle">
                      {tier.name}
                    </PricingTableHead>
                  ))}
                </PricingTableRow>
              </PricingTableHeader>

              <PricingTableBody className="[&_tr]:border-b border-white/[0.005]">
                {MATRIX_DATA.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <React.Fragment key={cat.category}>
                      <PricingTableRow className="bg-white/[0.005] border-b border-white/[0.005] hover:bg-white/[0.005]">
                        <PricingTableCell colSpan={4} className="p-0">
                          <div className="px-6 py-3.5 flex items-center gap-3 text-left w-full">
                            <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center">
                              <CatIcon className="w-3.5 h-3.5 text-white/40" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">{cat.category}</span>
                          </div>
                        </PricingTableCell>
                      </PricingTableRow>

                      {cat.rows.map((row) => (
                        <PricingTableRow key={row.feature} className="hover:bg-white/[0.01] transition-colors">
                          <PricingTableHead className="p-4 align-middle font-normal">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] text-white/75">{row.feature}</span>
                              <div className="group relative cursor-help shrink-0">
                                <Info className="w-3 h-3 text-white/20 hover:text-white/50 transition-colors" />
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-56 p-2.5 bg-black/95 text-[11px] text-white/70 rounded-xl shadow-xl border border-white/10 z-50 leading-relaxed pointer-events-none whitespace-normal">
                                  {row.tooltip}
                                </div>
                              </div>
                            </div>
                          </PricingTableHead>
                          <PricingTableCell>{row.basic}</PricingTableCell>
                          <PricingTableCell className={cn(PLAN_TIERS[1].popular && "bg-white/[0.02]")}>{row.comfort}</PricingTableCell>
                          <PricingTableCell>{row.executive}</PricingTableCell>
                        </PricingTableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </PricingTableBody>
            </PricingTable>
          </div>
        </div>

        {/* ── Quote Info Banner ── */}
        <div className="mt-8 w-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-white/40" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">
              How Takaful Quotes Work
            </h4>
            <p className="text-xs text-white/55 leading-relaxed">
              These estimated contributions reflect starting rates based on basic property dimensions and coverage limit inputs.
              The final custom quote depends on postcode risks, construction details, and safety features, calculated in real-time during the quote setup.
            </p>
          </div>
          <Link href="/get-quote" className="shrink-0">
            <Button className="bg-white text-[#0a1a14] hover:bg-white/90 text-xs font-bold px-5 py-2.5 rounded-xl h-auto">
              Start Final Quote Setup
            </Button>
          </Link>
        </div>

        {/* Sharia cert link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowShariaModal(true)}
            className="inline-flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 transition-colors font-medium tracking-wide"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            View AAOIFI Sharia Supervisory Board Audit Certificate
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TAKAFUL vs CONVENTIONAL — matching homepage Comparison style
      ═══════════════════════════════════════════════════════════════════════ */}
      <Comparison />

      {/* ═══════════════════════════════════════════════════════════════════════
          PLAN SELECTION APPROACH — replaced FAQ section
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 overflow-hidden relative z-10 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div>
                <div style={{ opacity: 1, transform: 'none' }}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-white/20 hover:bg-white/10 mb-6">
                    <span className="text-[#00c685] font-bold">✨</span><span>Choosing a Plan</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mb-6 leading-[1.15]" style={{ opacity: 1, transform: 'none' }}>
                  Select the coverage tier that aligns with your household.
                </h2>
                <div className="flex items-start gap-3 mb-4" style={{ opacity: 1, transform: 'none' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0, 198, 133, 0.125)' }}>
                    <Check className="w-3 h-3 text-[#00c685]" aria-hidden="true" />
                  </div>
                  <p className="text-white/60 leading-relaxed text-[1.0625rem]">
                    <strong>Basic Shield</strong> is ideal for standard homes needing essential Sharia-compliant buildings and contents protection.
                  </p>
                </div>
                <div className="flex items-start gap-3 mb-4" style={{ opacity: 1, transform: 'none' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0, 198, 133, 0.125)' }}>
                    <Check className="w-3 h-3 text-[#00c685]" aria-hidden="true" />
                  </div>
                  <p className="text-white/60 leading-relaxed text-[1.0625rem]">
                    <strong>Home Comfort</strong> scales cover limits, adds accidental damage, and grants a +15% weight for annual surplus refunds.
                  </p>
                </div>
                <div className="flex items-start gap-3 mb-4" style={{ opacity: 1, transform: 'none' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0, 198, 133, 0.125)' }}>
                    <Check className="w-3 h-3 text-[#00c685]" aria-hidden="true" />
                  </div>
                  <p className="text-white/60 leading-relaxed text-[1.0625rem]">
                    <strong>Executive Plan</strong> offers maximum limits, zero standard excess, concierge claims management, and +30% surplus weight.
                  </p>
                </div>
                <div className="mt-8" style={{ opacity: 1, transform: 'none' }}>
                  <Link
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg"
                    href="/get-quote"
                    style={{ background: 'rgb(0, 198, 133)' }}
                  >
                    Start Customizing <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/5" style={{ opacity: 1, transform: 'none' }}>
              <img alt="Community Protection" className="w-full h-[480px] object-cover opacity-80" src="/home-about/uploaded_protection.jpg" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#09120e]/90 backdrop-blur-md border border-white/10 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0, 198, 133, 0.125)' }}>
                    <Users className="w-4 h-4 text-[#00c685]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">Compare Plans Instantly</p>
                    <p className="text-[11px] text-white/40">Select the best fit for your family</p>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, rgb(0, 198, 133), rgb(98, 210, 162))', width: '94%' }}></div>
                </div>
                <p className="text-[10px] text-white/30 mt-1.5 font-mono">Select your coverage limit above</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA WAITLIST — white background, DotCanvas background
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-10 md:px-14 relative z-10 overflow-hidden bg-white">
        {/* Dot grid animation */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <DotCanvas />
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200/80 bg-gray-50/50 text-gray-800 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-6">
                <span className="text-[#00c685] font-bold">✨</span>
                <span>Ready to Switch?</span>
              </div>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-[clamp(2rem,1.2rem+2.5vw,3.2rem)] font-normal font-heading text-gray-900 mb-5 tracking-[-0.03em] leading-[1.1]"
            >
              Start your ethical<br />home cover today
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 text-base leading-relaxed mb-10 max-w-md mx-auto">
              Get an instant quote in under 2 minutes. No credit card required. Cancel anytime.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-quote"
                className="inline-flex items-center gap-2 bg-[#00c685] hover:bg-[#00a871] text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00c685]/30 text-sm"
              >
                Get Instant Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                How it Works <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SHARIA MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showShariaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#09120e] border border-[#00c685]/30 rounded-[1.5rem] max-w-md w-full p-7 shadow-2xl relative"
            >
              <button onClick={() => setShowShariaModal(false)} className="absolute top-4 right-4 p-2 text-white/30 hover:text-white rounded-full hover:bg-white/8 transition-all">
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#00c685]/15 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#00c685]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Sharia Board Audit Certificate</h3>
                  <p className="text-[11px] text-[#00c685]/60">Reference #TK-2026-UK · AAOIFI Standard No. 26</p>
                </div>
              </div>

              <div className="text-[12px] text-white/40 leading-relaxed mb-5">
                This certifies that the operational Wakalah contracts, Tabarru' donation structures, and asset investment policies of Takaful UK have been thoroughly audited and verified as 100% compliant with Islamic Jurisprudence and AAOIFI standards.
              </div>

              <div className="bg-white/[0.04] border border-white/8 p-4 rounded-xl font-mono text-[11px] text-[#00c685]/70 space-y-1.5 mb-6">
                {['Zero Riba (Interest)', 'Zero Gharar (Excessive Uncertainty)', 'Zero Maisir (Speculation)', '100% Sukuk & Ethical Investments'].map((line) => (
                  <div key={line} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#00c685] shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/20">Audited by Independent Sharia Advisory Board</span>
                <button onClick={() => setShowShariaModal(false)} className="px-5 py-2 rounded-xl bg-[#00c685] text-[#0a1a14] text-xs font-bold hover:bg-[#00a871] transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HoverFooter />
    </div>
  );
}
