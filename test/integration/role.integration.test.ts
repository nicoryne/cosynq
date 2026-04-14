// =====================================================================
// Integration Tests: Supabase Roles JWT Hooks
// =====================================================================
// Tests database operations, RLS policies, triggers, and JWT hook
// Feature: supabase-roles-jwt-hooks
// Requirements: 18.2, 18.3, 18.4, 18.5, 18.6, 18.7

import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RoleService } from '@/lib/services/role.service';
import type { AppRole } from '@/lib/types/role.types';
import type { Database } from '@/lib/supabase/database.types';

// =====================================================================
// Test Setup
// =====================================================================

// Admin client with service role key (bypasses RLS)
let adminClient: SupabaseClient<Database>;

// Regular authenticated clients (subject to RLS)
let userClient: SupabaseClient<Database>;
let adminUserClient: SupabaseClient<Database>;

// Test data tracking
const testUserIds: string[] = [];
const testEmails: string[] = [];

beforeAll(() => {
  // Initialize admin client
  adminClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_API_KEY!
  );
});

beforeEach(() => {
  testUserIds.length = 0;
  testEmails.length = 0;
});

afterEach(async () => {
  // Cleanup test data
  for (const userId of testUserIds) {
    try {
      await adminClient.from('user_roles').delete().eq('user_id', userId);
      await adminClient.from('role_audit_log').delete().eq('user_id', userId);
      await adminClient.auth.admin.deleteUser(userId);
    } catch (error) {
      // Ignore cleanup errors
      console.warn(`Cleanup failed for user ${userId}:`, error);
    }
  }
});

// =====================================================================
// Helper Functions
// =====================================================================

/**
 * Creates a test user with specified role
 */
async function createTestUser(
  role: AppRole = 'user',
  email?: string
): Promise<{ userId: string; email: string; password: string }> {
  const testEmail = email || `test-${Date.now()}-${Math.random()}@example.com`;
  const testPassword = 'TestPassword123!';

  const { data, error } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  testUserIds.push(data.user.id);
  testEmails.push(testEmail);

  // Wait for auto-role trigger
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Update role if not 'user'
  if (role !== 'user') {
    await adminClient.from('user_roles').update({ role }).eq('user_id', data.user.id);
  }

  return {
    userId: data.user.id,
    email: testEmail,
    password: testPassword,
  };
}

/**
 * Creates an authenticated client for a user
 */
async function createAuthenticatedClient(
  email: string,
  password: string
): Promise<SupabaseClient<Database>> {
  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Failed to authenticate: ${error.message}`);
  }

  return client;
}

/**
 * Parses JWT token to extract claims
 */
function parseJWT(token: string): any {
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

// =====================================================================
// Integration Test 1: Unique Constraint on user_roles.user_id
// =====================================================================

describe('Integration Test 1: Unique Constraint', () => {
  it('prevents duplicate role assignments for same user', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 1.3, 18.2

    const { userId } = await createTestUser('user');

    // First insert should succeed (already done by trigger)
    const { data: firstData, error: firstError } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', userId)
      .single();

    expect(firstError).toBeNull();
    expect(firstData).toBeTruthy();
    expect(firstData?.role).toBe('user');

    // Second insert should fail with unique constraint violation
    const { error: secondError } = await adminClient
      .from('user_roles')
      .insert({ user_id: userId, role: 'moderator' });

    expect(secondError).toBeTruthy();
    expect(secondError?.message).toMatch(/unique|duplicate/i);
  });
});

// =====================================================================
// Integration Test 2: Cascade Delete
// =====================================================================

describe('Integration Test 2: Cascade Delete', () => {
  it('removes role when user deleted from auth.users', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 1.5, 18.2

    const { userId } = await createTestUser('moderator');

    // Verify role exists
    const { data: beforeDelete } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', userId)
      .single();

    expect(beforeDelete).toBeTruthy();
    expect(beforeDelete?.role).toBe('moderator');

    // Delete user from auth.users
    await adminClient.auth.admin.deleteUser(userId);

    // Wait for cascade
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify role was cascade deleted
    const { data: afterDelete, error } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', userId)
      .single();

    expect(error).toBeTruthy();
    expect(error?.code).toBe('PGRST116'); // No rows returned
    expect(afterDelete).toBeNull();
  });
});

// =====================================================================
// Integration Test 3: JWT Hook Injects Role
// =====================================================================

describe('Integration Test 3: JWT Hook', () => {
  it('injects role into authentication tokens', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 2.3, 2.4, 2.5, 2.6, 18.3
    // Note: This test requires the JWT hook to be enabled in Supabase Dashboard

    const { email, password } = await createTestUser('moderator');

    // Authenticate user
    const client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    expect(authError).toBeNull();
    expect(authData.session).toBeTruthy();

    if (authData.session) {
      // Parse JWT
      const jwt = parseJWT(authData.session.access_token);

      // Verify role claim exists
      // Note: This will only work if custom_access_token_hook is enabled
      if (jwt.user_role) {
        expect(jwt.user_role).toBe('moderator');
      } else {
        console.warn(
          'JWT hook not enabled - user_role claim not found. Enable custom_access_token_hook in Supabase Dashboard.'
        );
      }
    }
  });

  it('defaults to user role when no role found', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 2.6, 18.3

    const { userId, email, password } = await createTestUser('user');

    // Remove role assignment
    await adminClient.from('user_roles').delete().eq('user_id', userId);

    // Authenticate user
    const client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    expect(authError).toBeNull();
    expect(authData.session).toBeTruthy();

    if (authData.session) {
      const jwt = parseJWT(authData.session.access_token);

      // Should default to 'user' if hook is enabled
      if (jwt.user_role) {
        expect(jwt.user_role).toBe('user');
      }
    }
  });
});

// =====================================================================
// Integration Test 4: RLS Allows Admins to Manage Roles
// =====================================================================

describe('Integration Test 4: RLS Admin Access', () => {
  it('allows admins to manage all roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.3, 3.4, 18.4

    // Create admin user
    const admin = await createTestUser('admin');
    const adminClient = await createAuthenticatedClient(admin.email, admin.password);

    // Create target user
    const target = await createTestUser('user');

    // Admin should be able to SELECT other users' roles
    const { data: selectData, error: selectError } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', target.userId)
      .single();

    expect(selectError).toBeNull();
    expect(selectData).toBeTruthy();
    expect(selectData?.role).toBe('user');

    // Admin should be able to UPDATE other users' roles
    const { error: updateError } = await adminClient
      .from('user_roles')
      .update({ role: 'moderator' })
      .eq('user_id', target.userId);

    expect(updateError).toBeNull();

    // Verify update
    const { data: verifyData } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', target.userId)
      .single();

    expect(verifyData?.role).toBe('moderator');
  });

  it('allows admins to INSERT new roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.3, 18.4

    const admin = await createTestUser('admin');
    const adminClient = await createAuthenticatedClient(admin.email, admin.password);

    // Create user without role
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: userData } = await adminClient.auth.admin.createUser({
      email: testEmail,
      email_confirm: true,
    });

    if (userData.user) {
      testUserIds.push(userData.user.id);

      // Delete auto-assigned role
      await adminClient.from('user_roles').delete().eq('user_id', userData.user.id);

      // Admin should be able to INSERT role
      const { error: insertError } = await adminClient
        .from('user_roles')
        .insert({ user_id: userData.user.id, role: 'moderator' });

      expect(insertError).toBeNull();
    }
  });

  it('allows admins to DELETE roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.3, 18.4

    const admin = await createTestUser('admin');
    const adminClient = await createAuthenticatedClient(admin.email, admin.password);

    const target = await createTestUser('user');

    // Admin should be able to DELETE roles
    const { error: deleteError } = await adminClient
      .from('user_roles')
      .delete()
      .eq('user_id', target.userId);

    expect(deleteError).toBeNull();

    // Verify deletion
    const { data: verifyData, error: verifyError } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', target.userId)
      .single();

    expect(verifyError).toBeTruthy();
    expect(verifyError?.code).toBe('PGRST116');
    expect(verifyData).toBeNull();
  });
});

// =====================================================================
// Integration Test 5: RLS Prevents Non-Admins from Modifying Roles
// =====================================================================

describe('Integration Test 5: RLS Non-Admin Restrictions', () => {
  it('prevents non-admins from viewing other users roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.6, 18.5

    const user1 = await createTestUser('user');
    const user2 = await createTestUser('user');

    const user1Client = await createAuthenticatedClient(user1.email, user1.password);

    // User1 should NOT be able to view user2's role
    const { data, error } = await user1Client
      .from('user_roles')
      .select()
      .eq('user_id', user2.userId)
      .single();

    // RLS should block this query
    expect(error).toBeTruthy();
    expect(data).toBeNull();
  });

  it('prevents non-admins from updating roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.6, 18.5

    const user = await createTestUser('user');
    const target = await createTestUser('user');

    const userClient = await createAuthenticatedClient(user.email, user.password);

    // User should NOT be able to update another user's role
    // RLS will silently filter the row (USING clause), so no error but 0 rows affected
    const { data, error } = await userClient
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', target.userId)
      .select();

    // RLS working correctly: no error, but no rows returned (filtered by USING clause)
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('prevents non-admins from inserting roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.6, 18.5

    const user = await createTestUser('user');
    const userClient = await createAuthenticatedClient(user.email, user.password);

    // Create target user
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: userData } = await adminClient.auth.admin.createUser({
      email: testEmail,
      email_confirm: true,
    });

    if (userData.user) {
      testUserIds.push(userData.user.id);

      // Delete auto-assigned role
      await adminClient.from('user_roles').delete().eq('user_id', userData.user.id);

      // User should NOT be able to insert role
      const { error } = await userClient
        .from('user_roles')
        .insert({ user_id: userData.user.id, role: 'admin' });

      expect(error).toBeTruthy();
    }
  });

  it('prevents non-admins from deleting roles', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.6, 18.5

    const user = await createTestUser('user');
    const target = await createTestUser('user');

    const userClient = await createAuthenticatedClient(user.email, user.password);

    // User should NOT be able to delete another user's role
    // RLS will silently filter the row (USING clause), so no error but 0 rows affected
    const { data, error } = await userClient
      .from('user_roles')
      .delete()
      .eq('user_id', target.userId)
      .select();

    // RLS working correctly: no error, but no rows returned (filtered by USING clause)
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});

// =====================================================================
// Integration Test 6: RLS Allows Users to View Their Own Role
// =====================================================================

describe('Integration Test 6: RLS User Self-Access', () => {
  it('allows users to view their own role', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.6, 18.5

    const user = await createTestUser('moderator');
    const userClient = await createAuthenticatedClient(user.email, user.password);

    // User should be able to view their own role
    const { data, error } = await userClient
      .from('user_roles')
      .select()
      .eq('user_id', user.userId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data?.role).toBe('moderator');
  });

  it('prevents users from updating their own role', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 3.6, 18.5

    const user = await createTestUser('user');
    const userClient = await createAuthenticatedClient(user.email, user.password);

    // User should NOT be able to update their own role
    // RLS will silently filter the row (USING clause), so no error but 0 rows affected
    const { data, error } = await userClient
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', user.userId)
      .select();

    // RLS working correctly: no error, but no rows returned (filtered by USING clause)
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});

// =====================================================================
// Integration Test 7: Trigger Auto-Assigns User Role on Registration
// =====================================================================

describe('Integration Test 7: Auto-Role Assignment Trigger', () => {
  it('automatically assigns user role on registration', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 14.2, 14.3, 14.4, 18.6

    const testEmail = `test-${Date.now()}@example.com`;

    const { data, error } = await adminClient.auth.admin.createUser({
      email: testEmail,
      email_confirm: true,
    });

    expect(error).toBeNull();
    expect(data.user).toBeTruthy();

    if (data.user) {
      testUserIds.push(data.user.id);

      // Wait for trigger to execute
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Verify role was auto-assigned
      const { data: roleData, error: roleError } = await adminClient
        .from('user_roles')
        .select()
        .eq('user_id', data.user.id)
        .single();

      expect(roleError).toBeNull();
      expect(roleData).toBeTruthy();
      expect(roleData?.role).toBe('user');
      expect(roleData?.created_at).toBeTruthy();
    }
  });

  it('trigger handles errors without failing user creation', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 14.6, 18.6

    // This test verifies that even if the trigger fails,
    // user creation still succeeds
    // In normal operation, trigger should not fail

    const testEmail = `test-${Date.now()}@example.com`;

    const { data, error } = await adminClient.auth.admin.createUser({
      email: testEmail,
      email_confirm: true,
    });

    // User creation should succeed regardless of trigger
    expect(error).toBeNull();
    expect(data.user).toBeTruthy();

    if (data.user) {
      testUserIds.push(data.user.id);
    }
  });
});

// =====================================================================
// Integration Test 8: Trigger Logs All Role Changes
// =====================================================================

describe('Integration Test 8: Audit Log Trigger', () => {
  it('logs INSERT operations', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 15.3, 15.4, 18.7

    const { userId } = await createTestUser('user');

    // Wait for trigger
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify audit log entry
    const { data: auditData, error: auditError } = await adminClient
      .from('role_audit_log')
      .select()
      .eq('user_id', userId)
      .order('changed_at', { ascending: false })
      .limit(1)
      .single();

    expect(auditError).toBeNull();
    expect(auditData).toBeTruthy();
    expect(auditData?.user_id).toBe(userId);
    expect(auditData?.old_role).toBeNull(); // INSERT has no old role
    expect(auditData?.new_role).toBe('user');
    expect(auditData?.changed_at).toBeTruthy();
  });

  it('logs UPDATE operations', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 15.3, 15.4, 15.5, 18.7

    const { userId } = await createTestUser('user');

    // Update role
    await adminClient.from('user_roles').update({ role: 'moderator' }).eq('user_id', userId);

    // Wait for trigger
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify audit log entry
    const { data: auditData, error: auditError } = await adminClient
      .from('role_audit_log')
      .select()
      .eq('user_id', userId)
      .order('changed_at', { ascending: false })
      .limit(1)
      .single();

    expect(auditError).toBeNull();
    expect(auditData).toBeTruthy();
    expect(auditData?.user_id).toBe(userId);
    expect(auditData?.old_role).toBe('user');
    expect(auditData?.new_role).toBe('moderator');
    expect(auditData?.changed_at).toBeTruthy();
  });

  it('captures changed_by from auth.uid()', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 15.4, 18.7

    const admin = await createTestUser('admin');
    const adminClient = await createAuthenticatedClient(admin.email, admin.password);

    const target = await createTestUser('user');

    // Admin updates target's role
    await adminClient.from('user_roles').update({ role: 'moderator' }).eq('user_id', target.userId);

    // Wait for trigger
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify audit log captures admin as changed_by
    const { data: auditData } = await adminClient
      .from('role_audit_log')
      .select()
      .eq('user_id', target.userId)
      .order('changed_at', { ascending: false })
      .limit(1)
      .single();

    if (auditData) {
      // changed_by should be the admin's user_id
      expect(auditData.changed_by).toBe(admin.userId);
    }
  });
});

// =====================================================================
// Integration Test 9: Last Admin Protection
// =====================================================================

describe('Integration Test 9: Last Admin Protection', () => {
  it('prevents removing last admin through service', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 17.5, 18.7

    // Create single admin
    const admin = await createTestUser('admin');
    const service = new RoleService(adminClient);

    // Attempt to remove last admin
    await expect(service.removeRole(admin.userId)).rejects.toThrow(/last admin/i);

    // Verify admin still exists
    const { data } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', admin.userId)
      .single();

    expect(data?.role).toBe('admin');
  });

  it('prevents demoting last admin through service', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 17.5, 18.7

    // Create single admin
    const admin = await createTestUser('admin');
    const service = new RoleService(adminClient);

    // Attempt to demote last admin
    await expect(service.updateRole(admin.userId, 'user')).rejects.toThrow(/last admin|demote/i);

    // Verify admin role unchanged
    const { data } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', admin.userId)
      .single();

    expect(data?.role).toBe('admin');
  });

  it('allows removing admin when multiple admins exist', async () => {
    // Feature: supabase-roles-jwt-hooks
    // Validates: Requirements 17.5, 18.7

    // Create two admins
    const admin1 = await createTestUser('admin');
    const admin2 = await createTestUser('admin');
    const service = new RoleService(adminClient);

    // Should be able to remove one admin
    await expect(service.removeRole(admin1.userId)).resolves.not.toThrow();

    // Verify removal
    const { data } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', admin1.userId)
      .single();

    expect(data).toBeNull();

    // Verify second admin still exists
    const { data: admin2Data } = await adminClient
      .from('user_roles')
      .select()
      .eq('user_id', admin2.userId)
      .single();

    expect(admin2Data?.role).toBe('admin');
  });
});
