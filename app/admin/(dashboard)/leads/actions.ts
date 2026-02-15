'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUsers() {
  const supabase = createClient()

  // Fetch profiles with emails (since profiles is linked to auth.users, but emails are in auth.users)
  // Actually, my profiles table has an 'email' column based on `supabase/cms_schema.sql`
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .order('email', { ascending: true })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data
}

export async function getLeadInteractions(leadId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('lead_interactions')
    .select(`
      id,
      interaction_type,
      notes,
      created_at,
      user:profiles(email)
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching interactions:', error)
    return []
  }

  return data
}

export async function addInteraction(prevState: any, formData: FormData) {
  const supabase = createClient()

  const leadId = formData.get('lead_id')
  const userId = formData.get('user_id')
  const interactionType = formData.get('interaction_type')
  const notes = formData.get('notes')

  if (!leadId || !userId || !interactionType) {
    return { error: 'Campos obrigatórios faltando' }
  }

  const { error } = await supabase
    .from('lead_interactions')
    .insert({
      lead_id: leadId,
      user_id: userId,
      interaction_type: interactionType,
      notes: notes
    })

  if (error) {
    console.error('Error adding interaction:', error)
    return { error: 'Erro ao registrar atendimento' }
  }

  return { success: true }
}
