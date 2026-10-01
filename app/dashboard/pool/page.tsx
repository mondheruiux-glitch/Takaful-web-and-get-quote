'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
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

function ChartTooltip({ active, payload, label, theme }: any) {
  if (!active || !payload?.length) return null;
  const isLight = theme === 'light';
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl transition-colors duration-200"
      style={{
        background: isLight ? '#ffffff' : '#1e2433',
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
    <div className={`rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-200 ${isLight ? 'shadow-sm' : ''}`} style={{ background: isLight ? '#ffffff' : '#1e2433', border: `1px solid ${BORDER}` }}>
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

/* ─── Finance / Management: Full balance sheets & trends ─────────────────── */
function StrategicPoolView({ theme, isFinance }: { theme: string; isFinance?: boolean }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#1e2433';
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

        {/* Allocation Donut Card */}
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
