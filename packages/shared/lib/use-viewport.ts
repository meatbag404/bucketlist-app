// Bucket List — viewport / responsive hook.
// Mirrors design_handoff_bucket_web/tokens.jsx useViewport().
//   mobile  < 720
//   tablet  720-1023
//   desktop >= 1024

import { useEffect, useState } from 'react'

export type Viewport = 'mobile' | 'tablet' | 'desktop'

function read(): Viewport {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 720) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() => read())
  useEffect(() => {
    const onResize = () => setVp(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}
