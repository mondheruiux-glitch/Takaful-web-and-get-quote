'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Send, Paperclip, Check, ChevronRight, Clock,
  Shield, CreditCard, FileText, AlertCircle, CheckCircle2,
  X, Trash2, ArrowUpRight, Zap, CheckCheck
} from 'lucide-react';
import { useTheme, useRole, DashboardRole } from '../../ThemeRoleContext';
import { DEMO_USERS } from '@/lib/dashboard/mock-data';
import { SupportTicket, TicketStatus, UserRole } from '@/lib/dashboard/types';
import { useSupportTickets } from '@/lib/dashboard/ticket-store';
import { filterTicketsForRole, computeSLAStatus, CATEGORY_ROUTING } from '@/lib/dashboard/ticket-routing';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import Link from 'next/link';

const ROLE_TITLES: Record<UserRole, { title: string; subtitle: string; icon: string; autoRoutedDesc: string }> = {
  claim_handler: {
    title: 'Claims Support Inbox',
    subtitle: 'Customer inquiries about damage assessments, repair estimates, and surveyor visits.',
    icon: '🛡️',
    autoRoutedDesc: 'All "Claim Inquiry" tickets are automatically routed here to Omar Hassan.',
  },
  finance: {
    title: 'Finance & Payments Inbox',
    subtitle: 'Customer questions about Direct Debit, bank changes, and contribution payments.',
    icon: '💳',
    autoRoutedDesc: 'All "Contribution" and "Technical" tickets are automatically routed here to Amira Siddiqui & Tariq Malik.',
  },
  management: {
    title: 'Operations & Policy Inbox',
    subtitle: 'Customer requests for mortgage schedules, policy certificates, and Shariah governance.',
    icon: '📋',
    autoRoutedDesc: 'All "Certificate" and "General" tickets are automatically routed here to Ahmed Khan.',
  },
  super_admin: {
    title: 'All Department Support Tickets',
    subtitle: 'Central overview of incoming customer requests across all departments.',
    icon: '⚡',
    autoRoutedDesc: 'Unified view across Claims, Finance, Operations, and Technical queues.',
  },
  participant: {
    title: 'My Support Requests',
    subtitle: 'Your submitted inquiries and requests to the Takaful team.',
    icon: '🎫',
    autoRoutedDesc: 'Your tickets are auto-routed directly to the assigned team specialist.',
  },
};

const QUICK_REPLIES: Record<string, string[]> = {
  claim_handler: [
    'We have received your photos and an independent loss assessor will contact you shortly.',
    'Your repair estimate has been approved and passed to our payouts team.',
    'Please upload your signed contractor quotation so we can proceed with authorization.',
  ],
  finance: [
    'Your Direct Debit mandate has been updated and will take effect from your next billing date.',
    'We have confirmed receipt of your payment. Your coverage remains fully active.',
    'The upload issue on the participant portal has been resolved. Please try submitting again.',
  ],
  management: [
    'Your updated policy certificate PDF has been generated and uploaded to your Documents tab.',
    'Shariah Board governance confirms that surplus distribution is calculated according to Clause 12.1.',
  ],
  super_admin: [
    'This inquiry has been reviewed and forwarded to the senior team for urgent handling.',
  ],
};

function StatusPill({ status, isLight }: { status: TicketStatus; isLight: boolean }) {
  const styles: Record<TicketStatus, { bg: string; text: string; label: string }> = {
    Open: {
      bg: isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/15 border-blue-500/30',
      text: isLight ? 'text-blue-700' : 'text-blue-400',
      label: 'Needs Reply',
    },
    'In Progress': {
      bg: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/15 border-amber-500/30',
      text: isLight ? 'text-amber-700' : 'text-amber-400',
      label: 'In Progress',
    },
    Resolved: {
      bg: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/15 border-emerald-500/30',
      text: isLight ? 'text-emerald-700' : 'text-emerald-400',
      label: 'Resolved',
    },
    Closed: {
      bg: isLight ? 'bg-gray-100 border-gray-200' : 'bg-white/10 border-white/20',
      text: isLight ? 'text-gray-600' : 'text-white/40',
      label: 'Closed',
    },
  };

  const s = styles[status] || styles.Open;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export function SupportPageShell() {
  const { theme } = useTheme();
  const { role } = useRole();
  const isLight = theme === 'light';
  const currentUser = DEMO_USERS[role] || DEMO_USERS['claim_handler'];

  // Style tokens ensuring bulletproof contrast in light and dark modes
  const TEXT_MAIN = isLight ? 'text-gray-900' : 'text-white';
  const TEXT_SUB = isLight ? 'text-gray-600' : 'text-white/60';
  const TEXT_MUTED = isLight ? 'text-gray-500' : 'text-white/40';
  const BG_PANEL = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.06]';
  const BORDER_SUBTLE = isLight ? 'border-gray-100' : 'border-white/[0.06]';
  const BG_INPUT = isLight
    ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#00c685]'
    : 'bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/25 focus:border-[#00c685]/50';

  const { tickets, addMessage, updateStatus } = useSupportTickets();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter tickets that belong to this role's department
  const roleTickets = useMemo(() => {
    return filterTicketsForRole(tickets, role, currentUser.participantId);
  }, [tickets, role, currentUser.participantId]);

  // Search & Status filters
  const visibleTickets = useMemo(() => {
    return roleTickets.filter(t => {
      const matchesSearch =
        !search ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.participantName.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [roleTickets, search, statusFilter]);

  // Active selected ticket
  const selectedTicket = useMemo(() => {
    if (selectedTicketId) {
      const found = visibleTickets.find(t => t.id === selectedTicketId);
      if (found) return found;
    }
    return visibleTickets.length > 0 ? visibleTickets[0] : null;
  }, [visibleTickets, selectedTicketId]);

  // Handle status update
  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    updateStatus(selectedTicket.id, newStatus);
    setToastMessage(`Ticket marked as ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle send reply
  const handleSendReply = () => {
    if (!replyText.trim() && attachedFiles.length === 0) return;
    if (!selectedTicket) return;

    addMessage(selectedTicket.id, {
      senderName: currentUser.name,
      senderRole: currentUser.jobTitle || 'Staff',
      senderUserId: currentUser.id,
      text: replyText.trim(),
      isStaff: true,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
    });

    setReplyText('');
    setAttachedFiles([]);
    setToastMessage(`Reply sent to ${selectedTicket.participantName}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const roleInfo = ROLE_TITLES[role] || ROLE_TITLES.claim_handler;

  // Counters
  const needsReplyCount = roleTickets.filter(t => t.status === 'Open').length;
  const inProgressCount = roleTickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = roleTickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="p-6 sm:p-8 lg:p-10 xl:p-12 space-y-6 max-w-7xl mx-auto font-body transition-colors duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-xl ${
              isLight
                ? 'bg-white text-gray-900 border-[#00c685]'
                : 'bg-black/95 text-white border-[#00c685]/50'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#00c685] flex items-center justify-center text-white shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Clean Staff Header with Auto-Routing Info ── */}
      <div className={`p-6 sm:p-7 rounded-3xl border ${BG_PANEL}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-2xl">{roleInfo.icon}</span>
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${TEXT_MAIN}`}>
                {roleInfo.title}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/30'
              }`}>
                <Zap size={10} className="fill-current" />
                <span>Auto-Routed</span>
              </span>
            </div>
            <p className={`text-xs sm:text-sm ${TEXT_SUB} max-w-2xl`}>
              {roleInfo.subtitle}
            </p>
            <p className={`text-[11px] mt-1.5 flex items-center gap-1.5 ${TEXT_MUTED}`}>
              <CheckCheck size={13} className="text-[#00c685]" />
              <span>{roleInfo.autoRoutedDesc}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {role === 'participant' ? (
              <Link
                href="/portal/support"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all ${
                  isLight ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-gray-900 hover:opacity-90'
                }`}
              >
                <span>Open Participant Portal</span>
                <ArrowUpRight size={14} />
              </Link>
            ) : (
              <div className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-full border ${
                isLight ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white/[0.03] border-white/[0.06] text-white/70'
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#00c685]" />
                <span>
                  Logged in as <strong className={TEXT_MAIN}>{currentUser.name}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className={`flex items-center gap-2 mt-5 pt-4 border-t ${BORDER_SUBTLE} flex-wrap`}>
          <span className={`text-xs font-medium ${TEXT_MUTED} mr-1`}>Filter queue:</span>
          {[
            { id: 'All', label: `All Tickets (${roleTickets.length})` },
            { id: 'Open', label: `Needs Reply (${needsReplyCount})` },
            { id: 'In Progress', label: `In Progress (${inProgressCount})` },
            { id: 'Resolved', label: `Resolved (${resolvedCount})` },
          ].map(f => {
            const isActive = statusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? isLight
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-white/[0.12] text-white border border-white/[0.18]'
                    : isLight
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Two-Column Support Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Incoming Tickets List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by customer name, topic, or ID…"
              className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border text-xs focus:outline-none transition-colors shadow-xs ${BG_INPUT}`}
            />
          </div>

          {/* List of Tickets */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {visibleTickets.length === 0 ? (
              <div className={`p-10 rounded-2xl border text-center ${BG_PANEL}`}>
                <p className={`text-xs font-semibold ${TEXT_MAIN}`}>No tickets found</p>
                <p className={`text-[11px] ${TEXT_MUTED} mt-1`}>
                  {search ? 'Try clearing your search query.' : 'There are no customer tickets in this queue.'}
                </p>
              </div>
            ) : (
              visibleTickets.map(t => {
                const isSelected = selectedTicket?.id === t.id;
                const sla = computeSLAStatus(t.createdAt, t.slaHours);
                const isOverdue = sla.label === 'BREACHED';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-emerald-50/80 border-[#00c685] shadow-xs'
                          : 'bg-white/[0.06] border-[#00c685]/60 shadow-sm'
                        : isLight
                        ? 'bg-white border-gray-200 hover:border-gray-300'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={getDicebearAvatar(t.participantName, 'bottts')}
                          alt=""
                          className={`w-5 h-5 rounded-full shrink-0 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}
                        />
                        <span className={`text-xs font-bold truncate ${TEXT_MAIN}`}>
                          {t.participantName}
                        </span>
                      </div>
                      <StatusPill status={t.status} isLight={isLight} />
                    </div>

                    <h3 className={`text-xs font-semibold line-clamp-1 mb-1 ${TEXT_MAIN}`}>
                      {t.subject}
                    </h3>

                    <p className={`text-[11px] line-clamp-1 mb-2.5 ${TEXT_SUB}`}>
                      {t.messages[t.messages.length - 1]?.text}
                    </p>

                    <div className={`flex items-center justify-between gap-2 pt-2 border-t ${BORDER_SUBTLE} text-[10px] ${TEXT_MUTED}`}>
                      <span className="font-mono">{t.id}</span>

                      {t.status !== 'Resolved' && t.status !== 'Closed' && (
                        <span className={`flex items-center gap-1 font-semibold ${
                          isOverdue ? 'text-red-500' : isLight ? 'text-gray-600' : 'text-white/60'
                        }`}>
                          <Clock size={10} />
                          <span>{isOverdue ? 'Overdue' : `${Math.max(1, Math.round(sla.hoursLeft))}h left`}</span>
                        </span>
                      )}

                      <span>{t.lastUpdated}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Ticket Conversation (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className={`rounded-3xl border p-6 space-y-5 min-h-[620px] flex flex-col justify-between ${BG_PANEL}`}>
              <div>
                {/* Header: Customer info & Status control */}
                <div className={`border-b pb-4 space-y-3 ${BORDER_SUBTLE}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={getDicebearAvatar(selectedTicket.participantName, 'bottts')}
                        alt=""
                        className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className={`text-base font-bold ${TEXT_MAIN}`}>
                            {selectedTicket.participantName}
                          </h2>
                          <span className={`font-mono text-xs ${TEXT_MUTED}`}>
                            {selectedTicket.id}
                          </span>
                        </div>
                        <p className={`text-xs ${TEXT_SUB}`}>
                          {selectedTicket.participantEmail}
                        </p>
                      </div>
                    </div>

                    {/* Status selector */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border ${
                        isLight ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white/[0.03] border-white/[0.08] text-white/70'
                      }`}>
                        <span className={`font-medium ${TEXT_MUTED}`}>Status:</span>
                        <select
                          value={selectedTicket.status}
                          onChange={e => handleStatusChange(e.target.value as TicketStatus)}
                          className={`font-semibold focus:outline-none cursor-pointer bg-transparent ${TEXT_MAIN}`}
                        >
                          <option value="Open" className={isLight ? 'bg-white text-gray-900' : 'bg-[#0a120e] text-white'}>Needs Reply</option>
                          <option value="In Progress" className={isLight ? 'bg-white text-gray-900' : 'bg-[#0a120e] text-white'}>In Progress</option>
                          <option value="Resolved" className={isLight ? 'bg-white text-gray-900' : 'bg-[#0a120e] text-white'}>Resolved</option>
                          <option value="Closed" className={isLight ? 'bg-white text-gray-900' : 'bg-[#0a120e] text-white'}>Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Subject line & Auto-Assignment Info */}
                  <div>
                    <h3 className={`text-base font-semibold mt-2 ${TEXT_MAIN}`}>
                      {selectedTicket.subject}
                    </h3>

                    <div className={`flex items-center gap-3 text-xs mt-2 flex-wrap ${TEXT_SUB}`}>
                      {/* Topic Pill */}
                      <span className={`px-2.5 py-0.5 rounded-md font-medium ${
                        isLight ? 'bg-gray-100 text-gray-700' : 'bg-white/[0.05] text-white/70'
                      }`}>
                        Topic: {selectedTicket.category}
                      </span>

                      {/* Auto-Assigned Specialist badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold ${
                        isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      }`}>
                        <Zap size={11} className="fill-current text-[#00c685]" />
                        <span>Auto-Assigned: {selectedTicket.assignedTo}</span>
                      </span>

                      {selectedTicket.relatedClaimId && (
                        <span className={`px-2 py-0.5 rounded border font-medium ${
                          isLight ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                        }`}>
                          Related Claim: {selectedTicket.relatedClaimId}
                        </span>
                      )}

                      {selectedTicket.relatedCertificateId && (
                        <span className={`px-2 py-0.5 rounded border font-medium ${
                          isLight ? 'text-purple-600 bg-purple-50 border-purple-200' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                        }`}>
                          Policy ID: {selectedTicket.relatedCertificateId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="space-y-3.5 py-4 max-h-[380px] overflow-y-auto pr-1">
                  {selectedTicket.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        msg.isStaff
                          ? isLight
                            ? 'bg-blue-50/80 border-blue-200 text-gray-900 ml-6'
                            : 'bg-blue-500/[0.06] border-blue-500/20 text-white/90 ml-6'
                          : isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 mr-6'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/90 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${TEXT_MAIN}`}>
                            {msg.senderName}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              msg.isStaff
                                ? isLight
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                : 'bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/20'
                            }`}
                          >
                            {msg.senderRole}
                          </span>
                        </div>
                        <span className={`text-[10px] ${TEXT_MUTED}`}>{msg.timestamp}</span>
                      </div>

                      <p className={`text-xs leading-relaxed whitespace-pre-line ${
                        isLight ? 'text-gray-800' : 'text-white/80'
                      }`}>
                        {msg.text}
                      </p>

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mt-2 pt-2 border-t ${BORDER_SUBTLE}`}>
                          {msg.attachments.map(att => (
                            <span
                              key={att}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold border ${
                                isLight ? 'bg-white border-gray-200 text-gray-700' : 'bg-white/[0.04] border-white/[0.08] text-white/70'
                              }`}
                            >
                              <Paperclip size={10} className="text-[#00c685]" />
                              <span>{att}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Section */}
              <div className={`pt-3 border-t space-y-3 ${BORDER_SUBTLE}`}>
                {/* Quick reply templates */}
                {QUICK_REPLIES[role] && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className={`text-[10px] ${TEXT_MUTED} shrink-0`}>Quick reply:</span>
                    {QUICK_REPLIES[role].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyText(q)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                          isLight
                            ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {q.slice(0, 36)}...
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${selectedTicket.participantName}...`}
                  className={`w-full p-3.5 rounded-2xl border text-xs focus:outline-none transition-colors ${BG_INPUT}`}
                />

                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map(f => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] bg-[#00c685]/10 border border-[#00c685]/20 text-[#00c685]"
                      >
                        <Paperclip size={11} />
                        <span>{f}</span>
                        <button
                          onClick={() => setAttachedFiles(attachedFiles.filter(x => x !== f))}
                          className="hover:text-red-500 ml-1"
                        >
                          <Trash2 size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const sample = 'Official_Takaful_Notice.pdf';
                      if (!attachedFiles.includes(sample)) setAttachedFiles([...attachedFiles, sample]);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                      isLight ? 'text-gray-600 hover:text-gray-900' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <Paperclip size={13} className="text-[#00c685]" />
                    <span>Attach document</span>
                  </button>

                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() && attachedFiles.length === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                      isLight
                        ? 'bg-gray-900 text-white hover:bg-black disabled:opacity-30'
                        : 'bg-white text-gray-900 hover:opacity-85 disabled:opacity-30'
                    } disabled:cursor-not-allowed`}
                  >
                    <Send size={13} />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-3xl border p-12 text-center min-h-[400px] flex flex-col items-center justify-center ${BG_PANEL}`}>
              <p className={`text-sm font-semibold ${TEXT_MAIN}`}>No ticket selected</p>
              <p className={`text-xs ${TEXT_MUTED} mt-1`}>
                Choose a customer ticket from the list on the left to review and respond.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
