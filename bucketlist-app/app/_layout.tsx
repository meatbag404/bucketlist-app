import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { supabase } from '../src/lib/supabase'
import { useStore } from '../src/store'

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const { session, setSession, setProfile } = useStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
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
          if (profile) setProfile(profile)
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
      router.replace('/(app)/')
    }
  }, [session, segments, initialized])

  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#BA7517" />
      </View>
    )
  }

  return <Slot />
}
