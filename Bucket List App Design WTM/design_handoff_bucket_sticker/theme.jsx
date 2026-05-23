// Bucket app — design tokens, palette, mock data, primitives
// Mirrors values from bucketlist-app/app/(app)/index.tsx so the prototype
// stays in sync with the real Supabase product.

const BK_PALETTES = {
  cool: {
    name: 'Cool & vivid',
    bg: '#E8EEF8',
    surface: '#FFFFFF',
    surface2: '#F1F5FC',
    ink: '#0C1230',
    inkMuted: '#4F5985',
    inkSubtle: '#8D96B5',
    line: 'rgba(12,18,48,0.08)',
    lineStrong: 'rgba(12,18,48,0.16)',
    accent: '#2E5BFF',
    accentInk: '#0A1F8C',
    // Decorative tints used to splash extra color throughout
    tintA: '#FFE2B5',  // soft amber
    tintB: '#D6EFE3',  // mint
    tintC: '#FCD9E4',  // blush
    tintD: '#DDD5FB',  // lavender
  },
  warm: {
    name: 'Warm cream',
    bg: '#F6F1E8',
    surface: '#FFFFFF',
    surface2: '#FBF7EE',
    ink: '#221E18',
    inkMuted: '#7C746A',
    inkSubtle: '#A89F92',
    line: 'rgba(34,30,24,0.08)',
    lineStrong: 'rgba(34,30,24,0.14)',
    accent: '#BA7517',
    accentInk: '#3A2208',
    tintA: '#FAEEDA',
    tintB: '#E1F5EE',
    tintC: '#FBEAF0',
    tintD: '#EEEDFE',
  },
  dusk: {
    name: 'Dusk',
    bg: '#15131A',
    surface: '#221F29',
    surface2: '#1B1923',
    ink: '#F4F0E7',
    inkMuted: '#9A93A5',
    inkSubtle: '#6D6678',
    line: 'rgba(244,240,231,0.08)',
    lineStrong: 'rgba(244,240,231,0.16)',
    accent: '#FFB259',
    accentInk: '#F5E5C8',
    tintA: '#3B2C1C',
    tintB: '#1B3A2E',
    tintC: '#3D1E2A',
    tintD: '#26224A',
  },
};

const BK_CATS = {
  travel:    { label: 'Travel',    accent: '#BA7517', bg: '#FAEEDA', dark: '#633806', glyph: '✈' },
  food:      { label: 'Food',      accent: '#993C1D', bg: '#FAECE7', dark: '#4A1B0C', glyph: '◓' },
  adventure: { label: 'Adventure', accent: '#534AB7', bg: '#EEEDFE', dark: '#26215C', glyph: '⚡' },
  wellness:  { label: 'Wellness',  accent: '#0F6E56', bg: '#E1F5EE', dark: '#04342C', glyph: '✿' },
  culture:   { label: 'Culture',   accent: '#7A4FB0', bg: '#F1EAF7', dark: '#2E1B47', glyph: '♪' },
};

const BK_FONT_DISPLAY = '"Bricolage Grotesque", "Geist", -apple-system, system-ui, sans-serif';
const BK_FONT_UI = '"Geist", -apple-system, system-ui, sans-serif';
const BK_FONT_MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

// ─── Mock data ──────────────────────────────────────────────────
const BK_PROFILES = {
  me:   { id: 'me',   name: 'Mara Levin',   handle: 'mara',   initials: 'ML', color: '#FAEEDA', ink: '#633806' },
  jay:  { id: 'jay',  name: 'Jay Okafor',   handle: 'jay',    initials: 'JO', color: '#EEEDFE', ink: '#26215C' },
  sera: { id: 'sera', name: 'Sera Patel',   handle: 'sera',   initials: 'SP', color: '#E1F5EE', ink: '#04342C' },
  rio:  { id: 'rio',  name: 'Rio Tanaka',   handle: 'rio',    initials: 'RT', color: '#FAECE7', ink: '#4A1B0C' },
  hen:  { id: 'hen',  name: 'Hen Brooks',   handle: 'hen',    initials: 'HB', color: '#F1EAF7', ink: '#2E1B47' },
};

const BK_BUCKETS = [
  {
    id: 'b1',
    emoji: '🌍',
    name: 'Summer in Lisbon',
    sub: 'June trip with the crew',
    members: ['me', 'jay', 'sera', 'rio'],
    pct: 35,
    done: 5,
    total: 14,
    hero: 'lisbon',
    created: 'May 2',
  },
  {
    id: 'b2',
    emoji: '🪣',
    name: 'Life, lately',
    sub: 'Just for me',
    members: ['me'],
    pct: 62,
    done: 18,
    total: 29,
    hero: 'solo',
    created: 'Jan 1',
  },
  {
    id: 'b3',
    emoji: '🎂',
    name: 'Hen\'s 30th',
    sub: 'Surprise weekend',
    members: ['me', 'jay', 'hen'],
    pct: 0,
    done: 0,
    total: 7,
    hero: 'birthday',
    created: 'May 14',
  },
];

const BK_ITEMS = [
  { id: 'i1', bucket: 'b1', title: 'Sunset at Miradouro da Senhora do Monte', cat: 'travel',    emoji: '🌇', date: 'Jun 14',  loc: 'Graça, Lisbon',     starred: true,  hearts: 3, done: false, tags: ['jay','sera'], comments: 2, photos: 0, note: '' },
  { id: 'i2', bucket: 'b1', title: 'Pastéis de Belém — eat 6, no judgement', cat: 'food',      emoji: '🥮', date: 'Jun 12',  loc: 'Belém',             starred: false, hearts: 4, done: true,  tags: ['rio','jay'],  comments: 5, photos: 3, note: 'Rio cried (happy). The custard was warm.' },
  { id: 'i3', bucket: 'b1', title: 'Surf lesson in Costa da Caparica',         cat: 'adventure', emoji: '🏄', date: 'Jun 15',  loc: 'Caparica',          starred: true,  hearts: 2, done: false, tags: ['sera'],       comments: 1, photos: 0, note: '' },
  { id: 'i4', bucket: 'b1', title: 'Fado night somewhere small',               cat: 'culture',   emoji: '🎶', date: 'Jun 13',  loc: 'Alfama',            starred: false, hearts: 1, done: false, tags: [],             comments: 0, photos: 0, note: '' },
  { id: 'i5', bucket: 'b1', title: 'Morning swim, every day we\'re there',     cat: 'wellness',  emoji: '🏊', date: '7am',     loc: '',                  starred: false, hearts: 0, done: false, tags: ['me'],         comments: 0, photos: 0, note: '' },
  { id: 'i6', bucket: 'b1', title: 'Tile-hunt walk through Alfama',            cat: 'culture',   emoji: '🟦', date: 'Jun 13',  loc: 'Alfama',            starred: false, hearts: 2, done: true,  tags: ['jay'],        comments: 1, photos: 2, note: 'Counted 47 different patterns before lunch.' },
  { id: 'i7', bucket: 'b1', title: 'Sleep in. Like really sleep in.',          cat: 'wellness',  emoji: '😴', date: 'Jun 16',  loc: '',                  starred: false, hearts: 1, done: false, tags: [],             comments: 0, photos: 0, note: '' },
  { id: 'i8', bucket: 'b1', title: 'Find the best ginja in the city',          cat: 'food',      emoji: '🍒', date: '',         loc: '',                  starred: true,  hearts: 5, done: false, tags: ['jay','sera','rio'], comments: 3, photos: 0, note: '' },
];

const BK_ACTIVITY = [
  { id: 'a1', who: 'rio',  action: 'added a photo to',          target: 'Pastéis de Belém', when: '12m ago', emoji: '📷' },
  { id: 'a2', who: 'jay',  action: 'commented on',              target: 'Find the best ginja in the city', when: '38m ago', emoji: '💬', body: '"there\'s a tiny place near Sé I\'ve been saving"' },
  { id: 'a3', who: 'sera', action: 'marked done',               target: 'Tile-hunt walk through Alfama', when: '2h ago',  emoji: '✓' },
  { id: 'a4', who: 'me',   action: 'added',                     target: 'Morning swim, every day we\'re there', when: '5h ago',  emoji: '＋' },
  { id: 'a5', who: 'jay',  action: 'hearted',                   target: 'Sunset at Miradouro', when: '1d ago',  emoji: '♥' },
  { id: 'a6', who: 'rio',  action: 'joined',                    target: 'Summer in Lisbon', when: '3d ago',  emoji: '👋' },
];

// ─── Tiny utility primitives used by all screens ────────────────
function BKAvatar({ p, size = 28, ring }) {
  const sz = { width: size, height: size, borderRadius: size, fontSize: size * 0.36 };
  return (
    <div style={{
      ...sz, background: p.color, color: p.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: BK_FONT_UI, fontWeight: 600, letterSpacing: 0.2,
      boxShadow: ring ? `0 0 0 2px ${ring}` : 'none',
      flex: '0 0 auto',
    }}>{p.initials}</div>
  );
}

function BKAvatarStack({ ids, size = 24, max = 4, ring = '#fff' }) {
  const shown = ids.slice(0, max);
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((id, i) => (
        <div key={id} style={{ marginLeft: i === 0 ? 0 : -size * 0.35 }}>
          <BKAvatar p={BK_PROFILES[id]} size={size} ring={ring} />
        </div>
      ))}
      {ids.length > max && (
        <div style={{
          marginLeft: -size * 0.35,
          width: size, height: size, borderRadius: size,
          background: '#EFE9DF', color: '#7C746A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: BK_FONT_UI, fontWeight: 600, fontSize: size * 0.32,
          boxShadow: `0 0 0 2px ${ring}`,
        }}>+{ids.length - max}</div>
      )}
    </div>
  );
}

// Striped SVG placeholder representing a user-supplied photo.
// `label` is a mono-style hint about what should drop in here.
function BKPhotoSlot({ w = 200, h = 140, hue = 'travel', label = 'photo', radius = 14, opacity = 1 }) {
  const cat = BK_CATS[hue] || BK_CATS.travel;
  const id = `bk-ph-${hue}-${w}-${h}-${Math.round(Math.random() * 99999)}`;
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, overflow: 'hidden',
      position: 'relative', flex: '0 0 auto', opacity,
    }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <defs>
          <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill={cat.bg} />
            <rect width="4" height="10" fill={cat.accent} opacity="0.18" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#${id})`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: BK_FONT_MONO, fontSize: Math.min(11, w / 18),
        color: cat.dark, opacity: 0.6, letterSpacing: 0.4, textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// Soft shadow + warm card surface
function BKCard({ children, style = {}, onClick, theme }) {
  const t = theme || BK_PALETTES.warm;
  return (
    <div onClick={onClick} style={{
      background: t.surface, borderRadius: 18,
      boxShadow: '0 1px 0 rgba(34,30,24,0.04), 0 8px 24px rgba(34,30,24,0.06)',
      ...style,
    }}>{children}</div>
  );
}

// Pill / chip
function BKChip({ children, active, accent, bg, dark, theme, style = {} }) {
  const t = theme || BK_PALETTES.warm;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 10px', borderRadius: 999,
      fontFamily: BK_FONT_UI, fontSize: 12, fontWeight: 500,
      letterSpacing: -0.1,
      background: active ? (bg || '#F4ECDD') : 'transparent',
      color: active ? (dark || t.ink) : t.inkMuted,
      border: `1px solid ${active ? (accent || t.lineStrong) : t.line}`,
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  BK_PALETTES, BK_CATS, BK_FONT_DISPLAY, BK_FONT_UI, BK_FONT_MONO,
  BK_PROFILES, BK_BUCKETS, BK_ITEMS, BK_ACTIVITY,
  BKAvatar, BKAvatarStack, BKPhotoSlot, BKCard, BKChip,
});
