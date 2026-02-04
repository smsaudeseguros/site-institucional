import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-primary">
                <Shield className="mr-2 h-4 w-4" />
                Segurança e Previsibilidade
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl xl:text-6xl/none text-slate-900 break-words">
                O futuro da sua família não pode depender da sorte.
              </h1>
              <p className="max-w-[600px] text-slate-600 text-base md:text-xl">
                Você cuida de tudo e de todos. Mas quem cuida de você?
                Garanta planos de saúde e seguros com a solidez que sua família merece.
                Durma tranquilo sabendo que fez a escolha certa.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-8 w-full sm:w-auto">
                <Link href="#contact">
                  Fazer Cotação Personalizada
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-8 border-primary text-primary hover:bg-green-50 w-full sm:w-auto">
                <Link href="#about">
                  Conhecer a SM Saúde
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
             {/* Placeholder for Hero Image */}
             <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl flex items-center justify-center border border-slate-200">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-90 mix-blend-overlay"></div>
                <div className="relative z-10 p-8 text-center">
                    <p className="text-slate-800 font-medium bg-white/80 p-4 rounded-lg backdrop-blur-sm shadow-sm">
                      &quot;Se algo acontecer, eu preciso ter feito tudo o que estava ao meu alcance.&quot;
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
