import {
  PARTICIPANTS,
  CERTIFICATES,
  CONTRIBUTIONS,
  CLAIMS,
  CLAIM_DOCUMENTS,
  TRANSACTIONS,
  PARTICIPANT_ACTIVITY,
} from "./mock-data";
import {
  Participant,
  Certificate,
  Contribution,
  Claim,
  ClaimDocument,
  Transaction,
  ParticipantActivity,
} from "./types";
import {
  getSynchronizedContributions,
  getSynchronizedTransactions,
} from "./reconciliation-sync";

export interface ParticipantSummary {
  participant: Participant;
  certificate?: Certificate;
  contributions: Contribution[];
  claims: Claim[];
  documents: ClaimDocument[];
  transactions: Transaction[];
  activities: ParticipantActivity[];
  financialStats: {
    totalContributions: number;
    outstandingAmount: number;
    lastPaymentDate: string;
    lastPaymentMethod: string;
    paymentHealth: "Healthy" | "Action Required" | "Overdue";
  };
  claimsStats: {
    totalClaims: number;
    totalPaid: number;
    openClaimsCount: number;
  };
}

/**
 * Find participant by ID or name
 */
export function getParticipantById(id: string): Participant | undefined {
  const norm = id.toLowerCase().trim();
  return PARTICIPANTS.find(
    (p) => p.id.toLowerCase() === norm || p.name.toLowerCase() === norm
  );
}

/**
 * Get comprehensive participant aggregated record
 */
export function getParticipantProfile(id: string): ParticipantSummary | null {
  const participant = getParticipantById(id);
  if (!participant) return null;

  // Synced contributions & transactions
  const allContributions = getSynchronizedContributions();
  const allTransactions = getSynchronizedTransactions();

  // Find primary certificate
  const certificate = CERTIFICATES.find(
    (c) =>
      c.participantId === participant.id ||
      c.id === `TK-2024-${participant.id.replace("P-", "")}` ||
      (participant.id === "P-0098" && c.id === "TK-2024-0098")
  );

  // Contributions for this participant
  const contributions = allContributions.filter(
    (c) =>
      c.participantId === participant.id ||
      c.participantName.toLowerCase() === participant.name.toLowerCase()
  );

  // Claims for this participant
  const claims = CLAIMS.filter(
    (c) =>
      c.participantId === participant.id ||
      c.participantName.toLowerCase() === participant.name.toLowerCase()
  );

  // Claim IDs
  const claimIds = new Set(claims.map((c) => c.id));

  // Documents attached to participant claims
  const documents = CLAIM_DOCUMENTS.filter(
    (doc) => claimIds.has(doc.claimId) || doc.uploadedBy.toLowerCase() === participant.name.toLowerCase()
  );

  // Transactions for this participant
  const transactions = allTransactions.filter(
    (t) =>
      t.participantId === participant.id ||
      (t.participantName &&
        t.participantName.toLowerCase() === participant.name.toLowerCase())
  );

  // Activities
  const activities = PARTICIPANT_ACTIVITY.filter(
    (act) => act.participantId === participant.id
  ).sort((a, b) => b.id.localeCompare(a.id));

  // Compute financial stats
  let totalContributions = 0;
  let outstandingAmount = 0;
  let lastPaymentDate = "—";
  let lastPaymentMethod = "Direct Debit";

  contributions.forEach((c) => {
    if (c.status === "Collected") {
      totalContributions += c.amount;
      lastPaymentDate = c.collectedDate || c.dueDate;
      lastPaymentMethod = c.method;
    } else if (c.status === "Failed" || c.status === "Retried") {
      outstandingAmount += c.amount;
    }
  });

  const paymentHealth: "Healthy" | "Action Required" | "Overdue" =
    outstandingAmount > 0 ? "Action Required" : "Healthy";

  // Compute claims stats
  let totalPaid = 0;
  let openClaimsCount = 0;

  claims.forEach((c) => {
    if (c.status === "Paid" && c.amountApproved) {
      totalPaid += c.amountApproved;
    }
    if (
      c.status === "Submitted" ||
      c.status === "Under Review" ||
      c.status === "Awaiting Information" ||
      c.status === "Approved"
    ) {
      openClaimsCount++;
    }
  });

  return {
    participant,
    certificate,
    contributions,
    claims,
    documents,
    transactions,
    activities,
    financialStats: {
      totalContributions,
      outstandingAmount,
      lastPaymentDate,
      lastPaymentMethod,
      paymentHealth,
    },
    claimsStats: {
      totalClaims: claims.length || participant.totalClaims || 0,
      totalPaid: totalPaid || participant.totalClaimValue || 0,
      openClaimsCount,
    },
  };
}
