-- ─────────────────────────────────────────────
-- Add icon_id column to buckets and items
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────

ALTER TABLE public.buckets
  ADD COLUMN IF NOT EXISTS icon_id text;

ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS icon_id text;

-- icon_id stores an Icons8 sticker id from the curated Flat Color set
-- (see packages/shared/lib/icon-set.tsx). NULL means fall back to the
-- legacy `emoji` text column for rendering.

-- Notify PostgREST to reload the schema cache so the new column is queryable
NOTIFY pgrst, 'reload schema';
