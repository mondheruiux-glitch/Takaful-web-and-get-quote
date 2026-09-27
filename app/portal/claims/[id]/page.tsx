'use client';

import React, { useState, use } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, CheckCircle2, Clock, AlertTriangle,
  XCircle, Upload, MessageSquare, ChevronRight, Info,
  ShieldCheck, Calendar, Home, Banknote, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { CLAIMS, CLAIM_DOCUMENTS, CLAIM_NOTES } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

type Props = { params: Promise<{ id: string }> };

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  'Submitted':            { icon: Clock,         color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Submitted' },
  'Under Review':         { icon: Clock,         color: 'text-amber-400',   bg: 'bg-amber-500/10',   label: 'Under Review' },
  'Awaiting Information': { icon: AlertCircle,   color: 'text-orange-400',  bg: 'bg-orange-500/10',  label: 'Awaiting Info' },
  'Approved':             { icon: CheckCircle2,  color: 'text-green-400',   bg: 'bg-green-500/10',   label: 'Approved' },
  'Rejected':             { icon: XCircle,       color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Rejected' },
  'Paid':                 { icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Paid' },
};

const STEPS = ['Submitted', 'Under Review', 'Awaiting Information', 'Approved', 'Paid'];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', label: status };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function ClaimTimeline({ status }: { status: string }) {
  if (status === 'Rejected') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
        <XCircle size={20} className="text-red-400 shrink-0" />
        <p className="text-sm text-red-300 font-medium">This claim has been rejected. See details below or contact support.</p>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className={`flex flex-col items-center gap-1.5 ${i > 0 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                done ? 'bg-[#00c685] text-white' :
                active ? 'bg-[#00c685]/20 border-2 border-[#00c685] text-[#00c685]' :
                'bg-white/[0.05] border border-white/10 text-white/30'
              }`}>
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <p className={`text-[10px] font-medium text-center leading-tight ${
                active ? 'text-[#00c685]' : done ? 'text-white/60' : 'text-white/25'
              }`}>
                {step}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-[2px] flex-1 rounded-full mb-5 ${done ? 'bg-[#00c685]' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function PortalClaimDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const claimId = resolvedParams.id;

  const claim = CLAIMS.find(c => c.id === claimId) || CLAIMS[0];
  const docs = CLAIM_DOCUMENTS.filter(d => d.claimId === claimId);
  const notes = CLAIM_NOTES.filter(n => n.claimId === claimId && !n.isInternal);

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(notes);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `NOTE-${Date.now()}`,
      claimId,
      authorId: 'P-0042',
      authorName: 'You',
      authorInitials: 'FA',
      authorRole: 'participant' as any,
      text: newMessage.trim(),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isInternal: false,
    }]);
    setNewMessage('');
  };

  if (!claim) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
        <h2 className="text-lg font-bold text-white">Claim Not Found</h2>
        <p className="text-sm text-white/40 mt-1">The claim {claimId} does not exist.</p>
        <Link href="/portal/claims" className="mt-4 inline-block text-xs font-semibold text-[#00c685] hover:underline">
          ← Back to My Claims
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG['Submitted'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-body">

      {/* Back nav */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <Link
          href="/portal/claims"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to My Claims
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-semibold text-white/40">{claim.id}</span>
            <StatusBadge status={claim.status} />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-normal tracking-[-0.02em] text-white">
            {claim.type}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-white/40">
            <Home size={13} />
            <span>{claim.propertyAddress}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-white">£{claim.amountClaimed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-white/35 mt-0.5">Amount Claimed</p>
          {claim.amountApproved !== undefined && (
            <p className="text-sm font-semibold text-[#00c685] mt-1">£{claim.amountApproved.toLocaleString('en-GB', { minimumFractionDigits: 2 })} approved</p>
          )}
        </div>
      </motion.div>

      {/* Progress timeline */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="rounded-2xl p-6 border bg-white/[0.02] border-white/[0.06]"
      >
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-5">Claim Progress</p>
        <ClaimTimeline status={claim.status} />
      </motion.div>

      {/* Rejection reason */}
      {claim.status === 'Rejected' && claim.rejectionReason && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5"
        >
          <div className="flex items-start gap-3">
            <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-200/70">{claim.rejectionReason}</p>
              <p className="text-xs text-red-300/50 mt-3">
                If you disagree with this decision, you can submit a formal appeal within 30 days.
                Contact us via the message section below.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Awaiting information notice */}
      {claim.status === 'Awaiting Information' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="rounded-2xl p-5 border border-orange-500/20 bg-orange-500/5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-300 mb-1">Action Required</p>
              <p className="text-sm text-orange-200/70">
                Your claims handler has requested additional information or documents.
                Please check the documents section below and upload any requested items.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column: claim details ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Key details */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="rounded-2xl p-6 border bg-white/[0.02] border-white/[0.06] space-y-4"
          >
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Claim Details</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Submitted', value: claim.submittedDate },
                { label: 'Incident Date', value: claim.incidentDate ?? '—' },
                { label: 'Property Address', value: claim.propertyAddress },
                { label: 'Policy / Certificate', value: claim.certificateId ?? '—' },
                { label: 'Amount Claimed', value: `£${claim.amountClaimed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` },
                { label: 'Amount Approved', value: claim.amountApproved !== undefined ? `£${claim.amountApproved.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : 'Pending' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] text-white/35 font-medium mb-0.5">{label}</p>
                  <p className="text-sm text-white font-medium">{value}</p>
                </div>
              ))}
            </div>
            {claim.description && (
              <div className="pt-2 border-t border-white/[0.05]">
                <p className="text-[11px] text-white/35 font-medium mb-1.5">Description</p>
                <p className="text-sm text-white/70 leading-relaxed">{claim.description}</p>
              </div>
            )}
          </motion.div>

          {/* Documents */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="rounded-2xl p-6 border bg-white/[0.02] border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Documents</p>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] text-white/70 hover:bg-white/[0.10] transition-colors">
                <Upload size={12} />
                Upload
              </button>
            </div>
            {docs.length === 0 ? (
              <div className="rounded-xl p-8 text-center border border-dashed border-white/10">
                <FileText size={24} className="mx-auto mb-2 text-white/20" />
                <p className="text-xs text-white/30">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-white/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white/80 truncate">{doc.name}</p>
                        <p className="text-[10px] text-white/35">{doc.type} · {doc.uploadedDate}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      doc.status === 'Verified' ? 'bg-green-500/15 text-green-400' :
                      doc.status === 'Rejected' ? 'bg-red-500/15 text-red-400' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Messages */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="rounded-2xl p-6 border bg-white/[0.02] border-white/[0.06]"
          >
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Messages</p>
            <div className="space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare size={20} className="mx-auto mb-2 text-white/20" />
                  <p className="text-xs text-white/30">No messages yet.</p>
                </div>
              ) : (
                messages.map(note => (
                  <div key={note.id} className={`p-3.5 rounded-xl text-sm ${
                    note.authorId === 'P-0042'
                      ? 'bg-[#00c685]/10 border border-[#00c685]/15 ml-6'
                      : 'bg-white/[0.04] border border-white/[0.05] mr-6'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-white/70">{note.authorName}</p>
                      <p className="text-[10px] text-white/30">{note.createdAt}</p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Send a message to your claims handler…"
                className="flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/25"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#00c685] text-white hover:bg-[#00b077] transition-colors disabled:opacity-40"
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>

        {/* ── Right column: status & help ── */}
        <div className="space-y-5">

          {/* Current status */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="rounded-2xl p-5 border bg-white/[0.02] border-white/[0.06]"
          >
            <p className="text-[11px] text-white/35 font-semibold uppercase tracking-wider mb-3">Current Status</p>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${statusCfg.bg}`}>
              <statusCfg.icon size={18} className={statusCfg.color} />
              <p className={`text-sm font-semibold ${statusCfg.color}`}>{claim.status}</p>
            </div>
            {claim.daysOpen !== undefined && !['Paid', 'Rejected'].includes(claim.status) && (
              <p className="text-xs text-white/35 mt-3 flex items-center gap-1.5">
                <Calendar size={11} />
                Open for {claim.daysOpen} day{claim.daysOpen !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {/* Assigned handler */}
          {claim.assignedHandlerName && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="rounded-2xl p-5 border bg-white/[0.02] border-white/[0.06]"
            >
              <p className="text-[11px] text-white/35 font-semibold uppercase tracking-wider mb-3">Your Handler</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00c685]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-[#00c685]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{claim.assignedHandlerName}</p>
                  <p className="text-xs text-white/40">Claims Handler</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Help & info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="rounded-2xl p-5 border bg-white/[0.02] border-white/[0.06] space-y-3"
          >
            <p className="text-[11px] text-white/35 font-semibold uppercase tracking-wider">Need Help?</p>
            <div className="space-y-2 text-xs text-white/50 leading-relaxed">
              <p>If you have questions about your claim, use the message section to contact your handler directly.</p>
              <p>For urgent assistance, call <span className="text-white/80 font-semibold">0800 123 4567</span>.</p>
            </div>
            <div className="pt-1">
              <Link href="/portal" className="inline-flex items-center gap-1 text-xs text-[#00c685] hover:underline font-semibold">
                Back to Portal <ChevronRight size={11} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
