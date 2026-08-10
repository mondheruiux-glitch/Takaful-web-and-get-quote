'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Search, Filter, ChevronRight, Clock,
  CheckCircle2, AlertCircle, XCircle, AlertTriangle,
  Banknote, BarChart3, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useRole, useTheme } from '../ThemeRoleContext';
import { CLAIMS, CLAIMS_TREND } from '@/lib/dashboard/mock-data';
import { Claim } from '@/lib/dashboard/types';
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
  const myClaims = CLAIMS.filter(c => c.participantId === 'P-0042');
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>My Claims</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>{myClaims.length} claim{myClaims.length !== 1 ? 's' : ''} on record</p>
        </div>
        <Link href="/dashboard/claims/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: GREEN }}>
          <Plus size={15} />
          New Claim
        </Link>
      </motion.div>

      {myClaims.length === 0 ? (
        <div className={`rounded-2xl p-10 text-center ${isLight ? 'bg-white border border-black/[0.04]' : 'bg-[#0d2117] border border-white/[0.04]'}`}>
          <FileText size={32} className={`mx-auto mb-3 ${isLight ? 'text-black/20' : 'text-white/20'}`} />
          <p className={isLight ? 'text-black/40' : 'text-white/35'}>No claims yet. Make your first claim when you need us.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myClaims.map((c, i) => (
            <motion.div key={c.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
              <Link href={`/dashboard/claims/${c.id}`} className={`flex items-start gap-4 p-5 rounded-2xl transition-all ${isLight ? 'bg-white border border-black/[0.04] hover:border-[#00c685]/30' : 'bg-[#0d2117] border border-white/[0.04] hover:border-[#00c685]/30'}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GREEN}18` }}>
                  <FileText size={17} style={{ color: GREEN }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold" style={{ color: GREEN }}>{c.id}</span>
                    <StatusBadge status={c.status} />
                    <StatusBadge status={c.priority} />
                  </div>
                  <p className={`text-sm font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.type} · {c.propertyAddress}</p>
                  <p className={`text-xs mt-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Submitted {c.submittedDate} · Incident {c.incidentDate}</p>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>{c.lastActivityNote}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>£{c.amountClaimed.toLocaleString()}</p>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-black/40' : 'text-white/35'}`}>Claimed</p>
                  <ChevronRight size={14} className={`mt-2 ml-auto ${isLight ? 'text-black/30' : 'text-white/25'}`} />
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Submitted', 'Under Review', 'Awaiting Information', 'Approved', 'Rejected', 'Paid'];
  const filtered = CLAIMS
    .filter(c => statusFilter === 'All' || c.status === statusFilter)
    .filter(c => !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.participantName.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Total', count: CLAIMS.length, color: GREEN },
    { label: 'Open', count: CLAIMS.filter(c => !['Paid','Rejected'].includes(c.status)).length, color: '#f59e0b' },
    { label: 'Approved', count: CLAIMS.filter(c => c.status === 'Approved').length, color: '#10b981' },
    { label: 'Overdue', count: CLAIMS.filter(c => c.daysOpen > 10 && !['Paid','Rejected'].includes(c.status)).length, color: '#ef4444' },
  ];

  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const BORDER_INPUT = isLight ? 'border-black/[0.06]' : 'border-white/[0.05]';

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>{isFinance ? 'Claims — Payment View' : 'All Claims'}</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>{CLAIMS.length} claims total</p>
        </div>
      </motion.div>

      {/* Stat chips */}
      <div className="flex flex-wrap gap-3">
        {stats.map(s => (
          <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <span style={{ color: s.color }}>{s.count}</span>
            <span className={isLight ? 'text-black/55' : 'text-white/50'}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl border flex-1 transition-colors ${isLight ? 'bg-black/[0.03] border-black/[0.06] text-black' : 'bg-white/[0.04] border-white/[0.05] text-white'}`}>
          <Search size={14} className={isLight ? 'text-black/35' : 'text-white/30'} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by claim ID, name, or type..."
            className={`flex-1 bg-transparent text-sm outline-none placeholder:text-xs placeholder:font-medium ${isLight ? 'text-black placeholder:text-black/30' : 'text-white placeholder:text-white/30'}`}
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
                    ? 'border-black/[0.06] bg-black/[0.02] text-black/60 hover:text-black hover:border-black/20'
                    : 'border-white/[0.05] bg-white/[0.02] text-white/55 hover:text-white hover:border-white/15'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`rounded-2xl overflow-hidden`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['Claim ID', 'Participant', 'Type', 'Claimed £', isFinance ? 'Approved £' : 'Days Open', 'Priority', 'Status', 'Handler', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
              {filtered.map(c => (
                <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                  <td className="px-5 py-4 font-mono font-bold" style={{ color: GREEN }}>{c.id}</td>
                  <td className={`px-5 py-4 font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.participantName}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/55' : 'text-white/55'}`}>{c.type}</td>
                  <td className={`px-5 py-4 font-semibold ${isLight ? 'text-black/70' : 'text-white/70'}`}>£{c.amountClaimed.toLocaleString()}</td>
                  {isFinance ? (
                    <td className="px-5 py-4 font-bold text-[#00c685]">
                      {c.amountApproved !== undefined ? `£${c.amountApproved.toLocaleString()}` : '—'}
                    </td>
                  ) : (
                    <td className="px-5 py-4">
                      <span className={`font-bold ${c.daysOpen > 10 ? 'text-red-400' : c.daysOpen > 5 ? 'text-amber-400' : isLight ? 'text-black/60' : 'text-white/60'}`}>{c.daysOpen}d</span>
                    </td>
                  )}
                  <td className="px-5 py-4"><StatusBadge status={c.priority} /></td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/50' : 'text-white/45'}`}>{c.assignedHandlerName ?? '—'}</td>
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/claims/${c.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-white transition-opacity hover:opacity-85" style={{ background: GREEN }}>
                      View <ChevronRight size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-5 py-8 text-center text-sm ${isLight ? 'text-black/35' : 'text-white/30'}`}>No claims match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Claims trend chart for management */}
      {!isFinance && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`rounded-2xl overflow-hidden`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <div className={`flex items-center justify-between px-5 py-4 border-b`} style={{ borderColor: BORDER }}>
            <h3 className={`text-sm font-semibold ${isLight ? 'text-black/85' : 'text-white/85'}`}>Claims Volume Trend</h3>
          </div>
          <div className="p-5 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLAIMS_TREND} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" name="Claims" fill={GREEN} radius={[4,4,0,0]} />
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
