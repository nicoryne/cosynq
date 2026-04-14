// =====================================================================
// Property Test Configuration
// =====================================================================
// Configuration and generators for property-based testing
// Uses fast-check library for generating test data

import fc from 'fast-check';
import type { AppRole, PaginationParams } from '@/lib/types/role.types';

// =====================================================================
// Test Configuration
// =====================================================================

/**
 * Global configuration for property tests
 * Ensures consistent test execution across all property tests
 */
export const TEST_CONFIG = {
  numRuns: 100, // Run each property test 100 times
  timeout: 5000, // 5 second timeout per test
  verbose: true, // Enable verbose output for debugging
};

// =====================================================================
// Arbitraries (Generators)
// =====================================================================

/**
 * Generates valid AppRole values
 * @returns Arbitrary that produces 'user', 'moderator', or 'admin'
 */
export const arbitraries = {
  /**
   * Generates valid app role values
   */
  appRole: fc.constantFrom<AppRole>('user', 'moderator', 'admin'),

  /**
   * Generates valid UUID v4 strings
   */
  userId: fc.uuid(),

  /**
   * Generates ISO 8601 timestamp strings
   */
  timestamp: fc.date().map((d) => d.toISOString()),

  /**
   * Generates valid pagination parameters
   */
  pagination: fc.record<PaginationParams>({
    page: fc.integer({ min: 1, max: 100 }),
    pageSize: fc.integer({ min: 1, max: 100 }),
  }),

  /**
   * Generates invalid UUID strings (for negative testing)
   */
  invalidUuid: fc.string().filter((s) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return !uuidRegex.test(s);
  }),

  /**
   * Generates invalid role strings (for negative testing)
   */
  invalidRole: fc
    .string()
    .filter((s) => s !== 'user' && s !== 'moderator' && s !== 'admin'),
};

// =====================================================================
// Helper Functions
// =====================================================================

/**
 * Validates UUID format
 * @param uuid - String to validate
 * @returns true if valid UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Parses JWT token (for testing)
 * @param token - JWT token string
 * @returns Decoded JWT payload
 */
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
}
