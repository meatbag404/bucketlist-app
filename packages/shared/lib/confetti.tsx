// Pure-CSS confetti burst. No library, no canvas — renders ~40 absolutely
// positioned squares/circles that fling outward, rotate, and fade.
//
//   const confetti = useConfetti()
//   confetti.fire()            // burst at viewport center
//   confetti.fire({ x, y })    // burst at a specific point (page coords)
//
//   <ConfettiHost />           // mount once near the top of the app tree

'use client'

import * as React from 'react'
import { T } from './design-tokens'

type Burst = {
  id: number
  x: number
  y: number
  /** ms */
  startedAt: number
}

type ConfettiApi = {
  fire: (opts?: { x?: number; y?: number }) => void
}

const ConfettiContext = React.createContext<ConfettiApi | null>(null)

export function useConfetti(): ConfettiApi {
  const ctx = React.useContext(ConfettiContext)
  return ctx ?? { fire: () => {} }
}

const PALETTE = [T.cyan, T.pink, T.lime, T.yellow, T.blue, T.red, T.ink]
const PARTICLES_PER_BURST = 44
const BURST_LIFETIME_MS = 1700

type Particle = {
  /** stable per-particle so we can compute its motion from time */
  angle: number
  distance: number
  size: number
  color: string
  rotateStart: number
  rotateEnd: number
  shape: 'square' | 'circle'
}

function makeParticles(): Particle[] {
  const arr: Particle[] = []
  for (let i = 0; i < PARTICLES_PER_BURST; i++) {
    // Bias upward — mostly between -135° and -45° in screen coords
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.95)
    arr.push({
      angle,
      distance: 120 + Math.random() * 180,
      size: 6 + Math.random() * 8,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      rotateStart: Math.random() * 360,
      rotateEnd: (Math.random() - 0.5) * 720,
      shape: Math.random() < 0.5 ? 'square' : 'circle',
    })
  }
  return arr
}

export function ConfettiHost({ children }: { children?: React.ReactNode }) {
  const [bursts, setBursts] = React.useState<Burst[]>([])
  const nextId = React.useRef(1)

  const api = React.useMemo<ConfettiApi>(() => ({
    fire: (opts) => {
      const x = opts?.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
      const y = opts?.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
      const id = nextId.current++
      setBursts(prev => [...prev, { id, x, y, startedAt: performance.now() }])
      // Sweep finished bursts after their lifetime so the array stays small.
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id))
      }, BURST_LIFETIME_MS + 100)
    },
  }), [])

  return (
    <ConfettiContext.Provider value={api}>
      {children}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        {bursts.map(burst => <BurstRender key={burst.id} burst={burst} />)}
      </div>
    </ConfettiContext.Provider>
  )
}

function BurstRender({ burst }: { burst: Burst }) {
  // Each burst memoizes its particle set so it doesn't churn on re-renders.
  const particles = React.useMemo(() => makeParticles(), [burst.id])
  return (
    <>
      {particles.map((p, i) => {
        const dx = Math.cos(p.angle) * p.distance
        const dy = Math.sin(p.angle) * p.distance + 220 // gravity-ish drop after burst
        const style: React.CSSProperties = {
          position: 'absolute',
          left: burst.x,
          top: burst.y,
          width: p.size,
          height: p.size,
          background: p.color,
          border: '1.5px solid #0C0C0C',
          borderRadius: p.shape === 'circle' ? 99 : 2,
          // Layered animation: shoot out, rotate, fade.
          // Using CSS @keyframes via inline `<style>` would be cleaner, but
          // keeping it self-contained here with the animation built into the
          // transform/opacity transition.
          animation: `bk-confetti-fly-${burst.id}-${i} ${BURST_LIFETIME_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        }
        return (
          <React.Fragment key={i}>
            <style>{`
              @keyframes bk-confetti-fly-${burst.id}-${i} {
                0%   { transform: translate(-50%, -50%) rotate(${p.rotateStart}deg); opacity: 1; }
                70%  { opacity: 1; }
                100% { transform: translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${p.rotateStart + p.rotateEnd}deg); opacity: 0; }
              }
            `}</style>
            <div style={style} />
          </React.Fragment>
        )
      })}
    </>
  )
}
