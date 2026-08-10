'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Download, Filter, Search, CheckCircle2,
  Clock, XCircle, AlertTriangle, TrendingUp, Calendar,
  ChevronDown, ArrowUpRight, Info, Plus, RefreshCw,
  User, Check, DollarSign,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme, useRole } from '../ThemeRoleContext';
import { CONTRIBUTIONS, CONTRIBUTION_TREND } from '@/lib/dashboard/mock-data';
import { Contribution } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};

const GREEN = '#00c685';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Collected: { bg: 'bg-[#00c685]/10', text: 'text-[#00c685]', dot: 'bg-[#00c685]' },
    Pending:   { bg: 'bg-blue-500/10',  text: 'text-blue-500',  dot: 'bg-blue-500' },
    Failed:    { bg: 'bg-red-500/10',   text: 'text-red-500',   dot: 'bg-red-500' },
    Retried:   { bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
  };
  const s = map[status] ?? { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40', dot: 'bg-black/20 dark:bg-white/20' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

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
          <span className="font-semibold">£{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Participant view: My contributions ledger ──────────────────────────── */
function ParticipantContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const myContributions = CONTRIBUTIONS.filter(c => c.participantId === 'P-0042');

  const [toast, setToast] = useState<string | null>(null);

  const handleUpdateDirectDebit = () => {
    setToast('Direct Debit Mandate verification sent to your bank.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>My Contributions</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Track and manage your regular Takaful contribution payments.</p>
        </div>
        <button
          onClick={handleUpdateDirectDebit}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{ background: GREEN }}
        >
          <CreditCard size={14} /> Update Bank Mandate
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl text-xs font-semibold text-white" style={{ background: GREEN }}>
          {toast}
        </div>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Upcoming Payment</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>£38.50</p>
          <p className={`text-xs mt-1 text-[#00c685] font-medium`}>Due 1 Aug 2026 via Direct Debit</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collection Method</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Direct Debit</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Bank of Scotland ···· 1242</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Total Contributed MTD</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>£231.00</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-black/50' : 'text-white/45'}`}>6 successful collections</p>
        </div>
      </div>

      {/* Ledger list */}
      <div className={`rounded-2xl overflow-hidden`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className={`font-semibold text-sm ${isLight ? 'text-black/85' : 'text-white/85'}`}>Contribution History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['Reference', 'Due Date', 'Collected Date', 'Method', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
              {myContributions.map(c => (
                <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                  <td className="px-5 py-4 font-mono font-semibold" style={{ color: GREEN }}>{c.id}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{c.dueDate}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{c.collectedDate ?? '—'}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/55' : 'text-white/45'}`}>{c.method}</td>
                  <td className={`px-5 py-4 font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>£{c.amount.toFixed(2)}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Finance / Management: Full ledger & collection analytics ───────────── */
function TreasuryContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const CHART_GRID = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Contribution[]>(() => CONTRIBUTIONS);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRetryCollection = (id: string) => {
    setList(prev => prev.map(c => c.id === id ? { ...c, status: 'Retried' } : c));
    showToast(`Initiated retry collection for transaction ${id}`);
  };

  const handleReconcileAll = () => {
    setList(prev => prev.map(c => c.status === 'Collected' ? { ...c, status: 'Collected' } : c));
    showToast('All collected contributions reconciled with treasury records.');
  };

  const filtered = list.filter(t => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = !search ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.participantName.toLowerCase().includes(search.toLowerCase()) ||
      t.certificateId.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const failedCount = list.filter(c => c.status === 'Failed').length;
  const collectionRate = Math.round((list.filter(c => c.status === 'Collected').length / list.length) * 100);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Contributions Control</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Treasury ledger collection verification and audits.</p>
        </div>
        <button
          onClick={handleReconcileAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{ background: GREEN }}
        >
          <CheckCircle2 size={14} /> Reconcile Ledger
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl text-xs font-semibold text-white bg-blue-500">
          {toast}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collected (MTD)</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>£61,400</p>
          <p className={`text-[10px] mt-1 text-[#00c685] font-semibold`}>+£3,200 vs June</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collection Rate</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>{collectionRate}%</p>
          <p className={`text-[10px] mt-1 ${isLight ? 'text-black/40' : 'text-white/30'}`}>First-attempt success rate</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Failed Direct Debits</p>
          <p className="text-2xl font-bold text-red-400">{failedCount}</p>
          <p className={`text-[10px] mt-1 ${isLight ? 'text-black/40' : 'text-white/30'}`}>Requires manual intervention</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Total Mandates</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>1,284</p>
          <p className={`text-[10px] mt-1 text-[#00c685] font-semibold`}>99% Active status</p>
        </div>
      </div>

      {/* Collection Chart */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
        className="rounded-2xl p-5 transition-colors"
        style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        <h3 className={`font-semibold text-sm mb-1 ${isLight ? 'text-black/85' : 'text-white/85'}`}>Monthly Collection Inflows</h3>
        <p className={`text-xs mb-5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collected cash volume versus targets</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={COUNT_TREND}>
              <defs>
                <linearGradient id="gCollected2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip content={<ChartTooltip theme={theme} />} />
              <Area type="monotone" dataKey="total" name="Collected" stroke={GREEN} fill="url(#gCollected2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Grid of details */}
      <div className={`rounded-2xl overflow-hidden`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className="flex flex-col md:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-black/35' : 'text-white/30'}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, name, or cert..."
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/40 bg-black/[0.01] dark:bg-white/[0.01] ${isLight ? 'border-black/[0.06] text-black' : 'border-white/[0.05] text-white'}`}
            />
          </div>
          
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'Collected', 'Failed', 'Pending'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === tab
                    ? 'bg-[#00c685]/15 border-[#00c685]/35 text-[#00c685]'
                    : isLight
                      ? 'border-black/[0.06] bg-black/[0.02] text-black/60 hover:text-black hover:border-black/20'
                      : 'border-white/[0.05] bg-white/[0.02] text-white/55 hover:text-white hover:border-white/15'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['ID', 'Participant', 'Certificate', 'Due Date', 'Collected Date', 'Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
              {filtered.map(c => (
                <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                  <td className="px-5 py-4 font-mono font-semibold" style={{ color: GREEN }}>{c.id}</td>
                  <td className={`px-5 py-4 font-medium ${isLight ? 'text-black/75' : 'text-white/70'}`}>{c.participantName}</td>
                  <td className="px-5 py-4 font-mono text-[11px]">{c.certificateId}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{c.dueDate}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{c.collectedDate ?? '—'}</td>
                  <td className={`px-5 py-4 font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>£{c.amount.toFixed(2)}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4">
                    {c.status === 'Failed' ? (
                      <button
                        onClick={() => handleRetryCollection(c.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-bold transition-all"
                      >
                        <RefreshCw size={10} /> Retry
                      </button>
                    ) : (
                      <span className={`text-[10px] ${isLight ? 'text-black/35' : 'text-white/30'}`}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const COUNT_TREND = CONTRIBUTION_TREND;

export default function ContributionsPage() {
  const { theme } = useTheme();
  const { role } = useRole();

  switch (role) {
    case 'participant':
      return <ParticipantContributionsView theme={theme} />;
    case 'finance':
    case 'management':
    default:
      return <TreasuryContributionsView theme={theme} />;
  }
}
