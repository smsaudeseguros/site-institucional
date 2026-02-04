import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialsProps {
  data?: any[]
}

export function Testimonials({ data }: TestimonialsProps) {
  const testimonials = data || []

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
         <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter text-primary">
            O que nossos clientes dizem
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-slate-50 border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">&quot;{t.content}&quot;</p>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
