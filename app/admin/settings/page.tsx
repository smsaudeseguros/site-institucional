"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"

export default function SettingsPage() {
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
          // If no row exists, we might need to insert one (should be handled by seed, but defensive coding)
          if (error.code === 'PGRST116') {
             // Handle empty case
             setData({})
          } else {
             throw error
          }
      } else {
        setData(data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Check if ID 1 exists, if not insert
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
      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      console.error(error)
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
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Configurações do Site</h1>
      <form onSubmit={handleSave} className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Logo e informações gerais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo do Site</Label>
              <ImageUpload
                value={data.logo_url}
                onChange={(url) => handleChange('logo_url', url)}
              />
            </div>
            <div className="space-y-2">
              <Label>Texto do Rodapé</Label>
              <Textarea
                value={data.footer_text || ''}
                onChange={(e) => handleChange('footer_text', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO e Metadados</CardTitle>
            <CardDescription>Como o site aparece no Google e Redes Sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Título do Site (SEO)</Label>
              <Input
                value={data.seo_title || ''}
                onChange={(e) => handleChange('seo_title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (SEO)</Label>
              <Textarea
                value={data.seo_description || ''}
                onChange={(e) => handleChange('seo_description', e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label>Imagem de Compartilhamento (OG Image)</Label>
              <ImageUpload
                value={data.og_image_url}
                onChange={(url) => handleChange('og_image_url', url)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>Informações exibidas no site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email de Contato</Label>
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
                  <Label>WhatsApp (apenas números)</Label>
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

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={data.social_instagram || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={data.social_facebook || ''}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={data.social_linkedin || ''}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                  />
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
