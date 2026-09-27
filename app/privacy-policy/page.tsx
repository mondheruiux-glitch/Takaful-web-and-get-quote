'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Database,
  Users,
  Server,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Mail,
  X,
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

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: '1. Introduction & Overview' },
    { id: 'data-we-collect', title: '2. Information We Collect' },
    { id: 'how-we-use-data', title: '3. Purpose & Legal Basis' },
    { id: 'takaful-underwriting', title: '4. Takaful Mutual Pool & Risk Sharing' },
    { id: 'data-sharing', title: '5. Sharing & Third Parties' },
    { id: 'data-security', title: '6. Storage & Security' },
    { id: 'your-rights', title: '7. Your Statutory Rights (GDPR)' },
    { id: 'cookies', title: '8. Cookies & Tracking' },
    { id: 'contact-dpo', title: '9. Contact Data Protection Officer' },
  ];

  return (
    <div className="min-h-screen bg-[#07130e] text-white selection:bg-[#00c685]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,198,133,0.18),rgba(255,255,255,0))]" />
        
        <div className="max-w-5xl mx-auto px-5 relative z-10 text-center">
          <div className="flex justify-center mb-5">
            <PillBadge
              text="UK GDPR & Shariah Compliance"
              dark
              dot
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Privacy <span className="text-[#00c685]">Policy</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            We hold your privacy and personal data to the highest ethical and legal standards,
            governed by the UK Data Protection Act 2018, UK GDPR, and Shariah transparency mandates.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00c685]" />
              <span>256-bit TLS Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00c685]" />
              <span>ICO Registered Operator</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00c685]" />
              <span>Effective Date: September 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0b1c16]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Table of Contents
              </h2>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#00c685]/15 text-[#00c685] font-semibold border-l-2 border-[#00c685]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Need an official PDF copy for your records or mortgage provider?
                </p>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#00c685]" />
                  Print / Save PDF
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content Body */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">1. Introduction & Overview</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Takaful UK (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates an ethical, Shariah-compliant mutual protection
                  platform for UK home insurance. We act as the Data Controller responsible for your personal data collected via our website,
                  7-step quote journey, member dashboard, and customer care channels.
                </p>
                <p>
                  Under our Wakala (agency) model, we manage the collective Tabarru&apos; (donation) pool on behalf of our participants.
                  Honesty, integrity (Amanah), and transparency are core to Islamic jurisprudence and directly mirror our commitments
                  under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                </p>
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section id="data-we-collect" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  To accurately calculate your mutual contribution and administer your policy, we collect several categories of personal information:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#0b1c16] p-4 rounded-xl border border-white/5">
                    <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00c685]" /> Contact & Identity
                    </h3>
                    <p className="text-xs text-gray-400">
                      Full name, title, date of birth, residential address, telephone number, and email address.
                    </p>
                  </div>

                  <div className="bg-[#0b1c16] p-4 rounded-xl border border-white/5">
                    <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00c685]" /> Property Specifications
                    </h3>
                    <p className="text-xs text-gray-400">
                      Property type, year of construction, wall & roof materials, flat roof percentage, bedrooms, bathrooms, and heating systems.
                    </p>
                  </div>

                  <div className="bg-[#0b1c16] p-4 rounded-xl border border-white/5">
                    <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00c685]" /> 5-Year Claims History
                    </h3>
                    <p className="text-xs text-gray-400">
                      Accident, theft, escape of water, or flood claims declared within the mandatory 5-year lookback period required for equitable risk pooling.
                    </p>
                  </div>

                  <div className="bg-[#0b1c16] p-4 rounded-xl border border-white/5">
                    <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00c685]" /> High-Value Valuables
                    </h3>
                    <p className="text-xs text-gray-400">
                      Specified jewelry, watches, artwork, and electronics exceeding standard single-article limits (£2,500+).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Purpose & Legal Basis */}
            <section id="how-we-use-data" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">3. Purpose & Legal Basis for Processing</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Every piece of information processed has a distinct lawful basis under Article 6 of the UK GDPR:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="py-3 px-4">Processing Purpose</th>
                        <th className="py-3 px-4">Lawful Basis (UK GDPR)</th>
                        <th className="py-3 px-4">Data Categories</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-3 px-4 text-white font-medium">Generating Quotes & Policy Issuance</td>
                        <td className="py-3 px-4 text-[#00c685]">Contract Performance (Art 6(1)(b))</td>
                        <td className="py-3 px-4 text-gray-400">Identity, Property Details, High-Value Items</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-white font-medium">Underwriting & Claims Adjudication</td>
                        <td className="py-3 px-4 text-[#00c685]">Contract & Legitimate Interest</td>
                        <td className="py-3 px-4 text-gray-400">Claims History, Inspection Reports</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-white font-medium">Anti-Money Laundering & Sanctions Checks</td>
                        <td className="py-3 px-4 text-[#00c685]">Legal Obligation (Art 6(1)(c))</td>
                        <td className="py-3 px-4 text-gray-400">Identity, Payment Details, DOB</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-white font-medium">Surplus Rebate Calculation & Auditing</td>
                        <td className="py-3 px-4 text-[#00c685]">Legitimate Interest & Shariah Mandate</td>
                        <td className="py-3 px-4 text-gray-400">Contribution records, claim balances</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 4. Takaful Mutual Pool */}
            <section id="takaful-underwriting" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">4. Takaful Mutual Pool & Risk Sharing</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Unlike conventional insurance where companies profit from unclaimed premiums, Takaful operates as a cooperative mutual fund.
                  Your contributions are held in a segregated fund owned collectively by policyholders.
                </p>
                <div className="p-4 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 text-gray-200">
                  <p className="font-semibold text-white mb-1">Surplus Rebates & Audits</p>
                  <p className="text-sm">
                    At the close of each financial year, remaining pool funds are audited by an independent Shariah Supervisory Board.
                    Surplus calculations require reconciling claims and contributions. Anonymised financial metrics are published to all members.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Sharing & Third Parties */}
            <section id="data-sharing" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Server className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">5. Sharing & Third Parties</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We <strong className="text-white">never</strong> sell, monetize, or broker your personal data to marketing third parties.
                  Data is disclosed exclusively to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li><strong className="text-gray-200">Reinsurance & Underwriting Partners:</strong> To guarantee solvency and underwriting backstops.</li>
                  <li><strong className="text-gray-200">Loss Adjusters & Repair Contractors:</strong> To inspect and repair home damages during a claim.</li>
                  <li><strong className="text-gray-200">Fraud Prevention Registries:</strong> Claims and Underwriting Exchange (CUE) to uphold community pool integrity.</li>
                  <li><strong className="text-gray-200">UK Regulatory Authorities:</strong> Financial Conduct Authority (FCA) and Prudential Regulation Authority (PRA).</li>
                </ul>
              </div>
            </section>

            {/* 6. Storage & Security */}
            <section id="data-security" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">6. Storage, Encryption & Security</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Your data resides in sovereign UK data centers compliant with ISO 27001 and SOC 2 Type II standards.
                  All transmission occurs over TLS 1.3 encryption, and data at rest is protected using AES-256 block ciphers.
                  We retain policyholder records for 7 years following policy expiration to fulfill UK financial statutory limitation laws.
                </p>
              </div>
            </section>

            {/* 7. Your Statutory Rights */}
            <section id="your-rights" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">7. Your Statutory Rights (UK GDPR)</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  As a UK data subject, you hold comprehensive rights over your personal data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { title: 'Right of Access (SAR)', desc: 'Request a full electronic copy of all personal records we hold.' },
                    { title: 'Right to Rectification', desc: 'Correct inaccurate property specifications or personal details.' },
                    { title: 'Right to Erasure', desc: 'Request deletion of your data when retention periods expire.' },
                    { title: 'Right to Data Portability', desc: 'Export your claims history and policy details in JSON/CSV format.' },
                    { title: 'Right to Restrict Processing', desc: 'Limit how we use your data while a dispute is being investigated.' },
                    { title: 'Right to Object', desc: 'Opt out of any direct communications or non-essential profiling.' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-[#0b1c16] rounded-xl border border-white/5">
                      <p className="font-semibold text-white text-sm">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. Cookies */}
            <section id="cookies" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">8. Cookies & Tracking</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We operate with a privacy-first posture. We use strictly necessary session cookies required to persist
                  your 7-step quote journey across browser tabs. We do not employ third-party advertising tracking cookies.
                </p>
              </div>
            </section>

            {/* 9. Contact DPO */}
            <section id="contact-dpo" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">9. Contact Data Protection Officer (DPO)</h2>
              </div>
              <div className="bg-[#0b1c16] border border-white/10 rounded-2xl p-6 text-gray-300 space-y-4">
                <p>
                  For any privacy inquiries, Subject Access Requests (SAR), or data rights enforcement, contact our dedicated Data Protection Officer:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-white">Email:</strong> <a href="mailto:privacy@takaful.com" className="text-[#00c685] hover:underline">privacy@takaful.com</a></p>
                  <p><strong className="text-white">Postal Address:</strong> Data Protection Officer, Takaful UK Ltd, 100 Bishopsgate, London, EC2N 4AG, United Kingdom</p>
                  <p><strong className="text-white">ICO Registration:</strong> ZB928471</p>
                </div>
                <p className="text-xs text-gray-400">
                  You also have the right to lodge a complaint directly with the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-[#00c685] hover:underline">ico.org.uk</a>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <HoverFooter />
    </div>
  );
}
