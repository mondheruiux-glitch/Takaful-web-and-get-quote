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
  ChevronDown,
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
  HelpCircle,
  Search,
  SlidersHorizontal,
  Send,
  Sparkles,
} from "lucide-react";
import {
  CONTRIBUTIONS,
  POOL,
  CLAIMS_AWAITING_PAYMENT,
  CONTRIBUTION_TREND,
} from "@/lib/dashboard/mock-data";
import { AreaChart } from "@/components/charts";
import { GREEN, fadeUp, KPICard } from "../components/DashboardShared";
import { Claim, Contribution } from "@/lib/dashboard/types";

export interface FinanceDashboardProps {
  theme: string;
}

type TabType = "dd" | "payouts" | "pool";

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function getNetSettlement(c: Claim): number {
  if (c.netSettlementAmount !== undefined) return c.netSettlementAmount;
  if (c.amountApproved !== undefined) return c.amountApproved;
  return c.amountClaimed;
}
function getGrossAssessed(c: Claim): number {
  return c.grossAssessedAmount ?? c.amountClaimed;
}
function getExcessDeducted(c: Claim): number {
  return c.excessDeducted ?? 300;
}

/* ─── Dual-Signoff Modal ────────────────────────────────────────────────── */
function DualSignoffModal({
  claim,
  net,
  isLight,
  onClose,
  onConfirm,
}: {
  claim: Claim;
  net: number;
  isLight: boolean;
  onClose: () => void;
  onConfirm: (ref: string) => void;
}) {
  const [authorizer, setAuthorizer] = useState<"ahmed" | "zayd">("ahmed");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setPinError(true);
      return;
    }
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
        <div
          className={`flex items-start justify-between pb-4 border-b ${
            isLight ? "border-gray-200" : "border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3
                className={`text-base font-bold ${
                  isLight ? "text-black/90" : "text-white"
                }`}
              >
                Dual-Signoff Required
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isLight ? "text-black/50" : "text-white/45"
                }`}
              >
                High-Value Settlement &gt;£10,000 — Executive Authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Claim summary */}
        <div
          className={`mt-4 p-4 rounded-xl border text-xs space-y-2 ${
            isLight
              ? "bg-gray-50 border-gray-200"
              : "bg-black/30 border-white/5"
          }`}
        >
          {[
            ["Claim ID", claim.id],
            ["Participant", claim.participantName],
            ["Peril", claim.type],
            ["Gross Assessed", `£${getGrossAssessed(claim).toLocaleString()}`],
            [
              "Excess Deducted",
              `−£${getExcessDeducted(claim).toLocaleString()}`,
            ],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className={isLight ? "text-black/50" : "text-white/45"}>
                {l}:
              </span>
              <span
                className={`font-semibold ${
                  l === "Excess Deducted" ? "text-red-400" : ""
                }`}
              >
                {v}
              </span>
            </div>
          ))}
          <div
            className={`flex justify-between pt-2 border-t text-sm font-bold ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}
          >
            <span>Net BACS Payout:</span>
            <span className="text-emerald-400">£{net.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>
            Per Shariah Board governance: single disbursements over £10,000
            require concurrent executive authorization before BACS transmission.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isLight ? "text-black/70" : "text-white/70"
              }`}
            >
              Second Executive Authorizer:
            </label>
            <select
              value={authorizer}
              onChange={(e) =>
                setAuthorizer(e.target.value as "ahmed" | "zayd")
              }
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                isLight
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-[#071510] border-white/10 text-white"
              }`}
            >
              <option value="ahmed">
                Ahmed Khan — Operations Director (Management)
              </option>
              <option value="zayd">
                Zayd Al-Mansoor — Executive Director (Super Admin)
              </option>
            </select>
          </div>
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isLight ? "text-black/70" : "text-white/70"
              }`}
            >
              Executive Authorization PIN:
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              placeholder="4-6 digit executive clearance PIN (e.g. 2026)"
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                pinError
                  ? "border-red-500 ring-1 ring-red-500"
                  : isLight
                  ? "border-gray-300"
                  : "border-white/10"
              } ${isLight ? "bg-white text-gray-900" : "bg-[#071510] text-white"}`}
            />
            {pinError && (
              <p className="text-[11px] text-red-400 mt-1">
                Please enter a valid 4-6 digit PIN.
              </p>
            )}
          </div>
          <div
            className={`flex gap-3 pt-3 border-t ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors border"
              style={{
                borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.1)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-[#0a1a14] cursor-pointer"
              style={{ background: GREEN }}
            >
              <FileCheck2 size={13} /> Dual-Authorize & Release BACS
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export function FinanceDashboard({ theme }: FinanceDashboardProps) {
  const isLight = theme === "light";
  const BORDER = isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)";
  const BG = isLight ? "#ffffff" : "#0d2117";
  const TEXT = isLight ? "text-black/85" : "text-white";
  const SUB = isLight ? "text-black/50" : "text-white/45";
  const MUTED = isLight ? "text-black/35" : "text-white/30";

  /* ── state ─────────────────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<TabType>("dd");
  const [failedList, setFailedList] = useState<Contribution[]>(() =>
    CONTRIBUTIONS.filter((c) => c.status === "Failed")
  );
  const [claimList, setClaimList] = useState(() => CLAIMS_AWAITING_PAYMENT);
  const [releasedIds, setReleasedIds] = useState<string[]>([]);
  const [retriedIds, setRetriedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingDual, setPendingDual] = useState<{
    claim: Claim;
    net: number;
  } | null>(null);

  // Filters & search
  const [ddSearch, setDdSearch] = useState("");
  const [payoutSearch, setPayoutSearch] = useState("");
  const [payoutFilter, setPayoutFilter] = useState<"all" | "dual" | "standard">("all");
  const [activeNoticeMenu, setActiveNoticeMenu] = useState<string | null>(null);
  const [shariahExpanded, setShariahExpanded] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  /* ── actions ────────────────────────────────────────────────────────────── */
  function handleRetry(id: string) {
    setRetriedIds((p) => [...p, id]);
    setFailedList((p) =>
      p.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Retried" as const,
              retryCount: (c.retryCount ?? 1) + 1,
            }
          : c
      )
    );
    showToast(
      `BACS Representation triggered — bank given 5 working days to clear funds`
    );
  }

  function handleBulkRetry() {
    const unretried = failedList.filter((c) => !retriedIds.includes(c.id));
    if (unretried.length === 0) return;
    const ids = unretried.map((c) => c.id);
    setRetriedIds((p) => [...p, ...ids]);
    setFailedList((p) =>
      p.map((c) =>
        ids.includes(c.id)
          ? {
              ...c,
              status: "Retried" as const,
              retryCount: (c.retryCount ?? 1) + 1,
            }
          : c
      )
    );
    showToast(`Bulk Representation sent for ${ids.length} Direct Debits`);
  }

  function handleRelease(c: Claim, net: number) {
    if (net > 10000) {
      setPendingDual({ claim: c, net });
      return;
    }
    const ref = `BACS-TK-2026-${c.id.split("-").pop()}`;
    setReleasedIds((p) => [...p, c.id]);
    showToast(`£${net.toLocaleString()} released. BACS Ref: ${ref}`);
  }

  function handleBulkReleaseStandard() {
    const standardClaims = pendingClaims.filter(
      (c) => (c.amountApproved ?? 0) <= 10000
    );
    if (standardClaims.length === 0) return;
    const ids = standardClaims.map((c) => c.id);
    const sum = standardClaims.reduce((s, c) => s + getNetSettlement(c), 0);
    setReleasedIds((p) => [...p, ...ids]);
    showToast(`Bulk released ${ids.length} standard claims (Total £${sum.toLocaleString()})`);
  }

  function handleDualConfirm(ref: string) {
    if (!pendingDual) return;
    setReleasedIds((p) => [...p, pendingDual.claim.id]);
    setPendingDual(null);
    showToast(
      `Dual-Authorized: £${pendingDual.net.toLocaleString()} released. Ref: ${ref}`
    );
  }

  function handleQuickReply(c: Contribution, msg: string) {
    setActiveNoticeMenu(null);
    showToast(`Grace notice dispatched to ${c.participantName}: "${msg.slice(0, 45)}…"`);
  }

  function handleExportCSV() {
    showToast("Treasury ledger CSV exported — ready for Shariah Supervisory Board");
  }

  /* ── derived ───────────────────────────────────────────────────────────── */
  const pendingClaims = claimList.filter((c) => !releasedIds.includes(c.id));
  const failedDD = failedList.filter((c) => !retriedIds.includes(c.id));
  const totalNet = pendingClaims.reduce((s, c) => s + getNetSettlement(c), 0);
  const collectionRate = Math.round(
    (CONTRIBUTIONS.filter((c) => c.status === "Collected").length /
      CONTRIBUTIONS.length) *
      100
  );

  const filteredDD = failedDD.filter((c) => {
    if (!ddSearch) return true;
    const q = ddSearch.toLowerCase();
    return (
      c.participantName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.certificateId.toLowerCase().includes(q)
    );
  });

  const filteredClaims = pendingClaims.filter((c) => {
    const net = getNetSettlement(c);
    const isDual = net > 10000;
    if (payoutFilter === "dual" && !isDual) return false;
    if (payoutFilter === "standard" && isDual) return false;
    if (!payoutSearch) return true;
    const q = payoutSearch.toLowerCase();
    return (
      c.participantName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    );
  });

  const highValueCount = pendingClaims.filter(
    (c) => (c.amountApproved ?? 0) > 10000
  ).length;

  const NOTICE_PRESETS = [
    "Grace Period Reminder: 14 days remaining to settle monthly contribution.",
    "BACS Representation Notification: We will re-present your Direct Debit in 3 days.",
    "Mandate Verification: Please verify bank details to prevent policy suspension.",
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-4 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-semibold text-xs max-w-md border border-white/20"
            style={{ background: GREEN }}
          >
            <Check size={15} className="shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dual-Signoff Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {pendingDual && (
          <DualSignoffModal
            claim={pendingDual.claim}
            net={pendingDual.net}
            isLight={isLight}
            onClose={() => setPendingDual(null)}
            onConfirm={handleDualConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className={`text-xl font-bold tracking-tight ${TEXT}`}>Finance Operations</h1>
          <p className={`text-xs mt-0.5 ${SUB}`}>
            Amira Siddiqui · Period: {POOL.periodLabel} · Real-time Operational Cockpit
          </p>
        </motion.div>

        {/* Global Shariah & Ledger quick link */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/transactions"
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isLight
                ? "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/80"
            }`}
          >
            <span>Ledger Cash Book</span>
            <ChevronRight size={13} className={MUTED} />
          </Link>
          <button
            onClick={handleExportCSV}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isLight
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <Download size={13} />
            <span>Audit CSV</span>
          </button>
        </div>
      </div>

      {/* ── ALERT BAR (Triage Strip) ─────────────────────────────────────────── */}
      {(failedDD.length > 0 || pendingClaims.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-sm ${
            isLight
              ? "bg-amber-50/80 border-amber-200/80"
              : "bg-amber-950/20 border-amber-500/30"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className={`text-xs font-medium ${isLight ? "text-amber-950" : "text-amber-200"}`}>
              <strong className="font-bold">Immediate attention required:</strong>{" "}
              {failedDD.length > 0 && `${failedDD.length} failed Direct Debit`}
              {failedDD.length > 0 && pendingClaims.length > 0 && " · "}
              {pendingClaims.length > 0 && `${pendingClaims.length} claims awaiting BACS disbursement`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {failedDD.length > 0 && (
              <button
                onClick={() => setActiveTab("dd")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "dd"
                    ? "bg-red-500 text-white shadow-sm"
                    : isLight
                    ? "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                    : "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                }`}
              >
                Resolve DD ({failedDD.length})
              </button>
            )}
            {pendingClaims.length > 0 && (
              <button
                onClick={() => setActiveTab("payouts")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "payouts"
                    ? "bg-emerald-500 text-[#0a1a14] shadow-sm"
                    : isLight
                    ? "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                }`}
              >
                Review Payouts (£{totalNet.toLocaleString()})
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ── KPI STRIP ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          label="Pool Balance"
          value={`£${POOL.balance.toLocaleString()}`}
          sub={POOL.periodLabel}
          icon={PieIcon}
          delay={0}
          theme={theme}
          trend={{ dir: "up", text: "+£19,150 vs Jun" }}
        />
        <KPICard
          label="Collection Rate"
          value={`${collectionRate}%`}
          sub={`${CONTRIBUTIONS.filter((c) => c.status === "Collected").length} of ${CONTRIBUTIONS.length} collected`}
          icon={TrendingUp}
          delay={1}
          theme={theme}
        />
        <KPICard
          label="Failed DDs"
          value={`${failedDD.length}`}
          sub={`£${failedDD.reduce((s, c) => s + c.amount, 0).toFixed(2)} in 14d grace`}
          icon={AlertTriangle}
          delay={2}
          theme={theme}
          color={failedDD.length > 0 ? "#ef4444" : undefined}
        />
        <KPICard
          label="Awaiting Release"
          value={`£${totalNet.toLocaleString()}`}
          sub={`${pendingClaims.length} claims (${highValueCount} dual-sign)`}
          icon={Banknote}
          delay={3}
          theme={theme}
          color={pendingClaims.length > 0 ? "#f59e0b" : undefined}
        />
      </div>

      {/* ── TAB NAVIGATION ─────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
          isLight ? "bg-gray-100/80 border-gray-200" : "bg-[#07160f] border-white/5"
        }`}
      >
        <button
          onClick={() => setActiveTab("dd")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "dd"
              ? isLight
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-[#0d2117] text-white shadow-sm border border-white/10"
              : isLight
              ? "text-gray-500 hover:text-gray-900"
              : "text-white/45 hover:text-white"
          }`}
        >
          <AlertTriangle
            size={14}
            className={failedDD.length > 0 ? "text-red-500" : MUTED}
          />
          <span>Direct Debits Recovery</span>
          {failedDD.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-red-500 text-white">
              {failedDD.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "payouts"
              ? isLight
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-[#0d2117] text-white shadow-sm border border-white/10"
              : isLight
              ? "text-gray-500 hover:text-gray-900"
              : "text-white/45 hover:text-white"
          }`}
        >
          <Banknote size={14} className={pendingClaims.length > 0 ? "text-emerald-400" : MUTED} />
          <span>Claims Payout Queue</span>
          {pendingClaims.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {pendingClaims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("pool")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "pool"
              ? isLight
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-[#0d2117] text-white shadow-sm border border-white/10"
              : isLight
              ? "text-gray-500 hover:text-gray-900"
              : "text-white/45 hover:text-white"
          }`}
        >
          <PieIcon size={14} className={isLight ? "text-gray-700" : "text-white/70"} />
          <span>Pool & Treasury Audit</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: DIRECT DEBITS RECOVERY (High density, scalable for 1000s)
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "dd" && (
        <motion.div
          key="tab-dd"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={13}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${MUTED}`}
              />
              <input
                type="text"
                placeholder="Search participant, ID, or cert..."
                value={ddSearch}
                onChange={(e) => setDdSearch(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#07160f] border-white/10 text-white placeholder:text-white/30"
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              {failedDD.length > 0 && (
                <button
                  onClick={handleBulkRetry}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-[#0a1a14] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw size={12} />
                  <span>Retry All ({failedDD.length})</span>
                </button>
              )}
              <Link
                href="/dashboard/contributions"
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isLight
                    ? "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/80"
                }`}
              >
                Full Mandates List →
              </Link>
            </div>
          </div>

          {/* List of Failed Direct Debits */}
          {filteredDD.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center ${
                isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={20} />
              </div>
              <h3 className={`text-sm font-bold ${TEXT}`}>No Failed Direct Debits Pending</h3>
              <p className={`text-xs mt-1 max-w-sm mx-auto ${SUB}`}>
                All participant contributions are up to date or have been re-presented for BACS processing.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
              }`}
            >
              <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {filteredDD.map((c) => {
                  const initials = c.participantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);
                  const isMenuOpen = activeNoticeMenu === c.id;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                        isLight ? "hover:bg-gray-50/80" : "hover:bg-white/[0.01]"
                      }`}
                    >
                      {/* Left: Participant info */}
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${TEXT}`}>
                              {c.participantName}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400">
                              Failed
                            </span>
                          </div>
                          <p className={`text-[11px] ${MUTED}`}>
                            {c.id} · Cert: {c.certificateId} · Due: {c.dueDate}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Amount & Grace Period Status */}
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-base font-extrabold text-red-400">
                            £{c.amount.toFixed(2)}
                          </p>
                          <span className={`text-[10px] ${MUTED}`}>
                            Retry {c.retryCount ?? 1} of 3
                          </span>
                        </div>

                        {/* Grace countdown indicator */}
                        <div className="hidden sm:block min-w-[150px]">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <Clock size={10} /> 11 days left
                            </span>
                            <span className={MUTED}>Day 15 → Hold</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-amber-500/20 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: "25%" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Operational Actions */}
                      <div className="flex items-center gap-2 relative">
                        {/* Action 1: Trigger BACS Retry */}
                        <button
                          onClick={() => handleRetry(c.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-[#0a1a14] transition-all flex items-center gap-1.5 shadow-sm"
                          title="Re-present to bank via UK BACS standard"
                        >
                          <RefreshCw size={12} />
                          <span>Retry BACS</span>
                        </button>

                        {/* Action 2: Quick Notice Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveNoticeMenu(isMenuOpen ? null : c.id)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                              isLight
                                ? "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                                : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                            }`}
                          >
                            <Mail size={12} />
                            <span>Grace Notice</span>
                            <ChevronDown size={11} className={MUTED} />
                          </button>

                          {/* Quick Message Dropdown Menu */}
                          {isMenuOpen && (
                            <div
                              className={`absolute right-0 top-full mt-1.5 w-72 rounded-2xl p-2 shadow-2xl border z-50 ${
                                isLight
                                  ? "bg-white border-gray-200 text-gray-800"
                                  : "bg-[#0c1f15] border-white/15 text-white"
                              }`}
                            >
                              <p className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${MUTED}`}>
                                Dispatched via SMS & Email:
                              </p>
                              <div className="space-y-1">
                                {NOTICE_PRESETS.map((msg, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleQuickReply(c, msg)}
                                    className={`w-full text-left text-[11px] p-2 rounded-xl transition-all ${
                                      isLight
                                        ? "hover:bg-emerald-50 hover:text-emerald-900"
                                        : "hover:bg-white/[0.06] hover:text-emerald-300"
                                    }`}
                                  >
                                    <div className="flex items-start gap-1.5">
                                      <Send size={11} className="mt-0.5 text-emerald-400 shrink-0" />
                                      <span>{msg}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Subtle link to reconcile */}
                        <Link
                          href="/dashboard/transactions"
                          className={`p-2 rounded-xl border transition-colors ${
                            isLight
                              ? "border-gray-200 hover:bg-gray-100 text-gray-500"
                              : "border-white/10 hover:bg-white/[0.05] text-white/40"
                          }`}
                          title="Manual card or bank reconciliation"
                        >
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: CLAIMS PAYOUT QUEUE (Scalable, filterable, dual-signoff)
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "payouts" && (
        <motion.div
          key="tab-payouts"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {(["all", "dual", "standard"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPayoutFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    payoutFilter === f
                      ? "bg-emerald-500 text-[#0a1a14] font-bold shadow-sm"
                      : isLight
                      ? "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      : "bg-white/[0.03] border border-white/10 text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  {f === "all"
                    ? `All (${pendingClaims.length})`
                    : f === "dual"
                    ? `Dual-Signoff >£10k (${highValueCount})`
                    : `Standard (≤£10k)`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={12}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${MUTED}`}
                />
                <input
                  type="text"
                  placeholder="Filter claim..."
                  value={payoutSearch}
                  onChange={(e) => setPayoutSearch(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:border-[#00c685] ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#07160f] border-white/10 text-white placeholder:text-white/30"
                  }`}
                />
              </div>

              {pendingClaims.some((c) => (c.amountApproved ?? 0) <= 10000) && (
                <button
                  onClick={handleBulkReleaseStandard}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
                  style={{ background: GREEN }}
                >
                  Release Standard Claims
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div
            className={`rounded-2xl border overflow-hidden ${
              isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr
                    className={
                      isLight
                        ? "text-gray-400 border-b border-gray-100 bg-gray-50/50"
                        : "text-white/30 border-b border-white/[0.04] bg-white/[0.01]"
                    }
                  >
                    <th className="px-4 py-3 text-left font-semibold">Participant & Claim</th>
                    <th className="px-4 py-3 text-left font-semibold">Peril</th>
                    <th className="px-4 py-3 text-left font-semibold">Net Payout</th>
                    <th className="px-4 py-3 text-left font-semibold">Governance Rule</th>
                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/[0.04]"}`}>
                  {filteredClaims.map((c) => {
                    const gross = getGrossAssessed(c);
                    const excess = getExcessDeducted(c);
                    const net = getNetSettlement(c);
                    const isHV = net > 10000;

                    return (
                      <tr
                        key={c.id}
                        className={`transition-colors ${
                          isLight ? "hover:bg-gray-50/70" : "hover:bg-white/[0.01]"
                        } ${isHV ? (isLight ? "bg-amber-50/30" : "bg-amber-950/10") : ""}`}
                      >
                        <td className="px-4 py-3.5">
                          <p className={`font-bold ${TEXT}`}>{c.participantName}</p>
                          <p className={`text-[10px] font-mono ${MUTED}`}>{c.id} · {c.daysOpen}d in queue</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            isLight ? "bg-gray-100 text-gray-700" : "bg-white/5 text-white/70"
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-extrabold text-sm text-emerald-400">
                            £{net.toLocaleString()}
                          </p>
                          <p className={`text-[10px] ${MUTED}`}>
                            (£{gross.toLocaleString()} − £{excess} excess)
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          {isHV ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                              <Lock size={10} /> Dual-Signoff (&gt;£10k)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                              <Check size={10} /> Single Finance Release
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleRelease(c, net)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              isHV
                                ? "bg-amber-500 hover:bg-amber-400 text-[#0a1a14]"
                                : "bg-[#00c685] hover:bg-[#00b076] text-white"
                            }`}
                          >
                            {isHV ? (
                              <>
                                <Lock size={11} />
                                <span>Sign & Release</span>
                              </>
                            ) : (
                              <>
                                <Banknote size={11} />
                                <span>Release £{net.toLocaleString()}</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredClaims.length === 0 && (
                    <tr>
                      <td colSpan={5} className={`px-4 py-8 text-center text-xs ${MUTED}`}>
                        No claims matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: POOL HEALTH & TREASURY AUDIT
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "pool" && (
        <motion.div
          key="tab-pool"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Reserve Ratio Health Card */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${MUTED}`}>
                  Solvency & Reserve Ratio
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-extrabold ${TEXT}`}>5.2x</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400">
                    Compliant (Min. 3.0x Required)
                  </span>
                </div>
              </div>
              <p className={`text-xs max-w-md ${SUB}`}>
                Pool reserves cover 5.2 times the trailing 12-month expected claims volume, maintaining full Shariah solvency.
              </p>
            </div>

            <div className="h-2 rounded-full bg-emerald-500/20 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: "65%" }}
              />
            </div>
          </div>

          {/* AAOIFI 70/15/15 Allocation Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Participant Risk Fund",
                pct: `${POOL.participantFundPct}%`,
                desc: "Direct claims settlement pool",
                color: GREEN,
              },
              {
                title: "Claims Reserve Buffer",
                pct: `${POOL.claimsReservePct}%`,
                desc: "IBNR & catastrophic reserve",
                color: "#f59e0b",
              },
              {
                title: "Wakāla Management Fee",
                pct: `${POOL.wakalaFeePct}%`,
                desc: "Operational administration",
                color: "#94a3b8",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-4 rounded-2xl border ${
                  isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${SUB}`}>{item.title}</span>
                  <span className="text-base font-extrabold" style={{ color: item.color }}>
                    {item.pct}
                  </span>
                </div>
                <p className={`text-[11px] ${MUTED}`}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Full Width Trend Chart */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${MUTED}`}>
                  Collection Trends 2026
                </p>
                <p className={`text-sm font-semibold mt-0.5 ${TEXT}`}>
                  Monthly Contribution Inflows vs BACS Returns
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                    : "border-white/10 hover:bg-white/[0.05] text-white/80"
                }`}
              >
                <Download size={12} />
                <span>Export Ledger CSV</span>
              </button>
            </div>
            <div className="h-56 w-full">
              <AreaChart
                data={CONTRIBUTION_TREND}
                xKey="month"
                theme={theme}
                height="100%"
                yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                series={[
                  {
                    dataKey: "collected",
                    name: "Collected",
                    color: GREEN,
                    fill: true,
                  },
                  {
                    dataKey: "failed",
                    name: "Failed",
                    color: "#ef4444",
                    fill: false,
                    borderDash: [4, 4],
                    borderWidth: 1.5,
                  },
                ]}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          COLLAPSIBLE SHARIAH RESPONSIBILITIES (Accordion, zero visual noise)
         ══════════════════════════════════════════════════════════════════════ */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isLight ? "bg-white border-gray-200" : "bg-[#0d2117] border-white/5"
        }`}
      >
        <button
          onClick={() => setShariahExpanded(!shariahExpanded)}
          className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
            isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-emerald-400" />
            <span className={`text-xs font-bold ${TEXT}`}>
              Shariah Governance & Annual Responsibilities
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
              £28,450 Surplus Available
            </span>
          </div>
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${MUTED} ${
              shariahExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {shariahExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 dark:border-white/[0.04] p-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Al-Fa'id */}
                <Link
                  href="/dashboard/pool"
                  className={`p-3.5 rounded-xl border transition-all ${
                    isLight
                      ? "border-gray-200 bg-gray-50/50 hover:bg-gray-100/70"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Gift size={13} className="text-emerald-400" />
                    <p className={`text-xs font-bold ${TEXT}`}>Al-Fa&apos;id Surplus</p>
                  </div>
                  <p className={`text-[11px] ${MUTED}`}>
                    Annual return of £28,450 to non-claiming participants via BACS rebate or charity.
                  </p>
                </Link>

                {/* Qard Hasan */}
                <Link
                  href="/dashboard/pool"
                  className={`p-3.5 rounded-xl border transition-all ${
                    isLight
                      ? "border-gray-200 bg-gray-50/50 hover:bg-gray-100/70"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldAlert size={13} className="text-blue-400" />
                    <p className={`text-xs font-bold ${TEXT}`}>Qard Hasan Facility</p>
                  </div>
                  <p className={`text-[11px] ${MUTED}`}>
                    Interest-free liquidity backstop to protect participants. Currently inactive (pool healthy).
                  </p>
                </Link>

                {/* Cash book */}
                <Link
                  href="/dashboard/transactions"
                  className={`p-3.5 rounded-xl border transition-all ${
                    isLight
                      ? "border-gray-200 bg-gray-50/50 hover:bg-gray-100/70"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileCheck2 size={13} className="text-amber-400" />
                    <p className={`text-xs font-bold ${TEXT}`}>Treasury Cash Book</p>
                  </div>
                  <p className={`text-[11px] ${MUTED}`}>
                    Full audit trail for Shariah supervisory committee reconciliation.
                  </p>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FinanceDashboard;
