// Shared UI primitives that turn any emoji-grid into a full Icons8 picker
// surface, sharing a common sessionStorage handoff with /app/icons.

'use client'

import * as React from 'react'
import {
  T, FONT_DISPLAY, STICKER_BORDER_SM,
} from './design-tokens'
import { StickerButton } from './sticker'
import { Icon8, getIcon, iconPlatformLabel } from './icon-set'

const PICKER_RESULT_KEY = 'iconPicker:result'
const RESUME_KEY_PREFIX = 'iconPicker:resume:'

// ─────────────────────────────────────────────────────────────────
// useIconPickerResume — saves arbitrary form state before navigating
// to /app/icons, restores it (plus the picked icon id) when the
// page regains focus afterward.
//
//   const resume = useIconPickerResume('item-edit', (saved, pickedId) => {
//     setEditTitle(saved.title); setEditIconId(pickedId ?? saved.iconId); ...
//   })
//   ...
//   <button onClick={() => resume.stash({ title, iconId, note })}>BROWSE</button>
//
// `stash()` returns the URL you should navigate to.
// ─────────────────────────────────────────────────────────────────
type ResumeApi<T> = {
  /** Persist the given snapshot under this scope and return the picker URL. */
  stash: (snapshot: T) => string
}

export function useIconPickerResume<T>(
  scopeKey: string,
  onResume: (saved: T, pickedIconId: string | null) => void,
  /**
   * When false, consume is skipped (sessionStorage is left intact). This lets
   * the caller defer resume until prerequisite state is loaded — e.g. the
   * bucket page can pass `enabled: items.length > 0` so a returning picker
   * pick isn't dropped on the floor while items are still fetching.
   */
  enabled: boolean = true,
): ResumeApi<T> {
  // Keep the latest callback in a ref so the effect doesn't churn.
  const onResumeRef = React.useRef(onResume)
  React.useEffect(() => { onResumeRef.current = onResume }, [onResume])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled) return
    const key = RESUME_KEY_PREFIX + scopeKey
    const consume = () => {
      const raw = window.sessionStorage.getItem(key)
      if (!raw) return
      let saved: T
      try {
        saved = JSON.parse(raw) as T
      } catch {
        window.sessionStorage.removeItem(key)
        return
      }
      const pickedId = window.sessionStorage.getItem(PICKER_RESULT_KEY)
      window.sessionStorage.removeItem(key)
      window.sessionStorage.removeItem(PICKER_RESULT_KEY)
      onResumeRef.current(saved, pickedId)
    }
    consume()
    const onFocus = () => consume()
    const onPageShow = () => consume()
    window.addEventListener('focus', onFocus)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [scopeKey, enabled])

  return React.useMemo<ResumeApi<T>>(() => ({
    stash: (snapshot) => {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          RESUME_KEY_PREFIX + scopeKey,
          JSON.stringify(snapshot),
        )
      }
      // Caller passes the URL to router.push — figure the selected query in
      // the snapshot so the picker preselects it.
      const sel = (snapshot as any)?.iconId
      return `/app/icons${sel ? `?selected=${encodeURIComponent(sel)}` : ''}`
    },
  }), [scopeKey])
}

// ─────────────────────────────────────────────────────────────────
// IconField — preview + BROWSE button + REMOVE button. Drop in
// anywhere you previously had an emoji-only picker; the caller still
// owns the quick-emoji grid (which should call onChange(null, emoji)
// to clear the sticker selection).
// ─────────────────────────────────────────────────────────────────
type IconFieldProps = {
  iconId: string | null
  emoji?: string                       // shown when no iconId
  onBrowse: () => void                 // open the picker
  onClearIcon?: () => void             // null out iconId only
  label?: string                       // optional label above the row (default: "Icon")
}

export function IconField({
  iconId, emoji, onBrowse, onClearIcon, label = 'Icon',
}: IconFieldProps) {
  const meta = getIcon(iconId)
  const styleLabel = iconPlatformLabel(iconId)
  // For non-curated picks, fall back to the platform name as the title.
  const displayName = meta?.name ?? (iconId ? (styleLabel ?? 'Custom') : null)
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 6,
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
          color: T.inkMuted, textTransform: 'uppercase',
        }}>
          {label}{displayName ? ` · ${displayName}` : ''}{styleLabel ? ` · ${styleLabel}` : ''}
        </div>
        <StickerButton size="sm" onClick={onBrowse}>
          {iconId ? 'CHANGE STICKER' : 'BROWSE STICKERS'}
        </StickerButton>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
        padding: '10px 12px', background: T.bg, borderRadius: 12,
        border: STICKER_BORDER_SM,
      }}>
        {iconId ? (
          <Icon8 id={iconId} size={44} />
        ) : (
          <span className="emoji" style={{ fontSize: '1.8rem', lineHeight: 1, width: 44, textAlign: 'center' }}>
            {emoji || '✨'}
          </span>
        )}
        <div style={{
          flex: 1, fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700,
          letterSpacing: 0.4, color: T.ink, textTransform: 'uppercase',
        }}>
          {iconId ? (displayName ?? 'Custom') : 'Quick emoji'}
          {styleLabel && (
            <span style={{
              marginLeft: 8, padding: '2px 6px', borderRadius: 6,
              background: T.surface, border: STICKER_BORDER_SM,
              fontSize: 9, letterSpacing: 0.6,
            }}>{styleLabel}</span>
          )}
        </div>
        {iconId && onClearIcon && (
          <button
            type="button"
            onClick={onClearIcon}
            className="bk-sticker-btn"
            style={{
              background: T.surface, border: STICKER_BORDER_SM, borderRadius: 8,
              padding: '4px 10px', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase', color: T.ink,
            }}
          >REMOVE</button>
        )}
      </div>
    </div>
  )
}
