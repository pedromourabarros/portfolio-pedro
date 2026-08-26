"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Copy,
  FolderKanban,
  Home,
  Mail,
  MessageCircle,
  Search,
  User,
} from "lucide-react"
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons"
import { personal } from "@/lib/data"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  grupo: "Navegar" | "Ações"
  label: string
  sublabel?: string
  icon: React.ComponentType<{ className?: string }>
  keywords?: string
  run: () => void
}

// Simula um clique real em uma âncora "#id" para reaproveitar a ponte de
// smooth-scroll (Lenis) já registrada em components/smooth-scroll.tsx.
function goTo(href: string) {
  const a = document.createElement("a")
  a.href = href
  a.style.position = "fixed"
  a.style.opacity = "0"
  a.style.pointerEvents = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items = useMemo<Item[]>(
    () => [
      { id: "top", grupo: "Navegar", label: "Início", icon: Home, run: () => goTo("#top") },
      { id: "sobre", grupo: "Navegar", label: "Sobre", icon: User, run: () => goTo("#sobre") },
      {
        id: "experiencia",
        grupo: "Navegar",
        label: "Experiência",
        icon: Briefcase,
        run: () => goTo("#experiencia"),
      },
      {
        id: "projetos",
        grupo: "Navegar",
        label: "Projetos",
        icon: FolderKanban,
        run: () => goTo("#projetos"),
      },
      {
        id: "dashboard",
        grupo: "Navegar",
        label: "Painel BI",
        sublabel: "Dashboard interativo",
        icon: BarChart3,
        run: () => goTo("#dashboard"),
      },
      {
        id: "pedrogpt",
        grupo: "Navegar",
        label: "PedroGPT",
        sublabel: "Assistente de IA",
        icon: Bot,
        run: () => goTo("#pedrogpt"),
      },
      {
        id: "contato",
        grupo: "Navegar",
        label: "Contato",
        icon: Mail,
        run: () => goTo("#contato"),
      },
      {
        id: "copy-email",
        grupo: "Ações",
        label: "Copiar e-mail",
        sublabel: personal.email,
        icon: Copy,
        keywords: "email mail contato",
        run: () => {
          navigator.clipboard.writeText(personal.email)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        },
      },
      {
        id: "whatsapp",
        grupo: "Ações",
        label: "Abrir WhatsApp",
        icon: MessageCircle,
        keywords: "whatsapp mensagem",
        run: () => window.open(`https://wa.me/${personal.whatsapp}`, "_blank"),
      },
      {
        id: "linkedin",
        grupo: "Ações",
        label: "Abrir LinkedIn",
        icon: LinkedinIcon,
        keywords: "linkedin rede profissional",
        run: () => window.open(personal.linkedin, "_blank"),
      },
      {
        id: "github",
        grupo: "Ações",
        label: "Abrir GitHub",
        icon: GithubIcon,
        keywords: "github codigo repositorios",
        run: () => window.open(personal.github, "_blank"),
      },
    ],
    [],
  )

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return items
    return items.filter((item) =>
      normalize(`${item.label} ${item.sublabel ?? ""} ${item.keywords ?? ""}`).includes(q),
    )
  }, [items, query])

  const grupos = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const item of filtered) {
      map.set(item.grupo, [...(map.get(item.grupo) ?? []), item])
    }
    return Array.from(map.entries())
  }, [filtered])

  function close() {
    setOpen(false)
    setQuery("")
    setActiveIndex(0)
  }

  function runItem(item?: Item) {
    if (!item) return
    item.run()
    if (item.id !== "copy-email") close()
  }

  // Atalho global ⌘K / Ctrl+K + evento customizado (trigger da navbar)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onCustomOpen = () => setOpen(true)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("open-command-palette", onCustomOpen)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("open-command-palette", onCustomOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => inputRef.current?.focus(), 10)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      runItem(filtered[activeIndex])
    }
  }

  if (typeof document === "undefined") return null

  let flatIndex = -1

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-center px-4 pt-[12vh] sm:pt-[16vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Busca rápida"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKeyDown}
            className="glass relative z-10 h-fit w-full max-w-lg overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar seções ou ações..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Buscar"
              />
              <kbd className="hidden shrink-0 rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                esc
              </kbd>
            </div>

            <div ref={listRef} data-lenis-prevent className="max-h-[50vh] overflow-y-auto p-2">
              {grupos.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nenhum resultado para &quot;{query}&quot;
                </p>
              )}
              {grupos.map(([grupo, grupoItems]) => (
                <div key={grupo} className="mb-1">
                  <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {grupo}
                  </p>
                  {grupoItems.map((item) => {
                    flatIndex += 1
                    const index = flatIndex
                    const isActive = index === activeIndex
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        data-index={index}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => runItem(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                            isActive
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border bg-surface-2 text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium text-foreground">
                            {item.id === "copy-email" && copied ? "E-mail copiado!" : item.label}
                          </span>
                          {item.sublabel && (
                            <span className="truncate text-xs text-muted-foreground">{item.sublabel}</span>
                          )}
                        </span>
                        {isActive && <ArrowRight className="size-3.5 shrink-0 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="hidden items-center gap-3 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground sm:flex">
              <span className="flex items-center gap-1">
                <kbd className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono">↑</kbd>
                <kbd className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono">↓</kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono">↵</kbd>
                selecionar
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
