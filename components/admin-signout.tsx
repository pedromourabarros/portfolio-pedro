"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function AdminSignOut() {
  const router = useRouter()

  async function sair() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      onClick={sair}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <LogOut className="size-4" />
      Sair
    </button>
  )
}
