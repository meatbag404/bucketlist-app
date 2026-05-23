-- ─────────────────────────────────────────────
-- 1. Add color_token column to buckets
-- 2. Fix bucket_members INSERT policy (allow self-add)
-- 3. Back-fix orphan buckets: add creator as member
--
-- Run this in your Supabase SQL Editor.
-- ─────────────────────────────────────────────

-- 1. color_token column on buckets
ALTER TABLE public.buckets
  ADD COLUMN IF NOT EXISTS color_token text;

-- 2. Replace the bucket_members INSERT policy so a user can add THEMSELVES to a bucket
--    (the previous policy was too restrictive after a later migration)
DROP POLICY IF EXISTS "Authenticated users can join buckets" ON public.bucket_members;
DROP POLICY IF EXISTS "Anyone authenticated can insert" ON public.bucket_members;
DROP POLICY IF EXISTS "Members can insert memberships" ON public.bucket_members;
DROP POLICY IF EXISTS "Users can add themselves as bucket members" ON public.bucket_members;

CREATE POLICY "Users can add themselves as bucket members"
  ON public.bucket_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 3. Back-fix: for every bucket whose creator isn't already a member, add them
INSERT INTO public.bucket_members (bucket_id, user_id, status)
SELECT b.id, b.created_by, 'active'
FROM public.buckets b
WHERE b.created_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.bucket_members m
    WHERE m.bucket_id = b.id AND m.user_id = b.created_by
  );

-- Reload the schema cache so PostgREST sees the new column
NOTIFY pgrst, 'reload schema';
