"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil, Trash, Plus } from "lucide-react"

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", role: "", content: "", sort_order: 0 })
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      toast.error("Erro ao carregar depoimentos")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza?")) return
    try {
      await supabase.from('testimonials').delete().eq('id', id)
      toast.success("Excluído")
      fetchItems()
    } catch (error) {
      toast.error("Erro ao excluir")
    }
  }

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        role: item.role,
        content: item.content,
        sort_order: item.sort_order
      })
    } else {
      setEditingItem(null)
      setFormData({ name: "", role: "", content: "", sort_order: items.length + 1 })
    }
    setIsOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await supabase.from('testimonials').update(formData).eq('id', editingItem.id)
        toast.success("Atualizado")
      } else {
        await supabase.from('testimonials').insert(formData)
        toast.success("Criado")
      }
      setIsOpen(false)
      fetchItems()
    } catch (error) {
      toast.error("Erro ao salvar")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Depoimentos</h1>
        <Button onClick={() => handleOpen()}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
      </div>
      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo/Função</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(item.id)}><Trash className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen} title={editingItem ? "Editar Depoimento" : "Novo Depoimento"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Cargo / Função</Label>
            <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Depoimento</Label>
            <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
          </div>
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </Dialog>
    </div>
  )
}
