// Bucket List — Login + 404 screens.
// Both render full-bleed (no app chrome) — Login because pre-auth, 404
// because navigation context is gone.

// ─── Login ─────────────────────────────────────────────────────
function ScreenLogin({ navigate, vp }) {
  const [mode, setMode] = React.useState('login'); // 'login' | 'signup'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const isSignup = mode === 'signup';

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'stretch', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative floating stickers — playful brand backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '8%',  left: '6%',  transform: 'rotate(-12deg)', display: vp === 'mobile' ? 'none' : 'block' }}><StickerEmoji id="plane"    size={120} /></div>
        <div style={{ position: 'absolute', top: '14%', right: '8%', transform: 'rotate(14deg)',  display: vp === 'mobile' ? 'none' : 'block' }}><StickerEmoji id="pastry"   size={110} /></div>
        <div style={{ position: 'absolute', bottom: '8%', left: '10%', transform: 'rotate(-8deg)', display: vp === 'mobile' ? 'none' : 'block' }}><StickerEmoji id="sun"      size={100} /></div>
        <div style={{ position: 'absolute', bottom: '14%', right: '12%', transform: 'rotate(10deg)', display: vp === 'mobile' ? 'none' : 'block' }}><StickerEmoji id="cake"    size={120} /></div>
        <div style={{ position: 'absolute', top: '52%', left: '4%',  transform: 'rotate(6deg)',   display: vp === 'mobile' ? 'none' : 'block' }}><StickerEmoji id="heart"    size={70} /></div>
        <div style={{ position: 'absolute', top: '60%', right: '4%', transform: 'rotate(-14deg)', display: vp === 'mobile' ? 'none' : 'block' }}><StickerEmoji id="rainbow"  size={90} /></div>
        {/* Mobile gets fewer, smaller stickers in the corners */}
        <div style={{ position: 'absolute', top: 24, right: 24, transform: 'rotate(10deg)', display: vp === 'mobile' ? 'block' : 'none' }}><StickerEmoji id="pastry" size={64} /></div>
        <div style={{ position: 'absolute', bottom: 24, left: 24, transform: 'rotate(-10deg)', display: vp === 'mobile' ? 'block' : 'none' }}><StickerEmoji id="sun" size={64} /></div>
      </div>

      {/* Card */}
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
          }}>
            {isSignup ? <>SAY <HighlightBlock color="lime">HI</HighlightBlock>.</> : <>WELCOME <HighlightBlock color="pink">BACK</HighlightBlock>.</>}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: T.inkMuted, lineHeight: 1.5 }}>
            {isSignup
              ? 'Make a few buckets. Add stuff you want to do. Tag the people you want to do it with.'
              : "Sign in to pick up where you left off."}
          </div>

          {/* Form */}
          <form onSubmit={e => { e.preventDefault(); navigate('buckets'); }} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {isSignup && (
              <LoginField label="YOUR NAME" type="text" value={name} onChange={setName} placeholder="Mara Levin" autoComplete="name" />
            )}
            <LoginField label="EMAIL" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />
            <LoginField label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete={isSignup ? 'new-password' : 'current-password'} />
            {!isSignup && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="bk-sticker-btn" style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  color: T.inkMuted, textTransform: 'uppercase', padding: 4,
                }}>FORGOT PASSWORD?</button>
              </div>
            )}

            <button type="submit" className="bk-sticker-btn" style={{
              marginTop: 6, padding: '14px 18px',
              background: T.ink, color: '#fff',
              border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
              borderRadius: 14, cursor: 'pointer',
              fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>{isSignup ? "LET'S GO →" : 'SIGN IN →'}</button>
          </form>

          {/* OAuth divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '22px 0 16px',
            fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
            color: T.inkMuted, textTransform: 'uppercase',
          }}>
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(12,12,12,0.25)' }} />
            OR
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(12,12,12,0.25)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <OAuthButton label="CONTINUE WITH APPLE"  color="surface" glyph="" />
            <OAuthButton label="CONTINUE WITH GOOGLE" color="surface" glyph="G" />
          </div>
        </Sticker>

        {/* Mode toggle */}
        <div style={{
          marginTop: 18, textAlign: 'center',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          color: T.inkMuted, textTransform: 'uppercase',
        }}>
          {isSignup ? 'ALREADY HAVE AN ACCOUNT? ' : "DON'T HAVE AN ACCOUNT? "}
          <button onClick={() => setMode(isSignup ? 'login' : 'signup')} className="bk-sticker-btn" style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
            color: T.ink, textTransform: 'uppercase',
            textDecoration: 'underline', textDecorationThickness: 2, textUnderlineOffset: 3,
          }}>{isSignup ? 'SIGN IN' : 'SIGN UP'}</button>
        </div>
      </div>
    </div>
  );
}

function LoginField({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
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
        style={{
          width: '100%', padding: '12px 14px',
          background: T.bg, border: STICKER_BORDER_SM,
          boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
          borderRadius: 12, outline: 'none',
          fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
          color: T.ink,
        }}
        onFocus={e => { e.target.style.boxShadow = '3px 3px 0 #0C0C0C'; }}
        onBlur={e =>  { e.target.style.boxShadow = '2px 2px 0 rgba(12,12,12,0.18)'; }}
      />
    </label>
  );
}

function OAuthButton({ label, color = 'surface', glyph }) {
  return (
    <button className="bk-sticker-btn" style={{
      padding: '12px 16px',
      background: T[color] || color,
      border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
      borderRadius: 12, cursor: 'pointer',
      fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
      textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {glyph && (
        <span style={{
          width: 22, height: 22, borderRadius: 99,
          background: T.bg, border: '1.5px solid #0C0C0C',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700,
        }}>{glyph}</span>
      )}
      {label}
    </button>
  );
}

// ─── 404 ───────────────────────────────────────────────────────
function Screen404({ navigate, vp }) {
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: vp === 'mobile' ? '32px 18px' : '40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Floating sticker backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '8%',  transform: 'rotate(-18deg)' }}><StickerEmoji id="globe"    size={vp === 'mobile' ? 70 : 110} /></div>
        <div style={{ position: 'absolute', top: '12%', right: '10%', transform: 'rotate(20deg)'  }}><StickerEmoji id="bolt"     size={vp === 'mobile' ? 60 : 100} /></div>
        <div style={{ position: 'absolute', bottom: '14%', left: '14%', transform: 'rotate(-12deg)' }}><StickerEmoji id="moon"     size={vp === 'mobile' ? 60 : 90} /></div>
        <div style={{ position: 'absolute', bottom: '8%',  right: '8%', transform: 'rotate(16deg)' }}><StickerEmoji id="diamond"  size={vp === 'mobile' ? 60 : 100} /></div>
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 560, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        {/* Big sticker numbers */}
        <div style={{ display: 'flex', gap: vp === 'mobile' ? 10 : 18 }}>
          <FourOhFourDigit n="4" color="cyan"    tilt={-4} />
          <FourOhFourDigit n="0" color="pink"    tilt={3} />
          <FourOhFourDigit n="4" color="yellow"  tilt={-4} />
        </div>

        <div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -2,
            fontSize: vp === 'mobile' ? 36 : 56, lineHeight: 0.95, textTransform: 'uppercase',
          }}>
            NOT ON THE <HighlightBlock color="lime">LIST</HighlightBlock>.
          </div>
          <div style={{
            marginTop: 14, fontSize: 14, fontWeight: 500, color: T.inkMuted, lineHeight: 1.5,
            maxWidth: 460, marginLeft: 'auto', marginRight: 'auto',
          }}>
            This page doesn't exist — yet. Maybe it's a bucket-list item you forgot to add?
            Take it as a sign.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('buckets')} className="bk-sticker-btn" style={{
            padding: '14px 22px',
            background: T.ink, color: '#fff',
            border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
            borderRadius: 14, cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>← BACK TO MY BUCKETS</button>
          <button onClick={() => navigate('add')} className="bk-sticker-btn" style={{
            padding: '14px 22px',
            background: T.surface, color: T.ink,
            border: STICKER_BORDER, boxShadow: STICKER_SHADOW,
            borderRadius: 14, cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>＋ ADD A THING</button>
        </div>
      </div>
    </div>
  );
}

function FourOhFourDigit({ n, color, tilt }) {
  const vp = useViewport();
  const size = vp === 'mobile' ? 88 : 140;
  return (
    <div style={{
      width: size, height: size,
      background: T[color],
      border: STICKER_BORDER, boxShadow: STICKER_SHADOW_LG,
      borderRadius: 22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${tilt}deg)`,
      fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -3,
      fontSize: vp === 'mobile' ? 64 : 100, color: T.ink, lineHeight: 1,
    }}>{n}</div>
  );
}

Object.assign(window, { ScreenLogin, Screen404, LoginField, OAuthButton, FourOhFourDigit });
