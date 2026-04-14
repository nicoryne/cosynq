-- =====================================================================
-- Migration: Fix RLS Policies V2 - Proper Permission Model
-- =====================================================================
-- Description: Fixes RLS policy enforcement for mutations
--              
-- The issue: We granted UPDATE/DELETE to authenticated, which allows
-- all authenticated users to perform these operations. The RLS policies
-- should block non-admins, but they're not being enforced properly.
--
-- Solution: Keep the grants (needed for RLS evaluation) but ensure
-- the RLS policies are correctly structured to deny non-admin access.
-- =====================================================================

-- The grants are actually needed for RLS policies to evaluate
-- But we need to ensure the policies are restrictive enough

-- Recreate the admin policy with explicit operation checks
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- Separate policies for different operations for clarity
CREATE POLICY "Admins can select all roles"
ON public.user_roles
FOR SELECT
USING ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING ((auth.jwt() ->> 'user_role')::text = 'admin')
WITH CHECK ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING ((auth.jwt() ->> 'user_role')::text = 'admin');

-- The "Users can view their own role" policy remains unchanged
-- It only applies to SELECT operations

