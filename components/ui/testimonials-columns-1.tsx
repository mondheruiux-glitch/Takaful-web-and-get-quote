'use client';

"use client";
import React from "react";
import { motion } from "framer-motion";
import { PillBadge } from "./pill-badge";

export const testimonials = [
  {
    text: "Switched our home coverage to Takaful and saved 20% compared to our old insurer. Plus, it's fully Sharia-compliant and feels like it belongs to us.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    name: "Sarah Jenkins",
    role: "Homeowner in London",
  },
  {
    text: "The digital onboarding was incredibly smooth. I got my certificate in under 5 minutes, and the transparency is refreshing.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    name: "Bilal Ahmed",
    role: "IT Consultant",
  },
  {
    text: "When our kitchen pipe burst, the claim payout was handled transparently and directly deposited within 48 hours. Exceptional service.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    name: "Amina Malik",
    role: "Property Owner",
  },
  {
    text: "Finally, a home protection model built on community and mutual aid rather than corporate profit. Every surplus goes back to members.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    name: "Omar Raza",
    role: "Tech Entrepreneur",
  },
  {
    text: "Super clean dashboard and extremely transparent rules. Highly recommend Takaful for ethical and reliable coverage.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "A breath of fresh air in insurance. Mutual risk sharing is how protection should be done. Highly recommended.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Customer service is top-notch. They walked me through the Sharia certs and contribution model clearly. Highly satisfied.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "The surplus sharing model is brilliant. It feels great to be part of a community pool where trust is the foundation.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    name: "Sana Sheikh",
    role: "Sales Director",
  },
  {
    text: "Excellent digital experience. No paperwork, no hidden costs. It's clean, ethical, and incredibly fast.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/50 max-w-xs w-full text-left" key={i}>
                  <div className="text-gray-600 text-sm leading-relaxed">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-900 text-[13px] tracking-tight leading-5">{name}</div>
                      <div className="text-[11px] text-gray-400 leading-5 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function Testimonials() {
  return (
    <section className="bg-gray-50/50 py-24 my-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 z-10 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <motion.div variants={itemVariants}>
            <PillBadge text="Testimonials" className="mb-4" />
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-normal font-heading text-gray-900 mb-4 tracking-[-0.02em] leading-[1.1]">
            What our users say
          </motion.h2>
          <motion.p variants={itemVariants} className="text-center mt-2 text-gray-500 max-w-sm">
            See how Takaful is changing the face of home protection for families across the UK.
          </motion.p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
}
