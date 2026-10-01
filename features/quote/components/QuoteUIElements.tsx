"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Info,
  Minus,
  Plus,
  Check,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./QuotePortalSelect";
import { HighValueItem, ClaimRecord } from "../types/quote.types";
import { HIGH_VALUE_CATEGORIES, CLAIM_TYPES } from "../constants/quoteOptions";

export const ACCENT = "#00c685";
export const INPUT_CLS =
  "w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/[0.04] text-white placeholder:text-white/20 focus:outline-none focus:border-[#00c685]/40 transition-colors h-10 text-sm";
export const SELECT_CLS = "bg-white/[0.04] border-white/8 text-white h-10";
export const CONTENT_CLS = "bg-neutral-950 border-white/10 text-white z-[99999]";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#00c685]">{children}</p>
  );
}

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[10px] font-semibold uppercase tracking-wide block mb-1.5 text-white/40"
    >
      {children}
    </Label>
  );
}

export function TooltipIcon({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={13} className="text-[#00c685] cursor-pointer shrink-0" />
        </TooltipTrigger>
        <TooltipContent className="bg-neutral-900 border-neutral-800 text-white text-xs max-w-[220px]">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Divider() {
  return <div className="border-t border-white/5 my-1" />;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer"
      >
        <Minus size={12} />
      </button>
      <span className="text-white text-sm font-semibold w-5 text-center tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all hover:border-[#00c685]/40 cursor-pointer"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

export function RoomRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="text-[#00c685]">
          <Icon size={14} />
        </span>
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      <Stepper value={value} onChange={onChange} />
    </div>
  );
}

export function CoverTypeCard({
  label,
  description,
  icon: Icon,
  selected,
  error,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  error?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer group ${
        selected
          ? "border-[#00c685]/50 bg-[#00c685]/10 shadow-[0_0_20px_rgba(0,198,133,0.08)]"
          : error
          ? "border-red-500/50 bg-red-500/5 hover:bg-red-500/10"
          : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            selected
              ? "bg-[#00c685]/20 text-[#00c685]"
              : error
              ? "bg-red-500/10 text-red-400"
              : "bg-white/5 text-gray-400 group-hover:text-gray-300"
          }`}
        >
          <Icon size={16} />
        </div>
        <div>
          <p
            className={`text-sm font-semibold leading-tight ${
              selected ? "text-white" : error ? "text-red-200" : "text-gray-300"
            }`}
          >
            {label}
          </p>
          <p
            className={`text-xs mt-0.5 leading-relaxed ${
              error && !selected ? "text-red-400/80" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </div>
        {selected && <Check size={14} className="text-[#00c685] ml-auto shrink-0 mt-1" />}
      </div>
    </button>
  );
}

export function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm text-gray-200 font-medium leading-snug">{label}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c685]/40 ${
          value ? "bg-[#00c685]" : "bg-white/10"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function RiderCard({
  icon: Icon,
  label,
  desc,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${
        selected
          ? "border-[#00c685]/50 bg-[#00c685]/10"
          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            selected ? "bg-[#00c685]/20 text-[#00c685]" : "bg-white/5 text-gray-400"
          }`}
        >
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${selected ? "text-white" : "text-gray-300"}`}>
            {label}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
        </div>
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
            selected ? "bg-[#00c685] border-[#00c685]" : "bg-transparent border-white/20"
          }`}
        >
          {selected && <Check size={10} className="text-[#0a1a14]" />}
        </div>
      </div>
    </button>
  );
}

export function YesNoButtons({
  value,
  onChange,
  error,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  error?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {([true, false] as const).map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
            value === v
              ? v
                ? "bg-[#00c685]/15 border-[#00c685]/50 text-[#00c685]"
                : "bg-white/10 border-white/20 text-white"
              : error
              ? "bg-red-500/5 border-red-500/50 text-red-200 hover:bg-red-500/10"
              : "bg-transparent border-white/8 text-gray-400 hover:border-white/20 hover:text-gray-200"
          }`}
        >
          {v ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

export function HighValueItemRow({
  item,
  index,
  onRemove,
  onChange,
}: {
  item: HighValueItem;
  index: number;
  onRemove: () => void;
  onChange: (u: HighValueItem) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#00c685]">
          Item {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Category</FieldLabel>
          <Select value={item.category} onValueChange={(v) => onChange({ ...item, category: v })}>
            <SelectTrigger className={SELECT_CLS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              {HIGH_VALUE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c.toLowerCase().replace(/ /g, "-")}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Estimated value</FieldLabel>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">
              £
            </span>
            <input
              value={item.value}
              onChange={(e) => onChange({ ...item, value: e.target.value })}
              placeholder="0"
              type="number"
              min="0"
              className="flex h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] pl-8 pr-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#00c685]/40 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <FieldLabel>Description</FieldLabel>
        <input
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          placeholder="e.g. Diamond engagement ring, 18ct gold"
          className="flex h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#00c685]/40 focus:outline-none transition-colors"
        />
      </div>
      <ToggleRow
        label="Does this item need away-from-home cover?"
        value={item.awayFromHome}
        onChange={(v) => onChange({ ...item, awayFromHome: v })}
      />
    </motion.div>
  );
}

export function ClaimRowItem({
  claim,
  index,
  onRemove,
  onChange,
}: {
  claim: ClaimRecord;
  index: number;
  onRemove: () => void;
  onChange: (u: ClaimRecord) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-400">
          Claim {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Type of incident</FieldLabel>
          <Select value={claim.type} onValueChange={(v) => onChange({ ...claim, type: v })}>
            <SelectTrigger className={SELECT_CLS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              {CLAIM_TYPES.map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Approximate month &amp; year</FieldLabel>
          <input
            value={claim.date}
            onChange={(e) => onChange({ ...claim, date: e.target.value })}
            type="month"
            className="flex h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:border-[#00c685]/40 focus:outline-none transition-colors [color-scheme:dark]"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <FieldLabel>Amount claimed (leave blank if unknown)</FieldLabel>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">
            £
          </span>
          <input
            value={claim.amountClaimed}
            onChange={(e) => onChange({ ...claim, amountClaimed: e.target.value })}
            placeholder="0"
            type="number"
            min="0"
            className="flex h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] pl-8 pr-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#00c685]/40 focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <FieldLabel>Brief description (optional)</FieldLabel>
        <input
          value={claim.description}
          onChange={(e) => onChange({ ...claim, description: e.target.value })}
          placeholder="e.g. Burst pipe in kitchen"
          className="flex h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#00c685]/40 focus:outline-none transition-colors"
        />
      </div>
    </motion.div>
  );
}

export function QuoteInput({
  className = "",
  type = "text",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-xl border ${
        error
          ? "border-red-500/50 placeholder:text-red-300/30 text-red-200"
          : "border-white/8 placeholder:text-white/20 focus:border-[#00c685]/40 text-white"
      } bg-white/[0.04] px-3.5 py-2.5 text-sm focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}
