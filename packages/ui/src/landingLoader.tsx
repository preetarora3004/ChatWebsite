"use client"

import { useEffect, useState } from "react"

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2000 
    const interval = 20
    const steps = duration / interval
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 300)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        {/* Animated chat bubble icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-10 w-10 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Loading your chat experience...</p>
        </div>
      </div>
    </div>
  )
}
