"use client";

import React, { useEffect, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextLoopProps {
  staticText?: string;
  rotatingTexts?: string[];
  className?: string;
  interval?: number;
  transition?: Transition;
  staticTextClassName?: string;
  rotatingTextClassName?: string;
  backgroundClassName?: string;
  cursorClassName?: string;
  showCursor?: boolean;
}

export default function TextLoop({
  staticText,
  rotatingTexts = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 3200,
  transition = { duration: 0.8, ease: "easeInOut" },
  staticTextClassName,
  rotatingTextClassName,
  backgroundClassName,
  cursorClassName,
  showCursor = true,
}: TextLoopProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!rotatingTexts || rotatingTexts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [rotatingTexts, interval]);

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "flex flex-row items-center justify-start w-fit text-4xl md:text-7xl font-medium tracking-tight",
          className,
        )}
      >
        {staticText && (
          <span className={cn("mr-3 whitespace-nowrap", staticTextClassName)}>
            {staticText}
          </span>
        )}
        <div className="relative flex items-center">
          <AnimatePresence mode="wait">
            <m.div
              key={rotatingTexts[index]}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={transition}
              className="overflow-hidden whitespace-nowrap relative"
            >
              {/* Background gradient box */}
              {backgroundClassName !== "none" && (
                <div
                  className={cn(
                    "absolute inset-0 pointer-events-none",
                    backgroundClassName || "bg-[#00c685]/15 border border-[#00c685]/20 rounded-lg",
                  )}
                />
              )}

              <span
                className={cn(
                  "relative bg-clip-text text-transparent",
                  "bg-gradient-to-r from-violet-400 to-violet-800",
                  "dark:bg-gradient-to-r from-violet-400 to-violet-600 pr-1",
                  rotatingTextClassName,
                )}
              >
                {rotatingTexts[index]}
              </span>
            </m.div>
          </AnimatePresence>

          {/* Cursor Line */}
          {showCursor && (
            <m.div
              className={cn(
                "w-[3px] md:w-[4px] bg-violet-500 h-[1.10em] sm:h-[1em]",
                cursorClassName,
              )}
              animate={{ opacity: [1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          )}
        </div>
      </div>
    </LazyMotion>
  );
}

export { TextLoop };
