import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Mail, MailOpen, CalendarClock, ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { getMensagens, getStats } from "@/app/actions/admin"
import { AdminMessages } from "@/components/admin-messages"
import { AdminChart } from "@/components/admin-chart"
import { AdminSignOut } from "@/components/admin-signout"

export const metadata = { title: "Painel de mensagens" }

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/admin/login")

  const [mensagens, stats] = await Promise.all([getMensagens(), getStats()])

  const kpis = [
    { label: "Mensagens recebidas", valor: stats.total, icon: Mail },
    { label: "Não lidas", valor: stats.naoLidas, icon: MailOpen },
    { label: "Últimos 7 dias", valor: stats.semana, icon: CalendarClock },
  ]

  return (
    <main className="min-h-svh px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <a
              href="/"
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" />
              Voltar ao portfólio
            </a>
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Painel de mensagens
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Olá, {session.user.name}. Aqui estão os contatos recebidos pelo site.
            </p>
          </div>
          <AdminSignOut />
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {kpi.label}
                </p>
                <kpi.icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
                {kpi.valor}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="font-medium text-foreground">Mensagens nos últimos 14 dias</p>
          <p className="text-sm text-muted-foreground">Volume diário de contatos recebidos</p>
          <div className="mt-4">
            <AdminChart serie={stats.serie} />
          </div>
        </div>

        <AdminMessages inicial={mensagens} />
      </div>
    </main>
  )
}
