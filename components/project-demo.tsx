"use client"

import { useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, Database, Filter, Sparkles, TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

/* ------------------------------ Forecast demo ----------------------------- */

const forecastData = [
  { mes: "Mar", real: 5.6, previsto: null, min: null, max: null },
  { mes: "Abr", real: 5.9, previsto: null, min: null, max: null },
  { mes: "Mai", real: 6.3, previsto: null, min: null, max: null },
  { mes: "Jun", real: 6.8, previsto: null, min: null, max: null },
  { mes: "Jul", real: 7.2, previsto: 7.2, min: 7.2, max: 7.2 },
  { mes: "Ago", real: null, previsto: 7.6, min: 7.1, max: 8.1 },
  { mes: "Set", real: null, previsto: 8.1, min: 7.3, max: 8.9 },
  { mes: "Out", real: null, previsto: 8.6, min: 7.5, max: 9.7 },
]

const forecastConfig = {
  real: { label: "Receita realizada", color: "var(--chart-1)" },
  previsto: { label: "Previsão", color: "var(--chart-4)" },
} satisfies ChartConfig

function ForecastDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          <TrendingUp className="size-3" />
          Acurácia 91,4%
        </span>
        <span className="rounded-full bg-secondary/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Horizonte: 3 meses
        </span>
      </div>
      <ChartContainer config={forecastConfig} className="aspect-[16/9] w-full">
        <AreaChart data={forecastData} margin={{ left: -12, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fillPrevReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-real)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-real)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillIC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-previsto)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-previsto)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={32} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area dataKey="max" type="monotone" stroke="none" fill="url(#fillIC)" connectNulls />
          <Area dataKey="min" type="monotone" stroke="none" fill="var(--background)" connectNulls />
          <Area
            dataKey="real"
            type="monotone"
            fill="url(#fillPrevReal)"
            stroke="var(--color-real)"
            strokeWidth={2.5}
            connectNulls
          />
          <Line
            dataKey="previsto"
            type="monotone"
            stroke="var(--color-previsto)"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
            connectNulls
          />
        </AreaChart>
      </ChartContainer>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Linha sólida: receita realizada (R$ mi). Linha pontilhada + faixa sombreada: previsão do
        modelo e intervalo de confiança de 95% para os próximos 3 meses.
      </p>
    </div>
  )
}

/* -------------------------------- Churn demo ------------------------------- */

const churnDrivers = [
  { fator: "Baixo uso do produto", peso: 34 },
  { fator: "Tickets de suporte", peso: 27 },
  { fator: "Reajuste de preço", peso: 21 },
  { fator: "Sem onboarding completo", peso: 12 },
  { fator: "Baixo engajamento no app", peso: 6 },
]

const churnConfig = {
  peso: { label: "Peso no modelo", color: "var(--chart-1)" },
} satisfies ChartConfig

const riskSegments = [
  { nome: "Alto risco", clientes: 312, cor: "var(--destructive)" },
  { nome: "Risco moderado", cor: "var(--chart-3)", clientes: 587 },
  { nome: "Baixo risco", cor: "var(--chart-1)", clientes: 3021 },
]
const totalClientes = riskSegments.reduce((s, r) => s + r.clientes, 0)

function ChurnDemo() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="relative flex size-20 shrink-0 items-center justify-center">
          <svg viewBox="0 0 40 40" className="size-20 -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="var(--secondary)" strokeWidth="5" />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="var(--destructive)"
              strokeWidth="5"
              strokeDasharray={`${23 * 1.005} ${100 * 1.005}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute font-mono text-sm font-semibold text-foreground">23%</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">da base em risco de churn</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {riskSegments[0].clientes} clientes classificados como alto risco pelo modelo, sobre um
            total de {totalClientes.toLocaleString("pt-BR")}.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {riskSegments.map((r) => (
          <span
            key={r.nome}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs text-muted-foreground"
          >
            <span className="size-2 rounded-full" style={{ background: r.cor }} />
            {r.nome} · {r.clientes}
          </span>
        ))}
      </div>

      <div>
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Principais fatores que explicam o risco (importância no modelo)
        </p>
        <ChartContainer config={churnConfig} className="aspect-[16/9] w-full">
          <BarChart
            data={churnDrivers}
            layout="vertical"
            margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            onMouseMove={(state) => {
              const idx = state.activeTooltipIndex
              setHoverIdx(idx === undefined || idx === null ? null : Number(idx))
            }}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="fator"
              type="category"
              tickLine={false}
              axisLine={false}
              width={140}
              fontSize={11}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="peso" radius={[0, 6, 6, 0]} barSize={16}>
              {churnDrivers.map((d, i) => (
                <Cell
                  key={d.fator}
                  fill="var(--color-peso)"
                  fillOpacity={hoverIdx === null || hoverIdx === i ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

/* --------------------------------- ETL demo -------------------------------- */

const etlStages = [
  { nome: "Extract", detalhe: "5 fontes conectadas", icon: Database },
  { nome: "Transform", detalhe: "Limpeza + dedup", icon: Filter },
  { nome: "Load", detalhe: "Schema consolidado", icon: CheckCircle2 },
]

const etlLog = [
  { hora: "03:00:01", msg: "extract.crm.clientes → 482.104 linhas lidas", ok: true },
  { hora: "03:00:14", msg: "extract.erp.pedidos → 1.204.882 linhas lidas", ok: true },
  { hora: "03:01:02", msg: "transform.dedup → 3.114 duplicidades removidas", ok: true },
  { hora: "03:01:38", msg: "transform.validate_schema → 2 colunas divergentes ajustadas", ok: true },
  { hora: "03:02:05", msg: "load.staging → carga concluída em vendas.fato_vendas", ok: true },
]

function EtlDemo() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {etlStages.map((stage, i) => {
          const Icon = stage.icon
          return (
            <div key={stage.nome} className="flex items-center gap-1.5">
              <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-secondary/30 px-2 py-4 text-center">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="text-xs font-medium text-foreground">{stage.nome}</span>
                <span className="text-[10px] leading-tight text-muted-foreground">{stage.detalhe}</span>
              </div>
              {i < etlStages.length - 1 && (
                <ArrowRight className="size-4 shrink-0 text-primary/50" />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Linhas processadas", valor: "1,2M+" },
          { label: "Taxa de sucesso", valor: "98,7%" },
          { label: "Duração média", valor: "4min 12s" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-secondary/30 p-3 text-center">
            <div className="font-mono text-sm font-semibold text-primary">{m.valor}</div>
            <div className="mt-1 text-[10px] leading-tight text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Log da última execução
        </p>
        <div className="overflow-x-auto rounded-xl bg-background/60 p-4 font-mono text-[12px] leading-relaxed">
          {etlLog.map((line) => (
            <div key={line.hora} className="flex gap-3 text-foreground/80">
              <span className="shrink-0 text-muted-foreground">{line.hora}</span>
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span className="text-foreground/85">{line.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Wrapper --------------------------------- */

const demoMeta: Record<
  "forecast" | "churn" | "etl",
  { titulo: string; subtitulo: string }
> = {
  forecast: {
    titulo: "Demonstração interativa",
    subtitulo: "Receita realizada vs. previsão do modelo, com intervalo de confiança",
  },
  churn: {
    titulo: "Demonstração interativa",
    subtitulo: "Score de risco de churn e principais fatores explicativos",
  },
  etl: {
    titulo: "Demonstração interativa",
    subtitulo: "Execução do pipeline em tempo real, estágio por estágio",
  },
}

export function ProjectDemo({ kind }: { kind: "forecast" | "churn" | "etl" }) {
  const meta = demoMeta[kind]
  const Content = useMemo(() => {
    if (kind === "forecast") return ForecastDemo
    if (kind === "churn") return ChurnDemo
    return EtlDemo
  }, [kind])

  return (
    <div className={cn("rounded-2xl border border-primary/20 bg-secondary/20 p-5 sm:p-6")}>
      <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
        <Sparkles className="size-3" />
        {meta.titulo}
      </div>
      <p className="mb-4 text-xs text-muted-foreground">{meta.subtitulo}</p>
      <Content />
    </div>
  )
}
