"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import { Trash, Plus, GripVertical } from "lucide-react"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [savingText, setSavingText] = useState(false)
  const [aboutData, setAboutData] = useState<any>({})
  const [spotlights, setSpotlights] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [newSpotlight, setNewSpotlight] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [aboutRes, spotlightsRes, imagesRes] = await Promise.all([
        supabase.from('about_section').select('*').single(),
        supabase.from('about_spotlights').select('*').order('sort_order', { ascending: true }),
        supabase.from('about_images').select('*').order('sort_order', { ascending: true })
      ])

      if (aboutRes.error && aboutRes.error.code !== 'PGRST116') throw aboutRes.error
      if (spotlightsRes.error) throw spotlightsRes.error
      if (imagesRes.error) throw imagesRes.error

      setAboutData(aboutRes.data || {})
      setSpotlights(spotlightsRes.data || [])
      setImages(imagesRes.data || [])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingText(true)
    try {
       const { count } = await supabase.from('about_section').select('*', { count: 'exact', head: true }).eq('id', 1)

       if (count === 0) {
           await supabase.from('about_section').insert({ ...aboutData, id: 1 })
       } else {
           await supabase.from('about_section').update(aboutData).eq('id', 1)
       }
       toast.success("Texto salvo")
    } catch (error) {
       toast.error("Erro ao salvar texto")
    } finally {
       setSavingText(false)
    }
  }

  const handleAddSpotlight = async () => {
      if (!newSpotlight) return
      try {
          const { error } = await supabase.from('about_spotlights').insert({
              text: newSpotlight,
              sort_order: spotlights.length + 1
          })
          if (error) throw error
          setNewSpotlight("")
          fetchData() // Refresh to get ID
          toast.success("Spotlight adicionado")
      } catch (error) {
          toast.error("Erro ao adicionar")
      }
  }

  const handleDeleteSpotlight = async (id: number) => {
      try {
          await supabase.from('about_spotlights').delete().eq('id', id)
          setSpotlights(prev => prev.filter(s => s.id !== id))
          toast.success("Removido")
      } catch (error) {
          toast.error("Erro ao remover")
      }
  }

  const handleAddImage = async (url: string) => {
      try {
          const { error } = await supabase.from('about_images').insert({
              image_url: url,
              sort_order: images.length + 1
          })
          if (error) throw error
          fetchData()
          toast.success("Imagem adicionada")
      } catch (error) {
          toast.error("Erro ao adicionar imagem")
      }
  }

  const handleDeleteImage = async (id: number) => {
      try {
          await supabase.from('about_images').delete().eq('id', id)
          setImages(prev => prev.filter(i => i.id !== id))
          toast.success("Imagem removida")
      } catch (error) {
          toast.error("Erro ao remover imagem")
      }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Sobre Nós</h1>

      <div className="grid gap-6 md:grid-cols-2">
          {/* Coluna da Esquerda: Textos */}
          <div className="space-y-6">
              <Card>
                  <CardHeader><CardTitle>Textos Principais</CardTitle></CardHeader>
                  <CardContent>
                      <form onSubmit={handleSaveText} className="space-y-4">
                          <div className="space-y-2">
                              <Label>Título</Label>
                              <Input
                                value={aboutData.title || ''}
                                onChange={e => setAboutData({...aboutData, title: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <Label>Parágrafo 1</Label>
                              <Textarea
                                className="h-32"
                                value={aboutData.description_1 || ''}
                                onChange={e => setAboutData({...aboutData, description_1: e.target.value})}
                              />
                          </div>
                           <div className="space-y-2">
                              <Label>Parágrafo 2</Label>
                              <Textarea
                                className="h-32"
                                value={aboutData.description_2 || ''}
                                onChange={e => setAboutData({...aboutData, description_2: e.target.value})}
                              />
                          </div>
                          <Button type="submit" disabled={savingText}>Salvar Textos</Button>
                      </form>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader><CardTitle>Destaques (Lista com Check)</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex gap-2">
                          <Input
                            placeholder="Novo destaque..."
                            value={newSpotlight}
                            onChange={e => setNewSpotlight(e.target.value)}
                          />
                          <Button onClick={handleAddSpotlight} size="icon"><Plus className="h-4 w-4" /></Button>
                      </div>
                      <div className="space-y-2">
                          {spotlights.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-2 border rounded bg-slate-50">
                                  <span className="text-sm">{item.text}</span>
                                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteSpotlight(item.id)}>
                                      <Trash className="h-4 w-4" />
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Coluna da Direita: Imagens */}
          <div className="space-y-6">
              <Card>
                  <CardHeader><CardTitle>Galeria de Imagens</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label>Adicionar Nova Imagem</Label>
                          <ImageUpload onChange={handleAddImage} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                          {images.map(img => (
                              <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border group">
                                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img.id)}>
                                          <Trash className="h-4 w-4 mr-2" /> Remover
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  )
}
