import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"

interface HeroProps {
  data: {
    title?: string
    subtitle?: string
    cta_primary_text?: string
    cta_primary_link?: string
    cta_secondary_text?: string
    cta_secondary_link?: string
    hero_image_url?: string
    quote_text?: string
  }
  siteConfig?: {
    cta_link?: string
  }
}

export function Hero({ data, siteConfig }: HeroProps) {
  const {
    title = "O futuro da sua família não pode depender da sorte.",
    subtitle = "Você cuida de tudo e de todos. Mas quem cuida de você? Garanta planos de saúde e seguros com a solidez que sua família merece. Durma tranquilo sabendo que fez a escolha certa.",
    cta_primary_text = "Fazer Cotação Personalizada",
    cta_primary_link = "#contact",
    cta_secondary_text = "Conhecer a SM Saúde",
    cta_secondary_link = "#about",
    hero_image_url = "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=800&auto=format&fit=crop",
    quote_text = "Se algo acontecer, eu preciso ter feito tudo o que estava ao meu alcance."
  } = data || {}

  const finalCtaLink = siteConfig?.cta_link || cta_primary_link

  // Only render image if a URL is provided
  const hasImage = !!hero_image_url && hero_image_url.trim() !== ""

  return (
    <section id="hero" className="relative overflow-hidden bg-brand-gradient py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid gap-12 items-center ${hasImage ? "md:grid-cols-2 md:gap-8" : "md:max-w-4xl md:mx-auto text-center"}`}>
          <div className={`flex flex-col justify-center space-y-8 ${!hasImage ? "items-center" : ""}`}>
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                <Shield className="mr-2 h-4 w-4" />
                Segurança e Previsibilidade
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl xl:text-6xl/none text-white break-words">
                {title}
              </h1>
              <p className={`text-slate-100 text-base md:text-xl ${hasImage ? "max-w-[600px]" : "max-w-[800px] mx-auto"}`}>
                {subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 text-base sm:text-lg px-8 w-full sm:w-auto border-none">
                <Link href={finalCtaLink}>
                  {cta_primary_text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {hasImage && (
            <div className="flex items-center justify-center">
               {/* Hero Image */}
               <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-2xl bg-white/10 shadow-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${hero_image_url}')` }}
                  ></div>
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
