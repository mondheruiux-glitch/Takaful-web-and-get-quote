'use client';

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- TYPE DEFINITIONS for props ---
export type StatusChange = {
  from: string;
  to: string;
};

export type TimelineSubItem = {
  icon: React.ReactNode;
  text: string;
};

export type TimelineItemProps = {
  icon: React.ReactNode;
  title: string;
  details?: string;
  statusChange?: StatusChange;
  subItems?: TimelineSubItem[];
  isLast?: boolean;
};

export type OrderStatusCardProps = {
  title: string;
  description: string;
  timelineItems: Omit<TimelineItemProps, "isLast">[];
  onClose?: () => void;
  onContinue: () => void;
  continueText?: string;
  className?: string;
};

// --- SUB-COMPONENTS for cleaner structure ---
const TimelineItem: React.FC<TimelineItemProps> = ({
  icon,
  title,
  details,
  statusChange,
  subItems,
  isLast = false,
}) => (
  <div className="relative flex items-start">
    {/* Dotted line connecting timeline items */}
    {!isLast && (
      <div
        className="absolute left-[14px] top-[34px] h-[calc(100%-10px)] w-px border-l-2 border-dashed border-white/15"
        aria-hidden="true"
      />
    )}

    {/* Icon */}
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a1a14] ring-4 ring-[#0a1a14] shrink-0 z-10">
      {icon}
    </div>

    {/* Content */}
    <div className="ml-4 flex-1">
      <p className="font-semibold text-foreground text-sm sm:text-base leading-snug">{title}</p>
      {details && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{details}</p>}

      {/* Status Change Indicator */}
      {statusChange && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-[#00c685]/10 border border-[#00c685]/20 px-2.5 py-1 text-xs font-semibold text-[#00c685]">
          <span>{statusChange.from}</span>
          <ArrowRight className="h-3 w-3" />
          <span>{statusChange.to}</span>
        </div>
      )}

      {/* Sub-items list */}
      {subItems && (
        <ul className="mt-2.5 space-y-1.5">
          {subItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  title,
  description,
  timelineItems,
  onClose,
  onContinue,
  continueText = "Continue",
  className,
}) => {
  // Animation variants for Framer Motion
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <Card
      as={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a1a14] text-white shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(0,198,133,0.06)] relative z-10",
        className
      )}
    >
      {/* Card Header */}
      <CardHeader className="p-6 pb-5 border-b border-white/[0.06]">
        <motion.div variants={itemVariants} className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
            <p className="text-xs sm:text-sm text-white/50">{description}</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </CardHeader>

      {/* Card Content with Timeline */}
      <CardContent className="px-6 py-6">
        <div className="space-y-6">
          {timelineItems.map((item, index) => (
            <motion.div variants={itemVariants} key={index}>
              <TimelineItem {...item} isLast={index === timelineItems.length - 1} />
            </motion.div>
          ))}
        </div>
      </CardContent>

      {/* Card Footer */}
      <motion.div variants={itemVariants} className="bg-white/[0.02] p-6 pt-5 border-t border-white/[0.06]">
        <Button
          onClick={onContinue}
          className="w-full bg-[#00c685] hover:bg-[#00b076] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#00c685]/20 hover:scale-[1.01] active:scale-[0.99]"
          size="lg"
        >
          {continueText}
        </Button>
      </motion.div>
    </Card>
  );
};
