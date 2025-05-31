"use server"

import { supabaseAdmin } from "@/utils/supabase-admin"
import type { ContactSubmission } from "@/types/database"

const checkSupabaseConnection = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.warn('Supabase environment variables missing, check your hosting configuration')
    return false
  }
  return true
}

export async function getSubmissions() {
  if (!checkSupabaseConnection()) {
    return []
  }
  if (!supabaseAdmin) throw new Error('Supabase client is not initialized');
  
  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .select(`
      id,
      first_name,
      last_name,
      email,
      message,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Transform the data to include full name
  const transformedData = (data || []).map(submission => ({
    ...submission,
    name: `${submission.first_name || ''} ${submission.last_name || ''}`.trim() || 'Anonymous'
  }))

  return transformedData
}

export async function deleteSubmission(id: number) {
  if (!checkSupabaseConnection()) {
    throw new Error('Database connection not configured')
  }
  if (!supabaseAdmin) throw new Error('Supabase client is not initialized');

  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
