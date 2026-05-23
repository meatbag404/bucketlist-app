# Bucket List — Web App Handoff

A responsive, sticker-style web app for keeping shared bucket lists with friends.
Hand-drawn aesthetic: chunky 2.5px black borders, hard 4px offset shadows (no blur),
high-saturation primary colors on a butter-cream background, Space Grotesk display
typography, uppercase headlines with rotated highlight blocks.

This bundle contains **the canonical HTML/JS prototype** of every screen and the
sticker design system. Open `Bucket List.html` in a browser — every layout works.
Resize the window to see mobile / tablet / desktop adapt.

---

## About these files

The files in this bundle are **design references created in plain HTML + React +
Babel (no build step)**. They are prototypes showing the intended look and behavior
at full fidelity, not production code to copy line-by-line.

**Your task:** recreate this in a real codebase using whatever modern web stack is
appropriate for the project. The prototype was built in React, so reaching for React
again is the lowest-risk path — but the styling is all inline (no CSS framework
dependency), so any component framework that supports JSX-like markup will work.

**Recommended stack:**

- **React 18 + Vite** (lightest setup) or **Next.js 14 App Router** (if you'll want
  server rendering / SEO later for shareable bucket pages)
- **TypeScript** (the prototype is plain JSX; add types as you port)
- **React Router** (if Vite) or built-in Next.js routing
- **No CSS framework needed** — design tokens are tiny and inline is fine. If you
  prefer a library, **Tailwind** maps cleanly to the tokens; **vanilla-extract** or
  **CSS Modules** work too. Avoid heavy component libraries (MUI, Chakra) — they
  fight the sticker aesthetic.
- **Supabase** (or any BaaS) for auth + data — the existing `bucketlist-app/`
  Supabase schema in the project root already defines the tables, RLS, and storage
  buckets needed. Reuse it directly.

---

## Fidelity

**High-fidelity.** Every color, border weight, shadow offset, font size, padding,
border radius, and tilt angle in the prototype is final. Match them when porting.
Open the JSX source files to read the exact values — they're documented inline.

---

## Responsive behavior

The app has **three viewport modes** driven by the `useViewport()` hook in `tokens.jsx`:

| Mode | Width | Layout |
|---|---|---|
| **Mobile** | `< 720px` | Top bar + fixed bottom-nav sticker pill. Single-column content. Smaller display type (48px hero), tighter padding. |
| **Tablet** | `720–1023px` | Same chrome as mobile (top bar + bottom nav). 2-column grids where appropriate. Medium display type (64px hero). |
| **Desktop** | `≥ 1024px` | Fixed 248px sidebar on the left with logo, nav items, ADD CTA, profile chip. 2–4 column grids. Large display type (84px hero). Max content width 1280px. |

Each screen receives `vp` as a prop and conditionally adjusts grid columns,
padding, type sizes, and stack-vs-row layouts. **Don't introduce a fourth size** —
the three breakpoints cover phone / tablet / laptop+. You can use larger screens
(1440+, 1920+) — the layout caps at 1280px wide and the rest is breathing room.

Resize the prototype window across the breakpoints to verify behavior matches.

---

## Screens (10)

Each screen routes via URL hash for deep-linking (e.g. `#/bucket/b1`, `#/item/i2`,
`#/login`). The routing helper is `useRoute()` in `tokens.jsx`. Anything not in the
known-screens list renders the 404.

### 1. Login (`#/login`)
- **Source:** `screens-c.jsx` → `ScreenLogin`
- **Layout:** Full-bleed (no app chrome). Centered card max-width 440px, with floating
  decorative sticker icons in the background corners. On mobile, fewer/smaller
  stickers.
- **Modes:** Sign in / Sign up — toggle near bottom changes the form. Sign up adds a
  Name field at the top.
- **Form:** Name (sign-up only), Email, Password. "Forgot password?" link in login mode.
- **OAuth:** "CONTINUE WITH APPLE" / "CONTINUE WITH GOOGLE" buttons below the divider.
- **Submit:** Posts to your auth backend. On success, route to `#/buckets`.

### 2. Buckets home (`#/buckets`)
- **Source:** `screens-a.jsx` → `ScreenBuckets`
- **Layout switcher** at top right (desktop) or below heading (mobile): three options
  — **Featured / Grid / List** — persist to `localStorage` under `bk-home-layout`.
- **Featured layout (default):** big featured card for the highest-priority bucket
  (e.g. one with an active countdown), then a 1/2/3-col grid of the rest +
  "New bucket" dashed-border placeholder.
- **Grid layout:** every bucket the same size in a 2/3/4-col grid. No featured card.
- **List layout:** vertical rows with richer per-bucket meta (progress bar inline,
  last completed item, member stack on the right).
- **Tap a bucket** → push `#/bucket/{id}`.
- **Tap "+ NEW BUCKET" or the dashed placeholder** → push `#/add`.

### 3. Inside a bucket (`#/bucket/:id`)
- **Source:** `screens-a.jsx` → `ScreenBucket`
- **Hero card:** bucket emoji + UPPERCASE name + countdown overline + member stack +
  side-by-side progress card (stacks below on mobile/tablet).
- **Filter chips:** ALL + one chip per category (Travel/Food/Adventure/Wellness/Culture).
  Tap to filter the item list. Active chip uses the category color with a sticker shadow.
- **Items grid:** 1 col on mobile/tablet, 2 cols on desktop. Items separated into
  "todo" and "done" sections — done section appears below a dashed `· DONE · {n} ·`
  divider with reduced opacity.
- **Tap an item** → push `#/item/{id}`.
- **Item card:** sticker card with a vertical colored band on the left (category
  color), category icon, item title, meta chips (category / date / location), optional
  memory quote in the category color, and right-side reactions (starred / hearts /
  tagged-friends stack).

### 4. Item with memory (`#/item/:id`)
- **Source:** `screens-a.jsx` → `ScreenItem`
- **Desktop:** 2-column grid (`1.1fr 1fr`). Left: hero sticker poster + reactions row
  + done/edit CTAs. Right: photo strip + memory quote + comments.
- **Mobile / tablet:** Same content stacked vertically.
- **Hero poster:** big category-color sticker with category badge + DONE badge,
  large icon, UPPERCASE title, meta row (date / location / tagged people).
- **Reactions:** Heart / Star / Comment count / Share — active reactions filled with
  their color and a sticker shadow.
- **Photo strip:** horizontal scroll of tilted sticker-framed photo placeholders,
  ending with a dashed "+" slot for adding. Real photos load from Supabase storage.
- **Memory quote:** white sticker with a small lime "MEMORY · BY {name}" tag stuck
  to its top-left corner. Large Space Grotesk quote in -0.5 ls.
- **Comments:** stacked rows — avatar + sticker bubble + timestamp. Bottom: comment
  input + send button.

### 5. Add to bucket (`#/add`)
- **Source:** `screens-b.jsx` → `ScreenAdd`
- **Layout:** Max-width 720px, centered. Same on all viewports.
- **Top bar:** CANCEL / "NEW THING" title / "ADD →" (disabled until title has text).
- **Bucket selector:** cyan sticker pill showing the active bucket; dropdown to change.
- **Title card:** category-colored sticker. Big sticker icon button on the left (tap
  to open the icon picker), and an UPPERCASE title input on the right. "Browse
  sticker library · 30+ →" button below.
- **Category chips:** sticker chips for each category. Active = filled color + tilt.
- **Optional fields:** stacked rows for Target Date, Location, "Why you want this".
- **Tag people:** friend stickers with avatar + first name. Selected = filled in the
  current category color.

### 6. Memories wall (`#/memories`)
- **Source:** `screens-b.jsx` → `ScreenMemories`
- **Headline:** "STUFF YOU [DID]." with `DID` in a pink highlight block.
- **Filters:** ALL (ink-filled) + year tabs + bucket-specific filters + "WITH JAY"
  people filters.
- **Masonry grid:** 2 cols mobile, 3 tablet, 4 desktop. Each memory tile = sticker card
  with a colored band header (category + date), a striped photo placeholder with the
  memory's icon in a sticker frame top-left, and a footer with title + member stack
  + ✓ check.
- **Tilts** are static per-index (no animation) so cards have visual variety without
  feeling busy.

### 7. Activity feed (`#/activity`)
- **Source:** `screens-b.jsx` → `ScreenActivity`
- **Layout:** Max-width 760px on desktop, full-width on mobile.
- **Headline:** "WHAT'S BEEN [UP]." with `UP` in a cyan highlight.
- **"3 NEW" red sticker badge** in the top-right of the heading.
- **Bucket filter chips:** ALL + one per bucket with emoji prefix.
- **Grouped rows** by day (`· TODAY ·` / `· YESTERDAY ·` / `· THIS WEEK ·`).
- **Activity row:** avatar with a category-colored badge stuck to bottom-right
  (showing the action glyph: photo / chat / check / plus / heart / friends). Body:
  `MARA added "Title"` with the action verb in muted ink. Comments show a colored
  sticker quote.

### 8. Friends & invite (`#/friends`)
- **Source:** `screens-b.jsx` → `ScreenFriends`
- **Invite poster:** big blue sticker card with two floating decorative tint orbs
  (yellow + pink). UPPERCASE "BRING SOMEONE ALONG." headline + body + Share button +
  invite code button.
- **Friends grid:** 2 cols mobile, 3 tablet, 4 desktop. Each friend = sticker card
  with their colored initials avatar, first name, handle, shared-bucket count, and a
  "VIEW PROFILE →" button.

### 9. Sticker library (`#/icons`)
- **Source:** `screens-b.jsx` → `ScreenIcons`
- **Headline:** "PICK A [STICKER]." with `STICKER` in a pink highlight.
- **Search:** sticker-style input — filters across all icons by label / id / category.
- **Category chips:** Travel / Food / Adventure / Wellness / Social / Special. Hidden
  when search is active.
- **Icon grid:** 3 cols mobile, 5 tablet, 7 desktop. Each icon sits in its colored
  sticker frame with a random static tilt. Selected icon gets a 3px black border +
  larger shadow + -4° rotate.
- **Sticky preview footer:** white sticker card with the picked icon, its label, and
  its id/color metadata — stays visible while scrolling.
- **PICK ↓** in the top right confirms the selection and routes back to `#/add`.

### 10. 404 (`#/{anything-else}`)
- **Source:** `screens-c.jsx` → `Screen404`
- **Layout:** Full-bleed (no app chrome). Centered max-width 560px.
- **Big sticker digits:** three large `4`, `0`, `4` sticker squares in cyan/pink/yellow
  with rotation, large hard shadow.
- **Headline:** "NOT ON THE [LIST]." with `LIST` in a lime highlight.
- **CTAs:** ← BACK TO MY BUCKETS (ink) and ＋ ADD A THING (white).
- **Decorative floating stickers** in the background corners.

---

## Sticker design system

### Tokens (`tokens.jsx`)

```js
const T = {
  bg:        '#FFF6E5',  // butter cream — main app background
  surface:   '#FFFFFF',  // sticker card surface
  ink:       '#0C0C0C',  // near-black — all borders, primary type
  inkMuted:  '#3A3A3A',  // secondary type
  inkSubtle: '#7A7A7A',  // tertiary type
  cyan:      '#7DDCFF',  // adventure-related, info, water/sky
  pink:      '#FF7AB6',  // food, hearts
  lime:      '#C7F356',  // wellness, success/done
  yellow:    '#FFD43B',  // travel, sun, highlight default
  blue:      '#5C7BFF',  // adventure, music, primary
  red:       '#FF6B5A',  // urgent/alerts, fire
};

// Sidebar uses a slightly more saturated cream + dotted texture:
const SIDEBAR_BG = '#F5E8C7';  // background
// radial-gradient dot pattern, 14px grid, 1.5px dots @ rgba(12,12,12,0.06)
```

### Sticker primitives (`tokens.jsx`)

```js
const STICKER_BORDER    = '2.5px solid #0C0C0C';
const STICKER_BORDER_SM = '2px solid #0C0C0C';
const STICKER_SHADOW    = '4px 4px 0 #0C0C0C';
const STICKER_SHADOW_SM = '3px 3px 0 #0C0C0C';
const STICKER_SHADOW_LG = '6px 6px 0 #0C0C0C';
```

Build these as reusable components first:

- `<Sticker color tilt radius shadow border onClick style>` — wraps anything in a
  sticker frame. Optional onClick. Used for cards, hero panels, badges, photo wrappers.
- `<StickerButton color size>` — call-to-action button. Sizes: sm / md / lg. Always
  whiteSpace: nowrap; uses press-down feedback via the `.bk-sticker-btn` class.
- `<StickerChip active color onClick>` — pill-shaped sticker. Active = filled color
  + sticker shadow; inactive = white with a softer ghost shadow.
- `<HighlightBlock color tilt size>` — the rotated inline color block used inside
  headlines. Wraps text. Always has a 2px ink border + 3px shadow.
- `<Avatar p size>` — initials in a colored sticker circle.
- `<AvatarStack ids size max ring>` — overlapping avatar stack with a "+N" overflow.
- `<PhotoSlot w h color label>` — striped SVG photo placeholder. Replace with
  real `<img>` tag when porting (use Supabase signed URLs).
- `<StickerEmoji id size frameColor tilt selected>` — renders a hand-drawn icon
  (from the icon library) inside a sticker frame.

### Typography (load via Google Fonts)

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" />
```

| Family | Weights | Used for |
|---|---|---|
| Space Grotesk | 700 | All display headlines + buttons + chips + UPPERCASE labels |
| Geist | 400 / 500 / 600 / 700 | Body copy, longform text, comment text |
| Geist Mono | 400 / 500 | Invite codes, IDs, technical labels |

### Spacing scale

- Card padding: 14, 16, 18, 20, 22, 28, 32 (responsive — larger at desktop)
- Section gap: 14, 16, 18, 22, 32
- Border radius: 8 (tiny pill), 12 (input/small button), 14 (small card), 16–18 (card),
  20–22 (hero), 99 (full pill)
- Shadow offset: always 3px or 4px or 6px — **never blurred, always hard**

### Animation

- Sticker buttons press inward 2px on `:active`, shadow shrinks to 1px.
- Tilt rotations are **static** (set per-index, e.g. `(i % 3 === 1 ? -1 : 1)`) — do
  not animate them.
- Hover lifts and other effects are **deliberately absent** for now — keep the design
  feeling tactile / physical, not animated. (One exception: the press-down feedback
  on sticker buttons.)

---

## Icon libraries

The app ships **two icon assets:**

### 1. `sticker-emoji-icons.jsx` — illustrated emoji set (30 icons)

Richly illustrated icons in the style of system emoji like 🥮 and 🌍 — multi-color
layered shapes with 1.5–2px black outlines and small highlights for dimensionality.
Each pairs with a default frame color from the palette. **This is the primary library
users pick from when creating items / buckets.**

**Categories:**
- Travel — Globe, Plane, Suitcase, Camera, Mountains
- Food — Pastry, Coffee, Pizza, Croissant, Ice cream, Cake, Donut, Burger, Wine
- Adventure — Tent, Lightning, Fire, Wave, Bike
- Wellness — Sun, Moon, Leaf, Flower, Drop
- Social — Heart, Gift, Balloon, Music, Chat (speech)
- Special — Star, Crown, Diamond, Trophy, Rainbow

**Data shape:**
```ts
type StickerIcon = {
  id: string;           // e.g. 'pastry', 'globe'
  cat: string;          // e.g. 'Food'
  color: keyof Palette; // default frame color (e.g. 'pink')
  label: string;        // display name e.g. 'Pastry'
  draw: (T: Palette) => ReactNode;  // SVG content for a 48×48 viewBox
};
```

Extra "pigment" colors used inside icons but NOT in chrome (defined as `SE_PIGMENTS`):
`pastry`, `tan`, `choc`, `creamPink`, `sky`, `ocean`, `grass`, `deepGreen`, `steam`,
`silver`, `gold`, `goldDark`, `cherry`, `cream`, `bun`, `crustDark`.

### 2. `nav-icons.jsx` — stroke nav icons (11 icons)

Simple 24×24 outline icons for the bottom tab bar and small in-context affordances.
All share: 2.4px stroke, `#0C0C0C` ink, round line caps/joins, no fill.

**Icons:** `bucket`, `clock`, `plus`, `photo`, `friends`, `pin`, `heart`, `star`,
`check`, `chat`, `search`.

Each is defined as a structured JSON object with paths + primitive elements (circles/
rects) so they port to any SVG library. The file includes a React Native port snippet
at the bottom — ignore for web; use the web `NavIcon` component directly.

### Storing icon picks

The existing Supabase schema (`bucket_schema.sql`) already has an `emoji` column on
`items` and `buckets`. To store a sticker library pick, add an `icon_id` column:

```sql
alter table public.items add column icon_id text;
alter table public.buckets add column icon_id text;
```

Store the icon's `id` (e.g. `'pastry'`, `'globe'`). The renderer looks it up from
the local library — no need to store the SVG itself.

Backward-compat: if `icon_id` is null, fall back to rendering the unicode emoji from
the existing `emoji` column.

---

## Routing

The prototype uses hash routing via `useRoute()` in `tokens.jsx`. When porting:

- **Vite + React Router**: `BrowserRouter` with these routes:
  - `/` → buckets
  - `/login`
  - `/bucket/:id`
  - `/item/:id`
  - `/add`
  - `/memories`
  - `/activity`
  - `/friends`
  - `/icons`
  - `*` → 404

- **Next.js App Router**: same paths as folders under `app/`. Use `[id]/page.tsx` for
  the dynamic ones. The `not-found.tsx` file becomes the 404.

The Login and 404 screens **bypass the AppShell** (no sidebar / no bottom-nav). All
other screens render inside `<AppShell>`. Implement that as a layout component that
wraps all routes except `/login` and the 404.

---

## State management

The prototype is intentionally state-light:

- **Route state** — driven by URL hash. Port to React Router / Next.js Router.
- **Layout switcher** on the home screen — persisted to `localStorage` under
  `bk-home-layout` (`'featured'` | `'grid'` | `'list'`). Keep this.
- **Form state** (add screen, icon picker, comment input, login fields) — local React
  state. No global needed.
- **Picked icon flow** — when navigating Add → Icons → Add, the picked icon is held
  in the App component's local state. In a real app, you'd lift this to a route
  query param, a small router state, or a global store. **Tanstack Query** + React
  Router state, or **Zustand** for a tiny global, would both be appropriate.

For the actual data (buckets, items, etc.), use **Supabase** + a query library
(**Tanstack Query** or **SWR**). The existing `bucketlist-app/` mobile code already
has `src/lib/supabase.ts` and `src/store/index.ts` — adapt the same shape for web.

---

## Mock data → real data

The prototype uses inline mock data in `tokens.jsx`:

- `BK_PROFILES` — five fake users with `id`, `name`, `handle`, `initials`, `color`
- `BK_BUCKETS` — four buckets with members, progress, countdown
- `BK_ITEMS` — eight items across categories with notes, tags, photos count
- `BK_ACTIVITY` — eight activity feed entries

Replace these with Supabase queries. The shapes match the existing `bucketlist-app/`
schema closely — the main additions are `icon_id` (see above) and `color` (avatar
color reference for profiles) which already exists as `avatar_color int` in the
profiles table.

---

## Files in this bundle

| File | Purpose |
|---|---|
| `Bucket List.html` | Entry point. Open in a browser. |
| `tokens.jsx` | Design tokens, mock data, sticker primitives, `useViewport` + `useRoute` hooks, global CSS injection. **Port this first.** |
| `app-shell.jsx` | Responsive AppShell — sidebar / topbar / bottom-nav. Renders chrome around all main screens. |
| `screens-a.jsx` | Buckets home (all 3 layouts) · Bucket detail · Item detail |
| `screens-b.jsx` | Add to bucket · Memories · Activity · Friends · Icon picker |
| `screens-c.jsx` | Login · 404 |
| `app.jsx` | Root component — wires routing, picks AppShell vs full-bleed (login/404). |
| `sticker-emoji-icons.jsx` | The 30-icon illustrated library (`SE_ICONS`). |
| `nav-icons.jsx` | The 11-icon stroke nav library (`NAV_ICONS` + `NavIcon` component). |

When porting, the conversion is roughly:

1. Set up Vite + React + TypeScript (or Next.js).
2. Add Google Fonts via `<link>` in `index.html` or `_document.tsx`.
3. Create `src/design/tokens.ts` from `tokens.jsx` — extract `T`, sticker borders,
   shadows, fonts. Add TypeScript types.
4. Port `Sticker`, `StickerButton`, `StickerChip`, `HighlightBlock`, `Avatar`,
   `AvatarStack`, `PhotoSlot`, `StickerEmoji` into `src/components/sticker/`.
5. Port `useViewport`. Replace `useRoute` with React Router's `useNavigate` + URL
   params.
6. Port `AppShell` + `Sidebar` + `TopBar` + `BottomNav` into `src/components/shell/`.
7. Build each screen as a route component, one file per screen under `src/pages/`
   or `src/routes/`.
8. Hook up Supabase (reuse the existing `bucketlist-app/src/lib/supabase.ts`
   client config and schema).
9. Wire the auth gate: the `/login` route is unauthenticated; everything else is
   protected.

Estimated effort: **5–7 days** for one experienced React developer to get a
fully-working production version with real Supabase data, given the prototype is
this complete.

---

## What to ignore in the prototype when porting

- The Babel `<script type="text/babel">` inline-transpilation setup — production
  needs a real build (Vite/Next).
- The `window.SOMETHING = ...` global exports at the bottom of each file — those
  exist because Babel scripts don't share scope. In a real bundler, use proper
  `import` / `export`.
- The `Object.assign(window, ...)` calls — same reason.
- The mock data structures in `tokens.jsx` — replace with Supabase queries.

Everything else is final.
