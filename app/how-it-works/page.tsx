'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ChevronRight, Check, ChevronDown, Menu,
  Shield, Users, Heart, Zap, Eye, Star,
  Home, FileText, UserPlus, CreditCard, CheckCircle,
  ShieldCheck, Calculator, Flame, Droplets, Wind, Hammer,
  Monitor, Sofa, Utensils,
} from 'lucide-react';
import { PillBadge } from '@/components/ui/pill-badge';

// Heavy below-fold components — lazy loaded to avoid blocking initial paint
const BackgroundBeams = dynamic(
  () => import('@/components/ui/background-beams').then(m => ({ default: m.BackgroundBeams })),
  { ssr: false }
);
const Boxes = dynamic(
  () => import('@/components/ui/background-boxes').then(m => ({ default: m.Boxes })),
  { ssr: false }
);
const StackFeatureSection = dynamic(
  () => import('@/components/ui/stack-feature-section'),
  { ssr: false }
);
const HoverFooter = dynamic(
  () => import('@/components/ui/hover-footer-demo').then(m => ({ default: m.HoverFooter })),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import('@/components/ui/testimonials-columns-1').then(m => ({ default: m.Testimonials })),
  { ssr: false }
);

import { Card, CardHeader, CardContent } from '@/components/ui/card';


const GREEN = '#00c685';
const GREEN_DARK = '#00a871';
const GREEN_DEEP = '#065F46';
const BG_DARK = '#0a1a14';
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

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
      ease: ease,
    },
  },
};

import { RotatingText } from '@/components/ui/hero-section-nexus';

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isInitialDark = window.scrollY <= window.innerHeight * 0.7;
      
      // Select sections, footer, etc. to detect background overlaps
      const sections = Array.from(document.querySelectorAll('section, footer, header'));
      let isOverlappingDark = false;
      
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        // If the navigation bar (approx 60px height) intersects this section
        if (rect.top <= 60 && rect.bottom >= 20) {
          const style = window.getComputedStyle(sec);
          const bg = style.backgroundColor;
          // Check for #0a1a14 (rgb(10, 26, 20)), black, or other dark colors
          if (bg === 'rgb(10, 26, 20)' || bg === 'rgb(0, 0, 0)' || bg.includes('rgba(10, 26, 20')) {
            isOverlappingDark = true;
            break;
          }
        }
      }
      
      setScrolled(!isInitialDark && !isOverlappingDark);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const onDark = !scrolled;
  const links = [['Home', '/'], ['How it Works', '/how-it-works'], ['Compare Plans', '/compare-plans'], ['About Us', '/about'], ['Contact', '/contact']];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-500">
        <Link href="/"><img src={onDark ? '/logo-light.png' : '/logo-dark.png'} alt="Takaful" className="h-6 transition-all duration-500" /></Link>
        <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-2 items-center gap-1 transition-all duration-500 ${onDark ? 'bg-white/20 backdrop-blur-md border border-white/30' : 'bg-gray-100/80 border border-gray-200'}`}>
          {links.map(([label, href], i) => (
            <Link key={label} href={href} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${i === 1 ? onDark ? 'bg-white/20 text-white' : 'bg-white text-gray-900 shadow-sm' : onDark ? 'text-white/80 hover:bg-white/30 hover:text-white' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}>{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signup" className={`hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${onDark ? 'bg-white text-gray-900' : 'bg-[#00c685] text-white'}`}>Sign Up</Link>
          <button onClick={() => setMobileMenuOpen(true)} className={`md:hidden p-2 ${onDark ? 'text-white' : 'text-gray-900'}`}><Menu size={24} /></button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
              <Menu size={24} />
            </button>
            <div className="flex flex-col gap-6 mt-12">
              <img src="/logo-dark.png" alt="Takaful Logo" className="h-6 w-auto self-start" />
              <div className="flex flex-col gap-2">
                {links.map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface Dot {
  x: number;
  y: number;
  baseColor: string;
  targetOpacity: number;
  currentOpacity: number;
  opacitySpeed: number;
  baseRadius: number;
  currentRadius: number;
}

function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const DOT_SPACING = 25;
  const BASE_OPACITY_MIN = 0.40;
  const BASE_OPACITY_MAX = 0.65;
  const BASE_RADIUS = 1.5;
  const INTERACTION_RADIUS = 150;
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 0.6;
  const RADIUS_BOOST = 2.5;
  const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5));

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    mousePositionRef.current = { x: canvasX, y: canvasY };
  }, []);

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const newDots: Dot[] = [];
    const newGrid: Record<string, number[]> = {};
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const cellX = Math.floor(x / GRID_CELL_SIZE);
        const cellY = Math.floor(y / GRID_CELL_SIZE);
        const cellKey = `${cellX}_${cellY}`;

        if (!newGrid[cellKey]) {
          newGrid[cellKey] = [];
        }

        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);

        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        newDots.push({
          x,
          y,
          baseColor: `rgba(0, 198, 133, ${BASE_OPACITY_MAX})`,
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: (Math.random() * 0.005) + 0.002,
          baseRadius: BASE_RADIUS,
          currentRadius: BASE_RADIUS,
        });
      }
    }
    dotsRef.current = newDots;
    gridRef.current = newGrid;
  }, [DOT_SPACING, GRID_CELL_SIZE, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;

    if (canvas.width !== width || canvas.height !== height ||
        canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height)
    {
      canvas.width = width;
      canvas.height = height;
      canvasSizeRef.current = { width, height };
      createDots();
    }
  }, [createDots]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const activeDotIndices = new Set<number>();
    if (mouseX !== null && mouseY !== null) {
      const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
      const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
      const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
      for (let i = -searchRadius; i <= searchRadius; i++) {
        for (let j = -searchRadius; j <= searchRadius; j++) {
          const checkCellX = mouseCellX + i;
          const checkCellY = mouseCellY + j;
          const cellKey = `${checkCellX}_${checkCellY}`;
          if (grid[cellKey]) {
            grid[cellKey].forEach(dotIndex => activeDotIndices.add(dotIndex));
          }
        }
      }
    }

    dots.forEach((dot, index) => {
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
        dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
      }

      let interactionFactor = 0;
      dot.currentRadius = dot.baseRadius;

      if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < INTERACTION_RADIUS_SQ) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
          interactionFactor = interactionFactor * interactionFactor;
        }
      }

      const finalOpacity = (mouseX !== null && mouseY !== null && interactionFactor > 0)
        ? Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST)
        : 0;

      if (finalOpacity <= 0) return;

      dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 198, 133, ${finalOpacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [GRID_CELL_SIZE, INTERACTION_RADIUS, INTERACTION_RADIUS_SQ, OPACITY_BOOST, RADIUS_BOOST, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  useEffect(() => {
    handleResize();
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleResize, handleMouseMove, animateDots]);

  return (
    <section className="relative w-full flex flex-col items-center justify-center bg-black overflow-hidden pt-32 pb-24">
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[#0a1a14] z-0 hero-zoom" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      
      <div className="relative z-50 flex flex-col items-center text-center px-5 max-w-4xl mx-auto">
        
        {/* How it Works Badge */}
        <div className="hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/90 text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all hover:bg-white/10 mb-8">
            <span className="text-[#00c685] font-bold">✨</span>
            <span>How It Works</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-playfair italic font-normal tracking-tight mb-6 flex flex-col items-center hero-anim hero-reveal">
          <span 
            className="block text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" 
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Built Around Trust
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl hero-anim hero-fade mb-6" style={{ animationDelay: '0.65s' }}>
          From getting your quote to full protection — every step of our Sharia-compliant, community-backed coverage explained.
        </p>

        {/* Email Form */}
        <div className="flex w-full max-w-md mx-auto items-center space-x-2 mt-8 z-50 pointer-events-auto hero-anim hero-fade" style={{ animationDelay: '0.75s' }}>
          <input
            className="flex h-10 border py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-[#00c685] rounded-full px-5"
            placeholder="Enter your email address"
            type="email"
          />
          <button className="bg-[#00c685] hover:bg-[#00a871] text-white px-8 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00c685]/20 text-sm h-10 shrink-0">
            Join
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4 justify-center mb-16 hero-anim hero-fade" style={{ animationDelay: '0.85s' }}>
          <div className="bg-[#00c685] text-white rounded-full p-0.5 shadow-md">
            <Check size={12} strokeWidth={4} />
          </div>
          <span className="text-white/90 text-sm font-medium">No credit card required for quote</span>
        </div>

        {/* Dashboard mockup image */}
        <motion.div
          className="w-full max-w-4xl mx-auto px-4 sm:px-0 mt-8 z-30"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
          <img
            src="/dashboard.png"
            alt="Dashboard Preview Mockup"
            width={1024}
            height={640}
            className="w-full h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
            loading="lazy"
          />
        </motion.div>

      </div>
    </section>
  );
}

function IntroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div ref={ref}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <PillBadge text="Our Approach" className="mb-6" />
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-6 leading-[1.15]">
                Unlike traditional insurance, Takaful is built on mutual assistance.
              </motion.h2>
              {['Members contribute to a shared pool that protects everyone — not a company\'s shareholders.', 'When a claim happens, funds come from the community pool, transparently managed.', 'Any surplus at year-end? It comes back to you, the member — not taken as profit.'].map((line, i) => (
                <motion.div key={i} variants={itemVariants} className="flex items-start gap-3 mb-4">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${GREEN}20` }}><Check size={11} style={{ color: GREEN }} strokeWidth={3} /></div>
                  <p className="text-gray-600 leading-relaxed text-[1.0625rem]">{line}</p>
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="mt-8">
                <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg" style={{ background: GREEN }}>Start for free <ChevronRight size={15} /></Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10" initial={{ opacity: 0, scale: 0.92 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.15, ease }}>
            <img src="/OurApproach.png" alt="Community Protection" className="w-full h-[480px] object-cover" />
            <div className="absolute top-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${GREEN}20` }}><Users size={16} style={{ color: GREEN }} /></div>
                <div><p className="text-[13px] font-bold text-gray-900">50,000+ Protected Homes</p><p className="text-[11px] text-gray-500">Across the United Kingdom</p></div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${GREEN}, #62D2A2)` }} initial={{ width: 0 }} animate={inView ? { width: '94%' } : {}} transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 font-mono">Community trust score: 94/100</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const timelineSteps = [
  { step: '01', icon: Calculator, title: 'Get Your Quote', desc: 'Enter your home details — postcode, property type, size, and construction. Our engine instantly calculates your personalized Takaful contribution.', img: '/step1.jpg', color: '#2563EB', bg: '#EFF6FF', checks: ['No account needed', 'Instant estimate', 'Zero obligation'] },
  { step: '02', icon: FileText, title: 'Review Your Coverage', desc: 'See your contribution and exactly what\'s protected. No hidden fees. No confusing small print. Full transparency from day one.', img: '/step3.jpg', color: '#7C3AED', bg: '#F5F3FF', checks: ['Itemized breakdown', "What's included", 'Sharia certificate'] },
  { step: '03', icon: UserPlus, title: 'Create Your Account', desc: 'Create your secure account in under 2 minutes. Your quote is saved. Your data is protected.', img: '/step4.jpg', color: GREEN_DEEP, bg: '#ECFDF5', checks: ['2-minute sign-up', 'Bank-level security', 'Quote auto-saved'] },
  { step: '04', icon: CreditCard, title: 'Complete Your Contribution', desc: 'Contribute securely via our Sharia-compliant payment system. Your money goes directly into the community protection pool.', img: '/step5.jpg', color: '#EA580C', bg: '#FFF7ED', checks: ['All cards accepted', 'Halal-certified', 'Instant confirmation'] },
  { step: '05', icon: ShieldCheck, title: 'Certificate Issued', desc: 'Your digital Takaful certificate is generated instantly. Download it or access it anytime from your dashboard.', img: '/step6.jpg', color: '#0F766E', bg: '#F0FDFA', checks: ['Instant delivery', 'FCA registered', 'Shareable PDF'] },
  { step: '06', icon: Home, title: "You're Protected", desc: 'Coverage begins immediately. Your home is backed by the full strength of the community from this moment.', img: '/step2.png', color: GREEN, bg: '#F0FDF4', checks: ['Immediate cover', 'Claims in 48 hrs', 'Community-backed'] },
];

function StepCard({ step, align }: { step: typeof timelineSteps[0]; align: 'left' | 'right' }) {
  const Icon = step.icon;
  return (
    <div className="group p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 bg-white" style={{ borderColor: `${step.color}20`, boxShadow: `0 4px 24px ${step.color}08` }}>
      <div className={`flex items-center gap-3 mb-4 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: step.bg }}><Icon size={18} style={{ color: step.color }} /></div>
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: step.color }}>Step {step.step}</span>
      </div>
      <h3 className={`text-xl font-normal font-playfair italic text-gray-900 mb-2 leading-tight ${align === 'right' ? 'text-right' : ''}`}>{step.title}</h3>
      <p className={`text-gray-500 text-sm leading-relaxed mb-4 ${align === 'right' ? 'text-right' : ''}`}>{step.desc}</p>
      <div className="space-y-1.5">
        {step.checks.map((item, i) => (
          <div key={i} className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${step.color}15` }}><Check size={9} style={{ color: step.color }} strokeWidth={3} /></div>
            <span className="text-[13px] text-gray-600">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center max-w-2xl mx-auto mb-20" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="Step by Step" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">Six steps to complete protection</motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">The entire process takes less than 10 minutes. No paperwork. No phone calls.</motion.p>
        </motion.div>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-px bg-gray-200" />
          {timelineSteps.map((step, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: '-80px' });
            const isEven = i % 2 === 0;
            return (
              <div key={step.step} ref={ref} className="relative flex items-start mb-16 last:mb-0">
                <motion.div className={`flex-1 ${isEven ? 'md:pr-16' : 'md:order-2 md:pl-16'}`} initial={{ opacity: 0, x: isEven ? -32 : 32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease }}>
                  {isEven ? <StepCard step={step} align="right" /> : <div className="hidden md:block"><img src={step.img} alt={step.title} className="w-full h-64 object-cover rounded-2xl shadow-xl" /></div>}
                </motion.div>
                <motion.div className="hidden md:flex w-14 h-14 rounded-full items-center justify-center shrink-0 z-10 font-mono font-bold text-[13px] mx-1" style={{ background: step.bg, color: step.color, boxShadow: `0 0 0 4px white, 0 8px 24px ${step.color}30` }} initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2, ease }}>{step.step}</motion.div>
                <motion.div className={`flex-1 ${isEven ? 'md:order-2 md:pl-16' : 'md:pr-16'}`} initial={{ opacity: 0, x: isEven ? 32 : -32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease }}>
                  {isEven ? <div className="hidden md:block"><img src={step.img} alt={step.title} className="w-full h-64 object-cover rounded-2xl shadow-xl" /></div> : <StepCard step={step} align="left" />}
                </motion.div>
                <div className="md:hidden w-full flex flex-col gap-4"><StepCard step={step} align="left" /><img src={step.img} alt={step.title} className="w-full h-48 object-cover rounded-2xl shadow-lg" /></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const orbit1Items = [
  { label: 'Fire', color: 'rgb(239, 68, 68)', icon: Flame, left: '100%', top: '50%', ani: '18s' },
  { label: 'Water', color: 'rgb(59, 130, 246)', icon: Droplets, left: '50%', top: '100%', ani: '18s' },
  { label: 'Storm', color: 'rgb(139, 92, 246)', icon: Wind, left: '0%', top: '50%', ani: '18s' },
  { label: 'Structural', color: 'rgb(245, 158, 11)', icon: Hammer, left: '50%', top: '0%', ani: '18s' },
];

const orbit2Items = [
  { label: 'Electronics', color: 'rgb(6, 182, 212)', icon: Monitor, left: '100%', top: '50%', ani: '26s' },
  { label: 'Furniture', color: 'rgb(16, 185, 129)', icon: Sofa, left: '50%', top: '100%', ani: '26s' },
  { label: 'Kitchen', color: 'rgb(249, 115, 22)', icon: Utensils, left: '0%', top: '50%', ani: '26s' },
  { label: 'Liability', color: 'rgb(0, 198, 133)', icon: ShieldCheck, left: '50%', top: '0%', ani: '26s' },
];

const orbit3Items = [
  { label: 'Buildings', color: 'rgb(99, 102, 241)', icon: Home, left: '100%', top: '50%', ani: '34s' },
  { label: 'Community', color: 'rgb(236, 72, 153)', icon: Heart, left: '50%', top: '100%', ani: '34s' },
  { label: 'Security', color: 'rgb(100, 116, 139)', icon: Shield, left: '0%', top: '50%', ani: '34s' },
  { label: 'Emergency', color: 'rgb(234, 179, 8)', icon: Zap, left: '50%', top: '0%', ani: '34s' },
];

function CoverageViz() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center max-w-2xl mx-auto mb-20" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="What's Covered" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">Complete home protection</motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">Protected by a community of real people supporting each other.</motion.p>
        </motion.div>
        
        <div ref={ref} className="relative flex items-center justify-center overflow-hidden" style={{ height: '620px' }}>
          <div className="relative w-[42rem] h-[42rem] flex items-center justify-center translate-x-[20%]">
            {/* Center Logo */}
            <img alt="Takaful" className="absolute z-20 h-7 w-auto bg-white p-1 rounded-lg shadow-sm" src="/logo-dark.png" />

            {/* Orbit 1 */}
            <div className="absolute rounded-full border-2 border-dashed border-gray-300 pointer-events-none" style={{ width: '17rem', height: '17rem', animation: 'orbit-spin 18s linear infinite' }}>
              {orbit1Items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="absolute transition-transform duration-300 pointer-events-auto flex flex-col items-center"
                    style={{
                      left: item.left,
                      top: item.top,
                      transform: 'translate(-50%, -50%)',
                      animation: `orbit-counter 18s linear infinite`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300 border-2"
                      style={{
                        borderColor: item.color,
                        background: `color-mix(in srgb, ${item.color} 10%, white)`,
                      }}
                    >
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <p className="text-center mt-1 font-semibold leading-tight text-gray-500" style={{ fontSize: '11px', maxWidth: '60px' }}>
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Orbit 2 */}
            <div className="absolute rounded-full border-2 border-dashed border-gray-300 pointer-events-none" style={{ width: '24rem', height: '24rem', animation: 'orbit-spin 26s linear infinite' }}>
              {orbit2Items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="absolute transition-transform duration-300 pointer-events-auto flex flex-col items-center"
                    style={{
                      left: item.left,
                      top: item.top,
                      transform: 'translate(-50%, -50%)',
                      animation: `orbit-counter 26s linear infinite`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300 border-2"
                      style={{
                        borderColor: item.color,
                        background: `color-mix(in srgb, ${item.color} 10%, white)`,
                      }}
                    >
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <p className="text-center mt-1 font-semibold leading-tight text-gray-500" style={{ fontSize: '11px', maxWidth: '60px' }}>
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Orbit 3 */}
            <div className="absolute rounded-full border-2 border-dashed border-gray-300 pointer-events-none" style={{ width: '31rem', height: '31rem', animation: 'orbit-spin 34s linear infinite' }}>
              {orbit3Items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="absolute transition-transform duration-300 pointer-events-auto flex flex-col items-center"
                    style={{
                      left: item.left,
                      top: item.top,
                      transform: 'translate(-50%, -50%)',
                      animation: `orbit-counter 34s linear infinite`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300 border-2"
                      style={{
                        borderColor: item.color,
                        background: `color-mix(in srgb, ${item.color} 10%, white)`,
                      }}
                    >
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <p className="text-center mt-1 font-semibold leading-tight text-gray-500" style={{ fontSize: '11px', maxWidth: '60px' }}>
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </section>
  );
}

const claimsSteps = [
  { num: '1', label: 'Report Claim', desc: 'Submit online 24/7', icon: FileText, color: '#3B82F6' },
  { num: '2', label: 'Review',       desc: 'Assessed in hours',  icon: Eye,      color: '#8B5CF6' },
  { num: '3', label: 'Assessment',   desc: 'Fair & transparent', icon: Shield,   color: '#F59E0B' },
  { num: '4', label: 'Approval',     desc: 'Community-backed',   icon: CheckCircle, color: GREEN },
  { num: '5', label: 'Compensation', desc: 'Paid within 48hrs',  icon: Zap,      color: '#10B981' },
];

function ClaimsProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      
      // Calculate active step index based on current scroll depth of container relative to viewport
      if (scrollableHeight > 0) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
        const index = Math.min(
          claimsSteps.length - 1,
          Math.floor(progress * claimsSteps.length)
        );
        setActiveStep(index);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#0a1a14] text-white">
      {/* Sticky panel staying fixed during scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Radial fade mask — matching community growth section */}
        <div className="absolute inset-0 w-full h-full bg-[#0a1a14] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />

        <div className="max-w-5xl w-full mx-auto px-6 relative z-30 pointer-events-none">
          {/* Header */}
          <motion.div
            className="text-center max-w-xl mx-auto mb-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="pointer-events-auto">
              <PillBadge text="Claims" dark className="mb-4" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-normal font-playfair italic text-white mb-2 tracking-[-0.02em] leading-[1.1] pointer-events-auto">
              Simple, fair claims process
            </motion.h2>
            <motion.p variants={itemVariants} className="text-neutral-400 text-sm md:text-base leading-relaxed pointer-events-auto">
              Scroll down to explore how our transparent claims process works.
            </motion.p>
          </motion.div>

          <div className="relative z-10 pointer-events-auto mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-transparent p-2">
              
              {/* Left Column: Interactive Navigation & Detailed Text */}
              <div className="relative flex flex-col justify-center min-h-[300px]">
                
                {/* Pagination Indicators */}
                <div className="flex space-x-2 mb-6">
                  {claimsSteps.map((step, index) => {
                    const isActive = activeStep === index;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const container = containerRef.current;
                          if (container) {
                            const rect = container.getBoundingClientRect();
                            const absoluteTop = window.scrollY + rect.top;
                            const scrollableHeight = rect.height - window.innerHeight;
                            const stepHeight = scrollableHeight / claimsSteps.length;
                            
                            window.scrollTo({
                              top: absoluteTop + stepHeight * index + 10,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                          isActive ? 'w-10 bg-[#00c685]' : 'w-4 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to step ${index + 1}`}
                      />
                    );
                  })}
                </div>

                {/* Text Container with Fade-in/Slide-up animation on step change */}
                <div className="relative min-h-[180px]">
                  {claimsSteps.map((step, index) => {
                    const isActive = activeStep === index;
                    const Icon = step.icon;
                    const detailedDescriptions = [
                      "Submit your claim 24/7 through our secure, fully digital portal in minutes. Upload photos of the damage, describe the event in your own words, and provide any receipts or estimates. Our system instantly logs the claim, notifies the community pool managers, and generates your tracking reference number without any paperwork or phone queues.",
                      "Our team reviews the details of your submission within hours. We cross-reference the claim details with the community guidelines to ensure full compliance. You get instant updates via SMS and your dashboard as we check the validity, verify the community policy limits, and prepare the file for expert assessment.",
                      "Claims are verified openly based on Sharia principles. No hidden fine print or corporate bias. We look at the actual repair costs and assess the contribution distribution. If additional details are needed, we contact you directly, showing you exactly how the evaluation is calculated based on our mutual aid pool rules.",
                      "Since funds belong to the community, approvals are backed by cooperative trust. The required funds are authorized directly from the mutual protection pool. This community-backed authorization guarantees that claims are approved based on fairness and genuine need, maintaining the ethical integrity of the fund.",
                      "Once approved, the funds are dispatched directly to your registered bank account within 48 hours to cover repairs. Surplus sharing means any unclaimed funds remain inside the community pool rather than being taken as corporate profit, keeping your future contributions low and community spirit high."
                    ];

                    return (
                      <div
                        key={index}
                        className={`transition-all duration-500 ease-in-out ${
                          isActive
                            ? 'opacity-100 translate-y-0 relative z-10'
                            : 'opacity-0 translate-y-6 absolute inset-0 pointer-events-none'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00c685]/10 text-[#00c685] text-xs font-bold font-mono border border-[#00c685]/20">
                            {step.num}
                          </span>
                          <div className="p-1.5 rounded-md bg-white/5 text-white/70">
                            <Icon size={16} style={{ color: step.color }} />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            Step {step.num} of 5
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                          {step.label}
                        </h3>
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg">
                          {detailedDescriptions[index]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Indicators hint */}
                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-neutral-500 font-mono">
                  // Scroll down the page to reveal next steps
                </div>
              </div>

              {/* Right Column: Sliding Image Container with Grid Pattern Background */}
              <div
                className="hidden lg:flex items-center justify-center p-6 rounded-2xl relative overflow-hidden min-h-[360px]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '2.5rem 2.5rem',
                }}
              >
                {/* Image Frame */}
                <div className="relative w-[85%] h-[280px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <div
                    className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out flex flex-col"
                    style={{ transform: `translateY(-${activeStep * 100}%)` }}
                  >
                    {[
                      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop"
                    ].map((imgUrl, idx) => (
                      <div key={idx} className="w-full h-full shrink-0">
                        <img
                          src={imgUrl}
                          alt={claimsSteps[idx].label}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/800x1200/0a1a14/ffffff?text=${claimsSteps[idx].label}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const whyFeatures = [
  { icon: Users,       title: 'Community-based Protection', desc: 'Your home is protected by a network of members who share risk collectively.', color: GREEN },
  { icon: Shield,      title: 'Sharia-compliant',           desc: 'Certified by Islamic scholars. Every fund, every investment — halal.', color: '#7C3AED' },
  { icon: Eye,         title: 'Transparent Contributions',  desc: 'See exactly where your contribution goes. Nothing hidden, ever.', color: '#2563EB' },
  { icon: Heart,       title: 'Fair Claims',                 desc: 'Claims assessed fairly and paid within 48 hours from community funds.', color: '#EF4444' },
  { icon: Zap,         title: 'Digital Experience',         desc: 'Fully online, from quote to certificate. No paperwork, no waiting.', color: '#F59E0B' },
  { icon: CheckCircle, title: 'Fast Onboarding',            desc: 'Get your Takaful certificate in under 10 minutes. Start today.', color: '#10B981' },
];

function WhyTakaful() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center max-w-2xl mx-auto mb-16" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="Why Takaful" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">Protection built on principles</motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">Traditional Islamic insurance model focused on community, transparency, and ethical values.</motion.p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div key={i} className="group relative p-7 rounded-2xl border border-gray-100 bg-white hover:-translate-y-1 transition-all duration-500" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.07, ease }} viewport={{ once: true }}>
                <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)` }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: `${feat.color}15` }}><Icon size={20} style={{ color: feat.color }} /></div>
                <h3 className="text-[1.0625rem] font-bold text-gray-900 mb-2 leading-tight">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const compRows = [
  { label: 'Ownership',   takaful: 'Members own the fund',   conv: 'Company owns all funds' },
  { label: 'Risk Sharing',takaful: 'Shared mutually',        conv: 'Fully transferred' },
  { label: 'Transparency',takaful: 'Full visibility always', conv: 'Opaque management' },
  { label: 'Surplus',     takaful: 'Returned to members',    conv: 'Kept as company profit' },
  { label: 'Compliance',  takaful: 'Sharia-certified',       conv: 'Conventional finance' },
  { label: 'Community',   takaful: 'Community-first model',  conv: 'Shareholder-first model' },
];

function ComparisonTable() {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center max-w-2xl mx-auto mb-16" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="Side by Side" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">Conventional <span style={{ color: GREEN }}>vs</span> Takaful</motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">See exactly what makes Home Takaful different.</motion.p>
        </motion.div>
        <motion.div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-2xl shadow-black/5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} viewport={{ once: true }}>
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="p-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Feature</div>
            <div className="p-5 text-sm font-bold text-gray-700 uppercase tracking-wider border-x border-gray-200 bg-white">Conventional</div>
            <div className="p-5 text-sm font-bold uppercase tracking-wider" style={{ color: GREEN }}>Home Takaful ✨</div>
          </div>
          {compRows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-gray-100 last:border-0 transition-all duration-200 cursor-default ${hov === i ? 'bg-green-50/50' : 'bg-white'}`} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <div className="p-5 text-sm font-semibold text-gray-700">{row.label}</div>
              <div className="p-5 text-sm text-gray-500 border-x border-gray-100 flex items-center gap-2"><div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 shrink-0"><span className="text-gray-400 text-[10px]">✕</span></div>{row.conv}</div>
              <div className="p-5 text-sm flex items-center gap-2" style={{ color: hov === i ? GREEN_DEEP : '#374151' }}><div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GREEN}20` }}><Check size={9} style={{ color: GREEN }} strokeWidth={3} /></div>{row.takaful}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const faqs = [
  { q: 'What is Home Takaful?', a: 'Home Takaful is a Sharia-compliant alternative to conventional home insurance. Members contribute to a shared pool that protects everyone, based on mutual assistance and solidarity.' },
  { q: 'How long does the process take?', a: 'From getting your quote to receiving your digital certificate takes less than 10 minutes. Fully online, no paperwork required.' },
  { q: 'Is my contribution Sharia-compliant?', a: 'Yes. Every contribution is managed strictly according to Islamic financial principles, verified by independent Sharia scholars. No interest (riba), no excessive uncertainty (gharar).' },
  { q: 'What happens to unused contributions?', a: 'Any surplus remaining in the community fund at year-end is returned proportionally to members — not kept as profit.' },
  { q: 'How quickly are claims paid?', a: 'We aim to assess and pay eligible claims within 48 hours of approval. The process is transparent and fully tracked through your dashboard.' },
  { q: 'Can I cancel my coverage?', a: 'Yes. You can cancel at any time from your dashboard. Unused contributions are refunded on a pro-rata basis, minus a small administrative fee.' },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const [tab, setTab] = useState(0);
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-5">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="FAQ" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-6 tracking-tight">{"We're here to answer all your questions"}</motion.h2>
        </motion.div>
        <div className="flex gap-2 p-1 bg-gray-200/50 rounded-full w-fit mx-auto mb-10">
          {['General', 'Coverage', 'Claims'].map((t, i) => (
            <button key={i} onClick={() => setTab(i)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${tab === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>{t}</button>
          ))}
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
              <button className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-gray-900 focus:outline-none" onClick={() => setOpen(open === i ? null : i)}>
                {faq.q}
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180 bg-green-50' : ''}`} style={{ color: open === i ? GREEN : '#6b7280' }}><ChevronDown size={18} /></div>
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}><p className="text-gray-600 leading-relaxed">{faq.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG_DARK }}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[140px] opacity-10" style={{ background: GREEN }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[120px] opacity-[0.08]" style={{ background: '#62D2A2' }} />
      </div>
      <BackgroundBeams />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="Get Started Today" dark className="mb-8" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-playfair italic font-normal text-white mb-6 leading-[1.1] tracking-[-0.02em]">Ready to protect your home?</motion.h2>
          <motion.p variants={itemVariants} className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">Join thousands of families who have made the ethical choice. Get your personalized Takaful quote in under 60 seconds.</motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-95" style={{ background: GREEN, boxShadow: `0 8px 32px ${GREEN}50` }}>Get Started <ChevronRight size={16} /></Link>
            <Link href="/" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">Contact Us</Link>
          </motion.div>
          <motion.p variants={itemVariants} className="text-neutral-600 text-sm mt-8">No credit card required · Cancel anytime · Sharia-certified</motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <Hero />
      <IntroSection />
      <StackFeatureSection />
      <ClaimsProcess />
      <WhyTakaful />
      <FinalCTA />
      <Testimonials />
      <HoverFooter />
    </main>
  );
}
