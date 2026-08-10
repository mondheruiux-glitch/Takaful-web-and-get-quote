'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Search, Download, CheckCircle2, ShieldAlert, Check } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { TRANSACTIONS } from '@/lib/dashboard/mock-data';
import { Transaction } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

export default function TransactionsPage() {
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';
  const [search, setSearch] = useState('');

  // Local state for reconciliation
  const [list, setList] = useState<Transaction[]>(() => TRANSACTIONS);
  const [toast, setToast] = useState<string | null>(null);

  // Check access authorization
  const hasAccess = role === 'finance' || role === 'management';

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Ledger transaction assets are limited to Treasury administration accounts.
        </p>
        <Link href="/dashboard" className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: GREEN }}>
          Back to Overview
        </Link>
      </div>
    );
  }

  const handleReconcileSingle = (id: string) => {
    setList(prev => prev.map(t => t.id === id ? { ...t, status: 'Reconciled', reconciled: true } : t));
    setToast(`Transaction ${id} verified and reconciled.`);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = list.filter(t =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    (t.participantName && t.participantName.toLowerCase().includes(search.toLowerCase())) ||
    t.reference.toLowerCase().includes(search.toLowerCase())
  );

  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
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
          <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>Treasury Cash Book</h1>
          <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Complete ledger accounts of all mutual pool movements</p>
        </div>
      </motion.div>

      {/* Toolbar filters */}
      <div className="flex items-center justify-between gap-3">
        <div className={`relative flex-1 max-w-xs`}>
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-[#00c685]/40 bg-black/[0.01] dark:bg-white/[0.01] ${isLight ? 'border-black/[0.06] text-black' : 'border-white/[0.05] text-white'}`}
          />
        </div>
        <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isLight ? 'border-black/[0.06] text-black/60' : 'border-white/[0.05] text-white/60'}`}>
          <Download size={13} /> Export Ledger CSV
        </button>
      </div>

      {/* Ledger list */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className={`rounded-2xl overflow-hidden ${isLight ? 'bg-white border border-black/[0.04]' : 'bg-[#0d2117] border border-white/[0.04]'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/30 border-b border-white/[0.04]'}>
                {['ID', 'Date', 'Transaction Type', 'Participant', 'Reference', 'Amount', 'Flow', 'Audit Status', 'Verify'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
              {filtered.map(t => (
                <tr key={t.id} className={isLight ? 'hover:bg-black/[0.01]' : 'hover:bg-white/[0.015]'}>
                  <td className="px-5 py-3.5 font-mono font-bold" style={{ color: GREEN }}>{t.id}</td>
                  <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{t.date}</td>
                  <td className={`px-5 py-3.5 font-semibold ${TEXT_MAIN}`}>{t.type}</td>
                  <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{t.participantName ?? 'System Fund'}</td>
                  <td className={`px-5 py-3.5 font-mono ${TEXT_MUTED}`}>{t.reference}</td>
                  <td className={`px-5 py-3.5 font-bold ${t.direction === 'Outflow' ? 'text-red-400' : 'text-[#00c685]'}`}>
                    £{t.amount.toFixed(2)}
                  </td>
                  <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{t.direction}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.reconciled || t.status === 'Reconciled' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {!t.reconciled && t.status !== 'Reconciled' ? (
                      <button
                        onClick={() => handleReconcileSingle(t.id)}
                        className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold transition-opacity hover:opacity-80"
                      >
                        Match Ledger
                      </button>
                    ) : (
                      <span className={`text-[10px] ${TEXT_MUTED}`}>Match Verified</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-5 py-8 text-center text-sm ${TEXT_MUTED}`}>
                    No ledger transactions match search filters.
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
