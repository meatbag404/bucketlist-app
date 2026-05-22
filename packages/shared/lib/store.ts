import { create } from 'zustand'
import { supabase } from './supabase'
import { Database } from './types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Bucket = Database['public']['Tables']['buckets']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Item = Database['public']['Tables']['items']['Row']
type Activity = Database['public']['Tables']['activity']['Row']

export interface BucketWithMembers extends Bucket {
  members: any[]
}

export interface ItemWithDetails extends Item {
  tagged_users: any[]
  comments: any[]
  photos: any[]
  hearted_by_me: boolean
  created_by_profile: any
}

export interface FriendProfile {
  id: string
  name: string
  handle: string
  avatar_color: number
  avatar_url: string | null
  friendshipId: string
}

interface AppState {
  session: any | null
  profile: Profile | null
  myAvatarUrl: string | null
  setSession: (session: any) => void
  setProfile: (profile: Profile) => void
  setMyAvatarUrl: (url: string | null) => void

  buckets: BucketWithMembers[]
  activeBucketId: string | null
  setBuckets: (buckets: BucketWithMembers[]) => void
  setActiveBucketId: (id: string) => void
  getActiveBucket: () => BucketWithMembers | undefined

  items: ItemWithDetails[]
  setItems: (items: ItemWithDetails[]) => void
  updateItem: (id: string, updates: Partial<ItemWithDetails>) => void
  addItem: (item: ItemWithDetails) => void
  removeItem: (id: string) => void

  catFilter: string | null
  starFilter: boolean
  friendFilters: string[]
  searchQuery: string
  showDone: boolean
  setCatFilter: (key: string | null) => void
  setStarFilter: (v: boolean) => void
  toggleFriendFilter: (userId: string) => void
  setSearchQuery: (q: string) => void
  setShowDone: (show: boolean) => void

  activity: Activity[]
  setActivity: (activity: Activity[]) => void
  unreadActivity: number
  setUnreadActivity: (n: number) => void

  pendingApprovalCount: number
  pendingApprovals: any[]
  fetchPendingApprovals: () => Promise<void>

  fetchBuckets: () => Promise<void>
  fetchItems: (bucketId: string) => Promise<void>
  fetchActivity: (bucketId: string) => Promise<void>
  markItemDone: (itemId: string) => Promise<void>
  restoreItem: (itemId: string) => Promise<void>
  editItem: (itemId: string, updates: any) => Promise<void>
  toggleHeart: (itemId: string) => Promise<void>
  toggleStar: (itemId: string) => Promise<void>
  deleteItem: (itemId: string) => Promise<void>
  addComment: (itemId: string, text: string) => Promise<void>
  uploadItemPhoto: (itemId: string, uri: string) => Promise<void>
  approveJoin: (membershipId: string, bucketId: string, userId: string) => Promise<void>
  declineJoin: (membershipId: string) => Promise<void>
  removeMember: (userId: string, bucketId: string) => Promise<void>
  leaveBucket: (bucketId: string) => Promise<void>
  registerPushToken: () => Promise<void>
  sendPushToOthers: (title: string, body: string) => Promise<void>

  friends: FriendProfile[]
  incomingFriendRequests: any[]
  outgoingFriendRequests: any[]
  friendRequestCount: number
  fetchFriends: () => Promise<void>
  sendFriendRequest: (handle: string) => Promise<string | null>
  acceptFriendRequest: (friendshipId: string) => Promise<void>
  declineFriendRequest: (friendshipId: string) => Promise<void>
  removeFriend: (friendshipId: string) => Promise<void>
  addFriendToBucket: (friendId: string, bucketId: string) => Promise<string | null>
  setBucketHero: (bucketId: string, uri: string) => Promise<string | null>
  reorderItems: (reorderedTodo: ItemWithDetails[]) => Promise<void>
  renameBucket: (bucketId: string, name: string, emoji: string) => Promise<string | null>
}

export const useStore = create<AppState>((set, get) => ({
  session: null,
  profile: null,
  myAvatarUrl: null,
  setSession: (session) => set({ session }),
  setMyAvatarUrl: (url) => set({ myAvatarUrl: url }),
  setProfile: (profile) => {
    set({ profile })
    const avatarPath = (profile as any)?.avatar_url
    if (avatarPath) {
      supabase.storage.from('avatars').createSignedUrl(avatarPath, 7200)
        .then(({ data }) => { if (data?.signedUrl) set({ myAvatarUrl: data.signedUrl }) })
    }
  },

  buckets: [],
  activeBucketId: null,
  setBuckets: (buckets) => set({ buckets }),
  setActiveBucketId: (id) => {
    set({ activeBucketId: id, items: [], catFilter: null, starFilter: false, friendFilters: [], searchQuery: '' })
    get().fetchItems(id)
    get().fetchActivity(id)
  },
  getActiveBucket: () => {
    const { buckets, activeBucketId } = get()
    return buckets.find(b => b.id === activeBucketId)
  },

  items: [],
  setItems: (items) => set({ items }),
  updateItem: (id, updates) => set(state => ({
    items: state.items.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  addItem: (item) => set(state => {
    if (state.items.some(i => i.id === item.id)) return state
    return { items: [item, ...state.items] }
  }),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

  catFilter: null,
  starFilter: false,
  friendFilters: [],
  searchQuery: '',
  showDone: true,
  setCatFilter: (key) => set(state => ({ catFilter: state.catFilter === key ? null : key })),
  setStarFilter: (v) => set({ starFilter: v }),
  toggleFriendFilter: (userId) => set(state => ({
    friendFilters: state.friendFilters.includes(userId)
      ? state.friendFilters.filter(id => id !== userId)
      : [...state.friendFilters, userId]
  })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setShowDone: (show) => set({ showDone: show }),

  activity: [],
  setActivity: (activity) => set({ activity }),
  unreadActivity: 0,
  setUnreadActivity: (n) => set({ unreadActivity: n }),

  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  friendRequestCount: 0,

  pendingApprovalCount: 0,
  pendingApprovals: [],
  fetchPendingApprovals: async () => {
    const { profile, buckets } = get()
    if (!profile) return
    const ownedIds = buckets.filter(b => b.created_by === profile.id).map(b => b.id)
    if (ownedIds.length === 0) { set({ pendingApprovalCount: 0, pendingApprovals: [] }); return }

    const { data } = await supabase
      .from('bucket_members')
      .select('id, bucket_id, user_id, joined_at, profiles(*), buckets(name, emoji)')
      .eq('status', 'pending')
      .in('bucket_id', ownedIds)

    set({ pendingApprovals: data || [], pendingApprovalCount: (data || []).length })
  },

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

    const seenIds = new Set<string>()
    const buckets = data
      .map((row: any) => row.buckets)
      .filter(Boolean)
      .map((b: any) => ({ ...b, members: b.bucket_members || [] }))
      .filter((b: any) => {
        if (seenIds.has(b.id)) return false
        seenIds.add(b.id)
        return true
      }) as BucketWithMembers[]

    set({ buckets })
    if (buckets.length > 0 && !get().activeBucketId) {
      get().setActiveBucketId(buckets[0].id)
    }
    get().fetchPendingApprovals()
    get().fetchFriends()
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
        item_hearts ( user_id ),
        created_by_profile:profiles!created_by ( name, avatar_color )
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
      created_by_profile: item.created_by_profile || null,
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
    const item = get().items.find(i => i.id === itemId)

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

      const bucket = get().getActiveBucket()
      if (bucket && profile && item) {
        await supabase.from('activity').insert({
          bucket_id: bucket.id,
          user_id: profile.id,
          action: 'done',
          item_id: itemId,
          item_title: item.title,
          emoji: item.emoji || '✅',
        })

        get().sendPushToOthers(
          `${profile.name} checked something off! ✅`,
          item.title
        )
      }
    }
  },

  restoreItem: async (itemId) => {
    const { error } = await supabase
      .from('items')
      .update({ done: false, done_at: null, done_by: null } as any)
      .eq('id', itemId)

    if (!error) {
      get().updateItem(itemId, { done: false, done_at: null as any, done_by: null as any })
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

  toggleStar: async (itemId) => {
    const item = get().items.find(i => i.id === itemId)
    if (!item) return

    const newStarred = !item.starred
    const { error } = await supabase
      .from('items')
      .update({ starred: newStarred })
      .eq('id', itemId)

    if (!error) {
      get().updateItem(itemId, { starred: newStarred })
    }
  },

  deleteItem: async (itemId) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      get().removeItem(itemId)
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

      const item = get().items.find(i => i.id === itemId)
      if (item) {
        get().sendPushToOthers(
          `${profile.name} commented on ${item.title}`,
          text.trim()
        )
      }
    }
  },

  editItem: async (itemId, updates) => {
    const { error } = await supabase.from('items').update(updates).eq('id', itemId)
    if (!error) get().updateItem(itemId, updates as any)
  },

  approveJoin: async (membershipId, bucketId, userId) => {
    const { error } = await supabase
      .from('bucket_members')
      .update({ status: 'active' })
      .eq('id', membershipId)

    if (!error) {
      await supabase.from('activity').insert({
        bucket_id: bucketId, user_id: userId, action: 'joined', emoji: '👋',
      })
      await get().fetchBuckets()
      await get().fetchPendingApprovals()
    }
  },

  declineJoin: async (membershipId) => {
    await supabase.from('bucket_members').delete().eq('id', membershipId)
    await get().fetchPendingApprovals()
  },

  removeMember: async (userId, bucketId) => {
    await supabase
      .from('bucket_members')
      .delete()
      .eq('user_id', userId)
      .eq('bucket_id', bucketId)
    await get().fetchBuckets()
    await get().fetchPendingApprovals()
  },

  leaveBucket: async (bucketId) => {
    const { profile } = get()
    if (!profile) return
    await supabase
      .from('bucket_members')
      .delete()
      .eq('bucket_id', bucketId)
      .eq('user_id', profile.id)
    const remaining = get().buckets.filter(b => b.id !== bucketId)
    if (remaining.length > 0) {
      set({ activeBucketId: remaining[0].id, items: [] })
    } else {
      set({ activeBucketId: null, items: [] })
    }
    await get().fetchBuckets()
  },

  fetchFriends: async () => {
    const { profile } = get()
    if (!profile) return

    const [acceptedRes, incomingRes, outgoingRes] = await Promise.all([
      supabase
        .from('friendships')
        .select('id, requester_id, addressee_id, requester:profiles!requester_id(*), addressee:profiles!addressee_id(*)')
        .or(`requester_id.eq.${profile.id},addressee_id.eq.${profile.id}`)
        .eq('status', 'accepted'),
      supabase
        .from('friendships')
        .select('id, requester_id, requester:profiles!requester_id(*)')
        .eq('addressee_id', profile.id)
        .eq('status', 'pending'),
      supabase
        .from('friendships')
        .select('id, addressee_id, addressee:profiles!addressee_id(*)')
        .eq('requester_id', profile.id)
        .eq('status', 'pending'),
    ])

    const friends: FriendProfile[] = (acceptedRes.data || [])
      .map((f: any) => {
        const p = f.requester_id === profile.id ? f.addressee : f.requester
        return p ? { ...p, friendshipId: f.id } : null
      })
      .filter(Boolean) as FriendProfile[]

    const incoming = (incomingRes.data || [])
      .map((f: any) => ({ id: f.id, profile: f.requester }))
      .filter((f: any) => f.profile)

    const outgoing = (outgoingRes.data || [])
      .map((f: any) => ({ id: f.id, profile: f.addressee }))
      .filter((f: any) => f.profile)

    set({
      friends,
      incomingFriendRequests: incoming,
      outgoingFriendRequests: outgoing,
      friendRequestCount: incoming.length,
    })
  },

  sendFriendRequest: async (handle) => {
    const { profile } = get()
    if (!profile) return 'Not logged in'

    const cleaned = handle.replace('@', '').toLowerCase().trim()
    if (!cleaned) return 'Enter a @handle'
    if (cleaned === profile.handle) return "You can't add yourself"

    const { data: target } = await supabase
      .from('profiles')
      .select('id, name, handle')
      .eq('handle', cleaned)
      .maybeSingle()

    if (!target) return `No user found with handle @${cleaned}`

    const { data: existing } = await supabase
      .from('friendships')
      .select('id, status')
      .or(`and(requester_id.eq.${profile.id},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${profile.id})`)
      .maybeSingle()

    if (existing) {
      if (existing.status === 'accepted') return "You're already friends!"
      if (existing.status === 'pending') return 'Friend request already pending'
    }

    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: profile.id, addressee_id: target.id })

    if (error) return error.message
    await get().fetchFriends()
    return null
  },

  acceptFriendRequest: async (friendshipId) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    await get().fetchFriends()
  },

  declineFriendRequest: async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId)
    await get().fetchFriends()
  },

  removeFriend: async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId)
    await get().fetchFriends()
  },

  addFriendToBucket: async (friendId, bucketId) => {
    const { data: existing } = await supabase
      .from('bucket_members')
      .select('id, status')
      .eq('bucket_id', bucketId)
      .eq('user_id', friendId)
      .maybeSingle()

    if (existing?.status === 'active') return 'Already in this bucket'

    if (existing?.status === 'pending') {
      const { error } = await supabase
        .from('bucket_members').update({ status: 'active' }).eq('id', existing.id)
      if (error) return error.message
    } else {
      const { error } = await supabase
        .from('bucket_members')
        .insert({ bucket_id: bucketId, user_id: friendId, status: 'active' })
      if (error) return error.message
    }

    await get().fetchBuckets()
    return null
  },

  setBucketHero: async (bucketId, uri) => {
    const { profile } = get()
    if (!profile) return 'Not logged in'
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const ext = blob.type === 'image/png' ? 'png' : 'jpg'
      const path = `${bucketId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('bucket-heroes')
        .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: true })
      if (uploadError) return uploadError.message

      const { data: urlData } = supabase.storage.from('bucket-heroes').getPublicUrl(path)
      const hero_url = urlData.publicUrl

      const { error: dbError } = await supabase
        .from('buckets')
        .update({ hero_url })
        .eq('id', bucketId)
      if (dbError) return dbError.message

      set(state => ({
        buckets: state.buckets.map(b => b.id === bucketId ? { ...b, hero_url } : b),
      }))
      return null
    } catch (e: any) {
      return e.message || 'Upload failed'
    }
  },

  renameBucket: async (bucketId, name, emoji) => {
    const { error } = await supabase.from('buckets').update({ name, emoji }).eq('id', bucketId)
    if (error) return error.message
    set(state => ({
      buckets: state.buckets.map(b => b.id === bucketId ? { ...b, name, emoji } : b),
    }))
    return null
  },

  reorderItems: async (reorderedTodo) => {
    const doneItems = get().items.filter(i => i.done)
    set({ items: [...reorderedTodo, ...doneItems] })

    await Promise.all(
      reorderedTodo.map((item, index) =>
        supabase.from('items').update({ sort_order: (index + 1) * 1000 }).eq('id', item.id)
      )
    )
  },

  uploadItemPhoto: async (itemId, uri) => {
    const { profile } = get()
    if (!profile) return

    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const ext = (blob.type === 'image/png') ? 'png' : 'jpg'
      const path = `${itemId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(path, blob, { contentType: blob.type || 'image/jpeg' })

      if (uploadError) { console.error('Photo upload:', uploadError); return }

      const { data: photo, error: photoError } = await supabase
        .from('item_photos')
        .insert({ item_id: itemId, storage_path: path, uploaded_by: profile.id })
        .select()
        .single()

      if (photoError) { console.error('Photo record:', photoError); return }

      const item = get().items.find(i => i.id === itemId)
      if (item && photo) {
        get().updateItem(itemId, { photos: [...item.photos, photo] })
      }

      const bucket = get().getActiveBucket()
      if (bucket && item) {
        await supabase.from('activity').insert({
          bucket_id: bucket.id,
          user_id: profile.id,
          action: 'photo_added',
          item_id: itemId,
          item_title: item.title,
          emoji: '📷',
        })
      }
    } catch (e: any) {
      console.error('Upload failed:', e)
    }
  },

  registerPushToken: async () => {
    // Platform-specific registration should be in the mobile app
  },

  sendPushToOthers: async (title, body) => {
    const { getActiveBucket, profile } = get()
    const bucket = getActiveBucket()
    if (!bucket || !profile) return

    try {
      const { data: members } = await supabase
        .from('bucket_members')
        .select('profiles(push_token)')
        .eq('bucket_id', bucket.id)
        .eq('status', 'active')
        .neq('user_id', profile.id)

      if (!members) return

      const tokens = members
        .map((m: any) => m.profiles?.push_token)
        .filter((t: any) => typeof t === 'string' && t.startsWith('ExponentPushToken['))

      if (tokens.length === 0) return

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokens.map((to: string) => ({
          to, title, body, sound: 'default',
        }))),
      })
    } catch { /* non-critical */ }
  },
}))

export const useFilteredItems = () => {
  const { items, catFilter, starFilter, friendFilters, searchQuery } = useStore()

  const filtered = items.filter(item => {
    if (starFilter && !item.starred) return false
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
        !item.memory_note?.toLowerCase().includes(q) &&
        !item.location?.toLowerCase().includes(q) &&
        !item.tagged_users.some(u => u.name.toLowerCase().includes(q))
      ) return false
    }
    return true
  })

  return [...filtered].sort((a, b) => {
    if (a.done !== b.done) return 0
    if (a.starred && !b.starred) return -1
    if (!a.starred && b.starred) return 1
    return 0
  })
}
