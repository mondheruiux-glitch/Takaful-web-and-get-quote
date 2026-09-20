"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfToday, addDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { POOL } from "@/lib/dashboard/mock-data";

export interface TakafulPoolBarChartProps extends React.ComponentProps<"div"> {
  theme?: string;
  showLearnMore?: boolean;
}

export function TakafulPoolBarChart({
  className,
  theme = "dark",
  showLearnMore = true,
  ...props
}: TakafulPoolBarChartProps) {
  const isLight = theme === "light";
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("monthly");

  const today = startOfToday();
  const weeklyRange = {
    from: today,
    to: addDays(today, 7),
  };
  const monthlyRange = {
    from: startOfMonth(today),
    to: endOfMonth(today),
  };

  const period = selectedPeriod === "weekly" ? weeklyRange : monthlyRange;

  // Takaful pool allocations
  const weeklyPoolData = [
    {
      width: POOL.participantFundPct, // 78%
      color: "bg-[#00c685]",
      label: "Participant Fund",
      amount: `£${Math.round((POOL.balance * POOL.participantFundPct) / 100).toLocaleString()}`,
    },
    {
      width: POOL.claimsReservePct, // 14%
      color: "bg-[#f59e0b]",
      label: "Claims Reserve",
      amount: `£${Math.round((POOL.balance * POOL.claimsReservePct) / 100).toLocaleString()}`,
    },
    {
      width: POOL.wakalaFeePct, // 8%
      color: "bg-[#94a3b8]",
      label: "Wakāla Fee",
      amount: `£${Math.round((POOL.balance * POOL.wakalaFeePct) / 100).toLocaleString()}`,
    },
  ];

  const monthlyPoolData = [
    {
      width: 78,
      color: "bg-[#00c685]",
      label: "Participant Fund",
      amount: `£${Math.round((POOL.balance * 0.78)).toLocaleString()}`,
    },
    {
      width: 14,
      color: "bg-[#f59e0b]",
      label: "Claims Reserve",
      amount: `£${Math.round((POOL.balance * 0.14)).toLocaleString()}`,
    },
    {
      width: 8,
      color: "bg-[#94a3b8]",
      label: "Wakāla Fee",
      amount: `£${Math.round((POOL.balance * 0.08)).toLocaleString()}`,
    },
  ];

  const poolData = selectedPeriod === "weekly" ? weeklyPoolData : monthlyPoolData;
  const balanceDisplay = `£${POOL.balance.toLocaleString()}`;

  const borderStyle = isLight ? "1px solid #E4E7EC" : "1px solid rgba(255,255,255,0.06)";
  const bgStyle = isLight ? "#ffffff" : "#0d2117";

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-colors duration-200 flex flex-col gap-4 font-body",
        isLight ? "shadow-sm" : "",
        className,
      )}
      style={{
        background: bgStyle,
        border: borderStyle,
      }}
      {...props}
    >
      {/* Header Row */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1.5">
          <h3 className={`text-base font-semibold ${isLight ? "text-black/85" : "text-white/90"}`}>
            Takaful Pool — Your Share
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer text-muted-foreground/60 hover:text-muted-foreground transition-colors inline-flex items-center"
                  aria-label="Pool information"
                >
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4.5 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 16.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm1.116-3.041l.1-.408a1.709 1.709 0 01-.25.083 1.176 1.176 0 01-.308.048c-.193 0-.329-.032-.407-.095-.079-.064-.118-.184-.118-.359a3.514 3.514 0 01.118-.672l.373-1.318c.037-.121.062-.255.075-.4a3.73 3.73 0 00.02-.304.866.866 0 00-.292-.678c-.195-.174-.473-.26-.833-.26-.2 0-.412.035-.636.106-.224.07-.459.156-.704.256l-.1.409c.073-.028.16-.057.262-.087.101-.03.2-.045.297-.045.198 0 .331.034.4.1.07.066.105.185.105.354 0 .093-.01.197-.034.31a6.216 6.216 0 01-.084.36l-.374 1.325c-.033.14-.058.264-.073.374-.015.11-.022.22-.022.325 0 .272.1.496.301.673.201.177.483.265.846.265.236 0 .443-.03.621-.092s.417-.152.717-.27zM11.05 7.85a.772.772 0 00.26-.587.78.78 0 00-.26-.59.885.885 0 00-.628-.244.893.893 0 00-.63.244.778.778 0 00-.264.59c0 .23.088.426.263.587a.897.897 0 00.63.243.888.888 0 00.629-.243z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-72">
                <p className="text-xs">
                  Your contributions go into a shared mutual fund used to help participants when claims occur.
                  Unused funds remain in the pool or are returned as mutual surplus.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          {showLearnMore && (
            <Link
              href="/dashboard/pool"
              className="text-xs font-medium text-[#00c685] hover:underline flex items-center gap-0.5 mr-1"
            >
              Learn more <ChevronRight size={12} />
            </Link>
          )}

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger
              size="sm"
              className={`w-auto h-8 gap-2 rounded-xl text-xs font-medium ${
                isLight
                  ? "bg-black/[0.03] border-[#E4E7EC] text-black/80 hover:bg-black/[0.05]"
                  : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
              }`}
            >
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pool Balance & Growth Metric */}
      <div className="flex items-baseline gap-3">
        <span
          className={`text-3xl font-bold leading-none tracking-tight tabular-nums ${
            isLight ? "text-black/90" : "text-white"
          }`}
        >
          {balanceDisplay}
        </span>
        <p className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
          +4.1%{" "}
          <span className={`font-normal text-xs ${isLight ? "text-black/45" : "text-white/45"}`}>
            surplus vs last month
          </span>
        </p>
      </div>

      {/* Dates & Segmented Category Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <p className={`text-xs font-medium ${isLight ? "text-black/50" : "text-white/45"}`}>
            {period?.from && format(period.from, "MMM dd, yyyy")}
          </p>
          <p className={`text-xs font-medium ${isLight ? "text-black/50" : "text-white/45"}`}>
            {period?.to && format(period.to, "MMM dd, yyyy")}
          </p>
        </div>

        {/* The Chunky Rounded Segmented Bar (Matching screenshot design) */}
        <TooltipProvider>
          <div className="flex gap-1.5 w-full">
            {poolData.map((item, index) => (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className="h-[42px] rounded-lg transition-all duration-300 hover:brightness-110 cursor-pointer overflow-hidden relative shadow-sm"
                    style={{ width: `${item.width}%` }}
                  >
                    <div className={cn("h-full w-full rounded-lg", item.color)} />
                  </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>
                  <p className="text-xs">
                    <span className="font-semibold">{item.label}</span>: {item.width}%{" "}
                    <span className="opacity-75">({item.amount})</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5">
          {poolData.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span className={cn("size-2.5 rounded-full shrink-0", item.color)} />
              <span className={isLight ? "text-black/75 font-medium" : "text-white/75 font-medium"}>
                {item.label}
              </span>
              <span className={isLight ? "text-black/45 font-semibold" : "text-white/45 font-semibold"}>
                {item.width}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator using design system */}
      <div
        className="w-full h-px my-0.5"
        style={{ background: isLight ? "#E4E7EC" : "rgba(255,255,255,0.06)" }}
      />

      {/* Description */}
      <p className={`text-xs leading-relaxed ${isLight ? "text-black/55" : "text-white/50"}`}>
        Your contributions go into a shared pool used to help all participants. Here's how the pool is structured: Under the Wakāla-Waqf mutual model, 78% is allocated to the Participant Mutual Fund, 14% is retained in the Claims Reserve for underwriting, and 8% covers the operational Wakāla fee.
      </p>

      <p className={`text-[11px] ${isLight ? "text-black/40" : "text-white/35"}`}>
        Pool balance: £{POOL.balance.toLocaleString()} · {POOL.periodLabel}
      </p>
    </div>
  );
}

export default TakafulPoolBarChart;
