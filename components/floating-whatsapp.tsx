"use client"

import { Phone } from "lucide-react"

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5515999999999" // Replace with actual number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
      aria-label="Fale conosco no WhatsApp"
    >
      <Phone className="h-7 w-7" />
    </a>
  )
}
