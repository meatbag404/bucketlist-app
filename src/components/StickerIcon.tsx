/**
 * StickerIcon — unified sticker renderer.
 *
 * Accepts either a unicode emoji string ("✈️") or a custom icon id ("plane").
 * When the value is a known custom icon id it renders the SVG illustration;
 * otherwise it falls back to a plain emoji <Text>.
 *
 * Usage:
 *   <StickerIcon value={item.emoji} size={32} />
 */

import React from 'react'
import { Text } from 'react-native'
import { CustomIconView, isCustomIconId } from '../icons/customIconRegistry'

interface Props {
  value: string          // emoji string or custom icon id
  size?: number          // pixel size (default 28)
  style?: object
}

export function StickerIcon({ value, size = 28, style }: Props) {
  if (!value) return null

  if (isCustomIconId(value)) {
    return <CustomIconView id={value} size={size} />
  }

  return (
    <Text style={[{ fontSize: size * 0.75, lineHeight: size }, style]}>
      {value}
    </Text>
  )
}
