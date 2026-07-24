'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Menu, ChevronRight, Check, X,
  Heart, Shield, Eye, Users, Zap, Leaf,
  ArrowRight, Star, Globe, Lock,
} from 'lucide-react';
import { PillBadge } from '@/components/ui/pill-badge';

/* ─── Heavy below-fold components — lazy loaded ─────────────────────────── */
const BackgroundBeams = dynamic(
  () => import('@/components/ui/background-beams').then(m => ({ default: m.BackgroundBeams })),
  { ssr: false }
);
const Boxes = dynamic(
  () => import('@/components/ui/background-boxes').then(m => ({ default: m.Boxes })),
  { ssr: false }
);
const HoverFooter = dynamic(
  () => import('@/components/ui/hover-footer-demo').then(m => ({ default: m.HoverFooter })),
  { ssr: false }
);
import DotCard from '@/components/ui/moving-dot-card';

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const GREEN = '#00c685';
const GREEN_DARK = '#00a871';
const BG_DARK = '#0a1a14';
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/* ─── Navigation (exact pattern from how-it-works) ──────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isInitialDark = window.scrollY <= window.innerHeight * 0.7;
      const sections = Array.from(document.querySelectorAll('section, footer, header'));
      let isOverlappingDark = false;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom >= 20) {
          const style = window.getComputedStyle(sec);
          const bg = style.backgroundColor;
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
  const links = [
    ['Home', '/'],
    ['How it Works', '/how-it-works'],
    ['Compare Plans', '/compare-plans'],
    ['About Us', '/about'],
    ['Contact', '/#contact'],
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-500">
        <Link href="/"><img src={onDark ? '/logo-light.png' : '/logo-dark.png'} alt="Takaful" className="h-6 transition-all duration-500" /></Link>
        <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-2 items-center gap-1 transition-all duration-500 ${onDark ? 'bg-white/20 backdrop-blur-md border border-white/30' : 'bg-gray-100/80 border border-gray-200'}`}>
          {links.map(([label, href], i) => (
            <Link
              key={label}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                i === 3
                  ? onDark ? 'bg-white/20 text-white' : 'bg-white text-gray-900 shadow-sm'
                  : onDark ? 'text-white/80 hover:bg-white/30 hover:text-white' : 'text-gray-600 hover:bg-white hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signup" className={`hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${onDark ? 'bg-white text-gray-900' : 'bg-[#00c685] text-white'}`}>Sign Up</Link>
          <button onClick={() => setMobileMenuOpen(true)} className={`md:hidden p-2 ${onDark ? 'text-white' : 'text-gray-900'}`}><Menu size={24} /></button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"><X size={24} /></button>
            <div className="flex flex-col gap-6 mt-12">
              <img src="/logo-dark.png" alt="Takaful Logo" className="h-6 w-auto self-start" />
              <div className="flex flex-col gap-2">
                {links.map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 bg-[#00c685] hover:bg-[#00a871] text-white font-bold rounded-full transition-all">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Canvas dot animation (same as how-it-works hero) ──────────────────── */
interface Dot {
  x: number; y: number;
  baseColor: string;
  targetOpacity: number; currentOpacity: number; opacitySpeed: number;
  baseRadius: number; currentRadius: number;
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
    if (!canvas) { mousePositionRef.current = { x: null, y: null }; return; }
    const rect = canvas.getBoundingClientRect();
    mousePositionRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
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
        const cellKey = `${Math.floor(x / GRID_CELL_SIZE)}_${Math.floor(y / GRID_CELL_SIZE)}`;
        if (!newGrid[cellKey]) newGrid[cellKey] = [];
        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);
        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        newDots.push({ x, y, baseColor: `rgba(0,198,133,${BASE_OPACITY_MAX})`, targetOpacity: baseOpacity, currentOpacity: baseOpacity, opacitySpeed: (Math.random() * 0.005) + 0.002, baseRadius: BASE_RADIUS, currentRadius: BASE_RADIUS });
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
    if (canvas.width !== width || canvas.height !== height || canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height) {
      canvas.width = width; canvas.height = height;
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
          const cellKey = `${mouseCellX + i}_${mouseCellY + j}`;
          if (grid[cellKey]) grid[cellKey].forEach(idx => activeDotIndices.add(idx));
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
        const dx = dot.x - mouseX; const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < INTERACTION_RADIUS_SQ) {
          const t = Math.max(0, 1 - Math.sqrt(distSq) / INTERACTION_RADIUS);
          interactionFactor = t * t;
        }
      }
      const finalOpacity = Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST);
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
    const onMouseLeave = () => { mousePositionRef.current = { x: null, y: null }; };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    animationFrameId.current = requestAnimationFrame(animateDots);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [handleResize, handleMouseMove, animateDots]);

  return (
    <section className="relative w-full flex flex-col items-center justify-center bg-black overflow-hidden pt-36 pb-28 min-h-[88vh]">
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[#0a1a14] z-0 hero-zoom" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />

      {/* Radial green glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.07] pointer-events-none z-20" style={{ background: GREEN }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none z-20" style={{ background: '#62D2A2' }} />

      <div className="relative z-50 flex flex-col items-center text-center px-5 max-w-4xl mx-auto">

        {/* Badge */}
        <div className="hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/90 text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.2)] mb-8">
            <span className="text-[#00c685] font-bold">✨</span>
            <span>Our Story</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-playfair italic font-normal tracking-tight mb-6 hero-anim hero-reveal"
          style={{ letterSpacing: '-0.04em', animationDelay: '0.25s' }}
        >
          <span className="block text-5xl sm:text-7xl md:text-[5.5rem]">Building Trust,</span>
          <span className="block text-5xl sm:text-7xl md:text-[5.5rem] mt-1" style={{ color: GREEN }}>
            One Home at a Time.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl hero-anim hero-fade"
          style={{ animationDelay: '0.65s' }}
        >
          We are a community of believers building an ethical alternative to conventional home insurance —
          rooted in Sharia values, powered by technology, and driven by trust.
        </p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mt-10 hero-anim hero-fade"
          style={{ animationDelay: '0.8s' }}
        >
          <Link
            href="/compare-plans"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg"
            style={{ background: GREEN, boxShadow: `0 8px 32px ${GREEN}40` }}
          >
            Explore Plans <ChevronRight size={15} />
          </Link>
          <Link
            href="#our-story"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            Learn our story
          </Link>
        </motion.div>

        {/* Floating trust pill */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 hero-anim hero-fade" style={{ animationDelay: '0.95s' }}>
          {['Founded 2023 · London, UK', 'AAOIFI Certified', 'FCA Registered'].map((label) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/40 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-[#00c685]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Origin Story ───────────────────────────────────────────────────────── */
function OriginStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="our-story" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Text column */}
          <div>
            <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: '-100px' }}>
              <motion.div variants={itemVariants}>
                <PillBadge text="How We Started" className="mb-6" />
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-6 leading-[1.15] tracking-[-0.02em]">
                Born from a gap in the market — and a gap in conscience.
              </motion.h2>
              {[
                'In 2023, our founders struggled to find home insurance that aligned with their faith. Every product available charged interest, kept profits, and gave nothing back.',
                'So we built Takaful: a community-owned protection model where every member contributes to a shared pool — managed transparently, and returned if unused.',
                'Today, over 50,000 homes across the UK are protected by their community, not a corporation. We are just getting started.',
              ].map((line, i) => (
                <motion.p key={i} variants={itemVariants} className="text-gray-600 leading-relaxed text-[1.0625rem] mb-4">
                  {line}
                </motion.p>
              ))}
              <motion.div variants={itemVariants} className="mt-8">
                <Link
                  href="/compare-plans"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg"
                  style={{ background: GREEN }}
                >
                  See our plans <ChevronRight size={15} />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Image column */}
          <motion.div
            ref={ref}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            <img src="/transparent-flower.jpg" alt="Community Protection" className="w-full h-[480px] object-cover" />
            {/* Floating card overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${GREEN}20` }}>
                  <Users size={16} style={{ color: GREEN }} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">50,000+ Protected Homes</p>
                  <p className="text-[11px] text-gray-500">Across the United Kingdom</p>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${GREEN}, #62D2A2)` }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: '94%' } : {}}
                  transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 font-mono">Community trust score: 94 / 100</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─── Mission & Vision ───────────────────────────────────────────────────── */
function MissionVision() {
  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden" whileInView="visible" variants={containerVariants}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="Purpose" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            What we believe and where we are going
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">
            Our mission and vision guide every product decision, every community interaction, and every line of code.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }} viewport={{ once: true, margin: '-80px' }}
            className="group p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#00c685]/30 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: `${GREEN}15` }}>
              <Heart size={22} style={{ color: GREEN }} />
            </div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-3">Our Mission</div>
            <h3 className="text-2xl md:text-3xl font-normal font-playfair italic text-gray-900 mb-4 leading-tight">
              Make ethical home protection accessible to every family.
            </h3>
            <p className="text-gray-500 leading-relaxed">
              We exist to offer a Sharia-compliant, transparent, and genuinely community-owned home protection model —
              where every contribution matters, every claim is honoured, and every surplus is returned.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }} viewport={{ once: true, margin: '-80px' }}
            className="group p-8 rounded-3xl bg-[#0a1a14] border border-white/5 hover:border-[#00c685]/30 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: `${GREEN}20` }}>
              <Globe size={22} style={{ color: GREEN }} />
            </div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/30 mb-3">Our Vision</div>
            <h3 className="text-2xl md:text-3xl font-normal font-playfair italic text-white mb-4 leading-tight">
              The world's most trusted ethical insurance ecosystem.
            </h3>
            <p className="text-white/50 leading-relaxed">
              A future where the Takaful model replaces conventional insurance globally — starting in the UK,
              expanding across Europe, and ultimately serving the 1.8 billion Muslims who deserve better options.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Impact Numbers ────────────────────────────────────────────────────── */
const impactStats = [
  { target: 50, suffix: 'K+', label: 'Homes Protected' },
  { prefix: '£', target: 24, suffix: 'M', label: 'Surplus Returned' },
  { textValue: '4.9 ★', label: 'Member Rating' },
  { target: 48, suffix: 'hr', label: 'Avg. Claims Payout' },
];

function ImpactNumbers() {
  return (
    <section className="w-full bg-[#0a1a14] text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-[#0a1a14] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="mb-8"
        >
          <PillBadge text="Our Impact" dark />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl font-normal font-playfair italic text-white leading-tight mb-4 max-w-3xl"
        >
          Numbers that tell the real story.{' '}
          <span className="text-gray-400 text-xl sm:text-2xl lg:text-3xl font-medium">
            Every figure represents a family who chose community over corporations.
          </span>
        </motion.h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pointer-events-auto">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
            >
              <DotCard
                target={stat.target}
                prefix={stat.prefix}
                suffix={stat.suffix}
                textValue={stat.textValue}
                label={stat.label}
                duration={3000}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Core Values ───────────────────────────────────────────────────────── */
const values = [
  {
    icon: Users,
    title: 'Community First',
    desc: 'Every product decision starts with one question: does this genuinely serve our members? We are the community, not a company serving the community.',
  },
  {
    icon: Eye,
    title: 'Radical Transparency',
    desc: 'Every dirham is tracked publicly. Pool size, claims paid, surplus accumulated — all live on your dashboard. No hidden fees, ever.',
  },
  {
    icon: Shield,
    title: 'Ethical by Design',
    desc: 'Sharia compliance is not a checkbox for us. It is the foundation. Every product, investment, and process is reviewed by independent scholars.',
  },
  {
    icon: Zap,
    title: 'Technology-Powered',
    desc: 'We use modern AI and automation to make our process faster, fairer, and cheaper — passing all savings directly to our members.',
  },
  {
    icon: Lock,
    title: 'Trust & Security',
    desc: 'Bank-level encryption, FCA-registered operations, and full GDPR compliance. Your data and your money are always protected.',
  },
  {
    icon: Leaf,
    title: 'Long-term Thinking',
    desc: 'We optimise for community health over generations, not quarterly earnings. Our surplus model ensures we grow with our members, not at their expense.',
  },
];

function CoreValues() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden" whileInView="visible" variants={containerVariants}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="What We Stand For" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            Six values. One unbreakable promise.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">
            These are not aspirations — they are the operating principles we hold ourselves accountable to, every day.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                viewport={{ once: true, margin: '-60px' }}
                className="group p-7 rounded-2xl border border-gray-200 bg-white hover:border-[#00c685]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-default"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300" style={{ background: `${GREEN}15` }}>
                  <Icon size={20} style={{ color: GREEN }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Team ──────────────────────────────────────────────────────────────── */
const team = [
  {
    name: 'Yusuf Al-Rashid',
    role: 'CEO & Co-founder',
    bio: 'Former Goldman Sachs. 12 years in Islamic finance. Passionate about ethical financial systems.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amira Hassan',
    role: 'CTO & Co-founder',
    bio: 'Ex-DeepMind engineer. Obsessed with making complex systems human and accessible.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Omar Farouq',
    role: 'Head of Sharia Compliance',
    bio: 'PhD in Islamic Economics. Advisor to three FCA-registered institutions across Europe.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fatima Al-Khalil',
    role: 'Head of Product',
    bio: 'Previously at Monzo and Revolut. Believes great products are built on empathy, not assumptions.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  },
];

function Team() {
  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden" whileInView="visible" variants={containerVariants}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="The People" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            Behind every policy, a real human.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">
            Our founding team brings together expertise in finance, technology, and Islamic scholarship.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-60px' }}
              className="group cursor-default"
            >
              {/* Photo */}
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white text-[13px] leading-relaxed">{member.bio}</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-[15px] tracking-tight">{member.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Join the team nudge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }} viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-gray-500 mb-4">Want to help build the future of ethical insurance?</p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:border-[#00c685] hover:text-[#00c685] transition-all duration-300"
          >
            See open roles <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Milestones / Our Journey ───────────────────────────────────────────── */
const milestones = [
  {
    year: '2023',
    quarter: 'Q1',
    title: 'The Idea',
    desc: 'Frustrated by a market that ignored Muslim homeowners, three founders met in a London coffee shop and decided to build the alternative.',
    img: '/step1.jpg',
  },
  {
    year: '2023',
    quarter: 'Q3',
    title: 'Regulatory Approval',
    desc: 'After 8 months of work, Takaful received FCA registration and AAOIFI Sharia certification — making it one of the first in the UK.',
    img: '/step3.jpg',
  },
  {
    year: '2024',
    quarter: 'Q1',
    title: 'First 1,000 Members',
    desc: 'We launched publicly and reached 1,000 protected homes within 60 days. £420K in surplus was returned at the first year-end.',
    img: '/step4.jpg',
  },
  {
    year: '2025',
    quarter: 'Now',
    title: '50K+ Homes & Growing',
    desc: 'Today we protect over 50,000 families. We are expanding coverage types, launching in France and Germany, and hiring for our next chapter.',
    img: '/step5.jpg',
  },
];

function OurJourney() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-20"
          initial="hidden" whileInView="visible" variants={containerVariants}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="Our Journey" className="mb-6" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            Two years. Thousands of families. One mission.
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gray-200" />

          {milestones.map((m, i) => {
            const isEven = i % 2 === 0;
            return (
              <MilestoneRow key={m.title} milestone={m} index={i} isEven={isEven} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MilestoneRow({ milestone, index, isEven }: { milestone: typeof milestones[0]; index: number; isEven: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative flex items-start mb-16 last:mb-0">
      {/* LEFT */}
      <motion.div
        className={`flex-1 ${isEven ? 'md:pr-16' : 'md:order-2 md:pl-16'}`}
        initial={{ opacity: 0, x: isEven ? -32 : 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease }}
      >
        {isEven ? (
          <div className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#00c685]/30 hover:shadow-lg transition-all duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: GREEN }}>{milestone.quarter} {milestone.year}</span>
            </div>
            <h3 className="text-xl font-normal font-playfair italic text-gray-900 mb-2 leading-tight">{milestone.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
          </div>
        ) : (
          <div className="hidden md:block">
            <img src={milestone.img} alt={milestone.title} className="w-full h-56 object-cover rounded-2xl shadow-xl" />
          </div>
        )}
        {/* Mobile: always show card then image */}
        <div className="md:hidden mt-4">
          {isEven ? (
            <img src={milestone.img} alt={milestone.title} className="w-full h-44 object-cover rounded-2xl shadow-lg" />
          ) : (
            <div className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#00c685]/30 transition-all duration-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: GREEN }}>{milestone.quarter} {milestone.year}</span>
              </div>
              <h3 className="text-xl font-normal font-playfair italic text-gray-900 mb-2">{milestone.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="hidden md:flex w-12 h-12 rounded-full items-center justify-center shrink-0 z-10 font-mono font-bold text-[11px] mx-1"
        style={{ background: `${GREEN}15`, color: GREEN, boxShadow: `0 0 0 4px white, 0 8px 24px ${GREEN}30` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      {/* RIGHT */}
      <motion.div
        className={`flex-1 ${isEven ? 'md:order-2 md:pl-16' : 'md:pr-16'}`}
        initial={{ opacity: 0, x: isEven ? 32 : -32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease }}
      >
        {isEven ? (
          <div className="hidden md:block">
            <img src={milestone.img} alt={milestone.title} className="w-full h-56 object-cover rounded-2xl shadow-xl" />
          </div>
        ) : (
          <div className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#00c685]/30 hover:shadow-lg transition-all duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: GREEN }}>{milestone.quarter} {milestone.year}</span>
            </div>
            <h3 className="text-xl font-normal font-playfair italic text-gray-900 mb-2 leading-tight">{milestone.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Trust Bar ─────────────────────────────────────────────────────────── */
function TrustBar() {
  const badges = [
    { icon: Shield, label: 'AAOIFI Sharia Certified' },
    { icon: Globe, label: 'FCA Registered' },
    { icon: Lock, label: 'ISO 27001 Secured' },
    { icon: Star, label: '4.9 / 5 Trustpilot' },
    { icon: Check, label: 'No Hidden Fees' },
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {badges.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${GREEN}15` }}>
                <Icon size={13} style={{ color: GREEN }} />
              </div>
              {label}
              {i < badges.length - 1 && <span className="hidden sm:block ml-4 text-gray-200">·</span>}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Final CTA (exact pattern from how-it-works) ───────────────────────── */
function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG_DARK }}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[140px] opacity-10" style={{ background: GREEN }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[120px] opacity-[0.08]" style={{ background: '#62D2A2' }} />
      </div>
      <BackgroundBeams />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, margin: '-100px' }}>
          <motion.div variants={itemVariants}>
            <PillBadge text="Get Started Today" dark className="mb-8" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-playfair italic font-normal text-white mb-6 leading-[1.1] tracking-[-0.02em]">
            Ready to protect your home?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands of families who have made the ethical choice. Get your personalized Takaful quote in under 60 seconds.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-95"
              style={{ background: GREEN, boxShadow: `0 8px 32px ${GREEN}50` }}
            >
              Get Started <ChevronRight size={16} />
            </Link>
            <Link
              href="/#contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </motion.div>
          <motion.p variants={itemVariants} className="text-neutral-600 text-sm mt-8">
            No credit card required · Cancel anytime · Sharia-certified
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <Hero />
      <OriginStory />
      <MissionVision />
      <ImpactNumbers />
      <CoreValues />
      <Team />
      <OurJourney />
      <TrustBar />
      <FinalCTA />
      <HoverFooter />
    </main>
  );
}
