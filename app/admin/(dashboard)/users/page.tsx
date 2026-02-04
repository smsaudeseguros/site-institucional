"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Trash, Plus, ShieldAlert } from "lucide-react"
import { createUser, deleteUser } from "./actions"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          setCurrentRole(profile?.role || "")
      }

      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      toast.error("Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return
    const res = await deleteUser(id)
    if (res?.error) {
        toast.error(res.error)
    } else {
        toast.success("Usuário excluído")
        fetchUsers()
    }
  }

  // Form Action Wrapper
  const handleCreate = async (formData: FormData) => {
      const res = await createUser(null, formData)
      if (res?.error) {
          toast.error(res.error)
      } else if (res?.success) {
          toast.success("Usuário criado com sucesso")
          setIsOpen(false)
          fetchUsers()
      }
  }

  if (loading) return <div>Carregando...</div>

  if (currentRole !== 'admin') {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
              <ShieldAlert className="h-12 w-12 mb-4 text-amber-500" />
              <h2 className="text-xl font-semibold">Acesso Restrito</h2>
              <p>Apenas administradores podem gerenciar usuários.</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
        <Button onClick={() => setIsOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>
      </div>
      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role === 'admin' ? 'Administrador' : 'Editor'}
                    </span>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(user.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title="Novo Usuário">
        <form action={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" required placeholder="novo@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Senha Temporária</Label>
            <Input name="password" type="text" required minLength={6} placeholder="********" />
          </div>
          <div className="space-y-2">
            <Label>Função</Label>
            <select name="role" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950">
                <option value="editor">Editor (Conteúdo)</option>
                <option value="admin">Administrador (Total)</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Criar Usuário</Button>
        </form>
      </Dialog>
    </div>
  )
}
