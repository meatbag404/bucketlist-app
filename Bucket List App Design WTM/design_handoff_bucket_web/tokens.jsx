// Bucket List — design tokens, mock data, sticker primitives, responsive shell.

// ─── Tokens ──────────────────────────────────────────────────────
const T = {
  bg:       '#FFF6E5',
  surface:  '#FFFFFF',
  ink:      '#0C0C0C',
  inkMuted: '#3A3A3A',
  inkSubtle:'#7A7A7A',
  cyan:     '#7DDCFF',
  pink:     '#FF7AB6',
  lime:     '#C7F356',
  yellow:   '#FFD43B',
  blue:     '#5C7BFF',
  red:      '#FF6B5A',
};
const FONT_DISPLAY = '"Space Grotesk", "Geist", -apple-system, system-ui, sans-serif';
const FONT_UI = '"Geist", "Space Grotesk", -apple-system, system-ui, sans-serif';
const FONT_MONO = '"Geist Mono", ui-monospace, monospace';

const STICKER_BORDER = '2.5px solid #0C0C0C';
const STICKER_BORDER_SM = '2px solid #0C0C0C';
const STICKER_SHADOW = '4px 4px 0 #0C0C0C';
const STICKER_SHADOW_SM = '3px 3px 0 #0C0C0C';
const STICKER_SHADOW_LG = '6px 6px 0 #0C0C0C';

// Inject a stylesheet once for app-level resets and global responsive rules.
if (typeof document !== 'undefined' && !document.getElementById('bk-styles')) {
  const s = document.createElement('style');
  s.id = 'bk-styles';
  s.textContent = `
    html, body { margin: 0; padding: 0; background: ${T.bg}; color: ${T.ink}; font-family: ${FONT_UI}; -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
    button { font-family: inherit; }
    .bk-scrollx { overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
    .bk-scrollx::-webkit-scrollbar { display: none; }
    a { color: inherit; }
    /* Sticker press feedback */
    .bk-sticker-btn { transition: transform .08s ease-out, box-shadow .08s ease-out; cursor: pointer; }
    .bk-sticker-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #0C0C0C !important; }
    /* Logo link — single clickable area, no hover effect (revisit when brand is finalised) */
    .bk-logo-link { background: transparent; border: none; padding: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  `;
  document.head.appendChild(s);
}

// ─── Responsive hook ─────────────────────────────────────────────
// Returns one of 'mobile' | 'tablet' | 'desktop' based on viewport width.
// Breakpoints: mobile <720, tablet 720-1023, desktop ≥1024.
function useViewport() {
  const get = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 720) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  };
  const [vp, setVp] = React.useState(get);
  React.useEffect(() => {
    const onResize = () => setVp(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return vp;
}

// ─── Mock data ───────────────────────────────────────────────────
const BK_CATS = {
  travel:    { label: 'Travel',    color: 'yellow' },
  food:      { label: 'Food',      color: 'pink' },
  adventure: { label: 'Adventure', color: 'blue' },
  wellness:  { label: 'Wellness',  color: 'lime' },
  culture:   { label: 'Culture',   color: 'cyan' },
};

const BK_PROFILES = {
  me:   { id: 'me',   name: 'Mara Levin', handle: 'mara',  initials: 'ML', color: 'yellow' },
  jay:  { id: 'jay',  name: 'Jay Okafor', handle: 'jay',   initials: 'JO', color: 'blue' },
  sera: { id: 'sera', name: 'Sera Patel', handle: 'sera',  initials: 'SP', color: 'lime' },
  rio:  { id: 'rio',  name: 'Rio Tanaka', handle: 'rio',   initials: 'RT', color: 'pink' },
  hen:  { id: 'hen',  name: 'Hen Brooks', handle: 'hen',   initials: 'HB', color: 'cyan' },
};

const BK_BUCKETS = [
  { id: 'b1', emoji: 'globe',  name: 'Summer in Lisbon', sub: 'June trip with the crew',
    members: ['me','jay','sera','rio'], pct: 35, done: 5, total: 14, color: 'cyan', countdown: 24 },
  { id: 'b2', emoji: 'leaf',   name: 'Life, lately',     sub: 'Just for me',
    members: ['me'], pct: 62, done: 18, total: 29, color: 'lime' },
  { id: 'b3', emoji: 'cake',   name: "Hen's 30th",       sub: 'Surprise weekend',
    members: ['me','jay','hen'], pct: 0, done: 0, total: 7, color: 'pink' },
  { id: 'b4', emoji: 'coffee', name: 'Things to cook',   sub: 'Ongoing kitchen project',
    members: ['me','hen'], pct: 50, done: 11, total: 22, color: 'yellow' },
];

const BK_ITEMS = [
  { id: 'i1', bucket: 'b1', title: 'Sunset at Miradouro da Senhora do Monte', cat: 'travel',    icon: 'mountain', date: 'Jun 14', loc: 'Graça',     starred: true,  hearts: 3, done: false, tags: ['jay','sera'], comments: 2, photos: 0, note: '' },
  { id: 'i2', bucket: 'b1', title: 'Pastéis de Belém — eat 6, no judgement',   cat: 'food',      icon: 'pastry',   date: 'Jun 12', loc: 'Belém',     starred: false, hearts: 4, done: true,  tags: ['rio','jay'],  comments: 5, photos: 3, note: 'Rio cried (happy). The custard was warm.' },
  { id: 'i3', bucket: 'b1', title: 'Surf lesson in Costa da Caparica',          cat: 'adventure', icon: 'wave',     date: 'Jun 15', loc: 'Caparica',  starred: true,  hearts: 2, done: false, tags: ['sera'],       comments: 1, photos: 0, note: '' },
  { id: 'i4', bucket: 'b1', title: 'Fado night somewhere small',                cat: 'culture',   icon: 'music',    date: 'Jun 13', loc: 'Alfama',    starred: false, hearts: 1, done: false, tags: [],             comments: 0, photos: 0, note: '' },
  { id: 'i5', bucket: 'b1', title: "Morning swim, every day we're there",       cat: 'wellness',  icon: 'drop',     date: '7am',    loc: '',          starred: false, hearts: 0, done: false, tags: ['me'],         comments: 0, photos: 0, note: '' },
  { id: 'i6', bucket: 'b1', title: 'Tile-hunt walk through Alfama',             cat: 'culture',   icon: 'camera',   date: 'Jun 13', loc: 'Alfama',    starred: false, hearts: 2, done: true,  tags: ['jay'],        comments: 1, photos: 2, note: 'Counted 47 different patterns before lunch.' },
  { id: 'i7', bucket: 'b1', title: 'Sleep in. Like really sleep in.',           cat: 'wellness',  icon: 'moon',     date: 'Jun 16', loc: '',          starred: false, hearts: 1, done: false, tags: [],             comments: 0, photos: 0, note: '' },
  { id: 'i8', bucket: 'b1', title: 'Find the best ginja in the city',           cat: 'food',      icon: 'wine',     date: '',       loc: '',          starred: true,  hearts: 5, done: false, tags: ['jay','sera','rio'], comments: 3, photos: 0, note: '' },
];

const BK_ACTIVITY = [
  { id: 'a1', who: 'rio',  action: 'added a photo to', target: 'Pastéis de Belém',  when: '12m ago', glyph: 'camera' },
  { id: 'a2', who: 'jay',  action: 'commented on',     target: 'Find the best ginja in the city', when: '38m ago', glyph: 'chat', body: '"there\'s a tiny place near Sé I\'ve been saving"' },
  { id: 'a3', who: 'sera', action: 'marked done',      target: 'Tile-hunt walk through Alfama', when: '2h ago',  glyph: 'check' },
  { id: 'a4', who: 'me',   action: 'added',            target: "Morning swim, every day we're there", when: '5h ago',  glyph: 'plus' },
  { id: 'a5', who: 'jay',  action: 'hearted',          target: 'Sunset at Miradouro', when: '1d ago',  glyph: 'heart' },
  { id: 'a6', who: 'rio',  action: 'joined',           target: 'Summer in Lisbon', when: '3d ago',  glyph: 'friends' },
  { id: 'a7', who: 'sera', action: 'added',            target: 'Take a pastel-painting class', when: '4d ago', glyph: 'plus' },
  { id: 'a8', who: 'jay',  action: 'hearted',          target: 'Pastéis de Belém', when: '5d ago', glyph: 'heart' },
];

// ─── Sticker primitives ─────────────────────────────────────────
function Sticker({ children, color, tilt = 0, radius = 16, shadow = 'md', border = 'md', as = 'div', style, onClick, ...rest }) {
  const Tag = as;
  const shadowMap = { sm: STICKER_SHADOW_SM, md: STICKER_SHADOW, lg: STICKER_SHADOW_LG };
  const borderMap = { sm: STICKER_BORDER_SM, md: STICKER_BORDER };
  return (
    <Tag onClick={onClick} className={onClick ? 'bk-sticker-btn' : undefined} style={{
      background: T[color] || color || T.surface,
      border: borderMap[border],
      boxShadow: shadowMap[shadow],
      borderRadius: radius,
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      ...style,
    }} {...rest}>
      {children}
    </Tag>
  );
}

function StickerButton({ children, onClick, color = 'surface', textColor, size = 'md', disabled, style }) {
  const isInk = color === 'ink';
  const fg = textColor || (isInk ? '#fff' : T.ink);
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '6px 12px' : '10px 18px';
  const fontSize = size === 'lg' ? 14 : size === 'sm' ? 11 : 12;
  return (
    <button onClick={onClick} disabled={disabled} className="bk-sticker-btn" style={{
      padding: pad,
      background: T[color] || color,
      color: fg,
      border: STICKER_BORDER_SM,
      boxShadow: disabled ? 'none' : STICKER_SHADOW_SM,
      borderRadius: 12,
      fontFamily: FONT_DISPLAY,
      fontSize, fontWeight: 700, letterSpacing: 0.5,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style,
    }}>{children}</button>
  );
}

function StickerChip({ children, active, color, onClick, style }) {
  const bg = active ? (T[color] || T.ink) : T.surface;
  const ink = active && color === 'ink' ? T.bg : T.ink;
  return (
    <button onClick={onClick} className="bk-sticker-btn" style={{
      padding: '6px 12px',
      background: bg, color: ink,
      border: STICKER_BORDER_SM,
      boxShadow: active ? STICKER_SHADOW_SM : '2px 2px 0 rgba(12,12,12,0.15)',
      borderRadius: 99,
      fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap', flex: '0 0 auto',
      ...style,
    }}>{children}</button>
  );
}

function HighlightBlock({ children, color = 'lime', tilt = -2, size = 'lg' }) {
  const pad = size === 'lg' ? '0 12px' : '0 8px';
  return (
    <span style={{
      background: T[color], padding: pad,
      display: 'inline-block', transform: `rotate(${tilt}deg)`,
      border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
    }}>{children}</span>
  );
}

// Avatar — initials in a colored sticker circle
function Avatar({ p, size = 32, ring }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 99,
      background: T[p.color],
      border: STICKER_BORDER_SM,
      boxShadow: ring ? 'none' : '2px 2px 0 #0C0C0C',
      outline: ring ? `2px solid ${ring}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.ink,
      fontFamily: FONT_DISPLAY, fontSize: size * 0.36, fontWeight: 700, letterSpacing: -0.3,
      flex: '0 0 auto',
    }}>{p.initials}</div>
  );
}

function AvatarStack({ ids, size = 28, max = 4, ring }) {
  const shown = ids.slice(0, max);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((id, i) => (
        <div key={id} style={{ marginLeft: i === 0 ? 0 : -size * 0.4, zIndex: shown.length - i }}>
          <Avatar p={BK_PROFILES[id]} size={size} ring={ring || T.bg} />
        </div>
      ))}
      {ids.length > max && (
        <div style={{
          marginLeft: -size * 0.4, zIndex: 0,
          width: size, height: size, borderRadius: 99,
          background: T.surface, border: STICKER_BORDER_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontSize: size * 0.32, fontWeight: 700, color: T.ink,
        }}>+{ids.length - max}</div>
      )}
    </div>
  );
}

// Striped SVG placeholder for a user photo.
function PhotoSlot({ w = 200, h = 140, color = 'cyan', label = 'photo', radius = 14, style }) {
  const id = `bk-ph-${Math.round(Math.random() * 999999)}`;
  const fill = T[color];
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, overflow: 'hidden',
      position: 'relative', flex: '0 0 auto', ...style,
    }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill={fill} opacity="0.85" />
            <rect width="4" height="10" fill="#0C0C0C" opacity="0.08" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_MONO, fontSize: Math.min(11, Math.max(9, Math.floor(w / 18))),
          color: T.ink, opacity: 0.55, letterSpacing: 0.4, textTransform: 'uppercase', textAlign: 'center',
          padding: 12,
        }}>{label}</div>
      )}
    </div>
  );
}

// Tile that renders a sticker emoji icon (from sticker-emoji-icons.jsx)
// or falls back to a colored block if the id isn't found.
function StickerEmoji({ id, size = 64, frameColor, tilt = 0, selected = false }) {
  const lib = (typeof window !== 'undefined' ? window.SE_ICONS : null) || [];
  const icon = lib.find(i => i.id === id);
  const color = frameColor || (icon && icon.color) || 'cyan';
  // Build a CC_THEME-compatible palette object the draw functions expect.
  const palette = { ...T };
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.min(14, size * 0.22),
      background: T[color],
      border: selected ? '3px solid #0C0C0C' : STICKER_BORDER,
      boxShadow: selected ? '5px 5px 0 #0C0C0C' : STICKER_SHADOW,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${tilt}deg)`,
      transition: 'transform .15s',
      flex: '0 0 auto',
    }}>
      {icon ? (
        <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48">
          {icon.draw(palette)}
        </svg>
      ) : (
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: size * 0.4, fontWeight: 700, color: T.ink,
        }}>?</div>
      )}
    </div>
  );
}

// ─── Routing — single-state route, hash-driven for shareable URLs ──
function useRoute(initial = 'buckets') {
  const parseHash = () => {
    const h = (typeof window !== 'undefined' && window.location.hash) || '';
    const m = h.match(/^#\/([\w-]+)(?:\/([\w-]+))?/);
    if (!m) return { screen: initial, id: null };
    return { screen: m[1], id: m[2] || null };
  };
  const [route, setRoute] = React.useState(parseHash);
  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = React.useCallback((screen, id) => {
    const hash = id ? `#/${screen}/${id}` : `#/${screen}`;
    if (window.location.hash !== hash) window.location.hash = hash;
    else setRoute({ screen, id: id || null });
  }, []);
  return [route, navigate];
}

Object.assign(window, {
  T, FONT_DISPLAY, FONT_UI, FONT_MONO,
  STICKER_BORDER, STICKER_BORDER_SM, STICKER_SHADOW, STICKER_SHADOW_SM, STICKER_SHADOW_LG,
  useViewport, useRoute,
  BK_CATS, BK_PROFILES, BK_BUCKETS, BK_ITEMS, BK_ACTIVITY,
  Sticker, StickerButton, StickerChip, HighlightBlock,
  Avatar, AvatarStack, PhotoSlot, StickerEmoji,
});
