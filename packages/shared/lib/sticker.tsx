// Bucket List — sticker design primitives.
// Mirrors design_handoff_bucket_web/tokens.jsx → Sticker, StickerButton, etc.

'use client'

import React from 'react'
import {
  T,
  color as resolveColor,
  FONT_DISPLAY,
  FONT_MONO,
  STICKER_BORDER,
  STICKER_BORDER_SM,
  STICKER_SHADOW,
  STICKER_SHADOW_SM,
  STICKER_SHADOW_LG,
  avatarColor,
  type ThemeColor,
} from './design-tokens'

// ────────────────────────────────────────────────────────────────
// Sticker — wraps anything in a sticker frame (border + hard shadow).
// ────────────────────────────────────────────────────────────────
type StickerProps = {
  children?: React.ReactNode
  /** palette key ('cyan', 'pink', ...) or raw color string. Defaults to white. */
  color?: string
  /** rotation in deg */
  tilt?: number
  radius?: number
  shadow?: 'sm' | 'md' | 'lg'
  border?: 'sm' | 'md'
  onClick?: React.MouseEventHandler<HTMLDivElement>
  className?: string
  style?: React.CSSProperties
}

const shadowMap = { sm: STICKER_SHADOW_SM, md: STICKER_SHADOW, lg: STICKER_SHADOW_LG }
const borderMap = { sm: STICKER_BORDER_SM, md: STICKER_BORDER }

export function Sticker({
  children, color = 'surface', tilt = 0, radius = 16,
  shadow = 'md', border = 'md', onClick, className, style,
}: StickerProps) {
  const cls = [onClick ? 'bk-sticker-btn' : '', className || ''].filter(Boolean).join(' ')
  return (
    <div
      onClick={onClick}
      className={cls || undefined}
      style={{
        background: resolveColor(color),
        border: borderMap[border],
        boxShadow: shadowMap[shadow],
        borderRadius: radius,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// StickerButton — uppercase Space Grotesk CTA with hard shadow.
// ────────────────────────────────────────────────────────────────
type StickerButtonProps = {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  color?: string
  textColor?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
}

export function StickerButton({
  children, onClick, color = 'surface', textColor,
  size = 'md', disabled, type = 'button', style,
}: StickerButtonProps) {
  const isInk = color === 'ink'
  const fg = textColor || (isInk ? '#fff' : T.ink)
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '6px 12px' : '10px 18px'
  const fontSize = size === 'lg' ? 14 : size === 'sm' ? 11 : 12
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="bk-sticker-btn"
      style={{
        padding: pad,
        background: resolveColor(color),
        color: fg,
        border: STICKER_BORDER_SM,
        boxShadow: disabled ? 'none' : STICKER_SHADOW_SM,
        borderRadius: 12,
        fontFamily: FONT_DISPLAY,
        fontSize, fontWeight: 700, letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
        whiteSpace: 'nowrap' as const,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ────────────────────────────────────────────────────────────────
// StickerChip — pill-shaped chip. Active = filled palette color.
// ────────────────────────────────────────────────────────────────
type StickerChipProps = {
  children: React.ReactNode
  active?: boolean
  color?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  style?: React.CSSProperties
}

export function StickerChip({ children, active, color, onClick, style }: StickerChipProps) {
  const activeColor = color || 'ink'
  const bg = active ? resolveColor(activeColor) : T.surface
  // Flip text to cream when the active fill is dark enough to hide ink.
  const ink = active && (activeColor === 'ink' || activeColor === 'blue' || activeColor === 'red')
    ? T.bg
    : T.ink
  return (
    <button
      onClick={onClick}
      className="bk-sticker-btn"
      style={{
        padding: '6px 12px',
        background: bg, color: ink,
        border: STICKER_BORDER_SM,
        boxShadow: active ? STICKER_SHADOW_SM : '2px 2px 0 rgba(12,12,12,0.15)',
        borderRadius: 99,
        fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
        textTransform: 'uppercase' as const,
        whiteSpace: 'nowrap' as const, flex: '0 0 auto',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ────────────────────────────────────────────────────────────────
// HighlightBlock — rotated inline color block inside headlines.
// ────────────────────────────────────────────────────────────────
type HighlightBlockProps = {
  children: React.ReactNode
  color?: string
  tilt?: number
  size?: 'sm' | 'lg'
}

export function HighlightBlock({ children, color = 'lime', tilt = -2, size = 'lg' }: HighlightBlockProps) {
  const pad = size === 'lg' ? '0 12px' : '0 8px'
  return (
    <span style={{
      background: resolveColor(color), padding: pad,
      display: 'inline-block',
      transform: `rotate(${tilt}deg)`,
      border: STICKER_BORDER_SM,
      boxShadow: STICKER_SHADOW_SM,
    }}>
      {children}
    </span>
  )
}

// ────────────────────────────────────────────────────────────────
// Avatar / AvatarStack — initials in a colored sticker circle.
// Profile shape is loose to match our Supabase row.
// ────────────────────────────────────────────────────────────────
export type AvatarProfile = {
  name?: string | null
  handle?: string | null
  initials?: string | null
  avatar_color?: number | null
  /** palette color name override */
  color?: string | null
  /** storage path inside the `avatars` Supabase bucket, e.g. `<userId>/abc.jpg` */
  avatar_url?: string | null
}

function getInitials(p: AvatarProfile | undefined | null): string {
  if (!p) return '?'
  if (p.initials) return p.initials.slice(0, 2).toUpperCase()
  const name = p.name || p.handle || ''
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getAvatarBg(p: AvatarProfile | undefined | null): string {
  if (!p) return T.cyan
  if (p.color) return resolveColor(p.color)
  return avatarColor(p.avatar_color)
}

export function Avatar({
  p, size = 32, ring, imageUrl,
}: { p?: AvatarProfile | null; size?: number; ring?: string; imageUrl?: string | null }) {
  // Prefer an explicit imageUrl prop (e.g. signed URL from the store cache);
  // fall back to the storage-path on the profile if the bucket is public.
  const src = imageUrl ?? avatarPublicUrl(p?.avatar_url)
  // Track image-load failures so we silently fall back to initials when the
  // avatars storage bucket is missing / file was deleted / network blocked.
  const [imageBroken, setImageBroken] = React.useState(false)
  React.useEffect(() => { setImageBroken(false) }, [src])

  const showImage = !!src && !imageBroken

  return (
    <div style={{
      width: size, height: size, borderRadius: 99,
      background: getAvatarBg(p),
      border: STICKER_BORDER_SM,
      boxShadow: ring ? 'none' : '2px 2px 0 #0C0C0C',
      outline: ring ? `2px solid ${ring}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.ink,
      fontFamily: FONT_DISPLAY,
      fontSize: size * 0.36, fontWeight: 700, letterSpacing: -0.3,
      flex: '0 0 auto',
      overflow: 'hidden',
    }}>
      {showImage ? (
        <img
          src={src!}
          alt=""
          width={size}
          height={size}
          draggable={false}
          onError={() => setImageBroken(true)}
          style={{ width: size, height: size, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        getInitials(p)
      )}
    </div>
  )
}

// Resolve a storage path inside the public `avatars` bucket to its public URL.
// Returns null if the path is empty or env vars aren't set.
export function avatarPublicUrl(path: string | null | undefined): string | null {
  if (!path) return null
  // If a full URL was stored (legacy or external), pass through.
  if (/^https?:\/\//i.test(path)) return path
  const base = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || ''
  if (!base) return null
  return `${base}/storage/v1/object/public/avatars/${path}`
}

export function AvatarStack({
  profiles, size = 28, max = 4, ring,
}: { profiles: (AvatarProfile | null | undefined)[]; size?: number; max?: number; ring?: string }) {
  const shown = profiles.slice(0, max)
  const overflow = profiles.length - max
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.4, zIndex: shown.length - i }}>
          <Avatar p={p} size={size} ring={ring || T.bg} />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: -size * 0.4, zIndex: 0,
          width: size, height: size, borderRadius: 99,
          background: T.surface, border: STICKER_BORDER_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontSize: size * 0.32, fontWeight: 700, color: T.ink,
        }}>+{overflow}</div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// PageHeading — the giant uppercase Space-Grotesk page title with
// an optional rotated HighlightBlock baked into line A or B.
// ────────────────────────────────────────────────────────────────
type AccentSpec = { text: React.ReactNode; color?: string; tilt?: number }

export function PageHeading({
  overline, lineA, accent, lineB, sub, vp = 'desktop', rightSlot,
}: {
  overline?: React.ReactNode
  lineA: React.ReactNode
  accent?: AccentSpec
  lineB?: React.ReactNode
  sub?: React.ReactNode
  vp?: 'mobile' | 'tablet' | 'desktop'
  rightSlot?: React.ReactNode
}) {
  const big = vp === 'desktop' ? 84 : vp === 'tablet' ? 64 : 48
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 24, marginBottom: vp === 'mobile' ? 22 : 32,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {overline && (
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', color: T.inkMuted, marginBottom: 12,
          }}>{overline}</div>
        )}
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          letterSpacing: vp === 'mobile' ? -2 : -3.5,
          lineHeight: 0.9, textTransform: 'uppercase', fontSize: big,
        }}>
          {lineA}
          {accent && (
            <>{' '}<HighlightBlock color={accent.color || 'lime'} tilt={accent.tilt ?? -2}>{accent.text}</HighlightBlock></>
          )}
          {lineB && <><br />{lineB}</>}
        </div>
        {sub && (
          <div style={{
            marginTop: 14, fontSize: vp === 'mobile' ? 13 : 15, fontWeight: 500,
            color: T.inkMuted, lineHeight: 1.5, maxWidth: 620,
          }}>{sub}</div>
        )}
      </div>
      {rightSlot && <div style={{ flex: '0 0 auto' }}>{rightSlot}</div>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// SectionRule — black highlight pill + dashed rule + optional CTA.
// ────────────────────────────────────────────────────────────────
export function SectionRule({
  label, rightSlot, tone = 'ink',
}: { label: React.ReactNode; rightSlot?: React.ReactNode; tone?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 32, marginBottom: 20 }}>
      <HighlightBlock color={tone} tilt={-1} size="sm">
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 1,
          color: tone === 'ink' ? '#fff' : T.ink,
          textTransform: 'uppercase',
        }}>· {label} ·</span>
      </HighlightBlock>
      <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
      {rightSlot}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────
// SectionLabel — small uppercase label used over content blocks.
// ────────────────────────────────────────────────────────────────
export function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.6,
      textTransform: 'uppercase', color: T.inkMuted,
      ...style,
    }}>{children}</div>
  )
}

// ────────────────────────────────────────────────────────────────
// Mono small-cap label (e.g. handles, ids).
// ────────────────────────────────────────────────────────────────
export function MonoLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, letterSpacing: 0.4,
      ...style,
    }}>{children}</span>
  )
}

export { T, FONT_DISPLAY, FONT_MONO }
export type { ThemeColor }
