// =====================================================================
// Role Utilities Unit Tests
// =====================================================================
// Validates role mapping, conversion, and permission helper functions

import { describe, it, expect } from 'vitest';
import {
  toCelestialRole,
  fromCelestialRole,
  getRoleDisplayName,
  getRoleDescription,
  isAdmin,
  isModerator,
  getRoleFromJWT,
  ROLE_MAPPING,
  CELESTIAL_MAPPING,
  ROLE_DESCRIPTIONS,
} from '@/lib/utils/role.utils';
import type { AppRole, CelestialRole } from '@/lib/types/role.types';

describe('Role Utilities', () => {
  // =====================================================================
  // Role Mapping Constants Tests
  // =====================================================================

  describe('ROLE_MAPPING constant', () => {
    it('should map user to Dreamer', () => {
      expect(ROLE_MAPPING.user).toBe('Dreamer');
    });

    it('should map moderator to Oracle', () => {
      expect(ROLE_MAPPING.moderator).toBe('Oracle');
    });

    it('should map admin to Weaver', () => {
      expect(ROLE_MAPPING.admin).toBe('Weaver');
    });
  });

  describe('CELESTIAL_MAPPING constant', () => {
    it('should map Dreamer to user', () => {
      expect(CELESTIAL_MAPPING.Dreamer).toBe('user');
    });

    it('should map Oracle to moderator', () => {
      expect(CELESTIAL_MAPPING.Oracle).toBe('moderator');
    });

    it('should map Weaver to admin', () => {
      expect(CELESTIAL_MAPPING.Weaver).toBe('admin');
    });
  });

  describe('ROLE_DESCRIPTIONS constant', () => {
    it('should have non-empty description for user', () => {
      expect(ROLE_DESCRIPTIONS.user).toBeTruthy();
      expect(ROLE_DESCRIPTIONS.user.length).toBeGreaterThan(0);
    });

    it('should have non-empty description for moderator', () => {
      expect(ROLE_DESCRIPTIONS.moderator).toBeTruthy();
      expect(ROLE_DESCRIPTIONS.moderator.length).toBeGreaterThan(0);
    });

    it('should have non-empty description for admin', () => {
      expect(ROLE_DESCRIPTIONS.admin).toBeTruthy();
      expect(ROLE_DESCRIPTIONS.admin.length).toBeGreaterThan(0);
    });
  });

  // =====================================================================
  // Role Conversion Functions Tests
  // =====================================================================

  describe('toCelestialRole', () => {
    it('should convert user to Dreamer', () => {
      const result = toCelestialRole('user');
      expect(result).toBe('Dreamer');
    });

    it('should convert moderator to Oracle', () => {
      const result = toCelestialRole('moderator');
      expect(result).toBe('Oracle');
    });

    it('should convert admin to Weaver', () => {
      const result = toCelestialRole('admin');
      expect(result).toBe('Weaver');
    });

    it('should map all AppRole values correctly', () => {
      const roles: AppRole[] = ['user', 'moderator', 'admin'];
      const expected: CelestialRole[] = ['Dreamer', 'Oracle', 'Weaver'];

      roles.forEach((role, index) => {
        expect(toCelestialRole(role)).toBe(expected[index]);
      });
    });
  });

  describe('fromCelestialRole', () => {
    it('should convert Dreamer to user', () => {
      const result = fromCelestialRole('Dreamer');
      expect(result).toBe('user');
    });

    it('should convert Oracle to moderator', () => {
      const result = fromCelestialRole('Oracle');
      expect(result).toBe('moderator');
    });

    it('should convert Weaver to admin', () => {
      const result = fromCelestialRole('Weaver');
      expect(result).toBe('admin');
    });

    it('should map all CelestialRole values correctly', () => {
      const celestialRoles: CelestialRole[] = ['Dreamer', 'Oracle', 'Weaver'];
      const expected: AppRole[] = ['user', 'moderator', 'admin'];

      celestialRoles.forEach((celestialRole, index) => {
        expect(fromCelestialRole(celestialRole)).toBe(expected[index]);
      });
    });
  });

  describe('getRoleDisplayName', () => {
    it('should return Dreamer for user role', () => {
      const result = getRoleDisplayName('user');
      expect(result).toBe('Dreamer');
    });

    it('should return Oracle for moderator role', () => {
      const result = getRoleDisplayName('moderator');
      expect(result).toBe('Oracle');
    });

    it('should return Weaver for admin role', () => {
      const result = getRoleDisplayName('admin');
      expect(result).toBe('Weaver');
    });

    it('should return celestial names for all roles', () => {
      const roles: AppRole[] = ['user', 'moderator', 'admin'];
      
      roles.forEach((role) => {
        const displayName = getRoleDisplayName(role);
        expect(displayName).toBeTruthy();
        expect(['Dreamer', 'Oracle', 'Weaver']).toContain(displayName);
      });
    });
  });

  describe('getRoleDescription', () => {
    it('should return non-empty description for user', () => {
      const result = getRoleDescription('user');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result).toBe('string');
    });

    it('should return non-empty description for moderator', () => {
      const result = getRoleDescription('moderator');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result).toBe('string');
    });

    it('should return non-empty description for admin', () => {
      const result = getRoleDescription('admin');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result).toBe('string');
    });

    it('should return unique descriptions for each role', () => {
      const userDesc = getRoleDescription('user');
      const moderatorDesc = getRoleDescription('moderator');
      const adminDesc = getRoleDescription('admin');

      expect(userDesc).not.toBe(moderatorDesc);
      expect(moderatorDesc).not.toBe(adminDesc);
      expect(userDesc).not.toBe(adminDesc);
    });
  });

  // =====================================================================
  // Round-Trip Conversion Tests
  // =====================================================================

  describe('Round-trip conversion', () => {
    it('should preserve user role through round-trip conversion', () => {
      const original: AppRole = 'user';
      const celestial = toCelestialRole(original);
      const result = fromCelestialRole(celestial);
      expect(result).toBe(original);
    });

    it('should preserve moderator role through round-trip conversion', () => {
      const original: AppRole = 'moderator';
      const celestial = toCelestialRole(original);
      const result = fromCelestialRole(celestial);
      expect(result).toBe(original);
    });

    it('should preserve admin role through round-trip conversion', () => {
      const original: AppRole = 'admin';
      const celestial = toCelestialRole(original);
      const result = fromCelestialRole(celestial);
      expect(result).toBe(original);
    });

    it('should preserve all roles through round-trip conversion', () => {
      const roles: AppRole[] = ['user', 'moderator', 'admin'];

      roles.forEach((role) => {
        const celestial = toCelestialRole(role);
        const result = fromCelestialRole(celestial);
        expect(result).toBe(role);
      });
    });
  });

  // =====================================================================
  // Permission Helper Tests
  // =====================================================================

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin('admin')).toBe(true);
    });

    it('should return false for moderator role', () => {
      expect(isAdmin('moderator')).toBe(false);
    });

    it('should return false for user role', () => {
      expect(isAdmin('user')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isAdmin(undefined)).toBe(false);
    });

    it('should only return true for admin role', () => {
      const roles: (AppRole | null | undefined)[] = ['user', 'moderator', 'admin', null, undefined];
      const results = roles.map(isAdmin);
      
      expect(results).toEqual([false, false, true, false, false]);
    });
  });

  describe('isModerator', () => {
    it('should return true for moderator role', () => {
      expect(isModerator('moderator')).toBe(true);
    });

    it('should return true for admin role', () => {
      expect(isModerator('admin')).toBe(true);
    });

    it('should return false for user role', () => {
      expect(isModerator('user')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isModerator(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isModerator(undefined)).toBe(false);
    });

    it('should return true for moderator and admin, false otherwise', () => {
      const roles: (AppRole | null | undefined)[] = ['user', 'moderator', 'admin', null, undefined];
      const results = roles.map(isModerator);
      
      expect(results).toEqual([false, true, true, false, false]);
    });
  });

  // =====================================================================
  // JWT Extraction Tests
  // =====================================================================

  describe('getRoleFromJWT', () => {
    it('should extract user role from valid JWT', () => {
      const jwt = { user_role: 'user' };
      const result = getRoleFromJWT(jwt);
      expect(result).toBe('user');
    });

    it('should extract moderator role from valid JWT', () => {
      const jwt = { user_role: 'moderator' };
      const result = getRoleFromJWT(jwt);
      expect(result).toBe('moderator');
    });

    it('should extract admin role from valid JWT', () => {
      const jwt = { user_role: 'admin' };
      const result = getRoleFromJWT(jwt);
      expect(result).toBe('admin');
    });

    it('should return null for null JWT', () => {
      const result = getRoleFromJWT(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined JWT', () => {
      const result = getRoleFromJWT(undefined);
      expect(result).toBeNull();
    });

    it('should return null for non-object JWT', () => {
      expect(getRoleFromJWT('string')).toBeNull();
      expect(getRoleFromJWT(123)).toBeNull();
      expect(getRoleFromJWT(true)).toBeNull();
    });

    it('should return null for JWT without user_role claim', () => {
      const jwt = { other_claim: 'value' };
      const result = getRoleFromJWT(jwt);
      expect(result).toBeNull();
    });

    it('should return null for JWT with invalid role value', () => {
      const jwt = { user_role: 'invalid_role' };
      const result = getRoleFromJWT(jwt);
      expect(result).toBeNull();
    });

    it('should return null for JWT with non-string role value', () => {
      expect(getRoleFromJWT({ user_role: 123 })).toBeNull();
      expect(getRoleFromJWT({ user_role: true })).toBeNull();
      expect(getRoleFromJWT({ user_role: {} })).toBeNull();
      expect(getRoleFromJWT({ user_role: [] })).toBeNull();
    });

    it('should validate role is one of the three valid AppRole values', () => {
      const validRoles = ['user', 'moderator', 'admin'];
      
      validRoles.forEach((role) => {
        const jwt = { user_role: role };
        const result = getRoleFromJWT(jwt);
        expect(result).toBe(role);
      });
    });

    it('should handle JWT with additional claims', () => {
      const jwt = {
        user_role: 'admin',
        sub: 'user-id-123',
        email: 'test@example.com',
        exp: 1234567890,
      };
      const result = getRoleFromJWT(jwt);
      expect(result).toBe('admin');
    });
  });
});
