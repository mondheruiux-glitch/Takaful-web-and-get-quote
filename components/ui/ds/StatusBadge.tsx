"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export interface StatusBadgeProps {
  status: string;
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md";
  theme?: string;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = "sm",
  theme,
  className = "",
}: StatusBadgeProps) {
  const isLight = theme === "light";
  const displayLabel = label ?? status;

  // Normalized matching
  const norm = (status || "").toLowerCase().trim();

  let badgeStyle = isLight
    ? "bg-gray-100 text-gray-700 border-gray-200"
    : "bg-white/5 text-white/70 border-white/10";
  let dotColor = "bg-gray-400";

  if (
    norm === "active" ||
    norm === "approved" ||
    norm === "completed" ||
    norm === "reconciled" ||
    norm === "verified" ||
    norm === "collected" ||
    norm === "paid" ||
    norm === "low"
  ) {
    badgeStyle = isLight
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    dotColor = "bg-emerald-500";
  } else if (
    norm === "under review" ||
    norm === "review" ||
    norm === "expiring" ||
    norm === "medium" ||
    norm === "warning issued"
  ) {
    badgeStyle = isLight
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-amber-500/15 text-amber-300 border-amber-500/20";
    dotColor = "bg-amber-500";
  } else if (
    norm === "pending" ||
    norm === "submitted" ||
    norm === "awaiting information"
  ) {
    badgeStyle = isLight
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-blue-500/15 text-blue-400 border-blue-500/20";
    dotColor = "bg-blue-500";
  } else if (norm === "retried" || norm === "high") {
    badgeStyle = isLight
      ? "bg-orange-50 text-orange-700 border-orange-200"
      : "bg-orange-500/15 text-orange-400 border-orange-500/20";
    dotColor = "bg-orange-500";
  } else if (
    norm === "failed" ||
    norm === "rejected" ||
    norm === "suspended" ||
    norm === "cancelled" ||
    norm === "frozen" ||
    norm === "under investigation" ||
    norm === "critical"
  ) {
    badgeStyle = isLight
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-rose-500/15 text-rose-400 border-rose-500/20";
    dotColor = "bg-rose-500";
  }

  const sizeClass =
    size === "sm"
      ? "text-[11px] px-2.5 py-0.5"
      : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border select-none ${sizeClass} ${badgeStyle} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}

export function VerifiedBadge({
  isLight = false,
  className = "",
}: {
  isLight?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border select-none ${
        isLight
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      } ${className}`}
    >
      <ShieldCheck size={12} className="shrink-0 text-emerald-500" />
      <span>Verified</span>
    </span>
  );
}

export default StatusBadge;
