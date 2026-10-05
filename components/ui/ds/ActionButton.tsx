"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export type ActionButtonVariant = "primary" | "secondary" | "amber" | "danger" | "ghost";
export type ActionButtonSize = "sm" | "md" | "lg";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  loading?: boolean;
  theme?: string;
}

import { useTheme } from "@/app/dashboard/ThemeRoleContext";

export function ActionButton({
  variant = "primary",
  size = "sm",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  theme,
  disabled,
  className = "",
  children,
  ...props
}: ActionButtonProps) {
  let detectedTheme = theme;
  try {
    const context = useTheme();
    if (!detectedTheme && context?.theme) {
      detectedTheme = context.theme;
    }
  } catch {
    // outside ThemeContext
  }
  const isLight = (detectedTheme ?? "light") === "light";

  const sizeStyles: Record<ActionButtonSize, string> = {
    sm: "text-[11px] px-2.5 py-1.5 rounded-lg gap-1.5 font-semibold",
    md: "text-xs px-3.5 py-2 rounded-xl gap-2 font-semibold",
    lg: "text-sm px-4 py-2.5 rounded-xl gap-2.5 font-semibold",
  };

  const iconSizes: Record<ActionButtonSize, number> = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles =
        "bg-[#00c685] hover:bg-[#00a871] text-white shadow-xs border border-[#00c685] active:scale-[0.98]";
      break;
    case "secondary":
      variantStyles = isLight
        ? "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-xs active:scale-[0.98]"
        : "bg-white/10 hover:bg-white/15 text-white border border-white/20 active:scale-[0.98]";
      break;
    case "amber":
      variantStyles = isLight
        ? "bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-400 font-semibold shadow-xs active:scale-[0.98]"
        : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold active:scale-[0.98]";
      break;
    case "danger":
      variantStyles = isLight
        ? "bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 font-semibold shadow-xs active:scale-[0.98]"
        : "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold active:scale-[0.98]";
      break;
    case "ghost":
      variantStyles = isLight
        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-transparent active:scale-[0.98]"
        : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent active:scale-[0.98]";
      break;
  }

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center transition-all cursor-pointer select-none ${sizeStyles[size]} ${variantStyles} ${
        isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      } ${className}`}
    >
      {loading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin shrink-0" />
      ) : Icon && iconPosition === "left" ? (
        <Icon size={iconSizes[size]} className="shrink-0" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" ? (
        <Icon size={iconSizes[size]} className="shrink-0" />
      ) : null}
    </button>
  );
}

export default ActionButton;
