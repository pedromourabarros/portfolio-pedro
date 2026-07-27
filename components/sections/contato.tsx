"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowUpRight, Check, Copy, Mail, MapPin, Send } from "lucide-react"
import { SectionHeading } from "@/components/ui/reveal"
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons"
import { personal } from "@/lib/data"

const canais = [
  {
    label: "Email",
    valor: personal.email,
    href: `mailto:${personal.email}`,
    Icon: Mail,
  },
  {
    label: "WhatsApp",
    valor: personal.telefone,
    href: `https://wa.me/${personal.whatsapp}`,
    Icon: WhatsappIcon,
  },
  {
    label: "LinkedIn",
    valor: "in/pedromourabarros",
    href: personal.linkedin,
    Icon: LinkedinIcon,
  },
  {
    label: "GitHub",
    valor: "@pedromourabarros",
    href: personal.github,
    Icon: GithubIcon,
  },
]

export function Contato() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [copied, setCopied] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const assunto = encodeURIComponent(`Contato do portfólio — ${nome || "Visitante"}`)
    const corpo = encodeURIComponent(`${mensagem}\n\n—\n${nome}\n${email}`)
    window.location.href = `mailto:${personal.email}?subject=${assunto}&body=${corpo}`
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard indisponível — silencioso
    }
  }

  return (
    <section id="contato" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="06"
          eyebrow="Contato"
          title={
            <>
              Vamos conversar sobre <span className="text-gradient-accent">dados e oportunidades</span>
            </>
          }
          description="Aberto a novas oportunidades como Analista de Dados / BI. Envie uma mensagem — respondo rápido."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Formulário */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card flex flex-col gap-4 rounded-3xl p-6 sm:p-8 lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">Nome</span>
                <input
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="rounded-xl border border-border bg-background/60 px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                  className="rounded-xl border border-border bg-background/60 px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Mensagem</span>
              <textarea
                required
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={5}
                placeholder="Conte sobre a oportunidade ou projeto…"
                className="resize-none rounded-xl border border-border bg-background/60 px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Send className="size-4" />
                Enviar mensagem
              </button>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Email copiado" : "Copiar email"}
              </button>
            </div>
          </motion.form>

          {/* Canais diretos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 lg:col-span-2"
          >
            <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Localização</p>
                <p className="text-sm text-muted-foreground">{personal.local}</p>
              </div>
            </div>
            {canais.map(({ label, valor, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="truncate text-sm text-muted-foreground">{valor}</p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
