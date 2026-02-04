"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-1">
      <Button variant="ghost" size="sm" asChild className="w-full justify-start gap-3 px-3 text-slate-500 hover:text-primary">
         <Link href="/admin/profile">
            <User className="h-4 w-4" />
            Meu Perfil
         </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="w-full justify-start gap-3 px-3 text-slate-500 hover:text-primary">
         <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
            Configurações
         </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-3 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50">
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  )
}
