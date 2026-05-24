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
  avatarPublicUrl,
} from './sticker'
export type { AvatarProfile } from './sticker'

export { NavIcon, NAV_ICONS } from './nav-icons'
export type { NavIconName } from './nav-icons'

export {
  ICON_SET,
  ICON_CATEGORIES,
  Icon8,
  icon8Url,
  getIcon,
  parseIconId,
  makeIconId,
  iconPlatformLabel,
} from './icon-set'
export type { Icon8Entry, IconCategoryKey, Icons8Platform, IconColorOverride } from './icon-set'

export { IconField, useIconPickerResume } from './icon-field'
export { InlineIconBrowser } from './inline-icon-browser'
export { ConfettiHost, useConfetti } from './confetti'

export {
  daysUntil,
  targetCountdown,
  formatTargetDate,
  todayISO,
} from './target-date'

export { useViewport } from './use-viewport'
export type { Viewport } from './use-viewport'
