-- =====================================================================
-- Migration: Add get_email_for_auth RPC
-- =====================================================================
-- Description: Creates a secure function to retrieve a user's email 
--              given their username. This supports username-based sign-in
--              without requiring administrative privileges for the lookup.
-- =====================================================================

-- Function to check if an email already exists in auth.users by username
CREATE OR REPLACE FUNCTION public.get_email_for_auth(lookup_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- executes with privileges of the user that created it (supabase_admin)
SET search_path = public
AS $$
DECLARE
    found_email text;
BEGIN
    -- Join user_profiles with auth.users to resolve username to email
    SELECT au.email INTO found_email
    FROM public.user_profiles up
    JOIN auth.users au ON up.id = au.id
    WHERE LOWER(up.username) = LOWER(lookup_username)
    LIMIT 1;
    
    RETURN found_email;
END;
$$;

-- Grant execution to anon and authenticated users for the sign-in flow
GRANT EXECUTE ON FUNCTION public.get_email_for_auth(text) TO anon, authenticated;

-- Add description for database documentation
COMMENT ON FUNCTION public.get_email_for_auth(text) IS 
'Securely retrieves a user email given their username to support username-based sign-in.';
