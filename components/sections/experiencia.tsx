"use client"

import { useState } from "react"
import { ArrowUpRight, Briefcase, Building2, Check, MapPin } from "lucide-react"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import { Modal } from "@/components/ui/modal"
import { experiencias, type Experiencia } from "@/lib/data"

export function Experiencia() {
  const [selected, setSelected] = useState<Experiencia | null>(null)

  return (
    <section id="experiencia" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          index="02"
          eyebrow="Experiência"
          title={
            <>
              Três anos construindo <span className="text-gradient-accent">cultura de dados</span>
            </>
          }
          description="Da automação de rotinas operacionais na Cielo ao suporte analítico executivo no Bradesco Prime. Clique em qualquer etapa para ver o detalhamento completo."
        />

        <div className="relative mt-16 pl-8 sm:pl-10">
          {/* Linha vertical única à esquerda */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent sm:left-[9px]" />

          <div className="flex flex-col gap-6">
            {experiencias.map((exp, i) => (
              <Reveal key={exp.empresa + exp.cargo} delay={i * 0.08}>
                <div className="relative">
                  {/* Ponto */}
                  <span className="absolute -left-8 top-6 flex size-4 items-center justify-center sm:-left-10">
                    <span className="size-[15px] rounded-full border-2 border-primary bg-background" />
                    {exp.atual && (
                      <span className="absolute size-4 animate-ping rounded-full bg-primary/40" />
                    )}
                  </span>

                  <button
                    onClick={() => setSelected(exp)}
                    className="group w-full rounded-2xl border border-border bg-card/40 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/70 md:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                          {exp.periodo}
                        </span>
                        {exp.atual && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                            Atual
                          </span>
                        )}
                      </div>
                      <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{exp.cargo}</h3>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="size-4 text-primary/70" />
                      <span className="text-foreground/80">{exp.empresa}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <MapPin className="size-3.5" />
                      {exp.local}
                    </p>

                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {exp.resumo}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {exp.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-border/60 bg-secondary/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="exp-modal-title">
        {selected && (
          <div className="p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="size-5" />
            </span>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selected.atual && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Atual
                </span>
              )}
              <span className="font-mono text-xs text-muted-foreground">{selected.periodo}</span>
            </div>
            <h3 id="exp-modal-title" className="mt-2 text-2xl font-semibold">
              {selected.cargo}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-primary">
              <Building2 className="size-4" />
              {selected.empresa}
              <span className="text-muted-foreground/50">·</span>
              <span className="text-sm text-muted-foreground">{selected.local}</span>
            </p>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground">Principais realizações</h4>
              <ul className="mt-3 flex flex-col gap-3">
                {selected.destaques.map((d) => (
                  <li key={d} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </span>
                    <span className="text-foreground/90">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground">Tecnologias</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.stack.map((s) => (
                  <span key={s} className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 font-mono text-xs text-foreground/80">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
