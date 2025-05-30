"use server"

import { supabaseAdmin } from "@/utils/supabase-admin"
import type { ContactSubmission } from "@/types/database"

export async function getSubmissions() {
  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deleteSubmission(id: number) {
  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
