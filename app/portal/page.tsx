'use client';

import React from 'react';
import { ParticipantDashboard } from '@/features/dashboard';
import { useTheme } from '@/app/dashboard/ThemeRoleContext';

export default function PortalPage() {
  const { theme } = useTheme();
  return <ParticipantDashboard theme={theme || 'dark'} />;
}

