'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Shield, FileText, PieChart, CreditCard,
  Folder, Bell, Settings, ChevronDown, Menu, X, LogOut,
  User, ChevronRight, Search, TrendingUp, Users, AlertCircle,
} from 'lucide-react';

/* ─── Design tokens ─────────────────────────────────────────────────── */
const GREEN = '#00c685';
const BG_DARK = '#0a1a14';
const SIDEBAR_BG = '#061510';
const SURFACE = '#0d2117';
const BORDER = 'rgba(255,255,255,0.07)';

/* ─── Role Context ───────────────────────────────────────────────────── */
export type DashboardRole = 'participant' | 'claims' | 'finance' | 'management';

interface RoleContextValue {
  role: DashboardRole;
  setRole: (r: DashboardRole) => void;
}

export const RoleContext = createContext<RoleContextValue>({
  role: 'management',
  setRole: () => {},
});

export const useRole = () => useContext(RoleContext);

/* ─── Nav items by role ──────────────────────────────────────────────── */
const ALL_NAV = [
  { href: '/dashboard',              label: 'Overview',        icon: LayoutDashboard, roles: ['participant','claims','finance','management'] },
  { href: '/dashboard/certificates', label: 'Certificates',    icon: Shield,           roles: ['participant','claims','management'] },
  { href: '/dashboard/claims',       label: 'Claims',          icon: FileText,         roles: ['participant','claims','management'] },
  { href: '/dashboard/pool',         label: 'Takaful Pool',    icon: PieChart,         roles: ['participant','finance','management'] },
  { href: '/dashboard/contributions',label: 'Contributions',   icon: CreditCard,       roles: ['participant','finance','management'] },
  { href: '/dashboard/participants', label: 'Participants',    icon: Users,            roles: ['claims','management'] },
  { href: '/dashboard/documents',    label: 'Documents',       icon: Folder,           roles: ['participant','claims','management'] },
  { href: '/dashboard/notifications',label: 'Notifications',   icon: Bell,             roles: ['participant','claims','finance','management'], badge: 4 },
  { href: '/dashboard/settings',     label: 'Settings',        icon: Settings,         roles: ['participant','claims','finance','management'] },
] as const;

/* ─── Sidebar ────────────────────────────────────────────────────────── */
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  
  const navItems = ALL_NAV.filter(n => (n.roles as readonly string[]).includes(role));

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
            <img src="/logo-light.png" alt="Takaful" className="h-6" />
          </Link>
          <button onClick={onClose} className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5">
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
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={17} className={active ? 'text-[#00c685]' : 'text-white/40 group-hover:text-white/70'} />
                <span className="flex-1">{item.label}</span>
                {'badge' in item && item.badge ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-[#0a1a14] bg-[#00c685]">
                    {item.badge}
                  </span>
                ) : null}
                {active && <ChevronRight size={13} className="text-[#00c685]/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a1a14] shrink-0" style={{ background: GREEN }}>
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Ahmed Khan</p>
              <p className="text-white/35 text-[10px] truncate">Certificate: TK-2024-0142</p>
            </div>
            <LogOut size={14} className="text-white/30 hover:text-white/70 shrink-0" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* ─── Top Bar ────────────────────────────────────────────────────────── */
const ROLE_LABELS: Record<DashboardRole, string> = {
  participant: 'Participant',
  claims: 'Claims Handler',
  finance: 'Finance Team',
  management: 'Management',
};

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const [roleOpen, setRoleOpen] = useState(false);

  const crumb = pathname.replace('/dashboard', '').replace('/', '').split('/')[0];
  const pageTitle = crumb
    ? crumb.charAt(0).toUpperCase() + crumb.slice(1).replace('-', ' ')
    : 'Overview';

  return (
    <header
      className="sticky top-0 z-[100] flex items-center gap-4 px-4 sm:px-6 h-14 shrink-0"
      style={{ background: BG_DARK, borderBottom: `1px solid ${BORDER}` }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/35">Dashboard</span>
        {pageTitle !== 'Overview' && (
          <>
            <ChevronRight size={13} className="text-white/25" />
            <span className="text-white/80 font-medium">{pageTitle}</span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Role switcher (demo only) */}
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
              className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden z-50 shadow-2xl"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              {(Object.keys(ROLE_LABELS) as DashboardRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors ${role === r ? 'text-[#00c685] bg-[#00c685]/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <Link href="/dashboard/notifications" className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00c685]" />
      </Link>

      {/* Profile */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a1a14] cursor-pointer" style={{ background: GREEN }}>
        AK
      </div>
    </header>
  );
}

/* ─── Dashboard Layout ───────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<DashboardRole>('management');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div className="flex h-screen overflow-hidden" style={{ background: BG_DARK, fontFamily: "'Inter', sans-serif" }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleContext.Provider>
  );
}
