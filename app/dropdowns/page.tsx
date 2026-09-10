'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Zap, Droplets, Wrench, Trees, CircleSlash, Clock, Lock, Key,
  Shield, Laptop, Plus, Check, ChevronDown, User, BriefcaseBusiness, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Custom Select Component with Portal & Framer Motion
type SelCtxType = {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  triggerText: string;
  setTriggerText: (t: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};
const SelCtx = React.createContext<SelCtxType | null>(null);

function Select({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [triggerText, setTriggerText] = useState('');
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        contentRef.current && !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <SelCtx.Provider value={{ value, onValueChange, open, setOpen, triggerText, setTriggerText, triggerRef, contentRef }}>
      <div className="relative w-full">{children}</div>
    </SelCtx.Provider>
  );
}

function SelectTrigger() {
  const c = React.useContext(SelCtx);
  if (!c) return null;
  const { open, setOpen, triggerText, triggerRef } = c;
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white focus:outline-none focus:border-[#00c685]/50 transition-colors"
    >
      <span className="truncate">{triggerText || <span className="text-white/30">Select an option...</span>}</span>
      <ChevronDown size={16} className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? 'rotate-180 text-[#00c685]' : ''}`} />
    </button>
  );
}

function SelectContent({ children }: { children: React.ReactNode }) {
  const c = React.useContext(SelCtx);
  if (!c) return null;
  const { open, triggerRef, contentRef } = c;
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  }, [open, triggerRef]);

  if (!open || !rect) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
        }}
        className="max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-[#061812] p-1.5 shadow-2xl backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function SelectItem({ value, icon, children }: { value: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const c = React.useContext(SelCtx);
  if (!c) return null;
  const { value: sel, onValueChange, setOpen, setTriggerText } = c;
  const isSel = sel === value;

  useEffect(() => {
    if (isSel) setTriggerText(String(children));
  }, [isSel, children, setTriggerText]);

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setTriggerText(String(children));
        setOpen(false);
      }}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
        isSel
          ? 'text-[#00c685] bg-[#00c685]/15 font-semibold'
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {isSel && <Check size={14} className="text-[#00c685] shrink-0" />}
    </button>
  );
}

export default function AllDropdownsPage() {
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [d3, setD3] = useState('');
  const [d4, setD4] = useState('');
  const [d5, setD5] = useState('');
  const [d6, setD6] = useState('');
  const [d7, setD7] = useState('');
  const [d8, setD8] = useState('');
  const [d9, setD9] = useState('');
  const [d10, setD10] = useState('');
  const [d11, setD11] = useState('');
  const [d12, setD12] = useState('');
  const [d13, setD13] = useState('');
  const [d14, setD14] = useState('');

  const dropdownsList = [
    { id: 1, title: 'Flat Type', state: d1, setState: setD1, options: [
      { v: 'basement', l: 'Basement flat' },
      { v: 'ground', l: 'Ground floor flat' },
      { v: 'first', l: 'First floor flat' },
      { v: 'second-plus', l: 'Second floor or above' },
    ]},
    { id: 2, title: 'Wall Construction', state: d2, setState: setD2, options: [
      { v: 'brick', l: 'Brick' },
      { v: 'stone', l: 'Stone' },
      { v: 'timber', l: 'Timber frame' },
      { v: 'concrete', l: 'Concrete' },
      { v: 'other', l: 'Other / Not sure' },
    ]},
    { id: 3, title: 'Roof Type', state: d3, setState: setD3, options: [
      { v: 'pitched-tiles', l: 'Pitched – Tiles' },
      { v: 'pitched-slate', l: 'Pitched – Slate' },
      { v: 'flat', l: 'Flat roof' },
      { v: 'mixed', l: 'Mixed (part flat, part pitched)' },
      { v: 'other', l: 'Other / Not sure' },
    ]},
    { id: 4, title: 'Flat Roof Percentage', state: d4, setState: setD4, options: [
      { v: 'lt10', l: 'Up to 10%' },
      { v: 'lt20', l: 'Up to 20%' },
      { v: 'lt30', l: 'Up to 30%' },
      { v: 'lt50', l: 'Up to 50%' },
      { v: 'gt50', l: 'More than 50%' },
      { v: 'all', l: 'Entire roof is flat' },
    ]},
    { id: 5, title: 'Type of Heating', state: d5, setState: setD5, options: [
      { v: 'gas-central', l: 'Gas Central Heating', icon: <Flame className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'gas-tank', l: 'Gas with Hot Water Tank', icon: <Flame className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'electric', l: 'Electric Heating', icon: <Zap className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'oil', l: 'Oil-Fired Heating', icon: <Droplets className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'heat-pump', l: 'Heat Pump', icon: <Wrench className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'solid-fuel', l: 'Solid Fuel / Multi-Fuel', icon: <Trees className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'none', l: 'No Central Heating', icon: <CircleSlash className="w-3.5 h-3.5 text-[#00c685]" /> },
    ]},
    { id: 6, title: 'Extension Type', state: d6, setState: setD6, options: [
      { v: 'rear', l: 'Rear extension' },
      { v: 'side', l: 'Side extension' },
      { v: 'loft', l: 'Loft conversion' },
      { v: 'garage', l: 'Garage conversion' },
      { v: 'conservatory', l: 'Conservatory' },
      { v: 'other', l: 'Other' },
    ]},
    { id: 7, title: 'Rental Type', state: d7, setState: setD7, options: [
      { v: 'private-furnished', l: 'Private landlord — furnished' },
      { v: 'private-unfurnished', l: 'Private landlord — unfurnished' },
      { v: 'council', l: 'Local authority / Council' },
      { v: 'housing-assoc', l: 'Housing association' },
      { v: 'other', l: 'Other arrangement' },
    ]},
    { id: 8, title: 'Unoccupied Period', state: d8, setState: setD8, options: [
      { v: 'lt30', l: 'Less than 30 days', icon: <Clock className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: '30-60', l: '30–60 days', icon: <Clock className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: '60-90', l: '60–90 days', icon: <Clock className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'gt90', l: 'More than 90 days', icon: <Clock className="w-3.5 h-3.5 text-[#00c685]" /> },
    ]},
    { id: 9, title: 'Business Use', state: d9, setState: setD9, options: [
      { v: 'no', l: 'No business use', icon: <CircleSlash className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'wfh', l: 'Working from home — clerical only', icon: <Laptop className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'wfh-visitors', l: 'Working from home — with visitors', icon: <User className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'other', l: 'Other business use', icon: <BriefcaseBusiness className="w-3.5 h-3.5 text-[#00c685]" /> },
    ]},
    { id: 10, title: 'Business Visitor Frequency', state: d10, setState: setD10, options: [
      { v: 'never', l: 'Never' },
      { v: 'occasionally', l: 'Occasionally' },
      { v: 'monthly', l: 'Monthly' },
      { v: 'weekly', l: 'Weekly' },
      { v: 'several-week', l: 'Several times per week' },
      { v: 'daily', l: 'Daily' },
    ]},
    { id: 11, title: 'Locks on External Doors', state: d11, setState: setD11, options: [
      { v: '5lever-bs3621', l: '5-lever mortice deadlock (BS 3621)', icon: <Lock className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: '5lever', l: '5-lever mortice deadlock', icon: <Lock className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'multipoint', l: 'Key-operated multi-point locking system', icon: <Key className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'yale', l: 'Rim automatic deadlatch (Yale-type)', icon: <Shield className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'smart', l: 'Smart lock', icon: <Laptop className="w-3.5 h-3.5 text-[#00c685]" /> },
      { v: 'other', l: 'Other', icon: <Plus className="w-3.5 h-3.5 text-[#00c685]" /> },
    ]},
    { id: 12, title: 'Buildings Voluntary Excess', state: d12, setState: setD12, options: [
      { v: '0', l: '£0' },
      { v: '150', l: '£150' },
      { v: '250', l: '£250 — Recommended' },
      { v: '500', l: '£500' },
      { v: '1000', l: '£1,000' },
    ]},
    { id: 13, title: 'Contents Voluntary Excess', state: d13, setState: setD13, options: [
      { v: '0', l: '£0' },
      { v: '100', l: '£100' },
      { v: '250', l: '£250 — Recommended' },
      { v: '500', l: '£500' },
      { v: '1000', l: '£1,000' },
    ]},
    { id: 14, title: 'Title', state: d14, setState: setD14, options: [
      { v: 'mr', l: 'Mr' },
      { v: 'mrs', l: 'Mrs' },
      { v: 'ms', l: 'Ms' },
      { v: 'miss', l: 'Miss' },
      { v: 'dr', l: 'Dr' },
      { v: 'prof', l: 'Prof' },
      { v: 'other', l: 'Other' },
    ]},
  ];

  return (
    <div className="min-h-screen bg-[#03120d] text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#00c685] hover:underline mb-2">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">All 14 Dropdown Components</h1>
            <p className="text-sm text-white/50 mt-1">
              Complete collection of custom portal-based select components used across the Get Quote flow.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#00c685]/10 border border-[#00c685]/20 text-[#00c685] text-xs font-semibold">
            14 Components
          </div>
        </div>

        {/* Grid of Interactive Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dropdownsList.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] space-y-3 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  {item.id}. {item.title}
                </label>
                {item.state && (
                  <span className="text-[10px] text-[#00c685] font-mono bg-[#00c685]/10 px-2 py-0.5 rounded">
                    Selected: {item.state}
                  </span>
                )}
              </div>
              <Select value={item.state} onValueChange={item.setState}>
                <SelectTrigger />
                <SelectContent>
                  {item.options.map((opt) => (
                    <SelectItem key={opt.v} value={opt.v} icon={'icon' in opt ? (opt as any).icon : undefined}>
                      {opt.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Section 2: All Options Expanded View */}
        <div className="pt-10 border-t border-white/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Expanded View — All Available Options for Each Dropdown</h2>
            <p className="text-xs text-white/50 mt-1">
              Static expanded previews showing all items, icons, and option values for each of the 14 dropdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dropdownsList.map((item) => (
              <div key={`expanded-${item.id}`} className="p-5 rounded-2xl border border-white/8 bg-[#041912]/60 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00c685]">
                    {item.id}. {item.title}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {item.options.length} options
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#061812] p-1.5 space-y-1">
                  {item.options.map((opt) => {
                    const isSelected = item.state === opt.v;
                    const optIcon = 'icon' in opt ? (opt as any).icon : null;
                    return (
                      <div
                        key={opt.v}
                        onClick={() => item.setState(opt.v)}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'text-[#00c685] bg-[#00c685]/15 font-semibold'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {optIcon && <span className="shrink-0">{optIcon}</span>}
                        <span className="flex-1 truncate">{opt.l}</span>
                        <span className="text-[9px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
                          {opt.v}
                        </span>
                        {isSelected && <Check size={14} className="text-[#00c685] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
