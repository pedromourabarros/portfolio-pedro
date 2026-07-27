"use client"

import { useMemo, useState } from "react"
import { motion } from "motion/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import {
  dashboardCategorias,
  dashboardKpis,
  dashboardRanking,
  dashboardRegioes,
  dashboardReceita,
} from "@/lib/data"
import { cn } from "@/lib/utils"

const filtros = [
  "12 meses",
  "6 meses",
  "Trimestre",
  "Sudeste",
  "Sul",
  "Nordeste",
  "Centro-Oeste",
  "Norte",
] as const
type Filtro = (typeof filtros)[number]

const receitaConfig = {
  receita: { label: "Receita", color: "var(--chart-1)" },
  meta: { label: "Meta", color: "var(--chart-4)" },
} satisfies ChartConfig

const regioesConfig = {
  valor: { label: "Receita (R$ M)", color: "var(--chart-1)" },
} satisfies ChartConfig

const canalConfig = {
  valor: { label: "Participação" },
  digital: { label: "Digital", color: "var(--chart-1)" },
  agencia: { label: "Agência", color: "var(--chart-2)" },
  parceiros: { label: "Parceiros", color: "var(--chart-3)" },
  telefone: { label: "Telefone", color: "var(--chart-4)" },
} satisfies ChartConfig

const barColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-5)", "var(--chart-4)"]

function Panel({
  title,
  subtitle,
  children,
  className,
  delay = 0,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="glass-card h-full rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mb-4 text-xs text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </Reveal>
  )
}

export function Dashboard() {
  const [filtro, setFiltro] = useState<Filtro>("12 meses")

  const receitaData = useMemo(() => {
    if (filtro === "Trimestre") return dashboardReceita.slice(-3)
    if (filtro === "6 meses") return dashboardReceita.slice(-6)
    return dashboardReceita
  }, [filtro])

  const maxRanking = Math.max(...dashboardRanking.map((r) => r.valor))

  return (
    <section id="dashboard" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          eyebrow="Painel BI"
          title={
            <>
              Um Power BI vivo, <span className="text-gradient-accent">reconstruído em código</span>
            </>
          }
          description="Amostra interativa do tipo de leitura executiva que entrego no dia a dia: KPIs, séries temporais, quebra por canal e ranking regional com filtros aplicados em tempo real. Dados ilustrativos."
        />

        {/* Barra de filtros (pills) */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur">
            {filtros.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                aria-pressed={filtro === f}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                  filtro === f
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardKpis.map((kpi, i) => (
            <Reveal key={kpi.label} delay={i * 0.06} className="h-full">
              <div className="glass-card h-full rounded-2xl p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-foreground">
                  {kpi.valor}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 font-medium",
                      kpi.positivo ? "text-primary" : "text-destructive",
                    )}
                  >
                    <TrendingUp className="size-3" />
                    {kpi.positivo ? "+" : "-"}
                    {Math.abs(kpi.delta)}%
                  </span>
                  <span className="text-muted-foreground">{kpi.nota}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Linha 1: Receita x meta (grande) + Mix por canal (donut) */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <Panel
            title="Receita x meta"
            subtitle="Evolução mensal em milhares de reais"
            className="lg:col-span-3"
          >
            <ChartContainer config={receitaConfig} className="aspect-[16/9] w-full">
              <AreaChart data={receitaData} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-receita)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-receita)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={40} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Area
                  dataKey="receita"
                  type="monotone"
                  fill="url(#fillReceita)"
                  stroke="var(--color-receita)"
                  strokeWidth={2.5}
                />
                <Line
                  dataKey="meta"
                  type="monotone"
                  stroke="var(--color-meta)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </Panel>

          <Panel
            title="Mix por canal"
            subtitle="Participação percentual"
            className="lg:col-span-2"
            delay={0.1}
          >
            <div className="flex items-center gap-4">
              <ChartContainer config={canalConfig} className="aspect-square w-1/2 max-w-[160px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={dashboardCategorias}
                    dataKey="valor"
                    nameKey="categoria"
                    innerRadius={48}
                    outerRadius={72}
                    strokeWidth={2}
                    stroke="var(--background)"
                    paddingAngle={2}
                  >
                    {dashboardCategorias.map((entry) => (
                      <Cell key={entry.categoria} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) - 4}
                                className="fill-foreground font-mono text-lg font-semibold"
                              >
                                4
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 14}
                                className="fill-muted-foreground text-[10px]"
                              >
                                canais
                              </tspan>
                            </text>
                          )
                        }
                        return null
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Legenda com valores à direita */}
              <ul className="flex-1 space-y-2.5">
                {dashboardCategorias.map((c) => (
                  <li key={c.categoria} className="flex items-center gap-2 text-sm">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: c.fill }} />
                    <span className="text-muted-foreground">{c.categoria}</span>
                    <span className="ml-auto font-mono font-medium text-foreground">{c.valor}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        {/* Linha 2: Receita por região (barras) + Ranking de crescimento */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Receita por região" subtitle="Em milhares de reais">
            <ChartContainer config={regioesConfig} className="aspect-[16/9] w-full">
              <BarChart data={dashboardRegioes} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="regiao" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={40} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={40}>
                  {dashboardRegioes.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </Panel>

          <Panel title="Ranking de crescimento" subtitle="Variação percentual ano contra ano" delay={0.1}>
            <ul className="mt-2 flex flex-col gap-5">
              {dashboardRanking.map((r, i) => (
                <li key={r.regiao}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-sm text-foreground">{r.regiao}</span>
                    <span className="font-mono text-sm font-medium text-primary">+{r.valor}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.valor / maxRanking) * 100}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  )
}
