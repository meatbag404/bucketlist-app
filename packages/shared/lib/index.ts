// Public surface for the shared package.

export { supabase } from './supabase'
export { useStore, useFilteredItems } from './store'
export type { Database } from './types'

// Design system
export {
  T,
  FONT_DISPLAY,
  FONT_UI,
  FONT_MONO,
  STICKER_BORDER,
  STICKER_BORDER_SM,
  STICKER_SHADOW,
  STICKER_SHADOW_SM,
  STICKER_SHADOW_LG,
  STICKER_SHADOW_GHOST,
  CATS,
  AVATAR_COLOR_NAMES,
  STICKER_COLOR_TOKENS,
  color,
  avatarColor,
  hashedColorToken,
  randomColorToken,
  itemColor,
  bucketColor,
  bucketColorToken,
} from './design-tokens'
export type { ThemeColor, CategoryKey, StickerColorToken } from './design-tokens'

export {
  Sticker,
  StickerButton,
  StickerChip,
  HighlightBlock,
  Avatar,
  AvatarStack,
  PageHeading,
  SectionRule,
  SectionLabel,
  MonoLabel,
} from './sticker'
export type { AvatarProfile } from './sticker'

export { NavIcon, NAV_ICONS } from './nav-icons'
export type { NavIconName } from './nav-icons'

export { useViewport } from './use-viewport'
export type { Viewport } from './use-viewport'
