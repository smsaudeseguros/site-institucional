import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "lucide-react"

interface ServicesProps {
  data?: any[]
}

export function Services({ data }: ServicesProps) {
  const services = data || []

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
             const Icon = (Icons as any)[service.icon_name] || Icons.HelpCircle

             return (
                <Card key={index} className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-none">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gradient" />
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-slate-600">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
             )
          })}
        </div>
      </div>
    </section>
  )
}
