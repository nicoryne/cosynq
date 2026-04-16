-- =====================================================================
-- Migration: Add Simple Facebook Link
-- =====================================================================
-- Description: Adds a unique facebook_url field to user_profiles for 
--              identity verification and anti-catfishing measures.
-- =====================================================================

-- 1. Add facebook_url column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- 2. Add UNIQUE constraint
-- Note: UNIQUE constraints in Postgres allow multiple NULL values by default.
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_facebook_url_key UNIQUE (facebook_url);

-- 3. Add index for performance on lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_facebook_url ON public.user_profiles(facebook_url);

-- 4. Add column comment
COMMENT ON COLUMN public.user_profiles.facebook_url IS 
'Verified Facebook Profile URL. Linked to account to prevent identity theft and catfishing. Must be unique across all citizens.';
