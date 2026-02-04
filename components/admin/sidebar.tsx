"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  Users,
  HelpCircle,
  Phone,
  LayoutTemplate,
  Shield,
  Menu
} from "lucide-react"

import { User } from "lucide-react"

const sidebarItems = [
  { href: "/admin/profile", icon: User, label: "Meu Perfil" },
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/leads", icon: MessageSquare, label: "Leads" },
  { href: "/admin/hero", icon: LayoutTemplate, label: "Hero Banner" },
  { href: "/admin/menu", icon: Menu, label: "Menu do Site" },
  { href: "/admin/solutions", icon: Shield, label: "Soluções" },
  { href: "/admin/about", icon: ImageIcon, label: "Sobre Nós" },
  { href: "/admin/testimonials", icon: Users, label: "Depoimentos" },
  { href: "/admin/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/admin/contact", icon: Phone, label: "Contato" },
  { href: "/admin/settings", icon: Settings, label: "Configurações" },
  { href: "/admin/users", icon: Users, label: "Usuários" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 p-4 text-sm font-medium">
      {sidebarItems.map((item, index) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
