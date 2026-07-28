"use server"

import { db } from "@/lib/db"
import { contactMessage } from "@/lib/db/schema"

export type ContatoResult = { ok: true } | { ok: false; error: string }

export async function enviarMensagem(input: {
  nome: string
  email: string
  mensagem: string
}): Promise<ContatoResult> {
  const nome = input.nome?.trim()
  const email = input.email?.trim()
  const mensagem = input.mensagem?.trim()

  if (!nome || !email || !mensagem) {
    return { ok: false, error: "Preencha nome, e-mail e mensagem." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Informe um e-mail válido." }
  }
  if (mensagem.length > 5000) {
    return { ok: false, error: "Mensagem muito longa." }
  }

  try {
    await db.insert(contactMessage).values({ nome, email, mensagem })
    return { ok: true }
  } catch (err) {
    console.log("[v0] Erro ao salvar mensagem:", err)
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente." }
  }
}
