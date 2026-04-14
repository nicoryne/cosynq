// =====================================================================
// Role Service Layer
// =====================================================================
// Core business logic for role management
// Implements "Do Not Trust The Client" paradigm with strict DTOs

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type {
  AppRole,
  UserRoleDTO,
  UserWithRoleDTO,
  RoleAuditLogDTO,
  PaginationParams,
  PaginatedResponse,
} from '@/lib/types/role.types';
import { toCelestialRole } from '@/lib/utils/role.utils';

/**
 * RoleService - Centralized service for role management
 * Handles all role-related database operations with proper security
 */
export class RoleService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves a user's role from the database
   * @param userId - UUID of the user
   * @returns UserRoleDTO or null if not found
   * @throws Error if database operation fails
   */
  async getUserRole(userId: string): Promise<UserRoleDTO | null> {
    // Validate UUID format before query
    if (!this.isValidUUID(userId)) {
      throw new Error('Invalid user ID format');
    }

    const { data, error } = await this.supabase
      .from('user_roles')
      .select('user_id, role, created_at')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user has no role assigned
        return null;
      }
      throw new Error(`Failed to fetch user role: ${error.message}`);
    }

    // Map to DTO
    return {
      userId: data.user_id,
      role: data.role,
      createdAt: data.created_at,
    };
  }

  /**
   * Assigns a role to a user (creates new record)
   * @param userId - UUID of the user
   * @param role - Role to assign
   * @returns UserRoleDTO of created record
   * @throws Error if user already has a role or operation fails
   */
  async assignRole(userId: string, role: AppRole): Promise<UserRoleDTO> {
    // Validate UUID format
    if (!this.isValidUUID(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Check if user already has a role
    const existing = await this.getUserRole(userId);
    if (existing) {
      throw new Error('User already has a role assigned. Use updateRole instead.');
    }

    const { data, error } = await this.supabase
      .from('user_roles')
      .insert({ user_id: userId, role })
      .select('user_id, role, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to assign role: ${error.message}`);
    }

    // Map to DTO
    return {
      userId: data.user_id,
      role: data.role,
      createdAt: data.created_at,
    };
  }

  /**
   * Updates an existing role assignment
   * @param userId - UUID of the user
   * @param newRole - New role to assign
   * @returns UserRoleDTO of updated record
   * @throws Error if user has no existing role or operation fails
   */
  async updateRole(userId: string, newRole: AppRole): Promise<UserRoleDTO> {
    // Validate UUID format
    if (!this.isValidUUID(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Check if user has an existing role
    const existing = await this.getUserRole(userId);
    if (!existing) {
      throw new Error('User has no role assigned. Use assignRole instead.');
    }

    // Prevent demoting last admin
    if (existing.role === 'admin' && newRole !== 'admin') {
      const adminCount = await this.countAdmins();
      if (adminCount <= 1) {
        throw new Error('Cannot demote the last admin user');
      }
    }

    const { data, error } = await this.supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId)
      .select('user_id, role, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }

    // Map to DTO
    return {
      userId: data.user_id,
      role: data.role,
      createdAt: data.created_at,
    };
  }

  /**
   * Removes a role assignment (deletes record)
   * @param userId - UUID of the user
   * @throws Error if operation fails or attempting to remove last admin
   */
  async removeRole(userId: string): Promise<void> {
    // Validate UUID format
    if (!this.isValidUUID(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Check if user is an admin
    const existing = await this.getUserRole(userId);
    if (existing?.role === 'admin') {
      const adminCount = await this.countAdmins();
      if (adminCount <= 1) {
        throw new Error('Cannot remove the last admin user');
      }
    }

    const { error } = await this.supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  }

  /**
   * Lists all users with a specific role (paginated)
   * @param role - Role to filter by
   * @param pagination - Page number and size
   * @returns Paginated list of UserWithRoleDTO
   */
  async listUsersWithRole(
    role: AppRole,
    pagination: PaginationParams = { page: 1, pageSize: 20 }
  ): Promise<PaginatedResponse<UserWithRoleDTO>> {
    const { page, pageSize } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count
    const { count, error: countError } = await this.supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', role);

    if (countError) {
      throw new Error(`Failed to count users: ${countError.message}`);
    }

    // Get paginated data
    const { data, error } = await this.supabase
      .from('user_roles')
      .select('user_id, role, created_at')
      .eq('role', role)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }

    // Map to DTOs (simplified - in real implementation, join with user profiles)
    const users: UserWithRoleDTO[] = data.map((row) => ({
      userId: row.user_id,
      username: 'Unknown', // TODO: Join with profiles table
      displayName: 'Unknown', // TODO: Join with profiles table
      role: row.role,
      celestialRole: toCelestialRole(row.role),
      roleAssignedAt: row.created_at,
    }));

    return {
      data: users,
      pagination: {
        page,
        pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  }

  /**
   * Retrieves audit log for a specific user
   * @param userId - UUID of the user
   * @param pagination - Page number and size
   * @returns Paginated list of RoleAuditLogDTO
   */
  async getRoleAuditLog(
    userId: string,
    pagination: PaginationParams = { page: 1, pageSize: 20 }
  ): Promise<PaginatedResponse<RoleAuditLogDTO>> {
    // Validate UUID format
    if (!this.isValidUUID(userId)) {
      throw new Error('Invalid user ID format');
    }

    const { page, pageSize } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count
    const { count, error: countError } = await this.supabase
      .from('role_audit_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      throw new Error(`Failed to count audit logs: ${countError.message}`);
    }

    // Get paginated data
    const { data, error } = await this.supabase
      .from('role_audit_log')
      .select('id, user_id, old_role, new_role, changed_by, changed_at')
      .eq('user_id', userId)
      .range(from, to)
      .order('changed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch audit log: ${error.message}`);
    }

    // Map to DTOs
    const logs: RoleAuditLogDTO[] = data.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id,
      oldRole: row.old_role,
      newRole: row.new_role,
      changedBy: row.changed_by,
      changedAt: row.changed_at,
    }));

    return {
      data: logs,
      pagination: {
        page,
        pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  }

  /**
   * Counts total admins in the system
   * @returns Number of users with admin role
   */
  async countAdmins(): Promise<number> {
    const { count, error } = await this.supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (error) {
      throw new Error(`Failed to count admins: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Validates UUID format
   * @param uuid - String to validate
   * @returns true if valid UUID format
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
