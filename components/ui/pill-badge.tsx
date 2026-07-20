import React from 'react';

interface PillBadgeProps {
  text: string;
  className?: string;
  dark?: boolean;
  dot?: boolean;
}

export function PillBadge({ text, className = "", dark = false, dot = false }: PillBadgeProps) {
  const icon = dot ? (
    <span className="w-1.5 h-1.5 rounded-full bg-[#00c685] animate-pulse" />
  ) : (
    <span className="text-[#00c685] font-bold">✨</span>
  );

  if (dark) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/90 text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all hover:bg-white/10 ${className}`}>
        {icon}
        <span>{text}</span>
      </div>
    );
  }
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200/80 bg-gray-50/50 text-gray-800 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-gray-300 hover:bg-gray-50/80 ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}
