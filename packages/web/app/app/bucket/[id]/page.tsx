'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@bucketlist/shared'
import { supabase } from '@bucketlist/shared'

export default function BucketPage() {
  const params = useParams()
  const bucketId = params.id as string
  const router = useRouter()

  const {
    buckets,
    items,
    profile,
    getActiveBucket,
    setActiveBucketId,
    markItemDone,
    restoreItem,
    deleteItem,
    toggleHeart,
    toggleStar,
  } = useStore()

  const [showAddItem, setShowAddItem] = useState(false)
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('✨')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setActiveBucketId(bucketId)
  }, [bucketId, setActiveBucketId])

  const bucket = getActiveBucket()
  const todoItems = items.filter((i) => !i.done)
  const doneItems = items.filter((i) => i.done)

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !bucket) return
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          bucket_id: bucketId,
          title,
          emoji,
          created_by: profile.id,
          sort_order: (todoItems.length + 1) * 1000,
        })
        .select()
        .single()

      if (error) throw error
      setTitle('')
      setEmoji('✨')
      setShowAddItem(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!bucket) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 hover:underline mb-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900">
          <span className="text-5xl mr-3">{bucket.emoji}</span>
          {bucket.name}
        </h1>
      </div>

      {/* Add Item Button */}
      <button
        onClick={() => setShowAddItem(true)}
        className="mb-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
      >
        + Add Item
      </button>

      {/* Todo Items */}
      {todoItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">To Do</h2>
          <div className="space-y-2">
            {todoItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow transition"
              >
                <button
                  onClick={() => markItemDone(item.id)}
                  className="text-2xl flex-shrink-0"
                >
                  ⭕
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-lg text-gray-900">{item.title}</p>
                  {item.memory_note && (
                    <p className="text-sm text-gray-500">{item.memory_note}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleHeart(item.id)}
                    className={`text-2xl ${item.hearted_by_me ? '❤️' : '🤍'}`}
                  />
                  <button
                    onClick={() => toggleStar(item.id)}
                    className={`text-2xl ${item.starred ? '⭐' : '☆'}`}
                  />
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-600 text-lg"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done Items */}
      {doneItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed</h2>
          <div className="space-y-2">
            {doneItems.map((item) => (
              <div
                key={item.id}
                className="bg-green-50 rounded-lg p-4 flex items-center gap-4 opacity-75"
              >
                <button
                  onClick={() => restoreItem(item.id)}
                  className="text-2xl flex-shrink-0"
                >
                  ✅
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-lg text-gray-900 line-through">{item.title}</p>
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-600 text-lg flex-shrink-0"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No items yet</p>
          <button
            onClick={() => setShowAddItem(true)}
            className="text-indigo-600 hover:underline"
          >
            Add your first item
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Add Item</h2>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Visit Paris"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-2xl text-center"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
