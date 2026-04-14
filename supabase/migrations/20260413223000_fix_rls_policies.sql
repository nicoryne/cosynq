-- =====================================================================
-- Migration: Fix RLS Policies for Custom JWT Claims
-- =====================================================================
-- Description: Adjusts RLS policies to properly work with custom JWT claims
--              The issue is that RLS policies need the authenticated role
--              to have SELECT permission to evaluate the policies
--
-- Background: Even though RLS policies control access, the authenticated
--             role needs basic SELECT permission for the policy evaluation
--             to work. The policy then further restricts based on JWT claims.
-- =====================================================================

-- Grant SELECT permission to authenticated role
-- This allows the RLS policy evaluation to proceed
-- The RLS policies will then restrict based on JWT claims
GRANT SELECT ON public.user_roles TO authenticated;

-- For mutations, we still rely on RLS policies to check admin role
-- But we need to grant the permissions for the policy to evaluate
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Same for audit log
GRANT SELECT ON public.role_audit_log TO authenticated;

-- Note: The RLS policies will still enforce that only admins can
-- actually perform these operations. This just allows the policy
-- evaluation to proceed.
