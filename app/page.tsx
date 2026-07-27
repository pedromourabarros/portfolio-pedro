import { AuroraBackground } from "@/components/aurora-background"
import { Navbar } from "@/components/navbar"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Hero } from "@/components/sections/hero"
import { Sobre } from "@/components/sections/sobre"

export default function Page() {
  return (
    <SmoothScroll>
      <AuroraBackground />
      <Navbar />
      <main>
        <Hero />
        <Sobre />
      </main>
    </SmoothScroll>
  )
}
