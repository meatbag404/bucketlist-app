'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_UI, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, StickerButton, StickerChip, HighlightBlock, Avatar, PageHeading,
  color as resolveColor,
  Icon8, getIcon,
} from '@bucketlist/shared'

const PICKER_RESULT_KEY = 'iconPicker:result'

const CARD_COLORS = ['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const
function colorForBucket(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return CARD_COLORS[Math.abs(h) % CARD_COLORS.length]
}

const ITEM_EMOJIS = ['✨', '🎯', '🌍', '🎬', '📚', '🏔️', '🍕', '🎸', '🏋️', '🌊', '🎪', '🚀', '🦁', '🎨', '⛰️', '🎮', '🌸', '🎂', '🥐', '☀️']

function AddScreenInner() {
  const router = useRouter()
  const search = useSearchParams()
  const vp = useViewport()
  const { buckets, profile, fetchItems, fetchBuckets } = useStore()

  const initialBucketId = search.get('bucket') || buckets[0]?.id || ''
  const [bucketId, setBucketId] = useState(initialBucketId)
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('✨')
  const [iconId, setIconId] = useState<string | null>(null)
  const [memoryNote, setMemoryNote] = useState('')
  const [tagged, setTagged] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bucketId && buckets.length > 0) setBucketId(buckets[0].id)
  }, [buckets, bucketId])

  // Pick up a sticker selection returned by the /app/icons picker.
  useEffect(() => {
    const consume = () => {
      if (typeof window === 'undefined') return
      const id = window.sessionStorage.getItem(PICKER_RESULT_KEY)
      if (id) {
        setIconId(id)
        window.sessionStorage.removeItem(PICKER_RESULT_KEY)
      }
    }
    consume()
    const onFocus = () => consume()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const activeBucket = buckets.find(b => b.id === bucketId)
  const bucketColor = activeBucket ? colorForBucket(activeBucket.id) : 'cyan'

  // Available friends in the active bucket (taggable people)
  const taggable: { id: string; name: string; handle: string; avatar_color: number }[] = (activeBucket?.members || [])
    .filter((m: any) => m.status === 'active' && m.user_id !== profile?.id)
    .map((m: any) => m.profiles)
    .filter(Boolean)

  function toggleTag(id: string) {
    setTagged(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !bucketId || !title.trim()) return
    setLoading(true); setError(null)
    try {
      const { data: item, error: insertError } = await supabase
        .from('items')
        .insert({
          bucket_id: bucketId,
          title: title.trim(),
          emoji,
          icon_id: iconId,
          memory_note: memoryNote.trim() || null,
          created_by: profile.id,
        })
        .select()
        .single()
      if (insertError) throw insertError

      // Insert tags
      if (tagged.length > 0 && item) {
        const tagRows = tagged.map(uid => ({ item_id: item.id, user_id: uid }))
        await supabase.from('item_tags').insert(tagRows)
      }

      await fetchItems(bucketId)
      await fetchBuckets()
      router.push(`/app/bucket/${bucketId}`)
    } catch (err: any) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  // No buckets — push them to create one first
  if (buckets.length === 0) {
    return (
      <div style={{ maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
        <Sticker radius={18} style={{ padding: 48, textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2.5rem', marginBottom: 16 }}>🪣</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', marginBottom: 8 }}>
            Make a bucket first
          </div>
          <p style={{ color: T.inkMuted, marginBottom: 22, fontWeight: 500 }}>
            You need a bucket to put new items in.
          </p>
          <StickerButton color="ink" size="lg" onClick={() => router.push('/app')}>＋ CREATE A BUCKET</StickerButton>
        </Sticker>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <StickerButton onClick={() => router.back()}>CANCEL</StickerButton>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 16 : 18, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>
          NEW THING
        </div>
        <StickerButton color="ink" onClick={submit} disabled={!title.trim() || loading}>
          {loading ? '…' : 'ADD →'}
        </StickerButton>
      </div>

      <PageHeading
        lineA="ADD"
        lineB={<>SOMETHING <HighlightBlock color="pink">NEW</HighlightBlock></>}
        sub="It can be tiny or huge. Done by next week or someday. Tag friends so they get a ping."
        vp={vp}
      />

      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: 18,
          background: '#FAECE7', border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 10,
        }}>
          <p style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{error}</p>
        </div>
      )}

      <form onSubmit={submit}>
        {/* Bucket selector pill */}
        <Sticker color="cyan" radius={14} shadow="sm" border="sm" style={{
          padding: '12px 16px', marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div className="emoji" style={{
            width: 40, height: 40, borderRadius: 10,
            background: T.surface, border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', lineHeight: 1, transform: 'rotate(-2deg)',
            flex: '0 0 auto',
          }}>{activeBucket?.emoji || '🪣'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>
              ADDING TO
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeBucket?.name || 'Pick a bucket'}
            </div>
          </div>
          <select
            value={bucketId}
            onChange={e => setBucketId(e.target.value)}
            style={{
              background: T.surface, color: T.ink,
              border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
              borderRadius: 10, padding: '6px 10px',
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {buckets.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>)}
          </select>
        </Sticker>

        {/* Title + emoji */}
        <Sticker color={bucketColor} radius={18} shadow="lg" style={{ padding: 18, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <button
              type="button"
              onClick={() => router.push(`/app/icons${iconId ? `?selected=${encodeURIComponent(iconId)}` : ''}`)}
              className="emoji"
              aria-label="Browse stickers"
              style={{
                width: 68, height: 68, borderRadius: 14, padding: 0,
                background: T.surface, border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', lineHeight: 1, transform: 'rotate(-3deg)',
                flex: '0 0 auto', cursor: 'pointer',
              }}
            >
              {iconId ? <Icon8 id={iconId} size={44} /> : <span>{emoji}</span>}
            </button>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="WHAT DO YOU WANT TO TICK OFF?"
              required
              autoFocus
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontFamily: FONT_DISPLAY,
                fontSize: vp === 'mobile' ? 18 : 22,
                fontWeight: 700, letterSpacing: -0.5, color: T.ink, padding: '12px 0',
                textTransform: 'uppercase', minWidth: 0,
              }}
            />
          </div>

          {/* Sticker label + browse-more CTA */}
          <div style={{
            marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              color: T.ink, opacity: 0.75, textTransform: 'uppercase',
            }}>
              {iconId
                ? `STICKER · ${getIcon(iconId)?.name ?? 'CUSTOM'}`
                : 'PICK A QUICK EMOJI OR BROWSE STICKERS →'}
            </div>
            <StickerButton
              size="sm"
              onClick={() => router.push(`/app/icons${iconId ? `?selected=${encodeURIComponent(iconId)}` : ''}`)}
            >
              {iconId ? 'CHANGE' : 'BROWSE'}
            </StickerButton>
          </div>

          {/* Quick emoji picker grid */}
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
            {ITEM_EMOJIS.map((e) => {
              const active = !iconId && emoji === e
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => { setEmoji(e); setIconId(null) }}
                  className="bk-sticker-btn emoji"
                  style={{
                    fontSize: '1.2rem', padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                    border: active ? '2.5px solid #0C0C0C' : '2px solid rgba(12,12,12,0.15)',
                    background: active ? T.surface : 'rgba(255,255,255,0.5)',
                    boxShadow: active ? STICKER_SHADOW_SM : 'none',
                    lineHeight: 1,
                  }}
                >{e}</button>
              )
            })}
          </div>
        </Sticker>

        {/* Memory note */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.6,
            color: T.inkMuted, textTransform: 'uppercase', marginBottom: 10,
          }}>WHY YOU WANT THIS (OPTIONAL)</div>
          <textarea
            value={memoryNote}
            onChange={e => setMemoryNote(e.target.value)}
            placeholder="Share the why, the dream, the inside joke..."
            rows={3}
            style={{
              width: '100%', padding: '12px 14px',
              background: T.bg, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
              borderRadius: 12, outline: 'none',
              fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
              color: T.ink, resize: 'vertical',
              transition: 'box-shadow 0.1s',
            }}
            onFocus={e => { e.currentTarget.style.boxShadow = '3px 3px 0 #0C0C0C' }}
            onBlur={e =>  { e.currentTarget.style.boxShadow = '2px 2px 0 rgba(12,12,12,0.18)' }}
          />
        </div>

        {/* Tag people */}
        {taggable.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.6,
              color: T.inkMuted, textTransform: 'uppercase', marginBottom: 12,
            }}>TAG WHO'S IN</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {taggable.map(p => {
                const on = tagged.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleTag(p.id)}
                    className="bk-sticker-btn"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '6px 14px 6px 6px', borderRadius: 99,
                      background: on ? resolveColor(bucketColor) : T.surface,
                      border: STICKER_BORDER_SM,
                      boxShadow: on ? STICKER_SHADOW_SM : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Avatar p={p} size={28} />
                    <span style={{
                      fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: -0.3, textTransform: 'uppercase' as const,
                      color: T.ink,
                    }}>{p.name?.split(' ')[0] || p.handle}</span>
                    {on && <span style={{ fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <StickerButton size="lg" style={{ flex: 1 }} onClick={() => router.back()}>CANCEL</StickerButton>
          <StickerButton color="ink" size="lg" type="submit" disabled={!title.trim() || loading} style={{ flex: 2 }}>
            {loading ? 'ADDING…' : 'ADD →'}
          </StickerButton>
        </div>
      </form>
    </div>
  )
}

export default function AddPage() {
  return (
    <Suspense fallback={null}>
      <AddScreenInner />
    </Suspense>
  )
}
