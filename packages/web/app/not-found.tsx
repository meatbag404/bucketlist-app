'use client'

import Link from 'next/link'
import {
  useViewport,
  T, FONT_DISPLAY, STICKER_BORDER, STICKER_SHADOW, STICKER_SHADOW_LG,
  HighlightBlock,
} from '@bucketlist/shared'

function FourOhFourDigit({ n, color, tilt, vp }: { n: string; color: string; tilt: number; vp: 'mobile' | 'tablet' | 'desktop' }) {
  const size = vp === 'mobile' ? 88 : 140
  return (
    <div style={{
      width: size, height: size,
      background: (T as any)[color],
      border: STICKER_BORDER, boxShadow: STICKER_SHADOW_LG,
      borderRadius: 22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${tilt}deg)`,
      fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -3,
      fontSize: vp === 'mobile' ? 64 : 100, color: T.ink, lineHeight: 1,
    }}>{n}</div>
  )
}

export default function NotFound() {
  const vp = useViewport()
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: vp === 'mobile' ? '32px 18px' : '40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Floating emoji backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <span className="emoji" style={{ position: 'absolute', top: '10%', left: '8%',   fontSize: vp === 'mobile' ? '3rem' : '5rem', transform: 'rotate(-18deg)' }}>🌍</span>
        <span className="emoji" style={{ position: 'absolute', top: '12%', right: '10%', fontSize: vp === 'mobile' ? '3rem' : '4.5rem', transform: 'rotate(20deg)' }}>⚡</span>
        <span className="emoji" style={{ position: 'absolute', bottom: '14%', left: '14%', fontSize: vp === 'mobile' ? '3rem' : '4rem', transform: 'rotate(-12deg)' }}>🌙</span>
        <span className="emoji" style={{ position: 'absolute', bottom: '8%',  right: '8%',  fontSize: vp === 'mobile' ? '3rem' : '4.5rem', transform: 'rotate(16deg)' }}>💎</span>
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 560, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        <div style={{ display: 'flex', gap: vp === 'mobile' ? 10 : 18 }}>
          <FourOhFourDigit n="4" color="cyan"   tilt={-4} vp={vp} />
          <FourOhFourDigit n="0" color="pink"   tilt={3}  vp={vp} />
          <FourOhFourDigit n="4" color="yellow" tilt={-4} vp={vp} />
        </div>

        <div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -2,
            fontSize: vp === 'mobile' ? 36 : 56, lineHeight: 0.95, textTransform: 'uppercase',
            color: T.ink,
          }}>
            NOT ON THE <HighlightBlock color="lime">LIST</HighlightBlock>.
          </div>
          <div style={{
            marginTop: 14, fontSize: 14, fontWeight: 500, color: T.inkMuted, lineHeight: 1.5,
            maxWidth: 460, marginLeft: 'auto', marginRight: 'auto',
          }}>
            This page doesn't exist — yet. Maybe it's a bucket-list item you forgot to add? Take it as a sign.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/app" className="bk-sticker-btn" style={{
            padding: '14px 22px',
            background: T.ink, color: '#fff',
            border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
            borderRadius: 14, cursor: 'pointer', textDecoration: 'none',
            fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>← BACK TO MY BUCKETS</Link>
          <Link href="/app/add" className="bk-sticker-btn" style={{
            padding: '14px 22px',
            background: T.surface, color: T.ink,
            border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
            borderRadius: 14, cursor: 'pointer', textDecoration: 'none',
            fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>＋ ADD A THING</Link>
        </div>
      </div>
    </div>
  )
}
