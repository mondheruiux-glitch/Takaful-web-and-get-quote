"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, FileText, Clock, AlertCircle, ShieldCheck, Banknote } from "lucide-react";

export const GREEN = "#00c685";
export const ease = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, ease, delay: i * 0.04 } }),
};

export interface TrackerStep {
  key: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

export const CLAIM_TRACKER_STEPS: TrackerStep[] = [
  { key: 'Submitted', label: 'Submitted', desc: '18 Jul · Received', icon: FileText },
  { key: 'Under Review', label: 'Under Review', desc: 'Assessor inspecting', icon: Clock },
  { key: 'Awaiting Information', label: 'Evidence', desc: 'Report pending', icon: AlertCircle },
  { key: 'Approved', label: 'Approved', desc: 'Settlement agreed', icon: ShieldCheck },
  { key: 'Paid', label: 'Disbursed', desc: 'Funds transferred', icon: Banknote },
];

export function getClaimStepIndex(status: string): number {
  switch (status) {
    case 'Submitted': return 0;
    case 'Under Review': return 1;
    case 'Awaiting Information': return 2;
    case 'Approved': return 3;
    case 'Paid': return 4;
    default: return 1;
  }
}

export function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  color = GREEN,
  custom,
  delay = 0,
  theme,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ElementType;
  trend?: { dir: 'up' | 'down'; text: string };
  color?: string;
  custom?: React.ReactNode;
  delay?: number;
  theme: string;
}) {
  const isLight = theme === 'light';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={`rounded-2xl p-5 flex flex-col gap-3 ${isLight ? 'shadow-sm' : ''}`}
      style={{
        background: isLight ? '#fff' : '#0d2117',
        border: isLight ? '1px solid #E4E7EC' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/40' : 'text-white/35'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>{value}</p>
          {sub && <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{sub}</p>}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-gray-100 text-gray-700' : ''}`}
            style={!isLight ? { background: `${color}18`, color } : {}}
          >
            <Icon size={18} className={isLight ? 'text-gray-700' : ''} style={!isLight ? { color } : {}} />
          </div>
        )}
      </div>
      {custom}
      {trend && (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {trend.dir === 'up' ? (
            <TrendingUp size={13} className="text-[#00c685]" />
          ) : (
            <TrendingDown size={13} className="text-red-400" />
          )}
          <span className={trend.dir === 'up' ? 'text-[#00c685]' : 'text-red-400'}>{trend.text}</span>
        </div>
      )}
    </motion.div>
  );
}

export function SectionCard({
  title,
  children,
  action,
  theme,
  className,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  theme: string;
  className?: string;
}) {
  const isLight = theme === 'light';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl overflow-hidden ${isLight ? 'shadow-sm' : ''} ${className ?? ''}`}
      style={{
        background: isLight ? '#fff' : '#0d2117',
        border: isLight ? '1px solid #E4E7EC' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: isLight ? '1px solid #E4E7EC' : '1px solid rgba(255,255,255,0.05)' }}
      >
        <h3 className={`text-sm font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{title}</h3>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Submitted: 'bg-blue-500/15 text-blue-500',
    'Under Review': 'bg-amber-500/15 text-amber-500',
    'Awaiting Information': 'bg-orange-500/15 text-orange-500',
    Approved: 'bg-green-500/15 text-green-500',
    Rejected: 'bg-red-500/15 text-red-500',
    Paid: 'bg-emerald-500/15 text-emerald-500',
    Active: 'bg-green-500/15 text-green-500',
    Expiring: 'bg-amber-500/15 text-amber-500',
    Collected: 'bg-emerald-500/15 text-emerald-500',
    Failed: 'bg-red-500/15 text-red-500',
    Pending: 'bg-blue-500/15 text-blue-500',
    Retried: 'bg-orange-500/15 text-orange-500',
    Low: 'bg-emerald-500/15 text-emerald-500',
    Medium: 'bg-amber-500/15 text-amber-500',
    High: 'bg-orange-500/15 text-orange-500',
    Critical: 'bg-red-500/15 text-red-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-gray-500/15 text-gray-500'}`}>
      {status}
    </span>
  );
}
