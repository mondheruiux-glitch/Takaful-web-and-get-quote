"use client";

import React from "react";
import { useRole, useTheme } from "./ThemeRoleContext";
import {
  ParticipantDashboard,
  ClaimHandlerDashboard,
  FinanceDashboard,
  ManagementDashboard,
  SuperAdminDashboard,
} from "@/features/dashboard";

export default function DashboardPage() {
  const { role } = useRole();
  const { theme } = useTheme();

  switch (role) {
    case "participant":
      return <ParticipantDashboard theme={theme} />;
    case "claim_handler":
      return <ClaimHandlerDashboard theme={theme} />;
    case "finance":
      return <FinanceDashboard theme={theme} />;
    case "management":
      return <ManagementDashboard theme={theme} />;
    case "super_admin":
      return <SuperAdminDashboard theme={theme} />;
    default:
      return <SuperAdminDashboard theme={theme} />;
  }
}
