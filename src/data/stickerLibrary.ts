import { CUSTOM_ICONS } from '../icons/customIconRegistry'

export interface StickerEntry {
  e: string       // emoji character OR custom icon id (e.g. "plane")
  c: string       // frame color key
  label?: string  // display label — always set for custom icons
}

// ── Category → icon ID mapping ─────────────────────────────────────────────
// Defines the order within each category and which section each icon belongs to.
// All IDs must match keys in CUSTOM_ICONS.
const ICON_CATEGORIES: Record<string, string[]> = {
  Travel:        ['globe', 'plane', 'suitcase', 'camera', 'mountain', 'passport', 'map'],
  Food:          ['pastry', 'coffee', 'pizza', 'croissant', 'iceCream', 'cake', 'donut', 'burger', 'wine', 'plate'],
  Adventure:     ['tent', 'bolt', 'flame', 'wave', 'bike'],
  Wellness:      ['sun', 'moon', 'leaf', 'flower', 'drop', 'lotus', 'candle'],
  Social:        ['heart', 'gift', 'balloon', 'music', 'speech', 'people', 'handshake', 'family'],
  Special:       ['star', 'crown', 'diamond', 'trophy', 'rainbow', 'badge'],
  Culture:       ['masks', 'palette', 'ticket'],
  Fitness:       ['medal', 'dumbbell'],
  Learning:      ['bulb', 'gradCap', 'pencil'],
  Career:        ['briefcase', 'target'],
  Nature:        ['paw', 'tree', 'bird'],
  Home:          ['house', 'couch', 'mug'],
  Giving:        ['hands', 'ribbon'],
  Spiritual:     ['peace', 'meditate'],
  Money:         ['coin', 'piggy', 'bag'],
  Creativity:    ['brush'],
  Growth:        ['sprout', 'arrowUp', 'path'],
  Entertainment: ['party', 'confetti'],
  Language:      ['translate'],
}

// Build the STICKER_LIBRARY from the category mapping + registry metadata
export const STICKER_LIBRARY: Record<string, StickerEntry[]> = Object.fromEntries(
  Object.entries(ICON_CATEGORIES).map(([cat, ids]) => [
    cat,
    ids
      .filter(id => id in CUSTOM_ICONS)
      .map(id => ({
        e: CUSTOM_ICONS[id].id,
        c: CUSTOM_ICONS[id].color,
        label: CUSTOM_ICONS[id].label,
      })),
  ])
)

export const STICKER_CATEGORIES = Object.keys(STICKER_LIBRARY)
