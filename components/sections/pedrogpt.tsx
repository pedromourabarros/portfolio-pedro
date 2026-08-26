"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUp, Bot, RotateCcw, Sparkles, User } from "lucide-react"
import { SectionHeading } from "@/components/ui/reveal"
import { personal } from "@/lib/data"
import { cn } from "@/lib/utils"

const sugestoes = [
  "Quais são as principais competências técnicas do Pedro?",
  "Conte sobre a experiência dele no Bradesco.",
  "O que é o projeto Fyncop?",
  "Como faço para entrar em contato?",
]

function extractText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("")
}

export function PedroGpt() {
  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  function submit(text: string) {
    const value = text.trim()
    if (!value || isBusy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <section id="pedrogpt" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          index="05"
          eyebrow="PedroGPT"
          title={
            <>
              Pergunte diretamente ao <span className="text-gradient-accent">meu currículo</span>
            </>
          }
          description="Um assistente de IA treinado com o currículo do Pedro. Pergunte sobre experiências, competências, projetos ou como entrar em contato. As respostas são geradas em tempo real."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card mx-auto mt-12 flex h-[560px] flex-col overflow-hidden rounded-3xl"
        >
          {/* Cabeçalho do chat */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">PedroGPT</p>
                <p className="text-xs text-muted-foreground">
                  {isBusy ? "Digitando..." : "Online · responde em segundos"}
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="size-3.5" />
                Limpar
              </button>
            )}
          </div>

          {/* Mensagens */}
          <div ref={scrollRef} data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="size-7" />
                </div>
                <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                  Olá! Sou o assistente virtual do Pedro. Escolha uma pergunta abaixo ou escreva a sua.
                </p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isUser = message.role === "user"
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        isUser ? "bg-secondary text-foreground" : "bg-primary/15 text-primary",
                      )}
                    >
                      {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isUser
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm bg-secondary/70 text-foreground",
                      )}
                    >
                      {extractText(message) || (
                        <span className="inline-flex gap-1 py-1">
                          <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-current" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {error && (
              <p className="text-center text-sm text-destructive">
                Ocorreu um erro ao responder. Tente novamente em instantes.
              </p>
            )}
          </div>

          {/* Sugestões */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {sugestoes.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                ) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              placeholder={`Pergunte sobre a carreira do ${personal.primeiroNome}...`}
              aria-label="Escreva sua pergunta"
              className="flex-1 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              aria-label="Enviar mensagem"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp className="size-5" />
            </button>
          </form>
        </motion.div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Respostas geradas por IA com base no currículo do Pedro. Podem conter imprecisões.
        </p>
      </div>
    </section>
  )
}
