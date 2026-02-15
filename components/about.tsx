"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface AboutProps {
  data?: {
    section?: any
    spotlights?: any[]
    images?: any[]
  }
}

export function About({ data }: AboutProps) {
  const {
    section,
    spotlights = [],
    images = []
  } = data || {}

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Carousel logic
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Auto-play
  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(nextImage, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  // Determine if images should be displayed
  const hasImages = images && images.length > 0

  // Fallback spotlights if loading or empty (optional, but requested to seed)
  const displaySpotlights = spotlights.length > 0 ? spotlights : [
    { text: "Mais de 10 anos de experiência no mercado segurador" },
    { text: "Parceria com as maiores seguradoras nacionais e internacionais" },
    { text: "Atendimento consultivo e personalizado (Humanizado)" },
    { text: "Foco total na proteção patrimonial e familiar" },
    { text: "Agilidade na resolução de sinistros" },
    { text: "Transparência total nas apólices" }
  ]

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid gap-12 ${hasImages ? "lg:grid-cols-2" : "max-w-4xl mx-auto"} items-center`}>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              {section?.title || "Sobre a SM Saúde e Seguros"}
            </h2>
            <p className="text-lg text-slate-700">
              {section?.description_1 || "Fundada por Matheus e Silvio, a SM Saúde e Seguros nasceu de uma necessidade clara: oferecer um atendimento que vai além da venda. Nós entendemos que contratar um seguro é um ato de responsabilidade e amor."}
            </p>
            <p className="text-slate-600">
              {section?.description_2 || "Com mais de uma década de atuação, nos especializamos em atender clientes que buscam não apenas um preço, mas a certeza de que estarão amparados quando mais precisarem. Nossa missão é simplificar o complexo e garantir sua tranquilidade."}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {displaySpotlights.map((benefit: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Carousel - Only render if images exist */}
          {hasImages && (
            <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-xl shadow-xl lg:order-last bg-slate-200">
                <>
                  <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {images.map((img: any) => (
                        <div key={img.id} className="relative min-w-full h-full">
                          <Image
                            src={img.image_url}
                            alt={img.alt_text || "About Image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                    ))}
                  </div>

                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full z-10"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full z-10"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {images.map((_: any, idx: number) => (
                              <button
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"}`}
                                  onClick={() => setCurrentImageIndex(idx)}
                              />
                          ))}
                      </div>
                    </>
                  )}
                </>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
