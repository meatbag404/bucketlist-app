'use client'

import { useState } from 'react'
import {
  useStore, useViewport,
  T, FONT_DISPLAY, FONT_UI, FONT_MONO, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, StickerButton, Avatar, PageHeading, HighlightBlock,
} from '@bucketlist/shared'

export default function FriendsPage() {
  const {
    friends, incomingFriendRequests, outgoingFriendRequests,
    buckets, profile,
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend,
  } = useStore()
  const vp = useViewport()

  // Count buckets each friend shares with me
  const sharedByFriend = new Map<string, number>()
  for (const b of buckets) {
    const memberIds = new Set((b.members || []).filter((m: any) => m.status === 'active').map((m: any) => m.user_id))
    for (const f of friends) {
      if (memberIds.has(f.id) && memberIds.has(profile?.id || '')) {
        sharedByFriend.set(f.id, (sharedByFriend.get(f.id) || 0) + 1)
      }
    }
  }

  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const cols = vp === 'mobile' ? 2 : vp === 'tablet' ? 3 : 4

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setSuccess(null)
    const err = await sendFriendRequest(handle)
    if (err) setError(err)
    else { setSuccess(`Friend request sent to @${handle.replace('@', '')}!`); setHandle('') }
    setLoading(false)
  }

  return (
    <div>
      <PageHeading
        lineA="YOUR"
        lineB={<><HighlightBlock color="lime">PEOPLE</HighlightBlock>.</>}
        sub="The crew you make memories with. Send a request by @handle to start sharing buckets."
        vp={vp}
      />

      {/* Invite poster — big blue sticker with decorative orbs */}
      <Sticker color="blue" radius={20} shadow="lg" style={{
        padding: vp === 'mobile' ? 22 : 32, marginBottom: 32,
        position: 'relative', overflow: 'hidden',
        color: '#fff',
      }}>
        {/* Decorative tint orbs */}
        <div aria-hidden style={{
          position: 'absolute', top: -24, right: -16, width: 120, height: 120, borderRadius: 99,
          background: T.yellow, border: STICKER_BORDER_SM,
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: -32, left: vp === 'mobile' ? 80 : 280,
          width: 90, height: 90, borderRadius: 99,
          background: T.pink, border: STICKER_BORDER_SM,
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <div style={{
            fontFamily: FONT_DISPLAY,
            fontSize: vp === 'mobile' ? 32 : 48,
            fontWeight: 700, letterSpacing: -1.5, lineHeight: 0.95,
            textTransform: 'uppercase',
            color: '#fff',
          }}>BRING SOMEONE ALONG.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 14, lineHeight: 1.5, fontWeight: 500, fontFamily: FONT_UI }}>
            Send a friend request to anyone with a handle to start sharing buckets. They see your shared buckets the second they accept.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).navigator?.share) {
                  (window as any).navigator.share({ title: 'Join me on Bucket List', url: window.location.origin })
                    .catch(() => {})
                } else {
                  navigator.clipboard?.writeText(window.location.origin)
                  alert('Link copied to clipboard!')
                }
              }}
              className="bk-sticker-btn"
              style={{
                padding: '12px 20px', borderRadius: 12,
                background: T.surface, color: T.ink,
                border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
                textTransform: 'uppercase' as const, cursor: 'pointer',
              }}
            >↗ SHARE INVITE</button>
            <div style={{
              padding: '12px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              border: '2px solid #fff',
              fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
            }}>@{profile?.handle?.toUpperCase() || 'YOU'}</div>
          </div>
        </div>
      </Sticker>

      {/* Add Friend card */}
      <Sticker radius={16} style={{ padding: 22, marginBottom: 24 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          color: T.inkMuted, textTransform: 'uppercase', marginBottom: 12,
        }}>ADD FRIEND</div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={handle}
            onChange={e => setHandle(e.target.value)}
            placeholder="@handle"
            required
            style={{
              flex: 1, padding: '12px 14px',
              background: T.bg, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
              borderRadius: 12, outline: 'none',
              fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.4,
              color: T.ink, textTransform: 'uppercase' as const,
            }}
          />
          <StickerButton color="ink" size="lg" type="submit" disabled={loading}>
            {loading ? '...' : 'SEND'}
          </StickerButton>
        </form>
        {error && (
          <p style={{
            marginTop: 10, fontSize: '0.85rem', color: T.red, fontWeight: 600,
            fontFamily: FONT_UI,
          }}>{error}</p>
        )}
        {success && (
          <p style={{
            marginTop: 10, fontSize: '0.85rem', color: '#2d7a3a', fontWeight: 600,
            fontFamily: FONT_UI,
          }}>✓ {success}</p>
        )}
      </Sticker>

      {/* Incoming requests */}
      {incomingFriendRequests.length > 0 && (
        <Sticker color="yellow" radius={16} style={{ padding: 22, marginBottom: 24 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
            color: T.ink, textTransform: 'uppercase', marginBottom: 14,
          }}>· {incomingFriendRequests.length} REQUEST{incomingFriendRequests.length !== 1 ? 'S' : ''} ·</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {incomingFriendRequests.map(req => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar p={req.profile} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: -0.3, color: T.ink }}>{req.profile?.name}</p>
                  <p style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: T.inkMuted }}>@{req.profile?.handle}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <StickerButton color="lime" size="sm" onClick={() => acceptFriendRequest(req.id)}>Accept</StickerButton>
                  <StickerButton color="surface" size="sm" onClick={() => declineFriendRequest(req.id)}>Decline</StickerButton>
                </div>
              </div>
            ))}
          </div>
        </Sticker>
      )}

      {/* Friends grid */}
      {friends.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <HighlightBlock color="ink" tilt={-1} size="sm">
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff', textTransform: 'uppercase' }}>· {friends.length} FRIEND{friends.length !== 1 ? 'S' : ''} ·</span>
            </HighlightBlock>
            <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
          </div>
          <div style={{
            display: 'grid', gap: vp === 'mobile' ? 14 : 18,
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            marginBottom: 32,
          }}>
            {friends.map((p, i) => (
              <FriendCard
                key={p.id}
                p={p}
                tilt={i % 2 === 0 ? -0.8 : 1.2}
                sharedBuckets={sharedByFriend.get(p.id) || 0}
                onRemove={() => removeFriend(p.friendshipId)}
              />
            ))}
          </div>
        </>
      )}

      {/* Pending outgoing */}
      {outgoingFriendRequests.length > 0 && (
        <Sticker radius={16} style={{ padding: 22, marginBottom: 24 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
            color: T.inkMuted, textTransform: 'uppercase', marginBottom: 14,
          }}>PENDING ({outgoingFriendRequests.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {outgoingFriendRequests.map(req => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar p={req.profile} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: -0.3 }}>{req.profile?.name}</p>
                  <p style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: T.inkMuted }}>@{req.profile?.handle}</p>
                </div>
                <span style={{
                  padding: '4px 10px', background: T.yellow, color: T.ink,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 99,
                  fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' as const,
                }}>PENDING</span>
              </div>
            ))}
          </div>
        </Sticker>
      )}

      {/* Empty state */}
      {friends.length === 0 && incomingFriendRequests.length === 0 && outgoingFriendRequests.length === 0 && (
        <Sticker radius={18} style={{ padding: 48, textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2.5rem', marginBottom: 16 }}>🤝</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', marginBottom: 8 }}>No friends yet</div>
          <p style={{ color: T.inkMuted, fontWeight: 500 }}>Send a friend request using their @handle above</p>
        </Sticker>
      )}
    </div>
  )
}

function FriendCard({ p, tilt, sharedBuckets, onRemove }: { p: any; tilt: number; sharedBuckets: number; onRemove: () => void }) {
  return (
    <Sticker tilt={tilt} radius={16} style={{
      padding: 18,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
    }}>
      <Avatar p={p} size={72} />
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, letterSpacing: -0.3, textTransform: 'uppercase' }}>{p.name?.split(' ')[0] || p.name}</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, marginTop: 2 }}>@{p.handle}</div>
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
        color: T.inkMuted, textTransform: 'uppercase',
      }}>{sharedBuckets} SHARED · BUCKET{sharedBuckets !== 1 ? 'S' : ''}</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, width: '100%' }}>
        <StickerButton size="sm" style={{ flex: 1 }} onClick={() => alert('Profile view coming soon')}>VIEW →</StickerButton>
        <StickerButton size="sm" style={{ flex: 1, background: '#FAECE7', color: T.red, borderColor: T.red, boxShadow: '2px 2px 0 ' + T.red } as any} onClick={onRemove}>REMOVE</StickerButton>
      </div>
    </Sticker>
  )
}
