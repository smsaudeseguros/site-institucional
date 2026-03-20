"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, CheckCircle2, XCircle } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>({})

  // Logs state
  const [logs, setLogs] = useState<any[]>([])
  const [systemLogs, setSystemLogs] = useState<any[]>([])
  const [isLogsOpen, setIsLogsOpen] = useState(false)
  const [isSystemLogsOpen, setIsSystemLogsOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [selectedSystemLog, setSelectedSystemLog] = useState<any>(null)
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [loadingSystemLogs, setLoadingSystemLogs] = useState(false)

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

  const fetchLogs = async () => {
    setLoadingLogs(true)
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar logs de webhook")
    } finally {
      setLoadingLogs(false)
    }
  }

  const fetchSystemLogs = async () => {
    setLoadingSystemLogs(true)
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(150)

      if (error) throw error
      setSystemLogs(data || [])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar logs do sistema")
    } finally {
      setLoadingSystemLogs(false)
    }
  }

  const handleOpenLogs = () => {
    setIsLogsOpen(true)
    fetchLogs()
  }

  const handleOpenSystemLogs = () => {
    setIsSystemLogsOpen(true)
    fetchSystemLogs()
  }

  const handleChange = (key: string, value: string) => {
    setData((prev: any) => ({ ...prev, [key]: value }))
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="w-full mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Configurações do Site</h1>
      <form onSubmit={handleSave} className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Logo, Favicon e informações gerais</CardDescription>
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
              <Label>Favicon (Ícone da Aba)</Label>
              <ImageUpload
                value={data.favicon_url}
                onChange={(url) => handleChange('favicon_url', url)}
              />
              <p className="text-xs text-slate-500">
                Se nenhum favicon for enviado, o logotipo principal será utilizado automaticamente e centralizado.
              </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
            <CardDescription>Conecte o sistema a outras ferramentas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label>URL do Webhook (n8n, Zapier, etc.)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://sua-url-do-webhook.com"
                      value={data.webhook_n8n_url || ''}
                      onChange={(e) => handleChange('webhook_n8n_url', e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleOpenLogs} title="Histórico de Logs">
                      <History className="h-4 w-4 mr-2" /> Webhook Logs
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Sempre que um novo Lead for capturado, o sistema enviará um POST com os dados do Lead para esta URL.
                  </p>
                </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs do Sistema</CardTitle>
            <CardDescription>Visualize o histórico de submissões de formulário e erros internos do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={handleOpenSystemLogs} className="w-full sm:w-auto">
              <History className="h-4 w-4 mr-2" /> Visualizar Logs do Sistema
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>

      {/* System Logs Dialog */}
      <Dialog open={isSystemLogsOpen} onOpenChange={setIsSystemLogsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>Logs do Sistema</DialogTitle>
            <DialogDescription>
              Últimos eventos e falhas internas registrados (máx 150).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex-1">
            {loadingSystemLogs ? (
              <p className="text-center text-slate-500 py-4">Carregando logs...</p>
            ) : systemLogs.length === 0 ? (
              <p className="text-center text-slate-500 py-4">Nenhum log encontrado.</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data / Hora</TableHead>
                        <TableHead>Evento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.event_type}
                          </TableCell>
                          <TableCell>
                            {log.status === 'SUCCESS' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                  <CheckCircle2 className="h-3 w-3" /> Sucesso
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                                  <XCircle className="h-3 w-3" /> Erro
                                </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedSystemLog(log)}>
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* System Log Details Secondary Dialog */}
      <Dialog open={!!selectedSystemLog} onOpenChange={(open) => !open && setSelectedSystemLog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Detalhes do Evento</DialogTitle>
             <DialogDescription>
               Inspecione os dados submetidos e possíveis mensagens de erro.
             </DialogDescription>
           </DialogHeader>
           {selectedSystemLog && (
             <div className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase">Payload</Label>
                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg border text-xs overflow-auto max-h-[400px] shadow-inner">
                        {JSON.stringify(selectedSystemLog.payload, null, 2) || "Nenhum payload"}
                    </pre>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase">Mensagem de Erro</Label>
                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg border text-xs overflow-auto max-h-[200px] shadow-inner">
                        {selectedSystemLog.error_message || "Nenhum erro registrado"}
                    </pre>
                </div>
             </div>
           )}
        </DialogContent>
      </Dialog>

      {/* Webhook Logs Dialog */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>Histórico de Webhooks</DialogTitle>
            <DialogDescription>
              Últimos envios para o webhook configurado (máx 100).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex-1">
            {loadingLogs ? (
              <p className="text-center text-slate-500 py-4">Carregando logs...</p>
            ) : logs.length === 0 ? (
              <p className="text-center text-slate-500 py-4">Nenhum log encontrado.</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data / Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {log.response_status >= 200 && log.response_status < 300 ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                  <CheckCircle2 className="h-3 w-3" /> {log.response_status}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                                  <XCircle className="h-3 w-3" /> {log.response_status === 0 ? 'Erro' : log.response_status}
                                </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Webhook Log Details Secondary Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Envio (Webhook)</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase">URL de Destino</Label>
                  <div className="bg-slate-50 p-3 rounded-lg border text-xs break-all text-slate-700 font-mono">
                      {selectedLog.url}
                  </div>
              </div>

              <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase">Request Body (Enviado)</Label>
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg border text-xs overflow-auto max-h-[300px] shadow-inner">
                      {JSON.stringify(selectedLog.request_body, null, 2)}
                  </pre>
              </div>
              <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase">Response Headers</Label>
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg border text-xs overflow-auto max-h-[200px] shadow-inner">
                      {JSON.stringify(selectedLog.response_headers, null, 2) || "Nenhum header retornado"}
                  </pre>
              </div>
              <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase">Response Body (Recebido)</Label>
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg border text-xs overflow-auto max-h-[200px] shadow-inner">
                      {selectedLog.response_body || "Nenhum body retornado"}
                  </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
