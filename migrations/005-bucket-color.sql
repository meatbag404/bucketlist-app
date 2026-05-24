-- ─────────────────────────────────────────────
-- Add color_token column to buckets
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────

ALTER TABLE public.buckets
  ADD COLUMN IF NOT EXISTS color_token text;

-- color_token values: 'cyan' | 'pink' | 'lime' | 'yellow' | 'blue' | 'red'
-- NULL means use a hash-derived color from the bucket id (deterministic).

-- Notify PostgREST to reload the schema cache so the new column is queryable
NOTIFY pgrst, 'reload schema';
