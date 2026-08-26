import { db } from "@/lib/db"
import { siteEvent } from "@/lib/db/schema"
import { navLinks } from "@/lib/data"

const ALLOWED_KINDS = new Set(["view", "heartbeat", "section"])
const ALLOWED_SECTIONS = new Set(navLinks.map((l) => l.href.replace("#", "")))

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 64) : ""
    const kind = typeof body?.kind === "string" ? body.kind : ""
    const section = typeof body?.section === "string" ? body.section.slice(0, 32) : null

    // Validação estrita: nunca gravamos texto livre, apenas valores esperados.
    if (!sessionId || sessionId.length < 8 || !ALLOWED_KINDS.has(kind)) {
      return Response.json({ ok: false }, { status: 400 })
    }
    if (section && !ALLOWED_SECTIONS.has(section)) {
      return Response.json({ ok: false }, { status: 400 })
    }

    await db.insert(siteEvent).values({ sessionId, kind, section })
    return Response.json({ ok: true })
  } catch {
    // Analytics nunca deve quebrar a navegação do visitante.
    return Response.json({ ok: false }, { status: 200 })
  }
}
