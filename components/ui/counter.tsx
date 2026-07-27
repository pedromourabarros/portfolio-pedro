"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"

export function Counter({
  value,
  suffix = "",
  decimals,
  duration = 1600,
}: {
  value: string
  suffix?: string
  decimals?: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = useState<string>("")

  const numeric = Number.parseFloat(value.replace(",", "."))
  const isNumeric = !Number.isNaN(numeric)
  const decimalPlaces = decimals ?? (value.includes(".") || value.includes(",") ? value.split(/[.,]/)[1]?.length ?? 0 : 0)

  useEffect(() => {
    if (!inView) return
    if (!isNumeric) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = numeric * eased
      setDisplay(current.toFixed(decimalPlaces))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, isNumeric, numeric, value, duration, decimalPlaces])

  return (
    <span ref={ref}>
      {display || (isNumeric ? "0" : value)}
      {suffix}
    </span>
  )
}
