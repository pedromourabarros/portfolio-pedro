"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function AdminAuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message ?? "Não foi possível continuar.")
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Lock className="size-5" />
          </div>
          <h1 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-foreground">
            {isSignUp ? "Criar acesso do painel" : "Painel de mensagens"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp
              ? "Defina a conta de administrador do portfólio."
              : "Acesse para ver as mensagens de contato."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-4 rounded-3xl p-6">
          {isSignUp && (
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Nome</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="rounded-xl border border-border bg-background/60 px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
          )}
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-muted-foreground">E-mail</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="rounded-xl border border-border bg-background/60 px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-muted-foreground">Senha</span>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="rounded-xl border border-border bg-background/60 px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {isSignUp ? "Criar acesso" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  )
}
