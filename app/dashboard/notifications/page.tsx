'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, AlertTriangle, FileText, Shield,
  CreditCard, Users, Info, X, ChevronRight, Filter,
  XCircle, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../ThemeRoleContext';
import { useRole } from '../ThemeRoleContext';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import { HANDLER_NOTIFICATIONS, PARTICIPANT_NOTIFICATIONS } from '@/lib/dashboard/notifications-data';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.06 } }),
};

const HANDLER_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'claim', label: 'Claims' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'payment', label: 'Payments' },
  { key: 'document', label: 'Documents' },
  { key: 'participant', label: 'Participants' },
];

const PARTICIPANT_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'claim', label: 'Claims' },
  { key: 'payment', label: 'Payments' },
  { key: 'document', label: 'Documents' },
  { key: 'certificate', label: 'Certificate' },
];

export default function NotificationsPage() {
  const { theme } = useTheme();
  const { role } = useRole();
  const pathname = usePathname();
  const isLight = theme === 'light';
  const isParticipant = role === 'participant';
  const isPortal = pathname?.startsWith('/portal');

  const BASE_NOTIFICATIONS = isParticipant ? PARTICIPANT_NOTIFICATIONS : HANDLER_NOTIFICATIONS;
  const FILTERS = isParticipant ? PARTICIPANT_FILTERS : HANDLER_FILTERS;

  const [notifications, setNotifications] = useState(BASE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = notifications.filter(n => activeFilter === 'all' || n.type === activeFilter);

  // Dynamic Theme Colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL2 = isLight ? '#F8FAFC' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.05)';

  return (
    <div className="p-4 sm:p-6 space-y-5 w-full transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: GREEN }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
            {isParticipant
              ? 'Your claim updates, messages, and policy alerts'
              : 'System alerts and activity updates across all claims'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="text-xs font-semibold transition-colors shrink-0 px-3 py-1.5 rounded-lg"
            style={{ color: GREEN, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            Mark all read
          </button>
        )}
      </motion.div>

      {/* Participant context banner when in participant role */}
      {isParticipant && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          className="rounded-2xl px-5 py-3.5 flex items-center gap-3 transition-colors duration-200"
          style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}25` }}
        >
          <img
            src={getDicebearAvatar('Omar Hassan', 'male')}
            alt="Omar Hassan"
            className="w-8 h-8 rounded-full object-cover border border-blue-500/30 bg-blue-500/10 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold ${TEXT_MAIN}`}>
              Your assigned handler: <span className="text-blue-500">Omar Hassan</span> · Senior Claims Handler
            </p>
            <p className={`text-[11px] ${TEXT_SUB}`}>
              Notifications below include claim decisions, payment confirmations, and messages from your handler.
            </p>
          </div>
          <Link
            href="/dashboard/claims"
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: GREEN }}
          >
            My Claims
          </Link>
        </motion.div>
      )}

      {/* Filter tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl px-5 py-3 flex overflow-x-auto gap-1 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              activeFilter === f.key ? 'bg-[#00c685]/15 text-[#00c685]' : `${TEXT_SUB} hover:text-[#00c685] hover:bg-black/5 dark:hover:bg-white/5`
            }`}>
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Notification list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl flex flex-col items-center gap-3 py-16 text-center transition-colors duration-200"
              style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
              <Bell size={32} className={TEXT_MUTED} />
              <p className={`text-sm ${TEXT_SUB}`}>No notifications</p>
              <p className={`text-xs ${TEXT_MUTED}`}>You're all caught up!</p>
            </motion.div>
          ) : filtered.map((n, i) => {
            const Icon = n.icon;
            const showAvatar = n.senderName && n.senderName !== 'System';
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -12, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ delay: i * 0.04, layout: { duration: 0.2 } }}
                className={`rounded-2xl transition-all ${!n.read ? '' : 'opacity-60 hover:opacity-100'}`}
                style={{ background: n.read ? BG_PANEL : BG_PANEL2, border: `1px solid ${n.read ? BORDER : `${n.color}20`}` }}
              >
                <Link href={isPortal ? n.link.replace(/^\/dashboard/, '/portal') : n.link} onClick={() => markRead(n.id)} className="flex items-start gap-4 p-4 group">
                  {/* Icon or Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    {showAvatar ? (
                      <img
                        src={getDicebearAvatar(n.senderName || 'System', n.senderGender)}
                        alt={n.senderName || 'Notification'}
                        className="w-8 h-8 rounded-xl object-cover border border-black/10 dark:border-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${n.color}15` }}>
                        <Icon size={15} style={{ color: n.color }} />
                      </div>
                    )}
                    {!n.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#112218]" style={{ background: n.color }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-tight ${n.read ? TEXT_SUB : TEXT_MAIN}`}>{n.title}</p>
                      <button
                        onClick={(e) => { e.preventDefault(); dismiss(n.id); }}
                        className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 ${TEXT_MUTED}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${TEXT_SUB}`}>{n.body}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{n.time}</span>
                      {showAvatar && (
                        <span className={`text-[10px] font-medium ${TEXT_MUTED}`}>
                          from {n.senderName}
                        </span>
                      )}
                      {!n.read && (
                        <button
                          onClick={(e) => { e.preventDefault(); markRead(n.id); }}
                          className="text-[10px] font-semibold transition-colors"
                          style={{ color: n.color }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={14} className={`${TEXT_MUTED} shrink-0 mt-1 transition-transform group-hover:translate-x-0.5`} />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
