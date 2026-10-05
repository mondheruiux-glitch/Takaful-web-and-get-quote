'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Search, CheckCircle2, RefreshCw, X,
  Building2, ShieldCheck, AlertCircle, Loader2, Info, ChevronRight,
  Clock, AlertTriangle, Phone, Mail, Lock, ArrowRight,
  CheckCheck, ShieldAlert, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { AreaChart } from '@/components/charts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { useTheme, useRole } from '../ThemeRoleContext';
import { CONTRIBUTIONS, CONTRIBUTION_TREND } from '@/lib/dashboard/mock-data';
import { Contribution } from '@/lib/dashboard/types';
import {
  getSynchronizedContributions,
  reconcileContribution,
  SYNC_EVENT_NAME,
} from '@/lib/dashboard/reconciliation-sync';
import { ParticipantChip } from '@/components/ui/ParticipantChip';


const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};
const GREEN = '#00c685';

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmtSort = (v: string) => v.replace(/\D/g, '').slice(0, 6).replace(/(\d{2})(?=\d)/g, '$1-').slice(0, 8);
const fmtAcc  = (v: string) => v.replace(/\D/g, '').slice(0, 8);

/* ─── StatusBadge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const isPaid = status === 'Paid' || status === 'Collected';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isPaid
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
        : status === 'Failed'
        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
        : status === 'Retried'
        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
}

/* ─── Payment Failed Hero (Inside Contribution Drawer) ─────────────────────── */
function PaymentFailedHero({
  isLight,
  contribution,
  daysLeft = 11,
}: {
  isLight: boolean;
  contribution: Contribution;
  daysLeft?: number;
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const pct = Math.round(((14 - daysLeft) / 14) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Status Hero */}
      <div className={`rounded-2xl border p-4 sm:p-5 ${
        isLight ? 'bg-rose-50/70 border-rose-200/70' : 'bg-rose-950/20 border-rose-500/25'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${
            isLight ? 'bg-rose-100 text-rose-600' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <AlertTriangle size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${isLight ? 'text-rose-900' : 'text-rose-300'}`}>
              Payment failed
            </p>
            <p className={`text-base font-extrabold mt-0.5 ${isLight ? 'text-rose-950' : 'text-white'}`}>
              £{contribution.amount.toFixed(2)} contribution could not be collected
            </p>
            <p className={`text-xs mt-1.5 ${isLight ? 'text-rose-800/80' : 'text-rose-300/80'}`}>
              {contribution.participantName} · Policy {contribution.certificateId}
            </p>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-rose-800/70' : 'text-rose-400/70'}`}>
              Direct Debit failed on {contribution.dueDate}
            </p>

            {/* Grace period countdown */}
            <div className={`mt-3 pt-3 border-t ${
              isLight ? 'border-rose-200/60' : 'border-rose-500/20'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-semibold ${isLight ? 'text-rose-800' : 'text-rose-300'}`}>
                  <Clock size={11} className="inline mr-1" />
                  {daysLeft} days left to make the payment
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isLight ? 'bg-rose-200 text-rose-900' : 'bg-rose-500/25 text-rose-300'
                }`}>
                  Day {14 - daysLeft} of 14
                </span>
              </div>
              <div className={`h-1.5 rounded-full ${isLight ? 'bg-rose-200' : 'bg-rose-900/50'}`}>
                <div
                  className="h-full rounded-full bg-rose-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className={`flex items-center gap-1.5 mt-2 text-[11px] ${
                isLight ? 'text-rose-800/80' : 'text-rose-300/80'
              }`}>
                <ShieldCheck size={11} className="shrink-0" />
                Cover is still active — claims remain payable during this period
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "What does this mean?" expandable */}
      <div className={`rounded-xl border overflow-hidden ${
        isLight ? 'bg-white border-black/[0.07]' : 'bg-white/[0.02] border-white/[0.07]'
      }`}>
        <button
          onClick={() => setHelpOpen(h => !h)}
          className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition-colors ${
            isLight ? 'text-black/70 hover:bg-black/[0.02]' : 'text-white/65 hover:bg-white/[0.03]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Info size={13} className="text-[#00c685]" />
            What does this mean?
          </span>
          <ChevronRight
            size={13}
            className={`transition-transform duration-200 ${helpOpen ? 'rotate-90' : ''}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {helpOpen && (
            <motion.div
              key="help"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className={`px-4 pb-4 pt-1 text-[11px] leading-relaxed space-y-2 border-t ${
                isLight ? 'border-black/[0.06] text-black/60' : 'border-white/[0.06] text-white/55'
              }`}>
                <p>
                  The participant's Direct Debit was unsuccessful — their bank returned the payment.
                  Their cover is <span className="font-semibold">currently still active</span>, but the outstanding
                  £{contribution.amount.toFixed(2)} contribution needs to be paid within the 14-day grace period.
                </p>
                <p>
                  During this time, we will try to collect the payment again automatically. If that also fails,
                  the participant can pay manually via card or bank transfer.
                </p>
                <p className={`font-semibold ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  If the contribution remains unpaid after 14 days, the policy may be placed on hold.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Payment Recovery Journey (Inside Contribution Drawer) ────────────────── */
function PaymentRecoveryJourney({
  isLight,
  contribution,
  retryCount,
  onRetry,
  onEscalate,
  onReconcile,
  retried,
}: {
  isLight: boolean;
  contribution: Contribution;
  retryCount: number;
  onRetry: () => void;
  onEscalate: () => void;
  onReconcile?: () => void;
  retried: boolean;
}) {
  const steps = [
    {
      id: 'failed',
      label: 'Payment failed',
      sublabel: `Direct Debit returned on ${contribution.dueDate}`,
      state: 'done-bad' as const,
      detail: `The bank returned the Direct Debit payment of £${contribution.amount.toFixed(2)}. Reference: DD-${contribution.certificateId.slice(-4)}-JUL.`,
    },
    {
      id: 'retry',
      label: retried ? 'Tried payment again' : 'Try payment again',
      sublabel: retried
        ? `Attempt ${retryCount} of 3 sent — bank has up to 5 working days to confirm`
        : `Attempt ${retryCount} of 3 remaining`,
      state: retried ? ('done-good' as const) : ('active' as const),
      detail: retried
        ? `A retry request was sent to the participant's bank. You will be notified once confirmed.`
        : `Re-present the Direct Debit to the participant's bank. They have up to 5 working days to process it.`,
      action: !retried ? (
        <button
          onClick={onRetry}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00c685] hover:bg-[#00b076] text-white text-[11px] font-bold transition-all shadow-sm"
        >
          <RefreshCw size={11} /> Try payment again
        </button>
      ) : null,
    },
    {
      id: 'notified',
      label: 'Participant notified',
      sublabel: `${contribution.participantName} emailed and texted about the outstanding contribution`,
      state: 'done-good' as const,
      detail: 'A grace period notice was sent by email and SMS. The participant was informed of their outstanding balance and given 14 days to resolve it.',
    },
    {
      id: 'pays',
      label: 'Participant pays',
      sublabel: 'If participant pays by card or bank transfer',
      state: 'pending' as const,
      detail: `If ${contribution.participantName} pays directly, reconcile the payment in the Treasury Cash Book to close this case and update status to Collected.`,
      action: (
        <div className="flex items-center gap-2 flex-wrap mt-2.5">
          {onReconcile && (
            <button
              onClick={onReconcile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00c685] hover:bg-[#00a871] text-white text-[11px] font-bold transition-all shadow-sm cursor-pointer"
            >
              <CheckCircle2 size={12} /> Reconcile Payment Now
            </button>
          )}
          <Link
            href="/dashboard/transactions"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
              isLight
                ? 'border-black/12 text-black/70 hover:border-[#00c685] hover:text-[#00c685]'
                : 'border-white/15 text-white/60 hover:border-[#00c685] hover:text-[#00c685]'
            }`}
          >
            <ArrowRight size={11} /> View in Treasury Cash Book
          </Link>
        </div>
      ),
    },
    {
      id: 'hold',
      label: retryCount >= 3 ? 'Policy may be placed On Hold — action needed' : 'Policy may be placed On Hold',
      sublabel: retryCount >= 3
        ? 'Maximum retry attempts reached — escalate to Management'
        : 'Only if all retries fail and the 14-day period expires',
      state: retryCount >= 3 ? ('active' as const) : ('future' as const),
      detail: retryCount >= 3
        ? 'All 3 retry attempts have failed. The policy needs to be reviewed by Management before it can be placed on hold or cancelled.'
        : 'This will only happen if the participant does not pay and all retry attempts fail. No action is needed at this stage.',
      action: retryCount >= 3 ? (
        <button
          onClick={onEscalate}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-[11px] font-bold transition-all shadow-sm"
        >
          <ShieldAlert size={11} /> Escalate to Management
        </button>
      ) : null,
    },
  ];

  const stateStyles = {
    'done-good': {
      dot: 'bg-emerald-500',
      icon: <CheckCircle2 size={12} className="text-white" />,
      label: isLight ? 'text-black/85' : 'text-white/90',
      sub: isLight ? 'text-black/50' : 'text-white/45',
      detail: isLight ? 'text-black/55' : 'text-white/50',
      connector: 'bg-emerald-500/40',
    },
    'done-bad': {
      dot: 'bg-rose-500',
      icon: <AlertTriangle size={11} className="text-white" />,
      label: isLight ? 'text-rose-900' : 'text-rose-300',
      sub: isLight ? 'text-rose-700/70' : 'text-rose-400/70',
      detail: isLight ? 'text-rose-800/60' : 'text-rose-300/60',
      connector: isLight ? 'bg-black/10' : 'bg-white/10',
    },
    'active': {
      dot: 'bg-amber-500',
      icon: <RefreshCw size={11} className="text-white" />,
      label: isLight ? 'text-amber-900' : 'text-amber-300',
      sub: isLight ? 'text-amber-800/70' : 'text-amber-400/70',
      detail: isLight ? 'text-amber-900/60' : 'text-amber-300/60',
      connector: isLight ? 'bg-black/10' : 'bg-white/10',
    },
    'pending': {
      dot: isLight ? 'bg-black/20' : 'bg-white/20',
      icon: null,
      label: isLight ? 'text-black/70' : 'text-white/65',
      sub: isLight ? 'text-black/40' : 'text-white/40',
      detail: isLight ? 'text-black/50' : 'text-white/45',
      connector: isLight ? 'bg-black/10' : 'bg-white/10',
    },
    'future': {
      dot: isLight ? 'bg-black/10' : 'bg-white/10',
      icon: null,
      label: isLight ? 'text-black/40' : 'text-white/35',
      sub: isLight ? 'text-black/30' : 'text-white/30',
      detail: isLight ? 'text-black/35' : 'text-white/30',
      connector: isLight ? 'bg-black/[0.06]' : 'bg-white/[0.06]',
    },
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${
      isLight ? 'bg-white border-black/[0.07]' : 'bg-[#0d2117] border-white/[0.07]'
    }`}>
      <p className={`text-xs font-bold mb-4 ${isLight ? 'text-black/70' : 'text-white/65'}`}>
        Payment recovery — what happens next
      </p>
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const s = stateStyles[step.state];
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.id} className="flex gap-3">
              {/* Timeline spine */}
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                  step.state === 'done-good' || step.state === 'done-bad' || step.state === 'active'
                    ? s.dot
                    : s.dot
                } text-white`}>
                  {s.icon ?? <span className={isLight ? 'text-black/40' : 'text-white/40'}>{idx + 1}</span>}
                </div>
                {!isLast && (
                  <div className={`w-px flex-1 my-1.5 ${s.connector}`} style={{ minHeight: '16px' }} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-4 min-w-0 ${isLast ? '' : ''}`}>
                <p className={`text-xs font-bold leading-tight ${s.label}`}>{step.label}</p>
                <p className={`text-[11px] mt-0.5 leading-relaxed ${s.sub}`}>{step.sublabel}</p>
                {step.detail && step.state !== 'future' && (
                  <p className={`text-[11px] mt-1.5 leading-relaxed ${s.detail}`}>{step.detail}</p>
                )}
                {step.action}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Quick Reply Panel (Inside Contribution Drawer) ──────────────────────── */
function QuickReplyPanel({
  isLight,
  contribution,
  onSend,
}: {
  isLight: boolean;
  contribution: Contribution;
  onSend: (msg: string) => void;
}) {
  const replies = [
    {
      id: 'mandate',
      label: 'Mandate Updated',
      text: `Hello ${contribution.participantName}, your Direct Debit mandate has been updated and will take effect from your next billing date.`,
    },
    {
      id: 'payment',
      label: 'Payment Confirmed',
      text: `Hello ${contribution.participantName}, we have confirmed receipt of your payment for Policy ${contribution.certificateId}. Your coverage remains fully active.`,
    },
    {
      id: 'grace',
      label: 'Grace Period Notice',
      text: `Urgent: Direct Debit for Policy ${contribution.certificateId} was unsuccessful. You have 14 days to resolve the balance of £${contribution.amount.toFixed(2)} before coverage is placed on hold.`,
    },
    {
      id: 'retry',
      label: 'BACS Retry Notice',
      text: `Hello ${contribution.participantName}, we have re-presented your Direct Debit of £${contribution.amount.toFixed(2)} to your bank. Please ensure funds are available within 5 working days.`,
    },
  ];

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${isLight ? 'bg-white border-black/[0.07]' : 'bg-[#0d2117] border-white/[0.07]'}`}>
      <div className="flex items-center gap-2 mb-3.5">
        <Mail size={14} className="text-[#00c685] shrink-0" />
        <h3 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-black/85' : 'text-white/90'}`}>
          Direct Participant Quick Replies
        </h3>
        <Link href="/dashboard/support" className="ml-auto text-[11px] text-[#00c685] flex items-center gap-0.5 hover:underline">
          Finance Inbox <ExternalLink size={10} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {replies.map((r) => (
          <button
            key={r.id}
            onClick={() => onSend(r.text)}
            className={`flex flex-col gap-1 p-2.5 sm:p-3 rounded-xl border text-left transition-all hover:border-[#00c685]/50 ${
              isLight ? 'border-black/[0.08] hover:bg-[#00c685]/[0.05]' : 'border-white/[0.08] hover:bg-[#00c685]/[0.08]'
            }`}
          >
            <span className="text-[11px] font-bold text-[#00c685]">{r.label}</span>
            <span className={`text-[10px] leading-relaxed line-clamp-2 ${isLight ? 'text-black/60' : 'text-white/50'}`}>{r.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Contribution Detail Slide-Over Drawer ──────────────────────────────── */
function ContributionDetailDrawer({
  contribution,
  isLight,
  onClose,
  retryCount,
  retried,
  onRetry,
  onEscalate,
  escalated,
  onReconcile,
  onSendReply,
  sentReply,
}: {
  contribution: Contribution | null;
  isLight: boolean;
  onClose: () => void;
  retryCount: number;
  retried: boolean;
  onRetry: (id: string) => void;
  onEscalate: () => void;
  escalated: boolean;
  onReconcile?: (id: string) => void;
  onSendReply: (msg: string) => void;
  sentReply: string | null;
}) {
  if (!contribution) return null;

  const isFailed = contribution.status === 'Failed';
  const isRetried = contribution.status === 'Retried';
  const isCollected = contribution.status === 'Collected';

  return (
    <div className="fixed inset-0 z-[600] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Slide-over panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className={`relative z-10 w-full max-w-xl h-full flex flex-col shadow-2xl border-l overflow-hidden ${
          isLight ? 'bg-[#fcfdfd] border-gray-200' : 'bg-[#0a1a13] border-white/10'
        }`}
      >
        {/* Sticky Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#0e2219] border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isFailed
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : isRetried
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isFailed ? <AlertTriangle size={18} /> : isRetried ? <RefreshCw size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#00c685]">{contribution.id}</span>
                <StatusBadge status={contribution.status} />
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-600' : 'text-white/55'}`}>
                {contribution.participantName} · {contribution.certificateId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'border-gray-200 hover:bg-gray-100 text-gray-500' : 'border-white/10 hover:bg-white/10 text-white/60'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Key Facts Strip */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl border text-xs ${
            isLight ? 'bg-white border-gray-200/80 shadow-sm' : 'bg-white/[0.02] border-white/10'
          }`}>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/40'}`}>Amount</p>
              <p className={`text-base font-extrabold mt-0.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>£{contribution.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/40'}`}>Due Date</p>
              <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-800' : 'text-white/90'}`}>{contribution.dueDate}</p>
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/40'}`}>Method</p>
              <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-800' : 'text-white/90'}`}>{contribution.method ?? 'Direct Debit'}</p>
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/40'}`}>Retries</p>
              <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-gray-800' : 'text-white/90'}`}>
                {contribution.retryCount !== undefined ? `${contribution.retryCount}/3` : '0/3'}
              </p>
            </div>
          </div>

          {/* If Failed or Retried: Display redesigned human-centered UX */}
          {(isFailed || isRetried) && (
            <>
              {/* Payment Failed Hero + Grace Period + Help */}
              <PaymentFailedHero isLight={isLight} contribution={contribution} daysLeft={11} />

              {/* Payment Recovery Journey */}
              <PaymentRecoveryJourney
                isLight={isLight}
                contribution={contribution}
                retryCount={retryCount}
                retried={retried}
                onRetry={() => onRetry(contribution.id)}
                onEscalate={onEscalate}
                onReconcile={onReconcile ? () => onReconcile(contribution.id) : undefined}
              />

              {/* Escalation Notice */}
              <AnimatePresence>
                {escalated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-2xl border p-4 flex items-start gap-3 ${
                      isLight ? 'bg-red-50 border-red-200' : 'bg-red-950/25 border-red-500/30'
                    }`}
                  >
                    <Lock size={15} className="text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className={`text-xs font-bold ${isLight ? 'text-red-900' : 'text-red-300'}`}>
                        Policy {contribution.certificateId} escalated to Management
                      </p>
                      <p className={`text-[11px] mt-1 ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                        Ahmed Khan has been notified. Certificate status will be set to <strong>On Hold</strong> pending resolution.{' '}
                        <Link href="/dashboard/certificates" className="underline font-semibold hover:text-red-200">
                          View Certificate →
                        </Link>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Support Quick Replies */}
              <QuickReplyPanel isLight={isLight} contribution={contribution} onSend={onSendReply} />

              {/* Sent reply confirmation */}
              <AnimatePresence>
                {sentReply && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-xl p-3.5 border flex items-start gap-2 ${
                      isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/25 border-emerald-500/30'
                    }`}
                  >
                    <Mail size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className={`text-[11px] font-bold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                        Notice dispatched to {contribution.participantName}
                      </p>
                      <p className={`text-[11px] mt-0.5 italic ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                        &quot;{sentReply}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* If Collected: Show Cleared Details */}
          {isCollected && (
            <div className={`rounded-2xl border p-5 space-y-4 ${
              isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/[0.02] border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Direct Debit Cleared & Reconciled</p>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                    Collected on {contribution.collectedDate ?? contribution.dueDate} via BACS
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/25 border-white/[0.04]'
              }`}>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-gray-500' : 'text-white/40'}>BACS Settlement Ref</span>
                  <span className="font-mono font-semibold text-emerald-400">BACS-SETTL-{contribution.id.slice(-4)}-OK</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-gray-500' : 'text-white/40'}>Participant Fund Allocation (70%)</span>
                  <span className="font-semibold">£{(contribution.amount * 0.7).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-gray-500' : 'text-white/40'}>Claims Reserve Allocation (15%)</span>
                  <span className="font-semibold">£{(contribution.amount * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-gray-500' : 'text-white/40'}>Wakāla Management Fee (15%)</span>
                  <span className="font-semibold">£{(contribution.amount * 0.15).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/dashboard/transactions"
                  className={`flex-1 py-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                    isLight ? 'border-gray-300 hover:bg-gray-50 text-gray-700' : 'border-white/10 hover:bg-white/5 text-white/80'
                  }`}
                >
                  View in Treasury Cash Book
                </Link>
                <Link
                  href="/dashboard/certificates"
                  className="flex-1 py-2.5 rounded-xl text-center text-xs font-semibold bg-[#00c685] hover:bg-[#00b076] text-white transition-all shadow-sm"
                >
                  View Policy Certificate
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Bank Mandate Modal ─────────────────────────────────────────────────── */
interface MandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { bankName: string; sortCode: string; accountNumber: string }) => void;
  existing?: { bankName: string; sortCode: string; last4: string };
  theme: string;
}

function BankMandateModal({ isOpen, onClose, onSuccess, existing, theme }: MandateModalProps) {
  const isLight = theme === 'light';
  const BG_MODAL   = isLight ? '#ffffff'              : 'rgba(10,26,20,0.90)';
  const BG_FIELD   = isLight ? 'rgba(0,0,0,0.03)'    : 'rgba(255,255,255,0.05)';
  const BORDER_COL = isLight ? '#E4E7EC'              : 'rgba(255,255,255,0.08)';
  const TEXT_MAIN  = isLight ? 'rgba(0,0,0,0.85)'    : '#ffffff';
  const TEXT_SUB   = isLight ? 'rgba(0,0,0,0.50)'    : 'rgba(255,255,255,0.55)';
  const TEXT_MUTED = isLight ? 'rgba(0,0,0,0.35)'    : 'rgba(255,255,255,0.30)';
  const INPUT_CLS  = isLight
    ? 'bg-black/[0.03] border-black/[0.08] text-black placeholder:text-black/30 focus-visible:border-[#00c685]/50 focus-visible:ring-0 text-sm h-9'
    : 'bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00c685]/40 focus-visible:ring-0 text-sm h-9';
  const LABEL_CLS  = isLight ? 'text-black/65 text-xs' : 'text-white/70 text-xs';
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ accountName: '', bankName: '', sortCode: '', accountNumber: '', confirmAccNum: '', agree: false });

  useEffect(() => {
    if (isOpen) { setStep(1); setDone(false); setSaving(false); setErrors({}); setForm({ accountName: '', bankName: '', sortCode: '', accountNumber: '', confirmAccNum: '', agree: false }); }
  }, [isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.accountName.trim())                          e.accountName   = 'Required';
    if (!form.bankName.trim())                             e.bankName      = 'Required';
    if (form.sortCode.replace(/-/g,'').length !== 6)       e.sortCode      = 'Must be 6 digits';
    if (form.accountNumber.length !== 8)                   e.accountNumber = 'Must be 8 digits';
    if (form.accountNumber !== form.confirmAccNum)         e.confirmAccNum = 'Numbers do not match';
    if (!form.agree)                                       e.agree         = 'You must authorise the mandate';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleConfirm = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setDone(true);
    setTimeout(() => { onSuccess({ bankName: form.bankName, sortCode: form.sortCode, accountNumber: form.accountNumber }); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget && !done) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm"
      >
        {done ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center shadow-2xl"
            style={{ background: BG_MODAL, border: `1px solid ${BORDER_COL}` }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${GREEN}20` }}>
              <CheckCircle2 size={28} color={GREEN} />
            </motion.div>
            <div>
              <p className="font-bold text-base" style={{ color: TEXT_MAIN }}>Mandate Updated!</p>
              <p className="text-xs mt-1" style={{ color: TEXT_SUB }}>Your Direct Debit for <span style={{ color: TEXT_MAIN }} className="font-medium">{form.bankName}</span> is confirmed.</p>
            </div>
          </div>

        ) : (
          <MultiStepForm
            size="sm"
            theme={theme === 'light' ? 'light' : 'dark'}
            currentStep={step}
            totalSteps={2}
            title={step === 1 ? 'Bank Details' : 'Confirm Mandate'}
            description={step === 1 ? 'Enter your UK bank account details.' : 'Review your details before confirming.'}
            onClose={onClose}
            onBack={() => step === 1 ? onClose() : setStep(1)}
            onNext={step === 1 ? handleNext : handleConfirm}
            backButtonText={step === 1 ? 'Cancel' : 'Back'}
            nextButtonText={saving ? 'Saving…' : step === 1 ? 'Review' : 'Confirm'}
            footerContent={<span className="flex items-center gap-1.5"><ShieldCheck size={11} color={GREEN} /> Protected by the Direct Debit Guarantee</span>}
          >
            {step === 1 ? (
              <div className="space-y-4">
                {existing && (
                  <Alert variant="info" layout="complex" icon={<Building2 size={14} color={GREEN} />}
                    className="border-[#00c685]/20 bg-[#00c685]/08">
                    <AlertDescription style={{ color: TEXT_SUB }} className="text-[11px]">
                      Current: <span style={{ color: TEXT_MAIN }} className="font-medium">{existing.bankName}</span> — {existing.sortCode} — ···· {existing.last4}
                    </AlertDescription>
                  </Alert>
                )}

                {[
                  { id: 'accountName',  label: 'Account Holder Name', ph: 'e.g. Mohammed Al-Rashid',  val: form.accountName,  fn: (v: string) => setForm(f => ({ ...f, accountName: v })) },
                  { id: 'bankName',     label: 'Bank Name',           ph: 'e.g. HSBC, Barclays…',      val: form.bankName,    fn: (v: string) => setForm(f => ({ ...f, bankName: v })) },
                ].map(({ id, label, ph, val, fn }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id} className={LABEL_CLS}>{label}</Label>
                    <Input id={id} value={val} onChange={e => fn(e.target.value)} placeholder={ph}
                      className={`${INPUT_CLS} ${errors[id] ? 'border-red-400/50' : ''}`} />
                    {errors[id] && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors[id]}</p>}
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="sortCode" className={LABEL_CLS}>Sort Code</Label>
                    <Input id="sortCode" value={form.sortCode} onChange={e => setForm(f => ({ ...f, sortCode: fmtSort(e.target.value) }))}
                      placeholder="12-34-56" maxLength={8}
                      className={`${INPUT_CLS} ${errors.sortCode ? 'border-red-400/50' : ''}`} />
                    {errors.sortCode && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.sortCode}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accountNumber" className={LABEL_CLS}>Account No.</Label>
                    <Input id="accountNumber" value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: fmtAcc(e.target.value) }))}
                      placeholder="12345678" maxLength={8}
                      className={`${INPUT_CLS} ${errors.accountNumber ? 'border-red-400/50' : ''}`} />
                    {errors.accountNumber && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.accountNumber}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmAccNum" className={LABEL_CLS}>Confirm Account No.</Label>
                  <Input id="confirmAccNum" value={form.confirmAccNum} onChange={e => setForm(f => ({ ...f, confirmAccNum: fmtAcc(e.target.value) }))}
                    placeholder="Re-enter account number" maxLength={8}
                    className={`${INPUT_CLS} ${errors.confirmAccNum ? 'border-red-400/50' : ''}`} />
                  {errors.confirmAccNum && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.confirmAccNum}</p>}
                </div>

                <label className={`flex gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${form.agree ? 'border-[#00c685]/30 bg-[#00c685]/08' : ''}`}
                  style={!form.agree ? { border: `1px solid ${BORDER_COL}` } : {}}>
                  <div onClick={() => setForm(f => ({ ...f, agree: !f.agree }))}
                    className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded flex items-center justify-center border transition-all ${form.agree ? 'bg-[#00c685] border-[#00c685]' : ''}`}
                    style={!form.agree ? { border: `1px solid ${BORDER_COL}`, background: BG_FIELD } : {}}>
                    {form.agree && <CheckCircle2 size={10} className="text-[#0a1a14]" strokeWidth={3} />}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: TEXT_SUB }}>
                    I authorise Takaful to collect contributions via <span className="text-[#00c685] font-semibold">Direct Debit Guarantee</span>. I can cancel at any time.
                  </p>
                </label>
                {errors.agree && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.agree}</p>}
              </div>

            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Account Holder', val: form.accountName },
                  { label: 'Bank',           val: form.bankName },
                  { label: 'Sort Code',      val: form.sortCode },
                  { label: 'Account No.',    val: `•••• ${form.accountNumber.slice(-4)}` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center px-4 py-2.5 rounded-xl"
                    style={{ background: BG_FIELD, border: `1px solid ${BORDER_COL}` }}>
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>{label}</span>
                    <span className="text-xs font-semibold" style={{ color: TEXT_MAIN }}>{val}</span>
                  </div>
                ))}

                <Alert variant="warning" layout="complex" icon={<ShieldCheck size={13} className="text-amber-400" />}
                  className="border-amber-400/20 bg-amber-400/05">
                  <AlertDescription className="text-[11px]" style={{ color: TEXT_SUB }}>
                    Your details are encrypted. This mandate replaces your existing payment method immediately.
                  </AlertDescription>
                </Alert>

                {saving && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs" style={{ color: TEXT_MUTED }}>
                    <Loader2 size={12} className="animate-spin" color={GREEN} /> Processing…
                  </div>
                )}
              </div>
            )}
          </MultiStepForm>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Mock Data matching screenshot ──────────────────────────────────────── */
const PARTICIPANT_CONTRIBUTIONS = [
  { id: 'CONT-2026-8812', dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8806', dueDate: '1 Jun 2026', collectedDate: '1 Jun 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8800', dueDate: '1 May 2026', collectedDate: '1 May 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8794', dueDate: '1 Apr 2026', collectedDate: '1 Apr 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8788', dueDate: '1 Mar 2026', collectedDate: '1 Mar 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8782', dueDate: '1 Feb 2026', collectedDate: '1 Feb 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8776', dueDate: '1 Jan 2026', collectedDate: '1 Jan 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2025-8770', dueDate: '1 Dec 2025', collectedDate: '1 Dec 2025', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
];

/* ─── Participant View ────────────────────────────────────────────────────── */
function ParticipantContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const BG_SURFACE = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)';
  const BG_SUBTLE = isLight ? '#f8faf9' : 'rgba(255,255,255,0.02)';
  const TEXT_MAIN = isLight ? '#111827' : '#ffffff';
  const TEXT_SUB = isLight ? '#4b5563' : 'rgba(255,255,255,0.6)';
  const TEXT_MUTED = isLight ? '#9ca3af' : 'rgba(255,255,255,0.35)';

  const [toast, setToast]         = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mandate, setMandate]     = useState({ bankName: 'Bank of Scotland', sortCode: '80-23-11', last4: '1242' });

  const handleSuccess = (data: { bankName: string; sortCode: string; accountNumber: string }) => {
    setMandate({ bankName: data.bankName, sortCode: data.sortCode, last4: data.accountNumber.slice(-4) });
    setToast(`Bank mandate updated — ${data.bankName}`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">
      <AnimatePresence>
        {showModal && (
          <BankMandateModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
            existing={mandate}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]" style={{ color: TEXT_MAIN }}>
              My Payments
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: TEXT_SUB }}>
              You pay £38.50 a month to protect your home. Here&apos;s your full history.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto ${
              isLight ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
            }`}
          >
            <CreditCard size={15} />
            Change Bank Account
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-100 border border-emerald-300"
          >
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <div
          className="relative overflow-hidden rounded-3xl border transition-all duration-300"
          style={{ background: BG_SURFACE, borderColor: BORDER }}
        >
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
                  Next Payment
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#00c685]">
                  Automatic
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT_MAIN }}>
                  £38.50
                </span>
                <span className="text-sm font-medium" style={{ color: TEXT_SUB }}>
                  on 1 August 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
                Taken automatically from <span className="font-semibold" style={{ color: TEXT_MAIN }}>{mandate.bankName}</span> (•••• {mandate.last4}).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => setShowModal(true)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isLight
                    ? 'border-gray-200 hover:border-gray-400 text-gray-700 bg-white shadow-sm'
                    : 'border-white/10 hover:border-white/20 text-white/80 bg-white/[0.04]'
                }`}
              >
                Change Bank Account
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-4 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: BORDER, background: BG_SUBTLE }}>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span style={{ color: TEXT_MUTED }}>You&apos;ve paid this year: </span>
                <strong style={{ color: TEXT_MAIN }}>£231.00</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
                <span style={{ color: TEXT_MUTED }}>All payments received</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
              Payment History
            </h2>
            <p className="text-sm mt-0.5" style={{ color: TEXT_SUB }}>
              All your past payments, most recent first.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {PARTICIPANT_CONTRIBUTIONS.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.12]' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: TEXT_MAIN }}>
                    {c.dueDate}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
                    Direct Debit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={c.status} />
                <p className="text-base font-bold" style={{ color: TEXT_MAIN }}>
                  £{c.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className={`rounded-3xl p-6 sm:p-8 border ${
          isLight ? 'bg-gray-50/80 border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#00c685]" />
            <h4 className="text-sm font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
              Your money goes to people, not shareholders
            </h4>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
            When a member&apos;s home is damaged, the community pool pays to fix it. If money is left over at year end, it comes back to members — it&apos;s never kept as profit.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Treasury View (Finance / Staff) ───────────────────────────────────── */
function TreasuryContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch]       = useState('');
  const [list, setList]           = useState<Contribution[]>(() => {
    if (typeof window !== 'undefined') {
      return getSynchronizedContributions();
    }
    return CONTRIBUTIONS;
  });
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(1);
  const [retried, setRetried] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [sentReply, setSentReply] = useState<string | null>(null);

  // Sync contributions automatically when transactions are reconciled or updated
  useEffect(() => {
    const sync = () => {
      const updated = getSynchronizedContributions();
      setList(updated);
      setSelectedContribution(prev => {
        if (!prev) return null;
        return updated.find(c => c.id === prev.id) ?? prev;
      });
    };
    sync();
    window.addEventListener(SYNC_EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3800);
  };

  const handleRetry = (id: string) => {
    setList(p => p.map(c => {
      if (c.id === id) {
        const updated: Contribution = { ...c, status: 'Retried', retryCount: (c.retryCount ?? 1) + 1 };
        setSelectedContribution(prev => (prev?.id === id ? updated : prev));
        return updated;
      }
      return c;
    }));
    setRetried(true);
    setRetryCount(prev => prev + 1);
    showToast(`BACS Representation triggered for ${id} — bank has 5 working days to clear`);
  };

  const handleEscalate = () => {
    setEscalated(true);
    showToast('Policy escalated to Management — Ahmed Khan notified');
  };

  const handleQuickReply = (msg: string) => {
    setSentReply(msg);
    showToast('Quick reply sent to participant via secure messaging');
  };

  const handleReconcileContribution = (id: string) => {
    const { matchingTx } = reconcileContribution(id);
    const updated = getSynchronizedContributions();
    setList(updated);
    setSelectedContribution(prev => {
      if (!prev) return null;
      return updated.find(c => c.id === id) ?? prev;
    });
    const txNote = matchingTx ? ` and Treasury Cash Book transaction ${matchingTx.id}` : '';
    showToast(`Contribution ${id}${txNote} reconciled and status updated to Collected!`);
  };

  const handleReconcile = () => {
    const pendingContribs = list.filter(c => c.status !== 'Collected');
    if (pendingContribs.length === 0) {
      showToast('All contributions are already reconciled with treasury records.');
      return;
    }
    pendingContribs.forEach(c => reconcileContribution(c.id));
    const updated = getSynchronizedContributions();
    setList(updated);
    showToast(`Reconciled ledger: ${pendingContribs.length} outstanding contribution(s) updated to Collected and synchronized with Treasury.`);
  };

  const filtered = list.filter(t => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = !search || [t.id, t.participantName, t.certificateId].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const failedCount = list.filter(c => c.status === 'Failed').length;
  const collectionRate = Math.round((list.filter(c => c.status === 'Collected').length / list.length) * 100);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            className="fixed top-5 right-5 z-[700] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-semibold text-xs max-w-sm"
            style={{ background: GREEN }}
          >
            <CheckCircle2 size={14} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Contributions Control</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>
            Treasury ledger · BACS recovery workflows · Grace period management
          </p>
        </div>
        <Button onClick={handleReconcile} className="gap-2 text-xs text-white" style={{ background: GREEN }}>
          <CheckCircle2 size={14} /> Reconcile Ledger
        </Button>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Collected (MTD)', value: '£61,400', sub: '+£3,200 vs June', subColor: GREEN },
          { label: 'Collection Rate', value: `${collectionRate}%`, sub: 'First-attempt success' },
          { label: 'Failed Direct Debits', value: String(failedCount), valueColor: 'text-red-400', sub: 'Manual intervention needed' },
          { label: 'Total Mandates', value: '1,284', sub: '99% Active status', subColor: GREEN },
        ].map(({ label, value, sub, subColor, valueColor }) => (
          <div key={label} className={`rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{label}</p>
            <p className={`text-2xl font-bold ${valueColor ?? (isLight ? 'text-black/90' : 'text-white')}`}>{value}</p>
            <p className="text-[10px] mt-1 font-semibold" style={{ color: subColor ?? (isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)') }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Collection Inflows Chart */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        className={`rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`}
        style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className={`font-semibold text-sm ${isLight ? 'text-black/85' : 'text-white/85'}`}>Monthly Collection Inflows</h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collected cash volume versus targets</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
            <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Collected</span>
          </div>
        </div>
        <div className="h-52 w-full">
          <AreaChart
            data={CONTRIBUTION_TREND}
            xKey="month"
            theme={theme}
            height="100%"
            yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            series={[{ dataKey: "total", name: "Collected", color: GREEN }]}
          />
        </div>
      </motion.div>

      {/* Contributions Table */}
      <div className={`rounded-2xl overflow-hidden ${isLight ? 'shadow-sm' : ''}`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className="flex flex-col md:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-black/35' : 'text-white/30'}`} />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, name, or cert…"
              className={`pl-9 text-xs h-9 ${isLight ? 'border-[#E4E7EC]' : 'border-white/[0.08] bg-white/[0.02] text-white'}`}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'Collected', 'Failed', 'Pending', 'Retried'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    activeTab === tab
                      ? 'bg-[#00c685]/15 border-[#00c685]/35 text-[#00c685]'
                      : isLight
                      ? 'border-[#E4E7EC] bg-black/[0.02] text-black/60 hover:border-black/20'
                      : 'border-white/[0.05] bg-white/[0.02] text-white/55 hover:border-white/15'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tip for table interaction */}
        <div className={`px-5 py-2 text-[11px] flex items-center justify-between border-b ${
          isLight ? 'bg-gray-50/60 border-gray-100 text-gray-500' : 'bg-white/[0.01] border-white/[0.04] text-white/40'
        }`}>
          <span>Click any row to open the full detail view, BACS recovery workflow, and participant communications.</span>
          <span className="font-semibold text-[#00c685]">{filtered.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-[#E4E7EC]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['ID', 'Participant', 'Certificate', 'Due Date', 'Collected Date', 'Amount', 'Retry', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const isFailed = c.status === 'Failed';
                const isRetried = c.status === 'Retried';
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedContribution(c)}
                    className={`cursor-pointer transition-all ${
                      isLight
                        ? isFailed
                          ? 'bg-rose-50/40 hover:bg-rose-50/70 border-b border-rose-100/60'
                          : 'hover:bg-black/[0.03] border-b border-gray-100'
                        : isFailed
                        ? 'bg-rose-950/20 hover:bg-rose-950/35 border-b border-rose-900/30'
                        : 'hover:bg-white/[0.03] border-b border-white/[0.04]'
                    }`}
                  >
                    <td className="px-5 py-4 font-mono font-semibold" style={{ color: GREEN }}>
                      {c.id}
                    </td>
                    <td className="px-5 py-4">
                      <ParticipantChip
                        name={c.participantName}
                        participantId={c.participantId}
                        certificateId={c.certificateId}
                        size="sm"
                        theme={theme}
                      />
                    </td>

                    <td className="px-5 py-4 font-mono text-[11px] text-gray-500">
                      {c.certificateId}
                    </td>
                    <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>
                      {c.dueDate}
                    </td>
                    <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>
                      {c.collectedDate ?? '—'}
                    </td>
                    <td className={`px-5 py-4 font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>
                      £{c.amount.toFixed(2)}
                    </td>
                    <td className={`px-5 py-4 text-[11px] font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>
                      {c.retryCount !== undefined ? `${c.retryCount}/3` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4">
                      {isFailed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContribution(c);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 text-[11px] font-bold transition-all border border-amber-500/25 shadow-sm"
                        >
                          <RefreshCw size={11} /> BACS Retry & Details
                        </button>
                      ) : isRetried ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContribution(c);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-[11px] font-bold transition-all border border-blue-500/25 shadow-sm"
                        >
                          <Clock size={11} /> View Recovery
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContribution(c);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border ${
                            isLight
                              ? 'border-black/10 hover:bg-black/5 text-black/70'
                              : 'border-white/10 hover:bg-white/5 text-white/70'
                          }`}
                        >
                          View Details <ChevronRight size={11} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Drawer for Selected Contribution */}
      <AnimatePresence>
        {selectedContribution && (
          <ContributionDetailDrawer
            key={selectedContribution.id}
            contribution={selectedContribution}
            isLight={isLight}
            onClose={() => setSelectedContribution(null)}
            retryCount={retryCount}
            retried={retried}
            onRetry={handleRetry}
            onEscalate={handleEscalate}
            escalated={escalated}
            onReconcile={handleReconcileContribution}
            onSendReply={handleQuickReply}
            sentReply={sentReply}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ContributionsPage() {
  const { theme } = useTheme();
  const { role }  = useRole();
  return role === 'participant'
    ? <ParticipantContributionsView theme={theme} />
    : <TreasuryContributionsView theme={theme} />;
}
