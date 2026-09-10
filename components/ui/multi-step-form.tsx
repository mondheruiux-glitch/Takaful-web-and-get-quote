'use client';

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, ArrowLeft } from "lucide-react";

const multiStepFormVariants = cva(
  "flex flex-col w-full rounded-2xl shadow-2xl overflow-hidden",
  {
    variants: {
      size: {
        default: "md:w-[700px]",
        sm:      "md:w-[550px]",
        lg:      "md:w-[850px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface MultiStepFormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multiStepFormVariants> {
  currentStep:     number;
  totalSteps:      number;
  title:           string;
  description:     string;
  onBack:          () => void;
  onNext:          () => void;
  onClose?:        () => void;
  backButtonText?: string;
  nextButtonText?: string;
  footerContent?:  React.ReactNode;
  /** 'light' | 'dark' — defaults to 'dark' for backward compatibility */
  theme?:          'light' | 'dark';
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  (
    {
      className,
      size,
      currentStep,
      totalSteps,
      title,
      description,
      onBack,
      onNext,
      onClose,
      backButtonText  = "Back",
      nextButtonText  = "Continue",
      footerContent,
      theme = "dark",
      children,
      ...props
    },
    ref
  ) => {
    const isLight = theme === "light";
    const progress = Math.round((currentStep / totalSteps) * 100);

    const variants = {
      hidden: { opacity: 0, x: 32 },
      enter:  { opacity: 1, x: 0  },
      exit:   { opacity: 0, x: -32 },
    };

    /* ── theme tokens ─────────────────────────────────────────────── */
    const BG_CARD    = isLight ? "#ffffff"           : "rgba(10,26,20,0.70)";
    const BORDER     = isLight ? "rgba(0,0,0,0.07)"  : "rgba(255,255,255,0.08)";
    const BG_FOOTER  = isLight ? "rgba(0,0,0,0.02)"  : "rgba(10,26,20,0.50)";
    const TEXT_MAIN  = isLight ? "rgba(0,0,0,0.85)"  : "#ffffff";
    const TEXT_SUB   = isLight ? "rgba(0,0,0,0.45)"  : "#9ca3af";
    const TEXT_MUTED = isLight ? "rgba(0,0,0,0.35)"  : "#6b7280";
    const BTN_BACK   = isLight
      ? "border border-black/10 text-black/50 hover:border-black/20 hover:text-black/80 hover:bg-black/04"
      : "border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5";
    const PROGRESS_BG = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.10)";

    return (
      <div
        ref={ref}
        className={cn(multiStepFormVariants({ size }), className)}
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
          backdropFilter: isLight ? undefined : "blur(12px)",
          color: TEXT_MAIN,
        }}
        {...props}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="px-6 md:px-8 pt-7 pb-5 space-y-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "#00c685" }}>
              Step {currentStep} of {totalSteps}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ color: TEXT_MUTED }}
                onMouseEnter={e => (e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight leading-snug" style={{ color: TEXT_MAIN }}>{title}</h2>
            <p className="text-sm mt-0.5" style={{ color: TEXT_SUB }}>{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-1.5" style={{ background: PROGRESS_BG }} />
            <span className="text-[11px] font-semibold whitespace-nowrap tabular-nums" style={{ color: "#00c685" }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* ── Scrollable content ───────────────────────────────────── */}
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] overscroll-contain">
          <div className="px-6 md:px-8 py-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 md:px-8 py-4"
          style={{ borderTop: `1px solid ${BORDER}`, background: BG_FOOTER }}
        >
          <div className="text-xs" style={{ color: TEXT_MUTED }}>{footerContent}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${BTN_BACK}`}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold text-sm px-6 py-2.5 rounded-full transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00c685]/15"
            >
              {nextButtonText}
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

MultiStepForm.displayName = "MultiStepForm";

export { MultiStepForm };
