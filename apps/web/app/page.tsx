import { Header } from "@repo/ui/header"
import { Hero } from "@repo/ui/hero"
import { Features } from "@repo/ui/feature"
import { Testimonials } from "@repo/ui/testimonials"
import { Pricing } from "@repo/ui/pricing"
import { FinalCTA } from "@repo/ui/final-cta"
import { Footer } from "@repo/ui/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
