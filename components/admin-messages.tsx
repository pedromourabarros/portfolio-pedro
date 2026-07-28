"use client"

import { useState, useTransition } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Mail, MailOpen, Reply, Trash2 } from "lucide-react"
import { marcarLida, excluirMensagem } from "@/app/actions/admin"

type Mensagem = {
  id: number
  nome: string
  email: string
  mensagem: string
  lida: boolean
  createdAt: Date | string
}

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function AdminMessages({ inicial }: { inicial: Mensagem[] }) {
  const [mensagens, setMensagens] = useState(inicial)
  const [filtro, setFiltro] = useState<"todas" | "nao-lidas">("todas")
  const [, startTransition] = useTransition()

  const visiveis = mensagens.filter((m) => (filtro === "nao-lidas" ? !m.lida : true))
  const naoLidas = mensagens.filter((m) => !m.lida).length

  function toggleLida(m: Mensagem) {
    const novo = !m.lida
    setMensagens((prev) => prev.map((x) => (x.id === m.id ? { ...x, lida: novo } : x)))
    startTransition(() => void marcarLida(m.id, novo))
  }

  function remover(id: number) {
    setMensagens((prev) => prev.filter((x) => x.id !== id))
    startTransition(() => void excluirMensagem(id))
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-border bg-card/50 p-1 text-sm">
          {(["todas", "nao-lidas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                filtro === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "todas" ? "Todas" : "Não lidas"}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {mensagens.length} no total · {naoLidas} não lidas
        </span>
      </div>

      {visiveis.length === 0 ? (
        <div className="glass-card grid place-items-center rounded-3xl p-16 text-center">
          <Mail className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {filtro === "nao-lidas" ? "Nenhuma mensagem não lida." : "Nenhuma mensagem ainda."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {visiveis.map((m) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className={`glass-card rounded-2xl p-5 ${!m.lida ? "border-primary/40" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!m.lida && <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
                      <p className="truncate font-medium text-foreground">{m.nome}</p>
                    </div>
                    <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">
                      {m.email}
                    </a>
                  </div>
                  <time className="font-mono text-xs text-muted-foreground">
                    {fmt.format(new Date(m.createdAt))}
                  </time>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {m.mensagem}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: seu contato no portfólio")}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Reply className="size-3.5" />
                    Responder
                  </a>
                  <button
                    onClick={() => toggleLida(m)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {m.lida ? <MailOpen className="size-3.5" /> : <Check className="size-3.5" />}
                    {m.lida ? "Marcar não lida" : "Marcar lida"}
                  </button>
                  <button
                    onClick={() => remover(m.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Excluir
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
