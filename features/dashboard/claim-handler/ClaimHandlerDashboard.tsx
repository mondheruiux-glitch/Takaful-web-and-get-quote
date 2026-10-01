"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { CLAIMS, CLAIMS_TREND } from "@/lib/dashboard/mock-data";
import { Vo2MaxCard } from "@/components/ui/progress";
import { DualAxisTrendChart } from "@/components/charts";
import {
  GREEN,
  fadeUp,
  KPICard,
  SectionCard,
  StatusBadge,
} from "../components/DashboardShared";

export interface ClaimHandlerDashboardProps {
  theme: string;
}

export function ClaimHandlerDashboard({ theme }: ClaimHandlerDashboardProps) {
  const isLight = theme === "light";
  const myQueue = CLAIMS.filter(
    (c) => c.assignedHandlerId === "U-HAND-001" && !["Paid", "Rejected"].includes(c.status)
  );
  const awaitingDocs = CLAIMS.filter((c) => c.status === "Awaiting Information");
  const overdue = CLAIMS.filter((c) => c.daysOpen > 10 && !["Paid", "Rejected"].includes(c.status));
  const approvedMTD = CLAIMS.filter((c) => c.status === "Approved" || c.status === "Paid");

  const statusCounts = [
    "Submitted",
    "Under Review",
    "Awaiting Information",
    "Approved",
    "Paid",
  ].map((s) => ({
    name: s.replace("Awaiting Information", "Awaiting"),
    count: CLAIMS.filter((c) => c.status === s).length,
    color:
      s === "Submitted"
        ? "#3b82f6"
        : s === "Under Review"
        ? "#f59e0b"
        : s === "Awaiting Information"
        ? "#f97316"
        : s === "Approved"
        ? "#10b981"
        : "#00c685",
  }));

  const maxCount = Math.max(...statusCounts.map((s) => s.count));

  const priorityClaims = CLAIMS.filter((c) => !["Paid", "Rejected"].includes(c.status))
    .sort((a, b) => {
      const pOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (pOrder[a.priority] ?? 9) - (pOrder[b.priority] ?? 9) || b.daysOpen - a.daysOpen;
    })
    .slice(0, 6);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* ── Header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className={`text-xl font-bold ${isLight ? "text-black/90" : "text-white"}`}>
            Claims Handler Dashboard
          </h1>
          <p className={`text-sm mt-0.5 ${isLight ? "text-black/50" : "text-white/45"}`}>
            Omar Hassan ·{" "}
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {overdue.length > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
            >
              <AlertCircle size={12} /> {overdue.length} overdue claim{overdue.length > 1 ? "s" : ""}
            </div>
          )}
          {awaitingDocs.length > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
            >
              <Clock size={12} /> {awaitingDocs.length} awaiting docs
            </div>
          )}
          <Link
            href="/dashboard/queue"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: GREEN }}
          >
            <Activity size={14} /> My Queue
          </Link>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          label="My Queue"
          value={`${myQueue.length}`}
          sub="Active claims assigned"
          icon={Activity}
          delay={0}
          theme={theme}
        />
        <KPICard
          label="Awaiting Docs"
          value={`${awaitingDocs.length}`}
          sub="Pending evidence"
          icon={AlertCircle}
          delay={1}
          theme={theme}
          color="#f59e0b"
        />
        <KPICard
          label="Overdue (>10d)"
          value={`${overdue.length}`}
          sub="Breaching SLA"
          icon={Clock}
          delay={2}
          theme={theme}
          color="#ef4444"
        />
        <KPICard
          label="Approved MTD"
          value={`${approvedMTD.length}`}
          sub={`£${approvedMTD
            .reduce((s, c) => s + (c.amountApproved ?? 0), 0)
            .toLocaleString()} settled`}
          icon={CheckCircle2}
          delay={3}
          theme={theme}
          color="#10b981"
        />
      </div>

      {/* ── Main Content: Table (left) + Sidebar (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        {/* Priority Queue Table */}
        <div className="xl:col-span-2 flex flex-col h-full">
          <SectionCard
            title="Priority Claims — Action Required"
            theme={theme}
            className="h-full flex flex-col"
            action={
              <Link href="/dashboard/claims" className="text-xs font-medium text-[#00c685] flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            }
          >
            <div className="flex-1 flex flex-col justify-between overflow-x-auto min-h-0">
              <table className="w-full text-xs">
                <thead>
                  <tr
                    className={
                      isLight
                        ? "text-black/40 border-b border-black/[0.04]"
                        : "text-white/30 border-b border-white/[0.04]"
                    }
                  >
                    {["Claim ID", "Participant", "Type", "Days Open", "Priority", "Status", ""].map(
                      (h) => (
                        <th key={h} className="px-5 py-3.5 text-left font-semibold">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? "divide-black/04" : "divide-white/04"}`}>
                  {priorityClaims.map((c) => (
                    <tr
                      key={c.id}
                      className={`transition-colors ${
                        isLight ? "hover:bg-black/[0.03]" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-semibold text-[#00c685]">{c.id}</span>
                      </td>
                      <td className={`px-5 py-3.5 font-medium ${isLight ? "text-black/75" : "text-white/75"}`}>
                        {c.participantName}
                      </td>
                      <td className={`px-5 py-3.5 ${isLight ? "text-black/55" : "text-white/55"}`}>
                        {c.type}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-bold tabular-nums ${
                            c.daysOpen > 10
                              ? "text-red-400"
                              : c.daysOpen > 5
                              ? "text-amber-400"
                              : isLight
                              ? "text-black/70"
                              : "text-white/70"
                          }`}
                        >
                          {c.daysOpen}d
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={c.priority} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/dashboard/claims/${c.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ background: GREEN }}
                        >
                          Review <ArrowRight size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom footer pinned to fill full height */}
              <div
                className={`mt-auto px-5 py-3.5 flex items-center justify-between border-t text-xs ${
                  isLight
                    ? "border-black/[0.05] bg-black/[0.01]"
                    : "border-white/[0.04] bg-white/[0.01]"
                }`}
              >
                <span className={isLight ? "text-black/45 font-medium" : "text-white/40 font-medium"}>
                  Showing <span className="font-bold text-[#00c685]">{priorityClaims.length}</span>{" "}
                  actionable priority claims
                </span>
                <Link
                  href="/dashboard/queue"
                  className="font-semibold text-[#00c685] hover:underline inline-flex items-center gap-1"
                >
                  Manage queue <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right sidebar — Pipeline + Handling Time */}
        <div className="flex flex-col gap-4">
          <SectionCard title="Pipeline Overview" theme={theme}>
            <div className="p-4 space-y-3">
              {statusCounts.map(({ name, count, color }) => (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className={`text-xs font-medium ${isLight ? "text-black/70" : "text-white/65"}`}>
                        {name}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isLight ? "text-black/80" : "text-white/80"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <Vo2MaxCard
            title="My Avg. Handling Time"
            value={6.2}
            decimals={1}
            unit="d"
            status="On Target"
            progress={78}
            icon={<Clock size={20} />}
            theme={theme}
            description={
              <>
                SLA target: <span className="font-semibold text-[#00c685]">7.0 days</span>
                <br />
                <span className="font-medium text-emerald-500">0.8 days faster</span> than last month
              </>
            }
          />
        </div>
      </div>

      {/* ── Full-Width Claims Trend (Chart.js DualAxisTrendChart) ── */}
      <SectionCard
        title="Claims Volume & Value (2026)"
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
        <div className="p-5">
          <div className="h-56 w-full">
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
  );
}
export default ClaimHandlerDashboard;
