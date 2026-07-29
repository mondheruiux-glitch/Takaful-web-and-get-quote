'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Bell, Users, Lock, Building2,
  ChevronRight, Check, Eye, EyeOff, Camera,
} from 'lucide-react';
import { useTheme } from '../layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const SETTINGS_NAV = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'team', label: 'Team & Roles', icon: Users },
  { key: 'organisation', label: 'Organisation', icon: Building2 },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!enabled)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${enabled ? 'bg-[#00c685]' : 'bg-black/10 dark:bg-white/10'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function InputField({ label, defaultValue, type = 'text', placeholder, theme }: { label: string; defaultValue?: string; type?: string; placeholder?: string; theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const BORDER_INPUT = isLight ? 'border-black/8' : 'border-white/8';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const TEXT_INPUT = isLight ? 'text-black placeholder:text-black/25' : 'text-white placeholder:text-white/20';

  return (
    <div>
      <label className={`text-[10px] font-semibold uppercase tracking-wide block mb-1.5 ${TEXT_SUB}`}>{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685]/40 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_INPUT}`} />
    </div>
  );
}

function ProfileTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const GREEN = '#00c685';

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{ background: GREEN }}>
            AK
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg" style={{ background: GREEN }}>
            <Camera size={11} />
          </button>
        </div>
        <div>
          <p className={`font-semibold ${TEXT_MAIN}`}>Ahmed Khan</p>
          <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Management · ahmed.khan@takaful.com</p>
          <button className="text-xs text-[#00c685] mt-1 hover:underline">Change photo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="First Name" defaultValue="Ahmed" theme={theme} />
        <InputField label="Last Name" defaultValue="Khan" theme={theme} />
        <InputField label="Email Address" defaultValue="ahmed.khan@takaful.com" type="email" theme={theme} />
        <InputField label="Phone Number" defaultValue="+44 7700 999 000" type="tel" theme={theme} />
        <div className="sm:col-span-2">
          <InputField label="Job Title" defaultValue="Operations Manager" theme={theme} />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: GREEN }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SecurityTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
  const BG_PANEL2 = isLight ? '#f4f6f5' : '#112218';
  const BORDER_INPUT = isLight ? 'border-black/8' : 'border-white/8';
  const BG_INPUT = isLight ? 'bg-black/[0.03]' : 'bg-white/[0.04]';
  const TEXT_INPUT = isLight ? 'text-black placeholder:text-black/25' : 'text-white placeholder:text-white/20';

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const GREEN = '#00c685';

  return (
    <div className="space-y-6">
      {/* Password */}
      <div>
        <h3 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-[10px] font-semibold uppercase tracking-wide block mb-1.5 ${TEXT_SUB}`}>Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} placeholder="Enter current password"
                className={`w-full pr-10 pl-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685]/40 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_INPUT}`} />
              <button onClick={() => setShowCurrent(v => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-black dark:hover:text-white ${TEXT_MUTED}`}>
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`text-[10px] font-semibold uppercase tracking-wide block mb-1.5 ${TEXT_SUB}`}>New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} placeholder="Minimum 12 characters"
                className={`w-full pr-10 pl-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685]/40 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_INPUT}`} />
              <button onClick={() => setShowNew(v => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-black dark:hover:text-white ${TEXT_MUTED}`}>
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: GREEN }}>
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
        <h3 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>Security Settings</h3>
        <div className="space-y-4">
          {[
            { label: 'Two-Factor Authentication', sub: 'Require a verification code when signing in', enabled: twoFactor, set: setTwoFactor },
            { label: 'Session Alerts', sub: 'Receive email alerts for new sign-ins', enabled: sessionAlerts, set: setSessionAlerts },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-4 p-4 rounded-xl transition-colors duration-200" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
              <div>
                <p className={`text-sm font-medium ${TEXT_MAIN}`}>{item.label}</p>
                <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>{item.sub}</p>
              </div>
              <Toggle enabled={item.enabled} onChange={item.set} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
  const BG_PANEL2 = isLight ? '#f4f6f5' : '#112218';
  const GREEN = '#00c685';

  const settings = [
    { group: 'Claims', items: [
      { label: 'New claim submitted', sub: 'When a participant submits a new claim', email: true, push: true },
      { label: 'Claim status update', sub: 'When a claim status changes', email: true, push: false },
      { label: 'Documents required', sub: 'When a claim requires additional documents', email: true, push: true },
    ]},
    { group: 'Contributions', items: [
      { label: 'Failed collection', sub: 'When a direct debit collection fails', email: true, push: true },
      { label: 'Monthly summary', sub: 'Monthly contribution collection report', email: true, push: false },
    ]},
    { group: 'Certificates', items: [
      { label: 'Certificate expiring', sub: '30-day expiry reminder', email: true, push: false },
      { label: 'New certificate issued', sub: 'When a new certificate is issued', email: false, push: false },
    ]},
  ];

  const [prefs, setPrefs] = useState(settings);

  return (
    <div className="space-y-5">
      {prefs.map((group, gi) => (
        <div key={group.group}>
          <h3 className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${TEXT_MUTED}`}>{group.group}</h3>
          <div className="space-y-2">
            {group.items.map((item, ii) => (
              <div key={item.label} className="p-4 rounded-xl flex items-center gap-4 transition-colors duration-200" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${TEXT_MAIN}`}>{item.label}</p>
                  <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>{item.sub}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-[9px] ${TEXT_MUTED}`}>Email</span>
                    <Toggle enabled={item.email} onChange={v => {
                      const updated = [...prefs];
                      updated[gi].items[ii] = { ...item, email: v };
                      setPrefs(updated);
                    }} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-[9px] ${TEXT_MUTED}`}>Push</span>
                    <Toggle enabled={item.push} onChange={v => {
                      const updated = [...prefs];
                      updated[gi].items[ii] = { ...item, push: v };
                      setPrefs(updated);
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: GREEN }}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function TeamTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
  const BG_PANEL2 = isLight ? '#f4f6f5' : '#112218';
  const GREEN = '#00c685';

  const members = [
    { name: 'Ahmed Khan', email: 'ahmed.khan@takaful.com', role: 'Management', status: 'Active' },
    { name: 'Omar Hassan', email: 'o.hassan@takaful.com', role: 'Claims Handler', status: 'Active' },
    { name: 'Leila Nkosi', email: 'l.nkosi@takaful.com', role: 'Claims Handler', status: 'Active' },
    { name: 'Khalid Farooq', email: 'k.farooq@takaful.com', role: 'Claims Handler', status: 'Active' },
    { name: 'Amira Siddiqui', email: 'a.siddiqui@takaful.com', role: 'Finance', status: 'Active' },
  ];

  const roles = ['Management', 'Claims Handler', 'Finance', 'Operations', 'Admin'];
  const colors = [GREEN, '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-5">
      {/* Role descriptions */}
      <div>
        <h3 className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${TEXT_MUTED}`}>Dashboard Roles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {roles.map((r, i) => (
            <div key={r} className="p-3 rounded-xl flex items-center gap-2 transition-colors duration-200" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[i] }} />
              <span className={`text-xs font-medium ${TEXT_SUB}`}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-[10px] font-semibold uppercase tracking-wide ${TEXT_MUTED}`}>Team Members</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold" style={{ color: GREEN, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            + Invite Member
          </button>
        </div>
        <div className="space-y-2">
          {members.map(m => (
            <div key={m.email} className="flex items-center gap-3 p-3.5 rounded-xl transition-colors duration-200" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: GREEN }}>
                {m.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${TEXT_MAIN}`}>{m.name}</p>
                <p className={`text-[10px] ${TEXT_MUTED}`}>{m.email}</p>
              </div>
              <span className={`text-[10px] font-medium ${TEXT_SUB}`}>{m.role}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c685] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeSection, setActiveSection] = useState('profile');

  // Dynamic Theme Colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';

  const TABS_CONTENT: Record<string, React.ReactNode> = {
    profile: <ProfileTab theme={theme} />,
    security: <SecurityTab theme={theme} />,
    notifications: <NotificationsTab theme={theme} />,
    team: <TeamTab theme={theme} />,
    organisation: (
      <div className="space-y-4">
        <InputField label="Organisation Name" defaultValue="Takaful UK Ltd" theme={theme} />
        <InputField label="Registered Address" defaultValue="1 Takaful House, London, EC1A 1BB" theme={theme} />
        <InputField label="FCA Reference" defaultValue="Demo — not regulated" theme={theme} />
        <InputField label="Contact Email" defaultValue="hello@takaful.com" type="email" theme={theme} />
        <div className="flex justify-end">
          <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: GREEN }}>Save</button>
        </div>
      </div>
    ),
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 transition-colors duration-200">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className={`text-lg font-bold ${TEXT_MAIN}`}>Settings</h1>
        <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Manage your profile, security, and organisation preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar nav */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="rounded-2xl p-3 h-fit space-y-0.5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          {SETTINGS_NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeSection === item.key ? 'bg-[#00c685]/15 text-[#00c685]' : `${TEXT_SUB} hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`
                }`}>
                <Icon size={15} className={activeSection === item.key ? 'text-[#00c685]' : TEXT_MUTED} />
                {item.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content panel */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="lg:col-span-3 rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <h2 className={`font-semibold text-sm mb-5 ${TEXT_MAIN}`}>
            {SETTINGS_NAV.find(n => n.key === activeSection)?.label}
          </h2>
          {TABS_CONTENT[activeSection]}
        </motion.div>
      </div>
    </div>
  );
}
