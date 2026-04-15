'use server';

// =====================================================================
// Role Server Actions
// =====================================================================
// Entry points for role mutations from client components
// Implements authorization checks and input validation

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { RoleService } from '@/lib/services/role.service';
import {
  assignRoleSchema,
  updateRoleSchema,
  userIdSchema,
  paginationSchema,
} from '@/lib/validations/role.validation';
import { getRoleFromJWT } from '@/lib/utils/role.utils';
import type {
  AppRole,
  UserRoleDTO,
  RoleAuditLogDTO,
  PaginatedResponse,
} from '@/lib/types/role.types';

// =====================================================================
// Action Response Type
// =====================================================================

/**
 * Standardized response format for all actions
 */
export interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// =====================================================================
// Authorization Helper
// =====================================================================

/**
 * Verifies the requesting user has admin role
 * @returns Admin role or throws error
 */
async function requireAdmin(): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Authentication required');
  }

  // Get JWT to extract role claim
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No active session');
  }

  const role = getRoleFromJWT(session.access_token);

  if (role !== 'admin') {
    throw new Error('Insufficient permissions. Admin role required.');
  }
}

// =====================================================================
// Role Actions
// =====================================================================

/**
 * Assigns a role to a user
 * Requires: Caller must be admin
 */
export async function assignRoleAction(
  userId: string,
  role: AppRole
): Promise<ActionResponse<UserRoleDTO>> {
  try {
    // Verify admin authorization
    await requireAdmin();

    // Validate input
    const validation = assignRoleSchema.safeParse({ userId, role });
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // Execute service operation
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const roleService = new RoleService(supabase);
    const result = await roleService.assignRole(userId, role);

    // Revalidate admin hub paths
    revalidatePath('/admin/roles');
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'Role assigned successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to assign role',
    };
  }
}

/**
 * Updates a user's existing role
 * Requires: Caller must be admin
 */
export async function updateRoleAction(
  userId: string,
  newRole: AppRole
): Promise<ActionResponse<UserRoleDTO>> {
  try {
    // Verify admin authorization
    await requireAdmin();

    // Validate input
    const validation = updateRoleSchema.safeParse({ userId, newRole });
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // Execute service operation
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const roleService = new RoleService(supabase);
    const result = await roleService.updateRole(userId, newRole);

    // Revalidate admin hub paths
    revalidatePath('/admin/roles');
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'Role updated successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update role',
    };
  }
}

/**
 * Removes a user's role assignment
 * Requires: Caller must be admin
 * Prevents: Removing last admin
 */
export async function removeRoleAction(
  userId: string
): Promise<ActionResponse> {
  try {
    // Verify admin authorization
    await requireAdmin();

    // Validate input
    const validation = userIdSchema.safeParse(userId);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: { userId: validation.error.issues.map((e) => e.message) },
      };
    }

    // Execute service operation
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const roleService = new RoleService(supabase);
    await roleService.removeRole(userId);

    // Revalidate admin hub paths
    revalidatePath('/admin/roles');
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'Role removed successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove role',
    };
  }
}

/**
 * Retrieves audit log for a user
 * Requires: Caller must be admin
 */
export async function getRoleAuditLogAction(
  userId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<ActionResponse<PaginatedResponse<RoleAuditLogDTO>>> {
  try {
    // Verify admin authorization
    await requireAdmin();

    // Validate input
    const userIdValidation = userIdSchema.safeParse(userId);
    if (!userIdValidation.success) {
      return {
        success: false,
        message: 'Invalid user ID',
        errors: { userId: userIdValidation.error.issues.map((e) => e.message) },
      };
    }

    const paginationValidation = paginationSchema.safeParse({ page, pageSize });
    if (!paginationValidation.success) {
      return {
        success: false,
        message: 'Invalid pagination parameters',
        errors: paginationValidation.error.flatten().fieldErrors,
      };
    }

    // Execute service operation
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const roleService = new RoleService(supabase);
    const result = await roleService.getRoleAuditLog(userId, {
      page,
      pageSize,
    });

    return {
      success: true,
      message: 'Audit log retrieved successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to retrieve audit log',
    };
  }
}
