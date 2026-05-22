/**
 * LocationPicker — Google Places Autocomplete search modal.
 *
 * Usage:
 *   <LocationPicker
 *     value={location}
 *     onSelect={(name) => setLocation(name)}
 *     onClose={() => setShowPicker(false)}
 *   />
 *
 * Requires EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in your .env
 */

import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Modal, ActivityIndicator, Platform,
} from 'react-native'
import * as ExpoLocation from 'expo-location'

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? ''

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text?: string
  }
}

interface Props {
  value?: string
  onSelect: (placeName: string) => void
  onClose: () => void
}

export function LocationPicker({ value, onSelect, onClose }: Props) {
  // On web, the Google Places REST API is blocked by CORS (browser security policy).
  // We fall back to manual text entry in that case.
  const isWeb = Platform.OS === 'web'
  const [query, setQuery] = useState(value ?? '')
  const [results, setResults] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(!API_KEY || isWeb)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced Places Autocomplete fetch (native only — CORS blocks it on web)
  useEffect(() => {
    if (!API_KEY || isWeb) { setNoKey(true); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
          `?input=${encodeURIComponent(query)}` +
          `&key=${API_KEY}` +
          `&language=en`
        const res = await fetch(url)
        const json = await res.json()
        setResults(json.predictions ?? [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  async function useMyLocation() {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      setLoading(true)
      const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced })
      const { latitude, longitude } = loc.coords

      if (!API_KEY) {
        // Fallback: just store raw coords as text if no API key
        onSelect(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        onClose()
        return
      }

      const url =
        `https://maps.googleapis.com/maps/api/geocode/json` +
        `?latlng=${latitude},${longitude}` +
        `&key=${API_KEY}`
      const res = await fetch(url)
      const json = await res.json()
      const name = json.results?.[0]?.formatted_address
      if (name) { onSelect(name); onClose() }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  function pickPrediction(p: Prediction) {
    onSelect(p.description)
    onClose()
  }

  function clearAndClose() {
    onSelect('')
    onClose()
  }

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📍 Pick a location</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a place…"
              placeholderTextColor="#bbb"
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setResults([]) }}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Manual entry (web) or no API key warning */}
          {noKey && (
            <View style={styles.noKeyBanner}>
              <Text style={styles.noKeyText}>
                {isWeb
                  ? '📍 Type any location name and tap "Use" to set it.'
                  : '⚠️ Set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in your .env to enable autocomplete.\nYou can still type a location manually below.'}
              </Text>
              {query.trim().length > 0 && (
                <TouchableOpacity
                  style={styles.manualBtn}
                  onPress={() => { onSelect(query.trim()); onClose() }}
                >
                  <Text style={styles.manualBtnText}>Use "{query.trim()}"</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Use current location */}
          {Platform.OS !== 'web' && (
            <TouchableOpacity style={styles.gpsRow} onPress={useMyLocation} disabled={loading}>
              <Text style={styles.gpsIcon}>📡</Text>
              <Text style={styles.gpsText}>Use my current location</Text>
            </TouchableOpacity>
          )}

          {/* Loading */}
          {loading && <ActivityIndicator style={{ marginVertical: 12 }} color="#BA7517" />}

          {/* Results */}
          <FlatList
            data={results}
            keyExtractor={item => item.place_id}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultRow} onPress={() => pickPrediction(item)}>
                <Text style={styles.resultIcon}>📍</Text>
                <View style={styles.resultText}>
                  <Text style={styles.resultMain} numberOfLines={1}>
                    {item.structured_formatting.main_text}
                  </Text>
                  {item.structured_formatting.secondary_text ? (
                    <Text style={styles.resultSub} numberOfLines={1}>
                      {item.structured_formatting.secondary_text}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !loading && query.trim().length >= 2 && !noKey ? (
                <Text style={styles.emptyText}>No results found</Text>
              ) : null
            }
          />

          {/* Clear location option */}
          {value ? (
            <TouchableOpacity style={styles.clearLocationBtn} onPress={clearAndClose}>
              <Text style={styles.clearLocationText}>🗑 Remove location</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingBottom: 40,
    maxHeight: '80%',
  },
  handle: {
    width: 40, height: 4, backgroundColor: '#e0e0e0',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#111' },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 12, color: '#666', fontWeight: '700' },

  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f5f5f5', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 15, color: '#111' },
  clearBtn: { color: '#bbb', fontSize: 14 },

  noKeyBanner: {
    backgroundColor: '#FAEEDA', borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 0.5, borderColor: '#BA7517',
  },
  noKeyText: { fontSize: 12, color: '#633806', lineHeight: 18, marginBottom: 8 },
  manualBtn: {
    backgroundColor: '#BA7517', borderRadius: 8,
    padding: 8, alignItems: 'center',
  },
  manualBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  gpsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', marginBottom: 4,
  },
  gpsIcon: { fontSize: 18 },
  gpsText: { fontSize: 14, color: '#534AB7', fontWeight: '500' },

  list: { flexGrow: 0 },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5',
  },
  resultIcon: { fontSize: 16 },
  resultText: { flex: 1 },
  resultMain: { fontSize: 14, color: '#111', fontWeight: '500' },
  resultSub: { fontSize: 12, color: '#999', marginTop: 1 },
  emptyText: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingVertical: 20 },

  clearLocationBtn: {
    marginTop: 12, paddingVertical: 12, alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#f0f0f0',
  },
  clearLocationText: { fontSize: 13, color: '#D4537E' },
})
