-- Account Telemetry Markers
-- Tracks temporal metadata for handle changes and account stasis

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS username_last_changed_at timestamptz DEFAULT NULL,
ADD COLUMN IF NOT EXISTS deactivated_at timestamptz DEFAULT NULL;

-- Index for performance during stasis checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_deactivated_at ON public.user_profiles(deactivated_at);

-- Feedback for migration tracking
COMMENT ON COLUMN public.user_profiles.username_last_changed_at IS 'Timestamp of the last galactic handle (username) modification';
COMMENT ON COLUMN public.user_profiles.deactivated_at IS 'Timestamp when the account entered 30-day stasis deactivation';
