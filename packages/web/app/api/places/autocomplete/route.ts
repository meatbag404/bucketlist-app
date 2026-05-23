import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy to Google Places Autocomplete API.
// Keeps GOOGLE_API_KEY out of the browser bundle.
//
// Usage: GET /api/places/autocomplete?q=Paris
// Returns: { predictions: [{ description, place_id, main_text, secondary_text }] }

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ predictions: [] })
  }

  const key = process.env.GOOGLE_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'GOOGLE_API_KEY is not configured on the server' },
      { status: 500 }
    )
  }

  // Using the new Places API (v1) — text autocomplete via :autocomplete endpoint
  // Docs: https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
  try {
    const url = `https://places.googleapis.com/v1/places:autocomplete`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({ input: q }),
      // Short timeout — autocomplete should be fast
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const errText = await res.text()
      // Fall back to legacy Places Autocomplete API if v1 fails (e.g. not enabled).
      // The legacy endpoint still works with the same key + Places API enabled.
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&key=${key}`
      const legacyRes = await fetch(legacyUrl)
      if (!legacyRes.ok) {
        return NextResponse.json(
          { error: 'Places API request failed', details: errText.slice(0, 200) },
          { status: res.status }
        )
      }
      const legacyData = await legacyRes.json()
      const predictions = (legacyData.predictions || []).map((p: any) => ({
        description: p.description,
        place_id: p.place_id,
        main_text: p.structured_formatting?.main_text || p.description,
        secondary_text: p.structured_formatting?.secondary_text || '',
      }))
      return NextResponse.json({ predictions })
    }

    const data = await res.json()
    const predictions = (data.suggestions || [])
      .filter((s: any) => s.placePrediction)
      .map((s: any) => {
        const p = s.placePrediction
        return {
          description: p.text?.text || '',
          place_id: p.placeId,
          main_text: p.structuredFormat?.mainText?.text || p.text?.text || '',
          secondary_text: p.structuredFormat?.secondaryText?.text || '',
        }
      })

    return NextResponse.json({ predictions })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Places API call failed', message: err.message },
      { status: 500 }
    )
  }
}
