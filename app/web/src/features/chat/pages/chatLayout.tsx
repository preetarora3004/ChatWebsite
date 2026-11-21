import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LogOut, MessageCircle, Plus, Search, Settings } from "lucide-react";

import ChatLoader from "../components/Loader";

import type {
    ChatContext,
    Dashboard,
    DisplayMessage,
} from "../types/chat.types";

import { fetchDashboard } from "../services/chatApi";

import { useChatSocket } from "../hooks/useChatSocket";

import { chatReducer } from "../state/chat.reducer";

import { initialChatState } from "../state/chat.initial-state";

import { getChatSummaries, getInitialMessages } from "../utils/chat.utilts";

import { isIncomingMessage, isIncomingPresence } from "../utils/socket.utils";

const WS_URL = import.meta.env.VITE_WS_URL;

export default function ChatLayout() {
    const navigate = useNavigate();

    const location = useLocation();

    const [dashboard, setDashboard] = useState<Dashboard | null>(null);

    const [chatState, dispatch] = useReducer(chatReducer, initialChatState);

    const { messages, presence } = chatState;

    const [loading, setLoading] = useState(true);

    const [dashboardError, setDashboardError] = useState<string | null>(null);

    const [search, setSearch] = useState("");

    const [username] = useState(() => sessionStorage.getItem("username") ?? "");

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                if (!active) return;

                const dashboardData = await fetchDashboard();

                //Need to review

                setDashboard(dashboardData);

                dispatch({
                    type: "INITIALIZE_MESSAGES",
                    payload: getInitialMessages(dashboardData),
                });
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

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    //need review
    useEffect(() => {
        if (!username) {
            navigate("/login", {
                replace: true,
            });
        }
    }, [username, navigate]);

    const handleSocketMessage = useCallback(
        (data: unknown) => {
            if (isIncomingPresence(data)) {
                dispatch({
                    type: "PRESENCE_UPDATED",
                    payload: {
                        chatId: data.payload.chatId,

                        activeUsers: data.payload.activeUsers.map(
                            (user) => user.participantId,
                        ),
                    },
                });

                return;
            }

            if (!isIncomingMessage(data)) {
                console.warn("Unknown WebSocket event:", data);

                return;
            }

            const payload = data.payload;

            const receivedMessage: DisplayMessage = {
                id: payload.id ?? payload.clientMessageId ?? crypto.randomUUID(),

                clientMessageId: payload.clientMessageId,

                senderId: payload.senderId,

                chatId: payload.chatId,

                content: payload.content,

                timestamp: payload.timestamp ?? new Date().toISOString(),

                isOwn: payload.senderId === dashboard?.id,

                status: "sent",
            };

            dispatch({
                type: "MESSAGE_RECEIVED",
                payload: receivedMessage,
            });
        },
        [dashboard?.id],
    );

    const { status, send, disconnect } = useChatSocket({
        url: WS_URL,

        enabled: Boolean(username && dashboard && !loading),

        onMessage: handleSocketMessage,
    });

    useEffect(() => {
        if (status === "disconnected") {
            dispatch({
                //send event also
                type: "CLEAR_PRESENCE",
            });
        }
    }, [status]);

    const sendMessage = useCallback(
        (chatId: string, content: string): boolean => {
            const trimmedContent = content.trim();

            if (!trimmedContent || !dashboard) {
                return false;
            }

            const clientMessageId = crypto.randomUUID();

            const timestamp = new Date().toISOString();

            const sent = send({
                event: "authenticate-request",

                payload: {
                    clientMessageId,
                    chatId,
                    content: trimmedContent,
                },
            });

            if (!sent) {
                return false;
            }

            const optimisticMessage: DisplayMessage = {
                id: clientMessageId,

                clientMessageId,

                senderId: dashboard.id,

                chatId,

                content: trimmedContent,

                timestamp,

                isOwn: true,

                status: "sending",
            };

            dispatch({
                type: "MESSAGE_RECEIVED",
                payload: optimisticMessage,
            });

            return true;
        },
        [dashboard, send],
    );

    const requestPresence = useCallback(
        (chatId: string): boolean => {
            return send({
                event: "presence-service",

                payload: {
                    chatId,
                },
            });
        },
        [send],
    );

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem("username");

        disconnect();

        navigate("/login", {
            replace: true,
        });
    }, [disconnect, navigate]);

    const chats = useMemo(() => {
        if (!dashboard) return [];

        return getChatSummaries(dashboard).map((chat) => {
            const chatMessages = messages[chat.id] ?? [];

            const latestMessage = chatMessages.at(-1);

            return {
                ...chat,

                lastMessage: latestMessage?.content ?? chat.lastMessage,
            };
        });
    }, [dashboard, messages]);

    const filteredChats = useMemo(
        () =>
            chats.filter((chat) =>
                chat.name.toLowerCase().includes(search.toLowerCase()),
            ),
        [chats, search],
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

        presence,

        sendMessage,

        requestPresence,
    };

    return (
        <main className="h-screen w-full overflow-hidden bg-[#090909] p-3 text-white">
            <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101010]">
                <aside className="flex w-[340px] shrink-0 flex-col border-r border-white/[0.07]">
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
