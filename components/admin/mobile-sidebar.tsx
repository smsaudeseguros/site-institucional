"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/sidebar"
import Image from "next/image"
import Link from "next/link"

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex flex-col h-full">
            <div className="flex h-[60px] items-center border-b px-6">
                <Link className="flex items-center gap-2 font-semibold" href="/">
                    <Image src="/logo.png" alt="Logo" width={100} height={30} className="h-8 w-auto object-contain" />
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <AdminSidebar />
            </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
