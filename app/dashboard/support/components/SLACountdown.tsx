'use client';

import React, { useState, useEffect } from 'react';
import { computeSLAStatus, formatSLALabel } from '@/lib/dashboard/ticket-routing';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  createdAt: string;
  slaHours: number;
  status?: string;
  className?: string;
  showIcon?: boolean;
}

export function SLACountdown({
  createdAt,
  slaHours,
  status,
  className = '',
  showIcon = true,
}: Props) {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Update every 30 seconds
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // If already resolved or closed, SLA is satisfied
  if (status === 'Resolved' || status === 'Closed') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/30 ${className}`}
      >
        <CheckCircle2 size={10} />
        SLA Met
      </span>
    );
  }

  const sla = computeSLAStatus(createdAt, slaHours);
  const text = formatSLALabel(sla);

  const Icon =
    sla.label === 'BREACHED'
      ? AlertCircle
      : sla.label === 'AT RISK'
      ? AlertTriangle
      : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${className}`}
      style={{
        background: sla.bgColor,
        borderColor: `${sla.color}40`,
        color: sla.color,
      }}
      title={`SLA Target: ${slaHours}h. Current state: ${sla.label}`}
    >
      {showIcon && <Icon size={10} className={sla.label === 'BREACHED' ? 'animate-pulse' : ''} />}
      <span>{text}</span>
    </span>
  );
}
