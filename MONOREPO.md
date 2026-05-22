# Bucket List Monorepo

This is a monorepo containing three packages:

## Structure

```
bucketlist-app/
├── packages/
│   ├── shared/          # Shared business logic, types, API
│   │   └── lib/
│   │       ├── types.ts       # Supabase database types
│   │       ├── supabase.ts    # Supabase client
│   │       ├── store.ts       # Zustand store (platform-agnostic)
│   │       └── index.ts       # Exports
│   │
│   ├── mobile/          # Expo app (React Native)
│   │   ├── app/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── web/             # Next.js web app
│       ├── app/
│       ├── public/
│       └── package.json
│
└── package.json         # Root workspace config
```

## Scripts

At the root level:

```bash
npm install                # Install all dependencies (workspaces)
npm run dev:mobile        # Start Expo mobile app
npm run dev:web          # Start Next.js web app
npm run build:mobile     # Build Expo app
npm run build:web        # Build Next.js app
npm run start:web        # Start production web server
```

## Shared Package

The `@bucketlist/shared` package contains:

- **types.ts**: Auto-generated Supabase types
- **supabase.ts**: Supabase client (no platform-specific code)
- **store.ts**: Zustand store with all business logic (no React Native-specific code like `Platform.OS`)
- **index.ts**: Exports for easy importing

Both mobile and web apps import from `@bucketlist/shared` to share:
- State management (Zustand store)
- API logic (Supabase queries)
- Type definitions

## Migration Steps Completed

1. ✅ Created monorepo structure with workspaces
2. ✅ Extracted shared logic to `packages/shared`
3. ✅ Scaffolded `packages/web` with Next.js 16
4. ✅ Created `packages/mobile` wrapper for Expo
5. ⏳ Next: Copy existing Expo files to `packages/mobile`
6. ⏳ Update mobile app to import from `@bucketlist/shared`
7. ⏳ Deploy web app to Vercel with Supabase

## Next Steps

### For Mobile
Move existing Expo app files to `packages/mobile/` and update imports:
- Copy `app/`, `src/` directories to `packages/mobile/`
- Update imports to use `@bucketlist/shared`
- Remove duplicate store/supabase/types files

### For Web
The Next.js scaffolding is ready. You can:
1. Build out UI components in `packages/web/app`
2. Use shared store: `import { useStore } from '@bucketlist/shared'`
3. Deploy to Vercel (see VERCEL_DEPLOYMENT.md)

## Development Workflow

When making changes:

1. **Business logic**: Edit `packages/shared/lib/` → used by both apps
2. **Mobile UI**: Edit `packages/mobile/app/` or `packages/mobile/src/`
3. **Web UI**: Edit `packages/web/app/`

The shared store handles all API communication, so both UIs just call `useStore()` to get and update data.
