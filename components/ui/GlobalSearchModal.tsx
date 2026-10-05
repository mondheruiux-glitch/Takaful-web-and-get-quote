"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  FileText,
  CreditCard,
  ArrowLeftRight,
  Shield,
  X,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  PARTICIPANTS,
  CLAIMS,
  CONTRIBUTIONS,
  TRANSACTIONS,
  CERTIFICATES,
} from "@/lib/dashboard/mock-data";

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

interface SearchResult {
  id: string;
  type: "participant" | "claim" | "contribution" | "transaction" | "certificate";
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  theme,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const isLight = theme === "light";
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard shortcut ⌘K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter records across entities
  const results: SearchResult[] = [];
  const q = query.trim().toLowerCase();

  if (q.length > 0) {
    // 1. Participants
    PARTICIPANTS.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          type: "participant",
          title: p.name,
          subtitle: `Participant · ${p.id} · Member since ${p.memberSince}`,
          badge: p.status,
          href: `/dashboard/participants/${p.id}`,
        });
      }
    });

    // 2. Claims
    CLAIMS.forEach((cl) => {
      if (
        cl.id.toLowerCase().includes(q) ||
        cl.participantName.toLowerCase().includes(q) ||
        cl.type.toLowerCase().includes(q)
      ) {
        results.push({
          id: cl.id,
          type: "claim",
          title: `${cl.id} — ${cl.type}`,
          subtitle: `${cl.participantName} · £${cl.amountClaimed.toLocaleString()} · ${cl.status}`,
          badge: cl.status,
          href: `/dashboard/claims`,
        });
      }
    });

    // 3. Contributions
    CONTRIBUTIONS.forEach((cb) => {
      if (
        cb.id.toLowerCase().includes(q) ||
        cb.participantName.toLowerCase().includes(q) ||
        cb.certificateId.toLowerCase().includes(q)
      ) {
        results.push({
          id: cb.id,
          type: "contribution",
          title: `${cb.id} — £${cb.amount.toFixed(2)}`,
          subtitle: `${cb.participantName} · Policy ${cb.certificateId} · Due: ${cb.dueDate}`,
          badge: cb.status,
          href: `/dashboard/contributions`,
        });
      }
    });

    // 4. Transactions
    TRANSACTIONS.forEach((tx) => {
      if (
        tx.id.toLowerCase().includes(q) ||
        (tx.participantName && tx.participantName.toLowerCase().includes(q)) ||
        tx.reference.toLowerCase().includes(q)
      ) {
        results.push({
          id: tx.id,
          type: "transaction",
          title: `${tx.id} — £${tx.amount.toFixed(2)}`,
          subtitle: `${tx.participantName || "Pool movement"} · Ref: ${tx.reference} · ${tx.direction}`,
          badge: tx.status,
          href: `/dashboard/transactions`,
        });
      }
    });

    // 5. Certificates
    CERTIFICATES.forEach((cert) => {
      if (
        cert.id.toLowerCase().includes(q) ||
        (cert.participantId && cert.participantId.toLowerCase().includes(q))
      ) {
        results.push({
          id: cert.id,
          type: "certificate",
          title: `${cert.id} — ${cert.coverType} Cover`,
          subtitle: `${cert.propertyAddress} · Limit £${(cert.buildingsLimit || cert.contentsLimit || 0).toLocaleString()}`,
          badge: cert.status,
          href: `/dashboard/certificates`,
        });
      }
    });
  }

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].href);
    }
  };

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[800] flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.18 }}
        className={`relative z-10 w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
          isLight ? "bg-white border-gray-200" : "bg-[#0b1b13] border-white/10"
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3.5 border-b ${
            isLight ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-white/[0.02]"
          }`}
        >
          <Search size={18} className="text-[#00c685] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search participants, claims, contributions, policies (or try 'Maryam')..."
            className={`w-full bg-transparent text-sm focus:outline-none placeholder:text-gray-400 ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isLight
                  ? "bg-white border-gray-200 text-gray-500"
                  : "bg-white/5 border-white/10 text-white/40"
              }`}
            >
              ESC
            </span>
          )}
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            /* Quick Suggestions / Recents */
            <div className="p-3 space-y-3">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isLight ? "text-gray-400" : "text-white/35"
                }`}
              >
                Suggested Records
              </span>

              <div className="space-y-1">
                {[
                  {
                    type: "participant" as const,
                    title: "Maryam Patel",
                    subtitle: "Participant · P-0098 · Action Required (£18.90 due)",
                    badge: "Review",
                    href: "/dashboard/participants/P-0098",
                  },
                  {
                    type: "claim" as const,
                    title: "CLM-2024-0887 — Theft",
                    subtitle: "Maryam Patel · Stolen bicycle & shed damage (£650)",
                    badge: "Approved",
                    href: "/dashboard/claims",
                  },
                  {
                    type: "contribution" as const,
                    title: "CONT-2024-8808 — Failed Direct Debit",
                    subtitle: "Maryam Patel · £18.90 · 11 days remaining in grace period",
                    badge: "Failed",
                    href: "/dashboard/contributions",
                  },
                  {
                    type: "transaction" as const,
                    title: "TXN-8808 — Direct Debit Inflow",
                    subtitle: "Maryam Patel · £18.90 · Treasury audit match pending",
                    badge: "Failed",
                    href: "/dashboard/transactions",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer group ${
                      isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === "participant"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : item.type === "claim"
                            ? "bg-blue-500/15 text-blue-400"
                            : item.type === "contribution"
                            ? "bg-rose-500/15 text-rose-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {item.type === "participant" && <User size={15} />}
                        {item.type === "claim" && <FileText size={15} />}
                        {item.type === "contribution" && <CreditCard size={15} />}
                        {item.type === "transaction" && <ArrowLeftRight size={15} />}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold group-hover:text-[#00c685] transition-colors ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={`text-[11px] ${
                            isLight ? "text-gray-500" : "text-white/45"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-400 group-hover:text-[#00c685] transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Filtered Search Results */
            <div className="space-y-1">
              {results.map((res, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${res.type}-${res.id}-${idx}`}
                    onClick={() => handleSelect(res.href)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? isLight
                          ? "bg-emerald-50 text-emerald-900 border border-emerald-200/80"
                          : "bg-white/10 text-white border border-white/10"
                        : isLight
                        ? "hover:bg-gray-100"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          res.type === "participant"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : res.type === "claim"
                            ? "bg-blue-500/15 text-blue-400"
                            : res.type === "contribution"
                            ? "bg-rose-500/15 text-rose-400"
                            : res.type === "transaction"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-purple-500/15 text-purple-400"
                        }`}
                      >
                        {res.type === "participant" && <User size={15} />}
                        {res.type === "claim" && <FileText size={15} />}
                        {res.type === "contribution" && <CreditCard size={15} />}
                        {res.type === "transaction" && <ArrowLeftRight size={15} />}
                        {res.type === "certificate" && <Shield size={15} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-semibold ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {res.title}
                          </p>
                          {res.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                isLight
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-white/10 text-white/70"
                              }`}
                            >
                              {res.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[11px] ${
                            isLight ? "text-gray-500" : "text-white/45"
                          }`}
                        >
                          {res.subtitle}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        isLight ? "text-emerald-700" : "text-[#00c685]"
                      }`}
                    >
                      Open →
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* No Results */
            <div className="py-12 text-center">
              <Search size={24} className="mx-auto text-gray-400 mb-2" />
              <p
                className={`text-xs font-semibold ${
                  isLight ? "text-gray-700" : "text-white/80"
                }`}
              >
                No matches found for &ldquo;{query}&rdquo;
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                Try searching for a participant name, claim ID, or transaction reference.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className={`px-4 py-2.5 border-t flex items-center justify-between text-[11px] ${
            isLight
              ? "border-gray-200 bg-gray-50/80 text-gray-500"
              : "border-white/10 bg-white/[0.02] text-white/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span className="font-semibold text-[#00c685]">Takaful Global Search</span>
        </div>
      </motion.div>
    </div>
  );
}

export default GlobalSearchModal;
