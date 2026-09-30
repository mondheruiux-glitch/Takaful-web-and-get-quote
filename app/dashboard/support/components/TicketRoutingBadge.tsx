'use client';

import React from 'react';
import { TicketCategory, UserRole } from '@/lib/dashboard/types';
import { CATEGORY_ROUTING } from '@/lib/dashboard/ticket-routing';
import { ArrowRight, Shield, CreditCard, FileText, Wrench, HelpCircle } from 'lucide-react';

interface Props {
  category: TicketCategory;
  routedToRole?: UserRole;
  showAssignee?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const CATEGORY_ICONS: Record<TicketCategory, React.ComponentType<{ size: number; className?: string }>> = {
  'Claim Inquiry': Shield,
  'Contribution': CreditCard,
  'Certificate': FileText,
  'Technical': Wrench,
  'General': HelpCircle,
};

const ROLE_LABELS: Record<UserRole, string> = {
  participant: 'Participant',
  claim_handler: 'Claims Handler',
  finance: 'Finance & Treasury',
  management: 'Executive Operations',
  super_admin: 'Super Admin',
};

const ROLE_COLORS: Record<UserRole, { text: string; bg: string; border: string }> = {
  claim_handler: { text: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
  finance: { text: '#00c685', bg: 'rgba(0,198,133,0.12)', border: 'rgba(0,198,133,0.25)' },
  management: { text: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' },
  super_admin: { text: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)' },
  participant: { text: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)' },
};

export function TicketRoutingBadge({
  category,
  routedToRole,
  showAssignee = false,
  className = '',
  size = 'sm',
}: Props) {
  const rule = CATEGORY_ROUTING[category] || CATEGORY_ROUTING['General'];
  const targetRole = routedToRole || rule.routedToRole;
  const roleStyle = ROLE_COLORS[targetRole] || ROLE_COLORS.claim_handler;
  const Icon = CATEGORY_ICONS[category] || HelpCircle;

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${className}`}
        style={{
          background: roleStyle.bg,
          borderColor: roleStyle.border,
          color: roleStyle.text,
        }}
      >
        <Icon size={11} />
        <span>{category}</span>
        <ArrowRight size={10} className="opacity-60" />
        <span className="font-bold">{ROLE_LABELS[targetRole]}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${className}`}
      style={{
        background: roleStyle.bg,
        borderColor: roleStyle.border,
        color: roleStyle.text,
      }}
    >
      <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-white/20 dark:bg-black/20">
        <Icon size={12} />
      </div>
      <span>{category}</span>
      <ArrowRight size={12} className="opacity-70" />
      <span className="font-bold">{ROLE_LABELS[targetRole]}</span>
      {showAssignee && (
        <span className="text-[11px] opacity-80 border-l pl-2 ml-1" style={{ borderColor: roleStyle.border }}>
          {rule.defaultAssignee.split('(')[0].trim()}
        </span>
      )}
    </div>
  );
}
