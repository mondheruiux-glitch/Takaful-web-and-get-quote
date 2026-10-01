/**
 * Centralised route definitions for the Takaful UK application.
 *
 * Architecture Flow (Option B):
 *   Visitor      → /get-quote → /compare-plans → /signup → /portal
 *   Participant  → /portal → /portal/my-cover → /portal/claims/new → /portal/claims/:id
 *   Staff        → /dashboard/* (Claim Handler, Finance, Management, Super Admin)
 */
export const ROUTES = {
  // ─── Public / Visitor Journey ───────────────────────────────────────────────
  home: '/',
  about: '/about',
  howItWorks: '/how-it-works',
  comparePlans: '/compare-plans',
  contact: '/contact',
  getQuote: '/get-quote',
  signup: '/signup',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',
  policyClauses: '/policy-clauses',
  pay: '/pay',

  // ─── Participant Portal Journey ──────────────────────────────────────────────
  portal: {
    home: '/portal/my-cover',           // Entry / My Cover
    myCover: '/portal/my-cover',
    claims: '/portal/claims',
    newClaim: '/portal/claims/new',
    claimDetail: (id: string) => `/portal/claims/${id}`,
    contributions: '/portal/contributions',
    documents: '/portal/documents',
    pool: '/portal/pool',
    support: '/portal/support',
    settings: '/portal/settings',
    notifications: '/portal/notifications',
  },

  // ─── Staff Dashboard (role-based) ───────────────────────────────────────────
  dashboard: {
    home: '/dashboard',
    claims: '/dashboard/claims',
    newClaim: '/dashboard/claims/new',
    contributions: '/dashboard/contributions',
    documents: '/dashboard/documents',
    settings: '/dashboard/settings',
    support: '/dashboard/support',
    transactions: '/dashboard/transactions',
    notifications: '/dashboard/notifications',
    myCover: '/dashboard/my-cover',
    pool: '/dashboard/pool',
    queue: '/dashboard/queue',
    risk: '/dashboard/risk',
    staff: '/dashboard/staff',
    certificates: '/dashboard/certificates',
    claimsPayments: '/dashboard/claims-payments',
  },

  // ─── Vanity / Alias paths (redirected in next.config.ts) ────────────────────
  fileClaim: '/file-claim',     // → /portal/claims/new
  trackClaim: '/track-claim',   // → /portal/claims
  clauses: '/clauses',          // → /policy-clauses
  compare: '/compare',          // → /compare-plans
} as const;
