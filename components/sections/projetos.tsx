"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowUpRight,
  Cpu,
  ExternalLink,
  Layers,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import { Modal } from "@/components/ui/modal"
import { projetos, type Projeto } from "@/lib/data"

const caseBlocks = [
  { key: "problema", label: "O problema", icon: Target },
  { key: "solucao", label: "A solução", icon: Lightbulb },
  { key: "arquitetura", label: "Arquitetura", icon: Layers },
  { key: "desafios", label: "Desafios", icon: Zap },
  { key: "impacto", label: "Impacto", icon: TrendingUp },
] as const

export function Projetos() {
  const [selected, setSelected] = useState<Projeto | null>(null)

  return (
    <section id="projetos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          eyebrow="Projetos"
          title={
            <>
              Do problema de negócio ao <span className="text-gradient-accent">impacto medido</span>
            </>
          }
          description="Cada projeto é apresentado como case study: contexto, solução, arquitetura, desafios e resultados. Clique para ver o detalhamento completo."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projetos.map((proj, i) => (
            <Reveal key={proj.titulo} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px] hover:shadow-primary/20">
                {/* Imagem */}
                <button
                  onClick={() => setSelected(proj)}
                  className="relative block overflow-hidden text-left"
                  aria-label={`Ver case study de ${proj.titulo}`}
                >
                  <Image
                    src={proj.imagem || "/placeholder.svg"}
                    alt={`Interface do projeto ${proj.titulo}`}
                    width={720}
                    height={450}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 font-mono text-[11px] text-primary">
                    {proj.categoria}
                  </span>
                </button>

                {/* Conteúdo */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold tracking-tight">{proj.titulo}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {proj.resumo}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {proj.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border/60 bg-secondary/50 px-2 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                    {proj.stack.length > 4 && (
                      <span className="rounded-md border border-border/60 bg-secondary/50 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        +{proj.stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Rodapé fixo do card */}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <button
                      onClick={() => setSelected(proj)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary transition-colors hover:text-foreground"
                    >
                      Ver case study
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir ${proj.titulo} em nova aba`}
                        className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="proj-modal-title">
        {selected && (
          <div>
            <div className="relative">
              <Image
                src={selected.imagem || "/placeholder.svg"}
                alt={`Interface do projeto ${selected.titulo}`}
                width={720}
                height={360}
                className="aspect-[2/1] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.19_0.014_240)] to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <span className="rounded-full bg-primary/15 px-3 py-1 font-mono text-[11px] text-primary">
                {selected.categoria}
              </span>
              <h3 id="proj-modal-title" className="mt-3 text-2xl font-semibold">
                {selected.titulo}
              </h3>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {selected.metricas.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-secondary/30 p-3 text-center">
                    <div className="text-sm font-semibold text-primary">{m.valor}</div>
                    <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-5">
                {caseBlocks.map((block) => {
                  const Icon = block.icon
                  return (
                    <div key={block.key} className="flex gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{block.label}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {selected[block.key]}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Cpu className="size-4 text-primary" />
                  Stack completa
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.stack.map((s) => (
                    <span key={s} className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 font-mono text-xs text-foreground/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selected.link && (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <ExternalLink className="size-4" />
                  {selected.linkLabel}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
