'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_MONO, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, Avatar, PageHeading, HighlightBlock, StickerChip, NavIcon,
  color as resolveColor,
  Icon8,
} from '@bucketlist/shared'

// Hashed color per bucket id (same scheme as buckets page)
const CARD_COLORS = ['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const
function colorForBucket(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return CARD_COLORS[Math.abs(h) % CARD_COLORS.length]
}

type Memory = {
  id: string
  bucket_id: string
  bucket?: { id: string; name: string; emoji: string }
  title: string
  emoji: string
  memory_note: string | null
  done_at: string | null
  created_at: string
  photos: any[]
  tagged: any[]
}

function MemoryCard({ m, tilt }: { m: Memory; tilt: number }) {
  const bgColor = m.bucket ? colorForBucket(m.bucket.id) : 'pink'
  const hasPhoto = m.photos && m.photos.length > 0
  const date = m.done_at ? new Date(m.done_at) : new Date(m.created_at)

  return (
    <Link href={`/app/item/${m.id}`} style={{ textDecoration: 'none' }}>
      <Sticker tilt={tilt} radius={14} shadow="md" onClick={() => {}} style={{
        padding: 0, overflow: 'hidden', cursor: 'pointer',
      }}>
        {/* Color band header */}
        <div style={{
          background: resolveColor(bgColor), padding: '8px 12px',
          borderBottom: '2px solid #0C0C0C',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
            {m.bucket?.name || 'BUCKET'}
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: T.ink, opacity: 0.75, whiteSpace: 'nowrap' }}>
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Photo or striped placeholder */}
        <div style={{ position: 'relative' }}>
          {hasPhoto ? (
            <div style={{
              width: '100%', aspectRatio: '4 / 5',
              background: `url(${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-photos/${m.photos[0].storage_path}) center/cover`,
            }} />
          ) : (
            <div style={{
              width: '100%', aspectRatio: '4 / 5',
              background: resolveColor(bgColor),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_MONO, fontSize: 11, color: T.ink, opacity: 0.55, letterSpacing: 0.4, textTransform: 'uppercase',
              padding: 12, textAlign: 'center',
            }}>{m.title.slice(0, 24).toLowerCase()}</div>
          )}
          <div className="emoji" style={{
            position: 'absolute', top: 10, left: 10,
            width: 44, height: 44, borderRadius: 12,
            background: resolveColor(bgColor),
            border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', lineHeight: 1, transform: 'rotate(-3deg)',
          }}>{m.emoji || '✨'}</div>
        </div>

        {/* Title + footer */}
        <div style={{ padding: 12 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2,
            textTransform: 'uppercase',
            color: T.ink,
          }}>{m.title}</div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 10, paddingTop: 10, borderTop: '1.5px solid rgba(12,12,12,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {m.tagged?.slice(0, 3).map((t: any, i: number) => (
                <div key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                  <Avatar p={t.profile || t} size={20} ring={T.surface} />
                </div>
              ))}
            </div>
            <NavIcon name="check" size={14} />
          </div>
        </div>
      </Sticker>
    </Link>
  )
}

export default function MemoriesPage() {
  const { buckets, profile } = useStore()
  const vp = useViewport()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [bucketFilter, setBucketFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemories = async () => {
      if (buckets.length === 0) { setLoading(false); return }
      const ids = buckets.map(b => b.id)
      const { data, error } = await supabase
        .from('items')
        .select(`
          id, bucket_id, title, emoji, memory_note, done_at, created_at,
          item_photos(id, storage_path),
          item_tags(profile:profiles(id, name, avatar_color))
        `)
        .in('bucket_id', ids)
        .eq('done', true)
        .order('done_at', { ascending: false, nullsFirst: false })
        .limit(60)
      if (!error && data) {
        const mapped: Memory[] = data.map((it: any) => {
          const bk = buckets.find(b => b.id === it.bucket_id)
          return {
            id: it.id,
            bucket_id: it.bucket_id,
            bucket: bk ? { id: bk.id, name: bk.name, emoji: bk.emoji } : undefined,
            title: it.title,
            emoji: it.emoji,
            memory_note: it.memory_note,
            done_at: it.done_at,
            created_at: it.created_at,
            photos: it.item_photos || [],
            tagged: it.item_tags || [],
          }
        })
        setMemories(mapped)
      }
      setLoading(false)
    }
    fetchMemories()
  }, [buckets])

  const cols = vp === 'mobile' ? 2 : vp === 'tablet' ? 3 : 4
  const filtered = bucketFilter
    ? memories.filter(m => m.bucket_id === bucketFilter)
    : memories

  return (
    <div>
      <PageHeading
        lineA="STUFF"
        lineB={<>YOU <HighlightBlock color="pink">DID</HighlightBlock>.</>}
        sub={memories.length > 0
          ? <><span style={{ color: T.ink, fontWeight: 700 }}>{memories.length}</span> {memories.length === 1 ? 'memory' : 'memories'} so far. Look at you go.</>
          : 'Check off items in your buckets — they show up here as memories.'}
        vp={vp}
      />

      {/* Bucket filters */}
      {buckets.length > 0 && (
        <div className="bk-scrollx" style={{ display: 'flex', gap: 8, marginBottom: 24, padding: '2px 0' }}>
          <StickerChip active={!bucketFilter} color="ink" onClick={() => setBucketFilter(null)}>
            ALL · {memories.length}
          </StickerChip>
          {buckets.map(b => {
            const count = memories.filter(m => m.bucket_id === b.id).length
            if (count === 0) return null
            const c = colorForBucket(b.id)
            return (
              <StickerChip key={b.id} active={bucketFilter === b.id} color={c} onClick={() => setBucketFilter(bucketFilter === b.id ? null : b.id)}>
                {(b as any).icon_id
                  ? <span style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }}><Icon8 id={(b as any).icon_id} size={14} /></span>
                  : <span className="emoji" style={{ marginRight: 4 }}>{b.emoji}</span>}{b.name}
              </StickerChip>
            )
          })}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div className="emoji" style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
          <p style={{ fontFamily: FONT_DISPLAY, color: T.inkMuted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <Sticker radius={18} style={{ padding: 48, textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2.5rem', marginBottom: 16 }}>📸</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', marginBottom: 8 }}>
            No memories yet
          </div>
          <p style={{ color: T.inkMuted, fontWeight: 500 }}>
            {buckets.length === 0
              ? 'Create a bucket and start ticking things off!'
              : 'Mark items as done to start your memory wall.'}
          </p>
        </Sticker>
      ) : (
        <div style={{
          display: 'grid', gap: vp === 'mobile' ? 14 : 18,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          alignItems: 'start',
        }}>
          {filtered.map((m, i) => {
            const tilt = i % 4 === 0 ? -1.2 : i % 4 === 1 ? 1.5 : i % 4 === 2 ? -0.5 : 0.8
            return <MemoryCard key={m.id} m={m} tilt={tilt} />
          })}
        </div>
      )}
    </div>
  )
}
