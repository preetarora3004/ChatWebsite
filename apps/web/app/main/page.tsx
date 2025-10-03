"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@repo/utils"
import { shallow } from "zustand/shallow"
import { useSocket } from "@repo/ui/websocketContext"

function useAuthGuard(loadUser: () => Promise<void>) {
  const { status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      loadUser()
    }
  }, [status, loadUser])

  return { status }
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export default function ChatMergedUI() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { socket, send } = useSocket()

  const [query, setQuery] = useState("")
  const [isAlive, setIsAlive] = useState(false)
  const [rId, setRid] = useState("")
  const counterRef = useRef<Map<string, number>>(new Map())
  const preview = useRef<string>("")

  const {
    users,
    loadUsers,
    chatCreation,
    participantCreation,
    setActiveUser,
    searchUser,
    fetchMessage,
    messages,
    addMessage,
    lastSeenFetch,
    activeUser,
    setChatId,
  } = useUser(
    (s) => ({
      users: s.users,
      loadUsers: s.loadUsers,
      chatCreation: s.chatCreation,
      participantCreation: s.participantCreation,
      setActiveUser: s.setActiveUser,
      activeUser: s.activeUser,
      searchUser: s.searchUser,
      messages: s.message,
      fetchMessage: s.fetchMessage,
      addMessage: s.addMessage,
      lastSeenFetch: s.lastSeenFetch,
      setChatId: s.setChatId,
      chatId: s.chatId,
    }),
    shallow,
  )

  const { status } = useAuthGuard(loadUsers)
  const { data } = useSession()

  const filteredUsers = useMemo(() => {
    if (!query) return users
    const regex = new RegExp(escapeRegex(query), "i")
    return users.filter((u) => regex.test(u.username))
  }, [users, query])

  useEffect(() => {
    if (!socket) return

    const handleSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        if (data.event === "chat") {
          addMessage(data.payload)
          preview.current = data.payload.content

          const senderId = data.payload.senderId
          const prev = counterRef.current.get(senderId) || 0
          counterRef.current.set(senderId, prev + 1)

          const sender = users.find(e=>{
            e.id === senderId
          })

          if(!sender){
            loadUsers();
          }

        }

        if (data.event === "system") {
          setIsAlive(data.payload.isAlive)
          setRid(data.payload.userId)
        }
      } catch (err) {
        console.error("Invalid message format", err)
      }
    }
    socket.addEventListener("message", handleSocketMessage)

    if (activeUser?.id) {
      (async () => {
        try {
          await lastSeenFetch(activeUser.id)
        } catch (e) {

        }
      })
    }

    return () => {
      socket.removeEventListener("message", handleSocketMessage)
    }
  }, [socket, activeUser?.id])

  useEffect(()=>{

    const sender = users.find((e)=>{
      
    })

  },[messages])


  if (status !== "authenticated" || !data) return null

  if (status !== "authenticated" || !data) return null

  const handleUserClick = async (userId: string, username: string) => {

    try {
      const participants = await searchUser(userId)
      const existing = participants?.find((detail) => detail.chatId)

      if (existing) {
        setActiveUser(userId, username)
        setChatId(existing.chatId)
        return  router.push(`/user/${username}`)
      }

      const newChat = await chatCreation()
      if (!newChat?.id) return router.push("/404")

      await participantCreation(newChat.id, username)
      await participantCreation(newChat.id, data.user.username)

      setActiveUser(userId, username)
      setChatId(newChat.id)
      return router.push(`/user/${username}`)
    } catch (err) {
      console.error("Chat creation failed:", err)
    }

    lastSeenFetch(userId)
  }

  return (
    <div className="w-screen h-screen fixed inset-0 flex justify-center items-center bg-background text-foreground">
      <div className="w-screen h-screen overflow-hidden flex">

        <aside
          className="h-full w-1/4 py-2 border-r border-[color:var(--border)] bg-[color:var(--background)]"
          aria-label="Conversations sidebar"
        >

          <div className="flex justify-between items-center px-5 py-4">
            <h2 className="text-sm font-medium text-[color:var(--muted-foreground)]">Chats</h2>
            <div className="text-xs text-[color:var(--muted-foreground)]">{users.length} chats</div>
          </div>

          <div className="px-4 pb-3">
            <label htmlFor="chat-search" className="sr-only">
              Search chats
            </label>
            <input
              id="chat-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full h-10 rounded-full bg-[color:var(--muted)] text-foreground placeholder:text-[color:var(--muted-foreground)] px-3 text-sm outline-none ring-0 focus:outline-none"
              aria-label="Search chats"
            />
          </div>

          <div className="overflow-y-auto h-[calc(100%-7.5rem)] px-3 pb-16">
            <ul className="flex flex-col gap-2" role="list" aria-label="Chat users">
              {filteredUsers.map((u) => {
                const isActive = activeUser?.id === u.id
                const count = counterRef.current.get(u.id)
                const previewText = preview.current ?? "No messages yet"
                return (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => handleUserClick(u.id, u.username)}
                      className={[
                        "w-full text-left rounded-2xl px-2 py-2 flex items-center gap-3 transition-colors",
                        isActive
                          ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                          : "hover:bg-[color:var(--muted)]",
                      ].join(" ")}
                      aria-current={isActive ? "true" : "false"}
                    >
                      <div
                        aria-hidden="false"
                        className="w-10 h-10 rounded-full text-white bg-[color:var(--muted)] flex items-center justify-center text-sm font-medium"
                        title={`${u.username} avatar`}
                      >
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{u.username}</span>
                        </div>
                        <div className={`text-xs text-[color:var(--muted-foreground)] truncate`}>
                          {u.id === rId ? previewText : ""}
                        </div>
                      </div>
                      {count && activeUser.id !== u.id ? (
                        <span
                          aria-label={`${count} unread messages`}
                          className={`min-w-6 h-6 px-1 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] text-xs font-semibold grid place-items-center`}
                        >
                          {count}
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 w-[25%] border-t border-[color:var(--border)] bg-[color:var(--background)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[color:var(--muted)] grid place-items-center text-xs">{data.user.username[0]}</div>
              <div className="flex items-center gap-50">
                <div className="text-xs">
                  <div className="font-medium">{data.user.username}</div>
                  <div className="text-[color:var(--muted-foreground)]">Signed in</div>
                </div>

                <div
                  className="flex text-white items-end cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    signOut({ callbackUrl: "https://chat-website-web-sigma.vercel.app/api/auth/signin" }) 
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-log-out"
                  >
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="h-full flex-1 bg-[url('/background2.png')] bg-cover bg-center flex flex-col">
        </main>
      </div>
    </div>
  )
}
