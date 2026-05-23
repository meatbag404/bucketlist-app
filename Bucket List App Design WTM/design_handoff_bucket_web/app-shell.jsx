// Bucket List — responsive AppShell.
// Desktop: fixed sidebar on the left with logo + nav items + new-bucket CTA.
// Mobile:  top bar + fixed bottom-nav sticker pill (matches the existing
// mobile prototype). Tablet uses the mobile layout for simplicity.

const NAV_ITEMS = [
  { id: 'buckets',  label: 'Buckets',   icon: 'bucket',  color: 'lime' },
  { id: 'activity', label: 'Activity',  icon: 'clock',   color: 'cyan' },
  { id: 'memories', label: 'Memories',  icon: 'photo',   color: 'pink' },
  { id: 'friends',  label: 'Friends',   icon: 'friends', color: 'yellow' },
];

// ─── Sidebar (desktop) ──────────────────────────────────────────
function Sidebar({ route, navigate }) {
  // The current top-level "tab" for highlight purposes — derive from screen.
  const tab = (() => {
    const s = route.screen;
    if (s === 'bucket' || s === 'item' || s === 'add' || s === 'icons') return 'buckets';
    return s;
  })();

  return (
    <aside style={{
      width: 248, flex: '0 0 248px',
      padding: '28px 18px 28px 24px',
      borderRight: STICKER_BORDER_SM,
      background: '#F5E8C7',
      backgroundImage: 'radial-gradient(rgba(12,12,12,0.06) 1.5px, transparent 1.5px)',
      backgroundSize: '14px 14px',
      backgroundPosition: '0 0',
      position: 'sticky', top: 0, height: '100vh',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      {/* Logo */}
      <button className="bk-logo-link" onClick={() => navigate('buckets')} aria-label="Bucket List — home">
        <div style={{
          padding: '6px 12px',
          background: T.ink, color: T.bg, borderRadius: 10,
          border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
          fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.5,
          transform: 'rotate(-1deg)',
        }}>BUCKET</div>
        <HighlightBlock color="yellow" tilt={2} size="sm">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6 }}>LIST</span>
        </HighlightBlock>
      </button>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
        {NAV_ITEMS.map(item => {
          const on = tab === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item.id)}
              className="bk-sticker-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                background: on ? T[item.color] : 'transparent',
                color: T.ink,
                border: on ? STICKER_BORDER_SM : '2px solid transparent',
                boxShadow: on ? STICKER_SHADOW_SM : 'none',
                borderRadius: 12, cursor: 'pointer',
                fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
                textTransform: 'uppercase', textAlign: 'left',
                transform: on ? 'rotate(-1deg)' : 'rotate(0deg)',
              }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8, background: T[item.color],
                border: STICKER_BORDER_SM, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flex: '0 0 auto',
              }}>
                <NavIcon name={item.icon} size={18} />
              </span>
              {item.label}
              {item.id === 'activity' && (
                <span style={{
                  marginLeft: 'auto', minWidth: 22, height: 22, padding: '0 6px', borderRadius: 99,
                  background: T.red, color: '#fff',
                  border: '1.5px solid #0C0C0C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
                }}>3</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Add CTA */}
      <button onClick={() => navigate('add')}
        className="bk-sticker-btn"
        style={{
          padding: '14px 18px', borderRadius: 14,
          background: T.ink, color: '#fff',
          border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
          fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.6,
          textTransform: 'uppercase', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          whiteSpace: 'nowrap',
        }}>
        <NavIcon name="plus" size={20} color="#fff" /> ADD A THING
      </button>

      {/* Profile chip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 8, borderRadius: 12,
        background: T.surface, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
      }}>
        <Avatar p={BK_PROFILES.me} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: -0.2 }}>
            {BK_PROFILES.me.name}
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted }}>@{BK_PROFILES.me.handle}</div>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar (mobile / tablet) ──────────────────────────────────
function TopBar({ navigate, vp }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: T.bg,
      padding: vp === 'tablet' ? '14px 22px' : '12px 18px',
      borderBottom: '1.5px solid rgba(12,12,12,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <button className="bk-logo-link" onClick={() => navigate('buckets')} aria-label="Bucket List — home">
        <div style={{
          padding: '5px 10px',
          background: T.ink, color: T.bg, borderRadius: 8,
          border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
          fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.4,
          transform: 'rotate(-1deg)',
        }}>BUCKET</div>
        <HighlightBlock color="yellow" tilt={2} size="sm">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6 }}>LIST</span>
        </HighlightBlock>
      </button>
      <button className="bk-sticker-btn" onClick={() => navigate('activity')} style={{
        width: 40, height: 40, borderRadius: 99,
        background: T.pink, border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <NavIcon name="clock" size={20} />
        <span style={{
          position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 4px',
          borderRadius: 99, background: T.red, color: '#fff', border: '1.5px solid #fff',
          fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>3</span>
      </button>
    </header>
  );
}

// ─── Bottom nav (mobile / tablet) ───────────────────────────────
function BottomNav({ route, navigate }) {
  const tab = (() => {
    const s = route.screen;
    if (s === 'bucket' || s === 'item' || s === 'icons') return 'buckets';
    return s;
  })();
  const items = [
    { id: 'buckets',  icon: 'bucket',  color: 'lime' },
    { id: 'activity', icon: 'clock',   color: 'cyan' },
    { id: 'add',      icon: 'plus',    color: 'ink', isAdd: true },
    { id: 'memories', icon: 'photo',   color: 'pink' },
    { id: 'friends',  icon: 'friends', color: 'yellow' },
  ];
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
            <button key={it.id} className="bk-sticker-btn" onClick={() => navigate(it.id)} style={{
              width: 50, height: 50, borderRadius: 99,
              background: T.ink, color: '#fff',
              border: STICKER_BORDER_SM, boxShadow: '3px 3px 0 #0C0C0C',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <NavIcon name="plus" size={24} color="#fff" />
            </button>
          );
        }
        const on = tab === it.id;
        return (
          <button key={it.id} className="bk-sticker-btn" onClick={() => navigate(it.id)} style={{
            width: 44, height: 44, borderRadius: 99,
            background: on ? T[it.color] : 'transparent',
            border: on ? STICKER_BORDER_SM : 'none',
            boxShadow: on ? '2px 2px 0 #0C0C0C' : 'none',
            transform: on ? 'rotate(-3deg)' : 'rotate(0deg)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <NavIcon name={it.icon} size={22} />
          </button>
        );
      })}
    </nav>
  );
}

// ─── AppShell — picks the right chrome for the viewport ─────────
function AppShell({ children, route, navigate, vp, fullBleed }) {
  const isDesktop = vp === 'desktop';
  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: T.bg }}>
        <Sidebar route={route} navigate={navigate} />
        <main style={{
          flex: 1, minWidth: 0, padding: fullBleed ? 0 : '36px 48px 64px',
          maxWidth: 1280,
        }}>{children}</main>
      </div>
    );
  }
  // Mobile / tablet
  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 100 }}>
      <TopBar navigate={navigate} vp={vp} />
      <main style={{ padding: vp === 'tablet' ? '24px 36px' : '20px 18px' }}>{children}</main>
      <BottomNav route={route} navigate={navigate} />
    </div>
  );
}

Object.assign(window, { NAV_ITEMS, Sidebar, TopBar, BottomNav, AppShell });
