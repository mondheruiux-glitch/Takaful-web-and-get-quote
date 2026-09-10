'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, Search, AlertCircle, ChevronRight, CheckCircle2, ShieldAlert, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS } from '@/lib/dashboard/mock-data';
import { Claim } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

export default function ClaimsPaymentsPage() {
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';
  const [search, setSearch] = useState('');
  
  // Local state for interactive payments
  const [claimsList, setClaimsList] = useState<Claim[]>(() =>
    CLAIMS.filter(c => c.status === 'Approved')
  );
  
  const [toast, setToast] = useState<string | null>(null);

  // Check access authorization
  const hasAccess = role === 'finance' || role === 'management';

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Treasury payout systems are restricted to Finance and operations management.
        </p>
        <Link href="/dashboard" className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: GREEN }}>
          Back to Overview
        </Link>
      </div>
    );
  }

  const handleReleasePayment = (id: string, amount: number) => {
    setClaimsList(prev => prev.filter(c => c.id !== id));
    setToast(`Payment of £${amount.toLocaleString()} successfully authorized and queued for BACS transfer.`);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = claimsList.filter(c =>
    !search ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';

  return (
    <div className="p-4 sm:p-6 space-y-6 transition-colors duration-200">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs"
            style={{ background: GREEN }}
          >
            <Check size={14} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>Claims Awaiting Payment</h1>
          <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Release settled claims payouts from participant reserves</p>
        </div>
      </motion.div>

      {/* Search toolbar */}
      <div className="flex items-center gap-3">
        <div className={`relative flex-1 max-w-xs`}>
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search approved claims..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-[#00c685]/40 bg-black/[0.01] dark:bg-white/[0.01] ${isLight ? 'border-black/[0.06] text-black' : 'border-white/[0.05] text-white'}`}
          />
        </div>
      </div>

      {/* Payout queue list */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className={`rounded-2xl overflow-hidden shadow-sm ${isLight ? 'bg-white border border-[#E4E7EC]' : 'bg-[#0d2117] border border-white/[0.04]'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-[#E4E7EC]' : 'text-white/30 border-b border-white/[0.04]'}>
                {['Claim ID', 'Participant Name', 'Claim Type', 'Approved Value', 'Age Waiting', 'Reconciliation', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#E4E7EC]' : 'divide-white/04'}`}>
              {filtered.map(c => (
                <tr key={c.id} className={isLight ? 'hover:bg-black/[0.01]' : 'hover:bg-white/[0.015]'}>
                  <td className="px-5 py-3.5 font-mono font-bold" style={{ color: GREEN }}>{c.id}</td>
                  <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{c.participantName}</td>
                  <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{c.type}</td>
                  <td className={`px-5 py-3.5 font-bold ${TEXT_MAIN}`}>£{(c.amountApproved || c.amountClaimed).toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-bold text-amber-500">{c.daysOpen} days</td>
                  <td className={`px-5 py-3.5 ${TEXT_SUB}`}>Pending release</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleReleasePayment(c.id, c.amountApproved || c.amountClaimed)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00c685] text-white font-semibold transition-opacity hover:opacity-85"
                    >
                      <Banknote size={11} /> Release Payment
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-5 py-8 text-center text-sm ${TEXT_MUTED}`}>
                    No approved claims are currently awaiting treasury payment release.
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
