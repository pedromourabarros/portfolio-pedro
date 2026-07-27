"use client"

import { type ReactNode, useRef } from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
  as?: "div" | "li" | "span"
}

export function Reveal({ children, className, delay = 0, y = 24, once = true }: RevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-pretty leading-relaxed text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
