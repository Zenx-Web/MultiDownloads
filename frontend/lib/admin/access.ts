import type { User } from '@supabase/supabase-js';

const normalizePath = (value?: string) => {
  if (!value) {
    return '/ops-center';
  }
  const cleaned = value.trim();
  if (!cleaned.startsWith('/')) {
    return `/${cleaned}`;
  }
  return cleaned.replace(/\/$/, '') || '/ops-center';
};

const parseList = (value?: string) =>
  (value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const ADMIN_CONFIG = {
  path: normalizePath(process.env.ADMIN_DASHBOARD_PATH),
  emails: parseList(process.env.ADMIN_ALLOWED_EMAILS),
  roles: parseList(process.env.ADMIN_ALLOWED_ROLES),
};

export const isAdminUser = (user: User | null) => {
  if (!user) return false;

  const email = user.email?.toLowerCase();
  const metadataRole = (user.user_metadata?.role || user.app_metadata?.role || '').toLowerCase();
  const metadataRoles: string[] = Array.isArray(user.app_metadata?.roles)
    ? user.app_metadata.roles.map((role: string) => role.toLowerCase())
    : [];

  const emailAllowed = !!email && ADMIN_CONFIG.emails.includes(email);
  const roleAllowed = [metadataRole, ...metadataRoles].some(
    (role) => role && ADMIN_CONFIG.roles.includes(role)
  );

  const hasAdminFlag = Boolean(user.app_metadata?.is_admin || user.user_metadata?.is_admin);

  return emailAllowed || roleAllowed || hasAdminFlag;
};
