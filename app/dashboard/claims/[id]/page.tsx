'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Clock, AlertTriangle, XCircle,
  FileText, Upload, MessageSquare, Phone, Mail,
  Building2, Home, Layers, User, CreditCard,
  Download, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

const GREEN = '#00c685';
const SURFACE = '#0d2117';
const SURFACE2 = '#112218';
const BORDER = 'rgba(255,255,255,0.07)';
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
  const claimId = params.id;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/claims" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all mt-0.5">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold font-mono">{claimId}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />Under Review
              </span>
            </div>
            <p className="text-white/40 text-xs mt-1">Buildings claim — Submitted 18 Jul 2026</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/8 text-white/50 text-xs hover:bg-white/5 transition-colors">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#0a1a14] transition-all hover:opacity-90" style={{ background: GREEN }}>
            Update Status
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Claim summary */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h2 className="text-white font-semibold text-sm mb-4">Claim Details</h2>
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
                  <p className="text-white/35 text-[10px] font-medium mb-0.5">{r.label}</p>
                  <p className={`text-white text-sm ${r.mono ? 'font-mono text-[#00c685]' : 'font-medium'}`}>{r.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className="text-white/35 text-[10px] font-medium mb-2">Incident Description</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Storm damage to roof during heavy rainfall on 16–17 July. Multiple roof tiles displaced causing water ingress into the loft space. Temporary tarping applied by emergency contractor. Structural integrity of remaining roof requires professional assessment.
              </p>
            </div>
          </motion.div>

          {/* Claim Timeline */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h2 className="text-white font-semibold text-sm mb-5">Claim Progress</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px" style={{ background: `linear-gradient(to bottom, ${GREEN}60, rgba(255,255,255,0.08) 70%)` }} />
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
                      background: step.done ? `${GREEN}20` : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${step.done ? GREEN : 'rgba(255,255,255,0.1)'}`,
                    }}>
                      {step.done && <CheckCircle2 size={12} style={{ color: GREEN }} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${step.done ? 'text-white' : 'text-white/35'}`}>{step.label}</p>
                        <p className={`text-[10px] ${step.done ? 'text-white/40' : 'text-white/20'}`}>{step.date}</p>
                      </div>
                      {step.note && <p className="text-white/40 text-xs mt-0.5">{step.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-sm">Documents & Evidence</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ color: GREEN, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
                <Upload size={11} /> Upload
              </button>
            </div>
            <div className="space-y-2">
              {DOCUMENTS.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.025] transition-colors" style={{ border: `1px solid ${BORDER}` }}>
                  <FileText size={16} className="text-white/30 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs font-medium truncate">{doc.name}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{doc.size} — {doc.date}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.status === 'Received' ? 'bg-[#00c685]/10 text-[#00c685]' : 'bg-amber-400/10 text-amber-400'}`}>
                    {doc.status}
                  </span>
                  {doc.status === 'Received' && (
                    <button className="text-white/25 hover:text-white/60 transition-colors">
                      <Download size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h2 className="text-white font-semibold text-sm mb-4">Internal Notes</h2>
            <div className="space-y-4">
              {NOTES.map((note, i) => (
                <div key={i} className="p-3.5 rounded-xl" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-[#0a1a14]" style={{ background: GREEN }}>
                      {note.author[0]}
                    </div>
                    <span className="text-white/70 text-xs font-semibold">{note.author}</span>
                    <span className="text-white/25 text-[10px]">{note.date}</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{note.text}</p>
                </div>
              ))}
              <textarea
                placeholder="Add internal note…"
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.03] border border-white/8 text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/30 resize-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Participant info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="rounded-2xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mb-3">Participant</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#0a1a14] shrink-0" style={{ background: GREEN }}>FA</div>
              <div>
                <p className="text-white font-semibold text-sm">Fatima Al-Rashid</p>
                <p className="text-white/35 text-[10px]">Member since Jan 2024</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href="mailto:f.alrashid@email.com" className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors">
                <Mail size={12} /><span>f.alrashid@email.com</span>
              </a>
              <a href="tel:+447700123456" className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors">
                <Phone size={12} /><span>+44 7700 123 456</span>
              </a>
            </div>
            <Link href="/dashboard/participants/P-0042" className="mt-3 flex items-center gap-1 text-[10px] font-semibold" style={{ color: GREEN }}>
              View profile <ExternalLink size={10} />
            </Link>
          </motion.div>

          {/* Certificate */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="rounded-2xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mb-3">Certificate</h3>
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
                  <span className="text-white/35 text-[10px]">{r.label}</span>
                  <span className="text-white/70 text-[10px] font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
            className="rounded-2xl p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wide mb-3">Quick Actions</h3>
            {[
              { label: 'Approve Claim', color: GREEN, dark: true },
              { label: 'Request Documents', color: '#f59e0b', dark: false },
              { label: 'Escalate Claim', color: '#3b82f6', dark: false },
              { label: 'Reject Claim', color: '#ef4444', dark: false },
            ].map(a => (
              <button key={a.label} className={`w-full text-xs font-semibold py-2.5 rounded-xl transition-all text-left px-3 ${a.dark ? 'text-[#0a1a14]' : ''}`}
                style={{ background: a.dark ? a.color : `${a.color}12`, color: a.dark ? '#0a1a14' : a.color, border: `1px solid ${a.color}25` }}>
                {a.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
