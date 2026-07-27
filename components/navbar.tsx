"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { navLinks, personal } from "@/lib/data"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 md:px-5",
          scrolled ? "glass shadow-lg shadow-black/20" : "border border-transparent",
        )}
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Ir para o topo">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-mono text-sm font-bold text-primary-foreground">
            PM
          </span>
          <span className="hidden text-sm font-medium sm:block">
            {personal.primeiroNome}
            <span className="text-muted-foreground"> · Barros</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active === link.href && "text-foreground",
                )}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contato"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
          >
            Fale comigo
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass absolute inset-x-4 top-20 rounded-2xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-1">
                <a
                  href="#contato"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
                >
                  Fale comigo
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
