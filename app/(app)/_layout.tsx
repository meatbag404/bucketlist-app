import { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../../src/store'
import { useRealtimeSync } from '../../src/hooks/useRealtimeSync'
import { sticker } from '../../src/design/sticker'

// Tab icon colors per tab — active background uses the sticker palette
const TAB_COLORS: Record<string, string> = {
  index:    sticker.yellow,
  together: sticker.lime,
  friends:  sticker.cyan,
  profile:  sticker.pink,
}

interface TabIconProps {
  name: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
  iconActive: keyof typeof Ionicons.glyphMap
  focused: boolean
}

function TabIcon({ name, label, icon, iconActive, focused }: TabIconProps) {
  const bg = TAB_COLORS[name] ?? sticker.yellow
  return (
    <View style={[styles.wrap, focused && { backgroundColor: bg }]}>
      <Ionicons
        name={focused ? iconActive : icon}
        size={18}
        color={focused ? sticker.ink : sticker.inkMuted}
      />
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  )
}

function BadgeTabIcon({ name, label, icon, iconActive, focused, count }: TabIconProps & { count: number }) {
  return (
    <View>
      <TabIcon name={name} label={label} icon={icon} iconActive={iconActive} focused={focused} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  )
}

function ProfileTabIcon({ focused }: { focused: boolean }) {
  const { myAvatarUrl } = useStore()
  const bg = TAB_COLORS.profile
  return (
    <View style={[styles.wrap, focused && { backgroundColor: bg }]}>
      {myAvatarUrl ? (
        <Image
          source={{ uri: myAvatarUrl }}
          style={[styles.avatarThumb, focused && styles.avatarThumbActive]}
        />
      ) : (
        <Ionicons
          name={focused ? 'person' : 'person-outline'}
          size={18}
          color={focused ? sticker.ink : sticker.inkMuted}
        />
      )}
      <Text style={[styles.label, focused && styles.labelActive]}>PROFILE</Text>
    </View>
  )
}

export default function AppLayout() {
  const { activeBucketId, fetchBuckets, unreadActivity, pendingApprovalCount, friendRequestCount } = useStore()

  useEffect(() => { fetchBuckets() }, [])
  useRealtimeSync(activeBucketId)

  const friendBadge = pendingApprovalCount + friendRequestCount

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: sticker.bg,
          borderTopColor: sticker.ink,
          borderTopWidth: 2,
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: sticker.ink,
        tabBarInactiveTintColor: sticker.inkMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <BadgeTabIcon
              name="index"
              label="BUCKET"
              icon="layers-outline"
              iconActive="layers"
              focused={focused}
              count={unreadActivity}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="together"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="together"
              label="TOGETHER"
              icon="sparkles-outline"
              iconActive="sparkles"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ focused }) => (
            <BadgeTabIcon
              name="friends"
              label="FRIENDS"
              icon="people-outline"
              iconActive="people"
              focused={focused}
              count={friendBadge}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="activity"    options={{ href: null }} />
      <Tabs.Screen name="memories"    options={{ href: null }} />
      <Tabs.Screen name="settings"    options={{ href: null }} />
      <Tabs.Screen name="icon-picker" options={{ href: null }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 3,
    borderWidth: 0,
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: sticker.inkMuted,
  },
  labelActive: {
    color: sticker.ink,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: sticker.red,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: sticker.bg,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  avatarThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  avatarThumbActive: {
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
})
