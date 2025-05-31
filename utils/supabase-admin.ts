import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Ensure these are available in production environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.warn('Supabase URL not found, check your environment variables')
}

if (!supabaseServiceKey) {
  console.warn('Supabase service key not found, falling back to anon key')
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
