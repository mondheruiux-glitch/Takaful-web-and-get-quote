"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface SelectCtx {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerText: string;
  setTriggerText: React.Dispatch<React.SetStateAction<string>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export const SelectContext = React.createContext<SelectCtx | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [triggerText, setTriggerText] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !selectRef.current?.contains(e.target as Node) &&
        !contentRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        triggerText,
        setTriggerText,
        triggerRef,
        contentRef,
      }}
    >
      <div className="relative w-full" ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  id,
  className = "",
  children,
  error,
}: {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  error?: boolean;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;

  return (
    <button
      ref={ctx.triggerRef}
      id={id}
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border ${
        error
          ? "border-red-500/50 text-red-200"
          : "border-white/8 text-white hover:border-white/15 focus:border-[#00c685]/40"
      } bg-white/[0.04] px-3.5 py-2.5 text-start text-sm focus:outline-none transition-colors ${className}`}
    >
      <span className="truncate">
        {ctx.triggerText || <span className="text-white/30">Select…</span>}
      </span>
      <ChevronDown
        size={14}
        className={`shrink-0 text-white/40 transition-transform duration-200 ${
          ctx.open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return null;
}

export function SelectContent({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (ctx.open && ctx.triggerRef.current) {
      setRect(ctx.triggerRef.current.getBoundingClientRect());
    }
  }, [ctx.open, ctx.triggerRef]);

  if (!ctx.open || !rect || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={ctx.contentRef}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.12 }}
        style={{
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
        }}
        className={`max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-neutral-950 p-1 shadow-2xl ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function SelectItem({
  value,
  icon,
  children,
}: {
  value: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;
  const isSelected = ctx.value === value;

  useEffect(() => {
    if (isSelected) ctx.setTriggerText(String(children));
  }, [isSelected, children, ctx]);

  return (
    <button
      type="button"
      onClick={() => {
        ctx.onValueChange(value);
        ctx.setTriggerText(String(children));
        ctx.setOpen(false);
      }}
      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5 ${
        isSelected
          ? "text-[#00c685] font-semibold bg-[#00c685]/10"
          : "text-gray-300"
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {isSelected && <Check size={12} className="text-[#00c685] shrink-0" />}
    </button>
  );
}
