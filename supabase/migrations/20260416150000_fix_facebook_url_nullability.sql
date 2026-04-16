-- Fix facebook_url nullability to match other profile fields
ALTER TABLE public.user_profiles ALTER COLUMN facebook_url DROP NOT NULL;
ALTER TABLE public.user_profiles ALTER COLUMN facebook_url SET DEFAULT NULL;
