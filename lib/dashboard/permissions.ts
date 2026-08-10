import { useContext } from 'react';
import { UserRole } from './types';
import { RoleContext } from '@/app/dashboard/ThemeRoleContext';

/* ─── Permission Definitions ─────────────────────────────────────────────── */
export type Permission =
  | 'view_own_certificate'
  | 'view_all_certificates'
  | 'create_claim'
  | 'view_own_claims'
  | 'view_all_claims'
  | 'manage_claim'
  | 'approve_claim'
  | 'escalate_claim'
  | 'view_internal_notes'
  | 'create_internal_notes'
  | 'send_participant_message'
  | 'view_own_contributions'
  | 'view_all_contributions'
  | 'reconcile_contributions'
  | 'release_claim_payment'
  | 'view_pool_simplified'
  | 'view_pool_full'
  | 'view_transactions'
  | 'view_financial_reports'
  | 'view_management_analytics'
  | 'view_risk_analytics'
  | 'manage_users';

/* ─── Role → Permission Map (single source of truth) ─────────────────────── */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  participant: [
    'view_own_certificate',
    'create_claim',
    'view_own_claims',
    'view_own_contributions',
    'view_pool_simplified',
    'send_participant_message',
  ],
  claim_handler: [
    'view_all_certificates',
    'view_own_claims',
    'view_all_claims',
    'manage_claim',
    'approve_claim',
    'escalate_claim',
    'view_internal_notes',
    'create_internal_notes',
    'send_participant_message',
  ],
  finance: [
    'view_all_certificates',
    'view_all_claims',
    'view_all_contributions',
    'reconcile_contributions',
    'release_claim_payment',
    'view_pool_full',
    'view_transactions',
    'view_financial_reports',
  ],
  management: [
    'view_all_certificates',
    'view_all_claims',
    'view_all_contributions',
    'view_pool_full',
    'view_transactions',
    'view_financial_reports',
    'view_management_analytics',
    'view_risk_analytics',
    'view_internal_notes',
    'manage_users',
  ],
};

/* ─── Permission Check Utilities ─────────────────────────────────────────── */

/** Pure function — check if a role has a specific permission */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** React hook — use inside dashboard components */
export function usePermission() {
  const { role } = useContext(RoleContext);
  const can = (permission: Permission): boolean => hasPermission(role, permission);
  const canAny = (...permissions: Permission[]): boolean =>
    permissions.some((p) => hasPermission(role, p));
  return { can, canAny, role };
}
