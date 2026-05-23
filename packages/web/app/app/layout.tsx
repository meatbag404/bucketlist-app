'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  useStore, supabase, useViewport,
  T, FONT_DISPLAY, FONT_MONO, STICKER_BORDER, STICKER_BORDER_SM, STICKER_SHADOW, STICKER_SHADOW_SM,
  HighlightBlock, Avatar, NavIcon, type NavIconName,
} from '@bucketlist/shared'

// ── Nav config — matches design_handoff_bucket_web/app-shell.jsx ──
type NavItem = { id: string; href: string; label: string; icon: NavIconName; color: string; matchPrefix?: string }
const NAV_ITEMS: NavItem[] = [
  { id: 'buckets',  href: '/app',          label: 'Buckets',  icon: 'bucket',  color: 'lime',   matchPrefix: '/app/bucket' },
  { id: 'activity', href: '/app/activity', label: 'Activity', icon: 'clock',   color: 'cyan' },
  { id: 'memories', href: '/app/memories', label: 'Memories', icon: 'photo',   color: 'pink' },
  { id: 'friends',  href: '/app/friends',  label: 'Friends',  icon: 'friends', color: 'yellow' },
]

// Treat /app/profile as its own thing (profile-chip click in sidebar).
function activeTab(pathname: string): string {
  if (pathname === '/app' || pathname.startsWith('/app/bucket') || pathname.startsWith('/app/add') || pathname.startsWith('/app/item') || pathname.startsWith('/app/icons')) return 'buckets'
  if (pathname.startsWith('/app/activity')) return 'activity'
  if (pathname.startsWith('/app/memories')) return 'memories'
  if (pathname.startsWith('/app/friends'))  return 'friends'
  if (pathname.startsWith('/app/profile'))  return 'profile'
  return 'buckets'
}

// ── Logo ────────────────────────────────────────────────────────
function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const isSm = size === 'sm'
  return (
    <Link href="/app" className="bk-logo-link" aria-label="Bucket List — home" style={{ textDecoration: 'none' }}>
      <div style={{
        padding: isSm ? '5px 10px' : '6px 12px',
        background: T.ink, color: T.bg, borderRadius: isSm ? 8 : 10,
        border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
        fontFamily: FONT_DISPLAY, fontSize: isSm ? 14 : 16, fontWeight: 700, letterSpacing: -0.5,
        transform: 'rotate(-1deg)',
      }}>BUCKET</div>
      <HighlightBlock color="yellow" tilt={2} size="sm">
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: isSm ? 10 : 11, fontWeight: 700, letterSpacing: 0.6 }}>LIST</span>
      </HighlightBlock>
    </Link>
  )
}

// ── Sidebar (desktop) ───────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const tab = activeTab(pathname)
  const profile = useStore(s => s.profile)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <aside style={{
      width: 248, flex: '0 0 248px',
      padding: '28px 18px 28px 24px',
      borderRight: STICKER_BORDER_SM,
      background: T.sidebarBg,
      backgroundImage: 'radial-gradient(rgba(12,12,12,0.06) 1.5px, transparent 1.5px)',
      backgroundSize: '14px 14px',
      backgroundPosition: '0 0',
      position: 'sticky', top: 0, height: '100vh',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <Logo />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
        {NAV_ITEMS.map(item => {
          const on = tab === item.id
          return (
            <Link key={item.id} href={item.href} className="bk-sticker-btn" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: on ? (T as any)[item.color] : 'transparent',
              color: T.ink,
              border: on ? STICKER_BORDER_SM : '2px solid transparent',
              boxShadow: on ? STICKER_SHADOW_SM : 'none',
              borderRadius: 12, cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
              textTransform: 'uppercase', textAlign: 'left' as const, textDecoration: 'none',
              transform: on ? 'rotate(-1deg)' : 'rotate(0deg)',
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: (T as any)[item.color],
                border: STICKER_BORDER_SM,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flex: '0 0 auto',
              }}>
                <NavIcon name={item.icon} size={18} />
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Add CTA — links to /app/add */}
      <Link href="/app/add" className="bk-sticker-btn" style={{
        padding: '14px 18px', borderRadius: 14,
        background: T.ink, color: '#fff',
        border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
        fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.6,
        textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        whiteSpace: 'nowrap',
      }}>
        <NavIcon name="plus" size={20} color="#fff" /> ADD A THING
      </Link>

      {/* Profile chip — clickable -> /app/profile */}
      <Link href="/app/profile" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 8, borderRadius: 12, textDecoration: 'none',
        background: T.surface, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
        color: T.ink,
      }}>
        <Avatar p={profile} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile?.name || '...'}
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            @{profile?.handle || ''}
          </div>
        </div>
      </Link>

      <button
        onClick={handleLogout}
        className="bk-sticker-btn"
        style={{
          padding: '8px 12px', borderRadius: 10,
          background: 'transparent', border: '2px solid transparent',
          color: T.inkMuted, cursor: 'pointer',
          fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        Log Out
      </button>
    </aside>
  )
}

// ── Top bar (mobile / tablet) ───────────────────────────────────
function TopBar({ vp }: { vp: 'mobile' | 'tablet' }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: T.bg,
      padding: vp === 'tablet' ? '14px 22px' : '12px 18px',
      borderBottom: '1.5px solid rgba(12,12,12,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Logo size="sm" />
      <Link href="/app/activity" className="bk-sticker-btn" style={{
        width: 40, height: 40, borderRadius: 99,
        background: T.pink, border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none',
      }}>
        <NavIcon name="clock" size={20} />
      </Link>
    </header>
  )
}

// ── Bottom nav (mobile / tablet) ────────────────────────────────
function BottomNav() {
  const pathname = usePathname()
  const tab = activeTab(pathname)
  const items: { id: string; href: string; icon: NavIconName; color: string; isAdd?: boolean }[] = [
    { id: 'buckets',  href: '/app',          icon: 'bucket',  color: 'lime' },
    { id: 'activity', href: '/app/activity', icon: 'clock',   color: 'cyan' },
    { id: 'add',      href: '/app/add',      icon: 'plus',    color: 'ink', isAdd: true },
    { id: 'memories', href: '/app/memories', icon: 'photo',   color: 'pink' },
    { id: 'friends',  href: '/app/friends',  icon: 'friends', color: 'yellow' },
  ]
  return (
    <nav style={{
      position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 40,
      height: 64,
      background: T.surface, border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
      borderRadius: 99,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '0 6px',
      maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
    }}>
      {items.map(it => {
        if (it.isAdd) {
          return (
            <Link key={it.id} href={it.href} className="bk-sticker-btn" style={{
              width: 50, height: 50, borderRadius: 99,
              background: T.ink, color: '#fff',
              border: STICKER_BORDER_SM, boxShadow: '3px 3px 0 #0C0C0C',
              cursor: 'pointer', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <NavIcon name="plus" size={24} color="#fff" />
            </Link>
          )
        }
        const on = tab === it.id
        return (
          <Link key={it.id} href={it.href} className="bk-sticker-btn" style={{
            width: 44, height: 44, borderRadius: 99,
            background: on ? (T as any)[it.color] : 'transparent',
            border: on ? STICKER_BORDER_SM : 'none',
            boxShadow: on ? '2px 2px 0 #0C0C0C' : 'none',
            transform: on ? 'rotate(-3deg)' : 'rotate(0deg)',
            cursor: 'pointer', textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <NavIcon name={it.icon} size={22} />
          </Link>
        )
      })}
    </nav>
  )
}

// ── AppShell ────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { session, sessionLoading } = useStore()
  const vp = useViewport()

  useEffect(() => {
    if (!sessionLoading && !session) router.push('/auth')
  }, [session, sessionLoading, router])

  if (sessionLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }} className="emoji">🪣</div>
          <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1.1rem', color: T.ink, letterSpacing: 0.5, textTransform: 'uppercase' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const isDesktop = vp === 'desktop'

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: T.bg }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, padding: '36px 48px 64px', maxWidth: 1280 }}>
          {children}
        </main>
      </div>
    )
  }

  // Mobile / tablet
  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 100 }}>
      <TopBar vp={vp} />
      <main style={{ padding: vp === 'tablet' ? '24px 36px' : '20px 18px' }}>{children}</main>
      <BottomNav />
    </div>
  )
}
