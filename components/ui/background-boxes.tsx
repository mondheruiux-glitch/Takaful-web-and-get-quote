"use client";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  // Green palette matching brand (#00c685, #62D2A2, #0a1a14)
  const colors = [
    "rgb(0 198 133)",    // #00c685 brand green
    "rgb(98 210 162)",   // #62D2A2 secondary green
    "rgb(0 168 113)",    // darker brand green
    "rgb(134 239 172)",  // light green-300
    "rgb(52 211 153)",   // emerald-400
    "rgb(16 185 129)",   // emerald-500
    "rgb(110 231 183)",  // emerald-300
    "rgb(6 214 160)",    // teal-ish
    "rgb(167 243 208)",  // green-200
  ];

  // Pre-generate grid colors to avoid React render churn
  const cellColors = useMemo(() => {
    return Array.from({ length: 150 * 100 }, () => 
      colors[Math.floor(Math.random() * colors.length)]
    );
  }, []);

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      <style>
        {`
          .box-cell {
            transition: background-color 2s ease;
          }
          .box-cell:hover {
            background-color: var(--hover-color);
            transition: background-color 0s;
          }
        `}
      </style>
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="w-16 h-8 border-l border-[#00c685]/20 relative"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              style={{ "--hover-color": cellColors[i * 100 + j] } as React.CSSProperties}
              className="box-cell w-16 h-8 border-r border-t border-[#00c685]/20 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-[#00c685]/30 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);

