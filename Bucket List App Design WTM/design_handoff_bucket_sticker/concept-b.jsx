// Bucket — Concept B: "Quiet journal"
// Editorial/journal aesthetic. Serif throughout (Newsreader), restrained
// palette, deep textures via type alone. One bucket at a time on the home
// (deck-like). The vibe: writing in a leather notebook, not posting.

const CB_THEME = {
  bg: '#EEE7D5',
  paper: '#F6EFD9',
  surface: '#FBF6E6',
  ink: '#1F1A12',
  inkMuted: '#6A6354',
  inkSubtle: '#9B937F',
  accent: '#6E8F77',     // sage
  accent2: '#B45F4A',    // dusty terracotta — used as a secondary mark
  rule: 'rgba(31,26,18,0.18)',
  ruleSoft: 'rgba(31,26,18,0.08)',
};
const CB_FONT = '"Newsreader", "Cormorant Garamond", Georgia, serif';
const CB_FONT_ITALIC = { fontFamily: CB_FONT, fontStyle: 'italic' };
const CB_FONT_CAPS = '"Geist", -apple-system, system-ui, sans-serif';

// ─── Home — single-bucket deck ─────────────────────────────────
function CBScreenHome() {
  const t = CB_THEME;
  return (
    <div style={{ padding: '0 0 110px', fontFamily: CB_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      {/* Masthead */}
      <div style={{
        padding: '8px 28px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        borderBottom: `1px solid ${t.rule}`,
      }}>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 11, fontWeight: 600,
          letterSpacing: 4, textTransform: 'uppercase', color: t.inkMuted,
        }}>
          The Bucket · Vol. 4
        </div>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted,
          letterSpacing: 1.5, textTransform: 'uppercase',
        }}>May 21</div>
      </div>

      {/* Title block */}
      <div style={{ padding: '34px 28px 18px' }}>
        <div style={{
          fontFamily: CB_FONT, fontStyle: 'italic', fontSize: 14, color: t.inkMuted,
          letterSpacing: 0.2, marginBottom: 8,
        }}>Currently in:</div>
        <div style={{ fontSize: 64, lineHeight: 0.95, letterSpacing: -2, fontWeight: 500, color: t.ink }}>
          Summer
        </div>
        <div style={{ fontSize: 64, lineHeight: 0.95, letterSpacing: -2, fontWeight: 500, color: t.ink, fontStyle: 'italic' }}>
          in Lisbon.
        </div>
        <div style={{
          marginTop: 18, fontSize: 14, lineHeight: 1.55, color: t.inkMuted, maxWidth: 280, fontWeight: 400,
        }}>
          A June trip. Four of us. Fourteen things we said we'd do —
          we've done five already, which feels too fast and exactly right.
        </div>
        <div style={{
          marginTop: 22, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <BKAvatarStack ids={['me','jay','sera','rio']} size={26} ring={t.bg} />
          <div style={{
            fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted,
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}>4 keepers · 5 of 14</div>
        </div>
      </div>

      {/* Big editorial photo */}
      <div style={{ padding: '14px 28px 0' }}>
        <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
          <BKPhotoSlot w={PH_W - 56} h={300} hue="travel" label="cover · the miradouro at dusk" radius={0} />
        </div>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted,
          letterSpacing: 1.5, marginTop: 8, textTransform: 'uppercase',
        }}>Cover · Miradouro da Senhora do Monte</div>
      </div>

      {/* Bucket index */}
      <div style={{
        margin: '34px 28px 0', padding: '14px 0 0', borderTop: `1px solid ${t.rule}`,
      }}>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 10, fontWeight: 600,
          letterSpacing: 2.5, textTransform: 'uppercase', color: t.inkMuted, marginBottom: 14,
        }}>The other notebooks</div>
        <CBIndexRow num="01" title="Life, lately" sub="Solo · 18 of 29 · since Jan" />
        <CBIndexRow num="02" title="Hen's 30th" sub="3 keepers · 0 of 7 · this weekend" />
        <CBIndexRow num="03" title="Things to cook" sub="Solo · 11 of 22 · ongoing" />
        <CBIndexRow num="++" title="New notebook" sub="Start a new one" muted />
      </div>
    </div>
  );
}

function CBIndexRow({ num, title, sub, muted }) {
  const t = CB_THEME;
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 16, padding: '12px 0',
      borderBottom: `1px solid ${t.ruleSoft}`,
    }}>
      <div style={{
        fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkSubtle,
        letterSpacing: 1, minWidth: 24,
      }}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: CB_FONT, fontSize: 20, fontStyle: muted ? 'italic' : 'normal',
          color: muted ? t.inkMuted : t.ink, letterSpacing: -0.4,
        }}>{title}</div>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted, marginTop: 2,
          letterSpacing: 1, textTransform: 'uppercase',
        }}>{sub}</div>
      </div>
      <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 14, color: t.inkSubtle }}>›</div>
    </div>
  );
}

// ─── Bucket detail — typographic list ──────────────────────────
function CBScreenBucket() {
  const t = CB_THEME;
  const items = BK_ITEMS.filter(i => i.bucket === 'b1');
  return (
    <div style={{ padding: '0 0 130px', fontFamily: CB_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{
        padding: '8px 28px 14px', borderBottom: `1px solid ${t.rule}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkMuted, letterSpacing: 2.5, textTransform: 'uppercase' }}>
          ‹ The Bucket
        </div>
        <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkMuted, letterSpacing: 1 }}>·  ·  ·</div>
      </div>

      <div style={{ padding: '32px 28px 8px' }}>
        <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          Notebook 04 · 14 entries
        </div>
        <div style={{ fontSize: 48, lineHeight: 0.95, letterSpacing: -1.4, fontWeight: 500 }}>Summer</div>
        <div style={{ fontSize: 48, lineHeight: 0.95, letterSpacing: -1.4, fontStyle: 'italic', fontWeight: 500 }}>in Lisbon.</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
          <BKAvatarStack ids={['me','jay','sera','rio']} size={22} ring={t.bg} />
          <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            departs in 24 days
          </div>
        </div>
      </div>

      {/* Progress as a rule */}
      <div style={{ margin: '28px 28px 0' }}>
        <div style={{ height: 1, background: t.rule, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: -1, height: 3, background: t.accent2, width: '36%' }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted,
          letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 8,
        }}>
          <span>5 of 14</span><span>36 percent</span>
        </div>
      </div>

      {/* Entries */}
      <div style={{ padding: '32px 28px 0' }}>
        {items.map((it, i) => (
          <CBEntry key={it.id} item={it} n={i + 1} last={i === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

function CBEntry({ item, n, last }) {
  const t = CB_THEME;
  return (
    <div style={{
      padding: '14px 0', borderBottom: last ? 'none' : `1px solid ${t.ruleSoft}`,
      opacity: item.done ? 0.6 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkSubtle,
          letterSpacing: 1, minWidth: 22, fontVariantNumeric: 'tabular-nums',
        }}>{String(n).padStart(2, '0')}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: CB_FONT, fontSize: 18, lineHeight: 1.25, letterSpacing: -0.3,
            color: t.ink, textDecoration: item.done ? 'line-through' : 'none',
            textDecorationColor: t.inkSubtle,
          }}>
            {item.title}
          </div>
          <div style={{
            display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap',
            fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.inkMuted,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>
            <span>{item.cat}</span>
            {item.date && <span>· {item.date}</span>}
            {item.loc && <span>· {item.loc}</span>}
            {item.photos > 0 && <span>· {item.photos} photos</span>}
          </div>
          {item.note && (
            <div style={{
              marginTop: 10, paddingLeft: 14, borderLeft: `2px solid ${t.accent2}`,
              fontFamily: CB_FONT, fontStyle: 'italic', fontSize: 14, lineHeight: 1.5, color: t.ink,
            }}>"{item.note}"</div>
          )}
        </div>
        <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 14, color: t.inkSubtle, alignSelf: 'flex-start', paddingTop: 2 }}>
          {item.done ? '✓' : '○'}
        </div>
      </div>
    </div>
  );
}

// ─── Item detail — long-form memory ────────────────────────────
function CBScreenItem() {
  const t = CB_THEME;
  const item = BK_ITEMS[1]; // Pastéis de Belém
  return (
    <div style={{ padding: '0 0 130px', fontFamily: CB_FONT, color: t.ink, background: t.bg, minHeight: '100%' }}>
      <div style={{
        padding: '8px 28px 14px', borderBottom: `1px solid ${t.rule}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkMuted, letterSpacing: 2.5, textTransform: 'uppercase' }}>
          ‹ Summer in Lisbon
        </div>
        <div style={{ fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkMuted, letterSpacing: 1 }}>Edit</div>
      </div>

      <div style={{ padding: '32px 28px 16px' }}>
        <div style={{
          fontFamily: CB_FONT_CAPS, fontSize: 10, color: t.accent2,
          letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600,
        }}>Entry 02 · Food</div>
        <div style={{
          fontSize: 36, lineHeight: 1.05, letterSpacing: -0.8,
          marginTop: 10, fontWeight: 500,
        }}>
          Pastéis de Belém —
        </div>
        <div style={{
          fontSize: 36, lineHeight: 1.05, letterSpacing: -0.8, fontStyle: 'italic', fontWeight: 500, color: t.accent2,
        }}>
          eat six, no judgement.
        </div>
        <div style={{
          marginTop: 16, fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkMuted,
          letterSpacing: 1.5, textTransform: 'uppercase', display: 'flex', gap: 16,
        }}>
          <span>Jun 12</span><span>Belém</span><span>with Rio, Jay</span>
        </div>
      </div>

      {/* The image */}
      <div style={{ padding: '8px 28px 0' }}>
        <BKPhotoSlot w={PH_W - 56} h={260} hue="food" label="warm custard · jun 12 · 4:15pm" radius={2} />
        <div style={{
          fontFamily: CB_FONT, fontStyle: 'italic', fontSize: 12, color: t.inkMuted,
          marginTop: 6, lineHeight: 1.45, textAlign: 'center',
        }}>
          fig. 1 — eaten before the photo, three more eaten after
        </div>
      </div>

      {/* The body */}
      <div style={{ padding: '24px 28px 0' }}>
        <div style={{ fontSize: 22, lineHeight: 1.45, color: t.ink, letterSpacing: -0.2, fontWeight: 400 }}>
          <span style={{ fontSize: 48, fontStyle: 'italic', float: 'left', lineHeight: 0.9, paddingRight: 8, paddingTop: 4 }}>R</span>
          io cried (happy). The custard was warm. We&nbsp;arrived at 4:11 — the line out the
          door looked impossible but moved like water. Jay bought a box of six "for the room"
          and finished four of them on the walk back.
        </div>
        <div style={{
          marginTop: 22, fontFamily: CB_FONT_CAPS, fontSize: 11, color: t.inkMuted,
          letterSpacing: 0.5, lineHeight: 1.6,
        }}>
          Three photos. Two comments. Marked done by Rio on the train home.
        </div>
      </div>

      {/* Done / restore */}
      <div style={{ margin: '28px 28px 0', display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, padding: '14px 16px', borderRadius: 2,
          background: t.ink, color: t.bg, border: 'none', cursor: 'pointer',
          fontFamily: CB_FONT_CAPS, fontSize: 11, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase',
        }}>✓ Marked done</button>
        <button style={{
          padding: '14px 18px', borderRadius: 2,
          background: 'transparent', color: t.ink, border: `1px solid ${t.rule}`, cursor: 'pointer',
          fontFamily: CB_FONT_CAPS, fontSize: 11, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase',
        }}>Share</button>
      </div>
    </div>
  );
}

// ─── Phone wrapper using concept B styles ──────────────────────
function CBPhone({ screen = 'home' }) {
  const t = CB_THEME;
  let content;
  if (screen === 'home') content = <CBScreenHome />;
  else if (screen === 'bucket') content = <CBScreenBucket />;
  else if (screen === 'item') content = <CBScreenItem />;

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
        {/* Quiet bottom tab */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          paddingBottom: 30, paddingTop: 14, paddingLeft: 28, paddingRight: 28,
          background: t.bg, borderTop: `1px solid ${t.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50,
        }}>
          {['Buckets','Today','Memories','You'].map((l, i) => (
            <div key={l} style={{
              fontFamily: CB_FONT_CAPS, fontSize: 10, fontWeight: 600,
              letterSpacing: 1.6, textTransform: 'uppercase',
              color: i === 0 ? t.ink : t.inkMuted,
              borderBottom: i === 0 ? `1px solid ${t.ink}` : 'none', paddingBottom: 2,
            }}>{l}</div>
          ))}
        </div>
        <PHHomeIndicator dark={false} />
      </div>
    </div>
  );
}

Object.assign(window, { CBPhone, CB_THEME });
