"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<"default" | "pointer" | "text">("default")
  const [hidden, setHidden] = useState(true)
  const [pressed, setPressed] = useState(false)
  const [label, setLabel] = useState("")

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Anel: mais "macio" (segue com atraso). Ponto: quase instantâneo.
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 })
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.3 })
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.3 })

  useEffect(() => {
    // Só ativa em dispositivos com ponteiro fino (mouse/trackpad).
    const fine = window.matchMedia("(pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduce.matches) return

    setEnabled(true)
    document.documentElement.classList.add("cursor-none-root")

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (hidden) setHidden(false)

      const target = e.target as HTMLElement | null
      const interactive = target?.closest(
        "a, button, [role='button'], input[type='submit'], summary, .cursor-interactive",
      )
      const textField = target?.closest("input:not([type='submit']), textarea, [contenteditable='true']")

      if (interactive) {
        setVariant("pointer")
        const dataLabel = (interactive as HTMLElement).getAttribute("data-cursor-label")
        setLabel(dataLabel || "")
      } else if (textField) {
        setVariant("text")
        setLabel("")
      } else {
        setVariant("default")
        setLabel("")
      }
    }

    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const leave = () => setHidden(true)
    const enter = () => setHidden(false)

    window.addEventListener("mousemove", move, { passive: true })
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)
    document.addEventListener("mouseleave", leave)
    document.addEventListener("mouseenter", enter)

    return () => {
      document.documentElement.classList.remove("cursor-none-root")
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)
      document.removeEventListener("mouseleave", leave)
      document.removeEventListener("mouseenter", enter)
    }
  }, [x, y, hidden])

  if (!enabled) return null

  const ringSize = variant === "pointer" ? 56 : variant === "text" ? 8 : 34
  const ringScale = pressed ? 0.82 : 1

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Anel externo */}
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border"
          animate={{
            width: ringSize,
            height: variant === "text" ? 26 : ringSize,
            scale: ringScale,
            borderRadius: variant === "text" ? 4 : 999,
            backgroundColor:
              variant === "pointer" ? "color-mix(in oklch, var(--primary) 14%, transparent)" : "transparent",
            borderColor:
              variant === "pointer"
                ? "color-mix(in oklch, var(--primary) 70%, transparent)"
                : "color-mix(in oklch, var(--primary) 45%, transparent)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          {label && (
            <span className="whitespace-nowrap px-2 font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Ponto central */}
      <motion.div
        className="fixed left-0 top-0 rounded-full bg-primary"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: variant === "pointer" ? 0 : 6,
          height: variant === "pointer" ? 0 : 6,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  )
}
