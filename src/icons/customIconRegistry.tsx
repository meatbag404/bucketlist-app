/**
 * Custom Illustrated Icon Registry
 * 69 hand-drawn icons converted from the design handoff SVG source.
 * Each icon renders as a React Native SVG on a 48×48 viewBox.
 *
 * Usage:
 *   import { CUSTOM_ICONS, CustomIconView } from '../icons/customIconRegistry'
 *   <CustomIconView id="plane" size={36} />
 *
 * The id is stored in the `emoji` DB field when a user picks a custom icon.
 * At render-time: if the value is a key in CUSTOM_ICONS, render SVG;
 * otherwise render as a plain emoji <Text>.
 */

import React from 'react'
import Svg, { Path, Circle, Rect, Line, Ellipse } from 'react-native-svg'

// ─── Color constants ──────────────────────────────────────────────────────────
const K = '#0C0C0C'          // ink / stroke
const RED    = '#FF6B5A'
const CYAN   = '#7DDCFF'
const LIME   = '#C7F356'
const YELLOW = '#FFD43B'
const BLUE   = '#5C7BFF'
const PINK   = '#FF7AB6'

// Illustration pigments (from SE_PIGMENTS in the design source)
const pastry   = '#F4D08F'
const tan      = '#D4914D'
const choc     = '#5C3A1E'
const creamPink= '#FFD8DE'
const sky      = '#7DDCFF'
const ocean    = '#3A78FF'
const grass    = '#7BC257'
const deepGreen= '#3D8C3F'
const steam    = '#E8E8E8'
const silver   = '#B8C5D6'
const gold     = '#FFC83D'
const goldDark = '#C99526'
const cherry   = '#E33B3B'
const cream    = '#FFF1D6'
const bun      = '#F4B870'
const crustDark= '#A86824'

// ─── Prop helpers ─────────────────────────────────────────────────────────────
// Stroke + fill (mirrors _se in the design source)
const S = (fill: string, sw = 1.5, op = 1) => ({
  fill, stroke: K, strokeWidth: sw, opacity: op,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
})
// Fill only, no stroke (mirrors _noStroke)
const F = (fill: string, op = 1) => ({ fill, opacity: op })
// Stroke only (fill=none), with custom stroke color
const ST = (stroke: string, sw = 1.5) => ({
  fill: 'none', stroke, strokeWidth: sw,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
})

// ─── Type ─────────────────────────────────────────────────────────────────────
export interface CustomIconEntry {
  id: string
  cat: string
  color: 'cyan' | 'pink' | 'lime' | 'yellow' | 'blue' | 'red'
  label: string
  render: (size: number) => React.ReactElement
}

// ─── Registry ─────────────────────────────────────────────────────────────────
export const CUSTOM_ICONS: Record<string, CustomIconEntry> = {

  // ── Travel ──────────────────────────────────────────────────────────────────

  globe: {
    id: 'globe', cat: 'Custom', color: 'cyan', label: 'World',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" {...S(ocean)} />
        <Path d="M10 17 Q14 13 19 14 Q21 18 19 22 Q14 23 11 21 Z" {...S(grass, 1.2)} />
        <Path d="M26 13 Q32 14 33 17 Q31 21 26 19 Z" {...S(grass, 1.2)} />
        <Path d="M23 28 Q31 27 35 30 Q34 36 26 37 Q21 33 23 28 Z" {...S(grass, 1.2)} />
        <Ellipse cx="15" cy="14" rx="3.5" ry="2" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  plane: {
    id: 'plane', cat: 'Custom', color: 'cyan', label: 'Flight',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 28 L24 8 L42 28 L26 24 L26 38 L22 38 L22 24 Z" {...S('#FFFFFF')} />
        <Path d="M4 28 L22 30 L22 24 Z" {...S(silver, 1.2)} />
        <Path d="M42 28 L26 30 L26 24 Z" {...S(silver, 1.2)} />
        <Circle cx="24" cy="14" r="2.5" {...S(sky, 1.2)} />
        <Path d="M22 38 L20 42 L28 42 L26 38" {...S(RED, 1.2)} />
      </Svg>
    ),
  },

  suitcase: {
    id: 'suitcase', cat: 'Custom', color: 'yellow', label: 'Suitcase',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="6" y="16" width="36" height="26" rx="3" {...S(tan)} />
        <Path d="M18 16 L18 12 Q18 8 22 8 L26 8 Q30 8 30 12 L30 16" {...S('none')} />
        <Rect x="6" y="22" width="36" height="3" {...S(crustDark, 1.2)} />
        <Rect x="20" y="13" width="8" height="3" rx="1" {...S(gold, 1.2)} />
        <Rect x="9" y="32" width="5" height="3" {...S(cherry, 1)} />
        <Rect x="35" y="36" width="4" height="3" {...S(CYAN, 1)} />
      </Svg>
    ),
  },

  camera: {
    id: 'camera', cat: 'Custom', color: 'pink', label: 'Camera',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="4" y="14" width="40" height="26" rx="3" {...S(choc)} />
        <Rect x="16" y="8" width="14" height="8" rx="2" {...S(choc, 1.2)} />
        <Circle cx="24" cy="27" r="10" {...S(silver)} />
        <Circle cx="24" cy="27" r="6" {...S('#0C0C0C', 1.2)} />
        <Circle cx="22" cy="25" r="2" {...F('#FFFFFF', 0.7)} />
        <Circle cx="38" cy="20" r="2" {...S(RED, 1.2)} />
      </Svg>
    ),
  },

  mountain: {
    id: 'mountain', cat: 'Custom', color: 'lime', label: 'Mountains',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="36" cy="14" r="4" {...S(gold, 1.2)} />
        <Path d="M4 40 L18 14 L26 28 L36 12 L44 40 Z" {...S(silver)} />
        <Path d="M14 23 L18 14 L22 23 Z" {...S('#FFFFFF', 1.2)} />
        <Path d="M33 19 L36 12 L39 19 Z" {...S('#FFFFFF', 1.2)} />
      </Svg>
    ),
  },

  passport: {
    id: 'passport', cat: 'Custom', color: 'red', label: 'Passport',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="11" y="6" width="26" height="36" rx="2" {...S(RED)} />
        <Rect x="11" y="6" width="26" height="3" {...S(cherry, 1.2)} />
        <Circle cx="24" cy="20" r="5" {...S(gold, 1.2)} />
        <Circle cx="24" cy="20" r="2" {...S(goldDark, 1)} />
        <Line x1="16" y1="32" x2="32" y2="32" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" fill="none" />
        <Line x1="18" y1="36" x2="30" y2="36" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" fill="none" />
      </Svg>
    ),
  },

  map: {
    id: 'map', cat: 'Custom', color: 'lime', label: 'World map',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 12 L18 8 L30 12 L44 8 L44 36 L30 40 L18 36 L4 40 Z" {...S(cream)} />
        <Path d="M4 12 L18 8 L18 36 L4 40 Z" {...S(grass, 1.2)} />
        <Path d="M30 12 L44 8 L44 36 L30 40 Z" {...S(sky, 1.2)} />
        <Line x1="18" y1="8" x2="18" y2="36" {...ST(K, 1)} />
        <Line x1="30" y1="12" x2="30" y2="40" {...ST(K, 1)} />
        <Path d="M22 20 Q24 18 26 20 Q26 24 24 26 Q22 24 22 20 Z" {...S(RED, 1.2)} />
      </Svg>
    ),
  },

  // ── Food ────────────────────────────────────────────────────────────────────

  pastry: {
    id: 'pastry', cat: 'Custom', color: 'yellow', label: 'Pastry',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" {...S(tan)} />
        <Circle cx="24" cy="24" r="13" {...S(pastry, 1.2)} />
        <Circle cx="24" cy="24" r="3.5" {...S(tan, 1.2)} />
        <Circle cx="17" cy="19" r="1.6" {...F(tan)} />
        <Circle cx="31" cy="19" r="1.6" {...F(tan)} />
        <Circle cx="17" cy="29" r="1.6" {...F(tan)} />
        <Circle cx="31" cy="29" r="1.6" {...F(tan)} />
        <Circle cx="24" cy="15" r="1.6" {...F(tan)} />
        <Circle cx="24" cy="33" r="1.6" {...F(tan)} />
        <Ellipse cx="18" cy="16" rx="4" ry="2" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  coffee: {
    id: 'coffee', cat: 'Custom', color: 'yellow', label: 'Coffee',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M14 6 Q17 10 14 14" fill="none" stroke={steam} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M22 4 Q25 9 22 14" fill="none" stroke={steam} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M30 6 Q33 10 30 14" fill="none" stroke={steam} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="24" cy="42" rx="18" ry="3" {...S('#FFFFFF', 1.2)} />
        <Path d="M10 18 L36 18 L33 38 Q33 42 24 42 Q15 42 15 38 Z" {...S('#FFFFFF')} />
        <Ellipse cx="23" cy="20" rx="11" ry="2.5" {...S(choc, 1.2)} />
        <Path d="M36 22 Q42 22 42 28 Q42 34 36 34" {...S('none')} />
        <Ellipse cx="14" cy="24" rx="1.5" ry="3" {...F('#FFFFFF', 0.6)} />
      </Svg>
    ),
  },

  pizza: {
    id: 'pizza', cat: 'Custom', color: 'red', label: 'Pizza',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 L8 38 Q24 44 40 38 Z" {...S(bun)} />
        <Path d="M8 38 Q24 44 40 38" {...S(tan, 1.5)} />
        <Ellipse cx="20" cy="20" rx="2.5" ry="2.5" {...S(RED, 1.2)} />
        <Ellipse cx="28" cy="22" rx="2.5" ry="2.5" {...S(RED, 1.2)} />
        <Ellipse cx="18" cy="30" rx="2.5" ry="2.5" {...S(RED, 1.2)} />
        <Ellipse cx="30" cy="32" rx="2.5" ry="2.5" {...S(RED, 1.2)} />
        <Path d="M22 14 Q24 16 26 14" {...S(deepGreen, 1.2)} />
        <Path d="M24 26 Q26 28 28 26" {...S(deepGreen, 1.2)} />
      </Svg>
    ),
  },

  croissant: {
    id: 'croissant', cat: 'Custom', color: 'yellow', label: 'Croissant',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M8 24 Q8 8 24 8 Q40 8 40 24 Q40 32 30 32 Q26 28 22 32 Q18 28 14 32 Q8 32 8 24 Z" {...S(bun)} />
        <Path d="M12 22 Q12 14 24 12" {...S('none', 1.2)} />
        <Path d="M16 24 Q18 18 26 16" {...S('none', 1.2)} />
        <Path d="M20 26 Q22 22 30 20" {...S('none', 1.2)} />
        <Path d="M24 28 Q28 26 34 24" {...S('none', 1.2)} />
        <Ellipse cx="16" cy="14" rx="4" ry="2" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  iceCream: {
    id: 'iceCream', cat: 'Custom', color: 'pink', label: 'Ice cream',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="20" cy="14" r="8" {...S(creamPink)} />
        <Circle cx="28" cy="14" r="8" {...S('#FFFFFF')} />
        <Circle cx="24" cy="8" r="2" {...S(RED, 1.2)} />
        <Path d="M14 20 L24 44 L34 20 Z" {...S(bun)} />
        <Line x1="18" y1="26" x2="22" y2="32" fill="none" stroke={tan} strokeWidth={1} strokeLinecap="round" />
        <Line x1="24" y1="26" x2="24" y2="34" fill="none" stroke={tan} strokeWidth={1} strokeLinecap="round" />
        <Line x1="30" y1="26" x2="26" y2="32" fill="none" stroke={tan} strokeWidth={1} strokeLinecap="round" />
        <Ellipse cx="18" cy="12" rx="2" ry="1.5" {...F('#FFFFFF', 0.7)} />
      </Svg>
    ),
  },

  cake: {
    id: 'cake', cat: 'Custom', color: 'pink', label: 'Cake',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Ellipse cx="24" cy="6" rx="1.5" ry="3" {...S(gold, 1.2)} />
        <Line x1="24" y1="10" x2="24" y2="14" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" fill="none" />
        <Ellipse cx="24" cy="14" rx="12" ry="2" {...S(PINK, 1.2)} />
        <Rect x="12" y="14" width="24" height="6" {...S(PINK, 1.2)} />
        <Path d="M12 16 Q16 20 20 16 T28 16 T36 16" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="24" cy="22" rx="16" ry="2" {...S(cream, 1.2)} />
        <Rect x="8" y="22" width="32" height="16" rx="2" {...S(cream)} />
        <Path d="M8 24 Q14 28 20 24 T32 24 T40 24" fill="none" stroke={PINK} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="14" cy="32" r="1.5" {...F(RED)} />
        <Circle cx="24" cy="34" r="1.5" {...F(RED)} />
        <Circle cx="34" cy="32" r="1.5" {...F(RED)} />
      </Svg>
    ),
  },

  donut: {
    id: 'donut', cat: 'Custom', color: 'pink', label: 'Donut',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" {...S(bun)} />
        <Circle cx="24" cy="24" r="5" {...S('#FFF6E5', 1.2)} />
        <Path d="M24 6 Q34 8 38 18 Q40 26 32 36 Q26 40 18 40 Q10 36 8 26 Q8 18 14 12 Q20 6 24 6 Z" {...S(PINK, 1.2)} />
        <Circle cx="24" cy="24" r="6" {...S('#FFF6E5', 1.2)} />
        <Line x1="14" y1="14" x2="18" y2="13" fill="none" stroke={YELLOW} strokeWidth={2} strokeLinecap="round" />
        <Line x1="34" y1="14" x2="32" y2="11" fill="none" stroke={CYAN} strokeWidth={2} strokeLinecap="round" />
        <Line x1="36" y1="30" x2="40" y2="32" fill="none" stroke={LIME} strokeWidth={2} strokeLinecap="round" />
        <Line x1="10" y1="28" x2="14" y2="30" fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" />
        <Line x1="20" y1="36" x2="24" y2="38" fill="none" stroke={YELLOW} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    ),
  },

  burger: {
    id: 'burger', cat: 'Custom', color: 'red', label: 'Burger',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M6 20 Q24 6 42 20 L42 24 L6 24 Z" {...S(bun)} />
        <Ellipse cx="14" cy="14" rx="1.5" ry="1" {...F('#FFFFFF', 0.7)} />
        <Ellipse cx="22" cy="11" rx="1.5" ry="1" {...F('#FFFFFF', 0.7)} />
        <Ellipse cx="32" cy="13" rx="1.5" ry="1" {...F('#FFFFFF', 0.7)} />
        <Path d="M6 24 Q24 28 42 24 L42 28 Q24 31 6 28 Z" {...S(deepGreen, 1.2)} />
        <Path d="M6 28 Q24 32 42 28 L42 33 Q24 35 6 33 Z" {...S(crustDark, 1.2)} />
        <Path d="M6 33 Q24 36 42 33 L42 38 Q42 40 38 40 L10 40 Q6 40 6 38 Z" {...S(bun)} />
      </Svg>
    ),
  },

  wine: {
    id: 'wine', cat: 'Custom', color: 'pink', label: 'Wine',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M12 6 L36 6 L33 22 Q30 26 24 26 Q18 26 15 22 Z" {...S(RED)} />
        <Line x1="14" y1="10" x2="34" y2="10" fill="none" stroke={crustDark} strokeWidth={1} strokeLinecap="round" />
        <Ellipse cx="19" cy="16" rx="3" ry="2" {...F('#FFFFFF', 0.4)} />
        <Line x1="24" y1="26" x2="24" y2="42" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1="14" y1="42" x2="34" y2="42" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    ),
  },

  plate: {
    id: 'plate', cat: 'Custom', color: 'cyan', label: 'Dining',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="28" r="14" {...S('#FFFFFF')} />
        <Circle cx="24" cy="28" r="9" {...S(cream, 1.2)} />
        <Ellipse cx="20" cy="22" rx="3" ry="1.5" {...F('#FFFFFF', 0.6)} />
        <Line x1="9" y1="6" x2="9" y2="20" fill="none" stroke={silver} strokeWidth={3} strokeLinecap="round" />
        <Line x1="6" y1="6" x2="6" y2="12" fill="none" stroke={silver} strokeWidth={2} strokeLinecap="round" />
        <Line x1="12" y1="6" x2="12" y2="12" fill="none" stroke={silver} strokeWidth={2} strokeLinecap="round" />
        <Path d="M38 6 Q42 8 42 16 Q42 22 38 22 Z" {...S(silver)} />
        <Line x1="38" y1="22" x2="38" y2="42" fill="none" stroke={silver} strokeWidth={2.5} strokeLinecap="round" />
      </Svg>
    ),
  },

  // ── Adventure ────────────────────────────────────────────────────────────────

  tent: {
    id: 'tent', cat: 'Custom', color: 'red', label: 'Camping',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 40 L24 8 L44 40 Z" {...S(RED)} />
        <Line x1="24" y1="8" x2="24" y2="40" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Path d="M20 40 L24 28 L28 40 Z" {...S(gold, 1.2)} />
        <Line x1="12" y1="20" x2="24" y2="16" fill="none" stroke={K} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
        <Line x1="36" y1="20" x2="24" y2="16" fill="none" stroke={K} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      </Svg>
    ),
  },

  bolt: {
    id: 'bolt', cat: 'Custom', color: 'yellow', label: 'Lightning',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M26 4 L10 26 L20 26 L18 44 L36 20 L26 20 Z" {...S(YELLOW)} />
        <Path d="M26 4 L18 14" fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      </Svg>
    ),
  },

  flame: {
    id: 'flame', cat: 'Custom', color: 'red', label: 'Fire',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 Q14 14 14 26 Q14 38 24 42 Q34 38 34 26 Q34 18 28 12 Q28 22 24 22 Q24 14 24 4 Z" {...S(RED)} />
        <Path d="M24 28 Q19 30 19 34 Q19 38 24 40 Q29 38 29 34 Q29 30 24 28 Z" {...S(YELLOW)} />
        <Ellipse cx="20" cy="20" rx="1.5" ry="2" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  wave: {
    id: 'wave', cat: 'Custom', color: 'cyan', label: 'Surf',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 22 Q12 14 20 22 T36 22 T44 22 L44 40 L4 40 Z" {...S(ocean)} />
        <Path d="M4 30 Q12 26 20 30 T36 30 T44 30" fill="none" stroke={sky} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 36 Q12 33 20 36 T36 36 T44 36" fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
        <Circle cx="36" cy="14" r="3" {...S('#FFFFFF', 1.2)} />
      </Svg>
    ),
  },

  bike: {
    id: 'bike', cat: 'Custom', color: 'lime', label: 'Bike',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="12" cy="32" r="8" {...S(LIME)} />
        <Circle cx="12" cy="32" r="3" {...S('#FFFFFF', 1)} />
        <Circle cx="36" cy="32" r="8" {...S(LIME)} />
        <Circle cx="36" cy="32" r="3" {...S('#FFFFFF', 1)} />
        <Path d="M12 32 L22 20 L34 20 L36 32" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="16" y1="20" x2="26" y2="20" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1="22" y1="20" x2="20" y2="12" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" />
        <Circle cx="20" cy="11" r="1.5" {...S(RED, 1)} />
      </Svg>
    ),
  },

  // ── Wellness ─────────────────────────────────────────────────────────────────

  sun: {
    id: 'sun', cat: 'Custom', color: 'yellow', label: 'Sun',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Line x1="24" y1="4" x2="24" y2="11" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="24" y1="37" x2="24" y2="44" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="4" y1="24" x2="11" y2="24" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="37" y1="24" x2="44" y2="24" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="10" y1="10" x2="14" y2="14" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="34" y1="34" x2="38" y2="38" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="38" y1="10" x2="34" y2="14" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="14" y1="34" x2="10" y2="38" fill="none" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
        <Circle cx="24" cy="24" r="10" {...S(YELLOW)} />
        <Circle cx="20" cy="21" r="1.5" {...F(K)} />
        <Circle cx="28" cy="21" r="1.5" {...F(K)} />
        <Path d="M20 27 Q24 30 28 27" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="17" cy="26" r="1.5" {...F(cherry, 0.6)} />
        <Circle cx="31" cy="26" r="1.5" {...F(cherry, 0.6)} />
      </Svg>
    ),
  },

  moon: {
    id: 'moon', cat: 'Custom', color: 'blue', label: 'Moon',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M32 6 Q14 8 14 24 Q14 40 32 42 Q22 32 22 24 Q22 16 32 6 Z" {...S('#FFFFFF')} />
        <Circle cx="26" cy="14" r="1.6" {...F('#0C0C0C', 0.18)} />
        <Circle cx="28" cy="22" r="1.6" {...F('#0C0C0C', 0.18)} />
        <Circle cx="26" cy="32" r="1.4" {...F('#0C0C0C', 0.18)} />
      </Svg>
    ),
  },

  leaf: {
    id: 'leaf', cat: 'Custom', color: 'lime', label: 'Leaf',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M8 40 Q4 16 24 8 Q44 16 40 40 Q24 36 8 40 Z" {...S(grass)} />
        <Path d="M8 40 Q24 24 40 12" fill="none" stroke={deepGreen} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 32 Q20 26 18 22" fill="none" stroke={deepGreen} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M22 36 Q28 26 28 20" fill="none" stroke={deepGreen} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M30 36 Q34 28 36 22" fill="none" stroke={deepGreen} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },

  flower: {
    id: 'flower', cat: 'Custom', color: 'pink', label: 'Flower',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="9" r="6" {...S(PINK)} />
        <Circle cx="36" cy="19" r="6" {...S(PINK)} />
        <Circle cx="32" cy="33" r="6" {...S(PINK)} />
        <Circle cx="16" cy="33" r="6" {...S(PINK)} />
        <Circle cx="12" cy="19" r="6" {...S(PINK)} />
        <Circle cx="24" cy="22" r="6" {...S(YELLOW)} />
        <Circle cx="22" cy="20" r="1.5" {...F('#FFFFFF', 0.7)} />
      </Svg>
    ),
  },

  drop: {
    id: 'drop', cat: 'Custom', color: 'cyan', label: 'Water',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 Q12 20 12 30 Q12 40 24 44 Q36 40 36 30 Q36 20 24 4 Z" {...S(ocean)} />
        <Ellipse cx="19" cy="20" rx="3" ry="5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  lotus: {
    id: 'lotus', cat: 'Custom', color: 'pink', label: 'Lotus',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 26 Q10 20 6 22 Q10 30 22 28 Z" {...S(PINK)} />
        <Path d="M24 26 Q38 20 42 22 Q38 30 26 28 Z" {...S(PINK)} />
        <Path d="M24 24 Q14 16 14 8 Q24 12 24 22 Z" {...S(creamPink)} />
        <Path d="M24 24 Q34 16 34 8 Q24 12 24 22 Z" {...S(creamPink)} />
        <Path d="M24 24 Q19 14 24 4 Q29 14 24 24 Z" {...S(PINK, 1.2)} />
        <Ellipse cx="24" cy="30" rx="6" ry="3" {...S(YELLOW, 1.2)} />
      </Svg>
    ),
  },

  candle: {
    id: 'candle', cat: 'Custom', color: 'yellow', label: 'Candle',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 Q19 9 24 14 Q29 9 24 4 Z" {...S(YELLOW)} />
        <Path d="M24 8 Q22 11 24 14 Q26 11 24 8 Z" {...F('#FFFFFF', 0.6)} />
        <Line x1="24" y1="14" x2="24" y2="18" fill="none" stroke={choc} strokeWidth={1.5} strokeLinecap="round" />
        <Rect x="16" y="18" width="16" height="24" rx="2" {...S(creamPink)} />
        <Line x1="16" y1="24" x2="32" y2="24" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Ellipse cx="20" cy="22" rx="2" ry="1" {...F('#FFFFFF', 0.6)} />
      </Svg>
    ),
  },

  // ── Social ────────────────────────────────────────────────────────────────────

  heart: {
    id: 'heart', cat: 'Custom', color: 'red', label: 'Heart',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 42 Q4 28 4 16 Q4 8 12 8 Q18 8 24 16 Q30 8 36 8 Q44 8 44 16 Q44 28 24 42 Z" {...S(RED)} />
        <Ellipse cx="14" cy="14" rx="3" ry="2" {...F('#FFFFFF', 0.6)} />
      </Svg>
    ),
  },

  gift: {
    id: 'gift', cat: 'Custom', color: 'cyan', label: 'Gift',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="6" y="22" width="36" height="18" rx="2" {...S(CYAN)} />
        <Rect x="6" y="16" width="36" height="6" rx="1" {...S(YELLOW)} />
        <Rect x="20" y="16" width="8" height="24" {...S(RED)} />
        <Path d="M24 16 Q14 12 16 6 Q20 4 24 14 Q28 4 32 6 Q34 12 24 16" {...S(RED)} />
        <Circle cx="24" cy="13" r="1.5" {...F(gold)} />
      </Svg>
    ),
  },

  balloon: {
    id: 'balloon', cat: 'Custom', color: 'pink', label: 'Balloon',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Ellipse cx="24" cy="18" rx="12" ry="14" {...S(PINK)} />
        <Ellipse cx="20" cy="14" rx="3" ry="4" {...F('#FFFFFF', 0.6)} />
        <Path d="M22 32 L20 36 L28 36 L26 32 Z" {...S(PINK)} />
        <Path d="M24 36 Q22 40 24 44" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },

  music: {
    id: 'music', cat: 'Custom', color: 'blue', label: 'Music',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Ellipse cx="14" cy="36" rx="6" ry="5" transform="rotate(-15 14 36)" {...S(BLUE)} />
        <Ellipse cx="36" cy="32" rx="6" ry="5" transform="rotate(-15 36 32)" {...S(BLUE)} />
        <Line x1="18" y1="34" x2="40" y2="30" fill="none" stroke={K} strokeWidth={3} strokeLinecap="round" />
        <Line x1="18" y1="34" x2="18" y2="10" fill="none" stroke={K} strokeWidth={3} strokeLinecap="round" />
        <Line x1="40" y1="30" x2="40" y2="6" fill="none" stroke={K} strokeWidth={3} strokeLinecap="round" />
        <Path d="M18 10 L40 6 L40 14 L18 18 Z" {...S(BLUE)} />
        <Ellipse cx="12" cy="34" rx="2" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  speech: {
    id: 'speech', cat: 'Custom', color: 'cyan', label: 'Chat',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M6 10 Q6 6 10 6 L38 6 Q42 6 42 10 L42 28 Q42 32 38 32 L18 32 L10 42 L10 32 Q6 32 6 28 Z" {...S(CYAN)} />
        <Circle cx="16" cy="20" r="2" {...F(K)} />
        <Circle cx="24" cy="20" r="2" {...F(K)} />
        <Circle cx="32" cy="20" r="2" {...F(K)} />
        <Ellipse cx="14" cy="12" rx="4" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  people: {
    id: 'people', cat: 'Custom', color: 'cyan', label: 'Friends',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="14" cy="14" r="6" {...S(bun)} />
        <Path d="M4 38 Q4 26 14 26 Q24 26 24 38 L24 42 L4 42 Z" {...S(CYAN)} />
        <Circle cx="34" cy="14" r="6" {...S(tan)} />
        <Path d="M24 38 Q24 26 34 26 Q44 26 44 38 L44 42 L24 42 Z" {...S(PINK)} />
        <Ellipse cx="12" cy="12" rx="2" ry="1.2" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  handshake: {
    id: 'handshake', cat: 'Custom', color: 'yellow', label: 'Connect',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 20 L12 16 L20 20 L24 24 L28 20 L36 16 L44 20 L44 30 L36 32 L28 28 L24 32 L20 28 L12 32 L4 30 Z" {...S(bun)} />
        <Line x1="12" y1="16" x2="12" y2="32" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Line x1="36" y1="16" x2="36" y2="32" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Line x1="24" y1="24" x2="24" y2="32" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Ellipse cx="14" cy="22" rx="3" ry="1.5" {...F('#FFFFFF', 0.4)} />
        <Ellipse cx="34" cy="22" rx="3" ry="1.5" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  family: {
    id: 'family', cat: 'Custom', color: 'pink', label: 'Family',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="12" cy="12" r="5" {...S(bun)} />
        <Path d="M4 32 Q4 22 12 22 Q20 22 20 32 L20 38 L4 38 Z" {...S(PINK)} />
        <Circle cx="36" cy="12" r="5" {...S(tan)} />
        <Path d="M28 32 Q28 22 36 22 Q44 22 44 32 L44 38 L28 38 Z" {...S(CYAN)} />
        <Circle cx="24" cy="22" r="3.5" {...S(creamPink)} />
        <Path d="M19 34 Q19 28 24 28 Q29 28 29 34 L29 40 L19 40 Z" {...S(YELLOW)} />
      </Svg>
    ),
  },

  // ── Special ───────────────────────────────────────────────────────────────────

  star: {
    id: 'star', cat: 'Custom', color: 'yellow', label: 'Star',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 L29 18 L44 19 L33 28 L37 42 L24 34 L11 42 L15 28 L4 19 L19 18 Z" {...S(YELLOW)} />
        <Path d="M18 14 L24 10" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      </Svg>
    ),
  },

  crown: {
    id: 'crown', cat: 'Custom', color: 'yellow', label: 'Crown',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 16 L12 28 L18 12 L24 24 L30 12 L36 28 L44 16 L44 38 L4 38 Z" {...S(gold)} />
        <Rect x="4" y="34" width="40" height="4" {...S(goldDark, 1.2)} />
        <Circle cx="4" cy="16" r="2.5" {...S(RED, 1.2)} />
        <Circle cx="44" cy="16" r="2.5" {...S(RED, 1.2)} />
        <Circle cx="24" cy="24" r="2.5" {...S(BLUE, 1.2)} />
        <Circle cx="18" cy="34" r="1.5" {...F('#FFFFFF', 0.6)} />
      </Svg>
    ),
  },

  diamond: {
    id: 'diamond', cat: 'Custom', color: 'cyan', label: 'Diamond',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M16 8 L32 8 L42 20 L24 42 L6 20 Z" {...S(CYAN)} />
        <Path d="M16 8 L24 20 L32 8 Z" {...S('#FFFFFF', 1.2)} />
        <Line x1="6" y1="20" x2="42" y2="20" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Line x1="16" y1="8" x2="24" y2="20" fill="none" stroke={K} strokeWidth={1} strokeLinecap="round" />
        <Line x1="32" y1="8" x2="24" y2="20" fill="none" stroke={K} strokeWidth={1} strokeLinecap="round" />
        <Ellipse cx="20" cy="13" rx="3" ry="1.5" {...F('#FFFFFF', 0.7)} />
      </Svg>
    ),
  },

  trophy: {
    id: 'trophy', cat: 'Custom', color: 'yellow', label: 'Trophy',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M14 8 L34 8 L34 22 Q34 30 24 30 Q14 30 14 22 Z" {...S(gold)} />
        <Path d="M14 12 Q6 12 6 18 Q6 24 14 22" {...S('none', 1.5)} />
        <Path d="M34 12 Q42 12 42 18 Q42 24 34 22" {...S('none', 1.5)} />
        <Line x1="24" y1="30" x2="24" y2="38" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" />
        <Rect x="14" y="38" width="20" height="4" {...S(goldDark)} />
        <Path d="M18 12 L20 22" fill="none" stroke="#FFFFFF" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      </Svg>
    ),
  },

  rainbow: {
    id: 'rainbow', cat: 'Custom', color: 'pink', label: 'Rainbow',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 36 Q4 14 24 14 Q44 14 44 36" fill="none" stroke={RED} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 36 Q9 19 24 19 Q39 19 39 36" fill="none" stroke={YELLOW} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 36 Q14 24 24 24 Q34 24 34 36" fill="none" stroke={LIME} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M19 36 Q19 29 24 29 Q29 29 29 36" fill="none" stroke={CYAN} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="6" cy="38" r="3" {...S('#FFFFFF', 1.2)} />
        <Circle cx="42" cy="38" r="3" {...S('#FFFFFF', 1.2)} />
      </Svg>
    ),
  },

  badge: {
    id: 'badge', cat: 'Custom', color: 'red', label: 'Badge',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 L30 10 L38 8 L40 16 L46 20 L40 24 L38 32 L30 30 L24 36 L18 30 L10 32 L8 24 L2 20 L8 16 L10 8 L18 10 Z" {...S(RED)} />
        <Circle cx="24" cy="20" r="6" {...S(gold)} />
        <Path d="M21 19 L23 23 L28 17" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="14" cy="12" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Culture ───────────────────────────────────────────────────────────────────

  masks: {
    id: 'masks', cat: 'Custom', color: 'pink', label: 'Theater',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M8 10 Q8 6 12 6 L24 6 L24 42 Q8 38 8 26 Z" {...S(PINK)} />
        <Path d="M24 6 L36 6 Q40 6 40 10 L40 26 Q40 38 24 42 Z" {...S(CYAN)} />
        <Circle cx="16" cy="18" r="2" {...F(K)} />
        <Circle cx="32" cy="18" r="2" {...F(K)} />
        <Path d="M13 28 Q19 34 24 30" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M24 30 Q29 24 35 28" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="14" cy="12" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
        <Ellipse cx="34" cy="12" rx="3" ry="1.5" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  palette: {
    id: 'palette', cat: 'Custom', color: 'yellow', label: 'Arts',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 6 Q42 6 42 22 Q42 32 32 32 Q28 32 28 36 Q28 40 24 42 Q6 42 6 24 Q6 6 24 6 Z" {...S(cream)} />
        <Circle cx="14" cy="20" r="2.8" {...S(RED, 1.2)} />
        <Circle cx="22" cy="14" r="2.8" {...S(CYAN, 1.2)} />
        <Circle cx="30" cy="16" r="2.8" {...S(LIME, 1.2)} />
        <Circle cx="34" cy="24" r="2.8" {...S(PINK, 1.2)} />
        <Circle cx="16" cy="30" r="2.8" {...S(BLUE, 1.2)} />
        <Ellipse cx="12" cy="14" rx="3" ry="1.5" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  ticket: {
    id: 'ticket', cat: 'Custom', color: 'red', label: 'Ticket',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M6 14 L42 14 L42 22 Q38 22 38 26 Q38 30 42 30 L42 38 L6 38 L6 30 Q10 30 10 26 Q10 22 6 22 Z" {...S(RED)} />
        <Circle cx="24" cy="20" r="0.8" {...F('#FFFFFF')} />
        <Circle cx="24" cy="24" r="0.8" {...F('#FFFFFF')} />
        <Circle cx="24" cy="28" r="0.8" {...F('#FFFFFF')} />
        <Circle cx="24" cy="32" r="0.8" {...F('#FFFFFF')} />
        <Line x1="14" y1="18" x2="18" y2="18" fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" />
        <Line x1="14" y1="22" x2="20" y2="22" fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" />
        <Line x1="28" y1="28" x2="34" y2="28" fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" />
        <Line x1="28" y1="32" x2="32" y2="32" fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" />
      </Svg>
    ),
  },

  // ── Fitness ────────────────────────────────────────────────────────────────────

  medal: {
    id: 'medal', cat: 'Custom', color: 'yellow', label: 'Medal',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M16 4 L20 16 L13 16 Z" {...S(RED)} />
        <Path d="M32 4 L35 16 L28 16 Z" {...S(CYAN)} />
        <Circle cx="24" cy="28" r="12" {...S(gold)} />
        <Circle cx="24" cy="28" r="7" {...S(goldDark, 1.2)} />
        <Path d="M21 25 L24 32 L27 25" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="20" cy="22" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  dumbbell: {
    id: 'dumbbell', cat: 'Custom', color: 'blue', label: 'Fitness',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="4" y="18" width="6" height="12" rx="1" {...S(BLUE)} />
        <Rect x="10" y="14" width="4" height="20" rx="1" {...S(BLUE)} />
        <Rect x="14" y="22" width="20" height="4" {...S(BLUE)} />
        <Rect x="34" y="14" width="4" height="20" rx="1" {...S(BLUE)} />
        <Rect x="38" y="18" width="6" height="12" rx="1" {...S(BLUE)} />
        <Rect x="6" y="20" width="2" height="3" {...F('#FFFFFF', 0.5)} />
        <Rect x="40" y="20" width="2" height="3" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Learning ────────────────────────────────────────────────────────────────────

  bulb: {
    id: 'bulb', cat: 'Custom', color: 'yellow', label: 'Idea',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Line x1="24" y1="2" x2="24" y2="6" fill="none" stroke={gold} strokeWidth={2} strokeLinecap="round" />
        <Line x1="10" y1="10" x2="13" y2="13" fill="none" stroke={gold} strokeWidth={2} strokeLinecap="round" />
        <Line x1="38" y1="10" x2="35" y2="13" fill="none" stroke={gold} strokeWidth={2} strokeLinecap="round" />
        <Path d="M24 6 Q12 6 12 18 Q12 24 16 28 L16 32 L32 32 L32 28 Q36 24 36 18 Q36 6 24 6 Z" {...S(YELLOW)} />
        <Line x1="17" y1="36" x2="31" y2="36" fill="none" stroke={silver} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="19" y1="40" x2="29" y2="40" fill="none" stroke={silver} strokeWidth={2.5} strokeLinecap="round" />
        <Ellipse cx="20" cy="14" rx="3" ry="2" {...F('#FFFFFF', 0.6)} />
      </Svg>
    ),
  },

  gradCap: {
    id: 'gradCap', cat: 'Custom', color: 'blue', label: 'Education',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M14 23 L14 34 Q14 38 24 38 Q34 38 34 34 L34 23" {...S(cream)} />
        <Path d="M4 20 L24 12 L44 20 L24 28 Z" {...S(BLUE)} />
        <Line x1="42" y1="20" x2="42" y2="32" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M40 32 L42 34 L44 32 L42 38 Z" {...S(gold, 1.2)} />
        <Ellipse cx="16" cy="19" rx="3" ry="1.5" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  pencil: {
    id: 'pencil', cat: 'Custom', color: 'yellow', label: 'Skills',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M8 40 L12 30 L34 8 L40 14 L18 36 Z" {...S(YELLOW)} />
        <Path d="M30 12 L36 18" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 30 L18 36" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 40 L14 38 L10 42 Z" {...S(K, 1.2)} />
        <Path d="M34 8 L40 14 L36 6 Z" {...S(cherry, 1.2)} />
      </Svg>
    ),
  },

  // ── Career ─────────────────────────────────────────────────────────────────────

  briefcase: {
    id: 'briefcase', cat: 'Custom', color: 'blue', label: 'Career',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M18 16 L18 12 Q18 8 22 8 L26 8 Q30 8 30 12 L30 16" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Rect x="6" y="16" width="36" height="24" rx="3" {...S(choc)} />
        <Rect x="6" y="22" width="36" height="3" {...S(crustDark, 1.2)} />
        <Rect x="20" y="24" width="8" height="3" {...S(gold, 1.2)} />
        <Ellipse cx="12" cy="20" rx="3" ry="1.2" {...F('#FFFFFF', 0.3)} />
      </Svg>
    ),
  },

  target: {
    id: 'target', cat: 'Custom', color: 'red', label: 'Goals',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" {...S(RED)} />
        <Circle cx="24" cy="24" r="13" {...S('#FFFFFF', 1.2)} />
        <Circle cx="24" cy="24" r="8" {...S(RED, 1.2)} />
        <Circle cx="24" cy="24" r="3" {...S('#FFFFFF', 1.2)} />
        <Line x1="6" y1="6" x2="24" y2="24" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
        <Path d="M28 22 L36 14 L34 20 L40 18 L32 26 Z" {...S(YELLOW, 1.2)} />
      </Svg>
    ),
  },

  // ── Nature ─────────────────────────────────────────────────────────────────────

  paw: {
    id: 'paw', cat: 'Custom', color: 'lime', label: 'Wildlife',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Ellipse cx="12" cy="20" rx="4" ry="5" {...S(tan)} />
        <Ellipse cx="36" cy="20" rx="4" ry="5" {...S(tan)} />
        <Ellipse cx="19" cy="10" rx="3.5" ry="4.5" {...S(tan)} />
        <Ellipse cx="29" cy="10" rx="3.5" ry="4.5" {...S(tan)} />
        <Path d="M14 34 Q14 26 24 26 Q34 26 34 34 Q34 42 24 42 Q14 42 14 34 Z" {...S(bun)} />
        <Ellipse cx="22" cy="32" rx="2" ry="1" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  tree: {
    id: 'tree', cat: 'Custom', color: 'lime', label: 'Tree',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 L10 22 L18 22 L8 36 L20 36 L20 44 L28 44 L28 36 L40 36 L30 22 L38 22 Z" {...S(deepGreen)} />
        <Path d="M24 4 L18 12 L24 14 Z" {...F('#FFFFFF', 0.4)} />
        <Rect x="20" y="36" width="8" height="8" {...S(choc, 1.2)} />
      </Svg>
    ),
  },

  bird: {
    id: 'bird', cat: 'Custom', color: 'cyan', label: 'Animal',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M14 14 Q22 8 30 14 Q38 18 38 28 Q38 36 28 38 L28 42 L24 42 L24 38 Q14 36 12 28 Q10 20 14 14 Z" {...S(sky)} />
        <Circle cx="30" cy="20" r="2" {...F(K)} />
        <Circle cx="30.5" cy="19.5" r="0.6" {...F('#FFFFFF')} />
        <Path d="M38 24 L44 22 L40 26 Z" {...S(gold, 1.2)} />
        <Path d="M14 18 Q20 16 22 22" fill="none" stroke={K} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="20" cy="14" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Home ──────────────────────────────────────────────────────────────────────

  house: {
    id: 'house', cat: 'Custom', color: 'red', label: 'Home',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="6" y="22" width="36" height="18" {...S(cream)} />
        <Path d="M4 24 L24 6 L44 24 Z" {...S(RED)} />
        <Rect x="20" y="28" width="8" height="12" {...S(choc, 1.2)} />
        <Circle cx="26" cy="34" r="0.8" {...F(gold)} />
        <Rect x="10" y="28" width="6" height="6" {...S(sky, 1.2)} />
        <Rect x="32" y="28" width="6" height="6" {...S(sky, 1.2)} />
        <Rect x="28" y="10" width="4" height="8" {...S(choc, 1)} />
      </Svg>
    ),
  },

  couch: {
    id: 'couch', cat: 'Custom', color: 'pink', label: 'Cozy',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M6 22 Q6 18 10 18 L38 18 Q42 18 42 22 L42 28 L6 28 Z" {...S(creamPink)} />
        <Rect x="4" y="28" width="40" height="10" rx="2" {...S(PINK)} />
        <Line x1="10" y1="38" x2="10" y2="42" fill="none" stroke={choc} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="38" y1="38" x2="38" y2="42" fill="none" stroke={choc} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="24" y1="28" x2="24" y2="38" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Ellipse cx="14" cy="22" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  mug: {
    id: 'mug', cat: 'Custom', color: 'cyan', label: 'Cozy mug',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M17 8 Q20 10 17 12" fill="none" stroke={steam} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M24 6 Q27 9 24 12" fill="none" stroke={steam} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M31 8 Q34 10 31 12" fill="none" stroke={steam} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10 14 L34 14 L32 38 Q32 42 28 42 L16 42 Q12 42 12 38 Z" {...S(CYAN)} />
        <Ellipse cx="22" cy="17" rx="10" ry="2" {...S(choc, 1.2)} />
        <Path d="M34 18 Q42 18 42 26 Q42 32 34 32" fill="none" stroke={K} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="15" cy="22" rx="1.5" ry="3" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Giving ─────────────────────────────────────────────────────────────────────

  hands: {
    id: 'hands', cat: 'Custom', color: 'lime', label: 'Volunteer',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 30 Q4 22 12 22 L20 22 Q24 22 24 26 L24 34 Q24 38 20 38 L12 38 Q4 38 4 30 Z" {...S(bun)} />
        <Path d="M44 30 Q44 22 36 22 L28 22 Q24 22 24 26 L24 34 Q24 38 28 38 L36 38 Q44 38 44 30 Z" {...S(tan)} />
        <Path d="M16 18 Q24 8 32 18 L32 24 L16 24 Z" {...S(RED)} />
        <Ellipse cx="20" cy="14" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  ribbon: {
    id: 'ribbon', cat: 'Custom', color: 'pink', label: 'Cause',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M24 4 Q16 14 16 24 Q16 32 24 42 Q32 32 32 24 Q32 14 24 4 Z" {...S(PINK)} />
        <Path d="M24 16 L18 32" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M24 16 L30 32" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Ellipse cx="22" cy="12" rx="2" ry="3" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Spiritual ──────────────────────────────────────────────────────────────────

  peace: {
    id: 'peace', cat: 'Custom', color: 'blue', label: 'Peace',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" {...S(sky)} />
        <Line x1="24" y1="6" x2="24" y2="42" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="24" y1="24" x2="11" y2="37" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="24" y1="24" x2="37" y2="37" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
        <Ellipse cx="14" cy="14" rx="4" ry="2" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  meditate: {
    id: 'meditate', cat: 'Custom', color: 'pink', label: 'Meditate',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="12" r="5" {...S(bun)} />
        <Path d="M24 18 Q18 22 18 30 L8 36 Q6 38 8 40 L24 40 L40 40 Q42 38 40 36 L30 30 Q30 22 24 18 Z" {...S(PINK)} />
        <Circle cx="24" cy="24" r="2" {...F(YELLOW)} />
        <Ellipse cx="22" cy="10" rx="2" ry="1" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Money ──────────────────────────────────────────────────────────────────────

  coin: {
    id: 'coin', cat: 'Custom', color: 'yellow', label: 'Coin',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="18" {...S(gold)} />
        <Circle cx="24" cy="24" r="13" {...S(goldDark, 1.2)} />
        <Path d="M20 18 L28 18 Q30 18 30 20 Q30 22 28 22 L22 22 Q20 22 20 24 Q20 26 22 26 L28 26 Q30 26 30 28 Q30 30 28 30 L20 30" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="24" y1="15" x2="24" y2="33" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" />
        <Ellipse cx="18" cy="18" rx="3" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  piggy: {
    id: 'piggy', cat: 'Custom', color: 'pink', label: 'Savings',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M8 24 Q8 14 20 12 L22 8 L26 12 Q40 14 40 24 Q40 32 32 34 L30 40 L26 40 L24 36 L18 36 L16 40 L12 40 L12 32 Q8 28 8 24 Z" {...S(PINK)} />
        <Circle cx="14" cy="22" r="1.5" {...F(K)} />
        <Ellipse cx="10" cy="24" rx="2.5" ry="1.8" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="22" y1="14" x2="26" y2="14" fill="none" stroke={K} strokeWidth={1.2} strokeLinecap="round" />
        <Ellipse cx="22" cy="18" rx="4" ry="2" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  bag: {
    id: 'bag', cat: 'Custom', color: 'lime', label: 'Wealth',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M16 4 Q16 10 12 14 Q6 20 6 30 Q6 40 16 42 L32 42 Q42 40 42 30 Q42 20 36 14 Q32 10 32 4 Z" {...S(tan)} />
        <Line x1="16" y1="4" x2="32" y2="4" fill="none" stroke={K} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M22 22 L28 22 Q30 22 30 24 Q30 26 28 26 L24 26 Q22 26 22 28 Q22 30 24 30 L30 30" fill="none" stroke={gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="26" y1="20" x2="26" y2="32" fill="none" stroke={gold} strokeWidth={1.5} strokeLinecap="round" />
        <Ellipse cx="14" cy="20" rx="2" ry="4" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

  // ── Creativity ────────────────────────────────────────────────────────────────

  brush: {
    id: 'brush', cat: 'Custom', color: 'cyan', label: 'Paintbrush',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M30 4 L44 18 L36 26 L22 12 Z" {...S(YELLOW)} />
        <Path d="M22 12 L36 26 L32 30 L18 16 Z" {...S(BLUE, 1.2)} />
        <Path d="M18 16 L32 30 Q26 36 16 36 Q10 36 8 32 Q12 30 14 24 Q16 18 18 16 Z" {...S(CYAN)} />
        <Ellipse cx="14" cy="32" rx="2" ry="1.5" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  // ── Growth ─────────────────────────────────────────────────────────────────────

  sprout: {
    id: 'sprout', cat: 'Custom', color: 'lime', label: 'Growth',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Line x1="24" y1="42" x2="24" y2="22" fill="none" stroke={deepGreen} strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M24 26 Q14 22 10 14 Q18 12 24 22 Z" {...S(LIME)} />
        <Path d="M24 26 Q34 22 38 14 Q30 12 24 22 Z" {...S(grass)} />
        <Rect x="14" y="40" width="20" height="4" {...S(crustDark)} />
        <Ellipse cx="16" cy="16" rx="2" ry="1" {...F('#FFFFFF', 0.5)} />
      </Svg>
    ),
  },

  arrowUp: {
    id: 'arrowUp', cat: 'Custom', color: 'cyan', label: 'Improve',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M6 38 L18 26 L26 34 L40 16" fill="none" stroke={CYAN} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M40 16 L40 24 M40 16 L32 16" fill="none" stroke={CYAN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="6" cy="38" r="2.5" {...S(CYAN)} />
        <Circle cx="18" cy="26" r="2.5" {...S(CYAN)} />
        <Circle cx="26" cy="34" r="2.5" {...S(CYAN)} />
        <Circle cx="40" cy="16" r="2.5" {...F('#FFFFFF', 0.7)} />
      </Svg>
    ),
  },

  path: {
    id: 'path', cat: 'Custom', color: 'yellow', label: 'Journey',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M14 42 Q14 32 24 32 Q34 32 34 22 Q34 12 24 12 Q14 12 14 6" fill="none" stroke={tan} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="14" cy="6" r="3.5" {...S(RED)} />
        <Circle cx="14" cy="42" r="3.5" {...S(gold)} />
        <Circle cx="14" cy="6" r="1" {...F('#FFFFFF')} />
      </Svg>
    ),
  },

  // ── Entertainment ──────────────────────────────────────────────────────────────

  party: {
    id: 'party', cat: 'Custom', color: 'pink', label: 'Party',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Path d="M4 44 L20 18 L30 28 Z" {...S(PINK)} />
        <Path d="M4 44 L20 18 L14 28 Z" {...F('#FFFFFF', 0.3)} />
        <Circle cx="32" cy="14" r="2" {...S(CYAN, 1.2)} />
        <Circle cx="40" cy="20" r="2" {...S(YELLOW, 1.2)} />
        <Circle cx="38" cy="32" r="2" {...S(LIME, 1.2)} />
        <Circle cx="28" cy="8" r="2" {...S(RED, 1.2)} />
        <Line x1="20" y1="18" x2="20" y2="10" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" />
        <Line x1="20" y1="18" x2="14" y2="14" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    ),
  },

  confetti: {
    id: 'confetti', cat: 'Custom', color: 'yellow', label: 'Confetti',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="8" y="6" width="4" height="6" {...S(RED, 1.2)} transform="rotate(20 10 9)" />
        <Rect x="22" y="4" width="4" height="6" {...S(CYAN, 1.2)} transform="rotate(-15 24 7)" />
        <Rect x="36" y="8" width="4" height="6" {...S(LIME, 1.2)} transform="rotate(30 38 11)" />
        <Rect x="6" y="22" width="4" height="6" {...S(YELLOW, 1.2)} transform="rotate(-25 8 25)" />
        <Rect x="38" y="22" width="4" height="6" {...S(PINK, 1.2)} transform="rotate(40 40 25)" />
        <Rect x="14" y="34" width="4" height="6" {...S(BLUE, 1.2)} transform="rotate(-30 16 37)" />
        <Rect x="28" y="36" width="4" height="6" {...S(RED, 1.2)} transform="rotate(15 30 39)" />
        <Circle cx="22" cy="22" r="2.5" {...S(YELLOW, 1.2)} />
        <Circle cx="30" cy="28" r="2" {...S(PINK, 1.2)} />
        <Circle cx="16" cy="16" r="2" {...S(CYAN, 1.2)} />
      </Svg>
    ),
  },

  // ── Language ────────────────────────────────────────────────────────────────────

  translate: {
    id: 'translate', cat: 'Custom', color: 'cyan', label: 'Translate',
    render: (sz) => (
      <Svg width={sz} height={sz} viewBox="0 0 48 48">
        <Rect x="4" y="8" width="22" height="18" rx="2" {...S(CYAN)} />
        <Path d="M11 22 L15 12 L19 22 M12.5 18.5 L17.5 18.5" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Rect x="22" y="22" width="22" height="18" rx="2" {...S(YELLOW)} />
        <Path d="M27 36 L31 28 L35 36 M40 28 Q42 30 40 32 Q38 30 40 28" fill="none" stroke={K} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M26 22 L24 18 L22 22" {...S(YELLOW, 1.2)} />
        <Ellipse cx="9" cy="12" rx="3" ry="1.5" {...F('#FFFFFF', 0.4)} />
      </Svg>
    ),
  },

}

// ─── Derived lookups ──────────────────────────────────────────────────────────
export const CUSTOM_ICON_IDS = Object.keys(CUSTOM_ICONS)

/** Returns true when a string is a custom icon id (not a unicode emoji). */
export function isCustomIconId(value: string): boolean {
  return !!CUSTOM_ICONS[value]
}

/** Render a custom icon by id. Returns null if id is unknown. */
export function CustomIconView({ id, size }: { id: string; size: number }) {
  const icon = CUSTOM_ICONS[id]
  if (!icon) return null
  return icon.render(size)
}

/** Group all custom icons by category */
export const CUSTOM_ICONS_BY_CAT: Record<string, CustomIconEntry[]> =
  Object.values(CUSTOM_ICONS).reduce((acc, icon) => {
    ;(acc[icon.cat] ??= []).push(icon)
    return acc
  }, {} as Record<string, CustomIconEntry[]>)
