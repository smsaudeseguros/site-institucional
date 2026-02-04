"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import imageCompression from "browser-image-compression"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  bucket?: string
}

export function ImageUpload({ value, onChange, disabled, bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "app-smsaudeeseguros-institucional" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // 1. Compress Image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp"
      }

      const compressedFile = await imageCompression(file, options)

      // 2. Upload to Supabase
      const fileExt = "webp"
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressedFile)

      if (uploadError) throw uploadError

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onChange(publicUrl)
      toast.success("Imagem enviada com sucesso!")
    } catch (error: any) {
      console.error(error)
      toast.error("Erro ao enviar imagem: " + error.message)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-slate-100">
           <Image
             src={value}
             alt="Upload"
             fill
             className="object-cover"
           />
           <Button
             type="button"
             variant="destructive"
             size="icon"
             className="absolute right-2 top-2 h-8 w-8"
             onClick={handleRemove}
             disabled={disabled || loading}
           >
             <X className="h-4 w-4" />
           </Button>
        </div>
      ) : (
        <div
            className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
             {loading ? (
                 <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
             ) : (
                 <div className="flex flex-col items-center gap-2 text-slate-500">
                     <Upload className="h-10 w-10" />
                     <span className="text-sm font-medium">Clique para enviar</span>
                     <span className="text-xs text-slate-400">JPG, PNG, WebP (Max 5MB)</span>
                 </div>
             )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/avif"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />
    </div>
  )
}
