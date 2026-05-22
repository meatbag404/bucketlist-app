// Bold sticker design system — Concept C
export const sticker = {
  bg:       '#FFF6E5',
  surface:  '#FFFFFF',
  ink:      '#0C0C0C',
  inkMuted: '#3A3A3A',
  cyan:     '#7DDCFF',
  pink:     '#FF7AB6',
  lime:     '#C7F356',
  yellow:   '#FFD43B',
  blue:     '#5C7BFF',
  red:      '#FF6B5A',
}

export const BUCKET_COLORS = [
  '#7DDCFF', // cyan
  '#C7F356', // lime
  '#FF7AB6', // pink
  '#FFD43B', // yellow
  '#5C7BFF', // blue
  '#FF6B5A', // red
]

export const BUCKET_COLOR_LABELS = [
  'Cyan', 'Lime', 'Pink', 'Yellow', 'Blue', 'Red',
]

// Category → sticker color
export const CAT_COLORS: Record<string, string> = {
  travel:    '#FFD43B',
  food:      '#FF7AB6',
  adventure: '#5C7BFF',
  wellness:  '#C7F356',
  culture:   '#7DDCFF',
}

export function getCatColor(key: string): string {
  return CAT_COLORS[key] ?? sticker.cyan
}

// Color key → hex (for sticker library icon colors)
export const COLOR_MAP: Record<string, string> = {
  cyan:   '#7DDCFF',
  pink:   '#FF7AB6',
  lime:   '#C7F356',
  yellow: '#FFD43B',
  blue:   '#5C7BFF',
  red:    '#FF6B5A',
}

export function resolveColor(c: string): string {
  return COLOR_MAP[c] ?? c
}
