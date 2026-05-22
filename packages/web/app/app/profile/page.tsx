'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@bucketlist/shared'
import { supabase } from '@bucketlist/shared'

export default function ProfilePage() {
  const { profile, myAvatarUrl } = useStore()
  const [name, setName] = useState(profile?.name || '')
  const [handle, setHandle] = useState(profile?.handle || '')
  const [city, setCity] = useState(profile?.city || '')
  const [state, setState] = useState(profile?.state || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  if (!profile) {
    return <div className="p-8">Loading...</div>
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          handle,
          city: city || null,
          state: state || null,
        })
        .eq('id', profile.id)

      if (error) throw error
      setSaved(true)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* Avatar */}
      <div className="bg-white rounded-lg p-8 mb-8">
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{
              backgroundColor: [
                '#FF6B6B',
                '#4ECDC4',
                '#45B7D1',
                '#FFA07A',
                '#98D8C8',
                '#F7DC6F',
                '#BB8FCE',
                '#85C1E2',
                '#F8B88B',
                '#A8D8EA',
              ][profile.avatar_color % 10],
            }}
          >
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">{profile.name}</p>
            <p className="text-gray-600">@{profile.handle}</p>
            <p className="text-sm text-gray-500 mt-2">{profile.id}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional"
            />
          </div>
        </div>

        {saved && (
          <p className="text-green-600 text-sm">Profile updated successfully!</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <button
          onClick={async () => {
            if (confirm('Are you sure? This will sign you out.')) {
              await supabase.auth.signOut()
              router.push('/auth')
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
