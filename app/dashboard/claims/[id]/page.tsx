'use client';

import React, { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Clock, AlertTriangle, XCircle,
  FileText, Upload, MessageSquare, Phone, Mail,
  Building2, Home, User, CreditCard, Download,
  ExternalLink, Send, ShieldAlert, Sparkles, Check,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme, useRole } from '../../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS, CLAIM_DOCUMENTS, CLAIM_NOTES } from '@/lib/dashboard/mock-data';
import { Claim, ClaimDocument, ClaimNote } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

type Props = { params: Promise<{ id: string }> };

export default function ClaimDetailPage({ params }: Props) {
  const { theme } = useTheme();
  const { role } = useRole();
  const { can } = usePermission();
  const isLight = theme === 'light';

  // Resolve params
  const resolvedParams = use(params);
  const claimId = resolvedParams.id;

  // Find the claim in mock data
  const initialClaim = CLAIMS.find(c => c.id === claimId) || CLAIMS[0];

  // In-memory states for prototype interaction
  const [claim, setClaim] = useState<Claim>(initialClaim);
  const [docs, setDocs] = useState<ClaimDocument[]>(() =>
    CLAIM_DOCUMENTS.filter(d => d.claimId === claimId)
  );
  const [notes, setNotes] = useState<ClaimNote[]>(() =>
    CLAIM_NOTES.filter(n => n.claimId === claimId)
  );
  const [newNoteText, setNewNoteText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(true);
  const [messageText, setMessageText] = useState('');

  // Notifications or toast messages
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!initialClaim) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
        <h2 className="text-lg font-bold">Claim Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">The claim {claimId} does not exist.</p>
        <Link href="/dashboard/claims" className="mt-4 inline-block text-xs font-semibold text-[#00c685] hover:underline">
          Back to Claims
        </Link>
      </div>
    );
  }

  // Handle Note Submit
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: ClaimNote = {
      id: `NOTE-${Date.now()}`,
      claimId: claim.id,
      authorId: role === 'participant' ? 'U-PART-001' : 'U-HAND-001',
      authorName: role === 'participant' ? 'Fatima Al-Rashid' : 'Omar Hassan',
      authorInitials: role === 'participant' ? 'FA' : 'OH',
      text: newNoteText,
      isInternal: role === 'participant' ? false : isInternalNote,
      createdAt: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
    showToast('Note added successfully');
  };

  // Status transitions
  const updateStatus = (newStatus: Claim['status'], msg: string, approvedAmount?: number) => {
    setClaim(prev => ({
      ...prev,
      status: newStatus,
      amountApproved: approvedAmount !== undefined ? approvedAmount : prev.amountApproved,
      lastActivityNote: msg,
      lastActivityDate: 'Today',
    }));

    // Log a system note
    const systemNote: ClaimNote = {
      id: `NOTE-${Date.now()}`,
      claimId: claim.id,
      authorId: 'SYSTEM',
      authorName: 'System',
      authorInitials: 'SY',
      text: `Status changed to ${newStatus}. Reason: ${msg}`,
      isInternal: false,
      createdAt: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setNotes(prev => [systemNote, ...prev]);
    showToast(`Claim status updated to ${newStatus}`);
  };

  // Document Upload Mock
  const handleUploadMock = () => {
    const mockFileNames = ['RepairInvoice_Quote.pdf', 'DamagedCeiling_Photo.jpg', 'ContractorEstimate.xlsx'];
    const randomName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    const newDoc: ClaimDocument = {
      id: `CDOC-${Date.now()}`,
      claimId: claim.id,
      name: randomName,
      type: randomName.endsWith('.jpg') ? 'Photo' : 'Evidence',
      uploadedDate: 'Today',
      uploadedBy: role === 'participant' ? 'Fatima Al-Rashid' : 'Omar Hassan',
      status: 'Received',
      sizeLabel: '2.4 MB',
    };
    setDocs([...docs, newDoc]);
    showToast(`Uploaded ${randomName}`);
  };

  // Dynamic colors & styles
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL_ALT = isLight ? '#f4f6f5' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';

  // Visible Timeline computation based on current status state
  const getTimelineSteps = () => {
    const isSubmitted = true;
    const isUnderReview = ['Under Review', 'Awaiting Information', 'Approved', 'Rejected', 'Paid'].includes(claim.status);
    const isAwaitingInfo = claim.status === 'Awaiting Information';
    const isDecision = ['Approved', 'Rejected', 'Paid'].includes(claim.status);
    const isPaid = claim.status === 'Paid';

    return [
      { label: 'Claim Submitted', date: claim.submittedDate, done: isSubmitted, note: 'Submitted via portal' },
      { label: 'Under Review', date: isUnderReview ? 'Reviewed' : 'Pending', done: isUnderReview, note: isAwaitingInfo ? 'Awaiting participant documents' : 'Assigned to Omar Hassan' },
      { label: 'Decision Made', date: isDecision ? 'Completed' : 'Pending', done: isDecision, note: claim.status === 'Rejected' ? 'Claim Rejected' : claim.status === 'Approved' || isPaid ? 'Claim Approved' : '' },
      { label: 'Payment Released', date: isPaid ? 'Completed' : 'Pending', done: isPaid, note: isPaid ? `£${(claim.amountApproved || claim.amountClaimed).toLocaleString()} transferred` : '' },
    ];
  };

  // Filter notes based on role permissions
  const visibleNotes = notes.filter(n => !n.isInternal || can('view_internal_notes'));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-xs"
            style={{ background: toast.type === 'error' ? '#ef4444' : GREEN }}
          >
            {toast.type === 'success' && <Check size={14} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/claims" className={`p-2.5 rounded-xl transition-all ${isLight ? 'text-black/40 hover:text-black hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`text-xl font-bold font-mono ${TEXT_MAIN}`}>{claim.id}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                claim.status === 'Paid' || claim.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                claim.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                claim.status === 'Awaiting Information' ? 'bg-orange-500/10 text-orange-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  claim.status === 'Paid' || claim.status === 'Approved' ? 'bg-green-500' :
                  claim.status === 'Rejected' ? 'bg-red-500' :
                  claim.status === 'Awaiting Information' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`} />
                {claim.status}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-500">
                {claim.priority} Priority
              </span>
            </div>
            <p className={`text-xs mt-1 ${TEXT_MUTED}`}>{claim.type} Claim · Reported {claim.submittedDate}</p>
          </div>
        </div>

        <div className="flex gap-2 self-start sm:self-center shrink-0">
          <button className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${isLight ? 'border-black/[0.06] text-black/60 hover:bg-black/5' : 'border-white/[0.05] text-white/60 hover:bg-white/5'}`}>
            <Download size={13} /> Export PDF
          </button>
        </div>
      </motion.div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Details, Documents, Notes) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Claim Summary Details */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <h2 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>Claim Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Participant Name', value: claim.participantName },
                { label: 'Certificate Reference', value: claim.certificateId, mono: true },
                { label: 'Risk Location', value: claim.propertyAddress },
                { label: 'Cover Type Included', value: claim.coverType },
                { label: 'Incident Date', value: claim.incidentDate },
                { label: 'Reporting Date', value: claim.submittedDate },
                { label: 'Claimed Value (Estimated)', value: `£${claim.amountClaimed.toLocaleString()}` },
                { label: 'Approved Value', value: claim.amountApproved !== undefined ? `£${claim.amountApproved.toLocaleString()}` : 'Pending validation' },
              ].map(r => (
                <div key={r.label}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${TEXT_MUTED}`}>{r.label}</p>
                  <p className={`text-sm ${r.mono ? 'font-mono text-[#00c685] font-bold' : `font-medium ${TEXT_MAIN}`}`}>{r.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${TEXT_MUTED}`}>Detailed Incident Description</p>
              <p className={`text-sm leading-relaxed ${TEXT_SUB}`}>{claim.description}</p>
            </div>
          </motion.div>

          {/* Documents & Evidence Section */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`font-semibold text-sm ${TEXT_MAIN}`}>Documents & Evidence</h2>
                <p className={`text-[11px] ${TEXT_MUTED}`}>Upload invoices, repair quotes, and damage photographs.</p>
              </div>
              <button
                onClick={handleUploadMock}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 text-white"
                style={{ background: GREEN }}
              >
                <Upload size={12} /> Upload File
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-black/[0.01] dark:hover:bg-white/[0.015] transition-colors"
                  style={{ border: `1px solid ${BORDER}` }}
                >
                  <FileText size={18} className="text-[#00c685] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${TEXT_MAIN}`}>{doc.name}</p>
                    <p className={`text-[10px] ${TEXT_MUTED}`}>{doc.sizeLabel} · {doc.uploadedDate}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'Verified' || doc.status === 'Received' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Conversation and Notes Workspace */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <h2 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>
              {can('view_internal_notes') ? 'Internal Notes & Comms Workspace' : 'Messages & Support'}
            </h2>

            {/* Note input form */}
            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <textarea
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder={can('view_internal_notes') ? "Write an internal note or participant message..." : "Type your message to the claims team..."}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl text-xs border transition-all focus:outline-none focus:border-[#00c685]/55 resize-none bg-black/[0.02] dark:bg-white/[0.03] ${
                  isLight ? 'border-black/[0.06] text-black placeholder:text-black/35' : 'border-white/[0.05] text-white placeholder:text-white/30'
                }`}
              />

              <div className="flex items-center justify-between">
                {can('view_internal_notes') ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={e => setIsInternalNote(e.target.checked)}
                      className="rounded border-black/[0.06] text-[#00c685] focus:ring-[#00c685]"
                    />
                    <span className={`text-xs font-medium ${TEXT_SUB}`}>Internal note (hidden from participant)</span>
                  </label>
                ) : (
                  <span className={`text-[11px] ${TEXT_MUTED}`}>We typically respond within 24 hours.</span>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: GREEN }}
                >
                  <Send size={12} /> Send Message
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-4">
              {visibleNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl transition-all ${
                    note.isInternal
                      ? isLight ? 'bg-amber-500/[0.04] border border-amber-500/10' : 'bg-amber-500/[0.02] border border-amber-500/10'
                      : isLight ? 'bg-black/[0.02] border border-black/[0.04]' : 'bg-white/[0.03] border border-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0" style={{ background: note.authorId === 'SYSTEM' ? '#94a3b8' : GREEN }}>
                        {note.authorInitials}
                      </div>
                      <span className={`text-xs font-semibold ${TEXT_MAIN}`}>{note.authorName}</span>
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{note.createdAt}</span>
                    </div>

                    {note.isInternal && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                        Internal Assessment Note
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${TEXT_SUB}`}>{note.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Timeline & Actions) */}
        <div className="space-y-6">
          
          {/* Progress Timeline */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${TEXT_MUTED}`}>Timeline & SLA</h3>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-black/5 dark:bg-white/5" />
              <div className="space-y-4">
                {getTimelineSteps().map((step, idx) => (
                  <div key={step.label} className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10" style={{
                      background: step.done ? `${GREEN}15` : isLight ? '#f4f6f5' : '#112218',
                      border: `2px solid ${step.done ? GREEN : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                      {step.done ? (
                        <CheckCircle2 size={12} style={{ color: GREEN }} />
                      ) : (
                        <Clock size={12} className={TEXT_MUTED} />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step.done ? TEXT_MAIN : TEXT_MUTED}`}>{step.label}</p>
                      <p className={`text-[10px] ${TEXT_SUB}`}>{step.date} {step.note && `· ${step.note}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Role-Based Operations Panel */}
          {role !== 'participant' && (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="rounded-2xl p-5 transition-colors duration-200"
              style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
            >
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${TEXT_MUTED}`}>Decision & Action Panel</h3>

              {/* Handlers & Management Action Flows */}
              {can('approve_claim') && (
                <div className="space-y-2">
                  {claim.status !== 'Approved' && claim.status !== 'Paid' && claim.status !== 'Rejected' ? (
                    <>
                      <button
                        onClick={() => updateStatus('Approved', 'Validator approved the assessed scope of works.', claim.amountClaimed)}
                        className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                        style={{ background: GREEN }}
                      >
                        Approve Claim
                      </button>
                      <button
                        onClick={() => updateStatus('Awaiting Information', 'Chased participant for outstanding quotes.')}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl border border-amber-500/20 text-amber-500 bg-amber-500/10 hover:bg-amber-500/15"
                      >
                        Request Documents
                      </button>
                      <button
                        onClick={() => updateStatus('Rejected', 'Claim falls under certificate excess threshold.')}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/15"
                      >
                        Reject Claim
                      </button>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl text-center space-y-2 bg-black/[0.02] dark:bg-white/[0.02]" style={{ border: `1px solid ${BORDER}` }}>
                      <Sparkles size={20} className="mx-auto text-emerald-400" />
                      <p className={`text-xs font-semibold ${TEXT_MAIN}`}>Decision Complete</p>
                      <p className={`text-[11px] ${TEXT_SUB}`}>Status: {claim.status}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Finance Team Action Flow */}
              {role === 'finance' && (
                <div className="space-y-2">
                  {claim.status === 'Approved' ? (
                    <button
                      onClick={() => updateStatus('Paid', 'Payment authorized and released by Treasury.')}
                      className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                      style={{ background: GREEN }}
                    >
                      Authorize & Release Payment
                    </button>
                  ) : claim.status === 'Paid' ? (
                    <div className="p-4 rounded-xl text-center space-y-2 bg-black/[0.02] dark:bg-white/[0.02]" style={{ border: `1px solid ${BORDER}` }}>
                      <CheckCircle2 size={20} className="mx-auto text-emerald-400" />
                      <p className="text-xs font-semibold text-emerald-400">Payment Transferred</p>
                      <p className={`text-[10px] ${TEXT_SUB}`}>Reference: PYMNT-{claim.id}</p>
                    </div>
                  ) : (
                    <p className={`text-xs text-center ${TEXT_MUTED}`}>Awaiting Handler approval before payment release.</p>
                  )}
                </div>
              )}

              {/* Management Specific Indicators */}
              {role === 'management' && (
                <div className="mt-4 pt-4 space-y-2 border-t" style={{ borderColor: BORDER }}>
                  <div className="flex justify-between text-xs">
                    <span className={TEXT_SUB}>SLA Remaining</span>
                    <span className="font-semibold text-emerald-400">Compliant</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={TEXT_SUB}>Audit Checked</span>
                    <span className="font-semibold text-emerald-400">Yes</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Participant Info Summary */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${TEXT_MUTED}`}>
              {role === 'participant' ? 'Assigned Handler' : 'Participant Details'}
            </h3>

            {role === 'participant' ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-blue-500">
                  OH
                </div>
                <div>
                  <p className={`font-semibold text-xs ${TEXT_MAIN}`}>Omar Hassan</p>
                  <p className={`text-[10px] ${TEXT_MUTED}`}>Senior Claims Handler</p>
                  <p className={`text-[10px] mt-0.5 ${TEXT_MUTED}`}>takaful.claims@takaful.com</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: GREEN }}>
                    FA
                  </div>
                  <div>
                    <p className={`font-semibold text-xs ${TEXT_MAIN}`}>{claim.participantName}</p>
                    <p className={`text-[10px] ${TEXT_MUTED}`}>Member ID: {claim.participantId}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className={TEXT_MUTED} />
                    <span className={TEXT_SUB}>f.alrashid@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className={TEXT_MUTED} />
                    <span className={TEXT_SUB}>+44 7700 123 456</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
