-- =====================================================================
-- Migration: Fix RLS Policy Role Assignment
-- =====================================================================
-- Description: Updates RLS policies to explicitly specify they apply
--              to the 'authenticated' role, not 'public'
--
-- Issue: Policies were created without specifying TO clause, defaulting
--        to 'public' role. They should apply to 'authenticated' role.
--
-- Solution: Recreate all policies with explicit TO authenticated clause
-- =====================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can select all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

-- Recreate policies with explicit TO authenticated clause

-- Admin policies - all operations for users with admin role in JWT
CREATE POLICY "Admins can select all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'user_role')::text = 'admin')
WITH CHECK ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'user_role')::text = 'admin');

-- User policy - authenticated users can view their own role
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================================
-- Fix role_audit_log policies as well
-- =====================================================================

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.role_audit_log;
DROP POLICY IF EXISTS "Users can view their own audit log" ON public.role_audit_log;

CREATE POLICY "Admins can view audit logs"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'user_role')::text = 'admin');

CREATE POLICY "Users can view their own audit log"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================================
-- Verification
-- =====================================================================
-- After applying this migration:
-- 1. All policies should show "authenticated" in the APPLIED TO column
-- 2. Non-authenticated (anon) users should be completely blocked
-- 3. Authenticated non-admin users can only SELECT their own role
-- 4. Authenticated admin users can perform all operations
-- =====================================================================
