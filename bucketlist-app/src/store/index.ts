import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import {
  Profile, Bucket, Category, ItemWithDetails,
  BucketWithMembers, Activity
} from '../types/database'

interface AppState {
  // Auth
  session: any | null
  profile: Profile | null
  setSession: (session: any) => void
  setProfile: (profile: Profile) => void

  // Buckets
  buckets: BucketWithMembers[]
  activeBucketId: string | null
  setBuckets: (buckets: BucketWithMembers[]) => void
  setActiveBucketId: (id: string) => void
  getActiveBucket: () => BucketWithMembers | undefined

  // Items
  items: ItemWithDetails[]
  setItems: (items: ItemWithDetails[]) => void
  updateItem: (id: string, updates: Partial<ItemWithDetails>) => void
  addItem: (item: ItemWithDetails) => void
  removeItem: (id: string) => void

  // Filters
  catFilter: string | null
  friendFilters: string[]
  searchQuery: string
  showDone: boolean
  setCatFilter: (key: string | null) => void
  toggleFriendFilter: (userId: string) => void
  setSearchQuery: (q: string) => void
  setShowDone: (show: boolean) => void

  // Activity
  activity: Activity[]
  setActivity: (activity: Activity[]) => void
  unreadActivity: number
  setUnreadActivity: (n: number) => void

  // Actions
  fetchBuckets: () => Promise<void>
  fetchItems: (bucketId: string) => Promise<void>
  fetchActivity: (bucketId: string) => Promise<void>
  markItemDone: (itemId: string) => Promise<void>
  toggleHeart: (itemId: string) => Promise<void>
  addComment: (itemId: string, text: string) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),

  // ── Buckets ───────────────────────────────────────────────
  buckets: [],
  activeBucketId: null,
  setBuckets: (buckets) => set({ buckets }),
  setActiveBucketId: (id) => {
    set({ activeBucketId: id, items: [], catFilter: null, friendFilters: [], searchQuery: '' })
    get().fetchItems(id)
    get().fetchActivity(id)
  },
  getActiveBucket: () => {
    const { buckets, activeBucketId } = get()
    return buckets.find(b => b.id === activeBucketId)
  },

  // ── Items ─────────────────────────────────────────────────
  items: [],
  setItems: (items) => set({ items }),
  updateItem: (id, updates) => set(state => ({
    items: state.items.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  addItem: (item) => set(state => ({ items: [item, ...state.items] })),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

  // ── Filters ───────────────────────────────────────────────
  catFilter: null,
  friendFilters: [],
  searchQuery: '',
  showDone: true,
  setCatFilter: (key) => set(state => ({ catFilter: state.catFilter === key ? null : key })),
  toggleFriendFilter: (userId) => set(state => ({
    friendFilters: state.friendFilters.includes(userId)
      ? state.friendFilters.filter(id => id !== userId)
      : [...state.friendFilters, userId]
  })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setShowDone: (show) => set({ showDone: show }),

  // ── Activity ──────────────────────────────────────────────
  activity: [],
  setActivity: (activity) => set({ activity }),
  unreadActivity: 0,
  setUnreadActivity: (n) => set({ unreadActivity: n }),

  // ── Async actions ─────────────────────────────────────────
  fetchBuckets: async () => {
    const { data, error } = await supabase
      .from('bucket_members')
      .select(`
        bucket_id,
        buckets (
          *,
          categories (*),
          bucket_members (
            *,
            profiles (*)
          )
        )
      `)
      .eq('status', 'active')

    if (error) { console.error('fetchBuckets:', error); return }

    const buckets = data
      .map((row: any) => row.buckets)
      .filter(Boolean)
      .map((b: any) => ({
        ...b,
        members: b.bucket_members || [],
      }))

    set({ buckets })
    if (buckets.length > 0 && !get().activeBucketId) {
      get().setActiveBucketId(buckets[0].id)
    }
  },

  fetchItems: async (bucketId) => {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        item_tags ( user_id, profiles (*) ),
        comments ( *, profiles (*) ),
        item_photos (*),
        item_hearts ( user_id )
      `)
      .eq('bucket_id', bucketId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) { console.error('fetchItems:', error); return }

    const items: ItemWithDetails[] = (data || []).map((item: any) => ({
      ...item,
      tagged_users: item.item_tags?.map((t: any) => t.profiles).filter(Boolean) || [],
      comments: item.comments || [],
      photos: item.item_photos || [],
      hearted_by_me: item.item_hearts?.some((h: any) => h.user_id === userId) || false,
    }))

    set({ items })
  },

  fetchActivity: async (bucketId) => {
    const { data, error } = await supabase
      .from('activity')
      .select('*, profiles (*)')
      .eq('bucket_id', bucketId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) { console.error('fetchActivity:', error); return }
    set({ activity: data || [], unreadActivity: (data || []).length })
  },

  markItemDone: async (itemId) => {
    const { profile } = get()
    const { error } = await supabase
      .from('items')
      .update({
        done: true,
        done_at: new Date().toISOString(),
        done_by: profile?.id,
      })
      .eq('id', itemId)

    if (!error) {
      get().updateItem(itemId, { done: true })
    }
  },

  toggleHeart: async (itemId) => {
    const { profile, items } = get()
    if (!profile) return

    const item = items.find(i => i.id === itemId)
    if (!item) return

    if (item.hearted_by_me) {
      await supabase.from('item_hearts')
        .delete()
        .eq('item_id', itemId)
        .eq('user_id', profile.id)
      get().updateItem(itemId, { hearted_by_me: false, hearts: item.hearts - 1 })
    } else {
      await supabase.from('item_hearts')
        .insert({ item_id: itemId, user_id: profile.id })
      get().updateItem(itemId, { hearted_by_me: true, hearts: item.hearts + 1 })

      // Log activity
      const bucket = get().getActiveBucket()
      if (bucket) {
        await supabase.from('activity').insert({
          bucket_id: bucket.id,
          user_id: profile.id,
          action: 'hearted',
          item_id: itemId,
          item_title: item.title,
          emoji: '❤️',
        })
      }
    }
  },

  addComment: async (itemId, text) => {
    const { profile } = get()
    if (!profile || !text.trim()) return

    const { data, error } = await supabase
      .from('comments')
      .insert({ item_id: itemId, user_id: profile.id, text: text.trim() })
      .select('*, profiles (*)')
      .single()

    if (!error && data) {
      get().updateItem(itemId, {
        comments: [...(get().items.find(i => i.id === itemId)?.comments || []), data]
      })
    }
  },
}))

// ── Filtered items selector ────────────────────────────────────
export const useFilteredItems = () => {
  const { items, catFilter, friendFilters, searchQuery } = useStore()

  return items.filter(item => {
    if (catFilter && item.category_key !== catFilter) return false
    if (friendFilters.length > 0) {
      const taggedIds = item.tagged_users.map(u => u.id)
      if (!friendFilters.every(fid => taggedIds.includes(fid))) return false
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.category_key.toLowerCase().includes(q) &&
        !item.memory_note?.toLowerCase().includes(q)
      ) return false
    }
    return true
  })
}
