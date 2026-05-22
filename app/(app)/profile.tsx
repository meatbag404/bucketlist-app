import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Image,
} from 'react-native'
import { router } from 'expo-router'
import { useStore } from '../../src/store'
import { supabase } from '../../src/lib/supabase'
import { sticker, BUCKET_COLORS } from '../../src/design/sticker'

const AV_COLORS = [
  { bg: '#7DDCFF', text: '#0C0C0C' },
  { bg: '#C7F356', text: '#0C0C0C' },
  { bg: '#FF7AB6', text: '#0C0C0C' },
  { bg: '#FFD43B', text: '#0C0C0C' },
  { bg: '#5C7BFF', text: '#fff' },
  { bg: '#FF6B5A', text: '#fff' },
]

const SHADOW = 4

export default function ProfileScreen() {
  const { profile, buckets, items, friends } = useStore()
  const [avatarUri, setAvatarUri] = useState<string | null>(null)

  useEffect(() => {
    const storedPath = (profile as any)?.avatar_url
    if (storedPath) {
      supabase.storage.from('avatars').createSignedUrl(storedPath, 3600).then(({ data }) => {
        if (data?.signedUrl) setAvatarUri(data.signedUrl)
      })
    }
  }, [(profile as any)?.avatar_url])

  if (!profile) return null

  const ac = AV_COLORS[(profile.avatar_color ?? 0) % AV_COLORS.length]
  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : '??'
  const doneCount = items.filter(i => i.done).length

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headlineRow}>
            <Text style={styles.headlineMain}>MY</Text>
            <View style={styles.headlineHighlight}>
              <Text style={styles.headlineHighlightText}>PROFILE</Text>
            </View>
          </View>
          <Text style={styles.titleSub}>YOUR ADVENTURE STATS</Text>
        </View>

        {/* Avatar card */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCardWrap}>
            <View style={styles.avatarCardShadow} />
            <View style={[styles.avatarCard, { backgroundColor: ac.bg }]}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarPhoto} />
              ) : (
                <View style={[styles.avatarCircle, { backgroundColor: ac.bg }]}>
                  <Text style={[styles.avatarInitials, { color: ac.text }]}>{initials}</Text>
                </View>
              )}
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.handle}>@{profile.handle}</Text>
              {((profile as any).city || (profile as any).state || (profile as any).country) && (
                <View style={styles.locationChip}>
                  <Text style={styles.locationText}>
                    📍 {[(profile as any).city, (profile as any).state, (profile as any).country].filter(Boolean).join(', ').toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { num: buckets.length, label: 'BUCKETS', color: sticker.cyan, onPress: undefined },
            { num: friends.length, label: 'FRIENDS →', color: sticker.lime, onPress: () => router.push('/(app)/friends') },
            { num: doneCount, label: 'DONE →', color: sticker.pink, onPress: () => router.push('/(app)/memories') },
          ].map((s, i) => (
            <View key={i} style={styles.statCardWrap}>
              <View style={styles.statCardShadow} />
              <TouchableOpacity
                style={[styles.statCard, { backgroundColor: s.color }]}
                onPress={s.onPress}
                disabled={!s.onPress}
                activeOpacity={s.onPress ? 0.85 : 1}
              >
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.actionWrap}>
            <View style={styles.actionShadow} />
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(app)/settings')}>
              <Text style={styles.actionEmoji}>✏️</Text>
              <Text style={styles.actionText}>EDIT PROFILE</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionWrap}>
            <View style={styles.actionShadow} />
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: sticker.red }]}
              onPress={async () => {
                await supabase.auth.signOut()
                router.replace('/(auth)/login')
              }}
            >
              <Text style={styles.actionEmoji}>👋</Text>
              <Text style={[styles.actionText, { color: sticker.bg }]}>SIGN OUT</Text>
              <Text style={[styles.actionArrow, { color: sticker.bg }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: sticker.bg },
  scroll: { paddingBottom: 60 },

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
    backgroundColor: sticker.cyan,
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
  titleSub: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: sticker.inkMuted,
    marginTop: 4,
  },

  avatarSection: { padding: 22 },
  avatarCardWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  avatarCardShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 20,
  },
  avatarCard: {
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 24,
    alignItems: 'center',
  },
  avatarPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: sticker.ink,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInitials: { fontSize: 28, fontWeight: '700' },
  name: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: sticker.ink,
    marginBottom: 4,
  },
  handle: {
    fontSize: 13,
    fontWeight: '600',
    color: sticker.inkMuted,
    marginBottom: 10,
  },
  locationChip: {
    backgroundColor: sticker.surface,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: sticker.ink,
  },
  locationText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.ink,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    paddingBottom: 22,
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
    color: sticker.ink,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: sticker.ink,
    marginTop: 2,
  },

  actionsSection: { paddingHorizontal: 22, gap: 10 },
  actionWrap: { marginBottom: SHADOW, marginRight: SHADOW },
  actionShadow: {
    position: 'absolute',
    top: SHADOW, left: SHADOW, right: 0, bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 14,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: sticker.surface,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionEmoji: { fontSize: 20 },
  actionText: { flex: 1, fontSize: 13, fontWeight: '700', letterSpacing: 0.5, color: sticker.ink },
  actionArrow: { fontSize: 20, color: sticker.ink, fontWeight: '700' },
})
