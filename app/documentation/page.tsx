'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield, Layers, LayoutDashboard, CheckCircle2,
  Sliders, FileText, ArrowRight, ExternalLink,
  ChevronRight, Search, Copy, Check, Users,
  CreditCard, PieChart, ClipboardList, Banknote,
  ShieldAlert, Home, ArrowUpRight, Folder, Bell, Settings,
  Activity, Sparkles, AlertCircle, Info, Lock,
  ChevronDown, CheckCheck, Play, HelpCircle,
  Building, RefreshCw, BarChart3, Clock, Compass,
  Scale, Award, Landmark, FileCheck, ArrowDown,
  CheckSquare, Square, Eye, Sparkle
} from 'lucide-react';

/* ─── Navigation Master Index for Specification Revision 3.0 ──────────────── */
interface NavItem {
  id: string;
  num: string;
  label: string;
  category: string;
  badge?: string;
}

const SPEC_NAV: NavItem[] = [
  // 1. Overview & Vision
  { id: 'doc-purpose', num: '01', label: 'Document Purpose', category: 'Overview & Vision' },
  { id: 'product-overview', num: '02', label: 'Product Overview', category: 'Overview & Vision' },
  { id: 'product-vision', num: '03', label: 'Product Vision', category: 'Overview & Vision' },
  { id: 'core-principles', num: '04', label: 'Core Takaful Principles', category: 'Overview & Vision', badge: '5 Pillars' },
  { id: 'business-value', num: '05', label: 'Business & Mutual Value', category: 'Overview & Vision' },

  // 2. Customers & Ecosystem
  { id: 'target-users', num: '06', label: 'Target User Personas', category: 'Target Users & Journey', badge: '3 Personas' },
  { id: 'product-ecosystem', num: '07', label: 'Product Ecosystem', category: 'Target Users & Journey' },
  { id: 'public-website', num: '08', label: 'Public Website Map', category: 'Target Users & Journey' },
  { id: 'customer-journey', num: '09', label: 'End-to-End Customer Flow', category: 'Target Users & Journey', badge: 'Flow' },

  // 3. Get Quote Specification
  { id: 'get-quote-overview', num: '10', label: 'Get Quote Objective', category: 'Get Quote Functional Spec' },
  { id: 'quote-step-01', num: '11', label: 'Step 01: Postcode & Address', category: 'Get Quote Functional Spec' },
  { id: 'quote-step-02', num: '12', label: 'Step 02: Cover Scope', category: 'Get Quote Functional Spec' },
  { id: 'quote-step-03', num: '13', label: 'Step 03: Property Type', category: 'Get Quote Functional Spec' },
  { id: 'quote-step-04', num: '14', label: 'Step 04: Property Details', category: 'Get Quote Functional Spec' },
  { id: 'quote-step-05', num: '15', label: 'Step 05: Construction & Roof', category: 'Get Quote Functional Spec' },
  { id: 'quote-security', num: '18', label: 'Security & Door Locks', category: 'Get Quote Functional Spec' },
  { id: 'quote-use-occupancy', num: '23', label: 'Property Use & Occupancy', category: 'Get Quote Functional Spec' },
  { id: 'quote-buildings-contents', num: '27', label: 'Buildings & Contents Valuation', category: 'Get Quote Functional Spec' },
  { id: 'quote-high-value', num: '30', label: 'High-Value Items & Riders', category: 'Get Quote Functional Spec' },
  { id: 'quote-claims-history', num: '33', label: 'Claims History & Ownership', category: 'Get Quote Functional Spec' },
  { id: 'quote-optional-excess', num: '36', label: 'Optional Cover & Excess', category: 'Get Quote Functional Spec' },
  { id: 'quote-conditional-logic', num: '39', label: 'Conditional Logic Matrix', category: 'Get Quote Functional Spec', badge: 'Rules' },
  { id: 'quote-ux-rules', num: '40', label: 'Form UX & Review Summary', category: 'Get Quote Functional Spec' },

  // 4. Plans & Conversion
  { id: 'plan-comparison', num: '43', label: 'Plan Comparison Matrix', category: 'Plans & Conversion', badge: '3 Tiers' },
  { id: 'quote-transparency', num: '44', label: 'Contribution Transparency', category: 'Plans & Conversion' },
  { id: 'payment-journey', num: '45', label: 'Payment & Policy Binding', category: 'Plans & Conversion' },

  // 5. Operational Dashboards
  { id: 'dashboards-participant', num: '47', label: 'Participant Member Portal', category: 'Operational Dashboards', badge: 'Member' },
  { id: 'dashboards-claims', num: '55', label: 'Claims Adjuster Console', category: 'Operational Dashboards', badge: 'Ops' },
  { id: 'dashboards-finance', num: '59', label: 'Treasury & Finance Portal', category: 'Operational Dashboards', badge: 'Finance' },
  { id: 'dashboards-management', num: '64', label: 'Executive Governance Suite', category: 'Operational Dashboards', badge: 'C-Suite' },

  // 6. Financial Models
  { id: 'wakala-pool-model', num: '69', label: 'Wakala & Segregation Model', category: 'Actuarial & Governance' },
  { id: 'surplus-model', num: '70', label: 'Surplus Distribution Model', category: 'Actuarial & Governance' },
  { id: 'pricing-simulator', num: '70B', label: 'Actuarial Pricing Simulator', category: 'Actuarial & Governance', badge: 'Live Calc' },

  // 7. Roadmap & Checklist
  { id: 'project-phases', num: '71', label: 'Project Roadmap Phases', category: 'Governance & Verification' },
  { id: 'success-metrics', num: '72', label: 'Product Success Metrics', category: 'Governance & Verification' },
  { id: 'developer-checklist', num: '74', label: 'Get Quote Developer Checklist', category: 'Governance & Verification', badge: 'Checklist' },
  { id: 'product-structure', num: '75', label: 'Final Architecture Map', category: 'Governance & Verification' },
];

export default function SpecificationV3Page() {
  const [activeNav, setActiveNav] = useState('doc-purpose');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Developer Checklist Interactive State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'form-required': true,
    'form-choices': true,
    'form-validation': true,
    'form-optional': true,
    'form-back': true,
    'cond-buildings': true,
    'cond-contents': true,
    'cond-flat': true,
    'cond-business': true,
    'cond-claims': true,
    'cond-highvalue': true,
    'quote-summary': true,
    'quote-excess': true,
    'quote-frequency': true,
    'ux-loading': true,
    'ux-validation': true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Interactive Pricing Engine State
  const [calcCoverType, setCalcCoverType] = useState<'both' | 'buildings' | 'contents'>('both');
  const [calcBedrooms, setCalcBedrooms] = useState<number>(3);
  const [calcContentsValue, setCalcContentsValue] = useState<number>(40000);
  const [calcExcess, setCalcExcess] = useState<number>(250);
  const [calcAccidental, setCalcAccidental] = useState<boolean>(true);
  const [calcLegal, setCalcLegal] = useState<boolean>(true);
  const [calcEmergency, setCalcEmergency] = useState<boolean>(false);
  const [calcAlarm, setCalcAlarm] = useState<boolean>(true);
  const [calcCctv, setCalcCctv] = useState<boolean>(false);

  // Active section spy on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = SPEC_NAV.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveNav(SPEC_NAV[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered Navigation
  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return SPEC_NAV;
    const q = searchQuery.toLowerCase();
    return SPEC_NAV.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.num.includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Grouped Navigation
  const groupedNav = useMemo(() => {
    const groups: Record<string, NavItem[]> = {};
    filteredNav.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredNav]);

  // Actuarial Calculator Logic
  const calculatedContribution = useMemo(() => {
    let base = calcCoverType === 'both' ? 35.00 : calcCoverType === 'buildings' ? 22.00 : 18.00;
    let roomFactor = calcBedrooms * 3.00;
    let contentsFactor = calcContentsValue > 50000 ? 12.00 : calcContentsValue > 30000 ? 8.00 : 0.00;
    let excessDiscount = calcExcess >= 500 ? 5.00 : calcExcess >= 250 ? 2.50 : 0.00;
    let addons = (calcAccidental ? 4.00 : 0.00) + (calcLegal ? 2.00 : 0.00) + (calcEmergency ? 3.00 : 0.00);
    let securityDiscount = (calcAlarm ? 2.00 : 0.00) + (calcCctv ? 1.00 : 0.00);

    const gross = Math.max(15.00, base + roomFactor + contentsFactor - excessDiscount + addons - securityDiscount);
    const wakalaPortion = +(gross * 0.185).toFixed(2);
    const tabarruPortion = +(gross - wakalaPortion).toFixed(2);

    return {
      gross: gross.toFixed(2),
      wakalaPortion: wakalaPortion.toFixed(2),
      tabarruPortion: tabarruPortion.toFixed(2),
    };
  }, [calcCoverType, calcBedrooms, calcContentsValue, calcExcess, calcAccidental, calcLegal, calcEmergency, calcAlarm, calcCctv]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[#00c685]/20 selection:text-white font-sans text-sm">
      
      {/* ── Top Header Bar (OpenAI Developers Aesthetic) ─────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/brand/logo-light.png"
              alt="Takaful"
              className="h-7 w-auto object-contain brightness-105"
            />
          </Link>
          <div className="h-4 w-px bg-[#27272a] hidden md:block" />
          <div className="hidden md:flex items-center gap-2 text-xs text-[#a1a1aa] font-mono">
            <span>Documentation</span>
            <span>/</span>
            <span className="text-[#f4f4f5] font-semibold">Product & Get Quote Specification</span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-[#00c685]/10 text-[#00c685] text-[10px] border border-[#00c685]/20">
              Revision 3.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border border-[#27272a] bg-[#121215] text-[#71717a] font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c685] animate-pulse" />
            <span>Approved UX Blueprint</span>
          </div>
          <Link
            href="/portal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] transition-colors"
          >
            <LayoutDashboard size={13} className="text-[#00c685]" />
            <span>Open My Portal</span>
            <ArrowUpRight size={12} className="text-[#71717a]" />
          </Link>
          <Link
            href="/get-quote"
            className="font-medium bg-[#00c685] hover:bg-[#00e299] text-black px-3 py-1.5 rounded-md transition-colors"
          >
            Launch Quote Flow
          </Link>
        </div>
      </header>

      {/* ── Main Layout Container ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto flex">
        
        {/* ── Left Sidebar Navigation (OpenAI Docs Style) ────────────────────── */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-[#27272a] p-6 space-y-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto custom-scrollbar">
          
          {/* Instant Search Filter */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
            <input
              type="text"
              placeholder="Filter 76 spec sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-[#27272a] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#00c685] transition-colors font-mono"
            />
          </div>

          {/* Nav Categories */}
          <nav className="space-y-6">
            {Object.entries(groupedNav).map(([category, items]) => (
              <div key={category} className="space-y-1.5">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#71717a] px-2 py-0.5">
                  {category}
                </div>
                <ul className="space-y-0.5 text-xs">
                  {items.map(item => {
                    const isActive = activeNav === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-md transition-colors ${
                            isActive
                              ? 'bg-[#18181b] text-[#00c685] font-medium border-l-2 border-[#00c685]'
                              : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#121215]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] font-mono text-[#71717a]">{item.num}</span>
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                              isActive ? 'bg-[#00c685]/20 text-[#00c685]' : 'bg-[#27272a] text-[#71717a]'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Quick Links */}
          <div className="pt-6 border-t border-[#27272a] space-y-2 text-xs font-mono text-[#71717a]">
            <div className="text-[10px] uppercase tracking-wider font-semibold">Live Consoles</div>
            <div className="space-y-1">
              <Link href="/portal" className="flex items-center justify-between hover:text-[#f4f4f5] py-1 px-2 rounded hover:bg-[#121215]">
                <span>Member Portal</span>
                <ArrowUpRight size={11} />
              </Link>
              <Link href="/dashboard/queue" className="flex items-center justify-between hover:text-[#f4f4f5] py-1 px-2 rounded hover:bg-[#121215]">
                <span>Claims Queue</span>
                <ArrowUpRight size={11} />
              </Link>
              <Link href="/dashboard/pool" className="flex items-center justify-between hover:text-[#f4f4f5] py-1 px-2 rounded hover:bg-[#121215]">
                <span>Treasury & Pool</span>
                <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        </aside>

        {/* ── Main Specification Content Area ─────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-6 sm:px-12 py-10 space-y-16 max-w-4xl">
          
          {/* Header Metadata */}
          <div className="space-y-4 border-b border-[#27272a] pb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#a1a1aa]">
              <span className="text-[#00c685] font-semibold">TAKAFUL UK</span>
              <span>•</span>
              <span>System Revision 3.0</span>
              <span>•</span>
              <span className="text-[#71717a]">Updated September 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f4f4f5]">
              Product, UX & Get Quote Specification
            </h1>
            <div className="text-xs text-[#71717a] font-mono">
              <strong>Audience:</strong> Executive Stakeholders · Product Team · UX/UI Designers · Developers · Underwriting · Claims · Finance · Governance
            </div>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              The central product and UX reference blueprint for the Takaful UK digital home protection platform, detailing the mutual business model, customer journeys, complete Get Quote functional field behaviour, plan comparison, and 4 operational consoles.
            </p>
          </div>

          {/* ── 01. DOCUMENT PURPOSE ─────────────────────────────────────────── */}
          <section id="doc-purpose" className="space-y-4 scroll-mt-20">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 01 • DOCUMENT PURPOSE
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              01. Document Purpose
            </h2>
            <p className="text-[#d4d4d8] leading-relaxed">
              This document is the central product reference for the Takaful UK platform. It explains what Takaful UK is, the business and mutual model, target customers, product objectives, customer journeys, Get Quote experience, quote form fields and conditional behaviour, plan comparison, payment journey, participant experience, claims operations, finance operations, management and governance dashboards, and product phases.
            </p>
            <div className="p-4 rounded-lg bg-[#121215] border border-[#27272a] text-xs space-y-1.5">
              <div className="font-semibold text-[#f4f4f5]">Developer Functional Guidance:</div>
              <p className="text-[#a1a1aa]">
                For developers, the <strong>Get Quote section</strong> provides the functional behaviour required to reproduce the approved UX, including: fields, answer choices, required/optional states, conditional questions, what appears/disappears when an option is selected, quote summary behaviour, and dynamic pricing behaviour.
              </p>
              <p className="text-[#71717a] font-mono text-[11px]">
                * This document intentionally does not define backend architecture, APIs, database schemas, or programming implementation.
              </p>
            </div>
          </section>

          {/* ── 02. PRODUCT OVERVIEW & 03. VISION ────────────────────────────── */}
          <section id="product-overview" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 02 & 03 • PRODUCT OVERVIEW & VISION
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              02. Product Overview & 03. Vision
            </h2>
            <p className="text-[#d4d4d8] leading-relaxed">
              <strong>Takaful UK</strong> is a digital home protection platform built around the principles of mutual cooperation and Sharia-compliant financial structures. The experience is designed to provide customers with simple digital protection, transparent contributions, clear coverage, digital claims, accessible policy documents, and visibility into the mutual pool—serving as a modern alternative to traditional insurance.
            </p>

            <div id="product-vision" className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
              <div className="text-xs font-mono text-[#00c685] font-semibold uppercase">Platform Vision (11 Core Capabilities)</div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a1a1aa]">
                <li>1. Discover their eligibility.</li>
                <li>2. Get a transparent quote.</li>
                <li>3. Compare protection options.</li>
                <li>4. Complete their application.</li>
                <li>5. Set up payment securely.</li>
                <li>6. Receive policy documentation.</li>
                <li>7. Manage their active protection.</li>
                <li>8. Submit and track claims.</li>
                <li>9. Understand their contributions.</li>
                <li>10. Understand the mutual pool.</li>
                <li className="sm:col-span-2 text-[#00c685]">11. View eligible surplus information where applicable.</li>
              </ol>
            </div>
          </section>

          {/* ── 04. CORE TAKAFUL PRINCIPLES ──────────────────────────────────── */}
          <section id="core-principles" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 04 • CORE TAKAFUL PRINCIPLES
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              04. Core Takaful Principles
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-1.5">
                <div className="font-mono text-xs font-bold text-[#00c685]">4.1 Ta'awun — Mutual Cooperation</div>
                <p className="text-xs text-[#a1a1aa]">Members participate in a structure designed around mutual assistance and shared responsibility.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-1.5">
                <div className="font-mono text-xs font-bold text-[#00c685]">4.2 Tabarru — Mutual Contribution</div>
                <p className="text-xs text-[#a1a1aa]">An agreed portion of contributions is allocated to the mutual pool to support eligible claims and approved obligations.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-1.5">
                <div className="font-mono text-xs font-bold text-[#00c685]">4.3 Wakala — Agency Arrangement</div>
                <p className="text-xs text-[#a1a1aa]">The operator receives an agreed, transparent management fee for operating and administering the platform.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-1.5">
                <div className="font-mono text-xs font-bold text-[#00c685]">4.4 Sharia-Compliant Management</div>
                <p className="text-xs text-[#a1a1aa]">Structured to avoid prohibited elements (Riba, Gharar, Maysir) under formal Sharia and legal supervisory approval.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-1.5 sm:col-span-2">
                <div className="font-mono text-xs font-bold text-[#00c685]">4.5 Mutual Surplus (Important UX Rule)</div>
                <p className="text-xs text-[#a1a1aa]">
                  Where the approved financial model allows, eligible surplus is distributed according to predefined rules. <strong>The customer interface must clearly distinguish "Estimated surplus" from "Final approved distribution." A surplus must never be presented as guaranteed.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* ── 05. BUSINESS VALUE ───────────────────────────────────────────── */}
          <section id="business-value" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 05 • BUSINESS VALUE
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              05. Business Value
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1">
                <div className="font-bold text-[#00c685] font-mono">Transparency</div>
                <p className="text-[#a1a1aa] text-[11px]">Customers see exactly where contributions go.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1">
                <div className="font-bold text-[#00c685] font-mono">Simplicity</div>
                <p className="text-[#a1a1aa] text-[11px]">Removes insurance complexity and jargon.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1">
                <div className="font-bold text-[#00c685] font-mono">Self-Service</div>
                <p className="text-[#a1a1aa] text-[11px]">100% digital management without call centers.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1">
                <div className="font-bold text-[#00c685] font-mono">Mutuality</div>
                <p className="text-[#a1a1aa] text-[11px]">Explains the shared pool relationship.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1 col-span-2 sm:col-span-1">
                <div className="font-bold text-[#00c685] font-mono">Trust</div>
                <p className="text-[#a1a1aa] text-[11px]">Audited claims and governance clarity.</p>
              </div>
            </div>
          </section>

          {/* ── 06. TARGET USERS & PERSONAS ──────────────────────────────────── */}
          <section id="target-users" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 06 • TARGET USERS & PERSONAS
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              06. Target User Personas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Persona 1 */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#00c685] font-bold">PERSONA 01 — HOMEOWNER</span>
                  <span className="text-[#71717a]">Ages 34 & 31</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">Tariq & Amina</h3>
                  <div className="text-xs text-[#a1a1aa]">Birmingham • 3-bed semi-detached house</div>
                </div>
                <p className="text-xs text-[#a1a1aa]">Purchasing home via an Islamic home purchase plan (HPP).</p>
                <div className="text-xs space-y-1 text-[#a1a1aa] pt-2 border-t border-[#27272a]">
                  <div className="font-semibold text-[#f4f4f5]">Needs:</div>
                  <div>• Buildings protection & mortgage docs</div>
                  <div>• Simple quote & clear exclusions</div>
                  <div>• Digital policy documents & easy claims</div>
                  <div className="text-[#00c685] pt-1">UX Opportunity: Fast, transparent journey from postcode to lender-ready certificate.</div>
                </div>
              </div>

              {/* Persona 2 */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-400 font-bold">PERSONA 02 — RENTER</span>
                  <span className="text-[#71717a]">Age 27</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">Zayd</h3>
                  <div className="text-xs text-[#a1a1aa]">London • 1-bedroom flat</div>
                </div>
                <p className="text-xs text-[#a1a1aa]">Owns valuable electronics, cameras, and personal tech.</p>
                <div className="text-xs space-y-1 text-[#a1a1aa] pt-2 border-t border-[#27272a]">
                  <div className="font-semibold text-[#f4f4f5]">Needs:</div>
                  <div>• Contents & high-value item protection</div>
                  <div>• Mobile-first experience</div>
                  <div>• Digital claims & simple monthly payment</div>
                </div>
              </div>

              {/* Persona 3 */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">PERSONA 03 — ETHICAL</span>
                  <span className="text-[#71717a]">Ages 48 & 46</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">David & Eleanor</h3>
                  <div className="text-xs text-[#a1a1aa]">Bristol • Homeowners</div>
                </div>
                <p className="text-xs text-[#a1a1aa]">Interested in cooperative and ethical financial models.</p>
                <div className="text-xs space-y-1 text-[#a1a1aa] pt-2 border-t border-[#27272a]">
                  <div className="font-semibold text-[#f4f4f5]">Needs:</div>
                  <div>• Transparent fees & pool visibility</div>
                  <div>• Clear governance & ethical claims</div>
                  <div>• Understanding of surplus distribution</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 07 - 09. ECOSYSTEM & JOURNEY ─────────────────────────────────── */}
          <section id="product-ecosystem" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 07 - 09 • ECOSYSTEM & CUSTOMER JOURNEY
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              07. Product Ecosystem & 09. Customer Journey
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div id="public-website" className="p-3 rounded-lg bg-[#121215] border border-[#27272a]">
                <div className="font-mono text-[10px] text-[#71717a]">01</div>
                <div className="font-bold text-[#f4f4f5]">08. Public Website</div>
                <div className="text-[#a1a1aa] text-[11px] mt-1">Discovery & education</div>
                <div className="text-[10px] font-mono text-[#71717a] mt-2 pt-2 border-t border-[#27272a]">
                  Home · About · How It Works · Protection · Claims · Transparency · FAQs · Contact · Get Quote
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a]">
                <div className="font-mono text-[10px] text-[#71717a]">02</div>
                <div className="font-bold text-[#00c685]">Get Quote Flow</div>
                <div className="text-[#a1a1aa] text-[11px] mt-1">Acquisition & conversion</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a]">
                <div className="font-mono text-[10px] text-[#71717a]">03</div>
                <div className="font-bold text-[#f4f4f5]">Participant Portal</div>
                <div className="text-[#a1a1aa] text-[11px] mt-1">Customer self-service</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a]">
                <div className="font-mono text-[10px] text-[#71717a]">04</div>
                <div className="font-bold text-[#f4f4f5]">Operational Consoles</div>
                <div className="text-[#a1a1aa] text-[11px] mt-1">Claims, Finance, Governance</div>
              </div>
            </div>

            {/* Journey Diagram */}
            <div id="customer-journey" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] font-mono text-xs space-y-2">
              <div className="text-[#71717a] text-[11px] uppercase">End-to-End Customer Journey Pipeline</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#d4d4d8]">
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">DISCOVER</span>
                <span>→</span>
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">UNDERSTAND</span>
                <span>→</span>
                <span className="bg-[#00c685]/10 text-[#00c685] border border-[#00c685]/30 px-2.5 py-1 rounded">GET QUOTE</span>
                <span>→</span>
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">ANSWER QUESTIONS</span>
                <span>→</span>
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">COMPARE PLANS</span>
                <span>→</span>
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">PAYMENT</span>
                <span>→</span>
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">POLICY CREATED</span>
                <span>→</span>
                <span className="bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">MEMBER DASHBOARD</span>
              </div>
            </div>
          </section>

          {/* ── 10 - 22. GET QUOTE FUNCTIONAL SPECIFICATION ──────────────────── */}
          <section id="get-quote-overview" className="space-y-6 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 10 - 22 • GET QUOTE FUNCTIONAL SPECIFICATION
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              Get Quote Experience & Question Flows
            </h2>
            <p className="text-[#a1a1aa] leading-relaxed">
              The Get Quote experience must be fast, clear, mobile-friendly, progressive, easy to understand, transparent, and validated. <strong>The user should not see every question at once; questions appear conditionally based on previous answers.</strong>
            </p>

            {/* Step 01 to 05 Breakdown */}
            <div className="space-y-4">
              
              {/* Step 01 */}
              <div id="quote-step-01" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">STEP 01: POSTCODE & ADDRESS</span>
                  <span className="text-[10px] font-mono text-[#71717a]">ROYAL MAIL PAF</span>
                </div>
                <div className="text-xs text-[#d4d4d8]"><strong>Question:</strong> "What's your postcode?" (e.g. <code>B13 9EG</code>)</div>
                <div className="text-xs text-[#a1a1aa]"><strong>Actions:</strong> "Find my address" → displays dropdown list of matching addresses.</div>
                <div className="text-xs text-[#a1a1aa]"><strong>Alternative:</strong> "Enter my address manually" (Address line 1, Line 2, Town/City, County, Postcode).</div>
              </div>

              {/* Step 02 */}
              <div id="quote-step-02" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">STEP 02: WHAT DO YOU WANT TO PROTECT?</span>
                  <span className="text-[10px] font-mono text-[#71717a]">COVER SCOPE</span>
                </div>
                <div className="text-xs text-[#d4d4d8]"><strong>Question:</strong> "What would you like to cover?"</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="font-semibold text-[#f4f4f5]">Buildings & Contents</div>
                    <div className="text-[11px] text-[#a1a1aa]">Shows both Buildings and Contents questions.</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="font-semibold text-[#f4f4f5]">Buildings Only</div>
                    <div className="text-[11px] text-[#a1a1aa]">Shows Buildings questions; hides Contents questions.</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="font-semibold text-[#f4f4f5]">Contents Only</div>
                    <div className="text-[11px] text-[#a1a1aa]">Shows Contents questions; hides Buildings questions.</div>
                  </div>
                </div>
              </div>

              {/* Step 03 */}
              <div id="quote-step-03" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">STEP 03: PROPERTY TYPE</span>
                  <span className="text-[10px] font-mono text-[#71717a]">CONDITIONAL LOGIC</span>
                </div>
                <div className="text-xs text-[#d4d4d8]"><strong>Choices:</strong> House, Flat, Bungalow, Town house, Bedsit, Maisonette, Farm house, Other.</div>
                <div className="p-3 rounded bg-[#18181b] border border-[#27272a] text-xs space-y-1">
                  <div className="text-[#00c685] font-semibold">If "Flat" is selected:</div>
                  <div className="text-[#a1a1aa]">• <strong>Floor:</strong> Ground floor, 1st, 2nd, 3rd, 4th, 5th+, Other.</div>
                  <div className="text-[#a1a1aa]">• <strong>Self-contained?</strong> Yes / No.</div>
                </div>
              </div>

              {/* Step 04 */}
              <div id="quote-step-04" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">STEP 04: PROPERTY DETAILS & ROOM COUNTS</span>
                  <span className="text-[10px] font-mono text-[#71717a]">RISK FACTORS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <span className="text-[#71717a]">Bedrooms:</span> <span className="text-[#f4f4f5] font-bold">1 to 10+</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <span className="text-[#71717a]">Bathrooms:</span> <span className="text-[#f4f4f5] font-bold">1 to 5+</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <span className="text-[#71717a]">Living Rooms:</span> <span className="text-[#f4f4f5] font-bold">0 to 3+</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <span className="text-[#71717a]">Kitchens:</span> <span className="text-[#f4f4f5] font-bold">1 to 3+</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a] col-span-2 sm:col-span-1">
                    <span className="text-[#71717a]">Other Rooms:</span> <span className="text-[#f4f4f5] font-bold">0 to 10+</span>
                  </div>
                </div>
              </div>

              {/* Step 05 & Construction */}
              <div id="quote-step-05" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">STEP 05: CONSTRUCTION, ROOF & HEATING</span>
                  <span className="text-[10px] font-mono text-[#71717a]">UNDERWRITING</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                    <div className="font-semibold text-[#f4f4f5]">Walls & Year</div>
                    <div className="text-[11px] text-[#a1a1aa]">Brick, Stone, Concrete, Timber, Other. Year Built input.</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                    <div className="font-semibold text-[#f4f4f5]">Roof Construction</div>
                    <div className="text-[11px] text-[#a1a1aa]">Tile, Slate, Flat roof. If Flat Roof: % flat (0% up to 100%).</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                    <div className="font-semibold text-[#f4f4f5]">Heating System</div>
                    <div className="text-[11px] text-[#a1a1aa]">Gas central heating, Electric, Oil, Heat pump, Other.</div>
                  </div>
                </div>
              </div>

              {/* Security & Locks */}
              <div id="quote-security" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">SECURITY, LOCKS & ALARMS</span>
                  <span className="text-[10px] font-mono text-[#71717a]">DISCOUNT MITIGATION</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="text-[10px] text-[#71717a]">DOOR LOCKS</div>
                    <div className="font-medium text-[#f4f4f5]">5-lever mortice / Multi-point</div>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="text-[10px] text-[#71717a]">WINDOWS</div>
                    <div className="font-medium text-[#f4f4f5]">Key-operated locks</div>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="text-[10px] text-[#71717a]">BURGLAR ALARM</div>
                    <div className="font-medium text-[#f4f4f5]">Professional / None</div>
                  </div>
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a]">
                    <div className="text-[10px] text-[#71717a]">DOORS</div>
                    <div className="font-medium text-[#f4f4f5]">Patio / French / Bi-fold</div>
                  </div>
                </div>
              </div>

              {/* Use & Occupancy */}
              <div id="quote-use-occupancy" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00c685]">PROPERTY USE & OCCUPANCY</span>
                  <span className="text-[10px] font-mono text-[#71717a]">RISK EXCLUSIONS</span>
                </div>
                <div className="text-xs text-[#a1a1aa] space-y-1">
                  <div>• <strong>Main residence?</strong> Yes / No. <strong>Occupants:</strong> Alone, Partner/family, Tenants, Other.</div>
                  <div>• <strong>Unoccupied 30+ days?</strong> If Yes → trigger frequency and longest duration questions.</div>
                  <div>• <strong>Business use?</strong> No, Clerical/home office work, or Customers/visitors come to property (triggers visitor details).</div>
                </div>
              </div>

            </div>
          </section>

          {/* ── 27 - 38. VALUATION, RIDERS, CLAIMS & EXCESS ─────────────────── */}
          <section id="quote-buildings-contents" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 27 - 38 • VALUATION, RIDERS & CLAIMS
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              Valuation, High-Value Items & Claim History
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-bold text-[#00c685] font-mono">27. Rebuild Cost & Extensions</div>
                <p className="text-[#a1a1aa]">Estimated rebuild cost (not market value). If extended → capture extension type, size, and completion year.</p>
              </div>

              <div id="quote-high-value" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-bold text-[#00c685] font-mono">30. High-Value Items (&gt;£1,000)</div>
                <p className="text-[#a1a1aa]">Multi-select: Jewellery, Watches, Electronics, Cameras, Art, Instruments. Includes "Add Item" fields: Type, Description, Value, Purchase Date, Photo.</p>
              </div>

              <div id="quote-claims-history" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-bold text-[#00c685] font-mono">33. 5-Year Claim History</div>
                <p className="text-[#a1a1aa]">If Yes → specify incident count (1-5+), dates, incident types, estimated loss, amount paid, and status.</p>
              </div>

              <div id="quote-optional-excess" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-bold text-[#00c685] font-mono">37. Voluntary Excess & Recalculation</div>
                <p className="text-[#a1a1aa]">Options: £0, £150, £250, £400. Recalculates dynamically without forcing the user to restart the quote.</p>
              </div>
            </div>
          </section>

          {/* ── 39. CONDITIONAL LOGIC MATRIX ─────────────────────────────────── */}
          <section id="quote-conditional-logic" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTION 39 • CONDITIONAL LOGIC RULES
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              39. Get Quote Conditional Logic Matrix
            </h2>
            <div className="border border-[#27272a] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181b] text-[#71717a] font-mono text-[11px] uppercase border-b border-[#27272a]">
                  <tr>
                    <th className="p-3">User Selection</th>
                    <th className="p-3 text-[#00c685]">Additional Questions Displayed</th>
                    <th className="p-3 text-[#71717a]">Hidden / Removed Questions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a] text-[#d4d4d8] font-sans">
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Buildings & Contents</td>
                    <td className="p-3 text-[#00c685]">Buildings + Contents sections</td>
                    <td className="p-3 text-[#71717a]">None</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Buildings Only</td>
                    <td className="p-3 text-[#00c685]">Buildings section only</td>
                    <td className="p-3 text-[#71717a]">Contents questions hidden</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Contents Only</td>
                    <td className="p-3 text-[#00c685]">Contents section only</td>
                    <td className="p-3 text-[#71717a]">Buildings questions hidden</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Flat</td>
                    <td className="p-3 text-[#00c685]">Floor number + Self-contained toggle</td>
                    <td className="p-3 text-[#71717a]">Standard house exterior options</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Flat Roof</td>
                    <td className="p-3 text-[#00c685]">Flat roof percentage (0-100%)</td>
                    <td className="p-3 text-[#71717a]">N/A</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Business Use</td>
                    <td className="p-3 text-[#00c685]">Business type & visitor volume questions</td>
                    <td className="p-3 text-[#71717a]">None</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">Previous Claims</td>
                    <td className="p-3 text-[#00c685]">5-year claim incident breakdown</td>
                    <td className="p-3 text-[#71717a]">Hidden if "No" selected</td>
                  </tr>
                  <tr className="hover:bg-[#121215]/50">
                    <td className="p-3 font-mono font-medium text-[#f4f4f5]">High-Value Items</td>
                    <td className="p-3 text-[#00c685]">Item type, valuation, photo upload</td>
                    <td className="p-3 text-[#71717a]">Hidden if "No" selected</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 40 - 42. UX RULES, FORM SUMMARY & CALCULATION ────────────────── */}
          <section id="quote-ux-rules" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 40 - 42 • FORM UX RULES & SUMMARY
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              40. Form UX Rules & 41. Review Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-bold text-[#f4f4f5]">Progressive Disclosure & Back Navigation</div>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Only show questions relevant to the user's situation. If the user changes an earlier answer (e.g. from Buildings & Contents to Contents Only), dependent questions must immediately disappear and state must be cleaned up without jarring reload.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-bold text-[#f4f4f5]">Form Summary Review Screen</div>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Before generating final quote plans, display a clear review summary: Property type & location, Cover type, Buildings limit (£350k), Contents limit (£50k), Voluntary excess (£250), and Add-ons.
                </p>
              </div>
            </div>
          </section>

          {/* ── 43 - 46. PLAN COMPARISON & PAYMENT ───────────────────────────── */}
          <section id="plan-comparison" className="space-y-4 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 43 - 46 • PLAN COMPARISON & PAYMENT
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              43. Plan Comparison Matrix & 44. Transparency Breakdown
            </h2>

            {/* Plan Comparison Table */}
            <div className="border border-[#27272a] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181b] text-[#71717a] font-mono text-[11px] uppercase border-b border-[#27272a]">
                  <tr>
                    <th className="p-3">Protection Feature</th>
                    <th className="p-3 text-center">Essential</th>
                    <th className="p-3 text-center text-[#00c685]">Standard (Popular)</th>
                    <th className="p-3 text-center">Comprehensive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a] text-[#d4d4d8]">
                  <tr>
                    <td className="p-3 font-mono">Buildings Cover</td>
                    <td className="p-3 text-center text-[#00c685]">✓</td>
                    <td className="p-3 text-center text-[#00c685]">✓</td>
                    <td className="p-3 text-center text-[#00c685]">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">Contents Cover</td>
                    <td className="p-3 text-center text-[#00c685]">✓</td>
                    <td className="p-3 text-center text-[#00c685]">✓</td>
                    <td className="p-3 text-center text-[#00c685]">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">Accidental Damage</td>
                    <td className="p-3 text-center text-[#71717a]">—</td>
                    <td className="p-3 text-center text-[#a1a1aa]">Optional (+£4)</td>
                    <td className="p-3 text-center text-[#00c685]">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">Legal Protection</td>
                    <td className="p-3 text-center text-[#71717a]">—</td>
                    <td className="p-3 text-center text-[#00c685]">✓ Included</td>
                    <td className="p-3 text-center text-[#00c685]">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">Home Emergency</td>
                    <td className="p-3 text-center text-[#71717a]">—</td>
                    <td className="p-3 text-center text-[#a1a1aa]">Optional (+£3)</td>
                    <td className="p-3 text-center text-[#00c685]">✓ Included</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transparency Callout */}
            <div id="quote-transparency" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#00c685] font-bold">
                <span>44. CONTRIBUTION TRANSPARENCY BREAKDOWN</span>
                <span>MUTUAL ALLOCATION</span>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Example monthly contribution of £50.00 is visibly partitioned into £40.75 allocated to the Community Tabarru Claims Pool and £9.25 for the fixed Wakala management fee.
              </p>
            </div>

            {/* Payment Journey & Confirmation */}
            <div id="payment-journey" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#00c685] font-bold">
                <span>45. PAYMENT JOURNEY & 46. POLICY CONFIRMATION</span>
                <span>DIRECT DEBIT BINDING</span>
              </div>
              <div className="text-xs text-[#d4d4d8] font-mono">
                Selected Plan → Customer Details → Payment Setup → Review → Confirmation → Policy Created
              </div>
              <p className="text-xs text-[#a1a1aa] pt-1">
                Upon mandate authorization, the policy status switches to <strong>Active</strong>, generating a cryptographic Policy ID (e.g. <code>TK-784912</code>) and enabling immediate download of mortgage-ready schedules.
              </p>
            </div>
          </section>

          {/* ── 47 - 68. THE 4 OPERATIONAL DASHBOARDS ─────────────────────────── */}
          <section id="dashboards-participant" className="space-y-6 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 47 - 68 • THE 4 OPERATIONAL DASHBOARDS
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              Operational Console Specifications
            </h2>

            {/* 1. Participant Portal */}
            <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">47. Participant Member Portal</h3>
                  <div className="text-xs text-[#a1a1aa]">Central customer self-service area</div>
                </div>
                <Link href="/portal" className="text-xs font-mono text-[#00c685] hover:underline flex items-center gap-1">
                  <span>Open Console</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="text-xs text-[#a1a1aa] space-y-1">
                <div><strong>Main Navigation:</strong> Overview · My Cover · Contributions · Claims · Documents · Takaful Pool · Profile · Support</div>
                <div><strong>Overview Displays:</strong> Active Coverage (Buildings & Contents), Limits (£350k / £50k), Monthly contribution (£42.00/mo), Excess (£250), Estimated Surplus (£18.40).</div>
                <div><strong>Claim Status Tracker:</strong> Submitted → Under Review → Assessment → Additional Information → Decision → Settlement → Completed.</div>
              </div>
            </div>

            {/* 2. Claims Handler Dashboard */}
            <div id="dashboards-claims" className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">55. Claims Handler Console</h3>
                  <div className="text-xs text-[#a1a1aa]">Operational desk for incident triage, evidence auditing, and payouts</div>
                </div>
                <Link href="/dashboard/queue" className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
                  <span>Open Queue</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="text-xs text-[#a1a1aa] space-y-1">
                <div><strong>Main Navigation:</strong> Overview · Queue · Claims · Participants · Evidence · Reports</div>
                <div><strong>Queue Filters:</strong> New, In review, Awaiting evidence, Assessment, Approved, Declined, Paid, Closed.</div>
                <div><strong>Claim Detail View:</strong> Member details, Incident description & damage estimate, Photo/video evidence vault, Contractor estimates, Assessment notes.</div>
              </div>
            </div>

            {/* 3. Finance Dashboard */}
            <div id="dashboards-finance" className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">59. Treasury & Finance Dashboard</h3>
                  <div className="text-xs text-[#a1a1aa]">Financial control over contributions, pool funds, and claims releases</div>
                </div>
                <Link href="/dashboard/pool" className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1">
                  <span>Open Treasury</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="text-xs text-[#a1a1aa] space-y-1">
                <div><strong>Main Navigation:</strong> Overview · Pool · Contributions · Claims Payments · Transactions · Reports</div>
                <div><strong>Pool Transparency:</strong> Segregation between mutual Tabarru funds and Wakala operator fees.</div>
                <div><strong>Transactions Log:</strong> Immutable audit trail of banking movements, BACS direct debits, and contractor payments.</div>
              </div>
            </div>

            {/* 4. Management & Governance */}
            <div id="dashboards-management" className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5]">64. Management & Governance Suite</h3>
                  <div className="text-xs text-[#a1a1aa]">Executive-level visibility into platform risk, growth, and compliance</div>
                </div>
                <Link href="/dashboard/risk" className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1">
                  <span>Open Governance</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="text-xs text-[#a1a1aa] space-y-1">
                <div><strong>Main Navigation:</strong> Overview · Risk · Participants · Financial Performance · Governance · Certificates · Settings</div>
                <div><strong>Executive KPIs:</strong> Active Policies (14,280), MoM Growth (+14.2%), Portfolio Loss Ratio (41.2% YTD), Retention (98.4%).</div>
                <div><strong>Risk Views:</strong> Flood exposure heatmaps, subsidence peril clustering, postcode accumulation limits, Sharia board audit logs.</div>
              </div>
            </div>
          </section>

          {/* ── 69 - 70. WAKALA & SURPLUS MODELS + CALCULATOR ────────────────── */}
          <section id="wakala-pool-model" className="space-y-6 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 69 - 70 • WAKALA & SURPLUS FINANCIAL MODELS
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              69. Wakala Segregation & 70. Surplus Distribution Models
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-mono text-xs font-bold text-[#00c685]">Contribution Bifurcation</div>
                <pre className="p-3 rounded bg-[#18181b] text-[11px] font-mono text-[#a1a1aa]">
{`Customer Contribution
        │
   ┌────┴────────┐
   ↓             ↓
Tabarru Pool   Wakala Fee
Community      Operator
Protection     Management`}
                </pre>
              </div>

              <div id="surplus-model" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="font-mono text-xs font-bold text-[#00c685]">Surplus Distribution Formula</div>
                <pre className="p-3 rounded bg-[#18181b] text-[11px] font-mono text-[#a1a1aa]">
{`Eligible Pool Inflows
       - Claims Settled
       - Approved Reserves (IBNR)
       - Retakaful Reinsurance
       = Potential Surplus`}
                </pre>
              </div>
            </div>

            {/* Live Interactive Pricing Simulator */}
            <div id="pricing-simulator" className="border border-[#27272a] bg-[#121215] rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div className="font-mono text-xs font-bold text-[#00c685] uppercase">
                  Live Actuarial Contribution Simulator
                </div>
                <span className="text-[10px] font-mono text-[#71717a]">INTERACTIVE ENGINE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#71717a] uppercase">Cover Scope</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'both', label: 'Combined' },
                        { id: 'buildings', label: 'Buildings' },
                        { id: 'contents', label: 'Contents' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setCalcCoverType(t.id as any)}
                          className={`py-1.5 px-2 rounded font-mono text-xs border transition-colors ${
                            calcCoverType === t.id
                              ? 'bg-[#18181b] border-[#00c685] text-[#00c685] font-bold'
                              : 'bg-[#18181b]/50 border-[#27272a] text-[#a1a1aa] hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#71717a]">Bedrooms</span>
                      <span className="text-[#f4f4f5] font-bold">{calcBedrooms} Bedrooms</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={calcBedrooms}
                      onChange={(e) => setCalcBedrooms(Number(e.target.value))}
                      className="w-full accent-[#00c685]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#71717a]">Contents Valuation</span>
                      <span className="text-[#f4f4f5] font-bold">£{calcContentsValue.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={80000}
                      step={5000}
                      value={calcContentsValue}
                      onChange={(e) => setCalcContentsValue(Number(e.target.value))}
                      className="w-full accent-[#00c685]"
                    />
                  </div>
                </div>

                {/* Live Output */}
                <div className="border border-[#27272a] bg-[#18181b] rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-[#71717a] uppercase">Simulated Contribution</div>
                    <div className="text-3xl font-extrabold text-[#00c685] font-mono">
                      £{calculatedContribution.gross} <span className="text-xs text-[#a1a1aa] font-normal">/ mo</span>
                    </div>
                  </div>
                  <div className="border-t border-[#27272a] pt-3 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Community Claims Reserve (81.5%):</span>
                      <span className="text-[#f4f4f5] font-bold">£{calculatedContribution.tabarruPortion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Wakala Agency Fee (18.5%):</span>
                      <span className="text-[#00c685] font-bold">£{calculatedContribution.wakalaPortion}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#27272a] text-[#71717a]">
                      <span>Estimated Member Surplus Share:</span>
                      <span className="text-emerald-400 font-semibold">~£18.40 / yr</span>
                    </div>
                  </div>
                  <Link
                    href="/get-quote"
                    className="w-full text-center py-2 px-3 rounded-md bg-[#00c685] hover:bg-[#00e299] text-black font-semibold text-xs font-mono transition-colors"
                  >
                    Test Live in Get Quote Flow
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── 71 - 76. ROADMAP & DEVELOPER CHECKLIST ───────────────────────── */}
          <section id="project-phases" className="space-y-6 scroll-mt-20 pt-6 border-t border-[#27272a]">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00c685] bg-[#00c685]/10 border border-[#00c685]/20 font-semibold">
              SECTIONS 71 - 76 • ROADMAP, METRICS & CHECKLIST
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
              71. Project Phases & 74. Developer Checklist
            </h2>

            {/* Phases Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { phase: '01', title: 'Foundation', desc: 'Brand, public pages, tokens' },
                { phase: '02', title: 'Get Quote', desc: 'Postcode, stepper, logic' },
                { phase: '03', title: 'Plan & Pay', desc: 'Comparison, Direct Debit' },
                { phase: '04', title: 'Participant', desc: 'Cover, claims, pool' },
                { phase: '05', title: 'Claims Ops', desc: 'Queue, triage, settlements' },
                { phase: '06', title: 'Finance', desc: 'Pool, batches, audit' },
                { phase: '07', title: 'Executive', desc: 'Risk, analytics, Sharia' },
                { phase: '08', title: 'Optimisation', desc: 'Mobile app, automation' },
              ].map(p => (
                <div key={p.phase} className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1">
                  <div className="font-mono text-[10px] text-[#00c685]">PHASE {p.phase}</div>
                  <div className="font-bold text-[#f4f4f5]">{p.title}</div>
                  <div className="text-[11px] text-[#a1a1aa]">{p.desc}</div>
                </div>
              ))}
            </div>

            {/* 72. Product Success Metrics */}
            <div id="success-metrics" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
              <div className="font-mono text-xs font-bold text-[#00c685] uppercase">
                72. Product Success Metrics & KPIs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                  <div className="font-semibold text-[#f4f4f5]">Acquisition</div>
                  <div className="text-[11px] text-[#a1a1aa]">Website visitors, Quote starts, Quote completion, Plan selection, Payment activation.</div>
                </div>
                <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                  <div className="font-semibold text-[#f4f4f5]">Customer</div>
                  <div className="text-[11px] text-[#a1a1aa]">Customer CSAT, Self-service rate, Dashboard retention, Policy downloads.</div>
                </div>
                <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                  <div className="font-semibold text-[#f4f4f5]">Claims</div>
                  <div className="text-[11px] text-[#a1a1aa]">Digital claim rate, First response time, SLA performance (&lt; 48h), Settlement ratio.</div>
                </div>
                <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                  <div className="font-semibold text-[#f4f4f5]">Business</div>
                  <div className="text-[11px] text-[#a1a1aa]">Active policies (14.2k+), Growth (+14.2%), Retention (98.4%), Claims ratio (41.2%).</div>
                </div>
              </div>
            </div>

            {/* Interactive Developer Verification Checklist */}
            <div id="developer-checklist" className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#f4f4f5] font-mono">74. Get Quote Developer Checklist</h3>
                  <p className="text-xs text-[#a1a1aa]">Interactive functional verification checklist for developers and QA</p>
                </div>
                <span className="text-xs font-mono text-[#00c685]">
                  {Object.values(checkedItems).filter(Boolean).length} of {Object.keys(checkedItems).length} Verified
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-mono font-semibold text-[#71717a] uppercase text-[10px] mb-2">Form & Navigation Requirements</div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'form-required', text: 'All required questions are available' },
                      { id: 'form-choices', text: 'All answer choices are implemented' },
                      { id: 'form-validation', text: 'Required fields are validated' },
                      { id: 'form-optional', text: 'Optional fields are clearly identified' },
                      { id: 'form-back', text: 'Back navigation works and preserves user answers' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="flex items-center gap-2.5 w-full text-left p-1.5 rounded hover:bg-[#18181b] transition-colors"
                      >
                        {checkedItems[item.id] ? (
                          <CheckSquare size={14} className="text-[#00c685] shrink-0" />
                        ) : (
                          <Square size={14} className="text-[#71717a] shrink-0" />
                        )}
                        <span className={checkedItems[item.id] ? 'text-[#f4f4f5]' : 'text-[#71717a]'}>{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27272a]">
                  <div className="font-mono font-semibold text-[#71717a] uppercase text-[10px] mb-2">Conditional Logic Verification</div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'cond-buildings', text: 'Buildings questions appear only when Buildings is selected' },
                      { id: 'cond-contents', text: 'Contents questions appear only when Contents is selected' },
                      { id: 'cond-flat', text: 'Flat-specific questions appear only for Flats' },
                      { id: 'cond-business', text: 'Business questions appear only when business use is selected' },
                      { id: 'cond-claims', text: 'Claim history appears only when previous claims are selected' },
                      { id: 'cond-highvalue', text: 'High-value item fields appear only when applicable' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="flex items-center gap-2.5 w-full text-left p-1.5 rounded hover:bg-[#18181b] transition-colors"
                      >
                        {checkedItems[item.id] ? (
                          <CheckSquare size={14} className="text-[#00c685] shrink-0" />
                        ) : (
                          <Square size={14} className="text-[#71717a] shrink-0" />
                        )}
                        <span className={checkedItems[item.id] ? 'text-[#f4f4f5]' : 'text-[#71717a]'}>{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27272a]">
                  <div className="font-mono font-semibold text-[#71717a] uppercase text-[10px] mb-2">Quote Summary & Calculation</div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'quote-summary', text: 'Summary displays all selected answers and allows editing' },
                      { id: 'quote-excess', text: 'Excess changes recalculate and update displayed contribution' },
                      { id: 'quote-frequency', text: 'Monthly and annual payment choice is reflected correctly' },
                      { id: 'ux-loading', text: 'Loading, validation, error, and eligible states implemented' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="flex items-center gap-2.5 w-full text-left p-1.5 rounded hover:bg-[#18181b] transition-colors"
                      >
                        {checkedItems[item.id] ? (
                          <CheckSquare size={14} className="text-[#00c685] shrink-0" />
                        ) : (
                          <Square size={14} className="text-[#71717a] shrink-0" />
                        )}
                        <span className={checkedItems[item.id] ? 'text-[#f4f4f5]' : 'text-[#71717a]'}>{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 75. Final Architecture Map */}
            <div id="product-structure" className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2 font-mono text-xs">
              <div className="text-[#71717a] text-[11px] uppercase">75. Final Product Architecture Map</div>
              <pre className="p-3 rounded bg-[#18181b] text-[11px] text-[#a1a1aa] overflow-x-auto">
{`                    TAKAFUL UK
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
     PUBLIC          GET QUOTE       DASHBOARDS
     WEBSITE             │                │
                         ↓          ┌─────┼─────┐
                    COMPARE PLANS    ↓     ↓     ↓
                         │        MEMBER CLAIMS FINANCE
                         ↓                    │
                      PAYMENT                 ↓
                         │              MANAGEMENT
                         ↓
                    ACTIVE POLICY
                         │
                    MEMBER PORTAL
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
            COVER      CLAIMS    CONTRIBUTIONS
                         │
                         ↓
                     POOL / SURPLUS`}
              </pre>
            </div>
          </section>

          {/* ── Document Footer ──────────────────────────────────────────────── */}
          <footer className="border-t border-[#27272a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#71717a]">
            <div>
              Takaful UK Specification Revision 3.0 • Working Product Blueprint
            </div>
            <div className="flex items-center gap-4">
              <Link href="/portal" className="hover:text-white transition-colors">My Portal</Link>
              <Link href="/get-quote" className="hover:text-white transition-colors">Get Quote</Link>
              <a href="#doc-purpose" className="hover:text-[#00c685] transition-colors">Back to Top ↑</a>
            </div>
          </footer>

        </main>

        {/* ── Right "On This Page" Outline (OpenAI Style) ───────────────────── */}
        <aside className="hidden xl:block w-60 shrink-0 p-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#71717a] mb-3">
            On this page
          </div>
          <ul className="space-y-1.5 text-xs border-l border-[#27272a] pl-3">
            {SPEC_NAV.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                  className={`block transition-colors truncate ${
                    activeNav === item.id
                      ? 'text-[#00c685] font-semibold -ml-[13px] pl-3 border-l border-[#00c685]'
                      : 'text-[#71717a] hover:text-[#f4f4f5]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#71717a] mr-1.5">{item.num}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </div>
  );
}
