import { useEffect, useRef, useState } from "react";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LogOut, MessageCircle, Plus, Search, Settings } from "lucide-react";

import type {
    ChatContext,
    ChatSummary,
    ConnectionStatus,
    Dashboard,
    DashboardApiResponse,
    DisplayMessage,
    IncomingMessage,
} from "./chat.types";

import { getChatSummaries, getInitialMessages } from "./chat.utils";

import ChatLoader from "../Loader";

const WS_URL = import.meta.env.VITE_WS_URL;

function isIncomingMessage(data: unknown): data is IncomingMessage {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const candidate = data as Record<string, unknown>;
    const payload = candidate.payload;

    if (
        candidate.event !== "message" ||
        typeof payload !== "object" ||
        payload === null
    ) {
        return false;
    }

    const message = payload as Record<string, unknown>;

    return (
        typeof message.senderId === "string" &&
        typeof message.chatId === "string" &&
        typeof message.content === "string"
    );
}

export default function ChatLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const socketRef = useRef<WebSocket | null>(null);

    const [dashboard, setDashboard] = useState<Dashboard | null>(null);

    const [messages, setMessages] = useState<Record<string, DisplayMessage[]>>(
        {},
    );

    const [status, setStatus] = useState<ConnectionStatus>("connecting");

    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    const [search, setSearch] = useState("");

    const [username] = useState(() => sessionStorage.getItem("username") ?? "");

    useEffect(() => {
        let active = true;

        async function fetchDashboard() {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/user/dashboard",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard");
                }

                const data: DashboardApiResponse = await response.json();

                if (!data.success) {
                    throw new Error("Dashboard request was unsuccessful");
                }

                if (!active) return;

                const dashboardData = data.body;

                setDashboard(dashboardData);

                setMessages(getInitialMessages(dashboardData));
            } catch (error) {
                if (!active) return;

                console.error("Dashboard fetch failed:", error);
                setDashboardError("Unable to load your conversations.");
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchDashboard();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!username) {
            navigate("/login", { replace: true });
            return;
        }

        if (loading || !dashboard) return;

        let active = true;

        const socket = new WebSocket(WS_URL);

        socketRef.current = socket;

        socket.onopen = () => {
            if (!active) return;

            setStatus("connected");

            console.log("WebSocket connected");
        };

        socket.onmessage = (event: MessageEvent<string>) => {
            if (event.data === "ping") return;

            try {
                const incoming: unknown = JSON.parse(event.data);

                if (!isIncomingMessage(incoming)) {
                    console.warn("Unknown WebSocket message:", incoming);
                    return;
                }

                const payload = incoming.payload;

                const receivedMessage: DisplayMessage = {
                    id: payload.id ?? crypto.randomUUID(),
                    senderId: payload.senderId,
                    chatId: payload.chatId,
                    content: payload.content,
                    timestamp: payload.timestamp ?? new Date().toISOString(),
                    isOwn: payload.senderId === dashboard.id,
                };

                setMessages((previous) => {
                    const existingMessages = previous[payload.chatId] ?? [];

                    const alreadyExists = existingMessages.some(
                        (message) => message.id === receivedMessage.id,
                    );

                    if (alreadyExists) {
                        return previous;
                    }

                    return {
                        ...previous,
                        [payload.chatId]: [...existingMessages, receivedMessage],
                    };
                });
            } catch (error) {
                console.error("Failed to process WebSocket message:", error);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            if (!active) return;

            setStatus("disconnected");
        };

        return () => {
            active = false;

            socket.close(1000, "Chat layout unmounted");

            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }, [username, navigate, loading, dashboard]);

    function sendMessage(chatId: string, content: string): boolean {
        const socket = socketRef.current;
        const trimmedContent = content.trim();

        if (
            !trimmedContent ||
            socket?.readyState !== WebSocket.OPEN ||
            !dashboard
        ) {
            return false;
        }

        const clientMessageId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        const payload = {
            clientMessageId,
            chatId,
            content: trimmedContent,
        };

        try {
            socket.send(
                JSON.stringify({
                    event: "authenticate-request",
                    payload,
                }),
            );

            const optimisticMessage: DisplayMessage = {
                id: clientMessageId,
                senderId: dashboard.id,
                chatId,
                content: trimmedContent,
                timestamp,
                isOwn: true,
            };

            setMessages((previous) => ({
                ...previous,
                [chatId]: [...(previous[chatId] ?? []), optimisticMessage],
            }));

            return true;
        } catch (error) {
            console.error("Message sending failed:", error);
            return false;
        }
    }

    function handleLogout() {
        sessionStorage.removeItem("username");

        socketRef.current?.close(1000, "User logged out");

        navigate("/login", { replace: true });
    }

    const chats: ChatSummary[] = dashboard
        ? getChatSummaries(dashboard).map((chat) => {
            const chatMessages = messages[chat.id] ?? [];

            const latestMessage = chatMessages.at(-1);

            return {
                ...chat,
                lastMessage: latestMessage?.content ?? chat.lastMessage,
            };
        })
        : [];

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (loading) {
        return <ChatLoader />;
    }

    if (dashboardError || !dashboard) {
        return (
            <main className="flex h-screen items-center justify-center bg-[#090909] text-neutral-300">
                <div className="text-center">
                    <p className="text-sm">
                        {dashboardError ?? "Dashboard not available."}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    const context: ChatContext = {
        userId: dashboard.id,
        username: dashboard.username,
        status,
        messages,
        chats,
        sendMessage,
    };

    return (
        <main className="h-screen w-full overflow-hidden bg-[#090909] p-3 text-white">
            <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101010]">
                {/* LEFT SIDEBAR */}

                <aside className="flex w-[340px] shrink-0 flex-col border-r border-white/[0.07]">
                    {/* Header */}

                    <div className="flex items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                                <MessageCircle size={19} />
                            </div>

                            <span className="text-lg font-semibold tracking-tight">
                                Chatly
                            </span>
                        </div>

                        <button
                            aria-label="New chat"
                            className="rounded-lg p-2 text-neutral-500 transition hover:bg-white/[0.06] hover:text-white"
                        >
                            <Plus size={19} />
                        </button>
                    </div>

                    <div className="px-5 pb-5">
                        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
                            <Search size={17} className="text-neutral-500" />

                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search conversations..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3">
                        <p className="px-3 pb-3 text-[11px] font-medium uppercase tracking-[1.5px] text-neutral-600">
                            Messages
                        </p>

                        <div className="space-y-1">
                            {filteredChats.map((chat) => {
                                const active = location.pathname === `/chat/${chat.id}`;

                                return (
                                    <Link
                                        key={chat.id}
                                        to={`/chat/${chat.id}`}
                                        className={`group flex items-center gap-3 rounded-xl p-3 transition-colors ${active ? "bg-white/[0.08]" : "hover:bg-white/[0.035]"
                                            }`}
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#242424] text-sm font-medium text-neutral-300">
                                            {chat.name.slice(0, 2).toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-sm font-medium ${active ? "text-white" : "text-neutral-300"
                                                    }`}
                                            >
                                                {chat.name}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-neutral-500">
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}

                            {filteredChats.length === 0 && (
                                <p className="px-3 py-6 text-center text-xs text-neutral-600">
                                    No conversations found
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/[0.07] p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252525] text-xs font-semibold">
                                    {dashboard.username.slice(0, 2).toUpperCase()}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-neutral-200">
                                        {dashboard.username}
                                    </p>

                                    <p className="text-xs text-neutral-600">{status}</p>
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <button
                                    aria-label="Settings"
                                    className="rounded-lg p-2 text-neutral-500 hover:bg-white/[0.06] hover:text-white"
                                >
                                    <Settings size={17} />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    aria-label="Logout"
                                    className="rounded-lg p-2 text-neutral-500 hover:bg-white/[0.06] hover:text-red-400"
                                >
                                    <LogOut size={17} />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 flex-1 bg-[#0c0c0c]">
                    <Outlet context={context} />
                </section>
            </div>
        </main>
    );
}
