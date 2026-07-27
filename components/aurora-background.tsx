"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"

export function AuroraBackground() {
  const glowRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 })
  // Orbs derivam suavemente conforme a rolagem para dar sensação de profundidade.
  const orb1Y = useTransform(smooth, [0, 1], ["-8%", "18%"])
  const orb2Y = useTransform(smooth, [0, 1], ["18%", "-12%"])
  const orb3Y = useTransform(smooth, [0, 1], ["-15%", "10%"])

  // Brilho que segue o cursor (via variável CSS, sem re-render).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const fine = window.matchMedia("(pointer: fine)").matches
    if (reduce || !fine) return
    const el = glowRef.current
    if (!el) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`)
        el.style.setProperty("--my", `${e.clientY}px`)
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Orbs reativos ao scroll */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute left-[8%] top-[-12%] h-[46rem] w-[46rem] rounded-full opacity-30 blur-[130px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle at center, var(--primary), transparent 62%)",
            animation: "aurora-drift 20s ease-in-out infinite",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: orb2Y }}
        className="absolute right-[2%] top-[18%] h-[40rem] w-[40rem] rounded-full opacity-25 blur-[130px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle at center, var(--accent-2), transparent 62%)",
            animation: "aurora-drift 26s ease-in-out infinite reverse",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: orb3Y }}
        className="absolute bottom-[-18%] left-[32%] h-[42rem] w-[42rem] rounded-full opacity-20 blur-[140px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle at center, var(--primary), transparent 66%)",
            animation: "aurora-drift 30s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* Grade sutil */}
      <div className="absolute inset-0 grid-pattern opacity-70" />

      {/* Brilho que segue o cursor */}
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-60 transition-opacity"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklch, var(--primary) 10%, transparent), transparent 70%)",
        }}
      />

      {/* Textura de ruído (granulado premium) */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Vinheta para profundidade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, transparent 42%, var(--background) 96%)",
        }}
      />
    </div>
  )
}
