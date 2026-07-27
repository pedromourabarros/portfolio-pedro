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
          eyebrow="Portfólio"
          title={
            <>
              Projetos em <span className="text-gradient-accent">formato case study</span>
            </>
          }
          description="Do problema ao impacto: cada projeto detalha o contexto, a solução, a arquitetura, os desafios e os resultados alcançados."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projetos.map((proj, i) => (
            <Reveal key={proj.titulo} delay={i * 0.08}>
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-all hover:-translate-y-1 hover:border-primary/40 ${
                  proj.destaque && i === 0 ? "lg:col-span-2 lg:flex-row" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    proj.destaque && i === 0 ? "lg:w-1/2" : ""
                  }`}
                >
                  <Image
                    src={proj.imagem || "/placeholder.svg"}
                    alt={`Interface do projeto ${proj.titulo}`}
                    width={720}
                    height={450}
                    className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 font-mono text-[11px] text-primary">
                    {proj.categoria}
                  </span>
                </div>

                <div className={`flex flex-1 flex-col p-6 md:p-7 ${proj.destaque && i === 0 ? "lg:justify-center" : ""}`}>
                  <h3 className="text-xl font-semibold md:text-2xl">{proj.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{proj.resumo}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {proj.metricas.map((m) => (
                      <div key={m.label} className="rounded-xl border border-border bg-secondary/30 px-3 py-2">
                        <div className="text-sm font-semibold text-primary">{m.valor}</div>
                        <div className="text-[11px] text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {proj.stack.slice(0, 5).map((s) => (
                      <span key={s} className="rounded-md bg-secondary/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    {proj.stack.length > 5 && (
                      <span className="rounded-md bg-secondary/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        +{proj.stack.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => setSelected(proj)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
                    >
                      Ver case study
                      <ArrowUpRight className="size-4" />
                    </button>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ExternalLink className="size-4" />
                        {proj.linkLabel}
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
