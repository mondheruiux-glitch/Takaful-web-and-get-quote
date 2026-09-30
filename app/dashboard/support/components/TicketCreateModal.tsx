'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Ticket, Shield, CreditCard, FileText, Wrench, HelpCircle,
  Check, ArrowRight, Paperclip, Trash2, Loader2, Sparkles, Clock, AlertCircle
} from 'lucide-react';
import { TicketCategory, TicketPriority, UserRole } from '@/lib/dashboard/types';
import { CATEGORY_ROUTING } from '@/lib/dashboard/ticket-routing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    email: string;
    participantId?: string;
    role: UserRole;
    jobTitle?: string;
  };
  onSubmit: (data: {
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
    reference?: string;
    attachments: string[];
  }) => void;
  isLight: boolean;
}

const CATEGORIES: {
  id: TicketCategory;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  desc: string;
}[] = [
  { id: 'Claim Inquiry', label: 'Claim Inquiry', icon: Shield, desc: 'Damage, loss assessment & surveyor visits' },
  { id: 'Contribution', label: 'Contribution / Fee', icon: CreditCard, desc: 'Direct Debit, banking & contribution payments' },
  { id: 'Certificate', label: 'Certificate / Proof', icon: FileText, desc: 'Mortgage schedule & policy PDF documents' },
  { id: 'Technical', label: 'Technical Issue', icon: Wrench, desc: 'Portal login, document upload & platform bugs' },
  { id: 'General', label: 'General / Shariah', icon: HelpCircle, desc: 'Surplus pool, Shariah compliance & coverage terms' },
];

export function TicketCreateModal({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
  isLight,
}: Props) {
  const [category, setCategory] = useState<TicketCategory>('Claim Inquiry');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const routingRule = CATEGORY_ROUTING[category];

  const handleAddMockFile = () => {
    const samples = [
      'Property_Damage_Photo_01.jpg',
      'Contractor_Repair_Estimate.pdf',
      'Mortgage_Schedule_Extract.pdf',
      'Direct_Debit_Confirmation.pdf',
    ];
    const available = samples.filter(s => !attachedFiles.includes(s));
    if (available.length > 0) {
      setAttachedFiles([...attachedFiles, available[0]]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(attachedFiles.filter(f => f !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
        reference: reference.trim() || undefined,
        attachments: attachedFiles,
      });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setSubject('');
      setDescription('');
      setReference('');
      setAttachedFiles([]);
    }, 400);
  };

  const TEXT_MAIN = isLight ? 'text-gray-900' : 'text-white';
  const TEXT_SUB = isLight ? 'text-gray-600' : 'text-gray-300';
  const TEXT_MUTED = isLight ? 'text-gray-500' : 'text-gray-400';
  const BORDER = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
  const BG_MODAL = isLight ? '#ffffff' : '#0a0f0d';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden z-10"
          style={{ background: BG_MODAL, borderColor: BORDER }}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b flex items-center justify-between gap-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00c685]/15 text-[#00c685] flex items-center justify-center shrink-0">
                <Ticket size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-bold ${TEXT_MAIN}`}>Create Support Ticket</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#00c685]/15 text-[#00c685] border border-[#00c685]/20">
                    Smart Routed
                  </span>
                </div>
                <p className={`text-xs ${TEXT_SUB}`}>
                  Your inquiry is automatically directed to the specialized backoffice handler
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${
                isLight ? 'hover:bg-black/5 text-black/50 hover:text-black' : 'hover:bg-white/10 text-white/50 hover:text-white'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Submitting Context Bar */}
          <div
            className={`px-6 py-2.5 border-b flex items-center justify-between text-xs shrink-0 ${
              isLight ? 'bg-black/[0.02]' : 'bg-white/[0.02]'
            }`}
            style={{ borderColor: BORDER }}
          >
            <span className={`text-[11px] ${TEXT_SUB}`}>
              Submitting as: <strong className={TEXT_MAIN}>{currentUser.name}</strong> ({currentUser.email})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00c685]/10 text-[#00c685] font-semibold">
              ID: {currentUser.participantId ?? 'P-0042'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* 1. Category Selection */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                1. Select Inquiry Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#00c685] bg-[#00c685]/10 ring-1 ring-[#00c685]'
                          : isLight
                          ? 'border-gray-200 hover:border-gray-300 bg-black/[0.01]'
                          : 'border-white/[0.07] hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#00c685] text-white' : 'bg-black/5 dark:bg-white/5 text-gray-400'}`}>
                          <Icon size={14} />
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#00c685] text-white flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${TEXT_MAIN}`}>{cat.label}</p>
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${TEXT_MUTED}`}>{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Routing Preview Banner */}
            <div
              className="p-3.5 rounded-2xl border transition-all flex items-start gap-3"
              style={{
                borderColor: `${routingRule.color}40`,
                background: `${routingRule.color}0d`,
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-base"
                style={{ background: `${routingRule.color}25` }}
              >
                {routingRule.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: routingRule.color }}
                  >
                    Direct Backoffice Routing:
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: `${routingRule.color}20`, color: routingRule.color }}
                  >
                    {routingRule.routedToRole.replace('_', ' ')}
                  </span>
                </div>
                <p className={`text-xs font-semibold ${TEXT_MAIN}`}>
                  ⚡ Auto-Assigned: {routingRule.defaultAssignee}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={11} className="text-[#00c685]" />
                    SLA Guarantee: <strong>{routingRule.slaHours} hours</strong>
                  </span>
                  <span>•</span>
                  <span>Auto-routed based on category</span>
                </div>
              </div>
            </div>

            {/* 2. Priority & Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                  2. Priority Level <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl border" style={{ borderColor: BORDER }}>
                  {(['Low', 'Medium', 'High', 'Critical'] as const).map(p => {
                    const isSelected = priority === p;
                    const colors = {
                      Low: isSelected ? 'bg-emerald-500 text-white' : 'text-emerald-500',
                      Medium: isSelected ? 'bg-amber-500 text-white' : 'text-amber-500',
                      High: isSelected ? 'bg-orange-500 text-white' : 'text-orange-500',
                      Critical: isSelected ? 'bg-red-500 text-white' : 'text-red-500',
                    };
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-1.5 text-center rounded-xl text-[11px] font-bold transition-all ${
                          isSelected
                            ? `${colors[p]} shadow-sm`
                            : isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/60 hover:bg-white/5'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                  Related Claim or Certificate ID (Optional)
                </label>
                <input
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="e.g. CLM-2024-0891 or TK-2024-0042"
                  className={`w-full px-3.5 py-2 rounded-2xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${
                    isLight ? 'bg-black/[0.02] border-black/10 text-black' : 'bg-white/[0.04] border-white/10 text-white'
                  }`}
                />
              </div>
            </div>

            {/* 3. Subject */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                3. Ticket Subject <span className="text-red-400">*</span>
              </label>
              <input
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry..."
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${
                  isLight ? 'bg-black/[0.02] border-black/10 text-black' : 'bg-white/[0.04] border-white/10 text-white'
                }`}
              />
            </div>

            {/* 4. Description */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${TEXT_MUTED}`}>
                4. Inquiry Description & Details <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                className={`w-full p-3.5 rounded-2xl border text-xs focus:outline-none focus:border-[#00c685]/50 transition-colors ${
                  isLight ? 'bg-black/[0.02] border-black/10 text-black' : 'bg-white/[0.04] border-white/10 text-white'
                }`}
              />
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${TEXT_MUTED}`}>
                  Supporting Documents / Photos
                </label>
                <button
                  type="button"
                  onClick={handleAddMockFile}
                  className="text-xs font-semibold text-[#00c685] hover:underline flex items-center gap-1"
                >
                  <Paperclip size={12} />
                  Attach Sample Document
                </button>
              </div>

              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map(f => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] bg-[#00c685]/10 border border-[#00c685]/20 text-[#00c685]"
                    >
                      <Paperclip size={11} />
                      <span className="truncate max-w-[180px]">{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(f)}
                        className="hover:text-red-400 ml-1"
                      >
                        <Trash2 size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t" style={{ borderColor: BORDER }}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  isLight ? 'hover:bg-black/5 text-gray-700' : 'hover:bg-white/5 text-gray-300'
                }`}
                style={{ borderColor: BORDER }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !description.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#00c685' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Routing Ticket...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Submit & Route to {routingRule.routedToRole.replace('_', ' ')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
