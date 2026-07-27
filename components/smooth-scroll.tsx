"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    // Bridge anchor links so smooth-scroll respects in-page navigation
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!target) return
      const id = target.getAttribute("href")
      if (!id || id === "#") return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el as HTMLElement, { offset: -80 })
      }
    }
    document.addEventListener("click", onClick)

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      document.removeEventListener("click", onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
