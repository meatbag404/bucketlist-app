// Bucket List — screens part 2.

// ─── 4. Add to bucket ──────────────────────────────────────────
function ScreenAdd({ navigate, vp, pickedIcon }) {
  const [title, setTitle] = React.useState('');
  const [cat, setCat] = React.useState('travel');
  const [bucket, setBucket] = React.useState('b1');
  const [tagged, setTagged] = React.useState(['jay']);
  const [date, setDate] = React.useState('');
  const [loc, setLoc] = React.useState('');
  const [icon, setIcon] = React.useState(pickedIcon || { id: 'plane', color: 'yellow' });
  React.useEffect(() => { if (pickedIcon) setIcon(pickedIcon); }, [pickedIcon]);
  const c = BK_CATS[cat];
  const activeBucket = BK_BUCKETS.find(b => b.id === bucket);

  function toggle(arr, set, x) {
    set(arr.includes(x) ? arr.filter(y => y !== x) : [...arr, x]);
  }

  return (
    <div style={{ maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <StickerButton onClick={() => navigate('buckets')}>CANCEL</StickerButton>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 16 : 18, fontWeight: 700, letterSpacing: -0.4,
          textTransform: 'uppercase',
        }}>NEW THING</div>
        <StickerButton color="ink" disabled={!title.trim()}>ADD →</StickerButton>
      </div>

      <PageHeading
        lineA="ADD"
        lineB={<>SOMETHING <HighlightBlock color="pink">NEW</HighlightBlock></>}
        sub="It can be tiny or huge. Done by next week or someday. Tag friends so they get a ping."
        vp={vp}
      />

      {/* Bucket pill */}
      <Sticker color="cyan" radius={14} shadow="sm" border="sm" style={{
        padding: '12px 16px', marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <StickerEmoji id={activeBucket.emoji} size={40} tilt={-2} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>ADDING TO</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>{activeBucket.name}</div>
        </div>
        <select value={bucket} onChange={e => setBucket(e.target.value)} style={{
          background: T.surface, color: T.ink, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
          borderRadius: 10, padding: '6px 10px',
          fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          cursor: 'pointer',
        }}>
          {BK_BUCKETS.map(b => <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>)}
        </select>
      </Sticker>

      {/* Title + icon picker */}
      <Sticker color={c.color} radius={18} shadow="lg" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <button onClick={() => navigate('icons')} className="bk-sticker-btn" style={{
            position: 'relative', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0,
          }}>
            <StickerEmoji id={icon.id} size={68} frameColor={icon.color} tilt={-3} />
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 24, height: 24, borderRadius: 99, background: T.ink, color: '#fff',
              border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, boxShadow: '1px 1px 0 #0C0C0C',
            }}>↕</div>
          </button>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="WHAT DO YOU WANT TO TICK OFF?"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: FONT_DISPLAY, fontSize: vp === 'mobile' ? 18 : 22, fontWeight: 700,
              letterSpacing: -0.5, color: T.ink, padding: '12px 0',
              textTransform: 'uppercase', minWidth: 0,
            }}
          />
        </div>
        <button className="bk-sticker-btn" onClick={() => navigate('icons')} style={{
          marginTop: 14, padding: '10px 14px', width: '100%',
          background: T.surface, border: STICKER_BORDER_SM, boxShadow: '2px 2px 0 rgba(12,12,12,0.18)',
          borderRadius: 12, cursor: 'pointer',
          fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}>
          BROWSE STICKER LIBRARY · 30+ →
        </button>
      </Sticker>

      {/* Category */}
      <div style={{ marginBottom: 18 }}>
        <SectionLabel>PICK A CATEGORY</SectionLabel>
        <div className="bk-scrollx" style={{ display: 'flex', gap: 8, marginTop: 10, padding: '2px 0' }}>
          {Object.entries(BK_CATS).map(([k, v]) => (
            <StickerChip key={k} active={cat === k} color={v.color} onClick={() => setCat(k)}>
              {v.label}
            </StickerChip>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <Sticker radius={16} border="sm" shadow="sm" style={{ overflow: 'hidden', marginBottom: 18 }}>
        <Field icon="📅" placeholder="TARGET DATE (e.g. SUMMER 2025)" value={date} onChange={setDate} />
        <div style={{ height: 1, background: 'rgba(12,12,12,0.12)', marginLeft: 50 }} />
        <Field icon="📍" placeholder="ADD A LOCATION" value={loc} onChange={setLoc} />
        <div style={{ height: 1, background: 'rgba(12,12,12,0.12)', marginLeft: 50 }} />
        <Field icon="📝" placeholder="WHY YOU WANT THIS (OPTIONAL)" />
      </Sticker>

      {/* Tag people */}
      <div>
        <SectionLabel>TAG WHO'S IN</SectionLabel>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          {['jay','sera','rio','hen'].map(id => {
            const p = BK_PROFILES[id];
            const on = tagged.includes(id);
            return (
              <button key={id} onClick={() => toggle(tagged, setTagged, id)} className="bk-sticker-btn" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 14px 6px 6px', borderRadius: 99,
                background: on ? T[c.color] : T.surface,
                border: STICKER_BORDER_SM,
                boxShadow: on ? STICKER_SHADOW_SM : 'none',
                cursor: 'pointer',
              }}>
                <Avatar p={p} size={28} />
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: -0.3, textTransform: 'uppercase' }}>
                  {p.name.split(' ')[0]}
                </span>
                {on && <span style={{ fontSize: 13, fontWeight: 700 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, placeholder, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', minHeight: 48 }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <input
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, letterSpacing: 0.4,
          color: T.ink, textTransform: 'uppercase',
        }}
      />
    </div>
  );
}

// ─── 5. Memories wall ──────────────────────────────────────────
function ScreenMemories({ navigate, vp }) {
  // Build a more varied memories set
  const memories = [
    { id: 'm1', icon: 'pastry',  title: 'Pastéis de Belém', when: 'JUN 12', cat: 'food',      tags: ['rio','jay'], h: 240, tilt: -1.2 },
    { id: 'm2', icon: 'mountain', title: 'Pico do Arieiro at sunrise', when: 'JUL 2024', cat: 'adventure', tags: ['jay','sera'], h: 180, tilt: 1.5 },
    { id: 'm3', icon: 'coffee',  title: 'Best coffee in Brooklyn',     when: 'MAR', cat: 'food',      tags: ['hen'], h: 220, tilt: -0.5 },
    { id: 'm4', icon: 'camera',  title: 'Tile-hunt in Alfama',         when: 'JUN 13', cat: 'culture',   tags: ['jay'], h: 260, tilt: 0.8 },
    { id: 'm5', icon: 'drop',    title: 'First open-water swim',       when: 'APR 12', cat: 'wellness',  tags: ['me'], h: 200, tilt: -1 },
    { id: 'm6', icon: 'music',   title: 'Karaoke, no song left behind', when: 'MAR 28', cat: 'culture',   tags: ['jay','rio','hen'], h: 180, tilt: 1 },
    { id: 'm7', icon: 'wave',    title: 'Surf school graduation',      when: 'AUG 2024', cat: 'adventure', tags: ['sera'], h: 220, tilt: -0.7 },
    { id: 'm8', icon: 'cake',    title: "Hen's surprise picnic",       when: 'MAY', cat: 'social',    tags: ['hen','jay'], h: 200, tilt: 1.2 },
    { id: 'm9', icon: 'flower',  title: 'Cherry blossoms, Greenwich',  when: 'APR', cat: 'wellness',  tags: ['me','jay'], h: 180, tilt: -1.5 },
    { id: 'm10', icon: 'wine',   title: 'Made our own pasta night',    when: 'FEB 14', cat: 'food',      tags: ['hen'], h: 240, tilt: 0.6 },
  ];
  const cols = vp === 'mobile' ? 2 : vp === 'tablet' ? 3 : 4;

  return (
    <div>
      <PageHeading
        lineA="STUFF"
        lineB={<>YOU <HighlightBlock color="pink">DID</HighlightBlock>.</>}
        sub={<><span style={{ color: T.ink, fontWeight: 700 }}>{memories.length}</span> memories this year. Look at you go.</>}
        vp={vp}
      />

      <div className="bk-scrollx" style={{ display: 'flex', gap: 8, marginBottom: 24, padding: '2px 0' }}>
        <StickerChip active color="ink">ALL</StickerChip>
        <StickerChip color="yellow">2025</StickerChip>
        <StickerChip color="yellow">2024</StickerChip>
        <StickerChip color="cyan">📍 LISBON</StickerChip>
        <StickerChip color="lime">WITH JAY</StickerChip>
        <StickerChip color="pink">WITH HEN</StickerChip>
      </div>

      <div style={{
        display: 'grid', gap: vp === 'mobile' ? 14 : 18,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        alignItems: 'start',
      }}>
        {memories.map(m => (
          <MemoryCard key={m.id} m={m} onClick={() => navigate('item', 'i2')} />
        ))}
      </div>
    </div>
  );
}

function MemoryCard({ m, onClick }) {
  const cat = BK_CATS[m.cat] || { color: 'pink', label: m.cat || 'memory' };
  return (
    <Sticker tilt={m.tilt} radius={14} shadow="md" onClick={onClick} style={{
      padding: 0, overflow: 'hidden', cursor: 'pointer',
    }}>
      {/* Color band header */}
      <div style={{
        background: T[cat.color], padding: '8px 12px',
        borderBottom: '2px solid #0C0C0C',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{cat.label || m.cat}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{m.when}</div>
      </div>
      {/* Photo + emoji badge */}
      <div style={{ position: 'relative' }}>
        <PhotoSlot w={300} h={m.h} color={cat.color} label={m.title.toLowerCase()} radius={0} style={{ width: '100%' }} />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <StickerEmoji id={m.icon} size={44} frameColor={cat.color} tilt={-3} />
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2 }}>{m.title}</div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 10, paddingTop: 10, borderTop: '1.5px solid rgba(12,12,12,0.12)',
        }}>
          <AvatarStack ids={m.tags} size={20} max={3} ring={T.surface} />
          <NavIcon name="check" size={14} />
        </div>
      </div>
    </Sticker>
  );
}

// ─── 6. Activity feed ──────────────────────────────────────────
function ScreenActivity({ navigate, vp }) {
  const groups = [
    { day: 'TODAY', items: BK_ACTIVITY.slice(0, 2) },
    { day: 'YESTERDAY', items: BK_ACTIVITY.slice(2, 5) },
    { day: 'THIS WEEK', items: BK_ACTIVITY.slice(5) },
  ];
  const colorByAction = {
    'added a photo to': 'pink', 'commented on': 'cyan', 'marked done': 'lime',
    'added': 'yellow', 'hearted': 'red', 'joined': 'blue',
  };

  return (
    <div style={{ maxWidth: 760, marginLeft: vp === 'desktop' ? 0 : 'auto', marginRight: 'auto' }}>
      <PageHeading
        lineA="WHAT'S"
        lineB={<>BEEN <HighlightBlock color="cyan">UP</HighlightBlock>.</>}
        sub="Comments, photos, and ✓s from everyone in your buckets."
        vp={vp}
        rightSlot={
          <div style={{
            padding: '6px 12px', background: T.red, color: '#fff',
            border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM, borderRadius: 99,
            fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
          }}>3 NEW</div>
        }
      />

      <div className="bk-scrollx" style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        <StickerChip active color="ink">ALL</StickerChip>
        <StickerChip color="cyan">🌍 LISBON</StickerChip>
        <StickerChip color="lime">🌿 LIFE LATELY</StickerChip>
        <StickerChip color="pink">🎂 HEN'S 30TH</StickerChip>
      </div>

      {groups.map(g => (
        <div key={g.day} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <HighlightBlock color="ink" tilt={-1} size="sm">
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#fff', textTransform: 'uppercase' }}>· {g.day} ·</span>
            </HighlightBlock>
            <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {g.items.map((a, i) => (
              <ActivityRow key={a.id} a={a} color={colorByAction[a.action] || 'cyan'} tilt={i % 2 === 0 ? 0 : -0.4} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityRow({ a, color, tilt }) {
  const p = BK_PROFILES[a.who];
  return (
    <Sticker tilt={tilt} radius={14} shadow="sm" border="sm" style={{
      padding: '12px 14px', display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{ position: 'relative', flex: '0 0 auto' }}>
        <Avatar p={p} size={40} />
        <div style={{
          position: 'absolute', bottom: -4, right: -6,
          width: 24, height: 24, borderRadius: 99,
          background: T[color], border: '2px solid #0C0C0C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><NavIcon name={a.glyph} size={12} color={color === 'red' ? '#fff' : '#0C0C0C'} /></div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.4 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2, textTransform: 'uppercase' }}>{p.name.split(' ')[0]}</span>
          <span style={{ color: T.inkMuted, fontWeight: 600 }}> {a.action} </span>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: -0.2 }}>"{a.target}"</span>
        </div>
        {a.body && (
          <div style={{
            marginTop: 8, padding: '6px 10px',
            background: T[color], color: color === 'red' ? '#fff' : T.ink,
            border: '2px solid #0C0C0C', borderRadius: 8,
            fontSize: 12, fontWeight: 600, lineHeight: 1.35,
          }}>{a.body}</div>
        )}
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
          color: T.inkMuted, marginTop: 6, textTransform: 'uppercase',
        }}>{a.when}</div>
      </div>
    </Sticker>
  );
}

// ─── 7. Friends & invite ──────────────────────────────────────
function ScreenFriends({ navigate, vp }) {
  const friends = ['jay', 'sera', 'rio', 'hen'].map(id => BK_PROFILES[id]);
  const cols = vp === 'mobile' ? 2 : vp === 'tablet' ? 3 : 4;

  return (
    <div>
      <PageHeading
        lineA="YOUR"
        lineB={<><HighlightBlock color="lime">PEOPLE</HighlightBlock>.</>}
        sub="The crew you make memories with. Tap any to see their shared buckets."
        vp={vp}
      />

      {/* Invite poster */}
      <Sticker color="blue" radius={20} shadow="lg" style={{
        padding: vp === 'mobile' ? 22 : 32, marginBottom: 32, position: 'relative', overflow: 'hidden',
        color: '#fff',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: -24, right: -16, width: 120, height: 120, borderRadius: 99,
          background: T.yellow, border: STICKER_BORDER_SM,
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: -32, left: vp === 'mobile' ? 80 : 280, width: 90, height: 90, borderRadius: 99,
          background: T.pink, border: STICKER_BORDER_SM,
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          <div style={{
            fontFamily: FONT_DISPLAY,
            fontSize: vp === 'mobile' ? 32 : 48, fontWeight: 700, letterSpacing: -1.5, lineHeight: 0.95,
            textTransform: 'uppercase',
          }}>BRING SOMEONE ALONG.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 14, lineHeight: 1.5, fontWeight: 500 }}>
            Send an invite link or share your code. They see your shared buckets the second they join.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <StickerButton color="surface" size="lg">↗ SHARE INVITE</StickerButton>
            <button className="bk-sticker-btn" style={{
              padding: '14px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              border: '2px solid #fff',
              fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
              cursor: 'pointer',
            }}>BKT-9F2D</button>
          </div>
        </div>
      </Sticker>

      {/* Friends */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <HighlightBlock color="ink" tilt={-1} size="sm">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff', textTransform: 'uppercase' }}>· {friends.length} FRIENDS ·</span>
        </HighlightBlock>
        <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
      </div>

      <div style={{
        display: 'grid', gap: vp === 'mobile' ? 14 : 18,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}>
        {friends.map((p, i) => (
          <FriendCard key={p.id} p={p} tilt={i % 2 === 0 ? -0.8 : 1.2} />
        ))}
      </div>
    </div>
  );
}

function FriendCard({ p, tilt }) {
  return (
    <Sticker tilt={tilt} radius={16} style={{
      padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
    }}>
      <Avatar p={p} size={72} />
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.3, textTransform: 'uppercase' }}>{p.name.split(' ')[0]}</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, marginTop: 2 }}>@{p.handle}</div>
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
        color: T.inkMuted, textTransform: 'uppercase',
      }}>2 SHARED · 14 MEMORIES</div>
      <StickerButton color="bg" size="sm">VIEW PROFILE →</StickerButton>
    </Sticker>
  );
}

// ─── 8. Sticker library (icon picker) ──────────────────────────
function ScreenIcons({ navigate, vp, onPick }) {
  const lib = (typeof window !== 'undefined' ? window.SE_ICONS : null) || [];
  const byCat = lib.reduce((acc, i) => { (acc[i.cat] ||= []).push(i); return acc; }, {});
  const cats = Object.keys(byCat);
  const [activeCat, setActiveCat] = React.useState(cats[0] || 'Food');
  const [picked, setPicked] = React.useState(lib[0]);
  const [search, setSearch] = React.useState('');

  const filtered = search.trim()
    ? lib.filter(i =>
        i.label.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase()) ||
        i.cat.toLowerCase().includes(search.toLowerCase()))
    : byCat[activeCat] || [];

  const cols = vp === 'mobile' ? 3 : vp === 'tablet' ? 5 : 7;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <StickerButton onClick={() => navigate('add')}>CANCEL</StickerButton>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>STICKERS</div>
        <StickerButton color="ink" onClick={() => { onPick && onPick(picked); navigate('add'); }}>PICK ↓</StickerButton>
      </div>

      <PageHeading
        lineA="PICK"
        lineB={<>A <HighlightBlock color="pink">STICKER</HighlightBlock>.</>}
        sub={`${lib.length} hand-drawn stickers. Each one frames its color around the icon — pick one that feels right.`}
        vp={vp}
      />

      {/* Search */}
      <Sticker radius={14} border="sm" shadow="sm" style={{
        padding: '10px 14px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <NavIcon name="search" size={18} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH STICKERS..." style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          color: T.ink, textTransform: 'uppercase',
        }} />
      </Sticker>

      {/* Categories */}
      {!search.trim() && (
        <div className="bk-scrollx" style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {cats.map(k => (
            <StickerChip key={k} active={activeCat === k} color="ink" onClick={() => setActiveCat(k)}>
              {k}
            </StickerChip>
          ))}
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid', gap: vp === 'mobile' ? 12 : 16,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        marginBottom: 32,
      }}>
        {filtered.map((icon, i) => {
          const on = picked && picked.id === icon.id;
          return (
            <button key={icon.id} onClick={() => setPicked(icon)} className="bk-sticker-btn" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            }}>
              <StickerEmoji
                id={icon.id} size={vp === 'mobile' ? 84 : 92}
                selected={on}
                tilt={on ? -4 : (i % 3 === 1 ? -1.5 : i % 3 === 2 ? 1.5 : 0)}
              />
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700,
                letterSpacing: 0.6, textTransform: 'uppercase',
                color: on ? T.ink : T.inkMuted,
              }}>{icon.label}</div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: T.inkMuted, fontWeight: 600 }}>
            No stickers match "{search}".
          </div>
        )}
      </div>

      {/* Preview */}
      {picked && (
        <Sticker radius={16} style={{
          padding: 16, display: 'flex', alignItems: 'center', gap: 14,
          position: 'sticky', bottom: vp === 'desktop' ? 24 : 96,
        }}>
          <StickerEmoji id={picked.id} size={64} tilt={-3} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: T.inkMuted, textTransform: 'uppercase' }}>PREVIEW</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>{picked.label}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: T.inkMuted, marginTop: 2 }}>id: {picked.id} · frame: {picked.color}</div>
          </div>
        </Sticker>
      )}
    </div>
  );
}

Object.assign(window, {
  ScreenAdd, Field,
  ScreenMemories, MemoryCard,
  ScreenActivity, ActivityRow,
  ScreenFriends, FriendCard,
  ScreenIcons,
});
