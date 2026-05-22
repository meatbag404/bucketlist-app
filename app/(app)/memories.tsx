import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, Image, ActivityIndicator, Modal,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../src/lib/supabase'
import { useStore } from '../../src/store'
import { sticker, getCatColor } from '../../src/design/sticker'
import { StickerIcon } from '../../src/components/StickerIcon'
import { format, parseISO } from 'date-fns'

type Memory = {
  id: string
  title: string
  emoji: string
  category_key: string
  done_at: string | null
  done_by: string | null
  memory_note: string | null
  bucket_name: string
  bucket_emoji: string
  photos: Array<{ id: string; storage_path: string }>
  done_by_name?: string
}

const TILT_OPTS = ['-1.2deg', '0deg', '1deg', '-0.5deg', '1.5deg']

function PhotoThumb({ storagePath, onPress, tilt }: { storagePath: string; onPress: (uri: string) => void; tilt: string }) {
  const [uri, setUri] = useState<string | null>(null)

  useEffect(() => {
    supabase.storage.from('item-photos').createSignedUrl(storagePath, 3600)
      .then(({ data }) => { if (data?.signedUrl) setUri(data.signedUrl) })
  }, [storagePath])

  if (!uri) {
    return (
      <View style={[styles.photoPlaceholderWrap, { transform: [{ rotate: tilt }] }]}>
        <View style={styles.photoPlaceholderShadow} />
        <View style={styles.photoPlaceholder} />
      </View>
    )
  }
  return (
    <TouchableOpacity
      onPress={() => onPress(uri)}
      activeOpacity={0.85}
      style={[styles.photoWrap, { transform: [{ rotate: tilt }] }]}
    >
      <View style={styles.photoShadow} />
      <View style={styles.photoFrame}>
        <Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  )
}

function PhotoViewer({ uri, onClose }: { uri: string | null; onClose: () => void }) {
  if (!uri) return null
  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.viewerOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject as any} onPress={onClose} activeOpacity={1} />
        <Image source={{ uri }} style={styles.viewerImage} resizeMode="contain" />
        <View style={styles.viewerCloseWrap}>
          <View style={styles.viewerCloseShadow} />
          <TouchableOpacity style={styles.viewerClose} onPress={onClose}>
            <Text style={styles.viewerCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function groupByMonth(memories: Memory[]) {
  const groups: { title: string; data: Memory[] }[] = []
  const seenMonths = new Map<string, Memory[]>()
  for (const m of memories) {
    const monthKey = m.done_at ? format(parseISO(m.done_at), 'MMMM yyyy') : 'Unknown date'
    if (!seenMonths.has(monthKey)) {
      seenMonths.set(monthKey, [])
      groups.push({ title: monthKey, data: seenMonths.get(monthKey)! })
    }
    seenMonths.get(monthKey)!.push(m)
  }
  return groups
}

export default function MemoriesScreen() {
  const { buckets } = useStore()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const bucketIds = buckets.map(b => b.id)
      if (bucketIds.length === 0) { setLoading(false); return }

      const { data, error } = await supabase
        .from('items')
        .select(`
          id, title, emoji, category_key, done_at, done_by, memory_note,
          item_photos ( id, storage_path ),
          buckets ( name, emoji ),
          profiles:done_by ( name )
        `)
        .eq('done', true)
        .in('bucket_id', bucketIds)
        .order('done_at', { ascending: false })

      if (error) { console.error('fetchMemories:', error); setLoading(false); return }

      const mapped: Memory[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        emoji: row.emoji,
        category_key: row.category_key,
        done_at: row.done_at,
        done_by: row.done_by,
        memory_note: row.memory_note,
        bucket_name: row.buckets?.name || '',
        bucket_emoji: row.buckets?.emoji || '🪣',
        photos: row.item_photos || [],
        done_by_name: row.profiles?.name,
      }))

      setMemories(mapped)
      setLoading(false)
    }
    load()
  }, [buckets.map(b => b.id).join(',')])

  const groups = groupByMonth(memories)
  const listData: Array<{ type: 'month'; label: string } | { type: 'memory'; memory: Memory }> = []
  for (const group of groups) {
    listData.push({ type: 'month', label: group.title })
    for (const m of group.data) {
      listData.push({ type: 'memory', memory: m })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <PhotoViewer uri={viewingPhoto} onClose={() => setViewingPhoto(null)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <View style={styles.headlineRow}>
          <Text style={styles.headlineMain}>MEMO</Text>
          <View style={styles.headlineHighlight}>
            <Text style={styles.headlineHighlightText}>RIES</Text>
          </View>
        </View>
        <Text style={styles.headlineSub}>YOUR COMPLETED ADVENTURES</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={sticker.ink} />
        </View>
      ) : memories.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptySticker}>
            <View style={styles.emptyStickerShadow} />
            <View style={styles.emptyStickerCard}>
              <Text style={styles.emptyEmoji}>🏆</Text>
              <Text style={styles.emptyTitle}>NO MEMORIES YET</Text>
              <Text style={styles.emptySubtitle}>
                When you tick off items from your bucket, they'll appear here.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, i) =>
            item.type === 'month' ? `month-${item.label}` : `memory-${(item as any).memory.id}`
          }
          contentContainerStyle={styles.list}
          renderItem={({ item: row }) => {
            if (row.type === 'month') {
              return (
                <View style={styles.monthChipWrap}>
                  <View style={styles.monthChip}>
                    <Text style={styles.monthChipText}>{row.label.toUpperCase()}</Text>
                  </View>
                </View>
              )
            }

            const m = (row as any).memory as Memory
            const accent = getCatColor(m.category_key)
            const dateStr = m.done_at ? format(parseISO(m.done_at), 'MMM d') : ''
            const tiltIdx = m.id.charCodeAt(0) % TILT_OPTS.length

            return (
              <View style={[styles.cardWrap, { transform: [{ rotate: TILT_OPTS[tiltIdx] }] }]}>
                <View style={styles.cardShadow} />
                <View style={[styles.card, { borderTopColor: accent, borderTopWidth: 5 }]}>
                  {/* Top row */}
                  <View style={styles.cardTop}>
                    <View style={[styles.iconBox, { backgroundColor: accent }]}>
                      <StickerIcon value={m.emoji} size={26} />
                    </View>
                    <View style={styles.cardMeta}>
                      <Text style={styles.cardTitle}>{m.title.toUpperCase()}</Text>
                      <View style={styles.metaRow}>
                        <View style={[styles.bucketChip, { backgroundColor: accent, flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
                          <StickerIcon value={m.bucket_emoji} size={12} />
                          <Text style={styles.bucketChipText}>{m.bucket_name.toUpperCase()}</Text>
                        </View>
                        {dateStr ? (
                          <Text style={styles.dateText}>
                            {m.done_by_name ? `${m.done_by_name.split(' ')[0].toUpperCase()} · ` : ''}{dateStr.toUpperCase()}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <Text style={styles.doneStamp}>✓ DONE</Text>
                  </View>

                  {m.memory_note ? (
                    <View style={styles.noteBox}>
                      <Text style={styles.noteText}>"{m.memory_note}"</Text>
                    </View>
                  ) : null}

                  {m.photos.length > 0 && (
                    <View style={styles.photosRow}>
                      {m.photos.map((p, pi) => (
                        <PhotoThumb
                          key={p.id}
                          storagePath={p.storage_path}
                          onPress={setViewingPhoto}
                          tilt={TILT_OPTS[(pi + 1) % TILT_OPTS.length]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const SHADOW = 4

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: sticker.bg },

  header: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: sticker.ink,
  },
  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: sticker.surface,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  backText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: sticker.ink },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headlineMain: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2.2,
    lineHeight: 56,
    color: sticker.ink,
    textTransform: 'uppercase',
  },
  headlineHighlight: {
    backgroundColor: sticker.pink,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 4,
    transform: [{ rotate: '-2deg' }],
    marginLeft: 4,
    marginBottom: 6,
  },
  headlineHighlightText: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2.2,
    lineHeight: 60,
    color: sticker.ink,
  },
  headlineSub: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: sticker.inkMuted,
  },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptySticker: { marginBottom: SHADOW, marginRight: SHADOW },
  emptyStickerShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 20,
  },
  emptyStickerCard: {
    backgroundColor: sticker.cyan,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 28,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: sticker.ink,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: sticker.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
  },

  list: { paddingHorizontal: 20, paddingBottom: 60, paddingTop: 16 },

  monthChipWrap: { marginBottom: 16, marginTop: 8 },
  monthChip: {
    alignSelf: 'flex-start',
    backgroundColor: sticker.ink,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  monthChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: sticker.bg,
  },

  cardWrap: { marginBottom: 14, marginRight: SHADOW },
  cardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 16,
  },
  card: {
    backgroundColor: sticker.surface,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 14,
    overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardEmoji: { fontSize: 26 },
  cardMeta: { flex: 1 },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: sticker.ink,
    marginBottom: 6,
    lineHeight: 16,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  bucketChip: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
  bucketChipText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.ink,
  },
  dateText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.inkMuted,
  },
  doneStamp: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: sticker.surface,
    backgroundColor: sticker.ink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  noteBox: {
    backgroundColor: sticker.bg,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: sticker.ink,
    padding: 10,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: sticker.inkMuted,
    lineHeight: 18,
  },

  photosRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', paddingTop: 4 },

  photoWrap: { marginBottom: 3, marginRight: 3 },
  photoShadow: {
    position: 'absolute',
    top: 3, left: 3, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 10,
  },
  photoFrame: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: sticker.ink,
    overflow: 'hidden',
  },
  photoThumb: { width: 88, height: 88 },

  photoPlaceholderWrap: { marginBottom: 3, marginRight: 3 },
  photoPlaceholderShadow: {
    position: 'absolute',
    top: 3, left: 3, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 10,
  },
  photoPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: sticker.ink,
    backgroundColor: sticker.surface,
  },

  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12,12,12,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: { width: '100%', height: '80%' },
  viewerCloseWrap: {
    position: 'absolute',
    top: 52,
    right: 20,
    marginBottom: 3,
    marginRight: 3,
  },
  viewerCloseShadow: {
    position: 'absolute',
    top: 3, left: 3, right: 0, bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 18,
  },
  viewerClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: sticker.ink,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerCloseText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
