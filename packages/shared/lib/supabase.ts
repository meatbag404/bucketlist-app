import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const SUPABASE_URL = 'https://ygrgydpcdcighhuqzzqy.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_VHLhzRJAWnzv7yVa9G9fIQ_bUgneKK4'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
