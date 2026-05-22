import { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useStore } from '../../src/store'
import { useRealtimeSync } from '../../src/hooks/useRealtimeSync'

function TabBadge({ count }: { count: number }) {
  if (!count) return null
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
    </View>
  )
}

export default function AppLayout() {
  const { activeBucketId, fetchBuckets, unreadActivity } = useStore()

  // Fetch buckets on mount
  useEffect(() => { fetchBuckets() }, [])

  // Subscribe to real-time changes
  useRealtimeSync(activeBucketId)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#BA7517',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopColor: '#f0f0f0',
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bucket',
          tabBarIcon: ({ color }) => <TabIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <View>
              <TabIcon name="bell" color={color} />
              <TabBadge count={unreadActivity} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color }) => <TabIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="together"
        options={{
          title: 'Together',
          tabBarIcon: ({ color }) => <TabIcon name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <TabIcon name="users" color={color} />,
        }}
      />
    </Tabs>
  )
}

// Simple text icon placeholder — replace with @expo/vector-icons
function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    list: '☰', bell: '🔔', heart: '♥', sparkles: '✨', users: '👥'
  }
  return <Text style={{ fontSize: 20, color }}>{icons[name] || '•'}</Text>
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#D4537E',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
})
