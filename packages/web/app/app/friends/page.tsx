'use client'

import { useState } from 'react'
import { useStore } from '@bucketlist/shared'

export default function FriendsPage() {
  const {
    friends,
    incomingFriendRequests,
    outgoingFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
  } = useStore()

  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const err = await sendFriendRequest(handle)
    if (err) {
      setError(err)
    } else {
      setHandle('')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Friends</h1>

      {/* Add Friend */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Friend</h2>
        <form onSubmit={handleAddFriend} className="flex gap-2">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter @handle"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Incoming Requests */}
      {incomingFriendRequests.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
          <div className="space-y-3">
            {incomingFriendRequests.map((req: any) => (
              <div key={req.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{req.profile?.name}</p>
                  <p className="text-sm text-gray-500">@{req.profile?.handle}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFriendRequest(req.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineFriendRequest(req.id)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      {friends.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Friends ({friends.length})</h2>
          <div className="space-y-3">
            {friends.map((friend: any) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-500">@{friend.handle}</p>
                </div>
                <button
                  onClick={() => removeFriend(friend.friendshipId)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Outgoing */}
      {outgoingFriendRequests.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          <div className="space-y-3">
            {outgoingFriendRequests.map((req: any) => (
              <div key={req.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{req.profile?.name}</p>
                  <p className="text-sm text-gray-500">@{req.profile?.handle}</p>
                </div>
                <span className="text-sm text-gray-500">Pending...</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {friends.length === 0 && incomingFriendRequests.length === 0 && (
        <p className="text-gray-600">No friends yet. Send a friend request to get started!</p>
      )}
    </div>
  )
}
