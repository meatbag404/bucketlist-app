# 🪣 Bucket — Setup Guide

## Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)
- Your Supabase project running with the schema applied

---

## 1. Create the project

```bash
npx create-expo-app@latest bucket --template blank-typescript
cd bucket
```

## 2. Install dependencies

```bash
npx expo install expo-router expo-secure-store expo-image-picker \
  expo-notifications expo-linking expo-constants expo-status-bar \
  react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated

npm install @supabase/supabase-js @react-navigation/native zustand date-fns
```

## 3. Copy project files

Copy all files from this folder into your project, maintaining the same structure:

```
bucket/
  app/
    _layout.tsx          ← Root layout with auth routing
    (auth)/
      login.tsx          ← Login / signup screen
    (app)/
      _layout.tsx        ← Tab bar layout
      index.tsx          ← Main bucket screen
      activity.tsx       ← Activity feed
      memories.tsx       ← Memories view
      together.tsx       ← Surprise + export
      friends.tsx        ← Friends management
  src/
    lib/
      supabase.ts        ← Supabase client (add your keys here!)
    types/
      database.ts        ← TypeScript types
    store/
      index.ts           ← Zustand global store
    hooks/
      useRealtimeSync.ts ← Real-time subscriptions
```

## 4. Add your Supabase credentials

Open `src/lib/supabase.ts` and replace:

```ts
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'
```

Find these in: **Supabase Dashboard → Project Settings → API**

## 5. Configure app.json for expo-router

Add to your `app.json`:

```json
{
  "expo": {
    "scheme": "bucket",
    "web": { "bundler": "metro" },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ]
  }
}
```

## 6. Run it

```bash
npx expo start
```

- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Scan QR code with Expo Go for your physical device
- Press `w` for web browser

---

## Next steps to build

### Remaining screens (build these next)
- `app/(app)/memories.tsx` — done items with photos and notes
- `app/(app)/together.tsx` — surprise spinner + export
- `app/(app)/friends.tsx` — member management + invite flow

### Features to add
1. **Push notifications** — use `expo-notifications` + Supabase webhooks
2. **Photo upload** — use `expo-image-picker` + Supabase Storage
3. **Onboarding flow** — first-run experience
4. **Multiple buckets** — bucket switcher UI
5. **Apple Sign In** — add `expo-apple-authentication`

### iOS App Store submission
When ready:
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas submit --platform ios
```

---

## Folder structure explained

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client with secure token storage |
| `src/types/database.ts` | TypeScript types for every table |
| `src/store/index.ts` | Global state (Zustand) — all data lives here |
| `src/hooks/useRealtimeSync.ts` | Real-time listeners for live updates |
| `app/_layout.tsx` | Auth gate — redirects to login if no session |
| `app/(auth)/login.tsx` | Email login + signup |
| `app/(app)/_layout.tsx` | Tab bar + real-time setup |
| `app/(app)/index.tsx` | Main bucket list screen |
| `app/(app)/activity.tsx` | Activity feed |
