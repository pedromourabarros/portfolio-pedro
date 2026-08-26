import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { adminExists } from "@/app/actions/admin"
import { AdminAuthForm } from "@/components/admin-auth-form"

export const metadata = { title: "Criar acesso - Painel" }

export default async function AdminCadastroPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/admin")

  // Cadastro só é permitido enquanto não existir nenhum admin
  const existe = await adminExists()
  if (existe) redirect("/admin/login")

  return <AdminAuthForm mode="sign-up" />
}
