'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PieChart, Info, ShieldCheck, AlertCircle, ChevronDown, ChevronUp,
  Activity, CreditCard, FileText, ArrowUpRight, TrendingUp, TrendingDown,
  Building, BookOpen, AlertTriangle, ArrowRight, CheckCircle2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TakafulPoolBarChart } from '@/components/ui/takaful-pool-bar-chart';
import { useTheme, useRole } from '../ThemeRoleContext';
import { POOL, POOL_HISTORY, CONTRIBUTION_TREND } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};

const GREEN = '#00c685';

function ChartTooltip({ active, payload, label, theme }: any) {
  if (!active || !payload?.length) return null;
  const isLight = theme === 'light';
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl transition-colors duration-200"
      style={{
        background: isLight ? '#ffffff' : '#0d2117',
        border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
        color: isLight ? '#000000' : '#ffffff'
      }}>
      <p className={`${isLight ? 'text-black/50' : 'text-white/50'} mb-1.5`}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={isLight ? 'text-black/70' : 'text-white/70'}>{p.name}:</span>
          <span className="font-semibold">£{Math.abs(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, sub, color, tooltip, theme }: { label: string; value: string; sub: string; color: string; tooltip: string; theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-200 ${isLight ? 'shadow-sm' : ''}`} style={{ background: isLight ? '#ffffff' : '#0d2117', border: `1px solid ${BORDER}` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-black/45' : 'text-white/40'}`}>{label}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={11} className={`${isLight ? 'text-black/35' : 'text-white/30'} cursor-help`} />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs bg-black/90 border-white/[0.05] text-white p-2 rounded-lg">{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      </div>
      <p className={`text-2xl font-bold tracking-tight ${isLight ? 'text-black/90' : 'text-white'}`}>{value}</p>
      <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/30'}`}>{sub}</p>
    </div>
  );
}

/* ─── Participant view: Simplified transparency (Editorial) ───────────────── */
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

      {/* ── 2. How it works (was: Takaful Mutual Principle wall of text) ── */}
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
            {/* Renamed from "The Takaful Mutual Principle" */}
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
              Audited & Secure
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── 4. Where your money goes (was: "Contribution Breakdown") ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
            Where your money goes
          </h2>
          <p className="text-sm mt-0.5" style={{ color: TEXT_SUB }}>
            For every £100 you pay, here’s exactly how it’s split.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              pct: '78%',
              amount: '£78',
              // Renamed from "Mutual Participant Pool"
              title: 'Helps other members',
              desc: 'Goes directly into the claims fund — used to pay for home repairs, floods, and emergencies.',
              color: '#00c685',
            },
            {
              pct: '14%',
              amount: '£14',
              // Renamed from "Claims Contingency Reserve"
              title: 'Emergency reserve',
              desc: 'Kept aside for extreme weather seasons like major storms, so the fund never runs short.',
              color: '#3b82f6',
            },
            {
              pct: '8%',
              amount: '£8',
              // Renamed from "Wakala Operating Fee"
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
                    <p className="text-sm font-semibold" style={{ color: TEXT_MAIN }}>
                      {item.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SUB }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-11 sm:pl-0">
                  <p className="text-base font-bold" style={{ color: item.color }}>
                    {item.amount}
                  </p>
                  <p className="text-[10px]" style={{ color: TEXT_MUTED }}>
                    per £100
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 5. Independently verified (was: "Shariah Supervisory Board") ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        className={`rounded-3xl p-6 sm:p-8 border ${
          isLight ? 'bg-gray-50/80 border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={17} className="text-[#00c685]" />
            {/* Renamed from "Independent Shariah Supervisory Board" */}
            <h4 className="text-sm font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
              Independently verified
            </h4>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
            Registered scholars audit Takaful UK regularly to confirm all money is held in interest-free accounts and no prohibited investments are made.
          </p>

          {/* Plain-English checks replacing Arabic term badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} className="text-[#00c685] shrink-0" />
              <span style={{ color: TEXT_MAIN }}>No interest charged</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} className="text-[#00c685] shrink-0" />
              <span style={{ color: TEXT_MAIN }}>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} className="text-[#00c685] shrink-0" />
              <span style={{ color: TEXT_MAIN }}>Surplus returned to members</span>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

/* ─── Finance / Management: Full balance sheets & trends ─────────────────── */
function StrategicPoolView({ theme, isFinance }: { theme: string; isFinance?: boolean }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const CHART_GRID = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';

  const poolDonut = [
    { name: 'Participant Fund', value: POOL.participantFundPct, color: GREEN, amount: `£${POOL.balance.toLocaleString()}` },
    { name: 'Claims Reserves', value: POOL.claimsReservePct, color: '#3b82f6', amount: `£${POOL.claimsReserve.toLocaleString()}` },
    { name: 'Wakala Fee', value: POOL.wakalaFeePct, color: '#f59e0b', amount: `£${POOL.totalWakalaFees.toLocaleString()}` },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Takaful Pool Ledger & Analysis</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>{isFinance ? 'Finance Treasury View' : 'Strategic Portfolio View'}</p>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Current Pool Balance" value={`£${POOL.balance.toLocaleString()}`} sub="Participant Help Fund" color={GREEN} tooltip="Available balance to pay active claims" theme={theme} />
        <MetricCard label="Cumulative Contributions" value={`£${POOL.totalContributions.toLocaleString()}`} sub="Overall pool inflows" color="#3b82f6" tooltip="Sum of all contributions collected" theme={theme} />
        <MetricCard label="Total Claims Settled" value={`£${POOL.totalClaimsPaid.toLocaleString()}`} sub="Direct pool outflows" color="#ef4444" tooltip="Total claims paid to date" theme={theme} />
        <MetricCard label="Total Operator Fees" value={`£${POOL.totalWakalaFees.toLocaleString()}`} sub={`8% Wakāla allocation`} color="#f59e0b" tooltip="Management fees charged by Operator" theme={theme} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="lg:col-span-2 rounded-2xl p-5 transition-colors"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className={`font-semibold text-sm ${isLight ? 'text-black/80' : 'text-white/80'}`}>Participant Fund Balance Trend</h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Cumulative closing pool balance by month (2026)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs shrink-0">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Pool Balance</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={POOL_HISTORY}>
                <defs>
                  <linearGradient id="gpoolBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
                <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                <Area type="monotone" dataKey="balance" name="Pool Balance" stroke={GREEN} strokeWidth={2.5} fill="url(#gpoolBalance)" dot={{ r: 3, fill: GREEN }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Allocation Donut Card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="rounded-2xl p-5 flex flex-col justify-between transition-colors"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div>
            <h3 className={`font-semibold text-sm mb-1 ${isLight ? 'text-black/80' : 'text-white/80'}`}>Capital Allocations</h3>
            <p className={`text-xs mb-4 ${isLight ? 'text-black/45' : 'text-white/40'}`}>How current assets are held</p>
            <div className="flex justify-center mb-4">
              <RechartsPie width={140} height={120}>
                <Pie data={poolDonut} cx={70} cy={60} innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {poolDonut.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
              </RechartsPie>
            </div>
          </div>

          <div className="space-y-2">
            {poolDonut.map(p => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className={isLight ? 'text-black/60' : 'text-white/55'}>{p.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{p.value}%</span>
                  <span className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/30'}`}>{p.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ledger Transactions view for Finance */}
      {isFinance && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className={`rounded-2xl overflow-hidden ${isLight ? 'bg-white border border-black/[0.04]' : 'bg-[#0d2117] border border-white/[0.04]'}`}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className={`font-semibold text-sm ${isLight ? 'text-black/85' : 'text-white/85'}`}>Recent Cash Book Flows</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className={isLight ? 'text-black/40 border-b border-black/[0.04] bg-black/[0.01]' : 'text-white/30 border-b border-white/[0.04] bg-white/[0.01]'}>
                  {['Date', 'Reference ID', 'Type', 'Amount', 'Direction', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
                {/* Simplified ledger list */}
                {[
                  { date: '21 Jul 2026', ref: 'TXN-PAY-001', type: 'Claim Payout', amt: '£380.00', dir: 'Outflow', status: 'Completed', color: 'text-red-400' },
                  { date: '01 Jul 2026', ref: 'TXN-8812', type: 'Contribution', amt: '£38.50', dir: 'Inflow', status: 'Reconciled', color: 'text-[#00c685]' },
                  { date: '01 Jul 2026', ref: 'TXN-8811', type: 'Contribution', amt: '£24.20', dir: 'Inflow', status: 'Reconciled', color: 'text-[#00c685]' },
                  { date: '01 Jul 2026', ref: 'TXN-FEE-JUL', type: 'Wakāla Admin Fee', amt: '£4,912.00', dir: 'Outflow', status: 'Completed', color: 'text-amber-500' },
                ].map((t, idx) => (
                  <tr key={idx} className={`transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.01]`}>
                    <td className={`px-4 py-3 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{t.date}</td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: GREEN }}>{t.ref}</td>
                    <td className={`px-4 py-3 font-medium ${isLight ? 'text-black/75' : 'text-white/70'}`}>{t.type}</td>
                    <td className={`px-4 py-3 font-bold ${t.color}`}>{t.amt}</td>
                    <td className={`px-4 py-3 ${isLight ? 'text-black/55' : 'text-white/45'}`}>{t.dir}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.status === 'Reconciled' || t.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Page entry ─────────────────────────────────────────────────────────── */
export default function PoolPage() {
  const { theme } = useTheme();
  const { role } = useRole();

  switch (role) {
    case 'finance':
      return <StrategicPoolView theme={theme} isFinance />;
    case 'management':
    default:
      return <StrategicPoolView theme={theme} />;
  }
}
