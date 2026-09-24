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
  Printer, FolderPlus, Banknote,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme, useRole } from '../../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { CLAIMS, CLAIM_DOCUMENTS, CLAIM_NOTES, PARTICIPANTS, DEMO_USERS } from '@/lib/dashboard/mock-data';
import { Claim, ClaimDocument, ClaimNote } from '@/lib/dashboard/types';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import { DashboardAlert } from '@/components/ui/dashboard-alert';

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

  // Rejection Modal & Appeal States (Multi-Select Architecture)
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRejectionPresets, setSelectedRejectionPresets] = useState<string[]>(['excess']);
  const [customRejectionText, setCustomRejectionText] = useState(REJECTION_PRESETS[0].text);
  const [rejectionClauseInput, setRejectionClauseInput] = useState(REJECTION_PRESETS[0].clause);
  const [isTextCustomized, setIsTextCustomized] = useState(false);
  const [isClauseCustomized, setIsClauseCustomized] = useState(false);
  const [showAppealGuide, setShowAppealGuide] = useState(false);
  const [includeAppealSchedule, setIncludeAppealSchedule] = useState(true);
  const [notifyParticipantRejection, setNotifyParticipantRejection] = useState(true);
  const [complianceConfirmed, setComplianceConfirmed] = useState(false);
  const [rejectionActiveTab, setRejectionActiveTab] = useState<'form' | 'preview'>('form');
  const [rejectionSubmitAttempted, setRejectionSubmitAttempted] = useState(false);
  const [viewDecisionLetterModalOpen, setViewDecisionLetterModalOpen] = useState(false);

  const handleToggleRejectionPreset = (presetId: string) => {
    const nextSelected = selectedRejectionPresets.includes(presetId)
      ? selectedRejectionPresets.filter(id => id !== presetId)
      : [...selectedRejectionPresets, presetId];

    setSelectedRejectionPresets(nextSelected);

    const chosen = REJECTION_PRESETS.filter(p => nextSelected.includes(p.id));

    if (!isClauseCustomized) {
      if (chosen.length === 0) {
        setRejectionClauseInput('');
      } else if (chosen.length === 1) {
        setRejectionClauseInput(chosen[0].clause);
      } else {
        setRejectionClauseInput(chosen.map(p => p.clause).join(' ; '));
      }
    }

    if (!isTextCustomized) {
      if (chosen.length === 0) {
        setCustomRejectionText('');
      } else if (chosen.length === 1) {
        setCustomRejectionText(chosen[0].text);
      } else {
        const composite = chosen
          .map((p, idx) => `${idx + 1}. [${p.badge} — ${p.label}]\n${p.text}`)
          .join('\n\n');
        setCustomRejectionText(composite);
      }
    }
  };

  const handleSelectAllRejectionPresets = () => {
    const allIds = REJECTION_PRESETS.map(p => p.id);
    setSelectedRejectionPresets(allIds);
    setIsClauseCustomized(false);
    setIsTextCustomized(false);
    setRejectionClauseInput(REJECTION_PRESETS.map(p => p.clause).join(' ; '));
    setCustomRejectionText(
      REJECTION_PRESETS.map((p, idx) => `${idx + 1}. [${p.badge} — ${p.label}]\n${p.text}`).join('\n\n')
    );
  };

  const handleClearRejectionPresets = () => {
    setSelectedRejectionPresets([]);
    setIsClauseCustomized(false);
    setIsTextCustomized(false);
    setRejectionClauseInput('');
    setCustomRejectionText('');
  };

  const handleResetRejectionAuto = () => {
    setIsClauseCustomized(false);
    setIsTextCustomized(false);
    const chosen = REJECTION_PRESETS.filter(p => selectedRejectionPresets.includes(p.id));
    if (chosen.length === 0) {
      setRejectionClauseInput('');
      setCustomRejectionText('');
    } else if (chosen.length === 1) {
      setRejectionClauseInput(chosen[0].clause);
      setCustomRejectionText(chosen[0].text);
    } else {
      setRejectionClauseInput(chosen.map(p => p.clause).join(' ; '));
      setCustomRejectionText(
        chosen.map((p, idx) => `${idx + 1}. [${p.badge} — ${p.label}]\n${p.text}`).join('\n\n')
      );
    }
  };

  // Adjudication Settlement Modal States
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [assessedAmountInput, setAssessedAmountInput] = useState(String(claim.amountClaimed));
  const COMPULSORY_EXCESS = 300; // from Clause 4.2 — would come from CERTIFICATES in production

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
  const updateStatus = (newStatus: Claim['status'], msg: string, approvedAmount?: number, excessDeducted?: number, grossAssessed?: number) => {
    const net = approvedAmount;
    setClaim(prev => ({
      ...prev,
      status: newStatus,
      amountApproved: approvedAmount !== undefined ? approvedAmount : prev.amountApproved,
      grossAssessedAmount: grossAssessed !== undefined ? grossAssessed : prev.grossAssessedAmount,
      excessDeducted: excessDeducted !== undefined ? excessDeducted : prev.excessDeducted,
      netSettlementAmount: net !== undefined ? net : prev.netSettlementAmount,
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

  // Confirm Rejection with Multi-Ground Reason & Generate Formal Notice
  const handleConfirmRejection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedRejectionPresets.length === 0 && !customRejectionText.trim()) {
      showToast('Please select at least one contractual ground or enter written justification', 'error');
      return;
    }
    if (!complianceConfirmed) {
      setRejectionSubmitAttempted(true);
      setRejectionActiveTab('form');
      showToast('Please tick the mandatory declaration box to confirm this rejection', 'error');
      return;
    }

    const chosen = REJECTION_PRESETS.filter(p => selectedRejectionPresets.includes(p.id));
    const autoReason = chosen.length > 1
      ? chosen.map((p, i) => `${i + 1}. ${p.label}: ${p.text}`).join('\n\n')
      : (chosen[0]?.text || 'Claim rejected following comprehensive underwriting and policy excess review.');

    const finalReason = customRejectionText.trim() || autoReason;
    const finalClause = rejectionClauseInput.trim() || (chosen.length > 0 ? chosen.map(p => p.clause).join(' ; ') : 'Clause 4.2 — Certificate Excess & Deductibles');
    const decisionDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setClaim(prev => ({
      ...prev,
      status: 'Rejected',
      rejectionReason: finalReason,
      rejectionClause: finalClause,
      rejectionDate: decisionDate,
      rejectionNotes: `Formal rejection notice issued by Omar Hassan. Grounds cited (${chosen.length || 1}): ${finalReason}`,
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

  // Handle Approve Claim via Adjudication Modal
  const handleConfirmApproval = () => {
    const gross = parseFloat(assessedAmountInput) || claim.amountClaimed;
    const excess = COMPULSORY_EXCESS;
    const net = Math.max(0, gross - excess);
    const decisionDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    setClaim(prev => ({
      ...prev,
      status: 'Approved',
      grossAssessedAmount: gross,
      excessDeducted: excess,
      netSettlementAmount: net,
      amountApproved: net,
      lastActivityNote: `Claim approved. Net settlement £${net.toLocaleString()} (£${gross.toLocaleString()} assessed − £${excess} excess). Referred to Finance for BACS payment.`,
      lastActivityDate: 'Today',
    }));

    // Add a formal internal adjudication audit note
    const adjudicationNote: ClaimNote = {
      id: `NOTE-${Date.now()}`,
      claimId: claim.id,
      authorId: 'U-HAND-001',
      authorName: 'Omar Hassan',
      authorInitials: 'OH',
      authorRole: 'Senior Claims Handler',
      authorGender: 'male',
      authorAvatar: getDicebearAvatar('Omar Hassan', 'male'),
      text: `Adjudication Summary:\n\nGross Assessed Loss: £${gross.toLocaleString()}\nCertificate Excess Deducted (Clause 4.2): −£${excess.toLocaleString()}\nNet Authorised Settlement: £${net.toLocaleString()}\n\nClaim authorised and forwarded to Finance Treasury for BACS disbursement. Participant to receive settlement net of their contractual excess.`,
      isInternal: true,
      createdAt: decisionDate,
    };

    // Add a participant-facing approval notice
    const approvalNotice: ClaimNote = {
      id: `NOTE-${Date.now() + 1}`,
      claimId: claim.id,
      authorId: 'U-HAND-001',
      authorName: 'Omar Hassan',
      authorInitials: 'OH',
      authorRole: 'Senior Claims Handler',
      authorGender: 'male',
      authorAvatar: getDicebearAvatar('Omar Hassan', 'male'),
      text: `Dear ${claim.participantName},\n\nWe are pleased to confirm that your ${claim.type} claim (${claim.id}) has been reviewed and approved following our assessor's inspection.\n\nSettlement Breakdown:\n• Gross Assessed Repair Cost: £${gross.toLocaleString()}\n• Certificate Policy Excess (Clause 4.2): −£${excess.toLocaleString()}\n• Net Authorised Settlement: £${net.toLocaleString()}\n\nYour net settlement of £${net.toLocaleString()} will be transferred to your registered bank account via BACS within 3–5 business days. A remittance advice will be emailed to you upon release.\n\nJazakAllah Khair for your patience throughout this process.`,
      isInternal: false,
      createdAt: decisionDate,
    };

    setNotes(prev => [adjudicationNote, approvalNotice, ...prev]);
    setApproveModalOpen(false);
    showToast(`Claim approved — Net settlement £${net.toLocaleString()} authorised (£${gross.toLocaleString()} − £${excess} excess)`, 'success');
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
            key="toast"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-5 right-5 z-[500] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-white font-semibold text-xs max-w-sm"
            style={{ background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : GREEN }}
          >
            {toast.type === 'success' && <Check size={15} className="shrink-0" />}
            {toast.type === 'info' && <Info size={15} className="shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={15} className="shrink-0" />}
            <span className="leading-snug">{toast.message}</span>
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
                background: isLight ? '#ffffff' : '#0e1d17',
                borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
                boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5 border border-slate-500/20">
                  <XCircle size={20} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        Claim Decision: Rejected
                      </span>
                      <span className={`text-xs font-medium ${TEXT_MUTED}`}>
                        Decided on {claim.rejectionDate || '18 Jul 2026'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setViewDecisionLetterModalOpen(true)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                          isLight
                            ? 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100'
                            : 'border-white/10 text-gray-300 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <FileText size={12} /> View Decision Notice
                      </button>
                      {role !== 'participant' && (
                        <button
                          onClick={handleReopenClaim}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <RefreshCw size={12} /> Re-open for Re-assessment
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-sm font-bold mt-2.5 ${TEXT_MAIN}`}>
                    Contractual Grounds for Claim Rejection:
                  </h3>
                  <div className={`text-xs mt-1 leading-relaxed font-normal whitespace-pre-line ${TEXT_MUTED}`}>
                    {claim.rejectionReason || 'The claim falls under the mandatory certificate policy excess threshold or standard policy exclusion criteria.'}
                  </div>

                  <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2 border-t" style={{ borderColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={13} className="text-gray-400 shrink-0" />
                      <span className={`text-[11px] font-mono font-medium ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                        {claim.rejectionClause || 'Clause 4.2 — Certificate Excess & Deductibles (£300 Minimum)'}
                      </span>
                    </div>

                    {role === 'participant' ? (
                      <button
                        onClick={() => setShowAppealGuide(!showAppealGuide)}
                        className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:underline flex items-center gap-1"
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
                        onClick={() => {
                          setAssessedAmountInput(String(claim.amountClaimed));
                          setApproveModalOpen(true);
                        }}
                        className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90 shadow-sm"
                        style={{ background: GREEN }}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={13} /> Approve Claim &amp; Set Settlement...
                        </span>
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
                          setRejectionSubmitAttempted(false);
                          setRejectionActiveTab('form');
                          setRejectModalOpen(true);
                        }}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl border border-red-500/25 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/40 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={13} className="text-red-500" /> Adjudicate & Issue Rejection...
                      </button>
                    </>
                  ) : claim.status === 'Rejected' ? (
                    <div className={`p-4 rounded-xl text-center space-y-2 border ${
                      isLight ? 'bg-gray-50/80 border-gray-200' : 'bg-white/[0.02] border-white/10'
                    }`}>
                      <div className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto border border-black/5 dark:border-white/10">
                        <XCircle size={18} className="text-red-500" />
                      </div>
                      <p className={`text-xs font-bold ${TEXT_MAIN}`}>Claim Adjudication: Disallowed</p>
                      <p className={`text-[11px] ${TEXT_MUTED}`}>Formal notice issued with 14-day statutory appeal window.</p>
                      <button
                        onClick={() => setViewDecisionLetterModalOpen(true)}
                        className={`w-full mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 px-3 rounded-lg border transition-colors ${
                          isLight
                            ? 'border-gray-200 text-gray-800 bg-white hover:bg-gray-100 shadow-xs'
                            : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <FileText size={11} /> View Decision Letter
                      </button>
                      <div>
                        <button
                          onClick={handleReopenClaim}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:underline"
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
                      onClick={() => {
                        const net = claim.netSettlementAmount ?? claim.amountApproved ?? claim.amountClaimed;
                        const bacsRef = `BACS-TK-2026-${claim.id.split('-').pop()}`;
                        setClaim(prev => ({ ...prev, status: 'Paid', bacsReference: bacsRef, lastActivityDate: 'Today', lastActivityNote: `Payment of £${net.toLocaleString()} released via BACS. Reference: ${bacsRef}` }));
                        const bacsNote: ClaimNote = {
                          id: `NOTE-${Date.now()}`,
                          claimId: claim.id,
                          authorId: 'U-FIN-001',
                          authorName: 'Amira Siddiqui',
                          authorInitials: 'AS',
                          authorRole: 'Finance Officer',
                          authorGender: 'female',
                          authorAvatar: getDicebearAvatar('Amira Siddiqui', 'female'),
                          text: `Treasury Disbursement Confirmed.\n\nBACS Reference: ${bacsRef}\nNet Settlement Paid: £${net.toLocaleString()}\nRecipient: ${claim.participantName}\n\nFunds will clear within 3 working days. Remittance advice sent to ${claim.participantName.split(' ')[0]} via email.`,
                          isInternal: false,
                          createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        };
                        setNotes(prev => [bacsNote, ...prev]);
                        showToast(`Payment of £${net.toLocaleString()} authorized. BACS ref: ${bacsRef}`, 'success');
                      }}
                      className="w-full text-xs font-bold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90 shadow-sm"
                      style={{ background: GREEN }}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <Banknote size={13} /> Release BACS Payment (£{(claim.netSettlementAmount ?? claim.amountApproved ?? claim.amountClaimed).toLocaleString()})
                      </span>
                    </button>
                  ) : claim.status === 'Paid' ? (
                    <div className="p-4 rounded-xl text-center space-y-2 bg-black/[0.02] dark:bg-white/[0.02]" style={{ border: `1px solid ${BORDER}` }}>
                      <CheckCircle2 size={20} className="mx-auto text-emerald-400" />
                      <p className="text-xs font-semibold text-emerald-400">Payment Transferred</p>
                      <p className={`text-[10px] ${TEXT_SUB}`}>BACS Ref: {claim.bacsReference || `BACS-TK-2026-${claim.id.split('-').pop()}`}</p>
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
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ADJUDICATION SETTLEMENT MODAL — Approve Claim                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {approveModalOpen && (() => {
          const gross = parseFloat(assessedAmountInput) || 0;
          const excess = COMPULSORY_EXCESS;
          const net = Math.max(0, gross - excess);
          const belowExcess = gross > 0 && gross <= excess;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm"
              onClick={() => setApproveModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 12 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5"
                style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <h2 className={`text-sm font-bold ${TEXT_MAIN}`}>Adjudication Settlement</h2>
                    </div>
                    <p className={`text-xs ${TEXT_SUB}`}>
                      Confirm assessed loss and calculate net payout for {claim.id}
                    </p>
                  </div>
                  <button onClick={() => setApproveModalOpen(false)} className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${TEXT_MUTED}`}>
                    <X size={14} />
                  </button>
                </div>

                {/* Claim reference */}
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isLight ? '#f4f6f5' : '#112218', border: `1px solid ${BORDER}` }}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${TEXT_MUTED}`}>Claim</p>
                    <p className={`text-xs font-bold font-mono ${TEXT_MAIN}`}>{claim.id}</p>
                    <p className={`text-[11px] ${TEXT_SUB} truncate`}>{claim.participantName} · {claim.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${TEXT_MUTED}`}>Gross Claimed</p>
                    <p className={`text-sm font-bold ${TEXT_MAIN}`}>£{claim.amountClaimed.toLocaleString()}</p>
                  </div>
                </div>

                {/* Assessed Amount Input */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ${TEXT_MUTED}`}>
                    Assessed Repair / Loss Amount (£)
                  </label>
                  <p className={`text-[10px] ${TEXT_MUTED}`}>
                    Default: participant's claimed amount. Adjust if the assessor negotiated a different scope.
                  </p>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${TEXT_SUB}`}>£</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={assessedAmountInput}
                      onChange={e => setAssessedAmountInput(e.target.value)}
                      className={`w-full pl-7 pr-4 py-2.5 rounded-xl text-sm font-bold border focus:outline-none focus:border-[#00c685]/60 transition-colors ${
                        isLight ? 'bg-white border-black/10 text-black' : 'bg-white/[0.04] border-white/10 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Live Settlement Calculation */}
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                  <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${TEXT_MUTED}`} style={{ background: isLight ? '#f4f6f5' : '#112218' }}>
                    Settlement Calculation — Clause 4.2
                  </div>
                  <div className="divide-y" style={{ borderColor: BORDER }}>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className={`text-xs ${TEXT_SUB}`}>Gross Assessed Loss</span>
                      <span className={`text-xs font-semibold ${TEXT_MAIN}`}>
                        £{gross > 0 ? gross.toLocaleString() : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className={`text-xs ${TEXT_SUB}`}>Certificate Policy Excess (Clause 4.2)</span>
                      <span className="text-xs font-semibold text-red-500">−£{excess.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3" style={{ background: isLight ? '#f4f6f5' : '#112218' }}>
                      <span className={`text-xs font-bold ${TEXT_MAIN}`}>Net Authorised Settlement</span>
                      <span className={`text-sm font-bold ${net > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        £{gross > 0 ? net.toLocaleString() : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning if below excess */}
                {belowExcess && (
                  <DashboardAlert
                    variant="warning"
                    isLight={isLight}
                    title="Clause 4.2 Notice — Assessed Amount Below Excess"
                  >
                    Assessed amount (<span className="font-semibold">£{gross.toLocaleString()}</span>) is at or below the <span className="font-semibold">£{excess}</span> policy excess. Net settlement will be <span className="font-semibold">£0</span>. Consider using &quot;Reject Claim&quot; with the &quot;Below Policy Excess&quot; reason instead.
                  </DashboardAlert>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setApproveModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      isLight ? 'border-black/10 text-gray-700 hover:bg-black/5' : 'border-white/10 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmApproval}
                    disabled={!gross || gross <= 0}
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    style={{ background: GREEN }}
                  >
                    <CheckCircle2 size={12} />
                    Authorize Settlement {gross > 0 ? `(£${net.toLocaleString()} net)` : ''}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* UPGRADED REJECT CLAIM MODAL (WITH LIVE LETTERHEAD PREVIEW)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-start justify-center pt-10 pb-6 px-3 sm:px-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
            onClick={() => setRejectModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl p-6 shadow-2xl space-y-4 my-6"
              style={{
                background: isLight ? '#ffffff' : '#0d2117',
                border: `1px solid ${BORDER}`,
              }}
            >
              {/* Header with Title & Action Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-500/20 shrink-0">
                    <Scale size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Adjudicate Claim: Issue Formal Rejection</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10">
                        {claim.id}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${TEXT_MUTED}`}>
                      Participant: <span className={`font-semibold ${TEXT_MAIN}`}>{claim.participantName}</span> · Claimed: £{claim.amountClaimed.toLocaleString()} · Peril: {claim.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Mode Tabs */}
                  <div className={`flex items-center p-1 rounded-xl border text-xs ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/20 border-white/10'}`}>
                    <button
                      type="button"
                      onClick={() => setRejectionActiveTab('form')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                        rejectionActiveTab === 'form'
                          ? isLight ? 'bg-white text-gray-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : TEXT_MUTED
                      }`}
                    >
                      <FileQuestion size={13} />
                      <span>Form</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectionActiveTab('preview')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                        rejectionActiveTab === 'preview'
                          ? isLight ? 'bg-white text-gray-900 shadow-xs' : 'bg-white/10 text-white shadow-xs'
                          : TEXT_MUTED
                      }`}
                    >
                      <Eye size={13} />
                      <span>Letter Preview</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </button>
                  </div>

                  <button
                    onClick={() => setRejectModalOpen(false)}
                    className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${TEXT_MUTED}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* TAB 1: FORM */}
              {rejectionActiveTab === 'form' && (
                <form onSubmit={handleConfirmRejection} className="space-y-4 pt-1">
                  {/* Financial Overview (Clean & Monochrome) */}
                  <div
                    className="px-4 py-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs"
                    style={{
                      background: isLight ? '#f9fafb' : 'rgba(255,255,255,0.02)',
                      borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-5 flex-wrap">
                      <div>
                        <span className={`text-[11px] ${TEXT_MUTED}`}>Claimed Amount: </span>
                        <span className={`font-semibold font-mono ${TEXT_MAIN}`}>£{claim.amountClaimed.toLocaleString()}</span>
                      </div>
                      <div className="h-3 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />
                      <div>
                        <span className={`text-[11px] ${TEXT_MUTED}`}>Policy Excess: </span>
                        <span className={`font-semibold font-mono ${TEXT_MAIN}`}>£300.00</span>
                      </div>
                      <div className="h-3 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />
                      <div>
                        <span className={`text-[11px] ${TEXT_MUTED}`}>Settlement: </span>
                        <span className={`font-semibold font-mono ${TEXT_MAIN}`}>£0.00</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${isLight ? 'bg-gray-200/80 text-gray-700' : 'bg-white/10 text-gray-300'}`}>
                      Zero-Disbursement
                    </span>
                  </div>

                  {/* Step 1: Policy Grounds Selector (Multi-Select) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                          1. Select Rejection Grounds (Multi-Select):
                        </label>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {selectedRejectionPresets.length} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllRejectionPresets}
                          className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-emerald-500 font-medium"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300 dark:text-white/20">·</span>
                        <button
                          type="button"
                          onClick={handleClearRejectionPresets}
                          className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-red-500 font-medium"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {REJECTION_PRESETS.map((preset) => {
                        const isSelected = selectedRejectionPresets.includes(preset.id);
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleToggleRejectionPreset(preset.id)}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? isLight
                                  ? 'border-gray-900 bg-gray-50 shadow-xs ring-1 ring-gray-900/10'
                                  : 'border-white/40 bg-white/[0.07] shadow-xs ring-1 ring-white/15'
                                : isLight
                                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? isLight
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-[#00c685] text-black font-bold'
                                : 'border border-gray-300 dark:border-white/20 bg-transparent'
                            }`}>
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`font-semibold ${isSelected ? (isLight ? 'text-gray-950 font-bold' : 'text-white font-bold') : TEXT_MAIN}`}>
                                  {preset.label}
                                </p>
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md shrink-0 border ${
                                  isLight
                                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                                    : 'bg-white/10 text-gray-300 border-white/10'
                                }`}>
                                  {preset.badge}
                                </span>
                              </div>
                              {preset.clause && (
                                <p className={`text-[10px] mt-0.5 font-mono font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                                  {preset.clause}
                                </p>
                              )}
                              {preset.text && (
                                <p className={`text-[11px] mt-1 leading-relaxed ${TEXT_MUTED}`}>
                                  {preset.text}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Policy Clause & Customer Letter Explanation */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                          2. Applicable Policy Clause Reference(s):
                        </label>
                        <span className={`text-[11px] ${TEXT_MUTED}`}>Cited in formal notice</span>
                      </div>
                      <input
                        type="text"
                        value={rejectionClauseInput}
                        onChange={e => {
                          setRejectionClauseInput(e.target.value);
                          setIsClauseCustomized(true);
                        }}
                        placeholder="e.g. Clause 4.2 — Certificate Excess & Deductibles ; Clause 5.1 — Wear & Tear"
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border font-mono outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 ${
                          isLight
                            ? 'border-gray-200 text-gray-800 bg-white placeholder:text-gray-400'
                            : 'border-white/10 text-gray-100 bg-white/[0.03] placeholder:text-gray-500'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <label className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                            3. Written Justification to {claim.participantName}:
                          </label>
                          {(isTextCustomized || isClauseCustomized) && (
                            <button
                              type="button"
                              onClick={handleResetRejectionAuto}
                              className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-emerald-500 flex items-center gap-1 font-medium"
                            >
                              <RefreshCw size={10} /> Reset to Auto-Generated
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setRejectionActiveTab('preview')}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Eye size={12} /> Preview in Official Letterhead
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={customRejectionText}
                        onChange={e => {
                          setCustomRejectionText(e.target.value);
                          setIsTextCustomized(true);
                        }}
                        placeholder="Detail the applicable contractual grounds, surveyor citations, and policy excess calculations..."
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border resize-none leading-relaxed outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 ${
                          isLight
                            ? 'border-gray-200 text-gray-800 bg-white placeholder:text-gray-400'
                            : 'border-white/10 text-gray-100 bg-white/[0.03] placeholder:text-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Step 3: Statutory Checkboxes & Compliance Attestation */}
                  <div className="space-y-3 pt-2 border-t" style={{ borderColor: BORDER }}>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeAppealSchedule}
                          onChange={e => setIncludeAppealSchedule(e.target.checked)}
                          className="rounded accent-[#00c685]"
                        />
                        <span className={TEXT_SUB}>Include 14-day statutory participant appeal schedule</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifyParticipantRejection}
                          onChange={e => setNotifyParticipantRejection(e.target.checked)}
                          className="rounded accent-[#00c685]"
                        />
                        <span className={TEXT_SUB}>Generate PDF Notice in documents & send email/SMS</span>
                      </label>
                    </div>

                    {/* Sign-off Card (Clean Neutral Enterprise Styling) */}
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs select-none transition-all ${
                        rejectionSubmitAttempted && !complianceConfirmed
                          ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/30'
                          : isLight
                            ? 'border-gray-200 bg-gray-50 hover:bg-gray-100/70'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={complianceConfirmed}
                        onChange={e => {
                          setComplianceConfirmed(e.target.checked);
                          if (e.target.checked) setRejectionSubmitAttempted(false);
                        }}
                        className="mt-0.5 rounded accent-[#00c685]"
                      />
                      <div className="space-y-0.5">
                        <p className={`text-[11px] leading-relaxed font-semibold ${TEXT_MAIN}`}>
                          Mandatory Adjudication Declaration:
                        </p>
                        <p className={`text-[11px] leading-relaxed ${TEXT_MUTED}`}>
                          I confirm this rejection has been substantiated against Certificate Terms, Policy Excess parameters, and Shariah Mutual Pool Governance rules.
                        </p>
                        {rejectionSubmitAttempted && !complianceConfirmed && (
                          <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 pt-1">
                            <AlertCircle size={12} /> Please tick this box to authorise rejection.
                          </p>
                        )}
                      </div>
                    </label>

                    {/* Reversibility Assurance Helper */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px]">
                      <Info size={14} className="shrink-0" />
                      <span>
                        <strong>Reversible action:</strong> You or another handler can re-open this claim anytime if the participant submits new evidence or appeals within 14 days.
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t gap-2" style={{ borderColor: BORDER }}>
                    <button
                      type="button"
                      onClick={() => setRejectionActiveTab('preview')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        isLight ? 'border-gray-200 hover:bg-gray-50 text-gray-700' : 'border-white/10 hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <Eye size={13} /> View Live Notice Preview
                    </button>

                    <div className="flex items-center gap-2">
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
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98] bg-red-600 hover:bg-red-700 shadow-red-600/20"
                      >
                        <AlertOctagon size={13} /> Authorise Rejection ({selectedRejectionPresets.length} Grounds)
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: LIVE LETTERHEAD PREVIEW */}
              {rejectionActiveTab === 'preview' && (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between text-xs px-1">
                    <p className={`font-semibold ${TEXT_MUTED}`}>
                      Live Preview of the Document that will be generated and issued:
                    </p>
                    <span className="text-[11px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                      <Check size={12} /> Auto-synced with form entries
                    </span>
                  </div>

                  {/* Official Letterhead Container */}
                  <div
                    className="p-6 rounded-2xl border shadow-inner text-xs space-y-4 max-h-[460px] overflow-y-auto leading-relaxed"
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
                        <p>DATE: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p>CERTIFICATE: {claim.certificateId || 'TK-2024-0042'}</p>
                      </div>
                    </div>

                    {/* Addressee */}
                    <div className="font-sans text-xs space-y-0.5">
                      <p className="font-bold">{claim.participantName}</p>
                      <p className="text-gray-500">{claim.propertyAddress}</p>
                    </div>

                    {/* Subject */}
                    <div className="font-sans font-bold text-sm text-gray-900 dark:text-gray-100 border-l-4 border-slate-700 dark:border-slate-300 pl-3 py-0.5">
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
                          <span className="text-gray-500">Mandatory Certificate Policy Excess:</span>
                          <span className="font-bold">£300.00</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 font-bold text-gray-900 dark:text-gray-100" style={{ borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.08)' }}>
                          <span>Assessed Pool Disbursement:</span>
                          <span>£0.00 (Zero Disbursement)</span>
                        </div>
                      </div>

                      {/* Reason & Clause citations (Clean Neutral Card) */}
                      <div className="space-y-2 p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                        <p className="font-bold text-gray-900 dark:text-gray-100">Contractual Grounds for Disallowance & Cited Clauses:</p>
                        <p className="font-mono text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                          {rejectionClauseInput || 'Clause 4.2 — Certificate Excess & Deductibles'}
                        </p>
                        <div className="text-gray-600 dark:text-gray-400 text-xs whitespace-pre-line leading-relaxed">
                          {customRejectionText || 'Claim falls below certificate excess threshold.'}
                        </div>
                      </div>

                      {includeAppealSchedule && (
                        <div className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400 border-t pt-3" style={{ borderColor: isLight ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }}>
                          <p className="font-bold text-gray-700 dark:text-gray-300">Statutory Participant Appeal Procedure (14 Days):</p>
                          <p>
                            Under Rule 12 of the Takaful Governance Framework, you are entitled to appeal this determination within 14 calendar days from the date of this letter. Appeals should be submitted via your portal with any supplementary receipts, quotes, or specialist reports.
                          </p>
                        </div>
                      )}

                      <div className="pt-2 text-[11px] text-gray-500">
                        <p>Sincerely,</p>
                        <p className="font-bold text-gray-700 dark:text-gray-300 mt-1">Omar Hassan</p>
                        <p>Senior Claims Handler · Mutual Loss Assessment Team</p>
                        <p>Takaful UK Ltd</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Preview tab */}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: BORDER }}>
                    <button
                      type="button"
                      onClick={() => setRejectionActiveTab('form')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        isLight ? 'border-gray-200 hover:bg-gray-50 text-gray-700' : 'border-white/10 hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <ArrowLeft size={13} /> Back to Edit Form
                    </button>

                    <div className="flex items-center gap-2">
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
                        type="button"
                        onClick={handleConfirmRejection}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98] bg-red-600 hover:bg-red-700 shadow-red-600/20"
                      >
                        <AlertOctagon size={13} /> Confirm Rejection & Issue Notice
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                  <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-500/20">
                    <FileText size={20} />
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
                <div className="font-sans font-bold text-sm text-gray-900 dark:text-gray-100 border-l-4 border-slate-700 dark:border-slate-300 pl-3 py-0.5">
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
                      <span className="font-bold text-gray-900 dark:text-gray-100">£0.00 (Disallowed)</span>
                    </div>
                  </div>

                  {/* Adjudication Clause & Grounds (Clean Neutral Styling) */}
                  <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2 font-sans">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Governing Policy Schedule Reference(s):
                    </p>
                    <p className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {claim.rejectionClause || 'Clause 4.2 — Certificate Excess & Deductibles (£300 Minimum)'}
                    </p>
                    <div className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {claim.rejectionReason || 'Total assessed repair costs fall below the mandatory Certificate Policy Excess threshold of £300.00.'}
                    </div>
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
