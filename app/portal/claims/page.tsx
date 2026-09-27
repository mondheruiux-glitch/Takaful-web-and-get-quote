'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CLAIMS } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.06 } }),
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Submitted':            'bg-blue-500/15 text-blue-500',
    'Under Review':         'bg-amber-500/15 text-amber-500',
    'Awaiting Information': 'bg-orange-500/15 text-orange-500',
    'Approved':             'bg-green-500/15 text-green-500',
    'Rejected':             'bg-red-500/15 text-red-500',
    'Paid':                 'bg-emerald-500/15 text-emerald-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-gray-500/15 text-gray-500'}`}>
      {status}
    </span>
  );
}

export default function PortalClaimsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const allMyClaims = CLAIMS.filter(c => c.participantId === 'P-0042');

  const myClaims = allMyClaims
    .filter(c =>
      statusFilter === 'All' ||
      (statusFilter === 'In Review' && !['Paid', 'Approved', 'Rejected'].includes(c.status)) ||
      (statusFilter === 'Approved' && ['Approved', 'Paid'].includes(c.status)) ||
      c.status === statusFilter
    )
    .filter(c =>
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide bg-white/[0.04] border-white/[0.08] text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          Mutual Protection
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08] text-white">
              My Claims
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl text-white/45">
              Track and manage your Takaful claims. Your community pool is here to support you.
            </p>
          </div>
          <Link href="/portal/claims/new">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto bg-white text-gray-900 shadow-sm">
              <Plus size={15} />
              New Claim
            </button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by claim ID or type…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/25"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'In Review', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-[#00c685]/15 text-[#00c685]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {myClaims.length === 0 ? (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="rounded-3xl p-14 text-center border bg-white/[0.02] border-white/[0.05]"
        >
          <FileText size={36} className="mx-auto mb-4 text-white/20" />
          <p className="text-sm font-medium text-white/35">
            {search || statusFilter !== 'All' ? 'No claims match your filters.' : 'No claims yet. Click "New Claim" when you need support.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {myClaims.map((c, i) => (
            <motion.div key={c.id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 2}>
              <Link
                href={`/portal/claims/${c.id}`}
                className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all hover:shadow-sm group ${
                  c.status === 'Rejected'
                    ? 'bg-red-950/10 border-red-500/15 hover:border-red-500/25'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    c.status === 'Rejected' ? 'bg-red-100 text-red-500' : 'bg-white/[0.08] text-white/70'
                  }`}>
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-semibold text-white/40">{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-sm font-semibold truncate text-white">{c.type}</p>
                    <p className="text-xs mt-0.5 truncate text-white/35">
                      {c.propertyAddress} · Submitted {c.submittedDate}
                    </p>
                    {c.status === 'Rejected' && c.rejectionReason && (
                      <p className="text-xs mt-2 text-red-400">
                        <span className="font-semibold">Reason: </span>{c.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-base font-bold text-white">
                      £{c.amountClaimed.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-white/30">Claimed</p>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-[#00c685] transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
