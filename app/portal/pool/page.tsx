'use client';

import { useTheme } from '@/app/dashboard/ThemeRoleContext';
import { ParticipantPoolView } from '@/app/dashboard/pool/page';

export default function PortalPoolPage() {
  const { theme } = useTheme();
  return <ParticipantPoolView theme={theme} />;
}
