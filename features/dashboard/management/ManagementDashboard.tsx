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

  return (
    <div className="p-4 sm:p-6 space-y-6">
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
        <div className="flex gap-2">
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

      {/* Takaful Pool Allocation Breakdown */}
      <div>
        <TakafulPoolBarChart theme={theme} />
      </div>
    </div>
  );
}

export default ManagementDashboard;
