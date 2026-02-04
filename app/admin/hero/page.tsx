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

export default function HeroPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>({})
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('hero_section').select('*').single()
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
      console.error(error)
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { count } = await supabase.from('hero_section').select('*', { count: 'exact', head: true }).eq('id', 1)
      let error;
      if (count === 0) {
          const { error: insertError } = await supabase.from('hero_section').insert({ ...data, id: 1 })
          error = insertError
      } else {
          const { error: updateError } = await supabase.from('hero_section').update(data).eq('id', 1)
          error = updateError
      }

      if (error) throw error
      toast.success("Hero Banner salvo com sucesso!")
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
      <h1 className="text-3xl font-bold">Hero Banner</h1>
      <form onSubmit={handleSave} className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Principal</CardTitle>
            <CardDescription>O que aparece na primeira dobra do site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Título Principal</Label>
              <Input
                value={data.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo / Texto de Apoio</Label>
              <Textarea
                value={data.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label>Imagem de Destaque</Label>
              <ImageUpload
                value={data.hero_image_url}
                onChange={(url) => handleChange('hero_image_url', url)}
              />
            </div>
             <div className="space-y-2">
              <Label>Citação (Card flutuante)</Label>
              <Textarea
                value={data.quote_text || ''}
                onChange={(e) => handleChange('quote_text', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chamadas para Ação (CTAs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto Botão Primário</Label>
                  <Input
                    value={data.cta_primary_text || ''}
                    onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link Botão Primário</Label>
                  <Input
                    value={data.cta_primary_link || ''}
                    onChange={(e) => handleChange('cta_primary_link', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto Botão Secundário</Label>
                  <Input
                    value={data.cta_secondary_text || ''}
                    onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link Botão Secundário</Label>
                  <Input
                    value={data.cta_secondary_link || ''}
                    onChange={(e) => handleChange('cta_secondary_link', e.target.value)}
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
