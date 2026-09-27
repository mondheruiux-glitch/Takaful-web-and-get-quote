'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Coins,
  RefreshCw,
  Building,
  UserCheck,
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

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState('regulatory-basis');

  const sections = [
    { id: 'regulatory-basis', title: '1. Regulatory Basis & Definition' },
    { id: 'takaful-structure', title: '2. The Takaful Model (Wakala & Tabarru\')' },
    { id: 'policyholder-duties', title: '3. Your Duty of Fair Presentation' },
    { id: 'contributions-payment', title: '4. Contributions, Fees & Renewals' },
    { id: 'surplus-policy', title: '5. Mutual Surplus Sharing Policy' },
    { id: 'qard-hasan', title: '6. Qard Hasan (Deficit Protection)' },
    { id: 'cooling-off', title: '7. 14-Day Cooling-Off & Cancellation' },
    { id: 'claims-settlement', title: '8. Claims Standards & Settlement' },
    { id: 'dispute-resolution', title: '9. Dispute Resolution & Shariah Panel' },
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
              text="Contractual & Shariah Agreement"
              dark
              dot
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Terms & <span className="text-[#00c685]">Conditions</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Governing your participation in our mutual protection pool, contribution structures,
            surplus distribution, and legal rights under UK financial regulations and Shariah principles.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#00c685]" />
              <span>English Law & Shariah Oversight</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00c685]" />
              <span>FSCS Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00c685]" />
              <span>Version 3.2 — September 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Table of Contents */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0b1c16]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Navigation
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
                <Link
                  href="/clauses"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00c685]/10 hover:bg-[#00c685]/20 border border-[#00c685]/30 text-sm font-semibold text-[#00c685] transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View All Specific Clauses
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. Regulatory Basis */}
            <section id="regulatory-basis" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">1. Regulatory Basis & Definition of Terms</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  These Terms and Conditions (&quot;Terms&quot;) govern the relationship between Takaful UK Ltd (&quot;the Operator&quot;)
                  and you as the policyholder (&quot;Participant&quot;). Takaful UK Ltd is authorised and regulated by the Financial
                  Conduct Authority (FCA) and complies with the Insurance Act 2015 and Consumer Duty regulations.
                </p>
                <div className="p-4 rounded-xl bg-[#0b1c16] border border-white/5 space-y-2 text-sm">
                  <p><strong className="text-white">Participant:</strong> Any homeowner or tenant who enters into a Takaful agreement and contributes to the mutual pool.</p>
                  <p><strong className="text-white">Tabarru&apos; (Donation):</strong> The portion of your contribution irrevocably gifted to the mutual fund to indemnify fellow members in need.</p>
                  <p><strong className="text-white">Wakala (Agency):</strong> An Islamic contractual arrangement appointing Takaful UK to administer underwriting, claims, and treasury operations.</p>
                </div>
              </div>
            </section>

            {/* 2. The Takaful Model */}
            <section id="takaful-structure" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Building className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">2. The Takaful Model (Wakala & Tabarru&apos;)</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Takaful is not conventional insurance. In conventional insurance, risk is transferred to a commercial insurer who pockets
                  unspent premiums as corporate profit. In Takaful, risk is <em>shared</em> among participants (Ta&apos;awun):
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li><strong className="text-white">Segregated Funds:</strong> The Participant Takaful Fund (PTF) is legally and financially ring-fenced from the Operator&apos;s operational capital (Shareholders&apos; Fund).</li>
                  <li><strong className="text-white">Zero Riba (Interest):</strong> Fund reserves are deposited only in non-interest-bearing UK accounts or ethical Sukuk instruments approved by our Shariah Board.</li>
                  <li><strong className="text-white">Wakala Fee:</strong> The Operator charges a fixed, fully disclosed operational agency fee (typically 18%-22%) to cover staff, platform engineering, and administration.</li>
                </ul>
              </div>
            </section>

            {/* 3. Duty of Fair Presentation */}
            <section id="policyholder-duties" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">3. Your Duty of Fair Presentation & Utmost Good Faith</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Under both the UK Consumer Insurance (Disclosure and Representations) Act 2012 and Islamic tenets of Amanah (trust),
                  you are legally obligated to provide true, complete, and accurate information during the quotation process.
                </p>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-sm flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-white">5-Year Claims Lookback Enforcement:</strong>
                    <p className="mt-1 text-xs text-amber-300/90 leading-relaxed">
                      You must declare all building and contents claims occurring within the preceding 5 years.
                      Deliberate omission or misrepresentation breaches mutual trust and may result in claims rejection,
                      retrospective adjustment of contributions, or cancellation of cover.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Contributions & Renewals */}
            <section id="contributions-payment" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <Coins className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">4. Contributions, Payment & Renewals</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Contributions may be paid annually in advance or via 12 equal monthly Direct Debit instalments.
                  In accordance with Shariah law, <strong className="text-white">no interest or APR financing charge</strong> is levied on monthly instalments.
                </p>
                <p>
                  We issue renewal invitations at least 21 days prior to your policy anniversary. If you pay by continuous Direct Debit,
                  your policy will renew automatically unless you notify us otherwise prior to the renewal date.
                </p>
              </div>
            </section>

            {/* 5. Mutual Surplus Policy */}
            <section id="surplus-policy" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">5. Mutual Surplus Sharing Policy</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  If total pool contributions exceed claims paid and prudential reserves at the end of the financial year,
                  the resulting underwriting surplus (Al-Fa&apos;id Al-Ta&apos;mini) belongs to the participants.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#0b1c16] rounded-xl border border-white/5">
                    <h4 className="font-semibold text-white mb-1">Qualifying Participants</h4>
                    <p className="text-xs text-gray-400">
                      Policyholders who maintained active coverage throughout the financial year and did not submit a claim during that period.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0b1c16] rounded-xl border border-white/5">
                    <h4 className="font-semibold text-white mb-1">Distribution Method</h4>
                    <p className="text-xs text-gray-400">
                      Options include a cash dividend rebate, rollover credit against your upcoming renewal, or charitable donation to vetted UK charities.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Qard Hasan */}
            <section id="qard-hasan" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">6. Qard Hasan (Deficit Protection Guarantee)</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  In the unforeseen event that claims exceed the Participant Takaful Fund in a catastrophic year,
                  the Operator is contractually and ethically obligated under Shariah law to provide an interest-free loan (Qard Hasan)
                  to settle all valid claims without delay.
                </p>
                <p className="text-sm text-gray-400">
                  This loan is recovered solely from future surpluses in the fund, ensuring participants are never asked to pay retrospective emergency levies.
                </p>
              </div>
            </section>

            {/* 7. Cooling-Off */}
            <section id="cooling-off" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">7. 14-Day Cooling-Off & Cancellation</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  You have a statutory right to cancel your policy within 14 days of receiving your schedule or the policy inception date,
                  whichever is later.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li><strong className="text-white">During 14-Day Cooling Off:</strong> Full refund of contributions provided no claims have been made.</li>
                  <li><strong className="text-white">After 14 Days:</strong> Cancellation can be requested anytime with 14 days written notice. You will receive a pro-rata refund of unexpired cover, subject to a modest £30 administration fee.</li>
                </ul>
              </div>
            </section>

            {/* 8. Claims Standards */}
            <section id="claims-settlement" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">8. Claims Standards & Settlement Basis</h2>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We aim to settle all legitimate claims equitably and rapidly. Buildings and contents claims are settled on a
                  <strong className="text-white"> &quot;New for Old&quot;</strong> reinstatement basis, repairing or replacing property without deduction for wear and tear,
                  provided the sum insured was adequate at the time of loss.
                </p>
              </div>
            </section>

            {/* 9. Dispute Resolution */}
            <section id="dispute-resolution" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#00c685]/10 border border-[#00c685]/20 flex items-center justify-center text-[#00c685]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">9. Dispute Resolution & Shariah Panel</h2>
              </div>
              <div className="bg-[#0b1c16] border border-white/10 rounded-2xl p-6 text-gray-300 space-y-4">
                <p>
                  If you are dissatisfied with our service or a claims decision, we maintain a two-tier dispute mechanism:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="font-semibold text-white">Tier 1: Financial Ombudsman Service (FOS)</p>
                    <p className="text-xs text-gray-400 mt-1">If our internal complaints team cannot resolve your dispute within 8 weeks, you may refer the matter free of charge to the Financial Ombudsman Service (Exchange Tower, London, E14 9SR).</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="font-semibold text-white">Tier 2: Independent Shariah Supervisory Board</p>
                    <p className="text-xs text-gray-400 mt-1">For disputes touching on ethical or Shariah rulings (e.g. fund investment or surplus allocation), policyholders may petition our independent Shariah Supervisory Board for binding arbitration.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <HoverFooter />
    </div>
  );
}
