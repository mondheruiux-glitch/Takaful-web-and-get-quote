'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Filter, Plus, ChevronRight, Download, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, DollarSign, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const GREEN = '#00c685';
const SURFACE = '#0d2117';
const SURFACE2 = '#112218';
const BORDER = 'rgba(255,255,255,0.07)';
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

/* ─── Mock data ──────────────────────────────────────────────────── */
const ALL_CLAIMS = [
  { id: 'CLM-2024-0891', participant: 'Fatima Al-Rashid', certId: 'TK-2024-0042', type: 'Buildings', incidentDate: '18 Jul 2026', claimedAmt: '£4,200', approvedAmt: '—', status: 'Under Review', adjuster: 'Omar Hassan', priority: 'High' },
  { id: 'CLM-2024-0890', participant: 'Hassan Mahmoud', certId: 'TK-2024-0087', type: 'Contents', incidentDate: '17 Jul 2026', claimedAmt: '£1,850', approvedAmt: '—', status: 'Awaiting Docs', adjuster: 'Leila Nkosi', priority: 'Medium' },
  { id: 'CLM-2024-0889', participant: 'Aisha Okonkwo', certId: 'TK-2024-0112', type: 'Both', incidentDate: '15 Jul 2026', claimedAmt: '£7,500', approvedAmt: '£7,200', status: 'Approved', adjuster: 'Omar Hassan', priority: 'High' },
  { id: 'CLM-2024-0888', participant: 'Yusuf Ibrahim', certId: 'TK-2024-0031', type: 'Buildings', incidentDate: '10 Jul 2026', claimedAmt: '£2,100', approvedAmt: '£2,100', status: 'Paid', adjuster: 'Leila Nkosi', priority: 'Low' },
  { id: 'CLM-2024-0887', participant: 'Maryam Patel', certId: 'TK-2024-0098', type: 'Contents', incidentDate: '8 Jul 2026', claimedAmt: '£950', approvedAmt: '£0', status: 'Rejected', adjuster: 'Khalid Farooq', priority: 'Low' },
  { id: 'CLM-2024-0886', participant: 'Ibrahim Al-Sayed', certId: 'TK-2024-0055', type: 'Buildings', incidentDate: '5 Jul 2026', claimedAmt: '£12,400', approvedAmt: '£10,800', status: 'Paid', adjuster: 'Omar Hassan', priority: 'High' },
  { id: 'CLM-2024-0885', participant: 'Zahra Hussein', certId: 'TK-2024-0073', type: 'Contents', incidentDate: '1 Jul 2026', claimedAmt: '£3,200', approvedAmt: '—', status: 'Under Review', adjuster: 'Leila Nkosi', priority: 'Medium' },
  { id: 'CLM-2024-0884', participant: 'Khalid Rahman', certId: 'TK-2024-0019', type: 'Both', incidentDate: '28 Jun 2026', claimedAmt: '£5,600', approvedAmt: '—', status: 'New', adjuster: 'Unassigned', priority: 'Medium' },
  { id: 'CLM-2024-0883', participant: 'Nadia Khaled', certId: 'TK-2024-0067', type: 'Buildings', incidentDate: '25 Jun 2026', claimedAmt: '£8,900', approvedAmt: '£8,900', status: 'Paid', adjuster: 'Khalid Farooq', priority: 'High' },
];

const TABS = [
  { key: 'all', label: 'All Claims', count: ALL_CLAIMS.length },
  { key: 'New', label: 'New', count: ALL_CLAIMS.filter(c => c.status === 'New').length },
  { key: 'Under Review', label: 'Under Review', count: ALL_CLAIMS.filter(c => c.status === 'Under Review').length },
  { key: 'Awaiting Docs', label: 'Awaiting Docs', count: ALL_CLAIMS.filter(c => c.status === 'Awaiting Docs').length },
  { key: 'Approved', label: 'Approved', count: ALL_CLAIMS.filter(c => c.status === 'Approved').length },
  { key: 'Paid', label: 'Paid', count: ALL_CLAIMS.filter(c => c.status === 'Paid').length },
  { key: 'Rejected', label: 'Rejected', count: ALL_CLAIMS.filter(c => c.status === 'Rejected').length },
];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string; dot: string }> = {
  'New':            { icon: Plus,          bg: 'bg-purple-500/10',  text: 'text-purple-400',  dot: 'bg-purple-400' },
  'Under Review':   { icon: Loader2,       bg: 'bg-blue-500/10',    text: 'text-blue-400',    dot: 'bg-blue-400' },
  'Awaiting Docs':  { icon: AlertTriangle, bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  'Approved':       { icon: CheckCircle2,  bg: 'bg-[#00c685]/10',   text: 'text-[#00c685]',  dot: 'bg-[#00c685]' },
  'Paid':           { icon: CheckCircle2,  bg: 'bg-[#00c685]/10',   text: 'text-[#00c685]',  dot: 'bg-[#00c685]' },
  'Rejected':       { icon: XCircle,       bg: 'bg-red-500/10',     text: 'text-red-400',     dot: 'bg-red-400' },
};

const PRIORITY_CONFIG: Record<string, string> = {
  High: 'text-red-400',
  Medium: 'text-amber-400',
  Low: 'text-white/40',
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { bg: 'bg-white/5', text: 'text-white/50', dot: 'bg-white/30' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

const SUMMARY_STATS = [
  { label: 'Total Open',    value: '23',      color: '#3b82f6', icon: Clock },
  { label: 'Paid (MTD)',    value: '£42,500', color: GREEN,      icon: CheckCircle2 },
  { label: 'Avg. Days',     value: '6.4',     color: '#f59e0b', icon: Clock },
  { label: 'Rejection Rate',value: '8.2%',    color: '#ef4444', icon: XCircle },
];

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ALL_CLAIMS.filter(c => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesSearch = !search || 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.participant.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-lg font-bold">Claims Management</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage and process participant claims — Demo data</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#0a1a14] transition-all hover:opacity-90 shrink-0"
          style={{ background: GREEN }}
        >
          <Plus size={14} /> New Claim
        </button>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SUMMARY_STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
              className="rounded-xl p-4 flex items-center gap-3" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                <Icon size={15} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">{s.value}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table panel */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        
        {/* Filters row */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID or participant…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-[#00c685]/40 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors">
              <Filter size={12} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors">
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex overflow-x-auto px-5 py-3 gap-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#00c685]/15 text-[#00c685]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key ? 'bg-[#00c685]/20 text-[#00c685]' : 'bg-white/5 text-white/30'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Claim ID', 'Participant', 'Certificate', 'Type', 'Claimed', 'Approved', 'Priority', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={9}>
                      <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <FileText size={32} className="text-white/15" />
                        <p className="text-white/40 text-sm font-medium">No claims found</p>
                        <p className="text-white/25 text-xs">Try adjusting your filters or search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/[0.025] transition-colors group"
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                    >
                      <td className="px-5 py-3.5">
                        <Link href={`/dashboard/claims/${c.id}`} className="font-mono text-[#00c685] hover:underline text-[11px]">{c.id}</Link>
                      </td>
                      <td className="px-5 py-3.5 text-white/80 font-medium">{c.participant}</td>
                      <td className="px-5 py-3.5 font-mono text-white/40 text-[11px]">{c.certId}</td>
                      <td className="px-5 py-3.5 text-white/50">{c.type}</td>
                      <td className="px-5 py-3.5 text-white font-semibold">{c.claimedAmt}</td>
                      <td className="px-5 py-3.5 text-white/60">{c.approvedAmt}</td>
                      <td className={`px-5 py-3.5 font-semibold ${PRIORITY_CONFIG[c.priority]}`}>{c.priority}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-3.5">
                        <Link href={`/dashboard/claims/${c.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={14} className="text-white/40" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-white/30 text-xs">Showing {filtered.length} of {ALL_CLAIMS.length} claims</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === 1 ? 'bg-[#00c685]/15 text-[#00c685]' : 'text-white/30 hover:bg-white/5 hover:text-white/70'}`}>{n}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
