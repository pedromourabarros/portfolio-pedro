import { AuroraBackground } from "@/components/aurora-background"
import { ScrollProgress } from "@/components/scroll-progress"
import { Navbar } from "@/components/navbar"
import { CommandPalette } from "@/components/command-palette"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Hero } from "@/components/sections/hero"
import { Sobre } from "@/components/sections/sobre"
import { Experiencia } from "@/components/sections/experiencia"
import { Projetos } from "@/components/sections/projetos"
import { Dashboard } from "@/components/sections/dashboard"
import { PedroGpt } from "@/components/sections/pedrogpt"
import { Contato } from "@/components/sections/contato"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <SmoothScroll>
      <span id="top" className="sr-only" />
      <ScrollProgress />
      <AuroraBackground />
      <Navbar />
      <CommandPalette />
      <main>
        <Hero />
        <Sobre />
        <Experiencia />
        <Projetos />
        <Dashboard />
        <PedroGpt />
        <Contato />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
