"use client";

import React from "react";
import { Inbox } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: string | React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DashboardTableProps<T> {
  columns?: ColumnDef<T>[];
  data?: T[];
  theme?: string;
  onRowClick?: (row: T, index: number) => void;
  rowKey?: (row: T, index: number) => string;
  emptyLabel?: string;
  emptySubtext?: string;
  emptyIcon?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardTable<T extends Record<string, any>>({
  columns,
  data,
  theme,
  onRowClick,
  rowKey,
  emptyLabel = "No records found",
  emptySubtext = "Try adjusting your filters or search term.",
  emptyIcon: EmptyIcon = Inbox,
  className = "",
  children,
}: DashboardTableProps<T>) {
  const isLight = theme === "light";

  // If custom children passed (e.g. customized JSX table)
  if (children) {
    return (
      <div
        className={`w-full overflow-x-auto rounded-2xl border transition-colors ${
          isLight
            ? "bg-white border-gray-200/80 shadow-sm"
            : "bg-[#0d2117]/80 border-white/[0.07]"
        } ${className}`}
      >
        <table className="w-full text-left text-xs border-collapse">
          {children}
        </table>
      </div>
    );
  }

  // Structured table
  const rows = data || [];
  const isEmpty = rows.length === 0;

  return (
    <div
      className={`w-full overflow-x-auto rounded-2xl border transition-colors ${
        isLight
          ? "bg-white border-gray-200/80 shadow-sm"
          : "bg-[#0d2117]/80 border-white/[0.07]"
      } ${className}`}
    >
      <table className="w-full text-left text-xs border-collapse">
        {columns && columns.length > 0 && (
          <thead>
            <tr
              className={`border-b ${
                isLight
                  ? "bg-gray-50/80 border-gray-200/80 text-gray-500"
                  : "bg-white/[0.02] border-white/[0.06] text-white/40"
              }`}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 py-3 font-semibold uppercase tracking-wider text-[11px] ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody className="divide-y divide-white/[0.04]">
          {isEmpty ? (
            <tr>
              <td
                colSpan={columns ? columns.length : 1}
                className="py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-white/30"
                    }`}
                  >
                    <EmptyIcon size={22} />
                  </div>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      isLight ? "text-gray-700" : "text-white/80"
                    }`}
                  >
                    {emptyLabel}
                  </p>
                  <p
                    className={`text-xs max-w-xs ${
                      isLight ? "text-gray-400" : "text-white/40"
                    }`}
                  >
                    {emptySubtext}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => {
              const key = rowKey ? rowKey(row, idx) : (row.id ?? idx);
              const isClickable = !!onRowClick;

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(row, idx)}
                  className={`transition-colors group ${
                    isClickable ? "cursor-pointer" : ""
                  } ${
                    isLight
                      ? "hover:bg-gray-50/90 border-gray-100"
                      : "hover:bg-white/[0.03] border-white/[0.04]"
                  }`}
                >
                  {columns?.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 align-middle ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      } ${col.className || ""}`}
                    >
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardTable;
