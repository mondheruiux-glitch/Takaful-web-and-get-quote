"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions, ScriptableContext } from "chart.js";
import "@/components/charts/chartjs-config";
import { getChartThemeOptions } from "@/components/charts/chartjs-config";

export interface AreaSeries {
  dataKey: string;
  name: string;
  color: string;
  fill?: boolean;
  borderDash?: number[];
  borderWidth?: number;
}

export interface AreaChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  series: AreaSeries[];
  theme?: string;
  height?: string | number;
  yTickFormatter?: (val: number) => string;
  className?: string;
}

export function ChartJSAreaChart({
  data,
  xKey,
  series,
  theme = "dark",
  height = "100%",
  yTickFormatter,
  className,
}: AreaChartProps) {
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
        borderColor: s.color,
        borderWidth: s.borderWidth ?? 2.5,
        borderDash: s.borderDash,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: s.color,
        fill: s.fill !== false,
        backgroundColor: (context: ScriptableContext<"line">) => {
          if (s.fill === false) return "transparent";
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return undefined;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          // Parse hex or color to gradient
          if (s.color.startsWith("#")) {
            gradient.addColorStop(0, `${s.color}40`);
            gradient.addColorStop(1, `${s.color}00`);
          } else {
            gradient.addColorStop(0, "rgba(0, 198, 133, 0.25)");
            gradient.addColorStop(1, "rgba(0, 198, 133, 0)");
          }
          return gradient;
        },
      })),
    };
  }, [labels, data, series]);

  const baseOptions = useMemo(() => getChartThemeOptions(isLight), [isLight]);

  const options: ChartOptions<"line"> = useMemo(() => {
    return {
      ...baseOptions,
      scales: {
        x: baseOptions.scales?.x,
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
    } as ChartOptions<"line">;
  }, [baseOptions, yTickFormatter]);

  if (!mounted) {
    return <div className={className} style={{ width: "100%", height }} />;
  }

  return (
    <div className={className} style={{ width: "100%", height, position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export { ChartJSAreaChart as AreaChart };
