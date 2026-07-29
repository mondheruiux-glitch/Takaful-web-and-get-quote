'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Folder, Search, Filter, Download, Upload, FileText,
  Shield, CreditCard, ImageIcon, File, ChevronDown,
  MoreHorizontal, Eye, Trash2, Share2,
} from 'lucide-react';
import { useTheme } from '../layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const CATEGORIES = [
  { key: 'all', label: 'All Documents', count: 42 },
  { key: 'certificate', label: 'Certificates', count: 12 },
  { key: 'claim', label: 'Claim Documents', count: 18 },
  { key: 'financial', label: 'Financial', count: 8 },
  { key: 'correspondence', label: 'Correspondence', count: 4 },
];

const FILE_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  pdf:  { icon: FileText, color: '#ef4444' },
  zip:  { icon: Folder, color: '#f59e0b' },
  jpg:  { icon: ImageIcon, color: '#3b82f6' },
  png:  { icon: ImageIcon, color: '#3b82f6' },
  xlsx: { icon: '#00c685', color: '#00c685' }, // Resolved visually
  doc:  { icon: File, color: '#6366f1' },
};

const DOCUMENTS = [
  { id: 'DOC-001', name: 'Certificate TK-2024-0042.pdf', category: 'certificate', size: '0.8 MB', date: '15 Jan 2024', participant: 'Fatima Al-Rashid', type: 'pdf', status: 'Active' },
  { id: 'DOC-002', name: 'Claim Evidence CLM-0891.zip', category: 'claim', size: '14.5 MB', date: '18 Jul 2026', participant: 'Fatima Al-Rashid', type: 'zip', status: 'Received' },
  { id: 'DOC-003', name: 'Certificate TK-2024-0087.pdf', category: 'certificate', size: '0.8 MB', date: '22 Mar 2024', participant: 'Hassan Mahmoud', type: 'pdf', status: 'Active' },
  { id: 'DOC-004', name: 'July 2026 Pool Statement.xlsx', category: 'financial', size: '0.3 MB', date: '1 Aug 2026', participant: 'System', type: 'xlsx', status: 'Final' },
  { id: 'DOC-005', name: 'Assessor Report CLM-0891.pdf', category: 'claim', size: '2.1 MB', date: '25 Jul 2026', participant: 'System', type: 'pdf', status: 'Awaiting' },
  { id: 'DOC-006', name: 'Property Photos CLM-0890.zip', category: 'claim', size: '8.2 MB', date: '17 Jul 2026', participant: 'Hassan Mahmoud', type: 'zip', status: 'Received' },
  { id: 'DOC-007', name: 'Certificate TK-2024-0112.pdf', category: 'certificate', size: '0.8 MB', date: '5 May 2024', participant: 'Aisha Okonkwo', type: 'pdf', status: 'Active' },
  { id: 'DOC-008', name: 'Contribution Schedule Q3 2026.xlsx', category: 'financial', size: '0.5 MB', date: '30 Jun 2026', participant: 'System', type: 'xlsx', status: 'Final' },
  { id: 'DOC-009', name: 'Welcome Letter Khalid Rahman.pdf', category: 'correspondence', size: '0.2 MB', date: '14 Dec 2023', participant: 'Khalid Rahman', type: 'pdf', status: 'Sent' },
  { id: 'DOC-010', name: 'Incident Report CLM-0889.pdf', category: 'claim', size: '1.2 MB', date: '15 Jul 2026', participant: 'Aisha Okonkwo', type: 'pdf', status: 'Received' },
];

const STATUS_CFG: Record<string, { bg: string; text: string }> = {
  Active:    { bg: 'bg-[#00c685]/10', text: 'text-[#00c685]' },
  Received:  { bg: 'bg-blue-500/10',  text: 'text-blue-500' },
  Awaiting:  { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  Final:     { bg: 'bg-purple-500/10',text: 'text-purple-500' },
  Sent:      { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40' },
};

export default function DocumentsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  const filtered = DOCUMENTS.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.participant.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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
  const ROW_HOVER = isLight ? 'hover:bg-black/[0.015]' : 'hover:bg-white/[0.025]';

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Document Centre</h1>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Manage all certificates, claim documents, and correspondence — Demo data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 shrink-0 transition-all" style={{ background: GREEN }}>
          <Upload size={14} /> Upload
        </button>
      </motion.div>

      {/* Storage bar */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl p-4 flex items-center gap-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <Folder size={20} className="text-[#00c685] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs mb-1.5">
            <span className={`font-medium ${TEXT_SUB}`}>Storage Used</span>
            <span className={`font-semibold ${TEXT_MAIN}`}>28.4 MB of 5 GB</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: '0.6%', background: GREEN }} />
          </div>
        </div>
        <span className={`text-xs shrink-0 ${TEXT_MUTED}`}>42 files</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Category sidebar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="rounded-2xl p-4 space-y-0.5 h-fit transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide px-2 pb-2 ${TEXT_MUTED}`}>Categories</p>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                activeCategory === cat.key ? 'bg-[#00c685]/15 text-[#00c685]' : `${TEXT_SUB} hover:bg-black/5 dark:hover:bg-white/5`
              }`}>
              {cat.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeCategory === cat.key ? 'bg-[#00c685]/20 text-[#00c685]' : `${BG_INPUT} ${TEXT_MUTED}`}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Document list */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="lg:col-span-3 rounded-2xl overflow-hidden transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div className="relative flex-1">
              <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-[#00c685]/40 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_MAIN}`} />
            </div>
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 ${BORDER_INPUT} ${TEXT_SUB}`}>
              <Download size={12} /> Export
            </button>
          </div>

          {/* File list */}
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <FileText size={32} className={TEXT_MUTED} />
                <p className={`text-sm ${TEXT_SUB}`}>No documents found</p>
              </div>
            ) : filtered.map((doc, i) => {
              const fileConfig = FILE_ICON[doc.type] || { icon: File, color: '#6b7280' };
              const FileIcon = fileConfig.icon === '#00c685' ? File : fileConfig.icon;
              const color = fileConfig.color;
              const statusStyle = STATUS_CFG[doc.status] ?? { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40' };
              return (
                <motion.div key={doc.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onMouseEnter={() => setHoveredDoc(doc.id)}
                  onMouseLeave={() => setHoveredDoc(null)}
                  className={`flex items-center gap-4 px-5 py-3.5 transition-colors group cursor-pointer ${ROW_HOVER}`}>
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                    <FileIcon size={15} style={{ color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${TEXT_MAIN}`}>{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{doc.size}</span>
                      <span className={TEXT_MUTED}>·</span>
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{doc.date}</span>
                      <span className={TEXT_MUTED}>·</span>
                      <span className={`text-[10px] ${TEXT_SUB}`}>{doc.participant}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    {doc.status}
                  </span>

                  {/* Actions */}
                  <div className={`flex items-center gap-1 transition-opacity ${hoveredDoc === doc.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button className={`p-1.5 rounded-lg transition-colors ${TEXT_MUTED} hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`}><Eye size={13} /></button>
                    <button className={`p-1.5 rounded-lg transition-colors ${TEXT_MUTED} hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`}><Download size={13} /></button>
                    <button className="p-1.5 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
