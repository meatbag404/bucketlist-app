'use client'

import { useState, useEffect } from 'react'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_MONO, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, Avatar, PageHeading, HighlightBlock,
  NavIcon, type NavIconName,
} from '@bucketlist/shared'

// Map activity action keys to a glyph + color for the badge.
const ACTION_META: Record<string, { glyph: NavIconName; color: string; verb: string }> = {
  done:        { glyph: 'check',   color: 'lime',   verb: 'marked done' },
  hearted:     { glyph: 'heart',   color: 'red',    verb: 'liked' },
  photo_added: { glyph: 'photo',   color: 'pink',   verb: 'added a photo to' },
  joined:      { glyph: 'friends', color: 'blue',   verb: 'joined' },
  created:     { glyph: 'plus',    color: 'yellow', verb: 'created' },
  added:       { glyph: 'plus',    color: 'yellow', verb: 'added' },
  commented:   { glyph: 'chat',    color: 'cyan',   verb: 'commented on' },
  invited:     { glyph: 'friends', color: 'blue',   verb: 'was invited to' },
}

function formatTime(ts: string): string {
  const d = new Date(ts)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'JUST NOW'
  if (mins < 60) return `${mins}M AGO`
  if (hours < 24) return `${hours}H AGO`
  if (days < 7) return `${days}D AGO`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
}

function bucketKey(ts: string): 'today' | 'yesterday' | 'thisWeek' | 'older' {
  const d = new Date(ts)
  const now = new Date()
  const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const diffDays = Math.floor((nowDay - dDay) / 86400000)
  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return 'thisWeek'
  return 'older'
}

function ActivityRow({ a, idx }: { a: any; idx: number }) {
  const tilt = idx % 2 === 0 ? 0 : -0.4
  const meta = ACTION_META[a.action] || { glyph: 'chat', color: 'cyan', verb: a.action }
  const profile = a.profiles
  return (
    <Sticker tilt={tilt} radius={14} shadow="sm" border="sm" style={{
      padding: '12px 14px', display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{ position: 'relative', flex: '0 0 auto' }}>
        <Avatar p={profile} size={40} />
        <div style={{
          position: 'absolute', bottom: -4, right: -6,
          width: 24, height: 24, borderRadius: 99,
          background: (T as any)[meta.color] || T.cyan,
          border: '2px solid #0C0C0C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <NavIcon name={meta.glyph} size={12} color={meta.color === 'red' ? '#fff' : '#0C0C0C'} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.4 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2, textTransform: 'uppercase' }}>
            {profile?.name?.split(' ')[0] || 'Someone'}
          </span>
          <span style={{ color: T.inkMuted, fontWeight: 600 }}> {meta.verb} </span>
          {a.item_title && (
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2 }}>"{a.item_title}"</span>
          )}
          {a.buckets && (
            <>
              {' '}<span style={{ color: T.inkMuted, fontWeight: 600 }}>in</span>{' '}
              <span className="emoji" style={{ marginRight: 2 }}>{a.buckets.emoji}</span>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2, color: T.blue }}>{a.buckets.name}</span>
            </>
          )}
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
          color: T.inkMuted, marginTop: 6, textTransform: 'uppercase',
        }}>{formatTime(a.created_at)}</div>
      </div>
    </Sticker>
  )
}

function DayHeader({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <HighlightBlock color="ink" tilt={-1} size="sm">
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#fff', textTransform: 'uppercase' }}>· {label} ·</span>
      </HighlightBlock>
      <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
    </div>
  )
}

export default function ActivityPage() {
  const { buckets } = useStore()
  const vp = useViewport()
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      if (buckets.length === 0) { setLoading(false); return }
      const ids = buckets.map(b => b.id)
      const { data, error } = await supabase
        .from('activity')
        .select('*, profiles(*), buckets(name, emoji)')
        .in('bucket_id', ids)
        .order('created_at', { ascending: false })
        .limit(50)
      if (!error && data) setActivity(data)
      setLoading(false)
    }
    fetchAll()
  }, [buckets])

  const groups = {
    today: [] as any[],
    yesterday: [] as any[],
    thisWeek: [] as any[],
    older: [] as any[],
  }
  for (const a of activity) groups[bucketKey(a.created_at)].push(a)

  return (
    <div style={{ maxWidth: 760, marginLeft: vp === 'desktop' ? 0 : 'auto', marginRight: 'auto' }}>
      <PageHeading
        lineA="WHAT'S"
        lineB={<>BEEN <HighlightBlock color="cyan">UP</HighlightBlock>.</>}
        sub="Comments, photos, and checks from everyone in your buckets."
        vp={vp}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div className="emoji" style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
          <p style={{ fontFamily: FONT_DISPLAY, color: T.inkMuted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Loading…</p>
        </div>
      ) : activity.length === 0 ? (
        <Sticker radius={18} style={{ padding: 48, textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2.5rem', marginBottom: 16 }}>📢</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', marginBottom: 8 }}>No activity yet</div>
          <p style={{ color: T.inkMuted, fontWeight: 500 }}>
            {buckets.length === 0
              ? 'Create a bucket first to see activity here'
              : 'Start adding items, completing goals, and inviting friends!'}
          </p>
        </Sticker>
      ) : (
        <>
          {groups.today.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <DayHeader label="TODAY" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {groups.today.map((a, i) => <ActivityRow key={a.id} a={a} idx={i} />)}
              </div>
            </div>
          )}
          {groups.yesterday.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <DayHeader label="YESTERDAY" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {groups.yesterday.map((a, i) => <ActivityRow key={a.id} a={a} idx={i} />)}
              </div>
            </div>
          )}
          {groups.thisWeek.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <DayHeader label="THIS WEEK" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {groups.thisWeek.map((a, i) => <ActivityRow key={a.id} a={a} idx={i} />)}
              </div>
            </div>
          )}
          {groups.older.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <DayHeader label="EARLIER" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {groups.older.map((a, i) => <ActivityRow key={a.id} a={a} idx={i} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
