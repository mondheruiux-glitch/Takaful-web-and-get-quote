'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, TrendingUp, TrendingDown, ArrowUpRight, Info,
  ShieldCheck, AlertCircle, ChevronDown, ChevronUp,
  Activity, CreditCard, FileText, Minus,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '../layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};

/* ─── Pool data ─────────────────────────────────────────────────── */
const POOL_BALANCE = 482150;
const TOTAL_CONTRIBUTIONS = 618400;
const CLAIMS_PAID = 92800;
const CLAIMS_RESERVED = 43450;

const poolDonut = [
  { name: 'Participant Fund', value: 78, color: '#00c685', amount: '£482,150' },
  { name: 'Claims Reserves', value: 14, color: '#3b82f6', amount: '£43,450' },
  { name: 'Wakala Fee', value: 8, color: '#f59e0b', amount: '£49,472' },
];

const poolHistory = [
  { month: 'Jan', balance: 340000, contributions: 42800, claims: 12400 },
  { month: 'Feb', balance: 370000, contributions: 46200, claims: 9800 },
  { month: 'Mar', balance: 406000, contributions: 51000, claims: 14200 },
  { month: 'Apr', balance: 444000, contributions: 49500, claims: 11100 },
  { month: 'May', balance: 478000, contributions: 53800, claims: 16500 },
  { month: 'Jun', balance: 463000, contributions: 58200, claims: 13200 },
  { month: 'Jul', balance: 482150, contributions: 61400, claims: 18900 },
];

const movementData = [
  { month: 'Jan', inflow: 42800, claims: -12400, fees: -3424 },
  { month: 'Feb', inflow: 46200, claims: -9800, fees: -3696 },
  { month: 'Mar', inflow: 51000, claims: -14200, fees: -4080 },
  { month: 'Apr', inflow: 49500, claims: -11100, fees: -3960 },
  { month: 'May', inflow: 53800, claims: -16500, fees: -4304 },
  { month: 'Jun', inflow: 58200, claims: -13200, fees: -4656 },
  { month: 'Jul', inflow: 61400, claims: -18900, fees: -4912 },
];

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
          <span className="font-semibold">£{Math.abs(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function PoolPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [flowOpen, setFlowOpen] = useState(false);
  const surplusRate = ((POOL_BALANCE - CLAIMS_PAID - CLAIMS_RESERVED) / TOTAL_CONTRIBUTIONS * 100).toFixed(1);

  // Dynamic Theme Colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL2 = isLight ? '#f4f6f5' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
  const CHART_GRID = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Takaful Pool Transparency</h1>
        <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>How participant contributions are collected, allocated, and managed — Demo data</p>
      </motion.div>

      {/* Transparency banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl p-4 flex items-start gap-3 transition-colors duration-200"
        style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20` }}
      >
        <ShieldCheck size={16} className="text-[#00c685] mt-0.5 shrink-0" />
        <div>
          <p className="text-[#00c685] text-xs font-semibold">Takaful Mutual Principle</p>
          <p className={`text-xs mt-0.5 leading-relaxed ${TEXT_SUB}`}>
            All participant contributions enter the shared Takaful fund. The operator charges a Wakala (management) fee for administration and claims services. 
            Any surplus remaining after claims and reserves may be returned to participants. No interest (Riba) is charged or paid. 
            <span className={TEXT_MUTED}> This pool data is for transparency purposes only and does not constitute a financial guarantee.</span>
          </p>
        </div>
      </motion.div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pool Balance', value: '£482,150', sub: 'Current participant fund', color: GREEN, tooltip: 'Net balance of the participant Takaful fund after claims paid and reserves held' },
          { label: 'Total Contributions', value: '£618,400', sub: 'Cumulative to date', color: '#3b82f6', tooltip: 'Total contributions received from all participants to date' },
          { label: 'Claims Paid', value: '£92,800', sub: 'Settled from pool', color: '#f59e0b', tooltip: 'Total claim payments made from the participant fund' },
          { label: 'Pool Health', value: `${surplusRate}%`, sub: 'Net surplus rate', color: '#10b981', tooltip: 'Net surplus as a percentage of total contributions. Positive indicates pool stability.' }
        ].map((item, i) => (
          <motion.div
            key={item.label}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 2}
            className="rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-medium ${TEXT_SUB}`}>{item.label}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={11} className={`${TEXT_MUTED} cursor-help`} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs bg-black/90 border-white/10 text-white">{item.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            </div>
            <p className={`text-2xl font-bold tracking-tight ${TEXT_MAIN}`}>{item.value}</p>
            <p className={`text-[10px] ${TEXT_MUTED}`}>{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works — flow diagram */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={6}
        className="rounded-2xl overflow-hidden transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left"
          style={{ borderBottom: flowOpen ? `1px solid ${BORDER}` : 'none' }}
          onClick={() => setFlowOpen(v => !v)}
        >
          <div>
            <h3 className={`font-semibold text-sm ${TEXT_MAIN}`}>Where Your Contribution Goes</h3>
            <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Full allocation breakdown for each £100 contributed</p>
          </div>
          {flowOpen ? <ChevronUp size={15} className={TEXT_MUTED} /> : <ChevronDown size={15} className={TEXT_MUTED} />}
        </button>
        {flowOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 py-5">
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 items-stretch">
              {/* Step 1 */}
              <div className="flex-1 p-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none transition-colors duration-200" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
                <p className={`text-[10px] font-semibold mb-1 ${TEXT_MUTED}`}>CONTRIBUTION</p>
                <p className={`text-xl font-bold ${TEXT_MAIN}`}>£100.00</p>
                <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>Monthly participant contribution</p>
              </div>
              <div className="self-center text-black/20 dark:text-white/20 text-lg font-light px-2 hidden sm:block">→</div>
              {/* Step 2 */}
              <div className="flex-1 p-4 transition-colors duration-200" style={{ background: isLight ? '#fafafa' : '#0f1d17', border: `1px solid ${BORDER}` }}>
                <p className="text-amber-500 text-[10px] font-semibold mb-1">WAKALA FEE (8%)</p>
                <p className={`text-xl font-bold ${TEXT_MAIN}`}>£8.00</p>
                <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>Operator administration fee</p>
              </div>
              <div className="self-center text-black/20 dark:text-white/20 text-lg font-light px-2 hidden sm:block">→</div>
              {/* Step 3 */}
              <div className="flex-1 p-4 transition-colors duration-200" style={{ background: isLight ? '#fafafa' : '#0f1d17', border: `1px solid ${BORDER}` }}>
                <p className="text-blue-500 text-[10px] font-semibold mb-1">CLAIMS RESERVE (14%)</p>
                <p className={`text-xl font-bold ${TEXT_MAIN}`}>£14.00</p>
                <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>Reserved for future claims</p>
              </div>
              <div className="self-center text-black/20 dark:text-white/20 text-lg font-light px-2 hidden sm:block">→</div>
              {/* Step 4 */}
              <div className="flex-1 p-4 rounded-xl sm:rounded-r-xl sm:rounded-l-none transition-colors duration-200" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
                <p className="text-[#00c685] text-[10px] font-semibold mb-1">PARTICIPANT FUND (78%)</p>
                <p className={`text-xl font-bold ${TEXT_MAIN}`}>£78.00</p>
                <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>Active pool for claim payments</p>
              </div>
            </div>
            <p className={`text-[10px] mt-3 leading-relaxed ${TEXT_MUTED}`}>
              * Fee percentages are illustrative demo data. In a real Wakala-based Takaful, the operator's Wakala fee is agreed upfront. 
              Any pool surplus at year-end, subject to business review, may be distributed proportionally to participants or retained in the pool.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pool balance over time */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className="lg:col-span-2 rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <h3 className={`font-semibold text-sm mb-1 ${TEXT_MAIN}`}>Pool Balance Over Time</h3>
          <p className={`text-xs mb-5 ${TEXT_SUB}`}>Monthly closing balance of participant fund</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={poolHistory}>
              <defs>
                <linearGradient id="gPool" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip content={<ChartTooltip theme={theme} />} />
              <Area type="monotone" dataKey="balance" name="Pool Balance" stroke={GREEN} strokeWidth={2} fill="url(#gPool)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className="rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <h3 className={`font-semibold text-sm mb-1 ${TEXT_MAIN}`}>Allocation Breakdown</h3>
          <p className={`text-xs mb-4 ${TEXT_SUB}`}>Current pool composition</p>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <RechartsPie>
                <Pie data={poolDonut} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {poolDonut.map((e, i) => <Cell key={i} fill={e.color} opacity={0.9} />)}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {poolDonut.map(p => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className={TEXT_SUB}>{p.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${TEXT_MAIN}`}>{p.value}%</span>
                  <span className={`text-[10px] ${TEXT_MUTED}`}>{p.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pool movements */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}
        className="rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <h3 className={`font-semibold text-sm mb-1 ${TEXT_MAIN}`}>Pool Movements</h3>
        <p className={`text-xs mb-5 ${TEXT_SUB}`}>Monthly inflows (contributions) and outflows (claims, fees)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={movementData} barSize={10} barGap={2}>
            <CartesianGrid vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(Math.abs(v) / 1000).toFixed(0)}k`} />
            <RechartsTooltip content={<ChartTooltip theme={theme} />} cursor={{ fill: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)' }} />
            <ReferenceLine y={0} stroke={isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} />
            <Bar dataKey="inflow" name="Contributions" fill={GREEN} radius={[3, 3, 0, 0]} opacity={0.9} />
            <Bar dataKey="claims" name="Claims Paid" fill="#ef4444" radius={[0, 0, 3, 3]} opacity={0.7} />
            <Bar dataKey="fees" name="Wakala Fee" fill="#f59e0b" radius={[0, 0, 3, 3]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
        <p className={`text-[10px] mt-3 ${TEXT_MUTED}`}>Outflow bars are shown below the baseline for visual clarity. All figures are GBP. Demo data only.</p>
      </motion.div>
    </div>
  );
}
