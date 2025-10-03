"use client"

import { useState } from "react"
import { Loader } from "@repo/ui/landingLoader"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold text-primary">Welcome to Chat</h1>
        </div>
      )}
    </>
  )
}
