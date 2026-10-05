'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  ArrowLeftRight,
  Download,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  UserCheck,
  DollarSign,
  Activity as ActivityIcon,
  Bell,
  Home,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { getParticipantProfile, ParticipantSummary } from '@/lib/dashboard/participant-utils';
import { ActionButton } from '@/components/ui/ds/ActionButton';
import { StatusBadge, VerifiedBadge } from '@/components/ui/ds/StatusBadge';
import {
  reconcileTransaction,
  SYNC_EVENT_NAME,
} from '@/lib/dashboard/reconciliation-sync';

const GREEN = '#00c685';

export default function ParticipantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';

  const participantId = (params?.id as string) || 'P-0098';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'contributions' | 'claims' | 'certificate' | 'payments' | 'documents' | 'activity'
  >('overview');

  const [data, setData] = useState<ParticipantSummary | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load and refresh participant data (responsive to reconciliation events)
  const refreshData = () => {
    const profile = getParticipantProfile(participantId);
    setData(profile);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener(SYNC_EVENT_NAME, refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, [participantId]);

  if (!data) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <AlertCircle size={36} className="text-amber-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Participant Not Found</h2>
        <p className={`text-xs ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Could not find records matching ID &ldquo;{participantId}&rdquo;.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-white bg-[#00c685] hover:bg-[#00a871] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }

  const { participant, certificate, contributions, claims, documents, transactions, activities, financialStats, claimsStats } = data;

  const handleReconcile = (txId: string) => {
    const { matchingContrib } = reconcileTransaction(txId);
    refreshData();
    if (matchingContrib) {
      setToast(`Transaction ${txId} reconciled. Contribution status updated to Collected.`);
    } else {
      setToast(`Transaction ${txId} successfully reconciled.`);
    }
    setTimeout(() => setToast(null), 4000);
  };

  // Initials
  const initials = participant.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/50';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';

  const tabs: { key: typeof activeTab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'contributions', label: 'Contributions', count: contributions.length },
    { key: 'claims', label: 'Claims', count: claims.length },
    { key: 'certificate', label: 'Certificate' },
    { key: 'payments', label: 'Payments & Treasury', count: transactions.length },
    { key: 'documents', label: 'Documents', count: documents.length },
    { key: 'activity', label: 'Activity Log', count: activities.length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className="fixed top-5 right-5 z-[700] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs max-w-sm"
            style={{ background: GREEN }}
          >
            <Check size={14} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            isLight
              ? 'border-gray-200 text-gray-700 hover:bg-gray-100'
              : 'border-white/10 text-white/70 hover:bg-white/5'
          }`}
        >
          <ArrowLeft size={13} /> Back
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
              isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-white/50'
            }`}
          >
            Role: {role}
          </span>
        </div>
      </div>

      {/* Profile Header Hero */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-sm transition-colors ${
          isLight ? 'bg-white border-gray-200/80' : 'bg-[#0d2117] border-white/[0.06]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar + Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl border-2 shrink-0 ${
                participant.status === 'Review' || participant.riskRating === 'High'
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  : 'bg-emerald-500/10 text-[#00c685] border-[#00c685]/30'
              }`}
            >
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${TEXT_MAIN}`}>
                  {participant.name}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-gray-500 font-semibold">
                  {participant.id}
                </span>
                <StatusBadge status={participant.status} theme={theme} />
                {participant.accountStatus && (
                  <StatusBadge status={participant.accountStatus} theme={theme} />
                )}
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    participant.riskRating === 'High'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : participant.riskRating === 'Medium'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  Risk: {participant.riskRating}
                </span>
              </div>

              <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${TEXT_SUB}`}>
                <span className="flex items-center gap-1">
                  <Mail size={12} className={TEXT_MUTED} /> {participant.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} className={TEXT_MUTED} /> {participant.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className={TEXT_MUTED} /> {participant.address}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className={TEXT_MUTED} /> Member since {participant.memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {certificate && (
              <ActionButton
                variant="secondary"
                size="md"
                icon={FileText}
                onClick={() => setActiveTab('certificate')}
                theme={theme}
              >
                View Certificate
              </ActionButton>
            )}
            <a
              href={`mailto:${participant.email}?subject=Takaful UK Mutual Protection Notice`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Mail size={13} /> Contact
            </a>
          </div>
        </div>

        {/* 4-Column KPI Summary Strip */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t ${
            isLight ? 'border-gray-100' : 'border-white/[0.06]'
          }`}
        >
          {/* 1. Contribution status */}
          <div
            className={`p-4 rounded-xl border ${
              financialStats.outstandingAmount > 0
                ? isLight
                  ? 'bg-rose-50/60 border-rose-200/70'
                  : 'bg-rose-950/20 border-rose-500/25'
                : isLight
                ? 'bg-gray-50/70 border-gray-100'
                : 'bg-white/[0.02] border-white/[0.04]'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
              Contribution Status
            </p>
            <p
              className={`text-lg font-bold mt-1 ${
                financialStats.outstandingAmount > 0 ? 'text-rose-500' : 'text-emerald-500'
              }`}
            >
              {financialStats.outstandingAmount > 0
                ? `£${financialStats.outstandingAmount.toFixed(2)} Due`
                : 'Up to Date'}
            </p>
            <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
              {financialStats.outstandingAmount > 0 ? 'Direct Debit retry cycle' : 'All contributions settled'}
            </p>
          </div>

          {/* 2. Claims status */}
          <div
            className={`p-4 rounded-xl border ${
              isLight ? 'bg-gray-50/70 border-gray-100' : 'bg-white/[0.02] border-white/[0.04]'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
              Claims History
            </p>
            <p className={`text-lg font-bold mt-1 ${TEXT_MAIN}`}>
              {claimsStats.totalClaims} {claimsStats.totalClaims === 1 ? 'Claim' : 'Claims'}
            </p>
            <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
              £{claimsStats.totalPaid.toLocaleString()} mutual pool paid
            </p>
          </div>

          {/* 3. Certificate summary */}
          <div
            className={`p-4 rounded-xl border ${
              isLight ? 'bg-gray-50/70 border-gray-100' : 'bg-white/[0.02] border-white/[0.04]'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
              Home Cover Policy
            </p>
            <p className={`text-lg font-bold mt-1 text-[#00c685]`}>
              {certificate?.id || 'TK-2024-0098'}
            </p>
            <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
              {certificate?.coverType ? `${certificate.coverType} Cover` : 'Buildings & Contents'}
            </p>
          </div>

          {/* 4. Payment Health */}
          <div
            className={`p-4 rounded-xl border ${
              financialStats.outstandingAmount > 0
                ? isLight
                  ? 'bg-amber-50/60 border-amber-200/70'
                  : 'bg-amber-950/20 border-amber-500/25'
                : isLight
                ? 'bg-gray-50/70 border-gray-100'
                : 'bg-white/[0.02] border-white/[0.04]'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
              Payment Health
            </p>
            <p
              className={`text-lg font-bold mt-1 ${
                financialStats.outstandingAmount > 0 ? 'text-amber-500' : 'text-emerald-500'
              }`}
            >
              {financialStats.paymentHealth}
            </p>
            <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
              {financialStats.outstandingAmount > 0 ? '11 days left in grace period' : 'Auto-reconciled monthly'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/[0.06] scrollbar-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#00c685] text-[#0a1a14] shadow-sm font-bold'
                  : isLight
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-black/20 text-[#0a1a14]'
                      : isLight
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="pt-2">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Participant Profile Information */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <h3 className={`text-sm font-bold uppercase tracking-wider ${TEXT_MAIN}`}>
                Participant Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className={TEXT_MUTED}>Full Name</span>
                  <p className={`font-semibold mt-0.5 ${TEXT_MAIN}`}>{participant.name}</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Member ID</span>
                  <p className="font-mono font-semibold mt-0.5 text-[#00c685]">{participant.id}</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Email Address</span>
                  <p className={`font-medium mt-0.5 ${TEXT_MAIN}`}>{participant.email}</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Phone Number</span>
                  <p className={`font-medium mt-0.5 ${TEXT_MAIN}`}>{participant.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className={TEXT_MUTED}>Residential Address</span>
                  <p className={`font-medium mt-0.5 ${TEXT_MAIN}`}>{participant.address}</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Risk Rating</span>
                  <div className="mt-1">
                    <StatusBadge status={participant.riskRating} theme={theme} />
                  </div>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Account Status</span>
                  <div className="mt-1">
                    <StatusBadge status={participant.accountStatus || 'Active'} theme={theme} />
                  </div>
                </div>
              </div>

              {participant.notes && (
                <div
                  className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
                    isLight ? 'bg-amber-50/70 border-amber-200/70 text-amber-900' : 'bg-amber-950/20 border-amber-500/25 text-amber-300'
                  }`}
                >
                  <p className="font-semibold mb-0.5">Underwriting & Compliance Note:</p>
                  <p>{participant.notes}</p>
                </div>
              )}
            </div>

            {/* Current Certificate Summary */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${TEXT_MAIN}`}>
                  Active Certificate Summary
                </h3>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="text-xs font-semibold text-[#00c685] hover:underline flex items-center gap-1"
                >
                  Full Certificate <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className={TEXT_MUTED}>Certificate Number</span>
                  <p className="font-mono font-semibold mt-0.5 text-[#00c685]">
                    {certificate?.id || 'TK-2024-0098'}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Cover Status</span>
                  <div className="mt-1">
                    <StatusBadge status={certificate?.status || 'Active'} theme={theme} />
                  </div>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Plan Tier</span>
                  <p className={`font-semibold mt-0.5 ${TEXT_MAIN}`}>
                    {certificate?.coverType ? `${certificate.coverType} Cover` : 'Buildings & Contents'}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Annual Contribution</span>
                  <p className={`font-semibold mt-0.5 ${TEXT_MAIN}`}>
                    £{certificate?.monthlyContribution ? (certificate.monthlyContribution * 12).toFixed(2) : '226.80'}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Start Date</span>
                  <p className={`font-medium mt-0.5 ${TEXT_MAIN}`}>
                    {certificate?.startDate || '1 Jan 2026'}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Renewal Date</span>
                  <p className={`font-medium mt-0.5 ${TEXT_MAIN}`}>
                    {certificate?.renewalDate || '31 Dec 2026'}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 p-3 rounded-xl border text-xs ${
                  isLight ? 'bg-emerald-50/60 border-emerald-200/70' : 'bg-emerald-950/20 border-emerald-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Tabarru Protection Active
                  </span>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    Compliant (Wakala & Mudaraba)
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Overview Card */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${TEXT_MAIN}`}>
                  Financial Ledger Snapshot
                </h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs font-semibold text-[#00c685] hover:underline flex items-center gap-1"
                >
                  View Cash Book <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className={TEXT_MUTED}>Total Paid Contributions</span>
                  <p className="text-base font-bold mt-0.5 text-emerald-500">
                    £{financialStats.totalContributions.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Outstanding Balance</span>
                  <p
                    className={`text-base font-bold mt-0.5 ${
                      financialStats.outstandingAmount > 0 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    £{financialStats.outstandingAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Payment Method</span>
                  <p className={`font-semibold mt-0.5 ${TEXT_MAIN}`}>{financialStats.lastPaymentMethod}</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Last Payment Date</span>
                  <p className={`font-semibold mt-0.5 ${TEXT_MAIN}`}>{financialStats.lastPaymentDate}</p>
                </div>
              </div>
            </div>

            {/* Claims Overview Card */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${TEXT_MAIN}`}>
                  Claims Snapshot
                </h3>
                <button
                  onClick={() => setActiveTab('claims')}
                  className="text-xs font-semibold text-[#00c685] hover:underline flex items-center gap-1"
                >
                  All Claims ({claims.length}) <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className={TEXT_MUTED}>Total Reported Claims</span>
                  <p className={`text-base font-bold mt-0.5 ${TEXT_MAIN}`}>{claimsStats.totalClaims}</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Total Settlement Disbursed</span>
                  <p className="text-base font-bold mt-0.5 text-emerald-500">
                    £{claimsStats.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Open Active Inquiries</span>
                  <p className={`font-semibold mt-0.5 ${TEXT_MAIN}`}>{claimsStats.openClaimsCount} claim(s)</p>
                </div>
                <div>
                  <span className={TEXT_MUTED}>Flagged Irregularities</span>
                  <p className="font-semibold mt-0.5 text-amber-500">
                    {participant.flagCount || 0} note(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTRIBUTIONS TAB */}
        {activeTab === 'contributions' && (
          <div className="space-y-6">
            {financialStats.outstandingAmount > 0 && (
              <div
                className={`p-5 rounded-2xl border flex items-start gap-4 ${
                  isLight
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                    : 'bg-rose-950/25 border-rose-500/30 text-rose-200'
                }`}
              >
                <AlertTriangle size={22} className="text-rose-500 shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Unpaid Monthly Contribution Detected</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-rose-800' : 'text-rose-300'}`}>
                    Direct Debit attempt for £{financialStats.outstandingAmount.toFixed(2)} was returned unpaid.
                    The policy remains currently active during the 14-day grace period.
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      href="/dashboard/contributions"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                    >
                      Open Contributions Control <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className={isLight ? 'bg-gray-50/80 text-gray-500 border-b border-gray-200/80' : 'bg-white/[0.02] text-white/40 border-b border-white/[0.06]'}>
                      <th className="px-5 py-3 font-semibold">Contribution ID</th>
                      <th className="px-5 py-3 font-semibold">Due Date</th>
                      <th className="px-5 py-3 font-semibold">Collected Date</th>
                      <th className="px-5 py-3 font-semibold">Method</th>
                      <th className="px-5 py-3 font-semibold">Amount</th>
                      <th className="px-5 py-3 font-semibold">Retries</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-white/[0.04]'}`}>
                    {contributions.map((c) => (
                      <tr key={c.id} className={isLight ? 'hover:bg-gray-50/80' : 'hover:bg-white/[0.02]'}>
                        <td className="px-5 py-3.5 font-mono font-bold text-[#00c685]">{c.id}</td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{c.dueDate}</td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{c.collectedDate || '—'}</td>
                        <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{c.method}</td>
                        <td className={`px-5 py-3.5 font-bold ${c.status === 'Failed' ? 'text-rose-500' : TEXT_MAIN}`}>
                          £{c.amount.toFixed(2)}
                        </td>
                        <td className={`px-5 py-3.5 ${TEXT_MUTED}`}>{c.retryCount} / 3</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={c.status} theme={theme} />
                        </td>
                      </tr>
                    ))}
                    {contributions.length === 0 && (
                      <tr>
                        <td colSpan={7} className={`py-8 text-center ${TEXT_MUTED}`}>
                          No contributions recorded for this participant.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CLAIMS TAB */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className={isLight ? 'bg-gray-50/80 text-gray-500 border-b border-gray-200/80' : 'bg-white/[0.02] text-white/40 border-b border-white/[0.06]'}>
                      <th className="px-5 py-3 font-semibold">Claim ID</th>
                      <th className="px-5 py-3 font-semibold">Incident Date</th>
                      <th className="px-5 py-3 font-semibold">Peril Type</th>
                      <th className="px-5 py-3 font-semibold">Property Address</th>
                      <th className="px-5 py-3 font-semibold">Amount Claimed</th>
                      <th className="px-5 py-3 font-semibold">Settlement</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Assigned Handler</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-white/[0.04]'}`}>
                    {claims.map((cl) => (
                      <tr key={cl.id} className={isLight ? 'hover:bg-gray-50/80' : 'hover:bg-white/[0.02]'}>
                        <td className="px-5 py-3.5 font-mono font-bold text-[#00c685]">{cl.id}</td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{cl.incidentDate}</td>
                        <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{cl.type}</td>
                        <td className={`px-5 py-3.5 max-w-xs truncate ${TEXT_SUB}`}>{cl.propertyAddress}</td>
                        <td className={`px-5 py-3.5 font-semibold ${TEXT_MAIN}`}>
                          £{cl.amountClaimed.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-emerald-500">
                          {cl.amountApproved ? `£${cl.amountApproved.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={cl.status} theme={theme} />
                        </td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{cl.assignedHandlerName || 'Unassigned'}</td>
                      </tr>
                    ))}
                    {claims.length === 0 && (
                      <tr>
                        <td colSpan={8} className={`py-8 text-center ${TEXT_MUTED}`}>
                          No claims filed by this participant.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. CERTIFICATE TAB */}
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-2xl border space-y-6 ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <span className="font-mono text-xs font-bold text-[#00c685]">
                    {certificate?.id || 'TK-2024-0098'}
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${TEXT_MAIN}`}>
                    Takaful Home Protection Certificate
                  </h3>
                  <p className={`text-xs ${TEXT_SUB}`}>
                    Underwritten under Shariah-compliant mutual loss sharing guidelines
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={certificate?.status || 'Active'} theme={theme} />
                  <ActionButton
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={() => {
                      setToast('Certificate schedule downloaded.');
                      setTimeout(() => setToast(null), 3000);
                    }}
                    theme={theme}
                  >
                    Download PDF
                  </ActionButton>
                </div>
              </div>

              {/* Cover breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gray-50 border-gray-200/60' : 'bg-white/[0.02] border-white/[0.05]'
                  }`}
                >
                  <span className={TEXT_MUTED}>Buildings Cover</span>
                  <p className={`text-xl font-extrabold mt-1 ${TEXT_MAIN}`}>
                    £{certificate?.buildingsLimit ? certificate.buildingsLimit.toLocaleString() : '250,000'}
                  </p>
                  <p className={`text-xs mt-1 ${TEXT_SUB}`}>Full reinstatement cost</p>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gray-50 border-gray-200/60' : 'bg-white/[0.02] border-white/[0.05]'
                  }`}
                >
                  <span className={TEXT_MUTED}>Contents Cover</span>
                  <p className={`text-xl font-extrabold mt-1 ${TEXT_MAIN}`}>
                    £{certificate?.contentsLimit ? certificate.contentsLimit.toLocaleString() : '50,000'}
                  </p>
                  <p className={`text-xs mt-1 ${TEXT_SUB}`}>New-for-old replacement</p>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gray-50 border-gray-200/60' : 'bg-white/[0.02] border-white/[0.05]'
                  }`}
                >
                  <span className={TEXT_MUTED}>Total Excess</span>
                  <p className={`text-xl font-extrabold mt-1 ${TEXT_MAIN}`}>
                    £{(certificate?.compulsoryExcess || 250) + (certificate?.voluntaryExcess || 0)}
                  </p>
                  <p className={`text-xs mt-1 ${TEXT_SUB}`}>
                    £{certificate?.compulsoryExcess || 250} compulsory + £{certificate?.voluntaryExcess || 0} voluntary
                  </p>
                </div>
              </div>

              {/* Covered Perils */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${TEXT_MAIN}`}>
                  Covered Perils & Mutual Pool Protections
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Fire, Smoke & Explosion',
                    'Storm & Extreme Weather',
                    'Flood & Inundation',
                    'Escape of Water / Leaks',
                    'Theft & Attempted Break-in',
                    'Subsidence & Landslip',
                    'Accidental Glass & Ceramic Damage',
                    'Alternative Accommodation (up to £25k)',
                    'Property Owners Liability (£2m)',
                  ].map((p) => (
                    <div
                      key={p}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                        isLight ? 'bg-gray-50/50 border-gray-200/60' : 'bg-white/[0.015] border-white/[0.05]'
                      }`}
                    >
                      <CheckCircle2 size={13} className="text-[#00c685] shrink-0" />
                      <span className={TEXT_MAIN}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PAYMENTS & TREASURY TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className={isLight ? 'bg-gray-50/80 text-gray-500 border-b border-gray-200/80' : 'bg-white/[0.02] text-white/40 border-b border-white/[0.06]'}>
                      <th className="px-5 py-3 font-semibold">Transaction ID</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Type</th>
                      <th className="px-5 py-3 font-semibold">Reference</th>
                      <th className="px-5 py-3 font-semibold">Amount</th>
                      <th className="px-5 py-3 font-semibold">Flow</th>
                      <th className="px-5 py-3 font-semibold">Audit Status</th>
                      <th className="px-5 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-white/[0.04]'}`}>
                    {transactions.map((t) => {
                      const isInflow = t.direction === 'Inflow';
                      const isReconciled = t.reconciled || t.status === 'Reconciled' || t.status === 'Completed';

                      return (
                        <tr key={t.id} className={isLight ? 'hover:bg-gray-50/80' : 'hover:bg-white/[0.02]'}>
                          <td className="px-5 py-3.5 font-mono font-bold text-[#00c685]">{t.id}</td>
                          <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{t.date}</td>
                          <td className={`px-5 py-3.5 font-medium ${TEXT_MAIN}`}>{t.type}</td>
                          <td className={`px-5 py-3.5 font-mono text-[11px] ${TEXT_MUTED}`}>{t.reference}</td>
                          <td className={`px-5 py-3.5 font-bold ${isInflow ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isInflow ? '+' : '−'}£{t.amount.toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                isInflow ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                              }`}
                            >
                              {isInflow ? 'Inflow' : 'Disbursement'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={t.status} theme={theme} />
                          </td>
                          <td className="px-5 py-3.5">
                            {isReconciled ? (
                              <VerifiedBadge isLight={isLight} />
                            ) : (
                              <ActionButton
                                variant="amber"
                                size="sm"
                                icon={ArrowLeftRight}
                                onClick={() => handleReconcile(t.id)}
                              >
                                Reconcile
                              </ActionButton>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={8} className={`py-8 text-center ${TEXT_MUTED}`}>
                          No Treasury Cash Book transactions found for this participant.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className={isLight ? 'bg-gray-50/80 text-gray-500 border-b border-gray-200/80' : 'bg-white/[0.02] text-white/40 border-b border-white/[0.06]'}>
                      <th className="px-5 py-3 font-semibold">Document Name</th>
                      <th className="px-5 py-3 font-semibold">Related Claim</th>
                      <th className="px-5 py-3 font-semibold">Document Type</th>
                      <th className="px-5 py-3 font-semibold">Uploaded Date</th>
                      <th className="px-5 py-3 font-semibold">Uploaded By</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-white/[0.04]'}`}>
                    {documents.map((doc) => (
                      <tr key={doc.id} className={isLight ? 'hover:bg-gray-50/80' : 'hover:bg-white/[0.02]'}>
                        <td className="px-5 py-3.5 font-medium flex items-center gap-2">
                          <FileText size={14} className="text-[#00c685] shrink-0" />
                          <span className={TEXT_MAIN}>{doc.name}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[#00c685]">{doc.claimId}</td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{doc.type}</td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{doc.uploadedDate}</td>
                        <td className={`px-5 py-3.5 ${TEXT_SUB}`}>{doc.uploadedBy}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={doc.status} theme={theme} />
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={6} className={`py-8 text-center ${TEXT_MUTED}`}>
                          No claim or verification documents found for this participant.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. ACTIVITY LOG TAB */}
        {activeTab === 'activity' && (
          <div
            className={`p-6 rounded-2xl border space-y-6 ${
              isLight ? 'bg-white border-gray-200/80 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
            }`}
          >
            <h3 className={`text-sm font-bold uppercase tracking-wider ${TEXT_MAIN}`}>
              Chronological Audit & Activity Stream
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {activities.map((act) => {
                let icon = ActivityIcon;
                let iconColor = 'text-[#00c685]';
                let iconBg = 'bg-[#00c685]/15';

                if (act.type === 'payment') {
                  icon = CreditCard;
                  if (act.status === 'failed') {
                    iconColor = 'text-rose-500';
                    iconBg = 'bg-rose-500/15';
                  }
                } else if (act.type === 'notification') {
                  icon = Bell;
                  iconColor = 'text-amber-500';
                  iconBg = 'bg-amber-500/15';
                } else if (act.type === 'claim') {
                  icon = AlertCircle;
                } else if (act.type === 'certificate') {
                  icon = FileCheck;
                } else if (act.type === 'account') {
                  icon = UserCheck;
                }

                const IconComponent = icon;

                return (
                  <div key={act.id} className="relative flex items-start gap-4">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center border ${iconBg} ${iconColor} border-current`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${TEXT_MAIN}`}>{act.title}</span>
                          {act.channel && (
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                                isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-white/50'
                              }`}
                            >
                              {act.channel}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-mono ${TEXT_MUTED}`}>
                          {act.date} {act.time ? `· ${act.time}` : ''}
                        </span>
                      </div>

                      <p className={`text-xs mt-1 leading-relaxed ${TEXT_SUB}`}>{act.description}</p>

                      {act.actor && (
                        <p className={`text-[10px] mt-1 ${TEXT_MUTED}`}>Initiated by: {act.actor}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {activities.length === 0 && (
                <p className={`text-xs ${TEXT_MUTED}`}>No activity recorded yet for this participant.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
