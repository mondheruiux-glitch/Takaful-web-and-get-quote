"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Banknote, RefreshCw, Clock,
  CheckCircle2, Lock, Download, Check, X,
  FileCheck2, ShieldAlert, Mail, Gift, ChevronDown,
  ChevronRight, Sparkles, Flag, Send,
} from "lucide-react";
import {
  CONTRIBUTIONS, POOL, CLAIMS_AWAITING_PAYMENT,
} from "@/lib/dashboard/mock-data";
import { GREEN } from "../components/DashboardShared";
import { Claim, Contribution } from "@/lib/dashboard/types";
import { ActionButton } from "@/components/ui/ds/ActionButton";
import { StatusBadge } from "@/components/ui/ds/StatusBadge";
import { ParticipantChip } from "@/components/ui/ParticipantChip";
import { addDisciplinaryReport } from "@/lib/dashboard/management-reports";


export interface FinanceDashboardProps { theme: string; }

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const net   = (c: Claim) => c.netSettlementAmount ?? c.amountApproved ?? c.amountClaimed;
const gross = (c: Claim) => c.grossAssessedAmount ?? c.amountClaimed;
const exc   = (c: Claim) => c.excessDeducted ?? 300;

/* ─── Dual-Signoff Modal ────────────────────────────────────────────────────── */
function DualSignoffModal({ claim, isLight, onClose, onConfirm }: {
  claim: Claim; isLight: boolean;
  onClose: () => void; onConfirm: (ref: string) => void;
}) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const payout = net(claim);

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
          isLight ? "bg-white border-gray-200" : "bg-[#0e2117] border-white/10"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${isLight ? "border-gray-100" : "border-white/[0.07]"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25">
              <ShieldAlert size={18} className="text-amber-400" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Executive Signoff Required</p>
              <p className={`text-[11px] mt-0.5 ${isLight ? "text-gray-500" : "text-white/45"}`}>Payout &gt;£10,000 — dual authorisation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Claim summary */}
        <div className={`mt-4 rounded-xl p-4 text-xs space-y-2.5 ${isLight ? "bg-gray-50 border border-gray-100" : "bg-black/25 border border-white/[0.04]"}`}>
          {[
            ["Participant", claim.participantName],
            ["Claim",       claim.id],
            ["Peril",       claim.type],
            ["Gross loss",  `£${gross(claim).toLocaleString()}`],
            ["Excess",      `−£${exc(claim).toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className={isLight ? "text-gray-500" : "text-white/40"}>{l}</span>
              <span className={`font-semibold ${l === "Excess" ? "text-red-400" : isLight ? "text-gray-900" : "text-white"}`}>{v}</span>
            </div>
          ))}
          <div className={`flex justify-between pt-2 border-t font-bold text-sm ${isLight ? "border-gray-200 text-gray-900" : "border-white/10 text-white"}`}>
            <span>Net BACS payout</span>
            <span className="text-emerald-400">£{payout.toLocaleString()}</span>
          </div>
        </div>

        {/* PIN input */}
        <div className="mt-4 space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-white/70"}`}>
              Executive clearance PIN
            </label>
            <input
              type="password" maxLength={6} value={pin}
              onChange={e => { setPin(e.target.value); setErr(false); }}
              placeholder="4–6 digit PIN"
              className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#00c685] ${
                err ? "border-red-500" : isLight ? "border-gray-300" : "border-white/10"
              } ${isLight ? "bg-white text-gray-900" : "bg-[#071510] text-white"}`}
            />
            {err && <p className="text-[11px] text-red-400 mt-1">Enter a valid 4–6 digit PIN.</p>}
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >Cancel</button>
            <button
              onClick={() => {
                if (pin.length < 4) { setErr(true); return; }
                onConfirm(`BACS-TK-2026-DUAL-${claim.id.split("-").pop()}`);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-[#0a1a14]"
              style={{ background: GREEN }}
            >
              <FileCheck2 size={13} /> Authorise & Release
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Card shell ─────────────────────────────────────────────────────────── */
function Card({ isLight, children, className = "" }: { isLight: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${className}`}
      style={{ background: isLight ? "#fff" : "#0d2117", borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)" }}
    >
      {children}
    </div>
  );
}

function CardHeader({ isLight, title, badge, count }: { isLight: boolean; title: string; badge?: React.ReactNode; count?: number }) {
  const T = isLight ? "text-gray-900" : "text-white";
  return (
    <div
      className={`flex items-center justify-between px-5 py-3.5 border-b`}
      style={{ borderColor: isLight ? "#F0F2F0" : "rgba(255,255,255,0.04)" }}
    >
      <div className="flex items-center gap-2.5">
        <span className={`text-sm font-bold ${T}`}>{title}</span>
        {count !== undefined && count > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center">
            {count}
          </span>
        )}
        {badge}
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────────────── */
export function FinanceDashboard({ theme }: FinanceDashboardProps) {
  const isLight = theme === "light";
  const M = isLight ? "text-gray-400" : "text-white/35";
  const S = isLight ? "text-gray-600" : "text-white/65";
  const T = isLight ? "text-gray-900" : "text-white";

  /* state */
  const [failedList,  setFailedList]  = useState<Contribution[]>(() => CONTRIBUTIONS.filter(c => c.status === "Failed"));
  const [retriedIds,  setRetriedIds]  = useState<string[]>([]);
  const [claimList]                   = useState(() => CLAIMS_AWAITING_PAYMENT);
  const [releasedIds, setReleasedIds] = useState<string[]>([]);
  const [pendingDual, setPendingDual] = useState<Claim | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);
  const [shariahOpen, setShariahOpen] = useState(false);
  const [financeReportTarget, setFinanceReportTarget] = useState<Contribution | null>(null);
  const [financeCategory, setFinanceCategory] = useState("Direct Debit Mandate Default / Repeated BACS Failure");
  const [financeNotes, setFinanceNotes] = useState("");
  const [financeAuditRef, setFinanceAuditRef] = useState("");

  function fire(msg: string) { setToast(msg); setTimeout(() => setToast(null), 4000); }

  function doSubmitFinanceReport() {
    if (!financeReportTarget) return;
    addDisciplinaryReport({
      participantId: financeReportTarget.participantId,
      participantName: financeReportTarget.participantName,
      source: "finance",
      reporterName: "Amira Siddiqui",
      reporterRole: "Head of Treasury & Payouts (Finance)",
      category: financeCategory,
      notes: financeNotes || "Reported for Direct Debit failure / pool arrears.",
      auditReference: financeAuditRef || `BACS-${financeReportTarget.certificateId}`,
      amount: financeReportTarget.amount,
    });
    fire(`Financial irregularity report for ${financeReportTarget.participantName} routed to Operations Management.`);
    setFinanceReportTarget(null);
    setFinanceNotes("");
    setFinanceAuditRef("");
  }

  const failedDD      = failedList.filter(c => !retriedIds.includes(c.id));
  const pendingClaims = claimList.filter(c => !releasedIds.includes(c.id));
  const totalPayout   = pendingClaims.reduce((s, c) => s + net(c), 0);
  const collectionPct = Math.round(
    (CONTRIBUTIONS.filter(c => c.status === "Collected").length / CONTRIBUTIONS.length) * 100
  );

  function doRetry(id: string) {
    setRetriedIds(p => [...p, id]);
    setFailedList(p => p.map(c => c.id === id ? { ...c, status: "Retried" as const, retryCount: (c.retryCount ?? 1) + 1 } : c));
    fire("BACS representation sent — bank has 5 working days to clear.");
  }

  function doNotice(c: Contribution) {
    fire(`Grace period notice dispatched to ${c.participantName}.`);
  }

  function doRelease(c: Claim) {
    const payout = net(c);
    if (payout > 10000) { setPendingDual(c); return; }
    setReleasedIds(p => [...p, c.id]);
    fire(`£${payout.toLocaleString()} released — BACS-TK-2026-${c.id.split("-").pop()}`);
  }

  function doDualConfirm(ref: string) {
    if (!pendingDual) return;
    setReleasedIds(p => [...p, pendingDual.id]);
    fire(`Dual-authorised: £${net(pendingDual).toLocaleString()} released. Ref: ${ref}`);
    setPendingDual(null);
  }

  return (
    <div className="p-5 sm:p-7 space-y-5 max-w-4xl mx-auto">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div key="t" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="fixed top-5 right-5 z-[500] flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-[#0a1a14] text-xs font-bold"
            style={{ background: GREEN }}>
            <Check size={14} />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dual-signoff modal ── */}
      <AnimatePresence>
        {pendingDual && (
          <DualSignoffModal
            claim={pendingDual} isLight={isLight}
            onClose={() => setPendingDual(null)}
            onConfirm={doDualConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div>
        <h1 className={`text-lg font-bold tracking-tight ${T}`}>Finance Operations</h1>
        <p className={`text-xs mt-0.5 ${M}`}>
          Amira Siddiqui · {POOL.periodLabel} · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* ── Status strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pool Balance",   value: `£${POOL.balance.toLocaleString()}`,  sub: POOL.periodLabel,                       alert: false },
          { label: "Collection",     value: `${collectionPct}%`,                   sub: `${failedDD.length} failed mandate${failedDD.length !== 1 ? "s" : ""}`, alert: failedDD.length > 0 },
          { label: "Payout Queue",   value: `£${totalPayout.toLocaleString()}`,    sub: `${pendingClaims.length} claim${pendingClaims.length !== 1 ? "s" : ""} pending`, alert: pendingClaims.length > 0 },
        ].map(({ label, value, sub, alert }) => (
          <div
            key={label}
            className="rounded-2xl p-4"
            style={{ background: isLight ? "#fff" : "#0d2117", border: isLight ? "1px solid #E4E7EC" : "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${M}`}>{label}</p>
            <p className={`text-xl font-extrabold mt-1 ${alert ? "text-amber-400" : T}`}>{value}</p>
            <p className={`text-[11px] mt-0.5 ${M}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          CARD A — Failed Direct Debits
         ══════════════════════════════════════ */}
      <Card isLight={isLight}>
        <CardHeader
          isLight={isLight}
          title="Direct Debit Failures"
          count={failedDD.length}
        />

        {failedDD.length === 0 ? (
          <div className="flex items-center gap-3 px-5 py-6">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className={`text-sm ${S}`}>All contributions current — no failed mandates.</p>
          </div>
        ) : (
          <div className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/[0.04]"}`}>
            {failedDD.map(c => {
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Participant & Info */}
                  <div className="flex-1 min-w-0">
                    <ParticipantChip
                      name={c.participantName}
                      participantId={c.participantId}
                      certificateId={c.certificateId}
                      status="Failed"
                      size="md"
                      theme={theme}
                    />
                  </div>

                  {/* Amount + grace */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-sm font-extrabold text-red-500">£{c.amount.toFixed(2)}</p>
                    <p className={`text-[10px] ${M} flex items-center gap-1 justify-end`}>
                      <Clock size={9} className="text-amber-500" />
                      11 days left
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <ActionButton
                      variant="amber"
                      size="sm"
                      icon={RefreshCw}
                      onClick={() => doRetry(c.id)}
                    >
                      Retry
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      icon={Mail}
                      onClick={() => doNotice(c)}
                      theme={theme}
                    >
                      Notice
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      size="sm"
                      icon={Flag}
                      onClick={() => setFinanceReportTarget(c)}
                    >
                      Report
                    </ActionButton>
                  </div>
                </div>
              );
            })}

          </div>
        )}

        <div
          className={`px-5 py-3 flex items-center justify-between border-t ${isLight ? "border-gray-100 bg-gray-50/60" : "border-white/[0.04] bg-white/[0.01]"}`}
        >
          <p className={`text-[11px] ${M}`}>Statutory 14-day grace period · Day 15 = Policy Hold</p>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/participants" className="text-[11px] font-semibold text-[#00c685] hover:underline flex items-center gap-1">
              Participant Registry <ChevronRight size={11} />
            </Link>
            <Link href="/dashboard/contributions" className={`text-[11px] font-semibold flex items-center gap-1 ${isLight ? "text-gray-600 hover:text-gray-900" : "text-white/55 hover:text-white"}`}>
              All mandates <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </Card>

      {/* ══════════════════════════════════════
          CARD B — Payout Queue
         ══════════════════════════════════════ */}
      <Card isLight={isLight}>
        <CardHeader
          isLight={isLight}
          title="Claim Payout Queue"
          badge={
            pendingClaims.some(c => net(c) > 10000) ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                <Lock size={9} /> Dual-signoff required
              </span>
            ) : undefined
          }
        />

        {pendingClaims.length === 0 ? (
          <div className="flex items-center gap-3 px-5 py-6">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className={`text-sm ${S}`}>All approved claims have been disbursed.</p>
          </div>
        ) : (
          <div className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/[0.04]"}`}>
            {pendingClaims.map(c => {
              const payout = net(c);
              const isDual = payout > 10000;
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Participant & Info */}
                  <div className="flex-1 min-w-0">
                    <ParticipantChip
                      name={c.participantName}
                      participantId={c.participantId}
                      certificateId={c.certificateId}
                      status={c.status}
                      size="md"
                      theme={theme}
                    />
                    <p className={`text-[11px] mt-1 ${M}`}>{c.type} · {c.daysOpen}d in queue</p>
                  </div>

                  {/* Net amount */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-emerald-500">£{payout.toLocaleString()}</p>
                    <p className={`text-[10px] ${M}`}>
                      £{gross(c).toLocaleString()} − £{exc(c)} excess
                    </p>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isDual ? (
                      <ActionButton
                        variant="amber"
                        size="sm"
                        icon={Lock}
                        onClick={() => doRelease(c)}
                      >
                        Sign &amp; Release
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="primary"
                        size="sm"
                        icon={Banknote}
                        onClick={() => doRelease(c)}
                      >
                        Release £{payout.toLocaleString()}
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        )}

        <div
          className={`px-5 py-3 flex items-center justify-between border-t ${isLight ? "border-gray-100 bg-gray-50/60" : "border-white/[0.04] bg-white/[0.01]"}`}
        >
          <p className={`text-[11px] ${M}`}>Gross − Excess = Net BACS payout · &gt;£10k requires Management PIN</p>
          <Link href="/dashboard/claims-payments" className={`text-[11px] font-semibold flex items-center gap-1 ${isLight ? "text-gray-600 hover:text-gray-900" : "text-white/55 hover:text-white"}`}>
            Full claims list <ChevronRight size={11} />
          </Link>
        </div>
      </Card>

      {/* ══════════════════════════════════════
          CARD C — Pool Health (no chart)
         ══════════════════════════════════════ */}
      <Card isLight={isLight}>
        <CardHeader isLight={isLight} title="Pool Health" />

        <div className="px-5 py-4 grid grid-cols-3 gap-4">
          {/* Reserve ratio */}
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${M}`}>Reserve Ratio</p>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">5.2x</p>
            <div className="mt-2 h-1.5 rounded-full bg-emerald-500/15 overflow-hidden">
              <div className="h-full w-[65%] rounded-full bg-emerald-500" />
            </div>
            <p className={`text-[10px] mt-1 ${M}`}>Min. 3.0x · Compliant</p>
          </div>

          {/* 70/15/15 */}
          <div className={`col-span-2 grid grid-cols-3 gap-3 pl-4 border-l ${isLight ? "border-gray-100" : "border-white/[0.05]"}`}>
            {[
              { label: "Participant Fund", pct: `${POOL.participantFundPct}%`, color: GREEN },
              { label: "Claims Reserve",  pct: `${POOL.claimsReservePct}%`,   color: "#f59e0b" },
              { label: "Wakāla Fee",       pct: `${POOL.wakalaFeePct}%`,       color: "#94a3b8" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <p className={`text-[11px] font-semibold uppercase tracking-wider ${M}`}>{label}</p>
                <p className="text-xl font-extrabold mt-1" style={{ color }}>{pct}</p>
                <p className={`text-[10px] mt-0.5 ${M}`}>AAOIFI allocation</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`px-5 py-3 flex items-center justify-between border-t ${isLight ? "border-gray-100 bg-gray-50/60" : "border-white/[0.04] bg-white/[0.01]"}`}
        >
          <Link href="/dashboard/pool" className={`text-[11px] font-semibold flex items-center gap-1 ${isLight ? "text-gray-600 hover:text-gray-900" : "text-white/55 hover:text-white"}`}>
            Full pool view <ChevronRight size={11} />
          </Link>
          <button
            onClick={() => fire("Treasury ledger CSV exported for Shariah Supervisory Board.")}
            className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${isLight ? "text-gray-600 hover:text-gray-900" : "text-white/55 hover:text-white"}`}
          >
            <Download size={11} /> Export Shariah CSV
          </button>
        </div>
      </Card>

      {/* ══════════════════════════════════════
          Shariah accordion (collapsed)
         ══════════════════════════════════════ */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: isLight ? "#fff" : "#0d2117", borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => setShariahOpen(o => !o)}
          className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"}`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <span className={`text-sm font-semibold ${T}`}>Shariah Governance</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/12 text-emerald-400">
              £28,450 surplus available
            </span>
          </div>
          <ChevronDown size={14} className={`${M} transition-transform duration-200 ${shariahOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {shariahOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`border-t ${isLight ? "border-gray-100" : "border-white/[0.04]"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x"
                style={{ borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)" }}
              >
                {[
                  { href: "/dashboard/pool",         icon: Gift,       iconCls: "text-emerald-400", title: "Al-Fa'id Surplus",    desc: "Annual return of net surplus to non-claiming participants via BACS rebate or charity." },
                  { href: "/dashboard/pool",         icon: ShieldAlert, iconCls: "text-blue-400",   title: "Qard Hasan",          desc: "Interest-free corporate liquidity backstop if claims exceed pool balance. Currently inactive." },
                  { href: "/dashboard/transactions", icon: FileCheck2,  iconCls: "text-amber-400",  title: "Treasury Cash Book",  desc: "Full daily audit trail for Shariah Supervisory Committee reconciliation." },
                ].map(({ href, icon: Icon, iconCls, title, desc }) => (
                  <Link key={title} href={href} className={`flex items-start gap-3 px-5 py-4 transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.03]"}`}>
                    <Icon size={15} className={`${iconCls} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-xs font-semibold ${T}`}>{title}</p>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${M}`}>{desc}</p>
                    </div>
                    <ChevronRight size={12} className={`${M} ml-auto shrink-0 mt-0.5`} />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Finance Irregularity Report Modal ── */}
      <AnimatePresence>
        {financeReportTarget && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFinanceReportTarget(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative z-10 w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
                isLight ? "bg-white border-gray-200 text-gray-900" : "bg-[#0d2117] border-white/10 text-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600">
                    <Flag size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Report Financial Irregularity</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Target: {financeReportTarget.participantName} ({financeReportTarget.participantId})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFinanceReportTarget(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Financial Category</label>
                  <select
                    value={financeCategory}
                    onChange={(e) => setFinanceCategory(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? "bg-gray-50 border-gray-300" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <option value="Direct Debit Mandate Default / Repeated BACS Failure">
                      Direct Debit Mandate Default / Repeated BACS Failure
                    </option>
                    <option value="Contribution Arrears / Delinquent Pool Account (>60 Days)">
                      Contribution Arrears / Delinquent Pool Account (&gt;60 Days)
                    </option>
                    <option value="Under-reported Property Value / Contribution Arbitrage">
                      Under-reported Property Value / Contribution Arbitrage
                    </option>
                    <option value="Suspicious Unreconciled Deposit / Anti-Money Laundering (AML)">
                      Suspicious Unreconciled Deposit / Anti-Money Laundering (AML)
                    </option>
                    <option value="Surplus Distribution Dispute / Divergent Bank Account Details">
                      Surplus Distribution Dispute / Divergent Bank Account Details
                    </option>
                    <option value="Disputed Indemnity Payout / Suspected Dual-Claim Clawback">
                      Disputed Indemnity Payout / Suspected Dual-Claim Clawback
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">BACS / Mandate Reference</label>
                  <input
                    type="text"
                    value={financeAuditRef}
                    onChange={(e) => setFinanceAuditRef(e.target.value)}
                    placeholder="e.g. MAND-8808 / RETRY-2"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? "bg-gray-50 border-gray-300" : "bg-white/5 border-white/10"
                    }`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Treasury Audit Notes</label>
                  <textarea
                    rows={3}
                    value={financeNotes}
                    onChange={(e) => setFinanceNotes(e.target.value)}
                    placeholder="Provide ledger notes, BACS return codes, or AML observations for Operations Management..."
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none resize-none ${
                      isLight ? "bg-gray-50 border-gray-300" : "bg-white/5 border-white/10"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setFinanceReportTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={doSubmitFinanceReport}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={12} /> Route to Management
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FinanceDashboard;
