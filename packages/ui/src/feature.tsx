import { MessageSquare, Users, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description:
      "Instant message delivery with typing indicators, read receipts, and seamless synchronization across all your devices.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built for speed with optimized performance. Send messages, share files, and connect with zero lag or delays.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "End-to-end encryption ensures your conversations stay private. Your data is protected with enterprise-grade security.",
  },
]

export function Features() {
  return (
    <section id="features" className="w-full py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance mb-4">
            Everything you need to stay connected
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Powerful features designed to make communication effortless and enjoyable for teams of all sizes.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-4 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
