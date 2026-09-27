'use client';

import React, { createContext, useContext } from 'react';

export type DashboardRole = 'participant' | 'claim_handler' | 'finance' | 'management' | 'super_admin';

interface RoleContextValue {
  role: DashboardRole;
  setRole: (r: DashboardRole) => void;
}

export const RoleContext = createContext<RoleContextValue>({
  role: 'management',
  setRole: () => {},
});

export const useRole = () => useContext(RoleContext);

/* ─── Theme Context ──────────────────────────────────────────────────────── */
export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
