import type { CSSProperties } from "react"
import { Loader } from "@repo/ui/loader"

export default function LoadingPage() {
  
  const themeVars: CSSProperties = {
    ["--background" as any]: "#232323",
    ["--foreground" as any]: "#FFFFFF",
    ["--primary" as any]: "#8774E1",
    ["--muted" as any]: "#2E2E2E",
    ["--muted-foreground" as any]: "#B3B3B3",
    ["--border" as any]: "#2E2E2E",
    ["--primary-foreground" as any]: "#FFFFFF",
  }

  return (
    <main
      style={themeVars}
      className="min-h-screen bg-background text-foreground"
      aria-label="Chat app is preparing your workspace"
    >
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 p-6">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-semibold text-balance">Preparing your chat...</h1>
          <p className="text-muted-foreground text-pretty">
            Signing you in and loading your conversations. This should only take a moment.
          </p>
          <Loader size="lg" label="Loading" />
        </div>

        <div className="grid w-full gap-6 md:grid-cols-[16rem_1fr]">
          
          <div className="hidden rounded-lg border border-border p-4 md:block">
            <div className="mb-4 h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>

          
          <div className="rounded-lg border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
              <div className="h-8 w-24 animate-pulse rounded bg-primary/40" />
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="flex-1" />
                <div className="flex-1 space-y-2">
                  <div className="ml-auto h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="ml-auto h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-md border border-border p-3">
              <div className="h-5 w-5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded bg-primary/40" />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: You can safely navigate away — we’ll keep preparing your workspace.
        </p>
      </section>
    </main>
  )
}
