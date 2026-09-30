import {
  TicketCategory,
  UserRole,
  SupportTicket,
  RoutingRule,
} from './types';

/* ─── Category → Role Routing Map ───────────────────────────────────────── */
export const CATEGORY_ROUTING: Record<TicketCategory, RoutingRule> = {
  'Claim Inquiry': {
    routedToRole: 'claim_handler',
    defaultAssignee: 'Omar Hassan (Senior Claims Handler)',
    defaultAssigneeId: 'STF-001',
    slaHours: 4,
    icon: '🛡️',
    description: 'Damage, loss assessment & surveyor visits',
    urgencyHint: 'Claims SLA: 4-hour first response',
    color: '#3b82f6',
  },
  'Contribution': {
    routedToRole: 'finance',
    defaultAssignee: 'Amira Siddiqui (Head of Treasury)',
    defaultAssigneeId: 'STF-004',
    slaHours: 8,
    icon: '💳',
    description: 'Direct Debit, banking & contribution payments',
    urgencyHint: 'Finance SLA: 8-hour response',
    color: '#00c685',
  },
  'Certificate': {
    routedToRole: 'management',
    defaultAssignee: 'Ahmed Khan (Operations Director)',
    defaultAssigneeId: 'STF-006',
    slaHours: 24,
    icon: '📄',
    description: 'Mortgage schedule, policy PDF & certificate requests',
    urgencyHint: 'Certificate SLA: 24-hour delivery',
    color: '#8b5cf6',
  },
  'Technical': {
    routedToRole: 'finance',
    defaultAssignee: 'Tariq Malik (Reconciliation Officer)',
    defaultAssigneeId: 'STF-005',
    slaHours: 12,
    icon: '🔧',
    description: 'Portal login, document upload & platform issues',
    urgencyHint: 'Tech SLA: 12-hour resolution',
    color: '#f59e0b',
  },
  'General': {
    routedToRole: 'management',
    defaultAssignee: 'Ahmed Khan (Operations Director)',
    defaultAssigneeId: 'STF-006',
    slaHours: 24,
    icon: '❓',
    description: 'Surplus distribution, Shariah compliance & coverage terms',
    urgencyHint: 'General SLA: 24-hour response',
    color: '#94a3b8',
  },
};

/* ─── Role → Visible Categories ─────────────────────────────────────────── */
export const ROLE_INBOX_FILTER: Record<UserRole, TicketCategory[]> = {
  participant:   [],
  claim_handler: ['Claim Inquiry'],
  finance:       ['Contribution', 'Technical'],
  management:    ['Certificate', 'General'],
  super_admin:   ['Claim Inquiry', 'Contribution', 'Certificate', 'Technical', 'General'],
};

export const INBOX_LABELS: Record<UserRole, string> = {
  participant:   'My Support Tickets',
  claim_handler: 'Claims Inbox',
  finance:       'Finance & Payments Inbox',
  management:    'Operations Inbox',
  super_admin:   'All Tickets — Supervisor View',
};

export const INBOX_ICONS: Record<UserRole, string> = {
  participant:   '🎫',
  claim_handler: '🛡️',
  finance:       '💳',
  management:    '📋',
  super_admin:   '⚡',
};

export function routeTicket(category: TicketCategory): RoutingRule {
  return CATEGORY_ROUTING[category];
}

export function getInboxCategories(role: UserRole): TicketCategory[] {
  return ROLE_INBOX_FILTER[role] ?? [];
}

export function filterTicketsForRole(
  tickets: SupportTicket[],
  role: UserRole,
  participantId?: string,
): SupportTicket[] {
  if (role === 'participant') {
    return tickets.filter(t => t.participantId === participantId);
  }
  const allowed = getInboxCategories(role);
  return tickets.filter(t => allowed.includes(t.category));
}

export interface SLAStatus {
  label: 'BREACHED' | 'AT RISK' | 'ON TRACK';
  hoursLeft: number;
  color: string;
  bgColor: string;
}

export function computeSLAStatus(createdAt: string, slaHours: number): SLAStatus {
  const created = new Date(createdAt).getTime();
  const deadline = isNaN(created)
    ? Date.now() + slaHours * 3600 * 1000
    : created + slaHours * 3600 * 1000;
  const now = Date.now();
  const hoursLeft = (deadline - now) / (1000 * 60 * 60);

  if (hoursLeft < 0) {
    return { label: 'BREACHED', hoursLeft: Math.abs(hoursLeft), color: '#ef4444', bgColor: 'rgba(239,68,68,0.12)' };
  }
  if (hoursLeft < 1) {
    return { label: 'AT RISK', hoursLeft, color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)' };
  }
  return { label: 'ON TRACK', hoursLeft, color: '#00c685', bgColor: 'rgba(0,198,133,0.10)' };
}

export function formatSLALabel(sla: SLAStatus): string {
  const h = Math.floor(Math.abs(sla.hoursLeft));
  const m = Math.round((Math.abs(sla.hoursLeft) - h) * 60);
  if (sla.label === 'BREACHED') return `Overdue ${h}h ${m}m`;
  if (sla.label === 'AT RISK') return `${m}m left`;
  return `${h}h ${m}m left`;
}
