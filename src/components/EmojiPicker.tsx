import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, ScrollView, SafeAreaView,
} from 'react-native'

const CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: '✈️  Travel',
    emojis: ['✈️','🚂','🚢','🏖️','🗺️','🏔️','🌅','🗼','🏰','🌊','🎡','🎭','🌃','🏝️','🗽','🌋','🎑','🌌','⛵','🏕️'],
  },
  {
    label: '🍴  Food & Drink',
    emojis: ['🍕','🍣','🍜','🌮','🍔','🥘','🍱','🥂','🍰','☕','🍷','🥗','🍦','🍲','🥩','🌯','🧆','🍩','🥐','🍻'],
  },
  {
    label: '⚡  Adventure',
    emojis: ['🏄','🧗','🪂','🎿','🏕️','🤿','🚵','🏹','🎯','🎲','🤸','⛺','🏋️','🎪','🚁','🏇','🛻','⛷️','🥊','🎢'],
  },
  {
    label: '🌿  Wellness',
    emojis: ['🧘','🏃','🌸','🛁','📚','🎨','🎵','🌙','⭐','💫','🔮','🌺','🍃','🕯️','🌻','🧁','🌿','🍀','☀️','🫧'],
  },
  {
    label: '💕  Moments',
    emojis: ['❤️','🎉','🎁','🎊','🌈','💌','🏡','🌠','🎶','🎈','📸','🌹','💍','👑','✨','💝','🥳','🎂','🫶','🤩'],
  },
  {
    label: '🐾  Other',
    emojis: ['🐶','🐱','🦁','🦋','🌵','🍄','🔑','🏆','🎸','🎬','🎭','🪩','🤖','👾','🎠','🧩','🪄','💎','🌀','⚗️'],
  },
]

interface Props {
  value: string
  onChange: (emoji: string) => void
  /** If true, show as a compact inline trigger button */
  compact?: boolean
}

export function EmojiPicker({ value, onChange, compact }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TouchableOpacity
        style={compact ? styles.triggerCompact : styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={compact ? styles.triggerEmojiCompact : styles.triggerEmoji}>{value}</Text>
        {!compact && <Text style={styles.triggerHint}>tap to change</Text>}
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pick an emoji</Text>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {CATEGORIES.map(cat => (
              <View key={cat.label} style={styles.catSection}>
                <Text style={styles.catLabel}>{cat.label}</Text>
                <View style={styles.emojiGrid}>
                  {cat.emojis.map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[styles.emojiCell, value === e && styles.emojiCellActive]}
                      onPress={() => { onChange(e); setOpen(false) }}
                    >
                      <Text style={styles.emojiChar}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f7f5f0',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#ddd',
    flexDirection: 'row',
    gap: 8,
  },
  triggerCompact: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f5f0',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  triggerEmoji: { fontSize: 28 },
  triggerEmojiCompact: { fontSize: 24 },
  triggerHint: { fontSize: 12, color: '#bbb' },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 17, fontWeight: '600', color: '#111' },
  doneBtn: { padding: 4 },
  doneBtnText: { fontSize: 16, color: '#BA7517', fontWeight: '600' },
  catSection: { paddingHorizontal: 16, paddingTop: 20 },
  catLabel: { fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 10 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  emojiCell: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  emojiCellActive: { backgroundColor: '#FAEEDA', borderColor: '#BA7517' },
  emojiChar: { fontSize: 28 },
})
