"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SolutionsFormModal } from "@/components/solutions-form-modal"
import * as Icons from "lucide-react"

interface ServicesProps {
  data?: any[]
}

export function Services({ data }: ServicesProps) {
  const services = data || []

  const [selectedService, setSelectedService] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleActionClick = (service: any) => {
    if (service.action_type === 'link' && service.action_link) {
      window.open(service.action_link, '_blank', 'noopener,noreferrer')
    } else {
      setSelectedService(service)
      setIsModalOpen(true)
    }
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Nossas Soluções
          </h2>
          <p className="mt-4 text-slate-600 md:text-lg">
            Coberturas completas para todas as áreas da sua vida.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service, index) => {
             const Icon = (Icons as any)[service.icon_name] || Icons.HelpCircle

             return (
                <Card key={index} className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gradient" />
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-slate-600">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-4 mt-auto border-t">
                    <Button
                      className="w-full bg-brand-gradient hover:opacity-90 text-white"
                      onClick={() => handleActionClick(service)}
                    >
                      {service.button_text_card || "Cotar agora"}
                    </Button>
                  </CardFooter>
                </Card>
             )
          })}
        </div>
      </div>

      {selectedService && (
        <SolutionsFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceTitle={selectedService.title}
          buttonTextForm={selectedService.button_text_form}
        />
      )}
    </section>
  )
}
