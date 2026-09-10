'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Users, Lock, Building2,
  Eye, EyeOff, Camera, Shield, CheckCircle2,
  Mail, Phone, MapPin, Briefcase, FileText,
  Key, Sparkles, AlertCircle, Save, Check
} from 'lucide-react';
import { useTheme, useRole, DashboardRole } from '../ThemeRoleContext';
import { DEMO_USERS, PARTICIPANTS, CERTIFICATES } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const ALL_SETTINGS_NAV = [
  { key: 'profile',       label: 'Profile',       icon: User,      managementOnly: false },
  { key: 'security',      label: 'Security',       icon: Lock,      managementOnly: false },
  { key: 'notifications', label: 'Notifications',  icon: Bell,      managementOnly: false },
  { key: 'team',          label: 'Team & Staff',   icon: Users,     managementOnly: true  },
  { key: 'organisation',  label: 'Organisation',   icon: Building2, managementOnly: true  },
];

/* ─── Toggle Switch ────────────────────────────────────────────────────────── */
function Toggle({ enabled, onChange, theme = 'dark' }: { enabled: boolean; onChange: (v: boolean) => void; theme?: string }) {
  const isLight = theme === 'light';
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className="relative inline-flex items-center w-10 h-[22px] rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c685]/50"
      style={{
        background: enabled
          ? '#00c685'
          : isLight
          ? 'rgba(0,0,0,0.15)'
          : 'rgba(255,255,255,0.14)',
      }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out"
        style={{ transform: enabled ? 'translateX(18px)' : 'translateX(0px)' }}
      />
    </button>
  );
}

/* ─── Input Field Component ────────────────────────────────────────────────── */
function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  theme,
  readOnly = false,
  icon: Icon,
  hint,
}: {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  theme: string;
  readOnly?: boolean;
  icon?: React.ElementType;
  hint?: string;
}) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const BORDER_INPUT = isLight ? 'border-black/[0.08]' : 'border-white/[0.08]';
  const BG_INPUT = isLight ? 'bg-black/[0.02]' : 'bg-white/[0.04]';
  const TEXT_INPUT = isLight ? 'text-black placeholder:text-black/25' : 'text-white placeholder:text-white/20';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className={`text-[11px] font-semibold tracking-wide block ${TEXT_SUB}`}>{label}</label>
        {hint && <span className={`text-[10px] ${TEXT_SUB}`}>{hint}</span>}
      </div>
      <div className="relative flex items-center">
        {Icon && (
          <div className={`absolute left-3.5 pointer-events-none ${isLight ? 'text-black/35' : 'text-white/35'}`}>
            <Icon size={14} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_INPUT} ${
            readOnly ? 'opacity-80 cursor-not-allowed bg-black/[0.04] dark:bg-white/[0.02]' : ''
          }`}
        />
      </div>
    </div>
  );
}

/* ─── Profile Tab (Dynamic based on selected Dashboard user/role) ─────────── */
function ProfileTab({ theme, role }: { theme: string; role: DashboardRole }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL2 = isLight ? '#F8FAFC' : '#112218';
  const GREEN = '#00c685';

  const user = DEMO_USERS[role] ?? DEMO_USERS.participant;
  const participantData = PARTICIPANTS.find(p => p.name === user.name) || PARTICIPANTS[0];
  const certData = CERTIFICATES.find(c => c.participantName === user.name) || CERTIFICATES[0];

  // Form states populated from active user in dashboard
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
    email: user.email,
    phone: participantData?.phone || '+44 7700 900 123',
    jobTitle: user.jobTitle,
    address: participantData?.address || '14 Elm Street, Birmingham, B1 2PQ',
    certificateId: user.certificateId || certData.id,
    memberSince: participantData?.memberSince || 'Jan 2024',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever role changes in dashboard
  useEffect(() => {
    const updatedUser = DEMO_USERS[role] ?? DEMO_USERS.participant;
    const updatedPart = PARTICIPANTS.find(p => p.name === updatedUser.name) || PARTICIPANTS[0];
    const updatedCert = CERTIFICATES.find(c => c.participantName === updatedUser.name) || CERTIFICATES[0];
    setFormData({
      firstName: updatedUser.name.split(' ')[0] || '',
      lastName: updatedUser.name.split(' ').slice(1).join(' ') || '',
      email: updatedUser.email,
      phone: updatedPart?.phone || '+44 7700 900 123',
      jobTitle: updatedUser.jobTitle,
      address: updatedPart?.address || '14 Elm Street, Birmingham, B1 2PQ',
      certificateId: updatedUser.certificateId || updatedCert.id,
      memberSince: updatedPart?.memberSince || 'Jan 2024',
    });
    setSavedSuccess(false);
  }, [role]);

  const avatarUrl = getDicebearAvatar(user.name, user.gender);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const roleBadgeLabel = {
    participant: 'Takaful Participant (Policyholder)',
    claim_handler: 'Claims Assessment & Operations',
    finance: 'Finance & Treasury Management',
    management: 'Executive Leadership & Board',
  }[role];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* User Header Profile Card */}
      <div
        className="p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
        style={{ background: BG_PANEL2, borderColor: BORDER }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 shrink-0 bg-gray-100 dark:bg-emerald-950/40 shadow-sm"
              style={{ borderColor: GREEN }}
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
              style={{ background: GREEN }}
              title="Upload new avatar"
            >
              <Camera size={11} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-base font-bold ${TEXT_MAIN}`}>{user.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/20">
                {user.jobTitle}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>{user.email}</p>
            <p className="text-[11px] text-[#00c685] font-medium mt-1 flex items-center gap-1.5">
              <Shield size={12} />
              {roleBadgeLabel}
            </p>
          </div>
        </div>

        {/* Quick Identity Meta Badge */}
        <div className="sm:text-right text-left pt-2 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto" style={{ borderColor: BORDER }}>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold">
            {role === 'participant' ? `ID: ${user.participantId ?? 'P-0042'}` : `STAFF ID: ${user.id}`}
          </span>
          {role === 'participant' && (
            <p className={`text-[11px] mt-1.5 ${TEXT_SUB}`}>
              Member since <strong>{formData.memberSince}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Editable Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          value={formData.firstName}
          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
          theme={theme}
          icon={User}
        />
        <InputField
          label="Last Name"
          value={formData.lastName}
          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
          theme={theme}
          icon={User}
        />
        <InputField
          label="Email Address"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          type="email"
          theme={theme}
          icon={Mail}
        />
        <InputField
          label="Phone Number"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          type="tel"
          theme={theme}
          icon={Phone}
        />

        {role === 'participant' ? (
          <>
            <div className="sm:col-span-2">
              <InputField
                label="Primary Residential Address"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                theme={theme}
                icon={MapPin}
                hint="Used for Takaful Home Cover risk assessments"
              />
            </div>
            <InputField
              label="Active Policy Certificate"
              value={formData.certificateId}
              readOnly
              theme={theme}
              icon={FileText}
              hint="Managed via My Cover"
            />
            <InputField
              label="Participant Account ID"
              value={user.participantId ?? 'P-0042'}
              readOnly
              theme={theme}
              icon={Key}
              hint="Verified member ID"
            />
          </>
        ) : (
          <>
            <div className="sm:col-span-2">
              <InputField
                label="Job Designation / Department Role"
                value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                theme={theme}
                icon={Briefcase}
              />
            </div>
            <InputField
              label="Staff Identification"
              value={user.id}
              readOnly
              theme={theme}
              icon={Key}
              hint="Internal system reference"
            />
            <InputField
              label="Security Clearance Tier"
              value="Level 3 — Authorized"
              readOnly
              theme={theme}
              icon={Shield}
              hint="FCA / Shariah Supervisory Board"
            />
          </>
        )}
      </div>

      {/* Save Button & Feedback Alert */}
      <div className="flex items-center justify-between pt-2">
        {savedSuccess ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#00c685]"
          >
            <CheckCircle2 size={15} />
            Profile updated successfully!
          </motion.div>
        ) : (
          <span className={`text-[11px] ${TEXT_SUB}`}>Changes sync across your active session.</span>
        )}
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all shadow-sm"
          style={{ background: GREEN }}
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>
    </form>
  );
}

/* ─── Security Tab ────────────────────────────────────────────────────────── */
function SecurityTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL2 = isLight ? '#F8FAFC' : '#112218';
  const BORDER_INPUT = isLight ? 'border-[#E4E7EC]' : 'border-white/[0.08]';
  const BG_INPUT = isLight ? 'bg-black/[0.02]' : 'bg-white/[0.04]';
  const TEXT_INPUT = isLight ? 'text-black placeholder:text-black/25' : 'text-white placeholder:text-white/20';

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [passUpdated, setPassUpdated] = useState(false);
  const GREEN = '#00c685';

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdated(true);
    setTimeout(() => setPassUpdated(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Password section */}
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <h3 className={`font-semibold text-sm ${TEXT_MAIN}`}>Change Password</h3>
        <p className={`text-xs ${TEXT_SUB}`}>Ensure your account uses a strong passphrase with at least 12 characters.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`text-[11px] font-semibold block mb-1.5 ${TEXT_SUB}`}>Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••••••"
                required
                className={`w-full pr-10 pl-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_INPUT}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(v => !v)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-black dark:hover:text-white ${TEXT_MUTED}`}
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className={`text-[11px] font-semibold block mb-1.5 ${TEXT_SUB}`}>New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Minimum 12 characters"
                required
                className={`w-full pr-10 pl-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${BG_INPUT} ${BORDER_INPUT} ${TEXT_INPUT}`}
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-black dark:hover:text-white ${TEXT_MUTED}`}
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {passUpdated && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-semibold text-[#00c685] flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} /> Password updated successfully!
            </motion.span>
          )}
          <span className="flex-1" />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all shadow-sm"
            style={{ background: GREEN }}
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Security toggles */}
      <div className="pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
        <h3 className={`font-semibold text-sm mb-3 ${TEXT_MAIN}`}>Multi-Factor & Session Security</h3>
        <div className="space-y-3">
          {[
            { label: 'Two-Factor Authentication (2FA)', sub: 'Require an authenticator app TOTP code or SMS prompt upon sign-in', enabled: twoFactor, set: setTwoFactor },
            { label: 'Suspicious Sign-in Alerts', sub: 'Receive instant email notification if a login occurs from an unrecognized device or IP', enabled: sessionAlerts, set: setSessionAlerts },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-4 p-4 rounded-xl transition-colors" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
              <div>
                <p className={`text-xs font-semibold ${TEXT_MAIN}`}>{item.label}</p>
                <p className={`text-[11px] mt-0.5 ${TEXT_SUB}`}>{item.sub}</p>
              </div>
              <Toggle enabled={item.enabled} onChange={item.set} theme={theme} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Notifications Tab ───────────────────────────────────────────────────── */
function NotificationsTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL2 = isLight ? '#F8FAFC' : '#112218';
  const GREEN = '#00c685';

  const settings = [
    { group: 'Claims Operations', items: [
      { label: 'New claim submitted', sub: 'Instant notification when an incident claim is registered', email: true, push: true },
      { label: 'Claim status updates', sub: 'When a claim moves to Under Review, Approved, or Paid', email: true, push: true },
      { label: 'Assessor inspection reminders', sub: 'Alerts for scheduled surveyor and structural loss visits', email: true, push: false },
    ]},
    { group: 'Direct Debit & Tabarru Fund', items: [
      { label: 'Direct Debit debiting reminders', sub: '3 days prior notice before monthly payment collection', email: true, push: false },
      { label: 'Failed collection alerts', sub: 'Immediate alert with grace period details if a mandate fails', email: true, push: true },
      { label: 'Annual surplus distribution', sub: 'Year-end underwriting surplus pool rebate reports', email: true, push: false },
    ]},
    { group: 'Policy Certificates & Legal', items: [
      { label: 'Certificate renewal reminder', sub: '30-day prior notification before 3-year term renewal', email: true, push: false },
      { label: 'Document verification completed', sub: 'Confirmation when proof of ownership or ID is verified', email: false, push: true },
    ]},
  ];

  const [prefs, setPrefs] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {prefs.map((group, gi) => (
        <div key={group.group}>
          <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 ${TEXT_MUTED}`}>{group.group}</h3>
          <div className="space-y-2">
            {group.items.map((item, ii) => (
              <div key={item.label} className="p-3.5 rounded-xl flex items-center justify-between gap-4 transition-colors" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${TEXT_MAIN}`}>{item.label}</p>
                  <p className={`text-[11px] mt-0.5 ${TEXT_SUB}`}>{item.sub}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-[9px] font-semibold ${TEXT_MUTED}`}>Email</span>
                    <Toggle enabled={item.email} onChange={v => {
                      const updated = [...prefs];
                      updated[gi].items[ii] = { ...item, email: v };
                      setPrefs(updated);
                    }} theme={theme} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-[9px] font-semibold ${TEXT_MUTED}`}>Push</span>
                    <Toggle enabled={item.push} onChange={v => {
                      const updated = [...prefs];
                      updated[gi].items[ii] = { ...item, push: v };
                      setPrefs(updated);
                    }} theme={theme} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2">
        {saved && (
          <span className="text-xs font-semibold text-[#00c685] flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Notification preferences saved!
          </span>
        )}
        <span className="flex-1" />
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all shadow-sm"
          style={{ background: GREEN }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

/* ─── Team Tab (Management view) ─────────────────────────────────────────── */
function TeamTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL2 = isLight ? '#F8FAFC' : '#112218';
  const GREEN = '#00c685';

  const members = [
    { name: 'Ahmed Khan', email: 'ahmed.khan@takaful.com', role: 'Operations Director (Management)', status: 'Active', gender: 'male' },
    { name: 'Omar Hassan', email: 'o.hassan@takaful.com', role: 'Senior Claims Handler', status: 'Active', gender: 'male' },
    { name: 'Amira Siddiqui', email: 'a.siddiqui@takaful.com', role: 'Finance Officer', status: 'Active', gender: 'female' },
    { name: 'Leila Nkosi', email: 'l.nkosi@takaful.com', role: 'Loss Adjuster & Assessor', status: 'Active', gender: 'female' },
    { name: 'Khalid Farooq', email: 'k.farooq@takaful.com', role: 'Compliance & Shariah Auditor', status: 'Active', gender: 'male' },
  ];

  const roles = [
    { name: 'Management', count: '1 Lead', color: GREEN },
    { name: 'Claims Team', count: '4 Handlers', color: '#3b82f6' },
    { name: 'Finance', count: '2 Officers', color: '#8b5cf6' },
    { name: 'Compliance', count: '1 Auditor', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Role summary blocks */}
      <div>
        <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${TEXT_MUTED}`}>Access Role Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {roles.map(r => (
            <div key={r.name} className="p-3 rounded-xl flex items-center gap-2.5 transition-colors" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
              <div>
                <span className={`text-xs font-semibold block ${TEXT_MAIN}`}>{r.name}</span>
                <span className={`text-[10px] ${TEXT_SUB}`}>{r.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team members list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${TEXT_MUTED}`}>Internal Operations Staff</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ color: GREEN, background: `${GREEN}15`, border: `1px solid ${GREEN}30` }}>
            + Invite New Staff
          </button>
        </div>
        <div className="space-y-2.5">
          {members.map(m => {
            const avatar = getDicebearAvatar(m.name, m.gender);
            return (
              <div key={m.email} className="flex items-center gap-3 p-3.5 rounded-xl transition-colors" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
                <img
                  src={avatar}
                  alt={m.name}
                  className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/10 shrink-0 bg-gray-100 dark:bg-emerald-950/30"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${TEXT_MAIN}`}>{m.name}</p>
                  <p className={`text-[11px] truncate ${TEXT_MUTED}`}>{m.email}</p>
                </div>
                <span className={`text-[11px] font-medium hidden sm:block ${TEXT_SUB}`}>{m.role}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#00c685] bg-[#00c685]/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
                  Active
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Organisation Tab ────────────────────────────────────────────────────── */
function OrganisationTab({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const GREEN = '#00c685';
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <InputField label="Organisation / Takaful Scheme Name" value="Takaful UK Community Pool" theme={theme} />
      <InputField label="Registered Head Office" value="107 Fenchurch Street, Financial District, London, EC3M 5JF" theme={theme} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="FCA Registration Reference" value="FRN 982143 (Designated Takaful Mutual)" theme={theme} />
        <InputField label="Shariah Supervisory Board Reference" value="SSB-UK-2024-TKF" theme={theme} />
      </div>
      <InputField label="Contact Support Email" value="support@takaful.co.uk" type="email" theme={theme} />
      <div className="flex items-center justify-between pt-2">
        {saved && (
          <span className="text-xs font-semibold text-[#00c685] flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Organisation details saved!
          </span>
        )}
        <span className="flex-1" />
        <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all shadow-sm" style={{ background: GREEN }}>
          Save Organisation
        </button>
      </div>
    </form>
  );
}

/* ─── Main Settings Page Router ───────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme } = useTheme();
  const { role } = useRole();
  const isLight = theme === 'light';
  const isManagement = role === 'management';

  // Filter nav items based on role (team & organisation are management-only)
  const SETTINGS_NAV = ALL_SETTINGS_NAV.filter(item => !item.managementOnly || isManagement);

  const [activeSection, setActiveSection] = useState('profile');

  // If the active section is no longer visible on role switch, fallback to profile
  useEffect(() => {
    const visible = SETTINGS_NAV.some(n => n.key === activeSection);
    if (!visible) setActiveSection('profile');
  }, [isManagement, SETTINGS_NAV, activeSection]);

  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto transition-colors duration-200">
      {/* Title Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>Account & System Settings</h1>
        <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>
          Configure profile personal details, authentication credentials, notifications, and permissions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="rounded-2xl p-3 h-fit space-y-1 transition-colors shadow-sm"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          {SETTINGS_NAV.map(item => {
            const Icon = item.icon;
            const isSelected = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-[#00c685]/15 text-[#00c685]'
                    : isLight
                    ? `${TEXT_SUB} hover:text-black hover:bg-black/[0.04]`
                    : `${TEXT_SUB} hover:text-white hover:bg-white/[0.04]`
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-[#00c685]' : TEXT_MUTED} />
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Content Body Panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="lg:col-span-3 rounded-2xl p-6 transition-colors shadow-sm"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div className="border-b pb-4 mb-5 flex items-center justify-between" style={{ borderColor: BORDER }}>
            <div>
              <h2 className={`font-bold text-sm ${TEXT_MAIN}`}>
                {SETTINGS_NAV.find(n => n.key === activeSection)?.label} Preferences
              </h2>
              <p className={`text-[11px] mt-0.5 ${TEXT_SUB}`}>
                {activeSection === 'profile' && 'Manage your account contact info and identity properties.'}
                {activeSection === 'security' && 'Manage passwords, two-factor authentication, and login safety.'}
                {activeSection === 'notifications' && 'Choose when and how you are alerted regarding claims and pool updates.'}
                {activeSection === 'team' && 'View internal operators and their designated access roles.'}
                {activeSection === 'organisation' && 'Update legal organisation entity details and references.'}
              </p>
            </div>
          </div>

          {activeSection === 'profile' && <ProfileTab theme={theme} role={role} />}
          {activeSection === 'security' && <SecurityTab theme={theme} />}
          {activeSection === 'notifications' && <NotificationsTab theme={theme} />}
          {activeSection === 'team' && <TeamTab theme={theme} />}
          {activeSection === 'organisation' && <OrganisationTab theme={theme} />}
        </motion.div>
      </div>
    </div>
  );
}
