'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useViewport,
  T, FONT_DISPLAY, FONT_UI, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, StickerButton, StickerChip, PageHeading, HighlightBlock,
  ICON_SET, ICON_CATEGORIES, Icon8, getIcon,
  parseIconId, makeIconId, iconPlatformLabel,
  type IconCategoryKey, type Icon8Entry, type Icons8Platform, type IconColorOverride,
} from '@bucketlist/shared'

// Storage key the picker writes to on DONE. Callers (bucket / item create
// flows) navigate here, then read & clear this key when they regain focus.
const PICKER_RESULT_KEY = 'iconPicker:result'
// localStorage key that remembers the user's last style preference so the
// picker reopens in the same mode.
const STYLE_PREF_KEY = 'iconPicker:style'

type CatFilter = 'all' | IconCategoryKey
type Mode = 'curated' | 'discover'
// Only Papercut is offered today. Keeping the constant + helpers in place
// so adding another platform later is a one-line change.
type Icons8Style = 'papercut'
const STYLES: { value: Icons8Style; label: string; sub: string; monochrome?: boolean }[] = [
  { value: 'papercut', label: '✂️ PAPERCUT', sub: 'Papercut' },
]
const DEFAULT_STYLE: Icons8Style = 'papercut'

const STYLE_VALUES = new Set<string>(STYLES.map(s => s.value))
function isStyle(v: string | null | undefined): v is Icons8Style {
  return !!v && STYLE_VALUES.has(v)
}

type DiscoveredIcon = { id: string; name: string; category: string }

// Hand-picked Icons8 topic chips for DISCOVER browsing. Each label is a
// search term against the Flat Color library — chosen to surface lots of
// relevant icons in one click. Click a chip to populate the search box.
const DISCOVER_TOPICS: { label: string; term: string }[] = [
  { label: 'ANIMALS',     term: 'animal' },
  { label: 'FOOD',        term: 'food' },
  { label: 'DRINKS',      term: 'drink' },
  { label: 'TRAVEL',      term: 'travel' },
  { label: 'TRANSPORT',   term: 'transport' },
  { label: 'SPORTS',      term: 'sport' },
  { label: 'MUSIC',       term: 'music' },
  { label: 'NATURE',      term: 'nature' },
  { label: 'WEATHER',     term: 'weather' },
  { label: 'HOLIDAYS',    term: 'holiday' },
  { label: 'WORK',        term: 'office' },
  { label: 'SCIENCE',     term: 'science' },
  { label: 'GAMING',      term: 'game' },
  { label: 'BEAUTY',      term: 'beauty' },
  { label: 'HEALTH',      term: 'health' },
  { label: 'HOME',        term: 'home' },
]

const PAGE_SIZE = 48

function IconsPageInner() {
  const router = useRouter()
  const search = useSearchParams()
  const vp = useViewport()
  const cols = vp === 'mobile' ? 4 : vp === 'tablet' ? 6 : 8

  // Optional seed: ?selected=<icon_id> preloads the picker with a current pick.
  const seed = search.get('selected')
  const [selectedId, setSelectedId] = useState<string | null>(seed)
  // Track display info for selections that aren't in the curated set
  // (so DISCOVER picks still render a name in the preview bar).
  const [selectedMeta, setSelectedMeta] = useState<{ name: string; category: string } | null>(null)

  // None of the active platforms have a curated set, so the picker always
  // opens in DISCOVER. Leaving the Mode union/setMode in place so re-adding
  // a curated platform later is a one-line change.
  const [mode, setMode] = useState<Mode>('discover')
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<CatFilter>('all')

  // Active Icons8 style — affects DISCOVER searches.
  // Initial value prefers the seed id's encoded platform, then localStorage,
  // then the default. Legacy picks (Color, Outlined, etc.) still render via
  // CDN; the picker just opens in the default style for editing them.
  const [style, setStyleState] = useState<Icons8Style>(() => {
    const seedPlatform = parseIconId(seed).platform
    return isStyle(seedPlatform) ? seedPlatform : DEFAULT_STYLE
  })
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Only adopt the saved preference when no seed already pinned the style.
    if (seed && parseIconId(seed).platform !== 'color') return
    const saved = window.localStorage.getItem(STYLE_PREF_KEY)
    if (isStyle(saved)) setStyleState(saved)
  }, [seed])
  // If seed is a non-color pick we should open straight into DISCOVER (the
  // curated set is color-only, so it would never show that id).
  useEffect(() => {
    if (parseIconId(seed).platform !== 'color') setMode('discover')
  }, [seed])
  const setStyle = (s: Icons8Style) => {
    setStyleState(s)
    try { window.localStorage.setItem(STYLE_PREF_KEY, s) } catch {}
    // All current styles are DISCOVER-only — the curated set was color.
    setMode('discover')
  }

  // DISCOVER state
  const [discoverResults, setDiscoverResults] = useState<DiscoveredIcon[]>([])
  const [discoverTotal, setDiscoverTotal] = useState(0)
  const [discoverOffset, setDiscoverOffset] = useState(0)
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [discoverError, setDiscoverError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Active topic chip — purely visual highlight (matches whatever query was set
  // by clicking a chip; clears when the user types something else).
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  // ── Curated filter ─────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ICON_SET.filter(i =>
      (cat === 'all' || i.category === cat) &&
      (!q || i.name.toLowerCase().includes(q))
    )
  }, [query, cat])

  // ── Live Icons8 search with debounce + auto-pagination reset ───
  useEffect(() => {
    if (mode !== 'discover') return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const q = query.trim()
    if (q.length < 2) {
      setDiscoverResults([])
      setDiscoverTotal(0)
      setDiscoverOffset(0)
      setDiscoverError(null)
      setDiscoverLoading(false)
      return
    }

    setDiscoverLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/icons8/search?q=${encodeURIComponent(q)}&offset=0&limit=${PAGE_SIZE}&platform=${style}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
        setDiscoverResults(data.icons ?? [])
        setDiscoverTotal(data.total ?? 0)
        setDiscoverOffset(data.icons?.length ?? 0)
        setDiscoverError(null)
      } catch (err: any) {
        setDiscoverResults([])
        setDiscoverTotal(0)
        setDiscoverOffset(0)
        setDiscoverError(err?.message ?? 'Search failed')
      } finally {
        setDiscoverLoading(false)
      }
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, mode, style])

  async function loadMore() {
    const q = query.trim()
    if (!q || discoverLoading) return
    setDiscoverLoading(true)
    try {
      const res = await fetch(
        `/api/icons8/search?q=${encodeURIComponent(q)}&offset=${discoverOffset}&limit=${PAGE_SIZE}&platform=${style}`,
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      const fresh: DiscoveredIcon[] = data.icons ?? []
      // De-dup against current results (the API can occasionally repeat ids
      // at page boundaries).
      const known = new Set(discoverResults.map(r => r.id))
      const merged = [...discoverResults, ...fresh.filter(r => !known.has(r.id))]
      setDiscoverResults(merged)
      setDiscoverOffset(discoverOffset + fresh.length)
      setDiscoverError(null)
    } catch (err: any) {
      setDiscoverError(err?.message ?? 'Search failed')
    } finally {
      setDiscoverLoading(false)
    }
  }

  // ── Selection helpers ──────────────────────────────────────
  const curatedSelected = getIcon(selectedId)
  const selectedName = curatedSelected?.name ?? selectedMeta?.name ?? null
  const selectedCategory = curatedSelected?.category ?? selectedMeta?.category ?? null

  // Current color override — only meaningful for monochrome platforms.
  // Persists across re-picks within the same picker session.
  const activeStyle = STYLES.find(s => s.value === style)
  const isMonochrome = !!activeStyle?.monochrome
  const seedColor = parseIconId(seed).color
  const [colorOverride, setColorOverride] = useState<IconColorOverride | null>(seedColor)

  function pickCurated(icon: Icon8Entry) {
    // Curated set is all color — store bare id (no prefix).
    setSelectedId(icon.id)
    setSelectedMeta({ name: icon.name, category: icon.category })
  }
  function pickDiscovered(icon: DiscoveredIcon) {
    // Tag the platform so renderers / labels know which set it came from.
    // Apply the current color override only for monochrome platforms.
    const color = isMonochrome ? colorOverride : null
    setSelectedId(makeIconId(icon.id, style, color))
    setSelectedMeta({ name: icon.name, category: icon.category || 'discover' })
  }

  // When the user flips the BLACK/WHITE toggle, re-encode the active id so
  // the preview + commit reflect the new tint immediately.
  function applyColorOverride(next: IconColorOverride | null) {
    setColorOverride(next)
    if (!selectedId || !isMonochrome) return
    const parsed = parseIconId(selectedId)
    if (parsed.platform !== style) return // changed platform; nothing to recolor
    setSelectedId(makeIconId(parsed.rawId, parsed.platform, next))
  }

  function pickTopic(term: string) {
    setActiveTopic(term)
    setQuery(term)
  }

  function commitAndClose() {
    if (typeof window !== 'undefined') {
      if (selectedId) {
        window.sessionStorage.setItem(PICKER_RESULT_KEY, selectedId)
      } else {
        window.sessionStorage.removeItem(PICKER_RESULT_KEY)
      }
    }
    router.back()
  }

  function cancel() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(PICKER_RESULT_KEY)
    }
    router.back()
  }

  const cellSize = vp === 'mobile' ? 60 : 78

  const displayItems = mode === 'curated'
    ? filtered
    : discoverResults

  const hasMore = mode === 'discover'
    && query.trim().length >= 2
    && discoverResults.length > 0
    && discoverResults.length < discoverTotal

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <StickerButton onClick={cancel}>CANCEL</StickerButton>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>STICKERS</div>
        <StickerButton color="ink" onClick={commitAndClose} disabled={!selectedId}>DONE</StickerButton>
      </div>

      <PageHeading
        lineA="PICK"
        lineB={<>A <HighlightBlock color="pink">STICKER</HighlightBlock>.</>}
        sub={
          mode === 'curated'
            ? `${ICON_SET.length} hand-picked Flat Color stickers. Switch the STYLE below or browse the full library in DISCOVER.`
            : `Browse Icons8 ${STYLES.find(s => s.value === style)?.sub ?? style} — tap a topic or type to search.`
        }
        vp={vp}
      />

      {/* Style toggle removed — only Papercut is offered now. */}

      {/* CURATED tab removed — none of the current platforms has a curated set.
          Mode toggle hidden; the picker is DISCOVER-only for now. */}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder={mode === 'curated' ? 'Filter curated stickers…' : 'Search Icons8 — e.g. dog, sushi, telescope'}
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveTopic(null) }}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: STICKER_BORDER_SM,
            borderRadius: 12,
            boxShadow: STICKER_SHADOW_SM,
            background: T.surface,
            color: T.ink,
            fontFamily: FONT_UI,
            fontSize: 15,
            fontWeight: 500,
            outline: 'none',
          }}
        />
      </div>

      {/* Curated category chips */}
      {mode === 'curated' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          <StickerChip active={cat === 'all'} onClick={() => setCat('all')}>ALL</StickerChip>
          {ICON_CATEGORIES.map(c => (
            <StickerChip key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>
              {c.label.toUpperCase()}
            </StickerChip>
          ))}
        </div>
      )}

      {/* DISCOVER topic chips */}
      {mode === 'discover' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {DISCOVER_TOPICS.map(t => (
            <StickerChip
              key={t.term}
              active={activeTopic === t.term}
              onClick={() => pickTopic(t.term)}
            >
              {t.label}
            </StickerChip>
          ))}
        </div>
      )}

      {/* Tint toggle removed — Papercut is multi-color and can't be re-tinted. */}

      {/* Icon grid */}
      <Sticker radius={16} style={{ padding: 22, marginBottom: 22 }}>
        {mode === 'discover' && query.trim().length < 2 ? (
          <EmptyHint>Tap a topic above or type 2+ characters to search Icons8.</EmptyHint>
        ) : mode === 'discover' && discoverLoading && discoverResults.length === 0 ? (
          <EmptyHint>Searching Icons8…</EmptyHint>
        ) : mode === 'discover' && discoverError ? (
          <EmptyHint tone="error">Icons8 search failed: {discoverError}</EmptyHint>
        ) : displayItems.length === 0 ? (
          <EmptyHint>
            {mode === 'curated'
              ? `No curated stickers match “${query}”. Try DISCOVER.`
              : `No Icons8 results for “${query}”.`}
          </EmptyHint>
        ) : (
          <>
            <div style={{
              display: 'grid', gap: vp === 'mobile' ? 10 : 14,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}>
              {displayItems.map((icon, i) => {
                // Selected state needs to compare against the encoded form,
                // since DISCOVER picks are stored as `platform:id[@color]`.
                const tintForGrid = isMonochrome ? colorOverride : null
                const encodedId = mode === 'curated'
                  ? icon.id
                  : makeIconId(icon.id, style, tintForGrid)
                const isSelected = encodedId === selectedId
                const tilt = i % 3 === 1 ? -1.5 : i % 3 === 2 ? 1.5 : 0
                const colorName = (['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const)[i % 6]
                const onPick = mode === 'curated'
                  ? () => pickCurated(icon as Icon8Entry)
                  : () => pickDiscovered(icon as DiscoveredIcon)
                return (
                  <button
                    key={icon.id}
                    onClick={onPick}
                    aria-label={icon.name}
                    aria-pressed={isSelected}
                    title={icon.name}
                    style={{
                      width: cellSize, height: cellSize, padding: 0,
                      margin: '0 auto',
                      borderRadius: 14,
                      background: (T as any)[colorName],
                      border: isSelected ? `3px solid ${T.ink}` : STICKER_BORDER_SM,
                      boxShadow: isSelected ? `4px 4px 0 ${T.ink}` : STICKER_SHADOW_SM,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transform: `rotate(${tilt}deg) ${isSelected ? 'translate(-1px, -1px)' : ''}`.trim(),
                      transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                    }}
                  >
                    <Icon8 id={encodedId} size={Math.round(cellSize * 0.62)} />
                  </button>
                )
              })}
            </div>

            {mode === 'discover' && (
              <div style={{
                marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                <div style={{
                  fontFamily: FONT_UI, fontSize: 12, fontWeight: 500, color: T.inkSubtle,
                }}>
                  Showing {discoverResults.length} of {discoverTotal} for “{query}”
                </div>
                {hasMore && (
                  <StickerButton onClick={loadMore} disabled={discoverLoading}>
                    {discoverLoading ? 'LOADING…' : 'LOAD MORE'}
                  </StickerButton>
                )}
              </div>
            )}
          </>
        )}
      </Sticker>

      {/* Bottom preview bar */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        background: T.bg,
        borderTop: STICKER_BORDER_SM,
        padding: '12px 18px',
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 12,
            background: selectedId ? T.surface : T.bg,
            border: STICKER_BORDER_SM,
            boxShadow: selectedId ? STICKER_SHADOW_SM : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {selectedId ? <Icon8 id={selectedId} size={36} /> : (
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: T.inkSubtle, fontSize: 20 }}>?</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
              color: T.ink, textTransform: 'uppercase', letterSpacing: -0.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedName ?? (selectedId ? `Sticker ${selectedId}` : 'No sticker selected')}
              </span>
              {selectedId && iconPlatformLabel(selectedId) && (
                <span style={{
                  padding: '2px 6px', borderRadius: 6,
                  background: T.surface, border: STICKER_BORDER_SM,
                  fontSize: 9, letterSpacing: 0.6, flex: '0 0 auto',
                }}>{iconPlatformLabel(selectedId)}</span>
              )}
            </div>
            <div style={{
              fontFamily: FONT_UI, fontSize: 12, color: T.inkSubtle,
              fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1.1,
            }}>
              {selectedCategory ?? (selectedId ? 'Selected' : 'Tap one above')}
            </div>
          </div>
          <StickerButton color="ink" onClick={commitAndClose} disabled={!selectedId}>DONE</StickerButton>
        </div>
      </div>
    </div>
  )
}

// ── Small helpers ───────────────────────────────────────────
function ModeTab({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="bk-sticker-btn"
      style={{
        padding: '8px 14px',
        background: active ? T.ink : T.surface,
        color: active ? T.bg : T.ink,
        border: STICKER_BORDER_SM,
        boxShadow: active ? STICKER_SHADOW_SM : 'none',
        borderRadius: 10, cursor: 'pointer',
        fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.6,
        textTransform: 'uppercase',
      }}
    >{children}</button>
  )
}

function EmptyHint({ children, tone }: { children: React.ReactNode; tone?: 'error' }) {
  return (
    <div style={{
      textAlign: 'center', padding: '24px 8px',
      color: tone === 'error' ? T.red : T.inkSubtle,
      fontWeight: 500, fontFamily: FONT_UI,
    }}>{children}</div>
  )
}

export default function IconsPage() {
  return (
    <Suspense fallback={null}>
      <IconsPageInner />
    </Suspense>
  )
}
