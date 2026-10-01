"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  User,
  Calendar,
  Building2,
  Hash,
  BadgeCheck,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Check,
  Copy,
  Share,
} from "lucide-react";
import { QuoteReadyCardProps } from "../types/quote.types";

export function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (v) => parseFloat(v.toFixed(2)).toFixed(2));
  useEffect(() => {
    if (isInView) spring.set(value);
  }, [spring, value, isInView]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

export function PayField({
  label,
  id,
  placeholder,
  type = "text",
  maxLength,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  id: string;
  placeholder: string;
  type?: string;
  maxLength?: number;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-wide block mb-1.5 text-white/40">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          className={`w-full ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 rounded-xl border border-white/8 bg-white/[0.04] text-white placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors text-sm h-10`}
        />
      </div>
    </div>
  );
}

export function PaySteps({ current }: { current: number }) {
  const steps = ["Details", "Direct debit", "Confirm"];
  return (
    <div className="flex items-center gap-0 w-full mb-6">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                i < current
                  ? "bg-[#00c685] border-[#00c685] text-[#0a1a14]"
                  : i === current
                  ? "border-[#00c685] text-[#00c685] bg-transparent"
                  : "border-white/15 text-gray-600 bg-transparent"
              }`}
            >
              {i < current ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span
              className={`text-[9px] font-semibold tracking-wide ${
                i === current ? "text-[#00c685]" : "text-gray-600"
              }`}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 mb-4 transition-all ${
                i < current ? "bg-[#00c685]/60" : "bg-white/8"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function PaySuccessScreen({
  quoteRef,
  plan,
  pc,
}: {
  quoteRef: string;
  plan: string;
  pc: string;
}) {
  const router = useRouter();
  const label =
    plan === "buildings"
      ? "Buildings Only"
      : plan === "contents"
      ? "Contents Only"
      : "Buildings & Contents";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
        className="w-20 h-20 rounded-full bg-[#00c685]/15 border-2 border-[#00c685]/40 flex items-center justify-center mx-auto"
      >
        <CheckCircle2 size={36} className="text-[#00c685]" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Cover Activated!</h2>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
          Your Takaful <span className="text-white font-medium">{label}</span> cover for{" "}
          <span className="text-white font-mono font-semibold">{pc}</span> is now active.
        </p>
      </div>
      <div className="rounded-2xl border border-[#00c685]/20 bg-[#00c685]/5 px-5 py-4 space-y-1 text-left">
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Reference</p>
        <p className="text-white font-mono font-bold text-lg">{quoteRef}</p>
        <p className="text-[11px] text-gray-500">
          Keep this for your records. A confirmation email is on its way.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          router.push("/portal");
        }}
        className="w-full py-3 rounded-xl bg-[#00c685] hover:bg-[#00b576] text-[#0a1a14] font-bold text-sm transition-colors cursor-pointer"
      >
        Go to My Portal
      </button>
    </motion.div>
  );
}

export function PayFormEmbed({
  quoteRef,
  coverType,
  postcode,
  emailAddress,
  monthlyEstimate,
  onBack,
}: {
  quoteRef: string;
  coverType: string;
  postcode: string;
  emailAddress: string;
  monthlyEstimate: string;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(emailAddress || "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [accNum, setAccNum] = useState("");
  const [bankName, setBankName] = useState("");

  const handleSortCode = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 6);
    setSortCode(d.replace(/(\d{2})(?=\d)/g, "$1-").slice(0, 8));
  };
  const validateStep0 = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email.");
      return false;
    }
    return true;
  };
  const validateStep1 = () => {
    const sc = sortCode.replace(/\D/g, "");
    const an = accNum.replace(/\D/g, "");
    if (sc.length !== 6) {
      setError("Sort code must be 6 digits (e.g. 20-00-00).");
      return false;
    }
    if (an.length !== 8) {
      setError("Account number must be 8 digits.");
      return false;
    }
    return true;
  };
  const handleNext = () => {
    setError("");
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDone(true);
      }, 1800);
      return;
    }
    setStep((s) => s + 1);
  };
  if (done) return <PaySuccessScreen quoteRef={quoteRef} plan={coverType} pc={postcode} />;
  const label =
    coverType === "both"
      ? "Buildings & Contents"
      : coverType === "buildings"
      ? "Buildings Only"
      : "Contents Only";

  const stepContent = [
    <div key="s0" className="space-y-4">
      <PayField
        label="Full name"
        id="fn"
        placeholder="John Smith"
        value={fullName}
        onChange={setFullName}
        icon={User}
      />
      <PayField
        label="Email address"
        id="em"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
      />
      <div className="grid grid-cols-2 gap-3">
        <PayField
          label="Phone (optional)"
          id="ph"
          type="tel"
          placeholder="+44 7700 000000"
          value={phone}
          onChange={setPhone}
        />
        <PayField
          label="Date of birth"
          id="db"
          type="date"
          placeholder=""
          value={dob}
          onChange={setDob}
          icon={Calendar}
        />
      </div>
    </div>,
    <div key="s1" className="space-y-4">
      <div className="rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 p-3.5 flex gap-3 text-xs text-gray-400 leading-relaxed text-left">
        <ShieldCheck size={14} className="text-[#00c685] shrink-0 mt-0.5" />
        <span>
          Your bank details are encrypted and never stored on our servers. Direct debit is processed
          under the UK Direct Debit Guarantee.
        </span>
      </div>
      <PayField
        label="Bank / Building society name"
        id="bn"
        placeholder="e.g. HSBC"
        value={bankName}
        onChange={setBankName}
        icon={Building2}
      />
      <div className="grid grid-cols-2 gap-3">
        <PayField
          label="Sort code"
          id="sc"
          placeholder="20-00-00"
          value={sortCode}
          onChange={handleSortCode}
          maxLength={8}
          icon={Hash}
        />
        <PayField
          label="Account number"
          id="ac"
          placeholder="12345678"
          value={accNum}
          onChange={(v) => setAccNum(v.replace(/\D/g, "").slice(0, 8))}
          maxLength={8}
          icon={Hash}
        />
      </div>
      <p className="text-[11px] text-gray-600 text-left">
        By continuing, you authorise Takaful UK Ltd to collect{" "}
        <span className="text-white font-semibold">£{monthlyEstimate}</span> monthly under Service User
        Number 123456. You can cancel at any time.
      </p>
    </div>,
    <div key="s2" className="space-y-4">
      <div className="rounded-xl border border-white/8 bg-white/[0.02] divide-y divide-white/5 text-sm">
        {[
          ["Quote reference", quoteRef],
          ["Policy holder", fullName || "—"],
          ["Email", email || "—"],
          ["Cover type", label],
          ["Postcode", postcode],
          ["Bank", bankName || "—"],
          ["Account", accNum ? `••••••${accNum.slice(-2)}` : "—"],
          ["Monthly amount", `£${monthlyEstimate}`],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-gray-500 text-xs">{k}</span>
            <span className="text-gray-100 text-xs font-semibold text-right max-w-[55%] truncate">
              {v}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed text-left">
        By clicking <span className="text-white">&quot;Confirm &amp; Activate&quot;</span> you agree to
        Takaful&apos;s Terms of Participation and the Direct Debit mandate above.
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
          className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/8 px-3.5 py-3 text-xs text-red-400"
        >
          <AlertCircle size={13} className="shrink-0 mt-0.5" /> {error}
        </motion.div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setError("");
            step > 0 ? setStep((s) => s - 1) : onBack();
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
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00c685] to-[#00a871] disabled:opacity-60 text-[#0a1a14] font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#00c685]/20 cursor-pointer text-sm"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="40"
                strokeDashoffset="10"
                strokeLinecap="round"
              />
            </svg>
          ) : step === 2 ? (
            <>
              <BadgeCheck size={15} /> Confirm &amp; Activate
            </>
          ) : (
            <>
              {step === 0 ? "Continue" : "Review & Confirm"} <ChevronRight size={14} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

export function QuoteReadyCard({
  postcode,
  email,
  monthlyEstimate,
  coverType,
  bedrooms,
  accidentalDamage,
  legalExpenses,
  homeEmergency,
  onBack,
  compareUrl,
}: QuoteReadyCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });
  const val = parseFloat(monthlyEstimate);
  const scaleMin = 20,
    scaleMax = 90,
    typicalLow = 25,
    typicalHigh = 42;
  const clampedVal = Math.min(Math.max(val, scaleMin), scaleMax);
  const positionPct = ((clampedVal - scaleMin) / (scaleMax - scaleMin)) * 100;
  const typicalStartPct = ((typicalLow - scaleMin) / (scaleMax - scaleMin)) * 100;
  const typicalWidthPct = ((typicalHigh - typicalLow) / (scaleMax - scaleMin)) * 100;
  const isLow = val < typicalLow,
    isTypical = val >= typicalLow && val <= typicalHigh;
  const positionLabel = isLow
    ? "below the typical range"
    : isTypical
    ? "within the typical community range"
    : "above the typical range";
  const addons = [
    accidentalDamage && "Accidental Damage",
    legalExpenses && "Legal Expenses",
    homeEmergency && "Home Emergency",
  ].filter(Boolean) as string[];
  const coverLabel =
    coverType === "both"
      ? "Buildings & Contents"
      : coverType === "buildings"
      ? "Buildings Only"
      : "Contents Only";
  const [shareOpen, setShareOpen] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const quoteRef = React.useMemo(() => `TK-${Date.now().toString(36).toUpperCase().slice(-6)}`, []);
  const paymentLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/pay?ref=${quoteRef}&plan=${encodeURIComponent(
          coverType
        )}&pc=${encodeURIComponent(postcode)}`
      : "";
  const shareText = `My Takaful home cover quote: £${monthlyEstimate}/month (${coverLabel}) — ${postcode}.`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[520px] mt-16 z-10 text-white"
    >
      <div className="rounded-2xl border border-white/10 bg-[#0a1a14]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
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
              {showPayment ? "Activate Your Cover" : "Quote Summary"}
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
            {/* Monthly metric */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500 font-mono mb-1">
                Monthly Contribution
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  £{val.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 font-mono">/month</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Based on {bedrooms} bed property in <span className="font-mono text-white/70">{postcode}</span>.
              </p>
            </div>

            {/* Position bar */}
            <div className="space-y-2">
              <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 bg-[#00c685]/30"
                  style={{ left: `${typicalStartPct}%`, width: `${typicalWidthPct}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-2 bg-[#00c685] rounded-full shadow-[0_0_8px_#00c685]"
                  style={{ left: `calc(${positionPct}% - 4px)` }}
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Your quote is <span className="text-[#00c685] font-semibold">{positionLabel}</span>.
              </p>
            </div>

            {addons.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500 font-mono">
                  Selected Add-ons
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {addons.map((a) => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-gray-200"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowPayment(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00c685] to-[#00a871] text-[#0a1a14] font-bold text-sm shadow-lg shadow-[#00c685]/20 hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
              >
                Proceed to Payment <ChevronRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => router.push(compareUrl)}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
              >
                Compare with Other Plans
              </button>
            </div>
          </div>
        )}

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
