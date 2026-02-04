"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

interface ContactProps {
  data?: {
    contact_phone?: string
    contact_email?: string
    contact_address?: string
    contact_whatsapp_matheus?: string
    contact_whatsapp_silvio?: string
  }
}

export function Contact({ data }: ContactProps) {
  const {
    contact_phone = "(15) 99999-9999",
    contact_email = "contato@smsaudeseguros.com.br",
    contact_address = "Sorocaba, SP (Atendimento Nacional)",
    contact_whatsapp_matheus = "https://wa.me/5515991849321",
    contact_whatsapp_silvio = "https://wa.me/5511992668941"
  } = data || {}

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const submissionData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      interest: formData.get("interest"),
      message: formData.get("message"),
    }

    try {
      const { error } = await supabase.from('leads').insert([submissionData])
      if (error) throw error

      setSubmitted(true)
      toast.success("Mensagem enviada com sucesso!")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Ocorreu um erro ao enviar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Vamos conversar?
            </h2>
            <p className="text-lg text-slate-600">
              Preencha o formulário e um de nossos consultores entrará em contato para entender sua necessidade e apresentar a melhor solução.
            </p>

            <div className="space-y-6">

              {
                contact_phone && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Telefone para Contato</p>
                      <p className="text-slate-600">{contact_phone}</p>
                    </div>
                  </div>
                )
              }

              {contact_whatsapp_matheus && (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Especialista Matheus</p>
                    <a href={contact_whatsapp_matheus} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      Chamar no WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {contact_whatsapp_silvio && (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Especialista Silvio</p>
                    <a href={contact_whatsapp_silvio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      Chamar no WhatsApp
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">E-mail</p>
                  <p className="text-slate-600">{contact_email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Localização</p>
                  <p className="text-slate-600">{contact_address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-lg md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                 <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8" />
                 </div>
                 <h3 className="text-2xl font-bold text-primary">Mensagem Enviada!</h3>
                 <p className="text-slate-600">Recebemos seu contato. Em breve um especialista falará com você.</p>
                 <Button variant="outline" onClick={() => setSubmitted(false)}>Enviar nova mensagem</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Nome Completo</label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Carlos Silva"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">Telefone</label>
                    <input
                      id="phone"
                      name="phone"
                      required
                      type="tel"
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">E-mail</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="interest" className="text-sm font-medium text-slate-700">Tenho interesse em</label>
                  <select
                    id="interest"
                    name="interest"
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>Plano de Saúde</option>
                    <option>Seguro de Vida</option>
                    <option>Seguro Auto</option>
                    <option>Seguro Residencial</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="grid gap-2">
                   <label htmlFor="message" className="text-sm font-medium text-slate-700">Mensagem (Opcional)</label>
                   <textarea
                      id="message"
                      name="message"
                      className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Conte um pouco mais sobre o que você precisa..."
                   />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Solicitar Cotação Gratuita"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
