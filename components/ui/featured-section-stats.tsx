'use client';

import React from "react";
import { motion } from "framer-motion";
import { Boxes } from "@/components/ui/background-boxes";
import { PillBadge } from "@/components/ui/pill-badge";
import DotCard from "@/components/ui/moving-dot-card";

// ── Stats data ────────────────────────────────────────────────────────────────
const stats = [
  { target: 19, suffix: " Billion", label: "Muslims Worldwide" },
  { target: 2, prefix: "$", suffix: "+ Trillion", label: "Islamic Finance Market" },
  { textValue: "Millions", label: "Seeking Ethical Alternatives" },
  { target: 24, prefix: "$", suffix: "M", label: "Shared Surplus" },
];

// ── Main section ──────────────────────────────────────────────────────────────
export default function FeaturedSectionStats() {
  return (
    <section className="w-full bg-[#0a1a14] text-white py-24 relative overflow-hidden">
      {/* Radial fade mask — pointer-events-none so boxes underneath still get hover */}
      <div className="absolute inset-0 w-full h-full bg-[#0a1a14] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Animated boxes — z-10, receives all mouse hover events */}
      <Boxes />

      {/* Content — pointer-events-none on wrapper so hover passes through to boxes */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-30 pointer-events-none">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-8"
        >
          <PillBadge text="Community Growth" dark />
        </motion.div>

        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-2xl sm:text-3xl lg:text-4xl font-normal font-heading text-white leading-tight mb-4 max-w-3xl animate-fade-in"
        >
          Powering communities with real-time transparency.{" "}
          <span className="text-gray-400 text-xl sm:text-2xl lg:text-3xl font-medium">
            Our live dashboard helps you track pool growth, manage contributions,
            and make data-driven decisions instantly.
          </span>
        </motion.h3>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pointer-events-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <DotCard
                target={stat.target}
                prefix={stat.prefix}
                suffix={stat.suffix}
                textValue={stat.textValue}
                label={stat.label}
                duration={3500}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
