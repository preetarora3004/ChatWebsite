import { MessageSkeletonGroup } from "@repo/ui/message-list-skeleton"
import { ChatListSkeleton } from "@repo/ui/chatList-skeleton"

export default function Page() {
  return (
    <div className="w-screen h-screen flex bg-background text-foreground">
      
      <aside className="h-full w-1/4 py-2 border-r border-border bg-background">
        <div className="flex justify-between items-center px-5 py-4">
          <h2 className="text-sm font-medium text-muted-foreground">Chats</h2>
          <div className="text-xs text-muted-foreground">Loading...</div>
        </div>

        <div className="px-4 pb-3">
          <div className="w-full h-10 rounded-full bg-muted animate-pulse" />
        </div>

        <div className="overflow-y-auto h-[calc(100%-7.5rem)] px-3">
          <ChatListSkeleton count={8} />
        </div>
      </aside>

      <main className="h-full flex-1 flex flex-col">
        <header className="h-16 bg-background border-b border-border px-4 flex items-center">
          <div className="inline-flex items-center px-2 py-1 h-12 rounded-xl bg-background border border-border animate-pulse">
            <div className="w-9 h-9 rounded-md bg-muted" />
            <div className="ml-2 space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted/50 rounded" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex px-3 py-16">
          <div className="w-full max-w-3xl mx-auto h-full overflow-y-auto p-3 flex flex-col-reverse gap-2">
            <MessageSkeletonGroup count={6} />
          </div>
        </div>

        <div className="w-full flex justify-center px-3 pb-6">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-background shadow-sm flex items-center gap-2 px-2">
            <div className="flex-1 h-12 px-3 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}
