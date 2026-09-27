'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Flame,
  Droplets,
  Lock,
  Gem,
  Home,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { PillBadge } from '@/components/ui/pill-badge';

const HoverFooter = dynamic(
  () => import('@/components/ui/hover-footer-demo').then((m) => ({ default: m.HoverFooter })),
  { ssr: false }
);

/* ─── Navbar Component ─────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    ['Home', '/'],
    ['How it Works', '/how-it-works'],
    ['Compare Plans', '/compare-plans'],
    ['About Us', '/about'],
    ['Contact', '/contact'],
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-500 ${
        scrolled ? 'bg-[#0a1a14]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}>
        <Link href="/">
          <img
            src="/brand/logo-takaful.svg"
            alt="Takaful Logo"
            className="h-7 brightness-0 invert"
          />
        </Link>
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-full px-2 py-2 items-center gap-1 bg-white/5 border border-white/10 backdrop-blur-md">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="hidden md:block text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-300 text-gray-300 hover:bg-white/10"
          >
            My Portal
          </Link>
          <Link
            href="/get-quote"
            className="hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[#00c685] text-white"
          >
            Get Quote
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-full text-gray-300 hover:bg-white/10"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-[#0a1a14] border-l border-white/10 z-[201] p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <img src="/brand/logo-takaful.svg" alt="Takaful" className="h-6 brightness-0 invert" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  {links.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/10 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/get-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-[#00c685] hover:bg-[#00a871] text-white font-bold rounded-full transition-all"
              >
                Get a Quote
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Clause Data Model ────────────────────────────────────────────────── */
interface PolicyClause {
  id: string;
  number: string;
  category: 'shariah' | 'buildings' | 'contents' | 'exclusions' | 'addons';
  title: string;
  summary: string;
  fullText: string;
  keyPoints: string[];
}

const CLAUSES_DATA: PolicyClause[] = [
  {
    id: 'clause-1',
    number: 'Clause 1.1',
    category: 'shariah',
    title: 'Shariah Compliance & Governance Mandate',
    summary: 'Establishes the binding Shariah governance framework certified under AAOIFI standards, prohibiting interest, uncertainty, and gambling.',
    keyPoints: [
      'Zero Riba (No interest on deferred or monthly contributions)',
      'No Maisir (Zero gambling or speculative underwriting risk)',
      'Participant Takaful Fund ring-fenced from operator capital',
    ],
    fullText: 'The contract of Takaful is entered into on the basis of cooperative assistance (Ta\'awun) and donation (Tabarru\'). All operational guidelines, investment allocations, underwriting parameters, and surplus distribution policies are subject to ongoing vetting and annual certification by an independent Shariah Supervisory Board consisting of qualified Islamic jurisprudence scholars.',
  },
  {
    id: 'clause-2',
    number: 'Clause 1.2',
    category: 'shariah',
    title: 'Mutual Assistance (Ta\'awun) & Tabarru\' Donation Mechanism',
    summary: 'Governs how monthly or annual contributions become mutual donations into the collective indemnification pool.',
    keyPoints: [
      'Contributions are treated as voluntary mutual donations',
      'Pool funds solely assist members suffering legitimate loss',
      'The operator acts as trustee (Wakeel), not owner of the pool',
    ],
    fullText: 'By executing this agreement, the Participant agrees that their specified contribution (less the operator\'s agreed Wakala agency fee) is paid into the Participant Takaful Fund as Tabarru\' (conditional donation). The fund is utilized solely to indemnify any qualifying participant who suffers covered loss or damage to their insured property during the period of cover.',
  },
  {
    id: 'clause-3',
    number: 'Clause 1.3',
    category: 'shariah',
    title: 'Surplus Sharing (Al-Fa\'id Al-Ta\'mini) Clause',
    summary: 'Specifies the policyholder entitlement to any net underwriting surplus remaining in the fund at financial year end.',
    keyPoints: [
      'Surplus returned to non-claiming members',
      'Options include cash dividend, renewal credit, or charity',
      'Surplus calculated after full claims settlement and reserves',
    ],
    fullText: 'At the end of each financial year, following actuarial assessment and the setting aside of statutory prudential reserves, any net surplus remaining in the Participant Takaful Fund shall be distributed among eligible participants who have not lodged a claim during the relevant period. Eligible participants may elect to receive their share as a direct payout, credit towards renewal, or gift to vetted charitable causes.',
  },
  {
    id: 'clause-4',
    number: 'Clause 1.4',
    category: 'shariah',
    title: 'Qard Hasan (Interest-Free Liquidity Guarantee) Clause',
    summary: 'Obligates the operator to provide an interest-free loan if pool claims exceed contributions in any year.',
    keyPoints: [
      'Operator must cover fund deficits immediately',
      'No emergency levies or retrospective demands on participants',
      'Loan repaid only from future underwriting surpluses',
    ],
    fullText: 'Should the Participant Takaful Fund experience a deficit due to catastrophic loss events exceeding total contributions, the Takaful Operator is contractually obligated to extend an interest-free benevolent loan (Qard Hasan) to satisfy all approved claims. This loan shall be recouped strictly from future surpluses generated by the fund and cannot be recovered from individual participants.',
  },
  {
    id: 'clause-5',
    number: 'Clause 2.1',
    category: 'exclusions',
    title: 'Utmost Good Faith & Mandatory 5-Year Claims Lookback',
    summary: 'Mandates full disclosure of all property claims across the preceding 60 months, reflecting mutual trust.',
    keyPoints: [
      'Exact 5-year lookback period strictly enforced',
      'Failure to declare prior losses permits retrospective adjustment',
      'Fraudulent misrepresentation voids coverage immediately',
    ],
    fullText: 'The Participant owes a duty of fair presentation and utmost good faith (Amanah). The Participant must disclose all insurance claims, losses, or incidents (whether claimed or not) concerning buildings or contents occurring within the five (5) years preceding the inception date. Non-disclosure or misrepresentation of claims history may void the policy from inception or proportionally reduce claims settlements.',
  },
  {
    id: 'clause-6',
    number: 'Clause 3.1',
    category: 'buildings',
    title: 'Buildings Cover Scope & Reinstatement Standard',
    summary: 'Covers physical building structure, fixtures, outbuildings, and domestic garages on a New for Old basis.',
    keyPoints: [
      'Covers walls, roof, foundations, permanent fixtures, solar panels',
      'Standard perils: Fire, lightning, explosion, storm, riot, aircraft impact',
      'Full rebuilding cost covered up to sum insured (£500k - £1.5M)',
    ],
    fullText: 'The Participant Takaful Fund indemnifies the Participant against physical loss or damage to the insured building structure (including fitted kitchens, bathrooms, domestic outbuildings, boundary walls, and permanently installed renewable solar/heat pump systems) caused by fire, explosion, lightning, storm, earthquake, aircraft collision, or falling trees.',
  },
  {
    id: 'clause-7',
    number: 'Clause 3.2',
    category: 'buildings',
    title: 'Escape of Water & Trace and Access Clause',
    summary: 'Comprehensive cover for burst domestic water pipes, frozen tanks, and costs incurred locating leaks.',
    keyPoints: [
      'Trace & Access covered up to £5,000 to find and open source of leak',
      'Standard excess £350 applies for escape of water incidents',
      'Excludes damage if home is left unoccupied for over 30 days without precautions',
    ],
    fullText: 'Cover includes loss or damage resulting from the escape of water from internal domestic water apparatus, washing machines, or heating installations. We will also pay reasonable costs incurred up to £5,000 for trace and access to pinpoint the source of water damage within walls, floors, or ceilings, and the subsequent reinstatement of damaged finishes.',
  },
  {
    id: 'clause-8',
    number: 'Clause 3.3',
    category: 'exclusions',
    title: 'Unoccupied Property 30-Day Restriction Clause',
    summary: 'Sets out mandatory protective measures when the property remains vacant for more than 30 consecutive days.',
    keyPoints: [
      'Notifies Takaful team if home is empty over 30 continuous days',
      'Escape of water excluded unless heating left on 15°C or drained down',
      'Theft, vandalism, and accidental damage restricted during vacancy',
    ],
    fullText: 'If the private residence is left unoccupied or unfurnished for more than thirty (30) consecutive days, coverage for theft, attempted theft, malicious damage, accidental damage, and escape of water is automatically suspended unless: (a) the mains water supply is turned off and domestic plumbing completely drained, or (b) central heating is maintained continuously at a minimum thermostat temperature of 15°C between 1st November and 31st March.',
  },
  {
    id: 'clause-9',
    number: 'Clause 3.4',
    category: 'exclusions',
    title: 'Security Minimum Protections Endorsement (Locks & Alarms)',
    summary: 'Defines required lock specifications on external doors and accessible ground floor windows.',
    keyPoints: [
      'External doors: 5-lever mortice deadlock (BS3621) or multi-point locking system',
      'Opening windows: Key-operated locks on ground floor and accessible windows',
      'All locks must be fully engaged whenever residence is unattended',
    ],
    fullText: 'It is a condition precedent to liability for theft or forced entry claims that all external entry doors be fitted with either a five-lever mortice deadlock conforming to British Standard BS3621 or a modern multi-point espagnolette locking mechanism. Key-operated window locks must be engaged on all accessible ground floor or flat-roof accessible windows whenever the home is left unattended.',
  },
  {
    id: 'clause-10',
    number: 'Clause 4.1',
    category: 'contents',
    title: 'Contents Cover & High-Value Specified Valuables',
    summary: 'Protects household goods and furniture, and outlines requirements for high-value items above £2,500.',
    keyPoints: [
      'Standard single-article limit for unspecified valuables: £2,500',
      'Jewelry, luxury watches, art, and fine collectibles must be itemized',
      'Valuation certificates dated within 3 years required for items over £5,000',
    ],
    fullText: 'Household contents, electrical appliances, clothing, and personal effects situated within the home are insured against insured perils. For high-value personal valuables including precious jewelry, horological timepieces, fine artwork, and bespoke precious metals, any single item, pair, or set exceeding £2,500 must be individually specified in the policy schedule with an agreed declared value.',
  },
  {
    id: 'clause-11',
    number: 'Clause 4.2',
    category: 'addons',
    title: 'Personal Belongings Away from Home Endorsement',
    summary: 'Extends protection for personal effects, portable computers, and jewelry worldwide.',
    keyPoints: [
      'Covers accidental loss and theft anywhere in the UK and up to 60 days abroad',
      'Limits up to £5,000 or custom specified sums',
      'Includes mobile phones, laptops, cameras, and everyday watches',
    ],
    fullText: 'Where selected on your policy schedule, coverage extends to personal effects, clothing, portable computing equipment, and portable valuables while temporarily removed from your home anywhere within the United Kingdom, and up to sixty (60) days worldwide in any insurance year, against accidental loss, accidental damage, and theft.',
  },
  {
    id: 'clause-12',
    number: 'Clause 2.2',
    category: 'exclusions',
    title: 'Shariah Prohibited Items Exclusion Clause',
    summary: 'Expressly excludes coverage for commercial alcohol storage, gambling apparatus, and unlawful items.',
    keyPoints: [
      'No indemnification for commercial alcohol cellars or stock',
      'No cover for gambling machinery or prohibited contraband',
      'Protects moral purity and compliance of the collective fund',
    ],
    fullText: 'In alignment with the core religious and ethical principles governing Takaful mutual funds, no indemnification, compensation, or reimbursement shall be paid from the Participant Takaful Fund for loss or damage to: (a) commercial inventories or collections of alcoholic beverages; (b) commercial gambling apparatus or gaming paraphernalia; or (c) any goods or property held in violation of UK law or Shariah jurisprudence.',
  },
  {
    id: 'clause-13',
    number: 'Clause 3.5',
    category: 'buildings',
    title: 'Subsidence, Ground Heave & Landslip Conditions',
    summary: 'Outlines standard excess and exclusions concerning foundation movement, erosion, and riverbank collapse.',
    keyPoints: [
      'Standard £1,000 subsidence excess applies across all claims',
      'Excludes damage resulting from coastal, cliff, or river erosion',
      'Requires prompt notification upon first sign of diagonal wall cracking',
    ],
    fullText: 'Coverage includes subsidence or ground heave of the site on which the buildings stand, or landslip. A compulsory excess of £1,000 applies to each subsidence incident. Excluded from coverage is loss caused by normal settlement, shrinkage, or expansion of new foundations, coastal or riverbank erosion, or damage caused by faulty architectural design, workmanship, or materials.',
  },
  {
    id: 'clause-14',
    number: 'Clause 4.3',
    category: 'addons',
    title: 'Full Accidental Damage Endorsement',
    summary: 'Comprehensive optional protection for unexpected accidents in the home (spills, DIY mishaps).',
    keyPoints: [
      'Covers spilled paint on carpets, broken ceramic tiles, cracked glass',
      'DIY drilling through electrical cables or plumbing pipes',
      'Excludes pet scratching, chewing, or gradual wear and tear',
    ],
    fullText: 'When added to Buildings or Contents, this endorsement covers sudden, unexpected, and unintentional physical harm to the insured property (such as putting a foot through a ceiling while in the attic, smashing ceramic wash basins, or spilling indelible liquids on carpets). Gradual deterioration, mechanical breakdown, or damage caused by household pets is expressly excluded.',
  },
  {
    id: 'clause-15',
    number: 'Clause 5.1',
    category: 'addons',
    title: 'Home Emergency 24/7 Rapid Response Clause',
    summary: 'Rapid dispatch of vetted emergency tradespeople for heating breakdowns, plumbing, or power loss.',
    keyPoints: [
      'Up to £1,000 per emergency incident with zero excess',
      'Complete boiler breakdown, burst internal pipes, electrical failure',
      'Uninhabitable home overnight accommodation allowance up to £250',
    ],
    fullText: 'Provides emergency assistance up to £1,000 per incident for sudden unforeseen domestic emergencies requiring immediate remedial action to make the property safe, prevent catastrophic further damage, or restore heating, hot water, or power. No excess is payable for authorized callouts through our 24/7 emergency dispatch line.',
  },
  {
    id: 'clause-16',
    number: 'Clause 5.2',
    category: 'addons',
    title: 'Family Legal Protection & Shariah Mediation Clause',
    summary: 'Provides up to £100,000 legal costs for property disputes, consumer contracts, and Shariah arbitration.',
    keyPoints: [
      'Up to £100,000 legal expenses cover with 51%+ prospects of success',
      'Boundary disputes, contractor disagreements, employment claims',
      'Funding for certified Shariah dispute mediation procedures',
    ],
    fullText: 'Covers legal representation costs, solicitor fees, and court charges up to £100,000 for qualifying legal disputes arising within the UK, including freehold property boundary disputes, contract disputes with builders or suppliers, and personal employment tribunals. Also includes access to accredited Shariah arbitration panels where mutual resolution is sought.',
  },
];

export default function PolicyClausesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>('clause-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Clauses' },
    { id: 'shariah', label: 'Shariah & Mutual Pool' },
    { id: 'buildings', label: 'Buildings Cover' },
    { id: 'contents', label: 'Contents & Valuables' },
    { id: 'exclusions', label: 'Exclusions & Security' },
    { id: 'addons', label: 'Endorsements & Add-ons' },
  ];

  const filteredClauses = useMemo(() => {
    return CLAUSES_DATA.filter((clause) => {
      const matchesCategory = selectedCategory === 'all' || clause.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        clause.title.toLowerCase().includes(q) ||
        clause.summary.toLowerCase().includes(q) ||
        clause.fullText.toLowerCase().includes(q) ||
        clause.number.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const copyClause = (clause: PolicyClause) => {
    const textToCopy = `${clause.number} - ${clause.title}\n\n${clause.fullText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07130e] text-white selection:bg-[#00c685]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,198,133,0.18),rgba(255,255,255,0))]" />
        
        <div className="max-w-5xl mx-auto px-5 relative z-10 text-center">
          <div className="flex justify-center mb-5">
            <PillBadge
              text="Policy Wordings & Endorsements"
              dark
              dot
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Policy <span className="text-[#00c685]">Clauses</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Searchable, transparent contract clauses governing your Takaful UK Home Insurance coverage,
            Shariah governance, perils, exclusions, and claim standards.
          </p>

          {/* Search bar inside hero */}
          <div className="mt-10 max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses (e.g. 'flood', 'locks', 'surplus', 'water', 'unoccupied')..."
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#00c685] focus:ring-1 focus:ring-[#00c685] transition-all text-base backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Filter & List Section */}
      <main className="max-w-7xl mx-auto px-5 py-12">
        
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00c685] text-white shadow-lg shadow-[#00c685]/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 text-sm text-gray-400">
          <div>
            Showing <strong className="text-white">{filteredClauses.length}</strong> of {CLAUSES_DATA.length} clauses
            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setExpandedClauseId(expandedClauseId ? null : CLAUSES_DATA[0].id)}
              className="text-xs text-[#00c685] hover:underline"
            >
              {expandedClauseId ? 'Collapse active' : 'Expand first clause'}
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
            >
              <FileText className="w-3.5 h-3.5 text-[#00c685]" />
              Print Wordings
            </button>
          </div>
        </div>

        {/* Clauses Accordion List */}
        <div className="space-y-4">
          {filteredClauses.length === 0 ? (
            <div className="text-center py-20 bg-[#0b1c16]/50 rounded-2xl border border-white/5">
              <AlertCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No matching clauses found</h3>
              <p className="text-sm text-gray-400 mb-4">
                We couldn&apos;t find any clauses matching &quot;{searchQuery}&quot;. Try adjusting your search term.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-[#00c685]/20 text-[#00c685] text-sm font-medium hover:bg-[#00c685]/30 transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredClauses.map((clause) => {
              const isExpanded = expandedClauseId === clause.id;

              return (
                <div
                  key={clause.id}
                  id={clause.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-[#0b1c16] border-[#00c685]/40 shadow-xl shadow-[#00c685]/5'
                      : 'bg-[#0b1c16]/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wide shrink-0 ${
                        clause.category === 'shariah'
                          ? 'bg-[#00c685]/20 text-[#00c685] border border-[#00c685]/30'
                          : 'bg-white/10 text-gray-300 border border-white/10'
                      }`}>
                        {clause.number}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                          {clause.title}
                          {clause.category === 'shariah' && (
                            <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#00c685]/10 text-[#00c685] border border-[#00c685]/20">
                              Shariah Mandate
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed font-light">
                          {clause.summary}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyClause(clause);
                        }}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        title="Copy clause text"
                      >
                        {copiedId === clause.id ? (
                          <Check className="w-4 h-4 text-[#00c685]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <div className="p-2 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/5 space-y-5">
                          
                          {/* Key Highlights */}
                          <div>
                            <h4 className="text-xs uppercase font-bold text-[#00c685] tracking-wider mb-2.5">
                              Key Highlights & Rules
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {clause.keyPoints.map((point, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-[#00c685] shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Statutory Policy Wording */}
                          <div>
                            <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">
                              Exact Policy Wording
                            </h4>
                            <div className="p-4 rounded-xl bg-[#07130e] border border-white/10 text-sm text-gray-200 leading-relaxed font-serif">
                              &ldquo;{clause.fullText}&rdquo;
                            </div>
                          </div>

                          {/* Action footer */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-[#00c685]" />
                              Underwritten in compliance with UK Insurance Act 2015 & Shariah Standards
                            </span>
                            <Link
                              href="/get-quote"
                              className="text-[#00c685] hover:underline font-medium flex items-center gap-1"
                            >
                              Apply to your policy in Quote Journey <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#00c685]/15 via-[#0b1c16] to-[#0b1c16] border border-[#00c685]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">Have questions about a specific policy wording?</h3>
            <p className="text-sm text-gray-300 max-w-xl font-light">
              Our UK-based underwriting team and Shariah compliance officers are available to explain any clause in plain English.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/get-quote"
              className="px-6 py-3 rounded-full bg-[#00c685] hover:bg-[#00a871] text-white text-sm font-semibold transition-colors shadow-lg shadow-[#00c685]/20"
            >
              Get Protected Now
            </Link>
          </div>
        </div>

      </main>

      <HoverFooter />
    </div>
  );
}
