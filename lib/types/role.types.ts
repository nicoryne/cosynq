// =====================================================================
// Role Types and DTOs
// =====================================================================
// Defines all TypeScript types for the RBAC system
// Follows "Do Not Trust The Client" paradigm with strict DTOs

// =====================================================================
// Core Role Types
// =====================================================================

/**
 * Database enum mapping for user roles
 * Maps directly to public.app_role enum in database
 */
export type AppRole = 'user' | 'moderator' | 'admin';

/**
 * Celestial-themed UI role names
 * Maintains platform aesthetic while database uses standard names
 */
export type CelestialRole = 'Dreamer' | 'Oracle' | 'Weaver';

// =====================================================================
// Data Transfer Objects (DTOs)
// =====================================================================

/**
 * User role data transfer object
 * Contains only minimal necessary data for role display
 * Excludes sensitive database fields
 */
export interface UserRoleDTO {
  userId: string;
  role: AppRole;
  createdAt: string; // ISO 8601 format
}

/**
 * User with role data transfer object
 * Used for user directory and admin management interfaces
 * Combines user profile data with role information
 */
export interface UserWithRoleDTO {
  userId: string;
  username: string;
  displayName: string;
  role: AppRole;
  celestialRole: CelestialRole;
  roleAssignedAt: string; // ISO 8601 format
}

/**
 * Role audit log data transfer object
 * Used for security compliance and troubleshooting
 * Tracks all role changes with actor information
 */
export interface RoleAuditLogDTO {
  id: string;
  userId: string;
  oldRole: AppRole | null; // null for initial role assignment
  newRole: AppRole;
  changedBy: string | null; // null if changed by system
  changedAt: string; // ISO 8601 format
}

// =====================================================================
// Pagination Types
// =====================================================================

/**
 * Pagination parameters for list operations
 * Used across all paginated queries
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Paginated response wrapper
 * Generic type for any paginated data
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// =====================================================================
// Service Response Types
// =====================================================================

/**
 * Role operation result
 * Standardized response format for role service operations
 */
export interface RoleOperationResult {
  success: boolean;
  message: string;
  data?: UserRoleDTO;
}
