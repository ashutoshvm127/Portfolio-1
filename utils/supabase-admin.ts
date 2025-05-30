import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('Service Key available:', !!supabaseServiceKey) // Debug log

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials:', { 
    hasUrl: !!supabaseUrl, 
    hasServiceKey: !!supabaseServiceKey 
  })
  throw new Error('Missing Supabase credentials')
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
)
