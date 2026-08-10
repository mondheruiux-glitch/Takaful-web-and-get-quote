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
  { href: '/dashboard/notifications',  label: 'Notifications',     icon: Bell, badge: 2 },
  { href: '/dashboard/settings',       label: 'Settings',          icon: Settings },
];

const CLAIM_HANDLER_NAV: NavItem[] = [
  { href: '/dashboard',                label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/queue',          label: 'My Queue',          icon: ClipboardList, badge: 8 },
  { href: '/dashboard/claims',         label: 'All Claims',        icon: FileText },
  { href: '/dashboard/participants',   label: 'Participants',      icon: Users },
  { href: '/dashboard/documents',      label: 'Documents',         icon: Folder },
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
  const SIDEBAR_BG = theme === 'light' ? '#f4f6f5' : '#061510';
  const BORDER = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';

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
        <div className="flex items-center justify-between px-5 py-5 shrink-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: GREEN }}>
              T
            </div>
            <span className={`font-bold tracking-tight text-lg ${theme === 'light' ? 'text-[#061510]' : 'text-white'}`}>Takaful UK</span>
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
                    ? 'bg-[#00c685]/15 text-[#00c685]'
                    : theme === 'light' ? 'text-black/60 hover:text-[#00c685] hover:bg-[#00c685]/5' : 'text-white/55 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={17} className={active ? 'text-[#00c685]' : theme === 'light' ? 'text-black/40 group-hover:text-[#00c685]/80' : 'text-white/40 group-hover:text-white/70'} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-white bg-[#00c685]">
                    {item.badge}
                  </span>
                ) : null}
                {active && <ChevronRight size={13} className="text-[#00c685]/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: GREEN }}>
              {user?.initials ?? 'UK'}
            </div>
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

  const crumb = pathname.replace('/dashboard', '').replace(/^\//, '').split('/')[0];
  const pageTitle = crumb
    ? crumb.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Overview';

  const GREEN = '#00c685';
  const BORDER = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_COLOR = theme === 'light' ? '#ffffff' : '#0a1a14';
  const SURFACE_COLOR = theme === 'light' ? '#f4f6f5' : '#0d2117';

  const user = DEMO_USERS[role];

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
              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl overflow-hidden z-50 shadow-2xl"
              style={{ background: SURFACE_COLOR, border: `1px solid ${BORDER}` }}
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

      {/* Profile avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer" style={{ background: GREEN }}>
        {user?.initials ?? 'UK'}
      </div>
    </header>
  );
}

/* ─── Dashboard Layout ───────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<DashboardRole>('management');
  const [theme, setTheme] = useState<ThemeMode>('light');

  const BG_COLOR = theme === 'light' ? '#fcfdfd' : '#0a1a14';

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
