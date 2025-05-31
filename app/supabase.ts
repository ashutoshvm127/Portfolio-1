import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing, check your .env.local file')
  }
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)
