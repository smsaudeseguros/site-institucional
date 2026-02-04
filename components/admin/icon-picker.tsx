"use client"

import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const ICON_NAMES = [
  "Shield", "ShieldCheck", "Heart", "HeartPulse", "Home", "Car", "Umbrella",
  "FileText", "CheckCircle", "Cross", "Stethoscope", "Pill", "Building", "Users",
  "Star", "Smartphone", "Mail", "MapPin", "Phone", "Check", "Plus", "Trash",
  "Settings", "Search", "Menu", "X", "ChevronDown", "ChevronUp", "ArrowRight",
  "Zap", "Activity", "Briefcase", "DollarSign", "Lock"
]

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredIcons = ICON_NAMES.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
           <SelectedIcon className="h-4 w-4" />
           <span>{value || "Selecionar Ícone"}</span>
        </div>
      </Button>

      <Dialog open={open} onOpenChange={setOpen} title="Escolher Ícone">
         <div className="space-y-4">
            <Input
              placeholder="Buscar ícone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto p-2">
                {filteredIcons.map(name => {
                    const Icon = (Icons as any)[name]
                    if (!Icon) return null
                    return (
                        <button
                            key={name}
                            type="button"
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-md p-2 hover:bg-slate-100 transition-colors",
                                value === name && "bg-primary/10 text-primary"
                            )}
                            onClick={() => {
                                onChange(name)
                                setOpen(false)
                            }}
                        >
                            <Icon className="h-6 w-6" />
                        </button>
                    )
                })}
            </div>
         </div>
      </Dialog>
    </>
  )
}
