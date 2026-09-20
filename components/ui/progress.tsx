"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Standard Radix Progress ────────────────────────────────────────────── */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-[#0a2f20] bg-opacity-40",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[#00c685] transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

/* ─── Radial Vo2Max / Metric Progress Card ───────────────────────────────── */
export interface Vo2MaxCardProps {
  /** The main title of the card. */
  title: string;
  /** The primary numerical value to display. */
  value: number;
  /** A descriptive status text below the value (e.g., 'Excellent'). */
  status: string;
  /** A footer description. Can be a string or a ReactNode for rich text. */
  description: React.ReactNode;
  /** The progress percentage (0-100) for the radial bar. */
  progress: number;
  /** An icon component to display in the top-right corner. */
  icon: React.ReactNode;
  /** Optional className to merge with the default card styles. */
  className?: string;
  /** Unit suffix to show next to value (e.g. 'd' for days, '%' or '') */
  unit?: string;
  /** Whether to format value with 1 decimal place (e.g. 6.2) */
  decimals?: number;
  /** Dashboard theme: 'light' | 'dark' */
  theme?: string;
}

export const Vo2MaxCard: React.FC<Vo2MaxCardProps> = ({
  title,
  value,
  status,
  description,
  progress,
  icon,
  className,
  unit = "",
  decimals = 0,
  theme = "dark",
}) => {
  const isLight = theme === "light";
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString()
  );
  const progressValue = useMotionValue(0);

  React.useEffect(() => {
    // Animate the numerical value
    const valueAnimation = animate(count, value, {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    });

    // Animate the progress bar
    const progressAnimation = animate(progressValue, Math.min(Math.max(progress, 0), 100), {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    });

    return () => {
      valueAnimation.stop();
      progressAnimation.stop();
    };
  }, [value, progress, count, progressValue]);

  // SVG circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(
    progressValue,
    (v) => circumference - (v / 100) * circumference
  );

  const borderStyle = isLight ? "1px solid #E4E7EC" : "1px solid rgba(255,255,255,0.06)";
  const bgStyle = isLight ? "#ffffff" : "#0d2117";

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-4 rounded-2xl p-6 shadow-sm overflow-hidden transition-colors duration-200 font-body",
        className
      )}
      style={{
        background: bgStyle,
        border: borderStyle,
      }}
    >
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-[#00c685]/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <h3 className={`text-base font-semibold ${isLight ? "text-black/85" : "text-white/90"}`}>
          {title}
        </h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00c685]/15 text-[#00c685]">
          {icon}
        </div>
      </div>

      {/* Radial Progress and Value */}
      <div className="relative flex h-52 w-full items-center justify-center z-10">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="-rotate-90"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="transparent"
            stroke={isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}
            strokeDasharray="8 12" // Creates the segmented look
            strokeLinecap="round"
          />
          {/* Foreground progress */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="transparent"
            stroke="#00c685"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
            style={{ strokeDashoffset }}
          />
        </svg>

        {/* Central Text Content */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <motion.span
              className={`text-5xl font-bold tracking-tight tabular-nums ${
                isLight ? "text-black/90" : "text-white"
              }`}
            >
              {rounded}
            </motion.span>
            {unit && (
              <span className={`text-2xl font-bold ml-0.5 ${isLight ? "text-black/60" : "text-white/60"}`}>
                {unit}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-[#00c685] mt-0.5">{status}</p>
        </div>
      </div>

      {/* Footer Description */}
      <div className={`text-center text-xs leading-relaxed relative z-10 ${isLight ? "text-black/55" : "text-white/50"}`}>
        {description}
      </div>
    </div>
  );
};

export const HandlingTimeCard = Vo2MaxCard;
export { Progress };
export default Vo2MaxCard;
