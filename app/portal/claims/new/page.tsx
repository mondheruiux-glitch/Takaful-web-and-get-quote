'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, AlertTriangle,
  FileText, Plus, Home, Building2, Droplets, Flame, Wind, Shield,
  Zap, Package, Phone, AlertCircle, ShieldCheck, Trash2, Edit2,
  CloudUpload, X, Save, Clock,
  Armchair, Tv, Laptop, Shirt, Gem, Layers, Wrench, Hammer, Bike,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/dashboard/ThemeRoleContext';
import { CERTIFICATES } from '@/lib/dashboard/mock-data';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { DashboardAlert } from '@/components/ui/dashboard-alert';
import { OrderStatusCard } from '@/components/ui/order-status-card';

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
  { value: 'Storm', label: 'Storm Damage', icon: Wind, desc: 'Wind, hail, roof tiles or structural storm damage' },
  { value: 'Fire', label: 'Fire Damage', icon: Flame, desc: 'Fire, smoke damage or scorch marks' },
  { value: 'Theft', label: 'Theft or Burglary', icon: Shield, desc: 'Break-in, stolen items or physical damage during entry' },
  { value: 'Accidental Damage', label: 'Accidental Damage', icon: AlertTriangle, desc: 'Sudden, unexpected damage to fixtures or contents' },
  { value: 'Flood', label: 'External Flood', icon: Droplets, desc: 'Flooding from rivers, drains or surface run-off' },
  { value: 'Subsidence', label: 'Subsidence', icon: Building2, desc: 'Ground heave or movement causing structural wall cracks' },
  { value: 'Malicious Damage', label: 'Malicious Damage', icon: Zap, desc: 'Deliberate vandalism or damage by third parties' },
  { value: 'Other', label: 'Other', icon: Package, desc: 'Unlisted incident — please describe in detail' },
];

const ROOMS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living room', 'Hallway', 'Loft / attic', 'Roof', 'Garden / outdoor', 'Garage', 'Basement', 'Other'];

const DAMAGE_CATS = [
  'Building structure', 'Walls or ceilings', 'Roof', 'Flooring',
  'Fixtures and fittings', 'Furniture', 'Appliances', 'Personal belongings', 'Other',
];

const ITEM_CATS = ['Furniture', 'Appliance', 'Electronics', 'Clothing', 'Jewellery', 'Flooring', 'Fixture', 'Tool', 'Bicycle', 'Other'];

const STEP_LABELS = ['Incident', 'Location', 'Damage', 'Loss & Costs', 'Other Parties', 'Documents', 'Review', 'Declaration'];
const TOTAL_STEPS = 8;
const ACCENT = '#00c685';

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.05 } }),
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FieldLabel({ children, required, isLight }: { children: React.ReactNode; required?: boolean; isLight: boolean }) {
  return (
    <label className={`text-xs font-semibold tracking-wide block mb-1.5 ${isLight ? 'text-black/70' : 'text-white/60'}`}>
      {children}{required && <span className="text-red-400 ml-1 font-bold">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-400 mt-1.5 flex items-center gap-1.5 font-medium">
      <AlertCircle size={12} className="shrink-0" />
      {msg}
    </motion.p>
  );
}

// ─── Step 1: Incident ─────────────────────────────────────────────────────────
function Step1({ d, setD, errors, isLight, BORDER }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean; BORDER: string }) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us what happened</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Select the category of incident and describe what occurred.</p>
      </div>

      {/* Claim type */}
      <div>
        <FieldLabel required isLight={isLight}>What type of incident is this?</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2">
          {CLAIM_TYPES.map(ct => {
            const Icon = ct.icon;
            const sel = d.claimType === ct.value;
            return (
              <button
                key={ct.value}
                type="button"
                onClick={() => setD({ claimType: ct.value })}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer group ${
                  sel
                    ? 'border-[#00c685] bg-[#00c685]/10'
                    : isLight
                      ? 'border-black/[0.06] bg-black/[0.015] hover:border-[#00c685]/40 hover:bg-[#00c685]/5'
                      : 'border-white/[0.06] bg-white/[0.015] hover:border-[#00c685]/40 hover:bg-[#00c685]/5'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${sel ? 'bg-[#00c685]/20 text-[#00c685]' : isLight ? 'bg-black/[0.04] text-black/50' : 'bg-white/[0.04] text-white/50'}`}>
                    <Icon size={14} className={sel ? 'text-[#00c685]' : ''} />
                  </div>
                  <span className={`text-sm font-semibold ${sel ? 'text-[#00c685]' : isLight ? 'text-black/85' : 'text-white/90'}`}>{ct.label}</span>
                  {sel && <Check size={14} className="text-[#00c685] ml-auto shrink-0" />}
                </div>
                <p className={`text-[11px] leading-relaxed pl-9 ${isLight ? 'text-black/45' : 'text-white/40'}`}>{ct.desc}</p>
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.claimType} />
      </div>

      {/* Other type */}
      {d.claimType === 'Other' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <FieldLabel required isLight={isLight}>Please specify the nature of this claim</FieldLabel>
          <input
            value={d.customType}
            onChange={e => setD({ customType: e.target.value })}
            placeholder="e.g. Chimney collapse, tree fell on boundary wall"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:border-[#00c685] ${
              isLight ? 'border-black/[0.06] bg-black/[0.015] text-black placeholder:text-black/30' : 'border-white/[0.06] bg-white/[0.015] text-white placeholder:text-white/30'
            }`}
          />
        </motion.div>
      )}

      {/* Description */}
      <div>
        <FieldLabel required isLight={isLight}>Detailed incident description</FieldLabel>
        <textarea
          value={d.description}
          onChange={e => setD({ description: e.target.value })}
          placeholder="Please describe what happened, when you first noticed it, and how the damage occurred..."
          rows={5}
          className={`w-full p-4 rounded-xl border text-sm leading-relaxed transition-colors resize-none focus:outline-none focus:border-[#00c685] ${
            isLight ? 'border-black/[0.06] bg-black/[0.015] text-black placeholder:text-black/30' : 'border-white/[0.06] bg-white/[0.015] text-white placeholder:text-white/30'
          }`}
        />
        <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-black/45' : 'text-white/35'}`}>
          Include exact details such as visible water ingress points, affected rooms, or broken security fittings.
        </p>
        <FieldError msg={errors.description} />
      </div>

      {/* Incident date */}
      <div>
        <FieldLabel isLight={isLight}>When did the incident occur?</FieldLabel>
        <div className="space-y-3">
          {!d.unknownDate && (
            <input
              type="date"
              value={d.incidentDate}
              onChange={e => setD({ incidentDate: e.target.value })}
              className={`w-full max-w-sm px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685] transition-colors ${
                isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'
              }`}
            />
          )}

          <label className="flex items-center gap-2.5 cursor-pointer group w-fit select-none">
            <div
              onClick={() => setD({ unknownDate: !d.unknownDate })}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                d.unknownDate ? 'bg-[#00c685] border-[#00c685]' : isLight ? 'border-black/25 bg-transparent' : 'border-white/25 bg-transparent'
              }`}
            >
              {d.unknownDate && <Check size={11} className="text-white font-bold" />}
            </div>
            <span className={`text-xs font-medium ${isLight ? 'text-black/60' : 'text-white/50'}`}>I don't know the exact date (gradual discovery)</span>
          </label>

          {d.unknownDate && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
              <FieldLabel isLight={isLight}>Approximate date or timeframe</FieldLabel>
              <input
                value={d.approxDate}
                onChange={e => setD({ approxDate: e.target.value })}
                placeholder="e.g. Sometime between 14 and 18 July 2026"
                className={`w-full max-w-md px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685] transition-colors ${
                  isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'
                }`}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Ongoing incident */}
      <div>
        <FieldLabel isLight={isLight}>Is the damage still actively ongoing?</FieldLabel>
        <div className="flex gap-2">
          {[{ value: 'yes', label: 'Yes, ongoing leak or risk' }, { value: 'no', label: 'No, stabilized' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ isOngoing: opt.value === 'yes' })}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.isOngoing ? 'yes' : 'no') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {d.isOngoing && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-3">
            <DashboardAlert variant="warning" isLight={isLight} title="Immediate Safety Precaution">
              If water is actively leaking or there is an electrical fire hazard, turn off your main stopcock or consumer unit fuse immediately. If there is imminent danger to life or property, contact <strong>999</strong> without delay.
            </DashboardAlert>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────
function Step2({ d, setD, errors, isLight, BORDER, BG_SUBTLE }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean; BORDER: string; BG_SUBTLE: string }) {
  const cert = CERTIFICATES.find(c => c.participantId === 'P-0042') || CERTIFICATES[0];
  const toggleRoom = (room: string) => {
    const rooms = d.affectedRooms.includes(room) ? d.affectedRooms.filter(r => r !== room) : [...d.affectedRooms, room];
    setD({ affectedRooms: rooms });
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Where did it happen?</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Verify the property address and select the internal or external areas affected.</p>
      </div>

      {/* Insured property banner */}
      <div
        className="p-5 rounded-2xl border transition-all"
        style={{ background: BG_SUBTLE, borderColor: BORDER }}
      >
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-[#00c685]">Your Active Insured Property</p>
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#00c685]/10 text-[#00c685]">
            <Home size={18} />
          </div>
          <div>
            <p className={`text-sm font-bold ${isLight ? 'text-black/90' : 'text-white'}`}>{cert.propertyAddress}</p>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-black/50' : 'text-white/40'}`}>
              {cert.propertyType} · {cert.coverType} Cover · Certificate <span className="font-mono text-[#00c685]">{cert.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* At this property? */}
      <div>
        <FieldLabel required isLight={isLight}>Did the incident occur at this insured address?</FieldLabel>
        <div className="flex gap-2.5 mt-1.5">
          {[{ value: 'yes', label: 'Yes, at 14 Elm Street' }, { value: 'no', label: 'No, different address' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ atInsuredProperty: opt.value === 'yes' })}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.atInsuredProperty === true ? 'yes' : d.atInsuredProperty === false ? 'no' : '') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {d.atInsuredProperty === false && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-3 space-y-2">
            <DashboardAlert variant="warning" isLight={isLight} title="Location Notice">
              Under your certificate schedule, claims must relate directly to your registered premises. If this involves personal items away from home, personal belongings cover applies.
            </DashboardAlert>
            <input
              value={d.alternativeLocation}
              onChange={e => setD({ alternativeLocation: e.target.value })}
              placeholder="Enter full address or location description"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#00c685] ${
                isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'
              }`}
            />
          </motion.div>
        )}
        <FieldError msg={errors.atInsuredProperty} />
      </div>

      {/* Rooms affected */}
      <div>
        <FieldLabel isLight={isLight}>Which rooms or zones were affected? (select all that apply)</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {ROOMS.map(room => {
            const sel = d.affectedRooms.includes(room);
            return (
              <button
                key={room}
                type="button"
                onClick={() => toggleRoom(room)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  sel
                    ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                    : isLight
                      ? 'border-black/[0.06] bg-black/[0.015] text-black/60 hover:border-[#00c685]/30'
                      : 'border-white/[0.06] bg-white/[0.015] text-white/55 hover:border-[#00c685]/30 hover:text-white'
                }`}
              >
                {room}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Damage ───────────────────────────────────────────────────────────
function Step3({ d, setD, errors, isLight, BORDER, BG_SUBTLE }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean; BORDER: string; BG_SUBTLE: string }) {
  const toggleCat = (cat: string) => {
    const cats = d.damagedCategories.includes(cat) ? d.damagedCategories.filter(c => c !== cat) : [...d.damagedCategories, cat];
    setD({ damagedCategories: cats });
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us what was damaged</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Help us understand the nature of the damage and current safety situation.</p>
      </div>

      {/* Affected categories */}
      <div>
        <FieldLabel required isLight={isLight}>Damaged items or property elements (select all that apply)</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {DAMAGE_CATS.map(cat => {
            const sel = d.damagedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCat(cat)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  sel
                    ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                    : isLight
                      ? 'border-black/[0.06] bg-black/[0.015] text-black/60 hover:border-[#00c685]/30'
                      : 'border-white/[0.06] bg-white/[0.015] text-white/55 hover:border-[#00c685]/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.damagedCategories} />
      </div>

      {/* Damage details */}
      <div>
        <FieldLabel required isLight={isLight}>Damage description</FieldLabel>
        <textarea
          value={d.damageDescription}
          onChange={e => setD({ damageDescription: e.target.value })}
          placeholder="Describe the visible damage in detail (e.g. soaked floorboards, warped kitchen plinths, collapsed ceiling plaster)..."
          rows={5}
          className={`w-full p-4 rounded-xl border text-sm leading-relaxed transition-colors resize-none focus:outline-none focus:border-[#00c685] ${
            isLight ? 'border-black/[0.06] bg-black/[0.015] text-black placeholder:text-black/30' : 'border-white/[0.06] bg-white/[0.015] text-white placeholder:text-white/30'
          }`}
        />
        <FieldError msg={errors.damageDescription} />
      </div>

      {/* Is it safe? */}
      <div>
        <FieldLabel isLight={isLight}>Is the property currently safe and habitable?</FieldLabel>
        <div className="flex gap-2">
          {[{ value: 'yes', label: 'Yes, safe to stay' }, { value: 'no', label: 'No, uninhabitable or hazardous' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ isSafe: opt.value === 'yes' })}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.isSafe === true ? 'yes' : d.isSafe === false ? 'no' : '') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temporary repairs */}
      <div>
        <FieldLabel isLight={isLight}>Have any emergency or temporary repairs been carried out?</FieldLabel>
        <div className="flex gap-2">
          {[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ hasTempRepair: opt.value === 'yes' })}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.hasTempRepair === true ? 'yes' : d.hasTempRepair === false ? 'no' : '') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {d.hasTempRepair && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="mt-4 p-4.5 rounded-2xl border space-y-3"
            style={{ background: BG_SUBTLE, borderColor: BORDER }}
          >
            <div>
              <FieldLabel isLight={isLight}>What repair was done?</FieldLabel>
              <input
                value={d.tempRepairDesc}
                onChange={e => setD({ tempRepairDesc: e.target.value })}
                placeholder="e.g. Emergency plumber isolated pipe, contractor tarped damaged roof"
                className={`w-full px-3.5 py-2 rounded-xl border text-sm ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <FieldLabel isLight={isLight}>Date of repair</FieldLabel>
                <input
                  type="date"
                  value={d.tempRepairDate}
                  onChange={e => setD({ tempRepairDate: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                />
              </div>
              <div>
                <FieldLabel isLight={isLight}>Cost incurred (£)</FieldLabel>
                <input
                  value={d.tempRepairCost}
                  onChange={e => setD({ tempRepairCost: e.target.value })}
                  placeholder="£0.00"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                />
              </div>
              <div>
                <FieldLabel isLight={isLight}>Carried out by</FieldLabel>
                <input
                  value={d.tempRepairBy}
                  onChange={e => setD({ tempRepairBy: e.target.value })}
                  placeholder="e.g. 24/7 Emergency Plumber Ltd"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Loss & Costs ─────────────────────────────────────────────────────
function Step4({ d, setD, errors, isLight, BORDER, BG_SUBTLE }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; errors: Record<string, string>; isLight: boolean; BORDER: string; BG_SUBTLE: string }) {
  const addItem = () => setD({ items: [...d.items, { id: uid(), name: '', category: 'Furniture', description: '', age: '', value: 0, quantity: 1 }] });
  const removeItem = (id: string) => setD({ items: d.items.filter(i => i.id !== id) });
  const updateItem = (id: string, patch: Partial<ItemisedItem>) => setD({ items: d.items.map(i => i.id === id ? { ...i, ...patch } : i) });
  const itemsTotal = d.items.reduce((s, i) => s + (i.value * i.quantity), 0);

  const gross = parseFloat(d.estimatedAmount) || 0;
  const excess = 300;
  const net = Math.max(0, gross - excess);
  const belowExcess = gross > 0 && gross <= excess;

  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Tell us about the cost</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Provide your best estimate of the loss. We will review receipts, quotes, and assessor reports.</p>
      </div>

      {/* Estimated total loss */}
      <div>
        <FieldLabel required isLight={isLight}>Estimated total loss (£)</FieldLabel>
        <div className="relative max-w-sm">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm ${isLight ? 'text-black/40' : 'text-white/40'}`}>£</span>
          <input
            type="number"
            value={d.estimatedAmount}
            onChange={e => setD({ estimatedAmount: e.target.value })}
            placeholder="0.00"
            className={`w-full pl-8 pr-4 py-3 rounded-xl border text-lg font-bold focus:outline-none focus:border-[#00c685] transition-colors ${
              isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'
            }`}
          />
        </div>
        <FieldError msg={errors.estimatedAmount} />

        {/* Live Clause 4.2 breakdown */}
        {gross > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-2xl border p-4.5 space-y-3 ${
              belowExcess
                ? 'border-amber-500/25 bg-amber-500/[0.03]'
                : isLight ? 'border-emerald-200/80 bg-emerald-50/40' : 'border-emerald-500/15 bg-emerald-500/[0.03]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={isLight ? 'text-black/60' : 'text-white/60'}>Gross Claim Amount</span>
              <span className={isLight ? 'text-black/90' : 'text-white font-mono'}>£{gross.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={isLight ? 'text-black/60' : 'text-white/60'}>Standard Policy Excess (Clause 4.2)</span>
              <span className="text-rose-400 font-mono">−£{excess.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: BORDER }}>
              <div>
                <p className={`text-xs font-bold ${isLight ? 'text-black/80' : 'text-white/90'}`}>Estimated Net Benefit</p>
                <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/35'}`}>Disbursed from mutual pool upon assessment</p>
              </div>
              <p className={`text-lg font-bold font-mono ${net > 0 ? 'text-[#00c685]' : 'text-amber-400'}`}>
                £{net.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </p>
            </div>
            {belowExcess && (
              <p className="text-xs text-amber-400 leading-relaxed pt-1">
                Note: Estimated claim is at or below your £{excess} excess. You may still submit, but funds are only payable for amounts exceeding the certificate excess.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Quote available? */}
      <div>
        <FieldLabel isLight={isLight}>Do you have a tradesperson quote or repair estimate?</FieldLabel>
        <div className="flex gap-2.5">
          {[{ value: 'yes', label: 'Yes, quote received' }, { value: 'no', label: 'Not yet' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ hasQuote: opt.value === 'yes' })}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.hasQuote === true ? 'yes' : d.hasQuote === false ? 'no' : '') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {d.hasQuote && (
          <p className={`text-xs mt-2 ${isLight ? 'text-black/45' : 'text-white/40'}`}>You can upload a scan or photo of this quote in Step 6 (Documents).</p>
        )}
      </div>

      {/* Itemised loss list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <FieldLabel isLight={isLight}>Would you like to itemise individual items?</FieldLabel>
            <p className={`text-xs ${isLight ? 'text-black/45' : 'text-white/35'}`}>Recommended for furniture, electronics, and personal belongings.</p>
          </div>
          <button
            type="button"
            onClick={() => setD({ isItemised: !d.isItemised })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              d.isItemised
                ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/50'
            }`}
          >
            {d.isItemised ? 'Enabled' : '+ Enable Itemising'}
          </button>
        </div>

        {d.isItemised && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
            {d.items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border space-y-3"
                style={{ background: BG_SUBTLE, borderColor: BORDER }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isLight ? 'text-black/60' : 'text-white/50'}`}>Item #{idx + 1}</span>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <FieldLabel isLight={isLight}>Item name</FieldLabel>
                    <input
                      value={item.name}
                      onChange={e => updateItem(item.id, { name: e.target.value })}
                      placeholder="e.g. Samsung 55in TV"
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                  <div>
                    <FieldLabel isLight={isLight}>Category</FieldLabel>
                    <Select value={item.category} onValueChange={v => updateItem(item.id, { category: v })}>
                      <SelectTrigger className={`w-full rounded-xl text-xs h-9 ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className={isLight ? 'bg-white border-black/10' : 'bg-[#0a1a14] border-white/10 text-white'}>
                        {ITEM_CATS.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel isLight={isLight}>Approx. Age</FieldLabel>
                    <input
                      value={item.age}
                      onChange={e => updateItem(item.id, { age: e.target.value })}
                      placeholder="e.g. 18 months"
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                  <div>
                    <FieldLabel isLight={isLight}>Replacement (£)</FieldLabel>
                    <input
                      type="number"
                      value={item.value || ''}
                      onChange={e => updateItem(item.id, { value: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className={`w-full py-3 rounded-2xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLight ? 'border-black/15 text-black/50 hover:border-[#00c685] hover:text-[#00c685]' : 'border-white/10 text-white/40 hover:border-[#00c685] hover:text-[#00c685]'
              }`}
            >
              <Plus size={14} /> Add Another Item
            </button>

            {d.items.length > 0 && (
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: BG_SUBTLE }}>
                <span className={`text-xs font-semibold ${isLight ? 'text-black/60' : 'text-white/60'}`}>Total of Itemised Items</span>
                <span className="text-sm font-bold font-mono text-[#00c685]">£{itemsTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Step 5: Other Parties ────────────────────────────────────────────────────
function Step5({ d, setD, isLight, BORDER, BG_SUBTLE }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; isLight: boolean; BORDER: string; BG_SUBTLE: string }) {
  const addService = () => setD({ emergencyServices: [...d.emergencyServices, { id: uid(), service: 'Police', dateContacted: '', referenceNumber: '' }] });
  const removeService = (id: string) => setD({ emergencyServices: d.emergencyServices.filter(s => s.id !== id) });
  const updateService = (id: string, patch: Partial<EmergencyService>) => setD({ emergencyServices: d.emergencyServices.map(s => s.id === id ? { ...s, ...patch } : s) });

  const addParty = () => setD({ thirdParties: [...d.thirdParties, { id: uid(), name: '', role: '', contact: '', involvement: '' }] });
  const removeParty = (id: string) => setD({ thirdParties: d.thirdParties.filter(p => p.id !== id) });
  const updateParty = (id: string, patch: Partial<ThirdParty>) => setD({ thirdParties: d.thirdParties.map(p => p.id === id ? { ...p, ...patch } : p) });

  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Emergency services & other parties</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Let us know if the police, fire service, or external parties were notified.</p>
      </div>

      {/* Emergency services */}
      <div>
        <FieldLabel isLight={isLight}>Did you contact emergency services (Police, Fire, Ambulance)?</FieldLabel>
        <div className="flex gap-2.5">
          {[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ contactedServices: opt.value === 'yes' })}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.contactedServices === true ? 'yes' : d.contactedServices === false ? 'no' : '') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {d.contactedServices && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-4 space-y-3">
            {d.emergencyServices.map((svc, i) => (
              <div key={svc.id} className="p-4 rounded-xl border space-y-3" style={{ background: BG_SUBTLE, borderColor: BORDER }}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>Service #{i + 1}</span>
                  <button type="button" onClick={() => removeService(svc.id)} className="text-red-400 hover:text-red-300 text-xs"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <FieldLabel isLight={isLight}>Service</FieldLabel>
                    <Select value={svc.service} onValueChange={v => updateService(svc.id, { service: v as any })}>
                      <SelectTrigger className={`w-full rounded-xl text-xs h-9 ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isLight ? 'bg-white border-black/10' : 'bg-[#0a1a14] border-white/10 text-white'}>
                        <SelectItem value="Police">Police</SelectItem>
                        <SelectItem value="Fire Service">Fire Service</SelectItem>
                        <SelectItem value="Ambulance">Ambulance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel isLight={isLight}>Date contacted</FieldLabel>
                    <input
                      type="date"
                      value={svc.dateContacted}
                      onChange={e => updateService(svc.id, { dateContacted: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                  <div>
                    <FieldLabel isLight={isLight}>Incident / Crime CAD Ref</FieldLabel>
                    <input
                      value={svc.referenceNumber}
                      onChange={e => updateService(svc.id, { referenceNumber: e.target.value })}
                      placeholder="e.g. CAD-48912/26"
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className={`w-full py-2.5 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                isLight ? 'border-black/15 text-black/50 hover:text-[#00c685]' : 'border-white/10 text-white/40 hover:text-[#00c685]'
              }`}
            >
              <Plus size={13} /> Add Another Emergency Service
            </button>
          </motion.div>
        )}
      </div>

      {/* Third parties */}
      <div>
        <FieldLabel isLight={isLight}>Were any third parties involved? (e.g. neighbour, contractor, delivery driver)</FieldLabel>
        <div className="flex gap-2.5">
          {[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setD({ hasThirdParties: opt.value === 'yes' })}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                (d.hasThirdParties === true ? 'yes' : d.hasThirdParties === false ? 'no' : '') === opt.value
                  ? 'border-[#00c685] bg-[#00c685]/10 text-[#00c685]'
                  : isLight ? 'border-black/[0.06] bg-black/[0.015] text-black/60' : 'border-white/[0.06] bg-white/[0.015] text-white/55'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {d.hasThirdParties && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-4 space-y-3">
            {d.thirdParties.map((p, i) => (
              <div key={p.id} className="p-4 rounded-xl border space-y-3" style={{ background: BG_SUBTLE, borderColor: BORDER }}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isLight ? 'text-black/50' : 'text-white/40'}`}>Party #{i + 1}</span>
                  <button type="button" onClick={() => removeParty(p.id)} className="text-red-400 hover:text-red-300 text-xs"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel isLight={isLight}>Name</FieldLabel>
                    <input
                      value={p.name}
                      onChange={e => updateParty(p.id, { name: e.target.value })}
                      placeholder="Full name or company"
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                  <div>
                    <FieldLabel isLight={isLight}>Role or Relationship</FieldLabel>
                    <input
                      value={p.role}
                      onChange={e => updateParty(p.id, { role: e.target.value })}
                      placeholder="e.g. Neighbour at #16, Roofing contractor"
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isLight ? 'border-black/[0.06] bg-black/[0.015] text-black' : 'border-white/[0.06] bg-white/[0.015] text-white'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addParty}
              className={`w-full py-2.5 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                isLight ? 'border-black/15 text-black/50 hover:text-[#00c685]' : 'border-white/10 text-white/40 hover:text-[#00c685]'
              }`}
            >
              <Plus size={13} /> Add Another Third Party
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Step 6: Documents ────────────────────────────────────────────────────────
function Step6({ d, setD, isLight, BORDER, BG_SUBTLE }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; isLight: boolean; BORDER: string; BG_SUBTLE: string }) {
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
  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Upload photos & supporting evidence</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Attach clear photos of the damage, repair receipts, or contractor quotes.</p>
      </div>

      {/* Drag & drop area */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
          isLight
            ? 'border-black/15 bg-black/[0.01] hover:border-[#00c685] hover:bg-[#00c685]/5'
            : 'border-white/10 bg-white/[0.01] hover:border-[#00c685] hover:bg-[#00c685]/5'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-[#00c685]/10 text-[#00c685]">
          <CloudUpload size={24} />
        </div>
        <p className={`text-sm font-semibold mb-1 ${isLight ? 'text-black/80' : 'text-white/80'}`}>
          Drag and drop files here, or <span className="text-[#00c685]">browse files</span>
        </p>
        <p className={`text-xs ${isLight ? 'text-black/40' : 'text-white/35'}`}>
          Supports PNG, JPG, PDF, DOCX up to 25 MB per file
        </p>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Uploaded files preview */}
      {d.files.length > 0 && (
        <div className="space-y-3">
          <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-black/45' : 'text-white/40'}`}>
            Attached Files ({d.files.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {d.files.map(f => (
              <div
                key={f.id}
                className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
                style={{ background: BG_SUBTLE, borderColor: BORDER }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {f.preview ? (
                    <img src={f.preview} alt={f.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#00c685]/10 text-[#00c685]">
                      <FileText size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isLight ? 'text-black/85' : 'text-white/90'}`}>{f.name}</p>
                    <p className={`text-[10px] mt-0.5 ${isLight ? 'text-black/40' : 'text-white/40'}`}>{formatSize(f.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 7: Review ───────────────────────────────────────────────────────────
function Step7({ d, goToStep, isLight, BORDER, BG_SUBTLE }: { d: ClaimDraft; goToStep: (n: number) => void; isLight: boolean; BORDER: string; BG_SUBTLE: string }) {
  const cert = CERTIFICATES.find(c => c.participantId === 'P-0042') || CERTIFICATES[0];
  const gross = parseFloat(d.estimatedAmount) || 0;
  const excess = 300;
  const net = Math.max(0, gross - excess);

  const Section = ({ title, step, children }: { title: string; step: number; children: React.ReactNode }) => (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: BG_SUBTLE, borderColor: BORDER }}
    >
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: BORDER }}>
        <h3 className={`text-sm font-bold ${isLight ? 'text-black/85' : 'text-white/90'}`}>{title}</h3>
        <button
          type="button"
          onClick={() => goToStep(step)}
          className="text-xs font-semibold text-[#00c685] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit2 size={12} /> Edit
        </button>
      </div>
      <div className="space-y-2 text-xs">{children}</div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
    <div className="flex justify-between gap-4">
      <span className={isLight ? 'text-black/50' : 'text-white/45'}>{label}</span>
      <span className={`font-medium text-right ${isLight ? 'text-black/85' : 'text-white'}`}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Review your claim summary</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Verify all details before confirming the ethical mutual declaration.</p>
      </div>

      <Section title="1. Incident Information" step={1}>
        <Row label="Claim Category" value={d.claimType === 'Other' ? d.customType : d.claimType} />
        <Row label="Date of Incident" value={d.unknownDate ? (d.approxDate || 'Date approximate') : d.incidentDate} />
        <Row label="Active Status" value={d.isOngoing ? 'Still ongoing' : 'Stabilized'} />
        {d.description && <p className={`mt-2 p-3 rounded-xl ${isLight ? 'bg-black/[0.02] text-black/70' : 'bg-white/[0.02] text-white/70'} leading-relaxed`}>{d.description}</p>}
      </Section>

      <Section title="2. Property & Location" step={2}>
        <Row label="Property" value={cert.propertyAddress} />
        <Row label="At Insured Address?" value={d.atInsuredProperty === true ? 'Yes' : `No — ${d.alternativeLocation}`} />
        <Row label="Affected Zones" value={d.affectedRooms.length > 0 ? d.affectedRooms.join(', ') : 'Not specified'} />
      </Section>

      <Section title="3. Damage & Safety" step={3}>
        <Row label="Areas Affected" value={d.damagedCategories.join(', ') || 'None selected'} />
        <Row label="Property Habitable?" value={d.isSafe === true ? 'Yes' : d.isSafe === false ? 'Hazardous / Uninhabitable' : '—'} />
        <Row label="Emergency Repairs Made?" value={d.hasTempRepair ? `Yes (£${d.tempRepairCost || '0.00'})` : 'No'} />
      </Section>

      <Section title="4. Estimated Loss & Excess" step={4}>
        <Row label="Gross Estimated Amount" value={`£${gross.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`} />
        <Row label="Compulsory Excess (Clause 4.2)" value={<span className="text-rose-400 font-mono">−£{excess.toFixed(2)}</span>} />
        <Row label="Net Expected Mutual Benefit" value={<span className="text-[#00c685] font-bold font-mono">£{net.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>} />
      </Section>

      <Section title="5. Uploaded Documents" step={6}>
        <Row label="Total Files Attached" value={`${d.files.length} document(s)`} />
      </Section>
    </div>
  );
}

// ─── Step 8: Declaration ──────────────────────────────────────────────────────
function Step8({ d, setD, isLight }: { d: ClaimDraft; setD: (u: Partial<ClaimDraft>) => void; isLight: boolean }) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-black/90' : 'text-white'}`}>Confirmation & Declaration</h2>
        <p className={`text-sm ${isLight ? 'text-black/50' : 'text-white/45'}`}>Confirm your submission in accordance with mutual fund transparency.</p>
      </div>

      <div className={`p-6 rounded-3xl border space-y-4 ${isLight ? 'bg-emerald-50/50 border-emerald-200/80' : 'bg-emerald-500/[0.03] border-emerald-500/15'}`}>
        <div className="flex items-center gap-3 text-[#00c685]">
          <ShieldCheck size={22} />
          <h4 className="text-sm font-bold tracking-tight">The Takaful Mutual Trust Commitment</h4>
        </div>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
          Under the principles of Islamic mutual assistance (<em>Ta&apos;awun</em>), every participant contributes to a shared community pool to relieve loss and distress.
          Submitting a claim requires complete truthfulness, as funds are disbursed from community reserves entrusted to protect all member households.
        </p>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
          I confirm that all statements provided in this submission are accurate and complete to the best of my knowledge, and agree to provide reasonable access to certified loss adjusters for inspection.
        </p>

        <label className="flex items-start gap-3 cursor-pointer pt-2 select-none">
          <div
            onClick={() => setD({ declaration: !d.declaration })}
            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
              d.declaration ? 'bg-[#00c685] border-[#00c685]' : isLight ? 'border-black/30 bg-white' : 'border-white/30 bg-white/5'
            }`}
          >
            {d.declaration && <Check size={12} className="text-white font-bold" />}
          </div>
          <span className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-black/85' : 'text-white/90'}`}>
            I confirm that the details provided are true and accurate, and I consent to the processing of this claim by the Takaful claims board.
          </span>
        </label>
      </div>
    </div>
  );
}

// ─── Claim Success Screen ─────────────────────────────────────────────────────
// ─── Claim Confirmation Pop-up Modal (OrderStatusCard) ─────────────────────────
function ClaimSuccess({
  draft,
  claimId,
  onClose,
  onContinue,
}: {
  draft: ClaimDraft;
  claimId: string;
  onClose?: () => void;
  onContinue: () => void;
}) {
  const grossAmount = parseFloat(draft.estimatedAmount || '0');
  const amountFormatted = isNaN(grossAmount) || grossAmount <= 0
    ? 'To be assessed'
    : `£${grossAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0a1a14]/80 backdrop-blur-sm">
      {/* Exact portal ambient radial glows matching PortalLayout */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21rem] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.01)_50%,transparent_80%)]" />
        <div className="absolute top-0 left-0 h-[80rem] w-[15rem] [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.04)_0,rgba(0,198,133,0.01)_80%,transparent_100%)]" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.03)_0,transparent_100%)] absolute bottom-0 right-0 h-[60rem] w-[30rem] translate-y-[20%] rounded-full" />
      </div>
      <OrderStatusCard
        title="Claim Registered"
        description="Your claim has been submitted to the mutual protection pool."
        onClose={onClose}
        onContinue={onContinue}
        continueText="Continue to My Claims"
        timelineItems={[
          {
            icon: <CheckCircle2 className="h-4 w-4 text-[#00c685]" />,
            title: "Claim Submitted to Mutual Pool",
            details: `Allocated to Triage · Ref: ${claimId}`,
            statusChange: {
              from: "Draft",
              to: "Under Review",
            },
            subItems: [
              {
                icon: <ShieldCheck className="h-3.5 w-3.5 text-[#00c685]" />,
                text: "Protected under Takaful mutual fund",
              },
              {
                icon: <FileText className="h-3.5 w-3.5 text-white/50" />,
                text: `${draft.claimType || "Incident"} · Est. ${amountFormatted}`,
              },
            ],
          },
          {
            icon: <Clock className="h-4 w-4 text-amber-400" />,
            title: "Initial Handler Review",
            details: "Claims triage specialist assigned within 1 business day.",
            subItems: [
              {
                icon: <Phone className="h-3.5 w-3.5 text-white/50" />,
                text: "SMS and email confirmation sent to your registered contact",
              },
            ],
          },
          {
            icon: <Zap className="h-4 w-4 text-[#00c685]" />,
            title: "Settlement & Direct Payout",
            details: "Approved funds disbursed via BACS directly into your account.",
          },
        ]}
      />
    </div>
  );
}

// ─── Default Wizard Component ─────────────────────────────────────────────────
const BLANK_DRAFT: ClaimDraft = {
  claimType: '',
  customType: '',
  description: '',
  incidentDate: '',
  unknownDate: false,
  approxDate: '',
  isOngoing: false,
  atInsuredProperty: null,
  alternativeLocation: '',
  affectedRooms: [],
  damagedCategories: [],
  damageDescription: '',
  isSafe: null,
  hasTempRepair: null,
  tempRepairDesc: '',
  tempRepairDate: '',
  tempRepairBy: '',
  tempRepairCost: '',
  estimatedAmount: '',
  hasQuote: null,
  isItemised: false,
  items: [],
  contactedServices: null,
  emergencyServices: [],
  hasThirdParties: null,
  thirdParties: [],
  reportedElsewhere: null,
  reportedElsewhereDesc: '',
  files: [],
  declaration: false,
};

export default function PortalNewClaimPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const router = useRouter();

  /* ─ Design System tokens matching ParticipantOverview & MyCover ─ */
  const BORDER = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
  const BG_SURFACE = isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.02)';
  const BG_SUBTLE = isLight ? '#f8faf9' : 'rgba(255, 255, 255, 0.015)';

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ClaimDraft>(BLANK_DRAFT);
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
      if (!draft.claimType) e.claimType = 'Please select a claim category.';
      if (!draft.description.trim()) e.description = 'Please describe the incident.';
    }
    if (s === 2) {
      if (draft.atInsuredProperty === null) e.atInsuredProperty = 'Please verify if the incident occurred at your insured property.';
    }
    if (s === 3) {
      if (draft.damagedCategories.length === 0) e.damagedCategories = 'Please select at least one damaged area or item category.';
      if (!draft.damageDescription.trim()) e.damageDescription = 'Please provide details of the damage.';
    }
    if (s === 4) {
      if (!draft.estimatedAmount || parseFloat(draft.estimatedAmount) <= 0) e.estimatedAmount = 'Please enter an estimated loss amount greater than zero.';
    }
    return e;
  };

  const handleNext = () => {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (step === TOTAL_STEPS) {
      if (!draft.declaration) {
        setErrors({ declaration: 'You must confirm the mutual declaration before submitting.' });
        return;
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('takaful_claim_submitted_recently', 'true');
      }
      setSubmitted(true);
    } else {
      goToStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      goToStep(step - 1);
    } else {
      router.back();
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        {/* Confirmation Pop Up Modal with Portal Background */}
        <ClaimSuccess
          draft={draft}
          claimId={claimId}
          onClose={() => router.push('/portal/claims')}
          onContinue={() => router.push('/portal/claims')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-body transition-colors duration-200">
      
      {/* ── 1. Top Navigation Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer group ${
            isLight ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'
          }`}
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to My Claims
        </button>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs font-semibold text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 px-3 py-1 rounded-full flex items-center gap-1.5"
              >
                <Check size={11} /> Saved
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={handleSave}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isLight ? 'border-black/[0.06] text-black/60 hover:text-black' : 'border-white/[0.06] text-white/50 hover:text-white'
            }`}
          >
            <Save size={12} /> Save Draft
          </button>
        </div>
      </div>

      {/* ── 2. Editorial Header ── */}
      <div className="space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${
          isLight ? 'bg-gray-100/80 border-gray-200 text-gray-700' : 'bg-white/[0.04] border-white/[0.08] text-white/70'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c685]" />
          Mutual Protection
        </div>

        <h1 className={`font-heading text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.1] ${isLight ? 'text-black' : 'text-white'}`}>
          Submit a Claim
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${isLight ? 'text-black/55' : 'text-white/45'}`}>
          Report an incident and request assistance from the mutual protection pool. We aim to review submissions within 1 business day.
        </p>
      </div>

      {/* ── 3. Step Progress Bar ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className={isLight ? 'text-black/50' : 'text-white/40'}>Step {step} of {TOTAL_STEPS}</span>
          <span className="text-[#00c685] font-bold">{STEP_LABELS[step - 1]}</span>
        </div>
        <div className="flex gap-1.5">
          {STEP_LABELS.map((label, idx) => (
            <div
              key={label}
              className="flex-1 h-1.5 rounded-full overflow-hidden transition-all"
              style={{ background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  idx < step ? 'bg-[#00c685]' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Main Step Card (Exact Portal Surface & Border, No Heavy Drop Shadows) ── */}
      <div
        className="rounded-3xl border p-6 sm:p-8 relative transition-all"
        style={{
          background: BG_SURFACE,
          borderColor: BORDER,
        }}
      >
        {step === 1 && <Step1 d={draft} setD={update} errors={errors} isLight={isLight} BORDER={BORDER} />}
        {step === 2 && <Step2 d={draft} setD={update} errors={errors} isLight={isLight} BORDER={BORDER} BG_SUBTLE={BG_SUBTLE} />}
        {step === 3 && <Step3 d={draft} setD={update} errors={errors} isLight={isLight} BORDER={BORDER} BG_SUBTLE={BG_SUBTLE} />}
        {step === 4 && <Step4 d={draft} setD={update} errors={errors} isLight={isLight} BORDER={BORDER} BG_SUBTLE={BG_SUBTLE} />}
        {step === 5 && <Step5 d={draft} setD={update} isLight={isLight} BORDER={BORDER} BG_SUBTLE={BG_SUBTLE} />}
        {step === 6 && <Step6 d={draft} setD={update} isLight={isLight} BORDER={BORDER} BG_SUBTLE={BG_SUBTLE} />}
        {step === 7 && <Step7 d={draft} goToStep={goToStep} isLight={isLight} BORDER={BORDER} BG_SUBTLE={BG_SUBTLE} />}
        {step === 8 && (
          <div className="space-y-4">
            <Step8 d={draft} setD={update} isLight={isLight} />
            <FieldError msg={errors.declaration} />
          </div>
        )}

        {/* ── Card Step Navigation Footer ── */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t" style={{ borderColor: BORDER }}>
          <button
            type="button"
            onClick={handleBack}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
              isLight
                ? 'border-black/[0.06] text-black/60 hover:bg-black/[0.03]'
                : 'border-white/[0.06] text-white/60 hover:bg-white/[0.03] hover:text-white'
            }`}
          >
            <ArrowLeft size={14} />
            {step === 1 ? 'Cancel' : 'Previous Step'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer bg-[#00c685]"
          >
            {step === TOTAL_STEPS ? 'Submit Claim' : 'Continue'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
