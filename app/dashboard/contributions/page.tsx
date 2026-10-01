'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Search, CheckCircle2, RefreshCw, X,
  Building2, ShieldCheck, AlertCircle, Loader2, Info, ChevronRight
} from 'lucide-react';
import { AreaChart } from '@/components/charts';
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
  hidden: { opacity: 1, y: 0 },
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
      style={{ background: isLight ? '#fff' : '#1e2433', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`, color: isLight ? '#000' : '#fff' }}>
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

/* ─── Participant View (Editorial, Consumer-Grade) ────────────────────────── */
function ParticipantContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const BG_SURFACE = isLight ? '#ffffff' : 'rgba(255,255,255,0.02)';
  const BG_SUBTLE = isLight ? '#f8faf9' : 'rgba(255,255,255,0.02)';
  const TEXT_MAIN = isLight ? '#111827' : '#ffffff';
  const TEXT_SUB = isLight ? '#4b5563' : 'rgba(255,255,255,0.6)';
  const TEXT_MUTED = isLight ? '#9ca3af' : 'rgba(255,255,255,0.35)';

  const [toast, setToast]         = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mandate, setMandate]     = useState({ bankName: 'Bank of Scotland', sortCode: '80-23-11', last4: '1242' });

  const handleSuccess = (data: { bankName: string; sortCode: string; accountNumber: string }) => {
    setMandate({ bankName: data.bankName, sortCode: data.sortCode, last4: data.accountNumber.slice(-4) });
    setToast(`Bank mandate updated — ${data.bankName}`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 font-body transition-colors duration-200">
      <AnimatePresence>
        {showModal && (
          <BankMandateModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
            existing={mandate}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* ── 1. Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-[-0.02em] leading-[1.08]" style={{ color: TEXT_MAIN }}>
              My Payments
            </h1>
            <p className="mt-2 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: TEXT_SUB }}>
              You pay £38.50 a month to protect your home. Here's your full history.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] shrink-0 self-start sm:self-auto ${
              isLight ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
            }`}
          >
            <CreditCard size={15} />
            Change Bank Account
          </button>
        </div>
      </motion.div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-100 border border-emerald-300"
          >
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. Next Payment Card ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <div
          className="relative overflow-hidden rounded-3xl border transition-all duration-300"
          style={{ background: BG_SURFACE, borderColor: BORDER }}
        >
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Was: "Next Scheduled Contribution" + "Auto-Collection" */}
                <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
                  Next Payment
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#00c685]">
                  Automatic
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT_MAIN }}>
                  £38.50
                </span>
                <span className="text-sm font-medium" style={{ color: TEXT_SUB }}>
                  on 1 August 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
                Taken automatically from <span className="font-semibold" style={{ color: TEXT_MAIN }}>{mandate.bankName}</span> (•••• {mandate.last4}).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => setShowModal(true)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isLight
                    ? 'border-gray-200 hover:border-gray-400 text-gray-700 bg-white shadow-sm'
                    : 'border-white/10 hover:border-white/20 text-white/80 bg-white/[0.04]'
                }`}
              >
                Change Bank Account
              </button>
            </div>
          </div>

          {/* Simplified Metrics Bar — was: "Total Contributed (YTD)" + "Successful Collections" */}
          <div className="px-6 sm:px-8 py-4 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: BORDER, background: BG_SUBTLE }}>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span style={{ color: TEXT_MUTED }}>You&apos;ve paid this year: </span>
                <strong style={{ color: TEXT_MAIN }}>£231.00</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
                <span style={{ color: TEXT_MUTED }}>All payments received</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 3. Payment History — simplified: date, amount, status only ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
              Payment History
            </h2>
            <p className="text-sm mt-0.5" style={{ color: TEXT_SUB }}>
              All your past payments, most recent first.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {PARTICIPANT_CONTRIBUTIONS.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.12]' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  <CheckCircle2 size={18} />
                </div>
                {/* Show: month + year only. No ref IDs. */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: TEXT_MAIN }}>
                    {c.dueDate}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
                    Direct Debit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={c.status} />
                <p className="text-base font-bold" style={{ color: TEXT_MAIN }}>
                  £{c.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 4. Simple explainer — replaces Tabarru wall of text ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className={`rounded-3xl p-6 sm:p-8 border ${
          isLight ? 'bg-gray-50/80 border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#00c685]" />
            <h4 className="text-sm font-bold tracking-tight" style={{ color: TEXT_MAIN }}>
              Your money goes to people, not shareholders
            </h4>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_SUB }}>
            When a member&apos;s home is damaged, the community pool pays to fix it. If money is left over at year end, it comes back to members — it&apos;s never kept as profit.
          </p>
        </div>
      </motion.div>

    </div>
  );
}

/* ─── Treasury View ─────────────────────────────────────────────────────── */
function TreasuryContributionsView({ theme }: { theme: string }) {
  const isLight = theme === 'light';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
  const BG_PANEL = isLight ? '#ffffff' : '#1e2433';
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className={`font-semibold text-sm ${isLight ? 'text-black/85' : 'text-white/85'}`}>Monthly Collection Inflows</h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Collected cash volume versus targets</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
            <span className={isLight ? 'text-black/60 font-medium' : 'text-white/60 font-medium'}>Collected</span>
          </div>
        </div>
        <div className="h-56 w-full">
          <AreaChart
            data={CONTRIBUTION_TREND}
            xKey="month"
            theme={theme}
            height="100%"
            yTickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            series={[{ dataKey: "total", name: "Collected", color: GREEN }]}
          />
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
