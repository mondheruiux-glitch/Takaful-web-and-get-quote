"use client";

import { cn } from "@/lib/utils";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { X, Check } from "lucide-react";

const EMOJIS = [
  {
    id: "very-sad",
    label: "Terrible",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <path d="M9 9h.01" />
        <path d="M15 9h.01" />
        <path d="M9 13v2" stroke="#3b82f6" />
        <path d="M15 13v2" stroke="#3b82f6" />
      </svg>
    ),
  },
  {
    id: "sad",
    label: "Bad",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: "neutral",
    label: "Okay",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: "happy",
    label: "Amazing",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
        <path
          d="M9 9l.5 1.5l1.5 .5l-1.5 .5l-.5 1.5l-.5-1.5l-1.5-.5l1.5-.5z"
          fill="#f97316"
          stroke="none"
        />
        <path
          d="M15 9l.5 1.5l1.5 .5l-1.5 .5l-.5 1.5l-.5-1.5l-1.5-.5l1.5-.5z"
          fill="#f97316"
          stroke="none"
        />
      </svg>
    ),
  },
];

export interface FeedbackWidgetProps {
  onSubmit?: (data: { rating: string; feedback: string }) => void;
  onClose?: () => void;
  className?: string;
  /** Text shown in the collapsed state */
  label?: string;
  /** Placeholder for the textarea */
  placeholder?: string;
}

export function FeedbackWidget({
  onSubmit,
  onClose,
  className,
  label = "How was your claim experience?",
  placeholder = "Your feedback helps us protect the community better...",
}: FeedbackWidgetProps) {
  const [value, setValue] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState("");
  const [isPreview, setIsPreview] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const isExpanded = value !== "";
  const containerRef = React.useRef<HTMLDivElement>(null);

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
  } as const;

  const handleValueChange = (val: string) => {
    if (val === "" || val === value) {
      setValue("");
      setIsPreview(false);
    } else {
      setValue(val);
      // Auto-focus the textarea after expansion
      setTimeout(() => {
        containerRef.current?.querySelector("textarea")?.focus();
      }, 100);
    }
  };

  const handleSend = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ rating: value, feedback });
      setIsSubmitted(true);
      setTimeout(() => {
        setValue("");
        setFeedback("");
        setIsPreview(false);
        setIsSubmitted(false);
        onClose?.();
      }, 1600);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex items-center justify-center p-2", className)}>
      <motion.div
        ref={containerRef}
        layout
        transition={springTransition}
        initial={false}
        className={cn(
          "overflow-hidden border border-zinc-200 bg-white text-zinc-900 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-[#061510]/95 dark:text-white dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_24px_rgba(0,198,133,0.08)] backdrop-blur-xl",
          isExpanded ? "w-full max-w-[420px] rounded-[28px]" : "rounded-full",
        )}
      >
        <motion.div
          layout="position"
          className="px-4 py-2 md:px-5 md:py-2.5"
          transition={springTransition}
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 py-1 px-2 text-[#00c685]"
            >
              <div className="w-5 h-5 rounded-full bg-[#00c685]/20 flex items-center justify-center">
                <Check size={13} className="text-[#00c685]" strokeWidth={3} />
              </div>
              <span className="text-xs font-semibold">Thank you for your feedback!</span>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 sm:gap-6">
                <motion.span
                  layout="position"
                  transition={springTransition}
                  className="ml-1 cursor-default select-none whitespace-nowrap font-medium text-[13px] sm:text-[14px] text-zinc-600 dark:text-zinc-300"
                >
                  {label}
                </motion.span>

                <div className="flex items-center gap-1.5">
                  <ToggleGroup.Root
                    type="single"
                    value={value}
                    onValueChange={handleValueChange}
                    className="flex items-center gap-1 sm:gap-1.5"
                  >
                    {EMOJIS.map((emoji) => (
                      <ToggleGroup.Item key={emoji.id} value={emoji.id} asChild>
                        <button
                          type="button"
                          title={emoji.label}
                          className={cn(
                            "relative rounded-full p-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#00c685]",
                            value === emoji.id
                              ? "text-white"
                              : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-200",
                          )}
                        >
                          <motion.div
                            layout="position"
                            transition={springTransition}
                            className="relative z-10 flex h-5 w-5 scale-110 items-center justify-center transition-transform active:scale-90"
                          >
                            {emoji.icon}
                          </motion.div>
                          {value === emoji.id && (
                            <motion.div
                              layoutId="active-bg"
                              className="absolute inset-0 rounded-full bg-[#00c685]"
                              transition={springTransition}
                            />
                          )}
                        </button>
                      </ToggleGroup.Item>
                    ))}
                  </ToggleGroup.Root>

                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
                      title="Dismiss"
                      aria-label="Dismiss feedback"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                      scale: 0.98,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      scale: 0.98,
                      filter: "blur(4px)",
                      transition: {
                        height: { duration: 0.3, ease: [0.32, 0, 0.67, 0] },
                        opacity: { duration: 0.15 },
                        scale: { duration: 0.2 },
                        filter: { duration: 0.2 },
                      },
                    }}
                    transition={{
                      height: { ...springTransition, bounce: 0 },
                      opacity: { duration: 0.25 },
                      scale: { ...springTransition, damping: 25 },
                      filter: { duration: 0.3 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-1 pt-6 pb-2">
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="select-none font-bold text-[10px] text-zinc-500 uppercase tracking-[0.1em] dark:text-zinc-400">
                          {isPreview ? "Preview" : "Feedback"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsPreview(!isPreview)}
                          className="rounded-md bg-zinc-100 px-2 py-0.5 font-semibold text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
                        >
                          {isPreview ? "Edit" : "Preview"}
                        </button>
                      </div>

                      <div className="group/textarea relative">
                        <AnimatePresence mode="wait">
                          {isPreview ? (
                            <motion.div
                              key="preview"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="prose prose-sm scrollbar-none h-[140px] w-full max-w-none overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-[14px] text-zinc-700 leading-relaxed dark:prose-invert dark:border-white/5 dark:bg-zinc-900/50 dark:text-zinc-300"
                            >
                              <ReactMarkdown>
                                {feedback || "*Nothing to preview...*"}
                              </ReactMarkdown>
                            </motion.div>
                          ) : (
                            <motion.textarea
                              key="editor"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              autoFocus
                              placeholder={placeholder}
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              className="scrollbar-none h-[140px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-[14px] text-zinc-800 leading-relaxed transition-all placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none dark:border-white/10 dark:bg-[#040e0a] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-[#00c685]/40"
                            />
                          )}
                        </AnimatePresence>

                        {!isPreview && (
                          <div className="pointer-events-none absolute right-4 bottom-3 flex select-none items-center gap-1.5 opacity-40 transition-opacity group-focus-within/textarea:opacity-80">
                            <span className="font-bold text-[10px] text-zinc-400 tracking-tight dark:text-zinc-500">
                              M↓
                            </span>
                            <span className="font-bold text-[10px] text-zinc-400 tracking-tight dark:text-zinc-500">
                              supported
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ delay: 0.1, ...springTransition }}
                      className="mt-3 flex items-center justify-between border-zinc-200 border-t pt-4 dark:border-white/10"
                    >
                      <p className="font-medium text-[11px] text-zinc-500 dark:text-zinc-400">
                        We appreciate your input.
                      </p>
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!feedback.trim() || isSubmitting}
                        className="relative rounded-xl bg-zinc-900 px-6 py-2 font-bold text-[13px] text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:pointer-events-none disabled:opacity-30 disabled:grayscale dark:bg-[#00c685] dark:text-black dark:hover:bg-[#00b076] cursor-pointer"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black"
                          />
                        ) : (
                          "Send Feedback"
                        )}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
