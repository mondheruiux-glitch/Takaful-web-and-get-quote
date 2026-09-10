"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, FileText, Home, Calculator, UserPlus, CreditCard } from 'lucide-react';
import { PillBadge } from '@/components/ui/pill-badge';

const features = [
  {
    step: "01",
    title: "Get an Instant Quote",
    subtitle: "Start with a free, no-obligation estimate",
    description: "Begin by requesting a Home Takaful quote. There's no need to create an account first. Simply click Get Quote to begin the process and receive a personalized estimate based on your home's characteristics.",
    imageUrl: "/home-how-it-works/step1.png?v=2",
    bgColor: "bg-[#EFF6FF] border border-[#2563EB]/10",
    textColor: "text-gray-600",
    titleColor: "text-gray-900",
    accentColor: "text-[#2563EB]",
    accentBg: "bg-[#2563EB]/10",
    icon: Calculator
  },
  {
    step: "02",
    title: "Tell Us About Your Home",
    subtitle: "Provide your property's essential details",
    description: "Answer a few simple questions about your home, including its location, property type, construction details, size, occupancy, and other relevant information. This allows us to accurately assess your property and calculate the most appropriate level of protection.",
    imageUrl: "/home-how-it-works/step2.png?v=2",
    bgColor: "bg-[#F5F3FF] border border-[#7C3AED]/10",
    textColor: "text-gray-600",
    titleColor: "text-gray-900",
    accentColor: "text-[#7C3AED]",
    accentBg: "bg-[#7C3AED]/10",
    icon: Home
  },
  {
    step: "03",
    title: "Review Your Personalized Quote",
    subtitle: "See your coverage and contribution instantly",
    description: "Based on the information you provide, we'll generate a personalized Home Takaful quote showing your recommended coverage, what's included in your protection plan, and your expected contribution amount. Everything is presented clearly, with no hidden fees.",
    imageUrl: "/home-how-it-works/step3.png?v=2",
    bgColor: "bg-[#FEFCE8] border border-[#CA8A04]/10",
    textColor: "text-gray-600",
    titleColor: "text-gray-900",
    accentColor: "text-[#CA8A04]",
    accentBg: "bg-[#CA8A04]/10",
    icon: FileText
  },
  {
    step: "04",
    title: "Create Your Account",
    subtitle: "Save your quote and continue your application",
    description: "Once you're satisfied with your quote, create your secure account to continue. Your account allows you to save your information, complete your application, access your policy documents, and manage your Home Takaful coverage whenever you need it.",
    imageUrl: "/home-how-it-works/step4.png?v=2",
    bgColor: "bg-[#ECFDF5] border border-[#065F46]/10",
    textColor: "text-gray-600",
    titleColor: "text-gray-900",
    accentColor: "text-[#065F46]",
    accentBg: "bg-[#065F46]/10",
    icon: UserPlus
  },
  {
    step: "05",
    title: "Complete Your Contribution",
    subtitle: "Secure your home with a safe online payment",
    description: "Confirm your selected Home Takaful plan and complete your contribution using our secure payment system. Every contribution is managed according to Sharia-compliant principles, ensuring transparency, fairness, and mutual cooperation.",
    imageUrl: "/home-how-it-works/step5.png?v=2",
    bgColor: "bg-[#FFF7ED] border border-[#EA580C]/10",
    textColor: "text-gray-600",
    titleColor: "text-gray-900",
    accentColor: "text-[#EA580C]",
    accentBg: "bg-[#EA580C]/10",
    icon: CreditCard
  },
  {
    step: "06",
    title: "Receive Policy & Manage Claims",
    subtitle: "Instant protection with ongoing support",
    description: "As soon as your contribution is confirmed, your Home Takaful policy becomes active and your digital policy certificate is available immediately in your dashboard. You can submit a claim online and track its progress from one secure platform.",
    imageUrl: "/home-how-it-works/step6.png?v=2",
    bgColor: "bg-[#F0FDFA] border border-[#0F766E]/10",
    textColor: "text-gray-600",
    titleColor: "text-gray-900",
    accentColor: "text-[#0F766E]",
    accentBg: "bg-[#0F766E]/10",
    icon: ShieldCheck
  },
];

const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

const AnimatedHeader = () => {
  const [headerRef, headerInView] = useScrollAnimation();
  const [pRef, pInView] = useScrollAnimation();

  return (
    <div className="text-center max-w-3xl mx-auto mb-16 px-5">
      <PillBadge text="How It Works" className="mb-5" />
      <h2
        ref={headerRef}
        className={`text-[clamp(2rem,1.2rem+3vw,3rem)] font-normal font-heading transition-all duration-700 ease-out text-gray-900 tracking-[-0.03em] leading-[1.1] ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        Get protected in six simple steps
      </h2>
      <p
        ref={pRef}
        className={`text-[clamp(1rem,0.9rem+0.3vw,1.125rem)] text-gray-500 leading-[1.65] mt-4 transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        Getting Home Takaful coverage is quick, transparent, and fully digital. Start by receiving an instant quote based on your property's details, then create your account only when you're ready to continue.
      </p>
    </div>
  );
};

export function StickyFeatureSection() {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="px-[5%]">
        <div className="max-w-6xl mx-auto">
          <section className="py-24 md:py-32 flex flex-col items-center">
            
            <AnimatedHeader />

            <div className="w-full relative">
              {features.map((feature, index) => {
                const isReversed = index % 2 === 1;
                return (
                  <div
                    key={index}
                    className={`${feature.bgColor} grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 p-8 md:p-12 rounded-[2rem] mb-16 sticky shadow-2xl transition-all duration-500`}
                    style={{ top: '120px' }}
                  >
                    {/* Text block — goes RIGHT on even steps via md:order-last */}
                    <div className={`flex flex-col justify-center ${isReversed ? 'md:order-last' : ''}`}>
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 text-xs font-bold tracking-widest rounded-full ${feature.accentBg} ${feature.accentColor} uppercase`}>
                          Step {feature.step}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                         <feature.icon className={`w-6 h-6 ${feature.accentColor}`} />
                         <h3 className={`text-[1.75rem] font-bold ${feature.titleColor} tracking-tight leading-tight`}>{feature.title}</h3>
                      </div>
                      
                      <p className={`text-sm font-semibold mb-4 opacity-90 ${feature.titleColor}`}>{feature.subtitle}</p>
                      <p className={`${feature.textColor} leading-relaxed text-sm`}>{feature.description}</p>
                    </div>
                    
                    {/* Image block — goes LEFT on even steps via md:order-first */}
                    <div className={`image-wrapper relative mt-6 md:mt-0 aspect-video md:aspect-[4/3] w-full h-full overflow-hidden rounded-2xl shadow-xl ${isReversed ? 'md:order-first' : ''}`}>
                      <img 
                        src={feature.imageUrl} 
                        alt={feature.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
