import { AuroraBackground } from "@/components/aurora-background"
import { Navbar } from "@/components/navbar"
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
      <AuroraBackground />
      <Navbar />
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
