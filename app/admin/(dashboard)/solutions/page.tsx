"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import { IconPicker } from "@/components/admin/icon-picker"
import { toast } from "sonner"
import { Pencil, Trash, Plus } from "lucide-react"

export default function SolutionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({ title: "", description: "", icon_name: "", sort_order: 0 })
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('solutions').select('*').order('sort_order', { ascending: true })
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar soluções")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return
    try {
      const { error } = await supabase.from('solutions').delete().eq('id', id)
      if (error) throw error
      toast.success("Item excluído")
      fetchItems()
    } catch (error) {
      toast.error("Erro ao excluir")
    }
  }

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        description: item.description,
        icon_name: item.icon_name,
        sort_order: item.sort_order
      })
    } else {
      setEditingItem(null)
      setFormData({ title: "", description: "", icon_name: "Shield", sort_order: items.length + 1 })
    }
    setIsOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { error } = await supabase.from('solutions').update(formData).eq('id', editingItem.id)
        if (error) throw error
        toast.success("Atualizado com sucesso")
      } else {
        const { error } = await supabase.from('solutions').insert(formData)
        if (error) throw error
        toast.success("Criado com sucesso")
      }
      setIsOpen(false)
      fetchItems()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Nossas Soluções</h1>
        <Button onClick={() => handleOpen()}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Ícone</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.icon_name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editingItem ? "Editar Solução" : "Nova Solução"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
             <Label>Ícone</Label>
             <IconPicker value={formData.icon_name} onChange={(val) => setFormData({...formData, icon_name: val})} />
          </div>
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Ordem de Exibição</Label>
            <Input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
            />
          </div>
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </Dialog>
    </div>
  )
}
