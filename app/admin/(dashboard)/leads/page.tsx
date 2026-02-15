"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Mail, Phone, MessageCircle } from "lucide-react"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      toast.error("Erro ao carregar leads")
    } finally {
      setLoading(false)
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
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.interest}</TableCell>
                <TableCell className="max-w-xs truncate" title={lead.message}>{lead.message}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleReply(lead)}>
                    <Mail className="h-4 w-4 mr-2" /> Responder
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://wa.me/55${formatWhatsApp(lead.phone)}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 text-green-600" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <span className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                  <p className="text-sm text-blue-600 font-medium">{lead.interest}</p>
               </div>
               <div className="flex gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <a href={`https://wa.me/55${formatWhatsApp(lead.phone)}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 text-green-600" />
                    </a>
                  </Button>
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

            <div className="bg-slate-50 p-3 rounded text-sm text-gray-600">
               {lead.message || "Sem mensagem."}
            </div>

            <Button variant="outline" size="sm" className="w-full" onClick={() => handleReply(lead)}>
                <Mail className="h-4 w-4 mr-2" /> Responder por Email
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
