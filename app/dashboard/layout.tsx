'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Shield, FileText, PieChart, CreditCard,
  Folder, Bell, Settings, ChevronDown, Menu, X, LogOut,
  Users, ChevronRight, TrendingUp, Sun, Moon,
  ClipboardList, Banknote, ArrowLeftRight, BarChart3,
  ShieldAlert, Home, HelpCircle,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import { RoleContext, ThemeContext, useRole, useTheme, ThemeMode, DashboardRole } from './ThemeRoleContext';

/* ─── Nav item type ──────────────────────────────────────────────────────── */
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

/* ─── Role-specific nav arrays ───────────────────────────────────────────── */
const PARTICIPANT_NAV: NavItem[] = [
  { href: '/dashboard',                label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/my-cover',       label: 'My Cover',          icon: Home },
  { href: '/dashboard/contributions',  label: 'My Contributions',  icon: CreditCard },
  { href: '/dashboard/claims',         label: 'My Claims',         icon: FileText },
  { href: '/dashboard/documents',      label: 'My Documents',      icon: Folder },
  { href: '/dashboard/pool',           label: 'Takaful Pool',      icon: PieChart },
  { href: '/dashboard/support',        label: 'Support & Chat',    icon: HelpCircle, badge: 1 },
  { href: '/dashboard/notifications',  label: 'Notifications',     icon: Bell, badge: 2 },
  { href: '/dashboard/settings',       label: 'Settings',          icon: Settings },
];

const CLAIM_HANDLER_NAV: NavItem[] = [
  { href: '/dashboard',                label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/queue',          label: 'My Queue',          icon: ClipboardList, badge: 8 },
  { href: '/dashboard/claims',         label: 'All Claims',        icon: FileText },
  { href: '/dashboard/participants',   label: 'Participants',      icon: Users },
  { href: '/dashboard/documents',      label: 'Documents',         icon: Folder },
  { href: '/dashboard/support',        label: 'Support Tickets',   icon: HelpCircle, badge: 3 },
  { href: '/dashboard/notifications',  label: 'Notifications',     icon: Bell, badge: 4 },
  { href: '/dashboard/settings',       label: 'Settings',          icon: Settings },
];

const FINANCE_NAV: NavItem[] = [
  { href: '/dashboard',                label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/pool',           label: 'Takaful Pool',      icon: PieChart },
  { href: '/dashboard/contributions',  label: 'Contributions',     icon: CreditCard },
  { href: '/dashboard/claims-payments',label: 'Claims Payments',   icon: Banknote, badge: 3 },
  { href: '/dashboard/transactions',   label: 'Transactions',      icon: ArrowLeftRight },
  { href: '/dashboard/documents',      label: 'Documents',         icon: Folder },
  { href: '/dashboard/support',        label: 'Support Tickets',   icon: HelpCircle, badge: 1 },
  { href: '/dashboard/notifications',  label: 'Notifications',     icon: Bell, badge: 2 },
  { href: '/dashboard/settings',       label: 'Settings',          icon: Settings },
];

const MANAGEMENT_NAV: NavItem[] = [
  { href: '/dashboard',                label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/participants',   label: 'Participants',      icon: Users },
  { href: '/dashboard/certificates',   label: 'Certificates',      icon: Shield },
  { href: '/dashboard/claims',         label: 'Claims',            icon: FileText },
  { href: '/dashboard/pool',           label: 'Takaful Pool',      icon: PieChart },
  { href: '/dashboard/contributions',  label: 'Contributions',     icon: TrendingUp },
  { href: '/dashboard/risk',           label: 'Risk',              icon: ShieldAlert },
  { href: '/dashboard/documents',      label: 'Documents',         icon: Folder },
  { href: '/dashboard/support',        label: 'Support Desk',      icon: HelpCircle, badge: 4 },
  { href: '/dashboard/notifications',  label: 'Notifications',     icon: Bell, badge: 6 },
  { href: '/dashboard/settings',       label: 'Settings',          icon: Settings },
];

const NAV_BY_ROLE: Record<DashboardRole, NavItem[]> = {
  participant:   PARTICIPANT_NAV,
  claim_handler: CLAIM_HANDLER_NAV,
  finance:       FINANCE_NAV,
  management:    MANAGEMENT_NAV,
};

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const { theme } = useTheme();

  const navItems = NAV_BY_ROLE[role];
  const user = DEMO_USERS[role];

  const GREEN = '#00c685';
  const SIDEBAR_BG = theme === 'light' ? '#ffffff' : '#061510';
  const BORDER = theme === 'light' ? '#E4E7EC' : 'rgba(255,255,255,0.05)';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[199] md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={`
          fixed top-0 left-0 h-full z-[200] flex flex-col
          w-[260px] md:translate-x-0 md:static md:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300
        `}
        style={{ background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}` }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={theme === 'light' ? '/brand/logo-dark.png' : '/brand/logo-light.png'} alt="Takaful UK" className="h-7 w-auto" />
          </Link>
          <button onClick={onClose} className={`md:hidden p-1.5 rounded-lg ${theme === 'light' ? 'text-black/40 hover:text-black hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? theme === 'light'
                      ? 'bg-[#00c685]/12 text-gray-900 font-semibold'
                      : 'bg-[#00c685]/12 text-[#00c685] font-semibold'
                    : theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-[#00c685]/10' : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon size={17} className={active ? 'text-[#00c685]' : theme === 'light' ? 'text-gray-400 group-hover:text-gray-700' : 'text-white/40 group-hover:text-white/80'} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-white bg-[#00c685]">
                    {item.badge}
                  </span>
                ) : null}
                {active && <ChevronRight size={13} className="text-[#00c685]" />}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}>
            <img
              src={getDicebearAvatar(user?.name ?? 'User', user?.gender)}
              alt={user?.name ?? 'User'}
              className="w-8 h-8 rounded-full object-cover border shrink-0 bg-gray-100"
              style={{ borderColor: BORDER }}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${theme === 'light' ? 'text-black/85' : 'text-white'}`}>{user?.name ?? 'User'}</p>
              <p className={`text-[10px] truncate ${theme === 'light' ? 'text-black/40' : 'text-white/35'}`}>
                {user?.role === 'participant' ? `Certificate: ${user.certificateId}` : user?.jobTitle}
              </p>
            </div>
            <LogOut size={14} className={`shrink-0 ${theme === 'light' ? 'text-black/35 hover:text-black/70' : 'text-white/30 hover:text-white/70'}`} />
          </div>
        </div>
      </motion.aside>
    </>
  );
}


/* ─── Top Bar ─────────────────────────────────────────────────────────────── */
const ROLE_LABELS: Record<DashboardRole, string> = {
  participant:   'Participant',
  claim_handler: 'Claim Handler',
  finance:       'Finance Team',
  management:    'Management',
};

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const { theme, setTheme } = useTheme();
  const [roleOpen, setRoleOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const crumb = pathname.replace('/dashboard', '').replace(/^\//, '').split('/')[0];
  const pageTitle = crumb
    ? crumb.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Overview';

  const GREEN = '#00c685';
  const BORDER = theme === 'light' ? '#E4E7EC' : 'rgba(255,255,255,0.05)';
  const BG_COLOR = theme === 'light' ? '#ffffff' : '#0a1a14';
  const SURFACE_COLOR = theme === 'light' ? '#ffffff' : '#0d2117';

  const user = DEMO_USERS[role];
  const avatarSrc = getDicebearAvatar(user?.name ?? 'User', user?.gender);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  return (
    <header
      className="sticky top-0 z-[100] flex items-center gap-4 px-4 sm:px-6 h-14 shrink-0 transition-colors duration-200"
      style={{ background: BG_COLOR, borderBottom: `1px solid ${BORDER}` }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className={`md:hidden p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-black/50 hover:text-black hover:bg-black/5' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className={theme === 'light' ? 'text-black/40' : 'text-white/35'}>Dashboard</span>
        {pageTitle !== 'Overview' && (
          <>
            <ChevronRight size={13} className={theme === 'light' ? 'text-black/30' : 'text-white/25'} />
            <span className={`font-medium ${theme === 'light' ? 'text-black/80' : 'text-white/80'}`}>{pageTitle}</span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'text-black/50 hover:text-[#00c685] hover:bg-black/5' : 'text-white/50 hover:text-[#00c685] hover:bg-white/5'}`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Role switcher — demo only */}
      <div className="relative">
        <button
          onClick={() => setRoleOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all"
          style={{ borderColor: `${GREEN}40`, background: `${GREEN}10`, color: GREEN }}
        >
          <span className="hidden sm:inline">Role:</span>
          {ROLE_LABELS[role]}
          <ChevronDown size={12} />
        </button>
        <AnimatePresence>
          {roleOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl overflow-hidden z-50"
              style={{ background: SURFACE_COLOR, border: `1px solid ${BORDER}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            >
              {(Object.keys(ROLE_LABELS) as DashboardRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors ${role === r ? 'text-[#00c685] bg-[#00c685]/10' : theme === 'light' ? 'text-black/70 hover:bg-black/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <Link href="/dashboard/notifications" className={`relative p-2 rounded-xl transition-colors ${theme === 'light' ? 'text-black/50 hover:text-black hover:bg-black/5' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00c685]" />
      </Link>

      {/* Profile avatar + dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(v => !v)}
          className="flex items-center gap-2 rounded-full transition-all hover:opacity-90 focus:outline-none"
          aria-label="Open profile menu"
        >
          <img
            src={avatarSrc}
            alt={user?.name ?? 'User'}
            className="w-8 h-8 rounded-full object-cover border-2"
            style={{ borderColor: profileOpen ? GREEN : BORDER }}
          />
          <span className={`hidden sm:block text-xs font-semibold ${theme === 'light' ? 'text-black/80' : 'text-white/80'}`}>
            {user?.name?.split(' ')[0] ?? 'User'}
          </span>
          <ChevronDown size={12} className={`hidden sm:block ${theme === 'light' ? 'text-black/40' : 'text-white/35'} ${profileOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50"
              style={{
                background: SURFACE_COLOR,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
              }}
            >
              {/* User identity header */}
              <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <p className={`text-sm font-bold leading-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {user?.name ?? 'User'}
                </p>
                <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-gray-400' : 'text-white/40'}`}>
                  {user?.email ?? ''}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {[
                  { icon: Settings,    label: 'Settings',  href: '/dashboard/settings' },
                  { icon: HelpCircle,  label: 'Support Desk', href: '/dashboard/support' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors ${
                        theme === 'light'
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-white/60'}`}>
                        <Icon size={15} />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Sign out */}
              <div style={{ borderTop: `1px solid ${BORDER}` }} className="py-2">
                <button
                  onClick={() => { setProfileOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-white/60'}`}>
                    <LogOut size={15} />
                  </span>
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}


/* ─── Dashboard Layout ───────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<DashboardRole>('management');
  const [theme, setTheme] = useState<ThemeMode>('light');

  const BG_COLOR = theme === 'light' ? '#F9FAFB' : '#0a1a14';

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <RoleContext.Provider value={{ role, setRole }}>
        <div className={`flex h-screen overflow-hidden transition-colors duration-200`} style={{ background: BG_COLOR, fontFamily: "'Inter', sans-serif" }}>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopBar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </RoleContext.Provider>
    </ThemeContext.Provider>
  );
}
