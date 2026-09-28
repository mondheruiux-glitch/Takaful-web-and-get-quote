'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell, Check, CheckCheck, ChevronRight, X, Sparkles,
  ExternalLink, Settings,
} from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  NotificationItem,
  PARTICIPANT_NOTIFICATIONS,
  HANDLER_NOTIFICATIONS,
} from '@/lib/dashboard/notifications-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

interface NotificationPopoverProps {
  role?: 'participant' | 'claim_handler' | 'finance' | 'management' | 'super_admin';
  theme?: 'dark' | 'light';
  align?: 'center' | 'end' | 'start';
  className?: string;
}

export function NotificationPopover({
  role = 'participant',
  theme = 'dark',
  align = 'end',
  className = '',
}: NotificationPopoverProps) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith('/portal') || role === 'participant';
  const initialItems = isPortal ? PARTICIPANT_NOTIFICATIONS : HANDLER_NOTIFICATIONS;

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialItems);
  const [filter, setFilter] = useState<'all' | 'unread' | 'claims'>('all');
  const [open, setOpen] = useState(false);

  const isLight = theme === 'light';
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredItems = notifications.filter(item => {
    if (filter === 'unread') return !item.read;
    if (filter === 'claims') return item.type === 'claim';
    return true;
  });

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getCleanLink = (link: string) => {
    if (isPortal) {
      return link.replace(/^\/dashboard/, '/portal');
    }
    return link;
  };

  const viewAllHref = isPortal ? '/portal/notifications' : '/dashboard/notifications';
  const settingsHref = isPortal ? '/portal/settings' : '/dashboard/settings';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications (${unreadCount} unread)`}
          className={`relative p-2 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#00c685]/50 ${open
              ? 'bg-[#00c685]/15 text-[#00c685]'
              : isLight
                ? 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            } ${className}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00c685] ring-2 ring-[#0a1a14] animate-pulse" />
              <span className="sr-only">{unreadCount} unread notifications</span>
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={10}
        showArrow={true}
        className={`w-[360px] sm:w-[410px] p-0 rounded-2xl overflow-hidden shadow-2xl border transition-colors ${isLight
            ? 'bg-white border-gray-200/90 text-gray-900 shadow-black/15'
            : 'bg-[#0b1c15]/98 border-white/10 text-white shadow-black/60 backdrop-blur-2xl'
          }`}
      >
        {/* ─── Header ─── */}
        <div
          className={`p-4 border-b flex items-center justify-between ${isLight ? 'bg-gray-50/80 border-gray-100' : 'bg-white/[0.02] border-white/[0.08]'
            }`}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-semibold text-sm tracking-tight">Notifications</h3>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00c685]/20 text-[#00c685] border border-[#00c685]/30">
                {unreadCount} new
              </span>
            ) : (
              <span className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                All caught up
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-[#00c685] hover:text-[#00e298] transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#00c685]/10"
                title="Mark all as read"
              >
                <CheckCheck size={13} />
                <span>Mark read</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── Filter Tabs ─── */}
        <div
          className={`px-3 py-2 border-b flex items-center gap-1.5 text-xs ${isLight ? 'border-gray-100 bg-white' : 'border-white/[0.06] bg-black/10'
            }`}
        >
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'claims', label: 'Claims', count: notifications.filter(n => n.type === 'claim').length },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${filter === t.id
                  ? 'bg-[#00c685] text-white shadow-sm'
                  : isLight
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* ─── Notifications List ─── */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-white/[0.05]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div
                className={`w-10 h-10 rounded-2xl mx-auto flex items-center justify-center ${isLight ? 'bg-gray-100 text-gray-400' : 'bg-white/5 text-white/40'
                  }`}
              >
                <Sparkles size={18} />
              </div>
              <p className="text-xs font-semibold">No notifications</p>
              <p className={`text-[11px] ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
                {filter === 'unread'
                  ? 'You have read all your notifications'
                  : 'No updates in this category yet'}
              </p>
            </div>
          ) : (
            filteredItems.map(item => {
              const Icon = item.icon;
              const hasAvatar = item.senderName && item.senderName !== 'System';
              const targetUrl = getCleanLink(item.link);

              return (
                <div
                  key={item.id}
                  className={`group relative p-3.5 transition-all flex items-start gap-3 ${!item.read
                      ? isLight
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                        : 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                      : isLight
                        ? 'hover:bg-gray-50'
                        : 'hover:bg-white/[0.03]'
                    }`}
                >
                  {/* Category / Sender Icon */}
                  <div className="relative shrink-0 mt-0.5">
                    {hasAvatar ? (
                      <img
                        src={getDicebearAvatar(item.senderName ?? 'User', item.senderGender)}
                        alt={item.senderName}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        <Icon size={15} />
                      </div>
                    )}
                    {!item.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00c685] ring-2 ring-[#0b1c15]" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <Link
                      href={targetUrl}
                      onClick={() => {
                        setOpen(false);
                        setNotifications(prev =>
                          prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
                        );
                      }}
                      className="block group/link focus:outline-none"
                    >
                      <p
                        className={`text-xs font-semibold leading-tight line-clamp-1 group-hover/link:text-[#00c685] transition-colors ${!item.read
                            ? isLight ? 'text-gray-900 font-bold' : 'text-white font-bold'
                            : isLight ? 'text-gray-700' : 'text-white/80'
                          }`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`text-[11px] mt-1 leading-snug line-clamp-2 ${isLight ? 'text-gray-600' : 'text-white/60'
                          }`}
                      >
                        {item.body}
                      </p>
                    </Link>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                        {item.time}
                      </span>
                      {item.senderName && item.senderName !== 'System' && (
                        <span className={`text-[10px] font-medium ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                          · {item.senderName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Dismiss / Mark read) */}
                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={(e) => markAsRead(item.id, e)}
                        className={`p-1 rounded-md transition-colors ${isLight ? 'text-gray-400 hover:text-[#00c685] hover:bg-black/5' : 'text-white/40 hover:text-[#00c685] hover:bg-white/10'
                          }`}
                        title="Mark as read"
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => dismissNotification(item.id, e)}
                      className={`p-1 rounded-md transition-colors ${isLight ? 'text-gray-400 hover:text-red-500 hover:bg-black/5' : 'text-white/40 hover:text-red-400 hover:bg-white/10'
                        }`}
                      title="Dismiss"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ─── Footer ─── */}
        <div
          className={`p-3 border-t flex items-center justify-between text-xs font-semibold ${isLight ? 'bg-gray-50 border-gray-100' : 'bg-black/20 border-white/[0.08]'
            }`}
        >
          <Link
            href={viewAllHref}
            onClick={() => setOpen(false)}
            className="text-[#00c685] hover:text-[#00e298] transition-colors flex items-center gap-1 group/all"
          >
            <span>View all notifications</span>
            <ChevronRight size={13} className="transition-transform group-hover/all:translate-x-0.5" />
          </Link>

          <Link
            href={settingsHref}
            onClick={() => setOpen(false)}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] ${isLight ? 'text-gray-500 hover:text-gray-800' : 'text-white/50 hover:text-white'
              }`}
            title="Notification Settings"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Preferences</span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
