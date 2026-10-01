"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Check,
  ChevronRight,
  Copy,
  CheckCheck,
  ArrowUpRight,
  Home,
  MapPin,
  Activity,
  Clock,
  Wind,
  Flame,
  Droplets,
  Building2,
  TrendingUp,
  Users,
  Bell,
  Lock,
  FileText,
  MessageCircle,
  PhoneCall,
  HeartHandshake,
  HelpCircle,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { CLAIMS, POOL } from "@/lib/dashboard/mock-data";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  StatusBadge,
  CLAIM_TRACKER_STEPS,
  getClaimStepIndex,
} from "../components/DashboardShared";

export interface ParticipantDashboardProps {
  theme: string;
}

export function ParticipantDashboard({ theme }: ParticipantDashboardProps) {
  const isLight = theme === "light";
  const [copiedCert, setCopiedCert] = React.useState(false);
  const [weatherAlerts, setWeatherAlerts] = React.useState(true);
  const [autoRenew, setAutoRenew] = React.useState(true);

  /* ─ Colors: neutral-first, green only as accent ─ */
  const ACCENT = "#00c685";
  const BG_SURFACE = isLight ? "#FFFFFF" : "#141A17";
  const BORDER = isLight ? "#E8E8E5" : "rgba(255,255,255,0.06)";
  const TEXT_PRIMARY = isLight ? "#1A1A1A" : "#F5F5F4";
  const TEXT_SECONDARY = isLight ? "#6B6B67" : "#A3A3A0";
  const TEXT_MUTED = isLight ? "#9C9C97" : "#6B6B67";

  const myCert = {
    id: "TK-2024-0042",
    propertyAddress: "14 Elm Street, Birmingham, B1 2PQ",
    coverType: "Buildings",
    buildingsLimit: 350000,
    monthlyContribution: 38.5,
    renewalDate: "15 Jan 2027",
    startDate: "15 Jan 2024",
    status: "Active",
    compulsoryExcess: 300,
    voluntaryExcess: 0,
  };

  const myClaims = CLAIMS.filter((c) => c.participantId === "P-0042");
  const activeClaim = myClaims.find((c) => !["Paid", "Rejected"].includes(c.status));
  const pastClaims = myClaims.filter((c) => ["Paid", "Rejected"].includes(c.status));
  const activeStepIndex = activeClaim ? getClaimStepIndex(activeClaim.status) : 0;

  const handleCopyCert = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(myCert.id);
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-14 font-body">
      {/* ── 1. Editorial Welcome ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1
              className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]"
              style={{ color: TEXT_PRIMARY }}
            >
              Salaam, Fatima.
            </h1>
            <p
              className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: TEXT_SECONDARY }}
            >
              Your home is protected. Everything is in order.
            </p>
          </div>

          {/* Status pill */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border self-start sm:self-auto shrink-0 ${
              isLight
                ? "bg-emerald-50/60 border-emerald-200/80"
                : "bg-emerald-500/8 border-emerald-500/20"
            }`}
          >
            <ShieldCheck size={15} className="text-[#00c685]" />
            <span
              className={`text-xs font-semibold ${
                isLight ? "text-emerald-800" : "text-emerald-300"
              }`}
            >
              Active · Shariah Certified
            </span>
          </div>
        </div>

        {/* Contribution notification */}
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
            isLight
              ? "bg-gray-50/80 border-gray-200/80"
              : "bg-white/[0.02] border-white/[0.06]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isLight
                  ? "bg-emerald-100/80 text-emerald-600"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <Check size={14} strokeWidth={2.5} />
            </div>
            <p className="text-xs sm:text-sm" style={{ color: TEXT_SECONDARY }}>
              July contribution collected —{" "}
              <strong style={{ color: TEXT_PRIMARY }}>£38.50</strong>
            </p>
          </div>
          <Link
            href="/dashboard/contributions"
            className="text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: TEXT_MUTED }}
          >
            View <ChevronRight size={13} />
          </Link>
        </div>
      </motion.section>

      {/* ── 2. Policy Snapshot Card ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-300 group"
          style={{ background: BG_SURFACE, borderColor: BORDER }}
        >
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={70}
            inactiveZone={0.01}
            borderWidth={1}
          />

          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 pt-5 sm:pt-7 pb-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleCopyCert}
                className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                  isLight
                    ? "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white/70"
                }`}
                title="Copy Certificate ID"
              >
                <span>{myCert.id}</span>
                {copiedCert ? (
                  <CheckCheck size={12} className="text-[#00c685]" />
                ) : (
                  <Copy size={12} className="opacity-40" />
                )}
              </button>
            </div>
            <Link
              href="/dashboard/my-cover"
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: TEXT_MUTED }}
            >
              Full Schedule <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Card Body */}
          <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-5">
            {/* Property Title */}
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${ACCENT}12`, color: ACCENT }}
                >
                  <Home size={17} />
                </div>
                <h2
                  className="font-heading text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.1]"
                  style={{ color: TEXT_PRIMARY }}
                >
                  Buildings Protection
                </h2>
              </div>
              <p
                className="flex items-center gap-1.5 text-xs sm:text-sm mt-1.5 ml-[42px]"
                style={{ color: TEXT_SECONDARY }}
              >
                <MapPin size={13} className="text-[#00c685] shrink-0" />
                {myCert.propertyAddress}
              </p>
            </div>

            {/* Tabbed Card Section */}
            <Tabs defaultValue="overview" className="w-full">
              <div
                className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b"
                style={{
                  borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: TEXT_MUTED }}
                >
                  Policy Controls & Breakdown
                </p>
                <TabsList
                  className={`grid h-9 w-full grid-cols-3 rounded-lg sm:w-64 ${
                    isLight ? "bg-gray-100/80 text-gray-600" : "bg-white/[0.06] text-white/70"
                  }`}
                >
                  <TabsTrigger
                    value="overview"
                    className="truncate rounded-md px-1 text-[11px] font-semibold sm:text-xs data-[state=active]:bg-[#00c685] data-[state=active]:text-[#0d2117] data-[state=active]:shadow-sm transition-all"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="truncate rounded-md px-1 text-[11px] font-semibold sm:text-xs data-[state=active]:bg-[#00c685] data-[state=active]:text-[#0d2117] data-[state=active]:shadow-sm transition-all"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="truncate rounded-md px-1 text-[11px] font-semibold sm:text-xs data-[state=active]:bg-[#00c685] data-[state=active]:text-[#0d2117] data-[state=active]:shadow-sm transition-all"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3.5 ${
                    isLight ? "bg-gray-50/80 border-gray-200" : "bg-white/[0.03] border-white/[0.08]"
                  }`}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <Avatar className="size-9 shrink-0 rounded-lg after:rounded-lg after:border-none">
                      <AvatarFallback className="rounded-lg bg-[#00c685]/15 text-[#00c685]">
                        <Activity className="size-4.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: TEXT_PRIMARY }}>
                        Policy Active & Protected
                      </p>
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>
                        Verified Shariah-compliant mutual risk pool
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-[#00c685] bg-[#00c685]/10 text-[#00c685] font-semibold"
                  >
                    100% Shariah Compliant
                  </Badge>
                </div>

                {/* Renewal Timeline Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5" style={{ color: TEXT_MUTED }}>
                      <Clock size={12} className="text-[#00c685]" />
                      Renewal Timeline · {myCert.renewalDate}
                    </span>
                    <span className="font-bold" style={{ color: ACCENT }}>
                      145 days left (60%)
                    </span>
                  </div>
                  <Progress
                    value={60}
                    className={`w-full h-2 ${isLight ? "bg-gray-100" : "bg-white/10"}`}
                  />
                  <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
                    Direct Debit active · Auto-renews with verified Shariah certificate
                  </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3 sm:gap-3">
                  <Card
                    className={`mb-0 overflow-hidden shadow-none border ${
                      isLight
                        ? "bg-gray-50/50 border-gray-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>
                        Rebuild Limit
                      </p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                        <span className="text-xl font-bold" style={{ color: ACCENT }}>
                          £{myCert.buildingsLimit.toLocaleString()}
                        </span>
                        <span className="flex shrink-0 items-center text-[11px] font-medium text-emerald-500">
                          Guaranteed <ArrowUpRight className="size-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`mb-0 overflow-hidden shadow-none border ${
                      isLight
                        ? "bg-gray-50/50 border-gray-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>
                        Monthly Contribution
                      </p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                        <span className="text-xl font-bold" style={{ color: TEXT_PRIMARY }}>
                          £{myCert.monthlyContribution.toFixed(2)}
                        </span>
                        <span className="shrink-0 text-[11px] font-medium text-emerald-500">
                          Tabarru' Pool
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`mb-0 overflow-hidden shadow-none border ${
                      isLight
                        ? "bg-gray-50/50 border-gray-200"
                        : "bg-white/[0.02] border-white/[0.08]"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>
                        Compulsory Excess
                      </p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                        <span className="text-xl font-bold" style={{ color: TEXT_PRIMARY }}>
                          £{myCert.compulsoryExcess}
                        </span>
                        <span className="shrink-0 text-[11px] font-medium" style={{ color: TEXT_MUTED }}>
                          Per Claim
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Covered Perils Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: "Storm", icon: Wind },
                    { label: "Fire", icon: Flame },
                    { label: "Flood", icon: Droplets },
                    { label: "Subsidence", icon: Building2 },
                    { label: "Water Escape", icon: ShieldCheck },
                  ].map((risk) => {
                    const RiskIcon = risk.icon;
                    return (
                      <span
                        key={risk.label}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
                          isLight
                            ? "bg-gray-50 border-gray-200 text-gray-600"
                            : "bg-white/[0.03] border-white/[0.06] text-white/60"
                        }`}
                      >
                        <RiskIcon size={11} style={{ color: TEXT_MUTED }} />
                        {risk.label}
                      </span>
                    );
                  })}
                </div>
              </TabsContent>

              {/* ANALYTICS TAB */}
              <TabsContent value="analytics" className="mt-4 space-y-4">
                <Card
                  className={`overflow-hidden rounded-lg border shadow-none ${
                    isLight
                      ? "border-[#00c685]/30 bg-[#00c685]/5"
                      : "border-emerald-500/20 bg-emerald-500/5"
                  }`}
                >
                  <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar className="size-10 shrink-0 rounded-lg after:rounded-lg">
                        <AvatarFallback className="rounded-lg bg-[#00c685] text-[#0d2117] font-bold shadow-sm">
                          <TrendingUp className="size-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs" style={{ color: TEXT_MUTED }}>
                          Community Surplus Pool
                        </p>
                        <h3 className="text-xl font-black sm:text-2xl" style={{ color: TEXT_PRIMARY }}>
                          £{POOL.balance.toLocaleString()}
                        </h3>
                      </div>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <Badge className="shrink-0 bg-green-500/10 text-green-500 border-none font-semibold">
                        +{POOL.participantFundPct}%
                      </Badge>
                      <p className="mt-1 text-[11px]" style={{ color: TEXT_MUTED }}>
                        Participant fund ratio
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <ul
                  className="divide-y"
                  style={{
                    borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <li className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
                      <Users className="size-4" />
                      <span>Active Mutual Participants</span>
                    </div>
                    <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
                      1,248 members
                    </span>
                  </li>
                  <li className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
                      <CheckCircle2 className="size-4" />
                      <span>Claims Reserve Allocation</span>
                    </div>
                    <span className="font-semibold text-emerald-500">
                      {POOL.claimsReservePct}% Reserved
                    </span>
                  </li>
                  <li className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
                      <Activity className="size-4" />
                      <span>Wakala Management Fee</span>
                    </div>
                    <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
                      {POOL.wakalaFeePct}% (Shariah Compliant)
                    </span>
                  </li>
                </ul>
              </TabsContent>

              {/* SETTINGS TAB */}
              <TabsContent value="settings" className="mt-4 space-y-3">
                <Item
                  variant="outline"
                  className={`rounded-lg p-3.5 border ${
                    isLight ? "bg-gray-50/60 border-gray-200" : "bg-white/[0.02] border-white/[0.08]"
                  }`}
                >
                  <ItemMedia variant="icon">
                    <Bell className="size-4 text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                      Severe Weather & Claims Alerts
                    </ItemTitle>
                    <ItemDescription className="text-xs" style={{ color: TEXT_MUTED }}>
                      Receive SMS and push warnings for flood & storm in your postal area
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch checked={weatherAlerts} onCheckedChange={setWeatherAlerts} />
                  </ItemActions>
                </Item>

                <Item
                  variant="outline"
                  className={`rounded-lg p-3.5 border ${
                    isLight ? "bg-gray-50/60 border-gray-200" : "bg-white/[0.02] border-white/[0.08]"
                  }`}
                >
                  <ItemMedia variant="icon">
                    <Lock className="size-4 text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                      Direct Debit Auto-Renewal
                    </ItemTitle>
                    <ItemDescription className="text-xs" style={{ color: TEXT_MUTED }}>
                      Maintain uninterrupted Shariah certificate coverage annually
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                  </ItemActions>
                </Item>
              </TabsContent>
            </Tabs>
          </div>

          {/* Card Actions */}
          <div
            className="px-5 sm:px-7 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard/claims"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                style={{ background: "#1A1A1A" }}
              >
                <FileText size={15} />
                Make a Claim
              </Link>
              <Link
                href="/dashboard/support"
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.07]"
                }`}
              >
                <MessageCircle size={14} />
                Talk to Handler
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: TEXT_MUTED }}>
              <PhoneCall size={13} className="text-[#00c685]" />
              <span>
                Emergency: <strong style={{ color: TEXT_PRIMARY }}>0800 123 4567</strong>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 3. Active Claim Tracker ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3
            className="font-heading text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.1]"
            style={{ color: TEXT_PRIMARY }}
          >
            Claims
          </h3>
          <Link
            href="/dashboard/claims"
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: TEXT_MUTED }}
          >
            All ({myClaims.length}) <ChevronRight size={13} />
          </Link>
        </div>

        {activeClaim ? (
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: BG_SURFACE, borderColor: BORDER }}
          >
            {/* Claim Header */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 py-5 border-b"
              style={{ borderColor: BORDER }}
            >
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold" style={{ color: ACCENT }}>
                    {activeClaim.id}
                  </span>
                  <StatusBadge status={activeClaim.status} />
                </div>
                <h4 className="text-base sm:text-lg font-bold mt-1" style={{ color: TEXT_PRIMARY }}>
                  {activeClaim.type} Damage
                </h4>
                <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
                  Incident: {activeClaim.incidentDate} · {activeClaim.description}
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: TEXT_MUTED }}
                >
                  Claimed
                </p>
                <p className="text-xl font-bold" style={{ color: TEXT_PRIMARY }}>
                  £{activeClaim.amountClaimed.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Claim Timeline */}
            <div className="px-5 sm:px-7 py-6 sm:py-8">
              <div className="relative">
                <div
                  className="absolute left-[13px] top-3 bottom-3 w-px"
                  style={{ background: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)" }}
                />
                <div className="space-y-5">
                  {CLAIM_TRACKER_STEPS.map((step, idx) => {
                    const isDone = idx < activeStepIndex;
                    const isActive = idx === activeStepIndex;
                    const StepIcon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4 relative">
                        <div className="relative shrink-0 flex items-center justify-center z-10 w-7 h-7 mt-0.5">
                          {isDone ? (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                                isLight ? "bg-gray-900 text-white" : "bg-white text-black"
                              }`}
                            >
                              <Check size={13} strokeWidth={3} />
                            </div>
                          ) : isActive ? (
                            <div className="relative flex items-center justify-center">
                              <div
                                className={`absolute -inset-1 rounded-full animate-pulse ${
                                  isLight ? "bg-gray-900/10" : "bg-white/20"
                                }`}
                              />
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center relative z-10 shadow-sm ${
                                  isLight ? "bg-gray-900 text-white" : "bg-white text-black"
                                }`}
                              >
                                <Clock size={13} strokeWidth={2.5} />
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                                isLight
                                  ? "bg-black/[0.04] border-black/10 text-black/40"
                                  : "bg-white/10 border-white/15 text-white/50"
                              }`}
                            >
                              <StepIcon size={13} strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        <div className="pt-0.5 flex-1">
                          <p
                            className="text-sm font-semibold leading-tight"
                            style={{ color: isDone || isActive ? TEXT_PRIMARY : TEXT_MUTED }}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>
                            {step.desc}
                          </p>
                        </div>
                        {isActive && (
                          <span
                            className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5"
                            style={{ background: `${ACCENT}18`, color: ACCENT }}
                          >
                            In Progress
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="mt-5 pt-4 flex justify-end"
                style={{ borderTop: `1px solid ${BORDER}` }}
              >
                <Link
                  href={`/dashboard/claims/${activeClaim.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: ACCENT }}
                >
                  View Full Claim <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{ background: BG_SURFACE, borderColor: BORDER }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: `${ACCENT}10`, color: ACCENT }}
            >
              <ShieldCheck size={24} />
            </div>
            <h4
              className="font-heading text-2xl font-normal"
              style={{ color: TEXT_PRIMARY }}
            >
              No Active Claims
            </h4>
            <p
              className="text-xs sm:text-sm mt-1.5 max-w-md mx-auto"
              style={{ color: TEXT_SECONDARY }}
            >
              Your property is safe and protected. If you experience damage, our UK team is on
              standby 24/7.
            </p>
            <Link
              href="/dashboard/claims"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: "#1A1A1A" }}
            >
              <FileText size={13} /> Start a Claim
            </Link>
          </div>
        )}

        {/* Past Claims */}
        {pastClaims.length > 0 && (
          <div className="space-y-2">
            <p
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: TEXT_MUTED }}
            >
              Resolved
            </p>
            {pastClaims.map((claim) => (
              <Link
                key={claim.id}
                href={`/dashboard/claims/${claim.id}`}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all group"
                style={{ background: BG_SURFACE, borderColor: BORDER }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      claim.status === "Rejected"
                        ? "bg-red-50 text-red-400"
                        : isLight
                        ? "bg-gray-100 text-gray-500"
                        : "bg-white/[0.04] text-white/40"
                    }`}
                  >
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>
                        {claim.id} · {claim.type}
                      </span>
                      <StatusBadge status={claim.status} />
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>
                      {claim.lastActivityNote}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all"
                  style={{ color: TEXT_MUTED }}
                />
              </Link>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── 4. Community Pool ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-2xl border px-5 sm:px-7 py-6 sm:py-7"
          style={{ background: BG_SURFACE, borderColor: BORDER }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${ACCENT}10`, color: ACCENT }}
              >
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4
                  className="font-heading text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.1]"
                  style={{ color: TEXT_PRIMARY }}
                >
                  Your Takaful Community
                </h4>
                <p
                  className="text-xs sm:text-sm mt-2 leading-relaxed max-w-xl"
                  style={{ color: TEXT_SECONDARY }}
                >
                  Your £38.50 monthly contribution pools with{" "}
                  <strong style={{ color: TEXT_PRIMARY }}>2,847 UK households</strong> for mutual
                  protection. 100% surplus after claims is returned to members.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: TEXT_MUTED }}
                    >
                      Community Solvency
                    </p>
                    <p className="text-base font-bold" style={{ color: ACCENT }}>
                      98.4%
                    </p>
                  </div>
                  <div className={`w-px h-8 ${isLight ? "bg-gray-200" : "bg-white/[0.06]"}`} />
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: TEXT_MUTED }}
                    >
                      Members
                    </p>
                    <p className="text-base font-bold" style={{ color: TEXT_PRIMARY }}>
                      2,847
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/pool"
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all shrink-0 self-start md:self-center ${
                isLight
                  ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.07]"
              }`}
            >
              View Pool <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── 5. Quick Actions ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          {
            href: "/dashboard/documents",
            icon: FileText,
            label: "Policy Documents",
            desc: "Download schedule & terms",
            color: "#3B82F6",
          },
          {
            href: "/dashboard/support",
            icon: HelpCircle,
            label: "Support Desk",
            desc: "Open a query or call handler",
            color: "#F59E0B",
          },
          {
            href: "/dashboard/settings",
            icon: CreditCard,
            label: "Payment Details",
            desc: "Manage Direct Debit mandate",
            color: "#8B5CF6",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 px-4 py-4 rounded-2xl border transition-all group hover:-translate-y-0.5"
              style={{ background: BG_SURFACE, borderColor: BORDER }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: `${item.color}10`, color: item.color }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: TEXT_PRIMARY }}>
                  {item.label}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: TEXT_MUTED }}>
                  {item.desc}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all"
                style={{ color: TEXT_MUTED }}
              />
            </Link>
          );
        })}
      </motion.section>

      {/* ── Footer note ── */}
      <div className="text-center text-[11px] pb-4" style={{ color: TEXT_MUTED }}>
        24/7 Home Emergency Line: <strong style={{ color: TEXT_PRIMARY }}>0800 123 4567</strong> · Takaful
        UK © 2024
      </div>
    </div>
  );
}

export default ParticipantDashboard;
