// Bucket List — stroke icon library.
// 24×24 viewBox, 2.4px stroke, round caps + joins, no fill.
// Source: design_handoff_bucket_web/nav-icons.jsx — ported verbatim.

import React from 'react'

export type NavIconName =
  | 'bucket' | 'clock' | 'plus' | 'photo' | 'friends'
  | 'pin' | 'heart' | 'star' | 'check' | 'chat' | 'search'
  | 'pencil' | 'trash' | 'close'

type PathDef = { d: string; strokeWidth?: number; strokeOpacity?: number }
type ElementDef =
  | { kind: 'circle'; cx: number; cy: number; r: number; strokeWidth?: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number; strokeWidth?: number }

type IconDef = {
  label: string
  paths?: PathDef[]
  elements?: ElementDef[]
}

export const NAV_ICONS: Record<NavIconName, IconDef> = {
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
  pencil: {
    label: 'Edit / pencil',
    paths: [
      { d: 'M4 20 L4 16 L16 4 L20 8 L8 20 Z' },
      { d: 'M13 7 L17 11', strokeOpacity: 0.45 },
    ],
  },
  trash: {
    label: 'Delete / trash',
    paths: [
      { d: 'M4 7 L20 7' },
      { d: 'M9 7 L9 4.5 L15 4.5 L15 7' },
      { d: 'M6 7 L7.5 20 L16.5 20 L18 7' },
      { d: 'M10 11 L10 17', strokeOpacity: 0.5 },
      { d: 'M14 11 L14 17', strokeOpacity: 0.5 },
    ],
  },
  close: {
    label: 'Close / cancel',
    paths: [
      { d: 'M6 6 L18 18', strokeWidth: 3 },
      { d: 'M18 6 L6 18', strokeWidth: 3 },
    ],
  },
}

export function NavIcon({
  name,
  size = 22,
  color = '#0C0C0C',
  fill = 'none',
  style,
}: {
  name: NavIconName
  size?: number
  color?: string
  fill?: string
  style?: React.CSSProperties
}) {
  const def = NAV_ICONS[name]
  if (!def) return null
  const sw = 2.4
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {(def.elements || []).map((e, i) => {
        if (e.kind === 'circle') {
          return (
            <circle
              key={'e' + i}
              cx={e.cx}
              cy={e.cy}
              r={e.r}
              fill={fill}
              stroke={color}
              strokeWidth={e.strokeWidth || sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        }
        if (e.kind === 'rect') {
          return (
            <rect
              key={'e' + i}
              x={e.x}
              y={e.y}
              width={e.width}
              height={e.height}
              rx={e.rx}
              fill={fill}
              stroke={color}
              strokeWidth={e.strokeWidth || sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        }
        return null
      })}
      {(def.paths || []).map((p, i) => (
        <path
          key={'p' + i}
          d={p.d}
          fill="none"
          stroke={color}
          strokeWidth={p.strokeWidth || sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={p.strokeOpacity ?? 1}
        />
      ))}
    </svg>
  )
}
