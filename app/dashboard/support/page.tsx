'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, MessageSquare, Ticket, BookOpen, Search, Plus, Send,
  Paperclip, CheckCircle2, Clock, AlertCircle, ChevronRight, X,
  User, Shield, Phone, Mail, ArrowUpRight, MessageCircle, RefreshCw,
  Filter, Tag, Headphones, Check, UserCheck, FileText, CreditCard,
  Wrench, UploadCloud, Trash2, Loader2, Sparkles
} from 'lucide-react';
import { useTheme, useRole } from '../ThemeRoleContext';
import { DEMO_USERS, PARTICIPANTS } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

/* ─── Mock Ticket & Chat Types ───────────────────────────────────────────── */
interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isStaff?: boolean;
}

interface SupportTicket {
  id: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  subject: string;
  category: 'Claim Inquiry' | 'Contribution' | 'Certificate' | 'Technical' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  text: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  participantName: string;
  participantId: string;
  lastMessage: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

/* ─── Initial Mock Data ──────────────────────────────────────────────────── */
const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-2024-101',
    participantId: 'P-0042',
    participantName: 'Fatima Al-Rashid',
    participantEmail: 'f.alrashid@email.com',
    subject: 'Status update on Storm Damage Claim (CLM-2024-0891)',
    category: 'Claim Inquiry',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Omar Hassan (Claim Handler)',
    createdAt: '18 Jul 2026, 10:30',
    lastUpdated: '10 mins ago',
    messages: [
      {
        id: 'tm-1',
        senderName: 'Fatima Al-Rashid',
        senderRole: 'Participant',
        text: 'Assalamu Alaikum, I submitted my storm damage claim 3 days ago and uploaded photos. When can I expect the structural assessor visit?',
        timestamp: '18 Jul 2026, 10:30',
        isStaff: false,
      },
      {
        id: 'tm-2',
        senderName: 'Omar Hassan',
        senderRole: 'Senior Claims Handler',
        text: 'Walaikum Assalam Fatima. We have reviewed your photos and assigned an independent surveyor. The inspection is booked for 25 July at 10:00 AM.',
        timestamp: '19 Jul 2026, 14:15',
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
    assignedTo: 'Amira Siddiqui (Finance)',
    createdAt: '20 Jul 2026, 09:15',
    lastUpdated: '2 hours ago',
    messages: [
      {
        id: 'tm-3',
        senderName: 'Hassan Mahmoud',
        senderRole: 'Participant',
        text: 'Hello team, I recently switched my current account to HSBC. How can I safely update my monthly contribution Direct Debit mandate?',
        timestamp: '20 Jul 2026, 09:15',
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
    assignedTo: 'Ahmed Khan (Management)',
    createdAt: '15 Jul 2026, 16:40',
    lastUpdated: '16 Jul 2026',
    messages: [
      {
        id: 'tm-4',
        senderName: 'Aisha Okonkwo',
        senderRole: 'Participant',
        text: 'Hi, my mortgage lender requested an updated certificate showing the buildings limit (£420,000). Could you resend the schedule?',
        timestamp: '15 Jul 2026, 16:40',
        isStaff: false,
      },
      {
        id: 'tm-5',
        senderName: 'Ahmed Khan',
        senderRole: 'Operations Director',
        text: 'Hello Aisha, your updated schedule (TK-2024-0112) has been regenerated and attached to your Documents portal page.',
        timestamp: '16 Jul 2026, 09:10',
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
    assignedTo: 'Omar Hassan (Claim Handler)',
    createdAt: '21 Jul 2026, 08:20',
    lastUpdated: '1 hour ago',
    messages: [
      {
        id: 'tm-6',
        senderName: 'Ibrahim Al-Sayed',
        senderRole: 'Participant',
        text: 'The structural engineer completed their wall inspection today and provided a preliminary PDF report. Where should I upload this for CLM-2024-0886?',
        timestamp: '21 Jul 2026, 08:20',
        isStaff: false,
      },
    ],
  },
];

const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat-1',
    participantName: 'Fatima Al-Rashid',
    participantId: 'P-0042',
    lastMessage: 'Thank you for explaining the surplus distribution policy!',
    unread: 0,
    online: true,
    messages: [
      { id: 'cm-1', sender: 'agent', senderName: 'Takaful Advisor', text: 'Assalamu Alaikum Fatima! How can I assist you with your Takaful policy today?', timestamp: '10:14 AM' },
      { id: 'cm-2', sender: 'user', senderName: 'Fatima Al-Rashid', text: 'Hi, I wanted to understand how the Tabarru underwriting surplus is calculated at the end of the financial year.', timestamp: '10:15 AM' },
      { id: 'cm-3', sender: 'agent', senderName: 'Takaful Advisor', text: 'Great question! Any remaining surplus after claim settlements and reserves is distributed back to eligible participants proportional to their contributions.', timestamp: '10:16 AM' },
      { id: 'cm-4', sender: 'user', senderName: 'Fatima Al-Rashid', text: 'Thank you for explaining the surplus distribution policy!', timestamp: '10:17 AM' },
    ],
  },
  {
    id: 'chat-2',
    participantName: 'Hassan Mahmoud',
    participantId: 'P-0087',
    lastMessage: 'Is accidental damage included in my contents cover?',
    unread: 1,
    online: true,
    messages: [
      { id: 'cm-5', sender: 'user', senderName: 'Hassan Mahmoud', text: 'Is accidental damage included in my contents cover?', timestamp: '11:02 AM' },
    ],
  },
  {
    id: 'chat-3',
    participantName: 'Yusuf Ibrahim',
    participantId: 'P-0031',
    lastMessage: 'Got it, I will submit the police report number online.',
    unread: 0,
    online: false,
    messages: [
      { id: 'cm-6', sender: 'user', senderName: 'Yusuf Ibrahim', text: 'Where do I enter the crime reference number for my theft claim?', timestamp: 'Yesterday' },
      { id: 'cm-7', sender: 'agent', senderName: 'Takaful Support', text: 'You can add it directly in the Claim Description or upload the police statement under My Documents.', timestamp: 'Yesterday' },
      { id: 'cm-8', sender: 'user', senderName: 'Yusuf Ibrahim', text: 'Got it, I will submit the police report number online.', timestamp: 'Yesterday' },
    ],
  },
];

const FAQ_ITEMS = [
  {
    category: 'Claims',
    question: 'How do I submit a new Takaful claim?',
    answer: 'Navigate to the "My Claims" or "Claims" tab in your dashboard, click "+ Submit New Claim", select your covered certificate, choose the incident type (e.g. Storm, Water Leak, Theft), describe the event, and attach initial photos or receipts.',
  },
  {
    category: 'Claims',
    question: 'What is the average timeline for claim processing?',
    answer: 'Standard claims under £2,000 are typically reviewed and approved within 3–5 business days. Complex structural claims requiring an independent loss adjuster inspection take 7–14 days.',
  },
  {
    category: 'Contributions',
    question: 'How does the Shariah-compliant Tabarru fund work?',
    answer: 'Your monthly contribution is split into an underwriting pool (Tabarru) used solely to assist fellow participants in times of loss, and an operational fee (Wakala) for fund administration.',
  },
  {
    category: 'Contributions',
    question: 'What happens if a monthly Direct Debit fails?',
    answer: 'We automatically retry collection after 5 business days and notify you via email and notification center. Your coverage remains fully active during the grace period.',
  },
  {
    category: 'Policy & Coverage',
    question: 'How do I request an updated policy certificate for my mortgage provider?',
    answer: 'Go to "Settings" or "My Cover", click "Download Certificate", or open a quick Support Ticket under "Certificate Request" to receive an officially stamped PDF via email within 24 hours.',
  },
];

/* ─── Avatar Helper Component ────────────────────────────────────────────── */
function getUserAvatar(name: string, isStaff?: boolean): string {
  // Check demo users
  const staff = Object.values(DEMO_USERS).find(u => u.name.toLowerCase() === name.toLowerCase());
  if (staff) {
    return getDicebearAvatar(staff.name, staff.gender);
  }
  // Check participants
  const participant = PARTICIPANTS.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (participant) {
    const isFemale = ['fatima', 'aisha', 'maryam', 'zahra', 'amira'].some(n => participant.name.toLowerCase().includes(n));
    return getDicebearAvatar(participant.name, isFemale ? 'female' : 'male');
  }
  // Default check based on common names or staff flag
  const isFemale = ['fatima', 'aisha', 'maryam', 'zahra', 'amira'].some(n => name.toLowerCase().includes(n));
  return getDicebearAvatar(name, isFemale ? 'female' : 'male');
}

function UserAvatar({ name, className = "w-7 h-7", isStaff }: { name: string; className?: string; isStaff?: boolean }) {
  const avatarUrl = getUserAvatar(name, isStaff);
  return (
    <img
      src={avatarUrl}
      alt={name}
      className={`${className} rounded-full object-cover border border-black/10 dark:border-white/10 shrink-0 bg-gray-100 dark:bg-emerald-950/30`}
    />
  );
}

/* ─── Status Badge Component ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Open':        'bg-blue-500/15 text-blue-500 border-blue-500/20',
    'In Progress': 'bg-amber-500/15 text-amber-500 border-amber-500/20',
    'Resolved':    'bg-emerald-500/15 text-emerald-500 border-emerald-500/20',
    'Closed':      'bg-gray-500/15 text-gray-400 border-gray-500/20',
    'Low':         'bg-emerald-500/10 text-emerald-400',
    'Medium':      'bg-amber-500/10 text-amber-400',
    'High':        'bg-orange-500/10 text-orange-400',
    'Critical':    'bg-red-500/10 text-red-400',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
      {status}
    </span>
  );
}

export default function SupportPage() {
  const { theme } = useTheme();
  const { role } = useRole();
  const isLight = theme === 'light';
  const isStaff = role !== 'participant';

  const GREEN = '#00c685';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL2 = isLight ? '#F8FAFC' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<'tickets' | 'chat' | 'faqs'>('tickets');

  // Tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New ticket form state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Claim Inquiry');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('Medium');
  const [newDescription, setNewDescription] = useState('');
  const [newReference, setNewReference] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  // Live Chat state
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [chatInput, setChatInput] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) ?? chats[0];

  // Filtered tickets based on search & status & role
  const currentUser = DEMO_USERS[role];

  // Keyboard Escape listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCreateModalOpen) {
        setIsCreateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen]);

  const filteredTickets = tickets.filter(t => {
    // If participant, show only their tickets
    if (role === 'participant' && t.participantId !== currentUser.participantId) {
      // In demo mode, if participant matches participantId or name
      if (t.participantName !== currentUser.name) return false;
    }
    const matchesSearch =
      t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.participantName.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Ticket Reply handler
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg: TicketMessage = {
      id: `tm-${Date.now()}`,
      senderName: currentUser.name,
      senderRole: isStaff ? currentUser.jobTitle ?? 'Staff' : 'Participant',
      text: replyText,
      timestamp: 'Just now',
      isStaff: isStaff,
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          lastUpdated: 'Just now',
          status: isStaff && t.status === 'Open' ? ('In Progress' as const) : t.status,
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      lastUpdated: 'Just now',
      status: isStaff && selectedTicket.status === 'Open' ? 'In Progress' : selectedTicket.status,
      messages: [...selectedTicket.messages, newMsg],
    });
    setReplyText('');
  };

  // Status Change handler (for staff)
  const handleUpdateStatus = (newStatus: SupportTicket['status']) => {
    if (!selectedTicket) return;
    const updated = tickets.map(t => (t.id === selectedTicket.id ? { ...t, status: newStatus, lastUpdated: 'Just now' } : t));
    setTickets(updated);
    setSelectedTicket({ ...selectedTicket, status: newStatus, lastUpdated: 'Just now' });
  };

  // Handle Mock File Add
  const handleAddMockFile = () => {
    const samples = ['Damage_Photo_01.jpg', 'Repair_Quote_Estimate.pdf', 'Mortgage_Statement.pdf', 'Police_Report_Extract.pdf'];
    const available = samples.filter(s => !attachedFiles.includes(s));
    if (available.length > 0) {
      setAttachedFiles([...attachedFiles, available[0]]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(attachedFiles.filter(f => f !== fileName));
  };

  // Create Ticket handler
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `TICK-2024-${Math.floor(100 + Math.random() * 900)}`;
      const combinedDescription = [
        newReference.trim() ? `[Reference / Policy ID: ${newReference.trim()}]` : null,
        newDescription.trim(),
        attachedFiles.length > 0 ? `📎 Attachments: ${attachedFiles.join(', ')}` : null,
      ].filter(Boolean).join('\n\n');

      const newTicket: SupportTicket = {
        id: ticketId,
        participantId: currentUser.participantId ?? 'P-0042',
        participantName: currentUser.name,
        participantEmail: currentUser.email,
        subject: newSubject,
        category: newCategory,
        priority: newPriority,
        status: 'Open',
        assignedTo: 'Support Desk Queue',
        createdAt: 'Just now',
        lastUpdated: 'Just now',
        messages: [
          {
            id: `tm-${Date.now()}`,
            senderName: currentUser.name,
            senderRole: isStaff ? currentUser.jobTitle ?? 'Staff' : 'Participant',
            text: combinedDescription,
            timestamp: 'Just now',
            isStaff: isStaff,
          },
        ],
      };

      setTickets([newTicket, ...tickets]);
      setSelectedTicket(newTicket);
      setActiveTab('tickets');
      setIsCreateModalOpen(false);
      setIsSubmitting(false);
      setNewSubject('');
      setNewDescription('');
      setNewReference('');
      setAttachedFiles([]);
      setSuccessToast(`Ticket #${ticketId} submitted successfully! Our team will respond shortly.`);
      setTimeout(() => setSuccessToast(null), 5000);
    }, 450);
  };

  // Live Chat Send Message handler
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `cm-${Date.now()}`,
      sender: role === 'participant' ? 'user' : 'agent',
      senderName: currentUser.name,
      text: chatInput,
      timestamp: 'Just now',
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: chatInput,
          messages: [...c.messages, userMessage],
        };
      }
      return c;
    });

    setChats(updatedChats);
    const sentText = chatInput;
    setChatInput('');

    // Simulated Auto-response after 1.5s
    setTimeout(() => {
      const autoResponse: ChatMessage = {
        id: `cm-${Date.now() + 1}`,
        sender: role === 'participant' ? 'agent' : 'user',
        senderName: role === 'participant' ? 'Takaful Advisor' : activeChat.participantName,
        text: role === 'participant'
          ? `Thank you for your message! Our team has received your query regarding "${sentText.slice(0, 30)}..." and an advisor is reviewing your account.`
          : `Thanks for the update! Please let me know if any further documents are needed from my end.`,
        timestamp: 'Just now',
      };

      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMessage: autoResponse.text, messages: [...c.messages, autoResponse] } : c));
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 transition-colors duration-200">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>
              {isStaff ? 'Customer Support & Helpdesk Desk' : 'Support & Live Assistance'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#00c685]/15 text-[#00c685]">
              {isStaff ? 'Staff Portal' : 'Member Portal'}
            </span>
          </div>
          <p className={`text-xs mt-1 ${TEXT_SUB}`}>
            {isStaff
              ? 'Manage participant inquiries, resolve tickets, and engage in real-time chat assistance'
              : 'Get instant answers, submit support requests, or chat live with your Takaful advisor'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-all shrink-0"
            style={{ background: GREEN }}
          >
            <Plus size={15} />
            Submit Support Ticket
          </button>
          {isStaff && (
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                isLight ? 'bg-black/5 border-black/10 text-black hover:bg-black/10' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              <Ticket size={15} className="text-[#00c685]" />
              Queue ({tickets.filter(t => t.status === 'Open').length})
            </button>
          )}
        </div>
      </motion.div>

      {/* ─── Support Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Support Tickets', value: tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, icon: Ticket, sub: 'Requiring attention' },
          { label: 'Live Chat Response', value: '< 2 mins', icon: MessageSquare, sub: 'Average wait time' },
          { label: 'Satisfaction Score', value: '98.6%', icon: CheckCircle2, sub: 'Based on 450+ ratings' },
          { label: 'Support Coverage', value: '24 / 7', icon: Headphones, sub: 'Shariah & Claims help' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              variants={fadeUp} initial="hidden" animate="visible" custom={i}
              className="p-4 rounded-2xl border transition-all duration-200"
              style={{ background: BG_PANEL, borderColor: BORDER }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${TEXT_SUB}`}>{item.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#00c685]/10 text-[#00c685]">
                  <Icon size={16} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${TEXT_MAIN}`}>{item.value}</p>
              <p className={`text-[10px] mt-1 ${TEXT_MUTED}`}>{item.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Navigation Sub-Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: BORDER }}>
        {[
          { id: 'tickets', label: isStaff ? 'Support Tickets Queue' : 'My Support Tickets', icon: Ticket, badge: tickets.filter(t => t.status === 'Open').length },
          { id: 'chat', label: 'Instant Live Chat', icon: MessageSquare, badge: 1 },
          { id: 'faqs', label: 'Help Center & FAQs', icon: BookOpen },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-[#00c685]/15 text-[#00c685]'
                  : isLight ? 'text-black/60 hover:text-black hover:bg-black/5' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00c685] text-white">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: SUPPORT TICKETS ───────────────────────────────────────── */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List Column */}
          <div className={`lg:col-span-1 space-y-4`}>
            {/* Search & Status Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
                <input
                  value={ticketSearch}
                  onChange={e => setTicketSearch(e.target.value)}
                  placeholder="Search ticket ID, participant or subject..."
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/40 transition-colors ${
                    isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.05] text-white'
                  }`}
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#00c685] text-white'
                        : isLight ? 'bg-black/5 text-black/60 hover:bg-black/10' : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets Cards */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border" style={{ background: BG_PANEL, borderColor: BORDER }}>
                  <Ticket size={28} className={`mx-auto mb-2 ${TEXT_MUTED}`} />
                  <p className={`text-xs font-semibold ${TEXT_MAIN}`}>No support tickets found</p>
                  <p className={`text-[11px] mt-1 mb-3 ${TEXT_SUB}`}>Try adjusting search or status filters</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                    style={{ background: GREEN }}
                  >
                    <Plus size={13} />
                    Open New Ticket
                  </button>
                </div>
              ) : (
                filteredTickets.map(t => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#00c685] bg-[#00c685]/10 shadow-sm'
                          : isLight ? 'bg-white border-gray-200 hover:border-gray-300' : 'bg-[#0d2117] border-white/[0.05] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <UserAvatar name={t.participantName} className="w-5 h-5" />
                        <span className="text-[10px] font-mono font-bold text-[#00c685]">{t.id}</span>
                        <span className="flex-1" />
                        <StatusBadge status={t.status} />
                      </div>
                      <h4 className={`text-xs font-semibold line-clamp-1 mb-1 ${TEXT_MAIN}`}>{t.subject}</h4>
                      <p className={`text-[11px] ${TEXT_SUB} flex items-center justify-between`}>
                        <span className="truncate">{t.participantName}</span>
                        <span className={`text-[10px] shrink-0 ml-2 ${TEXT_MUTED}`}>{t.lastUpdated}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t text-[10px]" style={{ borderColor: BORDER }}>
                        <span className={`px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 ${TEXT_MUTED}`}>{t.category}</span>
                        <span className="flex-1" />
                        <StatusBadge status={t.priority} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ticket Detail & Thread Panel */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="rounded-2xl border p-5 flex flex-col h-full min-h-[520px]" style={{ background: BG_PANEL, borderColor: BORDER }}>
                {/* Detail Header */}
                <div className="border-b pb-4 mb-4 space-y-3" style={{ borderColor: BORDER }}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={selectedTicket.participantName} className="w-6 h-6" />
                      <span className="text-xs font-mono font-bold text-[#00c685]">{selectedTicket.id}</span>
                      <StatusBadge status={selectedTicket.status} />
                      <StatusBadge status={selectedTicket.priority} />
                    </div>
                    {isStaff && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${TEXT_SUB}`}>Update Status:</span>
                        <select
                          value={selectedTicket.status}
                          onChange={e => handleUpdateStatus(e.target.value as any)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-white/5 border-white/10 text-white'
                          }`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-base font-bold ${TEXT_MAIN}`}>{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-4 text-xs mt-1 text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <UserAvatar name={selectedTicket.participantName} className="w-4 h-4" />
                        Submitted by: <strong className={TEXT_MAIN}>{selectedTicket.participantName}</strong> ({selectedTicket.participantEmail})
                      </span>
                      <span>Category: <strong>{selectedTicket.category}</strong></span>
                      <span className="flex items-center gap-1.5">
                        <UserAvatar name={selectedTicket.assignedTo.split('(')[0].trim()} isStaff className="w-4 h-4" />
                        Assigned to: <strong>{selectedTicket.assignedTo}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thread Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
                  {selectedTicket.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        msg.isStaff
                          ? isLight
                            ? 'bg-slate-50 border-slate-200/80 ml-6'
                            : 'bg-white/[0.04] border-white/10 ml-6'
                          : isLight
                            ? 'bg-emerald-50/40 border-emerald-200/50 mr-6'
                            : 'bg-emerald-950/20 border-emerald-500/20 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={msg.senderName} isStaff={msg.isStaff} className="w-7 h-7" />
                          <div>
                            <span className={`text-xs font-semibold ${TEXT_MAIN}`}>{msg.senderName}</span>
                            <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded font-medium ${
                              msg.isStaff
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : 'bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/25'
                            }`}>
                              {msg.senderRole}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] ${TEXT_MUTED}`}>{msg.timestamp}</span>
                      </div>
                      <p className={`text-xs leading-relaxed whitespace-pre-line pl-9.5 ${TEXT_MAIN}`}>{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="pt-3 border-t space-y-2" style={{ borderColor: BORDER }}>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={isStaff ? 'Type official staff response to participant...' : 'Type your message or response...'}
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/40 transition-colors ${
                      isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.05] text-white'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <button className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-black/5 text-black/40' : 'hover:bg-white/5 text-white/40'}`} title="Attach document">
                      <Paperclip size={16} />
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all ${
                        replyText.trim() ? 'opacity-100 hover:opacity-90' : 'opacity-40 cursor-not-allowed'
                      }`}
                      style={{ background: GREEN }}
                    >
                      <Send size={13} />
                      Send Response
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[520px] rounded-2xl border flex flex-col items-center justify-center p-8 text-center" style={{ background: BG_PANEL, borderColor: BORDER }}>
                <Ticket size={40} className={`mb-3 ${TEXT_MUTED}`} />
                <h3 className={`text-sm font-bold ${TEXT_MAIN}`}>Select a Support Ticket</h3>
                <p className={`text-xs max-w-xs mt-1 ${TEXT_SUB}`}>Choose a ticket from the left panel to review thread history or send responses</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: INSTANT LIVE CHAT ─────────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl border overflow-hidden grid grid-cols-1 lg:grid-cols-3 h-[580px]" style={{ background: BG_PANEL, borderColor: BORDER }}>
          {/* Chat Sessions Sidebar */}
          <div className="border-r p-4 space-y-3 flex flex-col" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                {isStaff ? 'Active Customer Chats' : 'Support Channels'}
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#00c685]">
                <span className="w-2 h-2 rounded-full bg-[#00c685] animate-pulse" />
                Live Online
              </span>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {chats.map(c => {
                const isActive = c.id === activeChatId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-[#00c685]/15 border border-[#00c685]/30'
                        : isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <UserAvatar name={c.participantName} className="w-9 h-9" />
                      {c.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00c685] border-2 border-white dark:border-[#0d2117]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold truncate ${TEXT_MAIN}`}>{c.participantName}</p>
                        {c.unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#00c685] text-white text-[9px] font-bold flex items-center justify-center">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${TEXT_SUB}`}>{c.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Chat Main Panel */}
          <div className="lg:col-span-2 flex flex-col h-full">
            {/* Active Chat Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-3">
                <UserAvatar name={activeChat.participantName} className="w-9 h-9" />
                <div>
                  <h4 className={`text-xs font-bold ${TEXT_MAIN}`}>{activeChat.participantName}</h4>
                  <p className="text-[10px] text-[#00c685] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
                    {isStaff ? 'Connected via Member App' : 'Takaful Advisor Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${isLight ? 'border-gray-200 text-gray-700' : 'border-white/10 text-white/80'}`}>
                  <Phone size={13} />
                  <span className="hidden sm:inline">Call Back</span>
                </button>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ background: BG_PANEL2 }}>
              {activeChat.messages.map(msg => {
                const isMe = role === 'participant' ? msg.sender === 'user' : msg.sender === 'agent';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      {!isMe && <UserAvatar name={msg.senderName} isStaff={msg.sender === 'agent'} className="w-4 h-4" />}
                      <span className={`text-[10px] font-semibold ${TEXT_MAIN}`}>{msg.senderName}</span>
                      <span className={`text-[9px] ${TEXT_MUTED}`}>• {msg.timestamp}</span>
                      {isMe && <UserAvatar name={msg.senderName} isStaff={msg.sender === 'agent'} className="w-4 h-4" />}
                    </div>
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed transition-all ${
                        isMe
                          ? 'bg-[#00c685] text-white rounded-br-xs shadow-sm font-medium'
                          : isLight
                            ? 'bg-white border border-gray-200/90 text-gray-900 rounded-bl-xs shadow-sm'
                            : 'bg-white/[0.06] border border-white/10 text-white rounded-bl-xs shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Answer Prompt Suggestions (For Participants) */}
            {role === 'participant' && (
              <div className="px-4 py-2 border-t flex items-center gap-2 overflow-x-auto" style={{ borderColor: BORDER }}>
                <span className={`text-[10px] font-semibold whitespace-nowrap ${TEXT_MUTED}`}>Quick topics:</span>
                {[
                  'How to file a claim?',
                  'Direct Debit update',
                  'Coverage inquiry',
                  'Speak to supervisor',
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setChatInput(prompt)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                      isLight ? 'bg-black/5 hover:bg-black/10 text-black/70' : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: BORDER }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/40 transition-colors ${
                  isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.05] text-white'
                }`}
              />
              <button
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim()}
                className={`p-2.5 rounded-xl text-white transition-all ${
                  chatInput.trim() ? 'opacity-100 hover:opacity-90' : 'opacity-40 cursor-not-allowed'
                }`}
                style={{ background: GREEN }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: HELP CENTER & FAQS ────────────────────────────────────── */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* FAQ Search Banner */}
          <div className="p-6 rounded-3xl border text-center space-y-3" style={{ background: BG_PANEL, borderColor: BORDER }}>
            <h2 className={`text-lg font-bold ${TEXT_MAIN}`}>How can we help you today?</h2>
            <p className={`text-xs max-w-md mx-auto ${TEXT_SUB}`}>
              Browse our knowledge base or search for instant answers regarding coverage, claim processing, and Shariah governance.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
              <input
                placeholder="Search articles, claim guides, direct debit help..."
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs focus:outline-none focus:border-[#00c685]/40 ${
                  isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.05] text-white'
                }`}
              />
            </div>
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${TEXT_MUTED}`}>Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQ_ITEMS.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl border space-y-2" style={{ background: BG_PANEL, borderColor: BORDER }}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#00c685]/15 text-[#00c685]">
                      {faq.category}
                    </span>
                    <h4 className={`text-xs font-bold ${TEXT_MAIN}`}>{faq.question}</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${TEXT_SUB}`}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Support Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: BORDER }}>
            <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ background: BG_PANEL, borderColor: BORDER }}>
              <div className="w-10 h-10 rounded-xl bg-[#00c685]/15 text-[#00c685] flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className={`text-xs font-bold ${TEXT_MAIN}`}>Emergency Helpline</p>
                <p className={`text-[11px] ${TEXT_SUB}`}>+44 (0) 800 123 4567</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ background: BG_PANEL, borderColor: BORDER }}>
              <div className="w-10 h-10 rounded-xl bg-[#00c685]/15 text-[#00c685] flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className={`text-xs font-bold ${TEXT_MAIN}`}>Email Support</p>
                <p className={`text-[11px] ${TEXT_SUB}`}>support@takaful.com</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border flex items-center gap-3" style={{ background: BG_PANEL, borderColor: BORDER }}>
              <div className="w-10 h-10 rounded-xl bg-[#00c685]/15 text-[#00c685] flex items-center justify-center shrink-0">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className={`text-xs font-bold ${TEXT_MAIN}`}>WhatsApp Business</p>
                <p className={`text-[11px] ${TEXT_SUB}`}>Instant messaging active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─────────────────────────────────────────── */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[400] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-[#0d2117] border-[#00c685]/40 text-white backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-[#00c685]/20 text-[#00c685] flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="pr-2">
              <p className="text-xs font-bold text-white">Ticket Submitted</p>
              <p className="text-[11px] text-white/70">{successToast}</p>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CREATE TICKET MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col ${
                isLight ? 'bg-white text-black' : 'bg-[#0a1811] text-white'
              }`}
              style={{ borderColor: isLight ? '#E4E7EC' : 'rgba(255,255,255,0.1)' }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{ borderColor: BORDER }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00c685]/15 text-[#00c685] flex items-center justify-center shrink-0 shadow-inner">
                    <Ticket size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Submit Support Ticket</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/20">
                        Shariah Helpdesk
                      </span>
                    </div>
                    <p className={`text-xs ${TEXT_SUB}`}>
                      Our dedicated claims and policy advisors typically respond within 15 minutes.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`p-2 rounded-xl transition-all ${
                    isLight ? 'hover:bg-black/5 text-black/40 hover:text-black' : 'hover:bg-white/10 text-white/40 hover:text-white'
                  }`}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Submitting Context Banner */}
              <div
                className={`px-6 py-2.5 border-b flex items-center justify-between text-xs shrink-0 ${
                  isLight ? 'bg-black/[0.02]' : 'bg-white/[0.02]'
                }`}
                style={{ borderColor: BORDER }}
              >
                <div className="flex items-center gap-2">
                  <UserAvatar name={currentUser.name} isStaff={isStaff} className="w-6 h-6" />
                  <span className={`text-[11px] ${TEXT_SUB}`}>
                    Submitting as <strong className={TEXT_MAIN}>{currentUser.name}</strong> ({currentUser.email})
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00c685]/10 text-[#00c685] font-semibold">
                  ID: {currentUser.participantId ?? 'P-0042'}
                </span>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 1. Category Selection Tiles */}
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                    Select Ticket Category <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'Claim Inquiry', label: 'Claim Inquiry', icon: Shield, desc: 'Damage, loss assessment & surveyor' },
                      { id: 'Contribution', label: 'Contribution / Fee', icon: CreditCard, desc: 'Direct Debit, banking & payments' },
                      { id: 'Certificate', label: 'Certificate / Proof', icon: FileText, desc: 'Mortgage schedule & policy PDF' },
                      { id: 'Technical', label: 'Technical Issue', icon: Wrench, desc: 'Portal login, document upload bugs' },
                      { id: 'General', label: 'General / Shariah', icon: HelpCircle, desc: 'Surplus pool, coverage terms' },
                    ].map(cat => {
                      const Icon = cat.icon;
                      const isSelected = newCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewCategory(cat.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#00c685] bg-[#00c685]/10 ring-1 ring-[#00c685]'
                              : isLight
                              ? 'border-gray-200 hover:border-gray-300 bg-black/[0.01]'
                              : 'border-white/[0.07] hover:border-white/20 bg-white/[0.02]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#00c685] text-white' : 'bg-black/5 dark:bg-white/5 text-gray-400'}`}>
                              <Icon size={14} />
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#00c685] text-white flex items-center justify-center">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${TEXT_MAIN}`}>{cat.label}</p>
                            <p className={`text-[10px] line-clamp-1 mt-0.5 ${TEXT_MUTED}`}>{cat.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Priority & Reference Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Priority Pill Selector */}
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                      Priority Level <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: BORDER }}>
                      {(['Low', 'Medium', 'High', 'Critical'] as const).map(p => {
                        const isSelected = newPriority === p;
                        const colors = {
                          Low: isSelected ? 'bg-emerald-500 text-white' : 'text-emerald-500',
                          Medium: isSelected ? 'bg-amber-500 text-white' : 'text-amber-500',
                          High: isSelected ? 'bg-orange-500 text-white' : 'text-orange-500',
                          Critical: isSelected ? 'bg-red-500 text-white' : 'text-red-500',
                        };
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewPriority(p)}
                            className={`py-1.5 text-center rounded-xl text-[11px] font-bold transition-all ${
                              isSelected
                                ? `${colors[p]} shadow-sm`
                                : isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/60 hover:bg-white/5'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Policy / Claim Reference Input (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider block ${TEXT_MUTED}`}>
                        Related Policy / Claim (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewReference('TK-2024-0042')}
                        className="text-[10px] text-[#00c685] hover:underline"
                      >
                        Auto-fill Active
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newReference}
                      onChange={e => setNewReference(e.target.value)}
                      placeholder="e.g. TK-2024-0042 or CLM-2024-0891"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${
                        isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.06] text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. Subject Input */}
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${TEXT_MUTED}`}>
                    Subject Summary <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    placeholder="e.g. Requesting inspection date confirmation for storm claim"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${
                      isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.06] text-white'
                    }`}
                  />
                </div>

                {/* 4. Detailed Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${TEXT_MUTED}`}>
                      Detailed Inquiry <span className="text-red-400">*</span>
                    </label>
                    <span className={`text-[10px] ${TEXT_MUTED}`}>{newDescription.length} characters</span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    placeholder="Provide full details regarding your question, policy change, or claim inquiry so our specialists can assist accurately..."
                    className={`w-full p-3.5 rounded-2xl border text-xs leading-relaxed focus:outline-none focus:border-[#00c685]/50 transition-colors ${
                      isLight ? 'bg-black/[0.02] border-black/[0.08] text-black' : 'bg-white/[0.04] border-white/[0.06] text-white'
                    }`}
                  />
                </div>

                {/* 5. Attachments Simulation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-[10px] font-bold uppercase tracking-wider block ${TEXT_MUTED}`}>
                      Supporting Documents / Photos (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddMockFile}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#00c685] hover:opacity-80 transition-opacity"
                    >
                      <Plus size={13} />
                      Attach Sample File
                    </button>
                  </div>

                  {attachedFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map(file => (
                        <div
                          key={file}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border bg-[#00c685]/10 border-[#00c685]/30 text-[#00c685]"
                        >
                          <Paperclip size={13} />
                          <span className="font-medium">{file}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file)}
                            className="hover:text-red-400 ml-1 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={handleAddMockFile}
                      className={`p-3 rounded-2xl border border-dashed flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        isLight
                          ? 'border-gray-300 hover:border-[#00c685] bg-black/[0.01]'
                          : 'border-white/10 hover:border-[#00c685]/40 bg-white/[0.01]'
                      }`}
                    >
                      <UploadCloud size={16} className="text-[#00c685]" />
                      <span className={`text-xs ${TEXT_SUB}`}>Click to attach photos, quotes, or PDF certificates</span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div
                  className="flex items-center justify-between pt-3 border-t shrink-0"
                  style={{ borderColor: BORDER }}
                >
                  <p className={`text-[11px] flex items-center gap-1.5 ${TEXT_MUTED}`}>
                    <Clock size={12} />
                    Expected SLA: 15–30 minutes
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/60 hover:bg-white/5'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newSubject.trim() || !newDescription.trim()}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                        isSubmitting || !newSubject.trim() || !newDescription.trim()
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:opacity-90 hover:shadow-lg active:scale-[0.98]'
                      }`}
                      style={{ background: GREEN }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          Submit Ticket
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
