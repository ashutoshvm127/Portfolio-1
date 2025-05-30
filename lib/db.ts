import { supabase } from '@/utils/supabase'
import type { ContactSubmission } from '@/types/database'

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error.message, error.details)
      throw error
    }

    console.log('Fetched submissions:', data) // Debug log
    return data || []
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error)
    throw error // Let the error propagate to the page
  }
}

export async function deleteContactSubmission(id: number) {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting submission:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Failed to delete contact submission:', error)
    return false
  }
}
