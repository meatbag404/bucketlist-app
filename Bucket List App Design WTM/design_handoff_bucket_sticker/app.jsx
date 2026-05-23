// Bucket — Tweaks panel + design canvas app entry.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "cool",
  "showAllScreens": true,
  "denseRows": false
}/*EDITMODE-END*/;

function BucketApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = BK_PALETTES[tweaks.palette] || BK_PALETTES.warm;

  return (
    <>
      <DesignCanvas>
        {/* INTERACTIVE PROTOTYPE — Concept C (the chosen direction) */}
        <DCSection
          id="interactive"
          title="Interactive prototype · Bold sticker"
          subtitle="Tap a bucket card to dive in, tap any sticker item to open it, ＋ to add. Bottom bar glyphs switch sections."
        >
          <DCArtboard id="proto-c" label="Try it · iPhone 15" width={413} height={892}>
            <FrameWrap sticker>
              <CCPhone interactive />
            </FrameWrap>
          </DCArtboard>
        </DCSection>

        {/* CONCEPT C — full static set */}
        <DCSection
          id="sticker-screens"
          title="Every screen · frozen"
          subtitle="Static states for each section, so you can comment on a specific moment. Click any artboard's ↗ to focus."
        >
          <DCArtboard id="cc-home"     label="1 · Buckets home"       width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="home" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-bucket"   label="2 · Inside a bucket"    width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="bucket" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-item"     label="3 · Item with memory"   width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="item" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-add"      label="4 · Add to bucket"      width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="add" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-memories" label="5 · Memories wall"      width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="memories" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-activity" label="6 · Activity feed"      width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="activity" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-friends"  label="7 · Friends & invite"   width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="friends" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cc-picker"   label="8 · Sticker library"    width={413} height={892}>
            <FrameWrap sticker><CCPhone screen="iconpicker" /></FrameWrap>
          </DCArtboard>
        </DCSection>

        {/* ALTERNATIVE DIRECTIONS — kept for reference */}
        <DCSection
          id="alts"
          title="Other directions for reference"
          subtitle="The cool/vivid and quiet journal concepts, in case you want to lift something into the sticker direction."
        >
          <DCArtboard id="ca-home"   label="A · Cool · Home"      width={413} height={892}>
            <FrameWrap><StaticPhone screen="home" theme={theme} /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="ca-bucket" label="A · Cool · Bucket"    width={413} height={892}>
            <FrameWrap><StaticPhone screen="bucket" theme={theme} /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="ca-item"   label="A · Cool · Item"      width={413} height={892}>
            <FrameWrap><StaticPhone screen="item" theme={theme} /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cb-home"   label="B · Journal · Home"   width={413} height={892}>
            <FrameWrap journal><CBPhone screen="home" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cb-bucket" label="B · Journal · Bucket" width={413} height={892}>
            <FrameWrap journal><CBPhone screen="bucket" /></FrameWrap>
          </DCArtboard>
          <DCArtboard id="cb-item"   label="B · Journal · Item"   width={413} height={892}>
            <FrameWrap journal><CBPhone screen="item" /></FrameWrap>
          </DCArtboard>
        </DCSection>

        {/* DESIGN SYSTEM REFERENCE */}
        <DCSection
          id="system"
          title="Sticker design notes"
          subtitle="Tokens for porting the chosen direction back into the React Native codebase."
        >
          <DCArtboard id="palette-cc" label="Sticker palette" width={520} height={360}>
            <CCPaletteSheet />
          </DCArtboard>
          <DCArtboard id="cc-type" label="Type & components" width={520} height={360}>
            <CCTypeSheet />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Palette"
            value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={[
              { value: 'warm', label: 'Warm' },
              { value: 'cool', label: 'Cool' },
              { value: 'dusk', label: 'Dusk' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Note">
          <div style={{ fontSize: 12, color: '#7C746A', lineHeight: 1.5 }}>
            The interactive prototype on the left is the canonical experience. The static screens
            around it freeze specific states for feedback. Copy + category tokens mirror the
            Supabase / React Native codebase.
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Scaled-down wrapper so the 393-wide phone fits comfortably in a 413-wide
// artboard with a little breathing room (we render at 1× — DesignCanvas
// handles the canvas-level zoom).
function FrameWrap({ children, journal, sticker }) {
  const bg = journal ? '#E1D8C0' : sticker ? '#FFE7A8' : '#EFEAE0';
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bg,
    }}>
      {children}
    </div>
  );
}

function PaletteSheet({ theme }) {
  const swatches = [
    { label: 'bg',         color: theme.bg },
    { label: 'surface',    color: theme.surface },
    { label: 'ink',        color: theme.ink },
    { label: 'ink muted',  color: theme.inkMuted },
    { label: 'accent',     color: theme.accent },
    { label: 'line',       color: '#221E1814' },
  ];
  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg,
      padding: 28, fontFamily: BK_FONT_UI, color: theme.ink,
      boxSizing: 'border-box',
    }}>
      <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>
        {theme.name} palette.
      </div>
      <div style={{ fontSize: 12, color: theme.inkMuted, marginTop: 6, marginBottom: 22 }}>
        Six base tokens drive everything outside of category accents.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {swatches.map(s => (
          <div key={s.label} style={{
            background: theme.surface, borderRadius: 12, padding: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            border: `1px solid ${theme.line}`,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color, border: `1px solid ${theme.line}` }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: theme.inkMuted, fontFamily: BK_FONT_MONO }}>{s.color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeSheet({ theme }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg,
      padding: 28, fontFamily: BK_FONT_UI, color: theme.ink,
      boxSizing: 'border-box',
    }}>
      <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 1.02, whiteSpace: 'nowrap' }}>
        Your buckets,
      </div>
      <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 56, lineHeight: 1.1, letterSpacing: -1, whiteSpace: 'nowrap' }}>
        Mara.
      </div>
      <div style={{ marginTop: 18, fontSize: 11, color: theme.inkMuted, fontFamily: BK_FONT_MONO }}>
        Instrument Serif · italic + roman, used for screen titles + memory quotes
      </div>

      <div style={{ marginTop: 18, fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>
        Pastéis de Belém — eat 6, no judgement
      </div>
      <div style={{ fontSize: 11, color: theme.inkMuted, fontFamily: BK_FONT_MONO, marginTop: 4 }}>
        Geist · 600 · used for item titles
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: theme.inkMuted }}>
        5 of 14 ticked off · departs in 24 days
      </div>
      <div style={{ fontSize: 11, color: theme.inkSubtle, fontFamily: BK_FONT_MONO, marginTop: 4 }}>
        Geist · 400 · body + meta
      </div>
    </div>
  );
}

function CategorySheet({ theme }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg,
      padding: 28, fontFamily: BK_FONT_UI, color: theme.ink,
      boxSizing: 'border-box',
    }}>
      <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>
        Category tokens.
      </div>
      <div style={{ fontSize: 12, color: theme.inkMuted, marginTop: 6, marginBottom: 18 }}>
        Each category carries its own accent, bg tint, dark ink, and glyph — mirrors the
        <code style={{ fontFamily: BK_FONT_MONO }}> categories</code> table.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(BK_CATS).map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: v.bg, borderRadius: 12, padding: '10px 14px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: v.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16,
            }}>{v.glyph}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: v.dark }}>{v.label}</div>
              <div style={{ fontFamily: BK_FONT_MONO, fontSize: 10, color: v.dark, opacity: 0.7 }}>
                {v.accent} · {v.bg} · {v.dark}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BucketApp />);
