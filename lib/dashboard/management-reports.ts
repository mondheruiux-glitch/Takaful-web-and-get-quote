'use client';

export interface DisciplinaryReport {
  id: string;
  participantId: string;
  participantName: string;
  source: 'claim_handler' | 'finance';
  reporterName: string;
  reporterRole: string;
  category: string;
  notes: string;
  auditReference?: string;
  amount?: number;
  createdAt: string;
  status: 'Pending Management Review' | 'Pre-Action Taken' | 'Suspended' | 'Banned' | 'Dismissed';
  preActionDetails?: {
    action: string;
    date: string;
    takenBy: string;
    notes: string;
  };
  finalActionDetails?: {
    action: string;
    date: string;
    takenBy: string;
    notes: string;
  };
}

const STORAGE_KEY = 'takaful_management_reports_v2';
export const REPORTS_SYNC_EVENT = 'takaful_reports_sync';

export const INITIAL_REPORTS: DisciplinaryReport[] = [
  {
    id: 'REP-2026-001',
    participantId: 'P-0098',
    participantName: 'Maryam Patel',
    source: 'claim_handler',
    reporterName: 'Omar Hassan',
    reporterRole: 'Senior Claims Specialist',
    category: 'High-frequency claims anomaly / conflicting quotes',
    notes: 'Participant submitted 3 separate claims in 9 months totaling £18,450. Inconsistent contractor quotes identified for roof and bicycle claims.',
    createdAt: '01 Oct 2026, 14:20',
    status: 'Pending Management Review',
  },
  {
    id: 'REP-2026-002',
    participantId: 'P-0019',
    participantName: 'Khalid Rahman',
    source: 'finance',
    reporterName: 'Amira Siddiqui',
    reporterRole: 'Head of Treasury & Payouts',
    category: 'Direct Debit Mandate Default / Repeated BACS Failure',
    auditReference: 'BACS-MAND-8808 / RETRY-2',
    amount: 48.0,
    notes: 'Direct Debit mandate failed twice consecutively with "Instruction Cancelled by Payer". Unpaid balance £96.00 accumulating in mutual pool ledger.',
    createdAt: '02 Oct 2026, 09:15',
    status: 'Pending Management Review',
  },
];

export function getStoredReports(): DisciplinaryReport[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read reports from storage', err);
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: DisciplinaryReport[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent(REPORTS_SYNC_EVENT, { detail: reports }));
  } catch (err) {
    console.error('Failed to save reports', err);
  }
}

export function addDisciplinaryReport(
  report: Omit<DisciplinaryReport, 'id' | 'createdAt' | 'status'>
): DisciplinaryReport {
  const current = getStoredReports();
  const newReport: DisciplinaryReport = {
    ...report,
    id: `REP-2026-${String(current.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'Pending Management Review',
  };

  const updated = [newReport, ...current];
  saveReports(updated);
  return newReport;
}

export function applyManagementPreAction(
  reportId: string,
  action: string,
  notes: string,
  actor: string = 'Ahmed Khan (Operations Director)'
): DisciplinaryReport | null {
  const current = getStoredReports();
  const now = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let modified: DisciplinaryReport | null = null;
  const updated = current.map((r) => {
    if (r.id === reportId) {
      modified = {
        ...r,
        status: 'Pre-Action Taken' as const,
        preActionDetails: {
          action,
          date: now,
          takenBy: actor,
          notes,
        },
      };
      return modified;
    }
    return r;
  });

  if (modified) {
    saveReports(updated);
  }
  return modified;
}

export function applyManagementFinalAction(
  reportId: string,
  action: 'Suspend Account' | 'Permanent Ban' | 'Dismiss Referral',
  notes: string,
  actor: string = 'Ahmed Khan (Operations Director)'
): DisciplinaryReport | null {
  const current = getStoredReports();
  const now = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const nextStatus =
    action === 'Suspend Account'
      ? ('Suspended' as const)
      : action === 'Permanent Ban'
      ? ('Banned' as const)
      : ('Dismissed' as const);

  let modified: DisciplinaryReport | null = null;
  const updated = current.map((r) => {
    if (r.id === reportId) {
      modified = {
        ...r,
        status: nextStatus,
        finalActionDetails: {
          action,
          date: now,
          takenBy: actor,
          notes,
        },
      };
      return modified;
    }
    return r;
  });

  if (modified) {
    saveReports(updated);
  }
  return modified;
}
