-- Fix: Add INSERT policy to profiles table for authenticated users
-- This allows users to create their own profile when signing up
-- Run this in your Supabase SQL Editor

-- Add missing INSERT policy for profiles
create policy "Users can create their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Note: The handle_new_user() trigger also creates profiles automatically,
-- so this policy ensures both flows work:
-- 1. Direct insert from client (used in current signup flow)
-- 2. Trigger-based insert when auth user is created

-- Verify policies are set correctly
-- SELECT tablename, policyname, qual, with_check FROM pg_policies WHERE tablename = 'profiles';
