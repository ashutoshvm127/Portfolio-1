import { supabase } from './supabase'

async function verifyAdminAuth() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Authentication error:', error.message)
    return false
  }
  
  // Verify if user has admin role
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id)
    .single()
    
  return roles?.role === 'admin'
}