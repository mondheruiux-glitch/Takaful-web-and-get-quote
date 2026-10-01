"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  Banknote,
  PieChart as PieIcon,
  ChevronRight,
  XCircle,
  RefreshCw,
  Clock,
  Gift,
  Landmark,
  BadgePercent,
  Download,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  CONTRIBUTIONS,
  POOL,
  CLAIMS_AWAITING_PAYMENT,
  CONTRIBUTION_TREND,
} from "@/lib/dashboard/mock-data";
import { AreaChart, DonutChart, TakafulPoolBarChart } from "@/components/charts";
import {
  GREEN,
  fadeUp,
  KPICard,
  SectionCard,
} from "../components/DashboardShared";

export interface FinanceDashboardProps {
  theme: string;
}

/* ─── Scenario Centre Card ────────────────────────────────────────────────── */
function ScenarioCard({
  icon: Icon,
  title,
  desc,
  href,
  badge,
  color = GREEN,
  isLight,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  href: string;
  badge?: string;
  color?: string;
  isLight: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-3 p-4 rounded-2xl border transition-all hover:border-[#00c685]/40 ${
        isLight
          ? "bg-white border-black/[0.06] hover:bg-[#00c685]/[0.03]"
          : "bg-white/[0.02] border-white/[0.05] hover:bg-[#00c685]/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-2 rounded-xl"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        {badge && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${color}18`, color }}
          >
            {badge}
          </span>
        )}
      </div>
      <div>
        <p
          className={`text-xs font-bold ${
            isLight ? "text-black/85" : "text-white/90"
          } group-hover:text-[#00c685] transition-colors`}
        >
          {title}
        </p>
        <p
          className={`text-[10px] mt-0.5 leading-relaxed ${
            isLight ? "text-black/50" : "text-white/40"
          }`}
        >
          {desc}
        </p>
      </div>
      <ChevronRight
        size={12}
        className="ml-auto text-[#00c685] opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </Link>
  );
}

export function FinanceDashboard({ theme }: FinanceDashboardProps) {
  const isLight = theme === "light";
  const failedContribs = CONTRIBUTIONS.filter((c) => c.status === "Failed");
  const collectionRate = Math.round(
    (CONTRIBUTIONS.filter((c) => c.status === "Collected").length /
      CONTRIBUTIONS.length) *
      100
  );
  const awaitingPayment = CLAIMS_AWAITING_PAYMENT;
  const totalAwaitingPmt = awaitingPayment.reduce(
    (s, c) => s + (c.amountApproved ?? 0),
    0
  );
  const highValueClaims = awaitingPayment.filter(
    (c) => (c.amountApproved ?? 0) > 10000
  );

  const poolAllocationData = [
    { name: "Participant Fund", value: POOL.participantFundPct, color: GREEN },
    { name: "Claims Reserve", value: POOL.claimsReservePct, color: "#f59e0b" },
    { name: "Wakāla Fee", value: POOL.wakalaFeePct, color: "#94a3b8" },
  ];

  const scenarios = [
    {
      icon: RefreshCw,
      title: "Failed DD Recovery",
      desc: "BACS retry, 14-day grace period & reconciliation for bounced Direct Debits",
      href: "/dashboard/contributions",
      badge: `${failedContribs.length} active`,
      color: "#ef4444",
    },
    {
      icon: Lock,
      title: "High-Value Dual-Signoff",
      desc: "Claims >£10k require Management PIN — Ahmed Khan or Zayd Al-Mansoor",
      href: "/dashboard/claims-payments",
      badge: highValueClaims.length > 0 ? `${highValueClaims.length} pending` : undefined,
      color: "#f59e0b",
    },
    {
      icon: Gift,
      title: "Al-Fa'id Surplus Distribution",
      desc: "Year-end surplus distribution to non-claiming participants via cash, discount or charity",
      href: "/dashboard/pool",
      badge: "£28,450",
      color: GREEN,
    },
    {
      icon: Landmark,
      title: "Qard Hasan Protocol",
      desc: "Interest-free emergency loan if claims exceed pool — no member surcharges",
      href: "/dashboard/pool",
      color: "#3b82f6",
    },
    {
      icon: BadgePercent,
      title: "Pool Compliance Monitor",
      desc: "70/15/15 AAOIFI allocation · Reserve ratio · Shariah Board audit CSV",
      href: "/dashboard/pool",
      badge: "5.2x ratio",
      color: GREEN,
    },
    {
      icon: Download,
      title: "Treasury Daily Audit",
      desc: "Export ledger CSV · Reconcile all inflows/outflows · Shariah Board reporting",
      href: "/dashboard/transactions",
      badge: "1 failed",
      color: "#94a3b8",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1
          className={`text-xl font-bold ${
            isLight ? "text-black/90" : "text-white"
          }`}
        >
          Finance Overview
        </h1>
        <p
          className={`text-sm mt-0.5 ${
            isLight ? "text-black/50" : "text-white/45"
          }`}
        >
          Amira Siddiqui · Period: {POOL.periodLabel}
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          label="Failed Collections"
          value={`${failedContribs.length}`}
          sub={`£${failedContribs.reduce((s, c) => s + c.amount, 0).toFixed(2)} outstanding`}
          icon={AlertTriangle}
          delay={2}
          theme={theme}
          color="#ef4444"
        />
        <KPICard
          label="Awaiting Payment"
          value={`£${totalAwaitingPmt.toLocaleString()}`}
          sub={`${awaitingPayment.length} approved claims`}
          icon={Banknote}
          delay={3}
          theme={theme}
          color="#f59e0b"
        />
      </div>

      {/* Failed DD Alert Banner */}
      {failedContribs.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className={`rounded-2xl border p-4 flex items-start gap-3 ${
            isLight
              ? "bg-amber-50 border-amber-200"
              : "bg-amber-900/20 border-amber-500/30"
          }`}
        >
          <Clock
            size={15}
            className="text-amber-500 shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold ${
                isLight ? "text-amber-900" : "text-amber-300"
              }`}
            >
              Grace Period Active — {failedContribs.length} failed Direct Debit
              {failedContribs.length > 1 ? "s" : ""}
            </p>
            <p
              className={`text-[11px] mt-0.5 ${
                isLight ? "text-amber-700" : "text-amber-400"
              }`}
            >
              {failedContribs.map((c) => c.participantName).join(", ")} ·
              Coverage active for 14 days · Outstanding:{" "}
              <strong>
                £
                {failedContribs
                  .reduce((s, c) => s + c.amount, 0)
                  .toFixed(2)}
              </strong>
            </p>
          </div>
          <Link
            href="/dashboard/contributions"
            className="shrink-0 text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-0.5"
          >
            Manage <ChevronRight size={11} />
          </Link>
        </motion.div>
      )}

      {/* High-Value Dual Signoff Alert */}
      {highValueClaims.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className={`rounded-2xl border p-4 flex items-start gap-3 ${
            isLight
              ? "bg-orange-50 border-orange-200"
              : "bg-orange-900/20 border-orange-500/30"
          }`}
        >
          <Lock size={15} className="text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold ${
                isLight ? "text-orange-900" : "text-orange-300"
              }`}
            >
              {highValueClaims.length} High-Value Payout
              {highValueClaims.length > 1 ? "s" : ""} Require Dual-Signoff
            </p>
            <p
              className={`text-[11px] mt-0.5 ${
                isLight ? "text-orange-700" : "text-orange-400"
              }`}
            >
              Claims exceeding £10,000 — Management authorization required before
              BACS release. Involves Ahmed Khan / Zayd Al-Mansoor.
            </p>
          </div>
          <Link
            href="/dashboard/claims-payments"
            className="shrink-0 text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-0.5"
          >
            Review <ChevronRight size={11} />
          </Link>
        </motion.div>
      )}

      {/* Payments queue + contribution trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="xl:col-span-2 flex flex-col">
          <SectionCard
            title="Claims Awaiting Payment"
            theme={theme}
            className="flex flex-col flex-1 h-full"
            action={
              <Link
                href="/dashboard/claims-payments"
                className="text-xs font-medium text-[#00c685] flex items-center gap-1"
              >
                Manage all <ChevronRight size={12} />
              </Link>
            }
          >
            <div className="flex flex-col flex-1 justify-between">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      className={
                        isLight
                          ? "text-black/40 border-b border-black/[0.04]"
                          : "text-white/30 border-b border-white/[0.04]"
                      }
                    >
                      {[
                        "Claim",
                        "Participant",
                        "Type",
                        "Approved £",
                        "Days Waiting",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isLight
                        ? "divide-black/[0.04]"
                        : "divide-white/[0.04]"
                    }`}
                  >
                    {awaitingPayment.map((c) => {
                      const isHighValue = (c.amountApproved ?? 0) > 10000;
                      return (
                        <tr
                          key={c.id}
                          className={`transition-colors ${
                            isLight
                              ? "hover:bg-black/[0.04]"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          <td
                            className="px-4 py-3 font-mono font-semibold"
                            style={{ color: GREEN }}
                          >
                            {c.id}
                          </td>
                          <td
                            className={`px-4 py-3 font-medium ${
                              isLight ? "text-black/75" : "text-white/75"
                            }`}
                          >
                            {c.participantName}
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              isLight ? "text-black/55" : "text-white/55"
                            }`}
                          >
                            {c.type}
                          </td>
                          <td
                            className={`px-4 py-3 font-bold ${
                              isLight ? "text-black/80" : "text-white/80"
                            }`}
                          >
                            £{(c.amountApproved ?? 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-semibold text-amber-400">
                            {c.daysOpen}d
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isHighValue ? (
                              <Link
                                href="/dashboard/claims-payments"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-90 bg-amber-600"
                              >
                                <Lock size={9} /> Sign & Release
                              </Link>
                            ) : (
                              <Link
                                href="/dashboard/claims-payments"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ background: GREEN }}
                              >
                                Release <Banknote size={10} />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom footer */}
              <div
                className={`mt-auto px-5 py-3.5 flex items-center justify-between border-t text-xs ${
                  isLight
                    ? "border-black/[0.05] bg-black/[0.01]"
                    : "border-white/[0.04] bg-white/[0.01]"
                }`}
              >
                <span
                  className={
                    isLight
                      ? "text-black/45 font-medium"
                      : "text-white/40 font-medium"
                  }
                >
                  Total awaiting release:{" "}
                  <span className="font-bold text-[#00c685]">
                    £{totalAwaitingPmt.toLocaleString()}
                  </span>{" "}
                  ({awaitingPayment.length} claims)
                  {highValueClaims.length > 0 && (
                    <span className="ml-2 text-amber-400 font-bold">
                      · {highValueClaims.length} need dual-signoff
                    </span>
                  )}
                </span>
                <Link
                  href="/dashboard/claims-payments"
                  className="font-semibold text-[#00c685] hover:underline inline-flex items-center gap-1"
                >
                  Payment queue <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-4">
          <SectionCard
            title="Pool Allocation"
            theme={theme}
            className="flex flex-col flex-1 h-full"
          >
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div className="h-44 w-full relative flex items-center justify-center">
                <DonutChart
                  data={poolAllocationData}
                  theme={theme}
                  height="100%"
                  valueFormatter={(v) => `${v}%`}
                  centerText={{
                    primary: `${POOL.participantFundPct}%`,
                    secondary: "Fund",
                  }}
                />
              </div>
              <div
                className="grid grid-cols-3 gap-2 pt-3 border-t text-center text-[11px]"
                style={{
                  borderColor: isLight
                    ? "rgba(0,0,0,0.06)"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isLight ? "text-black/70" : "text-white/70"
                    }`}
                  >
                    {POOL.participantFundPct}%
                  </p>
                  <p
                    className={`text-[10px] ${
                      isLight ? "text-black/40" : "text-white/35"
                    }`}
                  >
                    Participant
                  </p>
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      isLight ? "text-black/70" : "text-white/70"
                    }`}
                  >
                    {POOL.claimsReservePct}%
                  </p>
                  <p
                    className={`text-[10px] ${
                      isLight ? "text-black/40" : "text-white/35"
                    }`}
                  >
                    Reserve
                  </p>
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      isLight ? "text-black/70" : "text-white/70"
                    }`}
                  >
                    {POOL.wakalaFeePct}%
                  </p>
                  <p
                    className={`text-[10px] ${
                      isLight ? "text-black/40" : "text-white/35"
                    }`}
                  >
                    Wakāla
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Failed Direct Debits"
            theme={theme}
            className="flex flex-col shrink-0"
            action={
              <Link
                href="/dashboard/contributions"
                className="text-xs font-medium text-[#00c685] flex items-center gap-1"
              >
                Manage <ChevronRight size={12} />
              </Link>
            }
          >
            <div
              className="divide-y"
              style={{
                borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.04)",
              }}
            >
              {failedContribs.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <XCircle size={14} className="text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        isLight ? "text-black/75" : "text-white/75"
                      }`}
                    >
                      {c.participantName}
                    </p>
                    <p
                      className={`text-[11px] ${
                        isLight ? "text-black/40" : "text-white/35"
                      }`}
                    >
                      Due {c.dueDate} · Retry {c.retryCount ?? 1}/3
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isLight ? "text-black/70" : "text-white/70"
                    }`}
                  >
                    £{c.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ─── Scenario Centre ─────────────────────────────────────────────── */}
      <SectionCard
        title="Finance Scenario Centre"
        theme={theme}
        action={
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
              isLight
                ? "bg-black/[0.05] text-black/50"
                : "bg-white/[0.06] text-white/40"
            }`}
          >
            6 workflows
          </span>
        }
      >
        <div className="p-4">
          <p
            className={`text-[11px] mb-4 ${
              isLight ? "text-black/45" : "text-white/40"
            }`}
          >
            All Finance responsibilities — click any scenario to open the relevant dashboard
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarios.map((s) => (
              <ScenarioCard key={s.title} {...s} isLight={isLight} />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Contribution trend chart */}
      <SectionCard
        title="Contribution Collection Trend (2026)"
        theme={theme}
        action={
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: GREEN }}
              />
              <span
                className={
                  isLight
                    ? "text-black/60 font-medium"
                    : "text-white/60 font-medium"
                }
              >
                Collected
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span
                className={
                  isLight
                    ? "text-black/60 font-medium"
                    : "text-white/60 font-medium"
                }
              >
                Failed
              </span>
            </div>
          </div>
        }
      >
        <div className="p-5">
          <div className="h-56 w-full">
            <AreaChart
              data={CONTRIBUTION_TREND}
              xKey="month"
              theme={theme}
              height="100%"
              yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              series={[
                { dataKey: "collected", name: "Collected", color: GREEN, fill: true },
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
      </SectionCard>

      {/* Takaful Pool Allocation Breakdown */}
      <div>
        <TakafulPoolBarChart theme={theme} />
      </div>
    </div>
  );
}

export default FinanceDashboard;
