"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AGGER_SYSTEM_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface HeaderProps {
  logoUrl?: string
  menuItems?: any[]
  ctaText?: string
  ctaLink?: string
}

export function Header({
  logoUrl = "/logo.png",
  menuItems = [],
  ctaText = "Cotar Agora",
  ctaLink = "#contact"
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  React.useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY

        if (currentScrollY > lastScrollY && currentScrollY > 100) { // if scroll down and past 100px
          setIsVisible(false)
        } else { // if scroll up
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])


  // Fallback items if database is empty or error
  const defaultItems = [
    { label: "Início", url: "#hero" },
    { label: "Sobre", url: "#about" },
    { label: "Serviços", url: "#services" },
    { label: "Depoimentos", url: "#testimonials" },
    { label: "FAQ", url: "#faq" },
  ]

  const items = (menuItems && menuItems.length > 0) ? menuItems : defaultItems

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-transform duration-300",
        {
          "-translate-y-full": !isVisible,
          "translate-y-0": isVisible,
        }
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl || "/logo.png"}
              alt="SM Saúde e Seguros"
              width={160}
              height={85}
              className="h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {items.map((item, index) => (
              <Link
                key={item.id || index}
                href={item.url}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
             <Button asChild variant="outline" className="border-primary text-primary hover:bg-green-50">
              <Link href={AGGER_SYSTEM_URL} target="_blank" rel="noopener noreferrer">
                Área do Cliente
              </Link>
            </Button>
            <Button asChild>
              <Link href={ctaLink || "#contact"}>{ctaText || "Cotar Agora"}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white absolute w-full shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {items.map((item, index) => (
              <Link
                key={item.id || index}
                href={item.url}
                className="text-base font-medium text-foreground hover:text-primary py-2 border-b border-slate-50 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2">
              <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-green-50">
                <Link href={AGGER_SYSTEM_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                  Área do Cliente
                </Link>
              </Button>
               <Button asChild className="w-full">
                <Link href={ctaLink || "#contact"} onClick={() => setIsMenuOpen(false)}>{ctaText || "Cotar Agora"}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
