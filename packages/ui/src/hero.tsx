import { Button } from "./button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto relative w-full px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-secondary-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Connect with anyone, anywhere</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-secondary-foreground sm:text-6xl lg:text-7xl text-balance">
            Chat that brings your <span className="text-primary">community together</span>
          </h1>

          <p className="mb-10 text-lg text-secondary-foreground/80 sm:text-xl text-balance max-w-2xl mx-auto leading-relaxed">
            Experience seamless real-time messaging with powerful features designed for modern teams and communities.
            Stay connected, collaborate better.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-base px-8">
              <Link href="/login">
                Start Chatting Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base px-8 bg-secondary-foreground/5 hover:bg-secondary-foreground/10 border-secondary-foreground/20"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-secondary-foreground/60">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>10M+ messages sent</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-secondary-foreground/20" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>500K+ active users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
