/* ─── Takaful Dashboard — Shared TypeScript Types ───────────────────────── */

export type UserRole = 'participant' | 'claim_handler' | 'finance' | 'management' | 'super_admin';

export interface DemoUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  jobTitle: string;
  participantId?: string; // only for participant role
  certificateId?: string; // only for participant role
  gender?: 'male' | 'female';
}

export interface StaffMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'claim_handler' | 'finance' | 'management';
  title: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  joinedDate: string;
  gender: 'male' | 'female';
  // Performance metrics
  claimsResolved?: number;
  avgResolutionDays?: number;
  slaRate?: number; // e.g. 97.4%
  csatScore?: number; // e.g. 4.8 / 5.0
  irregularitiesFlagged?: number;
  fraudPreventedAmount?: number; // in GBP
  dailyApprovalLimit?: number; // in GBP
  financePayoutsProcessed?: number;
  accuracyRate?: number; // percentage
}

export interface Participant {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  status: 'Active' | 'Review' | 'Suspended' | 'Cancelled' | 'Pending';
  riskRating: 'Low' | 'Medium' | 'High';
  accountStatus?: 'Active' | 'Under Investigation' | 'Frozen' | 'Suspended' | 'Warning Issued';
  flagCount?: number;
  totalClaims?: number;
  totalClaimValue?: number;
  notes?: string;
  accountActionReason?: string;
  accountActionDate?: string;
  accountActionBy?: string;
}

export interface Certificate {
  id: string;
  participantId: string;
  participantName: string;
  propertyAddress: string;
  propertyType: 'House' | 'Flat' | 'Maisonette' | 'Bungalow' | 'Other';
  coverType: 'Buildings' | 'Contents' | 'Both';
  buildingsLimit: number;
  contentsLimit: number;
  monthlyContribution: number;
  startDate: string;
  renewalDate: string;
  status: 'Active' | 'Expiring' | 'Pending' | 'Cancelled';
  coveredRisks: string[];
  /** Compulsory excess the participant always pays (default £300, per Clause 4.2) */
  compulsoryExcess: number;
  /** Voluntary excess selected during quote (0 = none selected) */
  voluntaryExcess: number;
}

export type ContributionStatus = 'Collected' | 'Pending' | 'Failed' | 'Retried';

export interface Contribution {
  id: string;
  participantId: string;
  participantName: string;
  certificateId: string;
  amount: number;
  dueDate: string;
  collectedDate?: string;
  method: 'Direct Debit' | 'Card' | 'BACS';
  status: ContributionStatus;
  retryCount: number;
}

export type ClaimType =
  | 'Storm'
  | 'Fire'
  | 'Fire Damage'
  | 'Flood'
  | 'Theft'
  | 'Accidental Damage'
  | 'Escape of Water'
  | 'Water Leak'
  | 'Subsidence'
  | 'Other';

export type ClaimStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Awaiting Information'
  | 'Approved'
  | 'Rejected'
  | 'Paid';

export type ClaimPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Claim {
  id: string;
  participantId: string;
  participantName: string;
  certificateId: string;
  propertyAddress: string;
  coverType: 'Buildings' | 'Contents' | 'Both';
  type: ClaimType;
  incidentDate: string;
  submittedDate: string;
  description: string;
  /** The gross repair/replacement cost submitted by the participant */
  amountClaimed: number;
  /** The net settlement actually approved (= grossAssessedAmount - excessDeducted) */
  amountApproved?: number;
  /** Gross assessed loss verified by handler (may differ from amountClaimed if adjusted) */
  grossAssessedAmount?: number;
  /** Total excess deducted (compulsoryExcess + voluntaryExcess) */
  excessDeducted?: number;
  /** Net payable to participant (= grossAssessedAmount - excessDeducted) */
  netSettlementAmount?: number;
  /** BACS reference generated when Finance releases payment */
  bacsReference?: string;
  priority: ClaimPriority;
  status: ClaimStatus;
  assignedHandlerId?: string;
  assignedHandlerName?: string;
  daysOpen: number;
  lastActivityDate: string;
  lastActivityNote: string;
  rejectionReason?: string;
  rejectionDate?: string;
  rejectionClause?: string;
  rejectionNotes?: string;
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  name: string;
  type: 'Evidence' | 'Report' | 'Certificate' | 'Quote' | 'Correspondence' | 'Photo';
  uploadedDate: string;
  uploadedBy: string;
  status: 'Received' | 'Awaiting' | 'Verified' | 'Rejected';
  sizeLabel: string;
}

export interface ClaimNote {
  id: string;
  claimId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorRole?: string;
  authorAvatar?: string;
  authorGender?: 'male' | 'female';
  text: string;
  isInternal: boolean; // true = handler-only; false = visible to participant
  createdAt: string;
}

export type TransactionType =
  | 'Contribution'
  | 'ClaimPayment'
  | 'WakalaFee'
  | 'ClaimsReserve'
  | 'Surplus'
  | 'Adjustment';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Reconciled';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  participantId?: string;
  participantName?: string;
  certificateId?: string;
  claimId?: string;
  amount: number;
  direction: 'Inflow' | 'Outflow';
  status: TransactionStatus;
  reference: string;
  reconciled: boolean;
}

export interface Pool {
  balance: number;
  participantFundPct: number;
  claimsReservePct: number;
  wakalaFeePct: number;
  totalContributions: number;
  totalClaimsPaid: number;
  totalWakalaFees: number;
  claimsReserve: number;
  periodLabel: string;
}

/* ─── Participant Investigation & Management Reports ─────────────────────── */

export type ParticipantReportCategory =
  | 'Excessive / Repeat Claims'
  | 'Suspected Fraud / Arnaque'
  | 'Document Falsification'
  | 'Inconsistent Loss Event'
  | 'Non-Disclosure at Inception'
  | 'Aggressive / Uncooperative Conduct'
  | 'Other Irregularity';

export type ParticipantReportSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ParticipantReportStatus = 'Pending Review' | 'Investigating' | 'Action Taken' | 'Dismissed';

export interface ParticipantReport {
  id: string;
  participantId: string;
  participantName: string;
  claimId?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  category: ParticipantReportCategory;
  severity: ParticipantReportSeverity;
  status: ParticipantReportStatus;
  incidentSummary: string;
  evidenceNotes?: string;
  recommendedAction?: 'Freeze Account' | 'Suspend Membership' | 'Issue Warning' | 'Audit Review';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export type ParticipantAccountActionType = 'freeze' | 'suspend' | 'warn' | 'reinstate';

/* ─── Support Ticket System ──────────────────────────────────────────────── */

export type TicketCategory =
  | 'Claim Inquiry'
  | 'Contribution'
  | 'Certificate'
  | 'Technical'
  | 'General';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderUserId?: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isStaff?: boolean;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  /** Auto-set from CATEGORY_ROUTING when ticket is created */
  routedToRole: UserRole;
  /** Staff member ID (e.g. 'STF-001') */
  assignedToId: string;
  /** Display name for assignee */
  assignedTo: string;
  /** SLA target in hours */
  slaHours: number;
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
  /** Optional link to a related claim */
  relatedClaimId?: string;
  /** Optional link to a related certificate */
  relatedCertificateId?: string;
}

export interface RoutingRule {
  routedToRole: UserRole;
  defaultAssignee: string;
  defaultAssigneeId: string;
  slaHours: number;
  icon: string;
  description: string;
  urgencyHint: string;
  color: string;
}
