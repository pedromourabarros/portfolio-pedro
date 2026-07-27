import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons"
import { Mail } from "lucide-react"
import { navLinks, personal } from "@/lib/data"

export function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/60 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
                PM
              </span>
              <span className="font-semibold text-foreground">{personal.nome}</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {personal.cargo} — transformando dados em decisões de negócio.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={`https://wa.me/${personal.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <WhatsappIcon className="size-4" />
            </a>
            <a
              href={`mailto:${personal.email}`}
              aria-label="Email"
              className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {ano} {personal.nome}. Todos os direitos reservados.
          </p>
          <p>Feito com Next.js, Tailwind CSS e IA.</p>
        </div>
      </div>
    </footer>
  )
}
