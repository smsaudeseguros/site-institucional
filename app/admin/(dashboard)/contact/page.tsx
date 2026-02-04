"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>({})
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('site_config').select('*').single()
      if (error) {
           if (error.code === 'PGRST116') {
             setData({})
          } else {
             throw error
          }
      } else {
        setData(data)
      }
    } catch (error) {
      toast.error("Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { count } = await supabase.from('site_config').select('*', { count: 'exact', head: true }).eq('id', 1)

      let error;
      if (count === 0) {
          const { error: insertError } = await supabase.from('site_config').insert({ ...data, id: 1 })
          error = insertError
      } else {
          const { error: updateError } = await supabase.from('site_config').update(data).eq('id', 1)
          error = updateError
      }

      if (error) throw error
      toast.success("Informações de contato salvas!")
    } catch (error) {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setData((prev: any) => ({ ...prev, [key]: value }))
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="w-full mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Gestão de Contato</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>Estes dados aparecem no rodapé e na página de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={data.contact_email || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={data.contact_phone || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                  />
                </div>
                 <div className="space-y-2">
                  <Label>WhatsApp (apenas números, ex: 5515999999999)</Label>
                  <Input
                    value={data.contact_whatsapp || ''}
                    onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    value={data.contact_address || ''}
                    onChange={(e) => handleChange('contact_address', e.target.value)}
                  />
                </div>
             </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  )
}
