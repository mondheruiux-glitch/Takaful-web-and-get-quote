/* ─── Takaful Dashboard — Shared TypeScript Types ───────────────────────── */

export type UserRole = 'participant' | 'claim_handler' | 'finance' | 'management';

export interface DemoUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  jobTitle: string;
  participantId?: string; // only for participant role
  certificateId?: string; // only for participant role
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
  | 'Flood'
  | 'Theft'
  | 'Accidental Damage'
  | 'Escape of Water'
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
  amountClaimed: number;
  amountApproved?: number;
  priority: ClaimPriority;
  status: ClaimStatus;
  assignedHandlerId?: string;
  assignedHandlerName?: string;
  daysOpen: number;
  lastActivityDate: string;
  lastActivityNote: string;
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
