// Bucket app — screens part 2: Item detail, Add item, Memories, Activity

// ─── 3. Item detail (full screen) ───────────────────────────────
function ScreenItem({ theme, itemId, onBack, onDone }) {
  const item = BK_ITEMS.find(i => i.id === itemId) || BK_ITEMS[1];
  const c = BK_CATS[item.cat];
  const [comment, setComment] = React.useState('');
  const comments = [
    { id: 'c1', who: 'rio', text: 'I cried. The custard was WARM.', when: '12m' },
    { id: 'c2', who: 'jay', text: 'Bringing one home. Or four.', when: '38m' },
    { id: 'c3', who: 'me',  text: 'Officially ruined for all other pastries.', when: '1h' },
  ];

  return (
    <div style={{ paddingBottom: 110, fontFamily: BK_FONT_UI, color: theme.ink, background: theme.bg, minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <BKPhotoSlot w={PH_W} h={320} hue={item.cat} label="memory · pastéis de belém" radius={0} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0) 45%, rgba(0,0,0,0.3))',
        }} />
        <div style={{ position: 'absolute', top: 58, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.85)',
            border: 'none', cursor: 'pointer', fontSize: 16,
          }}>‹</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.85)',
              border: 'none', cursor: 'pointer', fontSize: 14,
            }}>↗</button>
            <button style={{
              width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.85)',
              border: 'none', cursor: 'pointer', fontSize: 14,
            }}>⋯</button>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 18 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)',
            fontSize: 11, fontWeight: 600, color: c.dark, letterSpacing: 0.4, textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: c.accent }} /> {c.label}
          </div>
          <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 6 }}>{item.emoji}</div>
          <div style={{
            fontFamily: BK_FONT_DISPLAY, fontSize: 30, lineHeight: 1.1, color: '#fff', fontWeight: 700, letterSpacing: -1,
          }}>{item.title}</div>
        </div>
      </div>

      {/* Meta strip */}
      <div style={{
        margin: '-26px 16px 0', position: 'relative', zIndex: 2,
        background: theme.surface, borderRadius: 18, padding: '14px 16px',
        boxShadow: '0 1px 0 rgba(34,30,24,0.04), 0 8px 22px rgba(34,30,24,0.08)',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
      }}>
        <MetaCell label="Date" value="Jun 12" />
        <MetaCell label="Location" value="Belém" />
        <MetaCell label="With" value={
          <BKAvatarStack ids={item.tags} size={20} ring={theme.surface} max={3} />
        } />
      </div>

      {/* Memory note */}
      {item.note && (
        <div style={{ padding: '24px 22px 10px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted, marginBottom: 8 }}>
            Memory note
          </div>
          <div style={{
            fontFamily: BK_FONT_DISPLAY, fontSize: 24, lineHeight: 1.25, fontWeight: 600, letterSpacing: -0.4,
            color: theme.ink,
          }}>"{item.note}"</div>
          <div style={{ fontSize: 11, color: theme.inkSubtle, marginTop: 6 }}>— added by Rio · Jun 12</div>
        </div>
      )}

      {/* Photo strip */}
      <div style={{ padding: '14px 0 8px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: '0 22px 10px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted }}>
            Photos · {item.photos}
          </div>
          <div style={{ fontSize: 12, color: theme.accent, fontWeight: 500 }}>＋ Add photo</div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto' }}>
          <BKPhotoSlot w={130} h={170} hue={item.cat} label="warm custard" radius={14} />
          <BKPhotoSlot w={130} h={170} hue={item.cat} label="line out the door" radius={14} />
          <BKPhotoSlot w={130} h={170} hue={item.cat} label="rio mid-bite" radius={14} />
          <div style={{
            width: 130, height: 170, borderRadius: 14, flex: '0 0 auto',
            border: `1.5px dashed ${theme.lineStrong}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.inkSubtle, fontSize: 24,
          }}>＋</div>
        </div>
      </div>

      {/* Reactions row */}
      <div style={{
        margin: '20px 16px 0', padding: '12px 16px',
        background: theme.surface, borderRadius: 16,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        <ReactBtn icon="♥" label={item.hearts} active />
        <ReactBtn icon="★" label="Star" />
        <ReactBtn icon="💬" label={comments.length} />
        <ReactBtn icon="↗" label="Share" />
      </div>

      {/* Comments */}
      <div style={{ padding: '24px 22px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted, marginBottom: 12 }}>
          Comments
        </div>
        {comments.map(cm => {
          const p = BK_PROFILES[cm.who];
          return (
            <div key={cm.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <BKAvatar p={p} size={28} />
              <div style={{ flex: 1 }}>
                <div style={{
                  background: theme.surface, padding: '8px 12px',
                  borderRadius: 14, borderTopLeftRadius: 4,
                  boxShadow: '0 1px 0 rgba(34,30,24,0.03)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: theme.ink, marginBottom: 2 }}>{p.name.split(' ')[0]}</div>
                  <div style={{ fontSize: 13, color: theme.ink, lineHeight: 1.4 }}>{cm.text}</div>
                </div>
                <div style={{ fontSize: 10, color: theme.inkSubtle, marginTop: 3, paddingLeft: 4 }}>{cm.when}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Done CTA */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 92, zIndex: 5, display: 'flex', gap: 8 }}>
        <button onClick={onDone} style={{
          flex: 1, padding: '14px 16px',
          borderRadius: 16, border: 'none', cursor: 'pointer',
          background: item.done ? theme.surface : '#0F6E56', color: item.done ? theme.ink : '#fff',
          fontFamily: BK_FONT_UI, fontSize: 15, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(15,110,86,0.25)',
          border: item.done ? `1px solid ${theme.line}` : 'none',
        }}>{item.done ? '↩ Restore' : '✓ Mark done'}</button>
        <button style={{
          width: 52, height: 52, borderRadius: 16, border: `1px solid ${theme.line}`,
          background: theme.surface, fontSize: 18, cursor: 'pointer',
        }}>✏️</button>
      </div>
    </div>
  );
}

function MetaCell({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8C857C' }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: '#221E18', display: 'flex', alignItems: 'center', minHeight: 22 }}>
        {value}
      </div>
    </div>
  );
}

function ReactBtn({ icon, label, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 99,
      fontSize: 13, color: active ? '#993C1D' : '#221E18',
      background: active ? '#FAECE7' : 'transparent',
      fontWeight: 600,
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontSize: 12 }}>{label}</span>
    </div>
  );
}

// ─── 4. Add item ────────────────────────────────────────────────
function ScreenAdd({ theme, onCancel, onAdd }) {
  const [title, setTitle] = React.useState('');
  const [cat, setCat] = React.useState('adventure');
  const [date, setDate] = React.useState('');
  const [loc, setLoc] = React.useState('');
  const [tagged, setTagged] = React.useState(['jay']);
  const [emoji, setEmoji] = React.useState('⚡');
  const emojis = ['⚡','✈️','🍴','🌿','🌇','🏊','🎶','📷','🎂','🍒','😴','⭐'];
  const c = BK_CATS[cat];

  function toggleTag(id) {
    setTagged(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  }

  return (
    <div style={{ padding: '64px 0 130px', fontFamily: BK_FONT_UI, color: theme.ink, background: theme.bg, minHeight: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px 18px',
      }}>
        <button onClick={onCancel} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: BK_FONT_UI, fontSize: 14, color: theme.inkMuted,
        }}>Cancel</button>
        <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.6 }}>
          New item
        </div>
        <button onClick={onAdd} style={{
          padding: '6px 14px', borderRadius: 99, border: 'none',
          background: title ? theme.ink : theme.line, color: title ? theme.bg : theme.inkSubtle,
          fontFamily: BK_FONT_UI, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Add</button>
      </div>

      {/* Bucket label */}
      <div style={{
        margin: '0 20px 14px', padding: '8px 12px',
        background: theme.surface, borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 1px 0 rgba(34,30,24,0.03)',
      }}>
        <span style={{ fontSize: 14 }}>🌍</span>
        <span style={{ fontSize: 12, color: theme.inkMuted }}>Adding to</span>
        <span style={{ fontSize: 12, color: theme.ink, fontWeight: 600 }}>Summer in Lisbon</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: theme.accent }}>Change ›</span>
      </div>

      {/* Title row with emoji */}
      <div style={{
        margin: '0 20px 14px', padding: 14,
        background: theme.surface, borderRadius: 16,
        boxShadow: '0 1px 0 rgba(34,30,24,0.04), 0 4px 14px rgba(34,30,24,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: c.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flex: '0 0 auto',
          }}>{emoji}</div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What do you want to tick off?"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: BK_FONT_UI, fontSize: 17, color: theme.ink,
              fontWeight: 500, padding: '12px 0', letterSpacing: -0.2,
            }}
          />
        </div>
        {/* Emoji strip */}
        <div style={{ display: 'flex', gap: 4, marginTop: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {emojis.map(e => (
            <div key={e} onClick={() => setEmoji(e)} style={{
              width: 36, height: 36, borderRadius: 10, flex: '0 0 auto',
              background: emoji === e ? c.bg : 'transparent',
              border: emoji === e ? `1px solid ${c.accent}` : `1px solid ${theme.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, cursor: 'pointer',
            }}>{e}</div>
          ))}
        </div>
      </div>

      {/* Category */}
      <div style={{ margin: '0 20px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted, marginBottom: 8 }}>
          Category
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(BK_CATS).map(([k, v]) => (
            <div key={k} onClick={() => setCat(k)} style={{
              padding: '8px 12px', borderRadius: 99,
              background: cat === k ? v.bg : theme.surface,
              border: `1px solid ${cat === k ? v.accent : theme.line}`,
              fontSize: 12, fontWeight: 600, color: cat === k ? v.dark : theme.inkMuted,
              cursor: 'pointer',
            }}>{v.glyph} {v.label}</div>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div style={{
        margin: '0 20px 14px', background: theme.surface, borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(34,30,24,0.03)',
      }}>
        <FieldRow icon="📅" placeholder="Target date (e.g. Summer 2025)" value={date} onChange={setDate} theme={theme} />
        <div style={{ height: 1, background: theme.line, marginLeft: 50 }} />
        <FieldRow icon="📍" placeholder="Add location" value={loc} onChange={setLoc} theme={theme} />
        <div style={{ height: 1, background: theme.line, marginLeft: 50 }} />
        <FieldRow icon="📝" placeholder="Why you want this (optional)" value="" onChange={()=>{}} theme={theme} multiline />
      </div>

      {/* Tag people */}
      <div style={{ margin: '0 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted, marginBottom: 8 }}>
          Tag who's in
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['jay','sera','rio'].map(id => {
            const p = BK_PROFILES[id];
            const on = tagged.includes(id);
            return (
              <div key={id} onClick={() => toggleTag(id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px 6px 6px', borderRadius: 99,
                background: on ? c.bg : theme.surface,
                border: `1px solid ${on ? c.accent : theme.line}`,
                cursor: 'pointer',
              }}>
                <BKAvatar p={p} size={22} />
                <div style={{ fontSize: 12, fontWeight: 600, color: on ? c.dark : theme.ink }}>{p.name.split(' ')[0]}</div>
                {on && <div style={{ fontSize: 11, color: c.accent }}>✓</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ icon, placeholder, value, onChange, theme, multiline }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', minHeight: 44 }}>
      <div style={{ fontSize: 16, lineHeight: '24px' }}>{icon}</div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontFamily: BK_FONT_UI, fontSize: 14, color: theme.ink,
          padding: '4px 0', minHeight: multiline ? 22 : 24,
        }}
      />
    </div>
  );
}

// ─── 5. Memories ────────────────────────────────────────────────
function ScreenMemories({ theme, onOpenItem }) {
  const memories = BK_ITEMS.filter(i => i.done);
  // Mix in some other completed items for visual richness
  const extra = [
    { id: 'm1', emoji: '🏔', title: 'Hike Pico do Arieiro at sunrise', cat: 'adventure', when: 'Last summer', tags: ['jay','sera'] },
    { id: 'm2', emoji: '🍝', title: 'Cook fresh pasta with Hen', cat: 'food', when: 'March', tags: ['hen'] },
    { id: 'm3', emoji: '🌊', title: 'First open-water swim', cat: 'wellness', when: 'Apr 12', tags: ['me'] },
    { id: 'm4', emoji: '🎤', title: 'Karaoke night, no songs left behind', cat: 'culture', when: 'Mar 28', tags: ['jay','rio','hen'] },
  ];
  const all = [...memories.map(m => ({ ...m, when: 'Jun 12', tags: m.tags })), ...extra];

  return (
    <div style={{ padding: '0 0 110px', fontFamily: BK_FONT_UI, color: theme.ink }}>
      <div style={{ padding: '8px 22px 14px' }}>
        <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 40, lineHeight: 1.02, whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: -1.6 }}>
          Memories.
        </div>
        <div style={{ fontSize: 13, color: theme.inkMuted, marginTop: 8, lineHeight: 1.45 }}>
          The things you've actually done. {all.length} so far this year.
        </div>
      </div>

      {/* Year scrubber */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflowX: 'auto' }}>
        {['All', '2025', '2024', '2023', 'Lisbon', 'With Jay'].map((k, i) => (
          <BKChip key={k} active={i === 0} accent="#BA7517" bg="#FAEEDA" dark="#633806" theme={theme}>
            {k}
          </BKChip>
        ))}
      </div>

      {/* Pinterest-style masonry */}
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MemoryCard m={all[0]} theme={theme} h={220} onClick={() => onOpenItem(all[0].id)} />
        <MemoryCard m={all[1]} theme={theme} h={160} onClick={() => onOpenItem(all[1].id)} />
        <MemoryCard m={all[2]} theme={theme} h={170} onClick={() => onOpenItem(all[2].id)} />
        <MemoryCard m={all[3]} theme={theme} h={230} onClick={() => onOpenItem(all[3].id)} />
        <MemoryCard m={all[4]} theme={theme} h={190} onClick={() => onOpenItem(all[4].id)} />
        <MemoryCard m={all[5]} theme={theme} h={150} onClick={() => onOpenItem(all[5].id)} />
      </div>
    </div>
  );
}

function MemoryCard({ m, theme, h = 180, onClick }) {
  const c = BK_CATS[m.cat] || BK_CATS.travel;
  return (
    <div onClick={onClick} style={{
      borderRadius: 16, overflow: 'hidden', position: 'relative',
      background: theme.surface, cursor: 'pointer',
      boxShadow: '0 1px 0 rgba(34,30,24,0.04), 0 6px 18px rgba(34,30,24,0.06)',
    }}>
      <div style={{ position: 'relative', height: h }}>
        <BKPhotoSlot w={(PH_W - 24 - 8) / 2} h={h} hue={m.cat} label={m.title.toLowerCase().slice(0, 22)} radius={0} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)',
        }} />
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <div style={{
            padding: '3px 8px', borderRadius: 99,
            background: 'rgba(255,255,255,0.9)',
            fontSize: 9, fontWeight: 600, color: c.dark, letterSpacing: 0.3, textTransform: 'uppercase',
          }}>{c.label}</div>
        </div>
        <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
          <div style={{ fontSize: 18 }}>{m.emoji}</div>
          <div style={{
            fontFamily: BK_FONT_UI, fontSize: 13, fontWeight: 600,
            color: '#fff', lineHeight: 1.2, marginTop: 4, letterSpacing: -0.1,
          }}>{m.title}</div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 6,
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{m.when}</div>
            {m.tags && m.tags.length > 0 && <BKAvatarStack ids={m.tags} size={16} ring="rgba(0,0,0,0.3)" max={3} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Activity feed ───────────────────────────────────────────
function ScreenActivity({ theme }) {
  // Group by day
  const groups = [
    { day: 'Today', items: BK_ACTIVITY.slice(0, 2) },
    { day: 'Yesterday', items: BK_ACTIVITY.slice(2, 5) },
    { day: 'This week', items: BK_ACTIVITY.slice(5) },
  ];
  return (
    <div style={{ padding: '0 0 110px', fontFamily: BK_FONT_UI, color: theme.ink }}>
      <div style={{
        padding: '8px 22px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 40, lineHeight: 1.02, whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: -1.6 }}>
            Activity.
          </div>
          <div style={{ fontSize: 13, color: theme.inkMuted, marginTop: 8 }}>
            What everyone's been up to in your buckets.
          </div>
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 99,
          background: '#FAECE7', color: '#4A1B0C',
          fontSize: 11, fontWeight: 600,
        }}>3 new</div>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflowX: 'auto' }}>
        {['All', 'Summer in Lisbon', 'Life, lately', 'Hen\'s 30th'].map((k, i) => (
          <BKChip key={k} active={i === 0} accent="#BA7517" bg="#FAEEDA" dark="#633806" theme={theme}>
            {k}
          </BKChip>
        ))}
      </div>

      {groups.map(g => (
        <div key={g.day} style={{ marginBottom: 8 }}>
          <div style={{
            padding: '14px 22px 8px',
            fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted,
          }}>{g.day}</div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {g.items.map(a => <ActivityRow key={a.id} a={a} theme={theme} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityRow({ a, theme }) {
  const p = BK_PROFILES[a.who];
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '12px 14px',
      background: theme.surface, borderRadius: 14,
      boxShadow: '0 1px 0 rgba(34,30,24,0.03)',
    }}>
      <div style={{ position: 'relative' }}>
        <BKAvatar p={p} size={34} />
        <div style={{
          position: 'absolute', bottom: -2, right: -4,
          width: 18, height: 18, borderRadius: 99,
          background: theme.surface, boxShadow: '0 0 0 1.5px ' + theme.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10,
        }}>{a.emoji}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: theme.ink, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600 }}>{p.name.split(' ')[0]}</span>
          <span style={{ color: theme.inkMuted }}> {a.action} </span>
          <span style={{ fontWeight: 600 }}>"{a.target}"</span>
        </div>
        {a.body && (
          <div style={{
            marginTop: 6, padding: '6px 10px',
            background: theme.bg, borderRadius: 10, borderTopLeftRadius: 4,
            fontFamily: BK_FONT_UI, fontWeight: 500, letterSpacing: -0.1,
            fontSize: 13, color: theme.ink, fontStyle: 'normal',
          }}>{a.body}</div>
        )}
        <div style={{ fontSize: 11, color: theme.inkSubtle, marginTop: 4 }}>{a.when}</div>
      </div>
    </div>
  );
}

// ─── 7. Friends ─────────────────────────────────────────────────
function ScreenFriends({ theme }) {
  const friends = ['jay', 'sera', 'rio', 'hen'].map(id => BK_PROFILES[id]);
  return (
    <div style={{ padding: '0 0 110px', fontFamily: BK_FONT_UI, color: theme.ink }}>
      <div style={{ padding: '8px 22px 18px' }}>
        <div style={{ fontFamily: BK_FONT_DISPLAY, fontSize: 40, lineHeight: 1.02, whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: -1.6 }}>
          Friends.
        </div>
        <div style={{ fontSize: 13, color: theme.inkMuted, marginTop: 8 }}>
          The people you make memories with.
        </div>
      </div>

      {/* Invite card */}
      <div style={{
        margin: '0 16px 18px', padding: 18, borderRadius: 20,
        background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.tintD || '#DDD5FB'} 100%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: 99,
          background: theme.tintA || '#FFE2B5', opacity: 0.5,
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: -20, left: 110, width: 80, height: 80, borderRadius: 99,
          background: theme.tintC || '#FCD9E4', opacity: 0.6,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: BK_FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: '#fff',
            letterSpacing: -0.6, lineHeight: 1.1,
          }}>
            Bring someone along.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', marginTop: 8, lineHeight: 1.45, maxWidth: 260 }}>
            Send an invite link or share your code. They'll see your shared buckets the moment they join.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={{
              padding: '10px 14px', borderRadius: 12, border: 'none',
              background: '#fff', color: theme.ink,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>↗ Share invite</button>
            <button style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.45)',
              color: '#fff', fontFamily: BK_FONT_MONO, fontSize: 13,
              letterSpacing: 1.5, cursor: 'pointer', fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}>BKT–9F2D</button>
          </div>
        </div>
      </div>

      {/* Friends list */}
      <div style={{ padding: '0 22px 8px', fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkMuted }}>
        {friends.length} friends
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {friends.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12, borderRadius: 14, background: theme.surface,
            boxShadow: '0 1px 0 rgba(34,30,24,0.03)',
          }}>
            <BKAvatar p={p} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.ink }}>{p.name}</div>
              <div style={{ fontSize: 12, color: theme.inkMuted }}>@{p.handle} · 2 shared buckets</div>
            </div>
            <button style={{
              padding: '6px 10px', borderRadius: 99,
              background: 'transparent', border: `1px solid ${theme.line}`,
              fontSize: 11, fontWeight: 600, color: theme.inkMuted, cursor: 'pointer',
            }}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenItem, ScreenAdd, ScreenMemories, ScreenActivity, ScreenFriends,
});
