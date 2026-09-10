'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Search, CheckCircle2, RefreshCw, X,
  Building2, ShieldCheck, AlertCircle, Loader2, Info, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { useTheme, useRole } from '../ThemeRoleContext';
import { CONTRIBUTIONS, CONTRIBUTION_TREND } from '@/lib/dashboard/mock-data';
import { Contribution } from '@/lib/dashboard/types';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease, delay: i * 0.07 } }),
};
const GREEN = '#00c685';

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmtSort = (v: string) => v.replace(/\D/g, '').slice(0, 6).replace(/(\d{2})(?=\d)/g, '$1-').slice(0, 8);
const fmtAcc  = (v: string) => v.replace(/\D/g, '').slice(0, 8);

/* ─── StatusBadge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const isPaid = status === 'Paid' || status === 'Collected';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isPaid
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
        : status === 'Failed'
        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
}

/* ─── Chart Tooltip ──────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, theme }: any) {
  if (!active || !payload?.length) return null;
  const isLight = theme === 'light';
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl"
      style={{ background: isLight ? '#fff' : '#0d2117', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`, color: isLight ? '#000' : '#fff' }}>
      <p className="opacity-50 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="opacity-70">{p.name}:</span>
          <span className="font-semibold">£{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Bank Mandate Modal ─────────────────────────────────────────────────── */
interface MandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { bankName: string; sortCode: string; accountNumber: string }) => void;
  existing?: { bankName: string; sortCode: string; last4: string };
  theme: string;
}

function BankMandateModal({ isOpen, onClose, onSuccess, existing, theme }: MandateModalProps) {
  const isLight = theme === 'light';
  const BG_MODAL   = isLight ? '#ffffff'              : 'rgba(10,26,20,0.90)';
  const BG_FIELD   = isLight ? 'rgba(0,0,0,0.03)'    : 'rgba(255,255,255,0.05)';
  const BORDER_COL = isLight ? '#E4E7EC'              : 'rgba(255,255,255,0.08)';
  const TEXT_MAIN  = isLight ? 'rgba(0,0,0,0.85)'    : '#ffffff';
  const TEXT_SUB   = isLight ? 'rgba(0,0,0,0.50)'    : 'rgba(255,255,255,0.55)';
  const TEXT_MUTED = isLight ? 'rgba(0,0,0,0.35)'    : 'rgba(255,255,255,0.30)';
  const INPUT_CLS  = isLight
    ? 'bg-black/[0.03] border-black/[0.08] text-black placeholder:text-black/30 focus-visible:border-[#00c685]/50 focus-visible:ring-0 text-sm h-9'
    : 'bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00c685]/40 focus-visible:ring-0 text-sm h-9';
  const LABEL_CLS  = isLight ? 'text-black/65 text-xs' : 'text-white/70 text-xs';
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ accountName: '', bankName: '', sortCode: '', accountNumber: '', confirmAccNum: '', agree: false });

  useEffect(() => {
    if (isOpen) { setStep(1); setDone(false); setSaving(false); setErrors({}); setForm({ accountName: '', bankName: '', sortCode: '', accountNumber: '', confirmAccNum: '', agree: false }); }
  }, [isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.accountName.trim())                          e.accountName   = 'Required';
    if (!form.bankName.trim())                             e.bankName      = 'Required';
    if (form.sortCode.replace(/-/g,'').length !== 6)       e.sortCode      = 'Must be 6 digits';
    if (form.accountNumber.length !== 8)                   e.accountNumber = 'Must be 8 digits';
    if (form.accountNumber !== form.confirmAccNum)         e.confirmAccNum = 'Numbers do not match';
    if (!form.agree)                                       e.agree         = 'You must authorise the mandate';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleConfirm = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setDone(true);
    setTimeout(() => { onSuccess({ bankName: form.bankName, sortCode: form.sortCode, accountNumber: form.accountNumber }); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.60)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget && !done) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm"
      >
        {done ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center shadow-2xl"
            style={{ background: BG_MODAL, border: `1px solid ${BORDER_COL}` }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${GREEN}20` }}>
              <CheckCircle2 size={28} color={GREEN} />
            </motion.div>
            <div>
              <p className="font-bold text-base" style={{ color: TEXT_MAIN }}>Mandate Updated!</p>
              <p className="text-xs mt-1" style={{ color: TEXT_SUB }}>Your Direct Debit for <span style={{ color: TEXT_MAIN }} className="font-medium">{form.bankName}</span> is confirmed.</p>
            </div>
          </div>

        ) : (
          <MultiStepForm
            size="sm"
            theme={theme === 'light' ? 'light' : 'dark'}
            currentStep={step}
            totalSteps={2}
            title={step === 1 ? 'Bank Details' : 'Confirm Mandate'}
            description={step === 1 ? 'Enter your UK bank account details.' : 'Review your details before confirming.'}
            onClose={onClose}
            onBack={() => step === 1 ? onClose() : setStep(1)}
            onNext={step === 1 ? handleNext : handleConfirm}
            backButtonText={step === 1 ? 'Cancel' : 'Back'}
            nextButtonText={saving ? 'Saving…' : step === 1 ? 'Review' : 'Confirm'}
            footerContent={<span className="flex items-center gap-1.5"><ShieldCheck size={11} color={GREEN} /> Protected by the Direct Debit Guarantee</span>}
          >
            {step === 1 ? (
              <div className="space-y-4">
                {existing && (
                  <Alert variant="info" layout="complex" icon={<Building2 size={14} color={GREEN} />}
                    className="border-[#00c685]/20 bg-[#00c685]/08">
                    <AlertDescription style={{ color: TEXT_SUB }} className="text-[11px]">
                      Current: <span style={{ color: TEXT_MAIN }} className="font-medium">{existing.bankName}</span> — {existing.sortCode} — ···· {existing.last4}
                    </AlertDescription>
                  </Alert>
                )}

                {[
                  { id: 'accountName',  label: 'Account Holder Name', ph: 'e.g. Mohammed Al-Rashid',  val: form.accountName,  fn: (v: string) => setForm(f => ({ ...f, accountName: v })) },
                  { id: 'bankName',     label: 'Bank Name',           ph: 'e.g. HSBC, Barclays…',      val: form.bankName,    fn: (v: string) => setForm(f => ({ ...f, bankName: v })) },
                ].map(({ id, label, ph, val, fn }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id} className={LABEL_CLS}>{label}</Label>
                    <Input id={id} value={val} onChange={e => fn(e.target.value)} placeholder={ph}
                      className={`${INPUT_CLS} ${errors[id] ? 'border-red-400/50' : ''}`} />
                    {errors[id] && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors[id]}</p>}
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="sortCode" className={LABEL_CLS}>Sort Code</Label>
                    <Input id="sortCode" value={form.sortCode} onChange={e => setForm(f => ({ ...f, sortCode: fmtSort(e.target.value) }))}
                      placeholder="12-34-56" maxLength={8}
                      className={`${INPUT_CLS} ${errors.sortCode ? 'border-red-400/50' : ''}`} />
                    {errors.sortCode && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.sortCode}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accountNumber" className={LABEL_CLS}>Account No.</Label>
                    <Input id="accountNumber" value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: fmtAcc(e.target.value) }))}
                      placeholder="12345678" maxLength={8}
                      className={`${INPUT_CLS} ${errors.accountNumber ? 'border-red-400/50' : ''}`} />
                    {errors.accountNumber && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.accountNumber}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmAccNum" className={LABEL_CLS}>Confirm Account No.</Label>
                  <Input id="confirmAccNum" value={form.confirmAccNum} onChange={e => setForm(f => ({ ...f, confirmAccNum: fmtAcc(e.target.value) }))}
                    placeholder="Re-enter account number" maxLength={8}
                    className={`${INPUT_CLS} ${errors.confirmAccNum ? 'border-red-400/50' : ''}`} />
                  {errors.confirmAccNum && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.confirmAccNum}</p>}
                </div>

                <label className={`flex gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${form.agree ? 'border-[#00c685]/30 bg-[#00c685]/08' : ''}`}
                  style={!form.agree ? { border: `1px solid ${BORDER_COL}` } : {}}>
                  <div onClick={() => setForm(f => ({ ...f, agree: !f.agree }))}
                    className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded flex items-center justify-center border transition-all ${form.agree ? 'bg-[#00c685] border-[#00c685]' : ''}`}
                    style={!form.agree ? { border: `1px solid ${BORDER_COL}`, background: BG_FIELD } : {}}>
                    {form.agree && <CheckCircle2 size={10} className="text-[#0a1a14]" strokeWidth={3} />}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: TEXT_SUB }}>
                    I authorise Takaful to collect contributions via <span className="text-[#00c685] font-semibold">Direct Debit Guarantee</span>. I can cancel at any time.
                  </p>
                </label>
                {errors.agree && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle size={9} />{errors.agree}</p>}
              </div>

            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Account Holder', val: form.accountName },
                  { label: 'Bank',           val: form.bankName },
                  { label: 'Sort Code',      val: form.sortCode },
                  { label: 'Account No.',    val: `•••• ${form.accountNumber.slice(-4)}` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center px-4 py-2.5 rounded-xl"
                    style={{ background: BG_FIELD, border: `1px solid ${BORDER_COL}` }}>
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>{label}</span>
                    <span className="text-xs font-semibold" style={{ color: TEXT_MAIN }}>{val}</span>
                  </div>
                ))}

                <Alert variant="warning" layout="complex" icon={<ShieldCheck size={13} className="text-amber-400" />}
                  className="border-amber-400/20 bg-amber-400/05">
                  <AlertDescription className="text-[11px]" style={{ color: TEXT_SUB }}>
                    Your details are encrypted. This mandate replaces your existing payment method immediately.
                  </AlertDescription>
                </Alert>

                {saving && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs" style={{ color: TEXT_MUTED }}>
                    <Loader2 size={12} className="animate-spin" color={GREEN} /> Processing…
                  </div>
                )}
              </div>
            )}
          </MultiStepForm>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Mock Data matching screenshot ──────────────────────────────────────── */
const PARTICIPANT_CONTRIBUTIONS = [
  { id: 'CONT-2026-8812', dueDate: '1 Jul 2026', collectedDate: '1 Jul 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8806', dueDate: '1 Jun 2026', collectedDate: '1 Jun 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8800', dueDate: '1 May 2026', collectedDate: '1 May 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8794', dueDate: '1 Apr 2026', collectedDate: '1 Apr 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8788', dueDate: '1 Mar 2026', collectedDate: '1 Mar 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8782', dueDate: '1 Feb 2026', collectedDate: '1 Feb 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2026-8776', dueDate: '1 Jan 2026', collectedDate: '1 Jan 2026', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
  { id: 'CONT-2025-8770', dueDate: '1 Dec 2025', collectedDate: '1 Dec 2025', method: 'Direct Debit', amount: 38.50, status: 'Collected' },
];

/* ─── Participant View ───────────────────────────────────────────────────── */
function ParticipantContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.06)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';

  const [toast, setToast]           = useState<string | null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [mandate, setMandate]       = useState({ bankName: 'Bank of Scotland', sortCode: '80-23-11', last4: '1242' });

  const handleSuccess = (data: { bankName: string; sortCode: string; accountNumber: string }) => {
    setMandate({ bankName: data.bankName, sortCode: data.sortCode, last4: data.accountNumber.slice(-4) });
    setToast(`Bank mandate updated — ${data.bankName}`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <AnimatePresence>
        {showModal && <BankMandateModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={handleSuccess} existing={mandate} theme={theme} />}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className={`text-xs flex items-center gap-1.5 font-medium ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
        <span>Dashboard</span>
        <ChevronRight size={12} className="opacity-50" />
        <span className={isLight ? 'text-gray-700 font-semibold' : 'text-white/70 font-semibold'}>Contributions</span>
      </div>

      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>My Contributions</h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>Track and manage your regular Takaful contribution payments.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] shadow-sm flex items-center"
          style={{ background: GREEN }}
        >
          <CreditCard size={15} /> Update Bank Mandate
        </Button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-3.5 rounded-xl text-xs font-semibold text-white" style={{ background: GREEN }}>
            <CheckCircle2 size={14} className="flex-shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>UPCOMING PAYMENT</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>£38.50</p>
          <p className={`text-xs mt-2 font-medium ${isLight ? 'text-gray-600' : 'text-white/60'}`}>Due 1 Aug 2026 via Direct Debit</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>COLLECTION METHOD</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>Direct Debit</p>
          <p className={`text-xs mt-2 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>{mandate.bankName} ···· {mandate.last4}</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>TOTAL CONTRIBUTED (YTD)</p>
          <p className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>£231.00</p>
          <p className={`text-xs mt-2 ${isLight ? 'text-gray-500' : 'text-white/45'}`}>6 successful collections</p>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Contribution History Table (span 8) */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="px-6 py-5 border-b" style={{ borderColor: BORDER }}>
              <h3 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'}`}>Contribution History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className={isLight ? 'text-gray-400 border-b border-gray-100' : 'text-white/35 border-b border-white/[0.04]'}>
                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">REFERENCE</th>
                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">DUE DATE</th>
                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">COLLECTED DATE</th>
                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">METHOD</th>
                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">AMOUNT</th>
                    <th className="px-6 py-4 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">STATUS</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-gray-50' : 'divide-white/[0.03]'}`}>
                  {PARTICIPANT_CONTRIBUTIONS.map(c => (
                    <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-gray-50/60' : 'hover:bg-white/[0.02]'}`}>
                      <td className={`px-6 py-4.5 font-mono font-semibold text-xs ${isLight ? 'text-gray-800' : 'text-white/85'}`}>{c.id}</td>
                      <td className={`px-6 py-4.5 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>{c.dueDate}</td>
                      <td className={`px-6 py-4.5 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>{c.collectedDate}</td>
                      <td className={`px-6 py-4.5 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>{c.method}</td>
                      <td className={`px-6 py-4.5 font-bold ${isLight ? 'text-gray-900' : 'text-white/90'}`}>£{c.amount.toFixed(2)}</td>
                      <td className="px-6 py-4.5"><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Bank Mandate Purpose Card (span 4) */}
        <div className="lg:col-span-4 rounded-2xl p-6 shadow-sm space-y-5" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
          {/* Card Title */}
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/70'}`}>
              <Info size={15} />
            </div>
            <h3 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'}`}>Bank Mandate Purpose</h3>
          </div>

          {/* Description */}
          <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
            A <span className="font-semibold" style={{ color: isLight ? '#111827' : '#ffffff' }}>Direct Debit Mandate</span> is a pre-authorized instruction to your bank that allows Takaful UK to collect your monthly mutual contributions directly.
          </p>

          {/* Shariah Box */}
          <div className="rounded-xl p-4 space-y-2 border" style={{ background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)', borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)' }}>
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/80'}`}>SHARIAH COMPLIANCE ROLE</p>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
              Unlike commercial premium payments, your contribution is a voluntary donation (<span className="font-semibold" style={{ color: isLight ? '#111827' : '#ffffff' }}>Tabarru&apos;</span>) to the shared fund. The mandate automates this commitment, ensuring you always keep your coverage active without late payment interest.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-3 pt-1">
            <p className={`text-xs font-bold ${isLight ? 'text-gray-800' : 'text-white/80'}`}>Key Benefits:</p>
            <ul className={`space-y-2.5 text-xs leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-gray-400">•</span>
                <span>
                  <strong className={isLight ? 'text-gray-800' : 'text-white/90'}>No Gaps in Cover:</strong> Guard your home and contents from unexpected events continuously.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-gray-400">•</span>
                <span>
                  <strong className={isLight ? 'text-gray-800' : 'text-white/90'}>Zero Late Fees:</strong> In Takaful, late fees cannot be charged as interest, but keeping active membership requires timely donations.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-gray-400">•</span>
                <span>
                  <strong className={isLight ? 'text-gray-800' : 'text-white/90'}>Secured Wakala:</strong> Authorizes the operator to handle fund administration on your behalf.
                </span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Treasury View ─────────────────────────────────────────────────────── */
function TreasuryContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#0d2117';
  const CHART_GRID = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch]       = useState('');
  const [list, setList]           = useState<Contribution[]>(() => CONTRIBUTIONS);
  const [toast, setToast]         = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleRetry = (id: string) => { setList(p => p.map(c => c.id === id ? { ...c, status: 'Retried' } : c)); showToast(`Retry initiated for ${id}`); };
  const handleReconcile = () => showToast('All collected contributions reconciled with treasury records.');

  const filtered = list.filter(t => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = !search || [t.id, t.participantName, t.certificateId].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const failedCount = list.filter(c => c.status === 'Failed').length;
  const collectionRate = Math.round((list.filter(c => c.status === 'Collected').length / list.length) * 100);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Contributions Control</h1>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>Treasury ledger collection verification and audits.</p>
        </div>
        <Button onClick={handleReconcile} className="gap-2 text-xs text-white" style={{ background: GREEN }}>
          <CheckCircle2 size={14} /> Reconcile Ledger
        </Button>
      </div>

      {toast && <div className="p-4 rounded-xl text-xs font-semibold text-white bg-blue-500">{toast}</div>}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Collected (MTD)', value: '£61,400', sub: '+£3,200 vs June', subColor: GREEN },
          { label: 'Collection Rate', value: `${collectionRate}%`, sub: 'First-attempt success' },
          { label: 'Failed Direct Debits', value: String(failedCount), valueColor: 'text-red-400', sub: 'Manual intervention needed' },
          { label: 'Total Mandates', value: '1,284', sub: '99% Active status', subColor: GREEN },
        ].map(({ label, value, sub, subColor, valueColor }) => (
          <div key={label} className={`rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{label}</p>
            <p className={`text-2xl font-bold ${valueColor ?? (isLight ? 'text-black/90' : 'text-white')}`}>{value}</p>
            <p className="text-[10px] mt-1 font-semibold" style={{ color: subColor ?? (isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)') }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
        className={`rounded-2xl p-5 ${isLight ? 'shadow-sm' : ''}`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <h3 className={`font-semibold text-sm mb-1 ${isLight ? 'text-black/85' : 'text-white/85'}`}>Monthly Collection Inflows</h3>
        <p className={`text-xs mb-5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collected cash volume versus targets</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CONTRIBUTION_TREND}>
              <defs>
                <linearGradient id="gC2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip content={<ChartTooltip theme={theme} />} />
              <Area type="monotone" dataKey="total" name="Collected" stroke={GREEN} fill="url(#gC2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden ${isLight ? 'shadow-sm' : ''}`} style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
        <div className="flex flex-col md:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-black/35' : 'text-white/30'}`} />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, name, or cert…"
              className={`pl-9 text-xs h-9 ${isLight ? 'border-[#E4E7EC]' : 'border-white/[0.05] bg-white/[0.02] text-white'}`} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'Collected', 'Failed', 'Pending'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${activeTab === tab
                  ? 'bg-[#00c685]/15 border-[#00c685]/35 text-[#00c685]'
                  : isLight ? 'border-[#E4E7EC] bg-black/[0.02] text-black/60 hover:border-black/20' : 'border-white/[0.05] bg-white/[0.02] text-white/55 hover:border-white/15'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={isLight ? 'text-black/40 border-b border-[#E4E7EC]' : 'text-white/35 border-b border-white/[0.04]'}>
                {['ID', 'Participant', 'Certificate', 'Due Date', 'Collected Date', 'Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-black/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                  <td className="px-5 py-4 font-mono font-semibold" style={{ color: GREEN }}>{c.id}</td>
                  <td className={`px-5 py-4 font-medium ${isLight ? 'text-black/75' : 'text-white/70'}`}>{c.participantName}</td>
                  <td className="px-5 py-4 font-mono text-[11px]">{c.certificateId}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{c.dueDate}</td>
                  <td className={`px-5 py-4 ${isLight ? 'text-black/60' : 'text-white/55'}`}>{c.collectedDate ?? '—'}</td>
                  <td className={`px-5 py-4 font-bold ${isLight ? 'text-black/80' : 'text-white/80'}`}>£{c.amount.toFixed(2)}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4">
                    {c.status === 'Failed'
                      ? <button onClick={() => handleRetry(c.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-bold transition-all">
                          <RefreshCw size={10} /> Retry
                        </button>
                      : <span className={`text-[10px] ${isLight ? 'text-black/35' : 'text-white/30'}`}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ContributionsPage() {
  const { theme } = useTheme();
  const { role }  = useRole();
  return role === 'participant'
    ? <ParticipantContributionsView theme={theme} />
    : <TreasuryContributionsView theme={theme} />;
}
