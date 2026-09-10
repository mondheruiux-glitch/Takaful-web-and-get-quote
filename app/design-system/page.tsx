'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Building, Layers, Trees, Building2, Gem, Grid, Minus, Flame,
  Zap, Droplets, Wrench, CircleSlash, Clock, Lock, Key, Shield, Laptop,
  Plus, Check, ChevronDown, Scale, ShieldCheck, CreditCard, FileText,
  TrendingUp, TrendingDown, Bell, AlertTriangle, Activity,
  Sparkles, Package, ArrowLeft, Tv, MapPin, Calendar, Users,
  LayoutGrid, Percent, Expand, User, Briefcase, PoundSterling,
  Settings, HelpCircle, LogOut, Sun, Moon,
} from 'lucide-react';
import Link from 'next/link';
import { DEMO_USERS } from '@/lib/dashboard/mock-data';
import { getDicebearAvatar } from '@/lib/dashboard/avatars';

const GREEN = '#00c685';
const INPUT_CLS = 'w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/[0.04] text-white placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors h-10 text-sm';

// ─── Theme Context ─────────────────────────────────────────────────────────────
const DSThemeCtx = React.createContext<{ isLight: boolean }>({ isLight: false });
const useDSTheme = () => React.useContext(DSThemeCtx).isLight;

// ─── Portal Select ─────────────────────────────────────────────────────────────
interface SelCtx {
  value: string; onValueChange: (v: string) => void;
  open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerText: string; setTriggerText: React.Dispatch<React.SetStateAction<string>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  isLight?: boolean;
}
const SelCtx = React.createContext<SelCtx | null>(null);

function Select({ value, onValueChange, children, isLight: propIsLight }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  const [open, setOpen] = useState(false);
  const [triggerText, setTriggerText] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !contentRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <SelCtx.Provider value={{ value, onValueChange, open, setOpen, triggerText, setTriggerText, triggerRef, contentRef, isLight }}>
      <div className="relative w-full" ref={wrapRef}>{children}</div>
    </SelCtx.Provider>
  );
}

function SelectTrigger({ children, isLight: propIsLight }: { children?: React.ReactNode; isLight?: boolean }) {
  const c = React.useContext(SelCtx); if (!c) return null;
  const themeIsLight = useDSTheme();
  const { open, setOpen, triggerText, triggerRef, isLight: ctxIsLight } = c;
  const isLight = propIsLight ?? ctxIsLight ?? themeIsLight;
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      style={{
        background: isLight ? '#ffffff' : 'rgba(255,255,255,0.04)',
        borderColor: isLight ? '#D1D5DB' : 'rgba(255,255,255,0.08)',
        color: isLight ? '#111827' : '#ffffff',
      }}
      className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3.5 text-sm focus:outline-none focus:border-[#00c685]/40 transition-colors cursor-pointer"
    >
      <span className="truncate">{triggerText || <span style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.2)' }}>Select...</span>}</span>
      <ChevronDown size={14} style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}
function SelectValue({ placeholder }: { placeholder?: string }) { return null; }

function SelectContent({ children, isLight: propIsLight }: { children: React.ReactNode; isLight?: boolean }) {
  const c = React.useContext(SelCtx); if (!c) return null;
  const themeIsLight = useDSTheme();
  const { open, triggerRef, contentRef, isLight: ctxIsLight } = c;
  const isLight = propIsLight ?? ctxIsLight ?? themeIsLight;
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => { if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect()); }, [open, triggerRef]);
  if (!open || !rect) return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.12 }}
        style={{
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
          background: isLight ? '#ffffff' : '#0a0a0a',
          borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.1)',
          boxShadow: isLight ? '0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        className="max-h-60 overflow-y-auto rounded-lg border p-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function SelectItem({ value, icon, children, isLight: propIsLight }: { value: string; icon?: React.ReactNode; children: React.ReactNode; isLight?: boolean }) {
  const c = React.useContext(SelCtx); if (!c) return null;
  const themeIsLight = useDSTheme();
  const { value: sel, onValueChange, setOpen, setTriggerText, isLight: ctxIsLight } = c;
  const isLight = propIsLight ?? ctxIsLight ?? themeIsLight;
  const isSel = sel === value;
  useEffect(() => { if (isSel) setTriggerText(String(children)); }, [isSel, children, setTriggerText]);
  return (
    <button
      type="button"
      onClick={() => { onValueChange(value); setTriggerText(String(children)); setOpen(false); }}
      style={{
        color: isSel ? '#00c685' : (isLight ? '#374151' : '#D1D5DB'),
        backgroundColor: isSel ? 'rgba(0,198,133,0.1)' : 'transparent',
      }}
      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
        isLight ? 'hover:bg-gray-100' : 'hover:bg-white/5'
      } ${isSel ? 'font-semibold' : ''}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {isSel && <Check size={12} className="text-[#00c685] shrink-0" />}
    </button>
  );
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">{children}</p>;
}
function FieldLabel({ children, htmlFor, isLight: propIsLight }: { children: React.ReactNode; htmlFor?: string; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <label
      htmlFor={htmlFor}
      className="text-[10px] font-semibold uppercase tracking-wide block mb-1.5"
      style={{ color: isLight ? '#4B5563' : 'rgba(255,255,255,0.4)' }}
    >
      {children}
    </label>
  );
}
function Divider({ isLight: propIsLight }: { isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return <div className="border-t my-1 transition-colors" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }} />;
}

function Stepper({ value, onChange, min = 0, max = 20, isLight: propIsLight }: { value: number; onChange: (v: number) => void; min?: number; max?: number; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          background: isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)',
          borderColor: isLight ? '#D1D5DB' : 'rgba(255,255,255,0.1)',
          color: isLight ? '#374151' : '#ffffff',
        }}
        className="w-7 h-7 rounded-full border flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer"
      >
        <Minus size={12} />
      </button>
      <span
        className="text-sm font-semibold w-5 text-center tabular-nums"
        style={{ color: isLight ? '#111827' : '#ffffff' }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          background: isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)',
          borderColor: isLight ? '#D1D5DB' : 'rgba(255,255,255,0.1)',
          color: isLight ? '#374151' : '#ffffff',
        }}
        className="w-7 h-7 rounded-full border flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function ToggleRow({ label, hint, value, onChange, isLight: propIsLight }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5 border-b last:border-0 transition-colors"
      style={{ borderColor: isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug" style={{ color: isLight ? '#1F2937' : '#E5E7EB' }}>{label}</p>
        {hint && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: isLight ? '#6B7280' : '#9CA3AF' }}>{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          background: value ? '#00c685' : (isLight ? '#D1D5DB' : 'rgba(255,255,255,0.1)'),
        }}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function CoverTypeCard({ label, description, icon: Icon, selected, onClick, isLight: propIsLight }: { label: string; description: string; icon: React.ElementType; selected: boolean; onClick: () => void; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderColor: selected ? 'rgba(0,198,133,0.5)' : (isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'),
        background: selected ? 'rgba(0,198,133,0.1)' : (isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'),
      }}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer group ${
        isLight ? 'hover:border-gray-300 hover:bg-gray-50/80 shadow-sm' : 'hover:bg-white/[0.04] hover:border-white/15'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          style={{
            background: selected ? 'rgba(0,198,133,0.2)' : (isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'),
            color: selected ? '#00c685' : (isLight ? '#4B5563' : '#9CA3AF'),
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all"
        >
          <Icon size={16} />
        </div>
        <div>
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: selected ? (isLight ? '#065F46' : '#ffffff') : (isLight ? '#111827' : '#D1D5DB') }}
          >
            {label}
          </p>
          <p
            className="text-xs mt-0.5 leading-relaxed"
            style={{ color: isLight ? '#6B7280' : '#9CA3AF' }}
          >
            {description}
          </p>
        </div>
        {selected && <Check size={14} className="text-[#00c685] ml-auto shrink-0 mt-1" />}
      </div>
    </button>
  );
}

function RiderCard({ icon: Icon, label, desc, selected, onClick, isLight: propIsLight }: { icon: React.ElementType; label: string; desc: string; selected: boolean; onClick: () => void; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderColor: selected ? 'rgba(0,198,133,0.5)' : (isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'),
        background: selected ? 'rgba(0,198,133,0.1)' : (isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'),
      }}
      className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${
        isLight ? 'hover:border-gray-300 hover:bg-gray-50/80 shadow-sm' : 'hover:border-white/15 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          style={{
            background: selected ? 'rgba(0,198,133,0.2)' : (isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'),
            color: selected ? '#00c685' : (isLight ? '#4B5563' : '#9CA3AF'),
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        >
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold"
            style={{ color: selected ? (isLight ? '#065F46' : '#ffffff') : (isLight ? '#111827' : '#D1D5DB') }}
          >
            {label}
          </p>
          <p
            className="text-[11px] mt-0.5 leading-snug"
            style={{ color: isLight ? '#6B7280' : '#9CA3AF' }}
          >
            {desc}
          </p>
        </div>
        <div
          style={{
            background: selected ? '#00c685' : 'transparent',
            borderColor: selected ? '#00c685' : (isLight ? '#D1D5DB' : 'rgba(255,255,255,0.2)'),
          }}
          className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
        >
          {selected && <Check size={10} className="text-[#0a1a14]" />}
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status, isLight: propIsLight }: { status: string; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  const darkMap: Record<string, string> = {
    'Submitted':'bg-blue-500/15 text-blue-400','Under Review':'bg-amber-500/15 text-amber-400',
    'Awaiting Information':'bg-orange-500/15 text-orange-400','Approved':'bg-green-500/15 text-green-400',
    'Rejected':'bg-red-500/15 text-red-400','Paid':'bg-emerald-500/15 text-emerald-400',
    'Active':'bg-green-500/15 text-green-400','Expiring':'bg-amber-500/15 text-amber-400',
    'Collected':'bg-emerald-500/15 text-emerald-400','Failed':'bg-red-500/15 text-red-400',
    'Pending':'bg-blue-500/15 text-blue-400','Low':'bg-emerald-500/15 text-emerald-400',
    'Medium':'bg-amber-500/15 text-amber-400','High':'bg-orange-500/15 text-orange-400','Critical':'bg-red-500/15 text-red-400',
  };
  const lightMap: Record<string, string> = {
    'Submitted':'bg-blue-50 text-blue-700 border border-blue-200/60',
    'Under Review':'bg-amber-50 text-amber-800 border border-amber-200/60',
    'Awaiting Information':'bg-orange-50 text-orange-800 border border-orange-200/60',
    'Approved':'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    'Rejected':'bg-red-50 text-red-800 border border-red-200/60',
    'Paid':'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    'Active':'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    'Expiring':'bg-amber-50 text-amber-800 border border-amber-200/60',
    'Collected':'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    'Failed':'bg-red-50 text-red-800 border border-red-200/60',
    'Pending':'bg-blue-50 text-blue-700 border border-blue-200/60',
    'Low':'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    'Medium':'bg-amber-50 text-amber-800 border border-amber-200/60',
    'High':'bg-orange-50 text-orange-800 border border-orange-200/60',
    'Critical':'bg-red-50 text-red-800 border border-red-200/60',
  };
  const cls = isLight ? (lightMap[status] ?? 'bg-gray-100 text-gray-700 border border-gray-200') : (darkMap[status] ?? 'bg-gray-500/15 text-gray-400');
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>{status}</span>;
}

// ─── Option Preview Components for Dropdowns ──────────────────────────────────
function OptionPreviewCard({ title, children, isLight: propIsLight }: { title: string; children: React.ReactNode; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <div
      className="space-y-2 p-3.5 rounded-xl border transition-colors"
      style={{
        borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)',
        background: isLight ? '#ffffff' : 'rgba(10,26,20,0.4)',
      }}
    >
      <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">{title}</span>
      <div
        className="rounded-lg border p-1 space-y-0.5 transition-colors"
        style={{
          borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.1)',
          background: isLight ? '#F9FAFB' : '#0a0a0a',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function OptionPreviewItem({
  icon,
  children,
  recommended,
  isLight: propIsLight,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  recommended?: boolean;
  isLight?: boolean;
}) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <div
      className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-xs transition-colors ${
        recommended ? 'text-[#00c685] bg-[#00c685]/10 font-semibold' : ''
      }`}
      style={recommended ? undefined : { color: isLight ? '#374151' : '#D1D5DB' }}
    >
      {icon}
      {children}
    </div>
  );
}

function KPICard({ label, value, sub, icon: Icon, trend, color = GREEN, isLight: propIsLight }: { label: string; value: string; sub?: string; icon?: React.ElementType; trend?: { dir: 'up'|'down'; text: string }; color?: string; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: isLight ? '#ffffff' : '#0d2117', border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.06)'}` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.35)' }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: isLight ? '#111827' : '#ffffff' }}>{value}</p>
          {sub && <p className="text-xs mt-0.5" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.4)' }}>{sub}</p>}
        </div>
        {Icon && <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${color}18` }}><Icon size={18} style={{ color }} /></div>}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {trend.dir === 'up' ? <TrendingUp size={13} className="text-[#00c685]" /> : <TrendingDown size={13} className="text-red-400" />}
          <span className={trend.dir === 'up' ? 'text-[#00c685]' : 'text-red-400'}>{trend.text}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Profile Dropdown Component ─────────────────────────────────────────── */
function ProfileDropdownPreview({
  mode = 'dark',
  defaultOpen = false,
  userKey = 'management',
}: {
  mode?: 'light' | 'dark';
  defaultOpen?: boolean;
  userKey?: 'participant' | 'claim_handler' | 'finance' | 'management';
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isLight = mode === 'light';
  const ref = useRef<HTMLDivElement>(null);

  const GREEN = '#00c685';
  const BORDER = isLight ? '#E4E7EC' : 'rgba(255,255,255,0.08)';
  const SURFACE_COLOR = isLight ? '#ffffff' : '#0d2117';
  const BG_PANEL = isLight ? '#f9fafb' : '#061510';

  const user = DEMO_USERS[userKey] ?? DEMO_USERS.management;
  const avatarSrc = getDicebearAvatar(user.name, user.gender);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${
        isLight ? 'bg-white text-gray-900 border-gray-200 shadow-sm' : 'bg-[#0a1a14] text-white border-white/8'
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00c685]">
            {isLight ? 'Light Theme Preview' : 'Dark Theme Preview'}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/60'}`}>
            Role: {user.name} ({user.role})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(v => !v)}
          className="text-xs text-[#00c685] hover:underline font-medium"
        >
          {isOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      {/* Simulated TopBar Bar */}
      <div
        className="flex items-center justify-between p-3 rounded-xl border mb-3"
        style={{ background: SURFACE_COLOR, borderColor: BORDER }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00c685]" />
          <span className={`text-xs font-semibold ${isLight ? 'text-gray-700' : 'text-white/80'}`}>Dashboard TopBar</span>
        </div>

        {/* Profile Trigger */}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setIsOpen(v => !v)}
            className="flex items-center gap-2 rounded-full transition-all hover:opacity-90 focus:outline-none cursor-pointer"
            aria-label="Open profile menu"
          >
            <img
              src={avatarSrc}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2"
              style={{ borderColor: isOpen ? GREEN : BORDER }}
            />
            <span className={`hidden sm:block text-xs font-semibold ${isLight ? 'text-gray-800' : 'text-white/85'}`}>
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown
              size={12}
              className={`hidden sm:block ${isLight ? 'text-gray-500' : 'text-white/40'} ${
                isOpen ? 'rotate-180' : ''
              } transition-transform duration-200`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50 shadow-2xl"
                style={{
                  background: SURFACE_COLOR,
                  border: `1px solid ${BORDER}`,
                  boxShadow: isLight ? '0 12px 36px rgba(0,0,0,0.12)' : '0 12px 36px rgba(0,0,0,0.5)',
                }}
              >
                {/* User identity header */}
                <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <p className={`text-sm font-bold leading-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-gray-500' : 'text-white/45'}`}>
                    {user.email}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00c685]/15 text-[#00c685]">
                    {user.jobTitle}
                  </span>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  {[
                    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
                    { icon: HelpCircle, label: 'Support Desk', href: '/dashboard/support' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-colors ${
                          isLight ? 'text-gray-700 hover:bg-gray-50' : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-full ${
                            isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-white/60'
                          }`}
                        >
                          <Icon size={14} />
                        </span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Sign out */}
                <div style={{ borderTop: `1px solid ${BORDER}` }} className="py-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-colors text-left ${
                      isLight ? 'text-red-600 hover:bg-red-50/50' : 'text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full ${
                        isLight ? 'bg-red-50 text-red-500' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      <LogOut size={14} />
                    </span>
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DSSection({ id, title, desc, children, isLight: propIsLight }: { id?: string; title: string; desc?: string; children: React.ReactNode; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <div className="pb-3" style={{ borderBottom: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}` }}>
        <h2 className="text-base font-bold" style={{ color: isLight ? '#111827' : '#ffffff' }}>{title}</h2>
        {desc && <p className="text-xs mt-0.5" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Code({ label, isLight: propIsLight }: { label: string; isLight?: boolean }) {
  const themeIsLight = useDSTheme();
  const isLight = propIsLight ?? themeIsLight;
  return (
    <span
      className="font-mono text-[10px] px-2 py-0.5 rounded-md border transition-colors"
      style={{
        color: isLight ? '#059669' : 'rgba(0,198,133,0.8)',
        background: isLight ? '#ecfdf5' : 'rgba(0,198,133,0.08)',
        borderColor: isLight ? '#a7f3d0' : 'rgba(0,198,133,0.15)',
      }}
    >
      {label}
    </span>
  );
}

const NAV = [
  { id:'tokens', label:'Tokens' }, { id:'typography', label:'Typography' },
  { id:'profile-dropdown', label:'Profile Dropdown' },
  { id:'badges', label:'Badges' }, { id:'kpi', label:'KPI Cards' },
  { id:'inputs', label:'Inputs' }, { id:'dropdowns', label:'Dropdowns' },
  { id:'toggles', label:'Toggles' }, { id:'stepper', label:'Stepper' },
  { id:'cover', label:'Cover Cards' }, { id:'riders', label:'Riders' },
  { id:'divider', label:'Divider' }, { id:'labels', label:'Labels' },
  { id:'notifications', label:'Notifications' }, { id:'table', label:'Table' },
  { id:'buttons', label:'Buttons' }, { id:'alerts', label:'Alerts' },
];

export default function DesignSystemPage() {
  const [dsTheme, setDsTheme] = useState<'dark' | 'light'>('dark');
  const isLight = dsTheme === 'light';

  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);
  const [stepper1, setStepper1] = useState(3);
  const [stepper2, setStepper2] = useState(1);
  const [cover, setCover] = useState('both');
  const [r1, setR1] = useState(true);
  const [r2, setR2] = useState(false);
  const [r3, setR3] = useState(true);
  const [d1,setD1]=useState(''); const [d2,setD2]=useState(''); const [d3,setD3]=useState('');
  const [d4,setD4]=useState(''); const [d5,setD5]=useState(''); const [d6,setD6]=useState('');
  const [d7,setD7]=useState(''); const [d8,setD8]=useState(''); const [d9,setD9]=useState('');
  const [d10,setD10]=useState('');
  const [d11,setD11]=useState(''); const [d12,setD12]=useState(''); const [d13,setD13]=useState('');
  const [d14,setD14]=useState(''); const [d15,setD15]=useState(''); const [d16,setD16]=useState('');

  return (
    <DSThemeCtx.Provider value={{ isLight }}>
      <div className="min-h-screen transition-colors duration-300" style={{ background: isLight ? '#F0F4F2' : '#03120d', color: isLight ? '#111827' : '#ffffff' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300" style={{ borderBottom: `1px solid ${isLight ? '#D1D5DB' : 'rgba(255,255,255,0.08)'}`, background: isLight ? 'rgba(240,244,242,0.95)' : 'rgba(3,18,13,0.95)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0" style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}` }}>
              <ArrowLeft size={14} style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.6)' }} />
            </Link>
            <div>
              <h1 className="text-sm font-bold leading-none" style={{ color: isLight ? '#111827' : '#ffffff' }}>Takaful Design System</h1>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.3)' }}>Components · Tokens · Patterns</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`} className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.35)' }}>{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Pill */}
            <div
              className="flex items-center p-0.5 rounded-lg border text-xs"
              style={{
                background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                borderColor: isLight ? '#D1D5DB' : 'rgba(255,255,255,0.1)',
              }}
            >
              <button
                id="theme-dark-btn"
                type="button"
                onClick={() => setDsTheme('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  !isLight
                    ? 'bg-[#00c685] text-[#03120d] font-semibold shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Moon size={12} /> Dark
              </button>
              <button
                id="theme-light-btn"
                type="button"
                onClick={() => setDsTheme('light')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  isLight
                    ? 'bg-[#00c685] text-[#03120d] font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun size={12} /> Light
              </button>
            </div>
            <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#00c685]/60 font-mono bg-[#00c685]/5 border border-[#00c685]/15 px-2.5 py-1 rounded-full">v1.0</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-16" style={{ color: isLight ? '#111827' : '#ffffff' }}>

        {/* TOKENS */}
        <DSSection id="tokens" title="Design Tokens" desc="Core colour palette used across all pages." isLight={isLight}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              {name:'Accent Green',hex:'#00c685',cls:'bg-[#00c685]'},
              {name:'Surface Dark',hex:'#03120d',cls:'bg-[#03120d] border border-white/10'},
              {name:'Card Dark',hex:'#0d2117',cls:'bg-[#0d2117] border border-white/8'},
              {name:'Card Darker',hex:'#0a1a14',cls:'bg-[#0a1a14] border border-white/8'},
              {name:'White/8',hex:'rgba(255,255,255,0.08)',cls:'bg-white/8 border border-white/10'},
              {name:'White/4',hex:'rgba(255,255,255,0.04)',cls:'bg-white/[0.04] border border-white/10'},
              {name:'Amber',hex:'#f59e0b',cls:'bg-amber-500'},
              {name:'Red',hex:'#ef4444',cls:'bg-red-500'},
              {name:'Blue',hex:'#3b82f6',cls:'bg-blue-500'},
              {name:'Orange',hex:'#f97316',cls:'bg-orange-500'},
              {name:'Emerald',hex:'#10b981',cls:'bg-emerald-500'},
              {name:'Neutral 950',hex:'#0a0a0a',cls:'bg-neutral-950 border border-white/10'},
            ].map(t=>(
              <div key={t.name} className="space-y-2">
                <div className={`h-12 rounded-xl ${t.cls}`} style={isLight ? { borderColor: '#D1D5DB' } : undefined}/>
                <div>
                  <p className="text-[11px] font-medium" style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.7)' }}>{t.name}</p>
                  <p className="text-[10px] font-mono" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }}>{t.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </DSSection>

        {/* TYPOGRAPHY */}
        <DSSection id="typography" title="Typography Scale" desc="All text sizes and weights used in the system." isLight={isLight}>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}`, background: isLight ? '#ffffff' : '#0d2117' }}>
            {[
              {label:'H1 / Page Title',cls:`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`,sample:'As-salamu alaykum, Fatima 👋'},
              {label:'H2 / Section',cls:`text-base font-bold ${isLight ? 'text-gray-900' : 'text-white'}`,sample:'Takaful Pool Overview'},
              {label:'Card Heading',cls:`text-sm font-semibold ${isLight ? 'text-gray-800' : 'text-white/80'}`,sample:'My Current Cover'},
              {label:'Body / Table',cls:`text-sm ${isLight ? 'text-gray-700' : 'text-gray-300'}`,sample:'Buildings & Contents · Certificate TK-2024-0042'},
              {label:'Section Label',cls:'text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]',sample:'Property Details'},
              {label:'Field Label',cls:`text-[10px] font-semibold uppercase tracking-wide ${isLight ? 'text-gray-600' : 'text-white/40'}`,sample:'Wall Construction'},
              {label:'Caption',cls:`text-xs ${isLight ? 'text-gray-600' : 'text-white/40'}`,sample:'Due 1 Aug 2026 · TK-2024-0042'},
              {label:'Monospace',cls:`text-xs font-mono ${isLight ? 'text-emerald-700' : 'text-[#00c685]/60'}`,sample:'TK-2024-0042 · v1.0 · 98.3%'},
            ].map(t=>(
              <div key={t.label} className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: `1px solid ${isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'}` }}>
                <span className="text-[10px] font-mono w-32 shrink-0" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.25)' }}>{t.label}</span>
                <span className={`${t.cls} flex-1 truncate`}>{t.sample}</span>
              </div>
            ))}
          </div>
        </DSSection>

        {/* PROFILE DROPDOWN */}
        <DSSection
          id="profile-dropdown"
          title="Profile Avatar & Dropdown Menu"
          desc="The interactive user profile dropdown from the dashboard top-bar with role-aware avatar, name, email, role badge, navigation links, and sign out in both Light and Dark modes."
          isLight={isLight}
        >
          <Code label="<ProfileDropdown mode='light' | 'dark' userKey='...' />" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
            {/* Dark Mode Showcase */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c685]" />
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: isLight ? '#374151' : '#ffffff' }}>Dark Mode (Default Dashboard)</h3>
              </div>
              <ProfileDropdownPreview mode="dark" defaultOpen={true} userKey="management" />
            </div>

            {/* Light Mode Showcase */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c685]" />
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: isLight ? '#374151' : '#ffffff' }}>Light Mode (Clean & Crisp)</h3>
              </div>
              <ProfileDropdownPreview mode="light" defaultOpen={true} userKey="participant" />
            </div>
          </div>

          {/* Multiple Role Previews */}
          <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}` }}>
            <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.5)' }}>Interactive Trigger Demos Across Dashboard Roles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['management', 'participant', 'claim_handler', 'finance'] as const).map(roleKey => (
                <ProfileDropdownPreview key={roleKey} mode={dsTheme} defaultOpen={false} userKey={roleKey} />
              ))}
            </div>
          </div>
        </DSSection>

        {/* BADGES */}
        <DSSection id="badges" title="Status Badges" desc="Used in claims, certificates, contributions, and risk tables." isLight={isLight}>
          <Code label="<StatusBadge status='...' />" />
          <div className="flex flex-wrap gap-2 mt-3">
            {['Active','Submitted','Under Review','Awaiting Information','Approved','Rejected','Paid','Expiring','Collected','Failed','Pending','Low','Medium','High','Critical'].map(s=>(
              <StatusBadge key={s} status={s}/>
            ))}
          </div>
        </DSSection>

        {/* KPI */}
        <DSSection id="kpi" title="KPI Cards" desc="Dashboard overview metrics used across all four role views." isLight={isLight}>
          <Code label="<KPICard label='' value='' sub='' icon={} trend={{dir,text}} />" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
            <KPICard label="Certificate" value="TK-2024-0042" sub="Active · Expires 15 Jan 2027" icon={ShieldCheck} isLight={isLight}/>
            <KPICard label="Monthly Contribution" value="£38.50" sub="Due 1 Aug 2026" icon={CreditCard} trend={{dir:'up',text:'+2.1% vs last month'}} isLight={isLight}/>
            <KPICard label="Open Claims" value="3" sub="Currently active" icon={FileText} color="#f59e0b" trend={{dir:'down',text:'−1 since last week'}} isLight={isLight}/>
            <KPICard label="Pool Balance" value="£4.2M" sub="Surplus: £320K" icon={Activity} color="#3b82f6" trend={{dir:'up',text:'+£48K this month'}} isLight={isLight}/>
          </div>
        </DSSection>

        {/* INPUTS */}
        <DSSection id="inputs" title="Text Inputs" desc="pl-9 with icon prefix. Used in get-quote steps and dashboard filters." isLight={isLight}>
          <Code label="INPUT_CLS = 'rounded-xl border border-white/8 bg-white/[0.04] ...'" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {[
              {label:'Property postcode',icon:<MapPin size={13} className="text-gray-500"/>,ph:'e.g. B1 2PQ'},
              {label:'Year built',icon:<Calendar size={13} className="text-gray-500"/>,ph:'YYYY'},
              {label:'Email address',icon:<span className="text-gray-500 text-sm">@</span>,ph:'name@example.com'},
              {label:'Contents value (£)',icon:<span className="text-[#00c685] text-sm font-semibold font-mono">£</span>,ph:'e.g. 25000'},
            ].map(f=>(
              <div key={f.label} className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide block mb-1.5" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">{f.icon}</span>
                  <input placeholder={f.ph} style={{ background: isLight ? '#ffffff' : 'rgba(255,255,255,0.04)', border: `1px solid ${isLight ? '#D1D5DB' : 'rgba(255,255,255,0.08)'}`, color: isLight ? '#111827' : '#ffffff' }} className="w-full pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#00c685]/40 transition-colors h-10 text-sm placeholder:text-gray-400"/>
                </div>
              </div>
            ))}
          </div>
        </DSSection>

        {/* DROPDOWNS */}
        <DSSection id="dropdowns" title="Dropdowns — All 16 by Step" desc="Portal-based select components organised by get-quote step. Click any trigger to open — fully interactive." isLight={isLight}>
          <Code label="<Select value={} onValueChange={}><SelectTrigger/><SelectContent><SelectItem icon={}/></SelectContent></Select>" />

          {/* ── STEP 2: Your Property ──────────────────────────────────────────── */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">Step 2 — Your Property</span>
                <span className="text-[10px] font-mono" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.25)' }}>· 6 dropdowns</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>Live Triggers &amp; Option Previews</span>
            </div>

            {/* Live Interactive Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="space-y-1.5">
                <FieldLabel>Wall construction</FieldLabel>
                <Select value={d1} onValueChange={setD1}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="brick" icon={<Layers className="w-3.5 h-3.5"/>}>Brick</SelectItem>
                    <SelectItem value="stone" icon={<Gem className="w-3.5 h-3.5"/>}>Stone</SelectItem>
                    <SelectItem value="timber" icon={<Trees className="w-3.5 h-3.5"/>}>Timber frame</SelectItem>
                    <SelectItem value="concrete" icon={<Building className="w-3.5 h-3.5"/>}>Concrete</SelectItem>
                    <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other / Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Roof type</FieldLabel>
                <Select value={d2} onValueChange={setD2}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="pitched-tiles" icon={<Layers className="w-3.5 h-3.5"/>}>Pitched – Tiles</SelectItem>
                    <SelectItem value="pitched-slate" icon={<Grid className="w-3.5 h-3.5"/>}>Pitched – Slate</SelectItem>
                    <SelectItem value="flat" icon={<Minus className="w-3.5 h-3.5"/>}>Flat roof</SelectItem>
                    <SelectItem value="mixed" icon={<Layers className="w-3.5 h-3.5"/>}>Mixed (part flat, part pitched)</SelectItem>
                    <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other / Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Type of heating</FieldLabel>
                <Select value={d3} onValueChange={setD3}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="gas" icon={<Flame className="w-3.5 h-3.5"/>}>Gas Central Heating</SelectItem>
                    <SelectItem value="electric" icon={<Zap className="w-3.5 h-3.5"/>}>Electric Heating</SelectItem>
                    <SelectItem value="oil" icon={<Droplets className="w-3.5 h-3.5"/>}>Oil-Fired Heating</SelectItem>
                    <SelectItem value="heat-pump" icon={<Wrench className="w-3.5 h-3.5"/>}>Heat Pump</SelectItem>
                    <SelectItem value="solid-fuel" icon={<Trees className="w-3.5 h-3.5"/>}>Solid Fuel</SelectItem>
                    <SelectItem value="none" icon={<CircleSlash className="w-3.5 h-3.5"/>}>No Central Heating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Flat type (storey) <span style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }} className="normal-case font-normal">— if flat</span></FieldLabel>
                <Select value={d11} onValueChange={setD11}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="basement" icon={<Minus className="w-3.5 h-3.5"/>}>Basement flat</SelectItem>
                    <SelectItem value="ground" icon={<Home className="w-3.5 h-3.5"/>}>Ground floor flat</SelectItem>
                    <SelectItem value="first" icon={<Building className="w-3.5 h-3.5"/>}>First floor flat</SelectItem>
                    <SelectItem value="second-plus" icon={<Building2 className="w-3.5 h-3.5"/>}>Second floor or above</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Flat roof proportion <span style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }} className="normal-case font-normal">— if flat/mixed roof</span></FieldLabel>
                <Select value={d12} onValueChange={setD12}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="lt10" icon={<Layers className="w-3.5 h-3.5"/>}>Up to 10%</SelectItem>
                    <SelectItem value="lt20" icon={<Layers className="w-3.5 h-3.5"/>}>Up to 20%</SelectItem>
                    <SelectItem value="lt30" icon={<Layers className="w-3.5 h-3.5"/>}>Up to 30%</SelectItem>
                    <SelectItem value="lt50" icon={<Layers className="w-3.5 h-3.5"/>}>Up to 50%</SelectItem>
                    <SelectItem value="gt50" icon={<Layers className="w-3.5 h-3.5"/>}>More than 50%</SelectItem>
                    <SelectItem value="all" icon={<Minus className="w-3.5 h-3.5"/>}>Entire roof is flat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Extension type <span style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }} className="normal-case font-normal">— if extended</span></FieldLabel>
                <Select value={d13} onValueChange={setD13}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="rear" icon={<Expand className="w-3.5 h-3.5"/>}>Rear extension</SelectItem>
                    <SelectItem value="side" icon={<Expand className="w-3.5 h-3.5"/>}>Side extension</SelectItem>
                    <SelectItem value="loft" icon={<Building2 className="w-3.5 h-3.5"/>}>Loft conversion</SelectItem>
                    <SelectItem value="garage" icon={<Home className="w-3.5 h-3.5"/>}>Garage conversion</SelectItem>
                    <SelectItem value="conservatory" icon={<LayoutGrid className="w-3.5 h-3.5"/>}>Conservatory</SelectItem>
                    <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Step 2 Expanded Options Preview */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ color: isLight ? '#4B5563' : 'rgba(255,255,255,0.5)' }}>Step 2 Dropdown Options (Expanded Previews)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                <OptionPreviewCard title="Wall Construction">
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Brick</OptionPreviewItem>
                  <OptionPreviewItem icon={<Gem className="w-3.5 h-3.5 text-[#00c685]"/>}>Stone</OptionPreviewItem>
                  <OptionPreviewItem icon={<Trees className="w-3.5 h-3.5 text-[#00c685]"/>}>Timber frame</OptionPreviewItem>
                  <OptionPreviewItem icon={<Building className="w-3.5 h-3.5 text-[#00c685]"/>}>Concrete</OptionPreviewItem>
                  <OptionPreviewItem icon={<Plus className="w-3.5 h-3.5 text-[#00c685]"/>}>Other / Not sure</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Roof Type">
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Pitched – Tiles</OptionPreviewItem>
                  <OptionPreviewItem icon={<Grid className="w-3.5 h-3.5 text-[#00c685]"/>}>Pitched – Slate</OptionPreviewItem>
                  <OptionPreviewItem icon={<Minus className="w-3.5 h-3.5 text-[#00c685]"/>}>Flat roof</OptionPreviewItem>
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Mixed (part flat, part pitched)</OptionPreviewItem>
                  <OptionPreviewItem icon={<Plus className="w-3.5 h-3.5 text-[#00c685]"/>}>Other / Not sure</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Type of Heating">
                  <OptionPreviewItem icon={<Flame className="w-3.5 h-3.5 text-[#00c685]"/>}>Gas Central Heating</OptionPreviewItem>
                  <OptionPreviewItem icon={<Zap className="w-3.5 h-3.5 text-[#00c685]"/>}>Electric Heating</OptionPreviewItem>
                  <OptionPreviewItem icon={<Droplets className="w-3.5 h-3.5 text-[#00c685]"/>}>Oil-Fired Heating</OptionPreviewItem>
                  <OptionPreviewItem icon={<Wrench className="w-3.5 h-3.5 text-[#00c685]"/>}>Heat Pump</OptionPreviewItem>
                  <OptionPreviewItem icon={<Trees className="w-3.5 h-3.5 text-[#00c685]"/>}>Solid Fuel</OptionPreviewItem>
                  <OptionPreviewItem icon={<CircleSlash className="w-3.5 h-3.5 text-[#00c685]"/>}>No Central Heating</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Flat Type (Storey)">
                  <OptionPreviewItem icon={<Minus className="w-3.5 h-3.5 text-[#00c685]"/>}>Basement flat</OptionPreviewItem>
                  <OptionPreviewItem icon={<Home className="w-3.5 h-3.5 text-[#00c685]"/>}>Ground floor flat</OptionPreviewItem>
                  <OptionPreviewItem icon={<Building className="w-3.5 h-3.5 text-[#00c685]"/>}>First floor flat</OptionPreviewItem>
                  <OptionPreviewItem icon={<Building2 className="w-3.5 h-3.5 text-[#00c685]"/>}>Second floor or above</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Flat Roof Proportion">
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Up to 10%</OptionPreviewItem>
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Up to 20%</OptionPreviewItem>
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Up to 30%</OptionPreviewItem>
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>Up to 50%</OptionPreviewItem>
                  <OptionPreviewItem icon={<Layers className="w-3.5 h-3.5 text-[#00c685]"/>}>More than 50%</OptionPreviewItem>
                  <OptionPreviewItem icon={<Minus className="w-3.5 h-3.5 text-[#00c685]"/>}>Entire roof is flat</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Extension Type">
                  <OptionPreviewItem icon={<Expand className="w-3.5 h-3.5 text-[#00c685]"/>}>Rear extension</OptionPreviewItem>
                  <OptionPreviewItem icon={<Expand className="w-3.5 h-3.5 text-[#00c685]"/>}>Side extension</OptionPreviewItem>
                  <OptionPreviewItem icon={<Building2 className="w-3.5 h-3.5 text-[#00c685]"/>}>Loft conversion</OptionPreviewItem>
                  <OptionPreviewItem icon={<Home className="w-3.5 h-3.5 text-[#00c685]"/>}>Garage conversion</OptionPreviewItem>
                  <OptionPreviewItem icon={<LayoutGrid className="w-3.5 h-3.5 text-[#00c685]"/>}>Conservatory</OptionPreviewItem>
                  <OptionPreviewItem icon={<Plus className="w-3.5 h-3.5 text-[#00c685]"/>}>Other</OptionPreviewItem>
                </OptionPreviewCard>

              </div>
            </div>
          </div>

          {/* ── STEP 3: Ownership & Occupancy ─────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">Step 3 — Ownership & Occupancy</span>
                <span className="text-[10px] font-mono" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.25)' }}>· 4 dropdowns</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>Live Triggers &amp; Option Previews</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="space-y-1.5">
                <FieldLabel>Rental type (tenancy) <span style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }} className="normal-case font-normal">— if tenant</span></FieldLabel>
                <Select value={d14} onValueChange={setD14}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="private-furnished" icon={<Home className="w-3.5 h-3.5"/>}>Private landlord — furnished</SelectItem>
                    <SelectItem value="private-unfurnished" icon={<Home className="w-3.5 h-3.5"/>}>Private landlord — unfurnished</SelectItem>
                    <SelectItem value="council" icon={<Building className="w-3.5 h-3.5"/>}>Local authority / Council</SelectItem>
                    <SelectItem value="housing-assoc" icon={<Users className="w-3.5 h-3.5"/>}>Housing association</SelectItem>
                    <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other arrangement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>How long unoccupied per year? <span style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }} className="normal-case font-normal">— if not main home</span></FieldLabel>
                <Select value={d6} onValueChange={setD6}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="lt30" icon={<Clock className="w-3.5 h-3.5"/>}>Less than 30 days</SelectItem>
                    <SelectItem value="30-60" icon={<Clock className="w-3.5 h-3.5"/>}>30–60 days</SelectItem>
                    <SelectItem value="60-90" icon={<Clock className="w-3.5 h-3.5"/>}>60–90 days</SelectItem>
                    <SelectItem value="gt90" icon={<Clock className="w-3.5 h-3.5"/>}>More than 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Business use of property?</FieldLabel>
                <Select value={d5} onValueChange={setD5}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="no" icon={<CircleSlash className="w-3.5 h-3.5"/>}>No business use</SelectItem>
                    <SelectItem value="occasional" icon={<Home className="w-3.5 h-3.5"/>}>Working from home — clerical only</SelectItem>
                    <SelectItem value="yes-clients" icon={<Users className="w-3.5 h-3.5"/>}>Working from home — with visitors</SelectItem>
                    <SelectItem value="yes-no-clients" icon={<Laptop className="w-3.5 h-3.5"/>}>Yes – no clients visit</SelectItem>
                    <SelectItem value="other" icon={<Package className="w-3.5 h-3.5"/>}>Other business use</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Business visitor frequency <span style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }} className="normal-case font-normal">— if visitors</span></FieldLabel>
                <Select value={d15} onValueChange={setD15}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="never" icon={<CircleSlash className="w-3.5 h-3.5"/>}>Never</SelectItem>
                    <SelectItem value="occasionally" icon={<Clock className="w-3.5 h-3.5"/>}>Occasionally</SelectItem>
                    <SelectItem value="monthly" icon={<Clock className="w-3.5 h-3.5"/>}>Monthly</SelectItem>
                    <SelectItem value="weekly" icon={<Clock className="w-3.5 h-3.5"/>}>Weekly</SelectItem>
                    <SelectItem value="several-week" icon={<Clock className="w-3.5 h-3.5"/>}>Several times per week</SelectItem>
                    <SelectItem value="daily" icon={<Users className="w-3.5 h-3.5"/>}>Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Step 3 Expanded Options Preview */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ color: isLight ? '#4B5563' : 'rgba(255,255,255,0.5)' }}>Step 3 Dropdown Options (Expanded Previews)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <OptionPreviewCard title="Rental Type">
                  <OptionPreviewItem icon={<Home className="w-3.5 h-3.5 text-[#00c685]"/>}>Private landlord — furnished</OptionPreviewItem>
                  <OptionPreviewItem icon={<Home className="w-3.5 h-3.5 text-[#00c685]"/>}>Private landlord — unfurnished</OptionPreviewItem>
                  <OptionPreviewItem icon={<Building className="w-3.5 h-3.5 text-[#00c685]"/>}>Local authority / Council</OptionPreviewItem>
                  <OptionPreviewItem icon={<Users className="w-3.5 h-3.5 text-[#00c685]"/>}>Housing association</OptionPreviewItem>
                  <OptionPreviewItem icon={<Plus className="w-3.5 h-3.5 text-[#00c685]"/>}>Other arrangement</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Unoccupied Period">
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>Less than 30 days</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>30–60 days</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>60–90 days</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>More than 90 days</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Business Use">
                  <OptionPreviewItem icon={<CircleSlash className="w-3.5 h-3.5 text-[#00c685]"/>}>No business use</OptionPreviewItem>
                  <OptionPreviewItem icon={<Home className="w-3.5 h-3.5 text-[#00c685]"/>}>Working from home (clerical)</OptionPreviewItem>
                  <OptionPreviewItem icon={<Users className="w-3.5 h-3.5 text-[#00c685]"/>}>Working from home (visitors)</OptionPreviewItem>
                  <OptionPreviewItem icon={<Laptop className="w-3.5 h-3.5 text-[#00c685]"/>}>Yes – no clients visit</OptionPreviewItem>
                  <OptionPreviewItem icon={<Package className="w-3.5 h-3.5 text-[#00c685]"/>}>Other business use</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Visitor Frequency">
                  <OptionPreviewItem icon={<CircleSlash className="w-3.5 h-3.5 text-[#00c685]"/>}>Never</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>Occasionally</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>Monthly</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>Weekly</OptionPreviewItem>
                  <OptionPreviewItem icon={<Clock className="w-3.5 h-3.5 text-[#00c685]"/>}>Several times per week</OptionPreviewItem>
                  <OptionPreviewItem icon={<Users className="w-3.5 h-3.5 text-[#00c685]"/>}>Daily</OptionPreviewItem>
                </OptionPreviewCard>

              </div>
            </div>
          </div>

          {/* ── STEP 4: Security ──────────────────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">Step 4 — Security</span>
                <span className="text-[10px] font-mono" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.25)' }}>· 1 dropdown</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>Live Trigger &amp; Option Preview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="space-y-1.5">
                <FieldLabel>Locks on external doors</FieldLabel>
                <Select value={d4} onValueChange={setD4}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="5lever-bs3621" icon={<Lock className="w-3.5 h-3.5"/>}>5-lever mortice deadlock (BS 3621)</SelectItem>
                    <SelectItem value="5lever" icon={<Lock className="w-3.5 h-3.5"/>}>5-lever mortice deadlock</SelectItem>
                    <SelectItem value="multipoint" icon={<Key className="w-3.5 h-3.5"/>}>Key-operated multi-point lock</SelectItem>
                    <SelectItem value="yale" icon={<Shield className="w-3.5 h-3.5"/>}>Rim automatic deadlatch (Yale-type)</SelectItem>
                    <SelectItem value="smart" icon={<Laptop className="w-3.5 h-3.5"/>}>Smart lock</SelectItem>
                    <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Step 4 Expanded Options Preview */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ color: isLight ? '#4B5563' : 'rgba(255,255,255,0.5)' }}>Step 4 Dropdown Options (Expanded Preview)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <OptionPreviewCard title="Locks on External Doors">
                  <OptionPreviewItem icon={<Lock className="w-3.5 h-3.5 text-[#00c685]"/>}>5-lever mortice deadlock (BS 3621)</OptionPreviewItem>
                  <OptionPreviewItem icon={<Lock className="w-3.5 h-3.5 text-[#00c685]"/>}>5-lever mortice deadlock</OptionPreviewItem>
                  <OptionPreviewItem icon={<Key className="w-3.5 h-3.5 text-[#00c685]"/>}>Key-operated multi-point lock</OptionPreviewItem>
                  <OptionPreviewItem icon={<Shield className="w-3.5 h-3.5 text-[#00c685]"/>}>Rim automatic deadlatch (Yale-type)</OptionPreviewItem>
                  <OptionPreviewItem icon={<Laptop className="w-3.5 h-3.5 text-[#00c685]"/>}>Smart lock</OptionPreviewItem>
                  <OptionPreviewItem icon={<Plus className="w-3.5 h-3.5 text-[#00c685]"/>}>Other</OptionPreviewItem>
                </OptionPreviewCard>
              </div>
            </div>
          </div>

          {/* ── STEP 5: Cover Details ─────────────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">Step 5 — Cover Details</span>
                <span className="text-[10px] font-mono" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.25)' }}>· 2 dropdowns</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>Live Triggers &amp; Option Previews</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="space-y-1.5">
                <FieldLabel>Buildings voluntary excess</FieldLabel>
                <Select value={d7} onValueChange={setD7}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="0" icon={<Scale className="w-3.5 h-3.5"/>}>£0</SelectItem>
                    <SelectItem value="150" icon={<Scale className="w-3.5 h-3.5"/>}>£150</SelectItem>
                    <SelectItem value="250" icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]"/>}>£250 — Recommended</SelectItem>
                    <SelectItem value="500" icon={<Scale className="w-3.5 h-3.5"/>}>£500</SelectItem>
                    <SelectItem value="1000" icon={<Scale className="w-3.5 h-3.5"/>}>£1,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Contents voluntary excess</FieldLabel>
                <Select value={d16} onValueChange={setD16}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="0" icon={<Scale className="w-3.5 h-3.5"/>}>£0</SelectItem>
                    <SelectItem value="100" icon={<Scale className="w-3.5 h-3.5"/>}>£100</SelectItem>
                    <SelectItem value="250" icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]"/>}>£250 — Recommended</SelectItem>
                    <SelectItem value="500" icon={<Scale className="w-3.5 h-3.5"/>}>£500</SelectItem>
                    <SelectItem value="1000" icon={<Scale className="w-3.5 h-3.5"/>}>£1,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Step 5 Expanded Options Preview */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ color: isLight ? '#4B5563' : 'rgba(255,255,255,0.5)' }}>Step 5 Dropdown Options (Expanded Previews)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <OptionPreviewCard title="Buildings Excess">
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£0</OptionPreviewItem>
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£150</OptionPreviewItem>
                  <OptionPreviewItem recommended icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]"/>}>£250 — Recommended</OptionPreviewItem>
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£500</OptionPreviewItem>
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£1,000</OptionPreviewItem>
                </OptionPreviewCard>
                <OptionPreviewCard title="Contents Excess">
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£0</OptionPreviewItem>
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£100</OptionPreviewItem>
                  <OptionPreviewItem recommended icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]"/>}>£250 — Recommended</OptionPreviewItem>
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£500</OptionPreviewItem>
                  <OptionPreviewItem icon={<Scale className="w-3.5 h-3.5 text-[#00c685]"/>}>£1,000</OptionPreviewItem>
                </OptionPreviewCard>
              </div>
            </div>
          </div>

          {/* ── STEP 7: About You & Review ────────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">Step 7 — About You & Review</span>
                <span className="text-[10px] font-mono" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.25)' }}>· 3 dropdowns</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.4)' }}>Live Triggers &amp; Option Previews</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="space-y-1.5">
                <FieldLabel>Title</FieldLabel>
                <Select value={d9} onValueChange={setD9}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="mr">Mr</SelectItem>
                    <SelectItem value="mrs">Mrs</SelectItem>
                    <SelectItem value="ms">Ms</SelectItem>
                    <SelectItem value="miss">Miss</SelectItem>
                    <SelectItem value="dr">Dr</SelectItem>
                    <SelectItem value="prof">Prof</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Claims in the last 5 years</FieldLabel>
                <Select value={d8} onValueChange={setD8}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="0" icon={<Check className="w-3.5 h-3.5"/>}>None</SelectItem>
                    <SelectItem value="1" icon={<AlertTriangle className="w-3.5 h-3.5"/>}>1 claim</SelectItem>
                    <SelectItem value="2" icon={<AlertTriangle className="w-3.5 h-3.5"/>}>2 claims</SelectItem>
                    <SelectItem value="3plus" icon={<AlertTriangle className="w-3.5 h-3.5"/>}>3 or more</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Type of incident</FieldLabel>
                <Select value={d10} onValueChange={setD10}>
                  <SelectTrigger/><SelectContent>
                    <SelectItem value="escape-water" icon={<Droplets className="w-3.5 h-3.5"/>}>Escape of Water / Leak</SelectItem>
                    <SelectItem value="storm" icon={<Zap className="w-3.5 h-3.5"/>}>Storm Damage</SelectItem>
                    <SelectItem value="theft" icon={<Lock className="w-3.5 h-3.5"/>}>Theft / Burglary</SelectItem>
                    <SelectItem value="accidental" icon={<AlertTriangle className="w-3.5 h-3.5"/>}>Accidental Damage</SelectItem>
                    <SelectItem value="flood" icon={<Droplets className="w-3.5 h-3.5"/>}>Flood</SelectItem>
                    <SelectItem value="fire" icon={<Flame className="w-3.5 h-3.5"/>}>Fire / Explosion</SelectItem>
                    <SelectItem value="subsidence" icon={<Building className="w-3.5 h-3.5"/>}>Subsidence</SelectItem>
                    <SelectItem value="malicious" icon={<Shield className="w-3.5 h-3.5"/>}>Malicious Damage</SelectItem>
                    <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Step 7 Expanded Options Preview */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ color: isLight ? '#4B5563' : 'rgba(255,255,255,0.5)' }}>Step 7 Dropdown Options (Expanded Previews)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <OptionPreviewCard title="Title">
                  <OptionPreviewItem>Mr</OptionPreviewItem>
                  <OptionPreviewItem>Mrs</OptionPreviewItem>
                  <OptionPreviewItem>Ms</OptionPreviewItem>
                  <OptionPreviewItem>Miss</OptionPreviewItem>
                  <OptionPreviewItem>Dr</OptionPreviewItem>
                  <OptionPreviewItem>Prof</OptionPreviewItem>
                  <OptionPreviewItem>Other</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Claims History">
                  <OptionPreviewItem icon={<Check className="w-3.5 h-3.5 text-[#00c685]"/>}>None</OptionPreviewItem>
                  <OptionPreviewItem icon={<AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/>}>1 claim</OptionPreviewItem>
                  <OptionPreviewItem icon={<AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/>}>2 claims</OptionPreviewItem>
                  <OptionPreviewItem icon={<AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/>}>3 or more</OptionPreviewItem>
                </OptionPreviewCard>

                <OptionPreviewCard title="Type of Incident">
                  <OptionPreviewItem icon={<Droplets className="w-3.5 h-3.5 text-[#00c685]"/>}>Escape of Water / Leak</OptionPreviewItem>
                  <OptionPreviewItem icon={<Zap className="w-3.5 h-3.5 text-[#00c685]"/>}>Storm Damage</OptionPreviewItem>
                  <OptionPreviewItem icon={<Lock className="w-3.5 h-3.5 text-[#00c685]"/>}>Theft / Burglary</OptionPreviewItem>
                  <OptionPreviewItem icon={<AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/>}>Accidental Damage</OptionPreviewItem>
                  <OptionPreviewItem icon={<Droplets className="w-3.5 h-3.5 text-[#00c685]"/>}>Flood</OptionPreviewItem>
                  <OptionPreviewItem icon={<Flame className="w-3.5 h-3.5 text-[#00c685]"/>}>Fire / Explosion</OptionPreviewItem>
                  <OptionPreviewItem icon={<Building className="w-3.5 h-3.5 text-[#00c685]"/>}>Subsidence</OptionPreviewItem>
                  <OptionPreviewItem icon={<Shield className="w-3.5 h-3.5 text-[#00c685]"/>}>Malicious Damage</OptionPreviewItem>
                  <OptionPreviewItem icon={<Plus className="w-3.5 h-3.5 text-[#00c685]"/>}>Other</OptionPreviewItem>
                </OptionPreviewCard>
              </div>
            </div>
          </div>

        </DSSection>

        {/* TOGGLES */}
        <DSSection id="toggles" title="Toggle Rows" desc="Yes/No switches used in occupancy, security, and belongings steps." isLight={isLight}>
          <Code label="<ToggleRow label='' hint='' value={} onChange={} />" />
          <div className="mt-3 rounded-xl px-4" style={{ border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}`, background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)' }}>
            <ToggleRow label="Is this your main residence?" hint="Your primary home where you live most of the year." value={toggle1} onChange={setToggle1} isLight={isLight}/>
            <ToggleRow label="Does the property have a burglar alarm?" value={toggle2} onChange={setToggle2} isLight={isLight}/>
            <ToggleRow label="Do you have smoke alarms on every floor?" value={toggle3} onChange={setToggle3} isLight={isLight}/>
            <ToggleRow label="Are external windows key-locked?" value={true} onChange={()=>{}} isLight={isLight}/>
            <ToggleRow label="Is there a CCTV system?" value={false} onChange={()=>{}} isLight={isLight}/>
          </div>
        </DSSection>

        {/* STEPPER */}
        <DSSection id="stepper" title="Number Stepper" desc="Increment / decrement counter with min/max bounds. Used in room and floor counts." isLight={isLight}>
          <Code label="<Stepper value={} onChange={} min={} max={} />" />
          <div className="mt-3 rounded-xl px-4" style={{ border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}`, background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)' }}>
            {[
              {icon:Home,label:'Bedrooms',v:stepper1,set:setStepper1,min:1,max:10},
              {icon:Droplets,label:'Bathrooms',v:stepper2,set:setStepper2,min:1,max:5},
            ].map(({icon:Icon,label,v,set,min,max})=>(
              <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="flex items-center gap-2.5"><span className="text-[#00c685]"><Icon size={14}/></span><span className="text-sm" style={{ color: isLight ? '#374151' : '#D1D5DB' }}>{label}</span></div>
                <Stepper value={v} onChange={set} min={min} max={max} isLight={isLight}/>
              </div>
            ))}
          </div>
        </DSSection>

        {/* COVER CARDS */}
        <DSSection id="cover" title="Cover Type Cards" desc="Selectable option cards for the Cover & Protection step." isLight={isLight}>
          <Code label="<CoverTypeCard label='' description='' icon={} selected={} onClick={} />" />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CoverTypeCard label="Buildings & Contents" description="Complete protection for your home structure and everything inside it." icon={ShieldCheck} selected={cover==='both'} onClick={()=>setCover('both')} isLight={isLight}/>
            <CoverTypeCard label="Buildings Only" description="Cover the structure of your home against structural damage." icon={Home} selected={cover==='buildings'} onClick={()=>setCover('buildings')} isLight={isLight}/>
            <CoverTypeCard label="Contents Only" description="Protect your personal belongings and home appliances." icon={Laptop} selected={cover==='contents'} onClick={()=>setCover('contents')} isLight={isLight}/>
          </div>
        </DSSection>

        {/* RIDERS */}
        <DSSection id="riders" title="Rider / Add-on Cards" desc="Optional add-on checkbox cards. Click to toggle." isLight={isLight}>
          <Code label="<RiderCard icon={} label='' desc='' selected={} onClick={} />" />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <RiderCard icon={Zap} label="Accidental Damage Cover" desc="Covers sudden, unexpected damage by you or your family." selected={r1} onClick={()=>setR1(v=>!v)} isLight={isLight}/>
            <RiderCard icon={Scale} label="Legal Expenses Cover" desc="Up to £100,000 for property disputes and employment tribunals." selected={r2} onClick={()=>setR2(v=>!v)} isLight={isLight}/>
            <RiderCard icon={Wrench} label="Home Emergency Cover" desc="24/7 assistance for boiler breakdowns, burst pipes, and more." selected={r3} onClick={()=>setR3(v=>!v)} isLight={isLight}/>
          </div>
        </DSSection>

        {/* DIVIDER */}
        <DSSection id="divider" title="Divider" desc="Thin hairline separator used between form sections." isLight={isLight}>
          <Code label="<Divider />" />
          <div className="mt-3 space-y-3">
            <p className="text-sm" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.4)' }}>Above divider</p>
            <Divider isLight={isLight} />
            <p className="text-sm" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.4)' }}>Below divider</p>
          </div>
        </DSSection>

        {/* LABELS */}
        <DSSection id="labels" title="Labels" desc="Two label variants — section headers and field labels." isLight={isLight}>
          <div className="space-y-5">
            <div><Code label="<SectionLabel>" /><div className="mt-2"><SectionLabel>Property Details</SectionLabel></div></div>
            <div><Code label="<FieldLabel htmlFor=''>" /><div className="mt-2"><FieldLabel isLight={isLight}>Wall construction</FieldLabel></div></div>
          </div>
        </DSSection>

        {/* NOTIFICATIONS */}
        <DSSection id="notifications" title="Notification Items" desc="Used in the dashboard notification panel for all roles." isLight={isLight}>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}`, background: isLight ? '#ffffff' : '#0d2117' }}>
            {[
              {icon:ShieldCheck,color:'#00c685',title:'Contribution Collected',sub:'Your August contribution of £38.50 has been processed.',time:'2 hours ago',unread:true},
              {icon:FileText,color:'#f59e0b',title:'Claim Update — TK-CLM-0091',sub:'Your claim is now Under Review by our assessment team.',time:'1 day ago',unread:true},
              {icon:Bell,color:'#3b82f6',title:'Renewal Reminder',sub:'Your certificate TK-2024-0042 renews in 30 days.',time:'3 days ago',unread:false},
            ].map((n,i)=>(
              <div key={i} className="flex items-start gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:`${n.color}15`}}>
                  <n.icon size={15} style={{color:n.color}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug" style={{ color: isLight ? '#111827' : '#ffffff' }}>{n.title}</p>
                    <span className="text-[10px] shrink-0" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.3)' }}>{n.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.45)' }}>{n.sub}</p>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-[#00c685] shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </DSSection>

        {/* TABLE */}
        <DSSection id="table" title="Data Table Row" desc="Standard table layout used in claims, contributions, and transactions." isLight={isLight}>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}`, background: isLight ? '#ffffff' : '#0d2117' }}>
            <div className="grid grid-cols-5 px-5 py-2.5" style={{ borderBottom: `1px solid ${isLight ? '#F3F4F6' : 'rgba(255,255,255,0.05)'}` }}>
              {['Claim ID','Type','Amount','Status','Date'].map(h=>(
                <span key={h} className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }}>{h}</span>
              ))}
            </div>
            {[
              {id:'TK-CLM-0091',type:'Escape of Water',amount:'£3,200',status:'Under Review',date:'12 Jul 2026'},
              {id:'TK-CLM-0072',type:'Storm Damage',amount:'£1,840',status:'Paid',date:'3 Mar 2026'},
              {id:'TK-CLM-0058',type:'Theft',amount:'£950',status:'Rejected',date:'9 Nov 2025'},
              {id:'TK-CLM-0044',type:'Fire Damage',amount:'£12,500',status:'Approved',date:'1 Jun 2025'},
            ].map(row=>(
              <div key={row.id} className="grid grid-cols-5 px-5 py-3.5 transition-colors items-center" style={{ borderBottom: `1px solid ${isLight ? '#F9FAFB' : 'rgba(255,255,255,0.03)'}` }}>
                <span className="text-xs font-mono text-[#00c685]/80">{row.id}</span>
                <span className="text-xs" style={{ color: isLight ? '#374151' : '#D1D5DB' }}>{row.type}</span>
                <span className="text-xs font-semibold" style={{ color: isLight ? '#111827' : '#ffffff' }}>{row.amount}</span>
                <StatusBadge status={row.status}/>
                <span className="text-xs" style={{ color: isLight ? '#9CA3AF' : 'rgba(255,255,255,0.4)' }}>{row.date}</span>
              </div>
            ))}
          </div>
        </DSSection>

        {/* BUTTONS */}
        <DSSection id="buttons" title="Buttons" desc="Primary CTA, secondary, ghost, and text link styles." isLight={isLight}>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#03120d] bg-[#00c685] hover:bg-[#00d690] transition-colors shadow-lg shadow-[#00c685]/20 cursor-pointer">
              <Check size={15}/> Continue
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer" style={{ color: isLight ? '#374151' : '#ffffff', border: `1px solid ${isLight ? '#D1D5DB' : 'rgba(255,255,255,0.1)'}`, background: isLight ? '#F9FAFB' : 'rgba(255,255,255,0.04)' }}>
              <ArrowLeft size={15}/> Back
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#00c685] border border-[#00c685]/25 bg-[#00c685]/8 hover:bg-[#00c685]/15 transition-colors cursor-pointer">
              <FileText size={13}/> Make a Claim
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.5)', border: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.08)'}`, background: 'transparent' }}>
              View all
            </button>
          </div>
        </DSSection>

        {/* ALERTS */}
        <DSSection id="alerts" title="Alert / Info Cards" desc="Contextual banners: success, warning, and error states." isLight={isLight}>
          <div className="space-y-3">
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5">
              <ShieldCheck size={16} className="text-[#00c685] mt-0.5 shrink-0"/>
              <div>
                <p className="text-sm font-semibold" style={{ color: isLight ? '#064E3B' : '#ffffff' }}>Takaful pool is healthy</p>
                <p className="text-xs mt-0.5" style={{ color: isLight ? '#065F46' : 'rgba(255,255,255,0.5)' }}>Current pool balance is £4.2M with a surplus of £320K above the minimum threshold.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0"/>
              <div>
                <p className="text-sm font-semibold" style={{ color: isLight ? '#92400E' : '#ffffff' }}>Renewal in 30 days</p>
                <p className="text-xs mt-0.5" style={{ color: isLight ? '#B45309' : 'rgba(255,255,255,0.5)' }}>Your certificate TK-2024-0042 is due for renewal on 15 Jan 2027. No action required yet.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-500/20 bg-red-500/5">
              <Bell size={16} className="text-red-400 mt-0.5 shrink-0"/>
              <div>
                <p className="text-sm font-semibold" style={{ color: isLight ? '#991B1B' : '#ffffff' }}>Contribution payment failed</p>
                <p className="text-xs mt-0.5" style={{ color: isLight ? '#B91C1C' : 'rgba(255,255,255,0.5)' }}>Your August contribution of £38.50 could not be collected. Please update your payment method.</p>
              </div>
            </div>
          </div>
        </DSSection>

        {/* Footer */}
        <div className="pt-6 pb-10 flex items-center justify-between" style={{ borderTop: `1px solid ${isLight ? '#E5E7EB' : 'rgba(255,255,255,0.05)'}` }}>
          <p className="text-xs" style={{ color: isLight ? '#6B7280' : 'rgba(255,255,255,0.3)' }}>Takaful Design System · Internal Use Only</p>
          <p className="text-xs font-mono" style={{ color: isLight ? '#059669' : 'rgba(0,198,133,0.4)' }}>v1.0 · {new Date().getFullYear()}</p>
        </div>

      </div>
    </div>
    </DSThemeCtx.Provider>
  );
}
