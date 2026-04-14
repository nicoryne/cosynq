// =====================================================================
// Role Utility Functions
// =====================================================================
// Utilities for role mapping, display, and JWT extraction
// Implements celestial theming for UI while maintaining standard database roles

import type { AppRole, CelestialRole } from '@/lib/types/role.types';

// =====================================================================
// Role Mapping Constants
// =====================================================================

/**
 * Maps database roles to celestial UI names
 * Maintains platform's ethereal aesthetic
 */
export const ROLE_MAPPING = {
  user: 'Dreamer',
  moderator: 'Oracle',
  admin: 'Weaver',
} as const;

/**
 * Reverse mapping: celestial names to database roles
 * Used when converting UI selections back to database values
 */
export const CELESTIAL_MAPPING = {
  Dreamer: 'user',
  Oracle: 'moderator',
  Weaver: 'admin',
} as const;

/**
 * User-friendly role descriptions
 * Used in tooltips, help text, and role selection interfaces
 */
export const ROLE_DESCRIPTIONS = {
  user: 'Standard user with full access to personal content',
  moderator: 'Community peacekeeper with moderation capabilities',
  admin: 'Full system access and administrative privileges',
} as const;

// =====================================================================
// Role Conversion Functions
// =====================================================================

/**
 * Converts database role to celestial UI name
 * @param role - Database role (user, moderator, admin)
 * @returns Celestial role name (Dreamer, Oracle, Weaver)
 * @example toCelestialRole('user') // Returns 'Dreamer'
 */
export function toCelestialRole(role: AppRole): CelestialRole {
  return ROLE_MAPPING[role];
}

/**
 * Converts celestial UI name to database role
 * @param celestialRole - Celestial role name (Dreamer, Oracle, Weaver)
 * @returns Database role (user, moderator, admin)
 * @example fromCelestialRole('Dreamer') // Returns 'user'
 */
export function fromCelestialRole(celestialRole: CelestialRole): AppRole {
  return CELESTIAL_MAPPING[celestialRole];
}

/**
 * Gets display name for a role
 * @param role - Database role
 * @returns Celestial display name
 * @example getRoleDisplayName('admin') // Returns 'Weaver'
 */
export function getRoleDisplayName(role: AppRole): string {
  return ROLE_MAPPING[role];
}

/**
 * Gets description for a role
 * @param role - Database role
 * @returns User-friendly description
 * @example getRoleDescription('moderator') // Returns 'Community peacekeeper...'
 */
export function getRoleDescription(role: AppRole): string {
  return ROLE_DESCRIPTIONS[role];
}

// =====================================================================
// Role Permission Helpers
// =====================================================================

/**
 * Checks if a role has admin privileges
 * @param role - Role to check (can be null/undefined for safety)
 * @returns true if role is admin
 * @example isAdmin('admin') // Returns true
 */
export function isAdmin(role: AppRole | null | undefined): boolean {
  return role === 'admin';
}

/**
 * Checks if a role has moderator or higher privileges
 * @param role - Role to check (can be null/undefined for safety)
 * @returns true if role is moderator or admin
 * @example isModerator('moderator') // Returns true
 */
export function isModerator(role: AppRole | null | undefined): boolean {
  return role === 'moderator' || role === 'admin';
}

// =====================================================================
// JWT Extraction (Server-side only)
// =====================================================================

/**
 * Extracts role from JWT claims
 * SERVER-SIDE ONLY - Do not use in client components
 * @param jwt - JWT object from Supabase auth
 * @returns Extracted role or null if not found
 * @example getRoleFromJWT(jwt) // Returns 'admin'
 */
export function getRoleFromJWT(jwt: any): AppRole | null {
  if (!jwt || typeof jwt !== 'object') {
    return null;
  }

  const role = jwt.user_role;

  // Validate that the extracted role is a valid AppRole
  if (role === 'user' || role === 'moderator' || role === 'admin') {
    return role;
  }

  return null;
}
