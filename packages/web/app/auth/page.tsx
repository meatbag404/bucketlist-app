'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  supabase, useViewport,
  T, FONT_DISPLAY, FONT_UI, STICKER_BORDER, STICKER_BORDER_SM, STICKER_SHADOW, STICKER_SHADOW_SM,
  Sticker, HighlightBlock,
} from '@bucketlist/shared'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const vp = useViewport()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/app')
    } catch (err: any) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'stretch', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative emoji backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {vp !== 'mobile' && <>
          <span className="emoji" style={{ position: 'absolute', top: '8%',  left: '6%',  fontSize: '5rem', transform: 'rotate(-12deg)' }}>✈️</span>
          <span className="emoji" style={{ position: 'absolute', top: '14%', right: '8%', fontSize: '5rem', transform: 'rotate(14deg)' }}>🥐</span>
          <span className="emoji" style={{ position: 'absolute', bottom: '8%', left: '10%', fontSize: '4.5rem', transform: 'rotate(-8deg)' }}>☀️</span>
          <span className="emoji" style={{ position: 'absolute', bottom: '14%', right: '12%', fontSize: '5rem', transform: 'rotate(10deg)' }}>🎂</span>
          <span className="emoji" style={{ position: 'absolute', top: '52%', left: '4%', fontSize: '3rem', transform: 'rotate(6deg)' }}>❤️</span>
          <span className="emoji" style={{ position: 'absolute', top: '60%', right: '4%', fontSize: '4rem', transform: 'rotate(-14deg)' }}>🌈</span>
        </>}
        {vp === 'mobile' && <>
          <span className="emoji" style={{ position: 'absolute', top: 24, right: 24, fontSize: '2.6rem', transform: 'rotate(10deg)' }}>🥐</span>
          <span className="emoji" style={{ position: 'absolute', bottom: 24, left: 24, fontSize: '2.6rem', transform: 'rotate(-10deg)' }}>☀️</span>
        </>}
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 440,
        margin: vp === 'mobile' ? '24px 18px' : 'auto',
        alignSelf: 'center',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{
            padding: '8px 14px', background: T.ink, color: T.bg, borderRadius: 10,
            border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.5,
            transform: 'rotate(-2deg)',
          }}>BUCKET</div>
          <HighlightBlock color="yellow" tilt={3}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>LIST</span>
          </HighlightBlock>
        </div>

        <Sticker radius={20} shadow="lg" style={{ padding: vp === 'mobile' ? 24 : 32 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -1.8,
            fontSize: vp === 'mobile' ? 36 : 44, lineHeight: 0.96, textTransform: 'uppercase',
            color: T.ink,
          }}>
            WELCOME <HighlightBlock color="pink">BACK</HighlightBlock>.
          </div>
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: T.inkMuted, lineHeight: 1.5 }}>
            Sign in to pick up where you left off.
          </div>

          {error && (
            <div style={{
              marginTop: 18, padding: '10px 14px',
              background: '#FAECE7', border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 10,
            }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="EMAIL" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />
            <Field label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => alert('Password reset is coming soon. Contact your administrator for now.')}
                className="bk-sticker-btn"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  color: T.inkMuted, textTransform: 'uppercase' as const, padding: 4,
                }}
              >FORGOT PASSWORD?</button>
            </div>

            <button type="submit" disabled={loading} className="bk-sticker-btn" style={{
              marginTop: 6, padding: '14px 18px',
              background: T.ink, color: '#fff',
              border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
              borderRadius: 14, cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
              opacity: loading ? 0.7 : 1,
            }}>{loading ? 'SIGNING IN…' : 'SIGN IN →'}</button>
          </form>

          {/* OAuth divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '22px 0 16px',
            fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
            color: T.inkMuted, textTransform: 'uppercase' as const,
          }}>
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(12,12,12,0.25)' }} />
            OR
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(12,12,12,0.25)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <OAuthButton
              label="CONTINUE WITH APPLE"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' })
                if (error) alert('Apple sign-in not configured yet. ' + error.message)
              }}
            />
            <OAuthButton
              label="CONTINUE WITH GOOGLE"
              glyph="G"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
                if (error) alert('Google sign-in not configured yet. ' + error.message)
              }}
            />
          </div>
        </Sticker>

        <div style={{
          marginTop: 18, textAlign: 'center',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          color: T.inkMuted, textTransform: 'uppercase',
        }}>
          DON'T HAVE AN ACCOUNT?{' '}
          <Link href="/auth/signup" style={{
            fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
            color: T.ink, textTransform: 'uppercase',
            textDecoration: 'underline', textDecorationThickness: 2, textUnderlineOffset: 3,
          }}>SIGN UP</Link>
        </div>
      </div>
    </div>
  )
}

function OAuthButton({
  label, glyph, onClick,
}: { label: string; glyph?: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="bk-sticker-btn" style={{
      padding: '12px 16px',
      background: T.surface,
      border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
      borderRadius: 12, cursor: 'pointer',
      fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
      textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      color: T.ink,
    }}>
      {glyph !== undefined && (
        <span style={{
          width: 22, height: 22, borderRadius: 99,
          background: T.bg, border: '1.5px solid #0C0C0C',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700,
        }}>{glyph || ''}</span>
      )}
      {label}
    </button>
  )
}

function Field({
  label, type = 'text', value, onChange, placeholder, autoComplete,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
        color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
      }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        style={{
          width: '100%', padding: '12px 14px',
          background: T.bg, border: STICKER_BORDER_SM,
          boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
          borderRadius: 12, outline: 'none',
          fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
          color: T.ink,
          transition: 'box-shadow 0.1s',
        }}
        onFocus={e => { e.currentTarget.style.boxShadow = '3px 3px 0 #0C0C0C' }}
        onBlur={e =>  { e.currentTarget.style.boxShadow = '2px 2px 0 rgba(12,12,12,0.18)' }}
      />
    </label>
  )
}
