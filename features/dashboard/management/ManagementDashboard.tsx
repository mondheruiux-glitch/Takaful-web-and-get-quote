"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  PieChart as PieIcon,
} from "lucide-react";
import {
  PARTICIPANT_GROWTH,
  CLAIMS_TREND,
  POOL,
  CLAIMS,
  CONTRIBUTIONS,
  POOL_HISTORY,
} from "@/lib/dashboard/mock-data";
import { AreaChart, DualAxisTrendChart, TakafulPoolBarChart } from "@/components/charts";
import {
  GREEN,
  fadeUp,
  KPICard,
  SectionCard,
} from "../components/DashboardShared";
import {
  DisciplinaryReport,
  getStoredReports,
  applyManagementPreAction,
  applyManagementFinalAction,
  REPORTS_SYNC_EVENT,
} from "@/lib/dashboard/management-reports";
import { Gavel, PauseCircle, Mail, Ban, CheckCheck, ShieldCheck } from "lucide-react";

export interface ManagementDashboardProps {
  theme: string;
}

export function ManagementDashboard({ theme }: ManagementDashboardProps) {
  const isLight = theme === "light";
  const totalParticipants = PARTICIPANT_GROWTH[PARTICIPANT_GROWTH.length - 1].participants;
  const prevParticipants = PARTICIPANT_GROWTH[PARTICIPANT_GROWTH.length - 2].participants;
  const participantGrowth = totalParticipants - prevParticipants;
  const claimsMTD = CLAIMS_TREND[CLAIMS_TREND.length - 1].count;
  const claimsPrev = CLAIMS_TREND[CLAIMS_TREND.length - 2].count;
  const claimsDelta = claimsMTD - claimsPrev;
  const collectionRate = 97.1;
  const overdueClaims = CLAIMS.filter(
    (c) => c.daysOpen > 10 && !["Paid", "Rejected"].includes(c.status)
  );
  const failedDDs = CONTRIBUTIONS.filter((c) => c.status === "Failed").length;

  const [reports, setReports] = React.useState<DisciplinaryReport[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<DisciplinaryReport | null>(null);
  const [actionNotes, setActionNotes] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    setReports(getStoredReports());
    const handleSync = (e: any) => {
      if (e.detail) setReports(e.detail);
      else setReports(getStoredReports());
    };
    window.addEventListener(REPORTS_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(REPORTS_SYNC_EVENT, handleSync);
  }, []);

  const pendingReports = reports.filter((r) => r.status === "Pending Management Review");

  const handlePreAction = (actionName: string) => {
    if (!selectedReport) return;
    applyManagementPreAction(
      selectedReport.id,
      actionName,
      actionNotes || `Executive pre-action: ${actionName}`,
      "Ahmed Khan (Operations Director)"
    );
    setToast(`Pre-Action "${actionName}" executed for ${selectedReport.participantName}.`);
    setSelectedReport(null);
    setActionNotes("");
    setTimeout(() => setToast(null), 3500);
  };

  const handleFinalAction = (action: "Suspend Account" | "Permanent Ban" | "Dismiss Referral") => {
    if (!selectedReport) return;
    applyManagementFinalAction(
      selectedReport.id,
      action,
      actionNotes || `Executive action: ${action}`,
      "Ahmed Khan (Operations Director)"
    );
    setToast(`Executive Action "${action}" applied for ${selectedReport.participantName}.`);
    setSelectedReport(null);
    setActionNotes("");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[800] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-semibold text-xs max-w-md bg-emerald-600 border border-emerald-400">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className={`text-xl font-bold ${isLight ? "text-black/90" : "text-white"}`}>
            Management Overview
          </h1>
          <p className={`text-sm mt-0.5 ${isLight ? "text-black/50" : "text-white/45"}`}>
            Ahmed Khan · Operations Director · {POOL.periodLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pendingReports.length > 0 && (
            <Link
              href="/dashboard/participants"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-500 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
            >
              <Gavel size={13} />
              {pendingReports.length} Disciplinary Referrals
            </Link>
          )}
          {overdueClaims.length > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
            >
              <AlertCircle size={13} />
              {overdueClaims.length} overdue claim{overdueClaims.length > 1 ? "s" : ""}
            </div>
          )}
          {failedDDs > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
            >
              <AlertTriangle size={13} />
              {failedDDs} failed DDs
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Participants"
          value={totalParticipants.toLocaleString()}
          sub={`+${participantGrowth} this month`}
          icon={Users}
          delay={0}
          theme={theme}
          trend={{ dir: "up", text: `+${participantGrowth} MoM` }}
        />
        <KPICard
          label="Pool Balance"
          value={`£${(POOL.balance / 1000).toFixed(0)}k`}
          sub="Participant fund"
          icon={PieIcon}
          delay={1}
          theme={theme}
          trend={{ dir: "up", text: "+£19,150 vs Jun" }}
        />
        <KPICard
          label="Claims (MTD)"
          value={`${claimsMTD}`}
          sub={`£${CLAIMS_TREND[CLAIMS_TREND.length - 1].value.toLocaleString()} total value`}
          icon={FileText}
          delay={2}
          theme={theme}
          color={claimsDelta > 0 ? "#f59e0b" : GREEN}
          trend={{
            dir: claimsDelta > 0 ? "up" : "down",
            text: `${Math.abs(claimsDelta)} vs last month`,
          }}
        />
        <KPICard
          label="Collection Rate"
          value={`${collectionRate}%`}
          sub="Direct Debit success"
          icon={TrendingUp}
          delay={3}
          theme={theme}
          trend={{ dir: "up", text: "+0.3% vs Jun" }}
        />
      </div>

      {/* Growth + Pool trend charts (Chart.js AreaChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Participant Growth (2026)"
          theme={theme}
          action={
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
              <span className={isLight ? "text-black/60 font-medium" : "text-white/60 font-medium"}>
                Participants
              </span>
            </div>
          }
        >
          <div className="p-4">
            <div className="h-52 w-full">
              <AreaChart
                data={PARTICIPANT_GROWTH}
                xKey="month"
                theme={theme}
                height="100%"
                series={[{ dataKey: "participants", name: "Participants", color: GREEN }]}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Pool Balance Trend (2026)"
          theme={theme}
          action={
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
              <span className={isLight ? "text-black/60 font-medium" : "text-white/60 font-medium"}>
                Pool Balance
              </span>
            </div>
          }
        >
          <div className="p-4">
            <div className="h-52 w-full">
              <AreaChart
                data={POOL_HISTORY}
                xKey="month"
                theme={theme}
                height="100%"
                yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                series={[{ dataKey: "balance", name: "Pool Balance", color: "#6366f1" }]}
              />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Claims performance + Operational alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard
            title="Claims Performance (2026)"
            theme={theme}
            action={
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                  <span className={isLight ? "text-black/60 font-medium" : "text-white/60 font-medium"}>
                    Claims Count
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className={isLight ? "text-black/60 font-medium" : "text-white/60 font-medium"}>
                    £ Value
                  </span>
                </div>
              </div>
            }
          >
            <div className="p-4">
              <div className="h-52 w-full">
                <DualAxisTrendChart
                  data={CLAIMS_TREND}
                  xKey="month"
                  theme={theme}
                  height="100%"
                  leftSeries={{
                    dataKey: "count",
                    name: "Claims Count",
                    color: "#3b82f6",
                    axis: "left",
                  }}
                  rightSeries={{
                    dataKey: "value",
                    name: "Claims Value (£)",
                    color: "#f59e0b",
                    axis: "right",
                    formatter: (v) => `£${(v / 1000).toFixed(0)}k`,
                  }}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Operational Alerts" theme={theme}>
          <div className="divide-y" style={{ borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.04)" }}>
            {overdueClaims.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/claims/${c.id}`}
                className={`flex items-start gap-3 p-4 transition-colors ${
                  isLight ? "hover:bg-black/[0.04]" : "hover:bg-white/[0.04]"
                }`}
              >
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${isLight ? "text-black/80" : "text-white/80"}`}>
                    {c.id}
                  </p>
                  <p className={`text-[11px] ${isLight ? "text-black/50" : "text-white/45"}`}>
                    {c.participantName} · {c.daysOpen}d open
                  </p>
                </div>
                <ChevronRight size={12} className={isLight ? "text-black/30" : "text-white/25"} />
              </Link>
            ))}
            {failedDDs > 0 && (
              <div className="flex items-start gap-3 p-4">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className={`text-xs font-semibold ${isLight ? "text-black/80" : "text-white/80"}`}>
                    {failedDDs} Failed Direct Debits
                  </p>
                  <p className={`text-[11px] ${isLight ? "text-black/50" : "text-white/45"}`}>
                    Require manual retry
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className={`text-xs font-semibold ${isLight ? "text-black/80" : "text-white/80"}`}>
                  All Shariah controls compliant
                </p>
                <p className={`text-[11px] ${isLight ? "text-black/50" : "text-white/45"}`}>
                  Last audit: 1 Jul 2026
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Disciplinary & Compliance Queue (From Claims & Finance) */}
      <SectionCard
        title="Disciplinary & Compliance Referrals (Claims & Finance)"
        theme={theme}
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
              {pendingReports.length} Pending Action
            </span>
            <Link
              href="/dashboard/participants"
              className="text-xs text-[#00c685] hover:underline font-semibold flex items-center gap-1"
            >
              Open Registry <ChevronRight size={12} />
            </Link>
          </div>
        }
      >
        <div className="p-4 space-y-3">
          {pendingReports.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              All member accounts in good standing — no pending disciplinary reports from Claims or Finance.
            </div>
          ) : (
            pendingReports.map((rep) => (
              <div
                key={rep.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isLight
                    ? "bg-white border-gray-200/90 hover:border-gray-300"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.source === "finance"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {rep.source === "finance" ? "Finance Team" : "Claims Specialist"}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">{rep.id}</span>
                    <span className="text-gray-300">·</span>
                    <span className={`text-xs font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {rep.participantName} ({rep.participantId})
                    </span>
                  </div>
                  <p className={`text-xs font-semibold ${isLight ? "text-gray-800" : "text-white/90"}`}>
                    {rep.category}
                  </p>
                  <p className={`text-[11px] ${isLight ? "text-gray-500" : "text-white/50"}`}>
                    {rep.notes}
                  </p>
                  <div className="text-[10px] text-gray-400 pt-1">
                    Submitted by {rep.reporterName} on {rep.createdAt}
                    {rep.auditReference && ` · Ref: ${rep.auditReference}`}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => setSelectedReport(rep)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Gavel size={13} />
                    Take Action
                  </button>
                  <Link
                    href={`/dashboard/participants`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isLight
                        ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                        : "border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    View File
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      {/* Management Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedReport(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div
            className={`relative z-10 w-full max-w-xl rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isLight ? "bg-white border-gray-200 text-gray-900" : "bg-[#0d2117] border-white/10 text-white"
            }`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white">
                  <Gavel size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Executive Disciplinary Action Console</h3>
                  <p className="text-xs text-gray-400">
                    Target: {selectedReport.participantName} ({selectedReport.participantId}) · Source: {selectedReport.reporterName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Report Details Card */}
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                selectedReport.source === "finance"
                  ? isLight
                    ? "bg-blue-50/70 border-blue-200 text-blue-950"
                    : "bg-blue-950/20 border-blue-500/20 text-blue-200"
                  : isLight
                  ? "bg-rose-50/70 border-rose-200 text-rose-950"
                  : "bg-rose-950/20 border-rose-500/20 text-rose-200"
              }`}
            >
              <div className="font-bold">{selectedReport.category}</div>
              <p className="opacity-80 leading-relaxed text-[11px]">{selectedReport.notes}</p>
              {selectedReport.auditReference && (
                <div className="text-[10px] font-mono opacity-70">
                  Audit Ref: {selectedReport.auditReference}
                </div>
              )}
            </div>

            {/* Notes input */}
            <div>
              <label className="font-semibold block text-xs mb-1">Executive Sanction Notes</label>
              <input
                type="text"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Reasoning, conditions, or grace period instructions..."
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isLight ? "bg-gray-50 border-gray-300" : "bg-white/5 border-white/10"
                }`}
              />
            </div>

            {/* Tier 1 Pre-actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Tier 1: Interim Pre-Actions (Before Ban/Suspend)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Due Process
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handlePreAction("Formal Warning Notice")}
                  className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Mail size={14} className="text-amber-600 shrink-0" />
                  <span>7-Day Warning Notice</span>
                </button>
                <button
                  onClick={() => handlePreAction("Freeze Claims Payouts")}
                  className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <PauseCircle size={14} className="text-amber-600 shrink-0" />
                  <span>Freeze Claims Payouts</span>
                </button>
                <button
                  onClick={() => handlePreAction("Pause Direct Debit")}
                  className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <PauseCircle size={14} className="text-amber-600 shrink-0" />
                  <span>Pause Direct Debit</span>
                </button>
                <button
                  onClick={() => handlePreAction("Forensic Audit")}
                  className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Gavel size={14} className="text-amber-600 shrink-0" />
                  <span>Sharia &amp; AML Audit</span>
                </button>
              </div>
            </div>

            {/* Tier 2 Final Sanctions */}
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-white/10">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Tier 2: Disciplinary Sanctions
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleFinalAction("Suspend Account")}
                  className="p-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-center cursor-pointer shadow-xs"
                >
                  Suspend Cover
                </button>
                <button
                  onClick={() => handleFinalAction("Permanent Ban")}
                  className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-center cursor-pointer shadow-xs"
                >
                  Permanent Ban
                </button>
                <button
                  onClick={() => handleFinalAction("Dismiss Referral")}
                  className="p-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-center cursor-pointer shadow-xs"
                >
                  Dismiss &amp; Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Takaful Pool Allocation Breakdown */}
      <div>
        <TakafulPoolBarChart theme={theme} />
      </div>
    </div>
  );
}

export default ManagementDashboard;

