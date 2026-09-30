'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Plus, Search, BookOpen, Clock,
  ArrowRight, Check, Send, Paperclip, ChevronRight, ArrowLeft,
  UserCheck, Shield, HelpCircle, AlertCircle, CheckCircle2,
  Sparkles, X, Trash2
} from 'lucide-react';
import { useTheme } from '@/app/dashboard/ThemeRoleContext';
import { useSupportTickets } from '@/lib/dashboard/ticket-store';
import { DEMO_USERS } from '@/lib/dashboard/mock-data';
import { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from '@/lib/dashboard/types';
import { routeTicket } from '@/lib/dashboard/ticket-routing';
import { SLACountdown } from '@/app/dashboard/support/components/SLACountdown';
import { TicketCreateModal } from '@/app/dashboard/support/components/TicketCreateModal';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.05 } }),
};

function StatusBadge({ status, isLight }: { status: string; isLight: boolean }) {
  const styles: Record<string, string> = {
    Open: isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-500/15 text-blue-400',
    'In Progress': isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/15 text-amber-400',
    Resolved: isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/15 text-emerald-400',
    Closed: isLight ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-white/10 text-white/50',
    Critical: isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-500/15 text-red-400',
    High: isLight ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-orange-500/15 text-orange-400',
    Medium: isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/15 text-amber-400',
    Low: isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/15 text-emerald-400',
  };

  const styleClass = styles[status] || styles.Open;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${styleClass}`}>
      {status}
    </span>
  );
}

const FAQ_ITEMS = [
  {
    category: 'Claims Help',
    question: 'How long does a claim assessment typically take?',
    answer: 'Standard claims under £2,000 are reviewed and authorized within 3 to 5 business days. Structural assessments requiring an on-site loss adjuster visit typically take 7 to 10 days.',
  },
  {
    category: 'Direct Debit & Finance',
    question: 'How do I update my monthly contribution bank account?',
    answer: 'Submit a ticket under "Contribution / Fee" or visit your My Contributions tab. Updates take 2 business days to process before the next billing cycle.',
  },
  {
    category: 'Policy & Schedules',
    question: 'Where can I download my stamped mortgage insurance schedule?',
    answer: 'Your schedule PDF is always available in the My Documents tab. You can also request an updated certificate here and our team will stamp and issue it within 24 hours.',
  },
  {
    category: 'Shariah Tabarru Fund',
    question: 'How is the annual surplus pool distributed?',
    answer: 'At financial year-end, any underwriting surplus remaining after all claims and statutory solvency reserves is returned pro-rata to non-claiming participants under Mudharabah governance.',
  },
];

export default function PortalSupportPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const TEXT_MAIN = isLight ? 'text-gray-900' : 'text-white';
  const TEXT_SUB = isLight ? 'text-gray-600' : 'text-white/60';
  const TEXT_MUTED = isLight ? 'text-gray-400' : 'text-white/40';
  const BORDER = isLight ? 'border-gray-200' : 'border-white/[0.06]';
  const BG_PANEL = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.06]';
  const BG_CARD = isLight ? 'bg-white border-gray-200 hover:border-gray-300 shadow-xs' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14]';
  const BG_INPUT = isLight ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white' : 'bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25 focus:border-[#00c685]/50';

  const currentUser = DEMO_USERS['participant'];
  const { tickets, createTicket, addMessage } = useSupportTickets();

  // Active view: 'tickets' | 'faqs'
  const [activeTab, setActiveTab] = useState<'tickets' | 'faqs'>('tickets');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Modals & form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Participant's tickets only
  const myTickets = useMemo(() => {
    return tickets.filter(
      t => t.participantId === currentUser.participantId || t.participantName === currentUser.name
    );
  }, [tickets, currentUser.participantId, currentUser.name]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return myTickets.filter(t => {
      const matchesSearch =
        !search ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myTickets, search, statusFilter]);

  const activeTicket = myTickets.find(t => t.id === selectedTicketId) || null;

  // Ticket creation handler
  const handleCreateSubmit = (data: {
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
    reference?: string;
    attachments: string[];
  }) => {
    const routing = routeTicket(data.category);
    const newT = createTicket({
      participantId: currentUser.participantId ?? 'P-0042',
      participantName: currentUser.name,
      participantEmail: currentUser.email,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      initialMessage: data.description,
      relatedClaimId: data.reference?.startsWith('CLM') ? data.reference : undefined,
      relatedCertificateId: data.reference?.startsWith('TK') ? data.reference : undefined,
      attachments: data.attachments,
    });

    setSelectedTicketId(newT.id);
    setActiveTab('tickets');
    setSuccessToast(`Ticket #${newT.id} routed to ${routing.routedToRole.replace('_', ' ').toUpperCase()} (${routing.defaultAssignee.split('(')[0].trim()})! Expected reply: within ${routing.slaHours}h.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  // Reply handler
  const handleSendReply = () => {
    if (!replyText.trim() && attachedFiles.length === 0) return;
    if (!activeTicket) return;

    addMessage(activeTicket.id, {
      senderName: currentUser.name,
      senderRole: 'Participant',
      text: replyText.trim(),
      isStaff: false,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
    });

    setReplyText('');
    setAttachedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 font-body transition-colors duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-xl ${
              isLight
                ? 'bg-white text-gray-900 border-[#00c685]'
                : 'bg-black/90 text-white border-[#00c685]/40'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#00c685] flex items-center justify-center text-white shrink-0">
              <Check size={14} strokeWidth={3} />
            </div>
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast(null)} className="ml-2 hover:opacity-80">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${
          isLight
            ? 'bg-gray-50 border-gray-200 text-gray-700'
            : 'bg-white/[0.04] border-white/[0.08] text-white/70'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          Direct Specialist Support
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className={`font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08] ${TEXT_MAIN}`}>
              Support & Helpdesk
            </h1>
            <p className={`mt-2 text-base sm:text-lg leading-relaxed max-w-xl ${TEXT_SUB}`}>
              Submit inquiries or track existing tickets. Every request is routed directly to the right backoffice specialist.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto shadow-sm ${
              isLight ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <Plus size={15} />
            New Ticket
          </button>
        </div>
      </motion.div>

      {/* ── 2. Navigation Pills ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className={`flex items-center gap-1.5 border-b pb-3 ${BORDER}`}>
        {[
          { id: 'tickets', label: `My Tickets (${myTickets.length})`, icon: Ticket },
          { id: 'faqs', label: 'Help & FAQs', icon: BookOpen },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'tickets') setSelectedTicketId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? isLight
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white/[0.08] text-white border border-white/[0.12]'
                  : isLight
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#00c685]' : ''} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* ── 3. Tab: My Tickets ── */}
      {activeTab === 'tickets' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-4">
          {/* Detail View of Selected Ticket */}
          {activeTicket ? (
            <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${BG_PANEL}`}>
              {/* Back button & top metadata */}
              <div className={`flex items-center justify-between gap-3 border-b pb-4 flex-wrap ${BORDER}`}>
                <button
                  onClick={() => setSelectedTicketId(null)}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${TEXT_SUB} hover:${TEXT_MAIN}`}
                >
                  <ArrowLeft size={14} />
                  <span>Back to all tickets</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-xs font-semibold ${TEXT_MUTED}`}>{activeTicket.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${BORDER} ${TEXT_SUB} ${isLight ? 'bg-gray-100' : 'bg-white/[0.04]'}`}>
                    {activeTicket.category}
                  </span>
                  <SLACountdown createdAt={activeTicket.createdAt} slaHours={activeTicket.slaHours} status={activeTicket.status} />
                  <StatusBadge status={activeTicket.status} isLight={isLight} />
                </div>
              </div>

              {/* Title & Submitter */}
              <div>
                <h2 className={`text-xl font-bold ${TEXT_MAIN}`}>{activeTicket.subject}</h2>
                <div className={`flex items-center gap-3 text-xs mt-1.5 flex-wrap ${TEXT_SUB}`}>
                  <span className="flex items-center gap-1.5">
                    <UserCheck size={13} className="text-[#00c685]" />
                    <span>Auto-Assigned: <strong className={TEXT_MAIN}>{activeTicket.assignedTo}</strong></span>
                  </span>
                  <span>•</span>
                  <span>Created {activeTicket.createdAt.split('T')[0] || activeTicket.createdAt}</span>
                  {activeTicket.relatedClaimId && (
                    <>
                      <span>•</span>
                      <span className="text-blue-500">Claim: {activeTicket.relatedClaimId}</span>
                    </>
                  )}
                  {activeTicket.relatedCertificateId && (
                    <>
                      <span>•</span>
                      <span className="text-purple-500">Certificate: {activeTicket.relatedCertificateId}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Discussion Thread */}
              <div className="space-y-3.5 pt-2">
                {activeTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      msg.isStaff
                        ? isLight
                          ? 'bg-blue-50/70 border-blue-200/80 sm:ml-6'
                          : 'bg-blue-500/[0.05] border-blue-500/20 sm:ml-6'
                        : isLight
                        ? 'bg-gray-50 border-gray-200 sm:mr-6'
                        : 'bg-white/[0.02] border-white/[0.06] sm:mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={getDicebearAvatar(msg.senderName, msg.isStaff ? 'initials' : 'female')}
                          alt={msg.senderName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className={`text-xs font-semibold ${TEXT_MAIN}`}>{msg.senderName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            msg.isStaff
                              ? 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
                              : 'bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/20'
                          }`}
                        >
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{msg.timestamp}</span>
                    </div>

                    <p className={`text-xs leading-relaxed whitespace-pre-line pl-8 ${
                      isLight ? 'text-gray-800' : 'text-white/80'
                    }`}>
                      {msg.text}
                    </p>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mt-2 pt-2 border-t pl-8 ${BORDER}`}>
                        {msg.attachments.map(att => (
                          <span
                            key={att}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold border ${
                              isLight
                                ? 'bg-white border-gray-200 text-gray-700'
                                : 'bg-white/[0.04] border-white/[0.08] text-white/70'
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

              {/* Reply Box */}
              <div className={`pt-4 border-t space-y-3 ${BORDER}`}>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the assigned handler..."
                  className={`w-full p-4 rounded-2xl border text-xs focus:outline-none transition-colors ${BG_INPUT}`}
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
                        <button onClick={() => setAttachedFiles(attachedFiles.filter(x => x !== f))} className="hover:text-red-400 ml-1">
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
                      const sample = 'Assessor_Report_Extract.pdf';
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
            <>
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${TEXT_MUTED}`} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by ID or topic…"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${BG_INPUT}`}
                  />
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(s => {
                    const isActive = statusFilter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          isActive
                            ? isLight
                              ? 'bg-gray-900 text-white shadow-xs'
                              : 'bg-[#00c685]/15 text-[#00c685]'
                            : isLight
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tickets List */}
              {filteredTickets.length === 0 ? (
                <div className={`rounded-3xl p-14 text-center border ${BG_PANEL}`}>
                  <Ticket size={36} className={`mx-auto mb-4 ${TEXT_MUTED}`} />
                  <p className={`text-sm font-medium ${TEXT_SUB}`}>
                    {search || statusFilter !== 'All'
                      ? 'No inquiries match your filters.'
                      : 'No support tickets found. Click "New Ticket" to submit an inquiry.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTickets.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group ${BG_CARD}`}
                    >
                      {/* Top row: ID, category tag, SLA, status */}
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <span className={`font-mono text-xs font-semibold ${TEXT_MUTED}`}>{t.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${BORDER} ${TEXT_SUB} ${isLight ? 'bg-gray-100' : 'bg-white/[0.04]'}`}>
                            {t.category}
                          </span>
                          <SLACountdown createdAt={t.createdAt} slaHours={t.slaHours} status={t.status} />
                        </div>
                        <StatusBadge status={t.status} isLight={isLight} />
                      </div>

                      {/* Subject */}
                      <h3 className={`text-base font-semibold group-hover:text-[#00c685] transition-colors ${TEXT_MAIN}`}>
                        {t.subject}
                      </h3>

                      {/* Latest message snippet */}
                      <p className={`text-xs mt-1 line-clamp-1 ${TEXT_SUB}`}>
                        {t.messages[t.messages.length - 1]?.text}
                      </p>

                      {/* Bottom row: Handler info and arrow */}
                      <div className={`flex items-center justify-between gap-4 mt-3 pt-3 border-t text-xs ${
                        isLight ? 'border-gray-100 text-gray-500' : 'border-white/[0.06] text-white/40'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <UserCheck size={13} className="text-[#00c685]" />
                            <span>Auto-Assigned: {t.assignedTo}</span>
                          </span>
                          <span>•</span>
                          <span>Updated {t.lastUpdated}</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium text-xs transition-colors ${
                          isLight ? 'text-gray-700 group-hover:text-black' : 'text-white/60 group-hover:text-white'
                        }`}>
                          <span>View discussion</span>
                          <ChevronRight size={14} className="opacity-40 group-hover:text-[#00c685] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* ── 4. Tab: FAQs ── */}
      {activeTab === 'faqs' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border space-y-2 ${BG_PANEL}`}
            >
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00c685]/10 text-[#00c685] border border-[#00c685]/20">
                {faq.category}
              </span>
              <h3 className={`text-sm font-semibold mt-1 ${TEXT_MAIN}`}>{faq.question}</h3>
              <p className={`text-xs leading-relaxed ${TEXT_SUB}`}>{faq.answer}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Ticket Create Modal (Smart Routing Enabled) */}
      <TicketCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onSubmit={handleCreateSubmit}
        isLight={isLight}
      />
    </div>
  );
}
