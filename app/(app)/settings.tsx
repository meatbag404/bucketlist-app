import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, Image,
} from 'react-native'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useStore } from '../../src/store'
import { supabase } from '../../src/lib/supabase'

const AVCOLORS = [
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#E1F5EE', color: '#04342C' },
  { bg: '#EEEDFE', color: '#26215C' },
  { bg: '#FBEAF0', color: '#4B1528' },
  { bg: '#E6F1FB', color: '#042C53' },
]

export default function SettingsScreen() {
  const { profile, setProfile, setMyAvatarUrl } = useStore()

  const [name, setName] = useState(profile?.name ?? '')
  const [handle, setHandle] = useState(profile?.handle ?? '')
  const [city, setCity] = useState((profile as any)?.city ?? '')
  const [state, setState] = useState((profile as any)?.state ?? '')
  const [country, setCountry] = useState((profile as any)?.country ?? '')
  const [avatarColor, setAvatarColor] = useState(profile?.avatar_color ?? 0)
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  useEffect(() => {
    const storedPath = (profile as any)?.avatar_url
    if (storedPath && !pendingPhotoUri) {
      supabase.storage.from('avatars').createSignedUrl(storedPath, 3600).then(({ data }) => {
        if (data?.signedUrl) setAvatarUri(data.signedUrl)
      })
    }
  }, [(profile as any)?.avatar_url])

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (result.canceled || !result.assets[0]) return
    setAvatarUri(result.assets[0].uri)
    setPendingPhotoUri(result.assets[0].uri)
  }

  async function save() {
    if (saving) return  // prevent double-tap
    if (!profile) return
    if (!name.trim()) { setErrorMsg('Display name cannot be empty.'); return }
    if (!handle.trim()) { setErrorMsg('Handle cannot be empty.'); return }

    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const updates: Record<string, any> = {
        name: name.trim(),
        handle: handle.trim().toLowerCase(),
        avatar_color: avatarColor,
        city: city.trim() || null,
        state: state.trim() || null,
        country: country.trim() || null,
      }

      // Upload pending photo
      if (pendingPhotoUri) {
        setUploadingPhoto(true)
        try {
          const response = await fetch(pendingPhotoUri)
          const blob = await response.blob()
          // Store in user-ID subfolder to satisfy RLS policy
          const path = `${profile.id}/${Date.now()}.jpg`

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })

          if (uploadError) throw uploadError

          updates.avatar_url = path
          // Generate fresh signed URL for immediate display
          const { data: signed } = await supabase.storage.from('avatars').createSignedUrl(path, 3600)
          if (signed?.signedUrl) { setAvatarUri(signed.signedUrl); setMyAvatarUrl(signed.signedUrl) }
          setPendingPhotoUri(null)
        } catch (e: any) {
          console.error('Avatar upload failed:', e.message)
          setErrorMsg(`Photo upload failed: ${e.message ?? 'Unknown error'}`)
          // Clear pending so subsequent saves don't retry the broken photo
          setPendingPhotoUri(null)
          setUploadingPhoto(false)
          return
        } finally {
          setUploadingPhoto(false)
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) {
        setErrorMsg(error.message)
      } else if (data) {
        setProfile(data as any)
        setSuccessMsg('Profile saved!')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const ac = AVCOLORS[avatarColor % AVCOLORS.length]
  const initials = name ? name.slice(0, 2).toUpperCase() : '??'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹  Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={save} disabled={saving} style={styles.saveBtn}>
          {saving
            ? <ActivityIndicator size="small" color="#BA7517" />
            : <Text style={styles.saveBtnText}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickPhoto} style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarPhoto} />
            ) : (
              <View style={[styles.avatarCircle, { backgroundColor: ac.bg }]}>
                <Text style={[styles.avatarInitials, { color: ac.color }]}>{initials}</Text>
              </View>
            )}
            {uploadingPhoto
              ? <View style={styles.avatarOverlay}><ActivityIndicator color="#fff" /></View>
              : <View style={[styles.avatarOverlay, pendingPhotoUri && { backgroundColor: '#0F6E56' }]}>
                  <Text style={styles.avatarOverlayText}>{pendingPhotoUri ? '✓' : '📷'}</Text>
                </View>
            }
          </TouchableOpacity>
          <Text style={styles.avatarName}>{name || 'Your name'}</Text>
          <Text style={styles.avatarHandle}>@{handle || 'handle'}</Text>
          <Text style={styles.photoHint}>
            {pendingPhotoUri ? 'Photo selected — tap Save to upload' : 'Tap to change photo'}
          </Text>
        </View>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

        {/* Avatar colour */}
        <View style={styles.section}>
          <Text style={styles.label}>Avatar colour</Text>
          <View style={styles.colorRow}>
            {AVCOLORS.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.colorSwatch, { backgroundColor: c.bg }, avatarColor === i && styles.colorSwatchActive]}
                onPress={() => setAvatarColor(i)}
              >
                <Text style={{ color: c.color, fontSize: 13, fontWeight: '700' }}>Aa</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Display name */}
        <View style={styles.section}>
          <Text style={styles.label}>Display name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName}
            placeholder="Your full name" placeholderTextColor="#bbb" />
        </View>

        {/* Handle */}
        <View style={styles.section}>
          <Text style={styles.label}>@Handle</Text>
          <View style={styles.handleRow}>
            <Text style={styles.atSign}>@</Text>
            <TextInput
              style={[styles.input, styles.handleInput]}
              value={handle}
              onChangeText={t => setHandle(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="yourhandle" placeholderTextColor="#bbb"
              autoCapitalize="none" autoCorrect={false}
            />
          </View>
        </View>

        {/* Email (read-only) */}
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.input, styles.readOnly]}>
            <Text style={styles.readOnlyText}>{email || '—'}</Text>
          </View>
          <Text style={styles.hint}>To change your email, contact support.</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput style={[styles.input, { marginBottom: 8 }]} value={city}
            onChangeText={setCity} placeholder="City" placeholderTextColor="#bbb" />
          <TextInput style={[styles.input, { marginBottom: 8 }]} value={state}
            onChangeText={setState} placeholder="State / Province" placeholderTextColor="#bbb" />
          <TextInput style={styles.input} value={country}
            onChangeText={setCountry} placeholder="Country" placeholderTextColor="#bbb" />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#eee',
  },
  backBtn: { minWidth: 60 },
  backBtnText: { fontSize: 17, color: '#BA7517' },
  navTitle: { fontSize: 17, fontWeight: '600', color: '#111' },
  saveBtn: { minWidth: 60, alignItems: 'flex-end' },
  saveBtnText: { fontSize: 17, color: '#BA7517', fontWeight: '600' },
  scroll: { paddingBottom: 60 },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  avatarPhoto: { width: 90, height: 90, borderRadius: 45 },
  avatarInitials: { fontSize: 30, fontWeight: '700' },
  avatarOverlay: {
    position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#BA7517', alignItems: 'center', justifyContent: 'center',
  },
  avatarOverlayText: { fontSize: 14 },
  avatarName: { fontSize: 18, fontWeight: '600', color: '#111' },
  avatarHandle: { fontSize: 13, color: '#aaa', marginTop: 2 },
  photoHint: { fontSize: 11, color: '#ccc', marginTop: 4 },
  error: {
    marginHorizontal: 16, marginBottom: 8, padding: 10,
    backgroundColor: '#FAECE7', borderRadius: 8, fontSize: 13, color: '#993C1D',
  },
  success: {
    marginHorizontal: 16, marginBottom: 8, padding: 10,
    backgroundColor: '#E1F5EE', borderRadius: 8, fontSize: 13, color: '#0F6E56', fontWeight: '500',
  },
  section: { paddingHorizontal: 16, paddingBottom: 20 },
  label: { fontSize: 12, color: '#aaa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorSwatch: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: '#ddd',
  },
  colorSwatchActive: { borderWidth: 2.5, borderColor: '#BA7517' },
  input: {
    backgroundColor: '#f7f5f0', borderRadius: 10, borderWidth: 0.5, borderColor: '#eee',
    padding: 13, fontSize: 15, color: '#111',
  },
  handleRow: { flexDirection: 'row', alignItems: 'center' },
  atSign: {
    fontSize: 16, color: '#aaa', paddingHorizontal: 12, backgroundColor: '#f7f5f0',
    borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderWidth: 0.5, borderColor: '#eee',
    paddingVertical: 13, borderRightWidth: 0,
  },
  handleInput: { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  readOnly: { justifyContent: 'center' },
  readOnlyText: { fontSize: 15, color: '#999' },
  hint: { fontSize: 11, color: '#ccc', marginTop: 6, lineHeight: 16 },
})
