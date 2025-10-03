import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Card, CardContent } from "./card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "/professional-woman-diverse.png",
    content:
      "ChatFlow has transformed how our team communicates. The real-time features and intuitive interface make collaboration seamless.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Community Lead",
    company: "CreativeHub",
    avatar: "/professional-man.jpg",
    content:
      "Managing our community of 50,000+ members has never been easier. The group features and moderation tools are outstanding.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Startup Founder",
    company: "InnovateLabs",
    avatar: "/entrepreneur-woman.png",
    content:
      "We switched from Slack and never looked back. ChatFlow is faster, more affordable, and our team loves the clean design.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Join thousands of teams who have transformed their communication with ChatFlow.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-card-foreground leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
