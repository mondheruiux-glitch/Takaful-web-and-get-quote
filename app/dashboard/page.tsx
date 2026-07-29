'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Clock, ShieldCheck, AlertCircle,
  FileText, ArrowUpRight, ArrowDownRight, Users, Sparkles,
  ExternalLink, ChevronRight, Activity, PieChart as PieIcon,
  HelpCircle,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
} from 'recharts';
import Link from 'next/link';
import { useTheme } from './layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: i * 0.08 } }),
};

/* ─── Shared Chart Tooltip ────────────────────────────────────────── */
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
      <p className={`${isLight ? 'text-black/50' : 'text-white/50'} mb-2`}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={isLight ? 'text-black/70' : 'text-white/70'}>{p.name}:</span>
          <span className="font-semibold">
            {p.name.includes('Amount') || p.name.includes('Contributions') || p.name.includes('Claims')
              ? `£${p.value.toLocaleString()}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Mock Data ─────────────────────────────────────────────────── */
const contributionVsClaims = [
  { month: 'Jan', Contributions: 42800, Claims: 12400 },
  { month: 'Feb', Contributions: 46200, Claims: 9800 },
  { month: 'Mar', Contributions: 51000, Claims: 14200 },
  { month: 'Apr', Contributions: 49500, Claims: 11100 },
  { month: 'May', Contributions: 53800, Claims: 16500 },
  { month: 'Jun', Contributions: 58200, Claims: 13200 },
  { month: 'Jul', Contributions: 61400, Claims: 18900 },
];

const poolStatus = [
  { name: 'Participant Fund', value: 78, color: '#00c685' },
  { name: 'Claims Reserves', value: 14, color: '#3b82f6' },
  { name: 'Wakala Fee (8%)', value: 8, color: '#f59e0b' },
];

const claimsByCategory = [
  { category: 'Storm', Amount: 32000 },
  { category: 'Fire', Amount: 45000 },
  { category: 'Theft', Amount: 8500 },
  { category: 'Flood', Amount: 7300 },
];

const RECENT_CLAIMS = [
  { id: 'CLM-2024-0891', name: 'Fatima Al-Rashid', type: 'Storm damage to roof', amount: '£4,200', date: '18 Jul 2026', status: 'Under Review', statusCol: 'text-blue-400 bg-blue-500/10' },
  { id: 'CLM-2024-0890', name: 'Hassan Mahmoud', type: 'Water leak in kitchen', amount: '£1,850', date: '17 Jul 2026', status: 'Approved', statusCol: 'text-[#00c685] bg-[#00c685]/10' },
  { id: 'CLM-2024-0889', name: 'Aisha Okonkwo', type: 'Accidental glass damage', amount: '£380', date: '15 Jul 2026', status: 'Paid', statusCol: 'text-[#00c685] bg-[#00c685]/10' },
  { id: 'CLM-2024-0888', name: 'Yusuf Ibrahim', type: 'Lock replacement', amount: '£250', date: '10 Jul 2026', status: 'Rejected', statusCol: 'text-red-400 bg-red-500/10' },
];

const ACTIVITIES = [
  { text: 'Claim CLM-2024-0891 status changed to Under Review', time: '10m ago', icon: Activity, color: 'text-blue-400 bg-blue-500/10' },
  { text: 'New certificate issued to Mariam Patel (TK-2024-0098)', time: '1h ago', icon: ShieldCheck, color: 'text-[#00c685] bg-[#00c685]/10' },
  { text: 'Assessor assigned to claim CLM-2024-0890', time: '3h ago', icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
];

export default function OverviewPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Dynamic Theme Colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
  const CHART_GRID = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const CARD_HOVER = isLight ? 'hover:bg-black/[0.01]' : 'hover:bg-white/[0.01]';
  const BORDER_DASH = isLight ? 'border-black/10' : 'border-white/10';

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      {/* Welcome Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${TEXT_MAIN}`}>Assalamu Alaikum, Ahmed</h1>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Here is the current state of Takaful UK Pool operations — Demo data</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/claims" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90" style={{ background: GREEN }}>
            Claims Panel <ChevronRight size={13} />
          </Link>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Takaful Pool Balance', value: '£482,150', change: '+12.4%', up: true, desc: 'Current participant fund' },
          { label: 'Active Certificates', value: '1,284', change: '+3.1%', up: true, desc: 'Protection certificates in force' },
          { label: 'Pending Claims', value: '14', change: '-2.0%', up: false, desc: 'Awaiting assessment' },
          { label: 'Surplus Distribution Rate', value: '78%', change: 'Stable', up: true, desc: 'Allocated to participant pool' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            className="rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <p className={`text-xs font-medium ${TEXT_SUB}`}>{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <p className={`text-2xl font-bold tracking-tight ${TEXT_MAIN}`}>{stat.value}</p>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.up ? 'text-[#00c685] bg-[#00c685]/10' : 'text-red-400 bg-red-500/10'}`}>
                {stat.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </span>
            </div>
            <p className={`text-[10px] ${TEXT_MUTED}`}>{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Area Chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="lg:col-span-2 rounded-2xl p-5 transition-colors duration-200"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className={`font-semibold text-sm ${TEXT_MAIN}`}>Contribution vs Claims Outflow</h3>
              <p className={`text-[10px] ${TEXT_SUB}`}>Monthly summary of inflow protection vs claims settled</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1.5 text-[#00c685]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c685]" /> Contributions
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Claims Outflow
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={contributionVsClaims}>
              <defs>
                <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gClaims" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v / 1000}k`} />
              <RechartsTooltip content={<ChartTooltip theme={theme} />} />
              <Area type="monotone" dataKey="Contributions" stroke={GREEN} strokeWidth={2} fill="url(#gContrib)" dot={false} />
              <Area type="monotone" dataKey="Claims" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gClaims)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="rounded-2xl p-5 transition-colors duration-200"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <h3 className={`font-semibold text-sm mb-1 ${TEXT_MAIN}`}>Takaful Pool Allocation</h3>
          <p className={`text-[10px] mb-4 ${TEXT_SUB}`}>Current allocation of collective participant pool</p>
          <div className="flex justify-center h-28">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie data={poolStatus} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" strokeWidth={0}>
                  {poolStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {poolStatus.map(p => (
              <div key={p.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className={TEXT_SUB}>{p.name}</span>
                </span>
                <span className={`font-semibold ${TEXT_MAIN}`}>{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent claims & Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent claims table */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={7}
          className="lg:col-span-2 rounded-2xl overflow-hidden transition-colors duration-200"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <h3 className={`font-semibold text-sm ${TEXT_MAIN}`}>Recent Claims</h3>
            <Link href="/dashboard/claims" className="text-xs font-semibold hover:underline" style={{ color: GREEN }}>
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={TEXT_MUTED} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Claim ID', 'Participant', 'Incident', 'Amount', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-semibold tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: BORDER }}>
                {RECENT_CLAIMS.map(c => (
                  <tr key={c.id} className={`${CARD_HOVER} transition-colors duration-150`}>
                    <td className="px-5 py-3.5"><Link href={`/dashboard/claims/${c.id}`} className="font-mono text-[#00c685] hover:underline font-semibold">{c.id}</Link></td>
                    <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{c.name}</td>
                    <td className={`px-5 py-3.5 ${TEXT_SUB} max-w-[200px] truncate`}>{c.type}</td>
                    <td className={`px-5 py-3.5 font-semibold ${TEXT_MAIN}`}>{c.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.statusCol}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Live system feed */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={8}
          className="rounded-2xl p-5 flex flex-col transition-colors duration-200"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <h3 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>Pool activity</h3>
          <div className="space-y-4 flex-1">
            {ACTIVITIES.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex gap-3 items-start text-xs">
                  <div className={`p-1.5 rounded-lg shrink-0 ${act.color}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`leading-relaxed ${TEXT_SUB}`}>{act.text}</p>
                    <span className={`text-[10px] mt-0.5 block ${TEXT_MUTED}`}>{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
            <Link href="/dashboard/notifications" className="flex items-center justify-between text-[11px] font-semibold hover:underline" style={{ color: GREEN }}>
              <span>View full activity log</span>
              <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
