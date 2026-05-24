import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy to Icons8's public icon search.
// Restricted to the `color` platform (Flat Color) so results match the
// app's curated sticker style.
//
// Usage:  GET /api/icons8/search?q=mountain&offset=0&limit=40
// Returns: { icons: [{ id, name, category }], total: number }

type Icons8Icon = {
  id: string
  name: string
  category?: string
  subcategory?: string
  platform?: string
}

type Icons8SearchResponse = {
  parameters?: { countAll?: number }
  icons?: Icons8Icon[]
}

// Platforms the picker exposes today. Add more by extending this map.
const ALLOWED_PLATFORMS: Record<string, true> = {
  papercut: true,         // Papercut (icons8.com/icons/papercut) — the app's chosen style
}
const DEFAULT_PLATFORM = 'papercut'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  const offset = Math.max(0, Number(req.nextUrl.searchParams.get('offset') ?? '0') || 0)
  const limit = Math.min(60, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? '40') || 40))

  const requestedPlatform = req.nextUrl.searchParams.get('platform')?.trim() ?? ''
  const platform = ALLOWED_PLATFORMS[requestedPlatform] ? requestedPlatform : DEFAULT_PLATFORM

  if (!q || q.length < 2) {
    return NextResponse.json({ icons: [], total: 0 })
  }

  const url = new URL('https://search.icons8.com/api/iconsets/v5/search')
  url.searchParams.set('term', q)
  url.searchParams.set('amount', String(limit))
  url.searchParams.set('offset', String(offset))
  url.searchParams.set('platform', platform)
  url.searchParams.set('language', 'en')

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      // Edge-cache popular queries server-side for 1 hour.
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Icons8 search returned ${res.status}` },
        { status: 502 }
      )
    }
    const data = (await res.json()) as Icons8SearchResponse
    const icons = (data.icons ?? [])
      .filter(i => i.platform === platform)
      .map(i => ({
        id: i.id,
        name: i.name,
        category: i.subcategory || i.category || '',
      }))
    return NextResponse.json({
      icons,
      total: data.parameters?.countAll ?? icons.length,
      platform,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'icons8 search failed' },
      { status: 502 }
    )
  }
}
