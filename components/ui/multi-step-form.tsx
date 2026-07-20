'use client';

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, ArrowLeft, HeartHandshake } from "lucide-react";

const multiStepFormVariants = cva(
  "flex flex-col w-full rounded-2xl border border-white/8 bg-[#0a1a14]/70 backdrop-blur-md shadow-2xl overflow-hidden text-white",
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
  currentStep:    number;
  totalSteps:     number;
  title:          string;
  description:    string;
  onBack:         () => void;
  onNext:         () => void;
  onClose?:       () => void;
  backButtonText?: string;
  nextButtonText?: string;
  footerContent?: React.ReactNode;
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
      children,
      ...props
    },
    ref
  ) => {
    const progress = Math.round((currentStep / totalSteps) * 100);

    const variants = {
      hidden: { opacity: 0, x: 32 },
      enter:  { opacity: 1, x: 0  },
      exit:   { opacity: 0, x: -32 },
    };

    return (
      <div ref={ref} className={cn(multiStepFormVariants({ size }), className)} {...props}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-6 md:px-8 pt-7 pb-5 border-b border-white/5 space-y-3">
          {/* Step badge + close */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">
              Step {currentStep} of {totalSteps}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Title + description */}
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">{title}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-1.5 bg-white/10" />
            <span className="text-[11px] text-[#00c685] font-semibold whitespace-nowrap tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* ── Scrollable step content ─────────────────────────── */}
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

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-t border-white/5 bg-[#0a1a14]/50">
          <div className="text-xs text-gray-500">
            {footerContent}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center shrink-0"
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
