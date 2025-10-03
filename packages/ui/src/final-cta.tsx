import { Button } from "./button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section className="w-full py-24 sm:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl lg:text-5xl text-balance mb-6">
            Ready to transform your team communication?
          </h2>
          <p className="text-lg text-secondary-foreground/80 text-balance mb-10 leading-relaxed">
            Join thousands of teams already using ChatFlow. Start your free trial today, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-base px-8">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base px-8 bg-secondary-foreground/5 hover:bg-secondary-foreground/10 border-secondary-foreground/20"
            >
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
