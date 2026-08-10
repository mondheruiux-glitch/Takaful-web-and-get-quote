'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, CreditCard, FileText, Clock, ArrowRight,
  CheckCircle2, AlertCircle, TrendingUp, TrendingDown,
  Users, PieChart, Banknote, BarChart3, Activity,
  CircleDot, ChevronRight, Bell, RefreshCw, XCircle,
  Building2, Package, AlertTriangle, Flame,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend,
} from 'recharts';
import Link from 'next/link';
import { useRole } from './ThemeRoleContext';
import { useTheme } from './ThemeRoleContext';
import {
  CLAIMS, CONTRIBUTIONS, POOL, PARTICIPANT_GROWTH,
  CLAIMS_TREND, CONTRIBUTION_TREND, POOL_HISTORY,
  PARTICIPANTS, CERTIFICATES, CLAIMS_AWAITING_PAYMENT,
  TRANSACTIONS,
} from '@/lib/dashboard/mock-data';

/* ─── Shared tokens ──────────────────────────────────────────────────────── */
const GREEN = '#00c685';
const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};

/* ─── Shared sub-components ─────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, theme }: any) {
  if (!active || !payload?.length) return null;
  const isLight = theme === 'light';
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl"
      style={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', color: isLight ? '#000' : '#fff' }}>
      <p className={`${isLight ? 'text-black/50' : 'text-white/50'} mb-1.5 font-medium`}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={isLight ? 'text-black/70' : 'text-white/70'}>{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' && (p.name?.toLowerCase().includes('£') || p.name?.toLowerCase().includes('amount') || p.name?.toLowerCase().includes('value') || p.name?.toLowerCase().includes('contribution') || p.name?.toLowerCase().includes('balance') || p.name?.toLowerCase().includes('collected') || p.name?.toLowerCase().includes('failed') || p.name?.toLowerCase().includes('paid') || p.name?.toLowerCase().includes('claim') || p.name?.toLowerCase().includes('total')) ? `£${p.value.toLocaleString()}` : p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function KPICard({ label, value, sub, icon: Icon, trend, color = GREEN, custom, delay = 0, theme }: {
  label: string; value: string; sub?: string; icon?: React.ElementType;
  trend?: { dir: 'up' | 'down'; text: string }; color?: string; custom?: React.ReactNode;
  delay?: number; theme: string;
}) {
  const isLight = theme === 'light';
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={delay}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/40' : 'text-white/35'}`}>{label}</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>{value}</p>
          {sub && <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{sub}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
            <Icon size={18} style={{ color }} />
          </div>
        )}
      </div>
      {custom}
      {trend && (
        <div className={`flex items-center gap-1.5 text-xs font-medium`}>
          {trend.dir === 'up'
            ? <TrendingUp size={13} className="text-[#00c685]" />
            : <TrendingDown size={13} className="text-red-400" />}
          <span className={trend.dir === 'up' ? 'text-[#00c685]' : 'text-red-400'}>{trend.text}</span>
        </div>
      )}
    </motion.div>
  );
}

function SectionCard({ title, children, action, theme }: { title: string; children: React.ReactNode; action?: React.ReactNode; theme: string }) {
  const isLight = theme === 'light';
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className={`text-sm font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Submitted':           'bg-blue-500/15 text-blue-500',
    'Under Review':        'bg-amber-500/15 text-amber-500',
    'Awaiting Information':'bg-orange-500/15 text-orange-500',
    'Approved':            'bg-green-500/15 text-green-500',
    'Rejected':            'bg-red-500/15 text-red-500',
    'Paid':                'bg-emerald-500/15 text-emerald-500',
    'Active':              'bg-green-500/15 text-green-500',
    'Expiring':            'bg-amber-500/15 text-amber-500',
    'Collected':           'bg-emerald-500/15 text-emerald-500',
    'Failed':              'bg-red-500/15 text-red-500',
    'Pending':             'bg-blue-500/15 text-blue-500',
    'Retried':             'bg-orange-500/15 text-orange-500',
    'Low':                 'bg-emerald-500/15 text-emerald-500',
    'Medium':              'bg-amber-500/15 text-amber-500',
    'High':                'bg-orange-500/15 text-orange-500',
    'Critical':            'bg-red-500/15 text-red-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-gray-500/15 text-gray-500'}`}>
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PARTICIPANT OVERVIEW                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ParticipantOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const myCert = { id: 'TK-2024-0042', propertyAddress: '14 Elm Street, Birmingham, B1 2PQ', coverType: 'Buildings', buildingsLimit: 350000, monthlyContribution: 38.50, renewalDate: '15 Jan 2027', status: 'Active' };
  const myClaims = CLAIMS.filter(c => c.participantId === 'P-0042');
  const myContribs = CONTRIBUTIONS.filter(c => c.participantId === 'P-0042');

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>As-salamu alaykum, Fatima 👋</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Here's your Takaful summary for today.</p>
        </div>
        <Link href="/dashboard/claims" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: GREEN }}>
          <FileText size={15} />
          Make a Claim
        </Link>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Certificate" value={myCert.id} sub={`Active · Expires ${myCert.renewalDate}`} icon={ShieldCheck} delay={0} theme={theme} />
        <KPICard label="Buildings Cover" value="£350,000" sub="Limit" icon={Building2} delay={1} theme={theme} />
        <KPICard label="Monthly Contribution" value="£38.50" sub="Due 1 Aug 2026" icon={CreditCard} delay={2} theme={theme} />
        <KPICard label="Open Claims" value={`${myClaims.filter(c => !['Paid','Rejected'].includes(c.status)).length}`} sub="Currently active" icon={FileText} delay={3} theme={theme} color="#f59e0b" />
      </div>

      {/* Cover card + open claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="My Current Cover" theme={theme} action={<Link href="/dashboard/my-cover" className="text-xs font-medium text-[#00c685] flex items-center gap-1">View full details <ChevronRight size={12} /></Link>}>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isLight ? 'rgba(0,198,133,0.06)' : 'rgba(0,198,133,0.08)' }}>
              <ShieldCheck size={28} style={{ color: GREEN }} />
              <div>
                <p className={`font-bold text-sm ${isLight ? 'text-black/90' : 'text-white'}`}>Certificate {myCert.id}</p>
                <p className={`text-xs ${isLight ? 'text-black/50' : 'text-white/45'}`}>{myCert.propertyAddress}</p>
              </div>
              <span className="ml-auto"><StatusBadge status="Active" /></span>
            </div>
            {[
              { label: 'Cover Type', value: 'Buildings' },
              { label: 'Buildings Limit', value: '£350,000' },
              { label: 'Cover Risks', value: 'Storm, Fire, Flood, Subsidence, Escape of Water' },
              { label: 'Renewal Date', value: '15 Jan 2027' },
            ].map(row => (
              <div key={row.label} className={`flex justify-between text-xs py-2 ${isLight ? 'border-b border-black/5' : 'border-b border-white/5'}`}>
                <span className={isLight ? 'text-black/50' : 'text-white/45'}>{row.label}</span>
                <span className={`font-medium ${isLight ? 'text-black/80' : 'text-white/80'}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="My Claims" theme={theme} action={<Link href="/dashboard/claims" className="text-xs font-medium text-[#00c685] flex items-center gap-1">View all <ChevronRight size={12} /></Link>}>
          <div className="divide-y" style={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
            {myClaims.length === 0 ? (
              <p className={`p-5 text-sm ${isLight ? 'text-black/40' : 'text-white/35'}`}>No claims on record.</p>
            ) : myClaims.map(claim => (
              <Link key={claim.id} href={`/dashboard/claims/${claim.id}`} className={`flex items-start gap-3 p-4 transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GREEN}15` }}>
                  <FileText size={15} style={{ color: GREEN }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white'}`}>{claim.id}</p>
                    <StatusBadge status={claim.status} />
                  </div>
                  <p className={`text-xs ${isLight ? 'text-black/50' : 'text-white/45'} truncate`}>{claim.type} · {claim.incidentDate}</p>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{claim.lastActivityNote}</p>
                </div>
                <span className={`text-xs font-semibold ${isLight ? 'text-black/60' : 'text-white/60'}`}>£{claim.amountClaimed.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent contributions + Pool transparency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Recent Contributions" theme={theme} action={<Link href="/dashboard/contributions" className="text-xs font-medium text-[#00c685] flex items-center gap-1">Manage <ChevronRight size={12} /></Link>}>
          <div className="divide-y" style={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
            {myContribs.map(c => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-2 h-2 rounded-full ${c.status === 'Collected' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <div className="flex-1">
                  <p className={`text-xs font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>Due {c.dueDate}</p>
                  <p className={`text-[11px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>{c.method}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white'}`}>£{c.amount.toFixed(2)}</p>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Takaful Pool — Your Share" theme={theme} action={<Link href="/dashboard/pool" className="text-xs font-medium text-[#00c685] flex items-center gap-1">Learn more <ChevronRight size={12} /></Link>}>
          <div className="p-5 space-y-3">
            <p className={`text-xs leading-relaxed ${isLight ? 'text-black/55' : 'text-white/50'}`}>
              Your contributions go into a shared pool used to help all participants. Here's how the pool is structured:
            </p>
            {[
              { label: 'Participant Fund', pct: POOL.participantFundPct, color: GREEN },
              { label: 'Claims Reserve', pct: POOL.claimsReservePct, color: '#f59e0b' },
              { label: 'Wakāla Fee', pct: POOL.wakalaFeePct, color: '#94a3b8' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={isLight ? 'text-black/60' : 'text-white/55'}>{item.label}</span>
                  <span className="font-semibold" style={{ color: item.color }}>{item.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
            <p className={`text-[11px] mt-2 ${isLight ? 'text-black/35' : 'text-white/30'}`}>Pool balance: £{POOL.balance.toLocaleString()} · {POOL.periodLabel}</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* CLAIM HANDLER OVERVIEW                                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ClaimHandlerOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const myQueue = CLAIMS.filter(c => c.assignedHandlerId === 'U-HAND-001' && !['Paid', 'Rejected'].includes(c.status));
  const awaitingDocs = CLAIMS.filter(c => c.status === 'Awaiting Information');
  const overdue = CLAIMS.filter(c => c.daysOpen > 10 && !['Paid', 'Rejected'].includes(c.status));
  const approvedMTD = CLAIMS.filter(c => c.status === 'Approved' || c.status === 'Paid');

  const statusCounts = ['Submitted', 'Under Review', 'Awaiting Information', 'Approved', 'Paid'].map(s => ({
    name: s.replace('Awaiting Information', 'Awaiting'), count: CLAIMS.filter(c => c.status === s).length,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Claims Handler Dashboard</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Omar Hassan · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link href="/dashboard/queue" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: GREEN }}>
          <ClipboardList size={15} />
          My Queue
        </Link>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="My Queue" value={`${myQueue.length}`} sub="Claims assigned to me" icon={Activity} delay={0} theme={theme} />
        <KPICard label="Awaiting Documents" value={`${awaitingDocs.length}`} sub="On hold for evidence" icon={AlertCircle} delay={1} theme={theme} color="#f59e0b" />
        <KPICard label="Overdue (>10 days)" value={`${overdue.length}`} sub="Breaching SLA" icon={Clock} delay={2} theme={theme} color="#ef4444" />
        <KPICard label="Approved (MTD)" value={`${approvedMTD.length}`} sub={`£${approvedMTD.reduce((s, c) => s + (c.amountApproved ?? 0), 0).toLocaleString()} total`} icon={CheckCircle2} delay={3} theme={theme} color="#10b981" />
      </div>

      {/* Priority queue table + pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <SectionCard title="Priority Claims — Action Required" theme={theme} action={<Link href="/dashboard/claims" className="text-xs font-medium text-[#00c685] flex items-center gap-1">All claims <ChevronRight size={12} /></Link>}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/30 border-b border-white/[0.04]'}>
                    {['Claim ID', 'Participant', 'Type', 'Days Open', 'Priority', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
                  {CLAIMS.filter(c => !['Paid', 'Rejected'].includes(c.status)).sort((a, b) => b.daysOpen - a.daysOpen).map(c => (
                    <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold" style={{ color: GREEN }}>{c.id}</span>
                      </td>
                      <td className={`px-4 py-3 font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.participantName}</td>
                      <td className={`px-4 py-3 ${isLight ? 'text-black/55' : 'text-white/55'}`}>{c.type}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${c.daysOpen > 10 ? 'text-red-400' : c.daysOpen > 5 ? 'text-amber-400' : isLight ? 'text-black/70' : 'text-white/70'}`}>{c.daysOpen}d</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c.priority} /></td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/claims/${c.id}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white" style={{ background: GREEN }}>
                          Review <ArrowRight size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Pipeline Overview" theme={theme}>
            <div className="p-4 space-y-2">
              {statusCounts.map(({ name, count }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className={`text-xs w-28 shrink-0 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{name}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(count * 20, 100)}%`, background: GREEN }} />
                  </div>
                  <span className={`text-xs font-bold w-4 text-right ${isLight ? 'text-black/70' : 'text-white/70'}`}>{count}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="My Avg. Handling Time" theme={theme}>
            <div className="p-5 text-center">
              <p className="text-4xl font-bold" style={{ color: GREEN }}>6.2</p>
              <p className={`text-xs mt-1 ${isLight ? 'text-black/50' : 'text-white/45'}`}>days average (MTD)</p>
              <div className={`mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-400`}>
                <TrendingDown size={12} />
                <span>0.8 days faster than last month</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Claims trend */}
      <SectionCard title="Claims Volume & Value (2026)" theme={theme}>
        <div className="p-5 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CLAIMS_TREND} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip content={<ChartTooltip theme={theme} />} />
              <Bar yAxisId="left" dataKey="count" name="Count" fill={`${GREEN}80`} radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="value" name="£ Value" fill={GREEN} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* FINANCE OVERVIEW                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */
function FinanceOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const failedContribs = CONTRIBUTIONS.filter(c => c.status === 'Failed');
  const collectionRate = Math.round((CONTRIBUTIONS.filter(c => c.status === 'Collected').length / CONTRIBUTIONS.length) * 100);
  const awaitingPayment = CLAIMS_AWAITING_PAYMENT;
  const totalAwaitingPmt = awaitingPayment.reduce((s, c) => s + (c.amountApproved ?? 0), 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Finance Overview</h1>
        <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Amira Siddiqui · Period: {POOL.periodLabel}</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Pool Balance" value={`£${POOL.balance.toLocaleString()}`} sub={POOL.periodLabel} icon={PieChart} delay={0} theme={theme} trend={{ dir: 'up', text: '+£19,150 vs Jun' }} />
        <KPICard label="Collection Rate" value={`${collectionRate}%`} sub={`${CONTRIBUTIONS.filter(c => c.status === 'Collected').length} of ${CONTRIBUTIONS.length} collected`} icon={TrendingUp} delay={1} theme={theme} />
        <KPICard label="Failed Collections" value={`${failedContribs.length}`} sub={`£${failedContribs.reduce((s,c) => s+c.amount, 0).toFixed(2)} outstanding`} icon={AlertTriangle} delay={2} theme={theme} color="#ef4444" />
        <KPICard label="Awaiting Payment" value={`£${totalAwaitingPmt.toLocaleString()}`} sub={`${awaitingPayment.length} approved claims`} icon={Banknote} delay={3} theme={theme} color="#f59e0b" />
      </div>

      {/* Payments queue + contribution trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <SectionCard title="Claims Awaiting Payment" theme={theme} action={<Link href="/dashboard/claims-payments" className="text-xs font-medium text-[#00c685] flex items-center gap-1">Manage all <ChevronRight size={12} /></Link>}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/30 border-b border-white/[0.04]'}>
                    {['Claim', 'Participant', 'Type', 'Approved £', 'Days Waiting', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
                  {awaitingPayment.map(c => (
                    <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                      <td className="px-4 py-3 font-mono font-semibold" style={{ color: GREEN }}>{c.id}</td>
                      <td className={`px-4 py-3 font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.participantName}</td>
                      <td className={`px-4 py-3 ${isLight ? 'text-black/55' : 'text-white/55'}`}>{c.type}</td>
                      <td className={`px-4 py-3 font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>£{(c.amountApproved ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-amber-400">{c.daysOpen}d</td>
                      <td className="px-4 py-3">
                        <Link href="/dashboard/claims-payments" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white" style={{ background: GREEN }}>
                          Release <Banknote size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Pool Allocation" theme={theme}>
            <div className="p-4">
              <RechartsPie width={180} height={160} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie data={[
                  { name: 'Participant Fund', value: POOL.participantFundPct },
                  { name: 'Claims Reserve', value: POOL.claimsReservePct },
                  { name: 'Wakāla Fee', value: POOL.wakalaFeePct },
                ]} cx={85} cy={75} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {[GREEN, '#f59e0b', '#94a3b8'].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)' }} />
              </RechartsPie>
            </div>
          </SectionCard>

          <SectionCard title="Failed Direct Debits" theme={theme}>
            <div className="divide-y" style={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
              {failedContribs.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <XCircle size={14} className="text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.participantName}</p>
                    <p className={`text-[11px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>Due {c.dueDate}</p>
                  </div>
                  <span className={`text-xs font-bold ${isLight ? 'text-black/70' : 'text-white/70'}`}>£{c.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Contribution trend chart */}
      <SectionCard title="Contribution Collection Trend (2026)" theme={theme}>
        <div className="p-5 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CONTRIBUTION_TREND}>
              <defs>
                <linearGradient id="gcollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip content={<ChartTooltip theme={theme} />} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke={GREEN} fill="url(#gcollected)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" fill="none" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MANAGEMENT OVERVIEW                                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ManagementOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const totalParticipants = PARTICIPANT_GROWTH[PARTICIPANT_GROWTH.length - 1].participants;
  const prevParticipants = PARTICIPANT_GROWTH[PARTICIPANT_GROWTH.length - 2].participants;
  const participantGrowth = totalParticipants - prevParticipants;
  const claimsMTD = CLAIMS_TREND[CLAIMS_TREND.length - 1].count;
  const claimsPrev = CLAIMS_TREND[CLAIMS_TREND.length - 2].count;
  const claimsDelta = claimsMTD - claimsPrev;
  const collectionRate = 97.1;
  const overdueClaims = CLAIMS.filter(c => c.daysOpen > 10 && !['Paid','Rejected'].includes(c.status));
  const failedDDs = CONTRIBUTIONS.filter(c => c.status === 'Failed').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Management Overview</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Ahmed Khan · Operations Director · {POOL.periodLabel}</p>
        </div>
        <div className="flex gap-2">
          {overdueClaims.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <AlertCircle size={13} />
              {overdueClaims.length} overdue claim{overdueClaims.length > 1 ? 's' : ''}
            </div>
          )}
          {failedDDs > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              <AlertTriangle size={13} />
              {failedDDs} failed DDs
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active Participants" value={totalParticipants.toLocaleString()} sub={`+${participantGrowth} this month`} icon={Users} delay={0} theme={theme} trend={{ dir: 'up', text: `+${participantGrowth} MoM` }} />
        <KPICard label="Pool Balance" value={`£${(POOL.balance / 1000).toFixed(0)}k`} sub="Participant fund" icon={PieChart} delay={1} theme={theme} trend={{ dir: 'up', text: '+£19,150 vs Jun' }} />
        <KPICard label="Claims (MTD)" value={`${claimsMTD}`} sub={`£${CLAIMS_TREND[CLAIMS_TREND.length - 1].value.toLocaleString()} total value`} icon={FileText} delay={2} theme={theme} color={claimsDelta > 0 ? '#f59e0b' : GREEN} trend={{ dir: claimsDelta > 0 ? 'up' : 'down', text: `${Math.abs(claimsDelta)} vs last month` }} />
        <KPICard label="Collection Rate" value={`${collectionRate}%`} sub="Direct Debit success" icon={TrendingUp} delay={3} theme={theme} trend={{ dir: 'up', text: '+0.3% vs Jun' }} />
      </div>

      {/* Growth + Pool trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Participant Growth (2026)" theme={theme}>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PARTICIPANT_GROWTH}>
                <defs>
                  <linearGradient id="gpart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 20']} />
                <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                <Area type="monotone" dataKey="participants" name="Participants" stroke={GREEN} fill="url(#gpart)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Pool Balance Trend (2026)" theme={theme}>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={POOL_HISTORY}>
                <defs>
                  <linearGradient id="gpool" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                <Area type="monotone" dataKey="balance" name="Pool Balance" stroke="#6366f1" fill="url(#gpool)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Claims performance + Operational alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Claims Performance (2026)" theme={theme}>
            <div className="p-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLAIMS_TREND} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                  <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                  <Bar yAxisId="l" dataKey="count" name="Count" fill={`${GREEN}70`} radius={[3,3,0,0]} />
                  <Bar yAxisId="r" dataKey="value" name="£ Value" fill={GREEN} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Operational Alerts" theme={theme}>
          <div className="divide-y" style={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
            {overdueClaims.map(c => (
              <Link key={c.id} href={`/dashboard/claims/${c.id}`} className={`flex items-start gap-3 p-4 transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{c.id}</p>
                  <p className={`text-[11px] ${isLight ? 'text-black/50' : 'text-white/45'}`}>{c.participantName} · {c.daysOpen}d open</p>
                </div>
                <ChevronRight size={12} className={isLight ? 'text-black/30' : 'text-white/25'} />
              </Link>
            ))}
            {failedDDs > 0 && (
              <div className="flex items-start gap-3 p-4">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{failedDDs} Failed Direct Debits</p>
                  <p className={`text-[11px] ${isLight ? 'text-black/50' : 'text-white/45'}`}>Require manual retry</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>All Shariah controls compliant</p>
                <p className={`text-[11px] ${isLight ? 'text-black/50' : 'text-white/45'}`}>Last audit: 1 Jul 2026</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ─── Missing icon import fix ─── */
const ClipboardList = Activity;

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ROOT PAGE — ROLE ROUTER                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { role } = useRole();
  const { theme } = useTheme();

  switch (role) {
    case 'participant':   return <ParticipantOverview theme={theme} />;
    case 'claim_handler': return <ClaimHandlerOverview theme={theme} />;
    case 'finance':       return <FinanceOverview theme={theme} />;
    case 'management':    return <ManagementOverview theme={theme} />;
    default:              return <ManagementOverview theme={theme} />;
  }
}
