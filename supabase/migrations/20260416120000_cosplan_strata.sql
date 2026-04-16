-- =====================================================================
-- Cosplan Command Center Strata Manifest
-- Requirements: 5.x Series - Project Management
-- =====================================================================

-- 1. Project Status Enum
CREATE TYPE public.cosplan_status AS ENUM ('DREAMING', 'PLANNING', 'IN_PROGRESS', 'ALMOST_DONE', 'ASCENDED', 'STASIS');

-- 2. Asset Type Enum
CREATE TYPE public.cosplan_asset_type AS ENUM ('REFERENCE', 'PROGRESS', 'FINAL');

-- 3. Core Cosplans Table
CREATE TABLE IF NOT EXISTS public.cosplans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    character_name TEXT NOT NULL,
    series TEXT NOT NULL,
    status public.cosplan_status DEFAULT 'DREAMING',
    budget_ceiling DECIMAL(12, 2) DEFAULT 0.00,
    deadline TIMESTAMPTZ,
    visibility TEXT DEFAULT 'PRIVATE', -- PRIVATE, FRIENDS, PUBLIC
    notes JSONB DEFAULT '{}'::jsonb, -- Store Lexical content
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Construction Tasks
CREATE TABLE IF NOT EXISTS public.cosplan_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cosplan_id UUID NOT NULL REFERENCES public.cosplans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'GENERAL', -- WIG, PROPS, ARMOR, SEWING, etc.
    is_completed BOOLEAN DEFAULT false,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Budgetary Itemization
CREATE TABLE IF NOT EXISTS public.cosplan_budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cosplan_id UUID NOT NULL REFERENCES public.cosplans(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    cost DECIMAL(12, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'NEEDED', -- NEEDED, ORDERED, ARRIVED
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Visual Archive (Assets)
CREATE TABLE IF NOT EXISTS public.cosplan_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cosplan_id UUID NOT NULL REFERENCES public.cosplans(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    public_id TEXT,
    asset_type public.cosplan_asset_type DEFAULT 'PROGRESS',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Measurement Strata
CREATE TABLE IF NOT EXISTS public.cosplan_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cosplan_id UUID NOT NULL REFERENCES public.cosplans(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT DEFAULT 'cm',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Color Manifest (Swatches)
CREATE TABLE IF NOT EXISTS public.cosplan_swatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cosplan_id UUID NOT NULL REFERENCES public.cosplans(id) ON DELETE CASCADE,
    hex_code TEXT NOT NULL,
    label TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- Security Strata: Row Level Security (RLS)
-- =====================================================================

ALTER TABLE public.cosplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosplan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosplan_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosplan_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosplan_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosplan_swatches ENABLE ROW LEVEL SECURITY;

-- Cosplan Policies
CREATE POLICY "Users can only view their own cosplans"
    ON public.cosplans FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can only create their own cosplans"
    ON public.cosplans FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can only update their own cosplans"
    ON public.cosplans FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can only delete their own cosplans"
    ON public.cosplans FOR DELETE
    USING (auth.uid() = owner_id);

-- Task Policies
CREATE POLICY "Users can manage tasks for their own cosplans"
    ON public.cosplan_tasks
    USING (EXISTS (
        SELECT 1 FROM public.cosplans WHERE id = cosplan_tasks.cosplan_id AND owner_id = auth.uid()
    ));

-- Budget Policies
CREATE POLICY "Users can manage budget items for their own cosplans"
    ON public.cosplan_budget_items
    USING (EXISTS (
        SELECT 1 FROM public.cosplans WHERE id = cosplan_budget_items.cosplan_id AND owner_id = auth.uid()
    ));

-- Asset Policies
CREATE POLICY "Users can manage assets for their own cosplans"
    ON public.cosplan_assets
    USING (EXISTS (
        SELECT 1 FROM public.cosplans WHERE id = cosplan_assets.cosplan_id AND owner_id = auth.uid()
    ));

-- Measurement Policies
CREATE POLICY "Users can manage measurements for their own cosplans"
    ON public.cosplan_measurements
    USING (EXISTS (
        SELECT 1 FROM public.cosplans WHERE id = cosplan_measurements.cosplan_id AND owner_id = auth.uid()
    ));

-- Swatch Policies
CREATE POLICY "Users can manage swatches for their own cosplans"
    ON public.cosplan_swatches
    USING (EXISTS (
        SELECT 1 FROM public.cosplans WHERE id = cosplan_swatches.cosplan_id AND owner_id = auth.uid()
    ));

-- Indices for performance
CREATE INDEX idx_cosplans_owner_id ON public.cosplans(owner_id);
CREATE INDEX idx_cosplan_tasks_cosplan_id ON public.cosplan_tasks(cosplan_id);
CREATE INDEX idx_cosplan_budget_items_cosplan_id ON public.cosplan_budget_items(cosplan_id);
CREATE INDEX idx_cosplan_assets_cosplan_id ON public.cosplan_assets(cosplan_id);
