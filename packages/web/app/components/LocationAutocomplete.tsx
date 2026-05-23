'use client'

import { useEffect, useRef, useState } from 'react'
import {
  T, FONT_DISPLAY, FONT_UI, STICKER_BORDER_SM, STICKER_SHADOW_SM,
} from '@bucketlist/shared'

type Prediction = {
  description: string
  place_id: string
  main_text: string
  secondary_text: string
}

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

// Debounced Google Places Autocomplete input.
// Sends the query to /api/places/autocomplete (server-side proxy that holds the key)
// and shows a sticker dropdown of matches the user can click.
export function LocationAutocomplete({ value, onChange, placeholder = 'Add a location' }: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const reqIdRef = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // Debounced fetch
  useEffect(() => {
    const q = value.trim()
    if (q.length < 2) {
      setPredictions([])
      return
    }
    const reqId = ++reqIdRef.current
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(q)}`)
        if (!res.ok) {
          if (reqId === reqIdRef.current) {
            setPredictions([])
            setLoading(false)
          }
          return
        }
        const data = await res.json()
        if (reqId === reqIdRef.current) {
          setPredictions(data.predictions || [])
          setOpen(true)
          setLoading(false)
          setHighlight(-1)
        }
      } catch {
        if (reqId === reqIdRef.current) {
          setPredictions([])
          setLoading(false)
        }
      }
    }, 220)
    return () => clearTimeout(t)
  }, [value])

  const pick = (p: Prediction) => {
    onChange(p.description)
    setOpen(false)
    setPredictions([])
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || predictions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % predictions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h <= 0 ? predictions.length - 1 : h - 1))
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault()
      pick(predictions[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 14, lineHeight: 1, pointerEvents: 'none',
        }} className="emoji" aria-hidden>📍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { if (predictions.length > 0) setOpen(true) }}
          onKeyDown={onKey}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%', padding: '12px 14px 12px 38px',
            background: T.bg, border: STICKER_BORDER_SM,
            boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
            borderRadius: 12, outline: 'none',
            fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
            color: T.ink,
            transition: 'box-shadow 0.1s',
          }}
          onFocusCapture={e => { e.currentTarget.style.boxShadow = '3px 3px 0 #0C0C0C' }}
          onBlurCapture={e => { e.currentTarget.style.boxShadow = '2px 2px 0 rgba(12,12,12,0.18)' }}
        />
        {loading && (
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 11, color: T.inkMuted, fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>…</span>
        )}
      </div>

      {/* Dropdown */}
      {open && predictions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
          background: T.surface, border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
          borderRadius: 12, padding: 4, maxHeight: 280, overflowY: 'auto',
        }}>
          {predictions.map((p, i) => (
            <button
              key={p.place_id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); pick(p) }}
              onMouseEnter={() => setHighlight(i)}
              className="bk-sticker-btn"
              style={{
                width: '100%', textAlign: 'left',
                padding: '10px 12px', borderRadius: 8,
                background: highlight === i ? T.lime : 'transparent',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: FONT_UI, fontSize: 13, color: T.ink,
              }}
            >
              <span className="emoji" style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>📍</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.main_text}
                </div>
                {p.secondary_text && (
                  <div style={{ fontSize: 11, color: T.inkMuted, fontWeight: 500, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.secondary_text}
                  </div>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
