-- =====================================================================
-- Migration: Remove get_email_for_auth RPC
-- =====================================================================
-- Description: Removes the get_email_for_auth function to improve 
--              security by closing the public username-to-email 
--              resolution endpoint.
-- =====================================================================

DROP FUNCTION IF EXISTS public.get_email_for_auth(text);

-- Function removed
