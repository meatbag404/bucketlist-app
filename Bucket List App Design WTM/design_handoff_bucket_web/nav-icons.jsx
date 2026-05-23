// Bucket — Nav bar icons (extracted for Claude Code handoff).
// These are the simple stroke icons used in the bottom navigation bar +
// other in-app affordances (search, hearts, stars, etc). Drop straight into
// React Native via react-native-svg with identical paths.
//
// All icons share:
//   - 24×24 viewBox
//   - 2.4px stroke, #0C0C0C, round caps + joins
//   - no fill (outline-only)
//
// Usage in React (web/canvas preview):
//   <NavIcon name="bucket" size={22} />
//
// Usage in React Native (after porting paths to react-native-svg):
//   <NavIcon name="bucket" size={22} color="#0C0C0C" />

const NAV_ICONS = {
  bucket: {
    label: 'Bucket / Buckets tab',
    paths: [
      { d: 'M5 7 L19 7 L17.5 20 L6.5 20 Z' },
      { d: 'M8 7 C 8 4, 16 4, 16 7' },
      { d: 'M7 11 L17 11', strokeOpacity: 0.35 },
    ],
  },
  clock: {
    label: 'Activity / time-based content',
    elements: [{ kind: 'circle', cx: 12, cy: 12, r: 9 }],
    paths: [{ d: 'M12 7 L12 12 L16 14' }],
  },
  plus: {
    label: 'Add / new (also used as primary CTA)',
    paths: [
      { d: 'M12 5 L12 19', strokeWidth: 3 },
      { d: 'M5 12 L19 12', strokeWidth: 3 },
    ],
  },
  photo: {
    label: 'Memories / photo gallery',
    elements: [
      { kind: 'rect', x: 3, y: 4.5, width: 18, height: 15, rx: 2.5 },
      { kind: 'circle', cx: 9, cy: 10, r: 1.8 },
    ],
    paths: [{ d: 'M3 17 L9 11.5 L13 15 L17 11 L21 14.5' }],
  },
  friends: {
    label: 'Friends / people',
    elements: [
      { kind: 'circle', cx: 9, cy: 8, r: 3 },
      { kind: 'circle', cx: 16.5, cy: 9.5, r: 2.4 },
    ],
    paths: [
      { d: 'M3 20 C 3 15.5, 15 15.5, 15 20' },
      { d: 'M14.5 16.5 C 17 16.5, 21 17, 21 20' },
    ],
  },
  pin: {
    label: 'Location pin',
    elements: [{ kind: 'circle', cx: 12, cy: 10, r: 2.6 }],
    paths: [{ d: 'M12 3 C 8 3, 5 6, 5 10 C 5 14, 12 21, 12 21 C 12 21, 19 14, 19 10 C 19 6, 16 3, 12 3 Z' }],
  },
  heart: {
    label: 'Heart reaction',
    paths: [{ d: 'M12 20 C 4 14, 4 7, 8 7 C 10 7, 12 9, 12 11 C 12 9, 14 7, 16 7 C 20 7, 20 14, 12 20 Z' }],
  },
  star: {
    label: 'Star / favorite',
    paths: [{ d: 'M12 3 L14.6 9.6 L21 10 L16 14.5 L17.6 21 L12 17.4 L6.4 21 L8 14.5 L3 10 L9.4 9.6 Z' }],
  },
  check: {
    label: 'Done / checkmark',
    paths: [{ d: 'M5 12.5 L10 17.5 L19 7', strokeWidth: 3 }],
  },
  chat: {
    label: 'Comments / chat bubble',
    paths: [{ d: 'M4 6 C 4 4, 5 3, 7 3 L 17 3 C 19 3, 20 4, 20 6 L 20 13 C 20 15, 19 16, 17 16 L 10 16 L 6 20 L 6 16 C 5 16, 4 15, 4 13 Z' }],
  },
  search: {
    label: 'Search',
    elements: [{ kind: 'circle', cx: 10.5, cy: 10.5, r: 6 }],
    paths: [{ d: 'M15 15 L20 20', strokeWidth: 3 }],
  },
};

// Component wrapper — drop-in for the canvas/HTML version.
function NavIcon({ name, size = 22, color = '#0C0C0C' }) {
  const def = NAV_ICONS[name];
  if (!def) return null;
  const sw = 2.4;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {(def.elements || []).map((e, i) => {
        const { kind, ...attrs } = e;
        const props = {
          ...attrs, fill: 'none', stroke: color, strokeWidth: attrs.strokeWidth || sw,
          strokeLinecap: 'round', strokeLinejoin: 'round',
        };
        if (kind === 'circle') return <circle key={'e' + i} {...props} />;
        if (kind === 'rect') return <rect key={'e' + i} {...props} />;
        return null;
      })}
      {(def.paths || []).map((p, i) => (
        <path key={'p' + i} d={p.d}
          fill="none" stroke={color}
          strokeWidth={p.strokeWidth || sw}
          strokeLinecap="round" strokeLinejoin="round"
          strokeOpacity={p.strokeOpacity ?? 1}
        />
      ))}
    </svg>
  );
}

// Visual reference sheet — shown on the design canvas so devs (+ designers)
// can see every nav icon in one place with its name + suggested use.
function NavIconReferenceSheet() {
  const T = CC_THEME;
  const ids = Object.keys(NAV_ICONS);
  return (
    <div style={{
      width: '100%', minHeight: '100%', background: T.bg,
      padding: '36px 40px', fontFamily: CC_FONT, color: T.ink, boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 44, fontWeight: 700,
        letterSpacing: -1.8, lineHeight: 0.95, textTransform: 'uppercase',
      }}>NAV</div>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 44, fontWeight: 700,
        letterSpacing: -1.8, lineHeight: 0.95, textTransform: 'uppercase',
      }}>
        ICON <span style={{
          background: T.cyan, padding: '0 12px', display: 'inline-block', transform: 'rotate(-2deg)',
          border: '2.5px solid #0C0C0C', boxShadow: '4px 4px 0 #0C0C0C',
        }}>SET</span>.
      </div>
      <div style={{
        marginTop: 14, fontSize: 13, fontWeight: 500, color: T.inkMuted, lineHeight: 1.45, maxWidth: 540,
      }}>
        {ids.length} stroke icons. 24×24 viewBox, 2.4px stroke, round caps. Used in the bottom tab bar +
        anywhere a small in-context glyph is needed. SVG paths are directly portable to
        <code style={{ fontFamily: '"Geist Mono", monospace', background: T.surface, padding: '1px 6px', borderRadius: 4, border: '1px solid #0C0C0C', marginLeft: 4 }}>react-native-svg</code>.
      </div>

      <div style={{
        marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start',
      }}>
        {ids.map((id, i) => (
          <div key={id} style={{
            padding: 16, background: T.surface,
            border: '2.5px solid #0C0C0C', boxShadow: '4px 4px 0 #0C0C0C',
            borderRadius: 14,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
            transform: `rotate(${i % 3 === 0 ? -0.8 : i % 3 === 1 ? 0.6 : 0}deg)`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: 12,
              background: T[['cyan','pink','lime','yellow'][i % 4]],
              border: '2px solid #0C0C0C',
            }}>
              <NavIcon name={id} size={28} />
            </div>
            <div style={{
              fontFamily: CC_FONT_DISPLAY, fontSize: 14, fontWeight: 700, letterSpacing: -0.3,
              textTransform: 'uppercase',
            }}>{id}</div>
            <div style={{
              fontFamily: '"Geist Mono", monospace', fontSize: 10, color: T.inkMuted,
              letterSpacing: 0.5, lineHeight: 1.45,
            }}>{NAV_ICONS[id].label}</div>
          </div>
        ))}
      </div>

      {/* Code snippet for porting */}
      <div style={{
        marginTop: 36, padding: 22,
        background: T.ink, color: '#FFE7A8',
        border: '2.5px solid #0C0C0C', boxShadow: '4px 4px 0 #0C0C0C',
        borderRadius: 14,
        fontFamily: '"Geist Mono", monospace', fontSize: 11, lineHeight: 1.6,
        whiteSpace: 'pre', overflow: 'auto',
      }}>
{`// React Native — drop-in:
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export function NavIcon({ name, size = 22, color = '#0C0C0C' }) {
  const def = NAV_ICONS[name];
  if (!def) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {(def.elements || []).map((e, i) => {
        const { kind, ...attrs } = e;
        const props = {
          ...attrs, fill: 'none', stroke: color,
          strokeWidth: attrs.strokeWidth || 2.4,
          strokeLinecap: 'round', strokeLinejoin: 'round',
        };
        if (kind === 'circle') return <Circle key={i} {...props} />;
        if (kind === 'rect') return <Rect key={i} {...props} />;
      })}
      {(def.paths || []).map((p, i) => (
        <Path key={i} d={p.d} fill="none" stroke={color}
          strokeWidth={p.strokeWidth || 2.4}
          strokeLinecap="round" strokeLinejoin="round"
          strokeOpacity={p.strokeOpacity ?? 1} />
      ))}
    </Svg>
  );
}`}
      </div>
    </div>
  );
}

Object.assign(window, { NAV_ICONS, NavIcon, NavIconReferenceSheet });
