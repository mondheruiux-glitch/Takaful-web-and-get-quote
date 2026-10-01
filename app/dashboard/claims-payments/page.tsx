'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote,
  Search,
  ShieldAlert,
  Check,
  Info,
  Download,
  AlertTriangle,
  Lock,
  X,
  FileCheck2,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS } from '@/lib/dashboard/mock-data';
import { Claim } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';
const LOCAL_STORAGE_KEY = 'takaful_released_claim_ids';

/** Returns the net BACS amount for a claim — always gross − compulsory excess */
function getNetSettlement(c: Claim): number {
  if (c.netSettlementAmount !== undefined) return c.netSettlementAmount;
  if (c.amountApproved !== undefined) return c.amountApproved;
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

  // Persisted released claim IDs
  const [releasedIds, setReleasedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modal state for dual-signoff on claims > £10,000
  const [pendingDualClaim, setPendingDualClaim] = useState<{ claim: Claim; net: number } | null>(null);
  const [dualAuthorizer, setDualAuthorizer] = useState<'ahmed' | 'zayd'>('ahmed');
  const [dualPin, setDualPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  // Hydrate released claims from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setReleasedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read released claims from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Filter approved claims excluding those released
  const claimsList = CLAIMS.filter(
    c => c.status === 'Approved' && !releasedIds.includes(c.id)
  );

  // Check access authorization: Finance, Management, and Super Admin
  const hasAccess = role === 'finance' || role === 'management' || role === 'super_admin';

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Treasury payout systems are restricted to Finance, Management, and Super Admin accounts.
        </p>
        <Link
          href="/dashboard"
          className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white"
          style={{ background: GREEN }}
        >
          Back to Overview
        </Link>
      </div>
    );
  }

  const persistRelease = (id: string) => {
    const updated = [...releasedIds, id];
    setReleasedIds(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist released claim to localStorage', e);
    }
  };

  const executeRelease = (id: string, net: number, isDual = false) => {
    const bacsRef = isDual
      ? `BACS-TK-2026-DUAL-${id.split('-').pop()}`
      : `BACS-TK-2026-${id.split('-').pop()}`;
    persistRelease(id);
    setToast(
      isDual
        ? `Dual-Authorized: £${net.toLocaleString()} released. Ref: ${bacsRef}`
        : `Payment of £${net.toLocaleString()} authorized. BACS Ref: ${bacsRef}`
    );
    setTimeout(() => setToast(null), 4500);
  };

  const handleReleaseClick = (c: Claim, net: number) => {
    // Shariah & Regulatory Governance Threshold: > £10,000 requires Dual-Signoff
    if (net > 10000) {
      setPendingDualClaim({ claim: c, net });
      setDualPin('');
      setPinError(false);
    } else {
      executeRelease(c.id, net, false);
    }
  };

  const handleConfirmDualSignoff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingDualClaim) return;
    if (dualPin.length < 4) {
      setPinError(true);
      return;
    }
    executeRelease(pendingDualClaim.claim.id, pendingDualClaim.net, true);
    setPendingDualClaim(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Claim ID', 'Certificate ID', 'Participant', 'Peril Type', 'Gross Assessed (£)', 'Excess Deducted (£)', 'Net BACS (£)', 'Days Waiting'];
    const rows = filtered.map(c => [
      c.id,
      c.certificateId || '—',
      `"${c.participantName}"`,
      `"${c.type}"`,
      getGrossAssessed(c),
      getExcessDeducted(c),
      getNetSettlement(c),
      c.daysOpen,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `takaful-payouts-queue-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = claimsList.filter(c =>
    !search ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_ALT = isLight ? '#f4f6f5' : '#112218';
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
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>Claims Awaiting Payment</h1>
          <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Release settled claims payouts from participant reserves</p>
        </div>
        <div className="flex items-center gap-2">
          {releasedIds.length > 0 && (
            <button
              onClick={() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setReleasedIds([]);
                setToast('Queue reset to initial demo state');
                setTimeout(() => setToast(null), 3000);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                isLight ? 'border-gray-200 text-gray-500 hover:bg-gray-100' : 'border-white/10 text-white/50 hover:bg-white/5'
              }`}
            >
              Reset Queue ({releasedIds.length} released)
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              isLight ? 'border-black/[0.06] text-black/70' : 'border-white/[0.06] text-white/70'
            }`}
          >
            <Download size={13} /> Export Payouts CSV
          </button>
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
            Net BACS Disbursement = Gross Assessed Loss − Certificate Policy Excess (Clause 4.2 — £300 standard). Payouts &gt;£10,000 enforce dual-signoff governance.
          </p>
          <div className={`flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono ${TEXT_SUB}`}>
            <span className={`px-2 py-0.5 rounded ${isLight ? 'bg-white border border-black/10' : 'bg-white/5 border border-white/10'} ${TEXT_MAIN}`}>Gross Loss</span>
            <span className="text-red-400">−</span>
            <span className={`px-2 py-0.5 rounded ${isLight ? 'bg-white border border-black/10' : 'bg-white/5 border border-white/10'} ${TEXT_MAIN}`}>Excess Deducted</span>
            <span className={TEXT_MUTED}>=</span>
            <span className="px-2 py-0.5 rounded font-bold text-emerald-400" style={{ background: 'rgba(0,198,133,0.1)', border: '1px solid rgba(0,198,133,0.2)' }}>BACS Amount</span>
          </div>
        </div>
      </motion.div>

      {/* Search toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search approved claims..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-[#00c685]/40 bg-black/[0.01] dark:bg-white/[0.01] ${
              isLight ? 'border-black/[0.06] text-black' : 'border-white/[0.05] text-white'
            }`}
          />
        </div>
        {filtered.length > 0 && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
            isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
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
                {['Claim ID', 'Participant', 'Type', 'Gross Assessed', 'Excess Deducted', 'BACS Net Amount', 'Age Waiting', 'Authorization', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#E4E7EC]' : 'divide-white/[0.04]'}`}>
              {filtered.map(c => {
                const gross = getGrossAssessed(c);
                const excess = getExcessDeducted(c);
                const net = getNetSettlement(c);
                const isHighValue = net > 10000;

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
                    {/* Governance Badge */}
                    <td className="px-5 py-4">
                      {isHighValue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                          <Lock size={10} /> Dual-Signoff
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                          <Check size={10} /> Standard
                        </span>
                      )}
                    </td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleReleaseClick(c, net)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold transition-all hover:opacity-90 whitespace-nowrap cursor-pointer ${
                          isHighValue ? 'bg-amber-600 hover:bg-amber-500' : 'bg-[#00c685] hover:bg-[#00b076]'
                        }`}
                      >
                        <Banknote size={11} /> {isHighValue ? 'Sign & Release' : `Release £${net.toLocaleString()}`}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-5 py-10 text-center text-sm ${TEXT_MUTED}`}>
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
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </motion.div>

      {/* ─── DUAL-SIGNOFF MODAL (>£10k payouts) ─── */}
      <AnimatePresence>
        {pendingDualClaim && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${
                isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0e2117] border-white/10 text-white'
              }`}
            >
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Dual-Signoff Required</h3>
                    <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
                      High-Value Settlement Governance Mandate (&gt;£10,000)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPendingDualClaim(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Claim Summary Card */}
              <div className={`mt-4 p-4 rounded-xl border text-xs space-y-2 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/30 border-white/5'
              }`}>
                <div className="flex justify-between">
                  <span className={TEXT_SUB}>Claim ID:</span>
                  <span className="font-mono font-bold text-[#00c685]">{pendingDualClaim.claim.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className={TEXT_SUB}>Participant:</span>
                  <span className="font-semibold">{pendingDualClaim.claim.participantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={TEXT_SUB}>Peril Incident:</span>
                  <span>{pendingDualClaim.claim.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className={TEXT_SUB}>Gross Assessed:</span>
                  <span>£{getGrossAssessed(pendingDualClaim.claim).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={TEXT_SUB}>Excess Deducted:</span>
                  <span className="text-red-400">−£{getExcessDeducted(pendingDualClaim.claim).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                  <span>Net Payout to Disburse:</span>
                  <span className="text-emerald-400">£{pendingDualClaim.net.toLocaleString()}</span>
                </div>
              </div>

              {/* Governance Explanation */}
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>
                  In accordance with Shariah Board resolution and FSA prudential governance, single disbursements over £10,000 require concurrent executive authorization before BACS transmission.
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleConfirmDualSignoff} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Second Executive Authorizer:
                  </label>
                  <select
                    value={dualAuthorizer}
                    onChange={(e) => setDualAuthorizer(e.target.value as 'ahmed' | 'zayd')}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                      isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#071510] border-white/10 text-white'
                    }`}
                  >
                    <option value="ahmed">Ahmed Khan — Operations Director (Management)</option>
                    <option value="zayd">Zayd Al-Mansoor — Executive Director (Super Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Executive Authorization PIN / Passcode:
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={dualPin}
                    onChange={(e) => {
                      setDualPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter 4-6 digit executive clearance PIN (e.g. 2026)"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                      pinError ? 'border-red-500 ring-1 ring-red-500' : isLight ? 'border-gray-300' : 'border-white/10'
                    } ${isLight ? 'bg-white text-gray-900' : 'bg-[#071510] text-white'}`}
                  />
                  {pinError && (
                    <p className="text-[11px] text-red-400 mt-1">Please enter a valid 4-6 digit authorization PIN.</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setPendingDualClaim(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0a1a14] bg-[#00c685] hover:bg-[#00a871] transition-all cursor-pointer shadow-md"
                  >
                    <FileCheck2 size={14} /> Dual-Authorize & Release BACS
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
