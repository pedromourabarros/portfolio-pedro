"use client"

import { useMemo, useState } from "react"
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
import { TrendingDown, TrendingUp } from "lucide-react"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import { Counter } from "@/components/ui/counter"
import {
  dashboardCategorias,
  dashboardKpis,
  dashboardRegioes,
  dashboardReceita,
} from "@/lib/data"
import { cn } from "@/lib/utils"

const periodos = ["Trimestre", "Semestre", "Ano"] as const
type Periodo = (typeof periodos)[number]

const receitaConfig = {
  receita: { label: "Receita", color: "var(--chart-1)" },
  meta: { label: "Meta", color: "var(--chart-4)" },
} satisfies ChartConfig

const regioesConfig = {
  valor: { label: "Receita (R$ M)", color: "var(--chart-1)" },
} satisfies ChartConfig

const categoriasConfig = {
  valor: { label: "Participação" },
  credito: { label: "Crédito", color: "var(--chart-1)" },
  investimentos: { label: "Investimentos", color: "var(--chart-2)" },
  seguros: { label: "Seguros", color: "var(--chart-3)" },
  cartoes: { label: "Cartões", color: "var(--chart-4)" },
} satisfies ChartConfig

function KpiCard({ kpi, index }: { kpi: (typeof dashboardKpis)[number]; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div className="glass-card h-full rounded-2xl p-5">
        <p className="text-sm text-muted-foreground">{kpi.label}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {kpi.prefixo}
            <Counter
              value={String(kpi.valor)}
              decimals={kpi.valor % 1 !== 0 ? (kpi.valor >= 10 ? 1 : 2) : 0}
            />
            {kpi.sufixo}
          </p>
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              kpi.positivo
                ? "bg-primary/15 text-primary"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {kpi.positivo ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(kpi.delta)}%
          </span>
        </div>
      </div>
    </Reveal>
  )
}

export function Dashboard() {
  const [periodo, setPeriodo] = useState<Periodo>("Ano")

  const receitaData = useMemo(() => {
    if (periodo === "Trimestre") return dashboardReceita.slice(-3)
    if (periodo === "Semestre") return dashboardReceita.slice(-6)
    return dashboardReceita
  }, [periodo])

  return (
    <section id="dashboard" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Business Intelligence"
          title={
            <>
              Do dado bruto à <span className="text-primary">decisão</span>
            </>
          }
          description="Uma amostra interativa do tipo de painel executivo que construo no Power BI — KPIs, tendências, quebras por dimensão e composição de portfólio. Dados ilustrativos."
        />

        {/* Filtro de período */}
        <Reveal className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Selecionar período"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur"
          >
            {periodos.map((p) => (
              <button
                key={p}
                role="tab"
                aria-selected={periodo === p}
                onClick={() => setPeriodo(p)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  periodo === p
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </Reveal>

        {/* KPIs */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dashboardKpis.map((kpi, i) => (
            <KpiCard key={kpi.label} kpi={kpi} index={i} />
          ))}
        </div>

        {/* Gráfico principal — receita x meta */}
        <Reveal className="mt-6">
          <div className="glass-card rounded-2xl p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Receita realizada x meta</h3>
                <p className="text-sm text-muted-foreground">Evolução mensal (R$ milhões)</p>
              </div>
            </div>
            <ChartContainer config={receitaConfig} className="aspect-[16/7] w-full">
              <AreaChart data={receitaData} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-receita)" stopOpacity={0.4} />
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
                  strokeWidth={2}
                />
                <Line
                  dataKey="meta"
                  type="monotone"
                  stroke="var(--color-meta)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
        </Reveal>

        {/* Grid secundário: regiões + composição */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="glass-card h-full rounded-2xl p-5 sm:p-6">
              <h3 className="mb-1 text-lg font-semibold text-foreground">Receita por região</h3>
              <p className="mb-4 text-sm text-muted-foreground">Quebra por dimensão geográfica (R$ M)</p>
              <ChartContainer config={regioesConfig} className="aspect-[16/9] w-full">
                <BarChart data={dashboardRegioes} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="regiao"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                    fontSize={12}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="valor" fill="var(--color-valor)" radius={[0, 6, 6, 0]} barSize={22} />
                </BarChart>
              </ChartContainer>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="glass-card flex h-full flex-col rounded-2xl p-5 sm:p-6">
              <h3 className="mb-1 text-lg font-semibold text-foreground">Composição do portfólio</h3>
              <p className="mb-2 text-sm text-muted-foreground">Participação por produto</p>
              <ChartContainer config={categoriasConfig} className="mx-auto aspect-square w-full max-w-[240px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={dashboardCategorias}
                    dataKey="valor"
                    nameKey="categoria"
                    innerRadius={58}
                    outerRadius={82}
                    strokeWidth={2}
                    stroke="var(--background)"
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
                                y={(viewBox.cy ?? 0) - 6}
                                className="fill-foreground font-mono text-2xl font-semibold"
                              >
                                4 linhas
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 16}
                                className="fill-muted-foreground text-xs"
                              >
                                de negócio
                              </tspan>
                            </text>
                          )
                        }
                        return null
                      }}
                    />
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="categoria" />}
                    className="flex-wrap gap-x-3 gap-y-1"
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
