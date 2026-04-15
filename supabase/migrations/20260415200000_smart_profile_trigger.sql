-- =====================================================================
-- Migration: Smart User Profile Trigger
-- =====================================================================
-- Description: Updates the auto-profile creation trigger to utilize
--              metadata passed during sign-up, ensuring the chosen 
--              username is populated immediately.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    input_username TEXT;
    input_display_name TEXT;
BEGIN
    -- Extract username and display_name from metadata if present
    -- This handles the case where sign-up provides the data immediately
    input_username := (NEW.raw_user_meta_data->>'username');
    input_display_name := (NEW.raw_user_meta_data->>'display_name');

    -- Create profile
    INSERT INTO public.user_profiles (
        id, 
        username, 
        display_name
    )
    VALUES (
        NEW.id, 
        COALESCE(input_username, 'user_' || substring(NEW.id::text, 1, 8)),
        COALESCE(input_display_name, input_username)
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name
    WHERE user_profiles.username LIKE 'user_%'; -- Only override if current is temporary

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create/sync user profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user_profile() IS 
'Trigger function that automatically creates or syncs a user_profiles record using sign-up metadata.';
