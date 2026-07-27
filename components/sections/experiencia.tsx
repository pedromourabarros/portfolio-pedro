"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowUpRight, Briefcase, Check, MapPin } from "lucide-react"
import { Reveal, SectionHeading } from "@/components/ui/reveal"
import { Modal } from "@/components/ui/modal"
import { experiencias, type Experiencia } from "@/lib/data"

export function Experiencia() {
  const [selected, setSelected] = useState<Experiencia | null>(null)

  return (
    <section id="experiencia" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Trajetória"
          title={
            <>
              Experiência <span className="text-gradient-accent">profissional</span>
            </>
          }
          description="Uma trajetória construída em grandes instituições financeiras, evoluindo de análise de dados a Business Intelligence de nível executivo."
        />

        <div className="relative mt-14">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="flex flex-col gap-10">
            {experiencias.map((exp, i) => (
              <Reveal key={exp.empresa} delay={i * 0.05}>
                <div
                  className={`relative flex flex-col gap-4 pl-14 md:grid md:grid-cols-2 md:gap-10 md:pl-0 ${
                    i % 2 === 0 ? "" : "md:[direction:rtl]"
                  }`}
                >
                  {/* Dot */}
                  <span className="absolute left-[11px] top-1.5 flex size-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                    <span className="absolute size-4 rounded-full bg-primary/25" />
                    <span className="size-2 rounded-full bg-primary" />
                    {exp.atual && (
                      <span className="absolute size-4 animate-ping rounded-full bg-primary/40" />
                    )}
                  </span>

                  <div className={`[direction:ltr] ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:col-start-2 md:pl-10"}`}>
                    <button
                      onClick={() => setSelected(exp)}
                      className="group w-full rounded-2xl border border-border bg-card/40 p-6 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70"
                    >
                      <div className={`flex items-center gap-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                        {exp.atual && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                            Atual
                          </span>
                        )}
                        <span className="font-mono text-xs text-muted-foreground">{exp.periodo}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{exp.empresa}</h3>
                      <p className="text-primary">{exp.cargo}</p>
                      <p className={`mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        <MapPin className="size-3.5" />
                        {exp.local}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{exp.resumo}</p>
                      <div className={`mt-4 flex flex-wrap gap-1.5 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                        {exp.stack.slice(0, 4).map((s) => (
                          <span key={s} className="rounded-md bg-secondary/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className={`mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        Ver detalhes
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </button>
                  </div>
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
              {selected.empresa}
            </h3>
            <p className="text-primary">{selected.cargo}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {selected.local}
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
