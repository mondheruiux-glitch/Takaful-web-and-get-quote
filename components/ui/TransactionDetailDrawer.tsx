"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  X,
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  CreditCard,
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Transaction } from "@/lib/dashboard/types";
import { StatusBadge, VerifiedBadge } from "@/components/ui/ds/StatusBadge";
import { ActionButton } from "@/components/ui/ds/ActionButton";
import { ParticipantChip } from "@/components/ui/ParticipantChip";
import { PARTICIPANTS } from "@/lib/dashboard/mock-data";

export interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  isLight: boolean;
  onClose: () => void;
  onReconcile?: (id: string) => void;
}

export function TransactionDetailDrawer({
  transaction,
  isLight,
  onClose,
  onReconcile,
}: TransactionDetailDrawerProps) {
  if (!transaction) return null;

  const isInflow = transaction.direction === "Inflow";
  const isFailed = transaction.status === "Failed";
  const isReconciled = transaction.reconciled || transaction.status === "Reconciled" || transaction.status === "Completed";

  // Look up participant details if available
  const participant = PARTICIPANTS.find(
    (p) => p.id === transaction.participantId || p.name === transaction.participantName
  );

  return (
    <div className="fixed inset-0 z-[600] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Slide-over panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className={`relative z-10 w-full max-w-xl h-full flex flex-col shadow-2xl border-l overflow-hidden ${
          isLight ? "bg-[#fcfdfd] border-gray-200" : "bg-[#0a1a13] border-white/10"
        }`}
      >
        {/* Sticky Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0e2219] border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isInflow
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/25"
              }`}
            >
              {isInflow ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#00c685]">
                  {transaction.id}
                </span>
                {isReconciled ? (
                  <VerifiedBadge isLight={isLight} />
                ) : (
                  <StatusBadge status={transaction.status} theme={isLight ? "light" : "dark"} />
                )}
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isLight ? "text-gray-500" : "text-white/50"
                }`}
              >
                {transaction.type} · {transaction.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isLight
                ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                : "text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Financial Hero */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight
                ? "bg-white border-gray-200/80 shadow-xs"
                : "bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isLight ? "text-gray-500" : "text-white/40"
              }`}
            >
              Transaction Value & Flow
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span
                  className={`text-3xl font-extrabold ${
                    isInflow ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {isInflow ? "+" : "−"}£
                  {transaction.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isInflow
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {isInflow ? "Inflow into Pool" : "Disbursement from Pool"}
                </span>
              </div>
            </div>

            <div
              className={`mt-4 pt-3 border-t grid grid-cols-2 gap-3 text-xs ${
                isLight ? "border-gray-100" : "border-white/5"
              }`}
            >
              <div>
                <span className={isLight ? "text-gray-400" : "text-white/35"}>
                  Reference
                </span>
                <p
                  className={`font-mono font-medium mt-0.5 ${
                    isLight ? "text-gray-800" : "text-white/80"
                  }`}
                >
                  {transaction.reference}
                </p>
              </div>
              <div>
                <span className={isLight ? "text-gray-400" : "text-white/35"}>
                  Audit Status
                </span>
                <p
                  className={`font-semibold mt-0.5 ${
                    isReconciled ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {isReconciled ? "● Reconciled" : "● Action Needed"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Required Banner if not reconciled */}
          {!isReconciled && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isLight
                  ? "bg-amber-50/80 border-amber-200/80 text-amber-900"
                  : "bg-amber-950/20 border-amber-500/30 text-amber-200"
              }`}
            >
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold">Reconciliation Outstanding</p>
                <p
                  className={`text-[11px] mt-0.5 leading-relaxed ${
                    isLight ? "text-amber-800" : "text-amber-300/80"
                  }`}
                >
                  This ledger entry has not yet been matched against the cleared bank statement.
                  Reconciling will verify funds and update linked contribution or claim records.
                </p>
                <div className="mt-3">
                  <ActionButton
                    variant="amber"
                    size="sm"
                    icon={ArrowLeftRight}
                    onClick={() => onReconcile && onReconcile(transaction.id)}
                  >
                    Reconcile Transaction Now
                  </ActionButton>
                </div>
              </div>
            </div>
          )}

          {/* Participant Details */}
          {transaction.participantName && (
            <div
              className={`p-5 rounded-2xl border ${
                isLight
                  ? "bg-white border-gray-200/80 shadow-xs"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? "text-gray-500" : "text-white/40"
                  }`}
                >
                  Participant Information
                </span>
                <Link
                  href={`/dashboard/participants/${transaction.participantId || "P-0098"}`}
                  className="text-xs font-semibold text-[#00c685] hover:underline flex items-center gap-1"
                >
                  View Profile <ExternalLink size={11} />
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <ParticipantChip
                  name={transaction.participantName}
                  participantId={transaction.participantId}
                  certificateId={transaction.certificateId}
                  status={participant?.status || "Active"}
                  theme={isLight ? "light" : "dark"}
                />
              </div>

              {participant && (
                <div
                  className={`mt-4 pt-3 border-t grid grid-cols-2 gap-3 text-xs ${
                    isLight ? "border-gray-100" : "border-white/5"
                  }`}
                >
                  <div>
                    <span className={isLight ? "text-gray-400" : "text-white/35"}>
                      Email Address
                    </span>
                    <p
                      className={`font-medium mt-0.5 truncate ${
                        isLight ? "text-gray-800" : "text-white/80"
                      }`}
                    >
                      {participant.email}
                    </p>
                  </div>
                  <div>
                    <span className={isLight ? "text-gray-400" : "text-white/35"}>
                      Risk Rating
                    </span>
                    <p className="mt-0.5">
                      <StatusBadge
                        status={participant.riskRating}
                        theme={isLight ? "light" : "dark"}
                      />
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related System Records */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLight
                ? "bg-white border-gray-200/80 shadow-xs"
                : "bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isLight ? "text-gray-500" : "text-white/40"
              }`}
            >
              Linked Takaful Records
            </span>

            <div className="space-y-2 pt-1">
              {transaction.certificateId && (
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="text-[#00c685]" />
                    <div>
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Certificate #{transaction.certificateId}
                      </p>
                      <p className={isLight ? "text-gray-500" : "text-white/40"}>
                        Active Home Cover
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/certificates`}
                    className="text-xs font-semibold text-[#00c685] hover:underline"
                  >
                    View
                  </Link>
                </div>
              )}

              {transaction.type === "Contribution" && (
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={15} className="text-[#00c685]" />
                    <div>
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Direct Debit Contribution
                      </p>
                      <p className={isLight ? "text-gray-500" : "text-white/40"}>
                        Ref: {transaction.reference}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/contributions"
                    className="text-xs font-semibold text-[#00c685] hover:underline"
                  >
                    Open Control
                  </Link>
                </div>
              )}

              {transaction.claimId && (
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt size={15} className="text-rose-400" />
                    <div>
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Claim Disbursement #{transaction.claimId}
                      </p>
                      <p className={isLight ? "text-gray-500" : "text-white/40"}>
                        Settlement Payout
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/claims"
                    className="text-xs font-semibold text-[#00c685] hover:underline"
                  >
                    View Claim
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Audit Verification Log */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight
                ? "bg-white border-gray-200/80 shadow-xs"
                : "bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isLight ? "text-gray-500" : "text-white/40"
              }`}
            >
              Treasury Audit Trail
            </span>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className={isLight ? "text-gray-500" : "text-white/40"}>
                  Audit Method
                </span>
                <span className={`font-medium ${isLight ? "text-gray-800" : "text-white/80"}`}>
                  Direct Clearing House BACS Link
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? "text-gray-500" : "text-white/40"}>
                  Verification Status
                </span>
                <span
                  className={`font-semibold ${
                    isReconciled ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {isReconciled ? "Confirmed & Sealed" : "Awaiting Bank Match"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isLight ? "text-gray-500" : "text-white/40"}>
                  Shariah Compliance Check
                </span>
                <span className="font-semibold text-emerald-500">
                  ✓ Tabarru Pool Inflow Validated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between shrink-0 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0e2219] border-white/10"
          }`}
        >
          <ActionButton variant="secondary" size="md" onClick={onClose} theme={isLight ? "light" : "dark"}>
            Close Drawer
          </ActionButton>

          {!isReconciled && (
            <ActionButton
              variant="amber"
              size="md"
              icon={ArrowLeftRight}
              onClick={() => {
                if (onReconcile) {
                  onReconcile(transaction.id);
                }
              }}
            >
              Reconcile
            </ActionButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default TransactionDetailDrawer;
