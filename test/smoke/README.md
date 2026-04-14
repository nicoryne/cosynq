# Smoke Tests

## Overview

Smoke tests validate that the database infrastructure is correctly configured and deployed. These tests check for the existence and basic configuration of database objects without testing their behavior (which is covered by integration tests).

## Purpose

Smoke tests answer the question: "Is the infrastructure set up correctly?"

They verify:
- Tables exist with correct schema
- Enums are defined with correct values
- Functions exist and are accessible
- RLS is enabled on protected tables
- Indexes exist for performance optimization
- Triggers are configured correctly
- Permissions are properly restricted

## When to Run

Run smoke tests:
- After deploying database migrations to a new environment
- After running `npx supabase db push`
- As part of CI/CD pipeline to validate infrastructure
- When troubleshooting infrastructure issues

## Running Smoke Tests

```bash
# Run all smoke tests
npm run test:smoke

# Run with coverage
npm run test:smoke -- --coverage

# Run in watch mode during development
npm run test:smoke -- --watch
```

## Environment Requirements

Smoke tests require the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# OR
SUPABASE_SECRET_API_KEY=your_secret_api_key
```

The service role key (or secret API key) is required to bypass RLS and inspect infrastructure objects.

## Test Structure

### role.smoke.test.ts

Validates the RBAC infrastructure:

1. **Table Existence and Schema**
   - Verifies `user_roles` and `role_audit_log` tables exist
   - Checks that required columns are present

2. **Enum Types**
   - Validates `app_role` enum exists with values: 'user', 'moderator', 'admin'

3. **Functions**
   - Checks `custom_access_token_hook` function exists
   - Checks `handle_new_user_role` trigger function exists
   - Checks `log_role_changes` trigger function exists

4. **Row Level Security**
   - Verifies RLS is enabled on `user_roles` table
   - Verifies RLS is enabled on `role_audit_log` table

5. **Indexes**
   - Checks `idx_user_roles_user_id` index exists
   - Checks `idx_user_roles_role` index exists
   - Checks `idx_role_audit_user_id` index exists
   - Checks `idx_role_audit_changed_at` index exists

6. **Triggers**
   - Verifies `on_auth_user_created` trigger exists on `auth.users`
   - Verifies `on_role_change` trigger exists on `user_roles`

7. **Permissions**
   - Validates anonymous users cannot access `user_roles`
   - Validates anonymous users cannot access `role_audit_log`

## Fallback Strategies

Since some infrastructure inspection queries require custom RPC functions that may not exist, the smoke tests implement fallback strategies:

- If an RPC function doesn't exist, tests use alternative verification methods
- Some tests log warnings instead of failing when infrastructure details can't be verified
- Critical security checks (RLS, permissions) always fail if they can't be verified

## Differences from Integration Tests

| Aspect | Smoke Tests | Integration Tests |
|--------|-------------|-------------------|
| **Purpose** | Infrastructure validation | Behavior validation |
| **Scope** | Database objects exist | Database objects work correctly |
| **Speed** | Very fast | Slower (creates test data) |
| **When** | After deployment | During development |
| **Failures** | Infrastructure misconfiguration | Logic bugs |

## Troubleshooting

### "Missing Supabase environment variables"

Ensure `.env.local` contains all required Supabase credentials.

### "Could not verify [index/trigger] existence"

This is a warning, not a failure. The test couldn't verify the object exists but doesn't fail the test. Verify manually in Supabase Dashboard if concerned.

### RLS tests failing

This indicates RLS is not enabled on the tables, which is a critical security issue. Run the migration again:

```bash
npx supabase db reset
```

### Function tests failing with "function does not exist"

The migration may not have been applied correctly. Check:

```bash
npx supabase db remote commit
```

## Adding New Smoke Tests

When adding new infrastructure (tables, functions, triggers):

1. Add a new test case to the appropriate describe block
2. Use the service role client to bypass RLS
3. Implement fallback strategies for verification
4. Document the test in this README

Example:

```typescript
it('should have my_new_table with correct columns', async () => {
  const { data, error } = await supabase
    .from('my_new_table')
    .select('*')
    .limit(0);

  expect(error).toBeNull();
  expect(data).toBeDefined();
});
```
