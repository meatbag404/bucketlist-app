// Bucket app — screen components.
// Each Screen* renders a single full-bleed phone screen (no chrome).
// PhoneShell wraps them with the status bar + bottom tab nav.

// Phone-internal viewport: iPhone 15 / 393×852. Use this constant for
// horizontal sizing inside screens (search bars, hero, lists, etc).
const PH_W = 393;

// ─── Generic chrome ──────────────────────────────────────────────
function PHStatusBar({ theme, time = '9:41' }) {
  const c = theme.bg === '#15131A' ? '#fff' : '#000';
  return (
    <div style={{
      height: 54, padding: '21px 28px 0', boxSizing: 'border-box',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      position: 'relative', zIndex: 30, pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 600,
        fontSize: 17, color: c, letterSpacing: -0.4,
      }}>{time}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
        <svg width="18" height="11" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/><rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/><rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/><rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/></svg>
        <svg width="16" height="11" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/><circle cx="8.5" cy="10.5" r="1.5" fill={c}/></svg>
        <svg width="25" height="12" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="20" height="9" rx="2" fill={c}/><path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

function PHDynamicIsland() {
  return (
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 40,
      pointerEvents: 'none',
    }} />
  );
}

function PHHomeIndicator({ dark }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
      height: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      paddingBottom: 8, pointerEvents: 'none',
    }}>
      <div style={{ width: 135, height: 5, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.3)' }} />
    </div>
  );
}

// Bottom tab nav
function PHTabBar({ tab, onTab, theme, unread = 3 }) {
  const dark = theme.bg === '#15131A';
  const tabs = [
    { id: 'home',     label: 'Buckets',   icon: '🪣' },
    { id: 'activity', label: 'Activity',  icon: '◐' },
    { id: 'add',      label: '',          icon: '+' },
    { id: 'memories', label: 'Memories',  icon: '◊' },
    { id: 'friends',  label: 'Friends',   icon: '◌' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 30, paddingTop: 10, paddingLeft: 12, paddingRight: 12,
      background: dark
        ? 'linear-gradient(to top, rgba(21,19,26,0.96) 60%, rgba(21,19,26,0))'
        : 'linear-gradient(to top, rgba(246,241,232,0.96) 60%, rgba(246,241,232,0))',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 50,
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        const isAdd = t.id === 'add';
        if (isAdd) {
          return (
            <button key={t.id} onClick={() => onTab(t.id)} style={{
              width: 52, height: 52, borderRadius: 18,
              background: theme.ink, color: theme.bg,
              border: 'none', cursor: 'pointer',
              fontFamily: BK_FONT_UI, fontSize: 26, fontWeight: 300,
              boxShadow: '0 6px 14px rgba(34,30,24,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: -10,
            }}>+</button>
          );
        }
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 6px', minWidth: 52, position: 'relative',
            color: active ? theme.ink : theme.inkSubtle,
            fontFamily: BK_FONT_UI,
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>{t.label}</span>
            {t.id === 'activity' && unread > 0 && (
              <div style={{
                position: 'absolute', top: 0, right: 4,
                minWidth: 14, height: 14, padding: '0 4px', borderRadius: 7,
                background: '#993C1D', color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unread}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── 1. Buckets (home) ──────────────────────────────────────────
function ScreenBuckets({ theme, onOpenBucket, layout = 'feature' }) {
  return (
    <div style={{ padding: '0 0 100px', fontFamily: BK_FONT_UI, color: theme.ink }}>
      {/* Greeting header */}
      <div style={{ padding: '8px 22px 18px', position: 'relative' }}>
        {/* Decorative tint blob — splashes accent color behind the name */}
        <div aria-hidden style={{
          position: 'absolute', top: 24, right: 64,
          width: 96, height: 96, borderRadius: 99,
          background: theme.tintC || '#FCD9E4', opacity: 0.7, filter: 'blur(2px)',
          zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: 56, right: 110,
          width: 56, height: 56, borderRadius: 99,
          background: theme.tintA || '#FFE2B5', opacity: 0.9,
          zIndex: 0,
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              fontFamily: BK_FONT_DISPLAY, fontSize: 40, lineHeight: 1.02,
              whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: -1.6,
              color: theme.ink,
            }}>
              Your buckets,
            </div>
            <div style={{
              fontFamily: BK_FONT_DISPLAY, fontSize: 40, lineHeight: 1.02,
              whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: -1.6,
              color: theme.accent, marginTop: 2,
            }}>
              Mara.
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 99,
            background: theme.accent, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 600, position: 'relative',
            boxShadow: `0 6px 16px ${theme.accent}40`,
          }}>
            🔔
            <div style={{
              position: 'absolute', top: -2, right: -2, width: 14, height: 14,
              borderRadius: 99, background: '#FF5C8A', color: '#fff',
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 2px ${theme.bg}`,
            }}>3</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: theme.inkMuted, lineHeight: 1.45, position: 'relative', zIndex: 1 }}>
          {BK_BUCKETS.length} buckets · <span style={{ color: theme.ink, fontWeight: 600 }}>{BK_BUCKETS.reduce((s,b)=>s+b.done,0)}</span> of {BK_BUCKETS.reduce((s,b)=>s+b.total,0)} ticked off this year
        </div>
      </div>

      {/* Featured bucket card (the one you're inside most) */}
      {layout === 'feature' && <FeatureBucketCard b={BK_BUCKETS[0]} theme={theme} onOpen={() => onOpenBucket('b1')} />}

      {/* Secondary buckets */}
      <div style={{ padding: '22px 16px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: '0 6px 12px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted }}>
            All buckets
          </div>
          <div style={{
            fontSize: 11, color: theme.accent, fontWeight: 700, letterSpacing: 0.3,
            padding: '4px 10px', borderRadius: 99, background: theme.surface,
            border: `1px solid ${theme.lineStrong}`,
          }}>＋ NEW</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BK_BUCKETS.slice(layout === 'feature' ? 1 : 0).map((b, i) => (
            <BucketRow key={b.id} b={b} theme={theme} tint={i} onOpen={() => onOpenBucket(b.id)} />
          ))}
          <NewBucketRow theme={theme} />
        </div>
      </div>
    </div>
  );
}

function FeatureBucketCard({ b, theme, onOpen }) {
  return (
    <div onClick={onOpen} style={{
      margin: '0 16px', borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
      background: theme.surface,
      boxShadow: `0 1px 0 rgba(12,18,48,0.04), 0 16px 32px ${theme.accent}1f`,
    }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 196, overflow: 'hidden' }}>
        <BKPhotoSlot w={PH_W - 32} h={196} hue="travel" label="bucket cover · lisbon rooftops" radius={0} />
        {/* Saturated dual-gradient overlay — color comes from the accent, not just black */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${theme.accent}55 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)`,
        }} />
        <div style={{
          position: 'absolute', top: 12, left: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 10px 5px 8px', borderRadius: 99,
          background: '#fff', color: theme.accent,
          fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: theme.accent, animation: 'none' }} />
          ACTIVE · 24 DAYS TO GO
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{b.emoji}</div>
              <div style={{
                fontFamily: BK_FONT_DISPLAY, fontSize: 32, lineHeight: 1.02,
                color: '#fff', fontWeight: 700, letterSpacing: -1, marginTop: 8,
              }}>{b.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 8, fontWeight: 500 }}>{b.sub}</div>
            </div>
            <BKAvatarStack ids={b.members} size={28} ring="rgba(255,255,255,0.95)" />
          </div>
        </div>
      </div>
      {/* Progress strip */}
      <div style={{ padding: '14px 18px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: theme.inkMuted }}>
            <span style={{ color: theme.ink, fontWeight: 700 }}>{b.done}</span> of {b.total} ticked off
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>{b.pct}%</div>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: theme.line }}>
          <div style={{
            width: b.pct + '%', height: '100%', borderRadius: 6,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}cc)`,
          }} />
        </div>
      </div>
    </div>
  );
}

function BucketRow({ b, theme, onOpen, tint = 0 }) {
  // Each row gets one of the theme's tint colors as a soft left swatch so
  // the list itself becomes a row of color.
  const tintKeys = ['tintB', 'tintC', 'tintD', 'tintA'];
  const tintBg = theme[tintKeys[tint % tintKeys.length]] || theme.surface;
  return (
    <div onClick={onOpen} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: 12, borderRadius: 18,
      background: theme.surface,
      boxShadow: '0 1px 0 rgba(12,18,48,0.03), 0 4px 14px rgba(12,18,48,0.05)',
      cursor: 'pointer',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative', width: 60, height: 60, borderRadius: 14,
        background: tintBg, flex: '0 0 auto', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 28 }}>{b.emoji}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, color: theme.ink, lineHeight: 1.2 }}>{b.name}</div>
        <div style={{ fontSize: 12, color: theme.inkMuted, marginTop: 2 }}>{b.sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 4, background: theme.line, overflow: 'hidden' }}>
            <div style={{ width: b.pct + '%', height: '100%', background: theme.accent }} />
          </div>
          <div style={{ fontSize: 11, color: theme.inkMuted, fontVariantNumeric: 'tabular-nums', minWidth: 38, textAlign: 'right', fontWeight: 600 }}>
            {b.done}/{b.total}
          </div>
        </div>
      </div>
      <BKAvatarStack ids={b.members} size={22} ring={theme.surface} />
    </div>
  );
}

function NewBucketRow({ theme }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: 12,
      borderRadius: 18, border: `1.5px dashed ${theme.lineStrong}`,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'transparent', border: `1.5px dashed ${theme.lineStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, color: theme.inkSubtle,
      }}>＋</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.ink }}>New bucket</div>
        <div style={{ fontSize: 12, color: theme.inkMuted, marginTop: 2 }}>Solo or with friends</div>
      </div>
    </div>
  );
}

// ─── 2. Bucket detail (items list) ──────────────────────────────
function ScreenBucket({ theme, bucketId, onBack, onOpenItem, onAdd }) {
  const b = BK_BUCKETS.find(x => x.id === bucketId) || BK_BUCKETS[0];
  const items = BK_ITEMS.filter(i => i.bucket === b.id);
  const todo = items.filter(i => !i.done);
  const done = items.filter(i => i.done);
  const [filter, setFilter] = React.useState(null);
  const filtered = filter ? todo.filter(i => i.cat === filter) : todo;

  return (
    <div style={{ paddingBottom: 110, fontFamily: BK_FONT_UI, color: theme.ink }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <BKPhotoSlot w={PH_W} h={220} hue="travel" label="bucket cover · lisbon rooftops" radius={0} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.35))',
        }} />
        {/* Back chevron + ⚙ */}
        <div style={{
          position: 'absolute', top: 58, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.85)',
            border: 'none', backdropFilter: 'blur(8px)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#221E18', fontSize: 16,
          }}>‹</button>
          <button style={{
            width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.85)',
            border: 'none', backdropFilter: 'blur(8px)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>⚙</button>
        </div>
        {/* Title */}
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 18 }}>
          <div style={{ fontSize: 28 }}>{b.emoji}</div>
          <div style={{
            fontFamily: BK_FONT_DISPLAY, fontSize: 36, lineHeight: 1.02, color: '#fff', fontWeight: 700, letterSpacing: -1.3,
            marginTop: 8,
          }}>{b.name}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginTop: 12,
            fontSize: 12, color: 'rgba(255,255,255,0.9)',
          }}>
            <BKAvatarStack ids={b.members} size={22} ring="rgba(255,255,255,0.9)" />
            <span style={{ opacity: 0.8 }}>·</span>
            <span>{b.done} of {b.total} done · {b.pct}%</span>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div style={{
        display: 'flex', gap: 6, padding: '14px 16px 12px', overflowX: 'auto', alignItems: 'center',
        flexWrap: 'nowrap',
      }}>
        {['travel','food','adventure','wellness','culture'].map(k => (
          <div key={k} onClick={() => setFilter(filter === k ? null : k)} style={{ cursor: 'pointer' }}>
            <BKChip active={filter === k} accent={BK_CATS[k].accent} bg={BK_CATS[k].bg} dark={BK_CATS[k].dark} theme={theme}>
              {BK_CATS[k].glyph} {BK_CATS[k].label}
            </BKChip>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', flex: '0 0 auto' }}>
          <BKChip theme={theme}>⊞ Grid</BKChip>
        </div>
      </div>

      {/* To-do items */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(i => <ItemRow key={i.id} item={i} theme={theme} onOpen={() => onOpenItem(i.id)} />)}
      </div>

      {/* Done divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 22px 12px' }}>
        <div style={{ flex: 1, height: 1, background: theme.line }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted }}>
          Done · {done.length}
        </div>
        <div style={{ flex: 1, height: 1, background: theme.line }} />
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {done.map(i => <ItemRow key={i.id} item={i} theme={theme} onOpen={() => onOpenItem(i.id)} />)}
      </div>

      {/* Sticky add CTA */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 92, zIndex: 5 }}>
        <button onClick={onAdd} style={{
          width: '100%', padding: '14px 16px',
          borderRadius: 16, border: 'none', cursor: 'pointer',
          background: theme.ink, color: theme.bg,
          fontFamily: BK_FONT_UI, fontSize: 15, fontWeight: 600, letterSpacing: -0.2,
          boxShadow: '0 8px 24px rgba(34,30,24,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>＋ Add to bucket</button>
      </div>
    </div>
  );
}

function ItemRow({ item, theme, onOpen, compact = false }) {
  const c = BK_CATS[item.cat];
  // Soft category-tinted backdrop — blends the cat bg with the theme surface so
  // each row carries a hint of its category color (not just a left stripe).
  const tinted = `linear-gradient(135deg, ${c.bg} 0%, ${theme.surface} 78%)`;
  return (
    <div onClick={onOpen} style={{
      position: 'relative', display: 'flex', alignItems: 'stretch', gap: 0,
      background: item.done ? theme.surface : tinted,
      borderRadius: 16, overflow: 'hidden',
      cursor: 'pointer',
      opacity: item.done ? 0.65 : 1,
      boxShadow: '0 1px 0 rgba(12,18,48,0.03), 0 2px 8px rgba(12,18,48,0.04)',
    }}>
      <div style={{ width: 4, background: c.accent, opacity: item.done ? 0.4 : 1 }} />
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flex: '0 0 auto',
        }}>{item.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: theme.ink, lineHeight: 1.25,
            textDecoration: item.done ? 'line-through' : 'none',
            textDecorationColor: theme.inkSubtle,
          }}>{item.done ? '✓ ' : ''}{item.title}</div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
            marginTop: 6, fontSize: 11, color: theme.inkMuted,
          }}>
            <span style={{ color: c.accent, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>{c.label}</span>
            {item.date && <><span>·</span><span>📅 {item.date}</span></>}
            {item.loc && <><span>·</span><span>📍 {item.loc}</span></>}
            {item.photos > 0 && <><span>·</span><span>📷 {item.photos}</span></>}
            {item.comments > 0 && <><span>·</span><span>💬 {item.comments}</span></>}
          </div>
          {item.note && (
            <div style={{
              marginTop: 8, padding: '6px 10px',
              fontFamily: BK_FONT_UI, fontWeight: 500,
              fontSize: 12, color: theme.ink, opacity: 0.8,
              borderLeft: `2px solid ${c.accent}`, paddingLeft: 8, fontStyle: 'normal',
            }}>"{item.note}"</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: '0 0 auto' }}>
          <div style={{ fontSize: 14, color: item.starred ? '#BA7517' : theme.inkSubtle }}>{item.starred ? '★' : '☆'}</div>
          {item.tags.length > 0 && <BKAvatarStack ids={item.tags} size={18} ring={theme.surface} max={3} />}
          {item.hearts > 0 && (
            <div style={{ fontSize: 11, color: theme.inkMuted, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ color: '#993C1D' }}>♥</span>{item.hearts}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PH_W, PHStatusBar, PHDynamicIsland, PHHomeIndicator, PHTabBar,
  ScreenBuckets, ScreenBucket, ItemRow,
});
