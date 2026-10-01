'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info, TrendingUp, AlertTriangle, Gift, HeartHandshake,
  Check, ChevronRight, Download, ShieldAlert, PiggyBank,
  Landmark, BadgePercent, Users, X,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaChart, DonutChart, TakafulPoolBarChart } from '@/components/charts';
import { useTheme, useRole } from '../ThemeRoleContext';
import { POOL, POOL_HISTORY, CONTRIBUTION_TREND } from '@/lib/dashboard/mock-data';
import { ParticipantPoolView } from '@/components/ui/participant-pool-view';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};

const GREEN = '#00c685';

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

/* ─── Reserve Ratio Health Gauge ─────────────────────────────────────────── */
function ReserveRatioGauge({ theme, ratio = 5.2 }: { theme: string; ratio?: number }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const healthy = ratio >= 3.0;
  const warning = ratio >= 2.0 && ratio < 3.0;
  const pct = Math.min((ratio / 8) * 100, 100);
  const gaugeColor = healthy ? GREEN : warning ? '#f59e0b' : '#ef4444';

  return (
    <div className={`rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`} style={{ background: isLight ? '#ffffff' : '#0d2117', border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-black/45' : 'text-white/40'}`}>Reserve Ratio</p>
          <p className={`text-2xl font-bold mt-1 ${isLight ? 'text-black/90' : 'text-white'}`}>{ratio.toFixed(1)}x</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: `${gaugeColor}18`, color: gaugeColor }}>
          {healthy ? <Check size={11} /> : <AlertTriangle size={11} />}
          {healthy ? 'Healthy' : warning ? 'Warning' : 'Critical'}
        </span>
      </div>
      <div className={`h-2 rounded-full ${isLight ? 'bg-black/[0.06]' : 'bg-white/[0.06]'}`}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: gaugeColor }} />
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px]" style={{ color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)' }}>
        <span>0x</span>
        <span className="font-semibold" style={{ color: gaugeColor }}>Min. 3.0x required</span>
        <span>8x</span>
      </div>
      <p className={`text-[10px] mt-2 ${isLight ? 'text-black/40' : 'text-white/35'}`}>
        Reserve: £{POOL.claimsReserve.toLocaleString()} against avg monthly claims
      </p>
    </div>
  );
}

/* ─── Surplus Distribution Modal (Al-Fa'id Al-Ta'mini) ──────────────────── */
function SurplusModal({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<'cash' | 'discount' | 'charity'>('cash');
  const [confirmed, setConfirmed] = useState(false);

  const surplus = 28450;
  const eligibleMembers = 1142; // non-claiming participants
  const perMember = (surplus / eligibleMembers).toFixed(2);

  const options = [
    { id: 'cash', label: 'Cash Dividend Transfer', icon: PiggyBank, desc: 'BACS payment to registered bank account within 14 working days' },
    { id: 'discount', label: 'Policy Renewal Discount', icon: BadgePercent, desc: 'Applied as credit to next year\'s contribution schedule' },
    { id: 'charity', label: 'Donate to UK Charities', icon: HeartHandshake, desc: 'Distributed to vetted Shariah-compliant UK charities (member elected)' },
  ] as const;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-[#0e2117] border-white/10'}`}
      >
        <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: `${GREEN}20` }}>
              <Gift size={20} color={GREEN} />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Al-Fa&apos;id Al-Ta&apos;mini</h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Year-End Surplus Distribution — FY 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        {confirmed ? (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${GREEN}20` }}>
              <Check size={28} color={GREEN} />
            </motion.div>
            <div>
              <p className={`font-bold text-base ${isLight ? 'text-black/90' : 'text-white'}`}>Surplus Distribution Initiated</p>
              <p className={`text-xs mt-1 ${isLight ? 'text-black/55' : 'text-white/50'}`}>
                £{perMember} per eligible member ({eligibleMembers.toLocaleString()} non-claiming participants)<br />
                Method: <span className="font-semibold" style={{ color: GREEN }}>{options.find(o => o.id === selected)?.label}</span>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Surplus Summary */}
            <div className={`mt-4 grid grid-cols-3 gap-3`}>
              {[
                { label: 'Net Surplus', val: `£${surplus.toLocaleString()}`, color: GREEN },
                { label: 'Eligible Members', val: eligibleMembers.toLocaleString(), color: '#3b82f6' },
                { label: 'Per Member', val: `£${perMember}`, color: '#f59e0b' },
              ].map(({ label, val, color }) => (
                <div key={label} className={`p-3 rounded-xl text-center ${isLight ? 'bg-black/[0.03] border border-black/[0.06]' : 'bg-white/[0.04] border border-white/[0.06]'}`}>
                  <p className="text-sm font-bold" style={{ color }}>{val}</p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{label}</p>
                </div>
              ))}
            </div>

            <p className={`text-[11px] mt-4 p-3 rounded-xl ${isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-emerald-900/20 text-emerald-300 border border-emerald-500/20'}`}>
              Under AAOIFI Shariah Standard No. 26 and FSA Takaful Regulations, surplus remaining after statutory reserves belongs to non-claiming participants — not the operator.
            </p>

            {/* Distribution Method */}
            <div className="mt-4 space-y-2">
              <p className={`text-xs font-bold ${isLight ? 'text-black/70' : 'text-white/70'}`}>Distribution Method</p>
              {options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    selected === o.id
                      ? 'border-[#00c685]/40 bg-[#00c685]/08'
                      : isLight ? 'border-black/[0.08] hover:border-black/[0.15]' : 'border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${selected === o.id ? 'bg-[#00c685]/15' : isLight ? 'bg-black/[0.05]' : 'bg-white/[0.05]'}`}>
                    <o.icon size={14} className={selected === o.id ? 'text-[#00c685]' : isLight ? 'text-black/50' : 'text-white/40'} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{o.label}</p>
                    <p className={`text-[10px] mt-0.5 ${isLight ? 'text-black/50' : 'text-white/40'}`}>{o.desc}</p>
                  </div>
                  {selected === o.id && <Check size={14} color={GREEN} className="ml-auto shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t" style={{ borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.08)' }}>
              <button onClick={onClose} className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" style={{ borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.1)' }}>
                Cancel
              </button>
              <button
                onClick={() => setConfirmed(true)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-[#0a1a14] transition-all hover:opacity-90"
                style={{ background: GREEN }}
              >
                Initiate Distribution
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Qard Hasan Scenario Panel ──────────────────────────────────────────── */
function QardHasanPanel({ isLight }: { isLight: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`rounded-2xl border p-5 ${isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-500/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl shrink-0 ${isLight ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
          <Landmark size={16} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className={`text-sm font-bold ${isLight ? 'text-blue-900' : 'text-blue-300'}`}>Qard Hasan — Interest-Free Emergency Loan Protocol</p>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>Activated if total claims exceed pool balance (catastrophic deficit)</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${isLight ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
            >
              {expanded ? 'Hide' : 'Learn More'}
            </button>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="space-y-2">
                  {[
                    { step: '1', label: 'Pool Deficit Detected', desc: 'Winter storms / flash floods cause claims to exceed pool balance' },
                    { step: '2', label: 'Operator Injects Capital', desc: 'Takaful UK provides an interest-free benevolent loan (Qard Hasan) from corporate reserves' },
                    { step: '3', label: 'All Claims Settled Immediately', desc: 'No member is penalised — all approved claims paid in full without delay' },
                    { step: '4', label: 'Loan Recouped from Future Surplus', desc: 'Loan is repaid only from future underwriting surpluses — no rate hikes, no surcharges to members' },
                  ].map(({ step, label, desc }) => (
                    <div key={step} className="flex gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isLight ? 'bg-blue-200 text-blue-800' : 'bg-blue-500/30 text-blue-300'}`}>{step}</span>
                      <div>
                        <p className={`text-[11px] font-bold ${isLight ? 'text-blue-800' : 'text-blue-300'}`}>{label}</p>
                        <p className={`text-[10px] ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-3 p-3 rounded-xl text-[10px] ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                  Current pool health: <strong className={isLight ? 'text-blue-900' : 'text-blue-200'}>No deficit</strong> — Pool balance £482,150 · Reserve ratio 5.2x ✓
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Finance / Management: Full balance sheets & trends ─────────────────── */
function StrategicPoolView({ theme, isFinance }: { theme: string; isFinance?: boolean }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';

  const [showSurplusModal, setShowSurplusModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const poolDonut = [
    { name: 'Participant Fund', value: POOL.participantFundPct, color: GREEN, amount: `£${POOL.balance.toLocaleString()}` },
    { name: 'Claims Reserves', value: POOL.claimsReservePct, color: '#3b82f6', amount: `£${POOL.claimsReserve.toLocaleString()}` },
    { name: 'Wakala Fee', value: POOL.wakalaFeePct, color: '#f59e0b', amount: `£${POOL.totalWakalaFees.toLocaleString()}` },
  ];

  const handleExportCSV = () => {
    const headers = ['Category', 'Amount (£)', 'Percentage', 'Description'];
    const rows = [
      ['Participant Fund', POOL.balance, `${POOL.participantFundPct}%`, 'Reserved to pay claims'],
      ['Claims Reserve', POOL.claimsReserve, `${POOL.claimsReservePct}%`, 'Emergency buffer'],
      ['Wakala Fee', POOL.totalWakalaFees, `${POOL.wakalaFeePct}%`, 'Operator management fee'],
      ['Total Contributions', POOL.totalContributions, '100%', 'Cumulative pool inflows'],
      ['Total Claims Paid', POOL.totalClaimsPaid, '—', 'Direct pool outflows'],
    ];
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `takaful-pool-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg('Pool ledger CSV exported for Shariah Supervisory Board');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            className="fixed top-5 right-5 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs max-w-sm"
            style={{ background: GREEN }}
          >
            <Check size={14} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surplus Modal */}
      <AnimatePresence>
        {showSurplusModal && <SurplusModal isLight={isLight} onClose={() => setShowSurplusModal(false)} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Takaful Pool Ledger & Analysis</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>{isFinance ? 'Finance Treasury View — 70/15/15 Allocation Monitor' : 'Strategic Portfolio View'}</p>
        </div>
        <div className="flex items-center gap-2">
          {isFinance && (
            <button
              onClick={() => setShowSurplusModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0a1a14] transition-all hover:opacity-90"
              style={{ background: GREEN }}
            >
              <Gift size={13} /> Al-Fa&apos;id Surplus
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              isLight ? 'border-black/[0.06] text-black/70' : 'border-white/[0.06] text-white/70'
            }`}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Current Pool Balance" value={`£${POOL.balance.toLocaleString()}`} sub="Participant Help Fund" color={GREEN} tooltip="Available balance to pay active claims" theme={theme} />
        <MetricCard label="Cumulative Contributions" value={`£${POOL.totalContributions.toLocaleString()}`} sub="Overall pool inflows" color="#3b82f6" tooltip="Sum of all contributions collected" theme={theme} />
        <MetricCard label="Total Claims Settled" value={`£${POOL.totalClaimsPaid.toLocaleString()}`} sub="Direct pool outflows" color="#ef4444" tooltip="Total claims paid to date" theme={theme} />
        <MetricCard label="Total Operator Fees" value={`£${POOL.totalWakalaFees.toLocaleString()}`} sub="8% Wakāla allocation" color="#f59e0b" tooltip="Management fees charged by Operator" theme={theme} />
      </div>

      {/* Reserve Ratio + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReserveRatioGauge theme={theme} ratio={5.2} />

        {/* 70/15/15 Allocation Breakdown */}
        <div className={`lg:col-span-2 rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <h3 className={`font-semibold text-sm mb-1 ${isLight ? 'text-black/80' : 'text-white/80'}`}>AAOIFI Fund Allocation — 70/15/15</h3>
          <p className={`text-xs mb-4 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Mandatory Shariah split: Participant Fund · Claims Reserve · Wakāla Fee</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Participant Fund', pct: 70, amount: POOL.balance, color: GREEN, desc: 'Reserved strictly to pay approved claims' },
              { label: 'Claims Reserve', pct: 15, amount: POOL.claimsReserve, color: '#3b82f6', desc: 'Emergency buffer for major weather events' },
              { label: 'Wakāla Fee', pct: 15, amount: POOL.totalWakalaFees, color: '#f59e0b', desc: 'Operator fee for running Takaful UK' },
            ].map(({ label, pct, amount, color, desc }) => (
              <div key={label} className={`p-3 rounded-xl border ${isLight ? 'border-black/[0.06] bg-black/[0.02]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-extrabold" style={{ color }}>{pct}%</span>
                  <span className={`w-2 h-2 rounded-full`} style={{ background: color }} />
                </div>
                <p className={`text-[11px] font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{label}</p>
                <p className={`text-[10px] mt-0.5 font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>£{amount.toLocaleString()}</p>
                <p className={`text-[9px] mt-1.5 ${isLight ? 'text-black/40' : 'text-white/30'}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="h-56 w-full">
            <AreaChart
              data={POOL_HISTORY}
              xKey="month"
              theme={theme}
              height="100%"
              yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              series={[{ dataKey: "balance", name: "Pool Balance", color: GREEN }]}
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="rounded-2xl p-5 flex flex-col justify-between transition-colors"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div>
            <h3 className={`font-semibold text-sm mb-1 ${isLight ? 'text-black/80' : 'text-white/80'}`}>Capital Allocations</h3>
            <p className={`text-xs mb-4 ${isLight ? 'text-black/45' : 'text-white/40'}`}>How current assets are held</p>
            <div className="h-36 w-full mb-3 relative flex items-center justify-center">
              <DonutChart
                data={poolDonut}
                theme={theme}
                height="100%"
                valueFormatter={(v) => `${v}%`}
              />
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

      {/* Qard Hasan — Catastrophic Deficit Backup */}
      <QardHasanPanel isLight={isLight} />

      {/* Al-Fa'id Surplus Distribution CTA (Finance only) */}
      {isFinance && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-900/20 border-emerald-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${isLight ? 'bg-emerald-100' : 'bg-emerald-500/20'}`}>
              <Gift size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>Year-End Surplus: £28,450 available</p>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                FY 2026: Claims were lower than contributions. Under Shariah Board resolution, net surplus of £28,450 belongs to 1,142 non-claiming participants.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSurplusModal(true)}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0a1a14] transition-all hover:opacity-90"
            style={{ background: GREEN }}
          >
            <BadgePercent size={13} /> Distribute Surplus
          </button>
        </motion.div>
      )}

      {/* Ledger Transactions view for Finance */}
      {isFinance && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className={`rounded-2xl overflow-hidden ${isLight ? 'bg-white border border-black/[0.04]' : 'bg-[#0d2117] border border-white/[0.04]'}`}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
            <h3 className={`font-semibold text-sm ${isLight ? 'text-black/85' : 'text-white/85'}`}>Recent Cash Book Flows</h3>
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-[#00c685] flex items-center gap-0.5 hover:underline">
              Full Treasury <ChevronRight size={12} />
            </Link>
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
              <tbody className={`divide-y ${isLight ? 'divide-black/[0.04]' : 'divide-white/[0.04]'}`}>
                {[
                  { date: '21 Jul 2026', ref: 'TXN-PAY-001', type: 'Claim Payout', amt: '£380.00', dir: 'Outflow', status: 'Completed', color: 'text-red-400' },
                  { date: '01 Jul 2026', ref: 'TXN-8812', type: 'Contribution', amt: '£38.50', dir: 'Inflow', status: 'Reconciled', color: 'text-[#00c685]' },
                  { date: '01 Jul 2026', ref: 'TXN-8808', type: 'Contribution', amt: '£18.90', dir: 'Inflow', status: 'Failed', color: 'text-red-400' },
                  { date: '01 Jul 2026', ref: 'TXN-FEE-JUL', type: 'Wakāla Admin Fee', amt: '£4,912.00', dir: 'Outflow', status: 'Completed', color: 'text-amber-500' },
                ].map((t, idx) => (
                  <tr key={idx} className={`transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.01] ${t.status === 'Failed' ? isLight ? 'bg-red-50/60' : 'bg-red-900/10' : ''}`}>
                    <td className={`px-4 py-3 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{t.date}</td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: GREEN }}>{t.ref}</td>
                    <td className={`px-4 py-3 font-medium ${isLight ? 'text-black/75' : 'text-white/70'}`}>{t.type}</td>
                    <td className={`px-4 py-3 font-bold ${t.color}`}>{t.amt}</td>
                    <td className={`px-4 py-3 ${isLight ? 'text-black/55' : 'text-white/45'}`}>{t.dir}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.status === 'Reconciled' || t.status === 'Completed'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-400'
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
