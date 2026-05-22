import { useState, useCallback } from 'react'
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl, Alert
} from 'react-native'
import { useStore, useFilteredItems } from '../../src/store'
import { supabase } from '../../src/lib/supabase'
import { ItemWithDetails } from '../../src/types/database'

// ── Colour helpers ─────────────────────────────────────────────
const CAT_COLORS: Record<string, { accent: string; bg: string; dark: string }> = {
  travel:    { accent: '#BA7517', bg: '#FAEEDA', dark: '#633806' },
  food:      { accent: '#993C1D', bg: '#FAECE7', dark: '#4A1B0C' },
  adventure: { accent: '#534AB7', bg: '#EEEDFE', dark: '#26215C' },
  wellness:  { accent: '#0F6E56', bg: '#E1F5EE', dark: '#04342C' },
}
function getCat(key: string) {
  return CAT_COLORS[key] || { accent: '#888', bg: '#eee', dark: '#333' }
}

// ── Item card ──────────────────────────────────────────────────
function ItemCard({ item, onPress }: { item: ItemWithDetails; onPress: () => void }) {
  const { toggleHeart, profile } = useStore()
  const c = getCat(item.category_key)

  return (
    <TouchableOpacity style={[styles.card, item.done && styles.cardDone]} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.accent, { backgroundColor: item.done ? c.accent : c.accent + '88' }]} />
      <View style={styles.cardRow}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, item.done && styles.cardTitleDone]}>
            {item.done ? '✓ ' : ''}{item.title}
          </Text>
          <Text style={[styles.cardCat, { color: c.accent }]}>{item.category_key}</Text>
          {item.tagged_users.length > 0 && (
            <Text style={styles.tagged}>
              {item.tagged_users.map(u => u.name.split(' ')[0]).join(', ')}
            </Text>
          )}
          {item.location ? (
            <Text style={styles.location}>📍 {item.location}</Text>
          ) : null}
        </View>
        <View style={styles.cardRight}>
          <TouchableOpacity
            onPress={() => toggleHeart(item.id)}
            style={styles.heartBtn}
          >
            <Text style={[styles.heartText, item.hearted_by_me && styles.heartActive]}>
              ♥ {item.hearts}
            </Text>
          </TouchableOpacity>
          {item.comments.length > 0 && (
            <Text style={styles.commentCount}>💬 {item.comments.length}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ── Main screen ────────────────────────────────────────────────
export default function BucketScreen() {
  const {
    activeBucketId, getActiveBucket, profile,
    fetchItems, setSearchQuery, searchQuery,
    catFilter, setCatFilter, showDone, setShowDone,
    addItem,
  } = useStore()

  const filteredItems = useFilteredItems()
  const bucket = getActiveBucket()
  const allItems = useStore(s => s.items)
  const todo = filteredItems.filter(i => !i.done)
  const done = filteredItems.filter(i => i.done)
  const pct = allItems.length ? Math.round((allItems.filter(i => i.done).length / allItems.length) * 100) : 0

  const [refreshing, setRefreshing] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat] = useState('adventure')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (activeBucketId) await fetchItems(activeBucketId)
    setRefreshing(false)
  }, [activeBucketId])

  async function submitAdd() {
    if (!newTitle.trim() || !activeBucketId || !profile) return
    const emojis: Record<string, string> = { travel: '✈️', food: '🍴', adventure: '⚡', wellness: '🌿' }

    const { data, error } = await supabase
      .from('items')
      .insert({
        bucket_id: activeBucketId,
        title: newTitle.trim(),
        category_key: newCat,
        emoji: emojis[newCat] || '⭐',
        created_by: profile.id,
      })
      .select('*, item_tags(user_id, profiles(*)), comments(*, profiles(*)), item_photos(*), item_hearts(user_id)')
      .single()

    if (!error && data) {
      addItem({ ...data, tagged_users: [], comments: [], photos: [], hearted_by_me: false })

      // Log activity
      await supabase.from('activity').insert({
        bucket_id: activeBucketId,
        user_id: profile.id,
        action: 'added',
        item_id: data.id,
        item_title: data.title,
        emoji: emojis[newCat] || '⭐',
      })

      setNewTitle('')
      setAddingNew(false)
    }
  }

  const usedCats = [...new Set(allItems.map(i => i.category_key))]

  const data: any[] = [
    { type: 'header' },
    { type: 'search' },
    { type: 'filters' },
    ...todo.map(i => ({ type: 'item', item: i })),
    { type: 'done-header' },
    ...(showDone ? done.map(i => ({ type: 'item', item: i, isDoneSection: true })) : []),
    { type: 'add' },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, i) => item.item?.id || item.type + i}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item: row }) => {
          if (row.type === 'header') return (
            <View style={styles.header}>
              <Text style={styles.title}>{bucket ? `${bucket.emoji} ${bucket.name}` : 'The Bucket'}</Text>
              <Text style={styles.subtitle}>{allItems.filter(i => i.done).length} of {allItems.length} ticked off</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
            </View>
          )

          if (row.type === 'search') return (
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search your bucket..."
                placeholderTextColor="#bbb"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )

          if (row.type === 'filters') return (
            <View style={styles.filterRow}>
              {usedCats.map(key => {
                const c = getCat(key)
                const active = catFilter === key
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.filterChip, active && { backgroundColor: c.bg, borderColor: c.accent }]}
                    onPress={() => setCatFilter(key)}
                  >
                    <Text style={[styles.filterChipText, active && { color: c.dark, fontWeight: '600' }]}>
                      {key}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          )

          if (row.type === 'item') return (
            <View style={row.isDoneSection ? { opacity: 0.65 } : undefined}>
              <ItemCard
                item={row.item}
                onPress={() => setExpandedId(expandedId === row.item.id ? null : row.item.id)}
              />
              {expandedId === row.item.id && (
                <ItemDetail item={row.item} onClose={() => setExpandedId(null)} />
              )}
            </View>
          )

          if (row.type === 'done-header') return done.length ? (
            <TouchableOpacity
              style={styles.sectionDivider}
              onPress={() => setShowDone(!showDone)}
            >
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{showDone ? '▾' : '▸'} Done ({done.length})</Text>
              <View style={styles.dividerLine} />
            </TouchableOpacity>
          ) : null

          if (row.type === 'add') return (
            <View style={styles.addArea}>
              {addingNew ? (
                <View style={styles.addForm}>
                  <TextInput
                    style={styles.addInput}
                    placeholder="What do you want to tick off?"
                    placeholderTextColor="#bbb"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    autoFocus
                    onSubmitEditing={submitAdd}
                  />
                  <View style={styles.catRow}>
                    {['travel', 'food', 'adventure', 'wellness'].map(cat => {
                      const c = getCat(cat)
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.catPill, newCat === cat && { backgroundColor: c.bg, borderColor: c.accent }]}
                          onPress={() => setNewCat(cat)}
                        >
                          <Text style={[styles.catPillText, newCat === cat && { color: c.dark }]}>{cat}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                  <View style={styles.addBtns}>
                    <TouchableOpacity style={styles.addSubmit} onPress={submitAdd}>
                      <Text style={styles.addSubmitText}>Add to bucket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addCancel} onPress={() => setAddingNew(false)}>
                      <Text style={styles.addCancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={styles.addTrigger} onPress={() => setAddingNew(true)}>
                  <Text style={styles.addTriggerText}>+ Add to bucket</Text>
                </TouchableOpacity>
              )}
            </View>
          )

          return null
        }}
      />
    </SafeAreaView>
  )
}

// ── Item detail (expanded) ─────────────────────────────────────
function ItemDetail({ item, onClose }: { item: ItemWithDetails; onClose: () => void }) {
  const { markItemDone, addComment, profile } = useStore()
  const [comment, setComment] = useState('')

  async function submitComment() {
    if (!comment.trim()) return
    await addComment(item.id, comment)
    setComment('')
  }

  return (
    <View style={styles.detail}>
      {item.memory_note && (
        <Text style={styles.memoryNote}>"{item.memory_note}"</Text>
      )}
      {item.location && (
        <Text style={styles.detailLocation}>📍 {item.location}</Text>
      )}

      {/* Comments */}
      {item.comments.map((c: any) => (
        <View key={c.id} style={styles.commentRow}>
          <View style={[styles.commentAv, { backgroundColor: '#FAEEDA' }]}>
            <Text style={{ fontSize: 10, color: '#633806', fontWeight: '600' }}>
              {c.profiles?.name?.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.commentBubble}>
            <Text style={styles.commentName}>{c.profiles?.name}</Text>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        </View>
      ))}

      <View style={styles.commentInput}>
        <TextInput
          style={styles.commentBox}
          placeholder="Add a comment..."
          placeholderTextColor="#bbb"
          value={comment}
          onChangeText={setComment}
          onSubmitEditing={submitComment}
        />
        <TouchableOpacity onPress={submitComment} style={styles.sendBtn}>
          <Text style={{ color: '#BA7517', fontSize: 18 }}>➤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailBtns}>
        {!item.done && (
          <TouchableOpacity
            style={[styles.detailBtn, styles.detailBtnPrimary]}
            onPress={() => { markItemDone(item.id); onClose() }}
          >
            <Text style={styles.detailBtnPrimaryText}>✓ Mark done</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.detailBtn} onPress={onClose}>
          <Text style={styles.detailBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function useState(init: string): [string, (v: string) => void] {
  return require('react').useState(init)
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 10 },
  progressBar: { height: 3, backgroundColor: '#f0f0f0', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: '#BA7517', borderRadius: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 12, marginBottom: 8, backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111' },
  clearBtn: { color: '#999', fontSize: 14, padding: 4 },
  filterRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, marginBottom: 8, flexWrap: 'wrap' },
  filterChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 0.5, borderColor: '#ddd' },
  filterChipText: { fontSize: 12, color: '#888' },
  card: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#eee', borderRadius: 14, padding: 14, marginHorizontal: 12, marginBottom: 8, flexDirection: 'row', position: 'relative', overflow: 'hidden' },
  cardDone: { backgroundColor: '#fafafa' },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingLeft: 8 },
  emoji: { fontSize: 20, marginRight: 10, marginTop: 2 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, color: '#111', marginBottom: 2 },
  cardTitleDone: { color: '#999', textDecorationLine: 'line-through' },
  cardCat: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  tagged: { fontSize: 11, color: '#aaa', marginTop: 2 },
  location: { fontSize: 11, color: '#aaa', marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  heartBtn: { padding: 4 },
  heartText: { fontSize: 13, color: '#ccc' },
  heartActive: { color: '#D4537E' },
  commentCount: { fontSize: 11, color: '#bbb' },
  sectionDivider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginVertical: 8, gap: 8 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#eee' },
  dividerText: { fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 },
  addArea: { margin: 12, marginTop: 8 },
  addForm: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ddd', borderRadius: 14, padding: 14 },
  addInput: { fontSize: 14, color: '#111', borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 12 },
  catRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  catPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 0.5, borderColor: '#ddd' },
  catPillText: { fontSize: 12, color: '#888' },
  addBtns: { flexDirection: 'row', gap: 8 },
  addSubmit: { flex: 1, backgroundColor: '#FAEEDA', borderRadius: 10, borderWidth: 0.5, borderColor: '#BA7517', padding: 10, alignItems: 'center' },
  addSubmitText: { color: '#BA7517', fontSize: 13, fontWeight: '600' },
  addCancel: { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 10, padding: 10, paddingHorizontal: 14 },
  addCancelText: { color: '#888', fontSize: 13 },
  addTrigger: { borderWidth: 0.5, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 14, padding: 16, alignItems: 'center' },
  addTriggerText: { color: '#aaa', fontSize: 13 },
  detail: { backgroundColor: '#fafafa', marginHorizontal: 12, marginTop: -8, marginBottom: 8, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: '#eee', borderTopWidth: 0 },
  memoryNote: { fontSize: 13, color: '#888', fontStyle: 'italic', borderLeftWidth: 2, borderLeftColor: '#ddd', paddingLeft: 10, marginBottom: 10 },
  detailLocation: { fontSize: 12, color: '#aaa', marginBottom: 10 },
  commentRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  commentAv: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  commentBubble: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 8 },
  commentName: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  commentText: { fontSize: 13, color: '#555' },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  commentBox: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, fontSize: 13, borderWidth: 0.5, borderColor: '#eee', color: '#111' },
  sendBtn: { padding: 4 },
  detailBtns: { flexDirection: 'row', gap: 8 },
  detailBtn: { flex: 1, borderWidth: 0.5, borderColor: '#ddd', borderRadius: 10, padding: 10, alignItems: 'center' },
  detailBtnPrimary: { borderColor: '#BA7517', backgroundColor: '#FAEEDA' },
  detailBtnPrimaryText: { color: '#BA7517', fontSize: 13, fontWeight: '600' },
  detailBtnText: { color: '#888', fontSize: 13 },
})
