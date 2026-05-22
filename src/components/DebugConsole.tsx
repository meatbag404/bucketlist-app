import { useState, useEffect } from 'react'
import {
  View, Text, Modal, ScrollView, TouchableOpacity,
  StyleSheet, Platform, SafeAreaView,
} from 'react-native'
import { supabase } from '../lib/supabase'

type LogEntry = { level: 'log' | 'warn' | 'error'; msg: string; time: string }

const _entries: LogEntry[] = []
let _listeners: Array<() => void> = []

// Guard against recursive loops when the logger itself errors
let _pushing = false

async function pushToSupabase(level: 'warn' | 'error', msg: string) {
  if (_pushing) return
  _pushing = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('device_logs').insert({
      level,
      message: msg.slice(0, 5000), // cap length
      user_id: session?.user?.id ?? null,
      platform: Platform.OS,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    })
  } catch {
    // silently ignore — never throw from inside the logger
  } finally {
    _pushing = false
  }
}

function pushLog(level: LogEntry['level'], ...args: any[]) {
  const msg = args
    .map(a => {
      if (a instanceof Error) return `${a.message}\n${a.stack ?? ''}`
      if (typeof a === 'object' && a !== null) {
        try { return JSON.stringify(a, null, 2) } catch { return String(a) }
      }
      return String(a)
    })
    .join(' ')
  const time = new Date().toLocaleTimeString()
  _entries.push({ level, msg, time })
  if (_entries.length > 500) _entries.splice(0, _entries.length - 500)
  _listeners.forEach(fn => fn())

  // Auto-push errors and warnings to Supabase
  if (level === 'error' || level === 'warn') {
    pushToSupabase(level, msg)
  }
}

// Intercept console — safe to call multiple times (guards against double-init)
if (!(console as any).__debugPatched) {
  const _origLog = console.log.bind(console)
  const _origWarn = console.warn.bind(console)
  const _origError = console.error.bind(console)
  console.log = (...args) => { pushLog('log', ...args); _origLog(...args) }
  console.warn = (...args) => { pushLog('warn', ...args); _origWarn(...args) }
  console.error = (...args) => { pushLog('error', ...args); _origError(...args) }
  ;(console as any).__debugPatched = true
}

export function DebugConsole() {
  const [visible, setVisible] = useState(false)
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const refresh = () => setEntries([..._entries])
    _listeners.push(refresh)
    return () => { _listeners = _listeners.filter(fn => fn !== refresh) }
  }, [])

  function open() { setEntries([..._entries]); setVisible(true) }

  function clear() {
    _entries.splice(0, _entries.length)
    setEntries([])
  }

  async function copy() {
    const text = entries
      .map(e => `[${e.time}] [${e.level.toUpperCase()}] ${e.msg}`)
      .join('\n')
    try {
      if (
        Platform.OS === 'web' &&
        typeof navigator !== 'undefined' &&
        navigator?.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // clipboard unavailable (e.g. mobile Safari over HTTP) — ignore
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const errorCount = _entries.filter(e => e.level === 'error').length

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={open}>
        <Text style={styles.fabText}>🐛</Text>
        {errorCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{errorCount > 9 ? '9+' : errorCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Debug Console ({entries.length})</Text>
            <View style={styles.headerBtns}>
              <TouchableOpacity onPress={copy} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>{copied ? '✓ Copied' : 'Copy all'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clear} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(false)} style={[styles.headerBtn, { backgroundColor: '#FAECE7' }]}>
                <Text style={[styles.headerBtnText, { color: '#993C1D' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.logList} contentContainerStyle={{ padding: 8 }}>
            {entries.length === 0 && (
              <Text style={styles.empty}>No logs yet. Errors, warnings, and logs will appear here.</Text>
            )}
            {[...entries].reverse().map((e, i) => (
              <View
                key={i}
                style={[
                  styles.entry,
                  e.level === 'error' && styles.entryError,
                  e.level === 'warn' && styles.entryWarn,
                ]}
              >
                <Text style={styles.entryMeta}>[{e.time}] [{e.level.toUpperCase()}]</Text>
                <Text
                  style={[
                    styles.entryMsg,
                    e.level === 'error' && { color: '#993C1D' },
                    e.level === 'warn' && { color: '#7A4E00' },
                  ]}
                  selectable
                >
                  {e.msg}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: { fontSize: 20 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#D4537E',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  modal: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#111' },
  headerBtns: { flexDirection: 'row', gap: 6 },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  headerBtnText: { fontSize: 12, color: '#BA7517', fontWeight: '600' },
  logList: { flex: 1 },
  empty: { color: '#aaa', fontSize: 13, textAlign: 'center', marginTop: 40, paddingHorizontal: 24, lineHeight: 20 },
  entry: {
    marginBottom: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  entryError: { backgroundColor: '#FAECE7', borderColor: '#f0b8a0' },
  entryWarn: { backgroundColor: '#FAEEDA', borderColor: '#e8cc90' },
  entryMeta: { fontSize: 10, color: '#bbb', marginBottom: 3, fontWeight: '500' },
  entryMsg: {
    fontSize: 11,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'monospace',
    lineHeight: 16,
  },
})
