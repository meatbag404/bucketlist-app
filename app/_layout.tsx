import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { supabase } from '../src/lib/supabase'
import { useStore } from '../src/store'
import { DebugConsole } from '../src/components/DebugConsole'

// ── DEV auto-login ── set to true to skip the login screen ──────
const DEV_AUTO_LOGIN = false
const DEV_EMAIL    = 'meatbag404+test@gmail.com'
const DEV_PASSWORD = 'Password1'
// ─────────────────────────────────────────────────────────────────

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const { session, setSession, setProfile, registerPushToken } = useStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      let session = existingSession

      if (!session && DEV_AUTO_LOGIN) {
        const { data } = await supabase.auth.signInWithPassword({
          email: DEV_EMAIL,
          password: DEV_PASSWORD,
        })
        session = data.session
      }

      setSession(session)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          setProfile(profile)
          // Register for push notifications (no-op on web)
          registerPushToken()
        }
      }
      setInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (profile) {
            setProfile(profile)
            registerPushToken()
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!initialized) return
    const inAuthGroup = segments[0] === '(auth)'
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      router.replace('/(app)' as any)
    }
  }, [session, segments, initialized])

  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#BA7517" />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <DebugConsole />
    </GestureHandlerRootView>
  )
}
