'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Flag,
  AlertTriangle,
  Mail,
  Phone,
  Home,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  CreditCard,
  Building2,
  Landmark,
  Gavel,
  Ban,
  PauseCircle,
  FileWarning,
  Eye,
  RefreshCw,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';
import { useTheme, useRole } from '../ThemeRoleContext';
import { PARTICIPANTS, CERTIFICATES, CLAIMS, CONTRIBUTIONS } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import { Participant, Certificate, Claim, Contribution } from '@/lib/dashboard/types';
import {
  DisciplinaryReport,
  getStoredReports,
  addDisciplinaryReport,
  applyManagementPreAction,
  applyManagementFinalAction,
  REPORTS_SYNC_EVENT,
} from '@/lib/dashboard/management-reports';

const GREEN = '#00c685';

export default function ParticipantsPage() {
  const { theme } = useTheme();
  const { role } = useRole();
  const isLight = theme === 'light';

  // Role determination strictly from session context
  const isFinance = role === 'finance';
  const isManagement = role === 'management' || role === 'super_admin';
  const isClaimHandler = !isFinance && !isManagement;

  // Reports state
  const [reports, setReports] = useState<DisciplinaryReport[]>([]);

  useEffect(() => {
    setReports(getStoredReports());
    const handleSync = (e: any) => {
      if (e.detail) setReports(e.detail);
      else setReports(getStoredReports());
    };
    window.addEventListener(REPORTS_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(REPORTS_SYNC_EVENT, handleSync);
  }, []);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Active' | 'Under Investigation' | 'Flagged / Suspended' | 'Pending Management'
  >('All');
  const [riskFilter, setRiskFilter] = useState<'All Tiers' | 'Low Risk' | 'Medium Risk' | 'High Risk'>('All Tiers');

  // Dynamic participant list tracking local referral flags & actions
  const [localParticipants, setLocalParticipants] = useState<Participant[]>(PARTICIPANTS);

  // Drawer & Modal state
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'contributions' | 'claims' | 'referrals'>('overview');

  // Referral / Report Modal state
  const [reportModalParticipant, setReportModalParticipant] = useState<Participant | null>(null);
  const [reportCategory, setReportCategory] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [reportAuditRef, setReportAuditRef] = useState('');
  const [reportAmount, setReportAmount] = useState('');

  // Management Action Modal state
  const [mgmtActionParticipant, setMgmtActionParticipant] = useState<Participant | null>(null);
  const [mgmtActionNotes, setMgmtActionNotes] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Initialize report category default based on role
  useEffect(() => {
    if (isFinance) {
      setReportCategory('Direct Debit Mandate Default / Repeated BACS Failure');
    } else {
      setReportCategory('Suspected policy irregularity / undisclosed risk factors');
    }
  }, [isFinance]);

  // Sync participant status with reports
  const pendingReportsCount = useMemo(() => {
    return reports.filter((r) => r.status === 'Pending Management Review').length;
  }, [reports]);

  const claimsReportsCount = useMemo(() => {
    return reports.filter((r) => r.source === 'claim_handler' && r.status === 'Pending Management Review').length;
  }, [reports]);

  const financeReportsCount = useMemo(() => {
    return reports.filter((r) => r.source === 'finance' && r.status === 'Pending Management Review').length;
  }, [reports]);

  // Filter logic
  const filteredParticipants = useMemo(() => {
    return localParticipants.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);

      let matchStatus = true;
      if (statusFilter === 'Active') {
        matchStatus = (p.accountStatus === 'Active' || p.status === 'Active') && (p.flagCount ?? 0) === 0;
      } else if (statusFilter === 'Under Investigation') {
        matchStatus = p.accountStatus === 'Under Investigation' || (p.flagCount ?? 0) > 0;
      } else if (statusFilter === 'Flagged / Suspended') {
        matchStatus =
          (p.flagCount ?? 0) > 0 ||
          p.accountStatus === 'Suspended' ||
          p.accountStatus === 'Banned' ||
          p.status === 'Suspended' ||
          p.accountStatus === 'Warning Issued';
      } else if (statusFilter === 'Pending Management') {
        matchStatus = reports.some(
          (r) => r.participantId === p.id && r.status === 'Pending Management Review'
        );
      }

      let matchRisk = true;
      if (riskFilter === 'Low Risk') matchRisk = p.riskRating === 'Low';
      else if (riskFilter === 'Medium Risk') matchRisk = p.riskRating === 'Medium';
      else if (riskFilter === 'High Risk') matchRisk = p.riskRating === 'High';

      return matchSearch && matchStatus && matchRisk;
    });
  }, [search, statusFilter, riskFilter, localParticipants, reports]);

  // Helper mappings
  const getParticipantCert = (pId: string): Certificate | undefined => {
    return CERTIFICATES.find(
      (c) => c.participantId === pId || c.id === `TK-2024-${pId.replace('P-', '')}`
    );
  };

  const getParticipantContribs = (pId: string): Contribution[] => {
    return CONTRIBUTIONS.filter((c) => c.participantId === pId);
  };

  const getParticipantMonthly = (p: Participant): number => {
    const cert = getParticipantCert(p.id);
    if (cert?.monthlyContribution) return cert.monthlyContribution;
    if (p.id === 'P-0042') return 38.5;
    if (p.id === 'P-0087') return 24.2;
    if (p.id === 'P-0112') return 52.8;
    if (p.id === 'P-0031') return 41.0;
    if (p.id === 'P-0098') return 18.9;
    if (p.id === 'P-0055') return 61.2;
    if (p.id === 'P-0073') return 35.0;
    if (p.id === 'P-0019') return 48.0;
    return 40.0;
  };

  const getParticipantDDStatus = (p: Participant) => {
    if (p.accountStatus === 'Banned' || p.accountStatus === 'Suspended') {
      return { label: 'Mandate Frozen', color: 'rose' };
    }
    const contribs = getParticipantContribs(p.id);
    const hasFailed = contribs.some((c) => c.status === 'Failed');
    if (hasFailed || p.id === 'P-0098' || p.id === 'P-0019') {
      return { label: 'Failed — In Arrears', color: 'rose' };
    }
    if (p.status === 'Pending' || p.id === 'P-0073') {
      return { label: 'Pending Setup', color: 'amber' };
    }
    return { label: 'Direct Debit Active', color: 'emerald' };
  };

  // Aggregate stats
  const totalEnrolled = localParticipants.length;
  const inGoodStanding = localParticipants.filter(
    (p) => (p.accountStatus === 'Active' || !p.accountStatus) && (p.flagCount ?? 0) === 0
  ).length;
  const underInvestigation = localParticipants.filter(
    (p) => p.accountStatus === 'Under Investigation' || (p.flagCount ?? 0) > 0
  ).length;
  const suspendedFrozen = localParticipants.filter(
    (p) => p.accountStatus === 'Suspended' || p.accountStatus === 'Banned'
  ).length;

  // Finance-specific stats
  const totalMonthlyVolume = useMemo(() => {
    return localParticipants.reduce((sum, p) => sum + getParticipantMonthly(p), 0);
  }, [localParticipants]);

  const activeMandatesCount = useMemo(() => {
    return localParticipants.filter((p) => getParticipantDDStatus(p).color === 'emerald').length;
  }, [localParticipants]);

  const delinquentMandatesCount = useMemo(() => {
    return localParticipants.filter((p) => getParticipantDDStatus(p).color === 'rose').length;
  }, [localParticipants]);

  // Selected participant certificate & claims & reports
  const activeCert = useMemo(() => {
    if (!selectedParticipant) return null;
    return getParticipantCert(selectedParticipant.id) || null;
  }, [selectedParticipant]);

  const participantClaims = useMemo(() => {
    if (!selectedParticipant) return [];
    return CLAIMS.filter(
      (c) =>
        c.participantId === selectedParticipant.id ||
        c.participantName.toLowerCase() === selectedParticipant.name.toLowerCase()
    );
  }, [selectedParticipant]);

  const participantReports = useMemo(() => {
    if (!selectedParticipant) return [];
    return reports.filter((r) => r.participantId === selectedParticipant.id);
  }, [selectedParticipant, reports]);

  const participantContributions = useMemo(() => {
    if (!selectedParticipant) return [];
    return getParticipantContribs(selectedParticipant.id);
  }, [selectedParticipant]);

  // Handle Report Submission (Claim Handler or Finance)
  const handleConfirmReport = () => {
    if (!reportModalParticipant) return;

    const reporterName = isFinance ? 'Amira Siddiqui' : 'Omar Hassan';
    const reporterRole = isFinance ? 'Head of Treasury & Payouts (Finance)' : 'Senior Claims Specialist';

    addDisciplinaryReport({
      participantId: reportModalParticipant.id,
      participantName: reportModalParticipant.name,
      source: isFinance ? 'finance' : 'claim_handler',
      reporterName,
      reporterRole,
      category: reportCategory,
      notes: reportNotes || (isFinance ? 'Financial irregularity flagged for Management.' : 'Claim irregularity flagged for Management.'),
      auditReference: reportAuditRef || (isFinance ? `BACS-${reportModalParticipant.id}` : undefined),
      amount: reportAmount ? parseFloat(reportAmount) : undefined,
    });

    setLocalParticipants((prev) =>
      prev.map((p) => {
        if (p.id === reportModalParticipant.id) {
          return {
            ...p,
            accountStatus: 'Under Investigation',
            flagCount: (p.flagCount ?? 0) + 1,
            notes: `${p.notes || ''} [${isFinance ? 'Finance' : 'Claims'} Referral on ${new Date().toLocaleDateString('en-GB')}: ${reportCategory}]`,
          };
        }
        return p;
      })
    );

    setToast(
      isFinance
        ? `Financial irregularity report submitted for ${reportModalParticipant.name} to Operations Management.`
        : `Investigation referral submitted for ${reportModalParticipant.name} to Operations Management.`
    );

    setTimeout(() => {
      setReportModalParticipant(null);
      setToast(null);
      setReportNotes('');
      setReportAuditRef('');
      setReportAmount('');
    }, 2200);
  };

  // Handle Management Pre-Action
  const handleExecutePreAction = (
    actionName: 'Formal Warning Notice' | 'Freeze Claims Payouts' | 'Pause Direct Debit' | 'Forensic Audit'
  ) => {
    if (!mgmtActionParticipant) return;
    const targetReport = reports.find((r) => r.participantId === mgmtActionParticipant.id);
    if (targetReport) {
      applyManagementPreAction(
        targetReport.id,
        actionName,
        mgmtActionNotes || `Pre-action executed: ${actionName}`,
        'Ahmed Khan (Operations Director)'
      );
    }

    setLocalParticipants((prev) =>
      prev.map((p) => {
        if (p.id === mgmtActionParticipant.id) {
          return {
            ...p,
            accountStatus: actionName === 'Formal Warning Notice' ? 'Warning Issued' : p.accountStatus,
            managementPreAction: actionName,
            notes: `${p.notes || ''} [Management Pre-Action: ${actionName} by Ahmed Khan on ${new Date().toLocaleDateString('en-GB')}]`,
          };
        }
        return p;
      })
    );

    setToast(`Management Pre-Action: "${actionName}" applied for ${mgmtActionParticipant.name}.`);
    setMgmtActionParticipant(null);
    setMgmtActionNotes('');
    setTimeout(() => setToast(null), 3500);
  };

  // Handle Management Final Action
  const handleExecuteFinalAction = (action: 'Suspend Account' | 'Permanent Ban' | 'Dismiss Referral') => {
    if (!mgmtActionParticipant) return;
    const targetReport = reports.find((r) => r.participantId === mgmtActionParticipant.id);
    if (targetReport) {
      applyManagementFinalAction(
        targetReport.id,
        action,
        mgmtActionNotes || `Executive determination: ${action}`,
        'Ahmed Khan (Operations Director)'
      );
    }

    const nextStatus =
      action === 'Suspend Account' ? 'Suspended' : action === 'Permanent Ban' ? 'Banned' : 'Active';

    setLocalParticipants((prev) =>
      prev.map((p) => {
        if (p.id === mgmtActionParticipant.id) {
          return {
            ...p,
            accountStatus: nextStatus,
            flagCount: action === 'Dismiss Referral' ? 0 : p.flagCount,
            status: action === 'Dismiss Referral' ? 'Active' : action === 'Permanent Ban' ? 'Cancelled' : 'Suspended',
            notes: `${p.notes || ''} [Executive Action: ${action} enacted by Ahmed Khan on ${new Date().toLocaleDateString('en-GB')}]`,
          };
        }
        return p;
      })
    );

    setToast(
      action === 'Dismiss Referral'
        ? `Referral dismissed. ${mgmtActionParticipant.name} restored to Good Standing.`
        : `Executive Action: ${action} enforced for ${mgmtActionParticipant.name}.`
    );
    setMgmtActionParticipant(null);
    setMgmtActionNotes('');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 transition-colors duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-5 right-5 z-[800] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-semibold text-xs max-w-md bg-emerald-600 border border-emerald-400"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header (Clean, strictly based on role with NO role switch tabs) ── */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Participant Registry
          </h1>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${
              isFinance
                ? isLight
                  ? 'bg-blue-50 text-blue-800 border-blue-300/70'
                  : 'bg-blue-950/40 text-blue-400 border-blue-500/30'
                : isManagement
                ? isLight
                  ? 'bg-purple-50 text-purple-800 border-purple-300/70'
                  : 'bg-purple-950/40 text-purple-400 border-purple-500/30'
                : isLight
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300/60'
                : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isFinance
              ? 'Finance Clearance'
              : isManagement
              ? 'Management Clearance (Executive Disciplinary Action)'
              : 'Claim Handler Clearance'}
          </span>
        </div>
        <p className={`text-xs mt-1.5 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>
          {isFinance
            ? 'Member contribution ledger, Direct Debit mandates, and financial irregularity reporting.'
            : isManagement
            ? 'Executive oversight, disciplinary sanctions review, and pre-action management console.'
            : 'Member registry lookup with claims incident history and forensic referral bridge.'}
        </p>
      </div>

      {/* ── Management Alert Banner (Visible only for Management when reports are pending) ── */}
      {isManagement && pendingReportsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
            isLight
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <Gavel size={18} />
            </div>
            <div>
              <div className="font-bold text-xs">
                {pendingReportsCount} Pending Disciplinary Referral{pendingReportsCount > 1 ? 's' : ''} Awaiting Executive Review
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {claimsReportsCount} from Claims Specialists · {financeReportsCount} from Finance. Review before taking pre-actions or sanctions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Pending Management')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-xs shrink-0"
          >
            Review Pending Queue ({pendingReportsCount})
          </button>
        </motion.div>
      )}

      {/* ── 4 KPI Cards (Finance sees Finance KPIs; Claims & Management see Claims/Standing KPIs) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isFinance ? (
          <>
            {/* Finance Card 1 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {totalEnrolled}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Total Enrolled
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                Mutual pool members
              </div>
            </div>

            {/* Finance Card 2 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {activeMandatesCount}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Active Direct Debits
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                BACS auto-collected
              </div>
            </div>

            {/* Finance Card 3 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {delinquentMandatesCount}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Mandates in Arrears
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                Failed BACS collections
              </div>
            </div>

            {/* Finance Card 4 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Recurring</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                £{totalMonthlyVolume.toFixed(2)}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Monthly Pool Inflow
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                Scheduled regular contributions
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Standard / Claims / Management KPI 1 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {totalEnrolled}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Total Enrolled
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                Mutual pool members
              </div>
            </div>

            {/* Standard / Claims / Management KPI 2 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {inGoodStanding}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                In Good Standing
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                No active disciplinary alerts
              </div>
            </div>

            {/* Standard / Claims / Management KPI 3 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {underInvestigation}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Under Investigation
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                {isManagement ? 'Referred by Claims & Finance' : 'Referred by Claim Handlers'}
              </div>
            </div>

            {/* Standard / Claims / Management KPI 4 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>Updated today</span>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {suspendedFrozen}
              </div>
              <div className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-900' : 'text-white/90'}`}>
                Suspended / Frozen
              </div>
              <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                Blocked payouts &amp; cover
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div
        className={`p-4 rounded-2xl border space-y-3.5 transition-colors ${
          isLight ? 'bg-white border-gray-200/90 shadow-xs' : 'bg-[#0d2117] border-white/[0.06]'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search
              size={15}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-gray-400' : 'text-white/35'
              }`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by participant name, ID, or email..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                isLight
                  ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#00c685] shadow-xs'
                  : 'border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-[#00c685]'
              }`}
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
              Status:
            </span>
            {(isManagement
              ? (['All', 'Active', 'Under Investigation', 'Flagged / Suspended', 'Pending Management'] as const)
              : (['All', 'Active', 'Under Investigation', 'Flagged / Suspended'] as const)
            ).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#00c685]/20 text-[#00a871] border border-[#00c685]/40 shadow-xs'
                    : isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 border border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Risk Tier Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className={`text-xs font-semibold ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
            Risk Tier:
          </span>
          {(['All Tiers', 'Low Risk', 'Medium Risk', 'High Risk'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                riskFilter === r
                  ? 'bg-[#00c685]/20 text-[#00a871] border border-[#00c685]/40 shadow-xs'
                  : isLight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 border border-transparent'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table (Role-specific columns) ── */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          isLight ? 'bg-white border-gray-200/90' : 'bg-[#0d2117] border-white/[0.06]'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold tracking-wider uppercase ${
                  isLight
                    ? 'bg-gray-50/70 border-gray-200 text-gray-500'
                    : 'bg-white/[0.02] border-white/[0.06] text-white/40'
                }`}
              >
                <th className="px-5 py-3.5 whitespace-nowrap">PARTICIPANT</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-cyan-600 dark:text-cyan-400">
                  CONTACT &amp; PROPERTY
                </th>

                {/* Role specific columns */}
                {isFinance && (
                  <th className="px-5 py-3.5 whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                    CONTRIBUTIONS
                  </th>
                )}

                {isClaimHandler && (
                  <>
                    <th className="px-5 py-3.5 whitespace-nowrap">ENROLLED</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">CLAIMS RECORD</th>
                  </>
                )}

                {isManagement && (
                  <>
                    <th className="px-5 py-3.5 whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                      CONTRIBUTIONS
                    </th>
                    <th className="px-5 py-3.5 whitespace-nowrap">CLAIMS RECORD</th>
                  </>
                )}

                <th className="px-5 py-3.5 whitespace-nowrap">RISK TIER</th>
                <th className="px-5 py-3.5 whitespace-nowrap">ACCOUNT STATUS</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-right">
                  {isManagement ? 'MANAGEMENT AUTHORIZATION' : 'ACTIONS'}
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-white/[0.04]'}`}>
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    No participants found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => {
                  const avatarUrl = getDicebearAvatar(p.name);
                  const isHigh = p.riskRating === 'High';
                  const isMedium = p.riskRating === 'Medium';
                  const monthlyContrib = getParticipantMonthly(p);
                  const ddStatus = getParticipantDDStatus(p);
                  const pendingReportsForP = reports.filter(
                    (r) => r.participantId === p.id && r.status === 'Pending Management Review'
                  );

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedParticipant(p);
                        setDrawerTab('overview');
                      }}
                      className={`transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-gray-50/90' : 'hover:bg-white/[0.025]'
                      }`}
                    >
                      {/* PARTICIPANT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarUrl}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover border shrink-0 bg-gray-100"
                            style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.1)' }}
                          />
                          <div>
                            <div className={`font-bold text-xs ${isLight ? 'text-gray-900' : 'text-white'}`}>
                              {p.name}
                            </div>
                            <div className={`font-mono text-[10px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                              {p.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT & PROPERTY */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className={`flex items-center gap-1.5 ${isLight ? 'text-gray-700' : 'text-white/70'}`}>
                            <Mail size={12} className={isLight ? 'text-gray-400' : 'text-white/35'} />
                            <span className="truncate max-w-[180px]">{p.email}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                            <Home size={12} className={isLight ? 'text-gray-400' : 'text-white/35'} />
                            <span className="truncate max-w-[180px]">{p.address}</span>
                          </div>
                        </div>
                      </td>

                      {/* CONTRIBUTIONS (Finance and Management) */}
                      {(isFinance || isManagement) && (
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-bold text-xs text-[#00c685]">
                            £{monthlyContrib.toFixed(2)}
                            <span className="text-[10px] font-normal text-gray-400">/mo</span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                ddStatus.color === 'emerald'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : ddStatus.color === 'rose'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  ddStatus.color === 'emerald'
                                    ? 'bg-emerald-500'
                                    : ddStatus.color === 'rose'
                                    ? 'bg-rose-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              {ddStatus.label}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* ENROLLED (Claim Handler only) */}
                      {isClaimHandler && (
                        <td className={`px-5 py-4 whitespace-nowrap font-medium ${isLight ? 'text-gray-700' : 'text-white/70'}`}>
                          {p.memberSince}
                        </td>
                      )}

                      {/* CLAIMS RECORD (Claim Handler and Management) */}
                      {(isClaimHandler || isManagement) && (
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                            {p.totalClaims} {p.totalClaims === 1 ? 'Claim' : 'Claims'}
                          </div>
                          <div className={`text-[11px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
                            £{(p.totalClaimValue || 0).toLocaleString()}
                          </div>
                        </td>
                      )}

                      {/* RISK TIER */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isHigh
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isMedium
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          {p.riskRating} Risk
                        </span>
                      </td>

                      {/* ACCOUNT STATUS */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {p.accountStatus === 'Banned' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <Ban size={12} className="text-rose-600" />
                              Banned &amp; Expelled
                            </span>
                          </div>
                        ) : p.accountStatus === 'Suspended' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                              <ShieldAlert size={12} className="text-rose-600" />
                              Suspended
                            </span>
                            <div className="text-[10px] text-rose-600 font-bold mt-1">Cover Frozen</div>
                          </div>
                        ) : p.accountStatus === 'Under Investigation' || (p.flagCount ?? 0) >= 2 ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertTriangle size={12} className="text-amber-600" />
                              Under Investigation
                            </span>
                            <div className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                              ▲ {p.flagCount || 2} Referral Flags
                            </div>
                          </div>
                        ) : p.accountStatus === 'Warning Issued' || (p.flagCount ?? 0) === 1 ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertTriangle size={12} className="text-amber-600" />
                              Warning Issued
                            </span>
                            <div className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                              ▲ 1 Referral Flag
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck size={12} className="text-emerald-600" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* Management Authorization Action Button */}
                          {isManagement && (
                            <button
                              onClick={() => setMgmtActionParticipant(p)}
                              title="Executive Action & Pre-Action Console"
                              className="px-2.5 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            >
                              <Gavel size={13} className="text-purple-600" />
                              <span>Authorize Action</span>
                              {pendingReportsForP.length > 0 && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                              )}
                            </button>
                          )}

                          {/* Claim Handler Referral Button */}
                          {isClaimHandler && (
                            <button
                              onClick={() => setReportModalParticipant(p)}
                              title="Refer participant for Investigation"
                              className="p-2 rounded-xl border border-rose-200/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer shadow-xs"
                            >
                              <Flag size={13} />
                            </button>
                          )}

                          {/* Finance Report Button */}
                          {isFinance && (
                            <button
                              onClick={() => setReportModalParticipant(p)}
                              title="Report financial irregularity to Management"
                              className="p-2 rounded-xl border border-blue-200/90 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all cursor-pointer shadow-xs"
                            >
                              <Flag size={13} />
                            </button>
                          )}

                          {/* View details button */}
                          <button
                            onClick={() => {
                              setSelectedParticipant(p);
                              setDrawerTab('overview');
                            }}
                            title="Open participant file"
                            className="p-2 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs"
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Over Drawer (Role-specific tabs & options) ── */}
      <AnimatePresence>
        {selectedParticipant && (
          <div className="fixed inset-0 z-[600] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedParticipant(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className={`relative z-10 w-full max-w-xl h-full flex flex-col shadow-2xl border-l overflow-hidden ${
                isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0a1a14] border-white/10 text-white'
              }`}
            >
              {/* Drawer Header */}
              <div
                className="p-5 border-b flex items-start justify-between shrink-0"
                style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getDicebearAvatar(selectedParticipant.name)}
                    alt={selectedParticipant.name}
                    className="w-11 h-11 rounded-full object-cover border bg-gray-100"
                    style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold">{selectedParticipant.name}</h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck size={11} className="text-emerald-600" />
                        {selectedParticipant.accountStatus || 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-gray-400">ID: {selectedParticipant.id}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {selectedParticipant.riskRating} Risk
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedParticipant(null)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isLight ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs (Tailored: Claim Handler sees Claim options, Finance sees Finance options, Management sees both) */}
              <div
                className="flex items-center border-b px-5 gap-5 text-xs font-semibold shrink-0 overflow-x-auto"
                style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)' }}
              >
                <button
                  onClick={() => setDrawerTab('overview')}
                  className={`py-3 relative cursor-pointer whitespace-nowrap ${
                    drawerTab === 'overview'
                      ? 'text-[#00c685]'
                      : isLight
                      ? 'text-gray-500 hover:text-gray-900'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Overview &amp; Cover
                  {drawerTab === 'overview' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c685] rounded-full" />
                  )}
                </button>

                {/* Contributions tab (Finance and Management ONLY) */}
                {(isFinance || isManagement) && (
                  <button
                    onClick={() => setDrawerTab('contributions')}
                    className={`py-3 relative cursor-pointer whitespace-nowrap ${
                      drawerTab === 'contributions'
                        ? 'text-[#00c685]'
                        : isLight
                        ? 'text-gray-500 hover:text-gray-900'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Contributions &amp; Direct Debit
                    {drawerTab === 'contributions' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c685] rounded-full" />
                    )}
                  </button>
                )}

                {/* Claims tab (Claim Handler and Management ONLY) */}
                {(isClaimHandler || isManagement) && (
                  <button
                    onClick={() => setDrawerTab('claims')}
                    className={`py-3 relative cursor-pointer whitespace-nowrap ${
                      drawerTab === 'claims'
                        ? 'text-[#00c685]'
                        : isLight
                        ? 'text-gray-500 hover:text-gray-900'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Claims History ({participantClaims.length})
                    {drawerTab === 'claims' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c685] rounded-full" />
                    )}
                  </button>
                )}

                {/* Referrals & Audit Tab */}
                <button
                  onClick={() => setDrawerTab('referrals')}
                  className={`py-3 relative cursor-pointer whitespace-nowrap ${
                    drawerTab === 'referrals'
                      ? 'text-[#00c685]'
                      : isLight
                      ? 'text-gray-500 hover:text-gray-900'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {isFinance
                    ? `Financial Referrals (${participantReports.filter((r) => r.source === 'finance').length})`
                    : isManagement
                    ? `Executive Disciplinary Audit (${participantReports.length})`
                    : `Referrals & Flags (${participantReports.length || selectedParticipant.flagCount || 0})`}
                  {drawerTab === 'referrals' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c685] rounded-full" />
                  )}
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {drawerTab === 'overview' && (
                  <>
                    {/* Section 1: CONTACT & ADDRESS */}
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                        CONTACT &amp; ADDRESS
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-medium">Email Address</span>
                          <div className="flex items-center gap-2 font-semibold">
                            <Mail size={13} className="text-gray-400" />
                            <span>{selectedParticipant.email}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-medium">Phone</span>
                          <div className="flex items-center gap-2 font-semibold">
                            <Phone size={13} className="text-gray-400" />
                            <span>{selectedParticipant.phone}</span>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <span className="text-[10px] text-gray-400 font-medium">Insured Residential Property</span>
                          <div className="flex items-center gap-2 font-semibold">
                            <Home size={13} className="text-gray-400" />
                            <span>{selectedParticipant.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: TAKAFUL CERTIFICATES */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                          TAKAFUL CERTIFICATES ({activeCert ? 1 : 0})
                        </h3>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          ✓ Sharia Verified
                        </span>
                      </div>

                      {activeCert ? (
                        <div
                          className={`p-4 rounded-xl border ${
                            isLight ? 'bg-white border-gray-200' : 'bg-white/[0.02] border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                            <span className="font-mono font-bold text-sm text-[#00c685]">{activeCert.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                            <div>
                              <span className="text-[10px] text-gray-400">Cover Type</span>
                              <p className="font-semibold mt-0.5">{activeCert.coverType} Cover</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400">Monthly Contribution</span>
                              <p className="font-bold text-[#00c685] mt-0.5">£{activeCert.monthlyContribution.toFixed(2)}/mo</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400">Excess Threshold</span>
                              <p className="font-semibold mt-0.5">£{activeCert.compulsoryExcess} (Clause 4.2)</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400">Term Expiry</span>
                              <p className="font-semibold mt-0.5">{activeCert.renewalDate}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No active certificates found.</p>
                      )}
                    </div>

                    {/* Section 3: PARTICIPANT ASSESSMENT FILE */}
                    <div className="border-2 border-dashed border-sky-400/80 bg-sky-50/50 dark:bg-sky-950/20 p-4 rounded-xl space-y-1.5">
                      <div className="text-[10px] font-mono font-bold tracking-wider text-sky-700 dark:text-sky-300">
                        PARTICIPANT ASSESSMENT FILE
                      </div>
                      <p className="text-xs leading-relaxed text-sky-950 dark:text-sky-100">
                        {selectedParticipant.notes || 'Exemplary participant. Standard single storm damage claim processed smoothly.'}
                      </p>
                    </div>
                  </>
                )}

                {/* Contributions Tab (Finance & Management ONLY) */}
                {drawerTab === 'contributions' && (isFinance || isManagement) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                        DIRECT DEBIT &amp; POOL CONTRIBUTIONS
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        BACS Mandate: ACTIVE-DD-88
                      </span>
                    </div>

                    {/* Direct Debit Summary Card */}
                    <div
                      className={`p-4 rounded-xl border space-y-3 ${
                        isLight ? 'bg-gray-50/70 border-gray-200' : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 dark:border-white/5">
                        <div>
                          <div className="text-[10px] text-gray-400">Current Monthly Contribution</div>
                          <div className="text-xl font-bold text-[#00c685] mt-0.5">
                            £{getParticipantMonthly(selectedParticipant).toFixed(2)}
                            <span className="text-xs font-normal text-gray-500"> / month</span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            getParticipantDDStatus(selectedParticipant).color === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {getParticipantDDStatus(selectedParticipant).label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400">Collection Cycle</span>
                          <p className="font-semibold mt-0.5">1st of Month</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400">Payment Channel</span>
                          <p className="font-semibold mt-0.5">Direct Debit (BACS)</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400">Tabarru Mutual Share</span>
                          <p className="font-semibold text-emerald-600 mt-0.5">100% Sharia Compliant</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400">Surplus Rebate Status</span>
                          <p className="font-semibold mt-0.5">Eligible at Fiscal Close</p>
                        </div>
                      </div>
                    </div>

                    {/* Contribution Ledger */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Recent Contribution Ledger
                      </h4>
                      {participantContributions.length === 0 ? (
                        <div
                          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                            isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div>
                            <span className="font-mono font-bold text-xs">CONT-2024-8801</span>
                            <div className="text-[10px] text-gray-400">1 Jul 2026 · Direct Debit</div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-xs">
                              £{getParticipantMonthly(selectedParticipant).toFixed(2)}
                            </span>
                            <div className="text-[10px] text-emerald-600 font-semibold">Collected</div>
                          </div>
                        </div>
                      ) : (
                        participantContributions.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                              isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold">{c.id}</span>
                                <span className="text-gray-400">·</span>
                                <span className="text-gray-500">{c.dueDate}</span>
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5">Method: {c.method}</div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-xs">£{c.amount.toFixed(2)}</span>
                              <div>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                                    c.status === 'Collected'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-rose-50 text-rose-700'
                                  }`}
                                >
                                  {c.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Claims Tab (Claim Handler & Management ONLY) */}
                {drawerTab === 'claims' && (isClaimHandler || isManagement) && (
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                      INCIDENT &amp; LOSS HISTORY
                    </h3>
                    {participantClaims.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">No claim records registered.</div>
                    ) : (
                      participantClaims.map((c) => (
                        <div
                          key={c.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                            isLight ? 'bg-gray-50/70 border-gray-200' : 'bg-white/[0.02] border-white/10'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#00c685]">{c.id}</span>
                              <span className="text-gray-400">·</span>
                              <span className="font-medium">{c.type}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">{c.submittedDate}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-sm">£{c.amountClaimed.toLocaleString()}</span>
                            <div className="mt-1">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {c.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Referrals & Audit Tab */}
                {drawerTab === 'referrals' && (
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                      {isFinance
                        ? 'FINANCIAL AUDIT & REFERRAL LOG'
                        : isManagement
                        ? 'EXECUTIVE DISCIPLINARY & REFERRAL AUDIT'
                        : 'DISCIPLINARY & REFERRAL AUDIT'}
                    </h3>
                    {participantReports.length === 0 ? (
                      <div
                        className={`p-4 rounded-xl border text-xs space-y-2 ${
                          isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 dark:text-emerald-200">Member in Good Standing</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                            0 Flags
                          </span>
                        </div>
                        <p className="text-emerald-900/80 dark:text-emerald-200/80 text-[11px]">
                          No active disciplinary referrals or financial reports logged for this member.
                        </p>
                      </div>
                    ) : (
                      participantReports.map((r) => (
                        <div
                          key={r.id}
                          className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                            isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-950/20 border-amber-500/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.source === 'finance'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {r.source === 'finance' ? 'Finance Report' : 'Claims Referral'}
                              </span>
                              <span className="font-mono text-gray-400 text-[11px]">{r.id}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                              {r.status}
                            </span>
                          </div>

                          <div className="font-bold text-gray-900 dark:text-white text-xs">{r.category}</div>
                          <p className="text-gray-600 dark:text-white/70 text-[11px] leading-relaxed">{r.notes}</p>

                          {r.auditReference && (
                            <div className="text-[10px] text-gray-400 font-mono">
                              Audit / Ref: {r.auditReference}
                            </div>
                          )}

                          <div className="pt-2 border-t border-amber-200/60 dark:border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                            <span>Reporter: {r.reporterName}</span>
                            <span>{r.createdAt}</span>
                          </div>

                          {r.preActionDetails && (
                            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 space-y-1">
                              <div className="font-bold flex items-center gap-1.5">
                                <Gavel size={12} />
                                Management Pre-Action: {r.preActionDetails.action}
                              </div>
                              <p className="text-[10px] opacity-80">{r.preActionDetails.notes}</p>
                              <div className="text-[9px] opacity-60">By {r.preActionDetails.takenBy} · {r.preActionDetails.date}</div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Bottom Footer (Strictly role-specific) */}
              <div
                className="p-4 border-t space-y-3 shrink-0"
                style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)' }}
              >
                {/* Role-specific disclaimer */}
                <div
                  className={`border rounded-xl p-3 text-xs flex items-start gap-2.5 ${
                    isFinance
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                      : isManagement
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                      : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/80 text-sky-900 dark:text-sky-200'
                  }`}
                >
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    {isFinance ? (
                      <>
                        <span className="font-bold">Finance Clearance:</span> You have read and audit access to member contribution ledgers. To flag default, arrears, or AML anomalies, submit a Financial Report to Management.
                      </>
                    ) : isManagement ? (
                      <>
                        <span className="font-bold">Operations Management Authority:</span> You have executive authority to review referrals, enact protective pre-actions, or execute suspension / expulsion sanctions.
                      </>
                    ) : (
                      <>
                        <span className="font-bold">Claim Handler Clearance:</span> You have read-only access to member files. To request disciplinary sanctions, submit an Investigation Referral to Management.
                      </>
                    )}
                  </p>
                </div>

                {/* Role-specific action button */}
                {isManagement ? (
                  <button
                    onClick={() => setMgmtActionParticipant(selectedParticipant)}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <Gavel size={14} />
                    Open Management Action &amp; Pre-action Console
                  </button>
                ) : isFinance ? (
                  <button
                    onClick={() => setReportModalParticipant(selectedParticipant)}
                    className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <Flag size={14} className="text-blue-600" />
                    Report Financial Irregularity to Management
                  </button>
                ) : (
                  <button
                    onClick={() => setReportModalParticipant(selectedParticipant)}
                    className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <Flag size={14} className="text-rose-600" />
                    Refer Participant to Management (Report Claim Irregularity)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Report Modal (Claims Specialist OR Finance Team) ── */}
      <AnimatePresence>
        {reportModalParticipant && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportModalParticipant(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative z-10 w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-4 ${
                isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0d2117] border-white/10 text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isFinance
                        ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-600'
                    }`}
                  >
                    <Flag size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      {isFinance
                        ? 'Submit Financial Irregularity Report'
                        : 'Submit Investigation Referral'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Target: {reportModalParticipant.name} ({reportModalParticipant.id})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReportModalParticipant(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Category Selection */}
                <div>
                  <label className="font-semibold block mb-1">
                    {isFinance ? 'Financial Irregularity Category' : 'Referral Reason'}
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-gray-50 border-gray-300' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    {isFinance ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <option value="Suspected policy irregularity / undisclosed risk factors">
                          Suspected policy irregularity / undisclosed risk factors
                        </option>
                        <option value="Repeated high-frequency claims across short period">
                          Repeated high-frequency claims across short period
                        </option>
                        <option value="Payment mandate default / arrears dispute">
                          Payment mandate default / arrears dispute
                        </option>
                        <option value="Fabricated documentation / invoice inconsistency">
                          Fabricated documentation / invoice inconsistency
                        </option>
                        <option value="Dual claim submission across insurers (Fraud risk)">
                          Dual claim submission across insurers (Fraud risk)
                        </option>
                      </>
                    )}
                  </select>
                </div>

                {/* Finance Specific Fields */}
                {isFinance && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">BACS / Mandate Reference</label>
                      <input
                        type="text"
                        value={reportAuditRef}
                        onChange={(e) => setReportAuditRef(e.target.value)}
                        placeholder="e.g. MAND-8808 / RETRY-2"
                        className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                          isLight ? 'bg-gray-50 border-gray-300' : 'bg-white/5 border-white/10'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Disputed Amount (£)</label>
                      <input
                        type="number"
                        value={reportAmount}
                        onChange={(e) => setReportAmount(e.target.value)}
                        placeholder="e.g. 96.00"
                        className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                          isLight ? 'bg-gray-50 border-gray-300' : 'bg-white/5 border-white/10'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Audit Notes */}
                <div>
                  <label className="font-semibold block mb-1">
                    {isFinance
                      ? 'Finance Officer Audit & Reconciliation Notes'
                      : 'Handler Investigation Notes'}
                  </label>
                  <textarea
                    rows={3}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder={
                      isFinance
                        ? 'Detail BACS rejection codes, ledger discrepancies, or AML observations for Operations Management...'
                        : 'Provide specific incident numbers, dates, or forensic observations for Operations Management...'
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none resize-none ${
                      isLight ? 'bg-gray-50 border-gray-300' : 'bg-white/5 border-white/10'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setReportModalParticipant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReport}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isFinance
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <Send size={12} /> Confirm &amp; Route to Management
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Management Action Console Modal (Only for Management) ── */}
      <AnimatePresence>
        {isManagement && mgmtActionParticipant && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMgmtActionParticipant(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative z-10 w-full max-w-2xl rounded-2xl p-6 border shadow-2xl space-y-5 ${
                isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0d2117] border-white/10 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
                    <Gavel size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Executive Management Disciplinary Console</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Reviewing: {mgmtActionParticipant.name} ({mgmtActionParticipant.id}) · Authorized: Ahmed Khan (Operations Director)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMgmtActionParticipant(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Submitted Reports Review */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Submitted Department Reports ({reports.filter((r) => r.participantId === mgmtActionParticipant.id).length})
                  </h4>
                  <span className="text-[10px] text-gray-400">Claims &amp; Finance Sources</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {reports.filter((r) => r.participantId === mgmtActionParticipant.id).length === 0 ? (
                    <div className="p-3 text-xs text-gray-400 text-center bg-gray-50 dark:bg-white/5 rounded-xl">
                      No active incident reports logged for this participant.
                    </div>
                  ) : (
                    reports
                      .filter((r) => r.participantId === mgmtActionParticipant.id)
                      .map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            rep.source === 'finance'
                              ? isLight
                                ? 'bg-blue-50/70 border-blue-200'
                                : 'bg-blue-950/20 border-blue-500/20'
                              : isLight
                              ? 'bg-rose-50/70 border-rose-200'
                              : 'bg-rose-950/20 border-rose-500/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  rep.source === 'finance' ? 'bg-blue-500' : 'bg-rose-500'
                                }`}
                              />
                              {rep.category}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">{rep.createdAt}</span>
                          </div>
                          <p className="text-[11px] opacity-85 leading-relaxed">{rep.notes}</p>
                          <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1">
                            <span>From: {rep.reporterName} ({rep.reporterRole})</span>
                            {rep.auditReference && <span>Ref: {rep.auditReference}</span>}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Management Notes */}
              <div>
                <label className="font-semibold block text-xs mb-1">Executive Disciplinary Notes</label>
                <input
                  type="text"
                  value={mgmtActionNotes}
                  onChange={(e) => setMgmtActionNotes(e.target.value)}
                  placeholder="Reasoning, review memo, or grace conditions for participant record..."
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-gray-50 border-gray-300' : 'bg-white/5 border-white/10'
                  }`}
                />
              </div>

              {/* Action Tier 1: Pre-Actions (Before Ban/Suspend) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Tier 1: Interim Pre-Actions (Mitigation &amp; Due Process)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Before Ban / Suspend
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleExecutePreAction('Formal Warning Notice')}
                    className="p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-start gap-2.5 shadow-xs"
                  >
                    <Mail size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div>Issue 7-Day Warning Notice</div>
                      <p className="text-[10px] font-normal text-amber-900/80 mt-0.5">
                        Formal breach notice with 7-day rectification window.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExecutePreAction('Freeze Claims Payouts')}
                    className="p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-start gap-2.5 shadow-xs"
                  >
                    <PauseCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div>Freeze Claims Payouts</div>
                      <p className="text-[10px] font-normal text-amber-900/80 mt-0.5">
                        Hold mutual pool disbursements while policy remains in force.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExecutePreAction('Pause Direct Debit')}
                    className="p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-start gap-2.5 shadow-xs"
                  >
                    <CreditCard size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div>Pause Direct Debit &amp; Demand Proof</div>
                      <p className="text-[10px] font-normal text-amber-900/80 mt-0.5">
                        Halt auto-debit and require certified bank validation.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExecutePreAction('Forensic Audit')}
                    className="p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-left transition-all cursor-pointer flex items-start gap-2.5 shadow-xs"
                  >
                    <FileWarning size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div>Escalate to Sharia &amp; AML Audit</div>
                      <p className="text-[10px] font-normal text-amber-900/80 mt-0.5">
                        Refer to internal audit committee for forensic verification.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Tier 2: Final Sanctions & Dismissal */}
              <div className="space-y-2.5 pt-2 border-t border-gray-200 dark:border-white/10">
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Tier 2: Final Disciplinary Sanctions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleExecuteFinalAction('Suspend Account')}
                    className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldAlert size={14} className="text-rose-600" />
                    Suspend Cover
                  </button>

                  <button
                    onClick={() => handleExecuteFinalAction('Permanent Ban')}
                    className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Ban size={14} />
                    Permanent Ban &amp; Expel
                  </button>

                  <button
                    onClick={() => handleExecuteFinalAction('Dismiss Referral')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCheck size={14} className="text-emerald-600" />
                    Dismiss &amp; Clear
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
