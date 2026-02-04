"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string || "editor"

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      return { error: "Não autorizado" }
  }

  // Check if current user is admin
  const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (currentUserProfile?.role !== 'admin') {
      return { error: "Permissão negada. Apenas administradores podem criar usuários." }
  }

  const adminSupabase = createAdminClient()

  // Create Auth User
  const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
  })

  if (createError) return { error: createError.message }

  if (newUser.user) {
      const { error: profileError } = await adminSupabase.from('profiles').insert({
          id: newUser.user.id,
          email: email,
          role: role
      })

      if (profileError) {
          if (profileError.code === '23505') {
               await adminSupabase.from('profiles').update({ role }).eq('id', newUser.user.id)
          } else {
               return { error: "Usuário criado, mas falha ao criar perfil: " + profileError.message }
          }
      }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (currentUserProfile?.role !== 'admin') return { error: "Permission denied" }

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
}
