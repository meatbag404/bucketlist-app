# Bucket List — Workspace Layout

Two npm workspaces under `packages/`:

```
bucket-list/
├── packages/
│   ├── shared/             # Platform-agnostic lib
│   │   └── lib/
│   │       ├── types.ts        # Supabase database types
│   │       ├── supabase.ts     # Supabase client
│   │       ├── store.ts        # Zustand store
│   │       ├── design-tokens.ts
│   │       ├── sticker.tsx     # Sticker design primitives
│   │       ├── nav-icons.tsx
│   │       ├── icon-set.tsx    # Curated Icons8 sticker library
│   │       ├── use-viewport.ts
│   │       └── index.ts        # Public surface
│   └── web/                # Next.js 16 app — the deployed product
│       ├── app/                # App Router pages
│       ├── next.config.ts
│       └── package.json
└── package.json            # Root workspace config
```

## Scripts (run from repo root)

```bash
npm install         # install both workspaces
npm run dev:web     # start Next.js dev server
npm run build:web   # production build
npm run start:web   # serve the production build
```

## Shared package

`@bucketlist/shared` holds anything not specific to the Next.js app:

- Supabase types and client
- Zustand store (buckets, items, friends, activity, etc.)
- Design tokens (colors, fonts, sticker shadows)
- Sticker primitives (`Sticker`, `StickerButton`, `StickerChip`, `Avatar`, ...)
- Icon library (`ICON_SET`, `Icon8` component, `icon8Url` helper)

The web app imports from it via `@bucketlist/shared`. Keeping these in their
own package makes them straightforward to reuse if another consumer is ever
added.
