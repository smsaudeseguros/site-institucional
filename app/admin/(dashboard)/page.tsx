import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bem-vindo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Painel SM Saúde</div>
          <p className="text-xs text-muted-foreground">
            Gerencie todo o conteúdo do site aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
