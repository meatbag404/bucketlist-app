// Inline Icons8 browser for embedding inside Edit/Add modals — a compact
// version of /app/icons that's locked to a single platform and renders
// a scrollable grid with debounced search + topic chips + Load More.

'use client'

import * as React from 'react'
import {
  T, FONT_DISPLAY, FONT_UI, STICKER_BORDER_SM, STICKER_SHADOW_SM,
} from './design-tokens'
import { StickerChip } from './sticker'
import { Icon8, makeIconId, type Icons8Platform } from './icon-set'

// Topic chips shown above the search — clicking one runs that search.
// Chosen to surface lots of relevant results in one click.
const TOPICS: { label: string; term: string }[] = [
  { label: 'TRAVEL',     term: 'travel' },
  { label: 'FOOD',       term: 'food' },
  { label: 'NATURE',     term: 'nature' },
  { label: 'SPORTS',     term: 'sport' },
  { label: 'MUSIC',      term: 'music' },
  { label: 'ANIMALS',    term: 'animal' },
  { label: 'HOLIDAYS',   term: 'holiday' },
  { label: 'WORK',       term: 'office' },
  { label: 'TECH',       term: 'computer' },
  { label: 'HEALTH',     term: 'health' },
  { label: 'GAMING',     term: 'game' },
  { label: 'HOME',       term: 'home' },
]

const PAGE_SIZE = 32

type Discovered = { id: string; name: string; category: string }

type Props = {
  /** Icons8 platform to search inside (e.g. 'papercut'). */
  platform: Icons8Platform
  /** Currently selected icon id (encoded — `platform:id`). */
  selectedIconId: string | null
  /** Fired when the user taps an icon. id is already encoded. */
  onChange: (encodedId: string) => void
  /** Optional initial query — defaults to 'travel' so the grid isn't empty. */
  initialQuery?: string
  /** Pixel cap on the scrollable grid height. */
  maxHeight?: number
}

export function InlineIconBrowser({
  platform, selectedIconId, onChange,
  initialQuery = 'travel',
  maxHeight = 280,
}: Props) {
  const [query, setQuery] = React.useState(initialQuery)
  const [activeTopic, setActiveTopic] = React.useState<string | null>(initialQuery)
  const [results, setResults] = React.useState<Discovered[]>([])
  const [total, setTotal] = React.useState(0)
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search — resets pagination whenever query/platform changes.
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (q.length < 2) {
      setResults([]); setTotal(0); setOffset(0); setError(null); setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/icons8/search?q=${encodeURIComponent(q)}&offset=0&limit=${PAGE_SIZE}&platform=${platform}`,
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
        setResults(data.icons ?? [])
        setTotal(data.total ?? 0)
        setOffset((data.icons ?? []).length)
        setError(null)
      } catch (err: any) {
        setResults([]); setTotal(0); setOffset(0)
        setError(err?.message ?? 'Search failed')
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, platform])

  async function loadMore() {
    if (loading) return
    const q = query.trim()
    if (!q) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/icons8/search?q=${encodeURIComponent(q)}&offset=${offset}&limit=${PAGE_SIZE}&platform=${platform}`,
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      const fresh: Discovered[] = data.icons ?? []
      const known = new Set(results.map(r => r.id))
      const merged = [...results, ...fresh.filter(r => !known.has(r.id))]
      setResults(merged)
      setOffset(offset + fresh.length)
      setError(null)
    } catch (err: any) {
      setError(err?.message ?? 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  function pickTopic(term: string) {
    setActiveTopic(term)
    setQuery(term)
  }

  const hasMore = results.length > 0 && results.length < total

  return (
    <div>
      {/* Topic chips */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8,
      }}>
        {TOPICS.map(t => (
          <StickerChip
            key={t.term}
            active={activeTopic === t.term}
            onClick={() => pickTopic(t.term)}
          >{t.label}</StickerChip>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Icons8 — e.g. dog, sushi, telescope"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setActiveTopic(null) }}
        style={{
          width: '100%', padding: '10px 12px',
          border: STICKER_BORDER_SM, borderRadius: 10,
          boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
          background: T.surface, color: T.ink,
          fontFamily: FONT_UI, fontSize: 13, fontWeight: 500,
          outline: 'none', marginBottom: 10,
        }}
      />

      {/* Scrollable grid */}
      <div style={{
        maxHeight, overflowY: 'auto',
        background: T.bg, borderRadius: 12,
        border: STICKER_BORDER_SM,
        padding: 10,
      }}>
        {loading && results.length === 0 ? (
          <EmptyHint>Searching…</EmptyHint>
        ) : error ? (
          <EmptyHint tone="error">Search failed: {error}</EmptyHint>
        ) : results.length === 0 && query.trim().length >= 2 ? (
          <EmptyHint>No results for “{query}”.</EmptyHint>
        ) : results.length === 0 ? (
          <EmptyHint>Tap a topic or type to search.</EmptyHint>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
              gap: 8,
            }}>
              {results.map(icon => {
                const encodedId = makeIconId(icon.id, platform)
                const isSelected = encodedId === selectedIconId
                return (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => onChange(encodedId)}
                    aria-label={icon.name}
                    aria-pressed={isSelected}
                    title={icon.name}
                    style={{
                      width: 56, height: 56, padding: 0,
                      margin: '0 auto',
                      borderRadius: 10,
                      background: T.surface,
                      border: isSelected ? `2.5px solid ${T.ink}` : '2px solid rgba(12,12,12,0.15)',
                      boxShadow: isSelected ? STICKER_SHADOW_SM : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon8 id={encodedId} size={36} />
                  </button>
                )
              })}
            </div>

            {hasMore && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loading}
                  className="bk-sticker-btn"
                  style={{
                    padding: '6px 14px', borderRadius: 99,
                    background: T.surface, border: STICKER_BORDER_SM,
                    boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
                    fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700,
                    letterSpacing: 0.5, textTransform: 'uppercase',
                    cursor: loading ? 'wait' : 'pointer', color: T.ink,
                  }}
                >{loading ? 'LOADING…' : `LOAD MORE (${results.length} / ${total})`}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyHint({ children, tone }: { children: React.ReactNode; tone?: 'error' }) {
  return (
    <div style={{
      textAlign: 'center', padding: '14px 8px',
      color: tone === 'error' ? T.red : T.inkSubtle,
      fontWeight: 500, fontFamily: FONT_UI, fontSize: 13,
    }}>{children}</div>
  )
}
