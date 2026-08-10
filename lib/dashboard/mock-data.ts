import {
  DemoUser, Participant, Certificate, Contribution,
  Claim, ClaimDocument, ClaimNote, Transaction, Pool,
} from './types';

/* ─── Demo Users (one per role) ──────────────────────────────────────────── */
export const DEMO_USERS: Record<string, DemoUser> = {
  participant: {
    id: 'U-PART-001',
    name: 'Fatima Al-Rashid',
    initials: 'FA',
    email: 'f.alrashid@email.com',
    role: 'participant',
    jobTitle: 'Takaful Participant',
    participantId: 'P-0042',
    certificateId: 'TK-2024-0042',
  },
  claim_handler: {
    id: 'U-HAND-001',
    name: 'Omar Hassan',
    initials: 'OH',
    email: 'o.hassan@takaful.com',
    role: 'claim_handler',
    jobTitle: 'Senior Claims Handler',
  },
  finance: {
    id: 'U-FIN-001',
    name: 'Amira Siddiqui',
    initials: 'AS',
    email: 'a.siddiqui@takaful.com',
    role: 'finance',
    jobTitle: 'Finance Officer',
  },
  management: {
    id: 'U-MGT-001',
    name: 'Ahmed Khan',
    initials: 'AK',
    email: 'ahmed.khan@takaful.com',
    role: 'management',
    jobTitle: 'Operations Director',
  },
};

/* ─── Participants ───────────────────────────────────────────────────────── */
export const PARTICIPANTS: Participant[] = [
  { id: 'P-0042', name: 'Fatima Al-Rashid', initials: 'FA', email: 'f.alrashid@email.com', phone: '+44 7700 123 456', address: '14 Elm Street, Birmingham, B1 2PQ', memberSince: 'Jan 2024', status: 'Active', riskRating: 'Low' },
  { id: 'P-0087', name: 'Hassan Mahmoud', initials: 'HM', email: 'h.mahmoud@email.com', phone: '+44 7700 234 567', address: '8 Rose Avenue, London, E1 5TF', memberSince: 'Mar 2024', status: 'Active', riskRating: 'Low' },
  { id: 'P-0112', name: 'Aisha Okonkwo', initials: 'AO', email: 'a.okonkwo@email.com', phone: '+44 7700 345 678', address: '33 Oak Lane, Manchester, M14 6PZ', memberSince: 'May 2024', status: 'Active', riskRating: 'Medium' },
  { id: 'P-0031', name: 'Yusuf Ibrahim', initials: 'YI', email: 'y.ibrahim@email.com', phone: '+44 7700 456 789', address: '2 Cedar Road, Leeds, LS7 3BX', memberSince: 'Jan 2024', status: 'Active', riskRating: 'Low' },
  { id: 'P-0098', name: 'Maryam Patel', initials: 'MP', email: 'm.patel@email.com', phone: '+44 7700 567 890', address: '19 Birch Close, Leicester, LE2 9KM', memberSince: 'Aug 2023', status: 'Review', riskRating: 'High' },
  { id: 'P-0055', name: 'Ibrahim Al-Sayed', initials: 'IA', email: 'i.alsayed@email.com', phone: '+44 7700 678 901', address: '7 Maple Drive, Bristol, BS8 4LR', memberSince: 'Feb 2024', status: 'Active', riskRating: 'High' },
  { id: 'P-0073', name: 'Zahra Hussein', initials: 'ZH', email: 'z.hussein@email.com', phone: '+44 7700 789 012', address: '45 Pine Way, Sheffield, S7 2MN', memberSince: 'Jun 2024', status: 'Pending', riskRating: 'Low' },
  { id: 'P-0019', name: 'Khalid Rahman', initials: 'KR', email: 'k.rahman@email.com', phone: '+44 7700 890 123', address: '11 Willow Crescent, Coventry, CV3 1PQ', memberSince: 'Dec 2023', status: 'Suspended', riskRating: 'Medium' },
];

/* ─── Certificates ───────────────────────────────────────────────────────── */
export const CERTIFICATES: Certificate[] = [
  { id: 'TK-2024-0042', participantId: 'P-0042', participantName: 'Fatima Al-Rashid', propertyAddress: '14 Elm Street, Birmingham, B1 2PQ', propertyType: 'House', coverType: 'Buildings', buildingsLimit: 350000, contentsLimit: 0, monthlyContribution: 38.50, startDate: '15 Jan 2024', renewalDate: '15 Jan 2027', status: 'Active', coveredRisks: ['Storm', 'Fire', 'Flood', 'Subsidence', 'Escape of Water'] },
  { id: 'TK-2024-0087', participantId: 'P-0087', participantName: 'Hassan Mahmoud', propertyAddress: '8 Rose Avenue, London, E1 5TF', propertyType: 'Flat', coverType: 'Contents', buildingsLimit: 0, contentsLimit: 45000, monthlyContribution: 24.20, startDate: '22 Mar 2024', renewalDate: '22 Mar 2027', status: 'Active', coveredRisks: ['Theft', 'Fire', 'Accidental Damage', 'Escape of Water'] },
  { id: 'TK-2024-0112', participantId: 'P-0112', participantName: 'Aisha Okonkwo', propertyAddress: '33 Oak Lane, Manchester, M14 6PZ', propertyType: 'House', coverType: 'Both', buildingsLimit: 420000, contentsLimit: 65000, monthlyContribution: 52.80, startDate: '5 May 2024', renewalDate: '5 May 2027', status: 'Active', coveredRisks: ['Storm', 'Fire', 'Flood', 'Theft', 'Accidental Damage', 'Subsidence', 'Escape of Water'] },
  { id: 'TK-2024-0031', participantId: 'P-0031', participantName: 'Yusuf Ibrahim', propertyAddress: '2 Cedar Road, Leeds, LS7 3BX', propertyType: 'House', coverType: 'Buildings', buildingsLimit: 280000, contentsLimit: 0, monthlyContribution: 41.00, startDate: '10 Jan 2024', renewalDate: '10 Jan 2027', status: 'Active', coveredRisks: ['Storm', 'Fire', 'Flood', 'Subsidence', 'Escape of Water'] },
  { id: 'TK-2024-0098', participantId: 'P-0098', participantName: 'Maryam Patel', propertyAddress: '19 Birch Close, Leicester, LE2 9KM', propertyType: 'Flat', coverType: 'Contents', buildingsLimit: 0, contentsLimit: 35000, monthlyContribution: 18.90, startDate: '12 Aug 2023', renewalDate: '12 Aug 2026', status: 'Expiring', coveredRisks: ['Theft', 'Fire', 'Accidental Damage'] },
  { id: 'TK-2024-0055', participantId: 'P-0055', participantName: 'Ibrahim Al-Sayed', propertyAddress: '7 Maple Drive, Bristol, BS8 4LR', propertyType: 'House', coverType: 'Both', buildingsLimit: 550000, contentsLimit: 80000, monthlyContribution: 61.20, startDate: '20 Feb 2024', renewalDate: '20 Feb 2027', status: 'Active', coveredRisks: ['Storm', 'Fire', 'Flood', 'Theft', 'Accidental Damage', 'Subsidence', 'Escape of Water'] },
];

/* ─── Claims ─────────────────────────────────────────────────────────────── */
export const CLAIMS: Claim[] = [
  { id: 'CLM-2024-0891', participantId: 'P-0042', participantName: 'Fatima Al-Rashid', certificateId: 'TK-2024-0042', propertyAddress: '14 Elm Street, Birmingham, B1 2PQ', coverType: 'Buildings', type: 'Storm', incidentDate: '16 Jul 2026', submittedDate: '18 Jul 2026', description: 'Storm damage to roof during heavy rainfall on 16–17 July. Multiple roof tiles displaced, water ingress into loft.', amountClaimed: 4200, priority: 'High', status: 'Under Review', assignedHandlerId: 'U-HAND-001', assignedHandlerName: 'Omar Hassan', daysOpen: 3, lastActivityDate: '20 Jul 2026', lastActivityNote: 'Assessor assigned. Property visit scheduled 25 Jul.' },
  { id: 'CLM-2024-0890', participantId: 'P-0087', participantName: 'Hassan Mahmoud', certificateId: 'TK-2024-0087', propertyAddress: '8 Rose Avenue, London, E1 5TF', coverType: 'Contents', type: 'Escape of Water', incidentDate: '17 Jul 2026', submittedDate: '17 Jul 2026', description: 'Water leak from dishwasher causing damage to kitchen floor and units.', amountClaimed: 1850, amountApproved: 1850, priority: 'Medium', status: 'Approved', assignedHandlerId: 'U-HAND-001', assignedHandlerName: 'Omar Hassan', daysOpen: 4, lastActivityDate: '21 Jul 2026', lastActivityNote: 'Approved. Passed to finance for payment.' },
  { id: 'CLM-2024-0889', participantId: 'P-0112', participantName: 'Aisha Okonkwo', certificateId: 'TK-2024-0112', propertyAddress: '33 Oak Lane, Manchester, M14 6PZ', coverType: 'Both', type: 'Accidental Damage', incidentDate: '15 Jul 2026', submittedDate: '15 Jul 2026', description: 'Accidental glass damage to patio door.', amountClaimed: 380, amountApproved: 380, priority: 'Low', status: 'Paid', assignedHandlerId: 'U-HAND-001', assignedHandlerName: 'Omar Hassan', daysOpen: 6, lastActivityDate: '21 Jul 2026', lastActivityNote: 'Payment of £380 processed.' },
  { id: 'CLM-2024-0888', participantId: 'P-0031', participantName: 'Yusuf Ibrahim', certificateId: 'TK-2024-0031', propertyAddress: '2 Cedar Road, Leeds, LS7 3BX', coverType: 'Buildings', type: 'Theft', incidentDate: '10 Jul 2026', submittedDate: '10 Jul 2026', description: 'Front door lock mechanism damaged after attempted break-in.', amountClaimed: 250, priority: 'Low', status: 'Rejected', assignedHandlerId: 'U-HAND-001', assignedHandlerName: 'Omar Hassan', daysOpen: 11, lastActivityDate: '18 Jul 2026', lastActivityNote: 'Rejected — claim below excess threshold of £300.' },
  { id: 'CLM-2024-0887', participantId: 'P-0098', participantName: 'Maryam Patel', certificateId: 'TK-2024-0098', propertyAddress: '19 Birch Close, Leicester, LE2 9KM', coverType: 'Contents', type: 'Theft', incidentDate: '5 Jul 2026', submittedDate: '5 Jul 2026', description: 'Bicycle stolen from garden shed. Proof of ownership provided.', amountClaimed: 650, amountApproved: 650, priority: 'Medium', status: 'Approved', assignedHandlerId: 'U-HAND-001', assignedHandlerName: 'Omar Hassan', daysOpen: 16, lastActivityDate: '19 Jul 2026', lastActivityNote: 'Approved. Awaiting finance payment release.' },
  { id: 'CLM-2024-0886', participantId: 'P-0055', participantName: 'Ibrahim Al-Sayed', certificateId: 'TK-2024-0055', propertyAddress: '7 Maple Drive, Bristol, BS8 4LR', coverType: 'Both', type: 'Subsidence', incidentDate: '2 Jul 2026', submittedDate: '2 Jul 2026', description: 'Visible cracking to rear external wall. Structural engineer assessment commissioned.', amountClaimed: 12400, priority: 'Critical', status: 'Awaiting Information', assignedHandlerId: 'U-HAND-001', assignedHandlerName: 'Omar Hassan', daysOpen: 19, lastActivityDate: '15 Jul 2026', lastActivityNote: 'Awaiting structural engineer report. Participant chased 15 Jul.' },
];

/* ─── Contributions ──────────────────────────────────────────────────────── */
export const CONTRIBUTIONS: Contribution[] = [
  { id: 'CONT-2024-8812', participantId: 'P-0042', participantName: 'Fatima Al-Rashid', certificateId: 'TK-2024-0042', amount: 38.50, dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', status: 'Collected', retryCount: 0 },
  { id: 'CONT-2024-8811', participantId: 'P-0087', participantName: 'Hassan Mahmoud', certificateId: 'TK-2024-0087', amount: 24.20, dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', status: 'Collected', retryCount: 0 },
  { id: 'CONT-2024-8810', participantId: 'P-0112', participantName: 'Aisha Okonkwo', certificateId: 'TK-2024-0112', amount: 52.80, dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', status: 'Collected', retryCount: 0 },
  { id: 'CONT-2024-8809', participantId: 'P-0031', participantName: 'Yusuf Ibrahim', certificateId: 'TK-2024-0031', amount: 41.00, dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', status: 'Collected', retryCount: 0 },
  { id: 'CONT-2024-8808', participantId: 'P-0098', participantName: 'Maryam Patel', certificateId: 'TK-2024-0098', amount: 18.90, dueDate: '1 Jul 2026', method: 'Direct Debit', status: 'Failed', retryCount: 1 },
  { id: 'CONT-2024-8807', participantId: 'P-0055', participantName: 'Ibrahim Al-Sayed', certificateId: 'TK-2024-0055', amount: 61.20, dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', status: 'Collected', retryCount: 0 },
];

/* ─── Claim Documents ────────────────────────────────────────────────────── */
export const CLAIM_DOCUMENTS: ClaimDocument[] = [
  { id: 'CDOC-001', claimId: 'CLM-2024-0891', name: 'Incident Report.pdf', type: 'Evidence', uploadedDate: '18 Jul 2026', uploadedBy: 'Fatima Al-Rashid', status: 'Received', sizeLabel: '1.2 MB' },
  { id: 'CDOC-002', claimId: 'CLM-2024-0891', name: 'Property Photos (x8).zip', type: 'Photo', uploadedDate: '19 Jul 2026', uploadedBy: 'Fatima Al-Rashid', status: 'Received', sizeLabel: '14.5 MB' },
  { id: 'CDOC-003', claimId: 'CLM-2024-0891', name: 'Certificate TK-2024-0042.pdf', type: 'Certificate', uploadedDate: '19 Jul 2026', uploadedBy: 'System', status: 'Received', sizeLabel: '0.8 MB' },
  { id: 'CDOC-004', claimId: 'CLM-2024-0891', name: 'Assessor Report.pdf', type: 'Report', uploadedDate: '—', uploadedBy: '—', status: 'Awaiting', sizeLabel: '—' },
];

/* ─── Claim Notes ────────────────────────────────────────────────────────── */
export const CLAIM_NOTES: ClaimNote[] = [
  { id: 'NOTE-001', claimId: 'CLM-2024-0891', authorId: 'U-HAND-001', authorName: 'Omar Hassan', authorInitials: 'OH', text: 'Property inspection confirmed roof damage consistent with storm on 16–17 Jul. Estimate aligns with claimed amount. Awaiting assessor visit report before final decision.', isInternal: true, createdAt: '20 Jul 2026, 11:42' },
  { id: 'NOTE-002', claimId: 'CLM-2024-0891', authorId: 'SYSTEM', authorName: 'System', authorInitials: 'SY', text: 'All required documentation received. Claim progressed to Under Review status.', isInternal: false, createdAt: '19 Jul 2026, 09:15' },
];

/* ─── Transactions ───────────────────────────────────────────────────────── */
export const TRANSACTIONS: Transaction[] = [
  { id: 'TXN-8812', date: '1 Jul 2026', type: 'Contribution', participantId: 'P-0042', participantName: 'Fatima Al-Rashid', certificateId: 'TK-2024-0042', amount: 38.50, direction: 'Inflow', status: 'Reconciled', reference: 'DD-2024-0042-JUL', reconciled: true },
  { id: 'TXN-8811', date: '1 Jul 2026', type: 'Contribution', participantId: 'P-0087', participantName: 'Hassan Mahmoud', certificateId: 'TK-2024-0087', amount: 24.20, direction: 'Inflow', status: 'Reconciled', reference: 'DD-2024-0087-JUL', reconciled: true },
  { id: 'TXN-8810', date: '1 Jul 2026', type: 'Contribution', participantId: 'P-0112', participantName: 'Aisha Okonkwo', certificateId: 'TK-2024-0112', amount: 52.80, direction: 'Inflow', status: 'Reconciled', reference: 'DD-2024-0112-JUL', reconciled: true },
  { id: 'TXN-PAY-001', date: '21 Jul 2026', type: 'ClaimPayment', participantId: 'P-0112', participantName: 'Aisha Okonkwo', claimId: 'CLM-2024-0889', amount: 380, direction: 'Outflow', status: 'Completed', reference: 'PYMNT-CLM-0889', reconciled: true },
  { id: 'TXN-FEE-JUL', date: '1 Jul 2026', type: 'WakalaFee', amount: 4912, direction: 'Outflow', status: 'Completed', reference: 'WAKALA-JUL-2026', reconciled: true },
  { id: 'TXN-8808', date: '1 Jul 2026', type: 'Contribution', participantId: 'P-0098', participantName: 'Maryam Patel', certificateId: 'TK-2024-0098', amount: 18.90, direction: 'Inflow', status: 'Failed', reference: 'DD-2024-0098-JUL', reconciled: false },
];

/* ─── Pool State ─────────────────────────────────────────────────────────── */
export const POOL: Pool = {
  balance: 482150,
  participantFundPct: 78,
  claimsReservePct: 14,
  wakalaFeePct: 8,
  totalContributions: 618400,
  totalClaimsPaid: 92800,
  totalWakalaFees: 49472,
  claimsReserve: 43450,
  periodLabel: 'Jul 2026',
};

/* ─── Chart / Trend Data ─────────────────────────────────────────────────── */
export const CONTRIBUTION_TREND = [
  { month: 'Jan', total: 42800, collected: 41600, failed: 1200 },
  { month: 'Feb', total: 46200, collected: 45100, failed: 1100 },
  { month: 'Mar', total: 51000, collected: 50200, failed: 800 },
  { month: 'Apr', total: 49500, collected: 48800, failed: 700 },
  { month: 'May', total: 53800, collected: 52900, failed: 900 },
  { month: 'Jun', total: 58200, collected: 56900, failed: 1300 },
  { month: 'Jul', total: 61400, collected: 59600, failed: 1800 },
];

export const CLAIMS_TREND = [
  { month: 'Jan', count: 8, value: 12400 },
  { month: 'Feb', count: 6, value: 9800 },
  { month: 'Mar', count: 11, value: 14200 },
  { month: 'Apr', count: 9, value: 11100 },
  { month: 'May', count: 13, value: 16500 },
  { month: 'Jun', count: 10, value: 13200 },
  { month: 'Jul', count: 14, value: 18900 },
];

export const PARTICIPANT_GROWTH = [
  { month: 'Jan', participants: 1148 },
  { month: 'Feb', participants: 1179 },
  { month: 'Mar', participants: 1205 },
  { month: 'Apr', participants: 1218 },
  { month: 'May', participants: 1240 },
  { month: 'Jun', participants: 1262 },
  { month: 'Jul', participants: 1284 },
];

export const POOL_HISTORY = [
  { month: 'Jan', balance: 340000 },
  { month: 'Feb', balance: 370000 },
  { month: 'Mar', balance: 406000 },
  { month: 'Apr', balance: 444000 },
  { month: 'May', balance: 478000 },
  { month: 'Jun', balance: 463000 },
  { month: 'Jul', balance: 482150 },
];

/* ─── Approved claims awaiting payment (Finance view) ───────────────────── */
export const CLAIMS_AWAITING_PAYMENT = CLAIMS.filter(
  (c) => c.status === 'Approved' && c.amountApproved !== undefined
);
