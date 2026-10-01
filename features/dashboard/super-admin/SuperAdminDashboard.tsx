"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  ShieldCheck,
  ChevronRight,
  Shield,
  Banknote,
  AlertTriangle,
  UserCog,
  UserPlus,
  CheckCircle2,
  PieChart as PieIcon,
} from "lucide-react";
import { PARTICIPANTS, CLAIMS_TREND, CLAIMS, POOL } from "@/lib/dashboard/mock-data";
import { TakafulPoolBarChart } from "@/components/charts";
import {
  GREEN,
  fadeUp,
  KPICard,
  SectionCard,
} from "../components/DashboardShared";

export interface SuperAdminDashboardProps {
  theme: string;
}

export function SuperAdminDashboard({ theme }: SuperAdminDashboardProps) {
  const isLight = theme === "light";
  const totalParticipants = PARTICIPANTS.length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-xl font-bold ${isLight ? "text-black/90" : "text-white"}`}>
              Executive Command & Platform Oversight
            </h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}
            >
              Super Admin Active
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? "text-black/50" : "text-white/45"}`}>
            Zayd Al-Mansoor · Executive Director · Platform Master Control & Multi-Role Governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/staff"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-95 shadow-xs"
            style={{ background: GREEN }}
          >
            <UserPlus size={14} /> Provision Staff
          </Link>
        </div>
      </motion.div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Community"
          value={totalParticipants.toLocaleString()}
          sub="+14.2% MoM Expansion"
          icon={Users}
          delay={0}
          theme={theme}
          trend={{ dir: "up", text: "+38 new policies" }}
        />
        <KPICard
          label="Tabarru Pool Solvency"
          value={`£${(POOL.balance / 1000).toFixed(0)}k`}
          sub="3.4x Claims Reserve Ratio"
          icon={PieIcon}
          delay={1}
          theme={theme}
          trend={{ dir: "up", text: "100% Shariah Compliant" }}
        />
        <KPICard
          label="Team SLA Rate"
          value="96.8%"
          sub="Across Handlers & Finance"
          icon={Activity}
          delay={2}
          theme={theme}
          trend={{ dir: "up", text: "+1.4% vs benchmark" }}
        />
        <KPICard
          label="Loss Ratio"
          value="41.2%"
          sub="Target: <55.0%"
          icon={ShieldCheck}
          delay={3}
          theme={theme}
          color={GREEN}
          trend={{ dir: "up", text: "Optimal Surplus Health" }}
        />
      </div>

      {/* Staff Operations & Quick Clearance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Team Clearance & Operations"
          theme={theme}
          action={
            <Link
              href="/dashboard/staff"
              className="text-xs font-medium text-[#00c685] hover:underline flex items-center gap-1"
            >
              Manage All Staff <ChevronRight size={12} />
            </Link>
          }
          className="lg:col-span-2"
        >
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{
                  background: isLight ? "#f9fafb" : "rgba(255,255,255,0.02)",
                  borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/45 mb-1">
                  <span>Claims Specialists</span>
                  <Shield size={14} className="text-[#00c685]" />
                </div>
                <div className="text-xl font-bold text-black/90 dark:text-white">3 Handlers</div>
                <div className="text-[11px] text-[#00c685] mt-1 font-medium">
                  96.2% Avg SLA Resolution
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{
                  background: isLight ? "#f9fafb" : "rgba(255,255,255,0.02)",
                  borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/45 mb-1">
                  <span>Finance & Pool Officers</span>
                  <Banknote size={14} className="text-blue-400" />
                </div>
                <div className="text-xl font-bold text-black/90 dark:text-white">2 Officers</div>
                <div className="text-[11px] text-blue-400 mt-1 font-medium">
                  99.6% Payout Accuracy
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{
                  background: isLight ? "#f9fafb" : "rgba(255,255,255,0.02)",
                  borderColor: isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/45 mb-1">
                  <span>Fraud & Irregularities</span>
                  <AlertTriangle size={14} className="text-amber-400" />
                </div>
                <div className="text-xl font-bold text-black/90 dark:text-white">£59,500</div>
                <div className="text-[11px] text-amber-400 mt-1 font-medium">
                  Protected from leakage
                </div>
              </div>
            </div>

            <div
              className="p-3.5 rounded-xl border flex items-center justify-between text-xs"
              style={{
                background: `${GREEN}08`,
                borderColor: `${GREEN}25`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#00c685]/15 text-[#00c685]">
                  <UserCog size={15} />
                </div>
                <div>
                  <span className="font-semibold text-black/90 dark:text-white">
                    Need to expand the claims triage team?
                  </span>
                  <p className="text-[11px] text-black/50 dark:text-white/50">
                    Add junior/senior claim assessors with bespoke daily signoff limits.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/staff"
                className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white shrink-0 shadow-2xs hover:opacity-90 transition-opacity"
                style={{ background: GREEN }}
              >
                Add Handler
              </Link>
            </div>
          </div>
        </SectionCard>

        {/* Governance & Solvency Card */}
        <SectionCard title="Governance & Shariah Controls" theme={theme}>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#00c685] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-black/85 dark:text-white/85">
                  100% Non-Interest Segregation
                </p>
                <p className="text-[11px] text-black/50 dark:text-white/45">
                  Wakalah fee capped at 15.0%. Surplus distribution active.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#00c685] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-black/85 dark:text-white/85">
                  Dual-Signoff Security
                </p>
                <p className="text-[11px] text-black/50 dark:text-white/45">
                  Payouts &gt;£10,000 require Super Admin or Management concurrence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#00c685] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-black/85 dark:text-white/85">
                  Audit Trail Immutable
                </p>
                <p className="text-[11px] text-black/50 dark:text-white/45">
                  All disciplinary freezes and staff creations logged to transactions ledger.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Pool History & Bar Chart */}
      <div>
        <TakafulPoolBarChart theme={theme} />
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
