'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Plus, Search, Filter, ChevronRight, Clock,
  CheckCircle2, AlertTriangle, XCircle, Calendar, Home,
  Building2, Layers, RefreshCcw, Download,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const CERTIFICATES = [
  { id: 'TK-2024-0042', participant: 'Fatima Al-Rashid', property: '14 Elm Street, Birmingham, B1 2PQ', type: 'Buildings', contribution: '£38.50/mo', limit: '£350,000', status: 'Active', renewal: '15 Jan 2027', started: '15 Jan 2024' },
  { id: 'TK-2024-0087', participant: 'Hassan Mahmoud', property: '8 Rose Avenue, London, E1 5TF', type: 'Contents', contribution: '£24.20/mo', limit: '£45,000', status: 'Active', renewal: '22 Mar 2027', started: '22 Mar 2024' },
  { id: 'TK-2024-0112', participant: 'Aisha Okonkwo', property: '33 Oak Lane, Manchester, M14 6PZ', type: 'Both', contribution: '£52.80/mo', limit: '£420,000', status: 'Active', renewal: '5 May 2027', started: '5 May 2024' },
  { id: 'TK-2024-0031', participant: 'Yusuf Ibrahim', property: '2 Cedar Road, Leeds, LS7 3BX', type: 'Buildings', contribution: '£41.00/mo', limit: '£280,000', status: 'Active', renewal: '10 Jan 2027', started: '10 Jan 2024' },
  { id: 'TK-2024-0098', participant: 'Maryam Patel', property: '19 Birch Close, Leicester, LE2 9KM', type: 'Contents', contribution: '£18.90/mo', limit: '£35,000', status: 'Expiring', renewal: '12 Aug 2026', started: '12 Aug 2023' },
  { id: 'TK-2024-0055', participant: 'Ibrahim Al-Sayed', property: '7 Maple Drive, Bristol, BS8 4LR', type: 'Both', contribution: '£61.20/mo', limit: '£550,000', status: 'Active', renewal: '20 Feb 2027', started: '20 Feb 2024' },
  { id: 'TK-2024-0073', participant: 'Zahra Hussein', property: '45 Pine Way, Sheffield, S7 2MN', type: 'Buildings', contribution: '£33.70/mo', limit: '£295,000', status: 'Pending', renewal: '—', started: '—' },
  { id: 'TK-2024-0019', participant: 'Khalid Rahman', property: '11 Willow Crescent, Coventry, CV3 1PQ', type: 'Contents', contribution: '£22.50/mo', limit: '£40,000', status: 'Cancelled', renewal: '—', started: '14 Dec 2023' },
];

const TABS = [
  { key: 'all', label: 'All', count: CERTIFICATES.length },
  { key: 'Active', label: 'Active', count: CERTIFICATES.filter(c => c.status === 'Active').length },
  { key: 'Expiring', label: 'Expiring', count: CERTIFICATES.filter(c => c.status === 'Expiring').length },
  { key: 'Pending', label: 'Pending', count: CERTIFICATES.filter(c => c.status === 'Pending').length },
  { key: 'Cancelled', label: 'Cancelled', count: CERTIFICATES.filter(c => c.status === 'Cancelled').length },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'bg-[#00c685]/10', text: 'text-[#00c685]', dot: 'bg-[#00c685]' },
  Expiring:  { bg: 'bg-amber-500/10',  text: 'text-amber-500',  dot: 'bg-amber-500' },
  Pending:   { bg: 'bg-blue-500/10',   text: 'text-blue-500',   dot: 'bg-blue-500' },
  Cancelled: { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40', dot: 'bg-black/20 dark:bg-white/20' },
};

const TYPE_ICON: Record<string, React.ElementType> = {
  Buildings: Building2,
  Contents: Home,
  Both: Layers,
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

const SUMMARY = [
  { label: 'Active Certificates', value: '1,284', color: '#00c685' },
  { label: 'Expiring (30 days)', value: '38', color: '#f59e0b' },
  { label: 'Pending Activation', value: '12', color: '#3b82f6' },
  { label: 'Avg. Monthly Contribution', value: '£41.30', color: '#8b5cf6' },
];

export default function CertificatesPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = CERTIFICATES.filter(c => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.participant.toLowerCase().includes(search.toLowerCase()) ||
      c.property.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Dynamic styles
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const BORDER_INPUT = isLight ? 'border-black/[0.06]' : 'border-white/[0.05]';
  const ROW_HOVER = isLight ? 'hover:bg-black/[0.015]' : 'hover:bg-white/[0.02]';

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Certificates</h1>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Manage Takaful protection certificates — Demo data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 shrink-0" style={{ background: GREEN }}>
          <Plus size={14} /> New Certificate
        </button>
      </motion.div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SUMMARY.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className="rounded-xl p-4 transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: s.color }} />
            <p className={`font-bold text-xl ${TEXT_MAIN}`}>{s.value}</p>
            <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        
        {/* Search + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search certificates or participants…"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-[#00c685]/40 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_MAIN}`} />
          </div>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${BORDER_INPUT} ${TEXT_SUB}`}><Filter size={12} /> Filter</button>
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${BORDER_INPUT} ${TEXT_SUB}`}><Download size={12} /> Export</button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex overflow-x-auto px-5 py-3 gap-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === tab.key ? 'bg-[#00c685]/15 text-[#00c685]' : `${TEXT_SUB} hover:text-[#00c685] hover:bg-black/5 dark:hover:bg-white/5`
              }`}>
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key ? 'bg-[#00c685]/20 text-[#00c685]' : `${BG_INPUT} ${TEXT_MUTED}`}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Certificate', 'Participant', 'Property', 'Type', 'Monthly', 'Limit', 'Renewal', 'Status', ''].map(h => (
                  <th key={h} className={`text-left px-5 py-3 font-semibold tracking-wide ${TEXT_MUTED}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <Shield size={32} className={TEXT_MUTED} />
                    <p className={`text-sm ${TEXT_SUB}`}>No certificates found</p>
                  </div>
                </td></tr>
              ) : filtered.map((c, i) => {
                const TypeIcon = TYPE_ICON[c.type] ?? Shield;
                return (
                  <motion.tr key={c.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`group transition-colors cursor-pointer ${ROW_HOVER}`}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <td className="px-5 py-3.5">
                      <Link href={`/dashboard/certificates/${c.id}`} className="font-mono text-[#00c685] hover:underline text-[11px] font-semibold">{c.id}</Link>
                    </td>
                    <td className={`px-5 py-3.5 font-medium whitespace-nowrap ${TEXT_MAIN}`}>{c.participant}</td>
                    <td className={`px-5 py-3.5 max-w-[200px] truncate ${TEXT_SUB}`}>{c.property}</td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1.5 ${TEXT_SUB}`}>
                        <TypeIcon size={11} />{c.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 font-semibold whitespace-nowrap ${TEXT_MAIN}`}>{c.contribution}</td>
                    <td className={`px-5 py-3.5 whitespace-nowrap ${TEXT_SUB}`}>{c.limit}</td>
                    <td className={`px-5 py-3.5 whitespace-nowrap ${TEXT_SUB}`}>
                      {c.status === 'Expiring' ? <span className="text-amber-500 font-semibold">{c.renewal}</span> : c.renewal}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5">
                      <ChevronRight size={14} className={`${TEXT_MUTED} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className={`text-xs ${TEXT_MUTED}`}>Showing {filtered.length} of {CERTIFICATES.length} certificates</p>
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
