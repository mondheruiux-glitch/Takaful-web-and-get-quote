"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions, ScriptableContext } from "chart.js";
import "@/components/charts/chartjs-config";
import { getChartThemeOptions } from "@/components/charts/chartjs-config";

export interface DualAxisSeries {
  dataKey: string;
  name: string;
  color: string;
  axis: "left" | "right";
  formatter?: (val: number) => string;
}

export interface DualAxisTrendChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  leftSeries: DualAxisSeries;
  rightSeries: DualAxisSeries;
  theme?: string;
  height?: string | number;
  className?: string;
}

export function DualAxisTrendChart({
  data,
  xKey,
  leftSeries,
  rightSeries,
  theme = "dark",
  height = "100%",
  className,
}: DualAxisTrendChartProps) {
  const isLight = theme === "light";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels = useMemo(() => data.map((d) => String(d[xKey] ?? "")), [data, xKey]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: leftSeries.name,
          data: data.map((d) => Number(d[leftSeries.dataKey] ?? 0)),
          borderColor: leftSeries.color,
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: leftSeries.color,
          yAxisID: "yLeft",
          fill: true,
          backgroundColor: (context: ScriptableContext<"line">) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return undefined;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, `${leftSeries.color}35`);
            gradient.addColorStop(1, `${leftSeries.color}00`);
            return gradient;
          },
        },
        {
          label: rightSeries.name,
          data: data.map((d) => Number(d[rightSeries.dataKey] ?? 0)),
          borderColor: rightSeries.color,
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: rightSeries.color,
          yAxisID: "yRight",
          fill: true,
          backgroundColor: (context: ScriptableContext<"line">) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return undefined;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, `${rightSeries.color}30`);
            gradient.addColorStop(1, `${rightSeries.color}00`);
            return gradient;
          },
        },
      ],
    };
  }, [labels, data, leftSeries, rightSeries]);

  const baseOptions = useMemo(() => getChartThemeOptions(isLight), [isLight]);

  const options: ChartOptions<"line"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          callbacks: {
            label: function (context) {
              const datasetIdx = context.datasetIndex;
              const isRight = datasetIdx === 1;
              const series = isRight ? rightSeries : leftSeries;
              let label = series.name + ": ";
              const val = context.parsed.y;
              if (val == null) return label;
              if (series.formatter) {
                return label + series.formatter(val);
              }
              return label + val.toLocaleString();
            },
          },
        },
      },
      scales: {
        x: baseOptions.scales?.x,
        yLeft: {
          type: "linear",
          display: true,
          position: "left",
          grid: baseOptions.scales?.y?.grid,
          ticks: {
            ...baseOptions.scales?.y?.ticks,
            callback: function (val: string | number) {
              if (leftSeries.formatter && typeof val === "number") {
                return leftSeries.formatter(val);
              }
              return val;
            },
          },
          border: { display: false },
        },
        yRight: {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            drawOnChartArea: false, // only draw grid lines on left axis
          },
          ticks: {
            ...baseOptions.scales?.y?.ticks,
            callback: function (val: string | number) {
              if (rightSeries.formatter && typeof val === "number") {
                return rightSeries.formatter(val);
              }
              return val;
            },
          },
          border: { display: false },
        },
      },
    } as ChartOptions<"line">;
  }, [baseOptions, leftSeries, rightSeries]);

  if (!mounted) {
    return <div className={className} style={{ width: "100%", height }} />;
  }

  return (
    <div className={className} style={{ width: "100%", height, position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
