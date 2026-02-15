import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"
import { MobileSidebar } from "@/components/admin/mobile-sidebar"
import { UserNav } from "@/components/admin/user-nav"

// Ensure this layout and its children are not statically generated
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-slate-50/40 lg:block dark:bg-slate-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={30} className="h-8 w-auto object-contain" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <AdminSidebar />
          </div>
          <div className="mt-auto p-4 border-t">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-slate-50/40 px-6 dark:bg-slate-800/40">
            <div className="lg:hidden">
                <MobileSidebar />
            </div>
            <div className="w-full flex-1">
                <h1 className="font-semibold text-lg">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
               {user.email}
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  )
}
