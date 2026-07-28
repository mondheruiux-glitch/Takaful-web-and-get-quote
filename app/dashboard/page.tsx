'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Users, Shield, PieChart, FileText,
  CreditCard, AlertCircle, CheckCircle2, Clock, ArrowUpRight,
  ChevronRight, Minus, Activity, Building2, Home, Zap, Info,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

/* ─── Design tokens ───────────────────────────────────────────────── */
const GREEN = '#00c685';
const BG_DARK = '#0a1a14';
const SURFACE = '#0d2117';
const SURFACE2 = '#112218';
const BORDER = 'rgba(255,255,255,0.07)';
const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Animation helpers ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: i * 0.07 } }),
};

/* ─── Mock data ───────────────────────────────────────────────────── */
const contributionTrend = [
  { month: 'Jan', contributions: 42800, claims: 12400 },
  { month: 'Feb', contributions: 46200, claims: 9800 },
  { month: 'Mar', contributions: 51000, claims: 14200 },
  { month: 'Apr', contributions: 49500, claims: 11100 },
  { month: 'May', contributions: 53800, claims: 16500 },
  { month: 'Jun', contributions: 58200, claims: 13200 },
  { month: 'Jul', contributions: 61400, claims: 18900 },
];

const claimsMonthly = [
  { month: 'Jan', new: 8, resolved: 6, pending: 4 },
  { month: 'Feb', new: 5, resolved: 8, pending: 3 },
  { month: 'Mar', new: 11, resolved: 7, pending: 5 },
  { month: 'Apr', new: 7, resolved: 9, pending: 4 },
  { month: 'May', new: 13, resolved: 10, pending: 6 },
  { month: 'Jun', new: 9, resolved: 12, pending: 5 },
  { month: 'Jul', new: 14, resolved: 11, pending: 8 },
];

const poolComposition = [
  { name: 'Participant Fund', value: 78, color: GREEN },
  { name: 'Claims Reserves', value: 14, color: '#3b82f6' },
  { name: 'Wakala Fee', value: 8, color: '#f59e0b' },
];

const recentClaims = [
  { id: 'CLM-2024-0891', participant: 'Fatima Al-Rashid', type: 'Buildings', amount: '£4,200', status: 'Under Review', date: '24 Jul 2026' },
  { id: 'CLM-2024-0890', participant: 'Hassan Mahmoud', type: 'Contents', amount: '£1,850', status: 'Awaiting Docs', date: '23 Jul 2026' },
  { id: 'CLM-2024-0889', participant: 'Aisha Okonkwo', type: 'Both', amount: '£7,500', status: 'Approved', date: '22 Jul 2026' },
  { id: 'CLM-2024-0888', participant: 'Yusuf Ibrahim', type: 'Buildings', amount: '£2,100', status: 'Paid', date: '21 Jul 2026' },
  { id: 'CLM-2024-0887', participant: 'Maryam Patel', type: 'Contents', amount: '£950', status: 'Rejected', date: '20 Jul 2026' },
];

const activityFeed = [
  { icon: FileText, color: '#3b82f6', text: 'New claim submitted by Hassan Mahmoud', time: '2 min ago' },
  { icon: CheckCircle2, color: GREEN, text: 'Claim CLM-2024-0889 approved — £7,500', time: '18 min ago' },
  { icon: CreditCard, color: '#8b5cf6', text: '48 contributions processed — £24,650 received', time: '1 hr ago' },
  { icon: AlertCircle, color: '#f59e0b', text: 'CLM-2024-0890 awaiting additional documents', time: '2 hr ago' },
  { icon: Shield, color: GREEN, text: 'Certificate TK-2024-0151 issued to Zainab Ahmed', time: '4 hr ago' },
  { icon: Users, color: '#ec4899', text: '3 new participant applications received', time: '6 hr ago' },
];

const kpis = [
  {
    label: 'Active Certificates',
    value: '1,284',
    change: '+34',
    up: true,
    sub: 'vs last month',
    icon: Shield,
    color: GREEN,
    tooltip: 'Total live Takaful certificates currently in force',
  },
  {
    label: 'Pool Balance',
    value: '£482,150',
    change: '+£18,200',
    up: true,
    sub: 'vs last month',
    icon: PieChart,
    color: '#3b82f6',
    tooltip: 'Current Takaful participant fund balance after claims and reserves',
  },
  {
    label: 'Claims Paid (MTD)',
    value: '£42,500',
    change: '+£8,100',
    up: false,
    sub: 'this month',
    icon: FileText,
    color: '#f59e0b',
    tooltip: 'Total claims paid from the pool this calendar month',
  },
  {
    label: 'Pending Claims',
    value: '23',
    change: '-5',
    up: true,
    sub: 'vs last week',
    icon: Clock,
    color: '#ec4899',
    tooltip: 'Claims currently in review or awaiting information',
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'Under Review':   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  'Awaiting Docs':  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  dot: 'bg-amber-400' },
  'Approved':       { bg: 'bg-[#00c685]/10',  text: 'text-[#00c685]', dot: 'bg-[#00c685]' },
  'Paid':           { bg: 'bg-[#00c685]/10',  text: 'text-[#00c685]', dot: 'bg-[#00c685]' },
  'Rejected':       { bg: 'bg-red-500/10',    text: 'text-red-400',    dot: 'bg-red-400' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: 'bg-white/5', text: 'text-white/50', dot: 'bg-white/30' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

/* ─── KPI Card ────────────────────────────────────────────────────── */
function KpiCard({ kpi, index }: { kpi: typeof kpis[0]; index: number }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all hover:translate-y-[-2px] cursor-default"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-white/50 text-xs font-medium">{kpi.label}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={11} className="text-white/25 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs bg-black/90 border-white/10">
                  {kpi.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-white text-2xl font-bold mt-1 tracking-tight">{kpi.value}</p>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}18` }}>
          <Icon size={18} style={{ color: kpi.color }} />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {kpi.up
          ? <TrendingUp size={13} className="text-[#00c685]" />
          : <TrendingDown size={13} className="text-amber-400" />
        }
        <span className={`text-xs font-semibold ${kpi.up ? 'text-[#00c685]' : 'text-amber-400'}`}>{kpi.change}</span>
        <span className="text-white/30 text-xs">{kpi.sub}</span>
      </div>
    </motion.div>
  );
}

/* ─── Custom chart tooltip ────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl" style={{ background: '#0d2117', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/50 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="text-white font-semibold">
            {typeof p.value === 'number' && p.value > 1000 ? `£${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Pool Health ─────────────────────────────────────────────────── */
function PoolHealth() {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={6}
      className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Takaful Pool Composition</h3>
          <p className="text-white/40 text-xs mt-0.5">Where participant contributions are allocated</p>
        </div>
        <Link href="/dashboard/pool" className="text-xs text-[#00c685] hover:underline flex items-center gap-1">
          View detail <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie data={poolComposition} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={0}>
                {poolComposition.map((e, i) => <Cell key={i} fill={e.color} opacity={0.9} />)}
              </Pie>
            </RechartsPie>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {poolComposition.map(p => (
            <div key={p.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-white/60">{p.name}</span>
                </span>
                <span className="text-white font-semibold">{p.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.value}%`, background: p.color }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Total Contributions (MTD)</span>
              <span className="text-white font-semibold">£61,400</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Page header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className="text-white text-lg font-bold">Overview</h1>
        <p className="text-white/40 text-xs mt-0.5">Monday, 28 July 2026 — Demo data</p>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => <KpiCard key={kpi.label} kpi={kpi} index={i + 1} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contribution vs Claims area chart */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="lg:col-span-2 rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-sm">Contributions vs Claims</h3>
              <p className="text-white/40 text-xs mt-0.5">Monthly GBP volume — last 7 months</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00c685]" />Contributions</span>
              <span className="flex items-center gap-1 text-white/50"><span className="w-2 h-2 rounded-full bg-blue-400" />Claims</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={contributionTrend}>
              <defs>
                <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GREEN} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gClaims" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="contributions" name="Contributions" stroke={GREEN} strokeWidth={2} fill="url(#gContrib)" dot={false} />
              <Area type="monotone" dataKey="claims" name="Claims" stroke="#3b82f6" strokeWidth={2} fill="url(#gClaims)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pool health donut */}
        <PoolHealth />
      </div>

      {/* Claims bar + Recent activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly claims bar chart */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className="lg:col-span-2 rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-sm">Claims Activity</h3>
              <p className="text-white/40 text-xs mt-0.5">New, resolved, and pending by month</p>
            </div>
            <Link href="/dashboard/claims" className="text-xs text-[#00c685] hover:underline flex items-center gap-1">
              All claims <ChevronRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={claimsMonthly} barSize={8} barGap={3}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="new" name="New" fill={GREEN} radius={[3, 3, 0, 0]} opacity={0.85} />
              <Bar dataKey="resolved" name="Resolved" fill="#3b82f6" radius={[3, 3, 0, 0]} opacity={0.85} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[3, 3, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent activity feed */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
            <Activity size={14} className="text-white/30" />
          </div>
          <div className="space-y-3">
            {activityFeed.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${item.color}18` }}>
                    <Icon size={12} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-xs leading-relaxed">{item.text}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent claims table */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={9}
        className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h3 className="text-white font-semibold text-sm">Recent Claims</h3>
            <p className="text-white/40 text-xs mt-0.5">Latest claim submissions requiring attention</p>
          </div>
          <Link
            href="/dashboard/claims"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[#00c685]/15"
            style={{ color: GREEN, border: `1px solid ${GREEN}30` }}
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Claim ID', 'Participant', 'Type', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-white/35 font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentClaims.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                  className="group hover:bg-white/[0.025] transition-colors cursor-pointer"
                  style={{ borderBottom: i < recentClaims.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/claims/${c.id}`} className="font-mono text-[#00c685] hover:underline">{c.id}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-white/80">{c.participant}</td>
                  <td className="px-5 py-3.5 text-white/50">{c.type}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{c.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-white/40">{c.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
