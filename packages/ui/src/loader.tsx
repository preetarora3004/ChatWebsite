import { cn } from "./lib/util"

type LoaderProps = {
  size?: "sm" | "md" | "lg"
  label?: string
  className?: string
}

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
}

export function Loader({ size = "md", label = "Loading", className }: LoaderProps) {
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite" aria-busy="true">
      <span
        className={cn(
          "inline-block rounded-full border-primary/30 border-t-primary animate-spin",
          sizeMap[size],
          className,
        )}
        aria-hidden="true"
      />
      <span className="text-sm text-muted-foreground">{label}...</span>
      <span className="sr-only">{label}</span>
    </div>
  )
}
