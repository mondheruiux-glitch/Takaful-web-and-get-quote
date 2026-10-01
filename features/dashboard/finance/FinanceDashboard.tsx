"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  Banknote,
  PieChart as PieIcon,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  Lock,
  Download,
  Check,
  X,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Mail,
  BadgePercent,
  Gift,
} from "lucide-react";
import {
  CONTRIBUTIONS,
  POOL,
  CLAIMS_AWAITING_PAYMENT,
  CONTRIBUTION_TREND,
} from "@/lib/dashboard/mock-data";
import { AreaChart, DonutChart } from "@/components/charts";
import { GREEN, fadeUp, KPICard, SectionCard } from "../components/DashboardShared";
import { Claim } from "@/lib/dashboard/types";

export interface FinanceDashboardProps { theme: string; }

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function getNetSettlement(c: Claim): number {
  if (c.netSettlementAmount !== undefined) return c.netSettlementAmount;
  if (c.amountApproved !== undefined) return c.amountApproved;
  return c.amountClaimed;
}
function getGrossAssessed(c: Claim): number { return c.grossAssessedAmount ?? c.amountClaimed; }
function getExcessDeducted(c: Claim): number { return c.excessDeducted ?? 300; }

/* ─── Dual-Signoff Modal ────────────────────────────────────────────────── */
function DualSignoffModal({
  claim, net, isLight, onClose, onConfirm,
}: {
  claim: Claim; net: number; isLight: boolean;
  onClose: () => void; onConfirm: (ref: string) => void;
}) {
  const [authorizer, setAuthorizer] = useState<"ahmed" | "zayd">("ahmed");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) { setPinError(true); return; }
    const ref = `BACS-TK-2026-DUAL-${claim.id.split("-").pop()}`;
    onConfirm(ref);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${
          isLight ? "bg-white border-gray-200" : "bg-[#0e2117] border-white/10"
        }`}
      >
        <div className={`flex items-start justify-between pb-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isLight ? "text-black/90" : "text-white"}`}>Dual-Signoff Required</h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-black/50" : "text-white/45"}`}>High-Value Settlement &gt;£10,000 — Executive Authorization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        {/* Claim summary */}
        <div className={`mt-4 p-4 rounded-xl border text-xs space-y-2 ${isLight ? "bg-gray-50 border-gray-200" : "bg-black/30 border-white/5"}`}>
          {[
            ["Claim ID", claim.id],
            ["Participant", claim.participantName],
            ["Peril", claim.type],
            ["Gross Assessed", `£${getGrossAssessed(claim).toLocaleString()}`],
            ["Excess Deducted", `−£${getExcessDeducted(claim).toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className={isLight ? "text-black/50" : "text-white/45"}>{l}:</span>
              <span className={`font-semibold ${l === "Excess Deducted" ? "text-red-400" : ""}`}>{v}</span>
            </div>
          ))}
          <div className={`flex justify-between pt-2 border-t text-sm font-bold ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <span>Net BACS Payout:</span>
            <span className="text-emerald-400">£{net.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>Per Shariah Board resolution: single disbursements over £10,000 require concurrent executive authorization before BACS transmission.</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-black/70" : "text-white/70"}`}>Second Executive Authorizer:</label>
            <select value={authorizer} onChange={(e) => setAuthorizer(e.target.value as "ahmed" | "zayd")}
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#071510] border-white/10 text-white"
              }`}>
              <option value="ahmed">Ahmed Khan — Operations Director (Management)</option>
              <option value="zayd">Zayd Al-Mansoor — Executive Director (Super Admin)</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-black/70" : "text-white/70"}`}>Executive Authorization PIN:</label>
            <input type="password" maxLength={6} value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              placeholder="4-6 digit executive clearance PIN (e.g. 2026)"
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                pinError ? "border-red-500 ring-1 ring-red-500" : isLight ? "border-gray-300" : "border-white/10"
              } ${isLight ? "bg-white text-gray-900" : "bg-[#071510] text-white"}`}
            />
            {pinError && <p className="text-[11px] text-red-400 mt-1">Please enter a valid 4-6 digit PIN.</p>}
          </div>
          <div className={`flex gap-3 pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors border" style={{ borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.1)" }}>Cancel</button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-[#0a1a14] cursor-pointer" style={{ background: GREEN }}>
              <FileCheck2 size={13} /> Dual-Authorize & Release BACS
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── inline step pill ─────────────────────────────────────────────────────── */
function StepPill({ n, label, done, active }: { n: number; label: string; done?: boolean; active?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
      done ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
           : active ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
           : "bg-white/[0.04] border-white/[0.08] text-white/30"
    }`}>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold ${
        done ? "bg-emerald-500 text-[#0a1a14]" : active ? "bg-amber-500 text-[#0a1a14]" : "bg-white/10 text-white/40"
      }`}>{done ? "✓" : n}</span>
      {label}
    </div>
  );
}

/* ─── main dashboard ────────────────────────────────────────────────────── */
export function FinanceDashboard({ theme }: FinanceDashboardProps) {
  const isLight = theme === "light";
  const BORDER = isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)";
  const BG = isLight ? "#ffffff" : "#0d2117";
  const TEXT = isLight ? "text-black/85" : "text-white";
  const SUB = isLight ? "text-black/50" : "text-white/45";
  const MUTED = isLight ? "text-black/35" : "text-white/30";

  /* ── state ─────────────────────────────────────────────────────────────── */
  const [failedList, setFailedList] = useState(() => CONTRIBUTIONS.filter((c) => c.status === "Failed"));
  const [claimList, setClaimList] = useState(() => CLAIMS_AWAITING_PAYMENT);
  const [releasedIds, setReleasedIds] = useState<string[]>([]);
  const [retriedIds, setRetriedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingDual, setPendingDual] = useState<{ claim: Claim; net: number } | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 4000); }

  /* ── actions ────────────────────────────────────────────────────────────── */
  function handleRetry(id: string) {
    setRetriedIds((p) => [...p, id]);
    setFailedList((p) => p.map((c) => c.id === id ? { ...c, status: "Retried" as const, retryCount: (c.retryCount ?? 1) + 1 } : c));
    showToast(`BACS Representation triggered — bank has 5 working days to clear funds`);
  }

  function handleRelease(c: Claim, net: number) {
    if (net > 10000) { setPendingDual({ claim: c, net }); return; }
    const ref = `BACS-TK-2026-${c.id.split("-").pop()}`;
    setReleasedIds((p) => [...p, c.id]);
    showToast(`£${net.toLocaleString()} released. BACS Ref: ${ref}`);
  }

  function handleDualConfirm(ref: string) {
    if (!pendingDual) return;
    setReleasedIds((p) => [...p, pendingDual.claim.id]);
    setPendingDual(null);
    showToast(`Dual-Authorized: £${pendingDual.net.toLocaleString()} released. Ref: ${ref}`);
  }

  function handleReconcile(id: string) {
    showToast(`TXN-${id} verified and reconciled in treasury ledger`);
  }

  function handleQuickReply(msg: string) {
    showToast(`Quick reply sent: "${msg.slice(0, 60)}…"`);
  }

  function handleExportCSV() {
    showToast("Treasury ledger CSV exported — ready for Shariah Supervisory Board");
  }

  /* ── derived ───────────────────────────────────────────────────────────── */
  const pendingClaims = claimList.filter((c) => !releasedIds.includes(c.id));
  const highValue = pendingClaims.filter((c) => (c.amountApproved ?? 0) > 10000);
  const standard = pendingClaims.filter((c) => (c.amountApproved ?? 0) <= 10000);
  const failedDD = failedList.filter((c) => !retriedIds.includes(c.id));
  const totalNet = pendingClaims.reduce((s, c) => s + getNetSettlement(c), 0);
  const collectionRate = Math.round((CONTRIBUTIONS.filter((c) => c.status === "Collected").length / CONTRIBUTIONS.length) * 100);

  const poolDonut = [
    { name: "Participant Fund", value: POOL.participantFundPct, color: GREEN },
    { name: "Claims Reserve", value: POOL.claimsReservePct, color: "#f59e0b" },
    { name: "Wakāla Fee", value: POOL.wakalaFeePct, color: "#94a3b8" },
  ];

  const QUICK_REPLIES = [
    "Your Direct Debit mandate has been updated and will take effect from your next billing date.",
    "We have confirmed receipt of your payment. Your coverage remains fully active.",
    "Your Direct Debit was unsuccessful. You have 14 days to resolve the outstanding balance before coverage is placed on hold.",
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-4 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs max-w-sm"
            style={{ background: GREEN }}>
            <Check size={14} /><span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dual-Signoff Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {pendingDual && (
          <DualSignoffModal
            claim={pendingDual.claim} net={pendingDual.net} isLight={isLight}
            onClose={() => setPendingDual(null)} onConfirm={handleDualConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className={`text-xl font-bold ${TEXT}`}>Finance Operations</h1>
        <p className={`text-sm mt-0.5 ${SUB}`}>Amira Siddiqui · Period: {POOL.periodLabel} · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
      </motion.div>

      {/* ── KPIs ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Pool Balance" value={`£${POOL.balance.toLocaleString()}`} sub={POOL.periodLabel} icon={PieIcon} delay={0} theme={theme} trend={{ dir: "up", text: "+£19,150 vs Jun" }} />
        <KPICard label="Collection Rate" value={`${collectionRate}%`} sub={`${CONTRIBUTIONS.filter((c) => c.status === "Collected").length} of ${CONTRIBUTIONS.length}`} icon={TrendingUp} delay={1} theme={theme} />
        <KPICard label="Failed DDs" value={`${failedDD.length}`} sub={`£${failedDD.reduce((s, c) => s + c.amount, 0).toFixed(2)} outstanding`} icon={AlertTriangle} delay={2} theme={theme} color="#ef4444" />
        <KPICard label="Awaiting Release" value={`£${totalNet.toLocaleString()}`} sub={`${pendingClaims.length} approved claims`} icon={Banknote} delay={3} theme={theme} color="#f59e0b" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION A — FAILED DIRECT DEBITS (Priority 1 — act within 14 days)
         ══════════════════════════════════════════════════════════════════════ */}
      {failedDD.length > 0 && (
        <section>
          {/* Section header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-400">URGENT</span>
            </div>
            <h2 className={`text-sm font-bold ${TEXT}`}>Failed Direct Debits — 4-Step Recovery</h2>
            <span className={`text-[11px] ${MUTED}`}>· Act within 14 days or coverage lapses</span>
          </div>

          {/* Process guide bar */}
          <div className={`rounded-2xl border p-4 mb-3 ${isLight ? "bg-amber-50/80 border-amber-200" : "bg-amber-900/15 border-amber-500/25"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <StepPill n={1} label="BACS Return" done />
              <ArrowRight size={11} className="text-white/20" />
              <StepPill n={2} label="Trigger Retry" active />
              <ArrowRight size={11} className="text-white/20" />
              <StepPill n={3} label="Grace Period Notice" done />
              <ArrowRight size={11} className="text-white/20" />
              <StepPill n={4} label="Reconcile Payment" />
              <ArrowRight size={11} className="text-white/20" />
              <StepPill n={5} label="Policy Hold (if 3 fail)" />
            </div>
            <p className={`text-[10px] mt-2.5 ${isLight ? "text-amber-700" : "text-amber-400"}`}>
              Coverage remains active for <strong>14 days</strong> · Any claims filed during grace period are still payable, but outstanding balance is deducted from payout · After day 15, policy moves to On Hold.
            </p>
          </div>

          {/* Failed DD cards */}
          <div className="space-y-3">
            {failedDD.map((c) => (
              <div key={c.id} className={`rounded-2xl border ${isLight ? "bg-white border-red-200" : "bg-[#0d2117] border-red-500/20"}`}>
                {/* Card header */}
                <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isLight ? "border-red-100" : "border-red-500/15"}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-red-500/15">
                      <AlertTriangle size={14} className="text-red-400" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${TEXT}`}>{c.participantName}</p>
                      <p className={`text-[11px] ${MUTED}`}>{c.id} · Cert: {c.certificateId} · Due {c.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-red-400">£{c.amount.toFixed(2)}</p>
                    <p className={`text-[10px] ${MUTED}`}>Retry {c.retryCount ?? 1}/3</p>
                  </div>
                </div>

                {/* Card body — 3 inline actions */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Action 1 — BACS Retry */}
                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-900/20 border-amber-500/25"}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black bg-amber-500 text-[#0a1a14]`}>2</span>
                      <p className={`text-[11px] font-bold ${isLight ? "text-amber-900" : "text-amber-300"}`}>Trigger BACS Retry</p>
                    </div>
                    <p className={`text-[10px] mb-3 ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                      Re-present the unpaid DD to the participant's bank. Banks allow up to 3 re-presentations.
                    </p>
                    <button
                      onClick={() => handleRetry(c.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0a1a14] text-[11px] font-bold transition-all"
                    >
                      <RefreshCw size={11} /> Trigger BACS Retry
                    </button>
                  </div>

                  {/* Action 2 — Quick Reply */}
                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-900/15 border-blue-500/25"}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black bg-blue-500 text-white">3</span>
                      <p className={`text-[11px] font-bold ${isLight ? "text-blue-900" : "text-blue-300"}`}>Send Grace Period Notice</p>
                    </div>
                    <p className={`text-[10px] mb-3 ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                      Notify participant their policy is in grace period with 14 days to resolve.
                    </p>
                    <div className="space-y-1.5">
                      {QUICK_REPLIES.slice(2).map((msg, i) => (
                        <button key={i} onClick={() => handleQuickReply(msg)}
                          className={`w-full text-left text-[10px] px-2.5 py-1.5 rounded-lg border transition-all ${
                            isLight ? "border-blue-200 hover:bg-blue-100 text-blue-800" : "border-blue-500/20 hover:bg-blue-500/10 text-blue-300"
                          }`}>
                          <Mail size={9} className="inline mr-1" />Grace Period Notice
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action 3 — Reconcile or Escalate */}
                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.02] border-white/[0.08]"}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${isLight ? "bg-black/20 text-black" : "bg-white/15 text-white"}`}>4</span>
                      <p className={`text-[11px] font-bold ${TEXT}`}>After Payment Received</p>
                    </div>
                    <p className={`text-[10px] mb-3 ${MUTED}`}>
                      Once participant pays by card or bank transfer, reconcile TXN-8808 in Treasury.
                    </p>
                    <Link href="/dashboard/transactions"
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[11px] font-semibold transition-all ${
                        isLight ? "border-black/15 hover:border-black/30 text-black/70" : "border-white/15 hover:border-white/30 text-white/70"
                      }`}>
                      <ArrowRight size={11} /> Go to Treasury Ledger
                    </Link>
                  </div>
                </div>

                {/* Grace Period countdown bar */}
                <div className={`px-5 py-3 border-t flex items-center justify-between ${isLight ? "border-amber-100 bg-amber-50/60" : "border-amber-500/15 bg-amber-900/10"}`}>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-amber-500" />
                    <span className={`text-[11px] font-semibold ${isLight ? "text-amber-800" : "text-amber-300"}`}>Grace Period: 11 of 14 days remaining</span>
                  </div>
                  <div className="flex-1 mx-4 h-1.5 rounded-full bg-amber-200/30">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: "21%" }} />
                  </div>
                  <span className={`text-[10px] font-bold ${isLight ? "text-amber-700" : "text-amber-400"}`}>Day 15 → On Hold</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION B — CLAIM PAYOUTS (Priority 2)
         ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2.5 mb-3">
          {highValue.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25">
              <Lock size={11} className="text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400">DUAL-SIGNOFF</span>
            </div>
          )}
          <h2 className={`text-sm font-bold ${TEXT}`}>Claim Payouts — Release Queue</h2>
          <span className={`ml-auto text-[11px] font-semibold ${MUTED}`}>{pendingClaims.length} pending · £{totalNet.toLocaleString()} total</span>
        </div>

        {/* Formula reminder */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3 text-xs ${isLight ? "bg-black/[0.03] border border-black/[0.06]" : "bg-white/[0.02] border border-white/[0.05]"}`}>
          <span className={`px-2 py-0.5 rounded font-mono font-semibold ${isLight ? "bg-white border border-black/10 text-black/80" : "bg-white/5 border border-white/10 text-white/80"}`}>Gross Loss</span>
          <span className="text-red-400 font-bold">−</span>
          <span className={`px-2 py-0.5 rounded font-mono font-semibold ${isLight ? "bg-white border border-black/10 text-black/80" : "bg-white/5 border border-white/10 text-white/80"}`}>£300 Excess</span>
          <span className={`${MUTED}`}>=</span>
          <span className="px-2 py-0.5 rounded font-mono font-bold text-emerald-400" style={{ background: "rgba(0,198,133,0.1)", border: "1px solid rgba(0,198,133,0.2)" }}>BACS Amount</span>
          {highValue.length > 0 && (
            <>
              <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <Lock size={9} /> &gt;£10,000 → Management PIN required
              </span>
            </>
          )}
        </div>

        {/* Payout table */}
        <div className={`rounded-2xl border overflow-hidden ${isLight ? "bg-white border-[#E4E7EC]" : "bg-[#0d2117] border-white/[0.05]"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={isLight ? "text-black/40 border-b border-[#E4E7EC] bg-black/[0.01]" : "text-white/30 border-b border-white/[0.04] bg-white/[0.01]"}>
                  {["Claim ID", "Participant", "Type", "Gross", "−Excess", "BACS Net", "Days", "Auth", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-[#E4E7EC]" : "divide-white/[0.04]"}`}>
                {pendingClaims.map((c) => {
                  const gross = getGrossAssessed(c);
                  const excess = getExcessDeducted(c);
                  const net = getNetSettlement(c);
                  const isHV = net > 10000;
                  return (
                    <tr key={c.id} className={`${isLight ? "hover:bg-black/[0.01]" : "hover:bg-white/[0.01]"} ${isHV ? isLight ? "bg-amber-50/60" : "bg-amber-900/10" : ""}`}>
                      <td className="px-4 py-3.5 font-mono font-bold text-[11px]" style={{ color: GREEN }}>{c.id}</td>
                      <td className={`px-4 py-3.5 font-medium ${TEXT}`}>{c.participantName}</td>
                      <td className={`px-4 py-3.5 ${SUB}`}>{c.type}</td>
                      <td className={`px-4 py-3.5 font-semibold ${TEXT}`}>£{gross.toLocaleString()}</td>
                      <td className="px-4 py-3.5 font-semibold text-red-400">−£{excess.toLocaleString()}</td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400 text-sm">£{net.toLocaleString()}</td>
                      <td className="px-4 py-3.5 font-semibold text-amber-400">{c.daysOpen}d</td>
                      <td className="px-4 py-3.5">
                        {isHV ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                            <Lock size={9} /> Dual-Signoff
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                            <Check size={9} /> Standard
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleRelease(c, net)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold transition-all hover:opacity-90 whitespace-nowrap ${
                            isHV ? "bg-amber-600 hover:bg-amber-500" : "bg-[#00c685] hover:bg-[#00b076]"
                          }`}
                        >
                          {isHV ? <><Lock size={10} /> Sign & Release</> : <><Banknote size={10} /> Release £{net.toLocaleString()}</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {pendingClaims.length === 0 && (
                  <tr><td colSpan={9} className={`px-4 py-8 text-center text-sm ${MUTED}`}>All claims have been released ✓</td></tr>
                )}
              </tbody>
              {pendingClaims.length > 0 && (
                <tfoot>
                  <tr className={isLight ? "border-t border-[#E4E7EC] bg-[#f4f6f5] font-bold text-xs" : "border-t border-white/[0.04] bg-[#112218] font-bold text-xs"}>
                    <td colSpan={5} className={`px-4 py-3 ${MUTED}`}>Queue Total — {pendingClaims.length} claims</td>
                    <td className="px-4 py-3 text-emerald-400">£{totalNet.toLocaleString()}</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION C — POOL HEALTH + DAILY AUDIT  (Priority 3)
         ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2.5 mb-3">
          <h2 className={`text-sm font-bold ${TEXT}`}>Pool Health & Daily Treasury Audit</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pool donut */}
          <div className={`rounded-2xl border p-5 ${isLight ? "bg-white border-[#E4E7EC]" : "bg-[#0d2117] border-white/[0.05]"}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${MUTED}`}>70 / 15 / 15 Allocation</p>
            <div className="h-36 w-full flex items-center justify-center">
              <DonutChart data={poolDonut} theme={theme} height="100%" valueFormatter={(v) => `${v}%`}
                centerText={{ primary: `${POOL.participantFundPct}%`, secondary: "Fund" }} />
            </div>
            <div className="grid grid-cols-3 gap-1 pt-3 border-t text-center text-[10px]" style={{ borderColor: BORDER }}>
              {poolDonut.map((p) => (
                <div key={p.name}>
                  <p className={`font-bold ${isLight ? "text-black/70" : "text-white/70"}`}>{p.value}%</p>
                  <p className={MUTED}>{p.name.split(" ")[0]}</p>
                </div>
              ))}
            </div>
            {/* Reserve ratio */}
            <div className={`mt-3 p-2.5 rounded-xl ${isLight ? "bg-emerald-50 border border-emerald-200" : "bg-emerald-900/15 border border-emerald-500/20"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold ${isLight ? "text-emerald-800" : "text-emerald-300"}`}>Reserve Ratio</span>
                <span className="text-[11px] font-extrabold text-emerald-400">5.2x ✓</span>
              </div>
              <div className="h-1.5 rounded-full bg-emerald-200/30">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "65%" }} />
              </div>
              <p className={`text-[9px] mt-1 ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>Min. 3.0x required · Healthy</p>
            </div>
          </div>

          {/* Contribution trend */}
          <div className={`lg:col-span-2 rounded-2xl border p-5 ${isLight ? "bg-white border-[#E4E7EC]" : "bg-[#0d2117] border-white/[0.05]"}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${MUTED}`}>Collection Trend 2026</p>
                <p className={`text-sm font-semibold mt-0.5 ${TEXT}`}>Inflows vs Failed Mandates</p>
              </div>
              <button onClick={handleExportCSV}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                  isLight ? "border-black/[0.06] text-black/60 hover:bg-black/[0.04]" : "border-white/[0.06] text-white/55 hover:bg-white/[0.04]"
                }`}>
                <Download size={12} /> Export CSV
              </button>
            </div>
            <div className="h-48 w-full">
              <AreaChart data={CONTRIBUTION_TREND} xKey="month" theme={theme} height="100%"
                yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                series={[
                  { dataKey: "collected", name: "Collected", color: GREEN, fill: true },
                  { dataKey: "failed", name: "Failed", color: "#ef4444", fill: false, borderDash: [4, 4], borderWidth: 1.5 },
                ]} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION D — SHARIAH YEAR-END RESPONSIBILITIES (informational, collapsible)
         ══════════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2.5 mb-3">
          <h2 className={`text-sm font-bold ${TEXT}`}>Shariah Responsibilities</h2>
          <span className={`text-[11px] ${MUTED}`}>· Annual & exceptional events</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Al-Fa'id */}
          <Link href="/dashboard/pool" className={`group p-4 rounded-2xl border transition-all hover:border-[#00c685]/40 ${isLight ? "bg-white border-[#E4E7EC]" : "bg-[#0d2117] border-white/[0.05]"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ background: `${GREEN}18` }}>
                <Gift size={14} style={{ color: GREEN }} />
              </div>
              <p className={`text-xs font-bold ${TEXT} group-hover:text-[#00c685] transition-colors`}>Al-Fa&apos;id Surplus</p>
            </div>
            <p className={`text-[10px] leading-relaxed ${MUTED}`}>Year-end: distribute net surplus to non-claiming participants as cash, discount, or charity donation.</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold" style={{ color: GREEN }}>
              <BadgePercent size={10} /> £28,450 available <ChevronRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Qard Hasan */}
          <Link href="/dashboard/pool" className={`group p-4 rounded-2xl border transition-all hover:border-blue-400/40 ${isLight ? "bg-white border-[#E4E7EC]" : "bg-[#0d2117] border-white/[0.05]"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/15">
                <ShieldAlert size={14} className="text-blue-400" />
              </div>
              <p className={`text-xs font-bold ${TEXT} group-hover:text-blue-400 transition-colors`}>Qard Hasan</p>
            </div>
            <p className={`text-[10px] leading-relaxed ${MUTED}`}>If claims exceed pool balance: inject interest-free corporate loan. All claims paid immediately. No surcharges to members.</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-blue-400">
              Status: Not triggered <ChevronRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Daily audit */}
          <Link href="/dashboard/transactions" className={`group p-4 rounded-2xl border transition-all hover:border-white/20 ${isLight ? "bg-white border-[#E4E7EC]" : "bg-[#0d2117] border-white/[0.05]"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${isLight ? "bg-black/[0.06]" : "bg-white/[0.06]"}`}>
                <Download size={14} className={isLight ? "text-black/50" : "text-white/50"} />
              </div>
              <p className={`text-xs font-bold ${TEXT}`}>Treasury Cash Book</p>
            </div>
            <p className={`text-[10px] leading-relaxed ${MUTED}`}>Audit all daily inflows/outflows, reconcile individual transactions, export full ledger CSV for Shariah Supervisory Board.</p>
            <div className={`mt-2 flex items-center gap-1 text-[10px] font-semibold ${isLight ? "text-black/40" : "text-white/35"}`}>
              <CheckCircle2 size={10} className="text-emerald-400" /> 1 unreconciled <ChevronRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FinanceDashboard;
