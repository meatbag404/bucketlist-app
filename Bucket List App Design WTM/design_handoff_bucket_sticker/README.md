# Handoff: Bucket — Sticker visual direction

## Overview

A complete visual redesign of the **Bucket** app (your existing Expo + Supabase + Zustand codebase at `bucketlist-app/`) in a **"Bold sticker"** aesthetic: chunky 2px black borders, hard 4px offset shadows (no blur), high-saturation primary colors on a butter-cream background, Space Grotesk display type, uppercase headlines with highlight blocks. Every interactive element reads like a die-cut sticker.

The redesign covers eight screens and a custom icon-picker library, all aligned to the existing data model (`buckets`, `items`, `item_tags`, `item_photos`, `comments`, `activity`, `bucket_members`, `categories` — already in `bucket_schema.sql`).

---

## About the design files

The files in this bundle are **design references created in HTML/React**, not production code to copy directly. They are prototypes showing intended look and behavior.

Your task: **recreate these designs in the existing React Native / Expo codebase** at `bucketlist-app/`, using its established patterns:

- `expo-router` for navigation (file-based routes in `app/`)
- `zustand` for state (`src/store/index.ts`)
- `@supabase/supabase-js` for data + auth (`src/lib/supabase.ts`)
- `react-native-gesture-handler` + `react-native-reanimated` for swipe + drag
- `expo-image-picker` for photo uploads
- The existing TypeScript types in `src/types/database.ts`

Do **not** introduce new state libraries, navigation systems, or styling solutions. Restyle the existing components in place — most files in `app/(app)/` already have all the logic; you're swapping the visual layer (`StyleSheet.create({…})` objects) and adding a couple of new screens (icon picker, possibly tweaks).

---

## Fidelity

**High-fidelity.** The HTML prototypes are pixel-spec: every color hex, spacing value, border weight, shadow offset, font size, letter-spacing, and tilt angle is final. Match them exactly when porting to React Native. The HTML uses web idioms (CSS gradients, backdrop-filter, transform) — React Native equivalents:

| HTML idiom | React Native equivalent |
|---|---|
| `border: '2.5px solid #0C0C0C'` | `borderWidth: 2.5, borderColor: '#0C0C0C'` |
| `boxShadow: '4px 4px 0 #0C0C0C'` | iOS: layered `View` with offset + zero blur; Android: use `react-native-drop-shadow` or a stacked absolute View behind the element (RN's native `shadow*`/`elevation` can't do zero-blur hard shadows reliably). |
| `transform: rotate(-2deg)` | `transform: [{ rotate: '-2deg' }]` |
| `linear-gradient(…)` | `expo-linear-gradient` |
| `backdropFilter: blur(8px)` | `expo-blur` `<BlurView>` |

For the hard sticker shadow, the recommended RN pattern is an `<View>` wrapper that renders a black-filled `<View>` absolutely positioned 4px down-right behind the content view. A reusable `<Sticker>` primitive is worth building first.

---

## The design system

### Palette

```ts
// src/design/sticker.ts
export const sticker = {
  bg:        '#FFF6E5',  // butter cream — app background
  surface:   '#FFFFFF',  // card / sticker surface
  ink:       '#0C0C0C',  // near-black for borders, type, dark stickers
  inkMuted:  '#3A3A3A',  // secondary type
  cyan:      '#7DDCFF',
  pink:      '#FF7AB6',
  lime:      '#C7F356',
  yellow:    '#FFD43B',
  blue:      '#5C7BFF',
  red:       '#FF6B5A',
}
```

### Sticker primitives

```ts
export const stickerBorder    = { borderWidth: 2.5, borderColor: '#0C0C0C' }
export const stickerBorderSm  = { borderWidth: 2,   borderColor: '#0C0C0C' }
// Hard offset shadow (RN: render via a black <View> 4px down-right behind)
export const stickerShadow    = { offset: 4 }
export const stickerShadowSm  = { offset: 3 }
```

### Typography

| Role | Family | Weight | Size | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Hero headline | Space Grotesk | 700 | 48–56 | 0.92 | -2 to -2.2 | UPPERCASE |
| Section title | Space Grotesk | 700 | 28–36 | 0.95–1.0 | -1 to -1.3 | UPPERCASE |
| Item title | Space Grotesk | 700 | 14–18 | 1.15–1.25 | -0.3 to -0.6 | mixed-case (often UPPERCASE for posters) |
| Body | Space Grotesk | 500–600 | 12–14 | 1.4 | -0.1 to 0 | mixed-case |
| Caps label | Space Grotesk | 700 | 9–11 | 1.0 | +0.5 to +1.5 | UPPERCASE |
| Mono code | Geist Mono | 500 | 11–13 | — | +1.5 | UPPERCASE for invite codes |

Load via `expo-font` from Google Fonts (already a pattern in the codebase):
- `Space Grotesk` weights 400/500/600/700
- `Geist Mono` weights 400/500

### Spacing & radius

- Card padding: 14, 16, 18, or 20
- Screen horizontal padding: 22 (most), 16 (item grids)
- Card gap (vertical): 10, 14, or 22
- Border radius: **8** (small button), **12** (input/field), **14** (small card), **16–18** (card), **22** (hero), **99** (pill/chip/circle)
- All shadows: 3px or 4px offset, **zero blur**

### The category color mapping (for items + buckets)

The existing app already uses 5 categories (`travel`, `food`, `adventure`, `wellness`, `culture`). In the sticker direction they map to the bold palette:

| Category | Sticker color | Use |
|---|---|---|
| travel    | `yellow` `#FFD43B` | item bg, filter chip, frame |
| food      | `pink` `#FF7AB6`   | same |
| adventure | `blue` `#5C7BFF`   | same |
| wellness  | `lime` `#C7F356`   | same |
| culture   | `cyan` `#7DDCFF`   | same |

This **replaces** the warm color mapping currently in `app/(app)/index.tsx`'s `CAT_COLORS` constant. Keep the same `category_key` values in the database — only the rendering changes.

---

## Screens

For each, the matching HTML reference is noted. Open the corresponding HTML file in a browser to see the live prototype.

### 1 · Buckets home (`app/(app)/index.tsx` — empty-state + bucket-picker view)

**Reference:** `concept-c.jsx` → `CCScreenHome`

- **Top bar:** "🪣 BUCKET" wordmark (ink-on-bg sticker, 6px 12px padding, radius 8); pink notification button on right (40px circle, ink border, 3px shadow) with a small ink badge showing unread count.
- **Big display headline:** `WHAT'S / ON THE [LIST]` — Space Grotesk 700, 52px, -2.2 letter-spacing, lineHeight 0.92. The word `LIST` is wrapped in a `lime` highlight block with a -2° rotate, 2px border, 3px shadow, 2/12 padding.
- **Subline:** 14px, weight 500, with `23 done` highlighted in a `yellow` inline block.
- **Bucket posters (stack):** one per bucket. Each is a `200px+ tall` sticker card with full saturated bg color (rotate by `BK_BUCKET_COLORS` index — current: `[cyan, lime, pink, yellow]`), tilted ±1.4°, 4px shadow. Inside:
  - Emoji avatar block (56×56, white bg, sticker border, fontSize 32)
  - Status pill top-right: ink bg, white type, 10px caps, "NEW" or "{pct}%"
  - Bucket name in Space Grotesk 700, 30px, -1 ls, UPPERCASE
  - Member avatar stack (28px, ring=cardColor)
  - Done/total counter, Space Grotesk 22, 700, tabular-nums
- **+ New bucket row:** dashed 2.5px border, no shadow, "＋ NEW BUCKET" headline + meta.

**Interactions:** tap a poster → push `/(app)/bucket/[id]`.

### 2 · Inside a bucket (`app/(app)/index.tsx` — the main `BucketScreen`)

**Reference:** `concept-c.jsx` → `CCScreenBucket`

- **Hero card** (replaces existing `bucketHeroImg` + `header` block): a `cyan` sticker card with the bucket's emoji at 56px, "SUMMER IN / [LISBON]" headline (Lisbon in a pink highlight block, rotated -1.5°), member stack, and a thick chunky progress bar (22px tall, butter-cream bg, lime fill ending in a `5/14` counter sticker on the right).
- **Filter chips:** sticker chips with each category color. The active chip has a 3px shadow; inactive has a softer 15%-opacity shadow.
- **Item stickers:** replace `ItemCard`. Each item is a white sticker (2.5px border, 4px shadow, 18px radius), tilted ±0.8° based on index. Inside:
  - Colored left strip (8px wide, item's category color)
  - Category-color block (48×48, radius 12) with item emoji
  - Item title: Space Grotesk 700, 15px, -0.3 ls; line-through if done
  - Meta sticker badges (UPPERCASE caps, 9px, butter-cream bg, 1.5px ink border, radius 6) for category / date / location
  - If `memory_note` exists: a sticker quote block in the item's category color, 1.5px ink border
  - Right column: gold star (if `starred`), red heart counter (if hearts>0)
- **Floating add button:** 64×64 ink circle, white "+", 4px shadow, bottom-right, 22px from edge.

**Interactions:** tap item → push item modal; tap "+" → push add screen; left-swipe → archive (Reanimated, keep existing logic).

### 3 · Item with memory (`app/(app)/index.tsx` — `ItemModal`)

**Reference:** `concept-c.jsx` → `CCScreenItem`

- **Top bar:** ‹ back button (40px sticker circle), centered pill ("FOOD · DONE ✓" — category color, ink type), ⋯ menu button.
- **Title poster:** full-width sticker card in the item's category color. Large emoji (72px, centered), `PASTÉIS DE BELÉM —` heading, `eat 6, [no judgement]` second line with yellow highlight block on `no judgement`. Caps meta row (date / location / tagged people) at bottom.
- **Photo strip:** horizontal scroll. Each photo wrapped in a tilted sticker frame (alternating yellow/cyan/lime backings, 4px padding, sticker border, 3px shadow). Followed by a "+" dashed-border slot.
- **Memory quote card:** white sticker with a `MEMORY · BY [NAME]` lime tag stuck to its top-left corner. Quote rendered in Space Grotesk 700, 22px, -0.5 ls.
- **Reactions row:** white sticker card. Inside: react chips (`♥ 4`, `★ STAR`, `💬 3`, `↗ SHARE`). Active chip is filled with its assigned color + 2px ink border.

### 4 · Add to bucket (new screen or restyled add form)

**Reference:** `concept-c.jsx` → `CCScreenAdd`

- **Top bar:** CANCEL sticker button (left), `NEW THING` headline (center), `ADD →` ink sticker button (right, disabled state = `#999` bg, no shadow).
- **"Adding to" pill:** cyan sticker card showing the active bucket (emoji + name + CHANGE →).
- **Title + sticker icon card:** full-width sticker card in the picked category's color. The icon block (60×60, picked color, tilted -2°, with a small ink↕ badge bottom-right) opens the sticker library on tap. Title input is borderless, inherits Space Grotesk 700, UPPERCASE placeholder.
- **"Browse sticker library · 200+ →" button:** full-width white sticker. Tap → push icon picker.
- **Category sticker chips:** same system as filter chips, but the selected one tilts -1° and has the full shadow.
- **Optional fields:** stacked sticker rows (icon + UPPERCASE caps placeholder input) for target date, location, why-you-want-this.
- **Tag people:** friend stickers with avatar + first name in caps. Selected = category color filled + shadow + checkmark.

### 5 · Memories wall (`app/(app)/memories.tsx`)

**Reference:** `concept-c.jsx` → `CCScreenMemories`

- **Headline:** `STUFF / YOU [DID].` with `DID` in a pink highlight block, rotated -2°.
- **Filter chips:** ALL (ink-filled), year tabs, "WITH JAY" people filter.
- **Masonry grid (2 cols):** each memory is a sticker tile. Tile has:
  - Colored band header (category color) with category + date caps, divided by a 2px black border
  - Photo with the memory's emoji as a circular sticker overlay top-left
  - White footer: title in Space Grotesk 700 13px, member stack, ✓ done check
  - Each tile tilted ±1° based on index
- Variable tile heights (170–240px) to produce real masonry; on RN use a library like `@codeherence/react-native-masonry-list` or implement as two flatlist columns split by index parity.

### 6 · Activity feed (`app/(app)/activity.tsx`)

**Reference:** `concept-c.jsx` → `CCScreenActivity`

- **Headline:** `WHAT'S / [UP].` (cyan highlight, -1.5° rotate).
- **"3 NEW" sticker badge** top-right (red, white type).
- **Bucket filter row:** sticker chips with emoji prefixes.
- **Grouped rows by day:** `· TODAY ·` / `· YESTERDAY ·` / `· THIS WEEK ·` separators in caps + a center-dot decoration.
- **Activity rows:** white sticker cards (alternating tilt ±0.5°). Avatar with a category-color badge stuck to bottom-right corner. Body text: `MARA added "Title"` with ink Space Grotesk for name + target, muted-ink for the verb. If there's a comment body, render as a sticker quote in the action's color.

### 7 · Friends & invite (`app/(app)/friends.tsx`)

**Reference:** `concept-c.jsx` → `CCScreenFriends`

- **Headline:** `YOUR / [PEOPLE].` (lime highlight, -2° rotate).
- **Invite poster:** big blue sticker card with two floating decorative tint orbs (yellow top-right, pink bottom-left). Inside: `BRING / SOMEONE / ALONG.` headline, body, and two buttons (white "↗ SHARE INVITE" sticker + transparent-white-bordered code button).
- **Friends grid (2 cols):** each profile is a sticker card with the avatar in a colored ring (64×64), name in Space Grotesk 700 14px, meta caps, "VIEW" pill.

### 8 · Sticker library (new screen — icon picker)

**Reference:** `concept-c.jsx` → `CCScreenIconPicker` + `CC_ICON_LIBRARY`

- **Top bar:** CANCEL, `STICKER LIBRARY` title, `PICK ↓` ink button.
- **Headline:** `PICK / A [STICKER].` (pink highlight, -2°).
- **Search field:** sticker input with the `search` SVG icon (no functional search needed in v1 — just a placeholder displaying `SEARCH 200+ STICKERS…`).
- **Category chips:** Travel / Food / Adventure / Wellness / Social / Culture / Special. Active = ink-filled.
- **Sticker grid (4 cols):** each cell is a square sticker tile (aspect ratio 1:1) with a colored bg and a single emoji at 32px. Selected = 3px ink border + 4px shadow + -3° rotate.
- **Live preview card:** white sticker showing the picked sticker mounted in the same layout as a real item ("YOUR NEW THING" + "FRAME: [COLOR NAME]" meta).

The library data is the `CC_ICON_LIBRARY` object in `concept-c.jsx`. Move it into something like `src/data/stickerLibrary.ts`. To extend, just add `{ e: '🎯', c: 'red' }` entries.

---

## Reusable components to build first

Before porting screens, build these primitives. They appear on every screen.

1. **`<Sticker>`** — wraps children with the hard shadow, ink border, and radius. Props: `color`, `tilt`, `radius`, `shadowSize`, `borderSize`, `style`.
2. **`<StickerChip>`** — pill-shaped sticker with text inside. Props: `color`, `ink`, `active`, `tilt`.
3. **`<StickerButton>`** — same as Sticker but with `onPress`, native feedback (lift on press: shadow shrinks to 1px, transform offset to +2,+2).
4. **`<StickerInput>`** — text input wrapped in a Sticker. Props standard `TextInput`.
5. **`<StickerIcon>`** — the SVG icons from `CCIcon` in `concept-c.jsx`, ported to `react-native-svg`. Names: `bucket`, `clock`, `plus`, `photo`, `friends`, `pin`, `heart`, `star`, `check`, `chat`, `search`.
6. **`<HighlightBlock>`** — the rotated inline-color block used inside headlines. Props: `color`, `tilt`, `children`.
7. **`<AvatarStack>`** — already exists in `index.tsx`. Restyle to use sticker borders.

For the hard shadow on iOS + Android, the cleanest approach is a wrapper:

```tsx
function StickerShadow({ offset = 4, children, style }) {
  return (
    <View style={[style, { position: 'relative' }]}>
      <View style={{
        position: 'absolute', top: offset, left: offset, right: -offset, bottom: -offset,
        backgroundColor: '#0C0C0C', borderRadius: style.borderRadius,
      }} />
      {children}
    </View>
  );
}
```

---

## Interactions & behavior

- **Tap a bucket poster** → `router.push('/(app)/bucket/' + id)` (or set active bucket in store + navigate)
- **Tap an item sticker** → open `ItemModal`
- **Long-press an item** → existing drag-reorder behavior (keep `react-native-draggable-flatlist`)
- **Swipe left** → done/restore (keep `react-native-gesture-handler` `Swipeable`)
- **Swipe right** → delete
- **Sticker button press** → animate shadow shrink (offset 4 → 1) over 80ms ease-out, scale to 0.98. On release, animate back.
- **Tilt animation** (on home/memories/activity stickers): the tilt is **static** (set once via index parity), not animated. Do not auto-rotate or sway.
- **Empty states:** if a bucket has no items, show the `WHAT'S NEW?` poster in the bucket's category color with a big sticker "＋ ADD YOUR FIRST" button.

---

## State management

No new state shapes. Keep using:

- `useStore` (`src/store/index.ts`) — buckets, items, activeBucketId, profile, filters
- `useFilteredItems()` — derived list
- Supabase realtime (`src/hooks/useRealtimeSync.ts`)

The icon picker should add **one** field to `items` (or use the existing `emoji` field): the sticker color. Options:

1. **Reuse the `category_key`** to drive the color (current design assumes this — the cyan/pink/etc. comes from the category mapping). No DB change needed.
2. Or add `items.frame_color text` if you want users to pick a color independent of category.

The prototype uses option 2 (sticker color is per-item). Recommend option 1 for v1 to avoid schema migration.

---

## Asset notes

- All photos in the prototype are striped SVG placeholders labelled with what should go there ("memory · pastéis de belém", "bucket cover · lisbon rooftops", etc.). Real implementation pulls signed URLs from Supabase storage as the existing code does (`supabase.storage.from('item-photos').createSignedUrl(...)`).
- The default category hero images (`CATEGORY_HEROES` Unsplash URLs in `index.tsx`) should be **replaced** with butter-cream colored backgrounds + the category sticker. The sticker direction doesn't need hero stock photography.
- Emoji are rendered via system emoji fonts (no asset needed).
- All "icons" in the bottom nav are SVGs drawn from primitives — copy the `CCIcon` switch in `concept-c.jsx` to `react-native-svg`.

---

## Files in this bundle

- `Bucket app.html` — entry point. Open in a browser to see the live canvas of all eight screens + interactive prototype.
- `concept-c.jsx` — **the canonical source**. Every sticker screen, the icon picker, the icon library, the SVG icons, the tokens. Read this first.
- `theme.jsx` — mock data (profiles, buckets, items, activity) mirroring the Supabase schema, plus the warm/cool/dusk palettes used by the alternative concepts.
- `screens-1.jsx`, `screens-2.jsx`, `phone-shell.jsx` — the **Cool & vivid** alternative direction (Concept A). For reference only — not the chosen direction.
- `concept-b.jsx` — the **Quiet journal** alternative direction (Concept B). For reference only.
- `app.jsx` — the design canvas wrapper that arranges all the artboards.
- `design-canvas.jsx`, `ios-frame.jsx`, `tweaks-panel.jsx` — Omelette framework helpers (canvas, device frame, tweak panel). Do not port these — they're only for the design canvas.

When porting, **only `concept-c.jsx` (plus the tokens in `theme.jsx`) matters**. The other concept files are kept so the design history is preserved.

---

## Suggested implementation order

1. Build the `<Sticker>`, `<StickerButton>`, `<StickerChip>`, `<StickerIcon>` primitives + `sticker.ts` token file. Test in isolation.
2. Restyle `BucketScreen` (`app/(app)/index.tsx`) — replace `CAT_COLORS`, `styles`, and the `ItemCard` / `BucketRow` markup.
3. Restyle the bucket-detail hero + filter row in the same file.
4. Restyle `ItemModal` (item detail).
5. Restyle the add form (currently inline in `BucketScreen`).
6. Build the icon picker as a new modal screen. Add the sticker library data.
7. Restyle `memories.tsx`, `activity.tsx`, `friends.tsx`.
8. Replace the bottom tab bar with the floating sticker pill (currently uses Expo Router's default tab bar — you'll need to render a custom tab bar component via `tabBar` prop or build it as a footer view).
9. Polish: press animations on stickers, the "tilt" angles, empty states.

Estimated effort: 3–5 days for a single experienced React Native developer assuming the primitives go smoothly.

---

## Open questions for the developer

- **Tab bar approach.** The current Expo Router tab bar lives at the bottom edge. The sticker design has a floating pill 24px above the bottom edge. Easiest path: hide the default tab bar (`tabBarStyle: { display: 'none' }`) and render a custom `<StickerTabBar>` inside each tab's screen — or use the `tabBar` callback to fully replace it.
- **Drop shadow on Android.** RN's native shadows don't render zero-blur. The black-`<View>`-behind approach works everywhere but adds DOM nodes. If perf matters, consider `react-native-drop-shadow` for a single-prop API.
- **Font loading flash.** Use `expo-splash-screen` to keep the splash up until Space Grotesk + Geist Mono are loaded (the existing splash already does this for default fonts).
