"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem,
} from "chart.js";

// Register Chart.js plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export { ChartJS };

export function getChartThemeOptions(isLight: boolean = false): Partial<ChartOptions<"line" | "bar" | "doughnut">> {
  const gridColor = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
  const textColor = isLight ? "rgba(0, 0, 0, 0.55)" : "rgba(255, 255, 255, 0.45)";
  const tooltipBg = isLight ? "#ffffff" : "#0d1a14";
  const tooltipBorder = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 198, 133, 0.2)";
  const tooltipText = isLight ? "#0f172a" : "#ffffff";

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
        },
        border: {
          display: false,
        },
      },
    },
  };
}
