'use client';

// =====================================================================
// Role React Query Hooks
// =====================================================================
// Client-side hooks for role data fetching and mutations
// Implements caching, loading states, and automatic refetching

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import {
  assignRoleAction,
  updateRoleAction,
  removeRoleAction,
  getRoleAuditLogAction,
} from '@/lib/actions/role.actions';
import type {
  AppRole,
  UserRoleDTO,
  UserWithRoleDTO,
  PaginatedResponse,
  RoleAuditLogDTO,
} from '@/lib/types/role.types';

// =====================================================================
// Query Keys
// =====================================================================

const roleKeys = {
  all: ['roles'] as const,
  user: (userId: string) => [...roleKeys.all, 'user', userId] as const,
  usersWithRole: (role: AppRole, page: number, pageSize: number) =>
    [...roleKeys.all, 'list', role, page, pageSize] as const,
  auditLog: (userId: string, page: number, pageSize: number) =>
    [...roleKeys.all, 'audit', userId, page, pageSize] as const,
};

// =====================================================================
// Query Hooks
// =====================================================================

/**
 * Fetches a single user's role
 * Caching: 5 minutes stale time
 */
export function useUserRole(userId: string) {
  return useQuery({
    queryKey: roleKeys.user(userId),
    queryFn: async (): Promise<UserRoleDTO | null> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No role assigned
        }
        throw new Error(error.message);
      }

      return {
        userId: data.user_id,
        role: data.role,
        createdAt: data.created_at,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  });
}

/**
 * Fetches paginated list of users with specific role
 * Caching: 2 minutes stale time
 */
export function useUsersWithRole(
  role: AppRole,
  page: number = 1,
  pageSize: number = 20
) {
  return useQuery({
    queryKey: roleKeys.usersWithRole(role, page, pageSize),
    queryFn: async (): Promise<PaginatedResponse<UserWithRoleDTO>> => {
      const supabase = createClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Get total count
      const { count, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', role);

      if (countError) {
        throw new Error(countError.message);
      }

      // Get paginated data
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .eq('role', role)
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Map to DTOs (simplified)
      const users: UserWithRoleDTO[] = data.map((row) => ({
        userId: row.user_id,
        username: 'Unknown', // TODO: Join with profiles
        displayName: 'Unknown', // TODO: Join with profiles
        role: row.role,
        celestialRole:
          row.role === 'admin'
            ? 'Weaver'
            : row.role === 'moderator'
              ? 'Oracle'
              : 'Dreamer',
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
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!role,
  });
}

// =====================================================================
// Mutation Hooks
// =====================================================================

/**
 * Mutation hook for assigning roles
 * Invalidates: user role queries, users with role queries
 */
export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: AppRole;
    }) => {
      return await assignRoleAction(userId, role);
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate user's role query
        queryClient.invalidateQueries({
          queryKey: roleKeys.user(variables.userId),
        });
        // Invalidate users with role queries
        queryClient.invalidateQueries({
          queryKey: [...roleKeys.all, 'list'],
        });
      }
    },
  });
}

/**
 * Mutation hook for updating roles
 * Invalidates: user role queries, users with role queries
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: AppRole;
    }) => {
      return await updateRoleAction(userId, newRole);
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate user's role query
        queryClient.invalidateQueries({
          queryKey: roleKeys.user(variables.userId),
        });
        // Invalidate users with role queries
        queryClient.invalidateQueries({
          queryKey: [...roleKeys.all, 'list'],
        });
      }
    },
  });
}

/**
 * Mutation hook for removing roles
 * Invalidates: user role queries, users with role queries
 */
export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await removeRoleAction(userId);
    },
    onSuccess: (data, userId) => {
      if (data.success) {
        // Invalidate user's role query
        queryClient.invalidateQueries({
          queryKey: roleKeys.user(userId),
        });
        // Invalidate users with role queries
        queryClient.invalidateQueries({
          queryKey: [...roleKeys.all, 'list'],
        });
      }
    },
  });
}

/**
 * Fetches audit log for a user
 * Caching: 1 minute stale time
 */
export function useRoleAuditLog(
  userId: string,
  page: number = 1,
  pageSize: number = 20
) {
  return useQuery({
    queryKey: roleKeys.auditLog(userId, page, pageSize),
    queryFn: async () => {
      const result = await getRoleAuditLogAction(userId, page, pageSize);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data!;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!userId,
  });
}
