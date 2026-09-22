'use client';

import React from 'react';
import { AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export type DashboardAlertVariant = 'warning' | 'info' | 'error' | 'success';

export interface DashboardAlertProps {
  variant?: DashboardAlertVariant;
  title?: React.ReactNode;
  children: React.ReactNode;
  isLight?: boolean;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function DashboardAlert({
  variant = 'warning',
  title,
  children,
  isLight = false,
  icon,
  className = '',
  action,
}: DashboardAlertProps) {
  const getThemeStyles = () => {
    switch (variant) {
      case 'warning':
        return isLight
          ? {
              container: 'bg-amber-50/95 border-amber-300/90 shadow-sm shadow-amber-900/5',
              iconBox: 'bg-amber-100 text-amber-700 border-amber-300/60',
              title: 'text-amber-950',
              body: 'text-amber-900',
              defaultIcon: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />,
            }
          : {
              container: 'bg-amber-950/40 border-amber-500/40 shadow-sm shadow-black/20',
              iconBox: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              title: 'text-amber-100',
              body: 'text-amber-200/95',
              defaultIcon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
            };

      case 'error':
        return isLight
          ? {
              container: 'bg-red-50/95 border-red-300/90 shadow-sm shadow-red-900/5',
              iconBox: 'bg-red-100 text-red-700 border-red-300/60',
              title: 'text-red-950',
              body: 'text-red-900',
              defaultIcon: <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />,
            }
          : {
              container: 'bg-red-950/40 border-red-500/40 shadow-sm shadow-black/20',
              iconBox: 'bg-red-500/20 text-red-300 border-red-500/40',
              title: 'text-red-100',
              body: 'text-red-200/95',
              defaultIcon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
            };

      case 'success':
        return isLight
          ? {
              container: 'bg-emerald-50/95 border-emerald-300/90 shadow-sm shadow-emerald-900/5',
              iconBox: 'bg-emerald-100 text-emerald-700 border-emerald-300/60',
              title: 'text-emerald-950',
              body: 'text-emerald-900',
              defaultIcon: <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />,
            }
          : {
              container: 'bg-emerald-950/40 border-emerald-500/40 shadow-sm shadow-black/20',
              iconBox: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
              title: 'text-emerald-100',
              body: 'text-emerald-200/95',
              defaultIcon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
            };

      case 'info':
      default:
        return isLight
          ? {
              container: 'bg-blue-50/95 border-blue-300/90 shadow-sm shadow-blue-900/5',
              iconBox: 'bg-blue-100 text-blue-700 border-blue-300/60',
              title: 'text-blue-950',
              body: 'text-blue-900',
              defaultIcon: <Info className="w-4 h-4 text-blue-700 shrink-0" />,
            }
          : {
              container: 'bg-blue-950/40 border-blue-500/40 shadow-sm shadow-black/20',
              iconBox: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
              title: 'text-blue-100',
              body: 'text-blue-200/95',
              defaultIcon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
            };
    }
  };

  const styles = getThemeStyles();
  const renderIcon = icon ?? styles.defaultIcon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all ${styles.container} ${className}`}
    >
      <div
        className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${styles.iconBox}`}
      >
        {renderIcon}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`text-xs sm:text-sm font-semibold tracking-tight mb-1 ${styles.title}`}>
            {title}
          </h4>
        )}
        <div className={`text-xs sm:text-[13px] leading-relaxed font-normal ${styles.body}`}>
          {children}
        </div>
      </div>

      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
