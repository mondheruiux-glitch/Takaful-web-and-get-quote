'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Search, Filter, ArrowUpRight, CheckCircle2,
  Clock, AlertTriangle, XCircle, ChevronRight, Calendar,
  Download, Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const CLAIMS = [
  { id: 'CLM-2024-0891', participant: 'Fatima Al-Rashid', certId: 'TK-2024-0042', type: 'Buildings', description: 'Storm damage to roof', amount: '£4,200', date: '18 Jul 2026', status: 'Under Review', priority: 'High' },
  { id: 'CLM-2024-0890', name: 'Hassan Mahmoud', certId: 'TK-2024-0087', type: 'Contents', description: 'Water leak in kitchen', amount: '£1,850', date: '17 Jul 2026', status: 'Approved', priority: 'Medium' },
  { id: 'CLM-2024-0889', participant: 'Aisha Okonkwo', certId: 'TK-2024-0112', type: 'Both', description: 'Accidental glass damage', amount: '£380', date: '15 Jul 2026', status: 'Paid', priority: 'Low' },
  { id: 'CLM-2024-0888', participant: 'Yusuf Ibrahim', certId: 'TK-2024-0031', type: 'Buildings', description: 'Lock replacement', amount: '£250', date: '10 Jul 2026', status: 'Rejected', priority: 'Low' },
  { id: 'CLM-2024-0887', participant: 'Maryam Patel', certId: 'TK-2024-0098', type: 'Contents', description: 'Bicycle theft', amount: '£650', date: '05 Jul 2026', status: 'Approved', priority: 'Medium' },
  { id: 'CLM-2024-0886', participant: 'Ibrahim Al-Sayed', certId: 'TK-2024-0055', type: 'Both', description: 'Subsidence assessment', amount: '£12,400', date: '02 Jul 2026', status: 'Under Review', priority: 'High' },
];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'Under Review', label: 'Under Review' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Paid', label: 'Paid' },
  { key: 'Rejected', label: 'Rejected' },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'Under Review': { bg: 'bg-blue-500/10',   text: 'text-blue-500',   dot: 'bg-blue-500' },
  'Approved':     { bg: 'bg-[#00c685]/10',  text: 'text-[#00c685]',  dot: 'bg-[#00c685]' },
  'Paid':         { bg: 'bg-[#00c685]/10',  text: 'text-[#00c685]',  dot: 'bg-[#00c685]' },
  'Rejected':     { bg: 'bg-red-500/10',    text: 'text-red-500',    dot: 'bg-red-500' },
};

const PRIORITY_COLOR: Record<string, string> = {
  High: 'text-red-500',
  Medium: 'text-amber-500',
  Low: 'text-blue-500',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status] ?? { bg: 'bg-white/5', text: 'text-white/40', dot: 'bg-white/20' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function ClaimsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = CLAIMS.filter(c => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.participant && c.participant.toLowerCase().includes(search.toLowerCase())) ||
      (c.name && c.name.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Dynamic Theme Colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const BORDER_INPUT = isLight ? 'border-black/8' : 'border-white/8';
  const ROW_HOVER = isLight ? 'hover:bg-black/[0.015]' : 'hover:bg-white/[0.02]';

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Claims Management</h1>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Assess and manage Takaful claims requests — Demo data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 shrink-0" style={{ background: GREEN }}>
          <Plus size={14} /> New Claim
        </button>
      </motion.div>

      {/* Summary KPI Small Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pending Assessment', value: '14 claims', color: '#3b82f6' },
          { label: 'Assessed (MTD)', value: '42 claims', color: GREEN },
          { label: 'Paid Out (MTD)', value: '£48,200', color: '#10b981' },
          { label: 'Rejection Rate', value: '4.8%', color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className="rounded-xl p-4 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: s.color }} />
            <p className={`font-bold text-xl ${TEXT_MAIN}`}>{s.value}</p>
            <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Module */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl overflow-hidden transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        
        {/* Search / filter row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claims or participants…"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs transition-colors focus:outline-none focus:border-[#00c685]/40 ${BG_INPUT} ${BORDER_INPUT} ${TEXT_MAIN}`} />
          </div>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${BORDER_INPUT} ${TEXT_SUB}`}><Filter size={12} /> Filter</button>
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${BORDER_INPUT} ${TEXT_SUB}`}><Download size={12} /> Export</button>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex overflow-x-auto px-5 py-3 gap-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === tab.key ? 'bg-[#00c685]/15 text-[#00c685]' : `${TEXT_SUB} hover:text-[#00c685] hover:bg-black/5 dark:hover:bg-white/5`
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Claim ID', 'Participant', 'Incident Description', 'Type', 'Amount', 'Date', 'Priority', 'Status', ''].map(h => (
                  <th key={h} className={`text-left px-5 py-3 font-semibold tracking-wide ${TEXT_MUTED}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <FileText size={32} className={TEXT_MUTED} />
                    <p className={`text-sm ${TEXT_SUB}`}>No claims found</p>
                  </div>
                </td></tr>
              ) : filtered.map((c, i) => (
                <motion.tr key={c.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className={`group transition-colors cursor-pointer ${ROW_HOVER}`}
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/claims/${c.id}`} className="font-mono text-[#00c685] hover:underline text-[11px] font-semibold">{c.id}</Link>
                  </td>
                  <td className={`px-5 py-3.5 font-medium whitespace-nowrap ${TEXT_MAIN}`}>{c.participant || c.name}</td>
                  <td className={`px-5 py-3.5 max-w-[200px] truncate ${TEXT_SUB}`}>{c.description}</td>
                  <td className={`px-5 py-3.5 whitespace-nowrap ${TEXT_SUB}`}>{c.type}</td>
                  <td className={`px-5 py-3.5 font-semibold whitespace-nowrap ${TEXT_MAIN}`}>{c.amount}</td>
                  <td className={`px-5 py-3.5 whitespace-nowrap ${TEXT_SUB}`}>{c.date}</td>
                  <td className={`px-5 py-3.5 font-semibold whitespace-nowrap ${PRIORITY_COLOR[c.priority]}`}>{c.priority}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5">
                    <ChevronRight size={14} className={`${TEXT_MUTED} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className={`text-xs ${TEXT_MUTED}`}>Showing {filtered.length} of {CLAIMS.length} claims</p>
          <div className="flex items-center gap-1">
            {[1, 2].map(n => (
              <button key={n} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === 1 ? 'bg-[#00c685]/15 text-[#00c685]' : `${TEXT_MUTED} hover:bg-black/5 dark:hover:bg-white/5`}`}>{n}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
