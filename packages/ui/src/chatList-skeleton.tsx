export function ChatListItemSkeleton() {
    return (
      <div className="w-full rounded-2xl px-2 py-2 flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-[color:var(--muted)]/50" />
        <div className="min-w-0 flex-1">
          <div className="h-4 bg-[color:var(--muted)]/50 rounded w-24 mb-2" />
          <div className="h-3 bg-[color:var(--muted)]/30 rounded w-32" />
        </div>
      </div>
    )
  }
  
  export function ChatListSkeleton({ count = 8 }: { count?: number }) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <ChatListItemSkeleton key={i} />
        ))}
      </div>
    )
  }
  