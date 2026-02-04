"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/update-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Erro ao solicitar recuperação de senha")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-white p-2 rounded-lg inline-block shadow-sm">
             <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-8 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu e-mail para receber um link de redefinição.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Verifique seu e-mail para continuar.
            </div>
          )}
          {!success && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Link
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
           <Link href="/admin/login" className="flex items-center text-sm text-slate-500 hover:text-primary">
              <ArrowLeft className="mr-1 h-3 w-3" /> Voltar para o login
           </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
