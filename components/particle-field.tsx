"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const el: HTMLCanvasElement = canvas
    const context: CanvasRenderingContext2D = ctx

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }
    let rafId = 0
    let running = false
    let canvasRect = { left: 0, top: 0 }
    const FRAME_MS = 1000 / 30
    let lastFrame = Number.NEGATIVE_INFINITY
    // distâncias comparadas ao quadrado (evita Math.sqrt no laço quente)
    const LINK = 120
    const LINK_SQ = LINK * LINK
    const PULL = 150
    const PULL_SQ = PULL * PULL

    function cacheRect() {
      const r = el.getBoundingClientRect()
      canvasRect = { left: r.left, top: r.top }
    }

    function resize() {
      const parent = el.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      el.width = width * dpr
      el.height = height * dpr
      el.style.width = `${width}px`
      el.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(48, Math.floor((width * height) / 26000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.6,
      }))
    }

    function draw(now = 0) {
      rafId = requestAnimationFrame(draw)
      if (now - lastFrame < FRAME_MS) return
      lastFrame = now

      context.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // atração suave ao cursor
        const dxm = mouse.x - p.x
        const dym = mouse.y - p.y
        const distSqM = dxm * dxm + dym * dym
        if (distSqM < PULL_SQ) {
          const d = Math.sqrt(distSqM) || 1
          p.x += (dxm / d) * 0.35
          p.y += (dym / d) * 0.35
        }

        context.beginPath()
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        context.fillStyle = "oklch(0.85 0.13 195 / 0.5)"
        context.fill()

        // conexões (usa distância ao quadrado; só calcula sqrt quando conecta)
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dSq = dx * dx + dy * dy
          if (dSq < LINK_SQ) {
            const alpha = 0.12 * (1 - Math.sqrt(dSq) / LINK)
            context.beginPath()
            context.moveTo(p.x, p.y)
            context.lineTo(q.x, q.y)
            context.strokeStyle = `oklch(0.8 0.12 195 / ${alpha})`
            context.lineWidth = 1
            context.stroke()
          }
        }
      }
    }

    function start() {
      if (running || prefersReduced) return
      running = true
      rafId = requestAnimationFrame(draw)
    }
    function stop() {
      running = false
      cancelAnimationFrame(rafId)
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX - canvasRect.left
      mouse.y = e.clientY - canvasRect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    cacheRect()
    const onResize = () => {
      resize()
      cacheRect()
    }
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", cacheRect, { passive: true })

    if (prefersReduced) {
      // frame único estático
      draw()
      cancelAnimationFrame(rafId)
    } else {
      window.addEventListener("mousemove", onMove, { passive: true })
      window.addEventListener("mouseout", onLeave, { passive: true })

      // Só anima enquanto o campo está visível na viewport.
      const parent = el.parentElement
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) start()
          else stop()
        },
        { threshold: 0 },
      )
      if (parent) io.observe(parent)

      // Pausa quando a aba não está ativa.
      const onVisibility = () => {
        if (document.hidden) stop()
        else if (isInView(parent)) start()
      }
      document.addEventListener("visibilitychange", onVisibility)

      return () => {
        window.removeEventListener("resize", onResize)
        window.removeEventListener("scroll", cacheRect)
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseout", onLeave)
        document.removeEventListener("visibilitychange", onVisibility)
        io.disconnect()
        stop()
      }
    }

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", cacheRect)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

function isInView(el: HTMLElement | null) {
  if (!el) return false
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight
}
