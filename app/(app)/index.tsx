/**
 * Bucket screen — Bold sticker design.
 * Home view shows all buckets as sticker posters.
 * Bucket view shows items as sticker cards.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl, Modal, ActivityIndicator,
  Image, ScrollView, Animated, Alert, Dimensions,
} from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useStore, useFilteredItems } from '../../src/store'
import { supabase } from '../../src/lib/supabase'
import { ItemWithDetails } from '../../src/types/database'
import { LocationPicker } from '../../src/components/LocationPicker'
import { Sticker, StickerButton, StickerChip, AvatarStack } from '../../src/components/StickerPrimitives'
import { sticker, getCatColor, BUCKET_COLORS, BUCKET_COLOR_LABELS, resolveColor } from '../../src/design/sticker'
import { STICKER_LIBRARY, StickerEntry } from '../../src/data/stickerLibrary'
import { StickerIcon } from '../../src/components/StickerIcon'
import IconPickerScreen from './icon-picker'

const SCREEN_W = Dimensions.get('window').width

// In-memory bucket color overrides (user-customizable)
let _bucketColors: Record<string, string> = {}
function getBucketColor(bucketId: string, index: number): string {
  return _bucketColors[bucketId] ?? BUCKET_COLORS[index % BUCKET_COLORS.length]
}
function setBucketColorLocal(bucketId: string, color: string) {
  _bucketColors = { ..._bucketColors, [bucketId]: color }
}

// Per-item sticker frame color overrides
let _itemStickerColors: Record<string, string> = {}
function getItemStickerColor(itemId: string, catKey: string): string {
  return _itemStickerColors[itemId] ?? getCatColor(catKey)
}
function setItemStickerColor(itemId: string, color: string) {
  _itemStickerColors = { ..._itemStickerColors, [itemId]: color }
}

// Category config
const CATS = [
  { key: 'travel',    label: 'TRAVEL',    color: sticker.yellow },
  { key: 'food',      label: 'FOOD',      color: sticker.pink   },
  { key: 'adventure', label: 'ADVENTURE', color: sticker.blue, textColor: '#fff' },
  { key: 'wellness',  label: 'WELLNESS',  color: sticker.lime   },
  { key: 'culture',   label: 'CULTURE',   color: sticker.cyan   },
]

function getCatConfig(key: string) {
  return CATS.find(c => c.key === key) ?? { key, label: key.toUpperCase(), color: sticker.cyan }
}

// ── Photo thumbnail ────────────────────────────────────────────
function PhotoThumb({ storagePath, onPress }: { storagePath: string; onPress?: (uri: string) => void }) {
  const [uri, setUri] = useState<string | null>(null)

  useEffect(() => {
    supabase.storage.from('item-photos').createSignedUrl(storagePath, 3600)
      .then(({ data }) => { if (data?.signedUrl) setUri(data.signedUrl) })
  }, [storagePath])

  if (!uri) return <View style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' }} />
  return (
    <TouchableOpacity onPress={() => onPress?.(uri)} activeOpacity={0.85}>
      <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 8 }} resizeMode="cover" />
    </TouchableOpacity>
  )
}

// ── Photo viewer ───────────────────────────────────────────────
function PhotoViewer({ uri, onClose }: { uri: string | null; onClose: () => void }) {
  if (!uri) return null
  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.photoViewerOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
        <Image source={{ uri }} style={styles.photoViewerImage} resizeMode="contain" />
        <TouchableOpacity style={styles.photoViewerClose} onPress={onClose}>
          <Text style={styles.photoViewerCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

// ── Celebration overlay ────────────────────────────────────────
function CelebrationOverlay({ item }: { item: { emoji: string; title: string } | null }) {
  const anim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (item) {
      anim.setValue(0)
      Animated.spring(anim, { toValue: 1, useNativeDriver: false, damping: 12, stiffness: 180 }).start()
    }
  }, [item?.title])
  if (!item) return null
  return (
    <Animated.View pointerEvents="none" style={[
      styles.celebration,
      { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] },
    ]}>
      <StickerIcon value={item.emoji} size={56} />
      <Text style={styles.celebDone}>Done! 🎉</Text>
      <Text style={styles.celebTitle} numberOfLines={2}>{item.title}</Text>
    </Animated.View>
  )
}

// ── Sticker item card ──────────────────────────────────────────
function ItemStickerCard({ item, onPress, onDragStart }: {
  item: ItemWithDetails
  onPress: () => void
  onDragStart?: () => void
}) {
  const { toggleHeart, toggleStar } = useStore()
  const color = getItemStickerColor(item.id, item.category_key)
  const tilts = [0, -0.8, 0.8]
  const tilt = tilts[item.id.charCodeAt(0) % 3]

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.itemCardWrapper, { opacity: item.done ? 0.6 : 1 }]}
    >
      {/* Hard shadow */}
      <View style={[styles.itemCardShadow, { transform: [{ rotate: `${tilt}deg` }] }]} />
      <View style={[
        styles.itemCard,
        { transform: [{ rotate: `${tilt}deg` }] },
      ]}>
        {/* Left color strip */}
        <View style={[styles.colorStrip, { backgroundColor: color }]} />

        <View style={styles.itemCardInner}>
          {onDragStart && (
            <TouchableOpacity
              onPressIn={onDragStart}
              style={styles.dragHandle}
              hitSlop={{ top: 10, bottom: 10, left: 4, right: 8 }}
            >
              <Text style={styles.dragHandleText}>⠿</Text>
            </TouchableOpacity>
          )}

          {/* Icon block */}
          <View style={[styles.itemIcon, { backgroundColor: color }]}>
            <StickerIcon value={item.emoji} size={26} />
          </View>

          {/* Content */}
          <View style={styles.itemContent}>
            <Text style={[
              styles.itemTitle,
              item.done && { textDecorationLine: 'line-through', opacity: 0.6 },
            ]}>
              {item.done ? '✓ ' : ''}{item.title}
            </Text>

            {/* Badges */}
            <View style={styles.itemBadges}>
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{item.category_key.toUpperCase()}</Text>
              </View>
              {item.target_date ? (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>📅 {item.target_date}</Text>
                </View>
              ) : null}
              {item.location ? (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>📍 {item.location}</Text>
                </View>
              ) : null}
            </View>

            {item.memory_note ? (
              <View style={[styles.memoryQuote, { backgroundColor: color }]}>
                <Text style={styles.memoryQuoteText} numberOfLines={2}>
                  "{item.memory_note}"
                </Text>
              </View>
            ) : null}
          </View>

          {/* Right side */}
          <View style={styles.itemRight}>
            {item.starred && (
              <TouchableOpacity onPress={() => toggleStar(item.id)} style={[styles.starDot, { backgroundColor: sticker.yellow }]}>
                <Text style={{ fontSize: 12 }}>★</Text>
              </TouchableOpacity>
            )}
            {!item.starred && (
              <TouchableOpacity onPress={() => toggleStar(item.id)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Text style={{ fontSize: 14, color: sticker.inkMuted }}>☆</Text>
              </TouchableOpacity>
            )}
            {item.hearts > 0 && (
              <TouchableOpacity
                onPress={() => toggleHeart(item.id)}
                style={[styles.heartPill, { backgroundColor: item.hearted_by_me ? sticker.red : sticker.surface }]}
              >
                <Text style={[styles.heartPillText, { color: item.hearted_by_me ? '#fff' : sticker.ink }]}>
                  ♥ {item.hearts}
                </Text>
              </TouchableOpacity>
            )}
            {item.hearts === 0 && (
              <TouchableOpacity onPress={() => toggleHeart(item.id)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Text style={{ fontSize: 12, color: sticker.inkMuted }}>♡</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ── Swipeable item ─────────────────────────────────────────────
function SwipeableItem({
  item, isDoneSection, onPress, onDone, onRestore, onDelete,
  expanded, onDragStart, isActive,
}: {
  item: ItemWithDetails; isDoneSection?: boolean; onPress: () => void
  onDone: () => void; onRestore: () => void; onDelete: () => void
  expanded: boolean; onDragStart?: () => void; isActive?: boolean
}) {
  const swipeRef = useRef<Swipeable>(null)

  return (
    <View style={isDoneSection ? { opacity: 0.75 } : undefined}>
      <Swipeable
        ref={swipeRef}
        enabled={!expanded && !isActive}
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.swipeRight}
            onPress={() => { swipeRef.current?.close(); if (item.done) onRestore(); else onDone() }}
          >
            <Text style={styles.swipeRightText}>{item.done ? '↩' : '✓'}</Text>
            <Text style={styles.swipeRightLabel}>{item.done ? 'Restore' : 'Done'}</Text>
          </TouchableOpacity>
        )}
        renderLeftActions={() => (
          <TouchableOpacity
            style={styles.swipeLeft}
            onPress={() => { swipeRef.current?.close(); onDelete() }}
          >
            <Text style={styles.swipeLeftText}>🗑️</Text>
            <Text style={styles.swipeLeftLabel}>Delete</Text>
          </TouchableOpacity>
        )}
        overshootRight={false}
        overshootLeft={false}
        friction={2}
      >
        <ItemStickerCard item={item} onPress={onPress} onDragStart={onDragStart} />
      </Swipeable>
    </View>
  )
}

// ── Bucket poster card (home view) ─────────────────────────────
function BucketPoster({ bucket, color, tilt, onPress }: {
  bucket: any; color: string; tilt: number; onPress: () => void
}) {
  const allItems = (bucket as any)._items ?? []
  const done = allItems.filter((i: any) => i.done).length
  const total = allItems.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      {/* Shadow */}
      <View style={[styles.bucketPosterShadow, { borderRadius: 18, transform: [{ rotate: `${tilt}deg` }] }]} />
      <View style={[
        styles.bucketPoster,
        { backgroundColor: color, transform: [{ rotate: `${tilt}deg` }] },
      ]}>
        {/* Header row */}
        <View style={styles.posterHeader}>
          <View style={[styles.posterEmojiBox, { backgroundColor: sticker.bg }]}>
            <StickerIcon value={bucket.emoji} size={30} />
          </View>
          <View style={[styles.posterPill, { backgroundColor: sticker.ink }]}>
            <Text style={styles.posterPillText}>{pct === 0 ? 'NEW' : `${pct}%`}</Text>
          </View>
        </View>

        <Text style={styles.posterName} numberOfLines={2}>{bucket.name.toUpperCase()}</Text>

        {/* Footer */}
        <View style={styles.posterFooter}>
          <AvatarStack
            members={(bucket.members || []).map((m: any) => ({ profiles: m.profile ?? m.profiles }))}
            size={26}
            ringColor={color}
          />
          <Text style={styles.posterCount}>{done}/{total}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ── Item detail (expanded inline) ─────────────────────────────
function ItemDetail({
  item, onClose, uploadPhoto, onOpenFull, onDone,
}: {
  item: ItemWithDetails; onClose: () => void
  uploadPhoto: (uri: string) => Promise<void>
  onOpenFull: () => void; onDone?: () => void
}) {
  const { markItemDone, restoreItem, addComment, editItem } = useStore()
  const [comment, setComment] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState(item.title)
  const [editDesc, setEditDesc] = useState(item.memory_note ?? '')
  const [editDate, setEditDate] = useState(item.target_date ?? '')
  const [editLocation, setEditLocation] = useState(item.location ?? '')
  const [showEditLocationPicker, setShowEditLocationPicker] = useState(false)
  const [editCat, setEditCat] = useState(item.category_key)
  const [editEmoji, setEditEmoji] = useState(item.emoji)
  const [editItemColor, setEditItemColor] = useState(() => getItemStickerColor(item.id, item.category_key))
  const [saving, setSaving] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  async function submitComment() {
    if (!comment.trim()) return
    await addComment(item.id, comment)
    setComment('')
  }

  async function launchPicker(useCamera: boolean) {
    try {
      const opts = { mediaTypes: ['images'] as any, quality: 0.85 as any, allowsEditing: true, aspect: [4, 3] as any }
      const result = useCamera
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts)
      if (!result.canceled && result.assets[0]) {
        setUploading(true)
        await uploadPhoto(result.assets[0].uri)
        setUploading(false)
      }
    } catch (e) { setUploading(false) }
  }

  function pickPhoto() {
    Alert.alert('Add photo', undefined, [
      { text: '📷 Take a photo', onPress: () => launchPicker(true) },
      { text: '🖼️ Choose from library', onPress: () => launchPicker(false) },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  async function saveEdits() {
    if (!editTitle.trim()) return
    setSaving(true)
    setItemStickerColor(item.id, editItemColor)
    await editItem(item.id, {
      title: editTitle.trim(),
      memory_note: editDesc.trim() || undefined,
      target_date: editDate.trim() || undefined,
      location: editLocation.trim() || undefined,
      category_key: editCat,
      emoji: editEmoji,
    })
    setSaving(false)
    setEditing(false)
  }

  const color = getItemStickerColor(item.id, item.category_key)

  if (editing) {
    return (
      <View style={[styles.detail, { borderTopColor: editItemColor, borderTopWidth: 3 }]}>
        {showIconPicker && (
          <Modal visible animationType="slide">
            <IconPickerScreen
              initial={{ e: editEmoji, c: 'yellow' }}
              onPick={(s) => {
                setEditEmoji(s.e)
                const resolved = resolveColor(s.c)
                setEditItemColor(resolved)
              }}
              onClose={() => setShowIconPicker(false)}
            />
          </Modal>
        )}
        <Text style={styles.detailEditTitle}>EDIT ITEM</Text>
        <View style={styles.editTitleRow}>
          <TouchableOpacity
            style={[styles.editEmojiBtn, { backgroundColor: editItemColor }]}
            onPress={() => setShowIconPicker(true)}
          >
            <StickerIcon value={editEmoji} size={28} />
            <Text style={styles.editEmojiBtnLabel}>✏</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.editInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Title"
            placeholderTextColor={sticker.inkMuted}
            autoFocus
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {CATS.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.catPill,
                  { backgroundColor: editCat === cat.key ? cat.color : sticker.surface },
                ]}
                onPress={() => setEditCat(cat.key)}
              >
                <Text style={styles.catPillText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Per-item frame color */}
        <View style={styles.colorRowWrap}>
          <Text style={styles.colorRowLabel}>CARD COLOR</Text>
          <View style={styles.colorRowSwatches}>
            {BUCKET_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  editItemColor === c && styles.colorDotActive,
                ]}
                onPress={() => setEditItemColor(c)}
              />
            ))}
          </View>
        </View>

        <TextInput
          style={[styles.editInput, { minHeight: 56, textAlignVertical: 'top' }]}
          value={editDesc}
          onChangeText={setEditDesc}
          placeholder="Memory note (optional)"
          placeholderTextColor={sticker.inkMuted}
          multiline
        />
        <TextInput
          style={styles.editInput}
          value={editDate}
          onChangeText={setEditDate}
          placeholder="Target date (optional)"
          placeholderTextColor={sticker.inkMuted}
        />
        <TouchableOpacity style={styles.editInput} onPress={() => setShowEditLocationPicker(true)}>
          <Text style={{ color: editLocation ? sticker.ink : sticker.inkMuted, fontWeight: '600' }}>
            📍 {editLocation || 'Add location (optional)'}
          </Text>
        </TouchableOpacity>
        {showEditLocationPicker && (
          <LocationPicker value={editLocation} onSelect={setEditLocation} onClose={() => setShowEditLocationPicker(false)} />
        )}

        <View style={styles.detailBtns}>
          <TouchableOpacity
            style={[styles.detailBtnPrimary, { marginBottom: 3, marginRight: 3 }]}
            onPress={saveEdits}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.detailBtnPrimaryText}>SAVE</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailBtnSecondary} onPress={() => setEditing(false)}>
            <Text style={styles.detailBtnSecondaryText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.detail, { borderTopColor: color, borderTopWidth: 3 }]}>
      {item.memory_note && (
        <View style={[styles.detailQuote, { backgroundColor: color }]}>
          <Text style={styles.detailQuoteText}>"{item.memory_note}"</Text>
        </View>
      )}

      {/* Meta badges */}
      <View style={styles.detailMeta}>
        {item.target_date && <Text style={styles.detailMetaText}>📅 {item.target_date}</Text>}
        {item.location && <Text style={styles.detailMetaText}>📍 {item.location}</Text>}
        {item.tagged_users.length > 0 && (
          <Text style={styles.detailMetaText}>👥 {item.tagged_users.map(u => u.name.split(' ')[0]).join(', ')}</Text>
        )}
      </View>

      {/* Photos */}
      <View style={styles.detailPhotosSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {item.photos.map(photo => (
              <PhotoThumb key={photo.id} storagePath={photo.storage_path} onPress={setViewingPhoto} />
            ))}
            <TouchableOpacity
              style={[styles.addPhotoBtn, uploading && { opacity: 0.5 }]}
              onPress={pickPhoto}
              disabled={uploading}
            >
              {uploading
                ? <ActivityIndicator size="small" color={sticker.ink} />
                : <Text style={styles.addPhotoBtnText}>{item.photos.length === 0 ? '📷 Add photo' : '+'}</Text>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <PhotoViewer uri={viewingPhoto} onClose={() => setViewingPhoto(null)} />

      {/* Comments */}
      {item.comments.map((c: any) => (
        <View key={c.id} style={styles.comment}>
          <Text style={styles.commentAuthor}>{c.profiles?.name?.split(' ')[0].toUpperCase() ?? 'SOMEONE'}</Text>
          <Text style={styles.commentText}>{c.text}</Text>
        </View>
      ))}

      <View style={styles.commentRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={sticker.inkMuted}
          value={comment}
          onChangeText={setComment}
          returnKeyType="send"
          onSubmitEditing={submitComment}
        />
        <TouchableOpacity
          style={[styles.commentSendBtn, { backgroundColor: comment.trim() ? sticker.ink : '#ddd' }]}
          onPress={submitComment}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Action row */}
      <View style={styles.detailActions}>
        <TouchableOpacity
          style={[styles.detailBtnPrimary, { backgroundColor: item.done ? sticker.lime : sticker.ink }]}
          onPress={() => {
            if (item.done) restoreItem(item.id)
            else { markItemDone(item.id); onDone?.() }
          }}
        >
          <Text style={[styles.detailBtnPrimaryText, { color: item.done ? sticker.ink : '#fff' }]}>
            {item.done ? '↩ RESTORE' : '✓ DONE'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailBtnSecondary} onPress={() => setEditing(true)}>
          <Text style={styles.detailBtnSecondaryText}>✏ EDIT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailBtnSecondary} onPress={onOpenFull}>
          <Text style={styles.detailBtnSecondaryText}>↗ VIEW</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ── Item modal (full screen) ───────────────────────────────────
function ItemModal({ itemId, onClose, onDone }: {
  itemId: string
  onClose: () => void
  onDone: (emoji: string, title: string) => void
}) {
  const { items, markItemDone, restoreItem, toggleHeart, toggleStar, addComment, editItem, uploadItemPhoto } = useStore()
  const item = items.find(i => i.id === itemId)
  const [comment, setComment] = useState('')
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  if (!item) return null

  const color = getItemStickerColor(item.id, item.category_key)
  const catCfg = getCatConfig(item.category_key)

  async function submitComment() {
    if (!comment.trim()) return
    await addComment(item!.id, comment)
    setComment('')
  }

  async function launchPicker(useCamera: boolean) {
    try {
      const opts = { mediaTypes: ['images'] as any, quality: 0.85 as any, allowsEditing: true, aspect: [4, 3] as any }
      const result = useCamera
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts)
      if (!result.canceled && result.assets[0]) {
        setUploading(true)
        await uploadItemPhoto(item!.id, result.assets[0].uri)
        setUploading(false)
      }
    } catch (e) { setUploading(false) }
  }

  function pickPhoto() {
    Alert.alert('Add photo', undefined, [
      { text: '📷 Take a photo', onPress: () => launchPicker(true) },
      { text: '🖼️ Choose from library', onPress: () => launchPicker(false) },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  return (
    <View style={styles.modalFull}>
      <View style={styles.modalTopBar}>
        <TouchableOpacity onPress={onClose} style={styles.modalBackBtn}>
          <Text style={styles.modalBackText}>‹</Text>
        </TouchableOpacity>
        <View style={[styles.modalStatusPill, { backgroundColor: catCfg.color }]}>
          <Text style={styles.modalStatusText}>
            {catCfg.label} {item.done ? '· DONE ✓' : ''}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Title poster */}
        <View style={styles.itemPosterWrapper}>
          <View style={styles.itemPosterShadow} />
          <View style={[styles.itemPoster, { backgroundColor: color }]}>
            <StickerIcon value={item.emoji} size={52} />
            <Text style={[styles.itemPosterTitle, item.done && { textDecorationLine: 'line-through', opacity: 0.6 }]}>
              {item.title.toUpperCase()}
            </Text>
            <View style={styles.itemPosterMeta}>
              {item.target_date && <Text style={styles.itemPosterMetaText}>· {item.target_date}</Text>}
              {item.location && <Text style={styles.itemPosterMetaText}>· {item.location}</Text>}
              {item.tagged_users.length > 0 && (
                <Text style={styles.itemPosterMetaText}>
                  · {item.tagged_users.map(u => u.name.split(' ')[0]).join(', ')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Photo strip */}
        {(item.photos.length > 0 || true) && (
          <View style={{ paddingHorizontal: 22, marginTop: 20 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {item.photos.map((photo, i) => {
                  const frameColors = [sticker.yellow, sticker.cyan, sticker.lime]
                  const fc = frameColors[i % frameColors.length]
                  return (
                    <View key={photo.id} style={[
                      styles.photoFrame,
                      { backgroundColor: fc, transform: [{ rotate: i % 2 === 0 ? '1deg' : '-1.5deg' }] },
                    ]}>
                      <PhotoThumb storagePath={photo.storage_path} onPress={setViewingPhoto} />
                    </View>
                  )
                })}
                <TouchableOpacity
                  style={styles.addPhotoSlot}
                  onPress={pickPhoto}
                  disabled={uploading}
                >
                  {uploading
                    ? <ActivityIndicator size="small" color={sticker.inkMuted} />
                    : <Text style={{ fontSize: 28, color: sticker.inkMuted }}>+</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Memory quote */}
        {item.memory_note && (
          <View style={styles.memoryCardWrapper}>
            <View style={styles.memoryCardShadow} />
            <View style={styles.memoryCard}>
              <View style={styles.memoryCardTag}>
                <Text style={styles.memoryCardTagText}>MEMORY</Text>
              </View>
              <Text style={styles.memoryCardQuote}>"{item.memory_note}"</Text>
            </View>
          </View>
        )}

        {/* Reactions */}
        <View style={styles.reactionsWrapper}>
          <View style={styles.reactionsShadow} />
          <View style={styles.reactionsCard}>
            <TouchableOpacity
              onPress={() => toggleHeart(item.id)}
              style={[styles.reactionChip, item.hearted_by_me && { backgroundColor: sticker.red, borderColor: sticker.ink }]}
            >
              <Text style={styles.reactionText}>♥</Text>
              <Text style={styles.reactionLabel}>{item.hearts || '0'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleStar(item.id)}
              style={[styles.reactionChip, item.starred && { backgroundColor: sticker.yellow, borderColor: sticker.ink }]}
            >
              <Text style={styles.reactionText}>★</Text>
              <Text style={styles.reactionLabel}>STAR</Text>
            </TouchableOpacity>
            <View style={styles.reactionChip}>
              <Text style={styles.reactionText}>💬</Text>
              <Text style={styles.reactionLabel}>{item.comments.length}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (item.done) restoreItem(item.id)
                else { markItemDone(item.id); onDone(item.emoji, item.title) }
              }}
              style={[styles.reactionChip, item.done && { backgroundColor: sticker.lime, borderColor: sticker.ink }]}
            >
              <Text style={styles.reactionText}>{item.done ? '↩' : '✓'}</Text>
              <Text style={styles.reactionLabel}>{item.done ? 'UNDO' : 'DONE'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments */}
        {item.comments.length > 0 && (
          <View style={{ paddingHorizontal: 22, marginTop: 20 }}>
            {item.comments.map((c: any) => (
              <View key={c.id} style={styles.comment}>
                <Text style={styles.commentAuthor}>{c.profiles?.name?.split(' ')[0].toUpperCase() ?? 'SOMEONE'}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.commentRow, { marginHorizontal: 22, marginTop: 16 }]}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={sticker.inkMuted}
            value={comment}
            onChangeText={setComment}
            returnKeyType="send"
            onSubmitEditing={submitComment}
          />
          <TouchableOpacity
            style={[styles.commentSendBtn, { backgroundColor: comment.trim() ? sticker.ink : '#ddd' }]}
            onPress={submitComment}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <PhotoViewer uri={viewingPhoto} onClose={() => setViewingPhoto(null)} />
    </View>
  )
}

// ── Bucket color picker ────────────────────────────────────────
function BucketColorPicker({ bucketId, current, onPick, onClose }: {
  bucketId: string; current: string; onPick: (color: string) => void; onClose: () => void
}) {
  return (
    <View style={styles.colorPickerSheet}>
      <View style={styles.sheetHandle} />
      <Text style={styles.colorPickerTitle}>BUCKET COLOR</Text>
      <View style={styles.colorGrid}>
        {BUCKET_COLORS.map((c, i) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorSwatch,
              { backgroundColor: c },
              current === c && styles.colorSwatchActive,
            ]}
            onPress={() => { setBucketColorLocal(bucketId, c); onPick(c); onClose() }}
          >
            <Text style={styles.colorSwatchLabel}>{BUCKET_COLOR_LABELS[i]}</Text>
            {current === c && <Text style={styles.colorSwatchCheck}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.colorPickerCancel} onPress={onClose}>
        <Text style={styles.colorPickerCancelText}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  )
}

// ── Bucket settings sheet ──────────────────────────────────────
function BucketSettingsSheet({ bucket, bucketColor, onClose, onPickHero, onLeave, onColorPick }: {
  bucket: any; bucketColor: string; onClose: () => void; onPickHero: () => void
  onLeave: () => void; onColorPick: () => void
}) {
  const { renameBucket, profile } = useStore()
  const [editName, setEditName] = useState(bucket.name)
  const [editEmoji, setEditEmoji] = useState(bucket.emoji)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const isOwner = bucket.created_by === profile?.id
  const members = (bucket.members || []).filter((m: any) => m.status === 'active')

  async function save() {
    if (!editName.trim()) return
    setSaving(true)
    const err = await renameBucket(bucket.id, editName.trim(), editEmoji)
    setSaving(false)
    if (!err) { setSaved(true); setTimeout(() => { setSaved(false); onClose() }, 1200) }
  }

  const EMOJI_OPTIONS = ['🪣', '🌍', '🏄', '🎉', '❤️', '⚡', '🌿', '🔥', '✈️', '🍕']

  return (
    <View style={styles.modalFull}>
      <View style={styles.modalTopBar}>
        <View style={{ width: 40 }} />
        <View style={[styles.sheetHandle, { marginBottom: 0 }]} />
        <TouchableOpacity onPress={onClose} style={styles.modalXBtn}>
          <Text style={styles.modalXBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Color */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionLabel}>BUCKET COLOR</Text>
          <TouchableOpacity
            style={[styles.settingsColorPreview, { backgroundColor: bucketColor }]}
            onPress={onColorPick}
          >
            <Text style={styles.settingsColorPreviewText}>Tap to change color →</Text>
          </TouchableOpacity>
        </View>

        {/* Emoji row */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionLabel}>BUCKET EMOJI</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {EMOJI_OPTIONS.map(e => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiPill, editEmoji === e && styles.emojiPillActive]}
                  onPress={() => setEditEmoji(e)}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Name */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionLabel}>BUCKET NAME</Text>
          <TextInput
            style={styles.settingsInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Bucket name"
            placeholderTextColor={sticker.inkMuted}
          />
          <TouchableOpacity
            style={[styles.settingsSaveBtn, saving && { opacity: 0.6 }]}
            onPress={save}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.settingsSaveBtnText}>{saved ? '✓ SAVED' : 'SAVE'}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Invite code */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionLabel}>INVITE CODE</Text>
          <TouchableOpacity
            style={styles.settingsCodeBox}
            onPress={() => {
              try {
                if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
                  navigator.clipboard.writeText(bucket.invite_code)
                }
              } catch {}
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            <Text style={styles.settingsCode}>{bucket.invite_code}</Text>
            <Text style={styles.settingsCodeHint}>{copied ? '✓ Copied!' : 'Tap to copy'}</Text>
          </TouchableOpacity>
        </View>

        {/* Members */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionLabel}>MEMBERS ({members.length})</Text>
          {members.map((m: any) => {
            const p = m.profiles
            if (!p) return null
            const isMe = p.id === profile?.id
            const colors = ['#7DDCFF', '#C7F356', '#FF7AB6', '#FFD43B', '#5C7BFF', '#FF6B5A']
            const bg = colors[(p.avatar_color ?? 0) % colors.length]
            return (
              <View key={m.id} style={styles.settingsMemberRow}>
                <View style={[styles.settingsMemberAv, { backgroundColor: bg }]}>
                  <Text style={styles.settingsMemberInitials}>{p.name.slice(0, 2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsMemberName}>{p.name}{isMe ? ' (you)' : ''}</Text>
                  <Text style={styles.settingsMemberHandle}>@{p.handle}</Text>
                </View>
                {bucket.created_by === p.id && (
                  <View style={styles.settingsOwnerBadge}>
                    <Text style={styles.settingsOwnerText}>OWNER</Text>
                  </View>
                )}
              </View>
            )
          })}
        </View>

        {!isOwner && (
          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.settingsDangerBtn} onPress={onLeave}>
              <Text style={styles.settingsDangerText}>Leave bucket</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── Main screen ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function BucketScreen() {
  const {
    activeBucketId, getActiveBucket, profile,
    fetchItems, fetchBuckets, setSearchQuery, searchQuery,
    catFilter, setCatFilter, showDone, setShowDone,
    addItem, buckets, setActiveBucketId, unreadActivity,
    markItemDone, restoreItem, deleteItem, uploadItemPhoto,
    reorderItems, renameBucket, leaveBucket,
  } = useStore()

  const filteredItems = useFilteredItems()
  const bucket = getActiveBucket()
  const allItems = useStore(s => s.items)
  const todo = filteredItems.filter(i => !i.done)
  const done = filteredItems.filter(i => i.done)
  const pct = allItems.length
    ? Math.round((allItems.filter(i => i.done).length / allItems.length) * 100)
    : 0

  // View state: 'home' = bucket list, 'bucket' = bucket detail
  const [view, setView] = useState<'home' | 'bucket'>(buckets.length === 0 ? 'home' : 'bucket')

  // Keep view in sync when buckets load
  useEffect(() => {
    if (buckets.length > 0 && view === 'home' && activeBucketId) {
      // Stay on home initially so user sees the poster view
    }
  }, [buckets.length])

  const [refreshing, setRefreshing] = useState(false)
  const [showCreateBucket, setShowCreateBucket] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modalItemId, setModalItemId] = useState<string | null>(null)
  const [celebration, setCelebration] = useState<{ emoji: string; title: string } | null>(null)
  const [reorganizeMode, setReorganizeMode] = useState(false)
  const [showBucketSettings, setShowBucketSettings] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [bucketColorVersion, setBucketColorVersion] = useState(0) // force re-render on color change

  // Create-bucket state
  const [newBucketName, setNewBucketName] = useState('')
  const [newBucketEmoji, setNewBucketEmoji] = useState('🪣')
  const [creatingBucket, setCreatingBucket] = useState(false)
  const [createBucketError, setCreateBucketError] = useState('')

  // Add-item state
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newTargetDate, setNewTargetDate] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [showAddLocationPicker, setShowAddLocationPicker] = useState(false)
  const [newCat, setNewCat] = useState('adventure')
  const [newEmoji, setNewEmoji] = useState('⚡')
  const [taggedFriendIds, setTaggedFriendIds] = useState<string[]>([])
  const [addError, setAddError] = useState('')
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [newStickerColor, setNewStickerColor] = useState(sticker.blue)

  function selectCat(cat: string) {
    setNewCat(cat)
    const cfg = getCatConfig(cat)
    setNewStickerColor(cfg.color)
  }

  function resetAddForm() {
    setNewTitle(''); setNewDescription(''); setNewTargetDate(''); setNewLocation('')
    setTaggedFriendIds([]); setNewEmoji('⚡'); setAddError(''); setAddingNew(false)
  }

  function triggerCelebration(emoji: string, title: string) {
    setCelebration({ emoji, title })
    setTimeout(() => setCelebration(null), 1800)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (activeBucketId) await fetchItems(activeBucketId)
    await fetchBuckets()
    setRefreshing(false)
  }, [activeBucketId])

  async function createBucket() {
    setCreateBucketError('')
    if (!newBucketName.trim()) { setCreateBucketError('Enter a bucket name.'); return }
    if (!profile) return
    setCreatingBucket(true)
    try {
      const { data: nb, error } = await supabase
        .from('buckets')
        .insert({ name: newBucketName.trim(), emoji: newBucketEmoji, created_by: profile.id })
        .select().single()
      if (error || !nb) { setCreateBucketError(error?.message || 'Could not create bucket'); setCreatingBucket(false); return }
      await supabase.from('bucket_members').insert({ bucket_id: nb.id, user_id: profile.id, status: 'active' })
      await fetchBuckets()
      setActiveBucketId(nb.id)
      setNewBucketName(''); setNewBucketEmoji('🪣'); setCreateBucketError(''); setShowCreateBucket(false)
      setView('bucket')
    } catch (e: any) { setCreateBucketError(e.message ?? 'Something went wrong') }
    setCreatingBucket(false)
  }

  async function submitAdd() {
    setAddError('')
    if (!newTitle.trim()) { setAddError('Please enter a title.'); return }
    if (!activeBucketId) { setAddError('No active bucket.'); return }
    if (!profile) { setAddError('Profile not loaded yet.'); return }
    try {
      const insertData: Record<string, any> = {
        bucket_id: activeBucketId,
        title: newTitle.trim(),
        category_key: newCat,
        emoji: newEmoji,
        created_by: profile.id,
      }
      if (newDescription.trim()) insertData.memory_note = newDescription.trim()
      if (newTargetDate.trim()) insertData.target_date = newTargetDate.trim()
      if (newLocation.trim()) insertData.location = newLocation.trim()

      const { data, error } = await supabase
        .from('items')
        .insert(insertData)
        .select('*, item_tags(user_id, profiles(*)), comments(*, profiles(*)), item_photos(*), item_hearts(user_id)')
        .single()
      if (error) { setAddError(error.message); return }
      if (data) {
        if (taggedFriendIds.length > 0) {
          await supabase.from('item_tags').insert(taggedFriendIds.map(userId => ({ item_id: data.id, user_id: userId })))
        }
        _itemStickerColors[data.id] = newStickerColor
        addItem({ ...data, tagged_users: [], comments: [], photos: [], hearted_by_me: false })
        await supabase.from('activity').insert({
          bucket_id: activeBucketId, user_id: profile.id,
          action: 'added', item_id: data.id, item_title: data.title, emoji: newEmoji,
        })
        resetAddForm()
      }
    } catch (e: any) { setAddError(e.message ?? 'Something went wrong') }
  }

  const usedCats = [...new Set(allItems.map(i => i.category_key))]
  const bucketMembers = (bucket?.members || []).filter(m => (m as any).user_id !== profile?.id)
  const currentBucketColor = activeBucketId
    ? getBucketColor(activeBucketId, buckets.findIndex(b => b.id === activeBucketId))
    : sticker.cyan

  // ── Add form modal ─────────────────────────────────────────
  if (addingNew) {
    const catCfg = getCatConfig(newCat)
    return (
      <SafeAreaView style={styles.container}>
        <Modal visible={showIconPicker} animationType="slide">
          <IconPickerScreen
            initial={{ e: newEmoji, c: 'yellow' }}
            onPick={(s) => { setNewEmoji(s.e); setNewStickerColor(resolveColor(s.c)) }}
            onClose={() => setShowIconPicker(false)}
          />
        </Modal>

        {/* Top bar */}
        <View style={styles.addTopBar}>
          <TouchableOpacity style={styles.addCancelBtn} onPress={resetAddForm}>
            <Text style={styles.addCancelText}>CANCEL</Text>
          </TouchableOpacity>
          <Text style={styles.addTopTitle}>NEW THING</Text>
          <TouchableOpacity
            style={[styles.addSubmitBtn, !newTitle.trim() && { backgroundColor: '#999' }]}
            onPress={submitAdd}
            disabled={!newTitle.trim()}
          >
            <Text style={styles.addSubmitText}>ADD →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {addError ? <Text style={styles.addError}>{addError}</Text> : null}

          {/* Adding to bucket pill */}
          {bucket && (
            <View style={styles.addingToPill}>
              <Text style={styles.addingToLabel}>ADDING TO</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <StickerIcon value={bucket.emoji} size={20} />
                <Text style={styles.addingToBucketName}>{bucket.name.toUpperCase()}</Text>
              </View>
            </View>
          )}

          {/* Icon + title card */}
          <View style={styles.addIconCardWrapper}>
            <View style={styles.addIconCardShadow} />
            <View style={[styles.addIconCard, { backgroundColor: catCfg.color }]}>
              <TouchableOpacity
                style={[styles.addIconBtn, { backgroundColor: newStickerColor }]}
                onPress={() => setShowIconPicker(true)}
              >
                <StickerIcon value={newEmoji} size={32} />
                <View style={styles.addIconBadge}>
                  <Text style={styles.addIconBadgeText}>✏</Text>
                </View>
              </TouchableOpacity>
              <TextInput
                style={styles.addTitleInput}
                placeholder="WHAT DO YOU WANT TO TICK OFF?"
                placeholderTextColor="rgba(12,12,12,0.4)"
                value={newTitle}
                onChangeText={setNewTitle}
                autoFocus
                multiline
              />
            </View>
          </View>

          {/* Browse library */}
          <TouchableOpacity style={styles.browseLibBtn} onPress={() => setShowIconPicker(true)}>
            <Text style={styles.browseLibText}>BROWSE STICKER LIBRARY · 100+ →</Text>
          </TouchableOpacity>

          {/* Category chips */}
          <View style={styles.addSection}>
            <Text style={styles.addSectionLabel}>PICK A CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {CATS.map(cat => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.catPill,
                      {
                        backgroundColor: newCat === cat.key ? cat.color : sticker.surface,
                        transform: newCat === cat.key ? [{ rotate: '-1deg' }] : [],
                      },
                    ]}
                    onPress={() => selectCat(cat.key)}
                  >
                    <Text style={styles.catPillText}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Optional fields */}
          <View style={styles.addSection}>
            <View style={styles.addField}>
              <Text style={{ fontSize: 16 }}>📅</Text>
              <TextInput
                style={styles.addFieldInput}
                placeholder="TARGET DATE (e.g. SUMMER 2025)"
                placeholderTextColor={sticker.inkMuted}
                value={newTargetDate}
                onChangeText={setNewTargetDate}
              />
            </View>
            <TouchableOpacity style={styles.addField} onPress={() => setShowAddLocationPicker(true)}>
              <Text style={{ fontSize: 16 }}>📍</Text>
              <Text style={[styles.addFieldInput, { color: newLocation ? sticker.ink : sticker.inkMuted }]}>
                {newLocation || 'ADD A LOCATION'}
              </Text>
            </TouchableOpacity>
            {showAddLocationPicker && (
              <LocationPicker value={newLocation} onSelect={setNewLocation} onClose={() => setShowAddLocationPicker(false)} />
            )}
            <View style={styles.addField}>
              <Text style={{ fontSize: 16 }}>📝</Text>
              <TextInput
                style={[styles.addFieldInput, { flex: 1 }]}
                placeholder="WHY YOU WANT THIS (OPTIONAL)"
                placeholderTextColor={sticker.inkMuted}
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
              />
            </View>
          </View>

          {/* Tag people */}
          {bucketMembers.length > 0 && (
            <View style={styles.addSection}>
              <Text style={styles.addSectionLabel}>TAG WHO'S IN</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {bucketMembers.map(m => {
                  const mp = (m as any).profiles
                  if (!mp) return null
                  const uid = (m as any).user_id
                  const isTagged = taggedFriendIds.includes(uid)
                  return (
                    <TouchableOpacity
                      key={uid}
                      style={[
                        styles.tagChip,
                        { backgroundColor: isTagged ? catCfg.color : sticker.surface },
                      ]}
                      onPress={() => setTaggedFriendIds(prev =>
                        prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
                      )}
                    >
                      <Text style={styles.tagChipText}>{mp.name.split(' ')[0].toUpperCase()}</Text>
                      {isTagged && <Text style={{ fontSize: 11, fontWeight: '700' }}>✓</Text>}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Home view — bucket posters ─────────────────────────────
  if (view === 'home' || buckets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Create bucket modal */}
        <Modal visible={showCreateBucket} transparent animationType="slide" onRequestClose={() => setShowCreateBucket(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCreateBucket(false)}>
            <View style={styles.bucketSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>NEW BUCKET</Text>
              {createBucketError ? <Text style={styles.createError}>{createBucketError}</Text> : null}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['🪣', '🌍', '🏄', '🎉', '❤️', '⚡', '🌿', '🔥', '✈️', '🍕'].map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[styles.emojiPill, newBucketEmoji === e && styles.emojiPillActive]}
                      onPress={() => setNewBucketEmoji(e)}
                    >
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TextInput
                style={styles.bucketNameInput}
                placeholder="BUCKET NAME, e.g. OUR 2025 ADVENTURES"
                placeholderTextColor={sticker.inkMuted}
                value={newBucketName}
                onChangeText={setNewBucketName}
                autoFocus
              />
              <View style={styles.createBtns}>
                <TouchableOpacity
                  style={[styles.createBtn, creatingBucket && { opacity: 0.6 }]}
                  onPress={createBucket}
                  disabled={creatingBucket}
                >
                  {creatingBucket
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.createBtnText}>CREATE</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={styles.createCancelBtn} onPress={() => setShowCreateBucket(false)}>
                  <Text style={styles.createCancelText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={sticker.ink} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Top bar */}
          <View style={styles.homeTopBar}>
            <View style={styles.homeWordmark}>
              <Text style={styles.homeWordmarkText}>🪣 BUCKET</Text>
            </View>
            <TouchableOpacity
              style={styles.homeBellBtn}
              onPress={() => router.push('/(app)/activity')}
            >
              <Text style={{ fontSize: 18 }}>🔔</Text>
              {unreadActivity > 0 && (
                <View style={styles.homeBellBadge}>
                  <Text style={styles.homeBellBadgeText}>{unreadActivity > 9 ? '9+' : unreadActivity}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Big headline */}
          <View style={styles.homeHeadline}>
            <Text style={styles.homeHeadlineTop}>WHAT'S</Text>
            <View style={styles.homeHeadlineRow}>
              <Text style={styles.homeHeadlineMain}>ON THE </Text>
              <View style={styles.homeHeadlineHighlight}>
                <Text style={styles.homeHeadlineHighlightText}>LIST</Text>
              </View>
            </View>
            <View style={styles.homeSubline}>
              <Text style={styles.homeSublineText}>
                {buckets.length} bucket{buckets.length !== 1 ? 's' : ''} ·{' '}
              </Text>
              <View style={styles.homeSublineDone}>
                <Text style={styles.homeSublineDoneText}>
                  {allItems.filter(i => i.done).length} done
                </Text>
              </View>
              <Text style={styles.homeSublineText}> this year.</Text>
            </View>
          </View>

          {/* Bucket poster stack */}
          <View style={{ paddingHorizontal: 22, gap: 22 }}>
            {buckets.map((b, i) => {
              const color = getBucketColor(b.id, i)
              const tilt = i % 2 === 0 ? -1 : 1.4
              return (
                <BucketPoster
                  key={b.id}
                  bucket={b}
                  color={color}
                  tilt={tilt}
                  onPress={() => {
                    setActiveBucketId(b.id)
                    setView('bucket')
                  }}
                />
              )
            })}

            {/* New bucket row */}
            <TouchableOpacity
              style={styles.newBucketDashed}
              onPress={() => setShowCreateBucket(true)}
            >
              <Text style={styles.newBucketDashedTitle}>+ NEW BUCKET</Text>
              <Text style={styles.newBucketDashedSub}>Solo or shared</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Bucket detail view ─────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Bucket picker modal (for switching) */}
      <Modal visible={false} transparent animationType="slide">
        <View />
      </Modal>

      {/* Bucket settings modal */}
      <Modal
        visible={showBucketSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBucketSettings(false)}
      >
        <View style={styles.modalFullOverlay}>
          {bucket && (
            <BucketSettingsSheet
              bucket={bucket}
              bucketColor={currentBucketColor}
              onClose={() => setShowBucketSettings(false)}
              onPickHero={() => {}}
              onLeave={() => {
                setShowBucketSettings(false)
                Alert.alert('Leave bucket', `Leave "${bucket.name}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Leave', style: 'destructive', onPress: () => { leaveBucket(bucket.id); setView('home') } },
                ])
              }}
              onColorPick={() => setShowColorPicker(true)}
            />
          )}
        </View>
      </Modal>

      {/* Color picker modal */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowColorPicker(false)}>
          {activeBucketId && (
            <BucketColorPicker
              bucketId={activeBucketId}
              current={currentBucketColor}
              onPick={() => setBucketColorVersion(v => v + 1)}
              onClose={() => setShowColorPicker(false)}
            />
          )}
        </TouchableOpacity>
      </Modal>

      {/* Item modal */}
      <Modal
        visible={!!modalItemId}
        transparent
        animationType="slide"
        onRequestClose={() => setModalItemId(null)}
      >
        <View style={styles.modalFullOverlay}>
          {modalItemId && (
            <ItemModal
              itemId={modalItemId}
              onClose={() => setModalItemId(null)}
              onDone={(emoji, title) => { setModalItemId(null); triggerCelebration(emoji, title) }}
            />
          )}
        </View>
      </Modal>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={sticker.ink} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Bucket hero banner */}
        <View style={styles.heroWrapper}>
          <View style={styles.heroShadow} />
          <View style={[styles.heroBanner, { backgroundColor: currentBucketColor }]}>
            {/* Back + settings */}
            <View style={styles.heroBtns}>
              <TouchableOpacity style={styles.heroIconBtn} onPress={() => setView('home')}>
                <Text style={styles.heroIconBtnText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroIconBtn} onPress={() => setShowBucketSettings(true)}>
                <Text style={styles.heroIconBtnText}>⚙</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <StickerIcon value={bucket?.emoji ?? '⭐'} size={56} />
            </View>
            <Text style={styles.heroTitle}>{bucket?.name.toUpperCase()}</Text>
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <AvatarStack members={(bucket?.members || []).map((m: any) => ({ profiles: m.profile ?? m.profiles }))} size={26} ringColor={currentBucketColor} />
            </View>

            {/* Progress bar */}
            <View style={styles.heroProgress}>
              <View style={[styles.heroProgressFill, { width: `${pct}%` as any }]}>
                <Text style={styles.heroProgressText}>{allItems.filter(i=>i.done).length}/{allItems.length}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          <StickerChip
            label="ALL"
            color={catFilter === null ? sticker.ink : sticker.surface}
            textColor={catFilter === null ? sticker.bg : sticker.ink}
            active={catFilter === null}
            onPress={() => setCatFilter(null)}
          />
          {usedCats.map(key => {
            const cfg = getCatConfig(key)
            const active = catFilter === key
            return (
              <StickerChip
                key={key}
                label={cfg.label}
                color={active ? cfg.color : sticker.surface}
                textColor={active ? (cfg.textColor ?? sticker.ink) : sticker.ink}
                active={active}
                onPress={() => setCatFilter(active ? null : key)}
              />
            )
          })}
          {todo.length > 1 && (
            <StickerChip
              label={reorganizeMode ? 'DONE ↕' : '↕ REORDER'}
              color={reorganizeMode ? sticker.ink : sticker.surface}
              textColor={reorganizeMode ? sticker.bg : sticker.ink}
              active={reorganizeMode}
              onPress={() => { setReorganizeMode(m => !m); setExpandedId(null) }}
            />
          )}
        </ScrollView>

        {reorganizeMode && (
          <View style={styles.reorderBanner}>
            <Text style={styles.reorderBannerText}>Drag ⠿ to reorder · Swipe disabled</Text>
          </View>
        )}

        {/* Items */}
        <View style={{ paddingHorizontal: 22, gap: 14, marginTop: 14 }}>
          {reorganizeMode ? (
            <DraggableFlatList
              data={todo}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => reorderItems(data)}
              renderItem={({ item, drag, isActive }) => (
                <ScaleDecorator activeScale={1.02}>
                  <View style={{ marginBottom: 14 }}>
                    <SwipeableItem
                      item={item}
                      onPress={() => {}}
                      onDone={() => {}}
                      onRestore={() => {}}
                      onDelete={() => {}}
                      expanded={false}
                      onDragStart={drag}
                      isActive={isActive}
                    />
                  </View>
                </ScaleDecorator>
              )}
            />
          ) : (
            <>
              {todo.map(item => (
                <View key={item.id}>
                  <SwipeableItem
                    item={item}
                    onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    onDone={() => {
                      markItemDone(item.id)
                      setExpandedId(null)
                      triggerCelebration(item.emoji, item.title)
                    }}
                    onRestore={() => { restoreItem(item.id); setExpandedId(null) }}
                    onDelete={() => deleteItem(item.id)}
                    expanded={expandedId === item.id}
                  />
                  {expandedId === item.id && (
                    <ItemDetail
                      item={item}
                      onClose={() => setExpandedId(null)}
                      uploadPhoto={(uri) => uploadItemPhoto(item.id, uri)}
                      onOpenFull={() => { setModalItemId(item.id); setExpandedId(null) }}
                      onDone={() => triggerCelebration(item.emoji, item.title)}
                    />
                  )}
                </View>
              ))}
            </>
          )}
        </View>

        {/* Done section */}
        {done.length > 0 && (
          <>
            <TouchableOpacity style={styles.sectionDivider} onPress={() => setShowDone(!showDone)}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{showDone ? '▾' : '▸'} DONE ({done.length})</Text>
              <View style={styles.dividerLine} />
            </TouchableOpacity>
            {showDone && (
              <View style={{ paddingHorizontal: 22, gap: 14 }}>
                {done.map(item => (
                  <View key={item.id}>
                    <SwipeableItem
                      item={item}
                      isDoneSection
                      onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      onDone={() => markItemDone(item.id)}
                      onRestore={() => { restoreItem(item.id); setExpandedId(null) }}
                      onDelete={() => deleteItem(item.id)}
                      expanded={expandedId === item.id}
                    />
                    {expandedId === item.id && (
                      <ItemDetail
                        item={item}
                        onClose={() => setExpandedId(null)}
                        uploadPhoto={(uri) => uploadItemPhoto(item.id, uri)}
                        onOpenFull={() => { setModalItemId(item.id); setExpandedId(null) }}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Empty state */}
        {allItems.length === 0 && (
          <View style={styles.emptyState}>
            <View style={{ marginBottom: 12 }}>
              <StickerIcon value={bucket?.emoji ?? '🪣'} size={56} />
            </View>
            <Text style={styles.emptyStateTitle}>YOUR BUCKET IS EMPTY</Text>
            <Text style={styles.emptyStateSub}>Add the adventures, meals, and experiences you want to share.</Text>
          </View>
        )}

        {/* Filter empty */}
        {filteredItems.length === 0 && allItems.length > 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>NOTHING HERE</Text>
            <TouchableOpacity
              onPress={() => { setSearchQuery(''); setCatFilter(null) }}
              style={styles.clearFiltersBtn}
            >
              <Text style={styles.clearFiltersBtnText}>CLEAR FILTERS</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fabWrapper}
        onPress={() => setAddingNew(true)}
        activeOpacity={0.85}
      >
        <View style={styles.fabShadow} />
        <View style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </View>
      </TouchableOpacity>

      <CelebrationOverlay item={celebration} />
    </SafeAreaView>
  )
}

// ══════════════════════════════════════════════════════════════
// Styles
// ══════════════════════════════════════════════════════════════
const S = 4 // shadow offset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sticker.bg,
  },

  // ── Photo viewer ─────────────────────────────────────────────
  photoViewerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  photoViewerImage: { width: SCREEN_W, height: SCREEN_W * 1.2 },
  photoViewerClose: {
    position: 'absolute', top: 50, right: 20,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  photoViewerCloseText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // ── Celebration ───────────────────────────────────────────────
  celebration: {
    position: 'absolute', top: '35%', alignSelf: 'center',
    backgroundColor: sticker.surface, borderRadius: 20,
    borderWidth: 2.5, borderColor: sticker.ink,
    paddingHorizontal: 28, paddingVertical: 22,
    alignItems: 'center', zIndex: 999,
    shadowColor: sticker.ink, shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 8,
  },
  celebEmoji: { fontSize: 52 },
  celebDone: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4, marginTop: 6, color: sticker.lime },
  celebTitle: { fontSize: 15, fontWeight: '600', marginTop: 4, color: sticker.inkMuted, textAlign: 'center', maxWidth: 200 },

  // ── Item card ─────────────────────────────────────────────────
  itemCardWrapper: {
    paddingBottom: S,
    paddingRight: S,
  },
  itemCardShadow: {
    position: 'absolute',
    top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 18,
  },
  itemCard: {
    backgroundColor: sticker.surface,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    overflow: 'hidden',
  },
  colorStrip: {
    position: 'absolute',
    left: 0, top: 16, bottom: 16,
    width: 6,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  itemCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    paddingLeft: 14,
    gap: 10,
  },
  dragHandle: { paddingRight: 4, paddingTop: 2 },
  dragHandleText: { fontSize: 20, color: sticker.inkMuted },
  itemIcon: {
    width: 48, height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemEmoji: { fontSize: 24 },
  itemContent: { flex: 1, minWidth: 0 },
  itemTitle: {
    fontSize: 15, fontWeight: '700',
    letterSpacing: -0.3, lineHeight: 20,
    color: sticker.ink,
  },
  itemBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 7 },
  metaBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: sticker.bg,
    borderWidth: 1.5, borderColor: sticker.ink,
    borderRadius: 6,
  },
  metaBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', color: sticker.ink },
  memoryQuote: {
    marginTop: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1.5, borderColor: sticker.ink, borderRadius: 8,
  },
  memoryQuoteText: { fontSize: 12, fontWeight: '600', color: sticker.ink, lineHeight: 16 },
  itemRight: { gap: 6, alignItems: 'flex-end', paddingTop: 2 },
  starDot: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  heartPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 99, borderWidth: 1.5, borderColor: sticker.ink,
  },
  heartPillText: { fontSize: 11, fontWeight: '700' },

  // ── Swipe actions ─────────────────────────────────────────────
  swipeRight: {
    backgroundColor: sticker.lime,
    borderRadius: 18, marginVertical: 0, marginRight: 4,
    width: 80, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: sticker.ink,
  },
  swipeRightText: { fontSize: 22 },
  swipeRightLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  swipeLeft: {
    backgroundColor: sticker.red,
    borderRadius: 18, marginVertical: 0, marginLeft: 4,
    width: 80, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: sticker.ink,
  },
  swipeLeftText: { fontSize: 22 },
  swipeLeftLabel: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase' },

  // ── Bucket poster ─────────────────────────────────────────────
  bucketPosterShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 18,
  },
  bucketPoster: {
    borderRadius: 18, borderWidth: 2.5, borderColor: sticker.ink,
    padding: 18,
  },
  posterHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  posterEmojiBox: {
    width: 56, height: 56, borderRadius: 14,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  posterEmoji: { fontSize: 32 },
  posterPill: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99,
    alignItems: 'center', justifyContent: 'center',
  },
  posterPillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: sticker.bg, textTransform: 'uppercase' },
  posterName: {
    fontSize: 30, fontWeight: '700', letterSpacing: -1,
    lineHeight: 32, marginTop: 14, color: sticker.ink, textTransform: 'uppercase',
  },
  posterFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 14, paddingTop: 14,
    borderTopWidth: 2, borderTopColor: 'rgba(12,12,12,0.18)',
  },
  posterCount: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: sticker.ink },

  // ── Item detail ───────────────────────────────────────────────
  detail: {
    backgroundColor: sticker.surface,
    marginHorizontal: 4, marginBottom: 14,
    borderRadius: 14, padding: 16,
    borderWidth: 2, borderColor: sticker.ink,
  },
  detailEditTitle: {
    fontSize: 14, fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase', color: sticker.inkMuted, marginBottom: 12,
  },
  editTitleRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 12 },
  editEmojiBtn: {
    width: 60, height: 60, borderRadius: 14,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, position: 'relative',
  },
  editEmojiBtnLabel: {
    position: 'absolute', bottom: -6, right: -6,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: sticker.ink, color: '#fff',
    fontSize: 10, fontWeight: '700', textAlign: 'center', lineHeight: 20,
    borderWidth: 1.5, borderColor: '#fff',
  },
  editInput: {
    backgroundColor: sticker.bg, borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 10, padding: 12, marginBottom: 10,
    fontSize: 14, fontWeight: '600', color: sticker.ink,
    flex: 1,
  },
  detailQuote: {
    padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: sticker.ink, marginBottom: 10,
  },
  detailQuoteText: { fontSize: 13, fontWeight: '600', color: sticker.ink, lineHeight: 18 },
  detailMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  detailMetaText: { fontSize: 12, fontWeight: '600', color: sticker.inkMuted },
  detailPhotosSection: { marginBottom: 12 },
  addPhotoBtn: {
    width: 80, height: 80, borderRadius: 10,
    borderWidth: 2, borderStyle: 'dashed', borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  addPhotoBtnText: { fontSize: 12, fontWeight: '700', color: sticker.inkMuted },
  comment: {
    paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  commentAuthor: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: sticker.inkMuted },
  commentText: { fontSize: 13, color: sticker.ink, marginTop: 2 },
  commentRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  commentInput: {
    flex: 1, backgroundColor: sticker.bg,
    borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 10, padding: 10,
    fontSize: 13, fontWeight: '600', color: sticker.ink,
  },
  commentSendBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  detailActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  detailBtnPrimary: {
    flex: 1, backgroundColor: sticker.ink,
    borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: sticker.ink,
  },
  detailBtnPrimaryText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' },
  detailBtnSecondary: {
    flex: 1, backgroundColor: sticker.surface,
    borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: sticker.ink,
  },
  detailBtnSecondaryText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: sticker.ink },
  detailBtns: { flexDirection: 'row', gap: 8, marginTop: 14 },

  // ── Item modal ────────────────────────────────────────────────
  modalFull: {
    flex: 1,
    backgroundColor: sticker.bg,
  },
  modalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
  },
  modalBackBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: sticker.surface,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  modalBackText: { fontSize: 18, fontWeight: '700', color: sticker.ink },
  modalStatusPill: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 99, borderWidth: 2, borderColor: sticker.ink,
  },
  modalStatusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: sticker.ink },
  modalXBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: sticker.surface,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  modalXBtnText: { fontSize: 16, fontWeight: '700', color: sticker.ink },

  itemPosterWrapper: { marginHorizontal: 22, marginBottom: S, marginRight: 22 + S },
  itemPosterShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 18,
  },
  itemPoster: {
    borderRadius: 18, borderWidth: 2.5, borderColor: sticker.ink,
    padding: 20,
  },
  itemPosterEmoji: { fontSize: 72, lineHeight: 80, textAlign: 'center' },
  itemPosterTitle: {
    fontSize: 28, fontWeight: '700', letterSpacing: -1,
    lineHeight: 32, marginTop: 12, textTransform: 'uppercase',
    color: sticker.ink,
  },
  itemPosterMeta: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12,
  },
  itemPosterMetaText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase', color: sticker.inkMuted,
  },

  photoFrame: {
    padding: 4, borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 10,
  },
  addPhotoSlot: {
    width: 88, height: 88,
    borderWidth: 2.5, borderStyle: 'dashed', borderColor: sticker.ink,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  memoryCardWrapper: { marginHorizontal: 22, marginTop: 20, marginBottom: S, marginRight: 22 + S },
  memoryCardShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 18,
  },
  memoryCard: {
    backgroundColor: sticker.surface,
    borderRadius: 18, borderWidth: 2.5, borderColor: sticker.ink,
    padding: 18, paddingTop: 24,
  },
  memoryCardTag: {
    position: 'absolute', top: -12, left: 18,
    backgroundColor: sticker.lime,
    borderRadius: 6, borderWidth: 2, borderColor: sticker.ink,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  memoryCardTagText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', color: sticker.ink },
  memoryCardQuote: {
    fontSize: 20, fontWeight: '700', letterSpacing: -0.5, lineHeight: 26, color: sticker.ink,
  },

  reactionsWrapper: { marginHorizontal: 22, marginTop: 20, marginBottom: S, marginRight: 22 + S },
  reactionsShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 18,
  },
  reactionsCard: {
    backgroundColor: sticker.surface,
    borderRadius: 18, borderWidth: 2.5, borderColor: sticker.ink,
    padding: 12, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
  },
  reactionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 99, borderWidth: 0,
  },
  reactionText: { fontSize: 16 },
  reactionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },

  // ── Bucket color picker ───────────────────────────────────────
  colorPickerSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: sticker.bg,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    borderTopWidth: 2.5, borderColor: sticker.ink,
    padding: 22, paddingBottom: 40,
  },
  colorPickerTitle: {
    fontSize: 18, fontWeight: '700', letterSpacing: -0.4,
    textTransform: 'uppercase', color: sticker.ink, marginBottom: 18,
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  colorSwatch: {
    width: '30%', paddingVertical: 16,
    borderRadius: 14, borderWidth: 2.5, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    gap: 4,
  },
  colorSwatchActive: { borderWidth: 4 },
  colorSwatchLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: sticker.ink },
  colorSwatchCheck: { fontSize: 14, fontWeight: '700', color: sticker.ink },
  colorPickerCancel: {
    paddingVertical: 14,
    backgroundColor: sticker.surface,
    borderRadius: 12, borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center',
  },
  colorPickerCancelText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: sticker.ink },

  // ── Settings sheet ─────────────────────────────────────────────
  settingsColorPreview: {
    padding: 16, borderRadius: 12, borderWidth: 2.5, borderColor: sticker.ink,
    alignItems: 'center',
  },
  settingsColorPreviewText: { fontSize: 13, fontWeight: '700', color: sticker.ink },
  settingsSection: { paddingHorizontal: 22, paddingTop: 20 },
  settingsSectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', color: sticker.inkMuted, marginBottom: 10,
  },
  settingsInput: {
    backgroundColor: sticker.bg, borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 12, padding: 14, marginBottom: 10,
    fontSize: 16, fontWeight: '600', color: sticker.ink,
  },
  settingsSaveBtn: {
    backgroundColor: sticker.ink, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 2, borderColor: sticker.ink,
  },
  settingsSaveBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' },
  settingsCodeBox: {
    backgroundColor: sticker.surface,
    borderRadius: 12, borderWidth: 2.5, borderColor: sticker.ink,
    padding: 16, alignItems: 'center', gap: 4,
  },
  settingsCode: { fontWeight: '700', fontSize: 18, letterSpacing: 2, color: sticker.ink },
  settingsCodeHint: { fontSize: 11, fontWeight: '600', color: sticker.inkMuted },
  settingsMemberRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  settingsMemberAv: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsMemberInitials: { fontSize: 14, fontWeight: '700', color: sticker.ink },
  settingsMemberName: { fontSize: 14, fontWeight: '700', color: sticker.ink },
  settingsMemberHandle: { fontSize: 12, color: sticker.inkMuted, marginTop: 1 },
  settingsOwnerBadge: {
    backgroundColor: sticker.yellow, borderRadius: 6, borderWidth: 1.5, borderColor: sticker.ink,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  settingsOwnerText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: sticker.ink },
  settingsDangerBtn: {
    padding: 14, borderRadius: 12, borderWidth: 2, borderColor: sticker.red,
    alignItems: 'center',
  },
  settingsDangerText: { fontSize: 14, fontWeight: '700', color: sticker.red },

  // ── Home view ─────────────────────────────────────────────────
  homeTopBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingTop: 8, paddingBottom: 14,
  },
  homeWordmark: {
    backgroundColor: sticker.ink, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  homeWordmarkText: { fontSize: 18, fontWeight: '700', letterSpacing: -0.5, color: sticker.bg },
  homeBellBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: sticker.pink,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    marginBottom: 3, marginRight: 3,
  },
  homeBellBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  homeBellBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  homeHeadline: { paddingHorizontal: 22, paddingBottom: 22, paddingTop: 4 },
  homeHeadlineTop: {
    fontSize: 52, fontWeight: '700', letterSpacing: -2.2, lineHeight: 52,
    textTransform: 'uppercase', color: sticker.ink,
  },
  homeHeadlineRow: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap' },
  homeHeadlineMain: {
    fontSize: 52, fontWeight: '700', letterSpacing: -2.2, lineHeight: 60,
    textTransform: 'uppercase', color: sticker.ink,
  },
  homeHeadlineHighlight: {
    backgroundColor: sticker.lime,
    paddingHorizontal: 10, paddingVertical: 2,
    borderWidth: 2, borderColor: sticker.ink, borderRadius: 4,
    transform: [{ rotate: '-2deg' }],
    marginBottom: 4,
  },
  homeHeadlineHighlightText: {
    fontSize: 52, fontWeight: '700', letterSpacing: -2.2, lineHeight: 60,
    color: sticker.ink, textTransform: 'uppercase',
  },
  homeSubline: { flexDirection: 'row', alignItems: 'center', marginTop: 16, flexWrap: 'wrap' },
  homeSublineText: { fontSize: 14, fontWeight: '500', color: sticker.inkMuted },
  homeSublineDone: {
    backgroundColor: sticker.yellow,
    paddingHorizontal: 6, paddingVertical: 1,
    borderWidth: 1.5, borderColor: sticker.ink, borderRadius: 4,
  },
  homeSublineDoneText: { fontSize: 14, fontWeight: '700', color: sticker.ink },

  newBucketDashed: {
    padding: 20, backgroundColor: sticker.bg,
    borderWidth: 2.5, borderStyle: 'dashed', borderColor: sticker.ink,
    borderRadius: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  newBucketDashedTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.6, color: sticker.ink },
  newBucketDashedSub: { fontSize: 12, fontWeight: '600', color: sticker.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Bucket detail view ─────────────────────────────────────────
  heroWrapper: { margin: 22, marginBottom: 22 + S, marginRight: 22 + S },
  heroShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 22,
  },
  heroBanner: {
    borderRadius: 22, borderWidth: 2.5, borderColor: sticker.ink,
    padding: 20, paddingBottom: 20,
  },
  heroBtns: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  heroIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: sticker.bg,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  heroIconBtnText: { fontSize: 16, fontWeight: '700', color: sticker.ink },
  heroTitle: {
    fontSize: 32, fontWeight: '700', letterSpacing: -1.3, lineHeight: 36,
    textTransform: 'uppercase', color: sticker.ink, textAlign: 'center', marginTop: 10,
  },
  heroProgress: {
    marginTop: 16, backgroundColor: sticker.bg,
    borderWidth: 2, borderColor: sticker.ink, borderRadius: 99,
    height: 22, overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%', backgroundColor: sticker.lime,
    borderRightWidth: 2, borderRightColor: sticker.ink,
    alignItems: 'flex-end', justifyContent: 'center', paddingRight: 8, minWidth: 20,
  },
  heroProgressText: { fontSize: 11, fontWeight: '700', color: sticker.ink },

  filterScroll: { marginBottom: 4 },
  filterScrollContent: { paddingHorizontal: 22, gap: 8, flexDirection: 'row', paddingVertical: 4 },

  reorderBanner: {
    marginHorizontal: 22, marginBottom: 8,
    backgroundColor: sticker.yellow,
    borderRadius: 10, borderWidth: 2, borderColor: sticker.ink,
    padding: 10, alignItems: 'center',
  },
  reorderBannerText: { fontSize: 12, fontWeight: '700', color: sticker.ink, textTransform: 'uppercase', letterSpacing: 0.3 },

  sectionDivider: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 16, gap: 10,
  },
  dividerLine: { flex: 1, height: 2, backgroundColor: sticker.ink, opacity: 0.2 },
  dividerText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', color: sticker.inkMuted,
  },

  // ── Empty states ───────────────────────────────────────────────
  emptyState: {
    alignItems: 'center', paddingHorizontal: 40, paddingTop: 40,
  },
  emptyStateEmoji: { fontSize: 56, marginBottom: 12 },
  emptyStateTitle: {
    fontSize: 22, fontWeight: '700', letterSpacing: -0.6, color: sticker.ink,
    textTransform: 'uppercase', marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 14, color: sticker.inkMuted, textAlign: 'center', lineHeight: 20,
  },
  clearFiltersBtn: {
    marginTop: 16, backgroundColor: sticker.ink, borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  clearFiltersBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' },

  // ── FAB ────────────────────────────────────────────────────────
  fabWrapper: {
    position: 'absolute', right: 22, bottom: 22,
    marginBottom: S, marginRight: S,
  },
  fabShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 32,
  },
  fab: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: sticker.ink,
    borderWidth: 2.5, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  fabText: { fontSize: 32, color: '#fff', fontWeight: '300', lineHeight: 36 },

  // ── Add form ───────────────────────────────────────────────────
  addTopBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingTop: 8, paddingBottom: 18,
  },
  addCancelBtn: {
    backgroundColor: sticker.surface, borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
  },
  addCancelText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },
  addTopTitle: {
    fontSize: 20, fontWeight: '700', letterSpacing: -0.6, textTransform: 'uppercase', color: sticker.ink,
  },
  addSubmitBtn: {
    backgroundColor: sticker.ink, borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
  },
  addSubmitText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: '#fff' },
  addError: {
    marginHorizontal: 22, marginBottom: 10,
    backgroundColor: sticker.red, borderRadius: 10, borderWidth: 2, borderColor: sticker.ink,
    padding: 12, fontSize: 13, fontWeight: '600', color: '#fff',
  },

  addingToPill: {
    marginHorizontal: 22, marginBottom: 18,
    backgroundColor: sticker.cyan,
    borderWidth: 2, borderColor: sticker.ink, borderRadius: 12,
    padding: 14,
  },
  addingToLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: sticker.inkMuted },
  addingToBucketName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.4, color: sticker.ink },

  addIconCardWrapper: { marginHorizontal: 22, marginBottom: 18 + S, marginRight: 22 + S },
  addIconCardShadow: {
    position: 'absolute', top: S, left: S, right: 0, bottom: 0,
    backgroundColor: sticker.ink, borderRadius: 18,
  },
  addIconCard: {
    borderRadius: 18, borderWidth: 2.5, borderColor: sticker.ink, padding: 16,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  },
  addIconBtn: {
    width: 60, height: 60, borderRadius: 14,
    borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, position: 'relative',
    transform: [{ rotate: '-2deg' }],
  },
  addIconBadge: {
    position: 'absolute', bottom: -6, right: -6,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  addIconBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  addTitleInput: {
    flex: 1, fontSize: 18, fontWeight: '700', letterSpacing: -0.4,
    color: sticker.ink, paddingVertical: 12, textTransform: 'uppercase',
  },

  browseLibBtn: {
    marginHorizontal: 22, marginBottom: 16,
    backgroundColor: sticker.surface,
    borderWidth: 2, borderColor: sticker.ink, borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  browseLibText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },

  addSection: { paddingHorizontal: 22, marginBottom: 16 },
  addSectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', color: sticker.inkMuted, marginBottom: 10,
  },
  addField: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: sticker.surface, borderWidth: 2, borderColor: sticker.ink,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10,
  },
  addFieldInput: {
    flex: 1, fontSize: 12, fontWeight: '700', letterSpacing: 0.5,
    color: sticker.ink, textTransform: 'uppercase',
  },

  catPill: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 99, borderWidth: 2, borderColor: sticker.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  catPillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: sticker.ink },

  colorRowWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  colorRowLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: sticker.inkMuted, flexShrink: 0 },
  colorRowSwatches: { flexDirection: 'row', gap: 8 },
  colorDot: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: sticker.ink,
  },
  colorDotActive: {
    borderWidth: 3, borderColor: sticker.ink,
    transform: [{ scale: 1.2 }],
  },

  tagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 99, borderWidth: 2, borderColor: sticker.ink,
  },
  tagChipText: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2, color: sticker.ink },

  // ── Create bucket modal ────────────────────────────────────────
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(12,12,12,0.5)',
    justifyContent: 'flex-end',
  },
  modalFullOverlay: { flex: 1, backgroundColor: 'rgba(12,12,12,0.5)' },
  bucketSheet: {
    backgroundColor: sticker.bg,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    borderTopWidth: 2.5, borderLeftWidth: 2.5, borderRightWidth: 2.5,
    borderColor: sticker.ink,
    padding: 22, paddingBottom: 40,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: sticker.ink,
    alignSelf: 'center', marginBottom: 18, opacity: 0.3,
  },
  sheetTitle: {
    fontSize: 22, fontWeight: '700', letterSpacing: -0.6,
    textTransform: 'uppercase', color: sticker.ink, marginBottom: 16,
  },
  createError: {
    backgroundColor: sticker.red, borderRadius: 8, borderWidth: 2, borderColor: sticker.ink,
    padding: 10, marginBottom: 12, fontSize: 13, color: '#fff', fontWeight: '600',
  },
  emojiPill: {
    width: 52, height: 52, borderRadius: 12,
    borderWidth: 2, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: sticker.surface,
  },
  emojiPillActive: {
    borderColor: sticker.ink, borderWidth: 2.5,
    backgroundColor: sticker.yellow,
  },
  bucketNameInput: {
    backgroundColor: sticker.surface, borderWidth: 2.5, borderColor: sticker.ink,
    borderRadius: 12, padding: 14, marginBottom: 16,
    fontSize: 16, fontWeight: '700', color: sticker.ink,
  },
  createBtns: { flexDirection: 'row', gap: 10 },
  createBtn: {
    flex: 1, backgroundColor: sticker.ink, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: sticker.ink,
  },
  createBtnText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' },
  createCancelBtn: {
    flex: 1, backgroundColor: sticker.surface, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: sticker.ink,
  },
  createCancelText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: sticker.ink },
})
