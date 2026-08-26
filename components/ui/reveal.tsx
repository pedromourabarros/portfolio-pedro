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
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  index?: string
  eyebrow: string
  title: ReactNode
  description?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal>
        <span
          className={cn(
            "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-primary",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-primary/50" />
          {index && <span className="text-primary/80">{index}</span>}
          {index && <span className="text-primary/40">-</span>}
          <span className="text-muted-foreground">{eyebrow}</span>
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg",
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
