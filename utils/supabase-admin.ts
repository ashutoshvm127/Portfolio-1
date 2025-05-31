import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

function getSupabaseClient() {
  // Only create the client when the environment variables are available
  if (typeof window === 'undefined') {
    // Server-side
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.warn('Supabase credentials missing on server')
      return null
    }
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )
  }
  
  // Client-side
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }
  )
}

export const supabaseAdmin = getSupabaseClient()
