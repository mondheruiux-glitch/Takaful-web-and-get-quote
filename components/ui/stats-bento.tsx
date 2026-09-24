"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PrimaryStatData {
  tag?: string;
  value: string;
  description: string;
}

export interface SecondaryStatData {
  header?: string;
  sub?: string;
  tag?: string;
  value?: string;
  chartHeights?: number[];
}

export interface StatBoxData {
  header: string;
  sub: string;
  icon?: React.ReactNode;
}

export interface StatsBentoProps {
  className?: string;
  primaryStat?: PrimaryStatData;
  secondaryStat?: SecondaryStatData;
  // Switched positions:
  // leftStat is the bottom-left box (e.g. Shared Surplus)
  leftStat?: StatBoxData;
  // rightStat is the bottom-right box (e.g. Seeking Ethical Alternatives)
  rightStat?: StatBoxData;
  // Legacy / fallback props
  tertiaryStatB?: { header?: string; sub?: string; label?: string; value?: string; icon?: React.ReactNode };
  tertiaryStatC?: { header?: string; sub?: string; label?: string; value?: string; icon?: React.ReactNode };
  standalone?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export const StatsBento = ({
  className,
  primaryStat,
  secondaryStat,
  leftStat,
  rightStat,
  tertiaryStatB,
  tertiaryStatC,
  standalone = false,
}: StatsBentoProps = {}) => {
  // Primary stat
  const primary = primaryStat || {
    tag: "Muslims Worldwide",
    value: "1.9 Billion",
    description:
      "A rapidly growing global community seeking ethical, interest-free alternatives to conventional insurance.",
  };

  // Secondary stat: header on top, thick sub below
  const secHeader = secondaryStat?.header || secondaryStat?.tag || "Islamic Finance Market";
  const secSub = secondaryStat?.sub || secondaryStat?.value || "$2+ Trillion";
  const chartHeights = secondaryStat?.chartHeights || [18, 28, 42, 35, 60, 52, 78, 70, 88, 98, 110];

  // Switched bottom boxes:
  // Box 1 (Left): Shared Surplus ($2.4M)
  const leftHeader = leftStat?.header || tertiaryStatC?.header || tertiaryStatC?.label || "Shared Surplus";
  const leftSub = leftStat?.sub || tertiaryStatC?.sub || tertiaryStatC?.value || "$2.4M";
  const leftIcon = leftStat?.icon || tertiaryStatC?.icon || "$";

  // Box 2 (Right): Seeking Ethical Alternatives (Millions)
  const rightHeader = rightStat?.header || tertiaryStatB?.header || tertiaryStatB?.label || "Seeking Ethical Alternatives";
  const rightSub = rightStat?.sub || tertiaryStatB?.sub || tertiaryStatB?.value || "Millions";
  const rightIcon = rightStat?.icon || tertiaryStatB?.icon;

  const gridContent = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 max-w-7xl mx-auto w-full font-body"
    >
      {/* ── Primary Stat (Col 1-3, Row 1-2) ─────────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
        className="md:col-span-3 md:row-span-2 rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative border border-emerald-500/20 bg-gradient-to-br from-[#0c2419] via-[#091b13] to-[#06140e] shadow-xl hover:shadow-[0_12px_40px_rgba(0,198,133,0.14)] hover:border-emerald-500/40 transition-all duration-300 group"
      >
        {/* Subtle decorative radial glow in top corner */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />

        {/* Diagonal texture overlay with mask fade */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#00c685_0px_1px,transparent_1px_12px)] opacity-[0.14] [mask-image:radial-gradient(ellipse_80%_60%_at_100%_0%,#000_70%,transparent_110%)] [-webkit-mask-image:radial-gradient(ellipse_80%_60%_at_100%_0%,#000_70%,transparent_110%)] pointer-events-none" />

        <div className="relative z-10">
          {primary.tag && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 font-body">
                {primary.tag}
              </span>
            </div>
          )}
          <h3 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white font-body leading-none drop-shadow-sm">
            {primary.value}
          </h3>
        </div>

        <p className="text-gray-300 text-sm sm:text-base font-body leading-relaxed max-w-sm mt-8 relative z-10">
          {primary.description}
        </p>
      </motion.div>

      {/* ── Secondary Stat (Col 4-6, Row 1): Islamic Finance Market ─────────── */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
        className="md:col-span-3 rounded-3xl p-7 sm:p-8 border border-white/[0.08] bg-[#0c1813]/90 hover:bg-[#0f1f18] hover:border-emerald-500/35 hover:shadow-[0_8px_30px_rgba(0,198,133,0.12)] transition-all duration-300 backdrop-blur-md flex items-center justify-between gap-4 group relative overflow-hidden"
      >
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 font-body mb-2 truncate">
            {secHeader}
          </p>
          <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-white font-body leading-none">
            {secSub}
          </p>
        </div>

        {/* Animated Bar Chart */}
        <div className="flex gap-1.5 items-end h-10 sm:h-12 shrink-0 px-2 py-1 bg-black/20 rounded-xl border border-white/[0.04]">
          {chartHeights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0.3 }}
              whileInView={{ height: `${h}%`, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className="w-1.5 sm:w-2 bg-gradient-to-t from-emerald-500/40 via-emerald-400 to-emerald-300 rounded-full group-hover:from-emerald-400 group-hover:to-emerald-200 transition-colors duration-300"
            />
          ))}
        </div>
      </motion.div>

      {/* ── Bottom Left Box: Shared Surplus ($2.4M) [SWITCHED HERE] ────────── */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
        className="md:col-span-1 rounded-3xl p-6 sm:p-7 border border-white/[0.08] bg-[#0c1813]/90 hover:bg-[#0f1f18] hover:border-emerald-500/35 hover:shadow-[0_8px_30px_rgba(0,198,133,0.12)] transition-all duration-300 backdrop-blur-md flex flex-col justify-between group relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 font-body">
            {leftHeader}
          </p>
          {leftIcon && (
            <div className="size-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
              {leftIcon}
            </div>
          )}
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-body leading-none">
          {leftSub}
        </p>
      </motion.div>

      {/* ── Bottom Right Box: Seeking Ethical Alternatives (Millions) [SWITCHED HERE] ── */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
        className="md:col-span-2 rounded-3xl p-6 sm:p-7 border border-white/[0.08] bg-[#0c1813]/90 hover:bg-[#0f1f18] hover:border-emerald-500/35 hover:shadow-[0_8px_30px_rgba(0,198,133,0.12)] transition-all duration-300 backdrop-blur-md flex flex-col justify-between group relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 font-body">
            {rightHeader}
          </p>
          {rightIcon && (
            <div className="size-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
              {rightIcon}
            </div>
          )}
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-body leading-none">
          {rightSub}
        </p>
      </motion.div>
    </motion.div>
  );

  if (standalone) {
    return (
      <section className={cn("min-h-screen bg-[#0a1a14] text-white flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16", className)}>
        {gridContent}
      </section>
    );
  }

  return <div className={cn("w-full", className)}>{gridContent}</div>;
};

export default StatsBento;
