'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search, AlertCircle, Clock, ChevronRight, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

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

export default function QueuePage() {
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';
  const [search, setSearch] = useState('');

  // Check access authorization
  const hasAccess = role === 'claim_handler' || role === 'management';

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Only assigned claim handlers and management executives can access processing queues.
        </p>
        <Link href="/dashboard" className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: GREEN }}>
          Back to Overview
        </Link>
      </div>
    );
  }

  // Filter claims assigned specifically to Handler Omar Hassan (U-HAND-001) that are not completed (Paid/Rejected)
  const myQueue = CLAIMS
    .filter(c => c.assignedHandlerId === 'U-HAND-001' && !['Paid', 'Rejected'].includes(c.status))
    .filter(c => !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.participantName.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()));

  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';

  return (
    <div className="p-4 sm:p-6 space-y-6 transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3">
        <Link href="/dashboard" className={`p-2.5 rounded-xl transition-all ${isLight ? 'text-black/40 hover:text-black hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>My Claims Queue</h1>
          <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Claims assigned to you requiring active assessment or decisioning</p>
        </div>
      </motion.div>

      {/* Toolbar filter */}
      <div className="flex items-center gap-3">
        <div className={`relative flex-1 max-w-xs`}>
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search my queue..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-[#00c685]/40 bg-black/[0.01] dark:bg-white/[0.01] ${isLight ? 'border-black/[0.06] text-black' : 'border-white/[0.05] text-white'}`}
          />
        </div>
      </div>

      {/* Queue list */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className={`rounded-2xl overflow-hidden shadow-sm ${isLight ? 'bg-white border border-[#E4E7EC]' : 'bg-[#0d2117] border border-white/[0.04]'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-[#E4E7EC]' : 'text-white/30 border-b border-white/[0.04]'}>
                {['Claim ID', 'Participant', 'Type', 'Cover Type', 'Days Open', 'Priority', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#E4E7EC]' : 'divide-white/04'}`}>
              {myQueue.map(c => (
                <tr key={c.id} className={isLight ? 'hover:bg-black/[0.01]' : 'hover:bg-white/[0.015]'}>
                  <td className="px-5 py-3.5 font-mono font-bold" style={{ color: GREEN }}>{c.id}</td>
                  <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{c.participantName}</td>
                  <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{c.type}</td>
                  <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{c.coverType}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-bold ${c.daysOpen > 10 ? 'text-red-400' : c.daysOpen > 5 ? 'text-amber-400' : TEXT_SUB}`}>{c.daysOpen}d</span>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.priority} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/claims/${c.id}`} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#00c685] text-white font-semibold transition-opacity hover:opacity-85">
                      Review <ChevronRight size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
              {myQueue.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-5 py-8 text-center text-sm ${TEXT_MUTED}`}>
                    Your queue is clear. No active claims are pending your review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
