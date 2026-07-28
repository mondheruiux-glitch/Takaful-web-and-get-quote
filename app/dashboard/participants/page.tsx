'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Filter, Download, ChevronRight, Plus,
  Mail, Phone, Shield, FileText, CreditCard,
  Building2, Home, Layers, MoreHorizontal,
} from 'lucide-react';

const GREEN = '#00c685';
const SURFACE = '#0d2117';
const BORDER = 'rgba(255,255,255,0.07)';
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const PARTICIPANTS = [
  { id: 'P-0042', name: 'Fatima Al-Rashid', email: 'f.alrashid@email.com', phone: '+44 7700 123 456', certCount: 1, claimCount: 2, contribution: '£38.50/mo', since: 'Jan 2024', status: 'Active', risk: 'Low' },
  { id: 'P-0087', name: 'Hassan Mahmoud', email: 'h.mahmoud@email.com', phone: '+44 7700 234 567', certCount: 1, claimCount: 1, contribution: '£24.20/mo', since: 'Mar 2024', status: 'Active', risk: 'Low' },
  { id: 'P-0112', name: 'Aisha Okonkwo', email: 'a.okonkwo@email.com', phone: '+44 7700 345 678', certCount: 2, claimCount: 3, contribution: '£52.80/mo', since: 'May 2024', status: 'Active', risk: 'Medium' },
  { id: 'P-0031', name: 'Yusuf Ibrahim', email: 'y.ibrahim@email.com', phone: '+44 7700 456 789', certCount: 1, claimCount: 1, contribution: '£41.00/mo', since: 'Jan 2024', status: 'Active', risk: 'Low' },
  { id: 'P-0098', name: 'Maryam Patel', email: 'm.patel@email.com', phone: '+44 7700 567 890', certCount: 1, claimCount: 1, contribution: '£18.90/mo', since: 'Aug 2023', status: 'Review', risk: 'High' },
  { id: 'P-0055', name: 'Ibrahim Al-Sayed', email: 'i.alsayed@email.com', phone: '+44 7700 678 901', certCount: 2, claimCount: 4, contribution: '£61.20/mo', since: 'Feb 2024', status: 'Active', risk: 'High' },
  { id: 'P-0073', name: 'Zahra Hussein', email: 'z.hussein@email.com', phone: '+44 7700 789 012', certCount: 1, claimCount: 0, contribution: '£33.70/mo', since: 'Jun 2024', status: 'Pending', risk: 'Low' },
  { id: 'P-0019', name: 'Khalid Rahman', email: 'k.rahman@email.com', phone: '+44 7700 890 123', certCount: 1, claimCount: 2, contribution: '£22.50/mo', since: 'Dec 2023', status: 'Suspended', risk: 'Medium' },
];

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'bg-[#00c685]/10', text: 'text-[#00c685]',  dot: 'bg-[#00c685]' },
  Pending:   { bg: 'bg-blue-500/10',  text: 'text-blue-400',   dot: 'bg-blue-400' },
  Review:    { bg: 'bg-amber-500/10', text: 'text-amber-400',  dot: 'bg-amber-400' },
  Suspended: { bg: 'bg-red-500/10',   text: 'text-red-400',    dot: 'bg-red-400' },
};

const RISK_CFG: Record<string, string> = {
  Low: 'text-[#00c685]',
  Medium: 'text-amber-400',
  High: 'text-red-400',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CFG[status] ?? { bg: 'bg-white/5', text: 'text-white/40', dot: 'bg-white/20' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#00c685', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
      {initials}
    </div>
  );
}

export default function ParticipantsPage() {
  const [search, setSearch] = useState('');

  const filtered = PARTICIPANTS.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-lg font-bold">Participants</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage all registered Takaful participants — Demo data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#0a1a14] hover:opacity-90 shrink-0 transition-all" style={{ background: GREEN }}>
          <Plus size={14} /> Add Participant
        </button>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Participants', value: '1,284', color: GREEN },
          { label: 'Active', value: '1,218', color: '#3b82f6' },
          { label: 'Under Review', value: '24', color: '#f59e0b' },
          { label: 'High Risk', value: '18', color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className="rounded-2xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: s.color }} />
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-white/40 text-[10px] mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search participants…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-[#00c685]/40 transition-colors" />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors"><Filter size={12} /> Filter</button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors"><Download size={12} /> Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {['Participant', 'Contact', 'Certificates', 'Claims', 'Monthly', 'Member Since', 'Risk', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <Users size={32} className="text-white/15" />
                    <p className="text-white/40 text-sm">No participants found</p>
                  </div>
                </td></tr>
              ) : filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.name} />
                      <div>
                        <p className="text-white/85 font-semibold">{p.name}</p>
                        <p className="text-white/30 text-[10px] font-mono">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white/40"><Mail size={10} /><span>{p.email}</span></div>
                      <div className="flex items-center gap-1.5 text-white/30"><Phone size={10} /><span>{p.phone}</span></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-white/60"><Shield size={11} />{p.certCount}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-white/60"><FileText size={11} />{p.claimCount}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white font-semibold whitespace-nowrap">{p.contribution}</td>
                  <td className="px-5 py-3.5 text-white/40 whitespace-nowrap">{p.since}</td>
                  <td className={`px-5 py-3.5 font-semibold ${RISK_CFG[p.risk]}`}>{p.risk}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5">
                    <ChevronRight size={14} className="text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-white/30 text-xs">Showing {filtered.length} of {PARTICIPANTS.length} shown — 1,284 total</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === 1 ? 'bg-[#00c685]/15 text-[#00c685]' : 'text-white/30 hover:bg-white/5'}`}>{n}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
