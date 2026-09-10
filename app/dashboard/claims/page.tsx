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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';

const GREEN = '#00c685';
const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.06 } }),
};

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
function ParticipantClaimsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';

  const myClaims = CLAIMS.filter(c => c.participantId === 'P-0042');
  const totalClaimed = myClaims.reduce((acc, c) => acc + c.amountClaimed, 0);
  const totalApproved = myClaims.filter(c => ['Approved', 'Paid'].includes(c.status)).reduce((acc, c) => acc + (c.amountApproved ?? c.amountClaimed), 0);
  const inReviewCount = myClaims.filter(c => !['Paid', 'Approved', 'Rejected'].includes(c.status)).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Breadcrumb */}
      <div className={`text-xs flex items-center gap-1.5 font-medium ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
        <span>Dashboard</span>
        <ChevronRight size={12} className="opacity-50" />
        <span className={isLight ? 'text-gray-700 font-semibold' : 'text-white/70 font-semibold'}>Claims</span>
      </div>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>My Claims</h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>Track, submit, and review status of your Takaful protection claims.</p>
        </div>
        <Link href="/dashboard/claims/new">
          <Button className="gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-95 shadow-sm" style={{ background: GREEN }}>
            <Plus size={15} /> New Claim
          </Button>
        </Link>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>TOTAL CLAIMED</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>£{totalClaimed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          <p className={`text-xs mt-2 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>{myClaims.length} claim{myClaims.length !== 1 ? 's' : ''} submitted to date</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>APPROVED / PAID</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>£{totalApproved.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs mt-2 font-semibold text-[#00c685] flex items-center gap-1">
            <CheckCircle2 size={13} /> {myClaims.filter(c => c.status === 'Paid').length} claim settled
          </p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>ACTIVE IN REVIEW</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{inReviewCount}</p>
          <p className={`text-xs mt-2 font-semibold ${inReviewCount > 0 ? 'text-amber-500' : isLight ? 'text-gray-500' : 'text-white/45'}`}>
            {inReviewCount > 0 ? 'Assessor assigned & under review' : 'No pending claims'}
          </p>
        </div>
      </div>

      {/* Claims List */}
      {myClaims.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center shadow-sm`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <FileText size={36} className={`mx-auto mb-3 ${isLight ? 'text-gray-300' : 'text-white/20'}`} />
          <p className={`text-sm font-medium ${isLight ? 'text-gray-500' : 'text-white/40'}`}>No claims on record. Click &quot;New Claim&quot; to make your first claim.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'}`}>Claim Records</h3>
          {myClaims.map((c, i) => (
            <motion.div key={c.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
              <Link href={`/dashboard/claims/${c.id}`} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl transition-all shadow-sm ${isLight ? 'bg-white border border-[#E4E7EC] hover:border-gray-300 hover:shadow-md' : 'bg-[#0d2117] border border-white/5 hover:border-white/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white/80'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`font-mono text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white/90'}`}>{c.id}</span>
                      <StatusBadge status={c.status} />
                      <StatusBadge status={c.priority} />
                    </div>
                    <p className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{c.type} · {c.propertyAddress}</p>
                    <p className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>Submitted {c.submittedDate} · Incident date {c.incidentDate}</p>
                    {c.lastActivityNote && (
                      <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/55'}`}>{c.lastActivityNote}</p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: BORDER }}>
                  <div>
                    <p className={`text-base font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>£{c.amountClaimed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                    <p className={`text-[11px] text-right ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Amount Claimed</p>
                  </div>
                  <ChevronRight size={16} className={`hidden sm:block mt-3 ${isLight ? 'text-gray-400' : 'text-white/30'}`} />
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
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';

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

      {/* Claims trend chart for management */}
      {!isFinance && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>Claims Volume Trend</h3>
          <p className={`text-xs mb-5 ${isLight ? 'text-gray-500' : 'text-white/40'}`}>Monthly claim frequency and inflow</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLAIMS_TREND} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" name="Claims" fill={GREEN} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
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
    case 'participant': return <ParticipantClaimsView theme={theme} />;
    case 'claim_handler': return <HandlerClaimsView theme={theme} />;
    case 'finance': return <HandlerClaimsView theme={theme} isFinance />;
    case 'management': return <HandlerClaimsView theme={theme} />;
    default: return <HandlerClaimsView theme={theme} />;
  }
}
