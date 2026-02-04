import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="inline-block bg-white p-2 rounded-lg">
              <Image
                src="/logo.png"
                alt="SM Saúde e Seguros"
                width={140}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Consultoria especializada em proteger o que mais importa para você.
              Solidez, confiança e atendimento humanizado.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Soluções</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#contact" className="hover:text-primary transition-colors">Planos de Saúde</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Seguro de Vida</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Seguro Auto</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Seguro Residencial</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#about" className="hover:text-primary transition-colors">Quem Somos</Link></li>
              <li><Link href="#testimonials" className="hover:text-primary transition-colors">Depoimentos</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">Perguntas Frequentes</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SM Saúde e Seguros. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
