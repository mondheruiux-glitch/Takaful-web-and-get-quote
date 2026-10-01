'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { X, ChevronRight, User, Mail, Tag, FileText, CheckCircle2, Send, MessageCircle, ChevronDown } from 'lucide-react';
import { DotCanvas } from '@/components/ui/dot-canvas';
import { PillBadge } from '@/components/ui/pill-badge';

const Particles = dynamic(
  () => import('@/components/ui/particles').then(m => ({ default: m.Particles })),
  { ssr: false }
);

const HoverFooter = dynamic(
  () => import('@/components/ui/hover-footer-demo').then(m => ({ default: m.HoverFooter })),
  { ssr: false }
);

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const GREEN = '#00c685';
const BG_DARK = '#0a1a14';
const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    ['Home', '/'],
    ['How it Works', '/how-it-works'],
    ['Compare Plans', '/compare-plans'],
    ['About Us', '/about'],
    ['Contact', '/contact'],
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-500">
        <Link href="/"><img src="/brand/logo-light.png" alt="Takaful" className="h-6 transition-all duration-500" fetchPriority="high" /></Link>
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-2 items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                href === '/contact'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/80 hover:bg-white/30 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/portal" className="hidden md:block text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-300 text-white/90 hover:bg-white/10">My Portal</Link>
          <Link href="/signup" className="hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white text-gray-900">Sign Up</Link>
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-full text-white hover:bg-white/10" aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 right-0 h-full w-full max-w-xs bg-white z-[201] p-6 flex flex-col justify-between shadow-2xl">
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"><X size={24} /></button>
              <div className="mt-14 flex flex-col gap-1">
                {links.map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors">{label}</Link>
                ))}
              </div>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 bg-[#00c685] hover:bg-[#00a871] text-white font-bold rounded-full transition-all">Sign Up</Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Form Field ────────────────────────────────────────────────────────── */
function FormField({
  label, id, placeholder, type = 'text', value, onChange,
  icon: Icon, required = false,
}: {
  label: string; id: string; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void;
  icon?: React.ElementType; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}{required && <span className="text-[#00c685] ml-0.5">*</span>}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00c685] focus:ring-2 focus:ring-[#00c685]/20 transition-all text-sm`}
        />
      </div>
    </div>
  );
}

/* ─── Select Field ───────────────────────────────────────────────────────── */
function SelectField({
  label, id, value, onChange, options, icon: Icon, required = false,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; options: string[];
  icon?: React.ElementType; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}{required && <span className="text-[#00c685] ml-0.5">*</span>}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10" />}
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          className={`w-full appearance-none ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#00c685] focus:ring-2 focus:ring-[#00c685]/20 transition-all text-sm cursor-pointer [&>option]:bg-[#0d2219] [&>option]:text-white`}
        >
          <option value="" className="text-white/40">Select a category…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Contact Form ───────────────────────────────────────────────────────── */
const categories = [
  'General Enquiry',
  'Technical Support',
  'Claims Assistance',
  'Billing & Payments',
  'Sharia Compliance',
  'Partnership',
  'Press & Media',
  'Other',
];

function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="text-center space-y-5 py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ background: `${GREEN}20`, border: `2px solid ${GREEN}50` }}
        >
          <CheckCircle2 size={36} style={{ color: GREEN }} />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Message received!</h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
            Thank you, <span className="font-semibold text-white/80">{fullName}</span>. Our team will get back to you within 24 hours.
          </p>
        </div>
        <motion.button
          onClick={() => { setSubmitted(false); setFullName(''); setEmail(''); setCategory(''); setSubject(''); setAgreed(false); }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="text-sm font-semibold px-6 py-2.5 rounded-full border border-white/15 text-white/60 hover:bg-white/5 transition-all"
        >
          Send another message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" id="fullName" placeholder="Jane Smith" value={fullName} onChange={setFullName} icon={User} required />
        <FormField label="Email" id="email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} icon={Mail} required />
      </div>
      <SelectField label="Category" id="category" value={category} onChange={setCategory} options={categories} icon={Tag} required />
      <FormField label="Subject" id="subject" placeholder="How can we help you?" value={subject} onChange={setSubject} icon={FileText} required />

      {/* Privacy radio */}
      <div className="flex items-start gap-3 pt-1">
        <button
          type="button"
          id="privacy-agree"
          onClick={() => setAgreed(v => !v)}
          className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          style={{
            borderColor: agreed ? GREEN : 'rgba(255,255,255,0.2)',
            background: agreed ? GREEN : 'rgba(255,255,255,0.05)',
          }}
          aria-pressed={agreed}
        >
          {agreed && <CheckCircle2 size={11} className="text-white" strokeWidth={3} />}
        </button>
        <label htmlFor="privacy-agree" className="text-xs text-white/40 leading-relaxed cursor-pointer" onClick={() => setAgreed(v => !v)}>
          BY REACHING OUT TO US, YOU AGREE TO OUR{' '}
          <Link href="/privacy-policy" className="font-semibold underline underline-offset-2" style={{ color: GREEN }}>
            Privacy Policy
          </Link>
        </label>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !agreed}
        whileHover={{ scale: loading || !agreed ? 1 : 1.015 }}
        whileTap={{ scale: loading || !agreed ? 1 : 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, ${GREEN}, #00a871)`,
          color: BG_DARK,
          boxShadow: `0 8px 24px ${GREEN}35`,
        }}
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
          </svg>
        ) : (
          <><Send size={15} /> Send Message</>
        )}
      </motion.button>
    </form>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a1a14] tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero — auth-style Particles background */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-[#0a1a14]">
        {/* Particles layer */}
        <Particles color="#00c685" quantity={120} ease={20} className="absolute inset-0" />
        <div aria-hidden className="absolute inset-0 isolate -z-10 contain-strict">
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.01)_50%,transparent_80%)] absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21rem] -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.04)_0,rgba(0,198,133,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-[80rem] w-[15rem] [translate:5%_-50%] -rotate-45 rounded-full" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <PillBadge text="Contact Us" className="mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-6xl font-normal font-heading text-white mb-5 tracking-[-0.03em] leading-[1.08]"
          >
            How can we{' '}
            <span style={{ color: GREEN }}>help?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-white/70 text-lg leading-relaxed"
          >
            If you have any questions, reach out to our team for help.
            <br className="hidden sm:block" />
            We typically respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Form section — dark with Particles background (matches hero) */}
      <section className="pb-28 bg-[#0a1a14] relative overflow-hidden">
        {/* Same Particles + radial gradient as hero */}
        <Particles color="#00c685" quantity={80} ease={20} className="absolute inset-0 pointer-events-none" />
        <div aria-hidden className="absolute inset-0 isolate -z-10 contain-strict">
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.01)_50%,transparent_80%)] absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21rem] -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.04)_0,rgba(0,198,133,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-[80rem] w-[15rem] [translate:5%_-50%] -rotate-45 rounded-full" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            viewport={{ once: true }}
            className="bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/30 p-8 md:p-10"
          >
            {/* Card header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${GREEN}18` }}>
                <MessageCircle size={18} style={{ color: GREEN }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">Contact us</h2>
                <p className="text-xs text-white/35">For general enquiries and technical support</p>
              </div>
            </div>

            <p className="text-sm text-white/45 leading-relaxed mb-7 pl-[52px]">
              Send your query using the form below and a member of our team will get back to you.
            </p>

            <div className="h-px bg-white/8 mb-7" />

            <ContactForm />
          </motion.div>
        </div>
      </section>

      <HoverFooter />
    </main>
  );
}
