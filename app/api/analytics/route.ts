import { and, eq, gte, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { siteEvent } from "@/lib/db/schema"
import { navLinks } from "@/lib/data"

export const dynamic = "force-dynamic"

const sectionLabel: Record<string, string> = Object.fromEntries(
  navLinks.map((l) => [l.href.replace("#", ""), l.label]),
)

export async function GET() {
  try {
    const now = Date.now()
    const catorzeDiasAtras = new Date(now - 14 * 24 * 60 * 60 * 1000)
    const inicioHoje = new Date(new Date().setHours(0, 0, 0, 0))

    const [[onlineRow], [hojeRow], [totalRow], secoes, viewsRecentes] = await Promise.all([
      db
        .select({ count: sql<number>`count(distinct ${siteEvent.sessionId})` })
        .from(siteEvent)
        .where(gte(siteEvent.createdAt, new Date(now - 60_000))),
      db
        .select({ count: sql<number>`count(distinct ${siteEvent.sessionId})` })
        .from(siteEvent)
        .where(and(eq(siteEvent.kind, "view"), gte(siteEvent.createdAt, inicioHoje))),
      db
        .select({ count: sql<number>`count(distinct ${siteEvent.sessionId})` })
        .from(siteEvent)
        .where(eq(siteEvent.kind, "view")),
      db
        .select({ section: siteEvent.section, count: sql<number>`count(*)` })
        .from(siteEvent)
        .where(and(eq(siteEvent.kind, "section"), gte(siteEvent.createdAt, catorzeDiasAtras)))
        .groupBy(siteEvent.section),
      db
        .select({ createdAt: siteEvent.createdAt })
        .from(siteEvent)
        .where(and(eq(siteEvent.kind, "view"), gte(siteEvent.createdAt, catorzeDiasAtras))),
    ])

    const topSectionKey = [...secoes].sort((a, b) => Number(b.count) - Number(a.count))[0]?.section
    const topSection = topSectionKey ? sectionLabel[topSectionKey] ?? topSectionKey : null

    const serie: { dia: string; total: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000)
      const inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      const fim = inicio + 24 * 60 * 60 * 1000
      const total = viewsRecentes.filter((v) => {
        const t = new Date(v.createdAt).getTime()
        return t >= inicio && t < fim
      }).length
      serie.push({ dia: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }), total })
    }

    return Response.json({
      online: Number(onlineRow?.count ?? 0),
      hoje: Number(hojeRow?.count ?? 0),
      total: Number(totalRow?.count ?? 0),
      topSection,
      serie,
    })
  } catch {
    return Response.json({ online: 0, hoje: 0, total: 0, topSection: null, serie: [] })
  }
}
