"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Award, GraduationCap, ShieldCheck, Target, TrendingUp, Workflow } from "lucide-react"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import { Counter } from "@/components/ui/counter"
import { certificacoes, formacao, personal, stackGroups, stats, valores } from "@/lib/data"

const valorIcons: Record<string, typeof Target> = {
  target: Target,
  "shield-check": ShieldCheck,
  workflow: Workflow,
  "trending-up": TrendingUp,
}

function Pill({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
    >
      {children}
    </motion.span>
  )
}

export function Sobre() {
  return (
    <section id="sobre" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="01"
          eyebrow="Sobre"
          title={
            <>
              Dados com propósito, <span className="text-gradient-accent">decisão com impacto</span>
            </>
          }
          description={personal.resumo}
        />

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Stack + Formação/Certificações */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Stack técnica */}
          <Reveal>
            <div className="glass flex h-full flex-col rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">Stack técnica</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ferramentas e tecnologias que uso no dia a dia.
              </p>
              <div className="mt-8 flex flex-col gap-7">
                {stackGroups.map((group) => (
                  <div key={group.grupo} className="flex flex-col gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
                      {group.grupo}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.itens.map((item, idx) => (
                        <Pill key={item} delay={idx * 0.03}>
                          {item}
                        </Pill>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Formação + Certificações */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6">
              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <GraduationCap className="size-4" />
                  Formação
                </div>
                <div className="mt-5 flex flex-col gap-5">
                  {formacao.map((f) => (
                    <div key={f.instituicao} className="border-l-2 border-primary/30 pl-4">
                      <p className="font-medium leading-snug">{f.curso}</p>
                      <p className="text-sm text-muted-foreground">{f.instituicao}</p>
                      <p className="mt-1 font-mono text-xs text-primary">
                        {f.periodo} · {f.detalhe}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass flex-1 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Award className="size-4" />
                  Certificações
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {certificacoes.length}
                  </span>
                </div>
                <ul className="mt-5 flex flex-col gap-3">
                  {certificacoes.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
