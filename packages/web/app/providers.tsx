'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@bucketlist/shared'
import { supabase } from '@bucketlist/shared'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const setSession = useStore(state => state.setSession)
  const setProfile = useStore(state => state.setProfile)
  const fetchBuckets = useStore(state => state.fetchBuckets)

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (data) setProfile(data)
        await fetchBuckets()
      }
    }

    initAuth()
    setMounted(true)

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (profile) setProfile(profile)
        await fetchBuckets()
      }
    })

    return () => data?.subscription?.unsubscribe()
  }, [setSession, setProfile, fetchBuckets])

  if (!mounted) return null
  return <>{children}</>
}
