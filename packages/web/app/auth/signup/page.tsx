'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  supabase, useViewport,
  T, FONT_DISPLAY, FONT_UI, STICKER_BORDER, STICKER_BORDER_SM, STICKER_SHADOW, STICKER_SHADOW_SM,
  Sticker, HighlightBlock,
} from '@bucketlist/shared'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const vp = useViewport()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password,
        options: {
          data: {
            name: name || email.split('@')[0],
            handle: handle || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
          }
        }
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')
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
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {vp !== 'mobile' && <>
          <span className="emoji" style={{ position: 'absolute', top: '8%',  left: '6%',  fontSize: '5rem', transform: 'rotate(-12deg)' }}>🌍</span>
          <span className="emoji" style={{ position: 'absolute', top: '14%', right: '8%', fontSize: '5rem', transform: 'rotate(14deg)' }}>🎉</span>
          <span className="emoji" style={{ position: 'absolute', bottom: '8%', left: '10%', fontSize: '4.5rem', transform: 'rotate(-8deg)' }}>🏔️</span>
          <span className="emoji" style={{ position: 'absolute', bottom: '14%', right: '12%', fontSize: '5rem', transform: 'rotate(10deg)' }}>🍕</span>
        </>}
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 440,
        margin: vp === 'mobile' ? '24px 18px' : 'auto',
        alignSelf: 'center',
      }}>
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
            SAY <HighlightBlock color="lime">HI</HighlightBlock>.
          </div>
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: T.inkMuted, lineHeight: 1.5 }}>
            Make a few buckets. Add stuff you want to do. Tag the people you want to do it with.
          </div>

          {error && (
            <div style={{
              marginTop: 18, padding: '10px 14px',
              background: '#FAECE7', border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 10,
            }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="YOUR NAME" type="text" value={name} onChange={setName} placeholder="Your name" autoComplete="name" />
            <Field label="HANDLE" type="text" value={handle} onChange={setHandle} placeholder="@username (optional)" required={false} />
            <Field label="EMAIL" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />
            <Field label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" autoComplete="new-password" minLength={6} />

            <button type="submit" disabled={loading} className="bk-sticker-btn" style={{
              marginTop: 6, padding: '14px 18px',
              background: T.ink, color: '#fff',
              border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
              borderRadius: 14, cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
              opacity: loading ? 0.7 : 1,
            }}>{loading ? 'CREATING ACCOUNT…' : "LET'S GO →"}</button>
          </form>
        </Sticker>

        <div style={{
          marginTop: 18, textAlign: 'center',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          color: T.inkMuted, textTransform: 'uppercase',
        }}>
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link href="/auth" style={{
            fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
            color: T.ink, textTransform: 'uppercase',
            textDecoration: 'underline', textDecorationThickness: 2, textUnderlineOffset: 3,
          }}>SIGN IN</Link>
        </div>
      </div>
    </div>
  )
}

function Field({
  label, type = 'text', value, onChange, placeholder, autoComplete, required = true, minLength,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
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
        required={required}
        minLength={minLength}
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
