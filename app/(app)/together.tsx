import { useState, useRef, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated, ScrollView,
} from 'react-native'
import { useStore } from '../../src/store'
import { supabase } from '../../src/lib/supabase'
import { sticker, getCatColor } from '../../src/design/sticker'
import { ItemWithDetails } from '../../src/types/database'
import { StickerIcon } from '../../src/components/StickerIcon'

const SHADOW = 4

export default function TogetherScreen() {
  const { buckets, activeBucketId, items: storeItems } = useStore()

  const [scope, setScope] = useState<'all' | string>('all')
  const [scopeItems, setScopeItems] = useState<ItemWithDetails[]>([])
  const [loadingScope, setLoadingScope] = useState(false)

  useEffect(() => {
    async function load() {
      if (buckets.length === 0) return
      setLoadingScope(true)
      const bucketIds = scope === 'all' ? buckets.map(b => b.id) : [scope]
      const { data: session } = await supabase.auth.getSession()
      const userId = session?.session?.user?.id
      const { data } = await supabase
        .from('items')
        .select('*, item_tags(user_id, profiles(*)), item_hearts(user_id)')
        .in('bucket_id', bucketIds)
        .eq('done', false)
      const mapped: ItemWithDetails[] = (data || []).map((item: any) => ({
        ...item,
        tagged_users: item.item_tags?.map((t: any) => t.profiles).filter(Boolean) || [],
        comments: [],
        photos: [],
        hearted_by_me: item.item_hearts?.some((h: any) => h.user_id === userId) || false,
        hearts: item.item_hearts?.length ?? 0,
      }))
      setScopeItems(mapped)
      setLoadingScope(false)
    }
    load()
  }, [scope, buckets.map(b => b.id).join(',')])

  const [picked, setPicked] = useState<ItemWithDetails | null>(null)
  const [spinning, setSpinning] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  const undone = scopeItems
  const mostWanted = scopeItems
    .filter(i => i.hearts > 0)
    .sort((a, b) => b.hearts - a.hearts)
    .slice(0, 5)

  const [statsTotal, setStatsTotal] = useState({ done: 0, todo: 0 })
  useEffect(() => {
    async function loadStats() {
      if (buckets.length === 0) return
      const bucketIds = scope === 'all' ? buckets.map(b => b.id) : [scope]
      const { data } = await supabase
        .from('items')
        .select('id, done')
        .in('bucket_id', bucketIds)
      const all = data || []
      setStatsTotal({ done: all.filter((i: any) => i.done).length, todo: all.filter((i: any) => !i.done).length })
    }
    loadStats()
  }, [scope, buckets.map(b => b.id).join(',')])

  const pct = (statsTotal.done + statsTotal.todo) > 0
    ? Math.round((statsTotal.done / (statsTotal.done + statsTotal.todo)) * 100)
    : 0

  function spin() {
    if (!undone.length || spinning) return
    setSpinning(true)
    setPicked(null)
    let count = 0
    const total = 8 + Math.floor(Math.random() * 5)
    const cycle = () => {
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.3, duration: 80, useNativeDriver: false }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 80, useNativeDriver: false }),
      ]).start(() => {
        const rand = undone[Math.floor(Math.random() * undone.length)]
        setPicked(rand)
        count++
        if (count < total) {
          cycle()
        } else {
          setSpinning(false)
          Animated.spring(scaleAnim, { toValue: 1.04, useNativeDriver: false })
            .start(() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: false }).start())
        }
      })
    }
    cycle()
  }

  useEffect(() => { setPicked(null) }, [scope])

  const pickedColor = picked ? getCatColor(picked.category_key) : sticker.yellow
  const pickedBucket = picked && scope === 'all'
    ? buckets.find(b => b.id === (picked as any).bucket_id)
    : null

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headlineRow}>
            <Text style={styles.headlineMain}>TO</Text>
            <View style={styles.headlineHighlight}>
              <Text style={styles.headlineHighlightText}>GETHER</Text>
            </View>
          </View>
          <Text style={styles.headlineSub}>PICK SOMETHING TO DO NEXT</Text>
        </View>

        {/* Scope picker */}
        {buckets.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scopeScroll}
            contentContainerStyle={styles.scopeRow}
          >
            {[{ id: 'all', emoji: '🌐', name: 'All buckets' }, ...buckets.map(b => ({ id: b.id, emoji: b.emoji, name: b.name }))].map(b => {
              const on = scope === b.id
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.scopeChip, on && styles.scopeChipActive]}
                  onPress={() => setScope(b.id as any)}
                >
                  <Text style={[styles.scopeChipText, on && styles.scopeChipTextActive]}>
                    {b.emoji} {b.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}

        {/* Stats */}
        <View style={styles.statsSection}>
          {[
            { num: statsTotal.done, label: 'DONE', color: sticker.lime },
            { num: statsTotal.todo, label: 'TO DO', color: sticker.cyan },
            { num: `${pct}%`, label: 'COMPLETE', color: sticker.pink },
          ].map((s, i) => (
            <View key={i} style={styles.statCardWrap}>
              <View style={styles.statCardShadow} />
              <View style={[styles.statCard, { backgroundColor: s.color }]}>
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Surprise Me */}
        <View style={styles.spinnerSection}>
          <View style={styles.spinnerHeadRow}>
            <Text style={styles.spinnerLabel}>SURPRISE ME!</Text>
            <Text style={styles.spinnerSub}>
              {scope === 'all'
                ? "Can't decide? Let fate pick."
                : `From ${buckets.find(b => b.id === scope)?.name ?? 'this bucket'}.`}
            </Text>
          </View>

          {undone.length === 0 ? (
            <View style={styles.allDoneWrap}>
              <View style={styles.allDoneShadow} />
              <View style={styles.allDoneCard}>
                <Text style={styles.allDoneEmoji}>🎉</Text>
                <Text style={styles.allDoneText}>
                  {loadingScope ? 'LOADING...' : 'NOTHING LEFT HERE!'}
                </Text>
                <Text style={styles.allDoneSub}>Add more ideas to your bucket</Text>
              </View>
            </View>
          ) : (
            <>
              <Animated.View
                style={[
                  styles.pickedCardWrap,
                  { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                ]}
              >
                <View style={[styles.pickedCardShadow, { backgroundColor: sticker.ink }]} />
                <View style={[styles.pickedCard, { backgroundColor: pickedColor }]}>
                  {picked ? (
                    <>
                      <View style={styles.pickedIconBox}>
                        <StickerIcon value={picked.emoji} size={44} />
                      </View>
                      <Text style={styles.pickedTitle}>{picked.title.toUpperCase()}</Text>
                      <View style={styles.pickedChip}>
                        <Text style={styles.pickedChipText}>
                          {picked.category_key.toUpperCase()}
                          {pickedBucket ? ` · ${pickedBucket.emoji} ${pickedBucket.name}` : ''}
                        </Text>
                      </View>
                      {picked.location ? (
                        <Text style={styles.pickedMeta}>📍 {picked.location}</Text>
                      ) : null}
                      {picked.tagged_users.length > 0 && (
                        <Text style={styles.pickedMeta}>
                          with {picked.tagged_users.map((u: any) => u.name.split(' ')[0]).join(' & ')}
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={styles.placeholderEmoji}>🎲</Text>
                      <Text style={styles.placeholderText}>TAP BELOW TO PICK!</Text>
                    </>
                  )}
                </View>
              </Animated.View>

              <View style={styles.spinBtnWrap}>
                <View style={styles.spinBtnShadow} />
                <TouchableOpacity
                  style={[styles.spinBtn, spinning && { opacity: 0.6 }]}
                  onPress={spin}
                  disabled={spinning}
                >
                  <Text style={styles.spinBtnText}>
                    {spinning ? 'PICKING...' : picked ? 'PICK AGAIN 🎲' : 'PICK FOR US 🎲'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Most wanted */}
        {(mostWanted.length > 0 || scopeItems.length > 0) && (
          <View style={styles.wantedSection}>
            <Text style={styles.wantedTitle}>MOST WANTED ♥</Text>
            {mostWanted.length === 0 ? (
              <Text style={styles.noWanted}>
                Heart the items you're most excited about — they'll appear here!
              </Text>
            ) : (
              mostWanted.map((item, idx) => {
                const accent = getCatColor(item.category_key)
                const itemBucket = scope === 'all' ? buckets.find(b => b.id === (item as any).bucket_id) : null
                return (
                  <View key={item.id} style={styles.wantedRowWrap}>
                    <View style={styles.wantedRowShadow} />
                    <View style={[styles.wantedRow, { borderLeftColor: accent, borderLeftWidth: 5 }]}>
                      <View style={[styles.wantedIconBox, { backgroundColor: accent }]}>
                        <StickerIcon value={item.emoji} size={22} />
                      </View>
                      <View style={styles.wantedInfo}>
                        <Text style={styles.wantedItemTitle}>{item.title.toUpperCase()}</Text>
                        <Text style={styles.wantedCat}>
                          {item.category_key.toUpperCase()}{itemBucket ? ` · ${itemBucket.emoji} ${itemBucket.name}` : ''}
                        </Text>
                      </View>
                      <View style={[styles.heartsChip, { backgroundColor: sticker.pink }]}>
                        <Text style={styles.heartsText}>♥ {item.hearts}</Text>
                      </View>
                    </View>
                  </View>
                )
              })
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: sticker.bg },
  scroll: { paddingBottom: 40 },

  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: sticker.ink,
  },
  headlineRow: { flexDirection: 'row', alignItems: 'flex-end' },
  headlineMain: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2.2,
    lineHeight: 56,
    color: sticker.ink,
    textTransform: 'uppercase',
  },
  headlineHighlight: {
    backgroundColor: sticker.yellow,
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

  scopeScroll: { borderBottomWidth: 2, borderBottomColor: sticker.ink },
  scopeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  scopeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: sticker.ink,
    backgroundColor: sticker.surface,
  },
  scopeChipActive: { backgroundColor: sticker.ink },
  scopeChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.ink,
  },
  scopeChipTextActive: { color: sticker.bg },

  statsSection: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: sticker.ink,
  },
  statCardWrap: { flex: 1, marginBottom: SHADOW, marginRight: SHADOW },
  statCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  statCard: {
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNum: { fontSize: 26, fontWeight: '700', letterSpacing: -1, color: sticker.ink },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: sticker.ink, marginTop: 2 },

  spinnerSection: { padding: 20, borderBottomWidth: 2, borderBottomColor: sticker.ink },
  spinnerHeadRow: { marginBottom: 18 },
  spinnerLabel: { fontSize: 22, fontWeight: '700', letterSpacing: -0.8, color: sticker.ink },
  spinnerSub: { fontSize: 12, fontWeight: '500', color: sticker.inkMuted, marginTop: 4 },

  pickedCardWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  pickedCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    borderRadius: 20,
  },
  pickedCard: {
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 28,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    marginBottom: 16,
  },
  pickedIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pickedEmoji: { fontSize: 36 },
  pickedTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: sticker.ink,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  pickedChip: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: sticker.ink,
    marginBottom: 8,
  },
  pickedChipText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: sticker.ink },
  pickedMeta: { fontSize: 11, fontWeight: '500', color: sticker.inkMuted, marginTop: 4, fontStyle: 'italic' },
  placeholderEmoji: { fontSize: 52, marginBottom: 14 },
  placeholderText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, color: sticker.inkMuted },

  spinBtnWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  spinBtnShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  spinBtn: {
    backgroundColor: sticker.ink,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
    paddingVertical: 16,
    alignItems: 'center',
  },
  spinBtnText: { color: sticker.bg, fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },

  allDoneWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  allDoneShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 20,
  },
  allDoneCard: {
    backgroundColor: sticker.lime,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 32,
    alignItems: 'center',
  },
  allDoneEmoji: { fontSize: 52, marginBottom: 12 },
  allDoneText: { fontSize: 18, fontWeight: '700', letterSpacing: -0.5, color: sticker.ink, marginBottom: 6 },
  allDoneSub: { fontSize: 13, fontWeight: '500', color: sticker.inkMuted },

  wantedSection: { padding: 20 },
  wantedTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: sticker.ink,
    marginBottom: 14,
  },
  wantedRowWrap: { marginBottom: 10, marginRight: SHADOW },
  wantedRowShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  wantedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: sticker.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
    padding: 12,
  },
  wantedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  wantedEmoji: { fontSize: 22 },
  wantedInfo: { flex: 1 },
  wantedItemTitle: { fontSize: 12, fontWeight: '700', color: sticker.ink, marginBottom: 2 },
  wantedCat: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: sticker.inkMuted },
  heartsChip: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
  heartsText: { fontSize: 11, fontWeight: '700', color: sticker.ink },
  noWanted: {
    fontSize: 13,
    fontWeight: '500',
    color: sticker.inkMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
})
