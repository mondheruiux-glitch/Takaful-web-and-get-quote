'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Folder, Search, Filter, Download, Upload, FileText,
  Shield, CreditCard, ImageIcon, File, ChevronDown,
  Eye, Trash2, CheckCircle2, ArrowDownToLine
} from 'lucide-react';
import { useTheme, useRole } from '../ThemeRoleContext';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.05 } }),
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
  xlsx: { icon: File, color: '#00c685' },
  doc:  { icon: File, color: '#6366f1' },
};

const DOCUMENTS = [
  { id: 'DOC-001', name: 'Certificate of Cover TK-2024-0042.pdf', category: 'certificate', size: '0.8 MB', date: '15 Jan 2024', participant: 'Fatima Al-Rashid', type: 'pdf', status: 'Active' },
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

/* ─── Participant Documents View (Editorial) ─────────────────────────────── */
function ParticipantDocumentsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)';
  const BG_SURFACE = isLight ? '#ffffff' : 'rgba(255,255,255,0.025)';
  const TEXT_MAIN = isLight ? '#111827' : '#ffffff';
  const TEXT_SUB = isLight ? '#4b5563' : 'rgba(255,255,255,0.6)';
  const TEXT_MUTED = isLight ? '#9ca3af' : 'rgba(255,255,255,0.35)';

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const myDocs = DOCUMENTS.filter(d => d.participant === 'Fatima Al-Rashid' || d.participant === 'System');

  const filtered = myDocs.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'certificate', label: 'Certificates' },
    { key: 'claim', label: 'Claim Records' },
    { key: 'financial', label: 'Statements' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">
      
      {/* ── 1. Editorial Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${
          isLight ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white/[0.04] border-white/[0.08] text-white/70'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          Policy Vault
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]" style={{ color: TEXT_MAIN }}>
              My Documents
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: TEXT_SUB }}>
              Official schedule, certificate of cover, contribution statements, and claims evidence.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto ${
              isLight ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
            }`}
          >
            <Download size={15} />
            Download All (ZIP)
          </button>
        </div>
      </motion.div>

      {/* ── 2. Filters & Search ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#00c685]/15 text-[#00c685]'
                  : isLight
                    ? 'text-gray-500 hover:text-gray-900'
                    : 'text-white/40 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-white/30'}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…"
            className={`w-full pl-9 pr-3 py-2 rounded-full border text-xs focus:outline-none transition-colors ${
              isLight
                ? 'border-black/[0.08] bg-white text-black placeholder:text-black/30'
                : 'border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25'
            }`}
          />
        </div>
      </motion.div>

      {/* ── 3. Document Cards ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-3">
        {filtered.length === 0 ? (
          <div className={`rounded-3xl p-14 text-center border ${isLight ? 'bg-gray-50 border-black/[0.05]' : 'bg-white/[0.02] border-white/[0.05]'}`}>
            <FileText size={36} className={`mx-auto mb-4 ${isLight ? 'text-gray-300' : 'text-white/20'}`} />
            <p className={`text-sm font-medium ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
              No documents found matching your filter.
            </p>
          </div>
        ) : (
          filtered.map(doc => {
            const fileCfg = FILE_ICON[doc.type] || { icon: File, color: '#6b7280' };
            const FileIcon = fileCfg.icon;
            const statusStyle = STATUS_CFG[doc.status] ?? { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40' };

            return (
              <div
                key={doc.id}
                className={`flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-white border-black/[0.06] hover:border-black/[0.12]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${fileCfg.color}15` }}
                  >
                    <FileIcon size={18} style={{ color: fileCfg.color }} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: TEXT_MAIN }}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs flex-wrap" style={{ color: TEXT_MUTED }}>
                      <span>{doc.size}</span>
                      <span>·</span>
                      <span>{doc.date}</span>
                      <span>·</span>
                      <span className="capitalize">{doc.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => window.print()}
                    className={`p-2 rounded-xl border transition-all ${
                      isLight
                        ? 'border-gray-200 hover:border-gray-400 text-gray-700 bg-white hover:bg-gray-50'
                        : 'border-white/10 hover:border-white/20 text-white/80 bg-white/[0.04] hover:bg-white/[0.08]'
                    }`}
                    title="Download File"
                  >
                    <ArrowDownToLine size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </motion.div>

    </div>
  );
}

/* ─── Admin Documents View (Document Centre) ─────────────────────────────── */
function AdminDocumentsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  const filtered = DOCUMENTS.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.participant.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#1e2433';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const ROW_HOVER = isLight ? 'hover:bg-gray-50/60' : 'hover:bg-white/[0.04]';

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-lg sm:text-xl font-bold ${TEXT_MAIN}`}>
            Document Centre
          </h1>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
            Manage all certificates, claim documents, and correspondence — Demo data
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 shrink-0 transition-all active:scale-[0.98]" style={{ background: GREEN }}>
          <Upload size={14} /> Upload Document
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl p-4 flex items-center gap-5 transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white'}`}>
          <Folder size={18} />
        </div>
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
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="rounded-2xl p-4 space-y-1 h-fit transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[10px] font-bold uppercase tracking-wide px-2 pb-2 ${TEXT_MUTED}`}>Categories</p>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border ${
                activeCategory === cat.key
                  ? 'bg-[#00c685]/15 border-[#00c685]/35 text-[#00c685]'
                  : isLight
                    ? 'border-transparent text-black/60 hover:bg-black/[0.04] hover:text-black'
                    : 'border-transparent text-white/55 hover:bg-white/[0.04] hover:text-white'
              }`}>
              {cat.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeCategory === cat.key ? 'bg-[#00c685]/20 text-[#00c685]' : `${BG_INPUT} ${TEXT_MUTED}`}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="lg:col-span-3 rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl border flex-1 transition-colors ${isLight ? 'bg-black/[0.03] border-[#E4E7EC] text-black' : 'bg-white/[0.04] border-white/[0.05] text-white'}`}>
              <Search size={13} className={`${TEXT_MUTED}`} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
                className={`flex-1 bg-transparent text-sm outline-none placeholder:text-xs placeholder:font-medium ${TEXT_MAIN}`} />
            </div>
            <button className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all shrink-0 ${isLight ? 'border-[#E4E7EC] text-black/70 hover:bg-black/[0.04]' : 'border-white/[0.05] text-white/70 hover:bg-white/[0.04]'}`}>
              <Download size={12} /> Export
            </button>
          </div>

          <div className="divide-y" style={{ borderColor: BORDER }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <FileText size={32} className={TEXT_MUTED} />
                <p className={`text-sm ${TEXT_SUB}`}>No documents found</p>
              </div>
            ) : filtered.map((doc, i) => {
              const fileConfig = FILE_ICON[doc.type] || { icon: File, color: '#6b7280' };
              const FileIcon = fileConfig.icon;
              const color = fileConfig.color;
              const statusStyle = STATUS_CFG[doc.status] ?? { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40' };
              return (
                <motion.div key={doc.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onMouseEnter={() => setHoveredDoc(doc.id)}
                  onMouseLeave={() => setHoveredDoc(null)}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors group cursor-pointer ${ROW_HOVER}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                    <FileIcon size={15} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${TEXT_MAIN}`}>{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{doc.size}</span>
                      <span className={TEXT_MUTED}>·</span>
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{doc.date}</span>
                      <span className={TEXT_MUTED}>·</span>
                      <span className={`text-[10px] ${TEXT_SUB}`}>{doc.participant}</span>
                    </div>
                  </div>
                  <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    {doc.status}
                  </span>
                  <div className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredDoc === doc.id ? 'opacity-100' : 'opacity-0'}`}>
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

export default function DocumentsPage() {
  const { theme } = useTheme();
  const { role } = useRole();
  const isParticipant = role === 'participant';

  return isParticipant ? (
    <ParticipantDocumentsView theme={theme} />
  ) : (
    <AdminDocumentsView theme={theme} />
  );
}
