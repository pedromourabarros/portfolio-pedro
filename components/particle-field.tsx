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

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }
    let rafId = 0

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#5e_"

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

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
      ctx.clearRect(0, 0, width, height)

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

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(0.85 0.13 195 / ${0.5})`
        ctx.fill()

        // connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `oklch(0.8 0.12 195 / ${0.12 * (1 - d / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
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
