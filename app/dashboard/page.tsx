'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CreditCard, FileText, Clock, ArrowRight,
  CheckCircle2, AlertCircle, TrendingUp, TrendingDown,
  Users, PieChart, Banknote, BarChart3, Activity,
  CircleDot, ChevronRight, Bell, RefreshCw, XCircle,
  Building2, Package, AlertTriangle, Flame, MessageSquare,
  HelpCircle, MessageCircle, UserCog, UserPlus, Shield,
  HeartHandshake, Check, Droplets, Wind, Sparkles, MapPin,
  PhoneCall, ArrowUpRight, Copy, CheckCheck, Home, Lock,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend,
} from 'recharts';
import Link from 'next/link';
import { useRole } from './ThemeRoleContext';
import { useTheme } from './ThemeRoleContext';
import { TakafulPoolBarChart } from '@/components/ui/takaful-pool-bar-chart';
import { Vo2MaxCard, Progress } from '@/components/ui/progress';
import { PillBadge } from '@/components/ui/pill-badge';
import { DashboardAlert } from '@/components/ui/dashboard-alert';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import Stepper03 from '@/components/ui/stepper-03';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  CLAIMS, CONTRIBUTIONS, POOL, PARTICIPANT_GROWTH,
  CLAIMS_TREND, CONTRIBUTION_TREND, POOL_HISTORY,
  PARTICIPANTS, CERTIFICATES, CLAIMS_AWAITING_PAYMENT,
  TRANSACTIONS,
} from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

/* ─── Shared tokens ──────────────────────────────────────────────────────── */
const GREEN = '#00c685';
const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, ease, delay: i * 0.04 } }),
};

/* ─── Shared sub-components ─────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, theme }: any) {
  if (!active || !payload?.length) return null;
  const isLight = theme === 'light';
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl"
      style={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', color: isLight ? '#000' : '#fff' }}>
      <p className={`${isLight ? 'text-black/50' : 'text-white/50'} mb-1.5 font-medium`}>{label}</p>
      {payload.map((p: any, i: number) => {
        const val = p?.value;
        const nameLower = (p?.name || '').toLowerCase();
        const isCount = nameLower.includes('count') || nameLower.includes('rate') || nameLower.includes('%') || nameLower.includes('participant') || nameLower.includes('ratio');
        const isCurrency = !isCount && (
          nameLower.includes('£') ||
          nameLower.includes('amount') ||
          nameLower.includes('value') ||
          nameLower.includes('contribution') ||
          nameLower.includes('balance') ||
          nameLower.includes('collected') ||
          nameLower.includes('failed') ||
          nameLower.includes('paid') ||
          nameLower.includes('surplus') ||
          nameLower.includes('fund')
        );
        const formatted = typeof val === 'number'
          ? (isCurrency ? `£${val.toLocaleString()}` : val.toLocaleString())
          : String(val ?? '—');
        return (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p?.color }} />
            <span className={isLight ? 'text-black/70' : 'text-white/70'}>{p?.name}:</span>
            <span className="font-semibold">{formatted}</span>
          </div>
        );
      })}
    </div>
  );
}

function KPICard({ label, value, sub, icon: Icon, trend, color = GREEN, custom, delay = 0, theme }: {
  label: string; value: string; sub?: string; icon?: React.ElementType;
  trend?: { dir: 'up' | 'down'; text: string }; color?: string; custom?: React.ReactNode;
  delay?: number; theme: string;
}) {
  const isLight = theme === 'light';
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={delay}
      className={`rounded-2xl p-5 flex flex-col gap-3 ${isLight ? 'shadow-sm' : ''}`}
      style={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid #E4E7EC' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/40' : 'text-white/35'}`}>{label}</p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>{value}</p>
          {sub && <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-gray-100 text-gray-700' : ''}`} style={!isLight ? { background: `${color}18`, color } : {}}>
            <Icon size={18} className={isLight ? 'text-gray-700' : ''} style={!isLight ? { color } : {}} />
          </div>
        )}
      </div>
      {custom}
      {trend && (
        <div className={`flex items-center gap-1.5 text-xs font-medium`}>
          {trend.dir === 'up'
            ? <TrendingUp size={13} className="text-[#00c685]" />
            : <TrendingDown size={13} className="text-red-400" />}
          <span className={trend.dir === 'up' ? 'text-[#00c685]' : 'text-red-400'}>{trend.text}</span>
        </div>
      )}
    </motion.div>
  );
}

function SectionCard({ title, children, action, theme, className }: { title: string; children: React.ReactNode; action?: React.ReactNode; theme: string; className?: string }) {
  const isLight = theme === 'light';
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible"
      className={`rounded-2xl overflow-hidden ${isLight ? 'shadow-sm' : ''} ${className ?? ''}`}
      style={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid #E4E7EC' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: isLight ? '1px solid #E4E7EC' : '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className={`text-sm font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

function SafeChartContainer({ children, height = 'h-52' }: { children: React.ReactNode; height?: string }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full ${height} flex items-center justify-center opacity-40`}>
        <div className="w-5 h-5 border-2 border-[#00c685] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`w-full ${height}`}>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Submitted':           'bg-blue-500/15 text-blue-500',
    'Under Review':        'bg-amber-500/15 text-amber-500',
    'Awaiting Information':'bg-orange-500/15 text-orange-500',
    'Approved':            'bg-green-500/15 text-green-500',
    'Rejected':            'bg-red-500/15 text-red-500',
    'Paid':                'bg-emerald-500/15 text-emerald-500',
    'Active':              'bg-green-500/15 text-green-500',
    'Expiring':            'bg-amber-500/15 text-amber-500',
    'Collected':           'bg-emerald-500/15 text-emerald-500',
    'Failed':              'bg-red-500/15 text-red-500',
    'Pending':             'bg-blue-500/15 text-blue-500',
    'Retried':             'bg-orange-500/15 text-orange-500',
    'Low':                 'bg-emerald-500/15 text-emerald-500',
    'Medium':              'bg-amber-500/15 text-amber-500',
    'High':                'bg-orange-500/15 text-orange-500',
    'Critical':            'bg-red-500/15 text-red-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-gray-500/15 text-gray-500'}`}>
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PARTICIPANT OVERVIEW (Consumer-Grade Experience)                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface TrackerStep {
  key: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const CLAIM_TRACKER_STEPS: TrackerStep[] = [
  { key: 'Submitted', label: 'Submitted', desc: '18 Jul · Received', icon: FileText },
  { key: 'Under Review', label: 'Under Review', desc: 'Assessor inspecting', icon: Clock },
  { key: 'Awaiting Information', label: 'Evidence', desc: 'Report pending', icon: AlertCircle },
  { key: 'Approved', label: 'Approved', desc: 'Settlement agreed', icon: ShieldCheck },
  { key: 'Paid', label: 'Disbursed', desc: 'Funds transferred', icon: Banknote },
];

function getClaimStepIndex(status: string): number {
  switch (status) {
    case 'Submitted': return 0;
    case 'Under Review': return 1;
    case 'Awaiting Information': return 2;
    case 'Approved': return 3;
    case 'Paid': return 4;
    default: return 1;
  }
}

function ParticipantOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const [copiedCert, setCopiedCert] = React.useState(false);
  const [weatherAlerts, setWeatherAlerts] = React.useState(true);
  const [autoRenew, setAutoRenew] = React.useState(true);

  /* ─ Colors: neutral-first, green only as accent ─ */
  const ACCENT = '#00c685';
  const BG_SURFACE = isLight ? '#FFFFFF' : '#141A17';
  const BORDER = isLight ? '#E8E8E5' : 'rgba(255,255,255,0.06)';
  const TEXT_PRIMARY = isLight ? '#1A1A1A' : '#F5F5F4';
  const TEXT_SECONDARY = isLight ? '#6B6B67' : '#A3A3A0';
  const TEXT_MUTED = isLight ? '#9C9C97' : '#6B6B67';

  const myCert = {
    id: 'TK-2024-0042',
    propertyAddress: '14 Elm Street, Birmingham, B1 2PQ',
    coverType: 'Buildings',
    buildingsLimit: 350000,
    monthlyContribution: 38.50,
    renewalDate: '15 Jan 2027',
    startDate: '15 Jan 2024',
    status: 'Active',
    compulsoryExcess: 300,
    voluntaryExcess: 0,
  };

  const myClaims = CLAIMS.filter(c => c.participantId === 'P-0042');
  const activeClaim = myClaims.find(c => !['Paid', 'Rejected'].includes(c.status));
  const pastClaims = myClaims.filter(c => ['Paid', 'Rejected'].includes(c.status));
  const activeStepIndex = activeClaim ? getClaimStepIndex(activeClaim.status) : 0;

  const handleCopyCert = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
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
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]" style={{ color: TEXT_PRIMARY }}>
              Salaam, Fatima.
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: TEXT_SECONDARY }}>
              Your home is protected. Everything is in order.
            </p>
          </div>

          {/* Status pill — compact, not a card */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border self-start sm:self-auto shrink-0 ${
            isLight ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-emerald-500/8 border-emerald-500/20'
          }`}>
            <ShieldCheck size={15} className="text-[#00c685]" />
            <span className={`text-xs font-semibold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Active · Shariah Certified
            </span>
          </div>
        </div>

        {/* Contribution notification — subtle */}
        <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
          isLight ? 'bg-gray-50/80 border-gray-200/80' : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isLight ? 'bg-emerald-100/80 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              <Check size={14} strokeWidth={2.5} />
            </div>
            <p className="text-xs sm:text-sm" style={{ color: TEXT_SECONDARY }}>
              July contribution collected — <strong style={{ color: TEXT_PRIMARY }}>£38.50</strong>
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
                    ? 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white/70'
                }`}
                title="Copy Certificate ID"
              >
                <span>{myCert.id}</span>
                {copiedCert ? <CheckCheck size={12} className="text-[#00c685]" /> : <Copy size={12} className="opacity-40" />}
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
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${ACCENT}12`, color: ACCENT }}>
                  <Home size={17} />
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.1]" style={{ color: TEXT_PRIMARY }}>
                  Buildings Protection
                </h2>
              </div>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm mt-1.5 ml-[42px]" style={{ color: TEXT_SECONDARY }}>
                <MapPin size={13} className="text-[#00c685] shrink-0" />
                {myCert.propertyAddress}
              </p>
            </div>

            {/* Tabbed Card Section */}
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
                  Policy Controls & Breakdown
                </p>
                <TabsList className={`grid h-9 w-full grid-cols-3 rounded-lg sm:w-64 ${isLight ? 'bg-gray-100/80 text-gray-600' : 'bg-white/[0.06] text-white/70'}`}>
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
                {/* System / Policy Status banner */}
                <div className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3.5 ${
                  isLight ? 'bg-gray-50/80 border-gray-200' : 'bg-white/[0.03] border-white/[0.08]'
                }`}>
                  <div className="flex flex-1 items-center gap-3">
                    <Avatar className="size-9 shrink-0 rounded-lg after:rounded-lg after:border-none">
                      <AvatarFallback className="rounded-lg bg-[#00c685]/15 text-[#00c685]">
                        <Activity className="size-4.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: TEXT_PRIMARY }}>Policy Active & Protected</p>
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
                    <span className="font-bold" style={{ color: ACCENT }}>145 days left (60%)</span>
                  </div>
                  <Progress
                    value={60}
                    className={`w-full h-2 ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}
                  />
                  <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
                    Direct Debit active · Auto-renews with verified Shariah certificate
                  </p>
                </div>

                {/* Metric Cards - Rebuild Limit, Monthly, Excess */}
                <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3 sm:gap-3">
                  <Card className={`mb-0 overflow-hidden shadow-none border ${isLight ? 'bg-gray-50/50 border-gray-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                    <CardContent className="p-3">
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>Rebuild Limit</p>
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

                  <Card className={`mb-0 overflow-hidden shadow-none border ${isLight ? 'bg-gray-50/50 border-gray-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                    <CardContent className="p-3">
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>Monthly Contribution</p>
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

                  <Card className={`mb-0 overflow-hidden shadow-none border ${isLight ? 'bg-gray-50/50 border-gray-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                    <CardContent className="p-3">
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>Compulsory Excess</p>
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
                    { label: 'Storm', icon: Wind },
                    { label: 'Fire', icon: Flame },
                    { label: 'Flood', icon: Droplets },
                    { label: 'Subsidence', icon: Building2 },
                    { label: 'Water Escape', icon: ShieldCheck },
                  ].map((risk) => {
                    const RiskIcon = risk.icon;
                    return (
                      <span
                        key={risk.label}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
                          isLight
                            ? 'bg-gray-50 border-gray-200 text-gray-600'
                            : 'bg-white/[0.03] border-white/[0.06] text-white/60'
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
                <Card className={`overflow-hidden rounded-lg border shadow-none ${
                  isLight ? 'border-[#00c685]/30 bg-[#00c685]/5' : 'border-emerald-500/20 bg-emerald-500/5'
                }`}>
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

                <ul className="divide-y" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                  <li className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
                      <Users className="size-4" />
                      <span>Active Mutual Participants</span>
                    </div>
                    <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>1,248 members</span>
                  </li>
                  <li className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
                      <CheckCircle2 className="size-4" />
                      <span>Claims Reserve Allocation</span>
                    </div>
                    <span className="font-semibold text-emerald-500">{POOL.claimsReservePct}% Reserved</span>
                  </li>
                  <li className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
                      <Activity className="size-4" />
                      <span>Wakala Management Fee</span>
                    </div>
                    <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>{POOL.wakalaFeePct}% (Shariah Compliant)</span>
                  </li>
                </ul>
              </TabsContent>

              {/* SETTINGS TAB */}
              <TabsContent value="settings" className="mt-4 space-y-3">
                <Item variant="outline" className={`rounded-lg p-3.5 border ${
                  isLight ? 'bg-gray-50/60 border-gray-200' : 'bg-white/[0.02] border-white/[0.08]'
                }`}>
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
                    <Switch
                      checked={weatherAlerts}
                      onCheckedChange={setWeatherAlerts}
                    />
                  </ItemActions>
                </Item>

                <Item variant="outline" className={`rounded-lg p-3.5 border ${
                  isLight ? 'bg-gray-50/60 border-gray-200' : 'bg-white/[0.02] border-white/[0.08]'
                }`}>
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
                    <Switch
                      checked={autoRenew}
                      onCheckedChange={setAutoRenew}
                    />
                  </ItemActions>
                </Item>
              </TabsContent>
            </Tabs>
          </div>

          {/* Card Actions */}
          <div className="px-5 sm:px-7 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard/claims"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                style={{ background: '#1A1A1A' }}
              >
                <FileText size={15} />
                Make a Claim
              </Link>
              <Link
                href="/dashboard/support"
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                  isLight
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.07]'
                }`}
              >
                <MessageCircle size={14} />
                Talk to Handler
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: TEXT_MUTED }}>
              <PhoneCall size={13} className="text-[#00c685]" />
              <span>Emergency: <strong style={{ color: TEXT_PRIMARY }}>0800 123 4567</strong></span>
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
          <h3 className="font-heading text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.1]" style={{ color: TEXT_PRIMARY }}>
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
          <div className="rounded-2xl border overflow-hidden" style={{ background: BG_SURFACE, borderColor: BORDER }}>
            {/* Claim Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 py-5 border-b" style={{ borderColor: BORDER }}>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold" style={{ color: ACCENT }}>{activeClaim.id}</span>
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
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>Claimed</p>
                <p className="text-xl font-bold" style={{ color: TEXT_PRIMARY }}>£{activeClaim.amountClaimed.toLocaleString()}</p>
              </div>
            </div>

            {/* Claim Timeline — full width, no handler card */}
            <div className="px-5 sm:px-7 py-6 sm:py-8">
              <div className="relative">
                {/* Vertical connector line */}
                <div
                  className="absolute left-[13px] top-3 bottom-3 w-px"
                  style={{ background: isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)' }}
                />
                <div className="space-y-5">
                  {CLAIM_TRACKER_STEPS.map((step, idx) => {
                    const isDone = idx < activeStepIndex;
                    const isActive = idx === activeStepIndex;
                    const StepIcon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4 relative">
                        {/* Stepper node matching uploaded screenshot */}
                        <div className="relative shrink-0 flex items-center justify-center z-10 w-7 h-7 mt-0.5">
                          {isDone ? (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                              isLight ? 'bg-gray-900 text-white' : 'bg-white text-black'
                            }`}>
                              <Check size={13} strokeWidth={3} />
                            </div>
                          ) : isActive ? (
                            <div className="relative flex items-center justify-center">
                              <div className={`absolute -inset-1 rounded-full animate-pulse ${
                                isLight ? 'bg-gray-900/10' : 'bg-white/20'
                              }`} />
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center relative z-10 shadow-sm ${
                                isLight ? 'bg-gray-900 text-white' : 'bg-white text-black'
                              }`}>
                                <Clock size={13} strokeWidth={2.5} />
                              </div>
                            </div>
                          ) : (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                              isLight
                                ? 'bg-black/[0.04] border-black/10 text-black/40'
                                : 'bg-white/10 border-white/15 text-white/50'
                            }`}>
                              <StepIcon size={13} strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        {/* Step label */}
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
                        {/* Active pill */}
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

              {/* View full claim link */}
              <div className="mt-5 pt-4 flex justify-end" style={{ borderTop: `1px solid ${BORDER}` }}>
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
          <div className="rounded-2xl border p-8 text-center" style={{ background: BG_SURFACE, borderColor: BORDER }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${ACCENT}10`, color: ACCENT }}>
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-heading text-2xl font-normal" style={{ color: TEXT_PRIMARY }}>No Active Claims</h4>
            <p className="text-xs sm:text-sm mt-1.5 max-w-md mx-auto" style={{ color: TEXT_SECONDARY }}>
              Your property is safe and protected. If you experience damage, our UK team is on standby 24/7.
            </p>
            <Link
              href="/dashboard/claims"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: '#1A1A1A' }}
            >
              <FileText size={13} /> Start a Claim
            </Link>
          </div>
        )}

        {/* Past Claims — Resolved */}
        {pastClaims.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    claim.status === 'Rejected' ? 'bg-red-50 text-red-400' : isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/[0.04] text-white/40'
                  }`}>
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>{claim.id} · {claim.type}</span>
                      <StatusBadge status={claim.status} />
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>{claim.lastActivityNote}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" style={{ color: TEXT_MUTED }} />
              </Link>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── 4. Community Pool — editorial callout ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl border px-5 sm:px-7 py-6 sm:py-7" style={{ background: BG_SURFACE, borderColor: BORDER }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${ACCENT}10`, color: ACCENT }}>
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4 className="font-heading text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.1]" style={{ color: TEXT_PRIMARY }}>
                  Your Takaful Community
                </h4>
                <p className="text-xs sm:text-sm mt-2 leading-relaxed max-w-xl" style={{ color: TEXT_SECONDARY }}>
                  Your £38.50 monthly contribution pools with <strong style={{ color: TEXT_PRIMARY }}>2,847 UK households</strong> for mutual protection. 100% surplus after claims is returned to members.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>Community Solvency</p>
                    <p className="text-base font-bold" style={{ color: ACCENT }}>98.4%</p>
                  </div>
                  <div className={`w-px h-8 ${isLight ? 'bg-gray-200' : 'bg-white/[0.06]'}`} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>Members</p>
                    <p className="text-base font-bold" style={{ color: TEXT_PRIMARY }}>2,847</p>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/pool"
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all shrink-0 self-start md:self-center ${
                isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.07]'
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
          { href: '/dashboard/documents', icon: FileText, label: 'Policy Documents', desc: 'Download schedule & terms', color: '#3B82F6' },
          { href: '/dashboard/support',   icon: HelpCircle, label: 'Support Desk', desc: 'Open a query or call handler', color: '#F59E0B' },
          { href: '/dashboard/settings',  icon: CreditCard, label: 'Payment Details', desc: 'Manage Direct Debit mandate', color: '#8B5CF6' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 px-4 py-4 rounded-2xl border transition-all group hover:-translate-y-0.5"
              style={{ background: BG_SURFACE, borderColor: BORDER }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: `${item.color}10`, color: item.color }}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: TEXT_PRIMARY }}>{item.label}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
              <ChevronRight size={14} className="opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" style={{ color: TEXT_MUTED }} />
            </Link>
          );
        })}
      </motion.section>

      {/* ── Footer note ── */}
      <div className="text-center text-[11px] pb-4" style={{ color: TEXT_MUTED }}>
        24/7 Home Emergency Line: <strong style={{ color: TEXT_PRIMARY }}>0800 123 4567</strong> · Takaful UK © 2024
      </div>

    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════ */
/* CLAIM HANDLER OVERVIEW                                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ClaimHandlerOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const myQueue = CLAIMS.filter(c => c.assignedHandlerId === 'U-HAND-001' && !['Paid', 'Rejected'].includes(c.status));
  const awaitingDocs = CLAIMS.filter(c => c.status === 'Awaiting Information');
  const overdue = CLAIMS.filter(c => c.daysOpen > 10 && !['Paid', 'Rejected'].includes(c.status));
  const approvedMTD = CLAIMS.filter(c => c.status === 'Approved' || c.status === 'Paid');

  const statusCounts = ['Submitted', 'Under Review', 'Awaiting Information', 'Approved', 'Paid'].map(s => ({
    name: s.replace('Awaiting Information', 'Awaiting'), count: CLAIMS.filter(c => c.status === s).length,
    color: s === 'Submitted' ? '#3b82f6' : s === 'Under Review' ? '#f59e0b' : s === 'Awaiting Information' ? '#f97316' : s === 'Approved' ? '#10b981' : '#00c685',
  }));

  const maxCount = Math.max(...statusCounts.map(s => s.count));

  const priorityClaims = CLAIMS
    .filter(c => !['Paid', 'Rejected'].includes(c.status))
    .sort((a, b) => {
      const pOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (pOrder[a.priority] ?? 9) - (pOrder[b.priority] ?? 9) || b.daysOpen - a.daysOpen;
    })
    .slice(0, 6);

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>
            Claims Handler Dashboard
          </h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>
            Omar Hassan · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {overdue.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <AlertCircle size={12} /> {overdue.length} overdue claim{overdue.length > 1 ? 's' : ''}
            </div>
          )}
          {awaitingDocs.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              <Clock size={12} /> {awaitingDocs.length} awaiting docs
            </div>
          )}
          <Link href="/dashboard/queue"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: GREEN }}>
            <Activity size={14} /> My Queue
          </Link>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="My Queue" value={`${myQueue.length}`} sub="Active claims assigned" icon={Activity} delay={0} theme={theme} />
        <KPICard label="Awaiting Docs" value={`${awaitingDocs.length}`} sub="Pending evidence" icon={AlertCircle} delay={1} theme={theme} color="#f59e0b" />
        <KPICard label="Overdue (>10d)" value={`${overdue.length}`} sub="Breaching SLA" icon={Clock} delay={2} theme={theme} color="#ef4444" />
        <KPICard label="Approved MTD" value={`${approvedMTD.length}`}
          sub={`£${approvedMTD.reduce((s, c) => s + (c.amountApproved ?? 0), 0).toLocaleString()} settled`}
          icon={CheckCircle2} delay={3} theme={theme} color="#10b981" />
      </div>

      {/* ── Main Content: Table (left) + Sidebar (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">

        {/* Priority Queue Table — spans 2 cols and fills full column height */}
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
                  <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/30 border-b border-white/[0.04]'}>
                    {['Claim ID', 'Participant', 'Type', 'Days Open', 'Priority', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-black/04' : 'divide-white/04'}`}>
                  {priorityClaims.map(c => (
                    <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.03]' : 'hover:bg-white/[0.03]'}`}>
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-semibold text-[#00c685]">{c.id}</span>
                      </td>
                      <td className={`px-5 py-3.5 font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>
                        {c.participantName}
                      </td>
                      <td className={`px-5 py-3.5 ${isLight ? 'text-black/55' : 'text-white/55'}`}>{c.type}</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-bold tabular-nums ${c.daysOpen > 10 ? 'text-red-400' : c.daysOpen > 5 ? 'text-amber-400' : isLight ? 'text-black/70' : 'text-white/70'}`}>
                          {c.daysOpen}d
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.priority} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/dashboard/claims/${c.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ background: GREEN }}>
                          Review <ArrowRight size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom footer pinned to fill full height */}
              <div className={`mt-auto px-5 py-3.5 flex items-center justify-between border-t text-xs ${isLight ? 'border-black/[0.05] bg-black/[0.01]' : 'border-white/[0.04] bg-white/[0.01]'}`}>
                <span className={isLight ? 'text-black/45 font-medium' : 'text-white/40 font-medium'}>
                  Showing <span className="font-bold text-[#00c685]">{priorityClaims.length}</span> actionable priority claims
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

          {/* Pipeline Overview */}
          <SectionCard title="Pipeline Overview" theme={theme}>
            <div className="p-4 space-y-3">
              {statusCounts.map(({ name, count, color }) => (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className={`text-xs font-medium ${isLight ? 'text-black/70' : 'text-white/65'}`}>{name}</span>
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${isLight ? 'text-black/80' : 'text-white/80'}`}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Avg Handling Time Card */}
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

      {/* ── Full-Width Claims Trend ── */}
      <SectionCard
        title="Claims Volume & Value (2026)"
        theme={theme}
        action={
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Claims Count</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>£ Value</span>
            </div>
          </div>
        }
      >
        <div className="p-5">
          <SafeChartContainer height="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CLAIMS_TREND}>
                <defs>
                  <linearGradient id="gclaimscount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gclaimsval" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                <Area yAxisId="left" type="monotone" dataKey="count" name="Claims Count" stroke="#3b82f6" fill="url(#gclaimscount)" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
                <Area yAxisId="right" type="monotone" dataKey="value" name="Claims Value (£)" stroke="#f59e0b" fill="url(#gclaimsval)" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          </SafeChartContainer>
        </div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* FINANCE OVERVIEW                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */
function FinanceOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const failedContribs = CONTRIBUTIONS.filter(c => c.status === 'Failed');
  const collectionRate = Math.round((CONTRIBUTIONS.filter(c => c.status === 'Collected').length / CONTRIBUTIONS.length) * 100);
  const awaitingPayment = CLAIMS_AWAITING_PAYMENT;
  const totalAwaitingPmt = awaitingPayment.reduce((s, c) => s + (c.amountApproved ?? 0), 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Finance Overview</h1>
        <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Amira Siddiqui · Period: {POOL.periodLabel}</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Pool Balance" value={`£${POOL.balance.toLocaleString()}`} sub={POOL.periodLabel} icon={PieChart} delay={0} theme={theme} trend={{ dir: 'up', text: '+£19,150 vs Jun' }} />
        <KPICard label="Collection Rate" value={`${collectionRate}%`} sub={`${CONTRIBUTIONS.filter(c => c.status === 'Collected').length} of ${CONTRIBUTIONS.length} collected`} icon={TrendingUp} delay={1} theme={theme} />
        <KPICard label="Failed Collections" value={`${failedContribs.length}`} sub={`£${failedContribs.reduce((s,c) => s+c.amount, 0).toFixed(2)} outstanding`} icon={AlertTriangle} delay={2} theme={theme} color="#ef4444" />
        <KPICard label="Awaiting Payment" value={`£${totalAwaitingPmt.toLocaleString()}`} sub={`${awaitingPayment.length} approved claims`} icon={Banknote} delay={3} theme={theme} color="#f59e0b" />
      </div>

      {/* Payments queue + contribution trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="xl:col-span-2 flex flex-col">
          <SectionCard
            title="Claims Awaiting Payment"
            theme={theme}
            className="flex flex-col flex-1 h-full"
            action={
              <Link href="/dashboard/claims-payments" className="text-xs font-medium text-[#00c685] flex items-center gap-1">
                Manage all <ChevronRight size={12} />
              </Link>
            }
          >
            <div className="flex flex-col flex-1 justify-between">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className={isLight ? 'text-black/40 border-b border-black/[0.04]' : 'text-white/30 border-b border-white/[0.04]'}>
                      {['Claim', 'Participant', 'Type', 'Approved £', 'Days Waiting', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-black/[0.04]' : 'divide-white/[0.04]'}`}>
                    {awaitingPayment.map(c => (
                      <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                        <td className="px-4 py-3 font-mono font-semibold" style={{ color: GREEN }}>{c.id}</td>
                        <td className={`px-4 py-3 font-medium ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.participantName}</td>
                        <td className={`px-4 py-3 ${isLight ? 'text-black/55' : 'text-white/55'}`}>{c.type}</td>
                        <td className={`px-4 py-3 font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>£{(c.amountApproved ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-amber-400">{c.daysOpen}d</td>
                        <td className="px-4 py-3 text-right">
                          <Link href="/dashboard/claims-payments" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: GREEN }}>
                            Release <Banknote size={10} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom footer pinned to fill full height */}
              <div className={`mt-auto px-5 py-3.5 flex items-center justify-between border-t text-xs ${isLight ? 'border-black/[0.05] bg-black/[0.01]' : 'border-white/[0.04] bg-white/[0.01]'}`}>
                <span className={isLight ? 'text-black/45 font-medium' : 'text-white/40 font-medium'}>
                  Total awaiting release: <span className="font-bold text-[#00c685]">£{totalAwaitingPmt.toLocaleString()}</span> ({awaitingPayment.length} claims)
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
          <SectionCard title="Pool Allocation" theme={theme} className="flex flex-col flex-1 h-full">
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div className="flex items-center justify-center py-2 flex-1">
                <RechartsPie width={180} height={150} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie data={[
                    { name: 'Participant Fund', value: POOL.participantFundPct },
                    { name: 'Claims Reserve', value: POOL.claimsReservePct },
                    { name: 'Wakāla Fee', value: POOL.wakalaFeePct },
                  ]} cx={85} cy={70} innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>
                    {[GREEN, '#f59e0b', '#94a3b8'].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)' }} />
                </RechartsPie>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center text-[11px]" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                <div>
                  <p className={`font-semibold ${isLight ? 'text-black/70' : 'text-white/70'}`}>{POOL.participantFundPct}%</p>
                  <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>Participant</p>
                </div>
                <div>
                  <p className={`font-semibold ${isLight ? 'text-black/70' : 'text-white/70'}`}>{POOL.claimsReservePct}%</p>
                  <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>Reserve</p>
                </div>
                <div>
                  <p className={`font-semibold ${isLight ? 'text-black/70' : 'text-white/70'}`}>{POOL.wakalaFeePct}%</p>
                  <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>Wakāla</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Failed Direct Debits" theme={theme} className="flex flex-col shrink-0">
            <div className="divide-y" style={{ borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.04)' }}>
              {failedContribs.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <XCircle size={14} className="text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isLight ? 'text-black/75' : 'text-white/75'}`}>{c.participantName}</p>
                    <p className={`text-[11px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>Due {c.dueDate}</p>
                  </div>
                  <span className={`text-xs font-bold ${isLight ? 'text-black/70' : 'text-white/70'}`}>£{c.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Contribution trend chart */}
      <SectionCard
        title="Contribution Collection Trend (2026)"
        theme={theme}
        action={
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Failed</span>
            </div>
          </div>
        }
      >
        <div className="p-5">
          <SafeChartContainer height="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONTRIBUTION_TREND}>
                <defs>
                  <linearGradient id="gcollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                <Area type="monotone" dataKey="collected" name="Collected" stroke={GREEN} fill="url(#gcollected)" strokeWidth={2.5} dot={{ r: 3, fill: GREEN }} />
                <Area type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" fill="none" strokeWidth={1.5} dot={{ r: 3, fill: '#ef4444' }} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </SafeChartContainer>
        </div>
      </SectionCard>

      {/* Takaful Pool Allocation Breakdown */}
      <div>
        <TakafulPoolBarChart theme={theme} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MANAGEMENT OVERVIEW                                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ManagementOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const totalParticipants = PARTICIPANT_GROWTH[PARTICIPANT_GROWTH.length - 1].participants;
  const prevParticipants = PARTICIPANT_GROWTH[PARTICIPANT_GROWTH.length - 2].participants;
  const participantGrowth = totalParticipants - prevParticipants;
  const claimsMTD = CLAIMS_TREND[CLAIMS_TREND.length - 1].count;
  const claimsPrev = CLAIMS_TREND[CLAIMS_TREND.length - 2].count;
  const claimsDelta = claimsMTD - claimsPrev;
  const collectionRate = 97.1;
  const overdueClaims = CLAIMS.filter(c => c.daysOpen > 10 && !['Paid','Rejected'].includes(c.status));
  const failedDDs = CONTRIBUTIONS.filter(c => c.status === 'Failed').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Management Overview</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Ahmed Khan · Operations Director · {POOL.periodLabel}</p>
        </div>
        <div className="flex gap-2">
          {overdueClaims.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <AlertCircle size={13} />
              {overdueClaims.length} overdue claim{overdueClaims.length > 1 ? 's' : ''}
            </div>
          )}
          {failedDDs > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              <AlertTriangle size={13} />
              {failedDDs} failed DDs
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active Participants" value={totalParticipants.toLocaleString()} sub={`+${participantGrowth} this month`} icon={Users} delay={0} theme={theme} trend={{ dir: 'up', text: `+${participantGrowth} MoM` }} />
        <KPICard label="Pool Balance" value={`£${(POOL.balance / 1000).toFixed(0)}k`} sub="Participant fund" icon={PieChart} delay={1} theme={theme} trend={{ dir: 'up', text: '+£19,150 vs Jun' }} />
        <KPICard label="Claims (MTD)" value={`${claimsMTD}`} sub={`£${CLAIMS_TREND[CLAIMS_TREND.length - 1].value.toLocaleString()} total value`} icon={FileText} delay={2} theme={theme} color={claimsDelta > 0 ? '#f59e0b' : GREEN} trend={{ dir: claimsDelta > 0 ? 'up' : 'down', text: `${Math.abs(claimsDelta)} vs last month` }} />
        <KPICard label="Collection Rate" value={`${collectionRate}%`} sub="Direct Debit success" icon={TrendingUp} delay={3} theme={theme} trend={{ dir: 'up', text: '+0.3% vs Jun' }} />
      </div>

      {/* Growth + Pool trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Participant Growth (2026)"
          theme={theme}
          action={
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Participants</span>
            </div>
          }
        >
          <div className="p-4">
            <SafeChartContainer height="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PARTICIPANT_GROWTH}>
                  <defs>
                    <linearGradient id="gpart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 20']} />
                  <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                  <Area type="monotone" dataKey="participants" name="Participants" stroke={GREEN} fill="url(#gpart)" strokeWidth={2.5} dot={{ r: 3, fill: GREEN }} />
                </AreaChart>
              </ResponsiveContainer>
            </SafeChartContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Pool Balance Trend (2026)"
          theme={theme}
          action={
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
              <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Pool Balance</span>
            </div>
          }
        >
          <div className="p-4">
            <SafeChartContainer height="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={POOL_HISTORY}>
                  <defs>
                    <linearGradient id="gpool" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                  <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                  <Area type="monotone" dataKey="balance" name="Pool Balance" stroke="#6366f1" fill="url(#gpool)" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </SafeChartContainer>
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
                  <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Claims Count</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>£ Value</span>
                </div>
              </div>
            }
          >
            <div className="p-4">
              <SafeChartContainer height="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CLAIMS_TREND}>
                    <defs>
                      <linearGradient id="gclaimsperf_count" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gclaimsperf_val" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="l" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                    <RechartsTooltip content={<ChartTooltip theme={theme} />} />
                    <Area yAxisId="l" type="monotone" dataKey="count" name="Claims Count" stroke="#3b82f6" fill="url(#gclaimsperf_count)" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
                    <Area yAxisId="r" type="monotone" dataKey="value" name="Claims Value (£)" stroke="#f59e0b" fill="url(#gclaimsperf_val)" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </SafeChartContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Operational Alerts" theme={theme}>
          <div className="divide-y" style={{ borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.04)' }}>
            {overdueClaims.map(c => (
              <Link key={c.id} href={`/dashboard/claims/${c.id}`} className={`flex items-start gap-3 p-4 transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{c.id}</p>
                  <p className={`text-[11px] ${isLight ? 'text-black/50' : 'text-white/45'}`}>{c.participantName} · {c.daysOpen}d open</p>
                </div>
                <ChevronRight size={12} className={isLight ? 'text-black/30' : 'text-white/25'} />
              </Link>
            ))}
            {failedDDs > 0 && (
              <div className="flex items-start gap-3 p-4">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{failedDDs} Failed Direct Debits</p>
                  <p className={`text-[11px] ${isLight ? 'text-black/50' : 'text-white/45'}`}>Require manual retry</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className={`text-xs font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>All Shariah controls compliant</p>
                <p className={`text-[11px] ${isLight ? 'text-black/50' : 'text-white/45'}`}>Last audit: 1 Jul 2026</p>
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

/* ═══════════════════════════════════════════════════════════════════════════ */
/* SUPER ADMIN OVERVIEW                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */
function SuperAdminOverview({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const totalParticipants = PARTICIPANTS.length;
  const claimsMTD = CLAIMS_TREND[CLAIMS_TREND.length - 1].count;
  const overdueClaims = CLAIMS.filter(c => c.daysOpen > 10 && !['Paid', 'Rejected'].includes(c.status));

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
            <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>
              Executive Command & Platform Oversight
            </h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}
            >
              Super Admin Active
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-black/50' : 'text-white/45'}`}>
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
          trend={{ dir: 'up', text: '+38 new policies' }}
        />
        <KPICard
          label="Tabarru Pool Solvency"
          value={`£${(POOL.balance / 1000).toFixed(0)}k`}
          sub="3.4x Claims Reserve Ratio"
          icon={PieChart}
          delay={1}
          theme={theme}
          trend={{ dir: 'up', text: '100% Shariah Compliant' }}
        />
        <KPICard
          label="Team SLA Rate"
          value="96.8%"
          sub="Across Handlers & Finance"
          icon={Activity}
          delay={2}
          theme={theme}
          trend={{ dir: 'up', text: '+1.4% vs benchmark' }}
        />
        <KPICard
          label="Loss Ratio"
          value="41.2%"
          sub="Target: <55.0%"
          icon={ShieldCheck}
          delay={3}
          theme={theme}
          color={GREEN}
          trend={{ dir: 'up', text: 'Optimal Surplus Health' }}
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
                  background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
                  borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/45 mb-1">
                  <span>Claims Specialists</span>
                  <Shield size={14} className="text-[#00c685]" />
                </div>
                <div className="text-xl font-bold text-black/90 dark:text-white">3 Handlers</div>
                <div className="text-[11px] text-[#00c685] mt-1 font-medium">96.2% Avg SLA Resolution</div>
              </div>

              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{
                  background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
                  borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/45 mb-1">
                  <span>Finance & Pool Officers</span>
                  <Banknote size={14} className="text-blue-400" />
                </div>
                <div className="text-xl font-bold text-black/90 dark:text-white">2 Officers</div>
                <div className="text-[11px] text-blue-400 mt-1 font-medium">99.6% Payout Accuracy</div>
              </div>

              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{
                  background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
                  borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/45 mb-1">
                  <span>Fraud & Irregularities</span>
                  <AlertTriangle size={14} className="text-amber-400" />
                </div>
                <div className="text-xl font-bold text-black/90 dark:text-white">£59,500</div>
                <div className="text-[11px] text-amber-400 mt-1 font-medium">Protected from leakage</div>
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

/* ─── Missing icon import fix ─── */
const ClipboardList = Activity;

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ROOT PAGE — ROLE ROUTER                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { role } = useRole();
  const { theme } = useTheme();

  switch (role) {
    case 'claim_handler': return <ClaimHandlerOverview theme={theme} />;
    case 'finance':       return <FinanceOverview theme={theme} />;
    case 'management':    return <ManagementOverview theme={theme} />;
    case 'super_admin':   return <SuperAdminOverview theme={theme} />;
    default:              return <SuperAdminOverview theme={theme} />;
  }
}
