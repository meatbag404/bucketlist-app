// Bucket List — design tokens shared with JS.
// Mirrors design_handoff_bucket_web/tokens.jsx → T, fonts, sticker primitives.

export const T = {
  bg:        '#FFF6E5',
  surface:   '#FFFFFF',
  ink:       '#0C0C0C',
  inkMuted:  '#3A3A3A',
  inkSubtle: '#7A7A7A',
  cyan:      '#7DDCFF',
  pink:      '#FF7AB6',
  lime:      '#C7F356',
  yellow:    '#FFD43B',
  blue:      '#5C7BFF',
  red:       '#FF6B5A',
  sidebarBg: '#F5E8C7',
} as const

export type ThemeColor = keyof typeof T

export const FONT_DISPLAY = '"Space Grotesk", "Geist", -apple-system, system-ui, sans-serif'
export const FONT_UI      = '"Geist", "Space Grotesk", -apple-system, system-ui, sans-serif'
export const FONT_MONO    = '"Geist Mono", ui-monospace, monospace'

export const STICKER_BORDER     = '2.5px solid #0C0C0C'
export const STICKER_BORDER_SM  = '2px solid #0C0C0C'
export const STICKER_SHADOW     = '4px 4px 0 #0C0C0C'
export const STICKER_SHADOW_SM  = '3px 3px 0 #0C0C0C'
export const STICKER_SHADOW_LG  = '6px 6px 0 #0C0C0C'
export const STICKER_SHADOW_GHOST = '2px 2px 0 rgba(12,12,12,0.18)'

// Color resolver: accepts a palette key or a raw color string.
export function color(c?: string): string {
  if (!c) return T.surface
  return (T as Record<string, string>)[c] || c
}

// Avatar color name pool keyed off profile.avatar_color int.
export const AVATAR_COLOR_NAMES: ThemeColor[] = [
  'red', 'cyan', 'blue', 'pink', 'lime', 'yellow', 'pink', 'cyan',
]

export function avatarColor(idx: number | null | undefined): string {
  const i = ((idx ?? 0) % AVATAR_COLOR_NAMES.length + AVATAR_COLOR_NAMES.length) % AVATAR_COLOR_NAMES.length
  return T[AVATAR_COLOR_NAMES[i]]
}

// Palette tokens usable as item / bucket card colors (excludes inks / surfaces / bg).
export const STICKER_COLOR_TOKENS = ['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const
export type StickerColorToken = typeof STICKER_COLOR_TOKENS[number]

// Deterministic color for an item from its id. Stable across renders.
export function hashedColorToken(id: string): StickerColorToken {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return STICKER_COLOR_TOKENS[Math.abs(h) % STICKER_COLOR_TOKENS.length]
}

// Pick a random sticker color (used when creating a new item without a chosen color).
export function randomColorToken(): StickerColorToken {
  return STICKER_COLOR_TOKENS[Math.floor(Math.random() * STICKER_COLOR_TOKENS.length)]
}

// Resolve an item's display color: prefer explicit color_token, else hash from id, else random fallback.
export function itemColor(item: { id?: string | null; color_token?: string | null }): string {
  if (item.color_token && (STICKER_COLOR_TOKENS as readonly string[]).includes(item.color_token)) {
    return T[item.color_token as StickerColorToken]
  }
  if (item.id) return T[hashedColorToken(item.id)]
  return T[randomColorToken()]
}

// Resolve a bucket's display color (same scheme as items).
export function bucketColor(bucket: { id?: string | null; color_token?: string | null }): string {
  if (bucket.color_token && (STICKER_COLOR_TOKENS as readonly string[]).includes(bucket.color_token)) {
    return T[bucket.color_token as StickerColorToken]
  }
  if (bucket.id) return T[hashedColorToken(bucket.id)]
  return T[randomColorToken()]
}

// Same but returns the token string ('cyan'/'pink'/etc.) — useful when callers
// want to compute color outside of T (e.g. for Sticker color prop).
export function bucketColorToken(bucket: { id?: string | null; color_token?: string | null }): StickerColorToken {
  if (bucket.color_token && (STICKER_COLOR_TOKENS as readonly string[]).includes(bucket.color_token)) {
    return bucket.color_token as StickerColorToken
  }
  if (bucket.id) return hashedColorToken(bucket.id)
  return randomColorToken()
}

// Category map for items/buckets.
export const CATS = {
  travel:    { label: 'Travel',    color: 'yellow' as ThemeColor },
  food:      { label: 'Food',      color: 'pink'   as ThemeColor },
  adventure: { label: 'Adventure', color: 'blue'   as ThemeColor },
  wellness:  { label: 'Wellness',  color: 'lime'   as ThemeColor },
  culture:   { label: 'Culture',   color: 'cyan'   as ThemeColor },
} as const

export type CategoryKey = keyof typeof CATS
