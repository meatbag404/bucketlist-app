'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_UI, FONT_MONO, STICKER_BORDER, STICKER_BORDER_SM, STICKER_SHADOW, STICKER_SHADOW_SM,
  Sticker, StickerButton, Avatar, NavIcon, SectionLabel,
  color as resolveColor,
} from '@bucketlist/shared'

const CARD_COLORS = ['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const
function colorForBucket(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return CARD_COLORS[Math.abs(h) % CARD_COLORS.length]
}

const ITEM_EMOJIS = ['✨', '🎯', '🌍', '🎬', '📚', '🏔️', '🍕', '🎸', '🏋️', '🌊', '🎪', '🚀', '🦁', '🎨', '⛰️', '🎮']

function ReactBtn({
  icon, label, color, active, onClick,
}: { icon: 'heart' | 'star' | 'chat' | 'plus'; label: React.ReactNode; color: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bk-sticker-btn"
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 99,
        background: active ? resolveColor(color) : 'transparent',
        border: active ? STICKER_BORDER_SM : '2px solid transparent',
        boxShadow: active ? '2px 2px 0 #0C0C0C' : 'none',
        color: active && color === 'red' ? '#fff' : T.ink,
        fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <NavIcon name={icon} size={14} color={active && color === 'red' ? '#fff' : '#0C0C0C'} />
      {label}
    </button>
  )
}

export default function ItemDetailPage() {
  const params = useParams()
  const itemId = params.id as string
  const router = useRouter()
  const vp = useViewport()

  const {
    items, profile, buckets,
    setActiveBucketId,
    markItemDone, restoreItem, toggleHeart, toggleStar, uploadItemPhoto, addComment,
    editItem, deleteItem,
  } = useStore()

  const [commentText, setCommentText] = useState('')
  const [sendingComment, setSendingComment] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [fetchedItem, setFetchedItem] = useState<any | null>(null)

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editEmoji, setEditEmoji] = useState('✨')
  const [editNote, setEditNote] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Find from store first, otherwise fetch directly
  const storeItem = items.find(i => i.id === itemId)
  const item = storeItem || fetchedItem

  useEffect(() => {
    if (storeItem) {
      setFetchedItem(null)
      return
    }
    // Item not in active bucket — fetch standalone
    const fetch = async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          item_photos (*),
          item_tags (*, profile:profiles(*)),
          comments (*, profiles(*)),
          created_by_profile:profiles!items_created_by_fkey(*)
        `)
        .eq('id', itemId)
        .maybeSingle()
      if (!error && data) {
        setFetchedItem({
          ...data,
          photos: data.item_photos || [],
          tagged_users: data.item_tags || [],
          comments: data.comments || [],
        })
        setActiveBucketId(data.bucket_id)
      }
    }
    fetch()
  }, [itemId, storeItem, setActiveBucketId])

  if (!item) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
          <p style={{ fontFamily: FONT_DISPLAY, color: T.inkMuted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Loading item…</p>
        </div>
      </div>
    )
  }

  const bucket = buckets.find(b => b.id === item.bucket_id)
  const bucketColor = bucket ? colorForBucket(bucket.id) : 'cyan'
  const taggedProfiles = (item.tagged_users || []).map((t: any) => t.profile).filter(Boolean)
  const comments = item.comments || []

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true)
    try {
      const blobUrl = URL.createObjectURL(file)
      await uploadItemPhoto(item.id, blobUrl)
      URL.revokeObjectURL(blobUrl)
    } catch (e: any) {
      alert('Photo upload failed: ' + e.message)
    } finally { setUploadingPhoto(false) }
  }

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSendingComment(true)
    try {
      await addComment(item.id, commentText.trim())
      setCommentText('')
    } finally { setSendingComment(false) }
  }

  const openEdit = () => {
    setEditTitle(item.title || '')
    setEditEmoji(item.emoji || '✨')
    setEditNote(item.memory_note || '')
    setShowEdit(true)
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    setEditLoading(true)
    try {
      await editItem(item.id, {
        title: editTitle.trim(),
        emoji: editEmoji,
        memory_note: editNote.trim() || null,
      })
      setShowEdit(false)
    } catch (err: any) {
      alert(err.message)
    } finally { setEditLoading(false) }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    await deleteItem(item.id)
    router.push(bucket ? `/app/bucket/${bucket.id}` : '/app')
  }

  return (
    <div>
      <button
        onClick={() => router.push(bucket ? `/app/bucket/${bucket.id}` : '/app')}
        className="bk-sticker-btn"
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          color: T.inkMuted, textTransform: 'uppercase', padding: 0, marginBottom: 18,
        }}
      >‹ BACK TO BUCKET</button>

      <div style={{
        display: 'grid', gap: vp === 'desktop' ? 32 : 22,
        gridTemplateColumns: vp === 'desktop' ? '1.1fr 1fr' : '1fr',
        alignItems: 'start',
      }}>
        {/* LEFT — hero + reactions + done CTA */}
        <div>
          <Sticker color={bucketColor} radius={20} shadow="lg" style={{
            padding: vp === 'mobile' ? 22 : 32, marginBottom: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {bucket && (
                <div style={{
                  padding: '4px 10px', background: T.surface, borderRadius: 99,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                  fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', color: T.ink,
                }}>
                  <span className="emoji">{bucket.emoji}</span> {bucket.name}
                </div>
              )}
              {item.done && (
                <div style={{
                  padding: '4px 10px', background: T.lime, borderRadius: 99,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                  fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
                  color: T.ink,
                }}>✓ DONE</div>
              )}
            </div>

            <div className="emoji" style={{
              fontSize: vp === 'mobile' ? '4rem' : '5.5rem', lineHeight: 1,
              transform: 'rotate(-4deg)',
              display: 'inline-block', marginBottom: 8,
            }}>{item.emoji || '✨'}</div>

            <div style={{
              fontFamily: FONT_DISPLAY,
              fontSize: vp === 'mobile' ? 28 : 40, fontWeight: 700, letterSpacing: -1.4, lineHeight: 0.96,
              textTransform: 'uppercase', marginTop: 12,
              color: T.ink,
            }}>{item.title}</div>

            <div style={{
              marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 14,
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
              color: T.ink,
            }}>
              <span style={{ whiteSpace: 'nowrap' }}>📅 {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              {item.created_by_profile?.name && (
                <span style={{ whiteSpace: 'nowrap' }}>BY {item.created_by_profile.name.split(' ')[0]}</span>
              )}
              {taggedProfiles.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  WITH
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {taggedProfiles.slice(0, 4).map((p: any, i: number) => (
                      <div key={p.id || i} style={{ marginLeft: i === 0 ? 4 : -6 }}>
                        <Avatar p={p} size={20} ring={resolveColor(bucketColor)} />
                      </div>
                    ))}
                  </span>
                </span>
              )}
            </div>
          </Sticker>

          {/* Reactions row */}
          <Sticker radius={16} style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            <ReactBtn icon="heart" label={item.hearts || 0} color="red" active={item.hearted_by_me} onClick={() => toggleHeart(item.id)} />
            <ReactBtn icon="star" label={item.starred ? 'STARRED' : 'STAR'} color="yellow" active={item.starred} onClick={() => toggleStar(item.id)} />
            <ReactBtn icon="chat" label={comments.length} color="cyan" />
          </Sticker>

          {/* Done CTA + Edit + Delete */}
          <div style={{ display: 'flex', gap: 10 }}>
            {item.done ? (
              <StickerButton color="surface" size="lg" style={{ flex: 1 }} onClick={() => restoreItem(item.id)}>↩ RESTORE</StickerButton>
            ) : (
              <StickerButton color="lime" size="lg" style={{ flex: 1 }} onClick={() => markItemDone(item.id)}>✓ MARK DONE</StickerButton>
            )}
            <StickerButton color="surface" size="lg" onClick={openEdit}>✎</StickerButton>
            <StickerButton
              color={deleteConfirm ? 'red' : 'surface'}
              textColor={deleteConfirm ? '#fff' : undefined}
              size="lg"
              onClick={handleDelete}
            >
              {deleteConfirm ? 'DELETE?' : '🗑'}
            </StickerButton>
          </div>
        </div>

        {/* RIGHT — photos + memory + comments */}
        <div>
          {/* Photo strip */}
          <div style={{ marginBottom: 22 }}>
            <SectionLabel>PHOTOS · {item.photos?.length || 0}</SectionLabel>
            <div className="bk-scrollx" style={{ display: 'flex', gap: 10, marginTop: 12, paddingBottom: 6 }}>
              {(item.photos || []).map((photo: any, i: number) => (
                <div key={photo.id} style={{
                  background: (T as any)[i % 2 === 0 ? 'yellow' : 'cyan'], padding: 4,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 8,
                  transform: `rotate(${i % 2 === 0 ? 1.2 : -1.5}deg)`, flex: '0 0 auto',
                }}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-photos/${photo.storage_path}`}
                    alt={`photo ${i + 1}`}
                    style={{ display: 'block', width: 140, height: 180, objectFit: 'cover', borderRadius: 4 }}
                  />
                </div>
              ))}
              <label className="bk-sticker-btn" style={{
                width: 140, height: 188,
                border: '2.5px dashed #0C0C0C', borderRadius: 12, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: uploadingPhoto ? 'wait' : 'pointer',
                flex: '0 0 auto',
              }}>
                {uploadingPhoto
                  ? <span className="emoji" style={{ fontSize: '1.8rem' }}>⏳</span>
                  : <NavIcon name="plus" size={32} />}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handlePhotoUpload(f)
                  e.target.value = ''
                }} />
              </label>
            </div>
          </div>

          {/* Memory note */}
          {item.memory_note && (
            <div style={{ marginBottom: 22, position: 'relative', paddingTop: 12 }}>
              <Sticker radius={18} style={{ padding: 22, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -12, left: 18,
                  padding: '3px 10px', background: T.lime,
                  border: STICKER_BORDER_SM, borderRadius: 6,
                  fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>MEMORY · BY {(item.created_by_profile?.name?.split(' ')[0] || 'YOU').toUpperCase()}</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2, marginTop: 6,
                  color: T.ink,
                }}>"{item.memory_note}"</div>
              </Sticker>
            </div>
          )}

          {/* Comments */}
          <SectionLabel>COMMENTS · {comments.length}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, marginBottom: 14 }}>
            {comments.length === 0 && (
              <p style={{ fontSize: 13, color: T.inkMuted, fontWeight: 500, fontFamily: FONT_UI }}>
                No comments yet — be the first.
              </p>
            )}
            {comments.map((c: any) => {
              const p = c.profiles
              return (
                <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Avatar p={p} size={32} />
                  <Sticker radius={12} shadow="sm" border="sm" style={{ flex: 1, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: -0.2, textTransform: 'uppercase' }}>
                        {p?.name?.split(' ')[0] || 'Someone'}
                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted }}>
                        {new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.4, color: T.ink, fontWeight: 500, fontFamily: FONT_UI }}>{c.body || c.text}</div>
                  </Sticker>
                </div>
              )
            })}
          </div>

          <form onSubmit={handleSendComment} style={{ display: 'flex', gap: 10 }}>
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="ADD A COMMENT..."
              style={{
                flex: 1, padding: '12px 14px',
                background: T.surface, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
                borderRadius: 12, outline: 'none',
                fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
                color: T.ink, textTransform: 'uppercase',
              }}
            />
            <StickerButton color="ink" type="submit" disabled={sendingComment || !commentText.trim()}>SEND →</StickerButton>
          </form>
        </div>
      </div>

      {/* ─── Edit Item Modal ─── */}
      {showEdit && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEdit(false) }}
        >
          <Sticker radius={18} shadow="lg" style={{ background: '#fff', padding: 28, maxWidth: 500, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase' }}>Edit Item</div>
              <button onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: T.inkMuted }}>✕</button>
            </div>

            <form onSubmit={saveEdit}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
              }}>Title</div>
              <input
                type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                required autoFocus className="input"
                style={{ fontFamily: FONT_DISPLAY, textTransform: 'uppercase' as const, fontWeight: 700, fontSize: 16, marginBottom: 18 }}
              />

              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
              }}>Icon</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, marginBottom: 18 }}>
                {ITEM_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEditEmoji(e)}
                    className="bk-sticker-btn emoji"
                    style={{
                      fontSize: '1.3rem', padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                      border: editEmoji === e ? '2.5px solid #0C0C0C' : '2px solid #e0e0e0',
                      background: editEmoji === e ? T.lime : '#fff',
                      boxShadow: editEmoji === e ? STICKER_SHADOW_SM : 'none',
                      lineHeight: 1,
                    }}
                  >{e}</button>
                ))}
              </div>

              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
              }}>Memory Note (optional)</div>
              <textarea
                value={editNote} onChange={e => setEditNote(e.target.value)}
                rows={3}
                placeholder="The why, the dream, the memory…"
                style={{
                  width: '100%', padding: '12px 14px',
                  background: T.bg, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
                  borderRadius: 12, outline: 'none', marginBottom: 22,
                  fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
                  color: T.ink, resize: 'vertical',
                }}
              />

              <div style={{ display: 'flex', gap: 12 }}>
                <StickerButton size="lg" style={{ flex: 1 }} onClick={() => setShowEdit(false)}>Cancel</StickerButton>
                <StickerButton color="ink" size="lg" type="submit" disabled={editLoading || !editTitle.trim()} style={{ flex: 2 }}>
                  {editLoading ? 'Saving…' : 'Save Changes'}
                </StickerButton>
              </div>
            </form>
          </Sticker>
        </div>
      )}
    </div>
  )
}
