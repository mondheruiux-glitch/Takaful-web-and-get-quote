'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog, UserPlus, Shield, Users, Award, TrendingUp,
  Clock, CheckCircle2, AlertTriangle, AlertCircle, Search,
  Filter, Plus, MoreVertical, X, Phone, Mail, ChevronRight,
  ShieldCheck, ArrowUpRight, DollarSign, Activity, Sparkles,
  Zap, Star, Lock, RefreshCw, BarChart3, HelpCircle,
} from 'lucide-react';
import { useRole, useTheme } from '../ThemeRoleContext';
import { STAFF_MEMBERS } from '@/lib/dashboard/mock-data';
import { StaffMember } from '@/lib/dashboard/types';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

const GREEN = '#00c685';
const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease, delay: i * 0.04 },
  }),
};

export default function StaffManagementPage() {
  const { role } = useRole();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // State
  const [staffList, setStaffList] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'claim_handler' | 'finance' | 'management'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'On Leave' | 'Suspended'>('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New staff form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'claim_handler' as 'claim_handler' | 'finance' | 'management',
    title: '',
    department: 'Claims & Triage',
    gender: 'male' as 'male' | 'female',
    dailyApprovalLimit: 5000,
  });

  // Theme styling tokens
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white/90';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/50';

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || s.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  // Aggregate metrics
  const totalClaimsResolved = staffList.reduce((acc, s) => acc + (s.claimsResolved || 0), 0);
  const avgTeamSLA = (staffList.reduce((acc, s) => acc + (s.slaRate || 95), 0) / staffList.length).toFixed(1);
  const totalFraudPrevented = staffList.reduce((acc, s) => acc + (s.fraudPreventedAmount || 0), 0);
  const avgCSAT = (staffList.reduce((acc, s) => acc + (s.csatScore || 4.7), 0) / staffList.length).toFixed(1);

  // Handlers
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const initials = newStaff.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const created: StaffMember = {
      id: `STF-00${staffList.length + 1}`,
      name: newStaff.name,
      initials,
      email: newStaff.email,
      role: newStaff.role,
      title: newStaff.title || (newStaff.role === 'claim_handler' ? 'Claims Specialist' : newStaff.role === 'finance' ? 'Finance Officer' : 'Operations Manager'),
      department: newStaff.department,
      status: 'Active',
      joinedDate: 'Today',
      gender: newStaff.gender,
      dailyApprovalLimit: newStaff.dailyApprovalLimit,
      slaRate: 100,
      csatScore: 5.0,
      claimsResolved: 0,
      avgResolutionDays: 1.0,
      irregularitiesFlagged: 0,
      fraudPreventedAmount: 0,
    };

    setStaffList([created, ...staffList]);
    setIsAddModalOpen(false);
    setNewStaff({
      name: '',
      email: '',
      role: 'claim_handler',
      title: '',
      department: 'Claims & Triage',
      gender: 'male',
      dailyApprovalLimit: 5000,
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus as any } : s))
    );
    if (selectedStaff && selectedStaff.id === id) {
      setSelectedStaff((prev) => prev ? { ...prev, status: nextStatus as any } : null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-12 transition-colors duration-200">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-xl font-bold tracking-tight ${TEXT_MAIN}`}>
              Staff & Role Operations Cockpit
            </h1>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}
            >
              <ShieldCheck size={12} />
              Super Admin Level
            </span>
          </div>
          <p className={`text-xs mt-1 ${TEXT_SUB}`}>
            Provision new team members, adjust clearance thresholds, and monitor real-time SLA and fraud prevention performance.
          </p>
        </div>

        {/* Action Button: Add Claim Handler / Staff */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.98] shrink-0"
          style={{ background: GREEN }}
        >
          <UserPlus size={15} />
          Add Staff Member
        </button>
      </motion.div>

      {/* ── Super Admin Performance & Monetization Cockpit ─────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* KPI 1: Active Staff */}
        <div
          className="p-4 rounded-2xl border transition-all"
          style={{ background: BG_PANEL, borderColor: BORDER }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${TEXT_SUB}`}>Staff Strength</span>
            <div className="p-2 rounded-xl bg-[#00c685]/10 text-[#00c685]">
              <Users size={16} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${TEXT_MAIN}`}>{staffList.length}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#00c685]">
            <CheckCircle2 size={12} />
            <span>{staffList.filter(s => s.status === 'Active').length} active on shift</span>
          </div>
        </div>

        {/* KPI 2: Team Resolution & Volume */}
        <div
          className="p-4 rounded-2xl border transition-all"
          style={{ background: BG_PANEL, borderColor: BORDER }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${TEXT_SUB}`}>Total Claims Handled</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${TEXT_MAIN}`}>{totalClaimsResolved}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-blue-400">
            <span>Avg {avgCSAT} ★ Participant CSAT</span>
          </div>
        </div>

        {/* KPI 3: SLA Efficiency */}
        <div
          className="p-4 rounded-2xl border transition-all"
          style={{ background: BG_PANEL, borderColor: BORDER }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${TEXT_SUB}`}>Handler SLA Compliance</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Zap size={16} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${TEXT_MAIN}`}>{avgTeamSLA}%</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-400">
            <span>Target: &gt;95.0% resolution window</span>
          </div>
        </div>

        {/* KPI 4: Fraud Protected Value */}
        <div
          className="p-4 rounded-2xl border transition-all"
          style={{ background: BG_PANEL, borderColor: BORDER }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${TEXT_SUB}`}>Pool Value Protected</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Shield size={16} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${TEXT_MAIN}`}>£{totalFraudPrevented.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-400">
            <span>Forensic flags referred to Mgmt</span>
          </div>
        </div>
      </motion.div>

      {/* ── Filter & Search Toolbar ─────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl border"
        style={{ background: BG_PANEL, borderColor: BORDER }}
      >
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${TEXT_SUB}`} />
          <input
            type="text"
            placeholder="Search staff by name, email, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-transparent border outline-none transition-all focus:border-[#00c685] ${TEXT_MAIN}`}
            style={{ borderColor: BORDER }}
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={(val: any) => setRoleFilter(val)}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="claim_handler">Claim Handlers</SelectItem>
              <SelectItem value="finance">Finance Team</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* ── Staff Table with Performance Metrics ────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="rounded-2xl border overflow-hidden shadow-xs"
        style={{ background: BG_PANEL, borderColor: BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b text-[11px] font-semibold uppercase tracking-wider"
                style={{ borderColor: BORDER, color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}
              >
                <th className="py-3.5 px-5">Staff Member</th>
                <th className="py-3.5 px-5">Role & Dept</th>
                <th className="py-3.5 px-5 text-center">SLA Compliance</th>
                <th className="py-3.5 px-5 text-center">Cases / Payouts</th>
                <th className="py-3.5 px-5 text-center">Approval Limit</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: BORDER }}>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users size={32} className={`mx-auto mb-2 opacity-30 ${TEXT_MAIN}`} />
                    <p className={`font-semibold ${TEXT_MAIN}`}>No staff members found</p>
                    <p className={`text-xs mt-1 ${TEXT_SUB}`}>Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const avatar = getDicebearAvatar(staff.name, staff.gender);

                  return (
                    <tr
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className={`cursor-pointer transition-colors ${
                        isLight ? 'hover:bg-black/[0.02]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Member Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={staff.name}
                            className="w-9 h-9 rounded-xl shrink-0 border"
                            style={{ borderColor: BORDER }}
                          />
                          <div>
                            <div className={`font-semibold ${TEXT_MAIN}`}>{staff.name}</div>
                            <div className={`text-[11px] ${TEXT_SUB}`}>{staff.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              background:
                                staff.role === 'claim_handler'
                                  ? '#00c68515'
                                  : staff.role === 'finance'
                                  ? 'rgba(59,130,246,0.15)'
                                  : 'rgba(168,85,247,0.15)',
                              color:
                                staff.role === 'claim_handler'
                                  ? '#00c685'
                                  : staff.role === 'finance'
                                  ? '#3b82f6'
                                  : '#a855f7',
                            }}
                          >
                            {staff.role === 'claim_handler'
                              ? 'Claims Handler'
                              : staff.role === 'finance'
                              ? 'Finance Officer'
                              : 'Operations Manager'}
                          </span>
                          <div className={`text-[11px] truncate max-w-[140px] ${TEXT_SUB}`}>
                            {staff.title}
                          </div>
                        </div>
                      </td>

                      {/* SLA Gauge */}
                      <td className="py-3.5 px-5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-bold ${TEXT_MAIN}`}>
                            {staff.slaRate ? `${staff.slaRate}%` : '—'}
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10 mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${staff.slaRate || 0}%`,
                                background: (staff.slaRate || 0) >= 95 ? GREEN : '#f59e0b',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Workload / Volume */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`font-semibold ${TEXT_MAIN}`}>
                          {staff.role === 'claim_handler'
                            ? `${staff.claimsResolved || 0} claims`
                            : staff.role === 'finance'
                            ? `${staff.financePayoutsProcessed || 0} payouts`
                            : `${staff.claimsResolved || 0} audits`}
                        </span>
                        {staff.csatScore && (
                          <div className="text-[10px] text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                            <Star size={10} className="fill-amber-400" />
                            <span>{staff.csatScore}</span>
                          </div>
                        )}
                      </td>

                      {/* Daily Approval Limit */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`font-mono font-medium ${TEXT_MAIN}`}>
                          £{staff.dailyApprovalLimit?.toLocaleString() ?? '10,000'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            staff.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : staff.status === 'On Leave'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              staff.status === 'Active'
                                ? 'bg-emerald-500'
                                : staff.status === 'On Leave'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                          {staff.status}
                        </span>
                      </td>

                      {/* Quick Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStaff(staff);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isLight ? 'border-gray-200 hover:bg-gray-100 text-gray-700' : 'border-white/10 hover:bg-white/5 text-gray-300'
                          }`}
                          title="View Staff Profile & Performance"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Slide-Over Profile & Performance Inspector ─────────────────── */}
      <AnimatePresence>
        {selectedStaff && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStaff(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-y-auto p-6 border-l shadow-2xl flex flex-col justify-between"
              style={{ background: isLight ? '#ffffff' : '#131720', borderColor: BORDER }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: BORDER }}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${TEXT_SUB}`}>
                    Staff Clearance & Audit Dossier
                  </span>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Profile Avatar Card */}
                <div className="flex items-center gap-4">
                  <img
                    src={getDicebearAvatar(selectedStaff.name, selectedStaff.gender)}
                    alt={selectedStaff.name}
                    className="w-16 h-16 rounded-2xl border shadow-sm"
                    style={{ borderColor: BORDER }}
                  />
                  <div>
                    <h3 className={`text-base font-bold ${TEXT_MAIN}`}>{selectedStaff.name}</h3>
                    <p className={`text-xs ${TEXT_SUB}`}>{selectedStaff.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                        {selectedStaff.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedStaff.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {selectedStaff.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operational Performance Matrix */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${TEXT_SUB}`}>
                    Key Performance Indicators (KPIs)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: BORDER }}>
                      <span className={`text-[11px] ${TEXT_SUB}`}>SLA Compliance</span>
                      <div className="text-lg font-bold text-[#00c685] mt-0.5">
                        {selectedStaff.slaRate}%
                      </div>
                      <span className="text-[10px] text-gray-400">Within 48h SLA</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: BORDER }}>
                      <span className={`text-[11px] ${TEXT_SUB}`}>Participant CSAT</span>
                      <div className="text-lg font-bold text-amber-400 mt-0.5">
                        {selectedStaff.csatScore} / 5.0
                      </div>
                      <span className="text-[10px] text-gray-400">Post-resolution rating</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: BORDER }}>
                      <span className={`text-[11px] ${TEXT_SUB}`}>Fraud Detected / Flagged</span>
                      <div className="text-lg font-bold text-purple-400 mt-0.5">
                        £{(selectedStaff.fraudPreventedAmount || 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-gray-400">{selectedStaff.irregularitiesFlagged || 0} flagged cases</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: BORDER }}>
                      <span className={`text-[11px] ${TEXT_SUB}`}>Authority Limit</span>
                      <div className="text-lg font-bold text-blue-400 mt-0.5">
                        £{(selectedStaff.dailyApprovalLimit || 5000).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-gray-400">Per-case signoff</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Credentials */}
                <div className="p-4 rounded-xl border space-y-2.5 text-xs" style={{ borderColor: BORDER }}>
                  <div className="flex justify-between items-center">
                    <span className={TEXT_SUB}>Email:</span>
                    <span className={`font-mono ${TEXT_MAIN}`}>{selectedStaff.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={TEXT_SUB}>Department:</span>
                    <span className={TEXT_MAIN}>{selectedStaff.department}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={TEXT_SUB}>Joined Service:</span>
                    <span className={TEXT_MAIN}>{selectedStaff.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Super Admin */}
              <div className="pt-6 border-t space-y-2 shrink-0" style={{ borderColor: BORDER }}>
                <button
                  onClick={() => handleToggleStatus(selectedStaff.id, selectedStaff.status)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedStaff.status === 'Active'
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}
                >
                  <Lock size={14} />
                  {selectedStaff.status === 'Active' ? 'Suspend Staff Clearance' : 'Reinstate Staff Clearance'}
                </button>

                <button
                  onClick={() => setSelectedStaff(null)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                    isLight ? 'border-gray-200 text-gray-600 hover:bg-gray-100' : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add Staff Member Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl z-10"
              style={{ background: isLight ? '#ffffff' : '#0d2117', borderColor: BORDER }}
            >
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: BORDER }}>
                <div>
                  <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Provision New Staff Clearance</h3>
                  <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>Create and assign role permissions to a new team member.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4 pt-4 text-xs">
                {/* Name */}
                <div>
                  <label className={`block font-medium mb-1.5 ${TEXT_MAIN}`}>Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mansour"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none focus:border-[#00c685] ${TEXT_MAIN}`}
                    style={{ borderColor: BORDER }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block font-medium mb-1.5 ${TEXT_MAIN}`}>Official Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. t.mansour@takaful.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none focus:border-[#00c685] ${TEXT_MAIN}`}
                    style={{ borderColor: BORDER }}
                  />
                </div>

                {/* Role Assignment & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-medium mb-1.5 ${TEXT_MAIN}`}>Departmental Role *</label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(val: any) =>
                        setNewStaff({
                          ...newStaff,
                          role: val,
                          department:
                            val === 'claim_handler'
                              ? 'Claims & Triage'
                              : val === 'finance'
                              ? 'Finance & Tabarru Pool'
                              : 'Executive Operations',
                        })
                      }
                    >
                      <SelectTrigger className="h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claim_handler">Claim Handler</SelectItem>
                        <SelectItem value="finance">Finance Officer</SelectItem>
                        <SelectItem value="management">Operations Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className={`block font-medium mb-1.5 ${TEXT_MAIN}`}>Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Claims Specialist"
                      value={newStaff.title}
                      onChange={(e) => setNewStaff({ ...newStaff, title: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none focus:border-[#00c685] ${TEXT_MAIN}`}
                      style={{ borderColor: BORDER }}
                    />
                  </div>
                </div>

                {/* Daily Approval Limit & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-medium mb-1.5 ${TEXT_MAIN}`}>Daily Signoff Limit (£)</label>
                    <input
                      type="number"
                      value={newStaff.dailyApprovalLimit}
                      onChange={(e) => setNewStaff({ ...newStaff, dailyApprovalLimit: Number(e.target.value) })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none focus:border-[#00c685] ${TEXT_MAIN}`}
                      style={{ borderColor: BORDER }}
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-1.5 ${TEXT_MAIN}`}>Avatar Gender</label>
                    <Select
                      value={newStaff.gender}
                      onValueChange={(val: any) => setNewStaff({ ...newStaff, gender: val })}
                    >
                      <SelectTrigger className="h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                      isLight ? 'border-gray-200 text-gray-600' : 'border-white/10 text-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95"
                    style={{ background: GREEN }}
                  >
                    Confirm & Grant Clearance
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
