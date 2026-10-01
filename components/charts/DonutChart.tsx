"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import "@/components/charts/chartjs-config";
import { getChartThemeOptions } from "@/components/charts/chartjs-config";

export interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutDataItem[];
  theme?: string;
  height?: string | number;
  centerText?: {
    primary: string;
    secondary?: string;
  };
  valueFormatter?: (val: number) => string;
  className?: string;
}

export function DonutChart({
  data,
  theme = "dark",
  height = "100%",
  centerText,
  valueFormatter,
  className,
}: DonutChartProps) {
  const isLight = theme === "light";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.name),
      datasets: [
        {
          data: data.map((d) => d.value),
          backgroundColor: data.map((d) => d.color),
          borderColor: isLight ? "#ffffff" : "#0d1a14",
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  }, [data, isLight]);

  const baseOptions = useMemo(() => getChartThemeOptions(isLight), [isLight]);

  const options: ChartOptions<"doughnut"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const val = Number(context.raw);
              const formatted = valueFormatter ? valueFormatter(val) : val.toLocaleString();
              return ` ${label}: ${formatted}`;
            },
          },
        },
      },
    } as ChartOptions<"doughnut">;
  }, [baseOptions, valueFormatter]);

  if (!mounted) {
    return <div className={className} style={{ width: "100%", height }} />;
  }

  return (
    <div className={className} style={{ width: "100%", height, position: "relative" }}>
      <Doughnut data={chartData} options={options} />
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
            {centerText.primary}
          </span>
          {centerText.secondary && (
            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {centerText.secondary}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
