"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

export interface ParticipantChipProps {
  name: string;
  participantId?: string;
  certificateId?: string;
  status?: string;
  size?: "sm" | "md";
  showId?: boolean;
  theme?: string;
  className?: string;
  asLink?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function ParticipantChip({
  name,
  participantId,
  certificateId,
  status,
  size = "md",
  showId = true,
  theme,
  className = "",
  asLink = true,
  onClick,
}: ParticipantChipProps) {
  const isLight = theme === "light";

  // Derive initials
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "P";

  // Derive status dot color
  let dotColor = "bg-emerald-500";
  const normStatus = (status || "").toLowerCase();
  if (normStatus === "review" || normStatus === "medium") {
    dotColor = "bg-amber-500";
  } else if (normStatus === "high" || normStatus === "failed" || normStatus === "suspended" || normStatus === "under investigation") {
    dotColor = "bg-rose-500";
  }

  // Target URL
  const targetId = participantId || "P-0098";
  const href = `/dashboard/participants/${targetId}`;

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 group/chip select-none ${className}`}
      onClick={(e) => {
        // Prevent triggering parent row clicks when clicking this chip
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
    >
      {/* Avatar Circle */}
      <div
        className={`relative shrink-0 rounded-full flex items-center justify-center font-bold transition-transform group-hover/chip:scale-105 ${
          size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
        } ${
          isLight
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
        }`}
      >
        <span>{initials}</span>
        {status && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0d2117] ${dotColor}`}
            title={`Status: ${status}`}
          />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col text-left">
        <span
          className={`font-semibold transition-colors group-hover/chip:text-[#00c685] ${
            size === "sm" ? "text-xs" : "text-[13px]"
          } ${isLight ? "text-gray-900" : "text-white"}`}
        >
          {name}
        </span>
        {showId && (
          <span
            className={`text-[10px] tracking-tight ${
              isLight ? "text-gray-500" : "text-white/40"
            }`}
          >
            {participantId ? `${participantId}` : "Participant"}
            {certificateId ? ` · ${certificateId}` : ""}
          </span>
        )}
      </div>
    </div>
  );

  if (asLink && participantId) {
    return (
      <Link
        href={href}
        className="inline-block transition-opacity hover:opacity-95"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default ParticipantChip;
