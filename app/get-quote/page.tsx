'use client';


import React, { useState, Suspense, useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Particles } from '@/components/ui/particles';
import { Meteors } from '@/components/ui/meteors';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Home, Building2, Layers, Trees, Building,
  Plus, Minus, MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  HeartHandshake, Info, Bed, Bath, Sofa, ChefHat,
  Grid, Calendar, ShieldCheck, Laptop, Gem, Tv,
  User, Mail, Phone, AlertTriangle, Shield, Check,
  Lock, Bell, Eye, Package, Flame, Droplets,
  BriefcaseBusiness, Zap, Scale, Wrench, ChevronDown, Pencil,
  Key, Thermometer, Activity, Clock, Sparkles, CircleSlash,
  Share, Copy, BarChart2, TrendingUp, Home as HomeIcon, CreditCard,
  ChevronRight, BadgeCheck, Hash, AlertCircle,
} from 'lucide-react';

// ─── Quote Ready Card ─────────────────────────────────────────────────────────
function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (v) =>
    parseFloat(v.toFixed(2)).toFixed(2)
  );
  useEffect(() => { if (isInView) spring.set(value); }, [spring, value, isInView]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─── Payment Flow Subcomponents (Embedded) ───────────────────────────────────
function PayField({
  label, id, placeholder, type = 'text', maxLength, value, onChange, icon: Icon,
}: {
  label: string; id: string; placeholder: string; type?: string;
  maxLength?: number; value: string; onChange: (v: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-xs font-medium text-gray-400">{label}</label>
      <div className="relative">
        {Icon && <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          className={`w-full ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 rounded-xl border border-white/10 bg-neutral-900/60 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00c685]/60 focus:ring-2 focus:ring-[#00c685]/10 transition-all text-sm h-10`}
        />
      </div>
    </div>
  );
}

function PaySteps({ current }: { current: number }) {
  const steps = ['Details', 'Direct debit', 'Confirm'];
  return (
    <div className="flex items-center gap-0 w-full mb-6">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? 'bg-[#00c685] border-[#00c685] text-[#0a1a14]'
              : i === current ? 'border-[#00c685] text-[#00c685] bg-transparent'
              : 'border-white/15 text-gray-600 bg-transparent'
            }`}>
              {i < current ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-[9px] font-semibold tracking-wide ${i === current ? 'text-[#00c685]' : 'text-gray-600'}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-4 transition-all ${i < current ? 'bg-[#00c685]/60' : 'bg-white/8'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function PaySuccessScreen({ quoteRef, plan, pc }: { quoteRef: string; plan: string; pc: string }) {
  const router = useRouter();
  const label = plan === 'buildings' ? 'Buildings Only' : plan === 'contents' ? 'Contents Only' : 'Buildings & Contents';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center space-y-6 py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 12 }}
        className="w-20 h-20 rounded-full bg-[#00c685]/15 border-2 border-[#00c685]/40 flex items-center justify-center mx-auto"
      >
        <CheckCircle2 size={36} className="text-[#00c685]" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Cover Activated!</h2>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
          Your Takaful <span className="text-white font-medium">{label}</span> cover
          for <span className="text-white font-mono font-semibold">{pc}</span> is now active.
        </p>
      </div>

      <div className="rounded-2xl border border-[#00c685]/20 bg-[#00c685]/5 px-5 py-4 space-y-1 text-left">
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Reference</p>
        <p className="text-white font-mono font-bold text-lg">{quoteRef}</p>
        <p className="text-[11px] text-gray-500">Keep this for your records. A confirmation email is on its way.</p>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl bg-[#00c685] hover:bg-[#00b576] text-[#0a1a14] font-bold text-sm transition-colors cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

function PayFormEmbed({
  quoteRef, coverType, postcode, emailAddress, monthlyEstimate, onBack
}: {
  quoteRef: string; coverType: string; postcode: string; emailAddress: string; monthlyEstimate: string; onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 0 — personal
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(emailAddress || '');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  // Step 1 — direct debit
  const [sortCode, setSortCode] = useState('');
  const [accNum, setAccNum] = useState('');
  const [bankName, setBankName] = useState('');

  const validateStep0 = () => {
    if (!fullName.trim()) { setError('Please enter your full name.'); return false; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return false; }
    return true;
  };

  const validateStep1 = () => {
    const sc = sortCode.replace(/\D/g, '');
    const an = accNum.replace(/\D/g, '');
    if (sc.length !== 6) { setError('Sort code must be 6 digits (e.g. 20-00-00).'); return false; }
    if (an.length !== 8) { setError('Account number must be 8 digits.'); return false; }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setDone(true); }, 1800);
      return;
    }
    setStep(s => s + 1);
  };

  const handleSortCode = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 6);
    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1-').slice(0, 8);
    setSortCode(formatted);
  };

  if (done) {
    return <PaySuccessScreen quoteRef={quoteRef} plan={coverType} pc={postcode} />;
  }

  const label = coverType === 'both' ? 'Buildings & Contents' : coverType === 'buildings' ? 'Buildings Only' : 'Contents Only';

  const stepContent = [
    // Step 0: Personal
    <div key="step0" className="space-y-4">
      <PayField label="Full name" id="fullName" placeholder="John Smith" value={fullName} onChange={setFullName} icon={User} />
      <PayField label="Email address" id="email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      <div className="grid grid-cols-2 gap-3">
        <PayField label="Phone (optional)" id="phone" type="tel" placeholder="+44 7700 000000" value={phone} onChange={setPhone} />
        <PayField label="Date of birth" id="dob" type="date" placeholder="" value={dob} onChange={setDob} icon={Calendar} />
      </div>
    </div>,

    // Step 1: Direct Debit
    <div key="step1" className="space-y-4">
      <div className="rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 p-3.5 flex gap-3 text-xs text-gray-400 leading-relaxed text-left">
        <ShieldCheck size={14} className="text-[#00c685] shrink-0 mt-0.5" />
        <span>Your bank details are encrypted and never stored on our servers. Direct debit is processed under the UK Direct Debit Guarantee.</span>
      </div>
      <PayField label="Bank / Building society name" id="bankName" placeholder="e.g. HSBC" value={bankName} onChange={setBankName} icon={Building2} />
      <div className="grid grid-cols-2 gap-3">
        <PayField label="Sort code" id="sortCode" placeholder="20-00-00" value={sortCode} onChange={handleSortCode} maxLength={8} icon={Hash} />
        <PayField label="Account number" id="accNum" placeholder="12345678" value={accNum} onChange={v => setAccNum(v.replace(/\D/g, '').slice(0, 8))} maxLength={8} icon={Hash} />
      </div>
      <p className="text-[11px] text-gray-600 text-left">
        By continuing, you authorise Takaful UK Ltd to collect <span className="text-white font-semibold">£{monthlyEstimate}</span> monthly from your account under Service User Number 123456. You can cancel at any time.
      </p>
    </div>,

    // Step 2: Confirm
    <div key="step2" className="space-y-4">
      <div className="rounded-xl border border-white/8 bg-white/[0.02] divide-y divide-white/5 text-sm">
        {[
          ['Quote reference', quoteRef],
          ['Policy holder',   fullName || '—'],
          ['Email',           email    || '—'],
          ['Cover type',      label],
          ['Postcode',        postcode],
          ['Bank',            bankName || '—'],
          ['Account',         accNum   ? `••••••${accNum.slice(-2)}` : '—'],
          ['Monthly amount',  `£${monthlyEstimate}`],
          ['First payment',   'Today'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-gray-500 text-xs">{k}</span>
            <span className="text-gray-100 text-xs font-semibold text-right max-w-[55%] truncate">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed text-left">
        By clicking <span className="text-white">"Confirm & Activate"</span> you agree to Takaful's Terms of Participation and the Direct Debit mandate above.
      </p>
    </div>,
  ];

  return (
    <div className="space-y-6">
      <PaySteps current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          {stepContent[step]}
        </motion.div>
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/8 px-3.5 py-3 text-xs text-red-400 text-left"
        >
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          {error}
        </motion.div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setError('');
            if (step > 0) {
              setStep(s => s - 1);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-gray-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.015 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00c685] to-[#00a871] hover:from-[#00d690] hover:to-[#00b87a] disabled:opacity-60 text-[#0a1a14] font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#00c685]/20 cursor-pointer text-sm"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
          ) : (
            <>
              {step === 2
                ? <><BadgeCheck size={15} /> Confirm &amp; Activate</>
                : <>{step === 0 ? 'Continue' : 'Review & Confirm'} <ChevronRight size={14} /></>
              }
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

interface QuoteReadyCardProps {
  postcode: string;
  email: string;
  monthlyEstimate: string;
  coverType: string;
  bedrooms: number;
  accidentalDamage: boolean;
  legalExpenses: boolean;
  homeEmergency: boolean;
  onBack: () => void;
}

function QuoteReadyCard({
  postcode, email, monthlyEstimate, coverType, bedrooms,
  accidentalDamage, legalExpenses, homeEmergency, onBack,
}: QuoteReadyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-60px' });
  const val = parseFloat(monthlyEstimate);
  // Community contribution scale
  const scaleMin = 20;
  const scaleMax = 90;
  const typicalLow = 25;   // start of typical zone
  const typicalHigh = 42;  // end of typical zone
  const clampedVal = Math.min(Math.max(val, scaleMin), scaleMax);
  const positionPct = ((clampedVal - scaleMin) / (scaleMax - scaleMin)) * 100;
  const typicalStartPct = ((typicalLow - scaleMin) / (scaleMax - scaleMin)) * 100;
  const typicalWidthPct = ((typicalHigh - typicalLow) / (scaleMax - scaleMin)) * 100;
  const isTypical = val >= typicalLow && val <= typicalHigh;
  const isLow = val < typicalLow;
  const positionLabel = isLow ? 'below the typical range' : isTypical ? 'within the typical community range' : 'above the typical range';
  const communityAvg = 32;
  const addons = [
    accidentalDamage && 'Accidental Damage',
    legalExpenses && 'Legal Expenses',
    homeEmergency && 'Home Emergency',
  ].filter(Boolean) as string[];
  const coverLabel = coverType === 'both' ? 'Buildings & Contents' : coverType === 'buildings' ? 'Buildings Only' : 'Contents Only';

  const [shareOpen, setShareOpen] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);

  const quoteRef = React.useMemo(() => `TK-${Date.now().toString(36).toUpperCase().slice(-6)}`, []);
  const paymentLink = typeof window !== 'undefined'
    ? `${window.location.origin}/pay?ref=${quoteRef}&plan=${encodeURIComponent(coverType)}&pc=${encodeURIComponent(postcode)}`
    : `https://takaful.com/pay?ref=${quoteRef}`;
  const shareText = `My Takaful home cover quote: £${monthlyEstimate}/month (${coverLabel}) — ${postcode}.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const shareOptions = [
    {
      label: 'WhatsApp',
      color: 'hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:text-[#25D366]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ),
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + paymentLink)}`,
    },
    {
      label: 'Email',
      color: 'hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400',
      icon: <Mail size={16} className="shrink-0" />,
      href: `mailto:?subject=${encodeURIComponent('My Takaful Home Quote')}&body=${encodeURIComponent(shareText + '\n\n' + paymentLink)}`,
    },
    {
      label: 'X (Twitter)',
      color: 'hover:bg-white/10 hover:border-white/20 hover:text-white',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(paymentLink)}`,
    },
    {
      label: 'LinkedIn',
      color: 'hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 hover:text-[#0077B5]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(paymentLink)}`,
    },
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[520px] mt-16 z-10 text-white"
    >
      {/* ── Card Shell ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0a1a14]/80 backdrop-blur-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00c685]/15 border border-[#00c685]/30 flex items-center justify-center">
              {showPayment ? (
                <ShieldCheck size={15} className="text-[#00c685]" />
              ) : (
                <TrendingUp size={15} className="text-[#00c685]" />
              )}
            </div>
            <span className="text-xs font-semibold tracking-wide text-gray-300">
              {showPayment ? 'Activate Your Cover' : 'Quote Summary'}
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]/60 font-mono bg-[#00c685]/5 border border-[#00c685]/15 px-2.5 py-1 rounded-full">
            Takaful · {coverLabel}
          </span>
        </div>

        {showPayment ? (
          <div className="px-6 py-5">
            <PayFormEmbed
              quoteRef={quoteRef}
              coverType={coverType}
              postcode={postcode}
              emailAddress={email}
              monthlyEstimate={monthlyEstimate}
              onBack={() => setShowPayment(false)}
            />
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">

            {/* ── Main Metric ── */}
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500 font-mono mb-1">Monthly Contribution</p>
                <p className="text-[3.2rem] font-bold tracking-tight text-white leading-none">
                  £<AnimatedCounter value={val} />
                </p>
                <p className="text-xs text-[#00c685] font-medium mt-1.5 flex items-center gap-1">
                  <BarChart2 size={11} />
                  Interest-Free · Sharia-Certified
                </p>
              </div>
            </div>

            {/* ── Cover breakdown ── */}
            <div className="rounded-xl border border-white/6 bg-white/[0.025] divide-y divide-white/5">
              {[
                ['Cover type', coverLabel],
                ['Bedrooms', `${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''}`],
                ['Add-ons', addons.length ? addons.join(', ') : 'None'],
                ['Postcode', postcode || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">{k}</span>
                  <span className="text-xs font-semibold text-gray-200 text-right max-w-[55%] truncate">{v}</span>
                </div>
              ))}
            </div>

            {/* ── Community contribution range ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                  <BarChart2 size={12} className="text-gray-500" />
                  Where your quote sits
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isLow
                    ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                    : isTypical
                    ? 'text-[#00c685] border-[#00c685]/30 bg-[#00c685]/10'
                    : 'text-amber-400 border-amber-400/30 bg-amber-400/10'
                }`}>
                  {isLow ? 'Below typical' : isTypical ? 'Typical range' : 'Above typical'}
                </span>
              </div>

              {/* Slider track */}
              <div className="relative h-5 flex items-center">
                {/* Background track */}
                <div className="w-full h-1.5 rounded-full bg-white/8 relative overflow-hidden">
                  {/* Typical zone highlight */}
                  <motion.div
                    className="absolute h-full bg-[#00c685]/25 rounded-full"
                    style={{ left: `${typicalStartPct}%`, width: `${typicalWidthPct}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 1 : 0 }}
                    transition={{ delay: 0.4 }}
                  />
                </div>

                {/* User's quote dot */}
                <motion.div
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 shadow-lg ${
                    isTypical
                      ? 'bg-[#00c685] border-[#00c685] shadow-[#00c685]/40'
                      : isLow
                      ? 'bg-blue-400 border-blue-400 shadow-blue-400/40'
                      : 'bg-amber-400 border-amber-400 shadow-amber-400/40'
                  }`}
                  style={{ left: `${positionPct}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 14 }}
                >
                  {/* Inner pulse ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isTypical ? 'bg-[#00c685]' : isLow ? 'bg-blue-400' : 'bg-amber-400'
                    }`}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
                  />
                </motion.div>
              </div>

              {/* Scale labels */}
              <div className="flex justify-between text-[10px] text-gray-600 -mt-1">
                <span>£{scaleMin}/mo</span>
                <span className="text-[#00c685]/60 text-[9px]">Typical £{typicalLow}–£{typicalHigh}</span>
                <span>£{scaleMax}/mo</span>
              </div>

              {/* Plain-English summary */}
              <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
                Your contribution of{' '}
                <span className="text-white font-semibold">£{monthlyEstimate}/mo</span>{' '}
                is{' '}
                <span className={isTypical ? 'text-[#00c685]' : isLow ? 'text-blue-400' : 'text-amber-400'}>
                  {positionLabel}
                </span>{' '}
                for your property type in our community pool.
              </p>
            </div>

            {/* ── Primary Pay CTA ── */}
            <motion.button
              type="button"
              onClick={() => setShowPayment(true)}
              whileHover={{ scale: 1.015, boxShadow: '0 0 32px rgba(0,198,133,0.35)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#00c685] to-[#00a871] hover:from-[#00d690] hover:to-[#00b87a] text-[#03120d] font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[#00c685]/25 cursor-pointer group relative overflow-hidden"
            >
              {/* shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#0a1a14]/20 flex items-center justify-center">
                  <CreditCard size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-extrabold leading-tight">Activate Cover &amp; Pay</p>
                  <p className="text-[11px] font-semibold opacity-75 leading-tight">&pound;{monthlyEstimate} / month &bull; Start today</p>
                </div>
                <ArrowRight size={16} className="ml-auto opacity-80 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 py-0.5">
              {[
                { icon: Lock,        text: 'Secure checkout' },
                { icon: ShieldCheck, text: 'Sharia-certified' },
                { icon: Zap,         text: 'Instant activation' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Icon size={11} className="text-[#00c685]/60" />
                  {text}
                </div>
              ))}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex gap-2 pt-1 relative">
              <motion.button
                type="button"
                onClick={onBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm text-gray-300 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <HomeIcon size={14} /> Back to Home
              </motion.button>

              {/* Share button + popover */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setShareOpen(v => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${shareOpen ? 'border-[#00c685]/40 bg-[#00c685]/10 text-[#00c685]' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300'}`}
                >
                  <Share size={14} /> Share
                </motion.button>

                {/* Platform picker dropdown */}
                {shareOpen && (
                  <>
                    {/* click-away backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setShareOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-full right-0 mb-2 w-58 min-w-[220px] rounded-2xl border border-white/10 bg-[#0d2117]/95 backdrop-blur-xl shadow-2xl p-2 z-50"
                    >
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 px-2 pb-1.5 pt-0.5">
                        Share your quote
                      </p>
                      {shareOptions.map(opt => (
                        <a
                          key={opt.label}
                          href={opt.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent text-sm text-gray-400 transition-all cursor-pointer ${opt.color}`}
                        >
                          {opt.icon}
                          <span>{opt.label}</span>
                        </a>
                      ))}

                      <div className="border-t border-white/6 mt-1.5 pt-1.5">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-[#00c685]/10 hover:border-[#00c685]/25 text-sm text-gray-400 hover:text-[#00c685] transition-all cursor-pointer"
                        >
                          {linkCopied
                            ? <><Check size={15} className="text-[#00c685] shrink-0" /><span className="text-[#00c685]">Link copied!</span></>
                            : <><Copy size={15} className="shrink-0" /><span>Copy payment link</span></>
                          }
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <p className="text-[11px] text-gray-600">
            A copy will be sent to <span className="text-gray-400">{email}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c685] animate-pulse" />
            <span className="text-[10px] text-[#00c685]/70 font-mono">Live estimate</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT      = '#00c685';
const INPUT_CLS   = 'w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-neutral-900/60 text-white placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-[#00c685]/15 focus:outline-none focus:border-[#00c685]/60 transition-all h-9 text-sm';
const SELECT_CLS  = 'bg-neutral-900/60 border-white/10 text-white h-9 data-[placeholder]:text-gray-500';
const CONTENT_CLS = 'bg-neutral-900 border-white/10 text-white z-[99999]';

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">{children}</p>;
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <Label htmlFor={htmlFor} className="text-gray-400 text-xs font-medium">{children}</Label>;
}

function TooltipIcon({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={13} className="text-[#00c685] cursor-pointer shrink-0" />
        </TooltipTrigger>
        <TooltipContent className="bg-neutral-900 border-neutral-800 text-white text-xs max-w-[200px]">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Divider() {
  return <div className="border-t border-white/5 my-1" />;
}

function Stepper({ value, onChange, min = 0, max = 20 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer">
        <Minus size={12} />
      </button>
      <span className="text-white text-sm font-semibold w-5 text-center tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer">
        <Plus size={12} />
      </button>
    </div>
  );
}

function RoomRow({ icon: Icon, label, value, onChange }: { icon: React.ElementType; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="text-[#00c685]"><Icon size={14} /></span>
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      <Stepper value={value} onChange={onChange} />
    </div>
  );
}

function CoverTypeCard({ label, description, icon: Icon, selected, onClick }: { label: string; description: string; icon: React.ElementType; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer group ${selected ? 'border-[#00c685]/50 bg-[#00c685]/10 shadow-[0_0_20px_rgba(0,198,133,0.08)]' : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${selected ? 'bg-[#00c685]/20 text-[#00c685]' : 'bg-white/5 text-gray-400 group-hover:text-gray-300'}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className={`text-sm font-semibold leading-tight ${selected ? 'text-white' : 'text-gray-300'}`}>{label}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
        {selected && <Check size={14} className="text-[#00c685] ml-auto shrink-0 mt-1" />}
      </div>
    </button>
  );
}

function ClaimsCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selected ? 'border-[#00c685]/50 bg-[#00c685]/10' : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15'}`}>
      <span className={`text-sm ${selected ? 'text-white font-medium' : 'text-gray-300'}`}>{label}</span>
      {selected && <Check size={14} className="text-[#00c685]" />}
    </button>
  );
}

/** Yes/No toggle row — used in Security step */
function ToggleRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm text-gray-200 font-medium leading-snug">{label}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c685]/40 ${value ? 'bg-[#00c685]' : 'bg-white/10'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

/** Rider checkbox card */
function RiderCard({ icon: Icon, label, desc, selected, onClick }: { icon: React.ElementType; label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${selected ? 'border-[#00c685]/50 bg-[#00c685]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-[#00c685]/20 text-[#00c685]' : 'bg-white/5 text-gray-400'}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-300'}`}>{label}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
        </div>
        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-[#00c685] border-[#00c685]' : 'bg-transparent border-white/20'}`}>
          {selected && <Check size={10} className="text-[#0a1a14]" />}
        </div>
      </div>
    </button>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 6;
const STEP_TITLES = [
  'Home Details',
  'Security & Protection',
  'Cover & Protection',
  'Your Belongings',
  'About You',
  'Review & Customise',
];
const STEP_DESCS = [
  'Tell us about the property you want to protect.',
  'Help us understand how secure your home is.',
  'Choose the type of Takaful cover that suits your home.',
  'Estimate the value of contents inside your home.',
  'A few details about you and your claims history.',
  'Review everything before we generate your quote.',
];
const PROPERTY_TYPES = [
  { label: 'Detached',      value: 'detached',      icon: Home },
  { label: 'Terraced',      value: 'terraced',       icon: Building },
  { label: 'Flat',          value: 'flat',           icon: Layers },
  { label: 'Bungalow',      value: 'bungalow',       icon: Trees },
  { label: 'Semi-detached', value: 'semi-detached',  icon: Building2 },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
function GetQuoteForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [error,       setError]       = useState('');
  const [done,        setDone]        = useState(false);

  // ── Step 1: Home Details ──────────────────────────────────────────
  const [postcode,          setPostcode]          = useState(searchParams.get('postcode') || '');
  const [address,           setAddress]           = useState(searchParams.get('address') || '');
  const [propertyType,      setPropertyType]      = useState('');
  const [bedrooms,          setBedrooms]          = useState(1);
  const [bathrooms,         setBathrooms]         = useState(1);
  const [livingRooms,       setLivingRooms]       = useState(1);
  const [kitchens,          setKitchens]          = useState(1);
  const [otherRooms,        setOtherRooms]        = useState(0);
  // Property Details
  const [yearBuilt,         setYearBuilt]         = useState('');
  const [numFloors,         setNumFloors]          = useState(2);
  const [wallConstruction,  setWallConstruction]  = useState('');
  const [roofType,          setRoofType]          = useState('');
  const [heating,           setHeating]           = useState('');
  // Occupancy
  const [isMainResidence,   setIsMainResidence]   = useState(true);
  const [unoccupiedPeriod,  setUnoccupiedPeriod]  = useState('');
  const [usedForBusiness,   setUsedForBusiness]   = useState('');
  const [bizSelfContained,  setBizSelfContained]  = useState(false);
  const [bizVisitFreq,      setBizVisitFreq]      = useState('');
  const [bizEscorted,       setBizEscorted]       = useState(false);

  // ── Step 2: Security & Protection ────────────────────────────────
  const [doorLocks,        setDoorLocks]        = useState('');
  const [windowLocked,     setWindowLocked]     = useState(false);
  const [burglarAlarm,     setBurglarAlarm]     = useState(false);
  const [alarmMonitored,   setAlarmMonitored]   = useState(false);
  const [smokeAlarms,      setSmokeAlarms]      = useState(true);
  const [hasCCTV,          setHasCCTV]          = useState(false);
  const [hasSafe,          setHasSafe]          = useState(false);
  const [floodRisk,        setFloodRisk]        = useState(false);

  // ── Step 3: Cover & Protection ────────────────────────────────────
  const [coverType,          setCoverType]          = useState('both');
  const [excess,             setExcess]             = useState('250');
  const [coverStartDate,     setCoverStartDate]     = useState('');
  const [accidentalDamage,   setAccidentalDamage]   = useState(false);
  const [legalExpenses,      setLegalExpenses]      = useState(false);
  const [homeEmergency,      setHomeEmergency]      = useState(false);

  // ── Step 4: Belongings ────────────────────────────────────────────
  const [contentsValue,      setContentsValue]      = useState('');
  const [jewellery,          setJewellery]          = useState('');
  const [electronics,        setElectronics]        = useState('');
  const [portableValuables,  setPortableValuables]  = useState(false);

  // ── Step 5: About You + Claims ────────────────────────────────────
  const [hasClaims,    setHasClaims]    = useState('no');
  const [hadFlooding,  setHadFlooding]  = useState(false);
  const [hadSubsidence,setHadSubsidence]= useState(false);
  const [fullName,     setFullName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [adults,       setAdults]       = useState(1);
  const [children,     setChildren]     = useState(0);

  // ── Step 6: Accordion open state ─────────────────────────────────
  const [openSections, setOpenSections] = useState<string[]>([]);
  const toggleSection = (label: string) =>
    setOpenSections(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    if (currentStep === 1 && !propertyType) {
      setError('Please select your property type.'); return false;
    }
    if (currentStep === 5) {
      if (!fullName.trim())                     { setError('Please enter your full name.'); return false; }
      if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email.'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (!validate()) return;
    if (currentStep < TOTAL_STEPS) setCurrentStep(s => s + 1);
    else setDone(true);
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const monthlyEstimate = () => {
    let base = 35;
    if (coverType === 'buildings') base = 22;
    if (coverType === 'contents')  base = 18;
    base += bedrooms * 3;
    const val = parseInt(contentsValue || '0', 10);
    if (val > 30000) base += 8;
    if (val > 50000) base += 12;
    if (parseInt(excess, 10) >= 500) base -= 5;
    if (accidentalDamage) base += 4;
    if (legalExpenses)    base += 2;
    if (homeEmergency)    base += 3;
    if (burglarAlarm)     base -= 2;
    if (hasCCTV)          base -= 1;
    return Math.max(15, base).toFixed(2);
  };

  // ════════════════════════════════════════════════════════════════
  // STEP 1 — HOME DETAILS
  // ════════════════════════════════════════════════════════════════
  const step1 = (
    <div className="space-y-6">

      {/* Property Location */}
      <div className="space-y-3">
        <SectionLabel>Property Location</SectionLabel>
        <div className="space-y-2.5">
          {address && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5">
              <MapPin size={14} className="text-[#00c685] mt-0.5 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium leading-snug">{address}</p>
                <p className="text-[#00c685] text-xs font-mono mt-0.5">{postcode}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className="relative">
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input value={postcode} onChange={e => setPostcode(e.target.value.toUpperCase())}
                placeholder="Postcode" className={INPUT_CLS} />
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Property Type */}
      <div className="space-y-3">
        <SectionLabel>Property Type</SectionLabel>
        <div className="grid grid-cols-5 gap-2">
          {PROPERTY_TYPES.map(({ label, value, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setPropertyType(value)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer ${propertyType === value ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : 'border-white/8 bg-white/[0.02] text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 hover:border-white/15'}`}>
              <Icon size={20} />
              <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Room Details */}
      <div className="space-y-3">
        <SectionLabel>Room Details</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <RoomRow icon={Bed}     label="Bedrooms"     value={bedrooms}     onChange={setBedrooms}    />
          <RoomRow icon={Bath}    label="Bathrooms"    value={bathrooms}    onChange={setBathrooms}   />
          <RoomRow icon={Sofa}    label="Living Rooms" value={livingRooms}  onChange={setLivingRooms} />
          <RoomRow icon={ChefHat} label="Kitchens"     value={kitchens}     onChange={setKitchens}    />
          <RoomRow icon={Grid}    label="Other Rooms"  value={otherRooms}   onChange={setOtherRooms}  />
        </div>
      </div>

      <Divider />

      {/* Property Details */}
      <div className="space-y-3">
        <SectionLabel>Property Details</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="yearBuilt">Year built</FieldLabel>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input id="yearBuilt" value={yearBuilt} onChange={e => setYearBuilt(e.target.value)}
                placeholder="YYYY" maxLength={4} className={INPUT_CLS} />
            </div>
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Number of floors</FieldLabel>
            <div className="flex items-center h-9 px-3 rounded-lg border border-white/10 bg-neutral-900/60">
              <Stepper value={numFloors} onChange={setNumFloors} min={1} max={5} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <FieldLabel htmlFor="wall">Wall construction</FieldLabel>
              <TooltipIcon text="The main material used for external walls." />
            </div>
            <Select value={wallConstruction} onValueChange={setWallConstruction}>
              <SelectTrigger id="wall" className={SELECT_CLS}><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="brick" icon={<Layers className="w-3.5 h-3.5" />}>Brick</SelectItem>
                <SelectItem value="stone" icon={<Gem className="w-3.5 h-3.5" />}>Stone</SelectItem>
                <SelectItem value="timber" icon={<Trees className="w-3.5 h-3.5" />}>Timber frame</SelectItem>
                <SelectItem value="concrete" icon={<Building className="w-3.5 h-3.5" />}>Concrete</SelectItem>
                <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <FieldLabel htmlFor="roof">Roof type</FieldLabel>
              <TooltipIcon text="Flat roofs carry a higher moisture risk." />
            </div>
            <Select value={roofType} onValueChange={setRoofType}>
              <SelectTrigger id="roof" className={SELECT_CLS}><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="pitched-tiles" icon={<Layers className="w-3.5 h-3.5" />}>Pitched – Tiles</SelectItem>
                <SelectItem value="pitched-slate" icon={<Grid className="w-3.5 h-3.5" />}>Pitched – Slate</SelectItem>
                <SelectItem value="flat" icon={<Minus className="w-3.5 h-3.5" />}>Flat</SelectItem>
                <SelectItem value="mixed" icon={<Layers className="w-3.5 h-3.5" />}>Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="heating">Type of heating</FieldLabel>
          <Select value={heating} onValueChange={setHeating}>
            <SelectTrigger id="heating" className={SELECT_CLS}><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="gas-central" icon={<Flame className="w-3.5 h-3.5" />}>Gas Central Heating</SelectItem>
              <SelectItem value="electric" icon={<Zap className="w-3.5 h-3.5" />}>Electric Heating</SelectItem>
              <SelectItem value="oil" icon={<Droplets className="w-3.5 h-3.5" />}>Oil-Fired Heating</SelectItem>
              <SelectItem value="heat-pump" icon={<Wrench className="w-3.5 h-3.5" />}>Heat Pump</SelectItem>
              <SelectItem value="solid-fuel" icon={<Trees className="w-3.5 h-3.5" />}>Solid Fuel</SelectItem>
              <SelectItem value="none" icon={<CircleSlash className="w-3.5 h-3.5" />}>No Central Heating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Divider />

      {/* Occupancy */}
      <div className="space-y-3">
        <SectionLabel>Occupancy</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">

          <ToggleRow
            label="Is this your main residence?"
            hint="Your primary home where you live most of the year."
            value={isMainResidence}
            onChange={setIsMainResidence}
          />

          {!isMainResidence && (
            <div className="py-3 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <FieldLabel htmlFor="unoccupied">How long is it unoccupied per year?</FieldLabel>
              <Select value={unoccupiedPeriod} onValueChange={setUnoccupiedPeriod}>
                <SelectTrigger id="unoccupied" className={SELECT_CLS}><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent className={CONTENT_CLS}>
                  <SelectItem value="lt30" icon={<Clock className="w-3.5 h-3.5" />}>Less than 30 days</SelectItem>
                  <SelectItem value="30-60" icon={<Clock className="w-3.5 h-3.5" />}>30–60 days</SelectItem>
                  <SelectItem value="60-90" icon={<Clock className="w-3.5 h-3.5" />}>60–90 days</SelectItem>
                  <SelectItem value="gt90" icon={<Clock className="w-3.5 h-3.5" />}>More than 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="py-3 space-y-2">
            <FieldLabel htmlFor="business">Is the property used for business?</FieldLabel>
            <Select value={usedForBusiness} onValueChange={setUsedForBusiness}>
              <SelectTrigger id="business" className={SELECT_CLS}><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="no" icon={<CircleSlash className="w-3.5 h-3.5" />}>No</SelectItem>
                <SelectItem value="occasional" icon={<Home className="w-3.5 h-3.5" />}>Occasionally (home office)</SelectItem>
                <SelectItem value="yes-clients" icon={<User className="w-3.5 h-3.5" />}>Yes – clients visit</SelectItem>
                <SelectItem value="yes-no-clients" icon={<Laptop className="w-3.5 h-3.5" />}>Yes – no clients visit</SelectItem>
                <SelectItem value="other" icon={<BriefcaseBusiness className="w-3.5 h-3.5" />}>Other business use</SelectItem>
              </SelectContent>
            </Select>

            {usedForBusiness === 'other' && (
              <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.06] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium leading-snug">Is the office self contained?</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Business visitors won&apos;t pass through residential areas.</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {[true, false].map(v => (
                      <button key={String(v)} type="button" onClick={() => setBizSelfContained(v)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${bizSelfContained === v ? (v ? 'bg-[#00c685] border-[#00c685] text-white shadow-[0_0_12px_#00c68540]' : 'bg-white/10 border-white/20 text-white') : 'bg-transparent border-white/15 text-gray-400 hover:border-white/30 hover:text-white'}`}>
                        {v ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-4 space-y-2">
                  <p className="text-sm text-white font-medium">How frequently do you have business visitors?</p>
                  <Select value={bizVisitFreq} onValueChange={setBizVisitFreq}>
                    <SelectTrigger className={SELECT_CLS}><SelectValue placeholder="Select frequency…" /></SelectTrigger>
                    <SelectContent className={CONTENT_CLS}>
                      <SelectItem value="everyday" icon={<Activity className="w-3.5 h-3.5" />}>Everyday</SelectItem>
                      <SelectItem value="several-week" icon={<Activity className="w-3.5 h-3.5" />}>Several times a week</SelectItem>
                      <SelectItem value="once-week" icon={<Activity className="w-3.5 h-3.5" />}>Once a week</SelectItem>
                      <SelectItem value="occasionally" icon={<Activity className="w-3.5 h-3.5" />}>Occasionally</SelectItem>
                      <SelectItem value="rarely" icon={<Activity className="w-3.5 h-3.5" />}>Rarely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-4">
                  <p className="text-sm text-white font-medium leading-snug min-w-0">Are business visitors escorted on and off the property?</p>
                  <div className="flex items-center gap-1 shrink-0">
                    {[true, false].map(v => (
                      <button key={String(v)} type="button" onClick={() => setBizEscorted(v)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${bizEscorted === v ? (v ? 'bg-[#00c685] border-[#00c685] text-white shadow-[0_0_12px_#00c68540]' : 'bg-white/10 border-white/20 text-white') : 'bg-transparent border-white/15 text-gray-400 hover:border-white/30 hover:text-white'}`}>
                        {v ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 2 — SECURITY & PROTECTION
  // ════════════════════════════════════════════════════════════════
  const step2 = (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionLabel>Locks & Access</SectionLabel>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <FieldLabel htmlFor="doorLocks">Type of locks on external doors</FieldLabel>
            <TooltipIcon text="Multi-point and deadlocks significantly reduce break-in risk." />
          </div>
          <Select value={doorLocks} onValueChange={setDoorLocks}>
            <SelectTrigger id="doorLocks" className={SELECT_CLS}><SelectValue placeholder="Select lock type…" /></SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="multipoint" icon={<Lock className="w-3.5 h-3.5" />}>Multi-point lock</SelectItem>
              <SelectItem value="deadlock" icon={<Key className="w-3.5 h-3.5" />}>Deadlock (5-lever)</SelectItem>
              <SelectItem value="standard" icon={<Shield className="w-3.5 h-3.5" />}>Standard (Yale-type)</SelectItem>
              <SelectItem value="smart" icon={<Laptop className="w-3.5 h-3.5" />}>Smart lock</SelectItem>
              <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow label="Are external windows key-locked?" value={windowLocked} onChange={setWindowLocked} />
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Alarm & Surveillance</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow
            label="Does the property have a burglar alarm?"
            value={burglarAlarm}
            onChange={setBurglarAlarm}
          />
          {burglarAlarm && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <ToggleRow
                label="Is the alarm monitored 24/7 by a security centre?"
                hint="Professionally monitored alarms typically qualify for a premium discount."
                value={alarmMonitored}
                onChange={setAlarmMonitored}
              />
            </div>
          )}
          <ToggleRow label="Does the property have CCTV?" value={hasCCTV} onChange={setHasCCTV} />
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Safety & Storage</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow
            label="Are smoke alarms fitted?"
            hint="A legal requirement in the UK — fitted on each floor."
            value={smokeAlarms}
            onChange={setSmokeAlarms}
          />
          <ToggleRow
            label="Is there a safe on the premises?"
            hint="Bolted safes can allow higher-value item cover."
            value={hasSafe}
            onChange={setHasSafe}
          />
          <ToggleRow
            label="Is the property in a known flood risk area?"
            hint="Check the Environment Agency flood map if unsure."
            value={floodRisk}
            onChange={setFloodRisk}
          />
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 flex gap-3">
        <Shield size={16} className="text-[#00c685] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Security features directly affect your Takaful contribution. Better security means lower risk for the community pool — and a lower monthly amount for you.
        </p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 3 — COVER & PROTECTION
  // ════════════════════════════════════════════════════════════════
  const step3 = (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionLabel>Cover Type</SectionLabel>
        <div className="grid grid-cols-1 gap-2">
          <CoverTypeCard
            label="Buildings & Contents"
            description="Protect both the physical structure and all personal belongings inside."
            icon={ShieldCheck}
            selected={coverType === 'both'}
            onClick={() => setCoverType('both')}
          />
          <CoverTypeCard
            label="Buildings Only"
            description="Cover the structure of your home against structural damage."
            icon={Home}
            selected={coverType === 'buildings'}
            onClick={() => setCoverType('buildings')}
          />
          <CoverTypeCard
            label="Contents Only"
            description="Protect your personal belongings and home appliances."
            icon={Laptop}
            selected={coverType === 'contents'}
            onClick={() => setCoverType('contents')}
          />
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Excess & Start Date</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <FieldLabel htmlFor="excess">Voluntary excess</FieldLabel>
              <TooltipIcon text="A higher excess lowers your monthly contribution but means you pay more in a claim." />
            </div>
            <Select value={excess} onValueChange={setExcess}>
              <SelectTrigger id="excess" className={SELECT_CLS}><SelectValue /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="100" icon={<Scale className="w-3.5 h-3.5" />}>£100</SelectItem>
                <SelectItem value="250" icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]" />}>£250 — Recommended</SelectItem>
                <SelectItem value="500" icon={<Scale className="w-3.5 h-3.5" />}>£500</SelectItem>
                <SelectItem value="1000" icon={<Scale className="w-3.5 h-3.5" />}>£1,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="coverStart">Cover start date</FieldLabel>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                id="coverStart"
                type="date"
                value={coverStartDate}
                onChange={e => setCoverStartDate(e.target.value)}
                className={`${INPUT_CLS} [color-scheme:dark]`}
              />
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <SectionLabel>Optional Add-ons</SectionLabel>
          <span className="text-[10px] text-gray-500 font-medium">(select any that apply)</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <RiderCard
            icon={Zap}
            label="Accidental Damage Cover"
            desc="Covers sudden, unexpected damage by you or your family."
            selected={accidentalDamage}
            onClick={() => setAccidentalDamage(v => !v)}
          />
          <RiderCard
            icon={Scale}
            label="Legal Expenses Cover"
            desc="Up to £100,000 for property disputes and employment tribunals."
            selected={legalExpenses}
            onClick={() => setLegalExpenses(v => !v)}
          />
          <RiderCard
            icon={Wrench}
            label="Home Emergency Cover"
            desc="24/7 assistance for boiler breakdowns, burst pipes, and more."
            selected={homeEmergency}
            onClick={() => setHomeEmergency(v => !v)}
          />
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 4 — YOUR BELONGINGS
  // ════════════════════════════════════════════════════════════════
  const step4 = (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionLabel>Contents Valuation</SectionLabel>
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'contentsValue', label: 'Estimated total contents value', icon: Home,  val: contentsValue, set: setContentsValue, placeholder: 'e.g. 25000', tip: 'Include furniture, appliances, clothing, and other household items.' },
            { id: 'jewellery',     label: 'High-value jewellery & watches', icon: Gem,   val: jewellery,     set: setJewellery,     placeholder: 'e.g. 5000',  tip: 'Items over £1,000 each may need to be listed separately.' },
            { id: 'electronics',   label: 'Electronics & gadgets',          icon: Tv,    val: electronics,   set: setElectronics,   placeholder: 'e.g. 3000',  tip: 'Laptops, phones, TVs, cameras, etc.' },
          ].map(({ id, label, icon: Icon, val, set, placeholder, tip }) => (
            <div key={id} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00c685]"><Icon size={14} /></span>
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
                <TooltipIcon text={tip} />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">£</span>
                <input id={id} value={val} onChange={e => set(e.target.value)}
                  placeholder={placeholder} className={`${INPUT_CLS} pl-8`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Away from Home</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4">
          <ToggleRow
            label="Do you take valuables outside the home?"
            hint="e.g. laptops, cameras, jewellery, phones on the go."
            value={portableValuables}
            onChange={setPortableValuables}
          />
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Under-insuring your contents can leave you out of pocket. We recommend estimating generously — your contribution difference is small but your protection is far greater.
        </p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 5 — ABOUT YOU + CLAIMS
  // ════════════════════════════════════════════════════════════════
  const step5 = (
    <div className="space-y-6">

      {/* Claims History */}
      <div className="space-y-3">
        <SectionLabel>Claims History</SectionLabel>
        <div className="space-y-1.5">
          <FieldLabel>Home insurance claims in the last 5 years?</FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            <ClaimsCard label="No claims"              selected={hasClaims === 'no'}   onClick={() => setHasClaims('no')}   />
            <ClaimsCard label="Yes — 1 claim"          selected={hasClaims === 'yes-1'} onClick={() => setHasClaims('yes-1')} />
            <ClaimsCard label="Yes — 2 claims"         selected={hasClaims === 'yes-2'} onClick={() => setHasClaims('yes-2')} />
            <ClaimsCard label="Yes — 3 or more claims" selected={hasClaims === 'yes-3+'} onClick={() => setHasClaims('yes-3+')} />
          </div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow label="Any flooding incidents in the last 5 years?" value={hadFlooding}   onChange={setHadFlooding}   />
          <ToggleRow label="Any subsidence issues?"                       value={hadSubsidence} onChange={setHadSubsidence} />
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 flex gap-3">
        <Shield size={16} className="text-[#00c685] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          In Takaful, honest disclosure ensures fairness for the entire community pool. All disclosures are handled with strict confidentiality.
        </p>
      </div>

      <Divider />

      {/* Personal Details */}
      <div className="space-y-3">
        <SectionLabel>Personal Details</SectionLabel>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[#00c685]"><User size={14} /></span>
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
            </div>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className={INPUT_CLS} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00c685]"><Mail size={14} /></span>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
              </div>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={INPUT_CLS} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00c685]"><Phone size={14} /></span>
                <FieldLabel htmlFor="phone">Phone <span className="text-gray-600">(optional)</span></FieldLabel>
              </div>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07123 456789" className={INPUT_CLS} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Household */}
      <div className="space-y-3">
        <SectionLabel>Household</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-300">Adults (18+)</span>
            <Stepper value={adults} onChange={setAdults} min={1} max={10} />
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-300">Children under 18</span>
            <Stepper value={children} onChange={setChildren} min={0} max={10} />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed border-t border-white/5 pt-4">
        By submitting you agree to receive your quote by email. We will never sell your details or contact you without consent.
      </p>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // STEP 6 — REVIEW & CUSTOMISE
  // ════════════════════════════════════════════════════════════════
  const propertyLabel = propertyType
    ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1).replace('-', '\u2011')
    : '—';

  const reviewSections = [
    {
      label: 'Home',
      step: 1,
      rows: [
        ['Postcode',               postcode || '—'],
        ['Type',                   propertyLabel],
        ['Bedrooms / Bathrooms',   `${bedrooms} bd · ${bathrooms} ba`],
        ['Living Rooms / Kitchens',`${livingRooms} · ${kitchens}`],
        ['Year Built',             yearBuilt || '—'],
        ['Floors',                 String(numFloors)],
        ['Wall / Roof',            `${wallConstruction || '—'} / ${roofType || '—'}`],
        ['Main Residence',         isMainResidence ? 'Yes' : 'No'],
        ['Business Use',           usedForBusiness || 'No'],
      ],
    },
    {
      label: 'Security',
      step: 2,
      rows: [
        ['Door Locks',    doorLocks || '—'],
        ['Window Locks',  windowLocked ? 'Yes' : 'No'],
        ['Burglar Alarm', burglarAlarm ? (alarmMonitored ? 'Yes — monitored' : 'Yes') : 'No'],
        ['Smoke Alarms',  smokeAlarms ? 'Yes' : 'No'],
        ['CCTV',          hasCCTV ? 'Yes' : 'No'],
        ['Flood Risk',    floodRisk ? 'Yes' : 'No'],
      ],
    },
    {
      label: 'Cover',
      step: 3,
      rows: [
        ['Cover Type',      coverType === 'both' ? 'Buildings & Contents' : coverType === 'buildings' ? 'Buildings Only' : 'Contents Only'],
        ['Voluntary Excess',`£${excess}`],
        ['Start Date',      coverStartDate || '—'],
        ['Add-ons',         [accidentalDamage && 'Accidental', legalExpenses && 'Legal', homeEmergency && 'Emergency'].filter(Boolean).join(', ') || 'None'],
      ],
    },
    {
      label: 'Belongings',
      step: 4,
      rows: [
        ['Contents Value',   contentsValue ? `£${contentsValue}` : '—'],
        ['Jewellery',        jewellery ? `£${jewellery}` : '—'],
        ['Electronics',      electronics ? `£${electronics}` : '—'],
        ['Portable Valuables', portableValuables ? 'Yes' : 'No'],
      ],
    },
    {
      label: 'About You',
      step: 5,
      rows: [
        ['Name',     fullName || '—'],
        ['Email',    email    || '—'],
        ['Household', `${adults} adult${adults !== 1 ? 's' : ''}, ${children} child${children !== 1 ? 'ren' : ''}`],
        ['Claims History', hasClaims === 'no' ? 'No claims' : hasClaims],
      ],
    },
  ];

  const step6 = (
    <div className="space-y-4">


      

      {/* ── Collapsible Review Sections ── */}
      <div className="space-y-2">
        {reviewSections.map(section => {
          const isOpen = openSections.includes(section.label);
          return (
            <div key={section.label} className="rounded-xl border border-white/8 overflow-hidden">
              {/* Accordion Header */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleSection(section.label)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection(section.label); } }}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer select-none"
              >
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#00c685]">
                  {section.label}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setCurrentStep(section.step); }}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#00c685] transition-colors font-medium cursor-pointer"
                    aria-label={`Edit ${section.label}`}
                  >
                    <Pencil size={10} />
                    Edit
                  </button>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div className="border-t border-white/5">
                  {section.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center px-4 py-2.5 border-b border-white/5 last:border-0 bg-white/[0.01]">
                      <span className="text-gray-400 text-sm">{k}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[55%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-600 text-center pt-1">
        Tap any section to review · Click Edit to make changes
      </p>
    </div>
  );

  const STEPS = [step1, step2, step3, step4, step5, step6];

  return (
    <div className="relative min-h-screen w-full bg-[#0a1a14] flex flex-col items-center py-10 px-4 overflow-x-hidden">
      <Particles color={ACCENT} quantity={90} ease={20} className="absolute inset-0 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,198,133,0.05)_0,transparent_100%)] absolute top-0 w-full h-[60vh]" />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50">
        <img src="/logo-light.png" alt="Takaful" className="h-6" />
      </Link>

      {!done ? (
        <div className="w-full max-w-[700px] mt-16 z-10">
          {error && (
            <Alert variant="destructive" className="mb-3 bg-red-950/20 border-red-900/30 text-red-300 py-2.5">
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <MultiStepForm
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title={STEP_TITLES[currentStep - 1]}
            description={STEP_DESCS[currentStep - 1]}
            onBack={handleBack}
            onNext={handleNext}
            onClose={() => router.push('/')}
            nextButtonText={currentStep === TOTAL_STEPS ? 'Generate Quote' : 'Continue'}
            backButtonText="Back"
            footerContent={
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                <HeartHandshake size={13} className="text-[#00c685]" />
                Sharia-compliant protection
              </div>
            }
          >
            {STEPS[currentStep - 1]}
          </MultiStepForm>
        </div>
      ) : (
        <QuoteReadyCard
          postcode={postcode}
          email={email}
          monthlyEstimate={monthlyEstimate()}
          coverType={coverType}
          bedrooms={bedrooms}
          accidentalDamage={accidentalDamage}
          legalExpenses={legalExpenses}
          homeEmergency={homeEmergency}
          onBack={() => router.push('/')}
        />
      )}
    </div>
  );
}

export default function GetQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0a1a14] flex items-center justify-center text-white">
        <div className="text-sm font-semibold tracking-wider uppercase text-[#00c685] animate-pulse">Loading Quote Engine...</div>
      </div>
    }>
      <GetQuoteForm />
    </Suspense>
  );
}
