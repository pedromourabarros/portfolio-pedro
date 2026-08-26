export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Orbs de brilho - estáticos, com deriva leve apenas por translate (sem
          re-rasterizar o blur a cada frame). */}
      <div
        className="aurora-orb absolute left-[8%] top-[-12%] h-[42rem] w-[42rem] rounded-full opacity-25 blur-[110px]"
        style={{
          background: "radial-gradient(circle at center, var(--primary), transparent 62%)",
        }}
      />
      <div
        className="aurora-orb-rev absolute right-[2%] top-[16%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[110px]"
        style={{
          background: "radial-gradient(circle at center, var(--accent-2), transparent 62%)",
        }}
      />

      {/* Grade sutil */}
      <div className="absolute inset-0 grid-pattern opacity-70" />

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
