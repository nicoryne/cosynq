-- Function to check if an email already exists in auth.users
-- This is used to implement "check email availability" safely without exposing the users table
CREATE OR REPLACE FUNCTION check_email_exists(lookup_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- executes with privileges of the user that created it (supabase_admin)
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE LOWER(email) = LOWER(lookup_email)
  );
END;
$$;

-- Grant execution to anon and authenticated users for the sign-up flow
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO anon, authenticated;
