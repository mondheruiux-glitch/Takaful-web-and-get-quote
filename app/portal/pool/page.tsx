'use client';

import { useTheme } from '@/app/dashboard/ThemeRoleContext';
import { ParticipantPoolView } from '@/components/ui/participant-pool-view';

export default function PortalPoolPage() {
  const { theme } = useTheme();
  return <ParticipantPoolView theme={theme} />;
}
