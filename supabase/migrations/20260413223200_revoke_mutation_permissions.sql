-- =====================================================================
-- Migration: Revoke Mutation Permissions from Authenticated
-- =====================================================================
-- Description: Removes INSERT, UPDATE, DELETE permissions from authenticated role
--              Only SELECT is needed for users to view their own roles
--              Admin operations will work through RLS policies
-- =====================================================================

-- Revoke mutation permissions
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

-- Verify SELECT is still granted (for viewing own role)
GRANT SELECT ON public.user_roles TO authenticated;

-- With this setup:
-- - Regular users: Can SELECT (filtered by RLS to own role only)
-- - Admin users: Can SELECT, INSERT, UPDATE, DELETE (via RLS policies)
-- - The RLS policies check the JWT claim and allow admin operations
