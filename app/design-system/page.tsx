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
} from 'lucide-react';
import Link from 'next/link';

const GREEN = '#00c685';
const INPUT_CLS = 'w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/[0.04] text-white placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors h-10 text-sm';

// ─── Portal Select ─────────────────────────────────────────────────────────────
interface SelCtx {
  value: string; onValueChange: (v: string) => void;
  open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerText: string; setTriggerText: React.Dispatch<React.SetStateAction<string>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}
const SelCtx = React.createContext<SelCtx | null>(null);

function Select({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) {
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
    <SelCtx.Provider value={{ value, onValueChange, open, setOpen, triggerText, setTriggerText, triggerRef, contentRef }}>
      <div className="relative w-full" ref={wrapRef}>{children}</div>
    </SelCtx.Provider>
  );
}

function SelectTrigger({ children }: { children?: React.ReactNode }) {
  const c = React.useContext(SelCtx); if (!c) return null;
  const { open, setOpen, triggerText, triggerRef } = c;
  return (
    <button ref={triggerRef} type="button" onClick={() => setOpen(!open)}
      className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.04] px-3.5 text-sm text-white focus:outline-none focus:border-[#00c685]/40 transition-colors">
      <span className="truncate">{triggerText || <span className="text-white/20">Select...</span>}</span>
      <ChevronDown size={14} className={`shrink-0 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}
function SelectValue({ placeholder }: { placeholder?: string }) { return null; }

function SelectContent({ children }: { children: React.ReactNode }) {
  const c = React.useContext(SelCtx); if (!c) return null;
  const { open, triggerRef, contentRef } = c;
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => { if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect()); }, [open, triggerRef]);
  if (!open || !rect) return null;
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div ref={contentRef} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
        style={{ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 99999 }}
        className="max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-neutral-950 p-1 shadow-2xl">
        {children}
      </motion.div>
    </AnimatePresence>, document.body
  );
}

function SelectItem({ value, icon, children }: { value: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const c = React.useContext(SelCtx); if (!c) return null;
  const { value: sel, onValueChange, setOpen, setTriggerText } = c;
  const isSel = sel === value;
  useEffect(() => { if (isSel) setTriggerText(String(children)); }, [isSel, children, setTriggerText]);
  return (
    <button type="button" onClick={() => { onValueChange(value); setTriggerText(String(children)); setOpen(false); }}
      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5 ${isSel ? 'text-[#00c685] font-semibold bg-[#00c685]/10' : 'text-gray-300'}`}>
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
function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="text-[10px] font-semibold uppercase tracking-wide block mb-1.5 text-white/40">{children}</label>;
}
function Divider() { return <div className="border-t border-white/5 my-1" />; }

function Stepper({ value, onChange, min = 0, max = 20 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer"><Minus size={12} /></button>
      <span className="text-white text-sm font-semibold w-5 text-center tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer"><Plus size={12} /></button>
    </div>
  );
}

function ToggleRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm text-gray-200 font-medium leading-snug">{label}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${value ? 'bg-[#00c685]' : 'bg-white/10'}`}>
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function CoverTypeCard({ label, description, icon: Icon, selected, onClick }: { label: string; description: string; icon: React.ElementType; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer group ${selected ? 'border-[#00c685]/50 bg-[#00c685]/10' : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${selected ? 'bg-[#00c685]/20 text-[#00c685]' : 'bg-white/5 text-gray-400'}`}><Icon size={16} /></div>
        <div>
          <p className={`text-sm font-semibold leading-tight ${selected ? 'text-white' : 'text-gray-300'}`}>{label}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
        {selected && <Check size={14} className="text-[#00c685] ml-auto shrink-0 mt-1" />}
      </div>
    </button>
  );
}

function RiderCard({ icon: Icon, label, desc, selected, onClick }: { icon: React.ElementType; label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${selected ? 'border-[#00c685]/50 bg-[#00c685]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-[#00c685]/20 text-[#00c685]' : 'bg-white/5 text-gray-400'}`}><Icon size={14} /></div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-300'}`}>{label}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
        </div>
        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-[#00c685] border-[#00c685]' : 'bg-transparent border-white/20'}`}>
          {selected && <Check size={10} className="text-[#0a1a14]" />}
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Submitted':'bg-blue-500/15 text-blue-400','Under Review':'bg-amber-500/15 text-amber-400',
    'Awaiting Information':'bg-orange-500/15 text-orange-400','Approved':'bg-green-500/15 text-green-400',
    'Rejected':'bg-red-500/15 text-red-400','Paid':'bg-emerald-500/15 text-emerald-400',
    'Active':'bg-green-500/15 text-green-400','Expiring':'bg-amber-500/15 text-amber-400',
    'Collected':'bg-emerald-500/15 text-emerald-400','Failed':'bg-red-500/15 text-red-400',
    'Pending':'bg-blue-500/15 text-blue-400','Low':'bg-emerald-500/15 text-emerald-400',
    'Medium':'bg-amber-500/15 text-amber-400','High':'bg-orange-500/15 text-orange-400','Critical':'bg-red-500/15 text-red-400',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-gray-500/15 text-gray-400'}`}>{status}</span>;
}

function KPICard({ label, value, sub, icon: Icon, trend, color = GREEN }: { label: string; value: string; sub?: string; icon?: React.ElementType; trend?: { dir: 'up'|'down'; text: string }; color?: string }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background:'#0d2117', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-white/35">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs mt-0.5 text-white/40">{sub}</p>}
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

function DSSection({ id, title, desc, children }: { id?: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <div className="pb-3 border-b border-white/8">
        <h2 className="text-base font-bold text-white">{title}</h2>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Code({ label }: { label: string }) {
  return <span className="font-mono text-[10px] text-[#00c685]/60 bg-[#00c685]/8 border border-[#00c685]/15 px-2 py-0.5 rounded-md">{label}</span>;
}

const NAV = [
  { id:'tokens', label:'Tokens' }, { id:'typography', label:'Typography' },
  { id:'badges', label:'Badges' }, { id:'kpi', label:'KPI Cards' },
  { id:'inputs', label:'Inputs' }, { id:'dropdowns', label:'Dropdowns' },
  { id:'toggles', label:'Toggles' }, { id:'stepper', label:'Stepper' },
  { id:'cover', label:'Cover Cards' }, { id:'riders', label:'Riders' },
  { id:'divider', label:'Divider' }, { id:'labels', label:'Labels' },
  { id:'notifications', label:'Notifications' }, { id:'table', label:'Table' },
  { id:'buttons', label:'Buttons' }, { id:'alerts', label:'Alerts' },
];

export default function DesignSystemPage() {
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

  return (
    <div className="min-h-screen bg-[#03120d] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#03120d]/95 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
              <ArrowLeft size={14} className="text-white/60" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">Takaful Design System</h1>
              <p className="text-[10px] text-white/30 font-mono mt-0.5">Components · Tokens · Patterns</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`} className="text-[10px] font-medium text-white/35 hover:text-white/70 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">{n.label}</a>
            ))}
          </nav>
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#00c685]/60 font-mono bg-[#00c685]/5 border border-[#00c685]/15 px-2.5 py-1 rounded-full shrink-0">v1.0</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-16">

        {/* TOKENS */}
        <DSSection id="tokens" title="Design Tokens" desc="Core colour palette used across all pages.">
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
                <div className={`h-12 rounded-xl ${t.cls}`}/>
                <div>
                  <p className="text-[11px] font-medium text-white/70">{t.name}</p>
                  <p className="text-[10px] font-mono text-white/30">{t.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </DSSection>

        {/* TYPOGRAPHY */}
        <DSSection id="typography" title="Typography Scale" desc="All text sizes and weights used in the system.">
          <div className="rounded-2xl border border-white/8 bg-[#0d2117] divide-y divide-white/5">
            {[
              {label:'H1 / Page Title',cls:'text-2xl font-bold text-white',sample:'As-salamu alaykum, Fatima 👋'},
              {label:'H2 / Section',cls:'text-base font-bold text-white',sample:'Takaful Pool Overview'},
              {label:'Card Heading',cls:'text-sm font-semibold text-white/80',sample:'My Current Cover'},
              {label:'Body / Table',cls:'text-sm text-gray-300',sample:'Buildings & Contents · Certificate TK-2024-0042'},
              {label:'Section Label',cls:'text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]',sample:'Property Details'},
              {label:'Field Label',cls:'text-[10px] font-semibold uppercase tracking-wide text-white/40',sample:'Wall Construction'},
              {label:'Caption',cls:'text-xs text-white/40',sample:'Due 1 Aug 2026 · TK-2024-0042'},
              {label:'Monospace',cls:'text-xs font-mono text-[#00c685]/60',sample:'TK-2024-0042 · v1.0 · 98.3%'},
            ].map(t=>(
              <div key={t.label} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-[10px] font-mono text-white/25 w-32 shrink-0">{t.label}</span>
                <span className={`${t.cls} flex-1 truncate`}>{t.sample}</span>
              </div>
            ))}
          </div>
        </DSSection>

        {/* BADGES */}
        <DSSection id="badges" title="Status Badges" desc="Used in claims, certificates, contributions, and risk tables.">
          <Code label="<StatusBadge status='...' />" />
          <div className="flex flex-wrap gap-2 mt-3">
            {['Active','Submitted','Under Review','Awaiting Information','Approved','Rejected','Paid','Expiring','Collected','Failed','Pending','Low','Medium','High','Critical'].map(s=>(
              <StatusBadge key={s} status={s}/>
            ))}
          </div>
        </DSSection>

        {/* KPI */}
        <DSSection id="kpi" title="KPI Cards" desc="Dashboard overview metrics used across all four role views.">
          <Code label="<KPICard label='' value='' sub='' icon={} trend={{dir,text}} />" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
            <KPICard label="Certificate" value="TK-2024-0042" sub="Active · Expires 15 Jan 2027" icon={ShieldCheck}/>
            <KPICard label="Monthly Contribution" value="£38.50" sub="Due 1 Aug 2026" icon={CreditCard} trend={{dir:'up',text:'+2.1% vs last month'}}/>
            <KPICard label="Open Claims" value="3" sub="Currently active" icon={FileText} color="#f59e0b" trend={{dir:'down',text:'−1 since last week'}}/>
            <KPICard label="Pool Balance" value="£4.2M" sub="Surplus: £320K" icon={Activity} color="#3b82f6" trend={{dir:'up',text:'+£48K this month'}}/>
          </div>
        </DSSection>

        {/* INPUTS */}
        <DSSection id="inputs" title="Text Inputs" desc="pl-9 with icon prefix. Used in get-quote steps and dashboard filters.">
          <Code label="INPUT_CLS = 'rounded-xl border border-white/8 bg-white/[0.04] ...'" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {[
              {label:'Property postcode',icon:<MapPin size={13} className="text-gray-500"/>,ph:'e.g. B1 2PQ'},
              {label:'Year built',icon:<Calendar size={13} className="text-gray-500"/>,ph:'YYYY'},
              {label:'Email address',icon:<span className="text-gray-500 text-sm">@</span>,ph:'name@example.com'},
              {label:'Contents value (£)',icon:<span className="text-[#00c685] text-sm font-semibold font-mono">£</span>,ph:'e.g. 25000'},
            ].map(f=>(
              <div key={f.label} className="space-y-1.5">
                <FieldLabel>{f.label}</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">{f.icon}</span>
                  <input placeholder={f.ph} className={INPUT_CLS}/>
                </div>
              </div>
            ))}
          </div>
        </DSSection>

        {/* DROPDOWNS */}
        <DSSection id="dropdowns" title="Dropdowns — All 9 (Live & Selectable)" desc="Portal-based. Click any trigger to open. Items are fully selectable.">
          <Code label="<Select value={} onValueChange={}><SelectTrigger/><SelectContent><SelectItem/></SelectContent></Select>" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

            <div className="space-y-1.5">
              <FieldLabel>Wall construction</FieldLabel>
              <Select value={d1} onValueChange={setD1}>
                <SelectTrigger/><SelectContent>
                  <SelectItem value="brick" icon={<Layers className="w-3.5 h-3.5"/>}>Brick</SelectItem>
                  <SelectItem value="stone" icon={<Gem className="w-3.5 h-3.5"/>}>Stone</SelectItem>
                  <SelectItem value="timber" icon={<Trees className="w-3.5 h-3.5"/>}>Timber frame</SelectItem>
                  <SelectItem value="concrete" icon={<Building className="w-3.5 h-3.5"/>}>Concrete</SelectItem>
                  <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <FieldLabel>Roof type</FieldLabel>
              <Select value={d2} onValueChange={setD2}>
                <SelectTrigger/><SelectContent>
                  <SelectItem value="pitched-tiles" icon={<Layers className="w-3.5 h-3.5"/>}>Pitched – Tiles</SelectItem>
                  <SelectItem value="pitched-slate" icon={<Grid className="w-3.5 h-3.5"/>}>Pitched – Slate</SelectItem>
                  <SelectItem value="flat" icon={<Minus className="w-3.5 h-3.5"/>}>Flat</SelectItem>
                  <SelectItem value="mixed" icon={<Layers className="w-3.5 h-3.5"/>}>Mixed</SelectItem>
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
              <FieldLabel>Locks on external doors</FieldLabel>
              <Select value={d4} onValueChange={setD4}>
                <SelectTrigger/><SelectContent>
                  <SelectItem value="multipoint" icon={<Lock className="w-3.5 h-3.5"/>}>Multi-point lock</SelectItem>
                  <SelectItem value="deadlock" icon={<Key className="w-3.5 h-3.5"/>}>Deadlock (5-lever)</SelectItem>
                  <SelectItem value="standard" icon={<Shield className="w-3.5 h-3.5"/>}>Standard (Yale-type)</SelectItem>
                  <SelectItem value="smart" icon={<Laptop className="w-3.5 h-3.5"/>}>Smart lock</SelectItem>
                  <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5"/>}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <FieldLabel>Business use of property?</FieldLabel>
              <Select value={d5} onValueChange={setD5}>
                <SelectTrigger/><SelectContent>
                  <SelectItem value="no" icon={<CircleSlash className="w-3.5 h-3.5"/>}>No</SelectItem>
                  <SelectItem value="occasional" icon={<Home className="w-3.5 h-3.5"/>}>Occasionally (home office)</SelectItem>
                  <SelectItem value="yes-clients" icon={<Users className="w-3.5 h-3.5"/>}>Yes – clients visit</SelectItem>
                  <SelectItem value="yes-no-clients" icon={<Laptop className="w-3.5 h-3.5"/>}>Yes – no clients visit</SelectItem>
                  <SelectItem value="other" icon={<Package className="w-3.5 h-3.5"/>}>Other business use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <FieldLabel>How long unoccupied per year?</FieldLabel>
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
              <FieldLabel>Voluntary excess</FieldLabel>
              <Select value={d7} onValueChange={setD7}>
                <SelectTrigger/><SelectContent>
                  <SelectItem value="100" icon={<Scale className="w-3.5 h-3.5"/>}>£100</SelectItem>
                  <SelectItem value="250" icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]"/>}>£250 — Recommended</SelectItem>
                  <SelectItem value="500" icon={<Scale className="w-3.5 h-3.5"/>}>£500</SelectItem>
                  <SelectItem value="1000" icon={<Scale className="w-3.5 h-3.5"/>}>£1,000</SelectItem>
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
              <FieldLabel>Title</FieldLabel>
              <Select value={d9} onValueChange={setD9}>
                <SelectTrigger/><SelectContent>
                  <SelectItem value="mr">Mr</SelectItem>
                  <SelectItem value="mrs">Mrs</SelectItem>
                  <SelectItem value="ms">Ms</SelectItem>
                  <SelectItem value="dr">Dr</SelectItem>
                  <SelectItem value="prof">Prof</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-white/80">Dropdown Options (Open Menu Previews)</h3>
            <p className="text-xs text-white/40">Previews of all options for each of the 9 dropdowns in their expanded states.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. Wall Construction */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">1. Wall Construction</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Layers className="w-3.5 h-3.5 text-[#00c685]"/> Brick</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Gem className="w-3.5 h-3.5 text-[#00c685]"/> Stone</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Trees className="w-3.5 h-3.5 text-[#00c685]"/> Timber frame</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Building className="w-3.5 h-3.5 text-[#00c685]"/> Concrete</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Plus className="w-3.5 h-3.5 text-[#00c685]"/> Other</div>
                </div>
              </div>

              {/* 2. Roof Type */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">2. Roof Type</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Layers className="w-3.5 h-3.5 text-[#00c685]"/> Pitched – Tiles</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Grid className="w-3.5 h-3.5 text-[#00c685]"/> Pitched – Slate</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Minus className="w-3.5 h-3.5 text-[#00c685]"/> Flat</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Layers className="w-3.5 h-3.5 text-[#00c685]"/> Mixed</div>
                </div>
              </div>

              {/* 3. Type of Heating */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">3. Type of Heating</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Flame className="w-3.5 h-3.5 text-[#00c685]"/> Gas Central Heating</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Zap className="w-3.5 h-3.5 text-[#00c685]"/> Electric Heating</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Droplets className="w-3.5 h-3.5 text-[#00c685]"/> Oil-Fired Heating</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Wrench className="w-3.5 h-3.5 text-[#00c685]"/> Heat Pump</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Trees className="w-3.5 h-3.5 text-[#00c685]"/> Solid Fuel</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><CircleSlash className="w-3.5 h-3.5 text-[#00c685]"/> No Central Heating</div>
                </div>
              </div>

              {/* 4. Locks on external doors */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">4. Locks on External Doors</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Lock className="w-3.5 h-3.5 text-[#00c685]"/> Multi-point lock</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Key className="w-3.5 h-3.5 text-[#00c685]"/> Deadlock (5-lever)</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Shield className="w-3.5 h-3.5 text-[#00c685]"/> Standard (Yale-type)</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Laptop className="w-3.5 h-3.5 text-[#00c685]"/> Smart lock</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Plus className="w-3.5 h-3.5 text-[#00c685]"/> Other</div>
                </div>
              </div>

              {/* 5. Business use of property */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">5. Business Use of Property</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><CircleSlash className="w-3.5 h-3.5 text-[#00c685]"/> No</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Home className="w-3.5 h-3.5 text-[#00c685]"/> Occasionally (home office)</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Users className="w-3.5 h-3.5 text-[#00c685]"/> Yes – clients visit</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Laptop className="w-3.5 h-3.5 text-[#00c685]"/> Yes – no clients visit</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Package className="w-3.5 h-3.5 text-[#00c685]"/> Other business use</div>
                </div>
              </div>

              {/* 6. How long unoccupied per year */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">6. Unoccupied Period</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Clock className="w-3.5 h-3.5 text-[#00c685]"/> Less than 30 days</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Clock className="w-3.5 h-3.5 text-[#00c685]"/> 30–60 days</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Clock className="w-3.5 h-3.5 text-[#00c685]"/> 60–90 days</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Clock className="w-3.5 h-3.5 text-[#00c685]"/> More than 90 days</div>
                </div>
              </div>

              {/* 7. Voluntary excess */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">7. Voluntary Excess</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Scale className="w-3.5 h-3.5 text-[#00c685]"/> £100</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-[#00c685] bg-[#00c685]/10 font-semibold"><Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]"/> £250 — Recommended</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Scale className="w-3.5 h-3.5 text-[#00c685]"/> £500</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Scale className="w-3.5 h-3.5 text-[#00c685]"/> £1,000</div>
                </div>
              </div>

              {/* 8. Claims in the last 5 years */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">8. Claims History (5 Yrs)</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><Check className="w-3.5 h-3.5 text-[#00c685]"/> None</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/> 1 claim</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/> 2 claims</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300"><AlertTriangle className="w-3.5 h-3.5 text-[#00c685]"/> 3 or more</div>
                </div>
              </div>

              {/* 9. Title */}
              <div className="space-y-2 p-4 rounded-xl border border-white/8 bg-[#0a1a14]/40">
                <span className="text-[10px] font-bold tracking-wider text-[#00c685] uppercase">9. Title</span>
                <div className="rounded-lg border border-white/10 bg-neutral-950 p-1 space-y-0.5">
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300">Mr</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300">Mrs</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300">Ms</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300">Dr</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300">Prof</div>
                  <div className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-gray-300">Other</div>
                </div>
              </div>

            </div>
          </div>
        </DSSection>

        {/* TOGGLES */}
        <DSSection id="toggles" title="Toggle Rows" desc="Yes/No switches used in occupancy, security, and belongings steps.">
          <Code label="<ToggleRow label='' hint='' value={} onChange={} />" />
          <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
            <ToggleRow label="Is this your main residence?" hint="Your primary home where you live most of the year." value={toggle1} onChange={setToggle1}/>
            <ToggleRow label="Does the property have a burglar alarm?" value={toggle2} onChange={setToggle2}/>
            <ToggleRow label="Do you have smoke alarms on every floor?" value={toggle3} onChange={setToggle3}/>
            <ToggleRow label="Are external windows key-locked?" value={true} onChange={()=>{}}/>
            <ToggleRow label="Is there a CCTV system?" value={false} onChange={()=>{}}/>
          </div>
        </DSSection>

        {/* STEPPER */}
        <DSSection id="stepper" title="Number Stepper" desc="Increment / decrement counter with min/max bounds. Used in room and floor counts.">
          <Code label="<Stepper value={} onChange={} min={} max={} />" />
          <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
            {[
              {icon:Home,label:'Bedrooms',v:stepper1,set:setStepper1,min:1,max:10},
              {icon:Droplets,label:'Bathrooms',v:stepper2,set:setStepper2,min:1,max:5},
            ].map(({icon:Icon,label,v,set,min,max})=>(
              <div key={label} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5"><span className="text-[#00c685]"><Icon size={14}/></span><span className="text-gray-300 text-sm">{label}</span></div>
                <Stepper value={v} onChange={set} min={min} max={max}/>
              </div>
            ))}
          </div>
        </DSSection>

        {/* COVER CARDS */}
        <DSSection id="cover" title="Cover Type Cards" desc="Selectable option cards for the Cover & Protection step.">
          <Code label="<CoverTypeCard label='' description='' icon={} selected={} onClick={} />" />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CoverTypeCard label="Buildings & Contents" description="Complete protection for your home structure and everything inside it." icon={ShieldCheck} selected={cover==='both'} onClick={()=>setCover('both')}/>
            <CoverTypeCard label="Buildings Only" description="Cover the structure of your home against structural damage." icon={Home} selected={cover==='buildings'} onClick={()=>setCover('buildings')}/>
            <CoverTypeCard label="Contents Only" description="Protect your personal belongings and home appliances." icon={Laptop} selected={cover==='contents'} onClick={()=>setCover('contents')}/>
          </div>
        </DSSection>

        {/* RIDERS */}
        <DSSection id="riders" title="Rider / Add-on Cards" desc="Optional add-on checkbox cards. Click to toggle.">
          <Code label="<RiderCard icon={} label='' desc='' selected={} onClick={} />" />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <RiderCard icon={Zap} label="Accidental Damage Cover" desc="Covers sudden, unexpected damage by you or your family." selected={r1} onClick={()=>setR1(v=>!v)}/>
            <RiderCard icon={Scale} label="Legal Expenses Cover" desc="Up to £100,000 for property disputes and employment tribunals." selected={r2} onClick={()=>setR2(v=>!v)}/>
            <RiderCard icon={Wrench} label="Home Emergency Cover" desc="24/7 assistance for boiler breakdowns, burst pipes, and more." selected={r3} onClick={()=>setR3(v=>!v)}/>
          </div>
        </DSSection>

        {/* DIVIDER */}
        <DSSection id="divider" title="Divider" desc="Thin hairline separator used between form sections.">
          <Code label="<Divider />" />
          <div className="mt-3 space-y-3">
            <p className="text-sm text-white/40">Above divider</p>
            <Divider/>
            <p className="text-sm text-white/40">Below divider</p>
          </div>
        </DSSection>

        {/* LABELS */}
        <DSSection id="labels" title="Labels" desc="Two label variants — section headers and field labels.">
          <div className="space-y-5">
            <div><Code label="<SectionLabel>" /><div className="mt-2"><SectionLabel>Property Details</SectionLabel></div></div>
            <div><Code label="<FieldLabel htmlFor=''>" /><div className="mt-2"><FieldLabel>Wall construction</FieldLabel></div></div>
          </div>
        </DSSection>

        {/* NOTIFICATIONS */}
        <DSSection id="notifications" title="Notification Items" desc="Used in the dashboard notification panel for all roles.">
          <div className="rounded-2xl border border-white/8 bg-[#0d2117] divide-y divide-white/5">
            {[
              {icon:ShieldCheck,color:'#00c685',title:'Contribution Collected',sub:'Your August contribution of £38.50 has been processed.',time:'2 hours ago',unread:true},
              {icon:FileText,color:'#f59e0b',title:'Claim Update — TK-CLM-0091',sub:'Your claim is now Under Review by our assessment team.',time:'1 day ago',unread:true},
              {icon:Bell,color:'#3b82f6',title:'Renewal Reminder',sub:'Your certificate TK-2024-0042 renews in 30 days.',time:'3 days ago',unread:false},
            ].map((n,i)=>(
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:`${n.color}15`}}>
                  <n.icon size={15} style={{color:n.color}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white leading-snug">{n.title}</p>
                    <span className="text-[10px] text-white/30 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{n.sub}</p>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-[#00c685] shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </DSSection>

        {/* TABLE */}
        <DSSection id="table" title="Data Table Row" desc="Standard table layout used in claims, contributions, and transactions.">
          <div className="rounded-2xl border border-white/8 bg-[#0d2117] overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-2.5 border-b border-white/5">
              {['Claim ID','Type','Amount','Status','Date'].map(h=>(
                <span key={h} className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{h}</span>
              ))}
            </div>
            {[
              {id:'TK-CLM-0091',type:'Escape of Water',amount:'£3,200',status:'Under Review',date:'12 Jul 2026'},
              {id:'TK-CLM-0072',type:'Storm Damage',amount:'£1,840',status:'Paid',date:'3 Mar 2026'},
              {id:'TK-CLM-0058',type:'Theft',amount:'£950',status:'Rejected',date:'9 Nov 2025'},
              {id:'TK-CLM-0044',type:'Fire Damage',amount:'£12,500',status:'Approved',date:'1 Jun 2025'},
            ].map(row=>(
              <div key={row.id} className="grid grid-cols-5 px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center last:border-0">
                <span className="text-xs font-mono text-[#00c685]/80">{row.id}</span>
                <span className="text-xs text-gray-300">{row.type}</span>
                <span className="text-xs font-semibold text-white">{row.amount}</span>
                <StatusBadge status={row.status}/>
                <span className="text-xs text-white/40">{row.date}</span>
              </div>
            ))}
          </div>
        </DSSection>

        {/* BUTTONS */}
        <DSSection id="buttons" title="Buttons" desc="Primary CTA, secondary, ghost, and text link styles.">
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#03120d] bg-[#00c685] hover:bg-[#00d690] transition-colors shadow-lg shadow-[#00c685]/20 cursor-pointer">
              <Check size={15}/> Continue
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer">
              <ArrowLeft size={15}/> Back
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#00c685] border border-[#00c685]/25 bg-[#00c685]/8 hover:bg-[#00c685]/15 transition-colors cursor-pointer">
              <FileText size={13}/> Make a Claim
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/50 border border-white/8 bg-transparent hover:bg-white/5 transition-colors cursor-pointer">
              View all
            </button>
          </div>
        </DSSection>

        {/* ALERTS */}
        <DSSection id="alerts" title="Alert / Info Cards" desc="Contextual banners: success, warning, and error states.">
          <div className="space-y-3">
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5">
              <ShieldCheck size={16} className="text-[#00c685] mt-0.5 shrink-0"/>
              <div>
                <p className="text-sm font-semibold text-white">Takaful pool is healthy</p>
                <p className="text-xs text-white/50 mt-0.5">Current pool balance is £4.2M with a surplus of £320K above the minimum threshold.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0"/>
              <div>
                <p className="text-sm font-semibold text-white">Renewal in 30 days</p>
                <p className="text-xs text-white/50 mt-0.5">Your certificate TK-2024-0042 is due for renewal on 15 Jan 2027. No action required yet.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-500/20 bg-red-500/5">
              <Bell size={16} className="text-red-400 mt-0.5 shrink-0"/>
              <div>
                <p className="text-sm font-semibold text-white">Contribution payment failed</p>
                <p className="text-xs text-white/50 mt-0.5">Your August contribution of £38.50 could not be collected. Please update your payment method.</p>
              </div>
            </div>
          </div>
        </DSSection>

        {/* Footer */}
        <div className="border-t border-white/5 pt-6 pb-10 flex items-center justify-between">
          <p className="text-xs text-white/20">Takaful Design System · Internal Use Only</p>
          <p className="text-xs font-mono text-[#00c685]/30">v1.0 · {new Date().getFullYear()}</p>
        </div>

      </div>
    </div>
  );
}
