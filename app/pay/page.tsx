'use client';


import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from '@/components/ui/particles';
import {
  ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowLeft,
  Building2, Zap, HeartHandshake, ChevronRight, AlertCircle,
  BadgeCheck, User, Calendar, Hash,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function coverLabel(plan: string) {
  if (plan === 'buildings') return 'Buildings Only';
  if (plan === 'contents')  return 'Contents Only';
  return 'Buildings & Contents';
}

function planMonthly(plan: string) {
  // Rough base — same logic as get-quote
  if (plan === 'buildings') return '22.00';
  if (plan === 'contents')  return '18.00';
  return '35.00';
}

// ─── Form field ───────────────────────────────────────────────────────────────
function Field({
  label, id, placeholder, type = 'text', maxLength, value, onChange, icon: Icon,
}: {
  label: string; id: string; placeholder: string; type?: string;
  maxLength?: number; value: string; onChange: (v: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5">
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

// ─── Step indicator ───────────────────────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = ['Your details', 'Direct debit', 'Confirm'];
  return (
    <div className="flex items-center gap-0">
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

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ ref: quoteRef, plan, pc }: { ref: string; plan: string; pc: string }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center space-y-6"
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
          Your Takaful <span className="text-white font-medium">{coverLabel(plan)}</span> cover
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
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 rounded-xl bg-[#00c685] hover:bg-[#00b576] text-[#0a1a14] font-bold text-sm transition-colors cursor-pointer"
        >
          Go to Dashboard
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 text-sm font-medium transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Pay Form ────────────────────────────────────────────────────────────
function PayForm() {
  const params   = useSearchParams();
  const router   = useRouter();
  const ref      = params.get('ref')  || 'TK-XXXXXX';
  const plan     = params.get('plan') || 'both';
  const pc       = params.get('pc')   || '—';
  const monthly  = planMonthly(plan);

  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Step 0 — personal
  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [dob,       setDob]       = useState('');

  // Step 1 — direct debit
  const [sortCode,  setSortCode]  = useState('');
  const [accNum,    setAccNum]    = useState('');
  const [bankName,  setBankName]  = useState('');

  // Step 2 — confirm (read-only)

  const validateStep0 = () => {
    if (!fullName.trim())                        { setError('Please enter your full name.'); return false; }
    if (!email.trim() || !email.includes('@'))   { setError('Please enter a valid email address.'); return false; }
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
      // Simulate payment processing
      setLoading(true);
      setTimeout(() => { setLoading(false); setDone(true); }, 1800);
      return;
    }
    setStep(s => s + 1);
  };

  // Format sort code as user types
  const handleSortCode = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 6);
    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1-').slice(0, 8);
    setSortCode(formatted);
  };

  if (done) {
    return <SuccessScreen ref={ref} plan={plan} pc={pc} />;
  }

  const stepContent = [
    // ── Step 0: Personal details ──────────────────────────────────────────────
    <div key="step0" className="space-y-4">
      <Field label="Full name" id="fullName" placeholder="John Smith" value={fullName} onChange={setFullName} icon={User} />
      <Field label="Email address" id="email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone (optional)" id="phone" type="tel" placeholder="+44 7700 000000" value={phone} onChange={setPhone} />
        <Field label="Date of birth" id="dob" type="date" placeholder="" value={dob} onChange={setDob} icon={Calendar} />
      </div>
    </div>,

    // ── Step 1: Direct debit ─────────────────────────────────────────────────
    <div key="step1" className="space-y-4">
      <div className="rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 p-3.5 flex gap-3 text-xs text-gray-400 leading-relaxed">
        <ShieldCheck size={14} className="text-[#00c685] shrink-0 mt-0.5" />
        <span>Your bank details are encrypted and never stored on our servers. Direct debit is processed under the UK Direct Debit Guarantee.</span>
      </div>
      <Field label="Bank / Building society name" id="bankName" placeholder="e.g. HSBC" value={bankName} onChange={setBankName} icon={Building2} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sort code" id="sortCode" placeholder="20-00-00" value={sortCode} onChange={handleSortCode} maxLength={8} icon={Hash} />
        <Field label="Account number" id="accNum" placeholder="12345678" value={accNum} onChange={v => setAccNum(v.replace(/\D/g, '').slice(0, 8))} maxLength={8} icon={Hash} />
      </div>
      <p className="text-[11px] text-gray-600">
        By continuing, you authorise Takaful UK Ltd to collect <span className="text-white font-semibold">£{monthly}</span> monthly from your account under Service User Number 123456. You can cancel at any time.
      </p>
    </div>,

    // ── Step 2: Confirm ───────────────────────────────────────────────────────
    <div key="step2" className="space-y-4">
      <div className="rounded-xl border border-white/8 bg-white/[0.02] divide-y divide-white/5 text-sm">
        {[
          ['Quote reference', ref],
          ['Policy holder',   fullName || '—'],
          ['Email',           email    || '—'],
          ['Cover type',      coverLabel(plan)],
          ['Postcode',        pc],
          ['Bank',            bankName || '—'],
          ['Account',         accNum   ? `••••••${accNum.slice(-2)}` : '—'],
          ['Monthly amount',  `£${monthly}`],
          ['First payment',   'Today'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-gray-500 text-xs">{k}</span>
            <span className="text-gray-100 text-xs font-semibold text-right max-w-[55%] truncate">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed">
        By clicking <span className="text-white">"Confirm & Activate"</span> you agree to Takaful's Terms of Participation and the Direct Debit mandate above.
      </p>
    </div>,
  ];

  return (
    <div className="space-y-6">
      <Steps current={step} />

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
          className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/8 px-3.5 py-3 text-xs text-red-400"
        >
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          {error}
        </motion.div>
      )}

      <div className="flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => { setError(''); setStep(s => s - 1); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-gray-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} /> Back
          </button>
        )}
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

// ─── Page shell ───────────────────────────────────────────────────────────────
function PayPageInner() {
  const params  = useSearchParams();
  const plan    = params.get('plan') || 'both';
  const monthly = planMonthly(plan);

  return (
    <div className="relative min-h-screen w-full bg-[#0a1a14] flex flex-col items-center justify-center py-12 px-4 overflow-x-hidden">
      <Particles color="#00c685" quantity={60} ease={24} className="absolute inset-0 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,198,133,0.06)_0,transparent_100%)] absolute top-0 w-full h-[60vh]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[460px] z-10"
      >
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0a1a14]/80 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00c685]/15 border border-[#00c685]/25 flex items-center justify-center">
                  <ShieldCheck size={15} className="text-[#00c685]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Activate Your Cover</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Takaful Home Protection</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-mono">Monthly</p>
                <p className="text-lg font-bold text-white">£{monthly}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-5">
            <Suspense>
              <PayForm />
            </Suspense>
          </div>

          {/* Trust footer */}
          <div className="px-6 pb-5 pt-1 flex items-center justify-center gap-5">
            {[
              { icon: Lock,          label: 'SSL Encrypted' },
              { icon: HeartHandshake, label: 'Sharia-Certified' },
              { icon: Zap,           label: 'Instant Cover' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                <Icon size={11} className="text-[#00c685]/50" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-4">
          Authorised and regulated by the FCA · Takaful UK Ltd © 2025
        </p>
      </motion.div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0a1a14] flex items-center justify-center">
        <div className="text-sm font-semibold tracking-wider uppercase text-[#00c685] animate-pulse">Loading...</div>
      </div>
    }>
      <PayPageInner />
    </Suspense>
  );
}
