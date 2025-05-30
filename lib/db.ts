import { supabase } from '@/utils/supabase'
import type { ContactSubmission } from '@/types/database'

export async function getContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }

  return data as ContactSubmission[]
}

export async function deleteContactSubmission(id: number) {
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting submission:', error)
    throw error
  }
}
