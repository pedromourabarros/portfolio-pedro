"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { ArrowDown, ArrowUpRight, Mail, MapPin, Sparkles } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { ParticleField } from "@/components/particle-field"
import { personal } from "@/lib/data"

function useTypewriter(words: string[], speed = 80, pause = 1600) {
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === "") {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
          )
        },
        deleting ? speed / 2 : speed,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, speed, pause])

  return text
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const typed = useTypewriter(personal.titulosRotativos)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
      el.style.setProperty("--my", `${e.clientY - rect.top}px`)
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-16"
    >
      <ParticleField className="absolute inset-0 -z-10 h-full w-full opacity-70" />

      {/* Spotlight following the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), oklch(0.8 0.13 195 / 0.1), transparent 60%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Disponível para novas oportunidades
            </span>
          </motion.div>

          <div className="flex flex-col gap-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="font-mono text-sm text-muted-foreground"
            >
              Olá, eu sou o Pedro
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-pretty text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
            >
              <span className="text-gradient">{personal.nome}</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="flex h-9 items-center text-xl font-medium text-muted-foreground sm:text-2xl"
            >
              <span className="text-foreground">{typed}</span>
              <span className="ml-1 inline-block h-6 w-0.5 animate-pulse bg-primary sm:h-7" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="max-w-xl text-pretty leading-relaxed text-muted-foreground"
          >
            Transformo dados brutos em decisões estratégicas. Especialista em{" "}
            <span className="text-foreground">SQL, Power BI e Databricks</span>, com base em
            engenharia de dados e desenvolvimento full stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#projetos"
              data-cursor-label="Explorar"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              Ver projetos
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#pedrogpt"
              data-cursor-label="Conversar"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-secondary"
            >
              <Sparkles className="size-4 text-primary" />
              Converse com o PedroGPT
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              {personal.local}
            </span>
            <div className="flex items-center gap-1">
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary">
                <LinkedinIcon className="size-4" />
              </a>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary">
                <GithubIcon className="size-4" />
              </a>
              <a href={`mailto:${personal.email}`} aria-label="Email" className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary">
                <Mail className="size-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="relative" style={{ animation: "float-slow 6s ease-in-out infinite" }}>
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-transparent to-accent-2/25 blur-2xl" />
            <div className="glass relative overflow-hidden rounded-[1.75rem] p-2">
              <div className="relative overflow-hidden rounded-[1.35rem]">
                <Image
                  src={personal.foto || "/placeholder.svg"}
                  alt={`Retrato profissional de ${personal.nome}`}
                  width={520}
                  height={640}
                  priority
                  className="h-auto w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl glass px-3 py-2">
                  <span className="font-mono text-xs text-muted-foreground">São Paulo · BR</span>
                  <span className="font-mono text-xs text-primary">{personal.cargoCurto}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#sobre"
        aria-label="Rolar para a próxima seção"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Role</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8 }}
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
