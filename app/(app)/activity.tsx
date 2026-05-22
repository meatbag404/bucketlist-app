import { useEffect } from 'react'
import { View, Text, SectionList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useStore } from '../../src/store'
import { sticker } from '../../src/design/sticker'
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, format, parseISO } from 'date-fns'

const AV_COLORS = [
  { bg: '#7DDCFF', text: '#0C0C0C' },
  { bg: '#C7F356', text: '#0C0C0C' },
  { bg: '#FF7AB6', text: '#0C0C0C' },
  { bg: '#FFD43B', text: '#0C0C0C' },
  { bg: '#5C7BFF', text: '#fff' },
  { bg: '#FF6B5A', text: '#fff' },
]

const ACTION_LABELS: Record<string, string> = {
  added:       'added',
  done:        'ticked off',
  commented:   'commented on',
  hearted:     'hearted',
  joined:      'joined the bucket',
  invited:     'was invited to',
  photo_added: 'added a photo to',
}

const ACTION_EMOJI: Record<string, string> = {
  added: '✨', done: '✅', commented: '💬', hearted: '❤️',
  joined: '🎉', invited: '📨', photo_added: '📸',
}

function dayLabel(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    if (isToday(d)) return 'Today'
    if (isYesterday(d)) return 'Yesterday'
    if (isThisWeek(d)) return format(d, 'EEEE')
    return format(d, 'MMMM d')
  } catch {
    return 'Earlier'
  }
}

export default function ActivityScreen() {
  const { activity, setUnreadActivity } = useStore()

  useEffect(() => { setUnreadActivity(0) }, [])

  const sections: { title: string; data: typeof activity }[] = []
  const seen = new Map<string, typeof activity>()
  for (const item of activity) {
    const label = dayLabel(item.created_at)
    if (!seen.has(label)) {
      seen.set(label, [])
      sections.push({ title: label, data: seen.get(label)! })
    }
    seen.get(label)!.push(item)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.titleBig}>ACTIVITY</Text>
          <Text style={styles.titleSub}>WHAT'S BEEN HAPPENING</Text>
        </View>
      </View>

      {activity.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptySticker}>
            <View style={styles.emptyStickerShadow} />
            <View style={styles.emptyStickerCard}>
              <Text style={styles.emptyEmoji}>💤</Text>
              <Text style={styles.emptyTitle}>NO ACTIVITY YET</Text>
              <Text style={styles.emptySub}>Add items and invite friends to get started</Text>
            </View>
          </View>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.dayChipWrap}>
              <View style={styles.dayChip}>
                <Text style={styles.dayChipText}>{section.title.toUpperCase()}</Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => {
            const profile = (item as any).profiles
            const colorIdx = (profile?.avatar_color ?? 0) % AV_COLORS.length
            const ac = AV_COLORS[colorIdx]
            const initials = profile?.name?.slice(0, 2).toUpperCase() ?? '??'
            const timeAgo = (() => {
              try { return formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) }
              catch { return 'recently' }
            })()
            const actionEmoji = ACTION_EMOJI[item.action] ?? '•'

            return (
              <View style={styles.feedWrap}>
                <View style={styles.feedShadow} />
                <View style={styles.feedCard}>
                  <View style={[styles.avatar, { backgroundColor: ac.bg }]}>
                    <Text style={[styles.avatarText, { color: ac.text }]}>{initials}</Text>
                  </View>
                  <View style={styles.feedContent}>
                    <Text style={styles.feedText}>
                      <Text style={styles.feedName}>{profile?.name ?? 'Someone'}</Text>
                      {' '}{ACTION_LABELS[item.action] ?? item.action}
                      {item.item_title ? (
                        <Text style={styles.feedItemName}> "{item.item_title}"</Text>
                      ) : null}
                    </Text>
                    <Text style={styles.feedTime}>{timeAgo.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.feedEmoji}>{actionEmoji}</Text>
                </View>
              </View>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

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
    marginBottom: 14,
    alignSelf: 'flex-start',
    backgroundColor: sticker.surface,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: sticker.ink,
  },
  headerTitle: {},
  titleBig: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 46,
    color: sticker.ink,
    textTransform: 'uppercase',
  },
  titleSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: sticker.inkMuted,
    marginTop: 4,
  },

  list: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  dayChipWrap: { marginBottom: 12, marginTop: 4 },
  dayChip: {
    alignSelf: 'flex-start',
    backgroundColor: sticker.ink,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dayChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: sticker.bg,
  },

  feedWrap: { marginBottom: 10, marginRight: 4 },
  feedShadow: {
    position: 'absolute',
    top: 4, left: 4, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  feedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: sticker.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
    padding: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: sticker.ink,
    flexShrink: 0,
  },
  avatarText: { fontSize: 13, fontWeight: '700' },
  feedContent: { flex: 1 },
  feedText: { fontSize: 13, lineHeight: 18, color: sticker.ink },
  feedName: { fontWeight: '700', color: sticker.ink },
  feedItemName: { fontWeight: '700', color: sticker.inkMuted },
  feedTime: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: sticker.inkMuted,
    marginTop: 4,
  },
  feedEmoji: { fontSize: 22 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptySticker: { marginBottom: 4, marginRight: 4 },
  emptyStickerShadow: {
    position: 'absolute',
    top: 4, left: 4, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 20,
  },
  emptyStickerCard: {
    backgroundColor: sticker.yellow,
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
  emptySub: {
    fontSize: 13,
    fontWeight: '500',
    color: sticker.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
})
