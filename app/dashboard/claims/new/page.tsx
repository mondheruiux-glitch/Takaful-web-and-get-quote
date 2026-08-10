'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, AlertTriangle, Info,
  Upload, X, FileText, Image as ImageIcon, File, Plus, Minus,
  Home, Building2, Droplets, Flame, Wind, Shield, Zap, Package,
  Phone, Car, AlertCircle, Clock, Calendar, MapPin, Users,
  ShieldCheck, ChevronRight, Save, Trash2, Eye, Edit2,
  CloudUpload, PaperclipIcon, Hash, BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../ThemeRoleContext';
import { CERTIFICATES } from '@/lib/dashboard/mock-data';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'photo' | 'document' | 'receipt' | 'report' | 'quote' | 'other';
  preview?: string;
  status: 'ready' | 'uploading' | 'done' | 'error';
  progress: number;
}

interface ItemisedItem {
  id: string;
  name: string;
  category: string;
  description: string;
  age: string;
  value: number;
  quantity: number;
}

interface EmergencyService {
  id: string;
  service: 'Police' | 'Fire Service' | 'Ambulance' | 'Other';
  dateContacted: string;
  referenceNumber: string;
}

interface ThirdParty {
  id: string;
  name: string;
  role: string;
  contact: string;
  involvement: string;
}

interface ClaimDraft {
  // Step 1 — Incident
  claimType: string;
  customType: string;
  description: string;
  incidentDate: string;
  unknownDate: boolean;
  approxDate: string;
  isOngoing: boolean;
  // Step 2 — Location
  atInsuredProperty: boolean | null;
  alternativeLocation: string;
  affectedRooms: string[];
  // Step 3 — Damage
  damagedCategories: string[];
  damageDescription: string;
  isSafe: boolean | null;
  hasTempRepair: boolean | null;
  tempRepairDesc: string;
  tempRepairDate: string;
  tempRepairBy: string;
  tempRepairCost: string;
  // Step 4 — Loss
  estimatedAmount: string;
  hasQuote: boolean | null;
  isItemised: boolean;
  items: ItemisedItem[];
  // Step 5 — Other Parties
  contactedServices: boolean | null;
  emergencyServices: EmergencyService[];
  hasThirdParties: boolean | null;
  thirdParties: ThirdParty[];
  reportedElsewhere: boolean | null;
  reportedElsewhereDesc: string;
  // Step 6 — Documents
  files: UploadedFile[];
  // Step 8 — Declaration
  declaration: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CLAIM_TYPES = [
  { value: 'Escape of Water', label: 'Escape of Water', icon: Droplets, desc: 'Leak, burst pipe, appliance overflow' },
  { value: 'Storm', label: 'Storm Damage', icon: Wind, desc: 'Wind, hail, lightning damage to property' },
  { value: 'Fire', label: 'Fire Damage', icon: Flame, desc: 'Fire, smoke damage or scorch marks' },
  { value: 'Theft', label: 'Theft or Burglary', icon: Shield, desc: 'Break-in, theft of belongings or damage during burglary' },
  { value: 'Accidental Damage', label: 'Accidental Damage', icon: AlertTriangle, desc: 'Sudden, unexpected damage to structure or contents' },
  { value: 'Flood', label: 'Flood', icon: Droplets, desc: 'External flooding from rivers, drains or surface water' },
  { value: 'Subsidence', label: 'Subsidence', icon: Building2, desc: 'Ground movement causing structural cracks' },
  { value: 'Malicious Damage', label: 'Malicious Damage', icon: Zap, desc: 'Deliberate vandalism or damage by another person' },
  { value: 'Other', label: 'Other', icon: Package, desc: 'Not listed above — please describe' },
];

const ROOMS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living room', 'Hallway', 'Loft / attic', 'Roof', 'Garden / outdoor', 'Garage', 'Basement', 'Other'];

const DAMAGE_CATS = [
  'Building structure', 'Walls or ceilings', 'Roof', 'Flooring',
  'Fixtures and fittings', 'Furniture', 'Appliances', 'Personal belongings', 'Other',
];

const ITEM_CATS = ['Furniture', 'Appliance', 'Electronics', 'Clothing', 'Jewellery', 'Flooring', 'Fixture', 'Tool', 'Bicycle', 'Other'];

const STEP_LABELS = ['Incident', 'Location', 'Damage', 'Loss', 'Other Parties', 'Documents', 'Review', 'Submit'];
const TOTAL_STEPS = 8;

const GREEN = '#00c685';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } };

function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── Shared form components ───────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[10px] font-semibold uppercase tracking-wide block mb-1.5 text-white/40">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function LightFieldLabel({ children, required, isLight }: { children: React.ReactNode; required?: boolean; isLight: boolean }) {
  return (
    <label className={`text-[10px] font-semibold uppercase tracking-wide block mb-1.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
      <AlertCircle size={11} />{msg}
    </motion.p>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, isLight }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; isLight: boolean }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685]/40 transition-colors resize-none leading-relaxed ${
        isLight ? 'border-black/[0.06] bg-black/[0.03] text-black placeholder:text-black/25' : 'border-white/[0.05] bg-white/[0.04] text-white placeholder:text-white/20'
      }`}
    />
  );
}

function Input({ value, onChange, placeholder, type = 'text', prefix, isLight }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; prefix?: string; isLight: boolean }) {
  return (
    <div className="relative">
      {prefix && <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold ${isLight ? 'text-black/50' : 'text-white/50'}`}>{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${prefix ? 'pl-7' : 'pl-3.5'} pr-3.5 py-2.5 rounded-xl border text-sm h-10 focus:outline-none focus:border-[#00c685]/40 transition-colors ${
          isLight ? 'border-black/[0.06] bg-black/[0.03] text-black placeholder:text-black/25' : 'border-white/[0.05] bg-white/[0.04] text-white placeholder:text-white/20'
        } ${type === 'date' || type === 'datetime-local' ? (isLight ? 'date-light' : 'date-dark') : ''}`}
      />
    </div>
  );
}


function RadioGroup({ options, value, onChange, isLight }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; isLight: boolean }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map(opt => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            value === opt.value
              ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]'
              : isLight ? 'border-black/[0.06] bg-black/[0.03] text-black/60 hover:border-[#00c685]/30' : 'border-white/[0.05] bg-white/[0.04] text-white/55 hover:border-[#00c685]/30'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function InfoBox({ children, isLight, variant = 'info' }: { children: React.ReactNode; isLight: boolean; variant?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: { border: 'border-blue-400/20', bg: 'bg-blue-400/5', text: 'text-blue-400', icon: <Info size={14} /> },
    warning: { border: 'border-amber-400/20', bg: 'bg-amber-400/5', text: 'text-amber-400', icon: <AlertTriangle size={14} /> },
    success: { border: 'border-[#00c685]/20', bg: 'bg-[#00c685]/5', text: 'text-[#00c685]', icon: <ShieldCheck size={14} /> },
  }[variant];
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${styles.border} ${styles.bg}`}>
      <span className={`${styles.text} shrink-0 mt-0.5`}>{styles.icon}</span>
      <div className={`text-xs leading-relaxed ${isLight ? 'text-black/65' : 'text-white/60'}`}>{children}</div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, isLight }: { current: number; isLight: boolean }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>Step {current} of {TOTAL_STEPS}</p>
        <p className={`text-xs font-semibold text-[#00c685]`}>{STEP_LABELS[current - 1]}</p>
      </div>
      <div className="flex gap-1">
        {STEP_LABELS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full bg-[#00c685]"
              initial={{ width: 0 }}
              animate={{ width: i < current ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Incident ─────────────────────────────────────────────────────────
function Step1({ d, setD, errors, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us what happened</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Start by telling us about the incident so we can understand your claim.</p>
      </div>

      {/* Claim type */}
      <div>
        <LightFieldLabel required isLight={isLight}>What type of incident is this?</LightFieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2">
          {CLAIM_TYPES.map(ct => {
            const Icon = ct.icon;
            const sel = d.claimType === ct.value;
            return (
              <button key={ct.value} type="button" onClick={() => setD({ claimType: ct.value })}
                className={`text-left px-4 py-3 rounded-xl border transition-all group ${sel ? 'border-[#00c685]/50 bg-[#00c685]/10' : isLight ? 'border-black/[0.06] bg-black/[0.02] hover:border-[#00c685]/30 hover:bg-[#00c685]/5' : 'border-white/[0.05] bg-white/[0.02] hover:border-[#00c685]/30 hover:bg-[#00c685]/5'}`}>
                <div className="flex items-center gap-2.5 mb-1">
                  <Icon size={14} className={sel ? 'text-[#00c685]' : isLight ? 'text-black/40' : 'text-white/40'} />
                  <span className={`text-sm font-semibold ${sel ? 'text-[#00c685]' : isLight ? 'text-black/80' : 'text-white/80'}`}>{ct.label}</span>
                  {sel && <Check size={12} className="text-[#00c685] ml-auto" />}
                </div>
                <p className={`text-[11px] leading-snug ${isLight ? 'text-black/40' : 'text-white/35'}`}>{ct.desc}</p>
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.claimType} />
      </div>

      {/* Other type */}
      {d.claimType === 'Other' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <LightFieldLabel required isLight={isLight}>Please describe the type of claim</LightFieldLabel>
          <Input value={d.customType} onChange={v => setD({ customType: v })} placeholder="e.g. Chimney damage, boundary wall collapse" isLight={isLight} />
        </motion.div>
      )}

      {/* Description */}
      <div>
        <LightFieldLabel required isLight={isLight}>Tell us what happened</LightFieldLabel>
        <Textarea
          value={d.description}
          onChange={v => setD({ description: v })}
          placeholder="Please describe what happened and how the damage occurred."
          rows={5}
          isLight={isLight}
        />
        <p className={`text-[11px] mt-1.5 leading-relaxed ${isLight ? 'text-black/40' : 'text-white/35'}`}>
          Include as much detail as you can — what happened, when you noticed it, and what was affected.
        </p>
        <FieldError msg={errors.description} />
      </div>

      {/* Date of incident */}
      <div>
        <LightFieldLabel isLight={isLight}>When did the incident occur?</LightFieldLabel>
        <div className="space-y-3">
          {!d.unknownDate && (
            <Input value={d.incidentDate} onChange={v => setD({ incidentDate: v })} type="date" isLight={isLight} />
          )}
          <label className="flex items-center gap-2 cursor-pointer group w-fit">
            <div onClick={() => setD({ unknownDate: !d.unknownDate })}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${d.unknownDate ? 'bg-[#00c685] border-[#00c685]' : isLight ? 'border-black/20 bg-transparent' : 'border-white/20 bg-transparent'}`}>
              {d.unknownDate && <Check size={10} className="text-white" />}
            </div>
            <span className={`text-xs ${isLight ? 'text-black/55' : 'text-white/45'}`}>I don't know the exact date</span>
          </label>
          {d.unknownDate && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
              <LightFieldLabel isLight={isLight}>Approximate date or date range</LightFieldLabel>
              <Input value={d.approxDate} onChange={v => setD({ approxDate: v })} placeholder="e.g. Around 20 July, or early July 2026" isLight={isLight} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Ongoing */}
      <div>
        <LightFieldLabel isLight={isLight}>Is the incident still ongoing?</LightFieldLabel>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={d.isOngoing ? 'yes' : 'no'}
          onChange={v => setD({ isOngoing: v === 'yes' })}
          isLight={isLight}
        />
        {d.isOngoing && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-3">
            <InfoBox isLight={isLight} variant="warning">
              <strong>If you are at immediate risk or there is active damage occurring</strong>, please contact the relevant emergency service (999 for fire, police or ambulance) or take reasonable steps to prevent further damage where it is safe to do so. Do not put yourself in danger.
            </InfoBox>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────
function Step2({ d, setD, errors, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean }) {
  const cert = CERTIFICATES.find(c => c.participantId === 'P-0042');
  const toggleRoom = (room: string) => {
    const rooms = d.affectedRooms.includes(room) ? d.affectedRooms.filter(r => r !== room) : [...d.affectedRooms, room];
    setD({ affectedRooms: rooms });
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Where did it happen?</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Confirm the property and the areas affected.</p>
      </div>

      {/* Insured property card */}
      {cert && (
        <div className="p-4 rounded-xl border" style={{ background: isLight ? '#f8faf9' : '#0d2117', borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}>
          <p className={`text-[10px] font-bold tracking-wider uppercase mb-2 ${isLight ? 'text-black/35' : 'text-white/35'}`}>Your insured property</p>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${GREEN}18` }}>
              <Home size={15} style={{ color: GREEN }} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${isLight ? 'text-black/85' : 'text-white'}`}>{cert.propertyAddress}</p>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{cert.propertyType} · {cert.coverType} Cover · <span className="font-mono">{cert.id}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* At this property? */}
      <div>
        <LightFieldLabel required isLight={isLight}>Did the incident happen at this property?</LightFieldLabel>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No, different location' }]}
          value={d.atInsuredProperty === true ? 'yes' : d.atInsuredProperty === false ? 'no' : ''}
          onChange={v => setD({ atInsuredProperty: v === 'yes' })}
          isLight={isLight}
        />
        {d.atInsuredProperty === false && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-3 space-y-2">
            <InfoBox isLight={isLight} variant="warning">
              Claims must relate to your insured property. If this incident occurred at a different location, your policy may not cover it. Please contact us to discuss your situation.
            </InfoBox>
            <LightFieldLabel isLight={isLight}>Please provide the location where the incident occurred</LightFieldLabel>
            <Input value={d.alternativeLocation} onChange={v => setD({ alternativeLocation: v })} placeholder="Full address or location description" isLight={isLight} />
          </motion.div>
        )}
        <FieldError msg={errors.atInsuredProperty} />
      </div>

      {/* Rooms affected */}
      <div>
        <LightFieldLabel isLight={isLight}>Where in the property did the incident happen? (select all that apply)</LightFieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {ROOMS.map(room => {
            const sel = d.affectedRooms.includes(room);
            return (
              <button key={room} type="button" onClick={() => toggleRoom(room)}
                className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${sel ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : isLight ? 'border-black/[0.06] bg-black/[0.03] text-black/60 hover:border-[#00c685]/30' : 'border-white/[0.05] bg-white/[0.04] text-white/55 hover:border-[#00c685]/30'}`}>
                {room}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Damage ───────────────────────────────────────────────────────────
function Step3({ d, setD, errors, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean }) {
  const toggleCat = (cat: string) => {
    const cats = d.damagedCategories.includes(cat) ? d.damagedCategories.filter(c => c !== cat) : [...d.damagedCategories, cat];
    setD({ damagedCategories: cats });
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us what was damaged</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Help us understand what was affected and the extent of the damage.</p>
      </div>

      {/* What was affected */}
      <div>
        <LightFieldLabel required isLight={isLight}>What was affected? (select all that apply)</LightFieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {DAMAGE_CATS.map(cat => {
            const sel = d.damagedCategories.includes(cat);
            return (
              <button key={cat} type="button" onClick={() => toggleCat(cat)}
                className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${sel ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : isLight ? 'border-black/[0.06] bg-black/[0.03] text-black/60 hover:border-[#00c685]/30' : 'border-white/[0.05] bg-white/[0.04] text-white/55 hover:border-[#00c685]/30'}`}>
                {cat}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.damagedCategories} />
      </div>

      {/* Damage description */}
      <div>
        <LightFieldLabel required isLight={isLight}>Describe the damage in detail</LightFieldLabel>
        <Textarea value={d.damageDescription} onChange={v => setD({ damageDescription: v })} placeholder="Please describe the damage and the items affected. Include the extent of the damage and any specific items you are claiming for." rows={5} isLight={isLight} />
        <FieldError msg={errors.damageDescription} />
      </div>

      {/* Safe to leave? */}
      <div>
        <LightFieldLabel isLight={isLight}>Is the damage safe to leave as it is?</LightFieldLabel>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes, it is safe' }, { value: 'no', label: 'No, there is a risk' }]}
          value={d.isSafe === true ? 'yes' : d.isSafe === false ? 'no' : ''}
          onChange={v => setD({ isSafe: v === 'yes' })}
          isLight={isLight}
        />
        {d.isSafe === false && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-3">
            <InfoBox isLight={isLight} variant="warning">
              Please take reasonable steps to prevent further damage where it is safe to do so — for example, turning off the water supply if there is a leak. If there is an immediate risk to your safety, contact emergency services on <strong>999</strong>.
            </InfoBox>
          </motion.div>
        )}
      </div>

      {/* Temporary repair */}
      <div>
        <LightFieldLabel isLight={isLight}>Has any temporary repair been made?</LightFieldLabel>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={d.hasTempRepair === true ? 'yes' : d.hasTempRepair === false ? 'no' : ''}
          onChange={v => setD({ hasTempRepair: v === 'yes' })}
          isLight={isLight}
        />
        {d.hasTempRepair === true && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-4 space-y-4">
            <div>
              <LightFieldLabel isLight={isLight}>What repair was made?</LightFieldLabel>
              <Input value={d.tempRepairDesc} onChange={v => setD({ tempRepairDesc: v })} placeholder="e.g. Tarpaulin placed over roof, plumber isolated water supply" isLight={isLight} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <LightFieldLabel isLight={isLight}>Date of repair</LightFieldLabel>
                <Input value={d.tempRepairDate} onChange={v => setD({ tempRepairDate: v })} type="date" isLight={isLight} />
              </div>
              <div>
                <LightFieldLabel isLight={isLight}>Approximate cost (£)</LightFieldLabel>
                <Input value={d.tempRepairCost} onChange={v => setD({ tempRepairCost: v })} prefix="£" placeholder="0.00" isLight={isLight} />
              </div>
            </div>
            <div>
              <LightFieldLabel isLight={isLight}>Who carried out the repair?</LightFieldLabel>
              <Input value={d.tempRepairBy} onChange={v => setD({ tempRepairBy: v })} placeholder="e.g. Myself, or name of contractor" isLight={isLight} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step 4: Loss estimate ────────────────────────────────────────────────────
function Step4({ d, setD, errors, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean }) {
  const addItem = () => setD({ items: [...d.items, { id: uid(), name: '', category: '', description: '', age: '', value: 0, quantity: 1 }] });
  const removeItem = (id: string) => setD({ items: d.items.filter(i => i.id !== id) });
  const updateItem = (id: string, patch: Partial<ItemisedItem>) => setD({ items: d.items.map(i => i.id === id ? { ...i, ...patch } : i) });
  const total = d.items.reduce((s, i) => s + (i.value * i.quantity), 0);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us about the cost</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>You don't need to know the exact final cost. Give us your best estimate — we may ask for more information later.</p>
      </div>

      <InfoBox isLight={isLight} variant="info">
        The amount shown here is your <strong>estimated claim amount</strong> only. The final approved amount will be confirmed after our assessment.
      </InfoBox>

      {/* Estimated amount */}
      <div>
        <LightFieldLabel required isLight={isLight}>Estimated total loss (£)</LightFieldLabel>
        <Input value={d.estimatedAmount} onChange={v => setD({ estimatedAmount: v })} prefix="£" placeholder="0.00" type="number" isLight={isLight} />
        <FieldError msg={errors.estimatedAmount} />
      </div>

      {/* Has quote? */}
      <div>
        <LightFieldLabel isLight={isLight}>Do you have a repair estimate or quotation?</LightFieldLabel>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'Not yet' }]}
          value={d.hasQuote === true ? 'yes' : d.hasQuote === false ? 'no' : ''}
          onChange={v => setD({ hasQuote: v === 'yes' })}
          isLight={isLight}
        />
        {d.hasQuote && (
          <p className={`text-xs mt-2 ${isLight ? 'text-black/45' : 'text-white/40'}`}>You can upload quotes and invoices in Step 6 (Documents).</p>
        )}
      </div>

      {/* Itemised list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <LightFieldLabel isLight={isLight}>Are you claiming for individual items?</LightFieldLabel>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-black/40' : 'text-white/35'}`}>Add each item separately to help our team assess your claim.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setD({ isItemised: !d.isItemised })}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${d.isItemised ? 'bg-[#00c685] border-[#00c685]' : isLight ? 'border-black/20' : 'border-white/20'}`}>
              {d.isItemised && <Check size={10} className="text-white" />}
            </div>
            <span className={`text-xs font-medium ${isLight ? 'text-black/60' : 'text-white/50'}`}>Add items</span>
          </label>
        </div>

        {d.isItemised && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
            {d.items.map((item, idx) => (
              <div key={item.id} className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/08 bg-black/[0.02]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>Item {idx + 1}</span>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <LightFieldLabel isLight={isLight}>Item name</LightFieldLabel>
                    <Input value={item.name} onChange={v => updateItem(item.id, { name: v })} placeholder="e.g. Washing machine" isLight={isLight} />
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Category</LightFieldLabel>
                    <select value={item.category} onChange={e => updateItem(item.id, { category: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm h-10 focus:outline-none focus:border-[#00c685]/40 transition-colors ${isLight ? 'border-black/[0.06] bg-black/[0.03] text-black' : 'border-white/[0.05] bg-white/[0.04] text-white'}`}>
                      <option value="">Select…</option>
                      {ITEM_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Approximate age</LightFieldLabel>
                    <Input value={item.age} onChange={v => updateItem(item.id, { age: v })} placeholder="e.g. 2 years" isLight={isLight} />
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Est. value (£)</LightFieldLabel>
                    <Input value={item.value.toString()} onChange={v => updateItem(item.id, { value: parseFloat(v) || 0 })} prefix="£" placeholder="0.00" type="number" isLight={isLight} />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addItem}
              className={`w-full py-2.5 rounded-xl border border-dashed text-sm font-medium transition-all flex items-center justify-center gap-2 ${isLight ? 'border-black/15 text-black/50 hover:border-[#00c685]/40 hover:text-[#00c685]' : 'border-white/[0.05] text-white/40 hover:border-[#00c685]/40 hover:text-[#00c685]'}`}>
              <Plus size={13} /> Add another item
            </button>

            {d.items.length > 0 && (
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${isLight ? 'bg-black/[0.04]' : 'bg-white/[0.04]'}`}>
                <span className={`text-sm font-semibold ${isLight ? 'text-black/70' : 'text-white/70'}`}>Estimated total</span>
                <span className="text-sm font-bold" style={{ color: GREEN }}>£{total.toLocaleString()}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step 5: Other Parties ────────────────────────────────────────────────────
function Step5({ d, setD, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; isLight: boolean }) {
  const addService = () => setD({ emergencyServices: [...d.emergencyServices, { id: uid(), service: 'Police', dateContacted: '', referenceNumber: '' }] });
  const removeService = (id: string) => setD({ emergencyServices: d.emergencyServices.filter(s => s.id !== id) });
  const updateService = (id: string, patch: Partial<EmergencyService>) => setD({ emergencyServices: d.emergencyServices.map(s => s.id === id ? { ...s, ...patch } : s) });

  const addParty = () => setD({ thirdParties: [...d.thirdParties, { id: uid(), name: '', role: '', contact: '', involvement: '' }] });
  const removeParty = (id: string) => setD({ thirdParties: d.thirdParties.filter(p => p.id !== id) });
  const updateParty = (id: string, patch: Partial<ThirdParty>) => setD({ thirdParties: d.thirdParties.map(p => p.id === id ? { ...p, ...patch } : p) });

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us what happened after the incident</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Let us know if any emergency services were contacted or if other parties were involved.</p>
      </div>

      {/* Emergency services */}
      <div>
        <LightFieldLabel isLight={isLight}>Did you contact the emergency services?</LightFieldLabel>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={d.contactedServices === true ? 'yes' : d.contactedServices === false ? 'no' : ''}
          onChange={v => setD({ contactedServices: v === 'yes' })}
          isLight={isLight}
        />
        {d.contactedServices && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-4 space-y-3">
            {d.emergencyServices.map((svc, i) => (
              <div key={svc.id} className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/08 bg-black/[0.02]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>Service {i + 1}</span>
                  <button type="button" onClick={() => removeService(svc.id)} className="text-red-400 hover:text-red-300"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <LightFieldLabel isLight={isLight}>Which service?</LightFieldLabel>
                    <select value={svc.service} onChange={e => updateService(svc.id, { service: e.target.value as any })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm h-10 focus:outline-none focus:border-[#00c685]/40 ${isLight ? 'border-black/[0.06] bg-black/[0.03] text-black' : 'border-white/[0.05] bg-white/[0.04] text-white'}`}>
                      <option>Police</option>
                      <option>Fire Service</option>
                      <option>Ambulance</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Date contacted</LightFieldLabel>
                    <Input value={svc.dateContacted} onChange={v => updateService(svc.id, { dateContacted: v })} type="date" isLight={isLight} />
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Reference / crime number</LightFieldLabel>
                    <Input value={svc.referenceNumber} onChange={v => updateService(svc.id, { referenceNumber: v })} placeholder="Optional" isLight={isLight} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addService}
              className={`w-full py-2.5 rounded-xl border border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-all ${isLight ? 'border-black/15 text-black/50 hover:border-[#00c685]/40 hover:text-[#00c685]' : 'border-white/[0.05] text-white/40 hover:border-[#00c685]/40 hover:text-[#00c685]'}`}>
              <Plus size={13} /> Add another service
            </button>
          </motion.div>
        )}
      </div>

      {/* Third parties */}
      <div>
        <LightFieldLabel isLight={isLight}>Is anyone else involved in this incident?</LightFieldLabel>
        <p className={`text-[11px] mb-2 ${isLight ? 'text-black/40' : 'text-white/35'}`}>For example: a neighbour, landlord, tenant, contractor or third party.</p>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={d.hasThirdParties === true ? 'yes' : d.hasThirdParties === false ? 'no' : ''}
          onChange={v => setD({ hasThirdParties: v === 'yes' })}
          isLight={isLight}
        />
        {d.hasThirdParties && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-4 space-y-3">
            {d.thirdParties.map((p, i) => (
              <div key={p.id} className={`p-4 rounded-xl border space-y-3 ${isLight ? 'border-black/08 bg-black/[0.02]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>Third party {i + 1}</span>
                  <button type="button" onClick={() => removeParty(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <LightFieldLabel isLight={isLight}>Name</LightFieldLabel>
                    <Input value={p.name} onChange={v => updateParty(p.id, { name: v })} placeholder="Full name" isLight={isLight} />
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Role / relationship</LightFieldLabel>
                    <Input value={p.role} onChange={v => updateParty(p.id, { role: v })} placeholder="e.g. Neighbour, Landlord" isLight={isLight} />
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Contact details (optional)</LightFieldLabel>
                    <Input value={p.contact} onChange={v => updateParty(p.id, { contact: v })} placeholder="Phone or email" isLight={isLight} />
                  </div>
                  <div>
                    <LightFieldLabel isLight={isLight}>Their involvement</LightFieldLabel>
                    <Input value={p.involvement} onChange={v => updateParty(p.id, { involvement: v })} placeholder="Briefly describe their role" isLight={isLight} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addParty}
              className={`w-full py-2.5 rounded-xl border border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-all ${isLight ? 'border-black/15 text-black/50 hover:border-[#00c685]/40 hover:text-[#00c685]' : 'border-white/[0.05] text-white/40 hover:border-[#00c685]/40 hover:text-[#00c685]'}`}>
              <Plus size={13} /> Add another party
            </button>
          </motion.div>
        )}
      </div>

      {/* Reported elsewhere */}
      <div>
        <LightFieldLabel isLight={isLight}>Was the incident reported to anyone else?</LightFieldLabel>
        <p className={`text-[11px] mb-2 ${isLight ? 'text-black/40' : 'text-white/35'}`}>For example: landlord, property manager, local authority, or housing association.</p>
        <RadioGroup
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={d.reportedElsewhere === true ? 'yes' : d.reportedElsewhere === false ? 'no' : ''}
          onChange={v => setD({ reportedElsewhere: v === 'yes' })}
          isLight={isLight}
        />
        {d.reportedElsewhere && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-3">
            <LightFieldLabel isLight={isLight}>Please provide details</LightFieldLabel>
            <Textarea value={d.reportedElsewhereDesc} onChange={v => setD({ reportedElsewhereDesc: v })} placeholder="Who was it reported to and when?" rows={3} isLight={isLight} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Step 6: Documents ────────────────────────────────────────────────────────
function Step6({ d, setD, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; isLight: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      id: uid(),
      name: f.name,
      size: f.size,
      type: f.type,
      category: f.type.startsWith('image/') ? 'photo' : 'document',
      status: 'ready' as const,
      progress: 100,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));
    setD({ files: [...d.files, ...newFiles] });
  };

  const removeFile = (id: string) => setD({ files: d.files.filter(f => f.id !== id) });

  const photos = d.files.filter(f => f.category === 'photo');
  const docs = d.files.filter(f => f.category !== 'photo');

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  const catLabel: Record<string, string> = { document: 'Document', receipt: 'Receipt', report: 'Report', quote: 'Quote', other: 'Other', photo: 'Photo' };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Add supporting documents</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Upload any photos or documents that help us understand your claim. You can add more later.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); }}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isLight ? 'border-black/15 hover:border-[#00c685]/40 hover:bg-[#00c685]/3' : 'border-white/[0.05] hover:border-[#00c685]/40 hover:bg-[#00c685]/5'}`}>
        <CloudUpload size={28} className={`mx-auto mb-3 ${isLight ? 'text-black/25' : 'text-white/25'}`} />
        <p className={`text-sm font-medium mb-1 ${isLight ? 'text-black/60' : 'text-white/55'}`}>Drag and drop files here, or <span className="text-[#00c685]">browse</span></p>
        <p className={`text-xs ${isLight ? 'text-black/35' : 'text-white/30'}`}>Photos, PDFs, receipts, invoices, reports — up to 20 MB each</p>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Photos section */}
      {photos.length > 0 && (
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-black/40' : 'text-white/35'}`}>Photos ({photos.length})</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map(f => (
              <div key={f.id} className="relative group aspect-square rounded-xl overflow-hidden border" style={{ borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}>
                {f.preview ? (
                  <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                    <ImageIcon size={20} className={isLight ? 'text-black/30' : 'text-white/30'} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => removeFile(f.id)} className="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents section */}
      {docs.length > 0 && (
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-black/40' : 'text-white/35'}`}>Documents ({docs.length})</p>
          <div className="space-y-2">
            {docs.map(f => (
              <div key={f.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isLight ? 'border-black/08 bg-black/[0.02]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${GREEN}15` }}>
                  <File size={14} style={{ color: GREEN }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isLight ? 'text-black/80' : 'text-white/80'}`}>{f.name}</p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? 'text-black/40' : 'text-white/35'}`}>{formatSize(f.size)}</p>
                </div>
                <button type="button" onClick={() => removeFile(f.id)} className={`shrink-0 ${isLight ? 'text-black/30 hover:text-red-400' : 'text-white/25 hover:text-red-400'} transition-colors`}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidance */}
      <InfoBox isLight={isLight} variant="info">
        <strong>Useful documents to upload:</strong><br />
        Photos of the damage (wide view + close-up) · Repair estimates or invoices · Police or fire report reference · Receipts for damaged items · Structural engineer reports
      </InfoBox>
    </motion.div>
  );
}

// ─── Step 7: Review ───────────────────────────────────────────────────────────
function Step7({ d, goToStep, isLight }: { d: ClaimDraft; goToStep: (n: number) => void; isLight: boolean }) {
  const cert = CERTIFICATES.find(c => c.participantId === 'P-0042');
  const total = d.items.reduce((s, i) => s + i.value * i.quantity, 0);

  const ReviewSection = ({ title, step, children }: { title: string; step: number; children: React.ReactNode }) => (
    <div className="rounded-xl border" style={{ background: isLight ? '#fff' : '#0d2117', borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
        <h3 className={`text-sm font-semibold ${isLight ? 'text-black/80' : 'text-white/80'}`}>{title}</h3>
        <button type="button" onClick={() => goToStep(step)} className="text-xs font-semibold text-[#00c685] flex items-center gap-1 hover:opacity-80 transition-opacity"><Edit2 size={11} />Edit</button>
      </div>
      <div className="p-4 space-y-2">{children}</div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between gap-4">
      <span className={`text-xs ${isLight ? 'text-black/45' : 'text-white/40'}`}>{label}</span>
      <span className={`text-xs font-medium text-right max-w-[60%] ${isLight ? 'text-black/80' : 'text-white/75'}`}>{value || '—'}</span>
    </div>
  );

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Review your claim</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Please check everything is correct before submitting. You can edit any section.</p>
      </div>

      <ReviewSection title="Incident" step={1}>
        <Row label="Claim type" value={d.claimType === 'Other' ? d.customType : d.claimType} />
        <Row label="Date of incident" value={d.unknownDate ? (d.approxDate || 'Approximate date not provided') : d.incidentDate} />
        <Row label="Ongoing?" value={d.isOngoing ? 'Yes' : 'No'} />
        {d.description && <p className={`text-xs leading-relaxed pt-1 border-t ${isLight ? 'border-black/[0.04] text-black/60' : 'border-white/[0.04] text-white/55'}`}>{d.description}</p>}
      </ReviewSection>

      <ReviewSection title="Property & Location" step={2}>
        <Row label="Insured property" value={cert?.propertyAddress} />
        <Row label="At insured property?" value={d.atInsuredProperty === true ? 'Yes' : d.atInsuredProperty === false ? 'No — ' + d.alternativeLocation : 'Not confirmed'} />
        <Row label="Rooms affected" value={d.affectedRooms.length > 0 ? d.affectedRooms.join(', ') : 'Not specified'} />
      </ReviewSection>

      <ReviewSection title="Damage" step={3}>
        <Row label="Areas affected" value={d.damagedCategories.join(', ') || 'Not specified'} />
        <Row label="Safe to leave?" value={d.isSafe === true ? 'Yes' : d.isSafe === false ? 'No' : 'Not confirmed'} />
        <Row label="Temp repair?" value={d.hasTempRepair === true ? 'Yes — ' + (d.tempRepairDesc || 'details provided') : d.hasTempRepair === false ? 'No' : 'Not confirmed'} />
        {d.damageDescription && <p className={`text-xs leading-relaxed pt-1 border-t ${isLight ? 'border-black/[0.04] text-black/60' : 'border-white/[0.04] text-white/55'}`}>{d.damageDescription}</p>}
      </ReviewSection>

      <ReviewSection title="Estimated Loss" step={4}>
        <Row label="Estimated amount" value={d.estimatedAmount ? `£${parseFloat(d.estimatedAmount).toLocaleString()}` : '—'} />
        <Row label="Has quote?" value={d.hasQuote === true ? 'Yes' : d.hasQuote === false ? 'Not yet' : '—'} />
        {d.isItemised && d.items.length > 0 && (
          <div className="pt-1 border-t space-y-1" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
            {d.items.map(i => <Row key={i.id} label={`${i.name || 'Item'} × ${i.quantity}`} value={`£${(i.value * i.quantity).toLocaleString()}`} />)}
            <div className="flex justify-between pt-1 border-t font-semibold" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
              <span className={`text-xs ${isLight ? 'text-black/60' : 'text-white/60'}`}>Items total</span>
              <span className="text-xs" style={{ color: GREEN }}>£{total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </ReviewSection>

      <ReviewSection title="Other Parties" step={5}>
        <Row label="Emergency services?" value={d.contactedServices === true ? `Yes (${d.emergencyServices.map(s => s.service).join(', ')})` : d.contactedServices === false ? 'No' : '—'} />
        <Row label="Third parties?" value={d.hasThirdParties === true ? `Yes (${d.thirdParties.length})` : d.hasThirdParties === false ? 'No' : '—'} />
        <Row label="Reported elsewhere?" value={d.reportedElsewhere === true ? 'Yes' : d.reportedElsewhere === false ? 'No' : '—'} />
      </ReviewSection>

      <ReviewSection title="Documents" step={6}>
        <Row label="Files uploaded" value={`${d.files.length} file${d.files.length !== 1 ? 's' : ''}`} />
        {d.files.map(f => (
          <p key={f.id} className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-black/50' : 'text-white/40'}`}>
            <PaperclipIcon size={10} />{f.name}
          </p>
        ))}
      </ReviewSection>
    </motion.div>
  );
}

// ─── Step 8: Declaration ──────────────────────────────────────────────────────
function Step8({ d, setD, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; isLight: boolean }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Submit your claim</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Before submitting, please read and confirm the declaration below.</p>
      </div>

      <InfoBox isLight={isLight} variant="info">
        Once submitted, your claim will be reviewed by our claims team. We may contact you if we need additional information or documents. We aim to acknowledge your claim within 1 business day.
      </InfoBox>

      {/* Declaration */}
      <div className="rounded-xl border p-5 space-y-4" style={{ background: isLight ? '#f8faf9' : '#0d2117', borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}>
        <h3 className={`text-sm font-semibold ${isLight ? 'text-black/85' : 'text-white'}`}>Declaration</h3>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/60' : 'text-white/55'}`}>
          I confirm that the information I have provided in this claim is accurate and complete to the best of my knowledge. I understand that providing false or misleading information may result in my claim being rejected and could constitute fraud.
        </p>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/60' : 'text-white/55'}`}>
          I consent to Takaful UK Ltd processing my personal data and sharing relevant information with our claims assessors, loss adjusters and other third parties as necessary to assess and manage this claim, in accordance with our Privacy Policy.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setD({ declaration: !d.declaration })}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${d.declaration ? 'bg-[#00c685] border-[#00c685]' : isLight ? 'border-black/20' : 'border-white/20'}`}>
            {d.declaration && <Check size={10} className="text-white" />}
          </div>
          <span className={`text-xs leading-relaxed font-medium ${isLight ? 'text-black/70' : 'text-white/65'}`}>
            I confirm that the information provided is accurate and complete, and I consent to the processing of my personal data for the purpose of assessing this claim.
          </span>
        </label>
      </div>
    </motion.div>
  );
}

// ─── Claim Success ────────────────────────────────────────────────────────────
function ClaimSuccess({ draft, claimId, isLight }: { draft: ClaimDraft; claimId: string; isLight: boolean }) {
  const router = useRouter();
  const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const TIMELINE = [
    { label: 'Claim submitted', done: true },
    { label: 'Initial review', done: false, note: 'Within 1 business day' },
    { label: 'Assessment', done: false, note: 'Our team will assess your claim' },
    { label: 'Decision', done: false, note: 'We will notify you of our decision' },
    { label: 'Payment', done: false, note: 'If approved, payment within 5 business days' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} className="space-y-8 py-4">
      {/* Success header */}
      <div className="text-center space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto" style={{ background: `${GREEN}15`, borderColor: `${GREEN}40` }}>
          <CheckCircle2 size={36} style={{ color: GREEN }} />
        </motion.div>
        <div>
          <h2 className={`text-2xl font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>Your claim has been submitted</h2>
          <p className={`text-sm mt-1.5 ${isLight ? 'text-black/50' : 'text-white/45'}`}>We've received your claim and our team will begin reviewing it shortly.</p>
        </div>
      </div>

      {/* Claim reference */}
      <div className="rounded-2xl border p-5 text-center" style={{ background: isLight ? '#f0faf5' : '#061510', borderColor: `${GREEN}30` }}>
        <p className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${isLight ? 'text-black/40' : 'text-white/35'}`}>Claim Reference</p>
        <p className="text-2xl font-bold font-mono" style={{ color: GREEN }}>{claimId}</p>
        <p className={`text-xs mt-2 ${isLight ? 'text-black/45' : 'text-white/40'}`}>Submitted {now}</p>
      </div>

      <div className={`rounded-xl border divide-y ${isLight ? 'divide-black/05' : 'divide-white/05'}`} style={{ background: isLight ? '#fff' : '#0d2117', borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}>
        {[
          ['Claim type', draft.claimType === 'Other' ? draft.customType : draft.claimType],
          ['Estimated amount', draft.estimatedAmount ? `£${parseFloat(draft.estimatedAmount).toLocaleString()}` : '—'],
          ['Status', 'Submitted'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between px-4 py-3">
            <span className={`text-xs ${isLight ? 'text-black/45' : 'text-white/40'}`}>{k}</span>
            <span className={`text-xs font-semibold ${k === 'Status' ? 'text-blue-400' : isLight ? 'text-black/80' : 'text-white/80'}`}>{v}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLight ? 'text-black/40' : 'text-white/35'}`}>What happens next</p>
        <div className="space-y-0">
          {TIMELINE.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${step.done ? '' : ''}`}
                  style={{ background: step.done ? GREEN : 'transparent', borderColor: step.done ? GREEN : isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)' }}>
                  {step.done ? <Check size={13} className="text-white" /> : <div className="w-2 h-2 rounded-full" style={{ background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)' }} />}
                </div>
                {i < TIMELINE.length - 1 && <div className="w-px h-8 mt-1" style={{ background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }} />}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-semibold ${step.done ? '' : isLight ? 'text-black/55' : 'text-white/45'}`} style={step.done ? { color: GREEN } : undefined}>{step.label}</p>
                {step.note && <p className={`text-xs mt-0.5 ${isLight ? 'text-black/35' : 'text-white/30'}`}>{step.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <Link href={`/dashboard/claims/CLM-2024-0891`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: GREEN }}>
          <Eye size={15} /> View Claim
        </Link>
        <Link href="/dashboard/claims"
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-colors ${isLight ? 'border-black/[0.06] text-black/70 hover:bg-black/[0.04]' : 'border-white/[0.05] text-white/70 hover:bg-white/[0.04]'}`}>
          <FileText size={15} /> Go to My Claims
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Wizard Root ──────────────────────────────────────────────────────────────
const BLANK: ClaimDraft = {
  claimType: '', customType: '', description: '', incidentDate: '', unknownDate: false, approxDate: '', isOngoing: false,
  atInsuredProperty: null, alternativeLocation: '', affectedRooms: [],
  damagedCategories: [], damageDescription: '', isSafe: null, hasTempRepair: null, tempRepairDesc: '', tempRepairDate: '', tempRepairBy: '', tempRepairCost: '',
  estimatedAmount: '', hasQuote: null, isItemised: false, items: [],
  contactedServices: null, emergencyServices: [], hasThirdParties: null, thirdParties: [], reportedElsewhere: null, reportedElsewhereDesc: '',
  files: [],
  declaration: false,
};

export default function NewClaimPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const router = useRouter();

  const BG_PAGE = isLight ? '#fcfdfd' : '#03120d';
  const BG_CARD = isLight ? '#ffffff' : '#0d2117';
  const BORDER = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)';
  const TEXT_MAIN = isLight ? 'text-black/85' : 'text-white';

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ClaimDraft>(BLANK);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [claimId] = useState(() => `CLM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);

  const update = useCallback((patch: Partial<ClaimDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }));
  }, []);

  const goToStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const validate = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!draft.claimType) e.claimType = 'Please select a claim type.';
      if (!draft.description.trim()) e.description = 'Please describe what happened.';
    }
    if (s === 2) {
      if (draft.atInsuredProperty === null) e.atInsuredProperty = 'Please confirm where the incident occurred.';
    }
    if (s === 3) {
      if (draft.damagedCategories.length === 0) e.damagedCategories = 'Please select at least one damaged area.';
      if (!draft.damageDescription.trim()) e.damageDescription = 'Please describe the damage.';
    }
    if (s === 4) {
      if (!draft.estimatedAmount || parseFloat(draft.estimatedAmount) <= 0) e.estimatedAmount = 'Please enter an estimated amount greater than zero.';
    }
    return e;
  };

  const handleNext = () => {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (step === TOTAL_STEPS) {
      if (!draft.declaration) { setErrors({ declaration: 'You must confirm the declaration before submitting.' }); return; }
      setSubmitted(true);
    } else {
      goToStep(step + 1);
    }
  };

  if (submitted) {
    return (
      <div style={{ background: BG_PAGE }} className="min-h-screen transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <ClaimSuccess draft={draft} claimId={claimId} isLight={isLight} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: BG_PAGE }} className="min-h-screen transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard/claims"
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isLight ? 'border-black/[0.06] text-black/50 hover:text-black hover:bg-black/[0.04]' : 'border-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.04]'}`}>
              <ArrowLeft size={15} />
            </Link>
            <div>
              <p className={`text-xs font-semibold ${isLight ? 'text-black/40' : 'text-white/35'}`}>My Claims</p>
              <p className={`text-sm font-bold leading-tight ${TEXT_MAIN}`}>New Claim</p>
            </div>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 px-3 py-1.5 rounded-full">
                <Check size={11} /> Progress saved
              </motion.div>
            )}
          </AnimatePresence>
          <button type="button" onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isLight ? 'text-black/50 hover:text-black hover:bg-black/[0.05]' : 'text-white/40 hover:text-white hover:bg-white/[0.05]'}`}>
            <Save size={12} /> Save
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-6 sm:p-8" style={{ background: BG_CARD, borderColor: BORDER }}>
          <StepIndicator current={step} isLight={isLight} />

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
              {step === 1 && <Step1 d={draft} setD={update} errors={errors} isLight={isLight} />}
              {step === 2 && <Step2 d={draft} setD={update} errors={errors} isLight={isLight} />}
              {step === 3 && <Step3 d={draft} setD={update} errors={errors} isLight={isLight} />}
              {step === 4 && <Step4 d={draft} setD={update} errors={errors} isLight={isLight} />}
              {step === 5 && <Step5 d={draft} setD={update} isLight={isLight} />}
              {step === 6 && <Step6 d={draft} setD={update} isLight={isLight} />}
              {step === 7 && <Step7 d={draft} goToStep={goToStep} isLight={isLight} />}
              {step === 8 && <Step8 d={draft} setD={update} isLight={isLight} />}
            </motion.div>
          </AnimatePresence>

          {errors.declaration && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle size={12} />{errors.declaration}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
            {step > 1 && (
              <button type="button" onClick={() => goToStep(step - 1)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${isLight ? 'border-black/[0.06] text-black/60 hover:bg-black/[0.04]' : 'border-white/[0.05] text-white/55 hover:bg-white/[0.04]'}`}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <div className="flex-1" />
            <button type="button" onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${isLight ? 'border-black/[0.06] text-black/60 hover:bg-black/[0.04]' : 'border-white/[0.05] text-white/55 hover:bg-white/[0.04]'}`}>
              <Save size={13} /> Save & exit
            </button>
            <button type="button" onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: GREEN }}>
              {step === TOTAL_STEPS ? (<><Check size={15} /> Submit Claim</>) : (<>Continue <ArrowRight size={14} /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
