-- Function to check if a username already exists in user_profiles
-- This ensures unauthenticated users can perform username uniqueness checks safely.
CREATE OR REPLACE FUNCTION check_username_exists(lookup_username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles WHERE LOWER(username) = LOWER(lookup_username)
  );
END;
$$;

-- Grant execution to anon and authenticated users
GRANT EXECUTE ON FUNCTION check_username_exists(text) TO anon, authenticated;
