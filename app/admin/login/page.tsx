import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { adminExists } from "@/app/actions/admin"
import { AdminAuthForm } from "@/components/admin-auth-form"

export const metadata = { title: "Entrar — Painel" }

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/admin")

  // Se ainda não há admin, envia para o cadastro inicial
  const existe = await adminExists()
  if (!existe) redirect("/admin/cadastro")

  return <AdminAuthForm mode="sign-in" />
}
