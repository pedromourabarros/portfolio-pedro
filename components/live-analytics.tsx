"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { AnimatePresence, motion } from "motion/react"
import { Activity, ChevronUp, Radio } from "lucide-react"
import { LiveAnalyticsChart } from "@/components/live-analytics-chart"
import { navLinks } from "@/lib/data"
import { cn } from "@/lib/utils"

type AnalyticsData = {
  online: number
  hoje: number
  total: number
  topSection: string | null
  serie: { dia: string; total: number }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<AnalyticsData>)

function getSessionId() {
  if (typeof window === "undefined") return ""
  const KEY = "pmb_sid"
  let id = sessionStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(KEY, id)
  }
  return id
}

function track(kind: "view" | "heartbeat" | "section", section?: string) {
  const sessionId = getSessionId()
  if (!sessionId) return
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, kind, section }),
    keepalive: true,
  }).catch(() => {})
}

export function LiveAnalytics() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastSection = useRef<string | null>(null)

  const { data } = useSWR<AnalyticsData>("/api/analytics", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  // Pageview + heartbeat: mantém a contagem "online agora" viva enquanto a aba está visível.
  useEffect(() => {
    track("view")
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") track("heartbeat")
    }, 20_000)
    return () => clearInterval(interval)
  }, [])

  // Rastreia qual seção o visitante está lendo (sem PII, só o id da seção).
  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id !== lastSection.current) {
            lastSection.current = entry.target.id
            track("section", entry.target.id)
          }
        })
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [open])

  const online = data?.online ?? 0

  return (
    <div ref={panelRef} className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass mb-3 w-72 overflow-hidden rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <p className="text-sm font-medium text-foreground">Analytics ao vivo</p>
              </div>
              <Activity className="size-3.5 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-3 gap-px bg-border">
              <Stat label="Agora" value={online} />
              <Stat label="Hoje" value={data?.hoje ?? 0} />
              <Stat label="Total" value={data?.total ?? 0} />
            </div>

            <div className="px-4 pt-3">
              <LiveAnalyticsChart serie={data?.serie ?? []} />
            </div>

            <div className="flex items-center justify-between px-4 pb-4 pt-1 text-[11px] text-muted-foreground">
              <span>
                Mais vista: <span className="text-foreground">{data?.topSection ?? "—"}</span>
              </span>
              <span>100% anônimo</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Ver analytics ao vivo do portfólio"
        className="glass flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-xs text-foreground shadow-lg shadow-black/20 transition-transform hover:scale-[1.03] active:scale-95"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <Radio className="size-3.5 text-muted-foreground" />
        <span className="font-medium tabular-nums">
          {online} {online === 1 ? "pessoa" : "pessoas"} agora
        </span>
        <ChevronUp className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card px-3 py-3 text-center">
      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  )
}
