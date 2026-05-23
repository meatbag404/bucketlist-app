# Bucket List — Project Summary

A bold "sticker-design" web app for shared bucket lists. Production deploy
lives at **https://bucketlist-app-alpha.vercel.app** on Vercel; data + auth
on Supabase.

---

## 📁 What's in this folder

```
bucket-list/
├── packages/                              monorepo workspace
│   ├── web/                               ★ Next.js 16 + Tailwind v4 — the deployed app
│   │   ├── app/                           App Router pages (login, signup, buckets,
│   │   │                                  bucket detail, item detail, add, memories,
│   │   │                                  icons, activity, friends, profile, 404)
│   │   ├── app/api/places/autocomplete/   server-side Google Places proxy
│   │   ├── app/components/                LocationAutocomplete (and future shared web bits)
│   │   ├── .env.local                     ★ active env (GOOGLE_API_KEY + Supabase creds)
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   └── tailwind.config.ts
│   ├── shared/                            shared lib used by both web and mobile
│   │   └── lib/
│   │       ├── design-tokens.ts           T palette, fonts, sticker constants,
│   │       │                              itemColor/bucketColor helpers
│   │       ├── nav-icons.tsx              11-icon SVG stroke library
│   │       ├── sticker.tsx                Sticker, StickerButton, StickerChip,
│   │       │                              HighlightBlock, Avatar, AvatarStack,
│   │       │                              PageHeading, SectionRule, MonoLabel
│   │       ├── use-viewport.ts            useViewport() → mobile | tablet | desktop
│   │       ├── store.ts                   Zustand store (buckets, items, friends,
│   │       │                              activity, mark-done, edit-item, photo upload)
│   │       ├── supabase.ts                Supabase client (env-driven)
│   │       ├── types.ts                   Generated Database types
│   │       └── index.ts                   public surface
│   └── mobile/                            Expo workspace (parallel mobile app)
├── Bucket List App Design WTM/
│   ├── design_handoff_bucket_web/         ★ canonical web design handoff
│   │                                      (tokens.jsx, app-shell.jsx, screens-a/b/c.jsx,
│   │                                      nav-icons.jsx, sticker-emoji-icons.jsx, README.md)
│   └── design_handoff_bucket_sticker/     earlier concept iteration (sticker style)
├── stock-photos/                          15 stock photos for local QA testing
│                                          (gitignored — keep out of repo bloat)
├── package.json                           workspace declaration
├── package-lock.json
├── vercel.json                            tells Vercel: cd packages/web && build
├── .gitignore
├── bucket_schema.sql                      canonical Supabase schema
├── add-item-color.sql                     migration: items.color_token column
├── add-bucket-color.sql                   migration: buckets.color_token column
├── fix-bucket-members-and-add-color.sql   ★ run if not yet — consolidates the
│                                          two color columns + fixes bucket_members
│                                          INSERT policy + back-fills orphan memberships
├── fix-missing-columns.sql                migration: profiles.avatar_url/city/state/etc.
├── fix-friendships.sql                    earlier friendship schema fix
├── fix-profiles-rls.sql                   earlier profiles RLS fix
├── README.md                              Expo setup notes (legacy; mostly relevant
│                                          to packages/mobile)
├── MONOREPO.md                            monorepo + workspace layout
├── VERCEL_DEPLOYMENT.md                   how the Vercel build is wired up
├── DEPLOYMENT_SUMMARY.md                  earlier deploy notes
├── HANDOFF.md                             higher-level project handoff
└── SUMMARY.md                             ← you are here
```

---

## 🚀 Deployment

- **Production URL**: https://bucketlist-app-alpha.vercel.app
- **Vercel project**: `bucketlist-app` (under `angelcorona-projects`)
- **GitHub repo**: `https://github.com/meatbag404/bucketlist-app`
- **Production branch**: `main` (auto-deploys on push)
- **Build command**: `cd packages/web && npm install && npm run build`
- **Output**: `packages/web/.next`

### Required env vars (set in Vercel project settings)

| Variable | Where | Why |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview | Publishable anon key (RLS-gated, safe to expose) |
| `GOOGLE_API_KEY` | Production + Preview | **Server-side only** — used by `/api/places/autocomplete`. Do NOT prefix with `NEXT_PUBLIC_` |

---

## 🗄 Supabase schema

The canonical schema lives in `bucket_schema.sql`. On a fresh project, run it, then layer the migrations in this order (most are idempotent and use `IF EXISTS / IF NOT EXISTS`):

1. `fix-profiles-rls.sql`
2. `fix-friendships.sql`
3. `fix-missing-columns.sql` (adds `profiles.city/state/country`, `buckets.hero_url`, `items.starred/target_date`, storage buckets `item-photos` + `bucket-heroes`)
4. `add-item-color.sql` (or skip — covered by #5)
5. `fix-bucket-members-and-add-color.sql` — **the most recent one**; adds `buckets.color_token`, fixes the `bucket_members` INSERT policy, and back-fills orphan bucket memberships

### Key tables

- `profiles` — one per auth user; auto-created via trigger on signup
- `buckets` — `name`, `emoji`, `color_token`, `created_by`, `invite_code`, `hero_url`
- `bucket_members` — many-to-many (bucket ↔ user) with `status` of `active`/`pending`/`declined`; unique on `(bucket_id, user_id)`
- `items` — `title`, `emoji`, `color_token`, `done`, `done_at`, `done_by`, `hearts`, `starred`, `memory_note`, `location`, `sort_order`
- `item_tags`, `item_hearts`, `item_photos`, `comments`, `activity` — supporting tables
- `categories` — auto-created per bucket via trigger (not currently surfaced in UI)

### RLS
Every table has Row-Level Security enabled. Access is gated by `is_bucket_member(bucket_id)` for items/photos/comments. Profiles are visible to all authenticated users; only owner can update.

---

## 🎨 Design system

The look comes from the canonical handoff in `Bucket List App Design WTM/design_handoff_bucket_web/` — copy-paste-able HTML/JSX prototype. The web app re-implements every screen.

**Tokens** (`packages/shared/lib/design-tokens.ts`):
- Palette: `bg #FFF6E5`, `ink #0C0C0C`, `cyan #7DDCFF`, `pink #FF7AB6`, `lime #C7F356`, `yellow #FFD43B`, `blue #5C7BFF`, `red #FF6B5A`
- Fonts: Space Grotesk (display), Geist (UI), Geist Mono (technical)
- Sticker: 2.5px solid black border, 4px hard offset shadow (no blur), 16–22px border radius, slight tilts

**Components** (`packages/shared/lib/sticker.tsx`): `<Sticker>`, `<StickerButton>`, `<StickerChip>`, `<HighlightBlock>`, `<Avatar>`, `<AvatarStack>`, `<PageHeading>`, `<SectionRule>`.

**Icons** (`packages/shared/lib/nav-icons.tsx`): 11 stroke SVG icons. Item / bucket icons currently use unicode emoji with a safe-fallback map; will swap to a hand-drawn library later.

**Responsive** (`use-viewport.ts`): `mobile < 720 < tablet < 1024 <= desktop`. The AppShell switches between desktop sidebar + mobile top-bar/bottom-nav automatically.

---

## 📜 Screens

| Route | Purpose |
|---|---|
| `/auth` | Login — WELCOME BACK + Forgot Password + Apple/Google OAuth |
| `/auth/signup` | Signup — SAY HI + the same OAuth flow |
| `/app` | Buckets home — Featured / Grid / List layouts, overall ticked counter, % progress per bucket |
| `/app/bucket/[id]` | Bucket detail — hero with progress, items grid with per-item randomized color, mark-done confirmation, inline edit modal, friend invite |
| `/app/item/[id]` | Item detail — colored hero, reactions, photo strip, memory note, comments |
| `/app/add` | Standalone Add Item flow (alternative entry point) |
| `/app/memories` | Masonry of completed items with filter chips |
| `/app/icons` | Sticker library placeholder (waiting for icon-library swap) |
| `/app/activity` | Grouped activity feed by day |
| `/app/friends` | Big "BRING SOMEONE ALONG" invite poster + friend cards |
| `/app/profile` | Edit name / handle / city / state · Sign out |
| `*` | 404 — sticker 4-0-4 digits with emoji backdrop |
| `/api/places/autocomplete` | Server-side Google Places proxy (keeps API key server-side) |

---

## 🛠 Local development

```bash
# From the repo root
cd packages/web
npm install
npm run dev
```

Then open http://localhost:3002.

The dev server reads `packages/web/.env.local` for credentials. That file is gitignored — don't commit it.

---

## 🔐 Security posture

- Old leaked Google key (`AIza...OpGuQ`) — deactivated in Google Cloud Console
- `.env` removed from git tracking and scrubbed from all 22 prior commits via `git-filter-repo`
- Active `GOOGLE_API_KEY` — only in `packages/web/.env.local` (gitignored) and Vercel env vars
- Supabase keys — `sb_publishable_...` is designed to be public; safe in client bundles. Service-role key is never present in code
- All tables RLS-enabled
- Recommended: in Google Cloud Console, restrict the active key to HTTP referrers `https://bucketlist-app-alpha.vercel.app/*` and `https://*.vercel.app/*`, and API restriction = Places API only

---

## 🧭 Notable decisions

- **One-folder-per-package workspace** — `packages/{web,shared,mobile}`. Vercel builds `web`, importing from `shared` via `transpilePackages: ['@bucketlist/shared']` in `next.config.ts`.
- **No hand-drawn icon library yet** — items/buckets use unicode emoji with a name→emoji fallback map (`safeEmoji`) for legacy data that has icon ids. A real library swap-in is planned.
- **Bucket cover photos removed** — the design doesn't have them; cleaner.
- **Mark-done is a two-step** — click the icon (which links to item detail) OR click the prominent "✓ MARK DONE" button in the footer, which then shows a confirmation modal.
- **Per-item randomized color** — each item has its own `color_token`; if null, a deterministic hash from item.id picks one. Same scheme for buckets.

---

## ✅ Status at time of writing

- Production is live and green on Vercel
- 18 buckets · 80 items in the seed DB (mix of done + to-do, varied colors and locations)
- Full Google Places autocomplete in Add/Edit item modals
- All planned screens are shipped
- Git history is scrubbed of the old leaked credential
