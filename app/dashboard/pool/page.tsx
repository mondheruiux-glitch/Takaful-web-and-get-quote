'use client';

import React, { useState } from 'react';
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
import { useTheme, useRole } from '../ThemeRoleContext';
import { POOL, POOL_HISTORY, CONTRIBUTION_TREND } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
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
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-200" style={{ background: isLight ? '#ffffff' : '#0d2117', border: `1px solid ${BORDER}` }}>
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

/* ─── Participant view: Simplified transparency ──────────────────────────── */
function ParticipantPoolView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const [flowOpen, setFlowOpen] = useState(true);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Takaful Pool Transparency</h1>
        <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Understand how your monthly contributions help the community.</p>
      </motion.div>

      {/* Principle block */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl p-5 flex items-start gap-4 transition-colors"
        style={{ background: 'rgba(0,198,133,0.06)', border: `1px solid rgba(0,198,133,0.15)` }}
      >
        <ShieldCheck size={20} className="text-[#00c685] mt-0.5 shrink-0" />
        <div>
          <p className="text-[#00c685] text-sm font-semibold">The Takaful Mutual Principle</p>
          <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-black/60' : 'text-white/50'}`}>
            As a participant, your contribution isn't a premium sold for commercial profit. Instead, it is a donation (Tabarru') into a shared community pool.
            If you or any other participant suffers a loss, funds are released to cover it. Any administrative costs are managed via an upfront Wakāla fee.
            No interest is ever charged or paid, ensuring full Shariah compliance.
          </p>
        </div>
      </motion.div>

      {/* Simplified metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Active Community Pool" value={`£${POOL.balance.toLocaleString()}`} sub="Current available balance" color={GREEN} tooltip="The pool balance available for payouts" theme={theme} />
        <MetricCard label="Paid Out Claims" value={`£${POOL.totalClaimsPaid.toLocaleString()}`} sub="Claims settled this period" color="#ef4444" tooltip="Total amount released to help participants who had incidents" theme={theme} />
        <MetricCard label="Community Surplus Rate" value="78%" sub="Of contributions stay in pool" color="#3b82f6" tooltip="The portion of contributions strictly dedicated to mutual help" theme={theme} />
      </div>

      {/* Allocation breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="rounded-2xl overflow-hidden transition-colors" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
              <h3 className={`font-semibold text-sm ${isLight ? 'text-black/80' : 'text-white/80'}`}>Contribution Allocation</h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>For every £100 you contribute, this is how it is structured:</p>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Participant Pool Fund (78%)', val: '£78.00', desc: 'Directly helps cover participant claims and property repairs.', color: GREEN },
                { label: 'Claims Contingency Reserve (14%)', val: '£14.00', desc: 'Held back to ensure long-term stability of the pool during major events.', color: '#3b82f6' },
                { label: 'Operator Wakāla Fee (8%)', val: '£8.00', desc: 'Agreed fee for administering the platform, customer service, and claims triage.', color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-black/[0.01] dark:bg-white/[0.015]" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${isLight ? 'text-black/75' : 'text-white/75'}`}>{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.val}</span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-black/45' : 'text-white/40'}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Shariah Compliance info */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="rounded-2xl p-5 space-y-4" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#00c685]" />
            <h3 className={`font-semibold text-sm ${isLight ? 'text-black/80' : 'text-white/80'}`}>Shariah Board Audited</h3>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-black/55' : 'text-white/50'}`}>
            Takaful UK is certified by our Shariah Supervisory Committee. We audit all operational fees and investment portfolios to verify:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2">
              <CheckCircle2 size={12} className="text-[#00c685] shrink-0 mt-0.5" />
              <span className={isLight ? 'text-black/60' : 'text-white/55'}>No investments in non-compliant sectors.</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={12} className="text-[#00c685] shrink-0 mt-0.5" />
              <span className={isLight ? 'text-black/60' : 'text-white/55'}>Absence of Riba (interest) in all pool cash reserves.</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={12} className="text-[#00c685] shrink-0 mt-0.5" />
              <span className={isLight ? 'text-black/60' : 'text-white/55'}>Clear mutual surplus sharing arrangement.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Finance / Management: Full balance sheets & trends ─────────────────── */
function StrategicPoolView({ theme, isFinance }: { theme: string; isFinance?: boolean }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
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
          <h3 className={`font-semibold text-sm mb-1 ${isLight ? 'text-black/80' : 'text-white/80'}`}>Participant Fund Balance Trend</h3>
          <p className={`text-xs mb-5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Cumulative closing pool balance by month (2026)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={POOL_HISTORY}>
                <defs>
                  <linearGradient id="gpoolBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={CHART_GRID} />
                <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                <Area type="monotone" dataKey="balance" name="Pool Balance" stroke={GREEN} strokeWidth={2.5} fill="url(#gpoolBalance)" dot={false} />
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
    case 'participant':
      return <ParticipantPoolView theme={theme} />;
    case 'finance':
      return <StrategicPoolView theme={theme} isFinance />;
    case 'management':
    default:
      return <StrategicPoolView theme={theme} />;
  }
}
