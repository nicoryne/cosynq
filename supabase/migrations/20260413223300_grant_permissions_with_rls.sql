-- =====================================================================
-- Migration: Grant Permissions with RLS Enforcement
-- =====================================================================
-- Description: Grants necessary permissions to authenticated role
--              RLS policies will enforce who can actually use these permissions
--
-- How Supabase RLS works:
-- 1. Grant base permissions to the role (INSERT, UPDATE, DELETE)
-- 2. Enable RLS on the table
-- 3. Create policies that filter access based on conditions
-- 4. Only operations that match a policy are allowed
--
-- With this model:
-- - authenticated role has INSERT, UPDATE, DELETE permissions
-- - But RLS policies only allow these for users with 'admin' in JWT
-- - Non-admin users will be blocked by RLS even though they have the grant
-- =====================================================================

-- Grant all permissions to authenticated role
-- RLS policies will filter access
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- Verify RLS is enabled (it should be from the original migration)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- The RLS policies created in the previous migration will enforce:
-- - "Admins can select all roles" - SELECT for admin only
-- - "Admins can insert roles" - INSERT for admin only  
-- - "Admins can update roles" - UPDATE for admin only
-- - "Admins can delete roles" - DELETE for admin only
-- - "Users can view their own role" - SELECT for own role

-- With RLS enabled and these policies:
-- - Admin users (JWT claim user_role = 'admin'): All operations allowed
-- - Regular users: Only SELECT their own role
-- - Non-admin trying UPDATE/DELETE: Blocked by RLS (no matching policy)
