'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeRoleContext';
import { usePermission } from '@/lib/dashboard/permissions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.06 } }),
};

const GREEN = '#00c685';

export default function RiskPage() {
  const { theme } = useTheme();
  const { role } = usePermission();
  const isLight = theme === 'light';

  // Check access authorization
  const hasAccess = role === 'management';

  if (!hasAccess) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert size={36} className="text-red-500 mx-auto" />
        <h2 className={`text-lg font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Access Restricted</h2>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/50' : 'text-white/45'}`}>
          Risk exposure analytics are restricted to Management Executives.
        </p>
        <Link href="/dashboard" className="inline-block text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: GREEN }}>
          Back to Overview
        </Link>
      </div>
    );
  }

  // Risk data
  const riskConcentrations = [
    { name: 'Storm & Wind', value: 42, color: '#3b82f6' },
    { name: 'Fire & Explosion', value: 28, color: '#ef4444' },
    { name: 'Flood & Ingress', value: 18, color: GREEN },
    { name: 'Theft & Break-in', value: 12, color: '#f59e0b' },
  ];

  const regionalExposures = [
    { region: 'Greater London', value: 1240000 },
    { region: 'West Midlands', value: 890000 },
    { region: 'Greater Manchester', value: 620000 },
    { region: 'West Yorkshire', value: 450000 },
    { region: 'Bristol & South', value: 310000 },
  ];

  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const TEXT_MAIN = isLight ? 'text-black/90' : 'text-white';
  const TEXT_SUB = isLight ? 'text-black/60' : 'text-white/45';
  const TEXT_MUTED = isLight ? 'text-black/40' : 'text-white/35';
  const CHART_GRID = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';

  return (
    <div className="p-4 sm:p-6 space-y-6 transition-colors duration-200">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${TEXT_MAIN}`}>Risk Exposure & Concentration</h1>
          <p className={`text-sm mt-0.5 ${TEXT_SUB}`}>Management dashboard of geographic and thematic risk concentrations</p>
        </div>
      </motion.div>

      {/* High-level risk warning banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
      >
        <AlertTriangle size={20} className="text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-red-400 text-sm font-semibold">Elevated Storm Concentration — West Midlands</p>
          <p className={`text-xs mt-1 leading-relaxed ${TEXT_SUB}`}>
            Our geographic risk audit indicates West Midlands exposures have increased to 28% of total portfolio value.
            Recommend tightening validation criteria for storm certificates in B-series postcodes.
          </p>
        </div>
      </motion.div>

      {/* Grid of risk exposure items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Risk Concentration Type */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="rounded-2xl p-5 flex flex-col justify-between transition-colors"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <div>
            <h3 className={`font-semibold text-sm mb-1 ${TEXT_MAIN}`}>Exposure by Risk Type</h3>
            <p className={`text-xs mb-5 ${TEXT_SUB}`}>Percentage of total insured asset value</p>
            <div className="flex justify-center mb-6">
              <PieChart width={160} height={140}>
                <Pie data={riskConcentrations} cx={80} cy={70} innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {riskConcentrations.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
              </PieChart>
            </div>
          </div>

          <div className="space-y-2">
            {riskConcentrations.map(r => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className={TEXT_SUB}>{r.name}</span>
                </span>
                <span className={`font-semibold ${TEXT_MAIN}`}>{r.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regional exposure liability limits */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="rounded-2xl p-5 transition-colors"
          style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          <h3 className={`font-semibold text-sm mb-1 ${TEXT_MAIN}`}>Insured Value by Region</h3>
          <p className={`text-xs mb-5 ${TEXT_SUB}`}>Total liability concentration limits in GBP</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalExposures} layout="vertical">
                <CartesianGrid horizontal={false} stroke={CHART_GRID} />
                <XAxis type="number" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000000).toFixed(1)}M`} />
                <YAxis dataKey="region" type="category" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                <RechartsTooltip formatter={(v: any) => `£${v.toLocaleString()}`} contentStyle={{ background: isLight ? '#fff' : '#0d2117', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" name="Total Liability" fill={GREEN} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
