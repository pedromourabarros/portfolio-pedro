"use client"

export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Aurora blobs */}
      <div
        className="absolute left-[10%] top-[-10%] h-[45rem] w-[45rem] rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle at center, var(--primary), transparent 60%)",
          animation: "aurora-drift 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[5%] top-[20%] h-[38rem] w-[38rem] rounded-full opacity-25 blur-[120px]"
        style={{
          background: "radial-gradient(circle at center, var(--accent-2), transparent 60%)",
          animation: "aurora-drift 22s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[30%] h-[40rem] w-[40rem] rounded-full opacity-20 blur-[130px]"
        style={{
          background: "radial-gradient(circle at center, var(--primary), transparent 65%)",
          animation: "aurora-drift 26s ease-in-out infinite",
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-70" />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, transparent 40%, var(--background) 95%)",
        }}
      />
    </div>
  )
}
