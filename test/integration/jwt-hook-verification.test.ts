// =====================================================================
// JWT Hook Verification Test
// =====================================================================
// Quick test to verify the custom_access_token_hook is working
// Run this test first to ensure the hook is properly configured

import { describe, it, expect, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

// Test data tracking
const testUserIds: string[] = [];

afterEach(async () => {
  const adminClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_API_KEY!
  );

  for (const userId of testUserIds) {
    try {
      await adminClient.from('user_roles').delete().eq('user_id', userId);
      await adminClient.auth.admin.deleteUser(userId);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
  testUserIds.length = 0;
});

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

describe('JWT Hook Verification', () => {
  it('verifies custom_access_token_hook is enabled and working', async () => {
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_API_KEY!
    );

    // Create test user with admin role
    const testEmail = `jwt-test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    expect(createError).toBeNull();
    expect(userData.user).toBeTruthy();

    if (!userData.user) {
      throw new Error('Failed to create test user');
    }

    testUserIds.push(userData.user.id);

    // Wait for auto-role trigger
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update to admin role
    const { error: updateError } = await adminClient
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', userData.user.id);

    expect(updateError).toBeNull();

    // Authenticate user to get JWT
    const authClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    expect(authError).toBeNull();
    expect(authData.session).toBeTruthy();

    if (!authData.session) {
      throw new Error('Failed to authenticate user');
    }

    // Parse JWT and check for user_role claim
    const jwt = parseJWT(authData.session.access_token);

    console.log('\n=== JWT Hook Verification ===');
    console.log('JWT Claims:', JSON.stringify(jwt, null, 2));
    console.log('user_role claim:', jwt.user_role);
    console.log('Expected role: admin');
    console.log('============================\n');

    // Verify user_role claim exists and is correct
    expect(jwt.user_role).toBeDefined();
    expect(jwt.user_role).toBe('admin');

    // Test RLS policy with the authenticated client
    const { data: roleData, error: roleError } = await authClient
      .from('user_roles')
      .select()
      .eq('user_id', userData.user.id)
      .single();

    console.log('\n=== RLS Policy Test ===');
    console.log('Query error:', roleError);
    console.log('Query data:', roleData);
    console.log('=======================\n');

    // If JWT hook is working, this should succeed
    if (jwt.user_role === 'admin') {
      expect(roleError).toBeNull();
      expect(roleData).toBeTruthy();
      expect(roleData?.role).toBe('admin');
    }
  });

  it('verifies JWT hook defaults to user role when no role assigned', async () => {
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_API_KEY!
    );

    // Create test user
    const testEmail = `jwt-test-default-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    expect(createError).toBeNull();
    expect(userData.user).toBeTruthy();

    if (!userData.user) {
      throw new Error('Failed to create test user');
    }

    testUserIds.push(userData.user.id);

    // Wait for auto-role trigger
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Authenticate user to get JWT
    const authClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    expect(authError).toBeNull();
    expect(authData.session).toBeTruthy();

    if (!authData.session) {
      throw new Error('Failed to authenticate user');
    }

    // Parse JWT and check for user_role claim
    const jwt = parseJWT(authData.session.access_token);

    console.log('\n=== JWT Hook Default Role Test ===');
    console.log('user_role claim:', jwt.user_role);
    console.log('Expected role: user');
    console.log('==================================\n');

    // Should default to 'user'
    expect(jwt.user_role).toBeDefined();
    expect(jwt.user_role).toBe('user');
  });
});
