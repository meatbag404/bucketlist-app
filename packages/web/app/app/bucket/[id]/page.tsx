'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_MONO, FONT_UI, STICKER_BORDER, STICKER_BORDER_SM, STICKER_SHADOW, STICKER_SHADOW_SM,
  Sticker, StickerButton, StickerChip, HighlightBlock, Avatar, AvatarStack, NavIcon,
  color as resolveColor,
  STICKER_COLOR_TOKENS, hashedColorToken, randomColorToken, itemColor, bucketColor, bucketColorToken,
  type StickerColorToken,
  Icon8, IconField, useIconPickerResume, useConfetti,
  targetCountdown, formatTargetDate,
} from '@bucketlist/shared'
import { LocationAutocomplete } from '../../../components/LocationAutocomplete'

// ── Per-bucket color from id hash so cards stay stable ────────
const CARD_COLORS = ['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const
function colorForBucket(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return CARD_COLORS[Math.abs(h) % CARD_COLORS.length]
}

const ITEM_EMOJIS = ['✨', '🎯', '🌍', '🎬', '📚', '🏔️', '🍕', '🎸', '🏋️', '🌊', '🎪', '🚀', '🦁', '🎨', '⛰️', '🎮']

// Known design-mockup icon-id → unicode emoji map (so legacy text values render)
const ICON_ID_TO_EMOJI: Record<string, string> = {
  pizza: '🍕', tent: '⛺', confetti: '🎉', globe: '🌍', plane: '✈️',
  suitcase: '🧳', camera: '📷', mountain: '🏔️', mountains: '🏔️',
  pastry: '🥐', coffee: '☕', croissant: '🥐', icecream: '🍦', cake: '🎂',
  donut: '🍩', burger: '🍔', wine: '🍷', bolt: '⚡', fire: '🔥', wave: '🌊',
  bike: '🚴', sun: '☀️', moon: '🌙', leaf: '🌿', flower: '🌸', drop: '💧',
  heart: '❤️', gift: '🎁', balloon: '🎈', music: '🎵', chat: '💬',
  star: '⭐', crown: '👑', diamond: '💎', trophy: '🏆', rainbow: '🌈',
  rocket: '🚀', lion: '🦁', art: '🎨', book: '📚', books: '📚', game: '🎮',
}

// Return a display-safe emoji. If value is a multi-letter ID string from the
// design library, map it to a unicode emoji. If it's any other text/empty
// value, fall back to the sparkle.
function safeEmoji(value?: string | null): string {
  if (!value) return '✨'
  const trimmed = String(value).trim()
  if (!trimmed) return '✨'
  // Real emoji are typically 1–4 visual units; their codepoints fall outside
  // basic latin range.
  if (/^[A-Za-z0-9_\- ]+$/.test(trimmed)) {
    const key = trimmed.toLowerCase().replace(/[\s_-]/g, '')
    return ICON_ID_TO_EMOJI[key] || '✨'
  }
  return trimmed
}

// ────────────────────────────────────────────────────────────────
// ItemRow
// ────────────────────────────────────────────────────────────────
function ItemRow({
  item, idx, uploadingFor, deleteConfirm,
  onAskMarkDone, onHeart, onStar, onPhotoSelect, onDelete, onEdit,
}: {
  item: any
  idx: number
  uploadingFor: string | null
  deleteConfirm: string | null
  onAskMarkDone: (item: any) => void
  onHeart: (id: string) => void
  onStar: (id: string) => void
  onPhotoSelect: (id: string, file: File) => void
  onDelete: (id: string) => void
  onEdit: (item: any) => void
}) {
  // More pronounced tilt — matches the angled feel from the mockup
  const tilt = idx % 4 === 0 ? -0.9 : idx % 4 === 1 ? 0.7 : idx % 4 === 2 ? -0.5 : 0.9
  const displayEmoji = safeEmoji(item.emoji)
  // Per-item color — explicit token if set, else deterministic hash from id
  const tileColor = itemColor(item)

  return (
    <Sticker tilt={tilt} radius={16} shadow="sm" style={{
      padding: '16px 16px 16px 26px',
      position: 'relative',
      opacity: item.done ? 0.7 : 1,
      overflow: 'hidden',
    }}>
      {/* Colored left band — uses item's color */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 12,
        background: tileColor,
        borderRight: '2px solid #0C0C0C',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
        {/* Icon tile — links to item detail (no mark-done from here) */}
        <Link
          href={`/app/item/${item.id}`}
          className="bk-sticker-btn emoji"
          title="View item details"
          style={{
            width: 56, height: 56, borderRadius: 12,
            background: item.done ? T.lime : tileColor,
            border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', lineHeight: 1, flexShrink: 0,
            transform: 'rotate(-3deg)',
            cursor: 'pointer', position: 'relative', textDecoration: 'none',
            padding: 0, color: T.ink,
          }}
        >
          {item.done ? (
            <NavIcon name="check" size={28} />
          ) : item.icon_id ? (
            <Icon8 id={item.icon_id} size={36} />
          ) : (
            <span style={{ display: 'inline-block' }}>{displayEmoji}</span>
          )}
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title — mixed case Geist, links to item detail */}
          <Link href={`/app/item/${item.id}`} style={{
            fontFamily: FONT_UI,
            fontSize: 16, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.3,
            textDecoration: item.done ? 'line-through' : 'none',
            color: T.ink, display: 'block', cursor: 'pointer',
          }}>{item.title}</Link>

          {/* Meta chips — date + location + tagged friend (compact, matches mockup) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {item.created_at && (
              <span style={{
                padding: '2px 8px', background: T.bg, border: '1.5px solid #0C0C0C', borderRadius: 6,
                fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>📅 {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
            {item.location && (
              <span style={{
                padding: '2px 8px', background: T.bg, border: '1.5px solid #0C0C0C', borderRadius: 6,
                fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>📍 {item.location}</span>
            )}
            {!item.done && (() => {
              const cd = targetCountdown(item.target_date)
              if (!cd) return null
              const bg = cd.tone === 'overdue' ? T.red
                : cd.tone === 'today' ? T.yellow
                : cd.tone === 'soon' ? T.yellow
                : T.lime
              const fg = cd.tone === 'overdue' ? '#fff' : T.ink
              return (
                <span style={{
                  padding: '2px 8px', background: bg, color: fg,
                  border: '1.5px solid #0C0C0C', borderRadius: 6,
                  fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>⏰ {cd.label}</span>
              )
            })()}
            {item.created_by_profile?.name && (
              <span style={{
                padding: '2px 8px', background: T.bg, border: '1.5px solid #0C0C0C', borderRadius: 6,
                fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>BY {item.created_by_profile.name.split(' ')[0]}</span>
            )}
          </div>

          {/* Memory note in item's color bg */}
          {item.memory_note && (
            <div style={{
              marginTop: 10, padding: '8px 12px',
              background: tileColor, border: '1.5px solid #0C0C0C', borderRadius: 8,
              fontSize: 13, fontWeight: 500, color: T.ink, lineHeight: 1.4,
            }}>"{item.memory_note}"</div>
          )}

          {/* Photos row */}
          {item.photos?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {item.photos.map((photo: any) => (
                <div key={photo.id} style={{
                  width: 64, height: 64, borderRadius: 8,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-photos/${photo.storage_path}`}
                    alt="item photo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right rail: small reaction badges only */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: '0 0 auto' }}>
          {item.starred && (
            <div style={{
              width: 26, height: 26, borderRadius: 99, background: T.yellow,
              border: '1.5px solid #0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Starred"><NavIcon name="star" size={14} /></div>
          )}
          {item.hearts > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', background: T.red, color: '#fff',
              border: '1.5px solid #0C0C0C', borderRadius: 99,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
            }} title="Hearts">
              <NavIcon name="heart" size={10} color="#fff" />
              {item.hearts}
            </div>
          )}
        </div>
      </div>

      {/* Action footer — Done / heart / star / photo / edit / delete; only on todo items */}
      {!item.done && (
        <div style={{
          display: 'flex', gap: 4, marginTop: 12, paddingTop: 12,
          borderTop: '1.5px dashed rgba(12,12,12,0.18)',
          justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap',
        }}>
          {/* Prominent ✓ DONE button — left-most so it reads first */}
          <button
            onClick={() => onAskMarkDone(item)}
            className="bk-sticker-btn"
            title="Mark this item as done"
            style={{
              padding: '4px 12px', height: 28, borderRadius: 8,
              background: T.lime, color: T.ink,
              border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
              cursor: 'pointer', marginRight: 'auto',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase' as const,
            }}
          >
            <NavIcon name="check" size={12} />
            <span>Mark Done</span>
          </button>
          <button
            onClick={() => onHeart(item.id)}
            className="bk-sticker-btn"
            title={item.hearted_by_me ? 'Unlike' : 'Like'}
            style={{
              padding: '4px 10px', height: 28, borderRadius: 8,
              background: item.hearted_by_me ? T.red : 'transparent',
              border: '1.5px solid ' + (item.hearted_by_me ? '#0C0C0C' : 'rgba(12,12,12,0.15)'),
              color: item.hearted_by_me ? '#fff' : T.inkMuted, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          >
            <NavIcon name="heart" size={12} color={item.hearted_by_me ? '#fff' : T.inkMuted} />
            <span>Like</span>
          </button>
          <button
            onClick={() => onStar(item.id)}
            className="bk-sticker-btn"
            title={item.starred ? 'Unstar' : 'Star'}
            style={{
              padding: '4px 10px', height: 28, borderRadius: 8,
              background: item.starred ? T.yellow : 'transparent',
              border: '1.5px solid ' + (item.starred ? '#0C0C0C' : 'rgba(12,12,12,0.15)'),
              color: T.ink, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          >
            <NavIcon name="star" size={12} />
            <span>Star</span>
          </button>
          <label className="bk-sticker-btn" style={{
            padding: '4px 10px', height: 28, borderRadius: 8,
            background: 'transparent',
            border: '1.5px solid rgba(12,12,12,0.15)',
            cursor: uploadingFor === item.id ? 'wait' : 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            color: T.inkMuted,
            fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
            textTransform: 'uppercase' as const,
          }} title={uploadingFor === item.id ? 'Uploading…' : 'Add photo'}>
            <NavIcon name="photo" size={12} color={T.inkMuted} />
            <span>{uploadingFor === item.id ? '…' : 'Photo'}</span>
            <input
              type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onPhotoSelect(item.id, file)
                e.target.value = ''
              }}
            />
          </label>
          <button
            onClick={() => onEdit(item)}
            className="bk-sticker-btn"
            title="Edit"
            style={{
              padding: '4px 10px', height: 28, borderRadius: 8,
              background: 'transparent',
              border: '1.5px solid rgba(12,12,12,0.15)',
              color: T.inkMuted, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          ><NavIcon name="pencil" size={12} color={T.inkMuted} /><span>Edit</span></button>
          <button
            onClick={() => onDelete(item.id)}
            className="bk-sticker-btn"
            title={deleteConfirm === item.id ? 'Click again to confirm delete' : 'Delete'}
            style={{
              padding: '4px 10px', height: 28, borderRadius: 8,
              background: deleteConfirm === item.id ? T.red : 'transparent',
              color: deleteConfirm === item.id ? '#fff' : T.inkMuted,
              border: '1.5px solid ' + (deleteConfirm === item.id ? '#0C0C0C' : 'rgba(12,12,12,0.15)'),
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          >
            {deleteConfirm === item.id ? <span>CONFIRM?</span> : (
              <>
                <NavIcon name="trash" size={12} color={deleteConfirm === item.id ? '#fff' : T.inkMuted} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Done items get a small Reopen + Delete row */}
      {item.done && (
        <div style={{
          display: 'flex', gap: 4, marginTop: 10, paddingTop: 10,
          borderTop: '1.5px dashed rgba(12,12,12,0.18)',
          justifyContent: 'flex-end', alignItems: 'center',
        }}>
          <button
            onClick={() => onAskMarkDone(item)}
            className="bk-sticker-btn"
            title="Reopen — move back to to-do"
            style={{
              padding: '4px 10px', height: 28, borderRadius: 8,
              background: 'transparent',
              border: '1.5px solid rgba(12,12,12,0.15)',
              color: T.inkMuted, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          ><span>↩</span><span>Reopen</span></button>
          <button
            onClick={() => onDelete(item.id)}
            className="bk-sticker-btn"
            title={deleteConfirm === item.id ? 'Click again to confirm delete' : 'Delete'}
            style={{
              padding: '4px 10px', height: 28, borderRadius: 8,
              background: deleteConfirm === item.id ? T.red : 'transparent',
              color: deleteConfirm === item.id ? '#fff' : T.inkMuted,
              border: '1.5px solid ' + (deleteConfirm === item.id ? '#0C0C0C' : 'rgba(12,12,12,0.15)'),
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          >
            {deleteConfirm === item.id ? <span>CONFIRM?</span> : (
              <>
                <NavIcon name="trash" size={12} color={deleteConfirm === item.id ? '#fff' : T.inkMuted} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      )}
    </Sticker>
  )
}

// ────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────
export default function BucketPage() {
  const params = useParams()
  const bucketId = params.id as string
  const router = useRouter()
  const vp = useViewport()

  const {
    items, profile, friends,
    getActiveBucket, setActiveBucketId, fetchItems,
    markItemDone, restoreItem, deleteItem,
    toggleHeart, toggleStar, uploadItemPhoto,
    renameBucket, addFriendToBucket, editItem,
  } = useStore()

  const [showAddItem, setShowAddItem] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const [title, setTitle] = useState('')
  const [itemEmoji, setItemEmoji] = useState('✨')
  const [itemIconId, setItemIconId] = useState<string | null>(null)
  const [itemColorToken, setItemColorToken] = useState<StickerColorToken | null>(null)
  const [itemLocation, setItemLocation] = useState('')
  const [itemTargetDate, setItemTargetDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [renameName, setRenameName] = useState('')
  const [renameEmoji, setRenameEmoji] = useState('')
  const [renameIconId, setRenameIconId] = useState<string | null>(null)
  const [renameColor, setRenameColor] = useState<StickerColorToken | null>(null)
  const [renameLoading, setRenameLoading] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteMsg, setInviteMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Inline edit-item modal state
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [editTitleValue, setEditTitleValue] = useState('')
  const [editEmojiValue, setEditEmojiValue] = useState('✨')
  const [editIconIdValue, setEditIconIdValue] = useState<string | null>(null)
  const [editColorValue, setEditColorValue] = useState<StickerColorToken | null>(null)
  const [editNoteValue, setEditNoteValue] = useState('')
  const [editLocationValue, setEditLocationValue] = useState('')
  const [editTargetDateValue, setEditTargetDateValue] = useState<string>('')
  const [editLoadingValue, setEditLoadingValue] = useState(false)

  // Picker resume handlers — one per modal
  const itemAddResume = useIconPickerResume<{
    title: string; emoji: string; iconId: string | null;
    colorToken: StickerColorToken | null; location: string;
  }>('item-add', (saved, pickedId) => {
    setTitle(saved.title); setItemEmoji(saved.emoji)
    setItemIconId(pickedId ?? saved.iconId)
    setItemColorToken(saved.colorToken)
    setItemLocation(saved.location)
    setShowAddItem(true)
  })
  const browseItemAddStickers = () => {
    const url = itemAddResume.stash({
      title, emoji: itemEmoji, iconId: itemIconId,
      colorToken: itemColorToken, location: itemLocation,
    })
    router.push(url)
  }

  const itemEditResume = useIconPickerResume<{
    itemId: string; title: string; emoji: string; iconId: string | null;
    colorToken: StickerColorToken | null; note: string; location: string;
  }>('item-edit-bucket', (saved, pickedId) => {
    // Restore the editing item from store/cache by id
    const target = items.find(i => i.id === saved.itemId)
    if (!target) return
    setEditingItem(target)
    setEditTitleValue(saved.title); setEditEmojiValue(saved.emoji)
    setEditIconIdValue(pickedId ?? saved.iconId)
    setEditColorValue(saved.colorToken)
    setEditNoteValue(saved.note); setEditLocationValue(saved.location)
  }, items.length > 0)  // gate consume until items are loaded so a returning pick can find its item
  const browseItemEditStickers = () => {
    if (!editingItem) return
    const url = itemEditResume.stash({
      itemId: editingItem.id,
      title: editTitleValue, emoji: editEmojiValue, iconId: editIconIdValue,
      colorToken: editColorValue, note: editNoteValue, location: editLocationValue,
    })
    router.push(url)
  }

  const renameResume = useIconPickerResume<{
    name: string; emoji: string; iconId: string | null;
    colorToken: StickerColorToken | null;
  }>('bucket-rename', (saved, pickedId) => {
    setRenameName(saved.name); setRenameEmoji(saved.emoji)
    setRenameIconId(pickedId ?? saved.iconId)
    setRenameColor(saved.colorToken)
    setShowRename(true)
  })
  const browseRenameStickers = () => {
    const url = renameResume.stash({
      name: renameName, emoji: renameEmoji, iconId: renameIconId, colorToken: renameColor,
    })
    router.push(url)
  }

  // Mark-done confirmation modal state
  const [markDoneConfirm, setMarkDoneConfirm] = useState<any | null>(null)

  // Confetti API — fires when an item is marked done
  const confetti = useConfetti()

  useEffect(() => { setActiveBucketId(bucketId) }, [bucketId, setActiveBucketId])

  const bucket = getActiveBucket()
  const todoItems = items.filter(i => !i.done)
  const doneItems = items.filter(i => i.done)
  const activeMembers = bucket?.members?.filter((m: any) => m.status === 'active') || []
  const memberProfiles = activeMembers.map((m: any) => m.profiles)
  const memberUserIds = new Set(bucket?.members?.map((m: any) => m.user_id) || [])
  const invitableFriends = friends.filter(f => !memberUserIds.has(f.id))

  if (!bucket) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
          <p style={{ fontFamily: FONT_DISPLAY, color: T.inkMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Loading bucket…</p>
        </div>
      </div>
    )
  }

  const bgColorToken = bucketColorToken(bucket)
  const bgColor = bucketColor(bucket)

  // Handlers
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !bucket || loading) return
    setLoading(true)
    try {
      const chosenColor = itemColorToken || randomColorToken()
      const insertPayload: any = {
        bucket_id: bucketId,
        title: title.trim(),
        emoji: itemEmoji,
        color_token: chosenColor,
        location: itemLocation.trim() || null,
        target_date: itemTargetDate || null,
        created_by: profile.id,
        sort_order: (todoItems.length + 1) * 1000,
      }
      if (itemIconId) insertPayload.icon_id = itemIconId
      const { error } = await supabase.from('items').insert(insertPayload)
      if (error) {
        // If a column doesn't exist yet (migration pending), retry without it
        const colMatch = error.message.match(/column "?([a-z_]+)"? .*does not exist|Could not find the '?([a-z_]+)'? column/i)
        const missing = colMatch?.[1] || colMatch?.[2]
        if (missing && Object.prototype.hasOwnProperty.call(insertPayload, missing)) {
          delete insertPayload[missing]
          const retry = await supabase.from('items').insert(insertPayload)
          if (retry.error) throw retry.error
        } else {
          throw error
        }
      }
      // Close modal + reset form IMMEDIATELY so it doesn't feel stuck
      setTitle('')
      setItemEmoji('✨')
      setItemIconId(null)
      setItemColorToken(null)
      setItemLocation('')
      setItemTargetDate('')
      setShowAddItem(false)
      setLoading(false)
      // Refresh in background — don't block the UI
      fetchItems(bucketId).catch((err) => console.error('fetchItems after add:', err))
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  // When opening the Add modal, pre-seed a random color so the icon preview pops
  const openAddItem = () => {
    setItemColorToken(randomColorToken())
    setShowAddItem(true)
  }

  const handlePhotoUpload = async (itemId: string, file: File) => {
    setUploadingFor(itemId)
    try {
      const blobUrl = URL.createObjectURL(file)
      await uploadItemPhoto(itemId, blobUrl)
      URL.revokeObjectURL(blobUrl)
    } catch (e: any) {
      alert('Photo upload failed: ' + e.message)
    } finally { setUploadingFor(null) }
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setEditTitleValue(item.title || '')
    setEditEmojiValue(item.emoji || '✨')
    setEditIconIdValue(item.icon_id ?? null)
    setEditColorValue(
      (item.color_token && (STICKER_COLOR_TOKENS as readonly string[]).includes(item.color_token))
        ? (item.color_token as StickerColorToken)
        : hashedColorToken(item.id)
    )
    setEditNoteValue(item.memory_note || '')
    setEditLocationValue(item.location || '')
    setEditTargetDateValue(item.target_date || '')
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem || !editTitleValue.trim() || editLoadingValue) return
    setEditLoadingValue(true)
    try {
      await editItem(editingItem.id, {
        title: editTitleValue.trim(),
        color_token: editColorValue,
        location: editLocationValue.trim() || null,
        target_date: editTargetDateValue || null,
        emoji: editEmojiValue,
        icon_id: editIconIdValue,
        memory_note: editNoteValue.trim() || null,
      })
      setEditingItem(null)
      setEditLoadingValue(false)
    } catch (err: any) {
      alert(err.message)
      setEditLoadingValue(false)
    }
  }

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bucket) return
    setRenameLoading(true)
    const err = await renameBucket(
      bucket.id,
      renameName.trim() || bucket.name,
      renameEmoji || bucket.emoji,
      renameColor,
      renameIconId,
    )
    setRenameLoading(false)
    if (err) alert(err); else setShowRename(false)
  }

  const handleInvite = async (friendId: string) => {
    if (!bucket) return
    setInviteLoading(true); setInviteMsg(null)
    const err = await addFriendToBucket(friendId, bucket.id)
    setInviteLoading(false)
    if (err) setInviteMsg({ type: 'err', text: err })
    else setInviteMsg({ type: 'ok', text: 'Invited!' })
  }

  const handleDeleteItem = async (itemId: string) => {
    if (deleteConfirm !== itemId) { setDeleteConfirm(itemId); return }
    await deleteItem(itemId)
    setDeleteConfirm(null)
  }

  const askMarkDone = (item: any) => {
    if (item.done) {
      // Restoring doesn't need a confirmation
      restoreItem(item.id)
    } else {
      setMarkDoneConfirm(item)
    }
  }

  const confirmMarkDone = () => {
    if (markDoneConfirm) {
      markItemDone(markDoneConfirm.id)
      setMarkDoneConfirm(null)
      confetti.fire()
    }
  }

  return (
    <div>
      {/* Back nav */}
      <button onClick={() => router.push('/app')} className="bk-sticker-btn" style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        color: T.inkMuted, textTransform: 'uppercase', padding: 0, marginBottom: 18,
      }}>‹ ALL BUCKETS</button>

      {/* Hero card */}
      <Sticker color={bgColorToken} radius={20} shadow="lg" style={{
        padding: vp === 'mobile' ? 22 : 32, marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: vp === 'desktop' ? 'row' : 'column',
          alignItems: vp === 'desktop' ? 'flex-end' : 'flex-start',
          gap: vp === 'mobile' ? 18 : 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 0 }}>
            {/* Icon in tilted sticker frame */}
            <div className="emoji" style={{
              width: vp === 'mobile' ? 64 : 84, height: vp === 'mobile' ? 64 : 84,
              borderRadius: 14,
              background: T.surface,
              border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: vp === 'mobile' ? '2.2rem' : '2.8rem', lineHeight: 1,
              transform: 'rotate(-4deg)',
              flex: '0 0 auto',
            }}>
              {(bucket as any).icon_id
                ? <Icon8 id={(bucket as any).icon_id} size={vp === 'mobile' ? 44 : 60} />
                : (bucket.emoji || '🪣')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
                textTransform: 'uppercase', color: T.ink, opacity: 0.7, marginBottom: 6,
              }}>
                {activeMembers.length} KEEPER{activeMembers.length !== 1 ? 'S' : ''}
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY,
                fontSize: vp === 'mobile' ? 32 : vp === 'tablet' ? 44 : 56,
                fontWeight: 700, letterSpacing: -1.5, lineHeight: 0.96,
                textTransform: 'uppercase',
                color: T.ink,
              }}>{bucket.name}</div>
              {activeMembers.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <AvatarStack profiles={memberProfiles} size={32} ring={bgColor} max={5} />
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
                    color: T.ink, opacity: 0.7,
                  }}>
                    {memberProfiles.map((p: any) => p?.name?.split(' ')[0]).filter(Boolean).slice(0, 3).join(' · ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress card */}
          <Sticker radius={16} shadow="sm" border="sm" style={{
            width: vp === 'desktop' ? 280 : '100%',
            padding: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted }}>PROGRESS</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>
                {doneItems.length}<span style={{ opacity: 0.4 }}>/{items.length}</span>
              </div>
            </div>
            <div style={{ height: 16, borderRadius: 99, background: T.bg, border: STICKER_BORDER_SM, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: items.length === 0 ? '0%' : `${Math.round((doneItems.length / items.length) * 100)}%`,
                height: '100%',
                background: T.lime,
                borderRight: doneItems.length > 0 && doneItems.length < items.length ? '2px solid #0C0C0C' : 'none',
              }} />
            </div>
          </Sticker>
        </div>
      </Sticker>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        <StickerButton onClick={() => { setRenameName(bucket.name); setRenameEmoji(bucket.emoji); setRenameIconId((bucket as any).icon_id ?? null); setRenameColor(bucketColorToken(bucket)); setShowRename(true) }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <NavIcon name="pencil" size={14} /> Edit
          </span>
        </StickerButton>
        {invitableFriends.length > 0 && (
          <StickerButton color="lime" onClick={() => setShowInvite(true)}>
            ＋ Invite
          </StickerButton>
        )}
        <div style={{ flex: 1 }} />
        <StickerButton color="ink" size="md" onClick={openAddItem}>＋ Add Item</StickerButton>
      </div>

      {/* Empty state — bucket has no items at all */}
      {items.length === 0 && (
        <Sticker radius={18} style={{ padding: vp === 'mobile' ? 36 : 48, textAlign: 'center', marginBottom: 28 }}>
          <div className="emoji" style={{ fontSize: '2.8rem', marginBottom: 14 }}>✨</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 22 : 28,
            fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', marginBottom: 10,
          }}>
            Nothing in here yet
          </div>
          <p style={{ color: T.inkMuted, fontWeight: 500, lineHeight: 1.5, marginBottom: 20, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Add the first thing you want to tick off — a trip, a meal, a goal,
            an inside joke. Big or tiny, doesn't matter.
          </p>
          <StickerButton color="ink" size="lg" onClick={openAddItem}>＋ ADD FIRST ITEM</StickerButton>
        </Sticker>
      )}

      {/* Todo section */}
      {todoItems.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <HighlightBlock color="ink" tilt={-1} size="sm">
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff', textTransform: 'uppercase' }}>· TO DO · {todoItems.length} ·</span>
            </HighlightBlock>
            <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
          </div>
          <div style={{
            display: 'grid', gap: vp === 'mobile' ? 12 : 16,
            gridTemplateColumns: vp === 'desktop' ? '1fr 1fr' : '1fr',
          }}>
            {todoItems.map((item, i) => (
              <ItemRow
                key={item.id} item={item} idx={i}
                uploadingFor={uploadingFor} deleteConfirm={deleteConfirm}
                onAskMarkDone={askMarkDone}
                onHeart={toggleHeart} onStar={toggleStar}
                onPhotoSelect={handlePhotoUpload}
                onDelete={handleDeleteItem}
                onEdit={openEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Done section */}
      {doneItems.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '32px 0 14px' }}>
            <HighlightBlock color="lime" tilt={-1} size="sm">
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: T.ink, textTransform: 'uppercase' }}>· DONE · {doneItems.length} ·</span>
            </HighlightBlock>
            <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
          </div>
          <div style={{
            display: 'grid', gap: vp === 'mobile' ? 12 : 16,
            gridTemplateColumns: vp === 'desktop' ? '1fr 1fr' : '1fr',
          }}>
            {doneItems.map((item, i) => (
              <ItemRow
                key={item.id} item={item} idx={i}
                uploadingFor={uploadingFor} deleteConfirm={deleteConfirm}
                onAskMarkDone={askMarkDone}
                onHeart={toggleHeart} onStar={toggleStar}
                onPhotoSelect={handlePhotoUpload}
                onDelete={handleDeleteItem}
                onEdit={openEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <Sticker radius={18} style={{ padding: 48, textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2.5rem', marginBottom: 14 }}>✨</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', marginBottom: 8 }}>No items yet</div>
          <p style={{ color: T.inkMuted, marginBottom: 22, fontWeight: 500 }}>Add your first bucket list item!</p>
          <StickerButton color="ink" size="lg" onClick={openAddItem}>＋ Add Item</StickerButton>
        </Sticker>
      )}

      {/* ─── Mark Done Confirmation Modal ─── */}
      {markDoneConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setMarkDoneConfirm(null) }}
        >
          <Sticker radius={18} shadow="lg" style={{ background: '#fff', padding: 28, maxWidth: 420, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div className="emoji" style={{
                width: 56, height: 56, borderRadius: 12,
                background: T.lime, border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', lineHeight: 1, flexShrink: 0,
                transform: 'rotate(-3deg)',
              }}>{safeEmoji(markDoneConfirm.emoji)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase', lineHeight: 1.1 }}>
                  Mark Done?
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: T.inkMuted, textTransform: 'uppercase', marginTop: 4 }}>
                  TICK THIS OFF THE LIST
                </div>
              </div>
            </div>
            <p style={{ fontFamily: FONT_UI, fontSize: 14, color: T.ink, fontWeight: 500, marginBottom: 22, lineHeight: 1.5 }}>
              Mark <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, textTransform: 'uppercase' }}>"{markDoneConfirm.title}"</span> as done? It'll move to your completed list and show up on your memories wall.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <StickerButton size="lg" style={{ flex: 1 }} onClick={() => setMarkDoneConfirm(null)}>Cancel</StickerButton>
              <StickerButton color="lime" size="lg" style={{ flex: 2 }} onClick={confirmMarkDone}>
                ✓ MARK DONE
              </StickerButton>
            </div>
          </Sticker>
        </div>
      )}

      {/* ─── Inline Edit Item Modal ─── */}
      {editingItem && (
        <Modal onClose={() => setEditingItem(null)} title="Edit Item">
          <form onSubmit={saveEdit}>
            <FieldLabel>Title</FieldLabel>
            <input
              type="text" value={editTitleValue} onChange={e => setEditTitleValue(e.target.value)}
              required autoFocus className="input"
              style={{ fontFamily: FONT_DISPLAY, textTransform: 'uppercase' as const, fontWeight: 700, fontSize: 16, marginBottom: 18 }}
            />
            <IconField
              iconId={editIconIdValue}
              emoji={editEmojiValue}
              onBrowse={browseItemEditStickers}
              onClearIcon={() => setEditIconIdValue(null)}
            />
            <FieldLabel>Color</FieldLabel>
            <ColorPickerRow
              value={editColorValue}
              onChange={setEditColorValue}
              previewEmoji={editEmojiValue}
              previewIconId={editIconIdValue}
              hideShuffle
            />
            <FieldLabel>Location (optional)</FieldLabel>
            <div style={{ marginBottom: 18 }}>
              <LocationAutocomplete
                value={editLocationValue}
                onChange={setEditLocationValue}
                placeholder="e.g., Tokyo, Japan"
              />
            </div>
            <FieldLabel>Target Date (optional)</FieldLabel>
            <TargetDateInput
              value={editTargetDateValue}
              onChange={setEditTargetDateValue}
            />
            <FieldLabel>Memory Note (optional)</FieldLabel>
            <textarea
              value={editNoteValue} onChange={e => setEditNoteValue(e.target.value)}
              rows={3}
              placeholder="The why, the dream, the memory…"
              style={{
                width: '100%', padding: '12px 14px',
                background: T.bg, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
                borderRadius: 12, outline: 'none', marginBottom: 22,
                fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
                color: T.ink, resize: 'vertical' as const,
              }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <StickerButton size="lg" style={{ flex: 1 }} onClick={() => setEditingItem(null)}>Cancel</StickerButton>
              <StickerButton color="ink" size="lg" type="submit" disabled={editLoadingValue || !editTitleValue.trim()} style={{ flex: 2 }}>
                {editLoadingValue ? 'Saving…' : 'Save Changes'}
              </StickerButton>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── Add Item Modal ─── */}
      {showAddItem && (
        <Modal onClose={() => setShowAddItem(false)} title="Add Item">
          <form onSubmit={handleAddItem}>
            <FieldLabel>Title</FieldLabel>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Visit Paris" required autoFocus
              className="input"
              style={{ fontFamily: FONT_DISPLAY, textTransform: 'uppercase' as const, fontWeight: 700, fontSize: 16, marginBottom: 18 }}
            />
            <IconField
              iconId={itemIconId}
              emoji={itemEmoji}
              onBrowse={browseItemAddStickers}
              onClearIcon={() => setItemIconId(null)}
            />
            <FieldLabel>Color</FieldLabel>
            <ColorPickerRow
              value={itemColorToken}
              onChange={setItemColorToken}
              previewEmoji={itemEmoji}
              previewIconId={itemIconId}
              hideShuffle
            />
            <FieldLabel>Location (optional)</FieldLabel>
            <div style={{ marginBottom: 18 }}>
              <LocationAutocomplete
                value={itemLocation}
                onChange={setItemLocation}
                placeholder="e.g., Tokyo, Japan"
              />
            </div>
            <FieldLabel>Target Date (optional)</FieldLabel>
            <TargetDateInput
              value={itemTargetDate}
              onChange={setItemTargetDate}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <StickerButton size="lg" style={{ flex: 1 }} onClick={() => setShowAddItem(false)}>Cancel</StickerButton>
              <StickerButton color="ink" size="lg" type="submit" disabled={loading || !title.trim()} style={{ flex: 2 }}>
                {loading ? 'Adding…' : 'Add Item'}
              </StickerButton>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── Rename Modal ─── */}
      {showRename && (
        <Modal onClose={() => setShowRename(false)} title="Edit Bucket">
          <form onSubmit={handleRename}>
            <FieldLabel>Name</FieldLabel>
            <input
              type="text" value={renameName} onChange={e => setRenameName(e.target.value)}
              required className="input"
              style={{ fontFamily: FONT_DISPLAY, textTransform: 'uppercase' as const, fontWeight: 700, fontSize: 16, marginBottom: 18 }}
            />
            {/* BUCKET COLOR moved above ICON (per request) — unrelated to the icon */}
            <FieldLabel>Bucket Color</FieldLabel>
            <ColorPickerRow
              value={renameColor}
              onChange={setRenameColor}
              hidePreview
              hideShuffle
            />
            <IconField
              iconId={renameIconId}
              emoji={renameEmoji}
              onBrowse={browseRenameStickers}
              onClearIcon={() => setRenameIconId(null)}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <StickerButton size="lg" style={{ flex: 1 }} onClick={() => setShowRename(false)}>Cancel</StickerButton>
              <StickerButton color="ink" size="lg" type="submit" disabled={renameLoading} style={{ flex: 2 }}>
                {renameLoading ? 'Saving…' : 'Save Changes'}
              </StickerButton>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── Invite Modal ─── */}
      {showInvite && (
        <Modal onClose={() => { setShowInvite(false); setInviteMsg(null) }} title="Invite Friends">
          {inviteMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 14,
              background: inviteMsg.type === 'ok' ? '#EDFCE7' : '#FAECE7',
              border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            }}>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: T.ink }}>{inviteMsg.text}</p>
            </div>
          )}
          {invitableFriends.length === 0 ? (
            <p style={{ color: T.inkMuted, fontWeight: 600 }}>All your friends are already in this bucket!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {invitableFriends.map(friend => (
                <div key={friend.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar p={friend} size={38} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: -0.3 }}>{friend.name}</p>
                    <p style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: T.inkMuted }}>@{friend.handle}</p>
                  </div>
                  <StickerButton color="lime" size="sm" onClick={() => handleInvite(friend.id)} disabled={inviteLoading}>
                    Invite
                  </StickerButton>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

// ── Modal + label helpers ────────────────────────────────────────
function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <Sticker radius={18} shadow="lg" style={{ background: '#fff', padding: 28, maxWidth: 460, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.8, textTransform: 'uppercase' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: T.inkMuted }}>✕</button>
        </div>
        {children}
      </Sticker>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
      color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
    }}>{children}</div>
  )
}

// Native <input type="date"> wrapped in the sticker style + a CLEAR button
// when a date is set. Value is YYYY-MM-DD (matches Supabase `date` columns).
function TargetDateInput({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  const countdown = targetCountdown(value)
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input"
          style={{
            flex: 1, fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
            colorScheme: 'light',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="bk-sticker-btn"
            style={{
              padding: '6px 12px', borderRadius: 10,
              background: T.surface,
              border: STICKER_BORDER_SM,
              fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase', cursor: 'pointer', color: T.ink,
            }}
          >CLEAR</button>
        )}
      </div>
      {countdown && (
        <div style={{
          marginTop: 6,
          fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
          color: countdown.tone === 'overdue' ? T.red
            : countdown.tone === 'today' ? T.ink
            : T.inkMuted,
          textTransform: 'uppercase',
        }}>
          {countdown.label} · {formatTargetDate(value)}
        </div>
      )}
    </div>
  )
}

// Color picker — six brand tokens + a random-shuffle button
function ColorPickerRow({
  value, onChange, onRandomize, previewEmoji, previewIconId,
  hidePreview, hideShuffle,
}: {
  value: StickerColorToken | null
  onChange: (c: StickerColorToken) => void
  onRandomize?: () => void
  previewEmoji?: string
  /** When set, the preview tile renders the Icons8 sticker instead of the emoji. */
  previewIconId?: string | null
  /** Hide the tilted preview tile (the bucket-color section is unrelated to the item icon). */
  hidePreview?: boolean
  /** Hide the 🎲 Shuffle button. */
  hideShuffle?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
      {/* Tilted preview tile so the user sees what their pick will look like */}
      {!hidePreview && (
        <div className="emoji" style={{
          width: 48, height: 48, borderRadius: 12,
          background: value ? T[value] : T.surface,
          border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', lineHeight: 1,
          transform: 'rotate(-3deg)', flex: '0 0 auto',
        }}>
          {previewIconId
            ? <Icon8 id={previewIconId} size={32} />
            : (previewEmoji || '✨')}
        </div>
      )}

      {/* Six brand color chips */}
      <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
        {STICKER_COLOR_TOKENS.map((c) => {
          const on = value === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className="bk-sticker-btn"
              title={c}
              aria-label={`Color ${c}`}
              style={{
                width: 32, height: 32, borderRadius: 10,
                background: T[c],
                border: on ? '2.5px solid #0C0C0C' : '2px solid rgba(12,12,12,0.18)',
                boxShadow: on ? STICKER_SHADOW_SM : 'none',
                transform: on ? 'rotate(-2deg)' : 'rotate(0deg)',
                cursor: 'pointer', padding: 0,
              }}
            />
          )
        })}
      </div>

      {/* Random shuffle */}
      {!hideShuffle && onRandomize && (
        <button
          type="button"
          onClick={onRandomize}
          className="bk-sticker-btn"
          title="Randomize color"
          style={{
            padding: '6px 12px', borderRadius: 10,
            background: T.bg,
            border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            textTransform: 'uppercase', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 5, color: T.ink,
          }}
        >🎲 Shuffle</button>
      )}
    </div>
  )
}
