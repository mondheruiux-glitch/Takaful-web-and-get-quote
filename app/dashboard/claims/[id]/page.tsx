'use client';

import React, { useState } from 'react';
import { motion } from 'react';
import {
  ArrowLeft, CheckCircle2, Clock, AlertTriangle, XCircle,
  FileText, Upload, MessageSquare, Phone, Mail,
  Building2, Home, Layers, User, CreditCard,
  Download, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../../layout';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.08 } }),
};

/* ─── Claim Timeline ─────────────────────────────────────────────── */
const TIMELINE = [
  { label: 'Claim Submitted', date: '18 Jul 2026, 14:32', done: true, note: 'Submitted via online portal' },
  { label: 'Documents Received', date: '19 Jul 2026, 09:15', done: true, note: 'Property photos and incident report received' },
  { label: 'Under Review', date: '20 Jul 2026, 11:00', done: true, note: 'Assigned to assessor Omar Hassan' },
  { label: 'Assessor Visit Scheduled', date: '25 Jul 2026, 10:00', done: false, note: 'Property inspection pending' },
  { label: 'Decision', date: 'Pending', done: false, note: '' },
  { label: 'Payment', date: 'Pending', done: false, note: '' },
];

const DOCUMENTS = [
  { name: 'Incident Report.pdf', size: '1.2 MB', date: '18 Jul 2026', status: 'Received' },
  { name: 'Property Photos (x8).zip', size: '14.5 MB', date: '19 Jul 2026', status: 'Received' },
  { name: 'Takaful Certificate.pdf', size: '0.8 MB', date: '19 Jul 2026', status: 'Received' },
  { name: 'Assessor Report.pdf', size: '—', date: '—', status: 'Awaiting' },
];

const NOTES = [
  { author: 'Omar Hassan', date: '20 Jul 2026', text: 'Property inspection confirmed roof damage consistent with storm on 16-17 Jul. Estimate aligns with claimed amount. Awaiting assessor visit report before final decision.' },
  { author: 'System', date: '19 Jul 2026', text: 'All required documentation received. Claim progressed to Under Review status.' },
];

type Props = { params: { id: string } };

export default function ClaimDetailPage({ params }: Props) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const claimId = params.id;

  // Dynamic colors
  const GREEN = '#00c685';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL2 = isLight ? '#f4f6f5' : '#112218';
  const TEXT_MAIN = isLight ? 'text-black' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/50' : 'text-white/40';
  const TEXT_MUTED = isLight ? 'text-black/35' : 'text-white/30';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/claims" className={`p-2 rounded-xl transition-all mt-0.5 ${isLight ? 'text-black/40 hover:text-black hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-bold font-mono ${TEXT_MAIN}`}>{claimId}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Under Review
              </span>
            </div>
            <p className={`text-xs mt-1 ${TEXT_MUTED}`}>Buildings claim — Submitted 18 Jul 2026</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-colors ${isLight ? 'border-black/10 text-black/50 hover:bg-black/5' : 'border-white/8 text-white/50 hover:bg-white/5'}`}>
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: GREEN }}>
            Update Status
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Claim summary */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <h2 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>Claim Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Participant', value: 'Fatima Al-Rashid', mono: false },
                { label: 'Certificate', value: 'TK-2024-0042', mono: true },
                { label: 'Property', value: '14 Elm Street, Birmingham, B1 2PQ', mono: false },
                { label: 'Cover Type', value: 'Buildings Only', mono: false },
                { label: 'Incident Date', value: '18 Jul 2026', mono: false },
                { label: 'Reported Date', value: '18 Jul 2026', mono: false },
                { label: 'Claimed Amount', value: '£4,200', mono: false },
                { label: 'Approved Amount', value: '—', mono: false },
                { label: 'Assigned To', value: 'Omar Hassan', mono: false },
                { label: 'Priority', value: 'High', mono: false },
              ].map(r => (
                <div key={r.label}>
                  <p className={`text-[10px] font-medium mb-0.5 ${TEXT_MUTED}`}>{r.label}</p>
                  <p className={`text-sm ${r.mono ? 'font-mono text-[#00c685]' : `font-medium ${TEXT_MAIN}`}`}>{r.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className={`text-[10px] font-medium mb-2 ${TEXT_MUTED}`}>Incident Description</p>
              <p className={`text-sm leading-relaxed ${TEXT_SUB}`}>
                Storm damage to roof during heavy rainfall on 16–17 July. Multiple roof tiles displaced causing water ingress into the loft space. Temporary tarping applied by emergency contractor. Structural integrity of remaining roof requires professional assessment.
              </p>
            </div>
          </motion.div>

          {/* Claim Timeline */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <h2 className={`font-semibold text-sm mb-5 ${TEXT_MAIN}`}>Claim Progress</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px" style={{ background: `linear-gradient(to bottom, ${GREEN}60, ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} 70%)` }} />
              <div className="space-y-0">
                {TIMELINE.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex gap-4 pb-5 last:pb-0"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 mt-0.5" style={{
                      background: step.done ? `${GREEN}20` : isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${step.done ? GREEN : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                      {step.done && <CheckCircle2 size={12} style={{ color: GREEN }} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${step.done ? TEXT_MAIN : TEXT_MUTED}`}>{step.label}</p>
                        <p className={`text-[10px] ${step.done ? TEXT_SUB : TEXT_MUTED}`}>{step.date}</p>
                      </div>
                      {step.note && <p className={`text-xs mt-0.5 ${TEXT_SUB}`}>{step.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold text-sm ${TEXT_MAIN}`}>Documents & Evidence</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ color: GREEN, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
                <Upload size={11} /> Upload
              </button>
            </div>
            <div className="space-y-2">
              {DOCUMENTS.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.01] dark:hover:bg-white/[0.015] transition-colors" style={{ border: `1px solid ${BORDER}` }}>
                  <FileText size={16} className={`${TEXT_MUTED} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${TEXT_MAIN}`}>{doc.name}</p>
                    <p className={`text-[10px] mt-0.5 ${TEXT_MUTED}`}>{doc.size} — {doc.date}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.status === 'Received' ? 'bg-[#00c685]/10 text-[#00c685]' : 'bg-amber-500/10 text-amber-500'}`}>
                    {doc.status}
                  </span>
                  {doc.status === 'Received' && (
                    <button className={`${TEXT_MUTED} hover:text-black dark:hover:text-white transition-colors`}>
                      <Download size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="rounded-2xl p-5 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <h2 className={`font-semibold text-sm mb-4 ${TEXT_MAIN}`}>Internal Notes</h2>
            <div className="space-y-4">
              {NOTES.map((note, i) => (
                <div key={i} className="p-3.5 rounded-xl transition-colors" style={{ background: BG_PANEL2, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: GREEN }}>
                      {note.author[0]}
                    </div>
                    <span className={`text-xs font-semibold ${TEXT_MAIN}`}>{note.author}</span>
                    <span className={`text-[10px] ${TEXT_MUTED}`}>{note.date}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${TEXT_SUB}`}>{note.text}</p>
                </div>
              ))}
              <textarea
                placeholder="Add internal note…"
                rows={2}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none focus:border-[#00c685]/30 resize-none bg-black/[0.02] dark:bg-white/[0.03] ${isLight ? 'border-black/10 text-black placeholder:text-black/25' : 'border-white/8 text-white placeholder:text-white/20'}`}
              />
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Participant info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="rounded-2xl p-4 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <h3 className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${TEXT_MUTED}`}>Participant</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: GREEN }}>FA</div>
              <div>
                <p className={`font-semibold text-sm ${TEXT_MAIN}`}>Fatima Al-Rashid</p>
                <p className={`text-[10px] ${TEXT_MUTED}`}>Member since Jan 2024</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href="mailto:f.alrashid@email.com" className={`flex items-center gap-2 text-xs hover:text-[#00c685] transition-colors ${TEXT_SUB}`}>
                <Mail size={12} /><span>f.alrashid@email.com</span>
              </a>
              <a href="tel:+447700123456" className={`flex items-center gap-2 text-xs hover:text-[#00c685] transition-colors ${TEXT_SUB}`}>
                <Phone size={12} /><span>+44 7700 123 456</span>
              </a>
            </div>
            <Link href="/dashboard/participants/P-0042" className="mt-3 flex items-center gap-1 text-[10px] font-semibold" style={{ color: GREEN }}>
              View profile <ExternalLink size={10} />
            </Link>
          </motion.div>

          {/* Certificate */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="rounded-2xl p-4 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <h3 className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${TEXT_MUTED}`}>Certificate</h3>
            <p className="font-mono text-[#00c685] text-sm font-semibold mb-3">TK-2024-0042</p>
            <div className="space-y-2">
              {[
                { label: 'Status', value: 'Active' },
                { label: 'Property', value: '14 Elm Street, Birmingham' },
                { label: 'Cover', value: 'Buildings — £350,000' },
                { label: 'Contribution', value: '£38.50 / mo' },
                { label: 'Renewal', value: '15 Jan 2027' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className={`text-[10px] ${TEXT_MUTED}`}>{r.label}</span>
                  <span className={`text-[10px] font-medium ${TEXT_SUB}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
            className="rounded-2xl p-4 space-y-2 transition-colors duration-200" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <h3 className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${TEXT_MUTED}`}>Quick Actions</h3>
            {[
              { label: 'Approve Claim', color: GREEN, dark: true },
              { label: 'Request Documents', color: '#f59e0b', dark: false },
              { label: 'Escalate Claim', color: '#3b82f6', dark: false },
              { label: 'Reject Claim', color: '#ef4444', dark: false },
            ].map(a => (
              <button key={a.label} className={`w-full text-xs font-semibold py-2.5 rounded-xl transition-all text-left px-3 ${a.dark ? 'text-white' : ''}`}
                style={{ background: a.dark ? a.color : `${a.color}12`, color: a.dark ? 'white' : a.color, border: `1px solid ${a.color}25` }}>
                {a.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
