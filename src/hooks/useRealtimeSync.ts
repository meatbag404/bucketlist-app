import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'

// Subscribes to live changes in a bucket —
// items, comments, hearts, photos, and activity all update in real time
export function useRealtimeSync(bucketId: string | null) {
  const { updateItem, addItem, removeItem, setActivity } = useStore()

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
          // Fetch full item with all relations including creator profile
          const { data } = await supabase
            .from('items')
            .select(`
              *,
              item_tags ( user_id, profiles (*) ),
              comments ( *, profiles (*) ),
              item_photos (*),
              item_hearts ( user_id ),
              created_by_profile:profiles!created_by ( name, avatar_color )
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            const exists = useStore.getState().items.some(i => i.id === data.id)
            const mapped = {
              ...data,
              tagged_users: data.item_tags?.map((t: any) => t.profiles).filter(Boolean) || [],
              comments: data.comments || [],
              photos: data.item_photos || [],
              created_by_profile: data.created_by_profile || null,
            }
            if (exists) {
              // Optimistically added already — refresh with server data
              updateItem(data.id, mapped)
            } else {
              addItem({ ...mapped, hearted_by_me: false })
            }
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
            const item = useStore.getState().items.find(i => i.id === data.item_id)
            if (item) {
              updateItem(item.id, { comments: [...item.comments, data] })
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'comments' },
        (payload) => {
          const store = useStore.getState()
          const item = store.items.find(i => i.id === payload.old.item_id)
          if (item) {
            store.updateItem(item.id, {
              comments: item.comments.filter((c: any) => c.id !== payload.old.id),
            })
          }
        }
      )
      .subscribe()

    // ── Hearts channel ─────────────────────────────────────
    // Skip own user's actions (already handled optimistically in toggleHeart)
    const heartsChannel = supabase
      .channel(`hearts:${bucketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'item_hearts' },
        (payload) => {
          const store = useStore.getState()
          if (payload.new.user_id === store.profile?.id) return
          const item = store.items.find(i => i.id === payload.new.item_id)
          if (item) {
            store.updateItem(item.id, { hearts: item.hearts + 1 })
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'item_hearts' },
        (payload) => {
          const store = useStore.getState()
          if (payload.old.user_id === store.profile?.id) return
          const item = store.items.find(i => i.id === payload.old.item_id)
          if (item) {
            store.updateItem(item.id, { hearts: Math.max(0, item.hearts - 1) })
          }
        }
      )
      .subscribe()

    // ── Photos channel ─────────────────────────────────────
    // Skip own uploads (already handled optimistically in uploadItemPhoto)
    const photosChannel = supabase
      .channel(`photos:${bucketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'item_photos' },
        (payload) => {
          const store = useStore.getState()
          if (payload.new.uploaded_by === store.profile?.id) return
          const item = store.items.find(i => i.id === payload.new.item_id)
          if (item) {
            store.updateItem(item.id, { photos: [...item.photos, payload.new as any] })
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
            // Read fresh activity from store (avoids stale closure)
            const currentActivity = useStore.getState().activity
            setActivity([data, ...currentActivity])
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
      supabase.removeChannel(heartsChannel)
      supabase.removeChannel(photosChannel)
      supabase.removeChannel(activityChannel)
    }
  }, [bucketId])
}
