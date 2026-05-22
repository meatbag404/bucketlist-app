'use client'

import { useStore } from '@bucketlist/shared'

export default function ActivityPage() {
  const { activity, getActiveBucket } = useStore()
  const bucket = getActiveBucket()

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      done: 'checked off',
      hearted: 'liked',
      photo_added: 'added a photo to',
      joined: 'joined',
      created: 'created',
    }
    return labels[action] || action
  }

  if (!bucket) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Select a bucket to see activity</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Activity</h1>

      {activity.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activity.map((item: any) => (
            <div key={item.id} className="bg-white rounded-lg p-4 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{item.emoji || '✨'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">
                  <span className="font-medium">{item.profiles?.name}</span>{' '}
                  {getActionLabel(item.action)}
                  {item.item_title && (
                    <>
                      {' '}
                      <span className="font-medium">"{item.item_title}"</span>
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()} at{' '}
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
