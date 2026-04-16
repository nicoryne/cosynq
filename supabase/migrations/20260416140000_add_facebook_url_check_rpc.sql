-- =====================================================================
-- Migration: Add Facebook URL Availability Check RPC
-- =====================================================================
-- Description: Adds a SECURITY DEFINER function to securely check
--              if a Facebook URL is already claimed.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.check_facebook_url_exists(lookup_url text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
begin
  return exists (
    select 1 from public.user_profiles where facebook_url = lookup_url
  );
end;
$$;

-- Add description for database documentation
COMMENT ON FUNCTION public.check_facebook_url_exists(text) IS 
'Securely checks if a Facebook URL is already registered to a profile. Used by the sign-up wizard for real-time validation.';
