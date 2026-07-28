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
