"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Mail, Phone, MessageCircle, Eye, Download } from "lucide-react"
import * as XLSX from "xlsx"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      toast.error("Erro ao carregar leads")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetails = (lead: any) => {
    setSelectedLead(lead)
    setIsDetailsOpen(true)
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

  const exportToExcel = () => {
    try {
      if (!leads || leads.length === 0) {
        toast.warning("Não há leads para exportar.")
        return
      }

      const exportData = leads.map(lead => {
         const metadata = lead.metadata || {}
         return {
            "ID": lead.id,
            "Data Cadastro": new Date(lead.created_at).toLocaleString(),
            "Nome": lead.name,
            "Email": lead.email,
            "Telefone": lead.phone,
            "Interesse": lead.interest,
            "Mensagem": lead.message || "",
            // Additional typical metadata
            "É PJ": metadata.isPJ ? "Sim" : "Não",
            "CNPJ": metadata.cnpj || "",
            "Vidas": metadata.vidas || "",
            "Tipo Contratação": metadata.tipoContratacao || "",
            "Possui Plano": metadata.possuiPlanoAtivo || "",
            "Idade": metadata.idade || "",
            "Profissão": metadata.profissao || "",
            "Cidade": metadata.cidade || "",
            "Valor Veículo": metadata.valorVeiculo || "",
            "Valor Entrada": metadata.valorEntrada || "",
            "Modelo": metadata.modeloVeiculo || "",
            "Ano": metadata.anoVeiculo || "",
         }
      })

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads")
      XLSX.writeFile(workbook, "Leads_SM_Saude_Seguros.xlsx")

      toast.success("Arquivo exportado com sucesso!")
    } catch (error) {
      console.error("Erro ao exportar excel:", error)
      toast.error("Ocorreu um erro ao exportar os dados.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Leads (Contatos)</h1>
        <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Exportar para Excel
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email / Telefone</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
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
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" title="Ver Detalhes" onClick={() => handleOpenDetails(lead)}>
                      <Eye className="h-4 w-4 text-slate-600" />
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
           return (
            <div key={lead.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <span className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                    <p className="text-sm text-blue-600 font-medium">{lead.interest}</p>
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
                  <Button variant="outline" size="sm" onClick={() => handleOpenDetails(lead)}>
                    <Eye className="h-4 w-4 mr-2" /> Detalhes
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

      {/* Lead Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas enviadas pelo usuário.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                <div>
                  <Label className="text-xs text-gray-500 uppercase">Nome</Label>
                  <p className="font-medium text-sm">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase">Data</Label>
                  <p className="font-medium text-sm">{new Date(selectedLead.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase">E-mail</Label>
                  <p className="font-medium text-sm">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase">Telefone</Label>
                  <p className="font-medium text-sm">{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase">Interesse</Label>
                  <p className="font-medium text-sm">{selectedLead.interest}</p>
                </div>
              </div>

              {selectedLead.message && (
                 <div>
                    <Label className="text-xs text-gray-500 uppercase">Mensagem Adicional</Label>
                    <div className="bg-slate-50 p-3 rounded-lg border text-sm mt-1 whitespace-pre-wrap">
                      {selectedLead.message}
                    </div>
                 </div>
              )}

              {selectedLead.metadata && Object.keys(selectedLead.metadata).length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500 uppercase mb-2 block">Informações Específicas (Metadata)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    {Object.entries(selectedLead.metadata).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs text-gray-500 uppercase">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <p className="font-medium text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
