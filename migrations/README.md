# Supabase migrations

Apply these in numbered order against a fresh Supabase project. Each file is
idempotent (uses `IF NOT EXISTS` / `DROP IF EXISTS` for policies), so
re-running won't break anything.

| # | File | What it does |
|---|---|---|
| 000 | [000-bucket-schema.sql](000-bucket-schema.sql) | Canonical base schema: tables, RLS, base policies |
| 001 | [001-profiles-rls.sql](001-profiles-rls.sql) | Adds the missing `Users can create their own profile` policy |
| 002 | [002-friendships.sql](002-friendships.sql) | Earlier friendships fix |
| 003 | [003-missing-columns.sql](003-missing-columns.sql) | `profiles.city/state/country`, `buckets.hero_url`, `items.starred/target_date`, storage buckets `item-photos` + `bucket-heroes` |
| 004 | [004-item-color.sql](004-item-color.sql) | `items.color_token` (superseded by 006) |
| 005 | [005-bucket-color.sql](005-bucket-color.sql) | `buckets.color_token` (superseded by 006) |
| 006 | [006-bucket-members-fix.sql](006-bucket-members-fix.sql) | Consolidates the two color columns, fixes `bucket_members` INSERT policy, back-fills orphan memberships |
| 007 | [007-icon-id.sql](007-icon-id.sql) | `buckets.icon_id`, `items.icon_id` (Icons8 sticker id) |
| 008 | [008-avatars-bucket.sql](008-avatars-bucket.sql) | `avatars` public storage bucket + per-user write policy for profile photos |

## How to apply

Paste each file (in order) into the Supabase SQL Editor and run.

## Adding a new migration

1. Create `migrations/00N-short-name.sql` with the next number.
2. Wrap statements in `IF NOT EXISTS` / `DROP POLICY IF EXISTS` so re-runs are safe.
3. End with `NOTIFY pgrst, 'reload schema';` so PostgREST picks up the change.
4. Add the row to this README.
