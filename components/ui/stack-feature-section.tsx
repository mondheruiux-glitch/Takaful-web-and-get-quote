"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Droplets,
  Wind,
  Hammer,
  Monitor,
  Sofa,
  Utensils,
  ShieldCheck,
  Home,
  HeartHandshake,
  Lock,
  Zap,
  ChevronRight,
  Check,
} from "lucide-react";

const GREEN = "#00c685";
const GREEN_DARK = "#00a871";

const coverageIcons = [
  { Icon: Flame,         label: "Fire",         color: "#EF4444" },
  { Icon: Droplets,      label: "Water",        color: "#3B82F6" },
  { Icon: Wind,          label: "Storm",        color: "#8B5CF6" },
  { Icon: Hammer,        label: "Structural",   color: "#F59E0B" },
  { Icon: Monitor,       label: "Electronics",  color: "#06B6D4" },
  { Icon: Sofa,          label: "Furniture",    color: "#10B981" },
  { Icon: Utensils,      label: "Kitchen",      color: "#F97316" },
  { Icon: ShieldCheck,   label: "Liability",    color: GREEN },
  { Icon: Home,          label: "Buildings",    color: "#6366F1" },
  { Icon: HeartHandshake,label: "Community",    color: "#EC4899" },
  { Icon: Lock,          label: "Security",     color: "#64748B" },
  { Icon: Zap,           label: "Emergency",    color: "#EAB308" },
];

const orbitCount = 3;
const orbitGap = 7; // rem between orbits
const iconsPerOrbit = Math.ceil(coverageIcons.length / orbitCount);

export default function StackFeatureSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 min-h-[30rem]">

        {/* ── Left: heading & CTA ── */}
        <div className="w-full md:w-1/2 z-10 flex flex-col items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200/80 bg-gray-50/50 text-gray-800 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-300 hover:bg-gray-50/80 mb-6 transition-all">
            <span className="font-bold" style={{ color: GREEN }}>✨</span>
            <span>What&apos;s Covered</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-normal font-playfair italic text-gray-900 mb-4 leading-[1.1] tracking-[-0.02em]">
            Complete home<br />protection
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
            Every part of your home — buildings, contents, electronics, and more — protected by your community&apos;s shared fund.
          </p>

          {/* Checklist */}
          <div className="space-y-3 mb-8">
            {[
              "12 categories of coverage included",
              "Claims assessed in under 48 hours",
              "Sharia-certified community fund",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${GREEN}20` }}
                >
                  <Check size={11} style={{ color: GREEN }} strokeWidth={3} />
                </div>
                <p className="text-gray-600 text-[0.9375rem]">{item}</p>
              </div>
            ))}
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg"
            style={{ background: GREEN, boxShadow: `0 8px 24px ${GREEN}40` }}
          >
            Get My Quote <ChevronRight size={15} />
          </Link>
        </div>

        {/* ── Right: Orbit animation ── */}
        <div className="relative w-full md:w-1/2 h-[30rem] flex items-center justify-center overflow-hidden">
          {/* The orbit system — translated right so it's cropped nicely */}
          <div className="relative w-[42rem] h-[42rem] flex items-center justify-center translate-x-[20%]">

            {/* Centre: Takaful logo — floating, no wrapper */}
            <img
              src="/logo-dark.png"
              alt="Takaful"
              className="absolute z-20 h-7 w-auto"
            />

            {/* Orbits */}
            {[...Array(orbitCount)].map((_, orbitIdx) => {
              const sizePx = 160 + (orbitGap * 16) * (orbitIdx + 1); // convert rem→px equivalent
              const sizeRem = `${10 + orbitGap * (orbitIdx + 1)}rem`;
              const duration = 18 + orbitIdx * 8;
              const orbIcons = coverageIcons.slice(
                orbitIdx * iconsPerOrbit,
                orbitIdx * iconsPerOrbit + iconsPerOrbit,
              );
              const angleStep = (2 * Math.PI) / orbIcons.length;

              return (
                <div
                  key={orbitIdx}
                  className="absolute rounded-full border-2 border-dashed border-gray-300 pointer-events-none"
                  style={{
                    width: sizeRem,
                    height: sizeRem,
                    animation: `orbit-spin ${duration}s linear infinite`,
                  }}
                >
                  {orbIcons.map((cfg, iconIdx) => {
                    const globalIdx = orbitIdx * iconsPerOrbit + iconIdx;
                    const angle = iconIdx * angleStep;
                    const xPct = 50 + 50 * Math.cos(angle);
                    const yPct = 50 + 50 * Math.sin(angle);
                    const isHov = hovered === globalIdx;
                    const { Icon } = cfg;

                    return (
                      <div
                        key={iconIdx}
                        className="absolute transition-transform duration-300 pointer-events-auto"
                        style={{
                          left: `${xPct}%`,
                          top: `${yPct}%`,
                          transform: "translate(-50%, -50%)",
                          /* counter-rotate so icons stay upright */
                          animation: `orbit-counter ${duration}s linear infinite`,
                        }}
                        onMouseEnter={() => setHovered(globalIdx)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300"
                          style={{
                            background: isHov
                              ? cfg.color
                              : `color-mix(in srgb, ${cfg.color} 10%, white)`,
                            boxShadow: isHov ? `0 8px 24px ${cfg.color}60` : undefined,
                            transform: isHov ? "scale(1.25)" : "scale(1)",
                          }}
                        >
                          <Icon
                            size={18}
                            style={{ color: isHov ? "white" : cfg.color }}
                          />
                        </div>
                        <p
                          className="text-center mt-1 font-semibold leading-tight"
                          style={{
                            fontSize: "11px",
                            color: isHov ? cfg.color : "#6b7280",
                            maxWidth: "60px",
                          }}
                        >
                          {cfg.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Right-side fade mask so orbit clips neatly */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-counter {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </section>
  );
}
