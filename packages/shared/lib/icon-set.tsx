// Curated Icons8 "Flat Color" (platform: `color`) icon set used as the
// sticker library across buckets and items. Icons are referenced by
// stable Icons8 IDs and rendered via the public img.icons8.com CDN.

import * as React from 'react'

export type IconCategoryKey =
  | 'travel'
  | 'food'
  | 'adventure'
  | 'wellness'
  | 'culture'
  | 'general'

export type Icon8Entry = {
  id: string          // Icons8 stable id (used in img URL & DB)
  name: string        // Human label shown in picker
  category: IconCategoryKey
}

// Picked manually via the icons8 MCP. Keep ids stable — they're stored in
// buckets.icon_id / items.icon_id.
export const ICON_SET: readonly Icon8Entry[] = [
  // Travel
  { id: '21023',         name: 'Airplane',       category: 'travel' },
  { id: '17608',         name: 'Passport',       category: 'travel' },
  { id: '17569',         name: 'Beach',          category: 'travel' },
  { id: '17571',         name: 'Beach Umbrella', category: 'travel' },
  { id: '17576',         name: 'Camping Tent',   category: 'travel' },
  { id: '17605',         name: 'Museum',         category: 'travel' },
  { id: '110283',        name: 'Mountain',       category: 'travel' },
  { id: '15126',         name: 'Car',            category: 'travel' },
  { id: '17577',         name: 'Car Rental',     category: 'travel' },
  { id: '11917',         name: 'Ferris Wheel',   category: 'travel' },

  // Food
  { id: '12867',         name: 'Pizza',          category: 'food' },
  { id: '30001',         name: 'Coffee',         category: 'food' },
  { id: '13286',         name: 'Cafe',           category: 'food' },
  { id: '15616',         name: 'Sushi',          category: 'food' },
  { id: 'WF8h2gYTelI4',  name: 'Wine & Glass',   category: 'food' },
  { id: '12879',         name: 'Wine Bottle',    category: 'food' },
  { id: '12868',         name: 'Birthday Cake',  category: 'food' },

  // Adventure
  { id: '16958',         name: 'Trekking',       category: 'adventure' },
  { id: '16964',         name: 'Surfing',        category: 'adventure' },
  { id: '16928',         name: 'Skydiving',      category: 'adventure' },
  { id: '16963',         name: 'Paddleboard',    category: 'adventure' },
  { id: '33515',         name: 'Mountain Bike',  category: 'adventure' },
  { id: '15175',         name: 'Rocket',         category: 'adventure' },

  // Wellness
  { id: '16959',         name: 'Yoga',           category: 'wellness' },
  { id: '16902',         name: 'Meditation',     category: 'wellness' },
  { id: '16887',         name: 'Dumbbell',       category: 'wellness' },
  { id: '16936',         name: 'Running',        category: 'wellness' },
  { id: '16890',         name: 'Exercise',       category: 'wellness' },
  { id: '23042',         name: 'Spa Flower',     category: 'wellness' },

  // Culture
  { id: '13483',         name: 'Theatre Mask',   category: 'culture' },
  { id: '12203',         name: 'Guitar',         category: 'culture' },
  { id: '08EQoYdXCFcs',  name: 'Bass Guitar',    category: 'culture' },
  { id: 'ZHdDvjWMEIs-',  name: 'Book Reading',   category: 'culture' },
  { id: '13552',         name: 'Reading',        category: 'culture' },
  { id: 'a8udZG35VQ2Z',  name: 'Mona Lisa',      category: 'culture' },
  { id: '12197',         name: 'Graduation Cap', category: 'culture' },
  { id: 'Xwqu8cUREfko',  name: 'Paint Palette',  category: 'culture' },

  // General / Special
  { id: '19295',         name: 'Star',           category: 'general' },
  { id: '57895',         name: 'Heart',          category: 'general' },
  { id: '13075',         name: 'Camera',         category: 'general' },
  { id: '13077',         name: 'Vintage Camera', category: 'general' },
  { id: '18050',         name: 'Flower',         category: 'general' },
  { id: 'ZGYXhUYK9ciX',  name: 'Cat',            category: 'general' },
  { id: '16951',         name: 'Trophy',         category: 'general' },
]

export const ICON_CATEGORIES: { key: IconCategoryKey; label: string }[] = [
  { key: 'travel',    label: 'Travel' },
  { key: 'food',      label: 'Food' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'wellness',  label: 'Wellness' },
  { key: 'culture',   label: 'Culture' },
  { key: 'general',   label: 'General' },
]

const ICON_BY_ID: Record<string, Icon8Entry> = Object.fromEntries(
  ICON_SET.map(i => [i.id, i])
)

export function getIcon(id: string | null | undefined): Icon8Entry | null {
  if (!id) return null
  return ICON_BY_ID[id] ?? null
}

// Icon ids stored in the DB may be prefixed with the Icons8 platform code,
// e.g. `m_outlined:90580` or `plasticine:p5paoLMDn4EU`. Bare ids (no prefix)
// implicitly mean `color` — preserves back-compat with anything saved before
// platform tagging shipped.
export type Icons8Platform = 'color' | 'm_outlined' | 'plasticine' | (string & {})

// Human-friendly label per platform code. Only Papercut is exposed to the
// picker today; the others map to friendly names so legacy stored ids still
// render a sensible style tag.
const PLATFORM_LABELS: Record<string, string> = {
  papercut:        'Papercut',
  // Retained for legacy ids — not selectable in the picker.
  color:           'Flat Color',
  m_outlined:      'Outlined',
  plasticine:      'Plasticine',
  badges:          'Badges',
  laces:           'Laces',
  quill:           'Quill',
  'parakeet-line': 'Parakeet Line',
  'mini-stickers': 'Mini Stickers',
}

// Optional color override for monochrome platforms (Laces, Parakeet, ...).
// Stored as a trailing `@color` suffix on the rawId, e.g.
//   `laces:G4zH9X90bt1j@white`  → renders Laces icon tinted white
//   `laces:G4zH9X90bt1j`        → default (no override; renders native color)
export type IconColorOverride = 'black' | 'white'
const COLOR_OVERRIDE_HEX: Record<IconColorOverride, string> = {
  black: '000000',
  white: 'FFFFFF',
}

export function parseIconId(stored: string | null | undefined): {
  rawId: string
  platform: Icons8Platform
  color: IconColorOverride | null
} {
  if (!stored) return { rawId: '', platform: 'color', color: null }
  // Split platform prefix
  const colonIx = stored.indexOf(':')
  let platform: Icons8Platform = 'color'
  let body = stored
  if (colonIx >= 0) {
    platform = stored.slice(0, colonIx) as Icons8Platform
    body = stored.slice(colonIx + 1)
  }
  // Split optional `@color` suffix
  const atIx = body.lastIndexOf('@')
  let color: IconColorOverride | null = null
  let rawId = body
  if (atIx > 0) {
    const tag = body.slice(atIx + 1).toLowerCase()
    if (tag === 'black' || tag === 'white') {
      color = tag
      rawId = body.slice(0, atIx)
    }
  }
  return { platform, rawId, color }
}

// Encode a picked icon back into the storage format. Color picks stay bare
// so legacy rows and freshly picked color ids look the same.
export function makeIconId(
  rawId: string,
  platform: Icons8Platform,
  color?: IconColorOverride | null,
): string {
  if (!rawId) return ''
  const platformPart = (!platform || platform === 'color') ? rawId : `${platform}:${rawId}`
  return color ? `${platformPart}@${color}` : platformPart
}

export function iconPlatformLabel(stored: string | null | undefined): string | null {
  const { platform } = parseIconId(stored)
  if (platform === 'color') return null   // default — no chip needed
  return PLATFORM_LABELS[platform] ?? platform
}

// Icons8 public CDN URL for a given icon id at the requested pixel size.
// The CDN's `?id=` endpoint is platform-agnostic (each Icons8 id is unique
// across the whole catalog), so we just strip any platform prefix. If the
// stored id includes a color override (`@white` / `@black`), append it as
// the CDN's `&color=` param — only honored for monochrome platforms.
export function icon8Url(storedOrRawId: string, size: number = 96): string {
  const s = Math.max(16, Math.min(512, Math.round(size)))
  const { rawId, color } = parseIconId(storedOrRawId)
  const base = `https://img.icons8.com/?id=${encodeURIComponent(rawId)}&format=png&size=${s}`
  return color ? `${base}&color=${COLOR_OVERRIDE_HEX[color]}` : base
}

type Icon8Props = {
  id: string
  size?: number
  alt?: string
  style?: React.CSSProperties
}

// Renders an Icons8 sticker by id. Uses 2x DPR so it stays crisp on retina.
export function Icon8({ id, size = 48, alt, style }: Icon8Props) {
  const px = Math.round(size)
  const src = icon8Url(id, px * 2)
  const label = alt ?? getIcon(id)?.name ?? 'icon'
  return (
    <img
      src={src}
      alt={label}
      width={px}
      height={px}
      draggable={false}
      style={{ width: px, height: px, display: 'block', ...style }}
    />
  )
}
