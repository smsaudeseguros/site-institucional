"use client"

import * as React from "react"
import { Phone, User } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FloatingWhatsAppProps {
  data?: {
    contact_whatsapp_matheus?: string
    contact_whatsapp_silvio?: string
  }
}

export function FloatingWhatsApp({ data }: FloatingWhatsAppProps) {
  const whatsappMatheus = data?.contact_whatsapp_matheus || "https://wa.me/5515991849321"
  const whatsappSilvio = data?.contact_whatsapp_silvio || "https://wa.me/5511992668941"

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
            aria-label="Fale conosco no WhatsApp"
          >
            <Phone className="h-7 w-7" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2 mb-2 mr-2" side="top" align="end">
          <div className="flex flex-col gap-2">
            <a
              href={whatsappMatheus}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors group"
            >
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                  <User className="h-5 w-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Especialista</span>
                  <span className="text-sm font-semibold text-slate-800">Matheus</span>
               </div>
            </a>
            <a
              href={whatsappSilvio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors group"
            >
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                  <User className="h-5 w-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Especialista</span>
                  <span className="text-sm font-semibold text-slate-800">Silvio</span>
               </div>
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
