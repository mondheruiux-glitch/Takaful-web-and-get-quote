'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Calendar, MapPin, Building, Key, Download,
  HelpCircle, Check, Copy, CheckCheck, Flame, Droplets,
  Wind, Home, Shield, Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { CERTIFICATES } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease, delay: i * 0.05 },
  }),
};

export default function MyCoverPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [copiedCert, setCopiedCert] = useState(false);

  // Load Participant Fatima Al-Rashid's active certificate
  const cert = CERTIFICATES.find(c => c.participantId === 'P-0042') || CERTIFICATES[0];

  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const BG_SURFACE = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)';
  const BG_SUBTLE = isLight ? '#f8faf9' : 'rgba(255,255,255,0.02)';
  const TEXT_MAIN = isLight ? '#111827' : '#ffffff';
  const TEXT_SUB = isLight ? '#4b5563' : 'rgba(255,255,255,0.6)';
  const TEXT_MUTED = isLight ? '#9ca3af' : 'rgba(255,255,255,0.35)';

  const handleCopyCert = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cert.id);
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    // Generate simple print/save flow
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">
      
      {/* ── 1. Editorial Header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="space-y-4"
      >
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${
          isLight ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white/[0.04] border-white/[0.08] text-white/70'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          Certificate of Cover
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]" style={{ color: TEXT_MAIN }}>
              My Cover Details
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: TEXT_SUB }}>
              Comprehensive Shariah-certified protection schedule for your property and belongings.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto ${
              isLight ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
            }`}
          >
            <Download size={15} />
            Download Certificate PDF
          </button>
        </div>
      </motion.div>

      {/* ── 2. Primary Certificate Card with Glowing Border ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div
          className="relative overflow-hidden rounded-3xl border transition-all duration-300"
          style={{ background: BG_SURFACE, borderColor: BORDER }}
        >
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={70}
            inactiveZone={0.01}
            borderWidth={1}
          />

          {/* Certificate Reference Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
                  Certificate Reference
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-base font-bold" style={{ color: TEXT_MAIN }}>
                    {cert.id}
                  </span>
                  <button
                    onClick={handleCopyCert}
                    type="button"
                    className={`p-1 rounded-md transition-all ${
                      isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/50'
                    }`}
                    title="Copy Certificate ID"
                  >
                    {copiedCert ? <CheckCheck size={14} className="text-[#00c685]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
                Active · Shariah Certified
              </span>
            </div>
          </div>

          {/* Property & Contribution Details */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                Insured Property
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#00c685]" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TEXT_MAIN }}>
                      {cert.propertyAddress}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SUB }}>
                      Birmingham, United Kingdom
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building size={16} className="shrink-0 opacity-40" />
                  <span className="text-xs" style={{ color: TEXT_SUB }}>
                    {cert.propertyType} · 4 Bedrooms · Brick & Tile (1998)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                Mutual Contributions & Term
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: TEXT_SUB }}>Monthly Contribution</span>
                  <span className="font-semibold text-sm" style={{ color: TEXT_MAIN }}>
                    £{cert.monthlyContribution.toFixed(2)} / month
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: TEXT_SUB }}>Payment Method</span>
                  <span className="font-medium" style={{ color: TEXT_MAIN }}>
                    Direct Debit (Bank of Scotland •••• 1242)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: TEXT_SUB }}>Cover Period</span>
                  <span className="font-medium" style={{ color: TEXT_MAIN }}>
                    {cert.startDate} – {cert.renewalDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Limits */}
          <div className="px-6 sm:px-8 py-6 border-t" style={{ borderColor: BORDER, background: BG_SUBTLE }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: TEXT_MUTED }}>
              Cover Limits & Excess
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                  Buildings Reinstatement
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1 tracking-tight" style={{ color: TEXT_MAIN }}>
                  £{cert.buildingsLimit.toLocaleString()}
                </p>
                <p className="text-[11px] mt-1 leading-snug" style={{ color: TEXT_SUB }}>
                  Full rebuild & structural restoration
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                  Contents Cover
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1 tracking-tight" style={{ color: TEXT_MAIN }}>
                  £{cert.contentsLimit.toLocaleString()}
                </p>
                <p className="text-[11px] mt-1 leading-snug" style={{ color: TEXT_SUB }}>
                  New-for-old replacement value
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                  Compulsory Excess
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1 tracking-tight" style={{ color: TEXT_MAIN }}>
                  £300
                </p>
                <p className="text-[11px] mt-1 leading-snug" style={{ color: TEXT_SUB }}>
                  Standard claim contribution
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                  Voluntary Excess
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1 tracking-tight text-[#00c685]">
                  £0
                </p>
                <p className="text-[11px] mt-1 leading-snug" style={{ color: TEXT_SUB }}>
                  No extra voluntary excess
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 3. Mutually Shared Covered Risks ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="space-y-4"
      >
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
            Mutually Shared Covered Risks
          </h2>
          <p className="text-sm mt-1" style={{ color: TEXT_SUB }}>
            Your home and possessions are protected against all major perils under standard Takaful rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cert.coveredRisks.map((risk) => (
            <div
              key={risk}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.12]' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                <Check size={13} strokeWidth={2.5} />
              </div>
              <span className="text-xs sm:text-sm font-medium" style={{ color: TEXT_MAIN }}>
                {risk}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 4. Shariah Governance & Help Footer ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className={`rounded-3xl p-6 sm:p-8 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
          isLight ? 'bg-gray-50/80 border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'
        }`}
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#00c685]" />
            <h4 className="text-sm font-semibold" style={{ color: TEXT_MAIN }}>
              Need to adjust your cover or report changes?
            </h4>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
            If you plan home renovations, change your locks, or need higher high-value item limits, our team can update your certificate instantly with zero administration fees.
          </p>
        </div>

        <Link
          href="/dashboard/support"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all hover:opacity-80 shrink-0 ${
            isLight ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          Contact Support Desk
          <ArrowRight size={13} />
        </Link>
      </motion.div>

    </div>
  );
}
