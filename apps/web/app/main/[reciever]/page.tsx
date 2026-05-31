"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, type MessageType } from "@repo/ui/src/lib/store";
import { shallow } from "zustand/shallow";
import { useSocket } from "@repo/ui/src/websocketContext";
import LoadingPage from "../loading";
import { env } from "@repo/utils/src/config.env";
import { useAuthGuard } from "@repo/ui/hooks/auth";

function generateUUID(): string {
   const cryptoObj = globalThis.crypto as Crypto | undefined;
   if (cryptoObj) {
      if (typeof cryptoObj.randomUUID === "function") {
         return cryptoObj.randomUUID();
      }
      if (typeof cryptoObj.getRandomValues === "function") {
         return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => {
            const byteArray = cryptoObj.getRandomValues(new Uint8Array(1));
            const rnd = (byteArray[0] ?? 0) as number;
            const num = Number(c);
            return (((rnd & 15) >> (num / 4)) ^ num).toString(16);
         });
      }
   }
   return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

function escapeRegex(str: string) {
   return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function ChatMergedUI() {
   const router = useRouter();
   const inputRef = useRef<HTMLInputElement>(null);
   const scrollRef = useRef<HTMLDivElement>(null);

   const { socket, send } = useSocket();

   const [loading, setLoading] = useState(false);
   const [query, setQuery] = useState("");
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
   );

   const { status } = useAuthGuard();
   const { data } = useSession();

   const chat = useMemo(() => {
      loadUsers();
   }, [status]);

   useEffect(() => {
      const getMessage = async () => {
         if (chatId?.id) {
            await fetchMessage(chatId.id);
         }
      };
      getMessage();
   }, [chatId?.id, socket]);

   useEffect(() => {
      const el = scrollRef.current;
      if (el) {
         el.scrollTop = el.scrollHeight;
      }
   }, [messages, chatId?.id, activeUser?.id]);

   const filteredUsers = useMemo(() => {
      if (!query) return users;
      const regex = new RegExp(escapeRegex(query), "i");
      return users.filter((u) => regex.test(u.username));
   }, [users, query]);

   useEffect(() => {
      if (!socket) return;

      const handleSocketMessage = (event: MessageEvent) => {
         try {
            const data = JSON.parse(event.data);
            if (data.event === "chat") {
               addMessage(data.payload);
               preview.current = data.payload.content;

               const senderId = data.payload.senderId;
               const prev = counterRef.current.get(senderId) || 0;
               counterRef.current.set(senderId, prev + 1);

               const sender = users.find((e) => e.id === senderId);

               if (!sender) {
                  loadUsers();
               }
            }

            if (data.event === "system") {
               setIsAlive(data.payload.isAlive);
               setRid(data.payload.userId);
            }
         } catch (err) {
            console.error("Invalid message format", err);
         }
      };
      socket.addEventListener("message", handleSocketMessage);

      if (activeUser?.id) {
         (async () => {
            try {
               await lastSeenFetch(activeUser.id);
            } catch (e) { }
         })();
      }

      return () => {
         socket.removeEventListener("message", handleSocketMessage);
      };
   }, [socket, activeUser?.id]);

   const url = env.socket_prod ?? env.socket_dev;

   const activeMessages = useMemo(() => {
      if (!chatId?.id) return [];
      return messages.filter((m) => m.chatId === chatId.id);
   }, [messages, chatId?.id]);

   if (status !== "authenticated" || !data) return null;

   if (status !== "authenticated" || !data) return null;

   if (loading) {
      return (
         <div>
            <LoadingPage />
         </div>
      );
   }

   const sendMessage = async () => {
      const msg = inputRef.current?.value?.trim();
      if (!msg) return;

      const newMsg: MessageType = {
         id: generateUUID(),
         chatId: chatId?.id ?? "",
         senderId: data.user.id,
         content: msg,
         createdAt: new Date(),
      };

      if (!socket) return;

      try {
         if (socket.readyState === WebSocket.OPEN) {
            const savedMessage = send("chat", {
               senderId: data.user.id,
               chatId: chatId?.id,
               content: msg,
            });
            addMessage(savedMessage ?? newMsg);
            if (inputRef.current) inputRef.current.value = "";
         }
      } catch (e) {
         console.error("Error sending message:", e);
      }
   };

   function formatTime(d: Date | string | number | undefined) {
      try {
         if (!d) return "";
         const date =
            typeof d === "string" || typeof d === "number" ? new Date(d) : d;
         return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
         });
      } catch {
         return "";
      }
   }

   function formatLastSeen(d: Date | string | number | undefined) {
      try {
         if (!d) return "";
         const date =
            typeof d === "string" || typeof d === "number" ? new Date(d) : d;
         return `${date.toLocaleDateString([], { day: "2-digit", month: "2-digit" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      } catch {
         return "";
      }
   }

   return (
      <div className = "flex-1">
         {activeUser.id ? (
            <main
               className={`h-full flex-1 bg-[url('/background2.png')] bg-cover bg-center flex flex-col 
            ${activeUser && chatId?.id ? "block" : "hidden md:flex"}`}
            >
               <header className="h-16 bg-[color:var(--background)] border-b border-[color:var(--border)] px-4 flex items-center">
                  <button
                     onClick={() => {
                        router.push("/main");
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
                        <div className="font-medium leading-none">
                           {activeUser?.username ?? "—"}
                        </div>
                        <div className="text-xs mt-1 flex items-center gap-2 text-[color:var(--muted-foreground)]">
                           {isAlive && rId === activeUser?.id ? (
                              <>
                                 <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                                 Online
                              </>
                           ) : (
                              <span>
                                 last seen{" "}
                                 {activeUser ? formatLastSeen(activeUser.lastSeen) : ""}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               </header>

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
                        const isOwn = m.senderId === data.user.id;
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
                                 className={`${isOwn
                                       ? "text-[var(--color-sender)]"
                                       : "text-[var(--color-reciever)]"
                                    } text-xs mt-1 flex justify-end`}
                              >
                                 {formatTime(m.createdAt)}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>

               <div className="w-full flex justify-center px-3 pb-[max(5rem,env(safe-area-inset-bottom))] mb-5">
                  <div
                     className="w-full max-w-3xl rounded-xl border mb-8 border-[color:var(--border)] bg-[color:var(--background)] shadow-sm flex items-center gap-2 px-2"
                     onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                           e.preventDefault();
                           sendMessage();
                           inputRef.current?.focus();
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
         ) : (
            <main className="hidden sm:flex h-full flex-1 bg-[url('/background2.png')] bg-cover bg-center flex-col" />
         )}
      </div>
   );
}
