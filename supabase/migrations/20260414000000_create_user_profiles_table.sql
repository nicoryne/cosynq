-- =====================================================================
-- Migration: Create User Profiles Table
-- =====================================================================
-- Description: Creates the user_profiles table for storing extended user
--              information including username, display name, bio, avatar,
--              location, and website. Implements strict RLS policies and
--              automatic timestamp management.
--
-- Deployment Workflow:
--   1. Apply migration: npx supabase db push
--   2. Regenerate types: npx supabase gen types typescript --project-id euhfhbpcqsfkfhmyvrzw > lib/supabase/database.types.ts
--   3. Verify table structure and RLS policies
--   4. Test profile creation during sign-up flow
--
-- Rollback Instructions:
--   - DROP TRIGGER on_auth_user_created_profile ON auth.users;
--   - DROP TRIGGER on_user_profiles_update ON public.user_profiles;
--   - DROP FUNCTION public.handle_new_user_profile();
--   - DROP FUNCTION public.update_user_profiles_updated_at();
--   - DROP TABLE public.user_profiles;
--
-- Security Model:
--   - RLS enabled with strict policies
--   - All authenticated users can read all profiles (public directory)
--   - Users can only update their own profile
--   - Users can only insert their own profile during sign-up
--   - Auto-generated temporary username on user creation
-- =====================================================================

-- =====================================================================
-- SECTION 1: Create user_profiles table
-- =====================================================================
-- Stores extended user profile information
-- Links to auth.users via foreign key with CASCADE delete

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  avatar_public_id TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================================
-- SECTION 2: Create indexes for performance
-- =====================================================================
-- Optimizes username lookups and profile queries

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at DESC);

-- =====================================================================
-- SECTION 3: Create auto-update trigger for updated_at
-- =====================================================================
-- Automatically updates the updated_at timestamp on profile changes

CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_profiles_update
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();

COMMENT ON FUNCTION public.update_user_profiles_updated_at() IS 
'Trigger function that automatically updates the updated_at timestamp when a profile is modified.';

-- =====================================================================
-- SECTION 4: Create auto-profile creation trigger
-- =====================================================================
-- Automatically creates a user_profiles record when a new user registers
-- Assigns a temporary username that will be updated during sign-up

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile with temporary username
  -- Username will be updated during sign-up wizard completion
  INSERT INTO public.user_profiles (id, username)
  VALUES (NEW.id, 'user_' || substring(NEW.id::text, 1, 8))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

COMMENT ON FUNCTION public.handle_new_user_profile() IS 
'Trigger function that automatically creates a user_profiles record with temporary username when a new user registers.';

-- =====================================================================
-- SECTION 5: Enable Row Level Security
-- =====================================================================
-- Implements defense-in-depth security model
-- RLS policies enforce access control at database level

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- SECTION 6: RLS Policies for user_profiles table
-- =====================================================================

-- Policy: All authenticated users can read all profiles
-- Enables public user directory and profile discovery
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.user_profiles;
CREATE POLICY "Authenticated users can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can update only their own profile
-- Prevents unauthorized profile modifications
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile during sign-up
-- Allows profile creation during registration flow
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- =====================================================================
-- SECTION 7: Table and Column Comments
-- =====================================================================
-- Documentation for database schema

COMMENT ON TABLE public.user_profiles IS 
'Stores extended user profile information including username, display name, bio, avatar, location, and website. Linked to auth.users via foreign key.';

COMMENT ON COLUMN public.user_profiles.id IS 
'UUID primary key, references auth.users(id) with CASCADE delete';

COMMENT ON COLUMN public.user_profiles.username IS 
'Unique username for the user (required). Used for @mentions and profile URLs.';

COMMENT ON COLUMN public.user_profiles.display_name IS 
'Optional display name (can differ from username). Shown in UI.';

COMMENT ON COLUMN public.user_profiles.bio IS 
'Optional user biography. Supports markdown formatting.';

COMMENT ON COLUMN public.user_profiles.avatar_url IS 
'Cloudinary secure URL for profile picture. Generated during upload.';

COMMENT ON COLUMN public.user_profiles.avatar_public_id IS 
'Cloudinary public ID for image management. Used for deletions and transformations.';

COMMENT ON COLUMN public.user_profiles.location IS 
'Optional user location. Free-form text field.';

COMMENT ON COLUMN public.user_profiles.website IS 
'Optional user website URL. Must be valid URL format.';

COMMENT ON COLUMN public.user_profiles.created_at IS 
'UTC timestamp of profile creation. Auto-generated.';

COMMENT ON COLUMN public.user_profiles.updated_at IS 
'UTC timestamp of last profile update. Auto-updated by trigger.';

-- =====================================================================
-- SECTION 8: Verification Queries
-- =====================================================================
-- Run these queries after deployment to verify the system is working

-- Verify table exists with correct structure
/*
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;
*/

-- Verify indexes exist
/*
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';
-- Expected: idx_user_profiles_username (UNIQUE), idx_user_profiles_created_at
*/

-- Verify RLS is enabled
/*
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';
-- Expected: rowsecurity = true
*/

-- Verify RLS policies exist
/*
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_profiles';
-- Expected: 3 policies (SELECT, UPDATE, INSERT)
*/

-- Verify triggers exist
/*
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'user_profiles'
  OR (trigger_schema = 'public' AND trigger_name = 'on_auth_user_created_profile');
-- Expected: on_user_profiles_update, on_auth_user_created_profile
*/

-- Verify foreign key constraint
/*
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'user_profiles';
-- Expected: id references auth.users(id) with CASCADE delete
*/

-- =====================================================================
-- SECTION 9: Post-Deployment Checklist
-- =====================================================================
-- 
-- [ ] 1. Migration applied successfully: npx supabase db push
-- [ ] 2. No errors in migration output
-- [ ] 3. All verification queries return expected results
-- [ ] 4. TypeScript types regenerated:
--        npx supabase gen types typescript --project-id euhfhbpcqsfkfhmyvrzw > lib/supabase/database.types.ts
-- [ ] 5. Test user registration creates profile automatically
-- [ ] 6. Verify temporary username is generated correctly
-- [ ] 7. Test username uniqueness constraint
-- [ ] 8. Test RLS policies (users can only update own profile)
-- [ ] 9. Test updated_at trigger (timestamp updates on changes)
-- [ ] 10. Verify CASCADE delete (deleting auth.users removes profile)
--
-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
