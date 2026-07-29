'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, AlertTriangle, FileText, Shield,
  CreditCard, Users, Info, X, ChevronRight, Filter,
} from 'lucide-react';
import { useTheme } from '../layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.06 } }),
};

const NOTIFICATIONS = [
  { id: 'N-001', type: 'claim', icon: FileText, color: '#3b82f6', title: 'New claim submitted', body: 'Hassan Mahmoud submitted claim CLM-2024-0890 for £1,850 (Contents).', time: '2 minutes ago', read: false, link: '/dashboard/claims/CLM-2024-0890' },
  { id: 'N-002', type: 'claim', icon: CheckCircle2, color: '#00c685', title: 'Claim approved', body: 'Claim CLM-2024-0889 for Aisha Okonkwo has been approved. Payment of £7,200 is being processed.', time: '18 minutes ago', read: false, link: '/dashboard/claims/CLM-2024-0889' },
  { id: 'N-003', type: 'document', icon: AlertTriangle, color: '#f59e0b', title: 'Documents required', body: 'Claim CLM-2024-0890 requires additional documents. 3 items outstanding.', time: '1 hour ago', read: false, link: '/dashboard/claims/CLM-2024-0890' },
  { id: 'N-004', type: 'certificate', icon: Shield, color: '#8b5cf6', title: 'Certificate expiring soon', body: 'Certificate TK-2024-0098 (Maryam Patel) expires in 14 days on 12 Aug 2026. Renewal action required.', time: '2 hours ago', read: false, link: '/dashboard/certificates' },
  { id: 'N-005', type: 'payment', icon: CreditCard, color: '#ef4444', title: 'Direct debit failed', body: 'Contribution collection failed for Maryam Patel (TK-2024-0098). Amount: £18.90. Retry scheduled.', time: '4 hours ago', read: false, link: '/dashboard/contributions' },
  { id: 'N-006', type: 'participant', icon: Users, color: '#ec4899', title: 'New applications received', body: '3 new participant applications are pending review. 2 require identity verification.', time: '6 hours ago', read: true, link: '/dashboard/participants' },
  { id: 'N-007', type: 'pool', icon: Info, color: '#00c685', title: 'Pool monthly summary', body: 'July 2026 pool summary: £61,400 collected, £18,900 in claims. Pool balance: £482,150. Full report available.', time: '1 day ago', read: true, link: '/dashboard/pool' },
  { id: 'N-008', type: 'claim', icon: FileText, color: '#3b82f6', title: 'Assessor report received', body: 'Assessor report for CLM-2024-0891 (Fatima Al-Rashid) has been received and is ready for review.', time: '1 day ago', read: true, link: '/dashboard/claims/CLM-2024-0891' },
  { id: 'N-009', type: 'payment', icon: CheckCircle2, color: '#00c685', title: 'Claim payment processed', body: 'Payment of £2,100 for claim CLM-2024-0888 (Yusuf Ibrahim) has been transferred to their account.', time: '2 days ago', read: true, link: '/dashboard/claims/CLM-2024-0888' },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'claim', label: 'Claims' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'payment', label: 'Payments' },
  { key: 'document', label: 'Documents' },
  { key: 'participant', label: 'Participants' },
];

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = notifications.filter(n => activeFilter === 'all' || n.type === activeFilter);

  // Dynamic Theme Colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL2 = isLight ? '#f4f6f5' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-3xl transition-colors duration-200">
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
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>System alerts and activity updates</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="text-xs font-semibold transition-colors shrink-0 px-3 py-1.5 rounded-lg"
            style={{ color: GREEN, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            Mark all read
          </button>
        )}
      </motion.div>

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
                <div className="flex items-start gap-4 p-4">
                  {/* Unread dot */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${n.color}15` }}>
                      <Icon size={15} style={{ color: n.color }} />
                    </div>
                    {!n.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#112218]" style={{ background: n.color }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-tight ${n.read ? TEXT_SUB : TEXT_MAIN}`}>{n.title}</p>
                      <button onClick={() => dismiss(n.id)} className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 ${TEXT_MUTED}`}>
                        <X size={12} />
                      </button>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${TEXT_SUB}`}>{n.body}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className={`text-[10px] ${TEXT_MUTED}`}>{n.time}</span>
                      {!n.read && (
                        <button onClick={() => markRead(n.id)} className="text-[10px] font-semibold transition-colors" style={{ color: n.color }}>
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={14} className={`${TEXT_MUTED} shrink-0 mt-1`} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
