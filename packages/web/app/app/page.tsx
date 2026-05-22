'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@bucketlist/shared'
import { supabase } from '@bucketlist/shared'
import Link from 'next/link'

export default function BucketsPage() {
  const { buckets, profile } = useStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateBucket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('buckets')
        .insert({
          name,
          emoji,
          created_by: profile.id,
        })
        .select()
        .single()

      if (error) throw error

      await supabase.from('bucket_members').insert({
        bucket_id: data.id,
        user_id: profile.id,
        status: 'active',
      })

      setName('')
      setEmoji('🎯')
      setShowCreateModal(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const emojis = ['🎯', '🎬', '✈️', '🏔️', '📚', '🎮', '🎨', '🍕', '🏋️', '⛰️']

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Bucket Lists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
        >
          + New Bucket
        </button>
      </div>

      {buckets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No bucket lists yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-indigo-600 hover:underline"
          >
            Create your first one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buckets.map((bucket) => (
            <Link
              key={bucket.id}
              href={`/app/bucket/${bucket.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{bucket.emoji}</span>
                <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                  {bucket.members?.length || 0} member{bucket.members?.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                {bucket.name}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Created {new Date(bucket.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Create New Bucket</h2>

            <form onSubmit={handleCreateBucket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Travel Destinations"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`text-2xl p-2 rounded border-2 transition ${
                        emoji === e
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
