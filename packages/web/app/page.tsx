'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@bucketlist/shared'

export default function Home() {
  const router = useRouter()
  const { session } = useStore()

  useEffect(() => {
    if (session) {
      router.push('/app')
    } else {
      router.push('/auth')
    }
  }, [session, router])

  return null
}
