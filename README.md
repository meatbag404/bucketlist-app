# Bucket List

A bold "sticker-design" web app for shared bucket lists. Production at
[bucketlist-app-alpha.vercel.app](https://bucketlist-app-alpha.vercel.app).

- **Web app**: Next.js 16 (App Router) + Tailwind v4
- **Data + auth**: Supabase (Postgres + RLS, Storage, Realtime)
- **Hosting**: Vercel (deploy on push to `main`)
- **Icons**: Curated Icons8 "Flat Color" set via [`@bucketlist/shared`](packages/shared/lib/icon-set.tsx)

## Repo layout

```
packages/
├── web/     ★ Next.js app — the deployed product
└── shared/  Platform-agnostic lib (types, Supabase client,
            Zustand store, design tokens, sticker primitives,
            icon library)
```

See [MONOREPO.md](MONOREPO.md) for the full breakdown of the shared package.

## Run it locally

```bash
npm install         # install both workspaces
npm run dev:web     # http://localhost:3000
```

You'll need `packages/web/.env.local` with Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_API_KEY=...        # server-side only, for /api/places/autocomplete
```

## Deploy

Vercel is wired to build `packages/web` on every push to `main`. See
[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for the original setup.

## Schema

All migrations live in [`migrations/`](migrations/README.md), numbered by
apply order. Run them sequentially against a fresh Supabase project — each
file is idempotent so re-runs are safe.

## Where to look next

- [SUMMARY.md](SUMMARY.md) — exhaustive map of every file in the repo
- [MONOREPO.md](MONOREPO.md) — workspace + shared lib reference
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) — deploy steps
