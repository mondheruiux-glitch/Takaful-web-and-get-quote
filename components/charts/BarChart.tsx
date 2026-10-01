"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import "@/components/charts/chartjs-config";
import { getChartThemeOptions } from "@/components/charts/chartjs-config";

export interface BarSeries {
  dataKey: string;
  name: string;
  color: string;
  borderRadius?: number;
}

export interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: BarSeries[];
  theme?: string;
  height?: string | number;
  indexAxis?: "x" | "y";
  yTickFormatter?: (val: number) => string;
  xTickFormatter?: (val: number) => string;
  className?: string;
}

export function ChartJSBarChart({
  data,
  xKey,
  series,
  theme = "dark",
  height = "100%",
  indexAxis = "x",
  yTickFormatter,
  xTickFormatter,
  className,
}: BarChartProps) {
  const isLight = theme === "light";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels = useMemo(() => data.map((d) => String(d[xKey] ?? "")), [data, xKey]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: series.map((s) => ({
        label: s.name,
        data: data.map((d) => Number(d[s.dataKey] ?? 0)),
        backgroundColor: s.color,
        hoverBackgroundColor: s.color,
        borderRadius: s.borderRadius ?? 6,
        borderSkipped: false,
      })),
    };
  }, [labels, data, series]);

  const baseOptions = useMemo(() => getChartThemeOptions(isLight), [isLight]);

  const options: ChartOptions<"bar"> = useMemo(() => {
    return {
      ...baseOptions,
      indexAxis,
      scales: {
        x: {
          ...baseOptions.scales?.x,
          ticks: {
            ...baseOptions.scales?.x?.ticks,
            callback: function (val: string | number) {
              if (xTickFormatter && typeof val === "number") {
                return xTickFormatter(val);
              }
              return val;
            },
          },
        },
        y: {
          ...baseOptions.scales?.y,
          ticks: {
            ...baseOptions.scales?.y?.ticks,
            callback: function (val: string | number) {
              if (yTickFormatter && typeof val === "number") {
                return yTickFormatter(val);
              }
              return val;
            },
          },
        },
      },
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) label += ": ";
              const val = context.parsed.y;
              if (val == null) return label;
              if (yTickFormatter) {
                return label + yTickFormatter(val);
              }
              return label + val.toLocaleString();
            },
          },
        },
      },
    } as ChartOptions<"bar">;
  }, [baseOptions, yTickFormatter]);

  if (!mounted) {
    return <div className={className} style={{ width: "100%", height }} />;
  }

  return (
    <div className={className} style={{ width: "100%", height, position: "relative" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export { ChartJSBarChart as BarChart };
