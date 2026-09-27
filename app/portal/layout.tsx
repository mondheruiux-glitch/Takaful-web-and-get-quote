'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, FileText, CreditCard, Folder,
  PieChart, HelpCircle, Bell, Settings,
  Menu, X, LogOut, ChevronDown,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import { Particles } from '@/components/ui/particles';
import { RoleContext, ThemeContext, ThemeMode, DashboardRole } from '@/app/dashboard/ThemeRoleContext';
import { FeedbackWidget } from '@/components/ui/feedback-widget';

/* ─── Participant Nav Items ─────────────────────────────────────────────── */
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const PARTICIPANT_NAV: NavItem[] = [
  { href: '/portal/my-cover',       label: 'My Cover',          icon: Home },
  { href: '/portal/claims',         label: 'My Claims',         icon: FileText },
  { href: '/portal/contributions',  label: 'My Contributions',  icon: CreditCard },
  { href: '/portal/documents',      label: 'My Documents',      icon: Folder },
  { href: '/portal/pool',           label: 'Takaful Pool',      icon: PieChart },
  { href: '/portal/support',        label: 'Support & Chat',    icon: HelpCircle, badge: 1 },
  { href: '/portal/notifications',  label: 'Notifications',     icon: Bell, badge: 2 },
  { href: '/portal/settings',       label: 'Settings',          icon: Settings },
];

/* ─── Participant Portal Header ─────────────────────────────────────────── */
function PortalHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const user = DEMO_USERS['participant'];
  const avatarSrc = getDicebearAvatar(user?.name ?? 'Fatima Al-Rashid', 'female');

  const currentTab = PARTICIPANT_NAV.find(
    (t) => pathname === t.href || pathname.startsWith(t.href)
  );
  const currentPageLabel = currentTab?.label ?? 'My Cover';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const BORDER = 'rgba(255,255,255,0.08)';
  const SURFACE = '#0d2117';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-[#061510]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/brand/logo-light.png"
                alt="Takaful UK"
                className="h-6 sm:h-7 w-auto transition-transform group-hover:scale-[1.02]"
                fetchPriority="high"
              />
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notifications */}
            <Link
              href="/portal/notifications"
              className="relative p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00c685]" />
            </Link>

            {/* Profile avatar */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 rounded-full hover:opacity-90 transition-opacity focus:outline-none"
                aria-label="Open profile menu"
              >
                <img
                  src={avatarSrc}
                  alt={user?.name ?? 'Fatima Al-Rashid'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20 hover:ring-[#00c685]/50 transition-all"
                  decoding="async"
                />
                <span className="hidden sm:block text-sm font-semibold text-gray-200">
                  {user?.name?.split(' ')[0] ?? 'Fatima'}
                </span>
                <ChevronDown size={12} className={`hidden sm:block text-gray-400 ${profileOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50 shadow-2xl"
                    style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                  >
                    {/* User info */}
                    <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <div className="flex items-center gap-3">
                        <img src={avatarSrc} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-bold text-white">{user?.name ?? 'Fatima Al-Rashid'}</p>
                          <p className="text-xs mt-0.5 text-white/40">{user?.email ?? 'fatima.alrashid@example.co.uk'}</p>
                        </div>
                      </div>
                    </div>
                    {/* Links */}
                    <div className="py-2">
                      {[
                        { icon: Settings,   label: 'Settings',     href: '/portal/settings' },
                        { icon: HelpCircle, label: 'Support Desk', href: '/portal/support'  },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link key={label} href={href} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-white/70 hover:bg-white/5"
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/60">
                            <Icon size={15} />
                          </span>
                          {label}
                        </Link>
                      ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${BORDER}` }} className="py-2">
                      <button onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-white/70 hover:bg-white/5"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/60">
                          <LogOut size={15} />
                        </span>
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full transition-colors text-gray-300 hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile drawer ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[198] md:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-xs z-[199] md:hidden flex flex-col"
              style={{ background: '#0a1a14', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <img src="/brand/logo-takaful.svg" alt="Takaful UK" className="h-6 brightness-0 invert" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {PARTICIPANT_NAV.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href} href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        active ? 'bg-[#00c685]/15 text-[#00c685]' : 'text-gray-300 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-[#00c685]' : 'text-gray-400'} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-[#0a1a14] bg-[#00c685]">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Participant Floating Side Menu (Icons Dock) ───────────────────────── */
function ParticipantFloatingSideMenu() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Floating Side Menu Dock ── */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-4 sm:left-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 bg-[#061510]/85 border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_24px_rgba(0,198,133,0.08)] backdrop-blur-xl"
        aria-label="Participant navigation dock"
      >
        {PARTICIPANT_NAV.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const isSeparatorBefore = idx === 6;

          return (
            <React.Fragment key={item.href}>
              {isSeparatorBefore && (
                <div className="w-6 h-px my-1 bg-white/10" />
              )}
              <Link
                href={item.href}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00c685] text-[#061510] font-bold shadow-md shadow-[#00c685]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
                }`}
                aria-label={item.label}
              >
                <Icon size={18} />
                {item.badge && !isActive ? (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00c685]" />
                ) : null}

                {/* Tooltip on hover */}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 z-50 shadow-lg bg-[#0d2117] text-white border border-white/10 shadow-black/40"
                >
                  {item.label}
                </span>
              </Link>
            </React.Fragment>
          );
        })}
      </motion.aside>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <motion.nav
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden fixed bottom-3 left-3 right-3 z-50 flex items-center justify-around px-3 py-2 rounded-2xl transition-all duration-300 bg-[#061510]/90 border border-white/[0.12] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        aria-label="Mobile bottom navigation"
      >
        {PARTICIPANT_NAV.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isActive
                  ? 'bg-[#00c685] text-[#061510] font-bold shadow-md shadow-[#00c685]/30'
                  : 'text-white/60 hover:text-white'
              }`}
              aria-label={item.label}
            >
              <Icon size={18} />
              {item.badge && !isActive ? (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00c685]" />
              ) : null}
            </Link>
          );
        })}
        <Link
          href="/portal/support"
          className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            pathname === '/portal/support' || pathname.startsWith('/portal/support/')
              ? 'bg-[#00c685] text-[#061510] font-bold shadow-md shadow-[#00c685]/30'
              : 'text-white/60 hover:text-white'
          }`}
          aria-label="Support & Chat"
        >
          <HelpCircle size={18} />
          {pathname !== '/portal/support' && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          )}
        </Link>
      </motion.nav>
    </>
  );
}

/* ─── Floating Claim Feedback Trigger ──────────────────────────────────── */
function ClaimFeedbackFloatingTrigger() {
  const pathname = usePathname();
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Never show on the claim submission form itself
    if (pathname.includes('/portal/claims/new')) {
      setShowFeedback(false);
      return;
    }

    // Check if user has submitted a claim recently
    const hasRecentlySubmitted =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('takaful_claim_submitted_recently') === 'true';

    if (hasRecentlySubmitted) {
      // Trigger after a pleasant duration: 2500ms
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Also support manual event for testing or direct trigger
  useEffect(() => {
    const handleTrigger = () => setShowFeedback(true);
    window.addEventListener('trigger-claim-feedback', handleTrigger);
    return () => window.removeEventListener('trigger-claim-feedback', handleTrigger);
  }, []);

  return (
    <AnimatePresence>
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-[110] max-w-[calc(100vw-2rem)]"
        >
          <FeedbackWidget
            label="How was your claim experience?"
            placeholder="Share your feedback to help improve the mutual pool..."
            onSubmit={(data) => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('takaful_claim_submitted_recently');
                localStorage.setItem(
                  'takaful_claim_feedback_completed',
                  JSON.stringify({ ...data, date: new Date().toISOString() })
                );
              }
            }}
            onClose={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('takaful_claim_submitted_recently');
              }
              setShowFeedback(false);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Portal Layout Component ───────────────────────────────────────────── */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const role: DashboardRole = 'participant';

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', setTheme: () => {} }}>
      <RoleContext.Provider value={{ role, setRole: () => {} }}>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#0a1a14] text-white" style={{ background: '#0a1a14', fontFamily: "'Inter', sans-serif" }}>
          {/* Animated Background: Particles + radial glows */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <Particles
              color="#00c685"
              quantity={120}
              ease={20}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 isolate -z-10 contain-strict">
              <div className="absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21rem] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.01)_50%,transparent_80%)]" />
              <div className="absolute top-0 left-0 h-[80rem] w-[15rem] [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.04)_0,rgba(0,198,133,0.01)_80%,transparent_100%)]" />
              <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.03)_0,transparent_100%)] absolute bottom-0 right-0 h-[60rem] w-[30rem] translate-y-[20%] rounded-full" />
            </div>
          </div>

          <PortalHeader />
          <ParticipantFloatingSideMenu />
          <ClaimFeedbackFloatingTrigger />
          <main className="flex-1 relative pt-16 md:pl-20 lg:pl-24 pb-20 md:pb-10 z-10">
            {children}
          </main>
        </div>
      </RoleContext.Provider>
    </ThemeContext.Provider>
  );
}
