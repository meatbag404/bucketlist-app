import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView
} from 'react-native'
import { supabase } from '../../src/lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')

  async function handleAuth() {
    if (!email || !password) { setMessage('Please fill in both fields'); return }
    setLoading(true)
    setMessage('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setMessage(error.message)
      } else {
        const name = email.split('@')[0]
        const handle = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 999)
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { name, handle } }
        })
        if (error) setMessage(error.message)
        else setMessage('Check your email for a confirmation link!')
      }
    } catch (e: any) {
      setMessage(e.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🪣</Text>
          <Text style={styles.title}>Bucketlist</Text>
          <Text style={styles.subtitle}>Experiences worth having, together.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleAuth}
          />

          {message ? (
            <Text style={[styles.message, message.includes('Check') ? styles.msgSuccess : styles.msgError]}>
              {message}
            </Text>
          ) : null}

          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleAuth} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>{mode === 'login' ? 'Sign in' : 'Create account'}</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.toggleLink}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: '#f7f5f0' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: 500 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  emoji: { fontSize: 52, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 30, fontWeight: '700', textAlign: 'center', color: '#111', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, color: '#111', borderWidth: 0.5, borderColor: '#eee' },
  message: { fontSize: 13, textAlign: 'center', marginBottom: 12, padding: 10, borderRadius: 8 },
  msgError: { backgroundColor: '#FAECE7', color: '#993C1D' },
  msgSuccess: { backgroundColor: '#E1F5EE', color: '#0F6E56' },
  btn: { backgroundColor: '#BA7517', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#eee' },
  dividerText: { color: '#ccc', fontSize: 13 },
  toggleText: { fontSize: 14, color: '#888', textAlign: 'center' },
  toggleLink: { color: '#BA7517', fontWeight: '600' },
})
