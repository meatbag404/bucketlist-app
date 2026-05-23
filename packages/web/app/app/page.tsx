'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_MONO, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, StickerButton, AvatarStack, PageHeading, HighlightBlock, SectionRule,
  NavIcon,
  color as resolveColor,
  bucketColor, bucketColorToken,
} from '@bucketlist/shared'

// ── Layout switcher (matches design) ─────────────────────────
type Layout = 'featured' | 'grid' | 'list'
const LAYOUT_KEY = 'bk-home-layout'

function LayoutSwitcher({ value, onChange }: { value: Layout; onChange: (l: Layout) => void }) {
  const opts: { id: Layout; label: string }[] = [
    { id: 'featured', label: 'FEATURED' },
    { id: 'grid',     label: 'GRID' },
    { id: 'list',     label: 'LIST' },
  ]
  return (
    <Sticker radius={99} border="sm" shadow="sm" style={{
      padding: 4, display: 'inline-flex', gap: 2,
    }}>
      {opts.map(o => {
        const on = value === o.id
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="bk-sticker-btn"
            style={{
              padding: '6px 12px', borderRadius: 99,
              background: on ? T.ink : 'transparent',
              color: on ? T.bg : T.ink,
              border: 'none', cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}
          >{o.label}</button>
        )
      })}
    </Sticker>
  )
}

// ── BucketCard ──────────────────────────────────────────────────
function BucketCard({ b, featured, vp }: { b: any; featured?: boolean; vp: 'mobile' | 'tablet' | 'desktop' }) {
  const tilt = featured ? 0 : (b.id.charCodeAt(b.id.length - 1) % 2 ? 1 : -1) * 0.8
  const bgToken = bucketColorToken(b)
  const bgFill = bucketColor(b)
  const members = (b.members || []).filter((m: any) => m.status === 'active')
  const profiles = members.map((m: any) => m.profiles)
  const memberCount = members.length
  const itemTotal: number = b.item_total || 0
  const itemDone: number = b.item_done || 0
  const created = b.created_at ? new Date(b.created_at) : null
  const ageDays = created ? Math.floor((Date.now() - created.getTime()) / 86400000) : null
  const isNew = ageDays !== null && ageDays < 7

  // Subtitle line — derived: "{N} KEEPERS · ON THE LIST" or member names
  const memberNames = profiles
    .map((p: any) => p?.name?.split(' ')[0])
    .filter(Boolean)
    .slice(0, 3)
    .join(' · ')
    .toUpperCase()
  const subText = memberCount > 1
    ? memberNames || `${memberCount} KEEPERS`
    : `SOLO BUCKET`

  // Icon sticker frame size
  const iconSize = featured ? (vp === 'mobile' ? 56 : 64) : 48
  const iconFontSize = featured ? (vp === 'mobile' ? '2rem' : '2.2rem') : '1.6rem'

  return (
    <Link href={`/app/bucket/${b.id}`} style={{ textDecoration: 'none', display: 'flex', height: '100%' }}>
      <Sticker
        color={bgToken}
        tilt={tilt}
        radius={18}
        shadow={featured ? 'lg' : 'md'}
        onClick={() => {}}
        style={{
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
          minHeight: featured ? (vp === 'desktop' ? 280 : 220) : 220,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
      >
        <div style={{ padding: featured ? (vp === 'mobile' ? 22 : 28) : 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: featured ? 20 : 16 }}>
            {/* Icon in tilted sticker frame */}
            <div className="emoji" style={{
              width: iconSize, height: iconSize, borderRadius: 12,
              background: T.surface,
              border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: iconFontSize, lineHeight: 1,
              transform: 'rotate(-4deg)',
              flex: '0 0 auto',
            }}>{b.emoji || '🪣'}</div>

            {/* Status pill — progress % when items exist, otherwise NEW (no items yet) */}
            {(() => {
              if (itemTotal === 0) {
                // No items yet — show NEW
                return (
                  <div style={{
                    padding: '4px 10px', background: T.ink, color: T.bg, borderRadius: 99,
                    border: '1.5px solid #0C0C0C',
                    fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700,
                    letterSpacing: 0.8, textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
                  }}>NEW</div>
                )
              }
              const pct = Math.round((itemDone / itemTotal) * 100)
              return (
                <div style={{
                  padding: '4px 10px', background: T.bg, color: T.ink, borderRadius: 99,
                  border: '1.5px solid #0C0C0C',
                  fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700,
                  letterSpacing: 0.4, textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
                  fontVariantNumeric: 'tabular-nums' as const,
                }}>{pct}%</div>
              )
            })()}
          </div>

          {/* Title */}
          <div style={{
            fontFamily: FONT_DISPLAY,
            fontSize: featured ? (vp === 'mobile' ? 30 : 40) : 24,
            fontWeight: 700, letterSpacing: featured ? -1.4 : -0.8, lineHeight: 0.96,
            textTransform: 'uppercase',
            color: T.ink,
          }}>{b.name}</div>

          {/* Subtitle */}
          <div style={{
            marginTop: 8,
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700,
            color: T.ink, opacity: 0.65,
            textTransform: 'uppercase', letterSpacing: 0.8,
          }}>{subText}</div>

          <div style={{ flex: 1 }} />

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: featured ? 22 : 18, paddingTop: 14,
            borderTop: '1.5px solid rgba(12,12,12,0.2)',
          }}>
            <AvatarStack profiles={profiles} size={featured ? 30 : 26} ring={bgFill} max={4} />
            {/* done/total in faded-second-number style */}
            {itemTotal > 0 ? (
              <div style={{
                fontFamily: FONT_DISPLAY,
                fontSize: featured ? 26 : 20, fontWeight: 700,
                letterSpacing: -0.4, color: T.ink,
                fontVariantNumeric: 'tabular-nums',
              }}>{itemDone}<span style={{ opacity: 0.4 }}>/{itemTotal}</span></div>
            ) : (
              <div style={{
                fontFamily: FONT_DISPLAY,
                fontSize: featured ? 14 : 12, fontWeight: 700, letterSpacing: 0.5,
                color: T.ink, opacity: 0.55,
                textTransform: 'uppercase',
              }}>EMPTY</div>
            )}
          </div>
        </div>
      </Sticker>
    </Link>
  )
}

// ── BucketListRow ───────────────────────────────────────────────
function BucketListRow({ b, idx, vp }: { b: any; idx: number; vp: 'mobile' | 'tablet' | 'desktop' }) {
  const tilt = idx % 2 === 0 ? -0.4 : 0.4
  const bgToken = bucketColorToken(b)
  const bgFill = bucketColor(b)
  const members = (b.members || []).filter((m: any) => m.status === 'active')
  const profiles = members.map((m: any) => m.profiles)
  const memberCount = members.length
  const itemTotal: number = b.item_total || 0
  const itemDone: number = b.item_done || 0
  const created = b.created_at ? new Date(b.created_at) : null

  return (
    <Link href={`/app/bucket/${b.id}`} style={{ textDecoration: 'none' }}>
      <Sticker tilt={tilt} radius={16} shadow="md" onClick={() => {}} style={{
        padding: vp === 'mobile' ? '14px 14px 14px 22px' : '18px 22px 18px 28px',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: vp === 'mobile' ? 12 : 20,
        flexWrap: vp === 'mobile' ? 'wrap' : 'nowrap',
        cursor: 'pointer',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 12,
          background: bgFill, borderRight: '2px solid #0C0C0C',
        }} />
        {/* Icon in tilted sticker frame */}
        <div className="emoji" style={{
          width: vp === 'mobile' ? 48 : 56, height: vp === 'mobile' ? 48 : 56,
          borderRadius: 12,
          background: bgFill,
          border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: vp === 'mobile' ? '1.6rem' : '2rem', lineHeight: 1,
          transform: 'rotate(-3deg)',
          flex: '0 0 auto',
        }}>{b.emoji || '🪣'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 18 : 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1, textTransform: 'uppercase', color: T.ink }}>
            {b.name}
          </div>
          <div style={{ marginTop: 4, fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {memberCount} {memberCount === 1 ? 'KEEPER' : 'KEEPERS'} · CREATED {created?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || ''}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          flex: '0 0 auto', minWidth: vp === 'mobile' ? '100%' : 'auto',
          order: vp === 'mobile' ? 3 : 'unset',
        }}>
          <AvatarStack profiles={profiles} size={26} ring={T.surface} max={4} />
          {itemTotal > 0 && (
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700,
              letterSpacing: -0.3, color: T.ink,
              fontVariantNumeric: 'tabular-nums',
            }}>{itemDone}<span style={{ opacity: 0.4 }}>/{itemTotal}</span></div>
          )}
        </div>
      </Sticker>
    </Link>
  )
}

// ── New bucket card (dashed) ────────────────────────────────────
function NewBucketCard({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="bk-sticker-btn" style={{
      padding: 18, borderRadius: 18,
      background: 'transparent',
      border: '2.5px dashed #0C0C0C',
      cursor: 'pointer', textAlign: 'left',
      minHeight: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
      color: T.ink,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 99,
        background: T.bg, border: '2.5px dashed #0C0C0C',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><NavIcon name="plus" size={28} /></div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>NEW BUCKET</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>Solo or shared</div>
    </button>
  )
}

// ── Page ────────────────────────────────────────────────────────
const EMOJIS = ['🎯', '🎬', '✈️', '🏔️', '📚', '🎮', '🎨', '🍕', '🏋️', '⛰️', '🌊', '🎸', '🦁', '🌍', '🎪', '🚀']

export default function BucketsPage() {
  const router = useRouter()
  const { buckets, profile, fetchBuckets } = useStore()
  const vp = useViewport()

  // Layout switcher state — persists to localStorage
  const [layout, setLayoutRaw] = useState<Layout>('featured')
  useEffect(() => {
    if (typeof window === 'undefined') return
    const v = window.localStorage.getItem(LAYOUT_KEY)
    if (v === 'grid' || v === 'list' || v === 'featured') setLayoutRaw(v)
  }, [])
  const setLayout = (l: Layout) => {
    setLayoutRaw(l)
    try { window.localStorage.setItem(LAYOUT_KEY, l) } catch {}
  }

  // Create-modal state
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true); setError(null)
    try {
      const { data, error: insertError } = await supabase
        .from('buckets')
        .insert({ name: name.trim(), emoji, created_by: profile.id })
        .select()
        .single()
      if (insertError) throw insertError
      await supabase.from('bucket_members').insert({
        bucket_id: data.id,
        user_id: profile.id,
        status: 'active',
      })
      setName(''); setEmoji('🎯'); setShowCreate(false)
      await fetchBuckets()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const firstName = profile?.name?.split(' ')[0] || ''
  const featured = buckets[0]
  const rest = buckets.slice(1)
  const totalDone = buckets.reduce((sum, b: any) => sum + (b.item_done || 0), 0)
  const totalAll = buckets.reduce((sum, b: any) => sum + (b.item_total || 0), 0)

  // ── Empty state ──
  if (buckets.length === 0) {
    return (
      <div>
        <PageHeading
          overline={firstName ? `Hey, ${firstName} ↓` : undefined}
          lineA="WHAT'S"
          lineB={<>ON THE <HighlightBlock color="lime">LIST</HighlightBlock>?</>}
          sub="No buckets yet. Make your first one — solo or shared with friends."
          vp={vp}
        />
        <Sticker radius={18} style={{ padding: 56, textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '3.5rem', marginBottom: 16 }}>🪣</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 10 }}>
            No buckets yet
          </div>
          <p style={{ color: T.inkMuted, marginBottom: 28, fontWeight: 500, lineHeight: 1.5 }}>
            Create your first bucket to start tracking goals, trips, and memories.
          </p>
          <StickerButton color="ink" size="lg" onClick={() => setShowCreate(true)}>＋ CREATE YOUR FIRST BUCKET</StickerButton>
        </Sticker>
        {showCreate && <CreateModal
          name={name} setName={setName}
          emoji={emoji} setEmoji={setEmoji}
          loading={loading} error={error}
          onCancel={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />}
      </div>
    )
  }

  return (
    <div>
      <PageHeading
        overline={firstName ? `Hey, ${firstName} ↓` : undefined}
        lineA="WHAT'S"
        lineB={<>ON THE <HighlightBlock color="lime">LIST</HighlightBlock></>}
        sub={
          <>You have <span style={{ fontWeight: 700, color: T.ink }}>{buckets.length}</span> bucket{buckets.length !== 1 ? 's' : ''}
          {totalAll > 0 && (
            <> · <span style={{ fontWeight: 700, color: T.ink }}>{totalDone}</span> of {totalAll} ticked off so far.</>
          )}
          </>
        }
        vp={vp}
        rightSlot={vp !== 'mobile' ? <LayoutSwitcher value={layout} onChange={setLayout} /> : undefined}
      />

      {vp === 'mobile' && (
        <div style={{ marginBottom: 18 }}>
          <LayoutSwitcher value={layout} onChange={setLayout} />
        </div>
      )}

      {layout === 'featured' && (
        <>
          {featured && <BucketCard b={featured} featured vp={vp} />}
          {rest.length > 0 && (
            <>
              <SectionRule
                label="ALL BUCKETS"
                rightSlot={<StickerButton color="cyan" size="sm" onClick={() => setShowCreate(true)}>＋ NEW BUCKET</StickerButton>}
              />
              <div style={{
                display: 'grid',
                gap: vp === 'mobile' ? 16 : 22,
                gridTemplateColumns: vp === 'mobile' ? '1fr' : vp === 'tablet' ? '1fr 1fr' : '1fr 1fr 1fr',
              }}>
                {rest.map(b => <BucketCard key={b.id} b={b} vp={vp} />)}
                <NewBucketCard onClick={() => setShowCreate(true)} />
              </div>
            </>
          )}
          {rest.length === 0 && (
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: vp === 'mobile' ? '1fr' : '1fr 1fr 1fr', gap: 22 }}>
              <NewBucketCard onClick={() => setShowCreate(true)} />
            </div>
          )}
        </>
      )}

      {layout === 'grid' && (
        <>
          <SectionRule
            label={`${buckets.length} BUCKETS`}
            rightSlot={<StickerButton color="cyan" size="sm" onClick={() => setShowCreate(true)}>＋ NEW BUCKET</StickerButton>}
          />
          <div style={{
            display: 'grid',
            gap: vp === 'mobile' ? 16 : 22,
            gridTemplateColumns: vp === 'mobile' ? '1fr 1fr' : vp === 'tablet' ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
          }}>
            {buckets.map(b => <BucketCard key={b.id} b={b} vp={vp} />)}
            <NewBucketCard onClick={() => setShowCreate(true)} />
          </div>
        </>
      )}

      {layout === 'list' && (
        <>
          <SectionRule
            label="ALL BUCKETS · LIST"
            rightSlot={<StickerButton color="cyan" size="sm" onClick={() => setShowCreate(true)}>＋ NEW BUCKET</StickerButton>}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {buckets.map((b, i) => <BucketListRow key={b.id} b={b} idx={i} vp={vp} />)}
            <NewBucketCard onClick={() => setShowCreate(true)} />
          </div>
        </>
      )}

      {showCreate && <CreateModal
        name={name} setName={setName}
        emoji={emoji} setEmoji={setEmoji}
        loading={loading} error={error}
        onCancel={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />}
    </div>
  )
}

// ── Create modal ────────────────────────────────────────────────
function CreateModal({
  name, setName, emoji, setEmoji,
  loading, error, onCancel, onSubmit,
}: {
  name: string; setName: (v: string) => void
  emoji: string; setEmoji: (v: string) => void
  loading: boolean; error: string | null
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <Sticker radius={18} shadow="lg" style={{ background: '#fff', padding: 32, maxWidth: 460, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, letterSpacing: -1, textTransform: 'uppercase' }}>NEW BUCKET</div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: T.inkMuted }}>✕</button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: '#FAECE7', border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 10,
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: T.ink }}>{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
              color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
            }}>BUCKET NAME</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Places to Visit"
              required
              autoFocus
              className="input"
              style={{ fontFamily: FONT_DISPLAY, textTransform: 'uppercase' as const, fontWeight: 700, letterSpacing: -0.3, fontSize: 16 }}
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
              color: T.inkMuted, textTransform: 'uppercase', marginBottom: 8,
            }}>PICK AN ICON</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className="bk-sticker-btn emoji"
                  style={{
                    fontSize: '1.3rem', padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                    border: emoji === e ? '2.5px solid #0C0C0C' : '2px solid #e0e0e0',
                    background: emoji === e ? T.lime : '#fff',
                    boxShadow: emoji === e ? STICKER_SHADOW_SM : 'none',
                    lineHeight: 1,
                  }}
                >{e}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <StickerButton color="surface" size="lg" style={{ flex: 1 }} onClick={onCancel}>Cancel</StickerButton>
            <StickerButton color="ink" size="lg" type="submit" disabled={loading || !name.trim()} style={{ flex: 2 }}>
              {loading ? 'Creating...' : `Create ${emoji}`}
            </StickerButton>
          </div>
        </form>
      </Sticker>
    </div>
  )
}
