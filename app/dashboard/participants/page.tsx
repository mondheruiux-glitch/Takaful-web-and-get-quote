'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Filter, Download, ChevronRight, Plus,
  Mail, Phone, Shield, FileText, CreditCard,
  Building2, Home, Layers, MoreHorizontal, ShieldAlert,
} from 'lucide-react';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { PARTICIPANTS } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'bg-[#00c685]/10', text: 'text-[#00c685]',  dot: 'bg-[#00c685]' },
  Pending:   { bg: 'bg-blue-500/10',  text: 'text-blue-500',   dot: 'bg-blue-500' },
  Review:    { bg: 'bg-amber-500/10', text: 'text-amber-500',  dot: 'bg-amber-500' },
  Suspended: { bg: 'bg-red-500/10',   text: 'text-red-500',    dot: 'bg-red-500' },
};

const RISK_CFG: Record<string, string> = {
  Low: 'text-[#00c685]',
  Medium: 'text-amber-500',
  High: 'text-red-500',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CFG[status] ?? { bg: 'bg-black/5 dark:bg-white/5', text: 'text-black/40 dark:text-white/40', dot: 'bg-black/20 dark:bg-white/20' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <img
      src={getDicebearAvatar(name)}
      alt={name}
      className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-gray-100 shrink-0"
    />
  );
}


export default function ParticipantsPage() {
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  // Verify access permissions (Management and Handlers only)
  const hasAccess = role === 'management' || role === 'claim_handler';

  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const BORDER_INPUT = isLight ? 'border-black/[0.06]' : 'border-white/[0.05]';
  const ROW_HOVER = isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]';

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          You do not have administrative clearance to access the participant registry.
        </p>
        <Link href="/dashboard" className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: GREEN }}>
          Back to Overview
        </Link>
      </div>
    );
  }

  const filtered = PARTICIPANTS.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'All' || p.riskRating === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Participant Registry</h1>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Unified repository of all active Takaful members</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 shrink-0 transition-all active:scale-[0.98]" style={{ background: GREEN }}>
          <Plus size={14} /> Add Participant
        </button>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled', value: '1,284', color: GREEN },
          { label: 'Active', value: '1,218', color: '#3b82f6' },
          { label: 'Under Review', value: '24', color: '#f59e0b' },
          { label: 'High Risk Rating', value: '18', color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className="rounded-2xl p-4 transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: s.color }} />
            <p className={`font-bold text-xl ${TEXT_MAIN}`}>{s.value}</p>
            <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>

        {/* Filters */}
        <div className="flex flex-col md:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-black/35' : 'text-white/30'}`} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or ID..."
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/40 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_MAIN}`} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['All', 'Low', 'Medium', 'High'].map(risk => (
              <button
                key={risk}
                onClick={() => setRiskFilter(risk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  riskFilter === risk
                    ? 'bg-[#00c685]/15 border-[#00c685]/35 text-[#00c685]'
                    : isLight
                      ? 'border-black/[0.06] bg-black/[0.02] text-black/60 hover:text-black hover:border-black/20'
                      : 'border-white/[0.05] bg-white/[0.02] text-white/55 hover:text-white hover:border-white/15'
                }`}
              >
                {risk} Risk
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['Participant Name', 'Contact Details', 'Join Date', 'Risk Profile', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <Users size={32} className={TEXT_MUTED} />
                    <p className={`text-sm ${TEXT_SUB}`}>No matching participants found</p>
                  </div>
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className={`group transition-colors cursor-pointer ${ROW_HOVER}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.name} />
                      <div>
                        <p className={`font-semibold ${TEXT_MAIN}`}>{p.name}</p>
                        <p className={`text-[10px] font-mono ${TEXT_MUTED}`}>{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className={`flex items-center gap-1.5 ${TEXT_SUB}`}><Mail size={10} /><span>{p.email}</span></div>
                      <div className={`flex items-center gap-1.5 ${TEXT_MUTED}`}><Phone size={10} /><span>{p.phone}</span></div>
                    </div>
                  </td>
                  <td className={`px-5 py-4 whitespace-nowrap ${TEXT_SUB}`}>{p.memberSince}</td>
                  <td className={`px-5 py-4 font-semibold ${RISK_CFG[p.riskRating] ?? 'text-gray-400'}`}>{p.riskRating} Risk</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <ChevronRight size={14} className={`${TEXT_MUTED} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
