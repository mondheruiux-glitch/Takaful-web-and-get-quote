'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, MapPin, Building, Key, Download, HelpCircle, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { CERTIFICATES } from '@/lib/dashboard/mock-data';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

export default function MyCoverPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Load Participant Fatima Al-Rashid's active certificate
  const cert = CERTIFICATES.find(c => c.participantId === 'P-0042') || CERTIFICATES[0];

  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={`p-2.5 rounded-xl transition-all ${isLight ? 'text-black/40 hover:text-black hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>My Cover Details</h1>
            <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Detailed view of your Takaful protection schedule</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 self-start sm:self-center" style={{ background: GREEN }}>
          <Download size={13} /> Download Certificate PDF
        </button>
      </motion.div>

      {/* Main Certificate Card */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        {/* Certificate banner header */}
        <div className="px-6 py-5 flex items-center justify-between border-b flex-wrap gap-3" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-[#00c685]" />
            <div>
              <p className={`text-xs font-semibold ${TEXT_MUTED}`}>CERTIFICATE REFERENCE</p>
              <p className="font-mono text-base font-bold text-[#00c685]">{cert.id}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
            Active
          </span>
        </div>

        {/* Coverage Limits */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${TEXT_MUTED}`}>Insured Property</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <MapPin size={14} className={`${TEXT_MUTED} mt-0.5 shrink-0`} />
                <span className={TEXT_SUB}>{cert.propertyAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Building size={14} className={TEXT_MUTED} />
                <span className={TEXT_SUB}>{cert.propertyType}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${TEXT_MUTED}`}>Mutual Contributions</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={TEXT_SUB}>Monthly Contribution</span>
                <span className={`font-semibold ${TEXT_MAIN}`}>£{cert.monthlyContribution.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className={TEXT_SUB}>Cover Period</span>
                <span className={`font-semibold ${TEXT_MAIN}`}>{cert.startDate} – {cert.renewalDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic cover limits breakdown */}
        <div className="px-6 py-5 bg-black/[0.01] dark:bg-white/[0.01] border-t" style={{ borderColor: BORDER }}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${TEXT_MUTED}`}>Cover Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/[0.015] dark:bg-white/[0.015]" style={{ border: `1px solid ${BORDER}` }}>
              <p className={`text-[10px] font-semibold ${TEXT_MUTED}`}>BUILDINGS COVER</p>
              <p className={`text-xl font-bold mt-1 ${TEXT_MAIN}`}>£{cert.buildingsLimit.toLocaleString()}</p>
              <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>Reinstatement value including debris removal costs</p>
            </div>
            <div className="p-4 rounded-xl bg-black/[0.015] dark:bg-white/[0.015]" style={{ border: `1px solid ${BORDER}` }}>
              <p className={`text-[10px] font-semibold ${TEXT_MUTED}`}>CONTENTS COVER</p>
              <p className={`text-xl font-bold mt-1 ${TEXT_MAIN}`}>£{cert.contentsLimit.toLocaleString()}</p>
              <p className={`text-[10px] mt-1 ${TEXT_SUB}`}>Alternative accommodation limits up to 20% of cover</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Covered Risks list */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="rounded-2xl p-5"
        style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        <h3 className={`text-sm font-semibold mb-4 ${TEXT_MAIN}`}>Mutually Shared Covered Risks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cert.coveredRisks.map(r => (
            <div key={r} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/[0.01] dark:bg-white/[0.015] text-xs">
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-500/10 text-green-500">
                <Check size={11} />
              </div>
              <span className={TEXT_SUB}>{r}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
        className="rounded-2xl p-5 flex items-start gap-3 bg-black/[0.01] dark:bg-white/[0.01]"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <HelpCircle size={18} className={`${TEXT_MUTED} shrink-0 mt-0.5`} />
        <div>
          <h4 className={`text-xs font-semibold ${TEXT_MAIN}`}>Need to update your limits?</h4>
          <p className={`text-xs mt-1 leading-relaxed ${TEXT_SUB}`}>
            If you need to make extensions to your cover details, add contents protection, or update your property rebuild valuation, please contact the Takaful operations team using the support workspace.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
