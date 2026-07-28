'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Bell, Users, Lock, Building2,
  ChevronRight, Check, Eye, EyeOff, Camera,
} from 'lucide-react';

const GREEN = '#00c685';
const SURFACE = '#0d2117';
const SURFACE2 = '#112218';
const BORDER = 'rgba(255,255,255,0.07)';
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
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${enabled ? 'bg-[#00c685]' : 'bg-white/10'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function InputField({ label, defaultValue, type = 'text', placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wide block mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors" />
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-[#0a1a14]" style={{ background: GREEN }}>
            AK
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[#0a1a14] shadow-lg" style={{ background: GREEN }}>
            <Camera size={11} />
          </button>
        </div>
        <div>
          <p className="text-white font-semibold">Ahmed Khan</p>
          <p className="text-white/40 text-xs mt-0.5">Management · ahmed.khan@takaful.com</p>
          <button className="text-xs text-[#00c685] mt-1 hover:underline">Change photo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="First Name" defaultValue="Ahmed" />
        <InputField label="Last Name" defaultValue="Khan" />
        <InputField label="Email Address" defaultValue="ahmed.khan@takaful.com" type="email" />
        <InputField label="Phone Number" defaultValue="+44 7700 999 000" type="tel" />
        <div className="sm:col-span-2">
          <InputField label="Job Title" defaultValue="Operations Manager" />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0a1a14] hover:opacity-90 transition-all" style={{ background: GREEN }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  return (
    <div className="space-y-6">
      {/* Password */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wide block mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} placeholder="Enter current password"
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors" />
              <button onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wide block mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} placeholder="Minimum 12 characters"
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors" />
              <button onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0a1a14] hover:opacity-90 transition-all" style={{ background: GREEN }}>
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
        <h3 className="text-white font-semibold text-sm mb-4">Security Settings</h3>
        <div className="space-y-4">
          {[
            { label: 'Two-Factor Authentication', sub: 'Require a verification code when signing in', enabled: twoFactor, set: setTwoFactor },
            { label: 'Session Alerts', sub: 'Receive email alerts for new sign-ins', enabled: sessionAlerts, set: setSessionAlerts },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-4 p-4 rounded-xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
              <div>
                <p className="text-white/80 text-sm font-medium">{item.label}</p>
                <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
              </div>
              <Toggle enabled={item.enabled} onChange={item.set} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
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
          <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mb-3">{group.group}</h3>
          <div className="space-y-2">
            {group.items.map((item, ii) => (
              <div key={item.label} className="p-4 rounded-xl flex items-center gap-4" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium">{item.label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-white/25 text-[9px]">Email</span>
                    <Toggle enabled={item.email} onChange={v => {
                      const updated = [...prefs];
                      updated[gi].items[ii] = { ...item, email: v };
                      setPrefs(updated);
                    }} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-white/25 text-[9px]">Push</span>
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
        <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0a1a14] hover:opacity-90 transition-all" style={{ background: GREEN }}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function TeamTab() {
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
        <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mb-3">Dashboard Roles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {roles.map((r, i) => (
            <div key={r} className="p-3 rounded-xl flex items-center gap-2" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[i] }} />
              <span className="text-white/70 text-xs font-medium">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">Team Members</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold" style={{ color: GREEN, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            + Invite Member
          </button>
        </div>
        <div className="space-y-2">
          {members.map(m => (
            <div key={m.email} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-[#0a1a14] shrink-0" style={{ background: GREEN }}>
                {m.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-xs font-semibold">{m.name}</p>
                <p className="text-white/30 text-[10px]">{m.email}</p>
              </div>
              <span className="text-white/45 text-[10px] font-medium">{m.role}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c685] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS: Record<string, React.ReactNode> = {
  profile: <ProfileTab />,
  security: <SecurityTab />,
  notifications: <NotificationsTab />,
  team: <TeamTab />,
  organisation: (
    <div className="space-y-4">
      <InputField label="Organisation Name" defaultValue="Takaful UK Ltd" />
      <InputField label="Registered Address" defaultValue="1 Takaful House, London, EC1A 1BB" />
      <InputField label="FCA Reference" defaultValue="Demo — not regulated" />
      <InputField label="Contact Email" defaultValue="hello@takaful.com" type="email" />
      <div className="flex justify-end">
        <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0a1a14] hover:opacity-90 transition-all" style={{ background: GREEN }}>Save</button>
      </div>
    </div>
  ),
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className="text-white text-lg font-bold">Settings</h1>
        <p className="text-white/40 text-xs mt-0.5">Manage your profile, security, and organisation preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar nav */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="rounded-2xl p-3 h-fit space-y-0.5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          {SETTINGS_NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeSection === item.key ? 'bg-[#00c685]/15 text-[#00c685]' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={15} className={activeSection === item.key ? 'text-[#00c685]' : 'text-white/30'} />
                {item.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content panel */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="lg:col-span-3 rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <h2 className="text-white font-semibold text-sm mb-5">
            {SETTINGS_NAV.find(n => n.key === activeSection)?.label}
          </h2>
          {TABS[activeSection]}
        </motion.div>
      </div>
    </div>
  );
}
