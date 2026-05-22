import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'

// Subscribes to live changes in a bucket —
// items, comments, hearts, and activity all update in real time
export function useRealtimeSync(bucketId: string | null) {
  const { updateItem, addItem, removeItem, setActivity, activity } = useStore()

  useEffect(() => {
    if (!bucketId) return

    // ── Items channel ──────────────────────────────────────
    const itemsChannel = supabase
      .channel(`items:${bucketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'items',
          filter: `bucket_id=eq.${bucketId}`,
        },
        async (payload) => {
          // Fetch full item with relations
          const { data } = await supabase
            .from('items')
            .select('*, item_tags(user_id, profiles(*)), comments(*, profiles(*)), item_photos(*), item_hearts(user_id)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            addItem({
              ...data,
              tagged_users: data.item_tags?.map((t: any) => t.profiles).filter(Boolean) || [],
              comments: data.comments || [],
              photos: data.item_photos || [],
              hearted_by_me: false,
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'items',
          filter: `bucket_id=eq.${bucketId}`,
        },
        (payload) => {
          updateItem(payload.new.id, payload.new as any)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'items',
        },
        (payload) => {
          removeItem(payload.old.id)
        }
      )
      .subscribe()

    // ── Comments channel ───────────────────────────────────
    const commentsChannel = supabase
      .channel(`comments:${bucketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        async (payload) => {
          const { data } = await supabase
            .from('comments')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            const store = useStore.getState()
            const item = store.items.find(i => i.id === data.item_id)
            if (item) {
              updateItem(item.id, {
                comments: [...item.comments, data]
              })
            }
          }
        }
      )
      .subscribe()

    // ── Activity channel ───────────────────────────────────
    const activityChannel = supabase
      .channel(`activity:${bucketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity',
          filter: `bucket_id=eq.${bucketId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from('activity')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setActivity([data, ...activity])
            useStore.getState().setUnreadActivity(
              useStore.getState().unreadActivity + 1
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(itemsChannel)
      supabase.removeChannel(commentsChannel)
      supabase.removeChannel(activityChannel)
    }
  }, [bucketId])
}
