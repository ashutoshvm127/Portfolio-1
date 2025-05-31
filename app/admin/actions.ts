"use server"

import { supabaseAdmin } from "@/utils/supabase-admin"
import type { ContactSubmission } from "@/types/database"

export async function getSubmissions() {
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
  if (!supabaseAdmin) throw new Error('Supabase client is not initialized');

  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
