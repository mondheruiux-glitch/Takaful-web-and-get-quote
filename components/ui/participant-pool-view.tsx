'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';
import { POOL } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};

export function ParticipantPoolView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const BG_SURFACE = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)';
  const BG_SUBTLE = isLight ? '#f8faf9' : 'rgba(255,255,255,0.02)';
  const TEXT_MAIN = isLight ? '#111827' : '#ffffff';
  const TEXT_SUB = isLight ? '#4b5563' : 'rgba(255,255,255,0.6)';
  const TEXT_MUTED = isLight ? '#9ca3af' : 'rgba(255,255,255,0.35)';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">

      {/* ── 1. Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]" style={{ color: TEXT_MAIN }}>
              Community Pool
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: TEXT_SUB }}>
              See how the shared fund that protects your home is doing.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── 2. How it works ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className={`rounded-3xl p-6 sm:p-8 border ${
          isLight ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-emerald-500/[0.04] border-emerald-500/15'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/15 text-emerald-400'
          }`}>
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold tracking-tight" style={{ color: isLight ? '#065f46' : '#34d399' }}>
              How it works
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
              Everyone pays into a shared pool. If your home or a neighbour&apos;s home is damaged, the pool pays for repairs. If there&apos;s money left at the end of the year, it stays with members — never taken as profit.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── 3. Pool Highlights Snapshot Card ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div
          className="relative overflow-hidden rounded-3xl border transition-all duration-300"
          style={{ background: BG_SURFACE, borderColor: BORDER }}
        >
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
                Community Fund Balance
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#00c685]">
                £{POOL.balance.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: TEXT_SUB }}>
                The shared fund protecting all members
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
                Paid Out to Members
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT_MAIN }}>
                £{POOL.totalClaimsPaid.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: TEXT_SUB }}>
                Paid out to rebuild and fix member homes
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
                Protected Homes
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT_MAIN }}>
                1,248
              </p>
              <p className="text-xs" style={{ color: TEXT_SUB }}>
                UK households protecting each other
              </p>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-4 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: BORDER, background: BG_SUBTLE }}>
            <span className="text-xs font-medium" style={{ color: TEXT_MUTED }}>
              Fund Health: <strong style={{ color: TEXT_MAIN }}>2.8x the required reserve</strong> to cover any claims
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={13} />
              Audited &amp; Secure
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── 4. Where your money goes ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
            Where your money goes
          </h2>
          <p className="text-sm mt-0.5" style={{ color: TEXT_SUB }}>
            For every £100 you pay, here&apos;s exactly how it&apos;s split.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              pct: '78%', amount: '£78',
              title: 'Helps other members',
              desc: 'Goes directly into the claims fund — used to pay for home repairs, floods, and emergencies.',
              color: '#00c685',
            },
            {
              pct: '14%', amount: '£14',
              title: 'Emergency reserve',
              desc: 'Kept aside for extreme weather seasons like major storms, so the fund never runs short.',
              color: '#3b82f6',
            },
            {
              pct: '8%', amount: '£8',
              title: 'Running the platform',
              desc: 'Covers the digital platform, customer service, and 24/7 claims support.',
              color: '#8b5cf6',
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`p-5 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.12]' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="font-bold text-sm px-3 py-1 rounded-xl shrink-0"
                    style={{ background: `${item.color}18`, color: item.color }}
                  >
                    {item.pct}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TEXT_MAIN }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SUB }}>{item.desc}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-11 sm:pl-0">
                  <p className="text-base font-bold" style={{ color: item.color }}>{item.amount}</p>
                  <p className="text-[10px]" style={{ color: TEXT_MUTED }}>per £100</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 5. Independently verified ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
        className={`rounded-3xl p-6 sm:p-8 border ${
          isLight ? 'bg-gray-50/80 border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={17} className="text-[#00c685]" />
            <h4 className="text-sm font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
              Independently verified
            </h4>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
            Registered scholars audit Takaful UK regularly to confirm all money is held in interest-free accounts and no prohibited investments are made.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {['No interest charged', 'No hidden fees', 'Surplus returned to members'].map((txt) => (
              <div key={txt} className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={14} className="text-[#00c685] shrink-0" />
                <span style={{ color: TEXT_MAIN }}>{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
