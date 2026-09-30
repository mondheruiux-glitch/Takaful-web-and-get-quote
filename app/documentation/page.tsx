'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  Users,
  PieChart,
  ClipboardList,
  Banknote,
  Bell,
  Settings,
  ArrowUpRight,
  Check,
  Copy,
  Printer,
  Home
} from 'lucide-react';

const SECTIONS = [
  { id: 'what-is-takaful', title: 'What is Takaful UK?' },
  { id: 'public-website', title: '1. Public Website' },
  { id: 'authentication', title: '2. Authentication' },
  { id: 'get-quote', title: '3. Get a Quote (7 Steps)' },
  { id: 'compare-plans', title: '4. Compare Plans' },
  { id: 'payment', title: '5. Payment' },
  { id: 'participant-portal', title: '6. Participant Portal' },
  { id: 'staff-dashboards', title: '7. Staff Dashboards' },
  { id: 'notifications', title: '8. Notifications' },
  { id: 'full-journey', title: '9. Full Journey' },
  { id: 'key-things', title: '10. Key Things to Know' },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <img
                src="/brand/logo-dark.png"
                alt="Takaful UK"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <span className="text-slate-300 font-light hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider hidden sm:inline">
                Product Docs
              </span>
              <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                v4.0
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block w-52">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter guide..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              onClick={handleCopyLink}
              title="Copy URL"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              title="Print Documentation"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 hidden sm:block cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <Link
              href="/get-quote"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Try Get Quote
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Navigation Pills Bar (No side menu!) */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="whitespace-nowrap px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Single-Column Document Container ────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Document Header */}
        <div className="pb-10 border-b border-slate-200 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-4">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Official Product Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mb-4">
            Takaful UK — Complete Product Guide
          </h1>
          <p className="text-base text-slate-600 leading-relaxed mb-6">
            A clear, non-technical overview of the Takaful UK digital home protection platform — covering what the product does, the public website, authentication, the 7-step quote journey, the member portal, and all internal staff dashboards.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Version 4.0</span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Platform: Takaful UK Digital Home Protection</span>
            <span>•</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">~10 min read</span>
          </div>
        </div>

        {/* ── What is Takaful UK? ───────────────────────────────── */}
        <section id="what-is-takaful" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-emerald-600" />
            What is Takaful UK?
          </h2>
          <div className="text-slate-700 leading-relaxed space-y-4">
            <p className="text-base">
              Takaful UK is a digital home protection platform built on the idea of <strong className="text-slate-900 font-semibold">mutual help</strong>. Instead of buying from a traditional insurance company, members contribute to a shared community pool. When someone has a loss, they get paid from that pool.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Simple
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  No confusing insurance jargon or hidden clauses. Everything is written in plain English.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Transparent
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  You can see exactly where every pound goes between the community claims pool and the management fee.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Fair & Ethical
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Structured to align with ethical and Islamic finance principles. Surplus belongs to the community pool.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Fully Digital
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Manage quotes, documents, contributions, and claims entirely online without call centers.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 font-medium pt-2">
              The platform has four main areas:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 pl-1">
              <li><strong className="text-slate-900 font-semibold">Public Website</strong> — for people who want to learn about the product</li>
              <li><strong className="text-slate-900 font-semibold">Get a Quote</strong> — for people who want to see how much cover costs</li>
              <li><strong className="text-slate-900 font-semibold">Participant Portal</strong> — for existing members to manage their cover</li>
              <li><strong className="text-slate-900 font-semibold">Staff Dashboards</strong> — for internal teams to manage claims, payments, and the business</li>
            </ol>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 1. The Public Website ─────────────────────────────── */}
        <section id="public-website" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            1. The Public Website
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            The public website is what visitors see before they sign up. Its job is to explain what Takaful UK is and encourage people to get a quote.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">Pages on the Website</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white mb-8">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Page</th>
                  <th className="py-3 px-4">What It Does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Home <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">The main landing page. Explains the product and prompts visitors to get a quote.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/about" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      About <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Explains the story behind Takaful UK and the mutual model.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/how-it-works" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      How Takaful Works <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">A plain-English explanation of mutual contributions, the shared pool, and how members benefit.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/get-quote" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Get a Quote <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Starts the 7-step quote form.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/compare-plans" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Compare Plans <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Shows the available protection plans side by side.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/contact" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Contact <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Contact information and a contact form.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/privacy" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Privacy Policy <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Legal privacy notice.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/terms" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Terms & Conditions <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Legal terms.</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href="/clauses" className="hover:text-emerald-600 inline-flex items-center gap-1">
                      Policy Clauses <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Detailed policy clauses for people who want the full detail.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">How the Home Page Works</h3>
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 space-y-2">
            <p>The home page opens with a bold headline and a clear <strong>Get a Quote</strong> button. Below that, it explains:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
              <li>What Takaful is in simple terms</li>
              <li>The three types of cover available (Buildings, Contents, Both)</li>
              <li>How the community pool works</li>
              <li>Why Takaful is different from regular insurance</li>
              <li>Customer quotes and trust indicators</li>
              <li>A final call to action to start a quote</li>
            </ul>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 2. Authentication ─────────────────────────────────── */}
        <section id="authentication" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            2. Authentication — How People Sign In
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            The platform uses a <strong>sign-up and login system</strong> to protect participant data and ensure that members and staff access their appropriate environments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Sign Up</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                New members create an account during or after the quote process. They provide:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                <li>Their name</li>
                <li>Email address</li>
                <li>A secure password</li>
              </ul>
              <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                After signing up, they receive a confirmation and can access their portal.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Log In</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Existing members log in with their email and password to access their personal portal at any time to review policy details, submit claims, or check payments.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Staff Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Internal staff (claim handlers, finance team, management, super admin) log in with staff credentials. Once logged in, the platform serves a tailored dashboard matching their exact role and authorization level.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 3. Get a Quote — The 7-Step Form ─────────────────── */}
        <section id="get-quote" className="scroll-mt-28 mb-16">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                3. Get a Quote — The 7-Step Form
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                A step-by-step form asking questions one section at a time to calculate accurate pricing.
              </p>
            </div>
            <Link
              href="/get-quote"
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors"
            >
              Open Live Form <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6 mt-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 1
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  What You Want to Cover & Your Property
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Understand what the customer owns and where they live.
              </p>
              <div className="space-y-3 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block mb-1">What do you want to cover?</strong>
                  <ul className="list-disc list-inside pl-1 text-slate-600 space-y-0.5">
                    <li><strong>Buildings only</strong> (for homeowners — covers the structure of the house)</li>
                    <li><strong>Contents only</strong> (covers furniture, belongings, electronics)</li>
                    <li><strong>Buildings & Contents</strong> (covers both)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">What is your address?</strong>
                  <p className="text-slate-600">The customer can type their postcode and find their address from a list, or type it manually.</p>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">What type of property is it?</strong>
                  <p className="text-slate-600">House, Bungalow, Flat / Apartment, Maisonette.</p>
                  <p className="text-slate-500 italic mt-0.5 ml-2">↳ If Flat: asks what floor (Basement, Ground, First, Second floor or higher).</p>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">How do you own it?</strong>
                  <p className="text-slate-600">Owned outright (no mortgage), Owned with mortgage, Rented from private landlord, Rented from council.</p>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">Is it a listed building?</strong>
                  <p className="text-slate-600">Grade I, Grade II*, Grade II, Not listed.</p>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">Is this your main home?</strong>
                  <p className="text-slate-600">Yes or No.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 2
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  The Property Itself
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Understand what the building is made of and how it was built.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Wall Construction</strong>
                  <span className="text-slate-600">Brick, Stone, Timber, Concrete, Other</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Roof Type</strong>
                  <span className="text-slate-600">Pitched tiles, Slate, Flat, Mixed (Flat roof % if applicable)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Year Built & Size</strong>
                  <span className="text-slate-600">Year constructed, approximate square footage</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Bedrooms & Bathrooms</strong>
                  <span className="text-slate-600">Total count of bedrooms and bathrooms</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Heating System</strong>
                  <span className="text-slate-600">Gas central, Electric, Oil, Heat pump, Solid fuel, None</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Extensions</strong>
                  <span className="text-slate-600">Rear, Side, Loft, Garage, Conservatory, None</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Tree Hazard</strong>
                  <span className="text-slate-600">Trees within 7 metres of the property (Yes / No)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Flood & Subsidence</strong>
                  <span className="text-slate-600">Any past history of flooding or subsidence (Yes / No)</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 3
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Who Lives There & How It Is Used
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Understand occupancy and daily usage patterns.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <p>• <strong>Unoccupied period:</strong> Less than 30 days, 30–60 days, 60–90 days, More than 90 days</p>
                <p>• <strong>Adult & child occupants:</strong> Count of adults and children residing</p>
                <p>• <strong>Business use:</strong> No business, desk work only (no visitors), clients/visitors come to property, other</p>
                <p className="text-slate-500 italic pl-3">↳ If visitors come: Never, Occasionally, Monthly, Weekly, Daily</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 4
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Security & Safety
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Understand physical security measures affecting risk.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <p>• <strong>External door locks:</strong> 5-lever BS 3621 (highest security), 5-lever standard, Multi-point locking, Yale spring-latch, Smart lock</p>
                <p>• <strong>Window locks:</strong> Key-operated locks on ground floor and accessible windows (Yes / No)</p>
                <p>• <strong>Burglar alarm:</strong> None, Standard siren alarm, Smart or professionally monitored alarm</p>
                <p>• <strong>Smoke alarms & CCTV:</strong> Smoke alarm coverage and external CCTV cameras</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 5
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Valuables & Optional Extras
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Identify high-value items and configure optional cover add-ons.
              </p>
              <div className="text-xs text-slate-700 space-y-3">
                <p>
                  <strong>High-Value Items:</strong> Single items worth over £1,500 (Jewellery, Art, Electronics, Instruments, Watches, etc.) declared individually with values.
                </p>
                <p>
                  <strong>Personal Belongings Away from Home:</strong> Optional cover for valuables carried outside the house.
                </p>

                <div className="border border-slate-200 rounded-lg overflow-hidden mt-3">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Add-on</th>
                        <th className="py-2 px-3">What It Covers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-900">Accidental Damage</td>
                        <td className="py-2 px-3 text-slate-600">Spilling wine on laptop, dropping a phone, drilling into a hidden pipe</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-900">Home Emergency</td>
                        <td className="py-2 px-3 text-slate-600">Urgent repairs like boiler breakdown, burst pipe, or storm roof damage</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-900">Legal Protection</td>
                        <td className="py-2 px-3 text-slate-600">Legal costs for property boundary disputes, contractor conflicts, etc.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 6
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Claims History
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Check claims over an exact 5-year lookback period.
              </p>
              <div className="text-xs text-slate-700 space-y-2">
                <p>• <strong>Claims count:</strong> None, 1 claim, 2 claims, 3 or more claims in the past 5 years.</p>
                <p>• <strong>For each declared claim:</strong> Type of incident (storm, fire, theft, water), year it happened, and payout amount.</p>
                <p className="text-slate-500 italic">
                  Note: The system strictly reviews claims within the last 5 years from today. Anything older does not need declaration.
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Step 7
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Personal Details & Confirmation
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1 rounded-md inline-block mb-4">
                Goal: Collect applicant details and secure policy confirmation.
              </p>
              <div className="text-xs text-slate-700 space-y-2">
                <p>• <strong>Applicant details:</strong> Title, First & Last name, Date of birth, Phone number, Email address, Cover start date.</p>
                <p>• <strong>Preferences:</strong> Marketing opt-in/opt-out.</p>
                <p>• <strong>Declaration:</strong> Formal confirmation that all details provided are truthful and accurate.</p>
                <p className="text-emerald-700 font-semibold pt-1">
                  Clicking "Submit" recalculates the live contribution and routes to Plan Comparison.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 4. Compare Plans ──────────────────────────────────── */}
        <section id="compare-plans" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            4. Compare Plans
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            After completing the 7-step form, the customer sees a side-by-side comparison of three available protection plans.
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white mb-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Essential</td>
                  <td className="py-3 px-4 text-slate-600">Basic cover at a lower price point</td>
                  <td className="py-3 px-4 text-slate-600">Budget-conscious homeowners and tenants</td>
                </tr>
                <tr className="hover:bg-slate-50/60 bg-emerald-50/20">
                  <td className="py-3 px-4 font-bold text-emerald-800 flex items-center gap-1.5">
                    Standard <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Popular</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Balanced protection with core extras included</td>
                  <td className="py-3 px-4 text-slate-600">Most UK families and standard properties</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Comprehensive</td>
                  <td className="py-3 px-4 text-slate-600">Broadest cover with most add-ons included</td>
                  <td className="py-3 px-4 text-slate-600">High-value properties needing maximum peace of mind</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p><strong>Interactive toggles:</strong> Customers can toggle between <strong>Monthly</strong> and <strong>Annual</strong> payments with instantaneous price updates.</p>
            <p><strong>What is displayed:</strong> Exact monthly/annual contribution, buildings cover limit, contents cover limit, voluntary excess options, and clear inclusion/exclusion checkmarks.</p>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 5. Payment ────────────────────────────────────────── */}
        <section id="payment" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            5. Payment
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            After selecting a plan, the customer completes their payment setup in 5 structured steps:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 block mb-1">01</span>
              <p className="text-xs font-semibold text-slate-800">Review Plan</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 block mb-1">02</span>
              <p className="text-xs font-semibold text-slate-800">Enter Payment Details</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 block mb-1">03</span>
              <p className="text-xs font-semibold text-slate-800">Confirm Start Date</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 block mb-1">04</span>
              <p className="text-xs font-semibold text-slate-800">Review Everything</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 block mb-1">05</span>
              <p className="text-xs font-semibold text-slate-800">Confirm & Bind</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
            <strong className="block text-sm font-bold text-emerald-900">Policy Confirmation Screen</strong>
            <p>Once payment is confirmed, an instant policy confirmation is displayed containing:</p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-emerald-900/90">
              <li>A unique policy & certificate number (e.g., <code>TK-2024-8841</code>)</li>
              <li>The insured property address</li>
              <li>Scope of cover (Buildings, Contents, Add-ons)</li>
              <li>Agreed contribution schedule (monthly Direct Debit or annual payment)</li>
              <li>Effective start date</li>
            </ul>
            <p className="pt-2">A direct button allows immediate transition into the Participant Portal.</p>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 6. Participant Portal — Member Dashboard ─────────── */}
        <section id="participant-portal" className="scroll-mt-28 mb-16">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                6. Participant Portal — The Member Dashboard
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Where active members manage their cover, view contributions, submit claims, and download documents.
              </p>
            </div>
            <Link
              href="/portal/cover"
              className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 shadow-xs transition-colors"
            >
              Open Member Portal <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs mb-8 flex items-center justify-between">
            <div>
              <span className="font-semibold block text-slate-100">Active Demo Persona: Fatima Al-Rashid</span>
              <span className="text-slate-400">Policy TK-2024-0089 • 14 Oakridge Avenue, London NW3 2QJ</span>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              Active Member
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-600" />
                Portal — My Cover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Gives the member a complete picture of what protection they have:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Insured property address</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cover type (Buildings, Contents, Both)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Buildings limit (£350,000) & Contents limit (£50,000)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Policy certificate number & renewal dates</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Excess amount breakdown</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active add-ons & key exclusions list</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                Portal — My Claims
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Where members submit new claims and track live claim progress end-to-end.
              </p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                <span className="font-semibold block text-slate-900">7-Step Claim Submission Flow:</span>
                <p>1. Start Claim ➔ 2. Select Incident Type (Fire, Water, Storm, Theft, etc.) ➔ 3. Incident Date ➔ 4. Plain-English Description ➔ 5. Upload Evidence/Photos ➔ 6. Review ➔ 7. Submit.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="font-semibold block text-slate-900 mb-1">Live Claim Tracking Lifecycle:</span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-medium text-slate-700">
                  <span className="px-2 py-0.5 bg-slate-200 rounded">Submitted</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Under Review</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Assessment</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">Decision</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Payment</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-white rounded">Completed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  Portal — My Contributions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Shows payment history, upcoming payment schedule, Direct Debit status, and the clear breakdown between the Community Claims Pool and the Operator Wakala fee.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Portal — My Documents
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Digital vault containing policy schedules, insurance certificates, full policy wording, assessor reports, and contribution statements — all downloadable as PDF.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-600" />
                  Portal — Takaful Pool
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Total community contributions collected, claims paid out, current pool balance, and potential surplus (transparently designated as an actuarial estimate).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-600" />
                  Portal — Support & Settings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Live support ticketing, knowledge base FAQs, profile details, password security, and communication notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 7. Staff Dashboards ──────────────────────────────── */}
        <section id="staff-dashboards" className="scroll-mt-28 mb-16">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                7. Staff Dashboards
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Internal management system with four dedicated role views and a top-bar role switcher.
              </p>
            </div>
            <Link
              href="/dashboard/claims"
              className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 shadow-xs transition-colors"
            >
              Open Staff Dashboard <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          <div className="space-y-6 mt-8">
            {/* Role 1: Claim Handler */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Staff Role: Claim Handler
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Operations & Adjusters
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                <strong>Who uses this:</strong> Claim handlers reviewing incident reports from participants.<br />
                <strong>Why this exists:</strong> When a claim is submitted, handlers need dedicated tools to review evidence, communicate with members, establish reserves, make approvals, and prepare payments.
              </p>
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Overview & SLA Metrics</strong>
                  Open claims count, incoming daily volume, SLA timers, and high-priority escalation alerts.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">My Queue & All Claims</strong>
                  Filter claims by status (New, In Review, Awaiting Documents, Assessment, Decision, Paid, Closed), priority, and handler assignment.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Individual Claim Detail Console</strong>
                  Comprehensive 6-part console: Member profile & policy limits, Incident facts, Photographic evidence viewer, Assessor report & payout estimates, Decision buttons (Approve / Request Docs / Decline), and Immutable audit activity log.
                </div>
              </div>
            </div>

            {/* Role 2: Finance Team */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Staff Role: Finance Team
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Treasury & Reconciliations
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                <strong>Who uses this:</strong> Financial controllers and treasury managers.<br />
                <strong>Why this exists:</strong> To supervise the community pool, execute approved claim disbursements, track monthly contribution collections, and audit the Wakala management fee.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Community Pool Health</strong>
                  Total contributions, total payouts, reserve ratios, and segregated Wakala operational revenue.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Contributions Ledger</strong>
                  Status of all monthly direct debits and card payments, failed transaction retries, and member receipts.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Claim Payment Processing</strong>
                  Approved claims pending bank transfer disbursement, schedule batching, and payment proof.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Transaction Audit Trail</strong>
                  Complete ledger of every pound in and out with category tags, authorizers, and banking references.
                </div>
              </div>
            </div>

            {/* Role 3: Management */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Staff Role: Management
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Executive Governance
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                <strong>Who uses this:</strong> Senior leadership and governance officers.<br />
                <strong>Why this exists:</strong> Provides high-level visibility across portfolio growth, loss ratios, member retention, risk hotspots, and policy certificates without needing micro-level records.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Portfolio Growth & Loss Ratio</strong>
                  Active members, month-on-month growth, claims loss ratio, and renewal retention rate.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Risk Exposure Heatmaps</strong>
                  Geographic risk concentrations, subsidence/flood zones, and repeat claimant analytics.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Policy Certificates Register</strong>
                  Global registry of all active, expiring, and renewed certificates across the membership.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Team Performance & Support</strong>
                  Claim handler SLA benchmarks, response speed, and customer satisfaction ratings.
                </div>
              </div>
            </div>

            {/* Role 4: Super Admin */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                  Staff Role: Super Admin
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  Full Platform Administration
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                <strong>Who uses this:</strong> Platform directors and system administrators.<br />
                <strong>Why this exists:</strong> Full access to all staff dashboards, staff role assignment, system security, compliance audit logs, and solvency monitoring.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <p>• <strong>Staff & Roles:</strong> Add staff, assign roles (Claim Handler, Finance, Management, Admin), suspend accounts, and manage permissions.</p>
                <p>• <strong>Audit Ledger:</strong> Immutable record of every administrative action, configuration change, and payout authorization with before/after state.</p>
                <p>• <strong>Risk & Solvency:</strong> High-level financial solvency ratios, statutory reserve adequacy, and Retakaful (reinsurance) provisions.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 8. Notifications (Floating Bell) ─────────────────── */}
        <section id="notifications" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            8. Notifications (Floating Bell — All Roles)
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            Both the participant portal and all staff dashboards feature a clean floating notification bell in the top navigation bar with a live green unread indicator dot.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                For Members (Participant Portal)
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Your claim CLM-2024-0891 has been approved"
                </li>
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Payment of £1,600 has been sent to your bank account"
                </li>
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Your assessor visit is confirmed for Friday 25 July"
                </li>
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Your policy certificate TK-2024-0089 is now active"
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                For Staff (Dashboard Roles)
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "New claim submitted — CLM-2024-0889 (Water Escape)"
                </li>
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Direct debit failed for member Maryam Patel"
                </li>
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Assessor report received on CLM-2024-0891"
                </li>
                <li className="p-2 rounded bg-slate-50 border border-slate-100">
                  "Certificate TK-2024-0098 is expiring in 14 days"
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 9. The Full Journey — Start to Finish ────────────── */}
        <section id="full-journey" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            9. The Full Journey — Start to Finish
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            An end-to-end view of how someone discovers Takaful UK, becomes an active member, and interacts with the internal claims and governance team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Journey */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                The Customer Experience
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Visits the website and reads about mutual protection</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Clicks "Get a Quote" and starts the 7-step journey</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Completes property, occupancy, security, and claims history</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span>Views personalized pricing on the Compare Plans page</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                  <span>Selects a plan (Essential, Standard, or Comprehensive)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">6</span>
                  <span>Completes direct debit or payment setup</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">7</span>
                  <span>Receives instant policy confirmation and certificate</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">8</span>
                  <span className="font-semibold text-emerald-900">Enters Participant Portal to manage cover, track pool, and submit claims</span>
                </div>
              </div>
            </div>

            {/* Internal Processing */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                The Internal Processing Cycle
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Member submits claim with photos & report</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Floating notification alerts Claim Handler</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Handler verifies cover limits and evidence</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span>Handler records assessment and approves payout</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                  <span>Finance team receives approval and disburses funds</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">6</span>
                  <span>Member receives notification & bank credit</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">7</span>
                  <span>Management tracks loss ratio & pool balance</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">8</span>
                  <span className="font-semibold text-slate-900">Super Admin audits immutable ledger & solvency position</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 my-12" />

        {/* ── 10. Key Things to Know ───────────────────────────── */}
        <section id="key-things" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
            10. Key Things to Know
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-900 block mb-1">The Community Pool</strong>
              All member contributions go into a dedicated community pool. Claims are paid directly from this pool. Whatever funds remain after claims and operational costs may be returned to eligible members as a mutual surplus.
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-900 block mb-1">Surplus is Never Guaranteed</strong>
              To remain compliant with both Shariah guidelines and UK insurance standards, surplus distributions are always presented as estimates until audited, confirmed, and approved at year-end.
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-900 block mb-1">The Wakala Fee</strong>
              The Wakala fee is the transparent management fee taken by the platform operator to run the technology, underwriting, and claims management services. It is displayed clearly on every contribution breakdown.
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-900 block mb-1">Demo Values & Real-World Pricing</strong>
              All numbers in the platform demo (pricing, limits, reserves) serve as illustrative examples. Production values are calibrated directly by the authorized actuarial pricing engine.
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-900 block mb-1">Fully Responsive on All Devices</strong>
              The entire platform — from the public marketing site and 7-step quote flow to the participant portal and staff dashboards — is engineered to work seamlessly on desktop, tablet, and mobile browsers.
            </div>
          </div>
        </section>

        {/* Document Footer */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Takaful UK. Last updated September 2026.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              Back to top ↑
            </button>
            <Link href="/" className="text-emerald-700 hover:text-emerald-800 font-medium">
              Return to Website
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
