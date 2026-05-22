import { useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { useStore } from '../../src/store'
import { formatDistanceToNow } from 'date-fns'

const AVCOLORS = [
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#E1F5EE', color: '#04342C' },
  { bg: '#EEEDFE', color: '#26215C' },
  { bg: '#FBEAF0', color: '#4B1528' },
  { bg: '#E6F1FB', color: '#042C53' },
]

const ACTION_LABELS: Record<string, string> = {
  added: 'added',
  done: 'ticked off',
  commented: 'commented on',
  hearted: 'hearted',
  joined: 'joined the bucket',
  invited: 'was invited to',
  photo_added: 'added a photo to',
}

export default function ActivityScreen() {
  const { activity, setUnreadActivity } = useStore()

  // Mark as read when screen opens
  useEffect(() => { setUnreadActivity(0) }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>What's been happening</Text>
      </View>

      {activity.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No activity yet</Text>
          <Text style={styles.emptySubtext}>Add items and invite friends to get started</Text>
        </View>
      ) : (
        <FlatList
          data={activity}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const profile = (item as any).profiles
            const colorIdx = profile?.avatar_color ?? 0
            const ac = AVCOLORS[colorIdx % AVCOLORS.length]
            const initials = profile?.name?.slice(0, 2).toUpperCase() ?? '??'
            const timeAgo = (() => {
              try {
                return formatDistanceToNow(new Date(item.created_at), { addSuffix: true })
              } catch {
                return 'recently'
              }
            })()

            return (
              <View style={styles.feedItem}>
                <View style={[styles.avatar, { backgroundColor: ac.bg }]}>
                  <Text style={[styles.avatarText, { color: ac.color }]}>{initials}</Text>
                </View>
                <View style={styles.feedContent}>
                  <Text style={styles.feedText}>
                    <Text style={styles.feedName}>{profile?.name ?? 'Someone'}</Text>
                    {' '}{ACTION_LABELS[item.action] ?? item.action}{' '}
                    {item.item_title ? (
                      <Text style={styles.feedItemName}>{item.item_title}</Text>
                    ) : null}
                  </Text>
                  <Text style={styles.feedTime}>{timeAgo}</Text>
                </View>
                <Text style={styles.feedEmoji}>{item.emoji ?? '•'}</Text>
              </View>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#888' },
  list: { padding: 12 },
  feedItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 12, fontWeight: '600' },
  feedContent: { flex: 1 },
  feedText: { fontSize: 13, lineHeight: 19, color: '#333' },
  feedName: { fontWeight: '600', color: '#111' },
  feedItemName: { fontWeight: '500', color: '#111' },
  feedTime: { fontSize: 11, color: '#bbb', marginTop: 2 },
  feedEmoji: { fontSize: 18, marginTop: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 15, color: '#bbb', fontStyle: 'italic', marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: '#ccc', textAlign: 'center' },
})
