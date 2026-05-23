// Bucket — Concept C: "Bold sticker"
// Neo-brutalist / sticker album aesthetic. Hard 4px black shadows, chunky
// color blocks, no gradients, no soft shadows. Each item is a sticker; each
// bucket is a poster. The vibe: an artist's zine you scribble in.

const CC_THEME = {
  bg: '#FFF6E5',           // butter cream
  surface: '#FFFFFF',
  ink: '#0C0C0C',          // near-black
  inkMuted: '#3A3A3A',
  cyan: '#7DDCFF',
  pink: '#FF7AB6',
  lime: '#C7F356',
  yellow: '#FFD43B',
  blue: '#5C7BFF',
  red:  '#FF6B5A',
};
const CC_FONT = '"Space Grotesk", "Geist", -apple-system, system-ui, sans-serif';
const CC_FONT_DISPLAY = '"Space Grotesk", "Geist", -apple-system, system-ui, sans-serif';

const CC_STICKER_SHADOW = '4px 4px 0 #0C0C0C';
const CC_STICKER_SHADOW_SM = '3px 3px 0 #0C0C0C';
const CC_STICKER_BORDER = '2.5px solid #0C0C0C';
const CC_STICKER_BORDER_SM = '2px solid #0C0C0C';

const CC_BUCKET_COLORS = ['#7DDCFF', '#C7F356', '#FF7AB6', '#FFD43B'];

// ─── Home — poster of buckets ──────────────────────────────────
function CCScreenHome({ onOpenBucket }) {
  const t = CC_THEME;
  return (
    <div style={{ padding: '0 0 110px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      {/* Top bar — flat */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 22px 14px',
      }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.5,
          padding: '6px 12px', background: t.ink, color: t.bg, borderRadius: 8,
        }}>
          🪣 BUCKET
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 99, background: t.pink,
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, position: 'relative',
        }}>
          🔔
          <div style={{
            position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 99,
            background: t.ink, color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #fff',
          }}>3</div>
        </div>
      </div>

      {/* MASSIVE display title */}
      <div style={{ padding: '4px 22px 22px' }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 52, fontWeight: 700,
          letterSpacing: -2.2, lineHeight: 0.92, textTransform: 'uppercase',
        }}>WHAT'S</div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 52, fontWeight: 700,
          letterSpacing: -2.2, lineHeight: 0.92, textTransform: 'uppercase',
          color: t.ink,
        }}>
          ON THE <span style={{
            background: t.lime, padding: '2px 12px', display: 'inline-block', transform: 'rotate(-2deg)',
            border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          }}>LIST</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 14, fontWeight: 500, color: t.inkMuted, lineHeight: 1.4 }}>
          3 buckets · <span style={{ background: t.yellow, padding: '0 6px', border: '1.5px solid #0C0C0C' }}>23 done</span> this year.
        </div>
      </div>

      {/* Stack of sticker bucket cards — each one tilted slightly */}
      <div style={{ padding: '8px 22px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {BK_BUCKETS.map((b, i) => (
          <div key={b.id} onClick={() => onOpenBucket && onOpenBucket(b.id)} style={{ cursor: onOpenBucket ? 'pointer' : 'default' }}>
            <CCBucketPoster b={b} color={CC_BUCKET_COLORS[i % CC_BUCKET_COLORS.length]} tilt={i % 2 === 0 ? -1 : 1.4} />
          </div>
        ))}
        {/* New bucket */}
        <div style={{
          padding: '20px 18px', background: t.bg, border: '2.5px dashed #0C0C0C',
          borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.6 }}>
            + NEW BUCKET
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Solo or shared
          </div>
        </div>
      </div>
    </div>
  );
}

function CCBucketPoster({ b, color, tilt = 0 }) {
  const t = CC_THEME;
  return (
    <div style={{
      background: color, border: CC_STICKER_BORDER, borderRadius: 18,
      boxShadow: CC_STICKER_SHADOW, padding: 18,
      transform: `rotate(${tilt}deg)`, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: t.bg,
          border: CC_STICKER_BORDER_SM, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32,
        }}>{b.emoji}</div>
        <div style={{
          padding: '4px 10px', background: t.ink, color: t.bg, borderRadius: 99,
          fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
        }}>
          {b.pct === 0 ? 'NEW' : `${b.pct}%`}
        </div>
      </div>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: -1,
        lineHeight: 0.98, marginTop: 14, color: t.ink, textTransform: 'uppercase',
      }}>{b.name}</div>
      <div style={{
        marginTop: 6, fontSize: 12, fontWeight: 600, color: t.ink,
        textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7,
      }}>{b.sub}</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14,
        paddingTop: 14, borderTop: '2px solid rgba(12,12,12,0.18)',
      }}>
        <BKAvatarStack ids={b.members} size={28} ring={color} />
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.4,
          fontVariantNumeric: 'tabular-nums',
        }}>{b.done}/{b.total}</div>
      </div>
    </div>
  );
}

// ─── Bucket detail — sticker grid ──────────────────────────────
function CCScreenBucket({ onBack, onOpenItem, onAdd }) {
  const t = CC_THEME;
  const items = BK_ITEMS.filter(i => i.bucket === 'b1');
  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      {/* Big banner */}
      <div style={{
        margin: '0 22px', marginTop: 6,
        background: t.cyan, border: CC_STICKER_BORDER, borderRadius: 22,
        boxShadow: CC_STICKER_SHADOW, padding: 20, position: 'relative',
      }}>
        <button onClick={onBack} style={{
          position: 'absolute', top: 14, left: 14,
          width: 36, height: 36, borderRadius: 99, background: t.bg,
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 14, fontWeight: 700,
        }}>‹</button>
        <button style={{
          position: 'absolute', top: 14, right: 14,
          width: 36, height: 36, borderRadius: 99, background: t.bg,
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 14,
        }}>⚙</button>
        <div style={{ textAlign: 'center', paddingTop: 28 }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>🌍</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 36, fontWeight: 700,
            letterSpacing: -1.3, lineHeight: 0.95, textTransform: 'uppercase',
            marginTop: 12,
          }}>
            SUMMER IN
          </div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 36, fontWeight: 700,
            letterSpacing: -1.3, lineHeight: 0.95, textTransform: 'uppercase',
            color: t.ink,
          }}>
            <span style={{
              background: t.pink, padding: '0 10px',
              border: CC_STICKER_BORDER_SM, display: 'inline-block', transform: 'rotate(-1.5deg)',
              boxShadow: CC_STICKER_SHADOW_SM,
            }}>LISBON</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
            <BKAvatarStack ids={['me','jay','sera','rio']} size={26} ring={t.cyan} />
          </div>
        </div>
        {/* Progress chunky */}
        <div style={{
          marginTop: 16, background: t.bg, border: CC_STICKER_BORDER_SM, borderRadius: 99,
          height: 22, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            width: '36%', height: '100%', background: t.lime,
            borderRight: '2px solid #0C0C0C',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            paddingRight: 8, fontWeight: 700, fontSize: 11,
          }}>5/14</div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '20px 22px 8px', overflowX: 'auto', flexWrap: 'nowrap' }}>
        {[
          { key: 'all', label: 'ALL', bg: t.ink, color: t.bg },
          { key: 'travel', label: 'TRAVEL', bg: t.yellow, color: t.ink },
          { key: 'food', label: 'FOOD', bg: t.pink, color: t.ink },
          { key: 'adventure', label: 'ADVENTURE', bg: t.blue, color: '#fff' },
          { key: 'wellness', label: 'WELLNESS', bg: t.lime, color: t.ink },
        ].map(c => (
          <div key={c.key} style={{
            padding: '6px 12px', background: c.bg, color: c.color,
            border: CC_STICKER_BORDER_SM, borderRadius: 99,
            boxShadow: CC_STICKER_SHADOW_SM,
            fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.5, whiteSpace: 'nowrap', flex: '0 0 auto',
          }}>{c.label}</div>
        ))}
      </div>

      {/* Sticker items */}
      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((it, i) => (
          <div key={it.id} onClick={() => onOpenItem && onOpenItem(it.id)} style={{ cursor: onOpenItem ? 'pointer' : 'default' }}>
            <CCItemSticker item={it} i={i} />
          </div>
        ))}
      </div>

      {/* Floating BIG add */}
      <div style={{ position: 'absolute', right: 22, bottom: 100 }}>
        <button onClick={onAdd} style={{
          width: 64, height: 64, borderRadius: 99, background: t.ink, color: '#fff',
          border: CC_STICKER_BORDER, boxShadow: CC_STICKER_SHADOW,
          fontSize: 32, fontWeight: 400, lineHeight: 1, cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY,
        }}>+</button>
      </div>
    </div>
  );
}

const CC_ITEM_COLORS = ['#FFD43B', '#FF7AB6', '#7DDCFF', '#C7F356', '#5C7BFF', '#FF6B5A'];

function CCItemSticker({ item, i }) {
  const t = CC_THEME;
  const color = CC_ITEM_COLORS[i % CC_ITEM_COLORS.length];
  const tilt = i % 3 === 1 ? -0.8 : i % 3 === 2 ? 0.8 : 0;
  return (
    <div style={{
      background: t.surface, border: CC_STICKER_BORDER, borderRadius: 18,
      boxShadow: CC_STICKER_SHADOW, padding: '14px 16px',
      position: 'relative', transform: `rotate(${tilt}deg)`,
      opacity: item.done ? 0.6 : 1,
    }}>
      {/* Color strip on the left */}
      <div style={{
        position: 'absolute', left: -2.5, top: 18, bottom: 18, width: 8,
        background: color, border: CC_STICKER_BORDER_SM, borderRight: 'none', borderRadius: '6px 0 0 6px',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 6 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: color,
          border: CC_STICKER_BORDER_SM, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flex: '0 0 auto',
        }}>{item.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 15, fontWeight: 700,
            letterSpacing: -0.3, lineHeight: 1.25, color: t.ink,
            textDecoration: item.done ? 'line-through' : 'none',
          }}>{item.done ? '✓ ' : ''}{item.title}</div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8,
          }}>
            <div style={{
              padding: '2px 8px', background: t.bg, border: '1.5px solid #0C0C0C',
              borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>{item.cat}</div>
            {item.date && <div style={{
              padding: '2px 8px', background: t.bg, border: '1.5px solid #0C0C0C',
              borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>📅 {item.date}</div>}
            {item.loc && <div style={{
              padding: '2px 8px', background: t.bg, border: '1.5px solid #0C0C0C',
              borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>📍 {item.loc}</div>}
          </div>
          {item.note && (
            <div style={{
              marginTop: 10, padding: '6px 10px',
              background: color, border: '1.5px solid #0C0C0C', borderRadius: 8,
              fontSize: 12, fontWeight: 600, color: t.ink, lineHeight: 1.4,
            }}>"{item.note}"</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          {item.starred && (
            <div style={{
              width: 28, height: 28, borderRadius: 99, background: t.yellow,
              border: '1.5px solid #0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>★</div>
          )}
          {item.hearts > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '2px 8px', background: t.red, color: '#fff', border: '1.5px solid #0C0C0C',
              borderRadius: 99, fontSize: 11, fontWeight: 700,
            }}>♥ {item.hearts}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Item detail — big poster ──────────────────────────────────
function CCScreenItem({ onBack }) {
  const t = CC_THEME;
  const item = BK_ITEMS[1];
  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{ padding: '8px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 99, background: t.surface,
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>‹</button>
        <div style={{
          padding: '4px 10px', background: t.pink, border: '2px solid #0C0C0C', borderRadius: 99,
          fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>FOOD · DONE ✓</div>
        <button style={{
          width: 40, height: 40, borderRadius: 99, background: t.surface,
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>⋯</button>
      </div>

      {/* Title block on color */}
      <div style={{
        margin: '0 22px', padding: '20px 18px',
        background: t.pink, border: CC_STICKER_BORDER, borderRadius: 18,
        boxShadow: CC_STICKER_SHADOW,
      }}>
        <div style={{ fontSize: 72, lineHeight: 1, textAlign: 'center' }}>🥮</div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 30, fontWeight: 700,
          letterSpacing: -1, lineHeight: 0.98, marginTop: 14, textTransform: 'uppercase',
        }}>
          PASTÉIS DE BELÉM —
        </div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 30, fontWeight: 700,
          letterSpacing: -1, lineHeight: 0.98,
        }}>
          eat 6, <span style={{
            background: t.yellow, padding: '0 8px',
            border: CC_STICKER_BORDER_SM, display: 'inline-block', transform: 'rotate(-2deg)',
          }}>no judgement</span>
        </div>
        <div style={{
          marginTop: 14, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          display: 'flex', gap: 12,
        }}>
          <span>· JUN 12</span><span>· BELÉM</span><span>· RIO, JAY</span>
        </div>
      </div>

      {/* Photo strip — stickered */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {[t.yellow, t.cyan, t.lime].map((c, i) => (
            <div key={i} style={{
              flex: '0 0 auto', position: 'relative', transform: `rotate(${i === 1 ? -1.5 : 1}deg)`,
            }}>
              <div style={{
                background: c, border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
                borderRadius: 8, padding: 4,
              }}>
                <BKPhotoSlot w={120} h={160} hue="food" label="photo" radius={4} />
              </div>
            </div>
          ))}
          <div style={{
            flex: '0 0 auto', width: 120, height: 168,
            border: '2.5px dashed #0C0C0C', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700, color: t.inkMuted,
          }}>+</div>
        </div>
      </div>

      {/* Memory quote — sticker */}
      <div style={{
        margin: '24px 22px 0', padding: 18,
        background: t.surface, border: CC_STICKER_BORDER, borderRadius: 18,
        boxShadow: CC_STICKER_SHADOW, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -12, left: 18,
          padding: '3px 10px', background: t.lime, border: '2px solid #0C0C0C',
          borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>MEMORY · BY RIO</div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2,
          marginTop: 6,
        }}>
          "Rio cried (happy). The custard was warm."
        </div>
      </div>

      {/* Reactions row */}
      <div style={{
        margin: '20px 22px 0', padding: '12px 14px',
        background: t.surface, border: CC_STICKER_BORDER, borderRadius: 18,
        boxShadow: CC_STICKER_SHADOW,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        <CCReact icon="♥" label="4" color={t.red} active />
        <CCReact icon="★" label="STAR" color={t.yellow} />
        <CCReact icon="💬" label="3" color={t.cyan} />
        <CCReact icon="↗" label="SHARE" color={t.lime} />
      </div>
    </div>
  );
}

function CCReact({ icon, label, color, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 99,
      background: active ? color : 'transparent',
      border: active ? '2px solid #0C0C0C' : 'none',
      fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.6,
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Add item — sticker form ───────────────────────────────────
function CCScreenAdd({ onCancel, onAdd, onPickIcon, selectedIcon }) {
  const t = CC_THEME;
  const [title, setTitle] = React.useState('');
  const [cat, setCat] = React.useState('travel');
  const [tagged, setTagged] = React.useState(['jay']);
  const [icon, setIcon] = React.useState(selectedIcon || { e: '✈️', c: 'yellow' });
  React.useEffect(() => { if (selectedIcon) setIcon(selectedIcon); }, [selectedIcon]);

  const catConfig = {
    travel:    { color: t.yellow, label: 'TRAVEL' },
    food:      { color: t.pink,   label: 'FOOD' },
    adventure: { color: t.blue,   label: 'ADVENTURE' },
    wellness:  { color: t.lime,   label: 'WELLNESS' },
    culture:   { color: t.cyan,   label: 'CULTURE' },
  };
  const cc = catConfig[cat];

  function toggleTag(id) {
    setTagged(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{ padding: '8px 22px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onCancel} style={{
          padding: '8px 14px', background: t.surface, border: CC_STICKER_BORDER_SM,
          boxShadow: CC_STICKER_SHADOW_SM, borderRadius: 12, cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>CANCEL</button>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 20, fontWeight: 700, letterSpacing: -0.6,
          textTransform: 'uppercase',
        }}>NEW THING</div>
        <button onClick={onAdd} disabled={!title.trim()} style={{
          padding: '8px 14px', background: title.trim() ? t.ink : '#999',
          color: '#fff', border: CC_STICKER_BORDER_SM,
          boxShadow: title.trim() ? CC_STICKER_SHADOW_SM : 'none',
          borderRadius: 12, cursor: title.trim() ? 'pointer' : 'not-allowed',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>ADD →</button>
      </div>

      {/* Bucket pill */}
      <div style={{
        margin: '0 22px 18px', padding: '10px 14px',
        background: t.cyan, border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ fontSize: 20 }}>🌍</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>
            ADDING TO
          </div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4, marginTop: 2,
          }}>SUMMER IN LISBON</div>
        </div>
        <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 14, fontWeight: 700 }}>CHANGE →</div>
      </div>

      {/* Title + sticker icon card */}
      <div style={{
        margin: '0 22px 18px', padding: 16,
        background: cc.color, border: CC_STICKER_BORDER, boxShadow: CC_STICKER_SHADOW,
        borderRadius: 18,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <button onClick={onPickIcon} style={{
            width: 60, height: 60, borderRadius: 14,
            background: t[icon.c] || t.surface,
            border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, flex: '0 0 auto', cursor: 'pointer',
            transform: 'rotate(-2deg)', position: 'relative',
            fontFamily: CC_FONT_DISPLAY,
          }}>
            {icon.e}
            <div style={{
              position: 'absolute', bottom: -6, right: -6,
              width: 22, height: 22, borderRadius: 99, background: t.ink, color: '#fff',
              border: '2px solid #fff', boxShadow: '1px 1px 0 #0C0C0C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>↕</div>
          </button>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="WHAT DO YOU WANT TO TICK OFF?"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: CC_FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4,
              color: t.ink, padding: '12px 0', textTransform: 'uppercase',
            }}
          />
        </div>
        {/* Browse library trigger */}
        <button onClick={onPickIcon} style={{
          marginTop: 14, padding: '10px 14px', width: '100%',
          background: t.surface, border: CC_STICKER_BORDER_SM,
          boxShadow: '2px 2px 0 rgba(12,12,12,0.2)', borderRadius: 12,
          cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          color: t.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>BROWSE STICKER LIBRARY · 200+ →</button>
      </div>

      {/* Category stickers */}
      <div style={{ padding: '0 22px 6px' }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
          textTransform: 'uppercase', color: t.inkMuted, marginBottom: 10,
        }}>Pick a category</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(catConfig).map(([k, c]) => (
            <div key={k} onClick={() => setCat(k)} style={{
              padding: '8px 12px',
              background: cat === k ? c.color : t.surface,
              border: CC_STICKER_BORDER_SM,
              boxShadow: cat === k ? CC_STICKER_SHADOW_SM : '2px 2px 0 rgba(12,12,12,0.15)',
              borderRadius: 99,
              fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              cursor: 'pointer',
              transform: cat === k ? 'rotate(-1deg)' : 'rotate(0deg)',
            }}>{c.label}</div>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div style={{ padding: '20px 22px 0' }}>
        <CCField icon="📅" placeholder="TARGET DATE (e.g. SUMMER 2025)" />
        <CCField icon="📍" placeholder="ADD A LOCATION" />
        <CCField icon="📝" placeholder="WHY YOU WANT THIS (OPTIONAL)" multiline />
      </div>

      {/* Tag people */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
          textTransform: 'uppercase', color: t.inkMuted, marginBottom: 10,
        }}>Tag who's in</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['jay','sera','rio'].map(id => {
            const p = BK_PROFILES[id];
            const on = tagged.includes(id);
            return (
              <div key={id} onClick={() => toggleTag(id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px 6px 6px', borderRadius: 99,
                background: on ? cc.color : t.surface,
                border: CC_STICKER_BORDER_SM,
                boxShadow: on ? CC_STICKER_SHADOW_SM : 'none',
                cursor: 'pointer',
              }}>
                <BKAvatar p={p} size={26} />
                <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>
                  {p.name.split(' ')[0].toUpperCase()}
                </div>
                {on && <div style={{ fontSize: 12, fontWeight: 700 }}>✓</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CCField({ icon, placeholder, multiline }) {
  const t = CC_THEME;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', marginBottom: 10,
      background: t.surface, border: CC_STICKER_BORDER_SM, borderRadius: 12,
      boxShadow: '2px 2px 0 rgba(12,12,12,0.2)',
    }}>
      <div style={{ fontSize: 16 }}>{icon}</div>
      <input placeholder={placeholder} style={{
        flex: 1, border: 'none', background: 'transparent', outline: 'none',
        fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        color: t.ink,
      }} />
    </div>
  );
}

// ─── Memories — sticker wall ───────────────────────────────────
function CCScreenMemories() {
  const t = CC_THEME;
  const memories = [
    { id: 'm1', emoji: '🥮', title: 'Pastéis de Belém', when: 'JUN 12', cat: 'food',      color: t.pink,   tags: ['rio','jay'], h: 220, tilt: -1.2 },
    { id: 'm2', emoji: '🏔', title: 'Pico do Arieiro at sunrise', when: 'JUL 2024', cat: 'adventure', color: t.blue,   tags: ['jay','sera'], h: 180, tilt: 1.5 },
    { id: 'm3', emoji: '🍝', title: 'Fresh pasta with Hen', when: 'MAR', cat: 'food',      color: t.yellow, tags: ['hen'], h: 200, tilt: -0.5 },
    { id: 'm4', emoji: '🟦', title: 'Tile-hunt in Alfama', when: 'JUN 13', cat: 'culture',   color: t.cyan,   tags: ['jay'], h: 240, tilt: 0.8 },
    { id: 'm5', emoji: '🌊', title: 'First open-water swim', when: 'APR 12', cat: 'wellness',  color: t.lime,   tags: ['me'], h: 190, tilt: -1 },
    { id: 'm6', emoji: '🎤', title: 'Karaoke, no song left behind', when: 'MAR 28', cat: 'culture', color: t.red,    tags: ['jay','rio','hen'], h: 170, tilt: 1 },
  ];

  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{ padding: '8px 22px 18px' }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 48, fontWeight: 700, letterSpacing: -2,
          lineHeight: 0.92, textTransform: 'uppercase',
        }}>STUFF</div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 48, fontWeight: 700, letterSpacing: -2,
          lineHeight: 0.92, textTransform: 'uppercase',
        }}>YOU <span style={{
          background: t.pink, padding: '0 10px', display: 'inline-block', transform: 'rotate(-2deg)',
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
        }}>DID</span>.</div>
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: t.inkMuted, letterSpacing: 0.3 }}>
          23 memories this year. Look at you go.
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '0 22px 14px', overflowX: 'auto' }}>
        {[
          { label: 'ALL', bg: t.ink, color: t.bg, active: true },
          { label: '2025', bg: t.surface, color: t.ink },
          { label: '2024', bg: t.surface, color: t.ink },
          { label: 'LISBON', bg: t.cyan, color: t.ink },
          { label: 'WITH JAY', bg: t.lime, color: t.ink },
        ].map(c => (
          <div key={c.label} style={{
            padding: '6px 12px', background: c.bg, color: c.color,
            border: CC_STICKER_BORDER_SM, borderRadius: 99,
            boxShadow: c.active ? CC_STICKER_SHADOW_SM : '2px 2px 0 rgba(12,12,12,0.15)',
            fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
            whiteSpace: 'nowrap', flex: '0 0 auto',
          }}>{c.label}</div>
        ))}
      </div>

      {/* Masonry of memory stickers */}
      <div style={{
        padding: '6px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
        alignItems: 'start',
      }}>
        {memories.map((m, i) => <CCMemorySticker key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function CCMemorySticker({ m }) {
  const t = CC_THEME;
  return (
    <div style={{
      background: t.surface, border: CC_STICKER_BORDER, boxShadow: CC_STICKER_SHADOW,
      borderRadius: 14, overflow: 'hidden', position: 'relative',
      transform: `rotate(${m.tilt}deg)`,
    }}>
      {/* Color band header */}
      <div style={{
        background: m.color, padding: '8px 10px',
        borderBottom: '2px solid #0C0C0C',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.8 }}>
          {m.cat.toUpperCase()}
        </div>
        <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.8 }}>
          {m.when}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <BKPhotoSlot w={(PH_W - 32 - 16) / 2} h={m.h} hue={m.cat} label={m.title.toLowerCase()} radius={0} />
        <div style={{
          position: 'absolute', top: 8, left: 8,
          width: 38, height: 38, borderRadius: 99, background: t.bg,
          border: '2px solid #0C0C0C', boxShadow: CC_STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>{m.emoji}</div>
      </div>
      <div style={{ padding: 10 }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 13, fontWeight: 700,
          letterSpacing: -0.3, lineHeight: 1.15, color: t.ink,
        }}>{m.title}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BKAvatarStack ids={m.tags} size={18} ring={t.surface} max={3} />
          <div style={{ fontSize: 12, fontWeight: 700 }}>✓</div>
        </div>
      </div>
    </div>
  );
}

// ─── Activity feed — sticker rows ──────────────────────────────
function CCScreenActivity() {
  const t = CC_THEME;
  const colorByAction = {
    'added a photo to': t.pink,
    'commented on': t.cyan,
    'marked done': t.lime,
    'added': t.yellow,
    'hearted': t.red,
    'joined': t.blue,
  };
  const groups = [
    { day: 'TODAY', items: BK_ACTIVITY.slice(0, 2) },
    { day: 'YESTERDAY', items: BK_ACTIVITY.slice(2, 5) },
    { day: 'THIS WEEK', items: BK_ACTIVITY.slice(5) },
  ];
  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{
        padding: '8px 22px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 48, fontWeight: 700, letterSpacing: -2, lineHeight: 0.92, textTransform: 'uppercase' }}>
            WHAT'S
          </div>
          <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 48, fontWeight: 700, letterSpacing: -2, lineHeight: 0.92, textTransform: 'uppercase' }}>
            <span style={{
              background: t.cyan, padding: '0 10px', display: 'inline-block', transform: 'rotate(-1.5deg)',
              border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
            }}>UP</span>.
          </div>
        </div>
        <div style={{
          padding: '6px 12px', background: t.red, color: '#fff',
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          borderRadius: 99, fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
        }}>3 NEW</div>
      </div>

      {/* Bucket filter */}
      <div style={{ display: 'flex', gap: 8, padding: '0 22px 14px', overflowX: 'auto' }}>
        {[
          { label: 'ALL', bg: t.ink, color: t.bg, active: true },
          { label: '🌍 LISBON', bg: t.yellow, color: t.ink },
          { label: '🪣 LIFE LATELY', bg: t.lime, color: t.ink },
          { label: "🎂 HEN'S 30TH", bg: t.pink, color: t.ink },
        ].map(c => (
          <div key={c.label} style={{
            padding: '6px 12px', background: c.bg, color: c.color,
            border: CC_STICKER_BORDER_SM, borderRadius: 99,
            boxShadow: c.active ? CC_STICKER_SHADOW_SM : '2px 2px 0 rgba(12,12,12,0.15)',
            fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
            whiteSpace: 'nowrap', flex: '0 0 auto',
          }}>{c.label}</div>
        ))}
      </div>

      {groups.map(g => (
        <div key={g.day} style={{ marginBottom: 8 }}>
          <div style={{
            padding: '14px 22px 10px',
            fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
            color: t.inkMuted,
          }}>· {g.day} ·</div>
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {g.items.map((a, i) => <CCActivityRow key={a.id} a={a} color={colorByAction[a.action] || t.cyan} tilt={i % 2 === 0 ? 0 : -0.5} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function CCActivityRow({ a, color, tilt }) {
  const t = CC_THEME;
  const p = BK_PROFILES[a.who];
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '12px 14px',
      background: t.surface, border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
      borderRadius: 14, transform: `rotate(${tilt}deg)`,
    }}>
      <div style={{ position: 'relative' }}>
        <BKAvatar p={p} size={38} />
        <div style={{
          position: 'absolute', bottom: -4, right: -6,
          width: 22, height: 22, borderRadius: 99,
          background: color, border: '2px solid #0C0C0C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11,
        }}>{a.emoji}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
        <div style={{ fontSize: 13, color: t.ink, lineHeight: 1.4 }}>
          <span style={{ fontFamily: CC_FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2 }}>{p.name.split(' ')[0].toUpperCase()}</span>
          <span style={{ color: t.inkMuted, fontWeight: 600 }}> {a.action} </span>
          <span style={{ fontFamily: CC_FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2 }}>"{a.target}"</span>
        </div>
        {a.body && (
          <div style={{
            marginTop: 8, padding: '6px 10px',
            background: color, border: '2px solid #0C0C0C', borderRadius: 8,
            fontSize: 12, fontWeight: 600, lineHeight: 1.35,
          }}>{a.body}</div>
        )}
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
          color: t.inkMuted, marginTop: 6, textTransform: 'uppercase',
        }}>{a.when}</div>
      </div>
    </div>
  );
}

// ─── Friends — sticker invite + profiles ───────────────────────
function CCScreenFriends() {
  const t = CC_THEME;
  const friends = ['jay', 'sera', 'rio', 'hen'].map(id => BK_PROFILES[id]);
  const colors = [t.pink, t.lime, t.cyan, t.yellow];
  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{ padding: '8px 22px 18px' }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 48, fontWeight: 700, letterSpacing: -2, lineHeight: 0.92, textTransform: 'uppercase',
        }}>YOUR</div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 48, fontWeight: 700, letterSpacing: -2, lineHeight: 0.92, textTransform: 'uppercase',
        }}>
          <span style={{
            background: t.lime, padding: '0 10px', display: 'inline-block', transform: 'rotate(-2deg)',
            border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          }}>PEOPLE</span>.
        </div>
      </div>

      {/* Big invite poster */}
      <div style={{
        margin: '0 22px 22px', padding: 20,
        background: t.blue, color: '#fff',
        border: CC_STICKER_BORDER, boxShadow: CC_STICKER_SHADOW,
        borderRadius: 18, position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: 99,
          background: t.yellow, border: CC_STICKER_BORDER_SM,
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: -30, left: 60, width: 60, height: 60, borderRadius: 99,
          background: t.pink, border: CC_STICKER_BORDER_SM,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 28, fontWeight: 700, letterSpacing: -1, lineHeight: 1,
            textTransform: 'uppercase',
          }}>BRING</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 28, fontWeight: 700, letterSpacing: -1, lineHeight: 1,
            textTransform: 'uppercase',
          }}>SOMEONE</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 28, fontWeight: 700, letterSpacing: -1, lineHeight: 1,
            textTransform: 'uppercase',
          }}>ALONG.</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', marginTop: 12, maxWidth: 240, fontWeight: 500, lineHeight: 1.4 }}>
            Send an invite link or share your code. They see your shared buckets the second they join.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={{
              padding: '10px 16px', borderRadius: 12, background: t.surface, color: t.ink,
              border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
              fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
              cursor: 'pointer',
            }}>↗ SHARE INVITE</button>
            <button style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              border: '2px solid #fff',
              fontFamily: '"Geist Mono", monospace', fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
              cursor: 'pointer',
            }}>BKT–9F2D</button>
          </div>
        </div>
      </div>

      {/* Friends grid as profile stickers */}
      <div style={{
        padding: '0 22px 8px',
        fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        color: t.inkMuted,
      }}>· {friends.length} FRIENDS ·</div>
      <div style={{
        padding: '6px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
      }}>
        {friends.map((p, i) => (
          <div key={p.id} style={{
            padding: 14, background: t.surface,
            border: CC_STICKER_BORDER, boxShadow: CC_STICKER_SHADOW, borderRadius: 16,
            transform: `rotate(${i % 2 === 0 ? -0.8 : 1.2}deg)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 99, background: colors[i],
              border: CC_STICKER_BORDER_SM, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: CC_FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: t.ink,
            }}>{p.initials}</div>
            <div style={{
              fontFamily: CC_FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.3, textAlign: 'center',
            }}>{p.name.split(' ')[0].toUpperCase()}</div>
            <div style={{
              fontFamily: CC_FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
              color: t.inkMuted, textTransform: 'uppercase',
            }}>2 SHARED · @{p.handle}</div>
            <button style={{
              padding: '6px 12px', borderRadius: 99,
              background: t.bg, color: t.ink,
              border: '1.5px solid #0C0C0C',
              fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
              cursor: 'pointer',
            }}>VIEW</button>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { CCScreenAdd, CCScreenMemories, CCScreenActivity, CCScreenFriends });

// ─── Icon library (organized by theme) ─────────────────────────
// Each entry pairs an emoji with a sticker-frame color so the picker reads
// like a stickerbook page rather than a flat emoji grid. The visual design
// IS the colored frame + the tilt — same system as everything else.
const CC_ICON_LIBRARY = {
  Travel:     [
    { e: '✈️', c: 'yellow' }, { e: '🏖', c: 'cyan' },   { e: '🗺', c: 'lime' },
    { e: '🚂', c: 'pink' },   { e: '⛵', c: 'blue' },   { e: '🏔', c: 'yellow' },
    { e: '🚲', c: 'lime' },   { e: '🌍', c: 'cyan' },
  ],
  Food: [
    { e: '🥮', c: 'pink' },   { e: '🍕', c: 'yellow' }, { e: '🍜', c: 'red' },
    { e: '🍦', c: 'cyan' },   { e: '🥐', c: 'yellow' }, { e: '🍷', c: 'pink' },
    { e: '🍫', c: 'yellow' }, { e: '🥗', c: 'lime' },
  ],
  Adventure: [
    { e: '⚡', c: 'yellow' }, { e: '🔥', c: 'red' },    { e: '🏄', c: 'cyan' },
    { e: '🧗', c: 'lime' },   { e: '🤿', c: 'blue' },   { e: '🎢', c: 'red' },
    { e: '🪂', c: 'cyan' },   { e: '🏕', c: 'lime' },
  ],
  Wellness: [
    { e: '🌿', c: 'lime' },   { e: '🧘', c: 'pink' },   { e: '😴', c: 'cyan' },
    { e: '☕', c: 'yellow' }, { e: '📚', c: 'lime' },   { e: '🛁', c: 'pink' },
    { e: '🌱', c: 'lime' },   { e: '🚶', c: 'cyan' },
  ],
  Social: [
    { e: '🎉', c: 'pink' },   { e: '🎂', c: 'yellow' }, { e: '🎤', c: 'red' },
    { e: '🎁', c: 'blue' },   { e: '🥂', c: 'pink' },   { e: '💌', c: 'cyan' },
    { e: '🎮', c: 'lime' },   { e: '🎬', c: 'yellow' },
  ],
  Culture: [
    { e: '🎭', c: 'pink' },   { e: '🎨', c: 'yellow' }, { e: '🎵', c: 'cyan' },
    { e: '📷', c: 'lime' },   { e: '🏛', c: 'yellow' }, { e: '📖', c: 'pink' },
    { e: '🎪', c: 'red' },    { e: '🎻', c: 'blue' },
  ],
  Special: [
    { e: '⭐', c: 'yellow' }, { e: '💫', c: 'pink' },   { e: '🏆', c: 'yellow' },
    { e: '💎', c: 'cyan' },   { e: '🌈', c: 'pink' },   { e: '☀️', c: 'yellow' },
    { e: '🌙', c: 'blue' },   { e: '⚓', c: 'cyan' },
  ],
};

// ─── Icon picker screen ────────────────────────────────────────
function CCScreenIconPicker({ onClose, onPick }) {
  const t = CC_THEME;
  const [activeCat, setActiveCat] = React.useState('Travel');
  const [picked, setPicked] = React.useState({ e: '🥮', c: 'pink' });
  const cats = Object.keys(CC_ICON_LIBRARY);

  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      {/* Top bar */}
      <div style={{
        padding: '8px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={onClose} style={{
          padding: '8px 14px', background: t.surface, border: CC_STICKER_BORDER_SM,
          boxShadow: CC_STICKER_SHADOW_SM, borderRadius: 12, cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>CANCEL</button>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4,
          textTransform: 'uppercase',
        }}>STICKER LIBRARY</div>
        <button onClick={() => onPick && onPick(picked)} style={{
          padding: '8px 14px', background: t.ink, color: '#fff',
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          borderRadius: 12, cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>PICK ↓</button>
      </div>

      {/* Title */}
      <div style={{ padding: '4px 22px 14px' }}>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 44, fontWeight: 700,
          letterSpacing: -1.8, lineHeight: 0.92, textTransform: 'uppercase',
        }}>PICK</div>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 44, fontWeight: 700,
          letterSpacing: -1.8, lineHeight: 0.92, textTransform: 'uppercase',
        }}>
          A <span style={{
            background: t.pink, padding: '0 10px', display: 'inline-block', transform: 'rotate(-2deg)',
            border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          }}>STICKER</span>.
        </div>
        <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: t.inkMuted, lineHeight: 1.4 }}>
          Frames its color around your icon. Tap any one to preview it below.
        </div>
      </div>

      {/* Search */}
      <div style={{
        margin: '0 22px 14px', padding: '10px 14px',
        background: t.surface, border: CC_STICKER_BORDER_SM,
        boxShadow: '2px 2px 0 rgba(12,12,12,0.18)', borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <CCIcon name="search" size={16} />
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          color: t.inkMuted, textTransform: 'uppercase',
        }}>SEARCH 200+ STICKERS…</div>
      </div>

      {/* Category sticker chips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 22px 14px', overflowX: 'auto' }}>
        {cats.map(k => {
          const on = activeCat === k;
          return (
            <div key={k} onClick={() => setActiveCat(k)} style={{
              padding: '6px 12px',
              background: on ? t.ink : t.surface,
              color: on ? t.bg : t.ink,
              border: CC_STICKER_BORDER_SM,
              boxShadow: on ? CC_STICKER_SHADOW_SM : '2px 2px 0 rgba(12,12,12,0.15)',
              borderRadius: 99,
              fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
              whiteSpace: 'nowrap', flex: '0 0 auto', cursor: 'pointer',
              textTransform: 'uppercase',
            }}>{k}</div>
          );
        })}
      </div>

      {/* Sticker grid for the active category */}
      <div style={{
        padding: '4px 22px 0',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
      }}>
        {CC_ICON_LIBRARY[activeCat].map((s, i) => {
          const on = picked.e === s.e;
          return (
            <div key={s.e} onClick={() => setPicked(s)} style={{
              aspectRatio: '1 / 1',
              background: t[s.c],
              border: on ? '3px solid #0C0C0C' : CC_STICKER_BORDER_SM,
              boxShadow: on ? '4px 4px 0 #0C0C0C' : CC_STICKER_SHADOW_SM,
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, cursor: 'pointer',
              transform: `rotate(${on ? -3 : (i % 3 === 1 ? -1 : i % 3 === 2 ? 1 : 0)}deg)`,
              transition: 'transform 0.15s',
            }}>{s.e}</div>
          );
        })}
      </div>

      {/* Live preview footer */}
      <div style={{
        margin: '24px 22px 0', padding: 14,
        background: t.surface, border: CC_STICKER_BORDER, boxShadow: CC_STICKER_SHADOW,
        borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: t[picked.c],
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, flex: '0 0 auto', transform: 'rotate(-2deg)',
        }}>{picked.e}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1,
            textTransform: 'uppercase', color: t.inkMuted,
          }}>PREVIEW</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4,
            color: t.ink, marginTop: 2, textTransform: 'uppercase',
          }}>YOUR NEW THING</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
            color: t.inkMuted, textTransform: 'uppercase', marginTop: 4,
          }}>FRAME: {picked.c.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CCIcon, CC_ICON_LIBRARY, CCScreenIconPicker });

// ─── Design-notes sheets (rendered in the canvas) ──────────────
function CCPaletteSheet() {
  const t = CC_THEME;
  const swatches = [
    { label: 'BG / butter cream', color: t.bg },
    { label: 'INK / near-black',  color: t.ink },
    { label: 'PINK / accent 1',   color: t.pink },
    { label: 'CYAN / accent 2',   color: t.cyan },
    { label: 'LIME / accent 3',   color: t.lime },
    { label: 'YELLOW / highlight', color: t.yellow },
    { label: 'BLUE / cool pop',   color: t.blue },
    { label: 'RED / urgent',      color: t.red },
  ];
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg,
      padding: 28, fontFamily: CC_FONT, color: t.ink, boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 32, fontWeight: 700,
        letterSpacing: -1.2, textTransform: 'uppercase', lineHeight: 0.95,
      }}>
        STICKER PALETTE.
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: t.inkMuted, marginTop: 8, marginBottom: 18 }}>
        High-saturation primaries on a butter base. Every accent works as a 2px black-stroked sticker.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {swatches.map(s => (
          <div key={s.label} style={{
            background: s.color, border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
            borderRadius: 10, padding: '12px 10px', minHeight: 84,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            color: s.color === t.ink || s.color === t.blue ? '#fff' : t.ink,
          }}>
            <div style={{ fontFamily: CC_FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, fontWeight: 500 }}>{s.color}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CCTypeSheet() {
  const t = CC_THEME;
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg,
      padding: 28, fontFamily: CC_FONT, color: t.ink, boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 56, fontWeight: 700,
        letterSpacing: -2.2, lineHeight: 0.92, textTransform: 'uppercase',
      }}>WHAT'S</div>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 56, fontWeight: 700,
        letterSpacing: -2.2, lineHeight: 0.92, textTransform: 'uppercase',
      }}>
        ON THE <span style={{
          background: t.lime, padding: '0 12px', display: 'inline-block', transform: 'rotate(-2deg)',
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM,
        }}>LIST</span>
      </div>
      <div style={{
        marginTop: 16, fontFamily: '"Geist Mono", monospace', fontSize: 11, color: t.inkMuted,
      }}>
        SPACE GROTESK · 700 · -2.2 ls · UPPERCASE · headline
      </div>

      <div style={{
        marginTop: 22, fontFamily: CC_FONT_DISPLAY, fontSize: 22, fontWeight: 700,
        letterSpacing: -0.6, textTransform: 'uppercase',
      }}>PASTÉIS DE BELÉM</div>
      <div style={{
        marginTop: 4, fontFamily: '"Geist Mono", monospace', fontSize: 11, color: t.inkMuted,
      }}>
        SPACE GROTESK · 700 · -0.6 ls · UPPERCASE · poster title
      </div>

      <div style={{ marginTop: 18, fontSize: 14, fontWeight: 600, color: t.ink, lineHeight: 1.45 }}>
        5 of 14 ticked off. Departs in 24 days.
      </div>
      <div style={{
        marginTop: 4, fontFamily: '"Geist Mono", monospace', fontSize: 11, color: t.inkMuted,
      }}>
        SPACE GROTESK · 600 · body
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
        <div style={{
          padding: '6px 12px', background: t.pink, color: t.ink,
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM, borderRadius: 99,
          fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
        }}>STICKER CHIP</div>
        <button style={{
          padding: '10px 16px', background: t.ink, color: '#fff',
          border: CC_STICKER_BORDER_SM, boxShadow: CC_STICKER_SHADOW_SM, borderRadius: 12,
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>CTA BUTTON →</button>
      </div>
      <div style={{
        marginTop: 8, fontFamily: '"Geist Mono", monospace', fontSize: 11, color: t.inkMuted,
      }}>
        border 2px #0C0C0C · shadow 3-4px 3-4px 0 · radius 12-99px
      </div>
    </div>
  );
}

Object.assign(window, { CCPaletteSheet, CCTypeSheet });

// ─── Sticker-style icons (simple shapes, thick black strokes) ──
// Built from basic primitives only — no illustration. The visual
// personality comes from the chunky 2.4px stroke + the sticker frame
// each icon sits in.
function CCIcon({ name, size = 22, color = '#0C0C0C' }) {
  const sw = 2.4;
  const p = { stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const svg = (children) => (
    <svg width={size} height={size} viewBox="0 0 24 24">{children}</svg>
  );
  switch (name) {
    case 'bucket':
      return svg(<>
        <path d="M5 7 L19 7 L17.5 20 L6.5 20 Z" {...p} />
        <path d="M8 7 C 8 4, 16 4, 16 7" {...p} />
        <line x1="7" y1="11" x2="17" y2="11" {...p} strokeOpacity="0.35" />
      </>);
    case 'clock':
      return svg(<>
        <circle cx="12" cy="12" r="9" {...p} />
        <path d="M12 7 L12 12 L16 14" {...p} />
      </>);
    case 'plus':
      return svg(<>
        <line x1="12" y1="5" x2="12" y2="19" {...p} strokeWidth="3" />
        <line x1="5" y1="12" x2="19" y2="12" {...p} strokeWidth="3" />
      </>);
    case 'photo':
      return svg(<>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" {...p} />
        <circle cx="9" cy="10" r="1.8" {...p} />
        <path d="M3 17 L9 11.5 L13 15 L17 11 L21 14.5" {...p} />
      </>);
    case 'friends':
      return svg(<>
        <circle cx="9" cy="8" r="3" {...p} />
        <circle cx="16.5" cy="9.5" r="2.4" {...p} />
        <path d="M3 20 C 3 15.5, 15 15.5, 15 20" {...p} />
        <path d="M14.5 16.5 C 17 16.5, 21 17, 21 20" {...p} />
      </>);
    case 'pin':
      return svg(<>
        <path d="M12 3 C 8 3, 5 6, 5 10 C 5 14, 12 21, 12 21 C 12 21, 19 14, 19 10 C 19 6, 16 3, 12 3 Z" {...p} />
        <circle cx="12" cy="10" r="2.6" {...p} />
      </>);
    case 'heart':
      return svg(<>
        <path d="M12 20 C 4 14, 4 7, 8 7 C 10 7, 12 9, 12 11 C 12 9, 14 7, 16 7 C 20 7, 20 14, 12 20 Z" {...p} />
      </>);
    case 'star':
      return svg(<>
        <path d="M12 3 L14.6 9.6 L21 10 L16 14.5 L17.6 21 L12 17.4 L6.4 21 L8 14.5 L3 10 L9.4 9.6 Z" {...p} />
      </>);
    case 'check':
      return svg(<>
        <path d="M5 12.5 L10 17.5 L19 7" {...p} strokeWidth="3" />
      </>);
    case 'chat':
      return svg(<>
        <path d="M4 6 C 4 4, 5 3, 7 3 L 17 3 C 19 3, 20 4, 20 6 L 20 13 C 20 15, 19 16, 17 16 L 10 16 L 6 20 L 6 16 C 5 16, 4 15, 4 13 Z" {...p} />
      </>);
    case 'search':
      return svg(<>
        <circle cx="10.5" cy="10.5" r="6" {...p} />
        <line x1="15" y1="15" x2="20" y2="20" {...p} strokeWidth="3" />
      </>);
    default:
      return svg(<circle cx="12" cy="12" r="6" {...p} />);
  }
}

// ─── Phone wrapper using concept C styles ──────────────────────
// `interactive` mode: handles nav state and switches screens on click.
// `screen` (when not interactive): renders a single static screen.
function CCPhone({ screen = 'home', interactive = false }) {
  const t = CC_THEME;
  const [nav, setNav] = React.useState({ tab: 'home', screen: 'home' });
  const active = interactive ? nav.screen : screen;

  function go(patch) { setNav(n => ({ ...n, ...patch })); }
  function setTab(tab) {
    if (tab === 'add') return go({ screen: 'add' });
    if (tab === 'home') return go({ tab, screen: 'home' });
    if (tab === 'activity') return go({ tab, screen: 'activity' });
    if (tab === 'memories') return go({ tab, screen: 'memories' });
    if (tab === 'friends') return go({ tab, screen: 'friends' });
  }

  let content;
  if (active === 'home') {
    content = <CCScreenHome onOpenBucket={() => interactive && go({ screen: 'bucket' })} />;
  } else if (active === 'bucket') {
    content = <CCScreenBucket
      onBack={() => interactive && go({ screen: 'home' })}
      onOpenItem={() => interactive && go({ screen: 'item' })}
      onAdd={() => interactive && go({ screen: 'add' })}
    />;
  } else if (active === 'item') {
    content = <CCScreenItem
      onBack={() => interactive && go({ screen: 'bucket' })}
    />;
  } else if (active === 'add') {
    content = <CCScreenAdd
      onCancel={() => interactive && go({ screen: nav.tab === 'home' ? 'home' : nav.tab })}
      onAdd={() => interactive && go({ screen: nav.tab === 'home' ? 'home' : nav.tab })}
      onPickIcon={() => interactive && go({ screen: 'iconpicker' })}
      selectedIcon={nav.selectedIcon}
    />;
  } else if (active === 'iconpicker') {
    content = <CCScreenIconPicker
      onClose={() => interactive && go({ screen: 'add' })}
      onPick={s => interactive && go({ screen: 'add', selectedIcon: s })}
    />;
  } else if (active === 'memories') {
    content = <CCScreenMemories />;
  } else if (active === 'activity') {
    content = <CCScreenActivity />;
  } else if (active === 'friends') {
    content = <CCScreenFriends />;
  }

  const showNav = active !== 'add' && active !== 'iconpicker';
  const navTab = active === 'item' || active === 'bucket' ? 'home' : active;

  return (
    <div style={{
      width: 393, height: 852,
      background: '#000', borderRadius: 52, padding: 5,
      boxShadow: '0 24px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.14)',
      position: 'relative', boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 47, overflow: 'hidden',
        position: 'relative', background: t.bg,
      }}>
        <PHStatusBar theme={{ bg: '#fff', ink: t.ink, inkMuted: t.inkMuted }} />
        <PHDynamicIsland />
        <div style={{ position: 'absolute', inset: 0, paddingTop: 54, overflow: 'auto' }}>
          {content}
        </div>
        {showNav && <CCBottomNav active={navTab} onTab={interactive ? setTab : () => {}} />}
        <PHHomeIndicator dark={false} />
      </div>
    </div>
  );
}

function CCBottomNav({ active, onTab }) {
  const t = CC_THEME;
  const items = [
    { id: 'home',     icon: 'bucket',  color: t.lime },
    { id: 'activity', icon: 'clock',   color: t.cyan },
    { id: 'add',      icon: 'plus',    color: t.ink, isAdd: true },
    { id: 'memories', icon: 'photo',   color: t.pink },
    { id: 'friends',  icon: 'friends', color: t.yellow },
  ];
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 24, height: 64,
      background: t.surface, border: CC_STICKER_BORDER,
      boxShadow: CC_STICKER_SHADOW, borderRadius: 99,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 50,
      padding: '0 6px',
    }}>
      {items.map(it => {
        const on = active === it.id;
        if (it.isAdd) {
          return (
            <button key={it.id} onClick={() => onTab(it.id)} style={{
              width: 50, height: 50, borderRadius: 99,
              background: t.ink, color: '#fff',
              border: CC_STICKER_BORDER_SM, boxShadow: '3px 3px 0 #0C0C0C',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><CCIcon name="plus" size={24} color="#fff" /></button>
          );
        }
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{
            width: 44, height: 44, borderRadius: 99,
            background: on ? it.color : 'transparent',
            border: on ? '2px solid #0C0C0C' : 'none',
            cursor: 'pointer',
            boxShadow: on ? '2px 2px 0 #0C0C0C' : 'none',
            transform: on ? 'rotate(-3deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><CCIcon name={it.icon} size={22} /></button>
        );
      })}
    </div>
  );
}

Object.assign(window, { CCPhone, CC_THEME });
