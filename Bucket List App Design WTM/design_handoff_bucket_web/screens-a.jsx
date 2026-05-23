// Bucket List — screens, web responsive. Eight screens, all driven by
// useViewport() to pick the right grid + hero treatments.

// ─── Page heading — reused on every top-level screen ───────────
function PageHeading({ overline, lineA, accent, lineB, sub, vp, rightSlot }) {
  const big = vp === 'desktop' ? 84 : vp === 'tablet' ? 64 : 48;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 24, marginBottom: vp === 'mobile' ? 22 : 32,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {overline && (
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', color: T.inkMuted, marginBottom: 12,
          }}>{overline}</div>
        )}
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: vp === 'mobile' ? -2 : -3.5,
          lineHeight: 0.9, textTransform: 'uppercase', fontSize: big,
        }}>
          {lineA}
          {accent && (
            <>{' '}<HighlightBlock color={accent.color} tilt={accent.tilt || -2}>{accent.text}</HighlightBlock></>
          )}
          {lineB && <><br />{lineB}</>}
        </div>
        {sub && (
          <div style={{
            marginTop: 14, fontSize: vp === 'mobile' ? 13 : 15, fontWeight: 500,
            color: T.inkMuted, lineHeight: 1.5, maxWidth: 620,
          }}>{sub}</div>
        )}
      </div>
      {rightSlot && <div style={{ flex: '0 0 auto' }}>{rightSlot}</div>}
    </div>
  );
}

// ─── 1. Buckets home ───────────────────────────────────────────
// Three layout variations the user can flip between. All show the same
// data — they just emphasize different things. Stored in localStorage so
// it persists across reloads.
function ScreenBuckets({ navigate, vp }) {
  const [layout, setLayoutRaw] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const v = window.localStorage.getItem('bk-home-layout');
      if (v === 'grid' || v === 'list' || v === 'featured') return v;
    }
    return 'featured';
  });
  const setLayout = (l) => {
    setLayoutRaw(l);
    try { window.localStorage.setItem('bk-home-layout', l); } catch {}
  };

  const totalDone = BK_BUCKETS.reduce((s, b) => s + b.done, 0);
  const totalAll = BK_BUCKETS.reduce((s, b) => s + b.total, 0);

  return (
    <div>
      <PageHeading
        overline={`Hey, ${BK_PROFILES.me.name.split(' ')[0]} ↓`}
        lineA="WHAT'S"
        lineB={<>ON THE <HighlightBlock color="lime">LIST</HighlightBlock></>}
        sub={<>You have <span style={{ fontWeight: 700, color: T.ink }}>{BK_BUCKETS.length}</span> buckets · <span style={{ fontWeight: 700, color: T.ink }}>{totalDone}</span> of {totalAll} ticked off this year.</>}
        vp={vp}
        rightSlot={vp !== 'mobile' && (
          <LayoutSwitcher value={layout} onChange={setLayout} />
        )}
      />

      {vp === 'mobile' && (
        <div style={{ marginBottom: 18 }}>
          <LayoutSwitcher value={layout} onChange={setLayout} />
        </div>
      )}

      {layout === 'featured' && <HomeFeatured navigate={navigate} vp={vp} />}
      {layout === 'grid' &&     <HomeGrid     navigate={navigate} vp={vp} />}
      {layout === 'list' &&     <HomeList     navigate={navigate} vp={vp} />}
    </div>
  );
}

function LayoutSwitcher({ value, onChange }) {
  const opts = [
    { id: 'featured', label: 'FEATURED' },
    { id: 'grid',     label: 'GRID' },
    { id: 'list',     label: 'LIST' },
  ];
  return (
    <Sticker radius={99} border="sm" shadow="sm" style={{
      padding: 4, display: 'inline-flex', gap: 2,
    }}>
      {opts.map(o => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} className="bk-sticker-btn" style={{
            padding: '6px 12px', borderRadius: 99,
            background: on ? T.ink : 'transparent',
            color: on ? T.bg : T.ink,
            border: 'none', cursor: 'pointer',
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>{o.label}</button>
        );
      })}
    </Sticker>
  );
}

// Variation 1 — Featured big card + grid of the rest (the original).
function HomeFeatured({ navigate, vp }) {
  const featured = BK_BUCKETS[0];
  const rest = BK_BUCKETS.slice(1);
  return (
    <>
      <BucketCard b={featured} featured vp={vp} onClick={() => navigate('bucket', featured.id)} />
      <SectionRule label="ALL BUCKETS" rightSlot={<StickerButton color="cyan" onClick={() => navigate('add')} size="sm">＋ NEW BUCKET</StickerButton>} />
      <div style={{
        display: 'grid', gap: vp === 'mobile' ? 16 : 22,
        gridTemplateColumns: vp === 'mobile' ? '1fr' : vp === 'tablet' ? '1fr 1fr' : '1fr 1fr 1fr',
      }}>
        {rest.map(b => (
          <BucketCard key={b.id} b={b} vp={vp} onClick={() => navigate('bucket', b.id)} />
        ))}
        <NewBucketCard onClick={() => navigate('add')} />
      </div>
    </>
  );
}

// Variation 2 — Equal grid, no featured card. Everything same size.
function HomeGrid({ navigate, vp }) {
  return (
    <>
      <SectionRule label={`${BK_BUCKETS.length} BUCKETS`} rightSlot={<StickerButton color="cyan" onClick={() => navigate('add')} size="sm">＋ NEW BUCKET</StickerButton>} />
      <div style={{
        display: 'grid', gap: vp === 'mobile' ? 16 : 22,
        gridTemplateColumns: vp === 'mobile' ? '1fr 1fr' : vp === 'tablet' ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
      }}>
        {BK_BUCKETS.map(b => (
          <BucketCard key={b.id} b={b} vp={vp} onClick={() => navigate('bucket', b.id)} />
        ))}
        <NewBucketCard onClick={() => navigate('add')} />
      </div>
    </>
  );
}

// Variation 3 — Vertical list with richer per-row meta.
function HomeList({ navigate, vp }) {
  return (
    <>
      <SectionRule label="ALL BUCKETS · LIST VIEW" rightSlot={<StickerButton color="cyan" onClick={() => navigate('add')} size="sm">＋ NEW BUCKET</StickerButton>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {BK_BUCKETS.map((b, i) => (
          <BucketListRow key={b.id} b={b} idx={i} vp={vp} onClick={() => navigate('bucket', b.id)} />
        ))}
        <NewBucketCard onClick={() => navigate('add')} />
      </div>
    </>
  );
}

function BucketListRow({ b, idx, vp, onClick }) {
  const tilt = idx % 2 === 0 ? -0.4 : 0.4;
  const itemsInBucket = BK_ITEMS.filter(i => i.bucket === b.id);
  // Pretend last activity — derive from latest item meta. Not real data but
  // gives the layout something to anchor to.
  const lastDone = itemsInBucket.find(i => i.done);

  return (
    <Sticker tilt={tilt} radius={16} shadow="md" onClick={onClick} style={{
      padding: vp === 'mobile' ? '14px 14px 14px 22px' : '18px 22px 18px 28px',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', gap: vp === 'mobile' ? 12 : 20,
      flexWrap: vp === 'mobile' ? 'wrap' : 'nowrap',
    }}>
      {/* Left color band */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 12,
        background: T[b.color], borderRight: '2px solid #0C0C0C',
      }} />
      <StickerEmoji id={b.emoji} size={vp === 'mobile' ? 52 : 64} tilt={-3} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 18 : 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1, textTransform: 'uppercase' }}>
          {b.name}
        </div>
        <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: T.inkMuted, letterSpacing: 0.3 }}>
          {b.sub} {b.countdown ? `· ${b.countdown}d to go` : ''}
        </div>
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
          height: 12,
        }}>
          <div style={{ flex: 1, height: 8, borderRadius: 99, background: T.bg, border: '1.5px solid #0C0C0C', overflow: 'hidden', minWidth: 80 }}>
            <div style={{ width: b.pct + '%', height: '100%', background: T[b.color], borderRight: b.pct > 0 && b.pct < 100 ? '1.5px solid #0C0C0C' : 'none' }} />
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            {b.done}<span style={{ opacity: 0.4 }}>/{b.total}</span>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
        flex: '0 0 auto', minWidth: vp === 'mobile' ? '100%' : 'auto',
        order: vp === 'mobile' ? 3 : 'unset',
      }}>
        <AvatarStack ids={b.members} size={26} ring={T.surface} max={4} />
        {lastDone && (
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, letterSpacing: 0.4, whiteSpace: 'nowrap' }}>
            last: {lastDone.title.slice(0, 20)}{lastDone.title.length > 20 ? '…' : ''}
          </div>
        )}
      </div>
    </Sticker>
  );
}

function SectionRule({ label, rightSlot }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      marginTop: 32, marginBottom: 20,
    }}>
      <HighlightBlock color="ink" tilt={-1}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#fff', textTransform: 'uppercase' }}>· {label} ·</span>
      </HighlightBlock>
      <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
      {rightSlot}
    </div>
  );
}

function BucketCard({ b, featured, vp, onClick }) {
  const tilt = featured ? 0 : (b.id.charCodeAt(b.id.length - 1) % 2 ? 1 : -1) * 0.8;
  return (
    <Sticker color={b.color} tilt={tilt} radius={18} shadow={featured ? 'lg' : 'md'}
      onClick={onClick}
      style={{
        padding: featured ? (vp === 'mobile' ? 20 : 28) : 18,
        position: 'relative', overflow: 'hidden',
        minHeight: featured ? (vp === 'desktop' ? 280 : 220) : undefined,
      }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, marginBottom: featured ? 16 : 14,
      }}>
        <StickerEmoji id={b.emoji} size={featured ? 72 : 56} tilt={-3} />
        {b.countdown ? (
          <div style={{
            padding: '4px 10px', background: T.ink, color: T.bg, borderRadius: 99,
            border: '1.5px solid #0C0C0C',
            fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
          }}>{b.countdown}d ↗</div>
        ) : b.pct === 0 ? (
          <div style={{
            padding: '4px 10px', background: T.ink, color: T.bg, borderRadius: 99,
            border: '1.5px solid #0C0C0C',
            fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
          }}>NEW</div>
        ) : (
          <div style={{
            padding: '4px 10px', background: T.bg, borderRadius: 99,
            border: '1.5px solid #0C0C0C',
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
          }}>{b.pct}%</div>
        )}
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY,
        fontSize: featured ? (vp === 'mobile' ? 28 : 36) : 22,
        fontWeight: 700, letterSpacing: -1, lineHeight: 0.98,
        textTransform: 'uppercase',
      }}>{b.name}</div>
      <div style={{
        marginTop: 6, fontSize: 12, fontWeight: 600, color: T.ink, opacity: 0.7,
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>{b.sub}</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: featured ? 22 : 16, paddingTop: 14,
        borderTop: '2px solid rgba(12,12,12,0.16)',
      }}>
        <AvatarStack ids={b.members} size={featured ? 32 : 26} ring={T[b.color]} max={4} />
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: featured ? 24 : 20, fontWeight: 700,
          letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums',
        }}>{b.done}<span style={{ opacity: 0.4 }}>/{b.total}</span></div>
      </div>
    </Sticker>
  );
}

function NewBucketCard({ onClick }) {
  return (
    <button onClick={onClick} className="bk-sticker-btn" style={{
      padding: 18, borderRadius: 18,
      background: 'transparent',
      border: '2.5px dashed #0C0C0C',
      cursor: 'pointer', textAlign: 'left',
      minHeight: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 99,
        background: T.bg, border: '2.5px dashed #0C0C0C',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><NavIcon name="plus" size={28} /></div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>NEW BUCKET</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>Solo or shared</div>
    </button>
  );
}

// ─── 2. Inside a bucket ─────────────────────────────────────────
function ScreenBucket({ bucketId, navigate, vp }) {
  const b = BK_BUCKETS.find(x => x.id === bucketId) || BK_BUCKETS[0];
  const items = BK_ITEMS.filter(i => i.bucket === b.id);
  const [filter, setFilter] = React.useState(null);
  const todo = items.filter(i => !i.done && (!filter || i.cat === filter));
  const done = items.filter(i => i.done && (!filter || i.cat === filter));

  return (
    <div>
      {/* Back link */}
      <button onClick={() => navigate('buckets')} className="bk-sticker-btn" style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        color: T.inkMuted, textTransform: 'uppercase', padding: 0, marginBottom: 18,
      }}>‹ ALL BUCKETS</button>

      {/* Hero card */}
      <Sticker color={b.color} radius={20} shadow="lg" style={{
        padding: vp === 'mobile' ? 22 : 32, marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: vp === 'desktop' ? 'row' : 'column',
          alignItems: vp === 'desktop' ? 'flex-end' : 'flex-start',
          gap: vp === 'mobile' ? 18 : 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 0 }}>
            <StickerEmoji id={b.emoji} size={vp === 'mobile' ? 64 : 88} tilt={-4} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
                textTransform: 'uppercase', color: T.ink, opacity: 0.7, marginBottom: 6,
              }}>
                {b.countdown ? `DEPARTS IN ${b.countdown} DAYS` : `${b.members.length} KEEPER${b.members.length > 1 ? 'S' : ''}`}
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY,
                fontSize: vp === 'mobile' ? 32 : vp === 'tablet' ? 44 : 56,
                fontWeight: 700, letterSpacing: -1.5, lineHeight: 0.96,
                textTransform: 'uppercase',
              }}>{b.name}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <AvatarStack ids={b.members} size={32} ring={T[b.color]} />
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{b.sub}</div>
              </div>
            </div>
          </div>
          {/* Progress */}
          <div style={{
            width: vp === 'desktop' ? 280 : '100%',
            background: T.surface,
            border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
            borderRadius: 16, padding: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted }}>PROGRESS</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>{b.done}<span style={{ opacity: 0.4 }}>/{b.total}</span></div>
            </div>
            <div style={{ height: 16, borderRadius: 99, background: T.bg, border: STICKER_BORDER_SM, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: b.pct + '%', height: '100%', background: T.lime, borderRight: '2px solid #0C0C0C' }} />
            </div>
          </div>
        </div>
      </Sticker>

      {/* Filter chips */}
      <div className="bk-scrollx" style={{ display: 'flex', gap: 8, marginBottom: 20, padding: '2px 0' }}>
        <StickerChip active={!filter} color="ink" onClick={() => setFilter(null)}>ALL · {items.length}</StickerChip>
        {Object.entries(BK_CATS).map(([k, c]) => (
          <StickerChip key={k} active={filter === k} color={c.color} onClick={() => setFilter(filter === k ? null : k)}>
            {c.label}
          </StickerChip>
        ))}
      </div>

      {/* Items */}
      <div style={{
        display: 'grid', gap: vp === 'mobile' ? 12 : 16,
        gridTemplateColumns: vp === 'desktop' ? '1fr 1fr' : '1fr',
      }}>
        {todo.map((it, i) => (
          <ItemCard key={it.id} item={it} idx={i} onClick={() => navigate('item', it.id)} />
        ))}
      </div>

      {/* Done */}
      {done.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '32px 0 18px' }}>
            <HighlightBlock color="lime" tilt={-1} size="sm">
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>· DONE · {done.length} ·</span>
            </HighlightBlock>
            <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
          </div>
          <div style={{
            display: 'grid', gap: vp === 'mobile' ? 12 : 16,
            gridTemplateColumns: vp === 'desktop' ? '1fr 1fr' : '1fr',
          }}>
            {done.map((it, i) => (
              <ItemCard key={it.id} item={it} idx={i} onClick={() => navigate('item', it.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ItemCard({ item, idx, onClick }) {
  const cat = BK_CATS[item.cat];
  const tilt = idx % 3 === 1 ? -0.6 : idx % 3 === 2 ? 0.6 : 0;
  return (
    <Sticker tilt={tilt} radius={16} shadow="sm" onClick={onClick} style={{
      padding: '14px 16px 14px 24px', position: 'relative',
      opacity: item.done ? 0.65 : 1,
      overflow: 'hidden',
    }}>
      {/* Colored left band — inside the card, flush with left border */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 10,
        background: T[cat.color], borderRight: '2px solid #0C0C0C',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
        <StickerEmoji id={item.icon} size={56} frameColor={cat.color} tilt={-2} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.25,
            textDecoration: item.done ? 'line-through' : 'none',
          }}>{item.done ? '✓ ' : ''}{item.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <span style={{
              padding: '2px 8px', background: T.bg, border: '1.5px solid #0C0C0C', borderRadius: 6,
              fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>{cat.label}</span>
            {item.date && <span style={{ padding: '2px 8px', background: T.bg, border: '1.5px solid #0C0C0C', borderRadius: 6, fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>📅 {item.date}</span>}
            {item.loc && <span style={{ padding: '2px 8px', background: T.bg, border: '1.5px solid #0C0C0C', borderRadius: 6, fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>📍 {item.loc}</span>}
          </div>
          {item.note && (
            <div style={{
              marginTop: 10, padding: '8px 12px',
              background: T[cat.color], border: '1.5px solid #0C0C0C', borderRadius: 8,
              fontSize: 13, fontWeight: 500, color: T.ink, lineHeight: 1.4,
            }}>"{item.note}"</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: '0 0 auto' }}>
          {item.starred && (
            <div style={{
              width: 28, height: 28, borderRadius: 99, background: T.yellow,
              border: '1.5px solid #0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><NavIcon name="star" size={16} /></div>
          )}
          {item.hearts > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '2px 8px', background: T.red, color: '#fff',
              border: '1.5px solid #0C0C0C', borderRadius: 99,
              fontSize: 11, fontWeight: 700,
            }}>♥ {item.hearts}</div>
          )}
          {item.tags.length > 0 && <AvatarStack ids={item.tags} size={20} max={3} ring={T.surface} />}
        </div>
      </div>
    </Sticker>
  );
}

// ─── 3. Item detail ────────────────────────────────────────────
function ScreenItem({ itemId, navigate, vp }) {
  const item = BK_ITEMS.find(i => i.id === itemId) || BK_ITEMS[1];
  const cat = BK_CATS[item.cat];
  const comments = [
    { id: 'c1', who: 'rio', text: 'I cried. The custard was WARM.', when: '12m' },
    { id: 'c2', who: 'jay', text: 'Bringing one home. Or four.', when: '38m' },
    { id: 'c3', who: 'me',  text: 'Officially ruined for all other pastries.', when: '1h' },
  ];

  return (
    <div>
      <button onClick={() => navigate('bucket', item.bucket)} className="bk-sticker-btn" style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        color: T.inkMuted, textTransform: 'uppercase', padding: 0, marginBottom: 18,
      }}>‹ BACK TO BUCKET</button>

      <div style={{
        display: 'grid', gap: vp === 'desktop' ? 32 : 22,
        gridTemplateColumns: vp === 'desktop' ? '1.1fr 1fr' : '1fr',
        alignItems: 'start',
      }}>
        {/* LEFT — hero + meta */}
        <div>
          <Sticker color={cat.color} radius={20} shadow="lg" style={{
            padding: vp === 'mobile' ? 22 : 32, marginBottom: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{
                padding: '4px 10px', background: T.surface, borderRadius: 99,
                border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}>
                <span style={{ width: 6, height: 6, background: T[cat.color], borderRadius: 99, border: '1px solid #0C0C0C' }} />
                {cat.label}
              </div>
              {item.done && (
                <div style={{
                  padding: '4px 10px', background: T.lime, borderRadius: 99,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                  fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
                }}>✓&nbsp;DONE</div>
              )}
            </div>
            <StickerEmoji id={item.icon} size={vp === 'mobile' ? 88 : 120} tilt={-4} />
            <div style={{
              fontFamily: FONT_DISPLAY,
              fontSize: vp === 'mobile' ? 28 : 40, fontWeight: 700, letterSpacing: -1.4, lineHeight: 0.96,
              textTransform: 'uppercase', marginTop: 18,
            }}>{item.title}</div>
            <div style={{
              marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 14,
              fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>
              {item.date && <span style={{ whiteSpace: 'nowrap' }}>📅 {item.date}</span>}
              {item.loc && <span style={{ whiteSpace: 'nowrap' }}>📍 {item.loc}</span>}
              {item.tags.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  WITH <AvatarStack ids={item.tags} size={20} ring={T[cat.color]} max={4} />
                </span>
              )}
            </div>
          </Sticker>

          {/* Reactions row */}
          <Sticker radius={16} style={{ padding: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ReactBtn icon="heart" label={item.hearts} color="red" active />
            <ReactBtn icon="star" label={item.starred ? 'Starred' : 'Star'} color="yellow" active={item.starred} />
            <ReactBtn icon="chat" label={comments.length} color="cyan" />
            <ReactBtn icon="plus" label="Share" color="lime" />
          </Sticker>

          {/* Done CTA */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {item.done ? (
              <StickerButton color="surface" size="lg" style={{ flex: 1 }}>↩ RESTORE</StickerButton>
            ) : (
              <StickerButton color="lime" size="lg" style={{ flex: 1 }}>✓ MARK DONE</StickerButton>
            )}
            <StickerButton color="surface" size="lg">✏️</StickerButton>
          </div>
        </div>

        {/* RIGHT — photos + memory + comments */}
        <div>
          {/* Photo strip */}
          <div style={{ marginBottom: 22 }}>
            <SectionLabel>PHOTOS · {item.photos}</SectionLabel>
            <div className="bk-scrollx" style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {Array.from({ length: Math.max(item.photos, 1) }).map((_, i) => (
                <div key={i} style={{
                  background: T[i % 2 === 0 ? 'yellow' : 'cyan'], padding: 4,
                  border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 8,
                  transform: `rotate(${i % 2 === 0 ? 1.2 : -1.5}deg)`, flex: '0 0 auto',
                }}>
                  <PhotoSlot w={140} h={180} color={cat.color} label={`photo ${i + 1}`} radius={4} />
                </div>
              ))}
              <button className="bk-sticker-btn" style={{
                width: 140, height: 188,
                border: '2.5px dashed #0C0C0C', borderRadius: 12, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                flex: '0 0 auto',
              }}>
                <NavIcon name="plus" size={32} />
              </button>
            </div>
          </div>

          {/* Memory */}
          {item.note && (
            <div style={{ marginBottom: 22, position: 'relative' }}>
              <Sticker radius={18} style={{ padding: 22, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -12, left: 18,
                  padding: '3px 10px', background: T.lime,
                  border: STICKER_BORDER_SM, borderRadius: 6,
                  fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>MEMORY · BY {BK_PROFILES[item.tags[0] || 'me'].name.split(' ')[0].toUpperCase()}</div>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2, marginTop: 6,
                }}>"{item.note}"</div>
              </Sticker>
            </div>
          )}

          {/* Comments */}
          <SectionLabel>COMMENTS · {comments.length}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {comments.map(c => {
              const p = BK_PROFILES[c.who];
              return (
                <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Avatar p={p} size={32} />
                  <Sticker radius={12} shadow="sm" border="sm" style={{ flex: 1, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: -0.2 }}>
                        {p.name.split(' ')[0].toUpperCase()}
                      </div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted }}>{c.when}</div>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.4, color: T.ink, fontWeight: 500 }}>{c.text}</div>
                  </Sticker>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <input placeholder="ADD A COMMENT..." style={{
              flex: 1, padding: '12px 14px',
              background: T.surface, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
              borderRadius: 12, outline: 'none',
              fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
              color: T.ink, textTransform: 'uppercase',
            }} />
            <StickerButton color="ink">SEND →</StickerButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.6,
      textTransform: 'uppercase', color: T.inkMuted,
    }}>{children}</div>
  );
}

function ReactBtn({ icon, label, color, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 99,
      background: active ? T[color] : 'transparent',
      border: active ? STICKER_BORDER_SM : '2px solid transparent',
      boxShadow: active ? '2px 2px 0 #0C0C0C' : 'none',
      color: active && color === 'red' ? '#fff' : T.ink,
      fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
      cursor: 'pointer',
    }}>
      <NavIcon name={icon} size={14} color={active && color === 'red' ? '#fff' : '#0C0C0C'} /> {label}
    </div>
  );
}

Object.assign(window, {
  PageHeading, ScreenBuckets, BucketCard, NewBucketCard,
  HomeFeatured, HomeGrid, HomeList, BucketListRow, LayoutSwitcher, SectionRule,
  ScreenBucket, ItemCard, ScreenItem, SectionLabel, ReactBtn,
});
