// Diagnostic script to check RLS and JWT hook
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_API_KEY!
);

async function checkRLS() {
  console.log('🔍 Checking RLS Policies and JWT Hook...\n');

  // Create a test user
  const testEmail = `diagnostic-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  console.log('1. Creating test user...');
  const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
  });

  if (createError || !userData.user) {
    console.error('❌ Failed to create user:', createError);
    return;
  }

  const userId = userData.user.id;
  console.log(`✅ User created: ${userId}\n`);

  // Wait for trigger
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if role was auto-assigned
  console.log('2. Checking auto-assigned role...');
  const { data: roleData } = await adminClient
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .single();

  console.log('Role data:', roleData);

  // Sign in as the user
  console.log('\n3. Signing in as user...');
  const userClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: authData, error: authError } = await userClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (authError || !authData.session) {
    console.error('❌ Failed to sign in:', authError);
    await cleanup(userId);
    return;
  }

  // Parse JWT
  const token = authData.session.access_token;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const jwt = JSON.parse(jsonPayload);

  console.log('\n4. JWT Claims:');
  console.log('  - user_role:', jwt.user_role || '❌ NOT FOUND');
  console.log('  - sub (user_id):', jwt.sub);

  // Test RLS - try to update own role
  console.log('\n5. Testing RLS - user trying to update own role...');
  const { data: updateData, error: updateError, count } = await userClient
    .from('user_roles')
    .update({ role: 'admin' })
    .eq('user_id', userId)
    .select();

  if (updateError) {
    console.log('✅ RLS WORKING - Update blocked with error:', updateError.message);
  } else if (!updateData || updateData.length === 0) {
    console.log('✅ RLS WORKING - Update silently filtered (0 rows affected)');
    console.log('   This is correct RLS behavior - no error, but no rows updated');
  } else {
    console.log('❌ RLS NOT WORKING - Update succeeded and returned data');
    console.log('   Data:', updateData);
  }

  // Cleanup
  await cleanup(userId);
}

async function cleanup(userId: string) {
  console.log('\n6. Cleaning up...');
  await adminClient.from('user_roles').delete().eq('user_id', userId);
  await adminClient.from('role_audit_log').delete().eq('user_id', userId);
  await adminClient.auth.admin.deleteUser(userId);
  console.log('✅ Cleanup complete');
}

checkRLS().catch(console.error);
