/**
 * Sticker design primitives — bold neo-brutalist style.
 * Hard 4px offset shadows, thick ink borders, saturated color fills.
 */
import React from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ViewStyle, TextStyle,
  Pressable, GestureResponderEvent,
} from 'react-native'
import { sticker } from '../design/sticker'

// ─── Hard-shadow wrapper ───────────────────────────────────────
interface StickerProps {
  color?: string
  radius?: number
  shadow?: number
  border?: number
  tilt?: number
  style?: ViewStyle
  children: React.ReactNode
  noShadow?: boolean
  dashed?: boolean
}

export function Sticker({
  color = sticker.surface,
  radius = 16,
  shadow = 4,
  border = 2.5,
  tilt = 0,
  style,
  children,
  noShadow = false,
  dashed = false,
}: StickerProps) {
  const tiltStyle: ViewStyle = tilt !== 0
    ? { transform: [{ rotate: `${tilt}deg` }] }
    : {}

  return (
    <View style={[{ marginBottom: noShadow ? 0 : shadow, marginRight: noShadow ? 0 : shadow }, tiltStyle, style]}>
      {!noShadow && (
        <View
          style={{
            position: 'absolute',
            top: shadow,
            left: shadow,
            right: 0,
            bottom: 0,
            backgroundColor: sticker.ink,
            borderRadius: radius,
          }}
        />
      )}
      <View
        style={{
          backgroundColor: color,
          borderRadius: radius,
          borderWidth: border,
          borderColor: sticker.ink,
          borderStyle: dashed ? 'dashed' : 'solid',
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  )
}

// ─── Pressable sticker button ──────────────────────────────────
interface StickerButtonProps extends StickerProps {
  onPress?: (e: GestureResponderEvent) => void
  disabled?: boolean
  activeOpacity?: number
}

export function StickerButton({
  onPress,
  disabled = false,
  activeOpacity = 0.85,
  color = sticker.surface,
  radius = 12,
  shadow = 3,
  border = 2,
  tilt = 0,
  style,
  children,
  noShadow = false,
}: StickerButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[
        { marginBottom: noShadow ? 0 : shadow, marginRight: noShadow ? 0 : shadow },
        tilt !== 0 ? { transform: [{ rotate: `${tilt}deg` }] } : {},
        style,
      ]}
    >
      {!noShadow && (
        <View
          style={{
            position: 'absolute',
            top: shadow,
            left: shadow,
            right: 0,
            bottom: 0,
            backgroundColor: sticker.ink,
            borderRadius: radius,
          }}
        />
      )}
      <View
        style={{
          backgroundColor: color,
          borderRadius: radius,
          borderWidth: border,
          borderColor: sticker.ink,
          overflow: 'hidden',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  )
}

// ─── Chip / pill ───────────────────────────────────────────────
interface StickerChipProps {
  label: string
  color?: string
  textColor?: string
  active?: boolean
  onPress?: () => void
  tilt?: number
  small?: boolean
}

export function StickerChip({
  label,
  color = sticker.surface,
  textColor = sticker.ink,
  active = false,
  onPress,
  tilt = 0,
  small = false,
}: StickerChipProps) {
  const shadow = active ? 3 : 0
  const Container = onPress ? TouchableOpacity : View

  const containerProps = onPress
    ? { onPress, activeOpacity: 0.8 }
    : {}

  return (
    <Container
      {...containerProps}
      style={[
        { marginBottom: shadow, marginRight: shadow },
        tilt !== 0 ? { transform: [{ rotate: `${tilt}deg` }] } : {},
      ]}
    >
      {active && (
        <View
          style={{
            position: 'absolute',
            top: shadow,
            left: shadow,
            right: 0,
            bottom: 0,
            backgroundColor: sticker.ink,
            borderRadius: 99,
          }}
        />
      )}
      <View
        style={{
          paddingHorizontal: small ? 10 : 12,
          paddingVertical: small ? 4 : 6,
          backgroundColor: color,
          borderRadius: 99,
          borderWidth: 2,
          borderColor: sticker.ink,
        }}
      >
        <Text
          style={{
            fontSize: small ? 9 : 11,
            fontWeight: '700',
            letterSpacing: 0.5,
            color: textColor,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      </View>
    </Container>
  )
}

// ─── Highlight block (rotated inline color block in headlines) ──
interface HighlightBlockProps {
  color?: string
  tilt?: number
  children: React.ReactNode
  style?: ViewStyle
}

export function HighlightBlock({
  color = sticker.lime,
  tilt = -2,
  children,
  style,
}: HighlightBlockProps) {
  return (
    <View
      style={[
        {
          backgroundColor: color,
          paddingHorizontal: 12,
          paddingVertical: 2,
          borderWidth: 2,
          borderColor: sticker.ink,
          borderRadius: 4,
          transform: [{ rotate: `${tilt}deg` }],
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            fontSize: 52,
            fontWeight: '700',
            letterSpacing: -2.2,
            lineHeight: 60,
            color: sticker.ink,
            textTransform: 'uppercase',
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}

// ─── Avatar stack ───────────────────────────────────────────────
interface AvatarStackProps {
  members: Array<{ profiles?: { name?: string; avatar_color?: number } | null }>
  size?: number
  ringColor?: string
  max?: number
}

const AV_COLORS = [
  { bg: '#7DDCFF', text: '#0C0C0C' },
  { bg: '#C7F356', text: '#0C0C0C' },
  { bg: '#FF7AB6', text: '#0C0C0C' },
  { bg: '#FFD43B', text: '#0C0C0C' },
  { bg: '#5C7BFF', text: '#fff' },
  { bg: '#FF6B5A', text: '#fff' },
]

export function AvatarStack({ members, size = 28, ringColor = sticker.bg, max = 4 }: AvatarStackProps) {
  const shown = members.slice(0, max)
  const extra = members.length - max

  return (
    <View style={{ flexDirection: 'row' }}>
      {shown.map((m, i) => {
        const p = m.profiles
        const name = p?.name ?? '?'
        const colorIdx = (p?.avatar_color ?? i) % AV_COLORS.length
        const ac = AV_COLORS[colorIdx]
        return (
          <View
            key={i}
            style={[
              avatarStyles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: ac.bg,
                borderColor: ringColor,
                marginLeft: i === 0 ? 0 : -(size * 0.3),
              },
            ]}
          >
            <Text style={[avatarStyles.initials, { color: ac.text, fontSize: size * 0.35 }]}>
              {name.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        )
      })}
      {extra > 0 && (
        <View
          style={[
            avatarStyles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: sticker.ink,
              borderColor: ringColor,
              marginLeft: -(size * 0.3),
            },
          ]}
        >
          <Text style={[avatarStyles.initials, { color: '#fff', fontSize: size * 0.3 }]}>
            +{extra}
          </Text>
        </View>
      )}
    </View>
  )
}

const avatarStyles = StyleSheet.create({
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: sticker.bg,
  },
  initials: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
})

// ─── Category chip row ─────────────────────────────────────────
interface CatChip {
  key: string
  label: string
  color: string
  textColor?: string
}

interface CatFilterRowProps {
  chips: CatChip[]
  activeKey: string | null
  onSelect: (key: string | null) => void
}

export function CatFilterRow({ chips, activeKey, onSelect }: CatFilterRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'nowrap' }}>
      <StickerChip
        label="ALL"
        color={activeKey === null ? sticker.ink : sticker.surface}
        textColor={activeKey === null ? sticker.bg : sticker.ink}
        active={activeKey === null}
        onPress={() => onSelect(null)}
      />
      {chips.map(c => (
        <StickerChip
          key={c.key}
          label={c.label}
          color={activeKey === c.key ? c.color : sticker.surface}
          textColor={c.textColor ?? sticker.ink}
          active={activeKey === c.key}
          onPress={() => onSelect(activeKey === c.key ? null : c.key)}
        />
      ))}
    </View>
  )
}
