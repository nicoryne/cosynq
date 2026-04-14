# Integration Tests

This directory contains integration tests for the Supabase Roles JWT Hooks feature.

## Setup Requirements

Integration tests require direct database access and authentication capabilities. You need to configure the following environment variables in your `.env.local` file:

```env
# Required for all tests
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_API_KEY=your-secret-api-key
```

### Where to Find These Keys

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → **publishable** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Project API keys** → **secret** → `SUPABASE_SECRET_API_KEY` (⚠️ Keep this secret!)

## Running Integration Tests

```bash
# Run all integration tests
npx vitest run test/integration/

# Run specific integration test file
npx vitest run test/integration/role.integration.test.ts

# Run in watch mode
npx vitest test/integration/
```

## Test Coverage

The integration test suite validates:

1. **Database Constraints**
   - Unique constraint on `user_roles.user_id`
   - Cascade delete when user removed from `auth.users`

2. **JWT Hook Behavior**
   - Role injection into authentication tokens
   - Default to 'user' role when no role found
   - Note: Requires `custom_access_token_hook` to be enabled in Supabase Dashboard

3. **Row Level Security (RLS) Policies**
   - Admin users can manage all roles (SELECT, INSERT, UPDATE, DELETE)
   - Non-admin users cannot view or modify other users' roles
   - Users can view their own role
   - Users cannot modify their own role

4. **Database Triggers**
   - Auto-assignment of 'user' role on registration
   - Audit logging of all role changes (INSERT and UPDATE)
   - Capture of `changed_by` from `auth.uid()`

5. **Service Layer Business Logic**
   - Last admin protection (cannot remove or demote last admin)
   - Allows admin removal when multiple admins exist

## Important Notes

### JWT Hook Testing

The JWT hook tests (`Integration Test 3`) require the `custom_access_token_hook` to be enabled in your Supabase Dashboard:

1. Navigate to **Dashboard** → **Authentication** → **Hooks**
2. Enable **Custom Access Token** hook
3. Select `public.custom_access_token_hook` function
4. Save configuration

If the hook is not enabled, these tests will log a warning but won't fail.

### Test Data Cleanup

All tests automatically clean up test data after execution:
- Test users are deleted from `auth.users`
- Role assignments are removed from `user_roles`
- Audit log entries are removed from `role_audit_log`

### Service Role Key Security

⚠️ **NEVER commit your secret API key to version control!**

The secret API key bypasses Row Level Security and should only be used:
- In server-side code
- In CI/CD pipelines (as encrypted secrets)
- For testing purposes in local development

## Troubleshooting

### Error: "SUPABASE_SECRET_API_KEY is not set"

Add the secret API key to your `.env.local` file. See setup requirements above.

### Error: "Failed to create test user"

Ensure your Supabase project is running and accessible. Check:
- Project URL is correct
- Secret API key is valid
- Network connectivity to Supabase

### JWT Hook Tests Show Warning

If you see "JWT hook not enabled" warnings, enable the custom access token hook in your Supabase Dashboard (see JWT Hook Testing section above).

### RLS Tests Failing

Ensure RLS policies are correctly applied:
```bash
# Reset database to apply migrations
npx supabase db reset

# Or push migrations to remote
npx supabase db push
```

## Test Execution Time

Integration tests interact with a real database and may take longer than unit tests:
- Expected duration: 10-30 seconds for full suite
- Individual tests: 100-500ms each
- Cleanup operations add ~200ms per test

## CI/CD Integration

For CI/CD pipelines, store Supabase credentials as encrypted secrets:

```yaml
# Example GitHub Actions
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.SUPABASE_PUBLISHABLE_KEY }}
  SUPABASE_SECRET_API_KEY: ${{ secrets.SUPABASE_SECRET_API_KEY }}
```
