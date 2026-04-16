-- =====================================================================
-- Migration: Isolate Account Telemetry
-- =====================================================================
-- Description: Surgically moves administrative account markers from 
--              user_profiles to a dedicated high-security account_telemetry table.
-- =====================================================================

-- 1. Create the Isolated Telemetry Table
CREATE TABLE IF NOT EXISTS public.account_telemetry (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username_last_changed_at TIMESTAMPTZ DEFAULT NULL,
    deactivated_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Fortify with RLS (Strictly Owner-Only)
ALTER TABLE public.account_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own telemetry" 
    ON public.account_telemetry FOR SELECT 
    USING (auth.uid() = id);

-- 3. Data Migration (Surgical Move)
-- Transfer existing markers from user_profiles before decommissioning
DO $$
BEGIN
    INSERT INTO public.account_telemetry (id, username_last_changed_at, deactivated_at)
    SELECT id, username_last_changed_at, deactivated_at 
    FROM public.user_profiles
    ON CONFLICT (id) DO UPDATE SET
        username_last_changed_at = EXCLUDED.username_last_changed_at,
        deactivated_at = EXCLUDED.deactivated_at;
END $$;

-- 4. Decommission Public Sector Columns
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS username_last_changed_at;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS deactivated_at;

-- 5. Update Registration Oracle (Trigger Function)
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
    -- Extract metadata
    input_username := (NEW.raw_user_meta_data->>'username');
    input_display_name := (NEW.raw_user_meta_data->>'display_name');

    -- Manifest Public Profile
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (
        NEW.id, 
        COALESCE(input_username, 'user_' || substring(NEW.id::text, 1, 8)),
        COALESCE(input_display_name, input_username)
    )
    ON CONFLICT (id) DO NOTHING;

    -- Manifest Private Telemetry
    INSERT INTO public.account_telemetry (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to manifest sectors for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- 6. Indices for Stasis Telemetry
CREATE INDEX IF NOT EXISTS idx_account_telemetry_deactivated_at ON public.account_telemetry(deactivated_at);

COMMENT ON TABLE public.account_telemetry IS 'Private administrative manifest for account management and security cooldowns.';
