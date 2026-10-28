-- =========================================================================
-- CLARIVISIT SUPABASE POSTGRESQL MULTI-DEVICE CLOUD SYNC SCHEMA
-- =========================================================================
-- Run this in your Supabase Project SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This script configures user profiles, visits, biomarkers, and medications
-- with strict Row Level Security (RLS) policies guaranteeing patient privacy.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

-- 2. Patient After-Visit Summaries
CREATE TABLE IF NOT EXISTS public.visits (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT,
  visit_date TEXT,
  provider_name TEXT,
  facility_name TEXT,
  record_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own visit records"
  ON public.visits
  FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);

-- 3. Diagnostic Biomarkers & Lab Results
CREATE TABLE IF NOT EXISTS public.biomarkers (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  panel TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  min_range NUMERIC NOT NULL,
  max_range NUMERIC NOT NULL,
  status TEXT NOT NULL,
  date_recorded TEXT,
  record_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own biomarkers"
  ON public.biomarkers
  FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_biomarkers_user_id ON public.biomarkers(user_id);

-- 4. Custom Medications & Prescriptions
CREATE TABLE IF NOT EXISTS public.custom_medications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name TEXT,
  record_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.custom_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own custom medications"
  ON public.custom_medications
  FOR ALL
  USING (auth.uid() = user_id);

-- 5. Custom Outpatient Lab Orders
CREATE TABLE IF NOT EXISTS public.custom_labs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_name TEXT,
  record_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.custom_labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own custom lab orders"
  ON public.custom_labs
  FOR ALL
  USING (auth.uid() = user_id);

-- Auto-profile trigger when new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, created_at)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
