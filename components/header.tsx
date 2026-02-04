"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AGGER_SYSTEM_URL } from "@/lib/constants"

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl || "/logo.png"}
              alt="SM Saúde e Seguros"
              width={160}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {items.map((item) => (
              <Link
                key={item.id || item.label}
                href={item.url}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-green-50">
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
            className="md:hidden"
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
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {items.map((item) => (
              <Link
                key={item.id || item.label}
                href={item.url}
                className="text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
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
      )}
    </header>
  )
}
