'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, Search, AlertCircle, ChevronRight, CheckCircle2, ShieldAlert, Sparkles, Check, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS, CERTIFICATES } from '@/lib/dashboard/mock-data';
import { Claim } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

/** Returns the net BACS amount for a claim — always gross − compulsory excess */
function getNetSettlement(c: Claim): number {
  // If the handler explicitly recorded netSettlementAmount, use it
  if (c.netSettlementAmount !== undefined) return c.netSettlementAmount;
  // Otherwise fallback: amountApproved (which should already be net)
  if (c.amountApproved !== undefined) return c.amountApproved;
  // Last resort: gross claimed
  return c.amountClaimed;
}

/** Returns the gross assessed amount for a claim */
function getGrossAssessed(c: Claim): number {
  return c.grossAssessedAmount ?? c.amountClaimed;
}

/** Returns the excess deducted for a claim */
function getExcessDeducted(c: Claim): number {
  return c.excessDeducted ?? 300;
}

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

  const handleReleasePayment = (id: string, net: number) => {
    const bacsRef = `BACS-TK-2026-${id.split('-').pop()}`;
    setClaimsList(prev => prev.filter(c => c.id !== id));
    setToast(`Payment of £${net.toLocaleString()} authorized. BACS Ref: ${bacsRef}`);
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = claimsList.filter(c =>
    !search ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_ALT   = isLight ? '#f4f6f5' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';

  // Summary totals
  const totalGross = filtered.reduce((s, c) => s + getGrossAssessed(c), 0);
  const totalExcess = filtered.reduce((s, c) => s + getExcessDeducted(c), 0);
  const totalNet = filtered.reduce((s, c) => s + getNetSettlement(c), 0);

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
            className="fixed top-5 right-5 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs max-w-sm"
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

      {/* Formula explanation banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: BG_ALT, border: `1px solid ${BORDER}` }}
      >
        <Info size={14} className="text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className={`text-xs font-semibold ${TEXT_MAIN}`}>How the BACS Amount is Calculated</p>
          <p className={`text-[11px] mt-0.5 ${TEXT_SUB}`}>
            Net BACS Disbursement = Gross Assessed Loss − Certificate Policy Excess (Clause 4.2 — £300 standard)
          </p>
          <div className={`flex items-center gap-2 mt-2 text-[11px] font-mono ${TEXT_SUB}`}>
            <span className={`px-2 py-0.5 rounded ${isLight ? 'bg-white border border-black/10' : 'bg-white/5 border border-white/10'} ${TEXT_MAIN}`}>Gross Loss</span>
            <span className="text-red-400">−</span>
            <span className={`px-2 py-0.5 rounded ${isLight ? 'bg-white border border-black/10' : 'bg-white/5 border border-white/10'} ${TEXT_MAIN}`}>£300 Excess</span>
            <span className={TEXT_MUTED}>=</span>
            <span className="px-2 py-0.5 rounded font-bold text-emerald-400" style={{ background: 'rgba(0,198,133,0.1)', border: '1px solid rgba(0,198,133,0.2)' }}>BACS Amount</span>
          </div>
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
        {filtered.length > 0 && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            {filtered.length} awaiting release
          </span>
        )}
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
                {['Claim ID', 'Participant', 'Type', 'Gross Assessed', 'Excess (Clause 4.2)', 'BACS Amount', 'Age Waiting', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#E4E7EC]' : 'divide-white/[0.04]'}`}>
              {filtered.map(c => {
                const gross = getGrossAssessed(c);
                const excess = getExcessDeducted(c);
                const net = getNetSettlement(c);
                return (
                  <tr key={c.id} className={isLight ? 'hover:bg-black/[0.01]' : 'hover:bg-white/[0.015]'}>
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono font-bold text-[11px]" style={{ color: GREEN }}>{c.id}</span>
                        {c.certificateId && (
                          <p className={`text-[10px] mt-0.5 ${TEXT_MUTED}`}>{c.certificateId}</p>
                        )}
                      </div>
                    </td>
                    <td className={`px-5 py-4 font-medium ${TEXT_MAIN}`}>{c.participantName}</td>
                    <td className={`px-5 py-4 ${TEXT_SUB}`}>{c.type}</td>
                    {/* Gross Assessed */}
                    <td className={`px-5 py-4 font-semibold ${TEXT_MAIN}`}>
                      £{gross.toLocaleString()}
                    </td>
                    {/* Excess */}
                    <td className="px-5 py-4 font-semibold text-red-500">
                      −£{excess.toLocaleString()}
                    </td>
                    {/* Net BACS Amount */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-emerald-400">£{net.toLocaleString()}</span>
                    </td>
                    {/* Age waiting */}
                    <td className="px-5 py-4 font-bold text-amber-500">{c.daysOpen} days</td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleReleasePayment(c.id, net)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold transition-opacity hover:opacity-85 whitespace-nowrap"
                        style={{ background: GREEN }}
                      >
                        <Banknote size={11} /> Release £{net.toLocaleString()}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-5 py-8 text-center text-sm ${TEXT_MUTED}`}>
                    No approved claims are currently awaiting treasury payment release.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Summary totals footer */}
            {filtered.length > 0 && (
              <tfoot>
                <tr className={`font-bold text-xs ${isLight ? 'border-t border-[#E4E7EC] bg-[#f4f6f5]' : 'border-t border-white/[0.04] bg-[#112218]'}`}>
                  <td className={`px-5 py-3 ${TEXT_MUTED}`} colSpan={3}>Queue Total ({filtered.length} claims)</td>
                  <td className={`px-5 py-3 ${TEXT_MAIN}`}>£{totalGross.toLocaleString()}</td>
                  <td className="px-5 py-3 text-red-500">−£{totalExcess.toLocaleString()}</td>
                  <td className="px-5 py-3 text-emerald-400">£{totalNet.toLocaleString()}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </motion.div>
    </div>
  );
}
