// =====================================================================
// Role Validation Schemas
// =====================================================================
// Zod schemas for validating all role-related inputs
// Implements "Absolute Input Validation" security principle

import { z } from 'zod';

// =====================================================================
// Core Validation Schemas
// =====================================================================

/**
 * Validates app_role enum values
 * Must match database enum: 'user' | 'moderator' | 'admin'
 */
export const appRoleSchema = z.enum(['user', 'moderator', 'admin'], {
  message: 'Role must be user, moderator, or admin',
});

/**
 * Validates UUID format for user IDs
 * Ensures proper format before database queries
 */
export const userIdSchema = z.string().uuid({
  message: 'User ID must be a valid UUID',
});

/**
 * Validates role assignment input
 * Used when assigning a role to a user for the first time
 */
export const assignRoleSchema = z.object({
  userId: userIdSchema,
  role: appRoleSchema,
});

/**
 * Validates role update input
 * Used when changing an existing role assignment
 */
export const updateRoleSchema = z.object({
  userId: userIdSchema,
  newRole: appRoleSchema,
});

/**
 * Validates pagination parameters
 * Ensures safe and reasonable pagination values
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

// =====================================================================
// Inferred TypeScript Types
// =====================================================================

/**
 * TypeScript type inferred from assignRoleSchema
 */
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

/**
 * TypeScript type inferred from updateRoleSchema
 */
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

/**
 * TypeScript type inferred from paginationSchema
 */
export type PaginationInput = z.infer<typeof paginationSchema>;
