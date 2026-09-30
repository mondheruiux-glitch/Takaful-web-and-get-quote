import { useState, useEffect } from 'react';
import { SupportTicket, TicketCategory, TicketPriority, TicketStatus, UserRole } from './types';
import { CATEGORY_ROUTING, routeTicket } from './ticket-routing';

/* ─── Seed Data ──────────────────────────────────────────────────────────── */
export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-2024-101',
    participantId: 'P-0042',
    participantName: 'Fatima Al-Rashid',
    participantEmail: 'f.alrashid@email.com',
    subject: 'Status update on Storm Damage Claim (CLM-2024-0891)',
    category: 'Claim Inquiry',
    priority: 'High',
    status: 'In Progress',
    routedToRole: 'claim_handler',
    assignedToId: 'STF-001',
    assignedTo: 'Omar Hassan (Senior Claims Handler)',
    slaHours: 4,
    relatedClaimId: 'CLM-2024-0891',
    createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(), // 2.5h ago
    lastUpdated: '10 mins ago',
    messages: [
      {
        id: 'tm-1',
        senderName: 'Fatima Al-Rashid',
        senderRole: 'Participant',
        text: 'Assalamu Alaikum, I submitted my storm damage claim and uploaded roof damage photos. When can I expect the structural assessor visit?',
        timestamp: '2 hours ago',
        isStaff: false,
      },
      {
        id: 'tm-2',
        senderName: 'Omar Hassan',
        senderRole: 'Senior Claims Specialist',
        text: 'Walaikum Assalam Fatima. We have reviewed your photos and assigned an independent surveyor. The inspection is booked for 25 July at 10:00 AM.',
        timestamp: '10 mins ago',
        isStaff: true,
      },
    ],
  },
  {
    id: 'TICK-2024-102',
    participantId: 'P-0087',
    participantName: 'Hassan Mahmoud',
    participantEmail: 'h.mahmoud@email.com',
    subject: 'Update Direct Debit mandate bank details',
    category: 'Contribution',
    priority: 'Medium',
    status: 'Open',
    routedToRole: 'finance',
    assignedToId: 'STF-004',
    assignedTo: 'Amira Siddiqui (Head of Treasury)',
    slaHours: 8,
    relatedCertificateId: 'TK-2024-0087',
    createdAt: new Date(Date.now() - 3.2 * 3600 * 1000).toISOString(), // 3.2h ago
    lastUpdated: '3 hours ago',
    messages: [
      {
        id: 'tm-3',
        senderName: 'Hassan Mahmoud',
        senderRole: 'Participant',
        text: 'Hello team, I recently switched my current account to HSBC. How can I safely update my monthly contribution Direct Debit mandate before the 1st of next month?',
        timestamp: '3 hours ago',
        isStaff: false,
      },
    ],
  },
  {
    id: 'TICK-2024-103',
    participantId: 'P-0112',
    participantName: 'Aisha Okonkwo',
    participantEmail: 'a.okonkwo@email.com',
    subject: 'Requesting updated Buildings Cover Schedule PDF',
    category: 'Certificate',
    priority: 'Low',
    status: 'Resolved',
    routedToRole: 'management',
    assignedToId: 'STF-006',
    assignedTo: 'Ahmed Khan (Operations Director)',
    slaHours: 24,
    relatedCertificateId: 'TK-2024-0112',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    lastUpdated: '4 hours ago',
    messages: [
      {
        id: 'tm-4',
        senderName: 'Aisha Okonkwo',
        senderRole: 'Participant',
        text: 'Hi, my mortgage lender requested an updated certificate showing the buildings limit (£420,000). Could you resend the schedule?',
        timestamp: 'Yesterday',
        isStaff: false,
      },
      {
        id: 'tm-5',
        senderName: 'Ahmed Khan',
        senderRole: 'Operations Director',
        text: 'Hello Aisha, your updated schedule (TK-2024-0112) has been regenerated and attached to your Documents portal page.',
        timestamp: '4 hours ago',
        isStaff: true,
      },
    ],
  },
  {
    id: 'TICK-2024-104',
    participantId: 'P-0055',
    participantName: 'Ibrahim Al-Sayed',
    participantEmail: 'i.alsayed@email.com',
    subject: 'Urgent structural report submission for Subsidence claim',
    category: 'Claim Inquiry',
    priority: 'Critical',
    status: 'In Progress',
    routedToRole: 'claim_handler',
    assignedToId: 'STF-001',
    assignedTo: 'Omar Hassan (Senior Claims Handler)',
    slaHours: 4,
    relatedClaimId: 'CLM-2024-0892',
    createdAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(), // 4.5h ago (Breached SLA)
    lastUpdated: '1 hour ago',
    messages: [
      {
        id: 'tm-6',
        senderName: 'Ibrahim Al-Sayed',
        senderRole: 'Participant',
        text: 'Urgent: The chartered structural engineer completed their subsidence inspection report today. Please confirm receipt and let me know the payout schedule.',
        timestamp: '4 hours ago',
        isStaff: false,
      },
      {
        id: 'tm-7',
        senderName: 'Omar Hassan',
        senderRole: 'Senior Claims Specialist',
        text: 'Report received Ibrahim. Assessing foundation underpinning estimates now.',
        timestamp: '1 hour ago',
        isStaff: true,
      },
    ],
  },
  {
    id: 'TICK-2024-105',
    participantId: 'P-0042',
    participantName: 'Fatima Al-Rashid',
    participantEmail: 'f.alrashid@email.com',
    subject: 'Error uploading high-resolution survey photos on portal',
    category: 'Technical',
    priority: 'Medium',
    status: 'Open',
    routedToRole: 'finance',
    assignedToId: 'STF-005',
    assignedTo: 'Tariq Malik (Reconciliation Officer)',
    slaHours: 12,
    createdAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    lastUpdated: '1.5 hours ago',
    messages: [
      {
        id: 'tm-8',
        senderName: 'Fatima Al-Rashid',
        senderRole: 'Participant',
        text: 'When I try to upload my 25MB surveyor PDF on the mobile portal, it times out with error code ERR_PAYLOAD_LIMIT.',
        timestamp: '1.5 hours ago',
        isStaff: false,
      },
    ],
  },
  {
    id: 'TICK-2024-106',
    participantId: 'P-0087',
    participantName: 'Hassan Mahmoud',
    participantEmail: 'h.mahmoud@email.com',
    subject: 'Query on Shariah Surplus Distribution calculation formula',
    category: 'General',
    priority: 'Low',
    status: 'Open',
    routedToRole: 'management',
    assignedToId: 'STF-006',
    assignedTo: 'Ahmed Khan (Operations Director)',
    slaHours: 24,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    lastUpdated: '6 hours ago',
    messages: [
      {
        id: 'tm-9',
        senderName: 'Hassan Mahmoud',
        senderRole: 'Participant',
        text: 'Could you clarify how the annual Mudharabah surplus share is credited back to participant accounts at the financial year end?',
        timestamp: '6 hours ago',
        isStaff: false,
      },
    ],
  },
];

const STORAGE_KEY = 'takaful_support_tickets_v1';

/* ─── State Store ────────────────────────────────────────────────────────── */
let inMemoryTickets: SupportTicket[] = [...INITIAL_SUPPORT_TICKETS];
const listeners = new Set<(tickets: SupportTicket[]) => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryTickets));
    } catch {
      // Ignore quota errors
    }
  }
  listeners.forEach(fn => fn([...inMemoryTickets]));
}

function initTickets() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryTickets = parsed;
          return;
        }
      }
    } catch {
      // Fallback to initial
    }
  }
}

// Initialize on module load if in browser
if (typeof window !== 'undefined') {
  initTickets();
}

export const TicketStore = {
  getTickets(): SupportTicket[] {
    return inMemoryTickets;
  },

  createTicket(payload: {
    participantId: string;
    participantName: string;
    participantEmail: string;
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    initialMessage: string;
    relatedClaimId?: string;
    relatedCertificateId?: string;
    attachments?: string[];
  }): SupportTicket {
    const routing = routeTicket(payload.category);
    const newId = `TICK-2024-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket: SupportTicket = {
      id: newId,
      participantId: payload.participantId,
      participantName: payload.participantName,
      participantEmail: payload.participantEmail,
      subject: payload.subject,
      category: payload.category,
      priority: payload.priority,
      status: 'Open',
      routedToRole: routing.routedToRole,
      assignedToId: routing.defaultAssigneeId,
      assignedTo: routing.defaultAssignee,
      slaHours: routing.slaHours,
      createdAt: new Date().toISOString(),
      lastUpdated: 'Just now',
      relatedClaimId: payload.relatedClaimId,
      relatedCertificateId: payload.relatedCertificateId,
      messages: [
        {
          id: `tm-${Date.now()}`,
          senderName: payload.participantName,
          senderRole: 'Participant',
          text: payload.initialMessage,
          timestamp: 'Just now',
          isStaff: false,
          attachments: payload.attachments,
        },
      ],
    };

    inMemoryTickets = [newTicket, ...inMemoryTickets];
    notify();
    return newTicket;
  },

  addMessage(ticketId: string, message: {
    senderName: string;
    senderRole: string;
    senderUserId?: string;
    text: string;
    isStaff: boolean;
    attachments?: string[];
  }): SupportTicket | undefined {
    let updatedTicket: SupportTicket | undefined;
    inMemoryTickets = inMemoryTickets.map(t => {
      if (t.id === ticketId) {
        const newMsg = {
          id: `tm-${Date.now()}`,
          senderName: message.senderName,
          senderRole: message.senderRole,
          senderUserId: message.senderUserId,
          text: message.text,
          timestamp: 'Just now',
          isStaff: message.isStaff,
          attachments: message.attachments,
        };
        const nextStatus: TicketStatus =
          message.isStaff && t.status === 'Open' ? 'In Progress' : t.status;
        updatedTicket = {
          ...t,
          status: nextStatus,
          lastUpdated: 'Just now',
          messages: [...t.messages, newMsg],
        };
        return updatedTicket;
      }
      return t;
    });
    notify();
    return updatedTicket;
  },

  updateStatus(ticketId: string, status: TicketStatus): SupportTicket | undefined {
    let updatedTicket: SupportTicket | undefined;
    inMemoryTickets = inMemoryTickets.map(t => {
      if (t.id === ticketId) {
        updatedTicket = { ...t, status, lastUpdated: 'Just now' };
        return updatedTicket;
      }
      return t;
    });
    notify();
    return updatedTicket;
  },

  reassignTicket(ticketId: string, staffMemberId: string, staffName: string): SupportTicket | undefined {
    let updatedTicket: SupportTicket | undefined;
    inMemoryTickets = inMemoryTickets.map(t => {
      if (t.id === ticketId) {
        updatedTicket = {
          ...t,
          assignedToId: staffMemberId,
          assignedTo: staffName,
          lastUpdated: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `tm-${Date.now()}`,
              senderName: 'System Router',
              senderRole: 'Automation',
              text: `ℹ️ Ticket reassigned to ${staffName}.`,
              timestamp: 'Just now',
              isStaff: true,
            },
          ],
        };
        return updatedTicket;
      }
      return t;
    });
    notify();
    return updatedTicket;
  },

  reset(): void {
    inMemoryTickets = [...INITIAL_SUPPORT_TICKETS];
    notify();
  },
};

/* ─── React Hook ─────────────────────────────────────────────────────────── */
export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => inMemoryTickets);

  useEffect(() => {
    initTickets();
    setTickets([...inMemoryTickets]);

    const handleChange = (updated: SupportTicket[]) => {
      setTickets(updated);
    };

    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return {
    tickets,
    createTicket: TicketStore.createTicket,
    addMessage: TicketStore.addMessage,
    updateStatus: TicketStore.updateStatus,
    reassignTicket: TicketStore.reassignTicket,
    resetTickets: TicketStore.reset,
  };
}
