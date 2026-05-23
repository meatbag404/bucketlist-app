'use client'

import { useRouter } from 'next/navigation'
import {
  useViewport,
  T, FONT_DISPLAY, STICKER_BORDER_SM, STICKER_SHADOW_SM,
  Sticker, StickerButton, PageHeading, HighlightBlock,
} from '@bucketlist/shared'

// Placeholder unicode set — when the dedicated icon library lands (Icons8 MCP or
// similar), this screen swaps to render that library instead.
const PREVIEW_EMOJIS = [
  '✨', '🎯', '🌍', '🎬', '📚', '🏔️', '🍕', '🎸',
  '🏋️', '🌊', '🎪', '🚀', '🦁', '🎨', '⛰️', '🎮',
  '🌸', '🎂', '🥐', '☀️', '🍷', '✈️', '🌙', '🏖️',
  '🎤', '☕', '🍩', '🍦', '🍺', '🌮', '🍓', '🌈',
]

export default function IconsPage() {
  const router = useRouter()
  const vp = useViewport()
  const cols = vp === 'mobile' ? 4 : vp === 'tablet' ? 6 : 8

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <StickerButton onClick={() => router.back()}>CANCEL</StickerButton>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.4, textTransform: 'uppercase' }}>STICKERS</div>
        <StickerButton color="ink" onClick={() => router.back()}>DONE</StickerButton>
      </div>

      <PageHeading
        lineA="PICK"
        lineB={<>A <HighlightBlock color="pink">STICKER</HighlightBlock>.</>}
        sub="A dedicated icon library is coming. For now, these unicode emojis are the picks across buckets and items."
        vp={vp}
      />

      <Sticker radius={16} style={{ padding: 22, marginBottom: 22 }}>
        <div style={{
          display: 'grid', gap: vp === 'mobile' ? 10 : 14,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}>
          {PREVIEW_EMOJIS.map((e, i) => {
            const tilt = i % 3 === 1 ? -1.5 : i % 3 === 2 ? 1.5 : 0
            const colorName = (['cyan', 'pink', 'lime', 'yellow', 'blue', 'red'] as const)[i % 6]
            return (
              <div key={e + i} className="emoji" style={{
                width: vp === 'mobile' ? 60 : 78,
                height: vp === 'mobile' ? 60 : 78,
                borderRadius: 14,
                background: (T as any)[colorName],
                border: STICKER_BORDER_SM, boxShadow: STICKER_SHADOW_SM,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: vp === 'mobile' ? '1.6rem' : '2rem', lineHeight: 1,
                transform: `rotate(${tilt}deg)`,
                margin: '0 auto',
              }}>{e}</div>
            )
          })}
        </div>
      </Sticker>

      <Sticker color="cyan" radius={16} style={{ padding: 22 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          color: T.ink, opacity: 0.7, textTransform: 'uppercase', marginBottom: 8,
        }}>HEADS UP</div>
        <p style={{ color: T.ink, fontWeight: 500, lineHeight: 1.5, fontSize: 14 }}>
          The hand-drawn 30-icon sticker library will be wired in once the Icons8 MCP connector is live.
          Until then, this screen previews how the picker will look — and bucket / item icons stay on the unicode set used in the create modals.
        </p>
      </Sticker>
    </div>
  )
}
