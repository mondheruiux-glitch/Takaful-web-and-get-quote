'use client';

import React, { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Clock, AlertTriangle, XCircle,
  FileText, Upload, MessageSquare, Phone, Mail,
  Building2, Home, User, CreditCard, Download,
  ExternalLink, Send, ShieldAlert, Sparkles, Check,
  Info, HelpCircle, RefreshCw, ChevronRight, X, AlertCircle,
  ShieldCheck, ArrowUpRight, FilePlus, Calendar, Eye,
  FileCheck, Shield, ChevronDown, CheckSquare, Square,
  CornerDownRight, Scale, AlertOctagon, Bell, FileQuestion,
  Printer, FolderPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme, useRole } from '../../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS, CLAIM_DOCUMENTS, CLAIM_NOTES, PARTICIPANTS, DEMO_USERS } from '@/lib/dashboard/mock-data';
import { Claim, ClaimDocument, ClaimNote } from '@/lib/dashboard/types';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

type Props = { params: Promise<{ id: string }> };

const DOCUMENT_REQUEST_PRESETS = [
  {
    id: 'contractor_quote',
    name: 'Itemised Contractor Repair Quotation',
    type: 'Quote' as const,
    description: 'Detailed breakdown of materials, labour rates, scaffolding, VAT, and estimated repair timelines from a licensed tradesperson.',
    badge: 'Scope of Works',
  },
  {
    id: 'structural_survey',
    name: 'Certified Structural / Roofing Assessment',
    type: 'Report' as const,
    description: 'Independent RICS surveyor or qualified structural engineer report verifying storm ingress points and structural integrity.',
    badge: 'Technical Report',
  },
  {
    id: 'interior_photos',
    name: 'High-Resolution Date-Stamped Damage Media',
    type: 'Photo' as const,
    description: 'Clear photographic or video evidence documenting internal loft joists, water ingress boundaries, and affected ceiling areas.',
    badge: 'Loss Evidence',
  },
  {
    id: 'emergency_mitigation',
    name: 'Emergency Mitigation & Tarping Invoice',
    type: 'Evidence' as const,
    description: 'Invoices and payment receipts for urgent emergency make-safe repairs conducted to mitigate ongoing water ingress.',
    badge: 'Mitigation Proof',
  },
  {
    id: 'ownership_receipts',
    name: 'Proof of Ownership & Contents Invoices',
    type: 'Evidence' as const,
    description: 'Original purchase receipts, warranty cards, or valuation certificates for damaged household goods and fixtures.',
    badge: 'Asset Verification',
  },
  {
    id: 'weather_report',
    name: 'Met Office Severe Weather Report',
    type: 'Report' as const,
    description: 'Official meteorological verification corroborating local wind speeds and heavy precipitation on the stated incident date.',
    badge: 'Peril Verification',
  },
];

const REJECTION_PRESETS = [
  {
    id: 'excess',
    category: 'Policy Excess & Deductibles',
    badge: 'Excess Deductible',
    label: 'Below Policy Excess Threshold (£300 Excess)',
    clause: 'Clause 4.2 — Certificate Excess & Deductibles (£300 Minimum)',
    text: 'Total assessed repair costs fall below the mandatory Certificate Policy Excess threshold of £300.00. Under Clause 4.2 of the Property Takaful Schedule, incidents below policy excess cannot be disbursed from the participant mutual pool.',
  },
  {
    id: 'wear_and_tear',
    category: 'Policy Exclusions',
    badge: 'Policy Exclusion',
    label: 'Excluded Peril / Gradual Wear & Tear & Lack of Maintenance',
    clause: 'Clause 5.1 — Inherent Vice, Gradual Deterioration & Lack of Maintenance',
    text: 'Surveyor assessment concluded that the damage resulted from gradual long-term wear and lack of preventative maintenance rather than an acute insured peril, which is an excluded peril under Clause 5.1.',
  },
  {
    id: 'out_of_term',
    category: 'Term & Boundaries',
    badge: 'Term Boundary',
    label: 'Incident Occurred Outside Active Coverage Period',
    clause: 'Clause 2.3 — Coverage Inception & Term Boundary Verification',
    text: 'Documentation confirms the loss event took place prior to the active inception date of the Takaful certificate, falling outside the active term of cover.',
  },
  {
    id: 'insufficient_proof',
    category: 'Evidence & Compliance',
    badge: 'Evidence SLA',
    label: 'Insufficient Evidence / Failure to Submit Quotes',
    clause: 'Clause 6.4 — Substantiation & Claims Evidence Compliance',
    text: 'Despite multiple chase notices, required substantiating repair quotes or police incident reports were not provided within the 30-day statutory claims SLA window.',
  },
  {
    id: 'unauthorized_use',
    category: 'Underwriting Compliance',
    badge: 'Underwriting',
    label: 'Undeclared Commercial Use / Material Misrepresentation',
    clause: 'Clause 3.1 — Representation of Insured Risk & Occupancy Warranty',
    text: 'Assessment identified undeclared commercial operations or breach of occupancy warranties on the insured domestic premises under Clause 3.1.',
  },
  {
    id: 'custom',
    category: 'Special Adjudication',
    badge: 'Discretionary',
    label: 'Custom Adjudication Ground',
    clause: 'Clause 7.1 — Assessment Discretion & Specific Schedule Provisions',
    text: '',
  },
];

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

  // Rejection Modal & Appeal States
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReasonPreset, setRejectionReasonPreset] = useState('excess');
  const [customRejectionText, setCustomRejectionText] = useState('');
  const [rejectionClauseInput, setRejectionClauseInput] = useState(REJECTION_PRESETS[0].clause);
  const [showAppealGuide, setShowAppealGuide] = useState(false);
  const [includeAppealSchedule, setIncludeAppealSchedule] = useState(true);
  const [notifyParticipantRejection, setNotifyParticipantRejection] = useState(true);
  const [complianceConfirmed, setComplianceConfirmed] = useState(false);
  const [viewDecisionLetterModalOpen, setViewDecisionLetterModalOpen] = useState(false);

  // Document Request Modal States
  const [requestDocsModalOpen, setRequestDocsModalOpen] = useState(false);
  const [selectedDocPresets, setSelectedDocPresets] = useState<string[]>(['contractor_quote', 'interior_photos']);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<ClaimDocument['type']>('Evidence');
  const [requestDeadlineDays, setRequestDeadlineDays] = useState('7');
  const [requestInstructions, setRequestInstructions] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [setSlaAlert, setSetSlaAlert] = useState(true);

  // Notifications or toast messages
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Find matching participant details from mock database
  const participantRecord = PARTICIPANTS.find(p => p.id === claim.participantId) || {
    id: claim.participantId,
    name: claim.participantName,
    initials: claim.participantName.split(' ').map(n => n[0]).join(''),
    email: `${claim.participantName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    phone: '+44 7700 900 123',
    address: claim.propertyAddress,
    memberSince: 'Jan 2024',
    status: 'Active' as const,
    riskRating: 'Low' as const,
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

    const isParticipant = role === 'participant';
    const authorName = isParticipant ? (DEMO_USERS.participant?.name || claim.participantName) : 'Omar Hassan';
    const authorRole = isParticipant ? 'Participant' : 'Senior Claims Handler';
    const authorGender = isParticipant ? (DEMO_USERS.participant?.gender || 'female') : 'male';

    const newNote: ClaimNote = {
      id: `NOTE-${Date.now()}`,
      claimId: claim.id,
      authorId: isParticipant ? 'U-PART-001' : 'U-HAND-001',
      authorName,
      authorInitials: authorName.split(' ').map(n => n[0]).join(''),
      authorRole,
      authorGender,
      authorAvatar: getDicebearAvatar(authorName, authorGender),
      text: newNoteText.trim(),
      isInternal: isParticipant ? false : isInternalNote,
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
    showToast(isParticipant ? 'Message sent to your Claims Handler' : (isInternalNote ? 'Internal note logged' : 'Message posted to participant'));
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
      authorRole: 'Automated Milestone',
      text: `Status changed to ${newStatus}. ${msg}`,
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

  // Handle Dispatch of Document Request
  const handleDispatchRequest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const presetsToAdd = DOCUMENT_REQUEST_PRESETS.filter(p => selectedDocPresets.includes(p.id));
    const allRequested: { name: string; type: ClaimDocument['type'] }[] = [
      ...presetsToAdd.map(p => ({ name: p.name, type: p.type })),
    ];
    if (customDocName.trim()) {
      allRequested.push({ name: customDocName.trim(), type: customDocType });
    }

    if (allRequested.length === 0) {
      showToast('Please select at least one document to request', 'error');
      return;
    }

    const days = parseInt(requestDeadlineDays, 10) || 7;
    const targetMs = Date.now() + days * 24 * 60 * 60 * 1000;
    const deadlineDate = new Date(targetMs).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Create new placeholder documents awaiting upload
    const newDocs: ClaimDocument[] = allRequested.map((req, idx) => ({
      id: `CDOC-REQ-${Date.now()}-${idx}`,
      claimId: claim.id,
      name: req.name,
      type: req.type,
      uploadedDate: `Due ${deadlineDate}`,
      uploadedBy: 'Pending Participant Upload',
      status: 'Awaiting',
      sizeLabel: 'Awaiting Upload',
    }));

    setDocs(prev => [...newDocs, ...prev]);

    // Update claim status
    const activitySummary = `Requested ${allRequested.length} document${allRequested.length > 1 ? 's' : ''} (Due ${deadlineDate})`;
    setClaim(prev => ({
      ...prev,
      status: 'Awaiting Information',
      lastActivityNote: activitySummary,
      lastActivityDate: 'Today',
    }));

    // Post formal message to participant
    const docListFormatted = allRequested.map((d, i) => `${i + 1}. ${d.name} (${d.type})`).join('\n');
    const noteContent = `Dear ${claim.participantName},\n\nOur claims assessment team requires the following supporting documentation to proceed with validating your ${claim.type} claim (${claim.id}):\n\n${docListFormatted}\n\nTarget Response Deadline: ${deadlineDate} (${days} days)\n\n${requestInstructions.trim() || 'Please upload clear scanned copies or high-resolution photos directly via your participant portal.'}\n\nIf you require assistance from our approved contractor network, please reply directly to this thread.`;

    const requestNote: ClaimNote = {
      id: `NOTE-${Date.now()}`,
      claimId: claim.id,
      authorId: 'U-HAND-001',
      authorName: 'Omar Hassan',
      authorInitials: 'OH',
      authorRole: 'Senior Claims Handler',
      authorGender: 'male',
      authorAvatar: getDicebearAvatar('Omar Hassan', 'male'),
      text: noteContent,
      isInternal: false,
      createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const auditNote: ClaimNote = {
      id: `NOTE-${Date.now() + 1}`,
      claimId: claim.id,
      authorId: 'SYSTEM',
      authorName: 'System SLA Bot',
      authorInitials: 'SY',
      authorRole: 'Automated Milestone',
      text: `Status changed to Awaiting Information. Document request dispatched: ${allRequested.length} item(s) pending from ${claim.participantName}. SLA chase timer set for ${deadlineDate}. Notification dispatched via ${[notifyEmail && 'Email', notifySms && 'SMS'].filter(Boolean).join(' & ')}.`,
      isInternal: true,
      createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setNotes(prev => [requestNote, auditNote, ...prev]);
    setRequestDocsModalOpen(false);
    showToast(`Request sent: ${allRequested.length} document(s) requested from ${claim.participantName} (Deadline: ${deadlineDate})`, 'success');
  };

  // Confirm Rejection with Reason & Generate Formal Notice
  const handleConfirmRejection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const preset = REJECTION_PRESETS.find(p => p.id === rejectionReasonPreset);
    const finalReason = rejectionReasonPreset === 'custom'
      ? (customRejectionText.trim() || 'Claim rejected following comprehensive underwriting and policy excess review.')
      : (customRejectionText.trim() || preset?.text || 'Claim falls under certificate excess threshold.');
    const finalClause = rejectionClauseInput.trim() || preset?.clause || 'Clause 4.2 — Certificate Excess & Deductibles';
    const decisionDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setClaim(prev => ({
      ...prev,
      status: 'Rejected',
      rejectionReason: finalReason,
      rejectionClause: finalClause,
      rejectionDate: decisionDate,
      rejectionNotes: `Formal rejection notice issued by Omar Hassan. Reason: ${finalReason}`,
      lastActivityNote: `Claim Rejected — ${finalReason.slice(0, 65)}...`,
      lastActivityDate: 'Today',
      amountApproved: 0,
    }));

    // Add formal rejection document to documents list
    const rejectionDoc: ClaimDocument = {
      id: `CDOC-REJ-${Date.now()}`,
      claimId: claim.id,
      name: `Formal Notice of Claim Disallowance (${claim.id}).pdf`,
      type: 'Correspondence',
      uploadedDate: 'Today',
      uploadedBy: 'Omar Hassan (Adjudication)',
      status: 'Verified',
      sizeLabel: '218 KB',
    };
    setDocs(prev => [rejectionDoc, ...prev]);

    // Add formal communication notes
    const formalNoticeNote: ClaimNote = {
      id: `NOTE-${Date.now()}`,
      claimId: claim.id,
      authorId: 'U-HAND-001',
      authorName: 'Omar Hassan',
      authorInitials: 'OH',
      authorRole: 'Senior Claims Handler',
      authorGender: 'male',
      authorAvatar: getDicebearAvatar('Omar Hassan', 'male'),
      text: `Dear ${claim.participantName},\n\nFollowing thorough assessment of your loss report and submitted documentation for Claim ${claim.id}, we regret to inform you that this claim has been disallowed from the participant mutual pool.\n\nGrounds for Disallowance: ${finalReason}\nApplicable Policy Clause: ${finalClause}\nAssessed Payable Amount: £0.00\n\nA signed copy of your Formal Notice of Claim Disallowance has been generated and filed in your documents portal.\n\nStatutory Appeal Rights: You have the right to appeal this decision within 14 calendar days to the Independent Takaful Adjudication Committee.`,
      isInternal: false,
      createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const internalAuditNote: ClaimNote = {
      id: `NOTE-${Date.now() + 1}`,
      claimId: claim.id,
      authorId: 'U-HAND-001',
      authorName: 'Omar Hassan',
      authorInitials: 'OH',
      authorRole: 'Senior Claims Handler',
      authorGender: 'male',
      authorAvatar: getDicebearAvatar('Omar Hassan', 'male'),
      text: `Audit Trail: Claim marked as Rejected. Reason: ${finalReason}. Clause: ${finalClause}. Participant advised of mutual pool excess parameters and 14-day statutory appeal rights. Mutual pool funds preserved: £${claim.amountClaimed.toLocaleString()}.`,
      isInternal: true,
      createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setNotes(prev => [formalNoticeNote, internalAuditNote, ...prev]);
    setRejectModalOpen(false);
    showToast('Claim rejected: Formal notice and audit record generated', 'info');
  };

  // Re-open Claim Action
  const handleReopenClaim = () => {
    updateStatus('Under Review', 'Claim re-opened by handler for supplementary loss evidence re-assessment.');
    showToast('Claim re-opened for review', 'success');
  };

  // Document Upload Mock
  const handleUploadMock = () => {
    const mockFileNames = [
      'Supplementary_Repair_Quote.pdf',
      'Structural_Damage_HighRes.jpg',
      'LossAdjuster_Supplementary_Notes.pdf',
      'Contractor_Itemised_Estimate.xlsx',
    ];
    const randomName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    const isParticipant = role === 'participant';
    const newDoc: ClaimDocument = {
      id: `CDOC-${Date.now()}`,
      claimId: claim.id,
      name: randomName,
      type: randomName.endsWith('.jpg') ? 'Photo' : 'Evidence',
      uploadedDate: 'Today',
      uploadedBy: isParticipant ? (DEMO_USERS.participant?.name || claim.participantName) : 'Omar Hassan',
      status: 'Received',
      sizeLabel: '2.1 MB',
    };
    setDocs([newDoc, ...docs]);
    showToast(`Uploaded ${randomName}`);
  };

  // Dynamic colors & styles
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL_ALT = isLight ? '#f4f6f5' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

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
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white font-semibold text-xs"
            style={{ background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : GREEN }}
          >
            {toast.type === 'success' && <Check size={14} />}
            {toast.type === 'info' && <Info size={14} />}
            {toast.type === 'error' && <AlertCircle size={14} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Linked Profiles */}
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
                claim.status === 'Rejected' ? 'bg-red-500/15 text-red-500 font-bold' :
                claim.status === 'Awaiting Information' ? 'bg-orange-500/10 text-orange-500' :
                claim.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  claim.status === 'Paid' || claim.status === 'Approved' ? 'bg-green-500' :
                  claim.status === 'Rejected' ? 'bg-red-500' :
                  claim.status === 'Awaiting Information' ? 'bg-orange-500' :
                  claim.status === 'Under Review' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} />
                {claim.status}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-500">
                {claim.priority} Priority
              </span>
            </div>

            {/* Linked profiles pill row */}
            <div className="flex items-center gap-4 flex-wrap mt-1.5">
              <div className="flex items-center gap-1.5">
                <img
                  src={getDicebearAvatar(claim.participantName, claim.participantName.includes('Fatima') || claim.participantName.includes('Aisha') || claim.participantName.includes('Maryam') ? 'female' : 'male')}
                  alt={claim.participantName}
                  className="w-5 h-5 rounded-full object-cover border border-[#00c685]/30 bg-emerald-500/10"
                />
                <span className={`text-xs font-semibold ${TEXT_MAIN}`}>{claim.participantName}</span>
                <span className={`text-[10px] ${TEXT_MUTED}`}>({claim.participantId})</span>
              </div>
              <span className={TEXT_MUTED}>·</span>
              <div className="flex items-center gap-1.5">
                <img
                  src={getDicebearAvatar(claim.assignedHandlerName || 'Omar Hassan', 'male')}
                  alt="Handler"
                  className="w-5 h-5 rounded-full object-cover border border-blue-500/30 bg-blue-500/10"
                />
                <span className="text-xs font-semibold text-blue-500">Handler: {claim.assignedHandlerName || 'Omar Hassan'}</span>
              </div>
              <span className={TEXT_MUTED}>·</span>
              <p className={`text-xs ${TEXT_MUTED}`}>{claim.type} Claim · Reported {claim.submittedDate}</p>
            </div>
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

          {/* Rejection Outcome Banner (High visibility when claim is rejected) */}
          {claim.status === 'Rejected' && (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="rounded-2xl p-5 border transition-all duration-200 overflow-hidden relative"
              style={{
                background: isLight ? 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)' : 'linear-gradient(135deg, #220d0f 0%, #15090a 100%)',
                borderColor: 'rgba(239, 68, 68, 0.28)',
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)',
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0 mt-0.5 border border-red-500/30">
                  <XCircle size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500 text-white">
                        Claim Decision: Rejected
                      </span>
                      <span className={`text-xs font-semibold ${TEXT_MUTED}`}>
                        Decided on {claim.rejectionDate || '18 Jul 2026'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setViewDecisionLetterModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-red-600 dark:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20"
                      >
                        <FileText size={12} /> View Decision Notice
                      </button>
                      {role !== 'participant' && (
                        <button
                          onClick={handleReopenClaim}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                        >
                          <RefreshCw size={12} /> Re-open for Re-assessment
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-sm font-bold mt-2.5 ${isLight ? 'text-red-950' : 'text-red-100'}`}>
                    Reason for Claim Rejection:
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed font-medium ${isLight ? 'text-red-900/80' : 'text-red-200/80'}`}>
                    {claim.rejectionReason || 'The claim falls under the mandatory certificate policy excess threshold or standard policy exclusion criteria.'}
                  </p>

                  <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-red-500/15">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={13} className="text-red-500" />
                      <span className={`text-[11px] font-semibold ${isLight ? 'text-red-800' : 'text-red-300'}`}>
                        {claim.rejectionClause || 'Clause 4.2 — Certificate Excess & Deductibles (£300 Minimum)'}
                      </span>
                    </div>

                    {role === 'participant' ? (
                      <button
                        onClick={() => setShowAppealGuide(!showAppealGuide)}
                        className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                      >
                        {showAppealGuide ? 'Hide Appeal Instructions' : 'How to Appeal / Dispute this Decision'}
                        <ChevronRight size={12} className={showAppealGuide ? 'rotate-90' : ''} />
                      </button>
                    ) : (
                      <span className={`text-[10px] ${TEXT_MUTED}`}>
                        Assessed by: {claim.assignedHandlerName || 'Omar Hassan'}
                      </span>
                    )}
                  </div>

                  {/* Appeal Guidance Box (for participant) */}
                  <AnimatePresence>
                    {showAppealGuide && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3.5 rounded-xl border border-red-500/20 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-2"
                      >
                        <p className={`font-semibold ${TEXT_MAIN}`}>Participant Appeal & Review Process:</p>
                        <p className={`text-[11px] leading-relaxed ${TEXT_SUB}`}>
                          Under Takaful mutual risk principles, pool funds are held in trust for all participants and claims must strictly satisfy policy conditions. If you have obtained higher formal repair invoices exceeding your excess threshold or believe loss adjusters misidentified the cause of damage, you can submit an appeal with additional quotes directly in the <strong>Messages & Support</strong> box below or contact the Sharia Governance Ombudsperson at <code>appeals@takaful.com</code>.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Claim Summary Details */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold text-sm ${TEXT_MAIN}`}>Claim Overview</h2>
              <span className={`text-[11px] font-mono font-medium ${TEXT_MUTED}`}>
                Ref: {claim.certificateId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Participant Name', value: claim.participantName },
                { label: 'Certificate Reference', value: claim.certificateId, mono: true },
                { label: 'Risk Location', value: claim.propertyAddress },
                { label: 'Cover Type Included', value: claim.coverType },
                { label: 'Incident Date', value: claim.incidentDate },
                { label: 'Reporting Date', value: claim.submittedDate },
                { label: 'Claimed Value (Estimated)', value: `£${claim.amountClaimed.toLocaleString()}` },
                {
                  label: claim.status === 'Rejected' ? 'Approved Value (Settled)' : 'Approved Value',
                  value: claim.status === 'Rejected'
                    ? '£0.00 (Claim Rejected)'
                    : claim.amountApproved !== undefined
                      ? `£${claim.amountApproved.toLocaleString()}`
                      : 'Pending validation',
                },
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
                <div className="flex items-center gap-2">
                  <h2 className={`font-semibold text-sm ${TEXT_MAIN}`}>Documents & Evidence</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00c685]/15 text-[#00c685]">
                    {docs.length} files
                  </span>
                </div>
                <p className={`text-[11px] ${TEXT_MUTED}`}>
                  Invoices, damage photographs, contractor estimates, and loss adjuster reports.
                </p>
              </div>
              <button
                onClick={handleUploadMock}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 text-white shadow-sm"
                style={{ background: GREEN }}
              >
                <Upload size={12} /> Upload File
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors group"
                  style={{ border: `1px solid ${BORDER}` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#00c685]/10 shrink-0">
                    <FileText size={18} className="text-[#00c685]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${TEXT_MAIN}`} title={doc.name}>
                      {doc.name}
                    </p>
                    <p className={`text-[10px] ${TEXT_MUTED}`}>
                      {doc.sizeLabel} · {doc.uploadedDate} · by {doc.uploadedBy}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    doc.status === 'Verified' ? 'bg-green-500/10 text-green-500' :
                    doc.status === 'Received' ? 'bg-blue-500/10 text-blue-500' :
                    doc.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                    'bg-amber-500/10 text-amber-500'
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`font-semibold text-sm ${TEXT_MAIN}`}>
                  {can('view_internal_notes') ? 'Internal Notes & Comms Workspace' : 'Messages & Support'}
                </h2>
                <p className={`text-[11px] ${TEXT_MUTED}`}>
                  {can('view_internal_notes')
                    ? 'Cross-team handler assessment discussion, assessor logs, and participant messages.'
                    : 'Direct communication channel with your assigned Senior Claims Handler.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60">
                  {visibleNotes.length} updates
                </span>
              </div>
            </div>

            {/* Note input form */}
            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <div className="relative">
                <textarea
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder={can('view_internal_notes') ? "Write an internal assessment note or participant message..." : "Type your question or message to your assigned handler Omar Hassan..."}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl text-xs border transition-all focus:outline-none focus:border-[#00c685]/55 resize-none bg-black/[0.02] dark:bg-white/[0.03] ${
                    isLight ? 'border-black/[0.06] text-black placeholder:text-black/35' : 'border-white/[0.05] text-white placeholder:text-white/30'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                {can('view_internal_notes') ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={e => setIsInternalNote(e.target.checked)}
                      className="rounded border-black/[0.06] text-[#00c685] focus:ring-[#00c685]"
                    />
                    <span className={`text-xs font-medium ${TEXT_SUB}`}>
                      Internal assessment note (hidden from participant)
                    </span>
                  </label>
                ) : (
                  <span className={`text-[11px] ${TEXT_MUTED}`}>
                    Assigned handler responds typically within 2 business hours.
                  </span>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ background: GREEN }}
                >
                  <Send size={12} /> {role === 'participant' ? 'Send to Handler' : isInternalNote ? 'Log Internal Note' : 'Send to Participant'}
                </button>
              </div>
            </form>

            {/* Notes List with Linked Photo Avatars */}
            <div className="space-y-3.5">
              {visibleNotes.map((note) => {
                const avatarUrl = note.authorAvatar || getDicebearAvatar(
                  note.authorName,
                  note.authorGender || (note.authorName.includes('Fatima') || note.authorName.includes('Aisha') || note.authorName.includes('Maryam') || note.authorName.includes('Amira') || note.authorName.includes('Zahra') ? 'female' : 'male')
                );

                return (
                  <div
                    key={note.id}
                    className={`p-4 rounded-xl transition-all ${
                      note.isInternal
                        ? isLight ? 'bg-amber-500/[0.05] border border-amber-500/20' : 'bg-amber-500/[0.03] border border-amber-500/20'
                        : isLight ? 'bg-black/[0.02] border border-black/[0.04]' : 'bg-white/[0.03] border border-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        {/* Profile Photo Link */}
                        <img
                          src={avatarUrl}
                          alt={note.authorName}
                          className="w-7 h-7 rounded-full object-cover border border-black/10 dark:border-white/10 shrink-0 bg-white"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${TEXT_MAIN}`}>{note.authorName}</span>
                            {note.authorRole && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                note.authorRole.includes('Handler') ? 'bg-blue-500/10 text-blue-500' :
                                note.authorRole.includes('Participant') ? 'bg-[#00c685]/10 text-[#00c685]' :
                                note.authorRole.includes('Finance') ? 'bg-purple-500/10 text-purple-500' :
                                'bg-gray-500/10 text-gray-500'
                              }`}>
                                {note.authorRole}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] ${TEXT_MUTED}`}>{note.createdAt}</span>
                        {note.isInternal ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                            Internal Team Note
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00c685]/15 text-[#00c685]">
                            Participant Visible
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${TEXT_SUB}`}>{note.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Timeline, Actions & Profile Link) */}
        <div className="space-y-6">
          
          {/* Progress Timeline */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${TEXT_MUTED}`}>Timeline & SLA Tracking</h3>
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
                <div className="space-y-2.5">
                  {claim.status !== 'Approved' && claim.status !== 'Paid' && claim.status !== 'Rejected' ? (
                    <>
                      <button
                        onClick={() => updateStatus('Approved', 'Validator approved the assessed scope of works.', claim.amountClaimed)}
                        className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90 shadow-sm"
                        style={{ background: GREEN }}
                      >
                        Approve Claim (£{claim.amountClaimed.toLocaleString()})
                      </button>
                      <button
                        onClick={() => {
                          setRequestInstructions(`Dear ${claim.participantName}, to proceed with validating your ${claim.type} claim (${claim.id}), our claims assessment team requires the following supporting documentation. Please upload clear scanned copies or high-resolution photos directly to your portal.`);
                          setRequestDocsModalOpen(true);
                        }}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl border border-amber-500/20 text-amber-500 bg-amber-500/10 hover:bg-amber-500/15 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FolderPlus size={13} /> Request Additional Documents...
                      </button>
                      <button
                        onClick={() => {
                          setComplianceConfirmed(false);
                          setRejectModalOpen(true);
                        }}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl border border-red-500/20 text-red-500 bg-red-500/10 hover:bg-red-500/15 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={13} /> Reject Claim with Reason...
                      </button>
                    </>
                  ) : claim.status === 'Rejected' ? (
                    <div className="p-4 rounded-xl text-center space-y-2 bg-red-500/[0.04] border border-red-500/20">
                      <XCircle size={22} className="mx-auto text-red-500" />
                      <p className={`text-xs font-bold text-red-500`}>Claim Rejected</p>
                      <p className={`text-[11px] ${TEXT_SUB}`}>Reason recorded and participant notified.</p>
                      <button
                        onClick={() => setViewDecisionLetterModalOpen(true)}
                        className="w-full mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        <FileText size={11} /> View Decision Letter
                      </button>
                      <div>
                        <button
                          onClick={handleReopenClaim}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline"
                        >
                          <RefreshCw size={10} /> Re-open Claim
                        </button>
                      </div>
                    </div>
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
                      className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90 shadow-sm"
                      style={{ background: GREEN }}
                    >
                      Authorize & Release Payment (£{(claim.amountApproved || claim.amountClaimed).toLocaleString()})
                    </button>
                  ) : claim.status === 'Paid' ? (
                    <div className="p-4 rounded-xl text-center space-y-2 bg-black/[0.02] dark:bg-white/[0.02]" style={{ border: `1px solid ${BORDER}` }}>
                      <CheckCircle2 size={20} className="mx-auto text-emerald-400" />
                      <p className="text-xs font-semibold text-emerald-400">Payment Transferred</p>
                      <p className={`text-[10px] ${TEXT_SUB}`}>Reference: PYMNT-{claim.id}</p>
                    </div>
                  ) : (
                    <p className={`text-xs text-center ${TEXT_MUTED}`}>Awaiting Handler approval before treasury disbursement.</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Linked Profile Card: Participant Details or Assigned Handler */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="rounded-2xl p-5 transition-colors duration-200"
            style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                {role === 'participant' ? 'Assigned Handler' : 'Participant Profile'}
              </h3>

              {role !== 'participant' && (
                <Link
                  href="/dashboard/participants"
                  className="text-[10px] font-bold text-[#00c685] hover:underline flex items-center gap-0.5"
                >
                  Registry <ArrowUpRight size={10} />
                </Link>
              )}
            </div>

            {role === 'participant' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getDicebearAvatar('Omar Hassan', 'male')}
                    alt="Omar Hassan"
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500/30 bg-blue-500/10 shadow-sm shrink-0"
                  />
                  <div>
                    <p className={`font-bold text-xs ${TEXT_MAIN}`}>Omar Hassan</p>
                    <p className="text-[10px] font-semibold text-blue-500">Senior Claims Handler</p>
                    <p className={`text-[10px] mt-0.5 ${TEXT_MUTED}`}>Takaful UK Direct Line</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className={TEXT_MUTED} />
                    <span className={TEXT_SUB}>o.hassan@takaful.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className={TEXT_MUTED} />
                    <span className={TEXT_SUB}>+44 20 7946 0192</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.querySelector('textarea');
                    if (el) el.focus();
                  }}
                  className="w-full text-xs font-semibold py-2 rounded-xl border border-[#00c685]/30 text-[#00c685] bg-[#00c685]/10 hover:bg-[#00c685]/15 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={12} /> Message Omar directly
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getDicebearAvatar(claim.participantName, participantRecord.name.includes('Fatima') || participantRecord.name.includes('Aisha') || participantRecord.name.includes('Maryam') ? 'female' : 'male')}
                    alt={claim.participantName}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-[#00c685]/30 bg-emerald-500/10 shadow-sm shrink-0"
                  />
                  <div>
                    <p className={`font-bold text-xs ${TEXT_MAIN}`}>{claim.participantName}</p>
                    <p className={`text-[10px] font-mono ${TEXT_MUTED}`}>ID: {claim.participantId}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#00c685]/15 text-[#00c685]">
                        {participantRecord.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500">
                        {participantRecord.riskRating} Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className={TEXT_MUTED} />
                    <span className={TEXT_SUB}>{participantRecord.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className={TEXT_MUTED} />
                    <span className={TEXT_SUB}>{participantRecord.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home size={12} className={TEXT_MUTED} />
                    <span className={`text-[11px] truncate ${TEXT_SUB}`}>{claim.propertyAddress}</span>
                  </div>
                </div>

                <Link
                  href="/dashboard/participants"
                  className="w-full text-center text-xs font-semibold py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors block"
                >
                  Open in Participant Registry
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* REQUEST ADDITIONAL DOCUMENTS MODAL                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {requestDocsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-start justify-center pt-16 pb-6 px-3 sm:px-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
            onClick={() => setRequestDocsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 my-8"
              style={{
                background: isLight ? '#ffffff' : '#0d2117',
                border: `1px solid ${BORDER}`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/25">
                    <FolderPlus size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Request Additional Documents</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500">
                        {claim.id}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${TEXT_MUTED}`}>
                      Participant: <span className="font-semibold text-[#00c685]">{claim.participantName}</span> · Peril: {claim.type} · Cover: {claim.coverType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRequestDocsModalOpen(false)}
                  className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${TEXT_MUTED}`}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleDispatchRequest} className="space-y-4">
                {/* Step 1: Document Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                      1. Select Required Documents ({selectedDocPresets.length} selected):
                    </label>
                    <span className="text-[11px] text-[#00c685] font-semibold">
                      Check all that apply
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {DOCUMENT_REQUEST_PRESETS.map(preset => {
                      const isChecked = selectedDocPresets.includes(preset.id);
                      return (
                        <label
                          key={preset.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'border-amber-500/50 bg-amber-500/[0.06]'
                              : 'border-black/[0.06] dark:border-white/[0.05] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedDocPresets(prev =>
                                isChecked ? prev.filter(id => id !== preset.id) : [...prev, preset.id]
                              );
                            }}
                            className="mt-1 rounded border-amber-500/40 text-amber-500 focus:ring-amber-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`font-semibold text-xs ${isChecked ? (isLight ? 'text-amber-950' : 'text-amber-200') : TEXT_MAIN}`}>
                                {preset.name}
                              </p>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase tracking-wider text-black/60 dark:text-white/60">
                                {preset.badge}
                              </span>
                            </div>
                            <p className={`text-[11px] mt-0.5 leading-relaxed ${TEXT_MUTED}`}>
                              {preset.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Custom Document */}
                <div
                  className="rounded-xl border border-dashed p-3.5 space-y-2.5"
                  style={{ borderColor: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.10)', background: isLight ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] font-black">+</span>
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                      Add a Specific / Custom Document&nbsp;<span className={`normal-case font-normal ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>(Optional — for documents not in the presets above)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customDocName}
                      onChange={e => setCustomDocName(e.target.value)}
                      placeholder="e.g. Police Incident Report, Gas Safety Certificate, Scaffolding Quote…"
                      className={`flex-1 px-3 py-2 rounded-lg text-xs border outline-none transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 ${
                        isLight
                          ? 'border-black/[0.10] text-gray-800 bg-white placeholder:text-gray-400'
                          : 'border-white/[0.10] text-gray-100 bg-white/[0.04] placeholder:text-gray-500'
                      }`}
                    />
                    <select
                      value={customDocType}
                      onChange={e => setCustomDocType(e.target.value as any)}
                      className={`px-3 py-2 rounded-lg text-xs border outline-none cursor-pointer transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 ${
                        isLight
                          ? 'border-black/[0.10] text-gray-800 bg-white'
                          : 'border-white/[0.10] text-gray-100 bg-[#0d2117]'
                      }`}
                    >
                      <option value="Evidence">Evidence</option>
                      <option value="Quote">Quote / Estimate</option>
                      <option value="Report">Report</option>
                      <option value="Photo">Photo / Media</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </div>
                  {customDocName.trim() && (
                    <p className="text-[10px] text-amber-500/80 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      Will be added to the request as: <strong>&ldquo;{customDocName.trim()}&rdquo;</strong> ({customDocType})
                    </p>
                  )}
                </div>


                {/* Step 2: Response SLA & Deadline */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                      2. Participant Response Deadline (SLA Target):
                    </label>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Clock size={12} /> Target: {new Date(Date.now() + (parseInt(requestDeadlineDays, 10) || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { days: '2', label: '48 Hours', note: 'Urgent SLA' },
                      { days: '7', label: '7 Days', note: 'Standard (Rec)' },
                      { days: '14', label: '14 Days', note: 'Trades Quote' },
                      { days: '21', label: '21 Days', note: 'Complex Scope' },
                    ].map(opt => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => setRequestDeadlineDays(opt.days)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          requestDeadlineDays === opt.days
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold ring-1 ring-amber-500/50'
                            : `hover:border-amber-500/40 hover:bg-amber-500/[0.04] ${isLight ? 'border-gray-300 text-gray-800' : 'border-white/20 text-gray-200'}`
                        }`}
                      >
                        <p className="text-xs font-semibold">{opt.label}</p>
                        <p className={`text-[10px] mt-0.5 ${requestDeadlineDays === opt.days ? 'text-amber-500/80' : TEXT_MUTED}`}>
                          {opt.note}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Instructions to Participant */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${TEXT_MUTED}`}>
                    3. Cover Message & Instructions for {claim.participantName}:
                  </label>
                  <textarea
                    rows={3}
                    value={requestInstructions}
                    onChange={e => setRequestInstructions(e.target.value)}
                    placeholder="Instructions regarding acceptable file formats, scope guidance, or approved contractor contacts..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border resize-none ${
                      isLight ? 'border-black/[0.08] text-black bg-black/[0.01]' : 'border-white/[0.08] text-white bg-white/[0.02]'
                    }`}
                  />
                </div>

                {/* Step 4: Dispatch channels */}
                <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifyEmail}
                        onChange={e => setNotifyEmail(e.target.checked)}
                        className="rounded border-amber-500/40 text-amber-500 focus:ring-amber-500"
                      />
                      <span className={TEXT_SUB}>Email notification</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notifySms}
                        onChange={e => setNotifySms(e.target.checked)}
                        className="rounded border-amber-500/40 text-amber-500 focus:ring-amber-500"
                      />
                      <span className={TEXT_SUB}>SMS Alert</span>
                    </label>
                  </div>

                  <span className={`text-[11px] ${TEXT_MUTED}`}>
                    Status will transition to <strong className="text-orange-500">Awaiting Information</strong>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: BORDER }}>
                  <button
                    type="button"
                    onClick={() => setRequestDocsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 shadow-sm flex items-center gap-1.5"
                    style={{ background: '#f59e0b' }}
                  >
                    <Send size={12} /> Dispatch Document Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* UPGRADED REJECT CLAIM MODAL (WITH LETTERHEAD PREVIEW)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-start justify-center pt-16 pb-6 px-3 sm:px-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
            onClick={() => setRejectModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 my-8"
              style={{
                background: isLight ? '#ffffff' : '#0d2117',
                border: `1px solid ${BORDER}`,
              }}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center border border-red-500/30">
                    <AlertOctagon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Adjudicate Claim: Issue Rejection Notice</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-red-500/15 text-red-500 border border-red-500/20">
                        {claim.id}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${TEXT_MUTED}`}>
                      Participant: <span className="font-semibold text-red-500">{claim.participantName}</span> · Claimed: £{claim.amountClaimed.toLocaleString()} · Peril: {claim.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${TEXT_MUTED}`}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmRejection} className="space-y-4 pt-1">
                  {/* Financial Impact Snapshot */}
                  <div
                  className="p-3 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
                  style={{
                    background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                    borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)',
                  }}
                  >
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-wider ${TEXT_MUTED}`}>Claimed Value</p>
                      <p className="text-sm font-extrabold mt-0.5" style={{ color: isLight ? '#111827' : '#f1f5f9' }}>£{claim.amountClaimed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-wider ${TEXT_MUTED}`}>Policy Excess</p>
                      <p className="text-sm font-extrabold text-amber-500 mt-0.5">£300.00</p>
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-wider ${TEXT_MUTED}`}>Approved Settlement</p>
                      <p className="text-sm font-extrabold mt-0.5" style={{ color: isLight ? '#dc2626' : '#fca5a5' }}>£0.00</p>
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-wider ${TEXT_MUTED}`}>Pool Preservation</p>
                      <p className="text-sm font-extrabold text-[#00c685] mt-0.5">+£{claim.amountClaimed.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Policy Grounds Selector */}
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${TEXT_MUTED}`}>
                      Primary Policy Adjudication Ground:
                    </label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {REJECTION_PRESETS.map((preset) => {
                        const isSelected = rejectionReasonPreset === preset.id;
                        return (
                          <label
                            key={preset.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? isLight
                                  ? 'border-rose-400 bg-rose-50 shadow-xs'
                                  : 'border-rose-500/50 bg-rose-500/[0.07] shadow-xs'
                                : isLight
                                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  : 'border-white/10 hover:border-white/18 hover:bg-white/[0.03]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="rejectionReasonPreset"
                              checked={isSelected}
                              onChange={() => {
                                setRejectionReasonPreset(preset.id);
                                if (preset.id !== 'custom') {
                                  setCustomRejectionText(preset.text);
                                  setRejectionClauseInput(preset.clause);
                                }
                              }}
                              className="mt-0.5 accent-rose-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`font-semibold ${isSelected ? (isLight ? 'text-rose-700' : 'text-rose-300') : TEXT_MAIN}`}>
                                  {preset.label}
                                </p>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isLight ? 'bg-rose-100 text-rose-600' : 'bg-rose-500/15 text-rose-300'}`}>
                                  {preset.badge}
                                </span>
                              </div>
                              {preset.clause && (
                                <p className={`text-[10px] mt-0.5 font-mono font-medium ${isLight ? 'text-rose-500' : 'text-rose-400/80'}`}>
                                  {preset.clause}
                                </p>
                              )}
                              {preset.text && (
                                <p className={`text-[11px] mt-1 leading-relaxed ${TEXT_MUTED}`}>
                                  {preset.text}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Policy Clause Input */}
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${TEXT_MUTED}`}>
                      Applicable Policy Clause Reference:
                    </label>
                    <input
                      type="text"
                      value={rejectionClauseInput}
                      onChange={e => setRejectionClauseInput(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border font-mono outline-none transition-all focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400/60 ${
                        isLight
                          ? 'border-gray-200 text-gray-800 bg-white'
                          : 'border-white/10 text-gray-100 bg-white/[0.03]'
                      }`}
                    />
                  </div>

                  {/* Detailed Explanation */}
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${TEXT_MUTED}`}>
                      Detailed Written Justification to Participant:
                    </label>
                    <textarea
                      rows={3}
                      value={customRejectionText || REJECTION_PRESETS.find(p => p.id === rejectionReasonPreset)?.text || ''}
                      onChange={e => setCustomRejectionText(e.target.value)}
                      placeholder="Specify exact excess calculations, surveyor citations, and policy schedule disclaimers..."
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border resize-none leading-relaxed outline-none transition-all focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400/60 ${
                        isLight
                          ? 'border-gray-200 text-gray-800 bg-white placeholder:text-gray-400'
                          : 'border-white/10 text-gray-100 bg-white/[0.03] placeholder:text-gray-500'
                      }`}
                    />
                  </div>

                  {/* Statutory Checkboxes & Compliance Attestation */}
                  <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: BORDER }}>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeAppealSchedule}
                          onChange={e => setIncludeAppealSchedule(e.target.checked)}
                          className="rounded accent-rose-500"
                        />
                        <span className={TEXT_SUB}>Attach 14-day statutory participant appeal schedule</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifyParticipantRejection}
                          onChange={e => setNotifyParticipantRejection(e.target.checked)}
                          className="rounded accent-rose-500"
                        />
                        <span className={TEXT_SUB}>Generate PDF Notice in documents & send email/SMS</span>
                      </label>
                    </div>

                    <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs select-none transition-all ${
                      isLight ? 'border-rose-200 bg-rose-50/60' : 'border-rose-500/20 bg-rose-500/[0.05]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={complianceConfirmed}
                        onChange={e => setComplianceConfirmed(e.target.checked)}
                        className="mt-0.5 rounded accent-rose-500"
                      />
                      <span className={`text-[11px] leading-relaxed ${isLight ? 'text-rose-800' : 'text-rose-300/90'}`}>
                        <strong>Mandatory Adjudication Declaration:</strong> I confirm this rejection has been substantiated against Certificate Terms, Policy Excess parameters, and Shariah Mutual Pool Governance rules.
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: BORDER }}>
                    <button
                      type="button"
                      onClick={() => setRejectModalOpen(false)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isLight ? 'border-gray-200 hover:bg-gray-50 text-gray-700' : 'border-white/10 hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!complianceConfirmed}
                      className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 ${
                        complianceConfirmed ? 'bg-rose-500 hover:bg-rose-600' : 'bg-rose-400/40 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <AlertOctagon size={13} /> Confirm Rejection
                    </button>
                  </div>
                </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DECISION LETTER VIEWER MODAL (VIEW / PRINT NOTICE)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {viewDecisionLetterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-start justify-center pt-16 pb-6 px-3 sm:px-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
            onClick={() => setViewDecisionLetterModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 my-8"
              style={{
                background: isLight ? '#ffffff' : '#0d2117',
                border: `1px solid ${BORDER}`,
              }}
            >
              <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center border border-red-500/30">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Formal Notice of Claim Disallowance</h3>
                    <p className={`text-xs ${TEXT_MUTED}`}>
                      Reference: DISALLOW-{claim.id} · Issued to {claim.participantName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewDecisionLetterModalOpen(false)}
                  className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${TEXT_MUTED}`}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-inner text-xs space-y-4 max-h-[480px] overflow-y-auto leading-relaxed"
                style={{
                  background: isLight ? '#fefefe' : '#0a1610',
                  borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.1)',
                  color: isLight ? '#1f2937' : '#e5e7eb',
                }}
              >
                {/* Official Letterhead */}
                <div className="border-b pb-4 flex items-start justify-between gap-4 font-sans" style={{ borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00c685] flex items-center justify-center text-white font-bold text-sm font-mono">
                        T
                      </div>
                      <span className="font-extrabold tracking-tight text-sm">TAKAFUL UK MUTUAL BENEFIT SOCIETY</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Authorised by the Prudential Regulation Authority · Mutual Participant Protection Scheme
                    </p>
                  </div>

                  <div className="text-right text-[10px] text-gray-500 font-mono">
                    <p>REF: DISALLOW-{claim.id}</p>
                    <p>DATE: {claim.rejectionDate || '18 Jul 2026'}</p>
                    <p>CERTIFICATE: {claim.certificateId || 'TK-2024-0042'}</p>
                  </div>
                </div>

                {/* Addressee */}
                <div className="font-sans text-xs space-y-0.5">
                  <p className="font-bold">{claim.participantName}</p>
                  <p className="text-gray-500">{claim.propertyAddress}</p>
                </div>

                {/* Subject */}
                <div className="font-sans font-bold text-sm text-red-600 dark:text-red-400 border-l-4 border-red-500 pl-3 py-0.5">
                  FORMAL NOTICE OF CLAIM DISALLOWANCE — CLAIM {claim.id}
                </div>

                {/* Letter Body */}
                <div className="space-y-3 font-sans text-xs leading-relaxed">
                  <p>
                    Dear {claim.participantName},
                  </p>
                  <p>
                    We write to formally record the determination reached by the Takaful Claims Adjudication Committee regarding your reported loss event of <strong>{claim.incidentDate}</strong> ({claim.type} Damage under {claim.coverType} cover).
                  </p>
                  <p>
                    Following thorough evaluation of the loss adjusters' report, itemised trades estimates, and policy conditions, we regret to advise you that <strong>no disbursement can be issued from the participant mutual pool</strong> for this claim.
                  </p>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] space-y-2 font-mono text-[11px]" style={{ borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)' }}>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gross Claimed Amount:</span>
                      <span className="font-bold">£{claim.amountClaimed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Applicable Policy Deductible / Excess:</span>
                      <span className="font-bold text-amber-500">£300.00</span>
                    </div>
                    <div className="flex justify-between border-t pt-1.5" style={{ borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)' }}>
                      <span className="text-gray-500">Payable Settlement:</span>
                      <span className="font-bold text-red-500">£0.00 (Disallowed)</span>
                    </div>
                  </div>

                  {/* Adjudication Clause & Grounds */}
                  <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/[0.03] space-y-1.5 font-sans">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                      Governing Policy Schedule Reference:
                    </p>
                    <p className="font-mono text-xs font-semibold text-red-600 dark:text-red-300">
                      {claim.rejectionClause || 'Clause 4.2 — Certificate Excess & Deductibles (£300 Minimum)'}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {claim.rejectionReason || 'Total assessed repair costs fall below the mandatory Certificate Policy Excess threshold of £300.00.'}
                    </p>
                  </div>

                  {/* Statutory Appeal Notice */}
                  <div className="border-t pt-3 space-y-1 text-xs" style={{ borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }}>
                    <p className="font-bold text-gray-900 dark:text-gray-100">Participant Appeal Rights (14-Day SLA Window):</p>
                    <p className="text-gray-600 dark:text-gray-400 text-[11px]">
                      If you dispute this assessment or possess additional corroborating evidence not previously submitted, you are entitled to submit a formal Appeal within <strong>14 calendar days</strong> of this notice. Appeals are reviewed by the Independent Shariah Adjudication Panel.
                    </p>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-4 flex items-end justify-between font-sans">
                    <div>
                      <p className="text-[11px] text-gray-500">Signed,</p>
                      <p className="font-bold text-xs mt-1">{claim.assignedHandlerName || 'Omar Hassan'}</p>
                      <p className="text-[10px] text-gray-500">Senior Claims Handler · Claims Adjudication Division</p>
                      <p className="text-[10px] text-gray-400">Takaful UK Mutual Society</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/30">
                        OFFICIALLY RECORDED IN REGISTRY
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: BORDER }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5"
                >
                  <Printer size={13} /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewDecisionLetterModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ background: GREEN }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
