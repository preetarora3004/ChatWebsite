"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser, type MessageType } from "@repo/utils"
import { shallow } from "zustand/shallow"
import { useSocket } from "@repo/ui/websocketContext"
import LoadingPage from "./loading"

function generateUUID(): string {
  const cryptoObj = globalThis.crypto as Crypto | undefined
  if (cryptoObj) {
    const maybeRandomUUID = (cryptoObj as unknown as { randomUUID?: () => string }).randomUUID
    if (typeof maybeRandomUUID === "function") {
      return maybeRandomUUID()
    }
    if (typeof cryptoObj.getRandomValues === "function") {

      return ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, (c) => {
        const byteArray = cryptoObj.getRandomValues(new Uint8Array(1))
        const rnd = (byteArray[0] ?? 0) as number
        const num = Number(c)
        return (((rnd & 15) >> (num / 4)) ^ num).toString(16)
      })
    }
  }
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`
}

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

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("")
  const [isAlive, setIsAlive] = useState(false);
  const [rId, setRid] = useState("");
  const counterRef = useRef<Map<string, number>>(new Map());
  const preview = useRef<string>("");

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
    chatId,
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

  useEffect(() => {
    const getMessage = async () => {
      if (chatId?.id) {
        await fetchMessage(chatId.id)
      }
    }
    getMessage()
  }, [chatId?.id, socket])

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, chatId?.id, activeUser?.id])

  const filteredUsers = useMemo(() => {
    if (!query) return users
    const regex = new RegExp(escapeRegex(query), "i")
    return users.filter((u) => regex.test(u.username))
  }, [users, query,])

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

          const sender = users.find((e) => e.id === senderId)

          if (!sender) {
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
      })()
    }

    return () => {
      socket.removeEventListener("message", handleSocketMessage)
    }
  }, [socket, activeUser?.id])

  const activeMessages = useMemo(() => {
    if (!chatId?.id) return []
    return messages.filter((m) => m.chatId === chatId.id)
  }, [messages, chatId?.id])

  if (status !== "authenticated" || !data) return null

  if (status !== "authenticated" || !data) return null

  const handleUserClick = async (userId: string, username: string) => {

    counterRef.current.set(userId, 0);
    setLoading(true);

    try {
      const participants = await searchUser(userId)
      const existing = participants?.find((detail) => detail.chatId)

      if (existing) {
        setActiveUser(userId, username)
        setChatId(existing.chatId)
        setLoading(false);
        return router.push(`/user/${username}`)
      }

      const newChat = await chatCreation()
      if (!newChat?.id) return router.push("/404")

      await participantCreation(newChat.id, username)
      await participantCreation(newChat.id, data.user.username)

      setActiveUser(userId, username)
      setChatId(newChat.id)
      setLoading(false)
      return router.push(`/user/${username}`)
    } catch (err) {
      console.error("Chat creation failed:", err)
    }

    lastSeenFetch(userId)
  }

  if (loading) {
    return <div>
      <LoadingPage />
    </div>
  }

  const sendMessage = async () => {
    const msg = inputRef.current?.value?.trim()
    if (!msg) return

    const newMsg: MessageType = {
      id: generateUUID(),
      chatId: chatId?.id ?? "",
      senderId: data.user.id,
      content: msg,
      createdAt: new Date(),
    }

    if (!socket) return

    try {
      if (socket.readyState === WebSocket.OPEN) {
        const savedMessage = send("chat", {
          senderId: data.user.id,
          chatId: chatId?.id,
          content: msg,
        })
        addMessage(savedMessage ?? newMsg)
        if (inputRef.current) inputRef.current.value = ""
      }
    } catch (e) {
      console.error("Error sending message:", e)
    }
  }

  function formatTime(d: Date | string | number | undefined) {
    try {
      if (!d) return ""
      const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      return ""
    }
  }

  function formatLastSeen(d: Date | string | number | undefined) {
    try {
      if (!d) return ""
      const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d
      return `${date.toLocaleDateString([], { day: "2-digit", month: "2-digit" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } catch {
      return ""
    }
  }

  return (
    <div className="w-screen h-screen fixed inset-0 flex justify-center items-center bg-background text-foreground">
      <div className="w-screen h-screen overflow-hidden flex flex-col md:flex-row">
  
        {/* Sidebar */}
        <aside
          className={`h-full md:w-1/4 w-full py-2 border-r border-[color:var(--border)] bg-[color:var(--background)] 
            ${activeUser && chatId?.id ? "hidden md:block" : "block"}`}
          aria-label="Conversations sidebar"
        >
          <div className="flex justify-between items-center px-5 py-4">
            <h2 className="text-sm font-medium text-[color:var(--muted-foreground)]">Chats</h2>
            <div className="text-xs text-[color:var(--muted-foreground)]">{users.length} chats</div>
          </div>
  
          <div className="px-4 pb-3">
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
                    >
                      <div className="w-10 h-10 rounded-full text-white bg-[color:var(--muted)] flex items-center justify-center text-sm font-medium">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{u.username}</span>
                        </div>
                        <div className="text-xs text-[color:var(--muted-foreground)] truncate">
                          {u.id === rId && u.id !== activeUser.id ? previewText : ""}
                        </div>
                      </div>
                      {count && activeUser.id !== u.id ? (
                        <span className="min-w-6 h-6 px-1 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] text-xs font-semibold grid place-items-center">
                          {count}
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
  
          <div className="absolute bottom-0 left-0 right-0 w-full md:w-[25%] border-t border-[color:var(--border)] bg-[color:var(--background)] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[color:var(--muted)] grid place-items-center text-xs">
                  {data.user.username[0]}
                </div>
                <div className="text-xs">
                  <div className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                    {data.user.username}
                  </div>
                  <div className="text-[color:var(--muted-foreground)]">Signed in</div>
                </div>
              </div>
  
              <button
                onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
                className="flex text-white items-center justify-center hover:text-blue-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
  
        {/* Chat Section */}
        <main
          className={`h-full flex-1 bg-[url('/background2.png')] bg-cover bg-center flex flex-col 
            ${activeUser && chatId?.id ? "block" : "hidden md:flex"}`}
        >
          {/* Mobile Back Button */}
          <header className="h-16 bg-[color:var(--background)] border-b border-[color:var(--border)] px-4 flex items-center">
            <button
              onClick={() => {
                setActiveUser("", "")
                setChatId("")
              }}
              className="mr-3 text-[color:var(--muted-foreground)] hover:text-[color:var(--accent)] md:hidden"
            >
              ←
            </button>
  
            <div className="inline-flex items-center px-2 py-1 mt-1 mb-1 h-12 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)]">
              <div
                className="w-9 h-9 rounded-md bg-[color:var(--muted)] grid place-items-center font-medium"
                aria-hidden="true"
                title={`${activeUser?.username ?? ""} avatar`}
              >
                {(activeUser?.username ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="ml-2 text-white/90">
                <div className="font-medium leading-none">{activeUser?.username ?? "—"}</div>
                <div className="text-xs mt-1 flex items-center gap-2 text-[color:var(--muted-foreground)]">
                  {isAlive && rId === activeUser?.id ? (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                      Online
                    </>
                  ) : (
                    <span>last seen {activeUser ? formatLastSeen(activeUser.lastSeen) : ""}</span>
                  )}
                </div>
              </div>
            </div>
          </header>
  
          {/* Messages */}
          <div
            className="flex-1 flex px-3 py-2 pt-10 h-[80vh]"
            style={
              {
                ["--color-iconColor"]: "#B7B1E3",
                ["--color-back"]: "#212121",
                ["--color-sender"]: "rgba(33,33,33,0.75)",
                ["--color-reciever"]: "rgba(183,177,227,0.8)",
              } as React.CSSProperties
            }
          >
            <div
              ref={scrollRef}
              className="w-full max-w-3xl mx-auto h-[100%] overflow-y-auto no-scrollbar p-3 flex flex-col-reverse gap-2"
            >
              {activeMessages.map((m) => {
                const isOwn = m.senderId === data.user.id
                return (
                  <div
                    key={m.id}
                    className={`max-w-[60%] break-words px-3 py-2 rounded-xl text-sm ${isOwn
                      ? "self-end bg-[var(--color-iconColor)] text-[#212121]"
                      : "self-start bg-[var(--color-back)] text-[#B7B1E3]"
                      }`}
                  >
                    <div>{m.content}</div>
                    <div
                      className={`${isOwn ? "text-[var(--color-sender)]" : "text-[var(--color-reciever)]"
                        } text-xs mt-1 flex justify-end`}
                    >
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
  
          {/* Input */}
          <div className="w-full flex justify-center px-3 pb-[max(5rem,env(safe-area-inset-bottom))] mb-5">
            <div
              className="w-full max-w-3xl rounded-xl border mb-8 border-[color:var(--border)] bg-[color:var(--background)] shadow-sm flex items-center gap-2 px-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                  inputRef.current?.focus()
                }
              }}
            >
              <input
                id="message-input"
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                className="flex-1 h-12 px-3 bg-transparent focus-visible:outline-none text-foreground placeholder:text-[color:var(--muted-foreground)]"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="p-2 transition-colors text-[color:var(--foreground)] hover:text-[color:var(--accent)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                  <path d="M6 12h16" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
  }
