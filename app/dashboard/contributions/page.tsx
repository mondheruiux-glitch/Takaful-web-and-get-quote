'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Download, Filter, Search, CheckCircle2,
  Clock, XCircle, AlertTriangle, TrendingUp, Calendar,
  ChevronDown, ArrowUpRight, Info,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GREEN = '#00c685';
const SURFACE = '#0d2117';
const BORDER = 'rgba(255,255,255,0.07)';
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

/* ─── Data ─────────────────────────────────────────────────────── */
const contributionTrend = [
  { month: 'Jan', total: 42800, participants: 1148 },
  { month: 'Feb', total: 46200, participants: 1179 },
  { month: 'Mar', total: 51000, participants: 1205 },
  { month: 'Apr', total: 49500, participants: 1218 },
  { month: 'May', total: 53800, participants: 1240 },
  { month: 'Jun', total: 58200, participants: 1262 },
  { month: 'Jul', total: 61400, participants: 1284 },
];

const TRANSACTIONS = [
  { id: 'CONT-2024-8812', participant: 'Fatima Al-Rashid', certId: 'TK-2024-0042', amount: '£38.50', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8811', participant: 'Hassan Mahmoud', certId: 'TK-2024-0087', amount: '£24.20', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8810', participant: 'Aisha Okonkwo', certId: 'TK-2024-0112', amount: '£52.80', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8809', participant: 'Yusuf Ibrahim', certId: 'TK-2024-0031', amount: '£41.00', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8808', participant: 'Maryam Patel', certId: 'TK-2024-0098', amount: '£18.90', date: '1 Jul 2026', method: 'Direct Debit', status: 'Failed' },
  { id: 'CONT-2024-8807', participant: 'Ibrahim Al-Sayed', certId: 'TK-2024-0055', amount: '£61.20', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8806', participant: 'Zahra Hussein', certId: 'TK-2024-0073', amount: '£33.70', date: '1 Jul 2026', method: 'Direct Debit', status: 'Pending' },
  { id: 'CONT-2024-8805', participant: 'Khalid Rahman', certId: 'TK-2024-0019', amount: '£22.50', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8804', participant: 'Nadia Khaled', certId: 'TK-2024-0067', amount: '£45.80', date: '1 Jul 2026', method: 'Direct Debit', status: 'Collected' },
  { id: 'CONT-2024-8803', participant: 'Omar Sharif', certId: 'TK-2024-0088', amount: '£29.40', date: '1 Jul 2026', method: 'Direct Debit', status: 'Retried' },
];

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  Collected: { bg: 'bg-[#00c685]/10', text: 'text-[#00c685]', dot: 'bg-[#00c685]' },
  Pending:   { bg: 'bg-blue-500/10',  text: 'text-blue-400',  dot: 'bg-blue-400' },
  Failed:    { bg: 'bg-red-500/10',   text: 'text-red-400',   dot: 'bg-red-400' },
  Retried:   { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'Collected', label: 'Collected' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Failed', label: 'Failed' },
  { key: 'Retried', label: 'Retried' },
];

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CFG[status] ?? { bg: 'bg-white/5', text: 'text-white/40', dot: 'bg-white/20' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

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
            {p.name === 'Total' ? `£${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('Jul 2026');

  const filtered = TRANSACTIONS.filter(t => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = !search ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.participant.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-lg font-bold">Contributions</h1>
          <p className="text-white/40 text-xs mt-0.5">Track participant contribution collections — Demo data</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/60 border border-white/8 hover:bg-white/5 transition-all">
            <Calendar size={13} /> {month} <ChevronDown size={12} />
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected (MTD)', value: '£61,400', sub: '1,284 transactions', color: GREEN, tooltip: 'Total contributions collected this calendar month' },
          { label: 'Collection Rate', value: '97.2%', sub: '38 failed / retried', color: '#3b82f6', tooltip: 'Percentage of contributions successfully collected on first attempt' },
          { label: 'Failed Collections', value: '36', sub: '2.8% of total', color: '#ef4444', tooltip: 'Contributions that failed and are pending retry' },
          { label: 'Avg. Contribution', value: '£41.30', sub: 'per certificate', color: '#8b5cf6', tooltip: 'Average monthly contribution amount across all active certificates' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-1.5">
              <p className="text-white/50 text-xs font-medium">{s.label}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info size={10} className="text-white/20 cursor-help" /></TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-xs bg-black/90 border-white/10">{s.tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-white text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-white/30 text-[10px]">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Trend chart */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <h3 className="text-white font-semibold text-sm mb-1">Monthly Contribution Volume</h3>
        <p className="text-white/40 text-xs mb-5">Total GBP collected from all participants per month</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={contributionTrend}>
            <defs>
              <linearGradient id="gContrib2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.3} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
            <RechartsTooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="total" name="Total" stroke={GREEN} strokeWidth={2} fill="url(#gContrib2)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Transaction table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
        className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-[#00c685]/40 transition-colors" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors"><Filter size={12} /> Filter</button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto px-5 py-3 gap-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === tab.key ? 'bg-[#00c685]/15 text-[#00c685]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Transaction ID', 'Participant', 'Certificate', 'Amount', 'Date', 'Method', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <CreditCard size={32} className="text-white/15" />
                    <p className="text-white/40 text-sm">No transactions found</p>
                  </div>
                </td></tr>
              ) : filtered.map((t, i) => (
                <motion.tr key={t.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td className="px-5 py-3.5 font-mono text-white/50 text-[11px]">{t.id}</td>
                  <td className="px-5 py-3.5 text-white/80 font-medium">{t.participant}</td>
                  <td className="px-5 py-3.5 font-mono text-[#00c685] text-[11px]">{t.certId}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{t.amount}</td>
                  <td className="px-5 py-3.5 text-white/40">{t.date}</td>
                  <td className="px-5 py-3.5 text-white/40">{t.method}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-white/30 text-xs">Showing {filtered.length} of {TRANSACTIONS.length} transactions</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === 1 ? 'bg-[#00c685]/15 text-[#00c685]' : 'text-white/30 hover:bg-white/5'}`}>{n}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
