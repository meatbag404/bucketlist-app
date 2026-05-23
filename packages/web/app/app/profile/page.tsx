'use client'

import { useState, useEffect } from 'react'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_MONO, FONT_UI, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, StickerButton, Avatar, PageHeading,
} from '@bucketlist/shared'

export default function ProfilePage() {
  const { profile, setProfile } = useStore()
  const vp = useViewport()

  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setHandle(profile.handle || '')
      setCity((profile as any).city || '')
      setState((profile as any).state || '')
    }
  }, [profile])

  if (!profile) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="emoji" style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
          <p style={{ fontFamily: FONT_DISPLAY, color: T.inkMuted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Loading…</p>
        </div>
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setSaved(false); setError(null)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name, handle,
          city: city || null,
          state: state || null,
        })
        .eq('id', profile.id)
      if (updateError) throw updateError
      setProfile({ ...profile, name, handle, city: city || null, state: state || null })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut()
      window.location.href = '/auth'
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeading lineA="YOUR" lineB="PROFILE." sub="Manage your name, handle, and where you're based." vp={vp} />

      {/* Identity card */}
      <Sticker color="cyan" radius={18} style={{ padding: 24, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
        <Avatar p={profile} size={84} />
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 22 : 28, fontWeight: 700,
            color: T.ink, textTransform: 'uppercase' as const, letterSpacing: -0.8, lineHeight: 1,
          }}>{profile.name}</p>
          <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.ink, opacity: 0.7, marginTop: 4 }}>@{profile.handle}</p>
          {(profile as any).city && (
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 11, color: T.ink, marginTop: 6, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              📍 {(profile as any).city}{(profile as any).state ? `, ${(profile as any).state}` : ''}
            </p>
          )}
        </div>
      </Sticker>

      {/* Edit form */}
      <Sticker radius={16} style={{ padding: 24, marginBottom: 22 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          color: T.inkMuted, textTransform: 'uppercase', marginBottom: 16,
        }}>EDIT DETAILS</div>

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: '#FAECE7', border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 10,
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: T.ink }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSave}>
          <FieldLabel>Full Name</FieldLabel>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required style={{ marginBottom: 16 }} />

          <FieldLabel>Handle</FieldLabel>
          <input type="text" value={handle} onChange={e => setHandle(e.target.value)} className="input" required style={{ marginBottom: 4 }} />
          <p style={{ fontSize: '0.75rem', color: T.inkMuted, marginTop: 4, marginBottom: 16, fontFamily: FONT_UI }}>
            Friends search for you by @handle
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <FieldLabel>City</FieldLabel>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="input" placeholder="Optional" />
            </div>
            <div>
              <FieldLabel>State / Region</FieldLabel>
              <input type="text" value={state} onChange={e => setState(e.target.value)} className="input" placeholder="Optional" />
            </div>
          </div>

          {saved && (
            <div style={{
              padding: '10px 14px', marginBottom: 16,
              background: '#EDFCE7', border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 10,
            }}>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: T.ink }}>✓ Profile saved!</p>
            </div>
          )}

          <StickerButton color="ink" size="lg" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'SAVING…' : 'SAVE CHANGES'}
          </StickerButton>
        </form>
      </Sticker>

      {/* Sign out */}
      <Sticker radius={16} style={{ padding: 22 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          color: T.inkMuted, textTransform: 'uppercase', marginBottom: 14,
        }}>ACCOUNT</div>
        <button
          onClick={handleSignOut}
          className="bk-sticker-btn"
          style={{
            padding: '10px 18px', borderRadius: 12,
            background: '#FAECE7', color: T.red,
            border: '2px solid ' + T.red, boxShadow: '2px 2px 0 ' + T.red,
            fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </Sticker>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
      color: T.inkMuted, textTransform: 'uppercase', marginBottom: 6,
    }}>{children}</div>
  )
}
