"use client";

import React, { useState, useEffect, useRef } from 'react';

interface DotCardProps {
  target?: number;
  duration?: number;
  label: string;
  prefix?: string;
  suffix?: string;
  textValue?: string;
}

export default function DotCard({
  target,
  duration = 3000,
  label,
  prefix = "",
  suffix = "",
  textValue
}: DotCardProps) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (target === undefined) return;
    let current = 0;
    const end = target;
    const step = 30; // 30ms interval for high-smoothness counter
    const totalSteps = duration / step;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  let display = textValue || "";
  if (target !== undefined) {
    if (suffix === " Billion") {
      display = `${prefix}${(count / 10).toFixed(1)}${suffix}`;
    } else if (suffix === "M") {
      display = `${prefix}${(count / 10).toFixed(1)}${suffix}`;
    } else {
      display = `${prefix}${Math.floor(count)}${suffix}`;
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="outer group"
    >
      <div className="card">
        <div className="ray"></div>
        <div className="text">{display}</div>
        <div className="label">{label}</div>
        <div className="line topl"></div>
        <div className="line leftl"></div>
        <div className="line bottoml"></div>
        <div className="line rightl"></div>
      </div>
    </div>
  );
}
