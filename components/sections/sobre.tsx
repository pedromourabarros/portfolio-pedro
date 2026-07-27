"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import {
  BarChart3,
  Code2,
  Database,
  GraduationCap,
  ShieldCheck,
  Target,
  TrendingUp,
  Workflow,
  Award,
} from "lucide-react"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import { Counter } from "@/components/ui/counter"
import { certificacoes, formacao, personal, skillGroups, stats, valores } from "@/lib/data"

const valorIcons: Record<string, typeof Target> = {
  target: Target,
  "shield-check": ShieldCheck,
  workflow: Workflow,
  "trending-up": TrendingUp,
}

const groupIcons: Record<string, typeof Database> = {
  "bar-chart-3": BarChart3,
  database: Database,
  "code-2": Code2,
}

function SkillBar({ nome, nivel, delay }: { nome: string; nivel: number; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{nome}</span>
        <span className="font-mono text-xs text-muted-foreground">{nivel}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${nivel}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2"
        />
      </div>
    </div>
  )
}

export function Sobre() {
  return (
    <section id="sobre" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Sobre mim"
          title={
            <>
              Dados com propósito, <span className="text-gradient-accent">decisão com impacto</span>
            </>
          }
          description={personal.resumo}
        />

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6 transition-colors hover:border-primary/40">
                <div className="text-4xl font-semibold tracking-tight text-foreground">
                  <Counter value={stat.valor} suffix={stat.sufixo} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Values */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((valor, i) => {
            const Icon = valorIcons[valor.icon] ?? Target
            return (
              <Reveal key={valor.titulo} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-border bg-card/40 p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-medium">{valor.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{valor.descricao}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Skills + Formation */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="glass h-full rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-medium">Stack técnica</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ferramentas e tecnologias que uso no dia a dia.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
                {skillGroups.map((group) => {
                  const Icon = groupIcons[group.icon] ?? Database
                  return (
                    <div key={group.grupo} className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Icon className="size-4" />
                        {group.grupo}
                      </div>
                      <div className="flex flex-col gap-3.5">
                        {group.skills.map((s, idx) => (
                          <SkillBar key={s.nome} nome={s.nome} nivel={s.nivel} delay={idx * 0.05} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6">
              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <GraduationCap className="size-4" />
                  Formação
                </div>
                <div className="mt-5 flex flex-col gap-5">
                  {formacao.map((f) => (
                    <div key={f.instituicao} className="border-l-2 border-border pl-4">
                      <p className="font-medium leading-snug">{f.curso}</p>
                      <p className="text-sm text-muted-foreground">{f.instituicao}</p>
                      <p className="mt-1 font-mono text-xs text-primary">
                        {f.periodo} · {f.detalhe}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Award className="size-4" />
                  Certificações
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {certificacoes.length}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {certificacoes.map((c) => (
                    <span
                      key={c}
                      className="rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 text-xs text-muted-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
