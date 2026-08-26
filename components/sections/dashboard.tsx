"use client"

import { useMemo, useState, type ComponentType } from "react"
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
import { LayoutGrid, MapPin, Sparkles, Terminal, TrendingUp } from "lucide-react"
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

const REGIOES = ["Sudeste", "Sul", "Nordeste", "Centro-Oeste", "Norte"] as const
const isRegion = (f: Filtro) => (REGIOES as readonly string[]).includes(f)

// Variação pseudo-determinística a partir de uma string (mesma entrada = mesma saída)
function hashFactor(s: string): number {
  let h = 0
  for (let c = 0; c < s.length; c++) h = (h * 31 + s.charCodeAt(c)) >>> 0
  return ((h % 2001) / 1000 - 1) // -1..1
}
const vary = (base: number, seed: string, amp: number) => base * (1 + hashFactor(seed) * amp)

const nf = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 })
const formatBRL = (n: number) => `R$ ${nf.format(Math.round(n))}`
const pct = (n: number) => `${n.toFixed(1).replace(".", ",")}%`

// Total anual de referência (soma da série completa, em R$ mi)
const TOTAL_ANUAL = dashboardReceita.reduce((s, d) => s + d.receita, 0)
const TOTAL_REGIOES = dashboardRegioes.reduce((s, r) => s + r.valor, 0)

type Kpi = { label: string; valor: string; delta: number; positivo: boolean; nota: string }

function kpisFor(filtro: Filtro, receitaData: typeof dashboardReceita): Kpi[] {
  // 12 meses = baseline "bonito" já ajustado à mão
  if (filtro === "12 meses") return dashboardKpis as Kpi[]

  // Filtros por região
  if ((REGIOES as readonly string[]).includes(filtro)) {
    const reg = dashboardRegioes.find((r) => r.regiao === filtro)!
    const growth = dashboardRanking.find((r) => r.regiao === filtro)?.valor ?? 10
    const frac = reg.valor / TOTAL_REGIOES
    const receita = 67_240_000 * frac
    const atend = 22_020 * frac
    const atingimento = 100 + growth
    const ticket = 306 * (0.9 + frac) // ticket varia por região
    return [
      { label: "Receita acumulada", valor: formatBRL(receita), delta: growth, positivo: true, nota: filtro },
      { label: "Atingimento de meta", valor: pct(atingimento), delta: growth, positivo: true, nota: "vs. meta" },
      { label: "Ticket médio", valor: formatBRL(ticket), delta: 8.4, positivo: true, nota: "vs. período anterior" },
      { label: "Atendimentos", valor: nf.format(Math.round(atend)), delta: growth * 0.7, positivo: true, nota: filtro },
    ]
  }

  // Filtros por período (6 meses / Trimestre)
  const receitaSum = receitaData.reduce((s, d) => s + d.receita, 0)
  const metaSum = receitaData.reduce((s, d) => s + d.meta, 0)
  const frac = receitaSum / TOTAL_ANUAL
  const atingimento = (receitaSum / metaSum) * 100
  const receita = 67_240_000 * frac
  const atend = 22_020 * frac
  const ticket = 306 * (1 + (atingimento - 100) / 100) // janelas recentes = ticket maior
  const deltaMeta = atingimento - 100
  return [
    { label: "Receita acumulada", valor: formatBRL(receita), delta: Math.round((70 + deltaMeta) * 10) / 10, positivo: true, nota: "no período" },
    { label: "Atingimento de meta", valor: pct(atingimento), delta: Math.round(deltaMeta * 10) / 10, positivo: true, nota: "vs. meta" },
    { label: "Ticket médio", valor: formatBRL(ticket), delta: Math.round((deltaMeta + 4) * 10) / 10, positivo: true, nota: "vs. período anterior" },
    { label: "Atendimentos", valor: nf.format(Math.round(atend)), delta: 12.6, positivo: true, nota: "vs. período anterior" },
  ]
}

// Consulta SQL "real" por trás da visualização — reage ao filtro selecionado
function sqlFor(filtro: Filtro): string {
  const janela = filtro === "6 meses" ? "6" : filtro === "Trimestre" ? "3" : "12"
  const lines = [
    "SELECT",
    "  DATE_TRUNC('month', data_venda) AS mes,",
    "  SUM(valor_venda)                AS receita,",
    "  SUM(meta_mensal)                AS meta",
    "FROM vendas.fato_vendas",
    `WHERE data_venda >= DATEADD(month, -${janela}, CURRENT_DATE)`,
  ]
  if (isRegion(filtro)) lines.push(`  AND regiao = '${filtro}'`)
  lines.push("GROUP BY 1", "ORDER BY 1;")
  return lines.join("\n")
}

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "GROUP",
  "BY",
  "ORDER",
  "AS",
  "SUM",
  "DATE_TRUNC",
  "DATEADD",
  "CURRENT_DATE",
])

function SqlBlock({ sql }: { sql: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-background/60 p-4 font-mono text-[13px] leading-relaxed">
      {sql.split("\n").map((line, i) => (
        <div key={i}>
          {line
            .split(/(\s+|\(|\)|,|'[^']*')/)
            .filter((t) => t !== "")
            .map((tok, j) => {
              if (/^'[^']*'$/.test(tok)) {
                return (
                  <span key={j} className="text-mint">
                    {tok}
                  </span>
                )
              }
              if (SQL_KEYWORDS.has(tok.trim().toUpperCase())) {
                return (
                  <span key={j} className="font-semibold text-primary">
                    {tok}
                  </span>
                )
              }
              if (tok === "(" || tok === ")" || tok === ",") {
                return (
                  <span key={j} className="text-foreground/60">
                    {tok}
                  </span>
                )
              }
              return (
                <span key={j} className="text-foreground/85">
                  {tok}
                </span>
              )
            })}
        </div>
      ))}
    </pre>
  )
}

// Leitura executiva gerada a partir dos dados filtrados — resume o que mudaria
// numa reunião de resultados, sem precisar abrir o painel completo.
function insightsFor(
  filtro: Filtro,
  kpis: Kpi[],
  rankingData: typeof dashboardRanking,
  categoriasData: typeof dashboardCategorias,
): string[] {
  const topRegiao = rankingData[0]
  const topCanal = [...categoriasData].sort((a, b) => b.valor - a.valor)[0]
  const atingimento = kpis.find((k) => k.label === "Atingimento de meta")
  const ticket = kpis.find((k) => k.label === "Ticket médio")

  const insights = [
    `${topRegiao.regiao} lidera o crescimento (+${topRegiao.valor.toFixed(1).replace(".", ",")}% a/a) e sustenta boa parte do avanço de receita no período.`,
    `${topCanal.categoria} concentra ${topCanal.valor}% do mix de canais — segue como a principal via de aquisição a monitorar.`,
  ]
  if (atingimento) {
    insights.push(
      `Atingimento de meta em ${atingimento.valor}, ${atingimento.positivo ? "acima" : "abaixo"} do esperado para ${isRegion(filtro) ? filtro : filtro.toLowerCase()}.`,
    )
  }
  if (ticket) {
    insights.push(
      `Ticket médio em ${ticket.valor}, variação de +${ticket.delta.toFixed(1).replace(".", ",")}% vs. o período anterior.`,
    )
  }
  return insights
}

function GroupLabel({
  icon: Icon,
  title,
  className,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-3.5" />
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </span>
      <span className="h-px flex-1 bg-border/70" />
    </div>
  )
}

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

  const kpis = useMemo(() => kpisFor(filtro, receitaData), [filtro, receitaData])

  // Mix por canal — reage ao filtro (perturba e renormaliza para 100%)
  const categoriasData = useMemo(() => {
    if (filtro === "12 meses") return dashboardCategorias
    const raw = dashboardCategorias.map((c) => ({
      ...c,
      valor: Math.max(4, vary(c.valor, filtro + c.categoria, 0.45)),
    }))
    const total = raw.reduce((s, c) => s + c.valor, 0)
    return raw.map((c) => ({ ...c, valor: Math.round((c.valor / total) * 100) }))
  }, [filtro])

  // Receita por região — período reduz proporcionalmente; região foca a selecionada
  const regioesData = useMemo(() => {
    if (isRegion(filtro)) {
      return dashboardRegioes.map((r) => ({
        ...r,
        valor: r.regiao === filtro ? r.valor : Number((r.valor * 0.5).toFixed(1)),
      }))
    }
    const frac = receitaData.reduce((s, d) => s + d.receita, 0) / TOTAL_ANUAL
    return dashboardRegioes.map((r) => ({ ...r, valor: Number((r.valor * frac).toFixed(1)) }))
  }, [filtro, receitaData])

  // Ranking de crescimento — reordena conforme o filtro
  const rankingData = useMemo(() => {
    let d = dashboardRanking.map((r) => ({ ...r }))
    if (isRegion(filtro)) {
      d = d.map((r) => ({
        ...r,
        valor:
          r.regiao === filtro
            ? Number((r.valor + 4).toFixed(1))
            : Number(Math.max(2, r.valor - 1.5).toFixed(1)),
      }))
    } else if (filtro !== "12 meses") {
      d = d.map((r) => ({ ...r, valor: Number(Math.max(2, vary(r.valor, filtro + r.regiao, 0.5)).toFixed(1)) }))
    }
    return d.sort((a, b) => b.valor - a.valor)
  }, [filtro])

  const maxRanking = Math.max(...rankingData.map((r) => r.valor))
  const sql = useMemo(() => sqlFor(filtro), [filtro])
  const insights = useMemo(
    () => insightsFor(filtro, kpis, rankingData, categoriasData),
    [filtro, kpis, rankingData, categoriasData],
  )

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
          description="Amostra interativa do tipo de leitura executiva que entrego no dia a dia: KPIs, séries temporais, quebra por canal, ranking regional e a consulta SQL por trás dos números — tudo com filtros aplicados em tempo real. Dados ilustrativos."
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
        <GroupLabel icon={LayoutGrid} title="Visão executiva" className="mt-10 mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="glass-card h-full rounded-2xl p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {kpi.label}
              </p>
              <motion.p
                key={kpi.valor}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-mono text-2xl font-semibold tracking-tight text-foreground"
              >
                {kpi.valor}
              </motion.p>
              <p className="mt-2 flex items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium",
                    kpi.positivo ? "text-primary" : "text-destructive",
                  )}
                >
                  <TrendingUp className="size-3" />
                  {kpi.positivo ? "+" : "-"}
                  {Math.abs(Math.round(kpi.delta * 10) / 10).toLocaleString("pt-BR")}%
                </span>
                <span className="text-muted-foreground">{kpi.nota}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Linha 1: Receita x meta (grande) + Mix por canal (donut) */}
        <GroupLabel icon={TrendingUp} title="Séries & composição" className="mt-10 mb-4" />
        <div className="grid gap-6 lg:grid-cols-5">
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
                    data={categoriasData}
                    dataKey="valor"
                    nameKey="categoria"
                    innerRadius={48}
                    outerRadius={72}
                    strokeWidth={2}
                    stroke="var(--background)"
                    paddingAngle={2}
                  >
                    {categoriasData.map((entry) => (
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
                {categoriasData.map((c) => (
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

        {/* Linha 2: Receita por região (barras, clicáveis) + Ranking de crescimento */}
        <GroupLabel icon={MapPin} title="Detalhamento regional" className="mt-10 mb-4" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Receita por região" subtitle="Em milhares de reais · clique numa barra para filtrar">
            <ChartContainer config={regioesConfig} className="aspect-[16/9] w-full">
              <BarChart data={regioesData} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="regiao" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={40} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="valor"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                  className="cursor-pointer"
                  onClick={(data) => {
                    const regiao = (data as unknown as { payload?: { regiao?: Filtro } })?.payload?.regiao
                    if (regiao) setFiltro(regiao === filtro ? "12 meses" : regiao)
                  }}
                >
                  {regioesData.map((r, i) => (
                    <Cell
                      key={r.regiao}
                      fill={barColors[i % barColors.length]}
                      fillOpacity={isRegion(filtro) && r.regiao !== filtro ? 0.3 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </Panel>

          <Panel title="Ranking de crescimento" subtitle="Variação percentual ano contra ano" delay={0.1}>
            <ul className="mt-2 flex flex-col gap-5">
              {rankingData.map((r, i) => {
                const destaque = isRegion(filtro) && r.regiao === filtro
                return (
                  <li key={r.regiao} className={cn(isRegion(filtro) && !destaque && "opacity-55")}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className={cn("text-sm text-foreground", destaque && "font-semibold text-primary")}>
                        {r.regiao}
                      </span>
                      <span className="font-mono text-sm font-medium text-primary">
                        +{r.valor.toFixed(1).replace(".", ",")}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.valor / maxRanking) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>

        {/* Linha 3: Insights automáticos + Consulta SQL — a camada técnica por trás do painel */}
        <GroupLabel icon={Terminal} title="Camada técnica" className="mt-10 mb-4" />
        <div className="grid gap-6 lg:grid-cols-5">
          <Panel
            title="Insights automáticos"
            subtitle="Leitura executiva gerada a partir do recorte atual"
            className="lg:col-span-2"
          >
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              <Sparkles className="size-3" />
              Atualizado com o filtro
            </div>
            <ul className="mt-4 flex flex-col gap-3.5">
              {insights.map((texto, i) => (
                <motion.li
                  key={texto}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{texto}</span>
                </motion.li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Consulta SQL"
            subtitle="A query que gera a série de receita x meta acima"
            className="lg:col-span-3"
            delay={0.1}
          >
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <Terminal className="size-3" />
              vendas.fato_vendas
            </div>
            <SqlBlock sql={sql} />
          </Panel>
        </div>
      </div>
    </section>
  )
}
