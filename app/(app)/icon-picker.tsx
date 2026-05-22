/**
 * Sticker Library — illustrated icon picker modal.
 * Shows only the 73 custom SVG icons (no system emoji).
 * "ALL" view: full scrollable library grouped by section header.
 * Category chips: filter to a single section.
 */
import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, TextInput, Dimensions,
} from 'react-native'
import { sticker, resolveColor } from '../../src/design/sticker'
import { STICKER_LIBRARY, STICKER_CATEGORIES, StickerEntry } from '../../src/data/stickerLibrary'
import { StickerIcon } from '../../src/components/StickerIcon'

interface Props {
  initial?: StickerEntry
  onPick: (s: StickerEntry) => void
  onClose: () => void
}

// ── Grid sizing ──────────────────────────────────────────────────────────────
const SCREEN_W  = Dimensions.get('window').width
const GRID_PAD  = 20
const COL_GAP   = 8
const ROW_GAP   = 14
const CELL_MAX  = 84
const NUM_COLS  = 4

const AVAIL     = SCREEN_W - 2 * GRID_PAD
const CELL_SIZE = Math.min(
  Math.floor((AVAIL - (NUM_COLS - 1) * COL_GAP) / NUM_COLS),
  CELL_MAX
)
const ICON_SIZE = Math.round(CELL_SIZE * 0.54)

// First chip is always "ALL"
const ALL_LABEL = 'ALL'

// ── Reusable icon cell ────────────────────────────────────────────────────────
function IconCell({
  s, isSelected, onPress,
}: {
  s: StickerEntry
  isSelected: boolean
  onPress: () => void
}) {
  const bg = resolveColor(s.c)
  return (
    <TouchableOpacity style={styles.cellWrap} onPress={onPress} activeOpacity={0.8}>
      <View style={[
        styles.cell,
        { backgroundColor: bg },
        isSelected && styles.cellSelected,
        isSelected && { transform: [{ rotate: '-3deg' }] },
      ]}>
        <StickerIcon value={s.e} size={ICON_SIZE} />
      </View>
      <Text style={[styles.cellLabel, isSelected && styles.cellLabelSelected]} numberOfLines={1}>
        {s.label ?? s.e}
      </Text>
    </TouchableOpacity>
  )
}

// ── Section: heading + icon grid ──────────────────────────────────────────────
function CatSection({
  cat, items, picked, onPick,
}: {
  cat: string
  items: StickerEntry[]
  picked: StickerEntry
  onPick: (s: StickerEntry) => void
}) {
  return (
    <View>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionHeadText}>{cat.toUpperCase()}</Text>
        <Text style={styles.sectionHeadCount}>{items.length}</Text>
      </View>
      <View style={styles.grid}>
        {items.map((s, i) => (
          <IconCell
            key={`${s.e}-${i}`}
            s={s}
            isSelected={picked.e === s.e}
            onPress={() => onPick(s)}
          />
        ))}
      </View>
    </View>
  )
}

export default function IconPickerScreen({ initial, onPick, onClose }: Props) {
  const [activeCat, setActiveCat] = useState(ALL_LABEL)
  const [picked, setPicked] = useState<StickerEntry>(
    initial ?? { e: 'star', c: 'yellow', label: 'Star' }
  )
  const [search, setSearch] = useState('')

  const searchLower = search.trim().toLowerCase()

  const isAll       = activeCat === ALL_LABEL
  const isSearching = searchLower.length > 0

  // Flat list of matching icons for search results
  const searchResults: StickerEntry[] = isSearching
    ? Object.values(STICKER_LIBRARY).flat().filter(s =>
        (s.label ?? s.e).toLowerCase().includes(searchLower)
      )
    : []

  // Single-category items (used when a specific category chip is active)
  const singleCatItems: StickerEntry[] = (!isSearching && !isAll)
    ? (STICKER_LIBRARY[activeCat] ?? [])
    : []

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>ICON LIBRARY</Text>
        <TouchableOpacity
          style={styles.pickBtn}
          onPress={() => { onPick(picked); onClose() }}
        >
          <Text style={styles.pickText}>USE IT ↓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Headline */}
        <View style={styles.headline}>
          <View style={styles.headlineRow}>
            <Text style={styles.headlineMain}>PICK </Text>
            <View style={styles.headlineHighlight}>
              <Text style={styles.headlineHighlightText}>AN ICON</Text>
            </View>
          </View>
          <Text style={styles.headlineSub}>73 illustrated icons — tap to preview.</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="SEARCH BY NAME..."
            placeholderTextColor={sticker.inkMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text style={styles.searchClearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips — hidden during search */}
        {!isSearching && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.catScroll}
            contentContainerStyle={styles.catScrollContent}
          >
            {/* ALL chip */}
            <TouchableOpacity
              onPress={() => setActiveCat(ALL_LABEL)}
              style={[styles.catChip, isAll && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, isAll && styles.catChipTextActive]}>
                ALL
              </Text>
            </TouchableOpacity>

            {/* Per-category chips */}
            {STICKER_CATEGORIES.map(cat => {
              const on = activeCat === cat
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCat(cat)}
                  style={[styles.catChip, on && styles.catChipActive]}
                >
                  <Text style={[styles.catChipText, on && styles.catChipTextActive]}>
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}

        {/* ── ALL view: every category with section headers ── */}
        {!isSearching && isAll && (
          Object.entries(STICKER_LIBRARY).map(([cat, items]) => (
            <CatSection
              key={cat}
              cat={cat}
              items={items}
              picked={picked}
              onPick={setPicked}
            />
          ))
        )}

        {/* ── Single-category view ── */}
        {!isSearching && !isAll && (
          <CatSection
            cat={activeCat}
            items={singleCatItems}
            picked={picked}
            onPick={setPicked}
          />
        )}

        {/* ── Search results ── */}
        {isSearching && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionHeadText}>RESULTS</Text>
              <Text style={styles.sectionHeadCount}>{searchResults.length}</Text>
            </View>
            {searchResults.length > 0 ? (
              <View style={styles.grid}>
                {searchResults.map((s, i) => (
                  <IconCell
                    key={`${s.e}-${i}`}
                    s={s}
                    isSelected={picked.e === s.e}
                    onPress={() => setPicked(s)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptySearch}>
                <Text style={styles.emptySearchText}>No icons match "{search}"</Text>
              </View>
            )}
          </>
        )}

        {/* Preview */}
        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>· PREVIEW ·</Text>
          <View style={styles.previewWrapper}>
            <View style={styles.previewShadow} pointerEvents="none" />
            <View style={[styles.previewCard, { backgroundColor: resolveColor(picked.c) }]}>
              <View style={[styles.previewIconBox, { backgroundColor: resolveColor(picked.c) }]}>
                <StickerIcon value={picked.e} size={34} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewTitle}>
                  {(picked.label ?? picked.e).toUpperCase()}
                </Text>
                <Text style={styles.previewMeta}>
                  FRAME: {(picked.c ?? 'yellow').toUpperCase()}
                </Text>
              </View>
              <View style={styles.previewCheck}>
                <Text style={styles.previewCheckText}>SELECTED</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const SHADOW = 3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sticker.bg,
  },

  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: sticker.ink,
  },
  cancelBtn: {
    backgroundColor: sticker.surface,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cancelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.ink,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: sticker.ink,
  },
  pickBtn: {
    backgroundColor: sticker.ink,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pickText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#fff',
  },

  // ── Headline ─────────────────────────────────────────────────────────────────
  headline: {
    paddingHorizontal: GRID_PAD,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headlineMain: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1.5,
    lineHeight: 42,
    color: sticker.ink,
  },
  headlineHighlight: {
    backgroundColor: sticker.pink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 4,
    transform: [{ rotate: '-1.5deg' }],
    marginBottom: 4,
  },
  headlineHighlightText: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1.5,
    lineHeight: 42,
    color: sticker.ink,
  },
  headlineSub: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: sticker.inkMuted,
  },

  // ── Search ───────────────────────────────────────────────────────────────────
  searchBox: {
    marginHorizontal: GRID_PAD,
    marginBottom: 12,
    backgroundColor: sticker.surface,
    borderWidth: 2,
    borderColor: sticker.ink,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.ink,
  },
  searchClearBtn: {
    fontSize: 14,
    color: sticker.inkMuted,
    fontWeight: '700',
  },

  // ── Category chips ────────────────────────────────────────────────────────────
  catScroll: { marginBottom: 4 },
  catScrollContent: {
    paddingHorizontal: GRID_PAD,
    gap: 6,
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: sticker.ink,
    backgroundColor: sticker.surface,
  },
  catChipActive: {
    backgroundColor: sticker.ink,
  },
  catChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: sticker.ink,
  },
  catChipTextActive: {
    color: sticker.bg,
  },

  // ── Section heading ───────────────────────────────────────────────────────────
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: GRID_PAD,
    paddingTop: 14,
    paddingBottom: 10,
    borderTopWidth: 1.5,
    borderTopColor: sticker.ink + '18',
    marginTop: 4,
  },
  sectionHeadText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: sticker.ink,
  },
  sectionHeadCount: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: sticker.inkMuted,
    backgroundColor: sticker.surface,
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: sticker.ink + '30',
    overflow: 'hidden',
  },

  // ── Icon grid ─────────────────────────────────────────────────────────────────
  grid: {
    paddingHorizontal: GRID_PAD,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COL_GAP,
    rowGap: ROW_GAP,
    marginBottom: 8,
  },
  cellWrap: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    borderWidth: 3.5,
    borderColor: sticker.ink,
  },
  cellLabel: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: sticker.inkMuted,
    textAlign: 'center',
    width: CELL_SIZE,
  },
  cellLabelSelected: {
    color: sticker.ink,
    fontWeight: '700',
  },

  // ── Empty search ──────────────────────────────────────────────────────────────
  emptySearch: {
    paddingHorizontal: GRID_PAD,
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 13,
    fontWeight: '600',
    color: sticker.inkMuted,
  },

  // ── Preview ───────────────────────────────────────────────────────────────────
  previewSection: {
    paddingHorizontal: GRID_PAD,
    marginTop: 16,
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: sticker.inkMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  previewWrapper: {
    position: 'relative',
    marginBottom: SHADOW,
    marginRight: SHADOW,
  },
  previewShadow: {
    position: 'absolute',
    top: SHADOW,
    left: SHADOW,
    right: 0,
    bottom: 0,
    backgroundColor: sticker.ink,
    borderRadius: 16,
  },
  previewCard: {
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: sticker.ink,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  previewIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: sticker.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: sticker.ink,
    marginBottom: 3,
  },
  previewMeta: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: sticker.inkMuted,
  },
  previewCheck: {
    backgroundColor: sticker.ink,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  previewCheckText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: sticker.bg,
  },
})
