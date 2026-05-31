"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, type MessageType } from "@repo/ui/src/lib/store";
import { shallow } from "zustand/shallow";
import { useSocket } from "@repo/ui/websocketContext";
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

export function Chat({ list }: { list: any }) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [load, setLoad] = useState(false);

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
        chats,
        loadChats,
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
            chats: s.chats,
            loadChats: s.setChats,
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

    //   useEffect(() => {
    //      const getMessage = async () => {
    //         if (chatId?.id) {
    //            await fetchMessage(chatId.id);
    //         }
    //      };
    //      getMessage();
    //   }, [chatId?.id, socket]);

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

    const handleUserClick = async (
        userId: string,
        chatId: string,
        username: string,
    ) => {
        counterRef.current.set(userId, 0);
        setLoading(true);

        try {
            const data = await fetchMessage(chatId);
            if (!data || data.length !== 0) {
                setActiveUser(userId, username);
                setChatId(chatId);
                setLoading(false);
                return router.push(`/main/${username}`);
            }

            //         const newChat = await chatCreation();
            //         if (!newChat?.id) return router.push("/404");
            //
            //         await participantCreation(newChat.id, username);
            //         await participantCreation(newChat.id, data.user.username);
            //
            //         setActiveUser(userId, username);
            //         setChatId(newChat.id);
            //         setLoading(false);
            //         return router.push(`/user/${username}`);
        } catch (err) {
            console.error("Chat creation failed:", err);
        }

        lastSeenFetch(userId);
    };

    //   if (loading) {
    //      return (
    //         <div>
    //            <LoadingPage />
    //         </div>
    //      );
    //   }
    //
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
        <aside
            className={`h-full md:w-1/4 w-full py-2 border-r border-[color:var(--border)] bg-[color:var(--background)] 
            ${activeUser && chatId?.id ? "hidden md:block" : "block"}`}
            aria-label="Conversations sidebar"
        >
            <div className="flex justify-between items-center px-5 py-4">
                <h2 className="text-sm font-medium text-[color:var(--muted-foreground)]">
                    Chats
                </h2>
                <div className="text-xs text-[color:var(--muted-foreground)]">
                    {list.length} chats
                </div>
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
                    {list.map((u: any) => {
                        //                       const isActive = activeUser?.id === u.id;
                        //                     const count = counterRef.current.get(u.id);
                        //                     const previewText = preview.current ?? "No messages yet";
                        return u.participants.map((p: any) => (
                            <li key={u.id}>
                                <button
                                    type="button"
                                    onClick={async () =>
                                        await handleUserClick(p.user.id, p.chatId, p.user.username)
                                    }
                                    className={[
                                        "group relative group overflow-hidden active:scale-[0.985] w-full text-left rounded-2xl px-2 py-2 flex items-center gap-3 transition-colors",
                                        isAlive
                                            ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                                            : "hover:bg-[color:var(--muted)]",
                                    ].join(" ")}
                                >
                                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0 w-0 rounded-full bg-white/20 opacity-0 blur-[80px] transition-all duration-500 ease-out group-active:h-500px group-active:w-500px group-active:opacity-100" />
                                    </span>

                                    <div className="relative z-10 w-10 h-10 rounded-full text-white bg-[color:var(--muted)] flex items-center justify-center text-sm font-medium">
                                        {p.user.username.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="relative z-10 min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-medium">
                                                {p.user.username.charAt(0).toUpperCase() +
                                                    p.user.username.slice(1)}
                                            </span>
                                        </div>

                                        <div className="text-xs text-[color:var(--muted-foreground)] truncate">
                                            {u.message.length !== 0
                                                ? u.message.map((m: any) => m.content)
                                                : ""}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ));
                    })}
                </ul>
            </div>

            <div className="absolute bottom-0 left-0 right-0 w-full md:w-[25%] border-t border-[color:var(--border)] bg-[color:var(--background)] p-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[color:var(--muted)] grid place-items-center text-xs">
                            {data!.user.username[0]}
                        </div>
                        <div className="text-xs">
                            <div className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                                {data!.user.username}
                            </div>
                            <div className="text-[color:var(--muted-foreground)]">
                                Signed in
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
                        className="flex text-white items-center justify-center hover:text-blue-500 transition-colors"
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
                        >
                            <path d="m16 17 5-5-5-5" />
                            <path d="M21 12H9" />
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
