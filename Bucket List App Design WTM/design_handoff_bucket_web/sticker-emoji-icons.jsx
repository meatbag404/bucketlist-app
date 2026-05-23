// Bucket — Illustrated sticker emoji library.
// 30 hand-drawn icons in the "rich emoji" style — multi-color layered shapes
// with light black outlines, small highlights, and dimensional feel. Designed
// to match the look of the system emoji used throughout the app (🥮 🌍 🎂)
// but custom-drawn so the brand owns them.

const SE_K = '#0C0C0C';
// Extra "ingredient" colors that aren't in the main sticker palette but
// are needed for emoji-style illustration (bread crust, sky blue, etc).
const SE_PIGMENTS = {
  pastry:    '#F4D08F',   tan:       '#D4914D',
  choc:      '#5C3A1E',   creamPink: '#FFD8DE',
  sky:       '#7DDCFF',   ocean:     '#3A78FF',
  grass:     '#7BC257',   deepGreen: '#3D8C3F',
  steam:     '#E8E8E8',   silver:    '#B8C5D6',
  gold:      '#FFC83D',   goldDark:  '#C99526',
  cherry:    '#E33B3B',   cream:     '#FFF1D6',
  bun:       '#F4B870',   crustDark: '#A86824',
};

const _se = (fill, sw = 1.5, opacity = 1) => ({
  fill, stroke: SE_K, strokeWidth: sw, opacity,
  strokeLinecap: 'round', strokeLinejoin: 'round',
});
const _noStroke = (fill, opacity = 1) => ({ fill, opacity });

const SE_ICONS = [
  // ─── Travel ──────────────────────────────────────────────
  { id: 'globe', cat: 'Travel', color: 'cyan', label: 'World', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="24" r="18" {..._se(p.ocean)} />
      <path d="M10 17 Q14 13 19 14 Q21 18 19 22 Q14 23 11 21 Z" {..._se(p.grass, 1.2)} />
      <path d="M26 13 Q32 14 33 17 Q31 21 26 19 Z" {..._se(p.grass, 1.2)} />
      <path d="M23 28 Q31 27 35 30 Q34 36 26 37 Q21 33 23 28 Z" {..._se(p.grass, 1.2)} />
      <ellipse cx="15" cy="14" rx="3.5" ry="2" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'plane', cat: 'Travel', color: 'cyan', label: 'Flight', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 28 L24 8 L42 28 L26 24 L26 38 L22 38 L22 24 Z" {..._se('#FFFFFF')} />
      <path d="M4 28 L22 30 L22 24 Z" {..._se(p.silver, 1.2)} />
      <path d="M42 28 L26 30 L26 24 Z" {..._se(p.silver, 1.2)} />
      <circle cx="24" cy="14" r="2.5" {..._se(p.sky, 1.2)} />
      <path d="M22 38 L20 42 L28 42 L26 38" {..._se(T.red, 1.2)} />
    </>);
  }},
  { id: 'suitcase', cat: 'Travel', color: 'yellow', label: 'Suitcase', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <rect x="6" y="16" width="36" height="26" rx="3" {..._se(p.tan)} />
      <path d="M18 16 L18 12 Q18 8 22 8 L26 8 Q30 8 30 12 L30 16" {..._se('none')} />
      <rect x="6" y="22" width="36" height="3" {..._se(p.crustDark, 1.2)} />
      <rect x="20" y="13" width="8" height="3" rx="1" {..._se(p.gold, 1.2)} />
      <rect x="9" y="32" width="5" height="3" {..._se(p.cherry, 1)} />
      <rect x="35" y="36" width="4" height="3" {..._se(T.cyan, 1)} />
    </>);
  }},
  { id: 'camera', cat: 'Travel', color: 'pink', label: 'Camera', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <rect x="4" y="14" width="40" height="26" rx="3" {..._se(p.choc)} />
      <rect x="16" y="8" width="14" height="8" rx="2" {..._se(p.choc, 1.2)} />
      <circle cx="24" cy="27" r="10" {..._se(p.silver)} />
      <circle cx="24" cy="27" r="6" {..._se('#0C0C0C', 1.2)} />
      <circle cx="22" cy="25" r="2" {..._noStroke('#FFFFFF', 0.7)} />
      <circle cx="38" cy="20" r="2" {..._se(T.red, 1.2)} />
    </>);
  }},
  { id: 'mountain', cat: 'Travel', color: 'lime', label: 'Mountains', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="36" cy="14" r="4" {..._se(p.gold, 1.2)} />
      <path d="M4 40 L18 14 L26 28 L36 12 L44 40 Z" {..._se(p.silver)} />
      <path d="M14 23 L18 14 L22 23 Z" {..._se('#FFFFFF', 1.2)} />
      <path d="M33 19 L36 12 L39 19 Z" {..._se('#FFFFFF', 1.2)} />
    </>);
  }},

  // ─── Food (richer set — referencing 🥮 style) ────────────
  { id: 'pastry', cat: 'Food', color: 'yellow', label: 'Pastry', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="24" r="18" {..._se(p.tan)} />
      <circle cx="24" cy="24" r="13" {..._se(p.pastry, 1.2)} />
      <circle cx="24" cy="24" r="3.5" {..._se(p.tan, 1.2)} />
      <circle cx="17" cy="19" r="1.6" {..._noStroke(p.tan)} />
      <circle cx="31" cy="19" r="1.6" {..._noStroke(p.tan)} />
      <circle cx="17" cy="29" r="1.6" {..._noStroke(p.tan)} />
      <circle cx="31" cy="29" r="1.6" {..._noStroke(p.tan)} />
      <circle cx="24" cy="15" r="1.6" {..._noStroke(p.tan)} />
      <circle cx="24" cy="33" r="1.6" {..._noStroke(p.tan)} />
      <ellipse cx="18" cy="16" rx="4" ry="2" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'coffee', cat: 'Food', color: 'yellow', label: 'Coffee', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M14 6 Q17 10 14 14" {..._se('none', 1.5)} stroke={p.steam} />
      <path d="M22 4 Q25 9 22 14" {..._se('none', 1.5)} stroke={p.steam} />
      <path d="M30 6 Q33 10 30 14" {..._se('none', 1.5)} stroke={p.steam} />
      <ellipse cx="24" cy="42" rx="18" ry="3" {..._se('#FFFFFF', 1.2)} />
      <path d="M10 18 L36 18 L33 38 Q33 42 24 42 Q15 42 15 38 Z" {..._se('#FFFFFF')} />
      <ellipse cx="23" cy="20" rx="11" ry="2.5" {..._se(p.choc, 1.2)} />
      <path d="M36 22 Q42 22 42 28 Q42 34 36 34" {..._se('none')} />
      <ellipse cx="14" cy="24" rx="1.5" ry="3" {..._noStroke('#FFFFFF', 0.6)} />
    </>);
  }},
  { id: 'pizza', cat: 'Food', color: 'red', label: 'Pizza', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 4 L8 38 Q24 44 40 38 Z" {..._se(p.bun)} />
      <path d="M8 38 Q24 44 40 38" {..._se(p.tan, 1.5)} />
      <ellipse cx="20" cy="20" rx="2.5" ry="2.5" {..._se(T.red, 1.2)} />
      <ellipse cx="28" cy="22" rx="2.5" ry="2.5" {..._se(T.red, 1.2)} />
      <ellipse cx="18" cy="30" rx="2.5" ry="2.5" {..._se(T.red, 1.2)} />
      <ellipse cx="30" cy="32" rx="2.5" ry="2.5" {..._se(T.red, 1.2)} />
      <path d="M22 14 Q24 16 26 14" {..._se(p.deepGreen, 1.2)} />
      <path d="M24 26 Q26 28 28 26" {..._se(p.deepGreen, 1.2)} />
    </>);
  }},
  { id: 'croissant', cat: 'Food', color: 'yellow', label: 'Croissant', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M8 24 Q8 8 24 8 Q40 8 40 24 Q40 32 30 32 Q26 28 22 32 Q18 28 14 32 Q8 32 8 24 Z" {..._se(p.bun)} />
      <path d="M12 22 Q12 14 24 12" {..._se('none', 1.2)} />
      <path d="M16 24 Q18 18 26 16" {..._se('none', 1.2)} />
      <path d="M20 26 Q22 22 30 20" {..._se('none', 1.2)} />
      <path d="M24 28 Q28 26 34 24" {..._se('none', 1.2)} />
      <ellipse cx="16" cy="14" rx="4" ry="2" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'iceCream', cat: 'Food', color: 'pink', label: 'Ice cream', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="20" cy="14" r="8" {..._se(p.creamPink)} />
      <circle cx="28" cy="14" r="8" {..._se('#FFFFFF')} />
      <circle cx="24" cy="8" r="2" {..._se(T.red, 1.2)} />
      <path d="M14 20 L24 44 L34 20 Z" {..._se(p.bun)} />
      <line x1="18" y1="26" x2="22" y2="32" {..._se('none', 1)} stroke={p.tan} />
      <line x1="24" y1="26" x2="24" y2="34" {..._se('none', 1)} stroke={p.tan} />
      <line x1="30" y1="26" x2="26" y2="32" {..._se('none', 1)} stroke={p.tan} />
      <ellipse cx="18" cy="12" rx="2" ry="1.5" {..._noStroke('#FFFFFF', 0.7)} />
    </>);
  }},
  { id: 'cake', cat: 'Food', color: 'pink', label: 'Cake', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      {/* candle + flame */}
      <ellipse cx="24" cy="6" rx="1.5" ry="3" {..._se(p.gold, 1.2)} />
      <line x1="24" y1="10" x2="24" y2="14" {..._se('none', 2)} stroke="#FFFFFF" />
      {/* top tier */}
      <ellipse cx="24" cy="14" rx="12" ry="2" {..._se(T.pink, 1.2)} />
      <rect x="12" y="14" width="24" height="6" {..._se(T.pink, 1.2)} />
      <path d="M12 16 Q16 20 20 16 T28 16 T36 16" {..._se('none', 1.2)} stroke={SE_K} />
      {/* bottom tier */}
      <ellipse cx="24" cy="22" rx="16" ry="2" {..._se(p.cream, 1.2)} />
      <rect x="8" y="22" width="32" height="16" rx="2" {..._se(p.cream)} />
      <path d="M8 24 Q14 28 20 24 T32 24 T40 24" {..._se('none', 1.2)} stroke={T.pink} />
      <circle cx="14" cy="32" r="1.5" {..._noStroke(T.red)} />
      <circle cx="24" cy="34" r="1.5" {..._noStroke(T.red)} />
      <circle cx="34" cy="32" r="1.5" {..._noStroke(T.red)} />
    </>);
  }},
  { id: 'donut', cat: 'Food', color: 'pink', label: 'Donut', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="24" r="18" {..._se(p.bun)} />
      <circle cx="24" cy="24" r="5" {..._se('#FFF6E5', 1.2)} />
      <path d="M24 6 Q34 8 38 18 Q40 26 32 36 Q26 40 18 40 Q10 36 8 26 Q8 18 14 12 Q20 6 24 6 Z" {..._se(T.pink, 1.2)} />
      <circle cx="24" cy="24" r="6" {..._se('#FFF6E5', 1.2)} />
      <line x1="14" y1="14" x2="18" y2="13" {..._se('none', 2)} stroke={T.yellow} />
      <line x1="34" y1="14" x2="32" y2="11" {..._se('none', 2)} stroke={T.cyan} />
      <line x1="36" y1="30" x2="40" y2="32" {..._se('none', 2)} stroke={T.lime} />
      <line x1="10" y1="28" x2="14" y2="30" {..._se('none', 2)} stroke={T.blue} />
      <line x1="20" y1="36" x2="24" y2="38" {..._se('none', 2)} stroke={T.yellow} />
    </>);
  }},
  { id: 'burger', cat: 'Food', color: 'red', label: 'Burger', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M6 20 Q24 6 42 20 L42 24 L6 24 Z" {..._se(p.bun)} />
      <ellipse cx="14" cy="14" rx="1.5" ry="1" {..._noStroke('#FFFFFF', 0.7)} />
      <ellipse cx="22" cy="11" rx="1.5" ry="1" {..._noStroke('#FFFFFF', 0.7)} />
      <ellipse cx="32" cy="13" rx="1.5" ry="1" {..._noStroke('#FFFFFF', 0.7)} />
      <path d="M6 24 Q24 28 42 24 L42 28 Q24 31 6 28 Z" {..._se(p.deepGreen, 1.2)} />
      <path d="M6 28 Q24 32 42 28 L42 33 Q24 35 6 33 Z" {..._se(p.crustDark, 1.2)} />
      <path d="M6 33 Q24 36 42 33 L42 38 Q42 40 38 40 L10 40 Q6 40 6 38 Z" {..._se(p.bun)} />
    </>);
  }},
  { id: 'wine', cat: 'Food', color: 'pink', label: 'Wine', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M12 6 L36 6 L33 22 Q30 26 24 26 Q18 26 15 22 Z" {..._se(T.red)} />
      <path d="M14 10 L34 10" {..._se('none', 1)} stroke={p.crustDark} />
      <ellipse cx="19" cy="16" rx="3" ry="2" {..._noStroke('#FFFFFF', 0.4)} />
      <line x1="24" y1="26" x2="24" y2="42" {..._se('none', 1.5)} />
      <line x1="14" y1="42" x2="34" y2="42" {..._se('none', 1.5)} />
    </>);
  }},

  // ─── Adventure ───────────────────────────────────────────
  { id: 'tent', cat: 'Adventure', color: 'red', label: 'Camping', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 40 L24 8 L44 40 Z" {..._se(T.red)} />
      <path d="M24 8 L24 40" {..._se('none', 1.2)} />
      <path d="M20 40 L24 28 L28 40 Z" {..._se(p.gold, 1.2)} />
      <path d="M12 20 L24 16" {..._se('none', 1)} stroke="#0C0C0C" opacity="0.3" />
      <path d="M36 20 L24 16" {..._se('none', 1)} stroke="#0C0C0C" opacity="0.3" />
    </>);
  }},
  { id: 'bolt', cat: 'Adventure', color: 'yellow', label: 'Lightning', draw: T => {
    return (<>
      <path d="M26 4 L10 26 L20 26 L18 44 L36 20 L26 20 Z" {..._se(T.yellow)} />
      <path d="M26 4 L18 14" {..._se('none', 1.2)} stroke="#FFFFFF" opacity="0.7" />
    </>);
  }},
  { id: 'flame', cat: 'Adventure', color: 'red', label: 'Fire', draw: T => {
    return (<>
      <path d="M24 4 Q14 14 14 26 Q14 38 24 42 Q34 38 34 26 Q34 18 28 12 Q28 22 24 22 Q24 14 24 4 Z" {..._se(T.red)} />
      <path d="M24 28 Q19 30 19 34 Q19 38 24 40 Q29 38 29 34 Q29 30 24 28 Z" {..._se(T.yellow)} />
      <ellipse cx="20" cy="20" rx="1.5" ry="2" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'wave', cat: 'Adventure', color: 'cyan', label: 'Surf', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 22 Q12 14 20 22 T36 22 T44 22 L44 40 L4 40 Z" {..._se(p.ocean)} />
      <path d="M4 30 Q12 26 20 30 T36 30 T44 30" {..._se('none', 1.2)} stroke={p.sky} />
      <path d="M4 36 Q12 33 20 36 T36 36 T44 36" {..._se('none', 1.2)} stroke="#FFFFFF" opacity="0.7" />
      <circle cx="36" cy="14" r="3" {..._se('#FFFFFF', 1.2)} />
    </>);
  }},
  { id: 'bike', cat: 'Adventure', color: 'lime', label: 'Bike', draw: T => {
    return (<>
      <circle cx="12" cy="32" r="8" {..._se(T.lime)} />
      <circle cx="12" cy="32" r="3" {..._se('#FFFFFF', 1)} />
      <circle cx="36" cy="32" r="8" {..._se(T.lime)} />
      <circle cx="36" cy="32" r="3" {..._se('#FFFFFF', 1)} />
      <path d="M12 32 L22 20 L34 20 L36 32" {..._se('none', 1.5)} />
      <path d="M16 20 L26 20" {..._se('none', 1.5)} />
      <line x1="22" y1="20" x2="20" y2="12" {..._se('none', 1.5)} />
      <circle cx="20" cy="11" r="1.5" {..._se(T.red, 1)} />
    </>);
  }},

  // ─── Wellness ────────────────────────────────────────────
  { id: 'sun', cat: 'Wellness', color: 'yellow', label: 'Sun', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <line x1="24" y1="4" x2="24" y2="11" {..._se('none', 2.5)} />
      <line x1="24" y1="37" x2="24" y2="44" {..._se('none', 2.5)} />
      <line x1="4" y1="24" x2="11" y2="24" {..._se('none', 2.5)} />
      <line x1="37" y1="24" x2="44" y2="24" {..._se('none', 2.5)} />
      <line x1="10" y1="10" x2="14" y2="14" {..._se('none', 2.5)} />
      <line x1="34" y1="34" x2="38" y2="38" {..._se('none', 2.5)} />
      <line x1="38" y1="10" x2="34" y2="14" {..._se('none', 2.5)} />
      <line x1="14" y1="34" x2="10" y2="38" {..._se('none', 2.5)} />
      <circle cx="24" cy="24" r="10" {..._se(T.yellow)} />
      <circle cx="20" cy="21" r="1.5" {..._noStroke(SE_K)} />
      <circle cx="28" cy="21" r="1.5" {..._noStroke(SE_K)} />
      <path d="M20 27 Q24 30 28 27" {..._se('none', 1.5)} />
      <circle cx="17" cy="26" r="1.5" {..._noStroke(p.cherry, 0.6)} />
      <circle cx="31" cy="26" r="1.5" {..._noStroke(p.cherry, 0.6)} />
    </>);
  }},
  { id: 'moon', cat: 'Wellness', color: 'blue', label: 'Moon', draw: T => {
    return (<>
      <path d="M32 6 Q14 8 14 24 Q14 40 32 42 Q22 32 22 24 Q22 16 32 6 Z" {..._se('#FFFFFF')} />
      <circle cx="26" cy="14" r="1.6" {..._noStroke('#0C0C0C', 0.18)} />
      <circle cx="28" cy="22" r="1.6" {..._noStroke('#0C0C0C', 0.18)} />
      <circle cx="26" cy="32" r="1.4" {..._noStroke('#0C0C0C', 0.18)} />
    </>);
  }},
  { id: 'leaf', cat: 'Wellness', color: 'lime', label: 'Leaf', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M8 40 Q4 16 24 8 Q44 16 40 40 Q24 36 8 40 Z" {..._se(p.grass)} />
      <path d="M8 40 Q24 24 40 12" {..._se('none', 1.5)} stroke={p.deepGreen} />
      <path d="M14 32 Q20 26 18 22" {..._se('none', 1)} stroke={p.deepGreen} />
      <path d="M22 36 Q28 26 28 20" {..._se('none', 1)} stroke={p.deepGreen} />
      <path d="M30 36 Q34 28 36 22" {..._se('none', 1)} stroke={p.deepGreen} />
    </>);
  }},
  { id: 'flower', cat: 'Wellness', color: 'pink', label: 'Flower', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="9" r="6" {..._se(T.pink)} />
      <circle cx="36" cy="19" r="6" {..._se(T.pink)} />
      <circle cx="32" cy="33" r="6" {..._se(T.pink)} />
      <circle cx="16" cy="33" r="6" {..._se(T.pink)} />
      <circle cx="12" cy="19" r="6" {..._se(T.pink)} />
      <circle cx="24" cy="22" r="6" {..._se(T.yellow)} />
      <circle cx="22" cy="20" r="1.5" {..._noStroke('#FFFFFF', 0.7)} />
    </>);
  }},
  { id: 'drop', cat: 'Wellness', color: 'cyan', label: 'Water', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 4 Q12 20 12 30 Q12 40 24 44 Q36 40 36 30 Q36 20 24 4 Z" {..._se(p.ocean)} />
      <ellipse cx="19" cy="20" rx="3" ry="5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Social ──────────────────────────────────────────────
  { id: 'heart', cat: 'Social', color: 'red', label: 'Heart', draw: T => {
    return (<>
      <path d="M24 42 Q4 28 4 16 Q4 8 12 8 Q18 8 24 16 Q30 8 36 8 Q44 8 44 16 Q44 28 24 42 Z" {..._se(T.red)} />
      <ellipse cx="14" cy="14" rx="3" ry="2" {..._noStroke('#FFFFFF', 0.6)} />
    </>);
  }},
  { id: 'gift', cat: 'Social', color: 'cyan', label: 'Gift', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <rect x="6" y="22" width="36" height="18" rx="2" {..._se(T.cyan)} />
      <rect x="6" y="16" width="36" height="6" rx="1" {..._se(T.yellow)} />
      <rect x="20" y="16" width="8" height="24" {..._se(T.red)} />
      <path d="M24 16 Q14 12 16 6 Q20 4 24 14 Q28 4 32 6 Q34 12 24 16" {..._se(T.red)} />
      <circle cx="24" cy="13" r="1.5" {..._noStroke(p.gold)} />
    </>);
  }},
  { id: 'balloon', cat: 'Social', color: 'pink', label: 'Balloon', draw: T => {
    return (<>
      <ellipse cx="24" cy="18" rx="12" ry="14" {..._se(T.pink)} />
      <ellipse cx="20" cy="14" rx="3" ry="4" {..._noStroke('#FFFFFF', 0.6)} />
      <path d="M22 32 L20 36 L28 36 L26 32 Z" {..._se(T.pink)} />
      <path d="M24 36 Q22 40 24 44" {..._se('none', 1.5)} />
    </>);
  }},
  { id: 'music', cat: 'Social', color: 'blue', label: 'Music', draw: T => {
    return (<>
      <ellipse cx="14" cy="36" rx="6" ry="5" transform="rotate(-15 14 36)" {..._se(T.blue)} />
      <ellipse cx="36" cy="32" rx="6" ry="5" transform="rotate(-15 36 32)" {..._se(T.blue)} />
      <line x1="18" y1="34" x2="40" y2="30" {..._se('none', 3)} />
      <line x1="18" y1="34" x2="18" y2="10" {..._se('none', 3)} />
      <line x1="40" y1="30" x2="40" y2="6" {..._se('none', 3)} />
      <path d="M18 10 L40 6 L40 14 L18 18 Z" {..._se(T.blue)} />
      <ellipse cx="12" cy="34" rx="2" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'speech', cat: 'Social', color: 'cyan', label: 'Chat', draw: T => {
    return (<>
      <path d="M6 10 Q6 6 10 6 L38 6 Q42 6 42 10 L42 28 Q42 32 38 32 L18 32 L10 42 L10 32 Q6 32 6 28 Z" {..._se(T.cyan)} />
      <circle cx="16" cy="20" r="2" {..._noStroke(SE_K)} />
      <circle cx="24" cy="20" r="2" {..._noStroke(SE_K)} />
      <circle cx="32" cy="20" r="2" {..._noStroke(SE_K)} />
      <ellipse cx="14" cy="12" rx="4" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Special ─────────────────────────────────────────────
  { id: 'star', cat: 'Special', color: 'yellow', label: 'Star', draw: T => {
    return (<>
      <path d="M24 4 L29 18 L44 19 L33 28 L37 42 L24 34 L11 42 L15 28 L4 19 L19 18 Z" {..._se(T.yellow)} />
      <path d="M18 14 L24 10" {..._se('none', 2)} stroke="#FFFFFF" opacity="0.7" />
    </>);
  }},
  { id: 'crown', cat: 'Special', color: 'yellow', label: 'Crown', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 16 L12 28 L18 12 L24 24 L30 12 L36 28 L44 16 L44 38 L4 38 Z" {..._se(p.gold)} />
      <rect x="4" y="34" width="40" height="4" {..._se(p.goldDark, 1.2)} />
      <circle cx="4" cy="16" r="2.5" {..._se(T.red, 1.2)} />
      <circle cx="44" cy="16" r="2.5" {..._se(T.red, 1.2)} />
      <circle cx="24" cy="24" r="2.5" {..._se(T.blue, 1.2)} />
      <circle cx="18" cy="34" r="1.5" {..._noStroke('#FFFFFF', 0.6)} />
    </>);
  }},
  { id: 'diamond', cat: 'Special', color: 'cyan', label: 'Diamond', draw: T => {
    return (<>
      <path d="M16 8 L32 8 L42 20 L24 42 L6 20 Z" {..._se(T.cyan)} />
      <path d="M16 8 L24 20 L32 8 Z" {..._se('#FFFFFF', 1.2)} />
      <line x1="6" y1="20" x2="42" y2="20" {..._se('none', 1.2)} />
      <line x1="16" y1="8" x2="24" y2="20" {..._se('none', 1)} />
      <line x1="32" y1="8" x2="24" y2="20" {..._se('none', 1)} />
      <ellipse cx="20" cy="13" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.7)} />
    </>);
  }},
  { id: 'trophy', cat: 'Special', color: 'yellow', label: 'Trophy', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M14 8 L34 8 L34 22 Q34 30 24 30 Q14 30 14 22 Z" {..._se(p.gold)} />
      <path d="M14 12 Q6 12 6 18 Q6 24 14 22" {..._se('none', 1.5)} />
      <path d="M34 12 Q42 12 42 18 Q42 24 34 22" {..._se('none', 1.5)} />
      <line x1="24" y1="30" x2="24" y2="38" {..._se('none', 2)} />
      <rect x="14" y="38" width="20" height="4" {..._se(p.goldDark)} />
      <path d="M18 12 L20 22" {..._se('none', 1)} stroke="#FFFFFF" opacity="0.6" />
    </>);
  }},
  { id: 'rainbow', cat: 'Special', color: 'pink', label: 'Rainbow', draw: T => {
    return (<>
      <path d="M4 36 Q4 14 24 14 Q44 14 44 36" {..._se('none', 4)} stroke={T.red} />
      <path d="M9 36 Q9 19 24 19 Q39 19 39 36" {..._se('none', 4)} stroke={T.yellow} />
      <path d="M14 36 Q14 24 24 24 Q34 24 34 36" {..._se('none', 4)} stroke={T.lime} />
      <path d="M19 36 Q19 29 24 29 Q29 29 29 36" {..._se('none', 4)} stroke={T.cyan} />
      <circle cx="6" cy="38" r="3" {..._se('#FFFFFF', 1.2)} />
      <circle cx="42" cy="38" r="3" {..._se('#FFFFFF', 1.2)} />
    </>);
  }},

  // ─── Travel — extras ─────────────────────────────────────
  { id: 'passport', cat: 'Travel', color: 'red', label: 'Passport', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <rect x="11" y="6" width="26" height="36" rx="2" {..._se(T.red)} />
      <rect x="11" y="6" width="26" height="3" {..._se(p.cherry, 1.2)} />
      <circle cx="24" cy="20" r="5" {..._se(p.gold, 1.2)} />
      <circle cx="24" cy="20" r="2" {..._se(p.goldDark, 1)} />
      <line x1="16" y1="32" x2="32" y2="32" {..._se('none', 1.5)} stroke="#FFFFFF" />
      <line x1="18" y1="36" x2="30" y2="36" {..._se('none', 1.5)} stroke="#FFFFFF" />
    </>);
  }},
  { id: 'map', cat: 'Travel', color: 'lime', label: 'World map', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 12 L18 8 L30 12 L44 8 L44 36 L30 40 L18 36 L4 40 Z" {..._se(p.cream)} />
      <path d="M4 12 L18 8 L18 36 L4 40 Z" {..._se(p.grass, 1.2)} />
      <path d="M30 12 L44 8 L44 36 L30 40 Z" {..._se(p.sky, 1.2)} />
      <line x1="18" y1="8" x2="18" y2="36" {..._se('none', 1)} />
      <line x1="30" y1="12" x2="30" y2="40" {..._se('none', 1)} />
      <path d="M22 20 Q24 18 26 20 Q26 24 24 26 Q22 24 22 20 Z" {..._se(T.red, 1.2)} />
    </>);
  }},

  // ─── Food — extras ───────────────────────────────────────
  { id: 'plate', cat: 'Food', color: 'cyan', label: 'Dining', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="28" r="14" {..._se('#FFFFFF')} />
      <circle cx="24" cy="28" r="9" {..._se(p.cream, 1.2)} />
      <ellipse cx="20" cy="22" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.6)} />
      <line x1="9" y1="6" x2="9" y2="20" {..._se('none', 3)} stroke={p.silver} />
      <line x1="6" y1="6" x2="6" y2="12" {..._se('none', 2)} stroke={p.silver} />
      <line x1="12" y1="6" x2="12" y2="12" {..._se('none', 2)} stroke={p.silver} />
      <path d="M38 6 Q42 8 42 16 Q42 22 38 22 Z" {..._se(p.silver)} />
      <line x1="38" y1="22" x2="38" y2="42" {..._se('none', 2.5)} stroke={p.silver} />
    </>);
  }},

  // ─── Culture — theater, arts ─────────────────────────────
  { id: 'masks', cat: 'Culture', color: 'pink', label: 'Theater', draw: T => {
    return (<>
      <path d="M8 10 Q8 6 12 6 L24 6 L24 42 Q8 38 8 26 Z" {..._se(T.pink)} />
      <path d="M24 6 L36 6 Q40 6 40 10 L40 26 Q40 38 24 42 Z" {..._se(T.cyan)} />
      <circle cx="16" cy="18" r="2" {..._noStroke(SE_K)} />
      <circle cx="32" cy="18" r="2" {..._noStroke(SE_K)} />
      <path d="M13 28 Q19 34 24 30" {..._se('none', 2)} />
      <path d="M24 30 Q29 24 35 28" {..._se('none', 2)} />
      <ellipse cx="14" cy="12" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
      <ellipse cx="34" cy="12" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'palette', cat: 'Culture', color: 'yellow', label: 'Arts', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 6 Q42 6 42 22 Q42 32 32 32 Q28 32 28 36 Q28 40 24 42 Q6 42 6 24 Q6 6 24 6 Z" {..._se(p.cream)} />
      <circle cx="14" cy="20" r="2.8" {..._se(T.red, 1.2)} />
      <circle cx="22" cy="14" r="2.8" {..._se(T.cyan, 1.2)} />
      <circle cx="30" cy="16" r="2.8" {..._se(T.lime, 1.2)} />
      <circle cx="34" cy="24" r="2.8" {..._se(T.pink, 1.2)} />
      <circle cx="16" cy="30" r="2.8" {..._se(T.blue, 1.2)} />
      <ellipse cx="12" cy="14" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'ticket', cat: 'Culture', color: 'red', label: 'Ticket', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M6 14 L42 14 L42 22 Q38 22 38 26 Q38 30 42 30 L42 38 L6 38 L6 30 Q10 30 10 26 Q10 22 6 22 Z" {..._se(T.red)} />
      <circle cx="24" cy="20" r="0.8" {..._noStroke('#FFFFFF')} />
      <circle cx="24" cy="24" r="0.8" {..._noStroke('#FFFFFF')} />
      <circle cx="24" cy="28" r="0.8" {..._noStroke('#FFFFFF')} />
      <circle cx="24" cy="32" r="0.8" {..._noStroke('#FFFFFF')} />
      <path d="M14 18 L18 18 M14 22 L20 22" {..._se('none', 1.2)} stroke="#FFFFFF" />
      <path d="M28 28 L34 28 M28 32 L32 32" {..._se('none', 1.2)} stroke="#FFFFFF" />
    </>);
  }},

  // ─── Fitness — medal, dumbbell ───────────────────────────
  { id: 'medal', cat: 'Fitness', color: 'yellow', label: 'Medal', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M16 4 L20 16 L13 16 Z" {..._se(T.red)} />
      <path d="M32 4 L35 16 L28 16 Z" {..._se(T.cyan)} />
      <circle cx="24" cy="28" r="12" {..._se(p.gold)} />
      <circle cx="24" cy="28" r="7" {..._se(p.goldDark, 1.2)} />
      <path d="M21 25 L24 32 L27 25" {..._se('none', 1.5)} />
      <ellipse cx="20" cy="22" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'dumbbell', cat: 'Fitness', color: 'blue', label: 'Fitness', draw: T => {
    return (<>
      <rect x="4" y="18" width="6" height="12" rx="1" {..._se(T.blue)} />
      <rect x="10" y="14" width="4" height="20" rx="1" {..._se(T.blue)} />
      <rect x="14" y="22" width="20" height="4" {..._se(T.blue)} />
      <rect x="34" y="14" width="4" height="20" rx="1" {..._se(T.blue)} />
      <rect x="38" y="18" width="6" height="12" rx="1" {..._se(T.blue)} />
      <rect x="6" y="20" width="2" height="3" {..._noStroke('#FFFFFF', 0.5)} />
      <rect x="40" y="20" width="2" height="3" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Learning — education, skills ────────────────────────
  { id: 'bulb', cat: 'Learning', color: 'yellow', label: 'Idea', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <line x1="24" y1="2" x2="24" y2="6" {..._se('none', 2)} stroke={p.gold} />
      <line x1="10" y1="10" x2="13" y2="13" {..._se('none', 2)} stroke={p.gold} />
      <line x1="38" y1="10" x2="35" y2="13" {..._se('none', 2)} stroke={p.gold} />
      <path d="M24 6 Q12 6 12 18 Q12 24 16 28 L16 32 L32 32 L32 28 Q36 24 36 18 Q36 6 24 6 Z" {..._se(T.yellow)} />
      <line x1="17" y1="36" x2="31" y2="36" {..._se('none', 2.5)} stroke={p.silver} />
      <line x1="19" y1="40" x2="29" y2="40" {..._se('none', 2.5)} stroke={p.silver} />
      <ellipse cx="20" cy="14" rx="3" ry="2" {..._noStroke('#FFFFFF', 0.6)} />
    </>);
  }},
  { id: 'gradCap', cat: 'Learning', color: 'blue', label: 'Education', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M14 23 L14 34 Q14 38 24 38 Q34 38 34 34 L34 23" {..._se(p.cream)} />
      <path d="M4 20 L24 12 L44 20 L24 28 Z" {..._se(T.blue)} />
      <line x1="42" y1="20" x2="42" y2="32" {..._se('none', 1.5)} />
      <path d="M40 32 L42 34 L44 32 L42 38 Z" {..._se(p.gold, 1.2)} />
      <ellipse cx="16" cy="19" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'pencil', cat: 'Learning', color: 'yellow', label: 'Skills', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M8 40 L12 30 L34 8 L40 14 L18 36 Z" {..._se(T.yellow)} />
      <path d="M30 12 L36 18" {..._se('none', 1.2)} />
      <path d="M12 30 L18 36" {..._se('none', 1.2)} />
      <path d="M8 40 L14 38 L10 42 Z" {..._se(SE_K, 1.2)} />
      <path d="M34 8 L40 14 L36 6 Z" {..._se(p.cherry, 1.2)} />
    </>);
  }},

  // ─── Career — goals, work ────────────────────────────────
  { id: 'briefcase', cat: 'Career', color: 'blue', label: 'Career', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M18 16 L18 12 Q18 8 22 8 L26 8 Q30 8 30 12 L30 16" {..._se('none', 1.5)} />
      <rect x="6" y="16" width="36" height="24" rx="3" {..._se(p.choc)} />
      <rect x="6" y="22" width="36" height="3" {..._se(p.crustDark, 1.2)} />
      <rect x="20" y="24" width="8" height="3" {..._se(p.gold, 1.2)} />
      <ellipse cx="12" cy="20" rx="3" ry="1.2" {..._noStroke('#FFFFFF', 0.3)} />
    </>);
  }},
  { id: 'target', cat: 'Career', color: 'red', label: 'Goals', draw: T => {
    return (<>
      <circle cx="24" cy="24" r="18" {..._se(T.red)} />
      <circle cx="24" cy="24" r="13" {..._se('#FFFFFF', 1.2)} />
      <circle cx="24" cy="24" r="8" {..._se(T.red, 1.2)} />
      <circle cx="24" cy="24" r="3" {..._se('#FFFFFF', 1.2)} />
      <line x1="6" y1="6" x2="24" y2="24" {..._se('none', 1.5)} stroke={SE_K} opacity="0.4" />
      <path d="M28 22 L36 14 L34 20 L40 18 L32 26 Z" {..._se(T.yellow, 1.2)} />
    </>);
  }},

  // ─── Wellness — lotus, candle ────────────────────────────
  { id: 'lotus', cat: 'Wellness', color: 'pink', label: 'Lotus', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 26 Q10 20 6 22 Q10 30 22 28 Z" {..._se(T.pink)} />
      <path d="M24 26 Q38 20 42 22 Q38 30 26 28 Z" {..._se(T.pink)} />
      <path d="M24 24 Q14 16 14 8 Q24 12 24 22 Z" {..._se(p.creamPink)} />
      <path d="M24 24 Q34 16 34 8 Q24 12 24 22 Z" {..._se(p.creamPink)} />
      <path d="M24 24 Q19 14 24 4 Q29 14 24 24 Z" {..._se(T.pink, 1.2)} />
      <ellipse cx="24" cy="30" rx="6" ry="3" {..._se(T.yellow, 1.2)} />
    </>);
  }},
  { id: 'candle', cat: 'Wellness', color: 'yellow', label: 'Candle', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 4 Q19 9 24 14 Q29 9 24 4 Z" {..._se(T.yellow)} />
      <path d="M24 8 Q22 11 24 14 Q26 11 24 8 Z" {..._noStroke('#FFFFFF', 0.6)} />
      <line x1="24" y1="14" x2="24" y2="18" {..._se('none', 1.5)} stroke={p.choc} />
      <rect x="16" y="18" width="16" height="24" rx="2" {..._se(p.creamPink)} />
      <line x1="16" y1="24" x2="32" y2="24" {..._se('none', 1.2)} />
      <ellipse cx="20" cy="22" rx="2" ry="1" {..._noStroke('#FFFFFF', 0.6)} />
    </>);
  }},

  // ─── Social — relationships, family ──────────────────────
  { id: 'people', cat: 'Social', color: 'cyan', label: 'Friends', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="14" cy="14" r="6" {..._se(p.bun)} />
      <path d="M4 38 Q4 26 14 26 Q24 26 24 38 L24 42 L4 42 Z" {..._se(T.cyan)} />
      <circle cx="34" cy="14" r="6" {..._se(p.tan)} />
      <path d="M24 38 Q24 26 34 26 Q44 26 44 38 L44 42 L24 42 Z" {..._se(T.pink)} />
      <ellipse cx="12" cy="12" rx="2" ry="1.2" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'handshake', cat: 'Social', color: 'yellow', label: 'Connect', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 20 L12 16 L20 20 L24 24 L28 20 L36 16 L44 20 L44 30 L36 32 L28 28 L24 32 L20 28 L12 32 L4 30 Z" {..._se(p.bun)} />
      <line x1="12" y1="16" x2="12" y2="32" {..._se('none', 1.2)} />
      <line x1="36" y1="16" x2="36" y2="32" {..._se('none', 1.2)} />
      <line x1="24" y1="24" x2="24" y2="32" {..._se('none', 1.2)} />
      <ellipse cx="14" cy="22" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.4)} />
      <ellipse cx="34" cy="22" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'family', cat: 'Social', color: 'pink', label: 'Family', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="12" cy="12" r="5" {..._se(p.bun)} />
      <path d="M4 32 Q4 22 12 22 Q20 22 20 32 L20 38 L4 38 Z" {..._se(T.pink)} />
      <circle cx="36" cy="12" r="5" {..._se(p.tan)} />
      <path d="M28 32 Q28 22 36 22 Q44 22 44 32 L44 38 L28 38 Z" {..._se(T.cyan)} />
      <circle cx="24" cy="22" r="3.5" {..._se(p.creamPink)} />
      <path d="M19 34 Q19 28 24 28 Q29 28 29 34 L29 40 L19 40 Z" {..._se(T.yellow)} />
    </>);
  }},

  // ─── Nature — wildlife ───────────────────────────────────
  { id: 'paw', cat: 'Nature', color: 'lime', label: 'Wildlife', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <ellipse cx="12" cy="20" rx="4" ry="5" {..._se(p.tan)} />
      <ellipse cx="36" cy="20" rx="4" ry="5" {..._se(p.tan)} />
      <ellipse cx="19" cy="10" rx="3.5" ry="4.5" {..._se(p.tan)} />
      <ellipse cx="29" cy="10" rx="3.5" ry="4.5" {..._se(p.tan)} />
      <path d="M14 34 Q14 26 24 26 Q34 26 34 34 Q34 42 24 42 Q14 42 14 34 Z" {..._se(p.bun)} />
      <ellipse cx="22" cy="32" rx="2" ry="1" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'tree', cat: 'Nature', color: 'lime', label: 'Tree', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 4 L10 22 L18 22 L8 36 L20 36 L20 44 L28 44 L28 36 L40 36 L30 22 L38 22 Z" {..._se(p.deepGreen)} />
      <path d="M24 4 L18 12 L24 14 Z" {..._noStroke('#FFFFFF', 0.4)} />
      <rect x="20" y="36" width="8" height="8" {..._se(p.choc, 1.2)} />
    </>);
  }},
  { id: 'bird', cat: 'Nature', color: 'cyan', label: 'Animal', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M14 14 Q22 8 30 14 Q38 18 38 28 Q38 36 28 38 L28 42 L24 42 L24 38 Q14 36 12 28 Q10 20 14 14 Z" {..._se(p.sky)} />
      <circle cx="30" cy="20" r="2" {..._noStroke(SE_K)} />
      <circle cx="30.5" cy="19.5" r="0.6" {..._noStroke('#FFFFFF')} />
      <path d="M38 24 L44 22 L40 26 Z" {..._se(p.gold, 1.2)} />
      <path d="M14 18 Q20 16 22 22" {..._se('none', 1)} />
      <ellipse cx="20" cy="14" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Home — lifestyle, cozy ──────────────────────────────
  { id: 'house', cat: 'Home', color: 'red', label: 'Home', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <rect x="6" y="22" width="36" height="18" {..._se(p.cream)} />
      <path d="M4 24 L24 6 L44 24 Z" {..._se(T.red)} />
      <rect x="20" y="28" width="8" height="12" {..._se(p.choc, 1.2)} />
      <circle cx="26" cy="34" r="0.8" {..._noStroke(p.gold)} />
      <rect x="10" y="28" width="6" height="6" {..._se(p.sky, 1.2)} />
      <rect x="32" y="28" width="6" height="6" {..._se(p.sky, 1.2)} />
      <rect x="28" y="10" width="4" height="8" {..._se(p.choc, 1)} />
    </>);
  }},
  { id: 'couch', cat: 'Home', color: 'pink', label: 'Cozy', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M6 22 Q6 18 10 18 L38 18 Q42 18 42 22 L42 28 L6 28 Z" {..._se(p.creamPink)} />
      <rect x="4" y="28" width="40" height="10" rx="2" {..._se(T.pink)} />
      <line x1="10" y1="38" x2="10" y2="42" {..._se('none', 2.5)} stroke={p.choc} />
      <line x1="38" y1="38" x2="38" y2="42" {..._se('none', 2.5)} stroke={p.choc} />
      <line x1="24" y1="28" x2="24" y2="38" {..._se('none', 1.2)} />
      <ellipse cx="14" cy="22" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'mug', cat: 'Home', color: 'cyan', label: 'Cozy mug', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M17 8 Q20 10 17 12" {..._se('none', 1.5)} stroke={p.steam} />
      <path d="M24 6 Q27 9 24 12" {..._se('none', 1.5)} stroke={p.steam} />
      <path d="M31 8 Q34 10 31 12" {..._se('none', 1.5)} stroke={p.steam} />
      <path d="M10 14 L34 14 L32 38 Q32 42 28 42 L16 42 Q12 42 12 38 Z" {..._se(T.cyan)} />
      <ellipse cx="22" cy="17" rx="10" ry="2" {..._se(p.choc, 1.2)} />
      <path d="M34 18 Q42 18 42 26 Q42 32 34 32" {..._se('none')} />
      <ellipse cx="15" cy="22" rx="1.5" ry="3" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Giving — charity, volunteering ──────────────────────
  { id: 'hands', cat: 'Giving', color: 'lime', label: 'Volunteer', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M4 30 Q4 22 12 22 L20 22 Q24 22 24 26 L24 34 Q24 38 20 38 L12 38 Q4 38 4 30 Z" {..._se(p.bun)} />
      <path d="M44 30 Q44 22 36 22 L28 22 Q24 22 24 26 L24 34 Q24 38 28 38 L36 38 Q44 38 44 30 Z" {..._se(p.tan)} />
      <path d="M16 18 Q24 8 32 18 L32 24 L16 24 Z" {..._se(T.red)} />
      <ellipse cx="20" cy="14" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'ribbon', cat: 'Giving', color: 'pink', label: 'Cause', draw: T => {
    return (<>
      <path d="M24 4 Q16 14 16 24 Q16 32 24 42 Q32 32 32 24 Q32 14 24 4 Z" {..._se(T.pink)} />
      <path d="M24 16 L18 32" {..._se('none', 1.5)} />
      <path d="M24 16 L30 32" {..._se('none', 1.5)} />
      <ellipse cx="22" cy="12" rx="2" ry="3" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Spiritual — peace, mindfulness ──────────────────────
  { id: 'peace', cat: 'Spiritual', color: 'blue', label: 'Peace', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="24" r="18" {..._se(p.sky)} />
      <line x1="24" y1="6" x2="24" y2="42" {..._se('none', 2.5)} stroke="#FFFFFF" />
      <line x1="24" y1="24" x2="11" y2="37" {..._se('none', 2.5)} stroke="#FFFFFF" />
      <line x1="24" y1="24" x2="37" y2="37" {..._se('none', 2.5)} stroke="#FFFFFF" />
      <ellipse cx="14" cy="14" rx="4" ry="2" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},
  { id: 'meditate', cat: 'Spiritual', color: 'pink', label: 'Meditate', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="12" r="5" {..._se(p.bun)} />
      <path d="M24 18 Q18 22 18 30 L8 36 Q6 38 8 40 L24 40 L40 40 Q42 38 40 36 L30 30 Q30 22 24 18 Z" {..._se(T.pink)} />
      <circle cx="24" cy="24" r="2" {..._noStroke(T.yellow)} />
      <ellipse cx="22" cy="10" rx="2" ry="1" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Money — finance, savings ────────────────────────────
  { id: 'coin', cat: 'Money', color: 'yellow', label: 'Coin', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <circle cx="24" cy="24" r="18" {..._se(p.gold)} />
      <circle cx="24" cy="24" r="13" {..._se(p.goldDark, 1.2)} />
      <path d="M20 18 L28 18 Q30 18 30 20 Q30 22 28 22 L22 22 Q20 22 20 24 Q20 26 22 26 L28 26 Q30 26 30 28 Q30 30 28 30 L20 30" {..._se('none', 2)} />
      <line x1="24" y1="15" x2="24" y2="33" {..._se('none', 2)} />
      <ellipse cx="18" cy="18" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'piggy', cat: 'Money', color: 'pink', label: 'Savings', draw: T => {
    return (<>
      <path d="M8 24 Q8 14 20 12 L22 8 L26 12 Q40 14 40 24 Q40 32 32 34 L30 40 L26 40 L24 36 L18 36 L16 40 L12 40 L12 32 Q8 28 8 24 Z" {..._se(T.pink)} />
      <circle cx="14" cy="22" r="1.5" {..._noStroke(SE_K)} />
      <ellipse cx="10" cy="24" rx="2.5" ry="1.8" {..._se('none', 1.2)} />
      <line x1="22" y1="14" x2="26" y2="14" {..._se('none', 1.2)} />
      <ellipse cx="22" cy="18" rx="4" ry="2" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'bag', cat: 'Money', color: 'lime', label: 'Wealth', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M16 4 Q16 10 12 14 Q6 20 6 30 Q6 40 16 42 L32 42 Q42 40 42 30 Q42 20 36 14 Q32 10 32 4 Z" {..._se(p.tan)} />
      <line x1="16" y1="4" x2="32" y2="4" {..._se(SE_K, 1.5)} />
      <path d="M22 22 L28 22 Q30 22 30 24 Q30 26 28 26 L24 26 Q22 26 22 28 Q22 30 24 30 L30 30" {..._se('none', 2)} stroke={p.gold} />
      <line x1="26" y1="20" x2="26" y2="32" {..._se('none', 1.5)} stroke={p.gold} />
      <ellipse cx="14" cy="20" rx="2" ry="4" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},

  // ─── Creativity — making, art tools ──────────────────────
  { id: 'brush', cat: 'Creativity', color: 'cyan', label: 'Paintbrush', draw: T => {
    return (<>
      <path d="M30 4 L44 18 L36 26 L22 12 Z" {..._se(T.yellow)} />
      <path d="M22 12 L36 26 L32 30 L18 16 Z" {..._se(T.blue, 1.2)} />
      <path d="M18 16 L32 30 Q26 36 16 36 Q10 36 8 32 Q12 30 14 24 Q16 18 18 16 Z" {..._se(T.cyan)} />
      <ellipse cx="14" cy="32" rx="2" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},

  // ─── Growth — self-improvement, journey ──────────────────
  { id: 'sprout', cat: 'Growth', color: 'lime', label: 'Growth', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 42 L24 22" {..._se('none', 2.5)} stroke={p.deepGreen} />
      <path d="M24 26 Q14 22 10 14 Q18 12 24 22 Z" {..._se(T.lime)} />
      <path d="M24 26 Q34 22 38 14 Q30 12 24 22 Z" {..._se(p.grass)} />
      <rect x="14" y="40" width="20" height="4" {..._se(p.crustDark)} />
      <ellipse cx="16" cy="16" rx="2" ry="1" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
  { id: 'arrowUp', cat: 'Growth', color: 'cyan', label: 'Improve', draw: T => {
    return (<>
      <path d="M6 38 L18 26 L26 34 L40 16" {..._se('none', 3.5)} stroke={T.cyan} />
      <path d="M40 16 L40 24 M40 16 L32 16" {..._se('none', 3)} stroke={T.cyan} />
      <circle cx="6" cy="38" r="2.5" {..._se(T.cyan)} />
      <circle cx="18" cy="26" r="2.5" {..._se(T.cyan)} />
      <circle cx="26" cy="34" r="2.5" {..._se(T.cyan)} />
      <circle cx="40" cy="16" r="2.5" {..._noStroke('#FFFFFF', 0.7)} />
    </>);
  }},
  { id: 'path', cat: 'Growth', color: 'yellow', label: 'Journey', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M14 42 Q14 32 24 32 Q34 32 34 22 Q34 12 24 12 Q14 12 14 6" {..._se('none', 2.5)} stroke={p.tan} />
      <circle cx="14" cy="6" r="3.5" {..._se(T.red)} />
      <circle cx="14" cy="42" r="3.5" {..._se(p.gold)} />
      <circle cx="14" cy="6" r="1" {..._noStroke('#FFFFFF')} />
    </>);
  }},

  // ─── Entertainment — party, celebration ──────────────────
  { id: 'party', cat: 'Entertainment', color: 'pink', label: 'Party', draw: T => {
    return (<>
      <path d="M4 44 L20 18 L30 28 Z" {..._se(T.pink)} />
      <path d="M4 44 L20 18 L14 28 Z" {..._noStroke('#FFFFFF', 0.3)} />
      <circle cx="32" cy="14" r="2" {..._se(T.cyan, 1.2)} />
      <circle cx="40" cy="20" r="2" {..._se(T.yellow, 1.2)} />
      <circle cx="38" cy="32" r="2" {..._se(T.lime, 1.2)} />
      <circle cx="28" cy="8" r="2" {..._se(T.red, 1.2)} />
      <path d="M20 18 L20 10 M20 18 L14 14" {..._se('none', 2)} />
    </>);
  }},
  { id: 'confetti', cat: 'Entertainment', color: 'yellow', label: 'Confetti', draw: T => {
    return (<>
      <rect x="8" y="6" width="4" height="6" {..._se(T.red, 1.2)} transform="rotate(20 10 9)" />
      <rect x="22" y="4" width="4" height="6" {..._se(T.cyan, 1.2)} transform="rotate(-15 24 7)" />
      <rect x="36" y="8" width="4" height="6" {..._se(T.lime, 1.2)} transform="rotate(30 38 11)" />
      <rect x="6" y="22" width="4" height="6" {..._se(T.yellow, 1.2)} transform="rotate(-25 8 25)" />
      <rect x="38" y="22" width="4" height="6" {..._se(T.pink, 1.2)} transform="rotate(40 40 25)" />
      <rect x="14" y="34" width="4" height="6" {..._se(T.blue, 1.2)} transform="rotate(-30 16 37)" />
      <rect x="28" y="36" width="4" height="6" {..._se(T.red, 1.2)} transform="rotate(15 30 39)" />
      <circle cx="22" cy="22" r="2.5" {..._se(T.yellow, 1.2)} />
      <circle cx="30" cy="28" r="2" {..._se(T.pink, 1.2)} />
      <circle cx="16" cy="16" r="2" {..._se(T.cyan, 1.2)} />
    </>);
  }},

  // ─── Language — communication, translate ─────────────────
  { id: 'translate', cat: 'Language', color: 'cyan', label: 'Translate', draw: T => {
    return (<>
      <rect x="4" y="8" width="22" height="18" rx="2" {..._se(T.cyan)} />
      <path d="M11 22 L15 12 L19 22 M12.5 18.5 L17.5 18.5" {..._se('none', 2)} />
      <rect x="22" y="22" width="22" height="18" rx="2" {..._se(T.yellow)} />
      <path d="M27 36 L31 28 L35 36 M40 28 Q42 30 40 32 Q38 30 40 28" {..._se('none', 2)} />
      <path d="M26 22 L24 18 L22 22" {..._se(T.yellow, 1.2)} />
      <ellipse cx="9" cy="12" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.4)} />
    </>);
  }},

  // ─── Milestones — achievement badge ──────────────────────
  { id: 'badge', cat: 'Special', color: 'red', label: 'Badge', draw: T => {
    const p = SE_PIGMENTS;
    return (<>
      <path d="M24 4 L30 10 L38 8 L40 16 L46 20 L40 24 L38 32 L30 30 L24 36 L18 30 L10 32 L8 24 L2 20 L8 16 L10 8 L18 10 Z" {..._se(T.red)} />
      <circle cx="24" cy="20" r="6" {..._se(p.gold)} />
      <path d="M21 19 L23 23 L28 17" {..._se('none', 2)} />
      <ellipse cx="14" cy="12" rx="3" ry="1.5" {..._noStroke('#FFFFFF', 0.5)} />
    </>);
  }},
];

const SE_BY_CAT = SE_ICONS.reduce((acc, icon) => {
  (acc[icon.cat] ||= []).push(icon);
  return acc;
}, {});

// Reusable component identical in shape to StickerIconTile, but draws an
// SE_ICONS entry. Use this anywhere you'd previously drop an emoji.
function StickerEmojiTile({ icon, size = 64, frameColor, tilt = 0, selected = false }) {
  const T = CC_THEME;
  if (!icon) return null;
  const color = frameColor ? T[frameColor] : T[icon.color];
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: color,
      border: selected ? '3px solid #0C0C0C' : '2.5px solid #0C0C0C',
      boxShadow: selected ? '5px 5px 0 #0C0C0C' : '4px 4px 0 #0C0C0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${tilt}deg)`,
      transition: 'transform .15s',
    }}>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48">
        {icon.draw(T)}
      </svg>
    </div>
  );
}

// Full library showcase — stickerbook layout.
function StickerEmojiLibraryShowcase() {
  const T = CC_THEME;
  return (
    <div style={{
      width: '100%', minHeight: '100%', background: T.bg,
      padding: '36px 40px', fontFamily: CC_FONT, color: T.ink, boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 56, fontWeight: 700,
        letterSpacing: -2.2, lineHeight: 0.92, textTransform: 'uppercase',
      }}>STICKER</div>
      <div style={{
        fontFamily: CC_FONT_DISPLAY, fontSize: 56, fontWeight: 700,
        letterSpacing: -2.2, lineHeight: 0.92, textTransform: 'uppercase',
      }}>
        EMOJI <span style={{
          background: T.pink, padding: '0 14px', display: 'inline-block', transform: 'rotate(-2deg)',
          border: '2.5px solid #0C0C0C', boxShadow: '4px 4px 0 #0C0C0C',
        }}>LIBRARY</span>.
      </div>
      <div style={{
        marginTop: 14, fontSize: 14, fontWeight: 500, color: T.inkMuted, lineHeight: 1.45, maxWidth: 580,
      }}>
        {SE_ICONS.length} richly-illustrated icons in the same style as 🥮 and 🌍 — layered colors,
        small highlights, friendly + dimensional. Each pairs with a frame color so it drops straight into
        the picker, item card, or bucket badge. To add more, append to <code style={{
          fontFamily: '"Geist Mono", monospace', background: T.surface,
          padding: '1px 6px', borderRadius: 4, border: '1px solid #0C0C0C',
        }}>SE_ICONS</code> in <code style={{
          fontFamily: '"Geist Mono", monospace', background: T.surface,
          padding: '1px 6px', borderRadius: 4, border: '1px solid #0C0C0C',
        }}>sticker-emoji-icons.jsx</code>.
      </div>

      {Object.entries(SE_BY_CAT).map(([cat, list], i) => (
        <div key={cat} style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              padding: '6px 14px', background: T.ink, color: '#fff',
              border: '2px solid #0C0C0C', boxShadow: '3px 3px 0 #0C0C0C',
              borderRadius: 99, fontFamily: CC_FONT_DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: 0.8,
              transform: i % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)',
              textTransform: 'uppercase',
            }}>· {cat} ·</div>
            <div style={{ flex: 1, borderTop: '2px dashed rgba(12,12,12,0.25)' }} />
            <div style={{
              fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1,
              color: T.inkMuted, textTransform: 'uppercase',
            }}>{list.length} icons</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, alignItems: 'start' }}>
            {list.map((icon, j) => (
              <div key={icon.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <StickerEmojiTile
                  icon={icon}
                  size={80}
                  tilt={(j % 3 === 0 ? -2 : j % 3 === 1 ? 1.5 : 0)}
                />
                <div style={{
                  fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700,
                  letterSpacing: 0.8, color: T.ink, textTransform: 'uppercase', textAlign: 'center',
                  marginTop: 6,
                }}>{icon.label}</div>
                <div style={{
                  fontFamily: '"Geist Mono", monospace', fontSize: 9, color: T.inkMuted,
                }}>{icon.id}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Phone-sized in-app picker using these richer icons.
function CCScreenEmojiPickerCustom({ onClose, onPick }) {
  const T = CC_THEME;
  const [activeCat, setActiveCat] = React.useState('Food');
  const [picked, setPicked] = React.useState(SE_ICONS.find(i => i.id === 'pastry') || SE_ICONS[0]);

  return (
    <div style={{ padding: '0 0 130px', fontFamily: CC_FONT, color: T.ink, background: T.bg, minHeight: '100%' }}>
      <div style={{ padding: '8px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          padding: '8px 14px', background: T.surface, border: '2px solid #0C0C0C',
          boxShadow: '3px 3px 0 #0C0C0C', borderRadius: 12, cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>CANCEL</button>
        <div style={{
          fontFamily: CC_FONT_DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: -0.4,
          textTransform: 'uppercase',
        }}>OUR STICKERS</div>
        <button onClick={() => onPick && onPick(picked)} style={{
          padding: '8px 14px', background: T.ink, color: '#fff',
          border: '2px solid #0C0C0C', boxShadow: '3px 3px 0 #0C0C0C',
          borderRadius: 12, cursor: 'pointer',
          fontFamily: CC_FONT_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
        }}>PICK ↓</button>
      </div>

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
            background: T.pink, padding: '0 10px', display: 'inline-block', transform: 'rotate(-2deg)',
            border: '2px solid #0C0C0C', boxShadow: '3px 3px 0 #0C0C0C',
          }}>STICKER</span>.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 22px 14px', overflowX: 'auto' }}>
        {Object.keys(SE_BY_CAT).map(k => {
          const on = activeCat === k;
          return (
            <div key={k} onClick={() => setActiveCat(k)} style={{
              padding: '6px 12px',
              background: on ? T.ink : T.surface, color: on ? T.bg : T.ink,
              border: '2px solid #0C0C0C',
              boxShadow: on ? '3px 3px 0 #0C0C0C' : '2px 2px 0 rgba(12,12,12,0.15)',
              borderRadius: 99,
              fontFamily: CC_FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
              whiteSpace: 'nowrap', flex: '0 0 auto', cursor: 'pointer',
              textTransform: 'uppercase',
            }}>{k}</div>
          );
        })}
      </div>

      <div style={{
        padding: '4px 22px 0',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
      }}>
        {SE_BY_CAT[activeCat].map((icon, i) => (
          <div key={icon.id} onClick={() => setPicked(icon)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}>
            <StickerEmojiTile
              icon={icon}
              size={92}
              selected={picked.id === icon.id}
              tilt={picked.id === icon.id ? -4 : (i % 3 === 1 ? -1 : i % 3 === 2 ? 1 : 0)}
            />
            <div style={{
              fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700,
              letterSpacing: 0.6, textTransform: 'uppercase',
              color: picked.id === icon.id ? T.ink : T.inkMuted,
            }}>{icon.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        margin: '24px 22px 0', padding: 14,
        background: T.surface, border: '2.5px solid #0C0C0C', boxShadow: '4px 4px 0 #0C0C0C',
        borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <StickerEmojiTile icon={picked} size={64} tilt={-3} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 1,
            textTransform: 'uppercase', color: T.inkMuted,
          }}>PREVIEW</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4,
            color: T.ink, marginTop: 2, textTransform: 'uppercase',
          }}>YOUR NEW THING</div>
          <div style={{
            fontFamily: CC_FONT_DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
            color: T.inkMuted, textTransform: 'uppercase', marginTop: 4,
          }}>{picked.id.toUpperCase()} · FRAME: {picked.color.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SE_ICONS, SE_BY_CAT, SE_PIGMENTS,
  StickerEmojiTile, StickerEmojiLibraryShowcase, CCScreenEmojiPickerCustom,
});
