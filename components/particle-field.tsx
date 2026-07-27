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
    // Locais garantidamente não-nulos para uso dentro das funções aninhadas.
    const el: HTMLCanvasElement = canvas
    const context: CanvasRenderingContext2D = ctx

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }
    let rafId = 0

    function resize() {
      const parent = el.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = width * dpr
      el.height = height * dpr
      el.style.width = `${width}px`
      el.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(90, Math.floor((width * height) / 14000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }))
    }

    function draw() {
      context.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // gentle attraction to mouse
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 160) {
          p.x += (dx / dist) * 0.4
          p.y += (dy / dist) * 0.4
        }

        context.beginPath()
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        context.fillStyle = `oklch(0.85 0.13 195 / ${0.5})`
        context.fill()

        // connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            context.beginPath()
            context.moveTo(p.x, p.y)
            context.lineTo(q.x, q.y)
            context.strokeStyle = `oklch(0.8 0.12 195 / ${0.12 * (1 - d / 120)})`
            context.lineWidth = 1
            context.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    window.addEventListener("resize", resize)
    if (!prefersReduced) {
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseout", onLeave)
      rafId = requestAnimationFrame(draw)
    } else {
      // static single frame
      draw()
      cancelAnimationFrame(rafId)
    }

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseout", onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
