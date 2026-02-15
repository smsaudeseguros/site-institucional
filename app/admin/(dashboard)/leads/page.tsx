"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Mail, Phone, MessageCircle, History, UserCheck, Clock } from "lucide-react"
import { getUsers, getLeadInteractions, addInteraction } from "./actions"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [interactions, setInteractions] = useState<any[]>([])
  const [isInteractionOpen, setIsInteractionOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
    fetchUsers()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchUsers = async () => {
    const data = await getUsers()
    setUsers(data || [])
  }

  const fetchLeads = async () => {
    try {
      // Fetch leads with their LATEST interaction to show status
      // Note: Supabase JS doesn't support complex lateral joins easily for "latest" in one query without a view/function.
      // For now, we fetch leads and then maybe fetch latest status or just show "Has Interactions".
      // Let's stick to simple fetch and fetching interactions on demand, but maybe we can check if they have any.

      const { data, error } = await supabase
        .from('leads')
        .select('*, lead_interactions(count)') // Get count of interactions
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      toast.error("Erro ao carregar leads")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenInteraction = (lead: any) => {
    setSelectedLead(lead)
    setIsInteractionOpen(true)
  }

  const handleOpenHistory = async (lead: any) => {
    setSelectedLead(lead)
    setIsHistoryOpen(true)
    const data = await getLeadInteractions(lead.id)
    setInteractions(data)
  }

  const handleInteractionSubmit = async (formData: FormData) => {
    formData.append('lead_id', selectedLead.id)
    const res = await addInteraction(null, formData)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Atendimento registrado")
      setIsInteractionOpen(false)
      fetchLeads() // Refresh to update counts/status
    }
  }

  const handleReply = (lead: any) => {
      const subject = encodeURIComponent("Re: Contato via Site SM Saúde e Seguros")
      const body = encodeURIComponent(`Olá ${lead.name},\n\nRecebemos seu contato sobre ${lead.interest}.\n\n`)
      window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
  }

  const formatWhatsApp = (phone: string) => {
      if (!phone) return ""
      return phone.replace(/\D/g, '')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leads (Contatos)</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email / Telefone</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const interactionCount = lead.lead_interactions?.[0]?.count || 0
              return (
                <TableRow key={lead.id}>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">
                    {lead.name}
                    <div className="text-xs text-gray-500 truncate max-w-[200px]" title={lead.message}>{lead.message}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{lead.email}</span>
                      <span>{lead.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{lead.interest}</TableCell>
                  <TableCell>
                    {interactionCount > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Atendido ({interactionCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Novo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" title="Registrar Atendimento" onClick={() => handleOpenInteraction(lead)}>
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Ver Histórico" onClick={() => handleOpenHistory(lead)}>
                      <History className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="WhatsApp">
                      <a href={`https://wa.me/55${formatWhatsApp(lead.phone)}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {leads.map((lead) => {
           const interactionCount = lead.lead_interactions?.[0]?.count || 0
           return (
            <div key={lead.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <span className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                    <p className="text-sm text-blue-600 font-medium">{lead.interest}</p>
                </div>
                <div>
                  {interactionCount > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Atendido
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Novo
                      </span>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-400" /> {lead.email}
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400" /> {lead.phone}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded text-sm text-gray-600 line-clamp-2">
                {lead.message || "Sem mensagem."}
              </div>

              <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleOpenInteraction(lead)}>
                    <UserCheck className="h-4 w-4 mr-2" /> Atender
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenHistory(lead)}>
                    <History className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                      <a href={`https://wa.me/55${formatWhatsApp(lead.phone)}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                      </a>
                  </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Register Interaction Dialog */}
      <Dialog open={isInteractionOpen} onOpenChange={setIsInteractionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Atendimento</DialogTitle>
            <DialogDescription>
              Lead: {selectedLead?.name}
            </DialogDescription>
          </DialogHeader>
          <form action={handleInteractionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select name="user_id" defaultValue={currentUser?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o agente" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Canal de Atendimento</Label>
              <Select name="interaction_type" defaultValue="whatsapp">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="personally">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea name="notes" placeholder="Detalhes do contato..." />
            </div>
            <Button type="submit" className="w-full">Salvar Registro</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico de Atendimentos</DialogTitle>
            <DialogDescription>
              Lead: {selectedLead?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {interactions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nenhum atendimento registrado.</p>
            ) : (
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg border">
                    <div className="mt-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {interaction.interaction_type === 'whatsapp' && <MessageCircle className="h-4 w-4" />}
                        {interaction.interaction_type === 'email' && <Mail className="h-4 w-4" />}
                        {interaction.interaction_type === 'phone' && <Phone className="h-4 w-4" />}
                        {interaction.interaction_type === 'personally' && <UserCheck className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{interaction.user?.email || 'Usuário Desconhecido'}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(interaction.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase mt-1 mb-2">
                        Via {interaction.interaction_type}
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{interaction.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
