"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Upload,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface Step {
  title: string;
  icon: LucideIcon | React.ElementType;
  content?: string;
  desc?: string;
}

const defaultSteps: Step[] = [
  { title: "Account", icon: User, content: "Account details are here" },
  { title: "Profile", icon: Settings, content: "Profile settings are here" },
  { title: "Upload", icon: Upload, content: "Upload your files here" },
  { title: "Done", icon: Home, content: "Everything is ready" },
];

export interface Stepper03Props {
  steps?: Step[];
  activeStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
  showContent?: boolean;
  showControls?: boolean;
  interactive?: boolean;
  variant?: 'card' | 'embedded';
  orientation?: 'horizontal' | 'vertical';
}

export default function Stepper03({
  steps = defaultSteps,
  activeStep: controlledStep,
  onStepChange,
  className,
  showContent = true,
  showControls = true,
  interactive = true,
  variant = 'card',
  orientation = 'horizontal',
}: Stepper03Props) {
  const [internalStep, setInternalStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = controlledStep !== undefined;
  const activeStep = isControlled ? controlledStep : internalStep;

  const progress = steps.length > 1 ? activeStep / (steps.length - 1) : 0;
  const offset = 100 / (2 * steps.length);
  const span = 100 - 2 * offset;

  const handleStepSelect = (index: number) => {
    if (!interactive) return;
    if (isControlled) {
      onStepChange?.(index);
    } else {
      setInternalStep(index);
      onStepChange?.(index);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const next = activeStep + 1;
      if (isControlled) {
        onStepChange?.(next);
      } else {
        setInternalStep(next);
        onStepChange?.(next);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const prev = activeStep - 1;
      if (isControlled) {
        onStepChange?.(prev);
      } else {
        setInternalStep(prev);
        onStepChange?.(prev);
      }
    }
  };

  /* ─── VERTICAL LAYOUT ─────────────────────────────────────── */
  if (orientation === 'vertical') {
    return (
      <div className={cn("w-full", className)}>
        <div className="relative flex flex-col">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.title} className="flex gap-4 relative">
                {/* Left column: bubble + connector */}
                <div className="flex flex-col items-center">
                  {/* Step bubble */}
                  <button
                    type="button"
                    onClick={() => handleStepSelect(index)}
                    disabled={!interactive}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${step.title} step`}
                    className={cn(
                      "group relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      interactive ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full transition-colors duration-300",
                        isCompleted || isActive
                          ? "bg-primary"
                          : "bg-muted group-hover:bg-muted/80"
                      )}
                    />
                    {isActive && !prefersReducedMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full ring-2 ring-primary/40"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: [1, 1.45, 1], opacity: [1, 0.2, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                      />
                    )}
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isCompleted ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className="flex items-center justify-center text-primary-foreground"
                          >
                            <Check className="size-4" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="icon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className="flex items-center justify-center"
                          >
                            <step.icon
                              className={cn(
                                "size-4",
                                isActive ? "text-primary-foreground" : "text-muted-foreground"
                              )}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </button>

                  {/* Vertical connector line */}
                  {!isLast && (
                    <div className="relative w-0.5 flex-1 my-1" style={{ minHeight: 28 }}>
                      {/* Track */}
                      <div className="absolute inset-0 bg-border rounded-full" />
                      {/* Fill */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 bg-primary rounded-full origin-top"
                        initial={false}
                        animate={{ scaleY: isCompleted ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      />
                    </div>
                  )}
                </div>

                {/* Right column: label + desc */}
                <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors duration-300 leading-[2.25rem]",
                      isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.desc && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── HORIZONTAL LAYOUT (original) ───────────────────────── */
  return (
    <div className={cn("mx-auto w-full", variant === "card" && "max-w-3xl", className)}>
      <div className={cn(
        variant === "card"
          ? "rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col gap-8 shadow-sm"
          : "w-full flex flex-col gap-4"
      )}>
        <div className="relative">
          {/* Inactive line track */}
          <div
            className="absolute top-5 h-0.5 bg-border"
            style={{ left: `${offset}%`, right: `${offset}%` }}
          />
          {/* Active animated progress line */}
          <motion.div
            className="absolute top-5 h-0.5 bg-primary origin-left"
            style={{ left: `${offset}%`, right: `${offset}%` }}
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          {/* Indicator dot on progress line */}
          <motion.span
            className="absolute size-2 rounded-full bg-primary"
            style={{ top: 21, x: "-50%", y: "-50%" }}
            initial={{ left: `${offset}%` }}
            animate={{ left: `${offset + progress * span}%` }}
            transition={{ type: "spring", stiffness: 160, damping: 24 }}
          />

          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <div
                  key={step.title}
                  className="flex flex-1 flex-col items-center gap-2 text-center"
                >
                  <button
                    type="button"
                    onClick={() => handleStepSelect(index)}
                    disabled={!interactive}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${step.title} step`}
                    className={cn(
                      "group relative z-10 flex size-10 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      interactive ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full transition-colors duration-300",
                        isCompleted || isActive
                          ? "bg-primary"
                          : "bg-muted group-hover:bg-muted/80"
                      )}
                    />
                    {isActive && !prefersReducedMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full ring-2 ring-primary/40"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{
                          scale: [1, 1.45, 1],
                          opacity: [1, 0.2, 1],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                      }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isCompleted ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 22,
                            }}
                            className="flex items-center justify-center text-primary-foreground"
                          >
                            <Check className="size-5" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="icon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 22,
                            }}
                            className="flex items-center justify-center"
                          >
                            <step.icon
                              className={cn(
                                "size-5",
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </button>

                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "text-xs font-medium transition-colors duration-300",
                        isActive || isCompleted
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                    {step.desc && (
                      <span className="hidden sm:block text-[10px] text-muted-foreground mt-0.5">
                        {step.desc}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showContent && (
          <div className="min-h-20 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <p className="text-lg font-semibold text-foreground">
                  {steps[activeStep]?.title} content
                </p>
                <p className="text-sm text-muted-foreground">
                  {steps[activeStep]?.content || steps[activeStep]?.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {showControls && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 0}
                className="cursor-pointer"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
              <p className="text-sm text-muted-foreground">
                Step {activeStep + 1} of {steps.length}
              </p>
              <Button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                className="cursor-pointer"
              >
                Continue
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
