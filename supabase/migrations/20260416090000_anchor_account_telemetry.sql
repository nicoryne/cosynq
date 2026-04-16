-- =====================================================================
-- Migration: Anchor Account Telemetry
-- =====================================================================
-- Description: Establishes a direct foreign key link between the social
--              manifest (user_profiles) and administrative telemetry, 
--              ensuring perfect structural alignment for joins.
-- =====================================================================

-- 1. Add Explicit Foreign Key Anchor
ALTER TABLE public.account_telemetry
DROP CONSTRAINT IF EXISTS account_telemetry_id_fkey,
ADD CONSTRAINT account_telemetry_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES public.user_profiles(id) 
    ON DELETE CASCADE;

-- 2. Index for Correlation Performance
CREATE INDEX IF NOT EXISTS idx_account_telemetry_id ON public.account_telemetry(id);

COMMENT ON CONSTRAINT account_telemetry_id_fkey ON public.account_telemetry IS 
'Structural anchor tethering private administrative telemetry to the public social profile manifest.';
