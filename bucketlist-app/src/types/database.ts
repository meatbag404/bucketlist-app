// Auto-generated types matching your Supabase schema
// You can also generate these automatically by running:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          handle: string
          avatar_color: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          handle: string
          avatar_color?: number
          created_at?: string
        }
        Update: {
          name?: string
          handle?: string
          avatar_color?: number
        }
      }
      buckets: {
        Row: {
          id: string
          name: string
          emoji: string
          created_by: string | null
          invite_code: string
          created_at: string
        }
        Insert: {
          name: string
          emoji?: string
          created_by?: string
        }
        Update: {
          name?: string
          emoji?: string
        }
      }
      bucket_members: {
        Row: {
          id: string
          bucket_id: string
          user_id: string
          status: 'active' | 'pending' | 'declined'
          joined_at: string
        }
        Insert: {
          bucket_id: string
          user_id: string
          status?: 'active' | 'pending' | 'declined'
        }
        Update: {
          status?: 'active' | 'pending' | 'declined'
        }
      }
      categories: {
        Row: {
          id: string
          bucket_id: string
          key: string
          label: string
          accent: string
          bg: string
          dark: string
          icon: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          bucket_id: string
          key: string
          label: string
          accent: string
          bg: string
          dark: string
          icon?: string
          is_default?: boolean
        }
        Update: {
          label?: string
          accent?: string
          bg?: string
          dark?: string
        }
      }
      items: {
        Row: {
          id: string
          bucket_id: string
          title: string
          category_key: string
          emoji: string
          done: boolean
          done_at: string | null
          done_by: string | null
          hearts: number
          memory_note: string | null
          location: string | null
          sort_order: number
          created_by: string | null
          created_at: string
        }
        Insert: {
          bucket_id: string
          title: string
          category_key?: string
          emoji?: string
          done?: boolean
          memory_note?: string
          location?: string
          sort_order?: number
          created_by?: string
        }
        Update: {
          title?: string
          category_key?: string
          emoji?: string
          done?: boolean
          done_at?: string
          done_by?: string
          hearts?: number
          memory_note?: string
          location?: string
          sort_order?: number
        }
      }
      item_tags: {
        Row: { id: string; item_id: string; user_id: string }
        Insert: { item_id: string; user_id: string }
        Update: never
      }
      item_hearts: {
        Row: { id: string; item_id: string; user_id: string }
        Insert: { item_id: string; user_id: string }
        Update: never
      }
      item_photos: {
        Row: {
          id: string
          item_id: string
          storage_path: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: { item_id: string; storage_path: string; uploaded_by?: string }
        Update: never
      }
      comments: {
        Row: {
          id: string
          item_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: { item_id: string; user_id: string; text: string }
        Update: never
      }
      activity: {
        Row: {
          id: string
          bucket_id: string
          user_id: string | null
          action: 'added' | 'done' | 'commented' | 'hearted' | 'joined' | 'invited' | 'photo_added'
          item_id: string | null
          item_title: string | null
          emoji: string | null
          created_at: string
        }
        Insert: {
          bucket_id: string
          user_id?: string
          action: string
          item_id?: string
          item_title?: string
          emoji?: string
        }
        Update: never
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Bucket = Database['public']['Tables']['buckets']['Row']
export type BucketMember = Database['public']['Tables']['bucket_members']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type ItemTag = Database['public']['Tables']['item_tags']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Activity = Database['public']['Tables']['activity']['Row']

// Extended types with joins
export type ItemWithDetails = Item & {
  tagged_users: Profile[]
  comments: (Comment & { profile: Profile })[]
  photos: Database['public']['Tables']['item_photos']['Row'][]
  hearted_by_me: boolean
}

export type BucketWithMembers = Bucket & {
  members: (BucketMember & { profile: Profile })[]
  categories: Category[]
}
