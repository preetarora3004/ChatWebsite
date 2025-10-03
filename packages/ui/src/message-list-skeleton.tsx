export function MessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
    return (
      <div className={`max-w-[60%] break-words px-3 py-2 rounded-xl ${isOwn ? "self-end" : "self-start"} animate-pulse`}>
        <div
          className={`h-4 rounded ${isOwn ? "bg-[#B7B1E3]/30" : "bg-[#212121]/30"} mb-2`}
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
        <div
          className={`h-4 rounded ${isOwn ? "bg-[#B7B1E3]/30" : "bg-[#212121]/30"}`}
          style={{ width: `${Math.random() * 30 + 40}%` }}
        />
        <div className="h-3 w-12 rounded bg-gray-500/20 mt-2 ml-auto" />
      </div>
    )
  }
  
  export function MessageSkeletonGroup({ count = 5 }: { count?: number }) {
    return (
      <div className="flex flex-col-reverse gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <MessageSkeleton key={i} isOwn={i % 3 === 0} />
        ))}
      </div>
    )
  }
  