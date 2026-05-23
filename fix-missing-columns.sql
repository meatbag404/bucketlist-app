-- ─────────────────────────────────────────────
-- Fix: Add missing columns + storage buckets
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────

-- Add missing columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url   text,
  ADD COLUMN IF NOT EXISTS city         text,
  ADD COLUMN IF NOT EXISTS state        text,
  ADD COLUMN IF NOT EXISTS country      text,
  ADD COLUMN IF NOT EXISTS push_token   text;

-- Add missing columns to buckets
ALTER TABLE public.buckets
  ADD COLUMN IF NOT EXISTS hero_url     text;

-- Add missing columns to items
ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS starred      boolean default false,
  ADD COLUMN IF NOT EXISTS target_date  date;

-- ─────────────────────────────────────────────
-- Storage Buckets
-- The original schema created a 'photos' bucket,
-- but the app uses 'item-photos' and 'bucket-heroes'
-- ─────────────────────────────────────────────

-- Create item-photos bucket (public so images load without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create bucket-heroes bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('bucket-heroes', 'bucket-heroes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for item-photos
DROP POLICY IF EXISTS "Authenticated users can upload item photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload item photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'item-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view item photos" ON storage.objects;
CREATE POLICY "Public can view item photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-photos');

-- Storage policies for bucket-heroes
DROP POLICY IF EXISTS "Authenticated users can upload bucket heroes" ON storage.objects;
CREATE POLICY "Authenticated users can upload bucket heroes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'bucket-heroes' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view bucket heroes" ON storage.objects;
CREATE POLICY "Public can view bucket heroes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bucket-heroes');

-- ─────────────────────────────────────────────
-- Ensure all RLS policies are correct
-- (safe to re-run - uses DROP IF EXISTS first)
-- ─────────────────────────────────────────────

-- Profiles: add INSERT policy (missing from original schema)
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Bucket members: add DELETE policy (needed for leaving/removing)
DROP POLICY IF EXISTS "Members can delete memberships" ON public.bucket_members;
CREATE POLICY "Members can delete memberships"
  ON public.bucket_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.buckets
      WHERE id = bucket_id AND created_by = auth.uid()
    )
  );

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
