"use server"

import { and, desc, eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contactMessage, user } from "@/lib/db/schema"

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// Existe algum admin cadastrado? (controla se o cadastro fica aberto)
export async function adminExists(): Promise<boolean> {
  const [row] = await db.select({ n: sql<number>`count(*)` }).from(user)
  return Number(row?.n ?? 0) > 0
}

export async function getMensagens() {
  await requireUser()
  return db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt))
}

export type PainelStats = {
  total: number
  naoLidas: number
  semana: number
  serie: { dia: string; total: number }[]
}

export async function getStats(): Promise<PainelStats> {
  await requireUser()

  const todas = await db.select().from(contactMessage)
  const total = todas.length
  const naoLidas = todas.filter((m) => !m.lida).length

  const agora = Date.now()
  const umaSemana = 7 * 24 * 60 * 60 * 1000
  const semana = todas.filter((m) => agora - new Date(m.createdAt).getTime() <= umaSemana).length

  // Série dos últimos 14 dias (contagem por dia, incluindo dias sem mensagens)
  const dias: { dia: string; total: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(agora - i * 24 * 60 * 60 * 1000)
    const chave = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    const inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const fim = inicio + 24 * 60 * 60 * 1000
    const count = todas.filter((m) => {
      const t = new Date(m.createdAt).getTime()
      return t >= inicio && t < fim
    }).length
    dias.push({ dia: chave, total: count })
  }

  return { total, naoLidas, semana, serie: dias }
}

export async function marcarLida(id: number, lida: boolean) {
  await requireUser()
  await db.update(contactMessage).set({ lida }).where(eq(contactMessage.id, id))
  revalidatePath("/admin")
}

export async function excluirMensagem(id: number) {
  await requireUser()
  await db.delete(contactMessage).where(and(eq(contactMessage.id, id)))
  revalidatePath("/admin")
}
