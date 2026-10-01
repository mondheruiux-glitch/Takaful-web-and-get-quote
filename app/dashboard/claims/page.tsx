'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Search, Filter, ChevronRight, Clock,
  CheckCircle2, AlertCircle, XCircle, AlertTriangle,
  Banknote, BarChart3, TrendingUp, ShieldCheck, FileCheck, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { useRole, useTheme } from '../ThemeRoleContext';
import { CLAIMS, CLAIMS_TREND } from '@/lib/dashboard/mock-data';
import { Claim } from '@/lib/dashboard/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DualAxisTrendChart } from '@/components/charts';

const GREEN = '#00c685';
const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.06 } }),
};

function ChartTooltip({ active, payload, label, theme }: any) {
  if (!active || !payload?.length) return null;
  const isLight = theme === 'light';
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl"
      style={{ background: isLight ? '#fff' : '#1e2433', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', color: isLight ? '#000' : '#fff' }}>
      <p className={`${isLight ? 'text-black/50' : 'text-white/50'} mb-1.5 font-medium`}>{label}</p>
      {payload.map((p: any, i: number) => {
        const val = p?.value;
        const formatted = typeof val === 'number'
          ? (p?.name?.toLowerCase().includes('value') || p?.name?.toLowerCase().includes('£')
            ? `£${val.toLocaleString()}`
            : val.toLocaleString())
          : String(val ?? '—');
        return (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p?.color }} />
            <span className={isLight ? 'text-black/70' : 'text-white/70'}>{p?.name}:</span>
            <span className="font-semibold">{formatted}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Submitted':            'bg-blue-500/15 text-blue-500',
    'Under Review':         'bg-amber-500/15 text-amber-500',
    'Awaiting Information': 'bg-orange-500/15 text-orange-500',
    'Approved':             'bg-green-500/15 text-green-500',
    'Rejected':             'bg-red-500/15 text-red-500',
    'Paid':                 'bg-emerald-500/15 text-emerald-500',
    'Low':                  'bg-emerald-500/15 text-emerald-500',
    'Medium':               'bg-amber-500/15 text-amber-500',
    'High':                 'bg-orange-500/15 text-orange-500',
    'Critical':             'bg-red-500/15 text-red-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-gray-500/15 text-gray-500'}`}>
      {status}
    </span>
  );
}

/* ─── Participant view ───────────────────────────────────────────────────── */
/* ─── Participant view (simplified, editorial) ───────────────────────────── */
function ParticipantClaimsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const BG_PANEL = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const allMyClaims = CLAIMS.filter(c => c.participantId === 'P-0042');
  const myClaims = allMyClaims
    .filter(c => statusFilter === 'All'
      || (statusFilter === 'In Review' && !['Paid', 'Approved', 'Rejected'].includes(c.status))
      || (statusFilter === 'Approved' && ['Approved', 'Paid'].includes(c.status))
      || c.status === statusFilter
    )
    .filter(c => !search
      || c.id.toLowerCase().includes(search.toLowerCase())
      || c.type.toLowerCase().includes(search.toLowerCase())
      || c.status.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">

      {/* ── 1. Editorial Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${
          isLight ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white/[0.04] border-white/[0.08] text-white/70'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          Mutual Protection
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className={`font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08] ${isLight ? 'text-gray-900' : 'text-white'}`}>
              My Claims
            </h1>
            <p className={`mt-2 text-base sm:text-lg leading-relaxed max-w-xl ${isLight ? 'text-gray-500' : 'text-white/45'}`}>
              Track and manage your Takaful claims. Your community pool is here to support you.
            </p>
          </div>
          <Link href="/dashboard/claims/new">
            <button className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto ${
              isLight ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
            }`}>
              <Plus size={15} />
              New Claim
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-white/30'}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by claim ID or type…"
            className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
              isLight ? 'border-black/[0.08] bg-white text-black placeholder:text-black/30' : 'border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/25'
            }`}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'In Review', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-[#00c685]/15 text-[#00c685]'
                  : isLight
                    ? 'text-gray-500 hover:text-gray-900'
                    : 'text-white/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Claims list */}
      {myClaims.length === 0 ? (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className={`rounded-3xl p-14 text-center border ${isLight ? 'bg-gray-50 border-black/[0.05]' : 'bg-white/[0.02] border-white/[0.05]'}`}
        >
          <FileText size={36} className={`mx-auto mb-4 ${isLight ? 'text-gray-300' : 'text-white/20'}`} />
          <p className={`text-sm font-medium ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
            {search || statusFilter !== 'All' ? 'No claims match your filters.' : 'No claims yet. Click "New Claim" when you need support.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {myClaims.map((c, i) => (
            <motion.div key={c.id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 2}>
              <Link
                href={`/dashboard/claims/${c.id}`}
                className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all hover:shadow-sm group ${
                  c.status === 'Rejected'
                    ? isLight ? 'bg-red-50/60 border-red-200/60 hover:border-red-300' : 'bg-red-950/10 border-red-500/15 hover:border-red-500/25'
                    : isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.12]' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    c.status === 'Rejected' ? 'bg-red-100 text-red-500' : isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/[0.08] text-white/70'
                  }`}>
                    <FileText size={18} />
                  </div>
                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`font-mono text-xs font-semibold ${isLight ? 'text-gray-500' : 'text-white/40'}`}>{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className={`text-sm font-semibold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>{c.type}</p>
                    <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                      {c.propertyAddress} · Submitted {c.submittedDate}
                    </p>
                    {c.status === 'Rejected' && c.rejectionReason && (
                      <p className={`text-xs mt-2 ${isLight ? 'text-red-600' : 'text-red-400'}`}>
                        <span className="font-semibold">Reason: </span>{c.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
                {/* Amount + arrow */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className={`text-base font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      £{c.amountClaimed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/30'}`}>Claimed</p>
                  </div>
                  <ChevronRight size={16} className={`${isLight ? 'text-gray-300' : 'text-white/20'} group-hover:text-[#00c685] transition-colors`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Handler / Management view ──────────────────────────────────────────── */
function HandlerClaimsView({ theme, isFinance }: { theme: string; isFinance?: boolean }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL = isLight ? '#ffffff' : '#1e2433';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Submitted', 'Under Review', 'Awaiting Information', 'Approved', 'Rejected', 'Paid'];
  const filtered = CLAIMS
    .filter(c => statusFilter === 'All' || c.status === statusFilter)
    .filter(c => !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.participantName.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()));

  const totalValue = CLAIMS.reduce((sum, c) => sum + c.amountClaimed, 0);
  const approvedValue = CLAIMS.filter(c => ['Approved', 'Paid'].includes(c.status)).reduce((sum, c) => sum + (c.amountApproved ?? c.amountClaimed), 0);
  const openCount = CLAIMS.filter(c => !['Paid','Rejected'].includes(c.status)).length;
  const overdueCount = CLAIMS.filter(c => c.daysOpen > 10 && !['Paid','Rejected'].includes(c.status)).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Breadcrumb */}
      <div className={`text-xs flex items-center gap-1.5 font-medium ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
        <span>Dashboard</span>
        <ChevronRight size={12} className="opacity-50" />
        <span className={isLight ? 'text-gray-700 font-semibold' : 'text-white/70 font-semibold'}>Claims Operations</span>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{isFinance ? 'Claims — Treasury Disbursement' : 'Claims Control'}</h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>Overview of active claims, assessments, and payouts.</p>
        </div>
      </motion.div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>TOTAL CLAIMS VOLUME</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{CLAIMS.length}</p>
          <p className={`text-xs mt-2 font-semibold text-[#00c685]`}>£{(totalValue / 1000).toFixed(1)}k total claimed</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>OPEN / IN REVIEW</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{openCount}</p>
          <p className="text-xs mt-2 font-semibold text-amber-500">Requires handler action</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>APPROVED / PAID</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>£{(approvedValue / 1000).toFixed(1)}k</p>
          <p className={`text-xs mt-2 font-semibold text-[#00c685]`}>{CLAIMS.filter(c => c.status === 'Approved').length} ready for release</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>OVERDUE CLAIMS (&gt;10d)</p>
          <p className={`text-3xl font-extrabold tracking-tight ${overdueCount > 0 ? 'text-red-500' : isLight ? 'text-gray-900' : 'text-white'}`}>{overdueCount}</p>
          <p className={`text-xs mt-2 font-semibold ${overdueCount > 0 ? 'text-red-500' : isLight ? 'text-gray-400' : 'text-white/35'}`}>
            {overdueCount > 0 ? 'Priority escalation needed' : 'All SLAs on track'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-white/30'}`} />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by claim ID, name, or type..."
            className={`pl-9 text-xs h-9 ${isLight ? 'border-[#E4E7EC]' : 'border-white/10 bg-white/5 text-white'}`}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                statusFilter === s
                  ? 'bg-[#00c685]/15 border-[#00c685]/35 text-[#00c685]'
                  : isLight
                    ? 'border-[#E4E7EC] bg-gray-50 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    : 'border-white/5 bg-white/5 text-white/55 hover:text-white hover:border-white/15'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl overflow-hidden shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-gray-400 border-b border-[#E4E7EC]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['Claim ID', 'Participant', 'Type', 'Claimed £', isFinance ? 'Approved £' : 'Days Open', 'Priority', 'Status', 'Handler', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-gray-50' : 'divide-white/[0.03]'}`}>
              {filtered.map(c => (
                <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-gray-50/60' : 'hover:bg-white/[0.02]'}`}>
                  <td className={`px-5 py-4 font-mono font-semibold ${isLight ? 'text-gray-900' : 'text-white/90'}`}>{c.id}</td>
                  <td className={`px-5 py-4 font-medium ${isLight ? 'text-gray-900' : 'text-white/80'}`}>{c.participantName}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>{c.type}</td>
                  <td className={`px-5 py-4 font-bold ${isLight ? 'text-gray-900' : 'text-white/80'}`}>£{c.amountClaimed.toLocaleString()}</td>
                  {isFinance ? (
                    <td className="px-5 py-4 font-bold text-[#00c685]">
                      {c.amountApproved !== undefined ? `£${c.amountApproved.toLocaleString()}` : '—'}
                    </td>
                  ) : (
                    <td className="px-5 py-4">
                      <span className={`font-bold ${c.daysOpen > 10 ? 'text-red-500' : c.daysOpen > 5 ? 'text-amber-500' : isLight ? 'text-gray-600' : 'text-white/60'}`}>{c.daysOpen}d</span>
                    </td>
                  )}
                  <td className="px-5 py-4"><StatusBadge status={c.priority} /></td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className={`px-5 py-4 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>{c.assignedHandlerName ?? '—'}</td>
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/claims/${c.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: GREEN }}>
                      View <ChevronRight size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-5 py-8 text-center text-sm ${isLight ? 'text-gray-400' : 'text-white/30'}`}>No claims match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Claims trend chart with modern AreaChart design */}
      {!isFinance && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            <div>
              <h3 className={`text-sm font-semibold ${isLight ? 'text-black/85' : 'text-white/85'}`}>
                Claims Volume & Value (2026)
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>
                Monthly claim frequency and total claim value inflow
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Claims Count</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>£ Value</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="h-56 w-full">
              <DualAxisTrendChart
                data={CLAIMS_TREND}
                xKey="month"
                theme={theme}
                height="100%"
                leftSeries={{
                  dataKey: "count",
                  name: "Claims Count",
                  color: "#3b82f6",
                  axis: "left",
                }}
                rightSeries={{
                  dataKey: "value",
                  name: "Claims Value (£)",
                  color: "#f59e0b",
                  axis: "right",
                  formatter: (v) => `£${(v / 1000).toFixed(0)}k`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Root router ────────────────────────────────────────────────────────── */
export default function ClaimsPage() {
  const { role } = useRole();
  const { theme } = useTheme();

  switch (role) {
    case 'claim_handler': return <HandlerClaimsView theme={theme} />;
    case 'finance': return <HandlerClaimsView theme={theme} isFinance />;
    case 'management': return <HandlerClaimsView theme={theme} />;
    default: return <HandlerClaimsView theme={theme} />;
  }
}
