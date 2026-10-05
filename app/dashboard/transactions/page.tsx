'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Search, Download, ShieldAlert, Check, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { TRANSACTIONS } from '@/lib/dashboard/mock-data';
import { Transaction } from '@/lib/dashboard/types';
import { ActionButton } from '@/components/ui/ds/ActionButton';
import { StatusBadge, VerifiedBadge } from '@/components/ui/ds/StatusBadge';
import { ParticipantChip } from '@/components/ui/ParticipantChip';
import { TransactionDetailDrawer } from '@/components/ui/TransactionDetailDrawer';

import {
  getStoredReconciledTxIds,
  reconcileTransaction,
  reconcileBatchTransactions,
  resetAllReconciliations,
  SYNC_EVENT_NAME,
} from '@/lib/dashboard/reconciliation-sync';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

export default function TransactionsPage() {
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';
  const [search, setSearch] = useState('');

  // Persisted reconciled IDs
  const [reconciledIds, setReconciledIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Selected transaction for drawer inspection
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Check access authorization: Finance, Management, and Super Admin
  const hasAccess = role === 'finance' || role === 'management' || role === 'super_admin';

  // Hydrate from localStorage on mount and listen for real-time synchronization
  useEffect(() => {
    const sync = () => {
      setReconciledIds(getStoredReconciledTxIds());
    };
    sync();
    window.addEventListener(SYNC_EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Ledger transaction assets are limited to Treasury, Management, and Super Admin accounts.
        </p>
        <Link href="/dashboard" className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: GREEN }}>
          Back to Overview
        </Link>
      </div>
    );
  }

  // Merge base transactions with reconciled IDs
  const list: Transaction[] = TRANSACTIONS.map(t => {
    if (reconciledIds.includes(t.id)) {
      return { ...t, status: 'Reconciled', reconciled: true };
    }
    return t;
  });

  const handleReconcileSingle = (id: string) => {
    const { matchingContrib, updatedTxIds } = reconcileTransaction(id);
    setReconciledIds(updatedTxIds);
    // Also update selected transaction if open
    setSelectedTransaction(prev => (prev && prev.id === id ? { ...prev, status: 'Reconciled', reconciled: true } : prev));
    if (matchingContrib) {
      setToast(`Transaction ${id} verified & reconciled. ${matchingContrib.participantName}'s contribution (${matchingContrib.id}) status automatically updated to Collected.`);
    } else {
      setToast(`Transaction ${id} verified and reconciled in treasury.`);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleReconcileAllPending = () => {
    const allPendingIds = filtered.filter(t => !t.reconciled).map(t => t.id);
    if (allPendingIds.length === 0) return;
    const updated = reconcileBatchTransactions(allPendingIds);
    setReconciledIds(updated);
    setToast(`Batch reconciled ${allPendingIds.length} transactions. Related contributions automatically updated to Collected.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleResetReconciled = () => {
    resetAllReconciliations();
    setReconciledIds([]);
    setSelectedTransaction(prev => (prev ? { ...prev, status: 'Failed', reconciled: false } : null));
    setToast('Reconciliation ledger reset to initial state. Contributions reverted to defaults.');
    setTimeout(() => setToast(null), 3000);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Participant', 'Reference', 'Amount (£)', 'Flow Direction', 'Status'];
    const rows = filtered.map(t => [
      t.id,
      t.date,
      `"${t.type}"`,
      `"${t.participantName || '—'}"`,
      `"${t.reference}"`,
      t.amount,
      t.direction === 'Inflow' ? 'Inflow (+)' : 'Outflow (-)',
      t.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `takaful-treasury-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = list.filter(t =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    (t.participantName && t.participantName.toLowerCase().includes(search.toLowerCase())) ||
    t.reference.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = filtered.filter(t => !t.reconciled && t.status !== 'Completed').length;

  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';

  return (
    <div className="p-4 sm:p-6 space-y-6 transition-colors duration-200">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className="fixed top-5 right-5 z-[700] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs max-w-sm"
            style={{ background: GREEN }}
          >
            <Check size={14} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>Treasury Cash Book</h1>
          <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Complete ledger accounts of all mutual pool movements & audit verification</p>
        </div>
        <div className="flex items-center gap-2">
          {reconciledIds.length > 0 && (
            <button
              onClick={handleResetReconciled}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                isLight ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-xs' : 'border-white/10 text-white/50 hover:bg-white/5'
              }`}
            >
              Reset Reconciled ({reconciledIds.length})
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isLight ? 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 shadow-xs' : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
            }`}
          >
            <Download size={13} /> Export Ledger CSV
          </button>
        </div>
      </motion.div>

      {/* Toolbar filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions, participants, refs..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#00c685] transition-all ${
              isLight ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 shadow-xs' : 'border-white/10 bg-white/5 text-white placeholder:text-white/35'
            }`}
          />
        </div>

        {pendingCount > 0 && (
          <ActionButton
            variant="primary"
            size="md"
            icon={CheckCheck}
            onClick={handleReconcileAllPending}
          >
            Reconcile All Filtered ({pendingCount})
          </ActionButton>
        )}
      </div>

      {/* Ledger list */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className={`rounded-2xl overflow-hidden shadow-sm ${isLight ? 'bg-white border border-[#E4E7EC]' : 'bg-[#0d2117] border border-white/[0.04]'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-[#E4E7EC]' : 'text-white/30 border-b border-white/[0.04]'}>
                {['ID', 'Date', 'Transaction Type', 'Participant', 'Reference', 'Amount', 'Flow', 'Audit Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#E4E7EC]' : 'divide-white/[0.04]'}`}>
              {filtered.map(t => {
                const isInflow = t.direction === 'Inflow';
                const isReconciled = t.reconciled || t.status === 'Reconciled' || t.status === 'Completed';

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTransaction(t)}
                    className={`transition-colors cursor-pointer group ${
                      isLight ? 'hover:bg-emerald-50/40' : 'hover:bg-white/[0.025]'
                    }`}
                    title="Click to view transaction details and audit log"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-[11px] group-hover:underline" style={{ color: GREEN }}>
                      {t.id}
                    </td>
                    <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{t.date}</td>
                    <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{t.type}</td>
                    <td className="px-5 py-3.5">
                      {t.participantName ? (
                        <ParticipantChip
                          name={t.participantName}
                          participantId={t.participantId}
                          certificateId={t.certificateId}
                          status={t.status}
                          size="sm"
                          theme={theme}
                        />
                      ) : (
                        <span className={TEXT_MUTED}>—</span>
                      )}
                    </td>
                    <td className={`px-5 py-3.5 font-mono text-[11px] ${TEXT_MUTED}`}>{t.reference}</td>
                    <td className={`px-5 py-3.5 font-bold ${isInflow ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isInflow ? '+' : '−'}£{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isInflow ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {isInflow ? 'Inflow' : 'Outflow'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={t.status} theme={theme} />
                    </td>
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      {isReconciled ? (
                        <VerifiedBadge isLight={isLight} />
                      ) : (
                        <ActionButton
                          variant="amber"
                          size="sm"
                          icon={ArrowLeftRight}
                          onClick={() => handleReconcileSingle(t.id)}
                          title="Reconcile transaction and automatically update related contribution to Collected"
                        >
                          Reconcile
                        </ActionButton>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-5 py-8 text-center text-sm ${TEXT_MUTED}`}>
                    No transactions match your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Slide-over Transaction Detail Drawer */}
      <AnimatePresence>
        {selectedTransaction && (
          <TransactionDetailDrawer
            key={selectedTransaction.id}
            transaction={selectedTransaction}
            isLight={isLight}
            onClose={() => setSelectedTransaction(null)}
            onReconcile={handleReconcileSingle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
