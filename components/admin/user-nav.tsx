"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-3 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50">
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  )
}
