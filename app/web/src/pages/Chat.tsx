import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import type { ServerSideEvents } from "@workspace/contracts";

const WS_URL = import.meta.env.VITE_WS_URL;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;

type ConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected";

type DisplayMessage = {
    id: string;
    senderId: string | null;
    chatId: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
};

type IncomingMessage = {
    event: "message";
    payload: ServerSideEvents["message"];
};

function isIncomingMessage(data: unknown): data is IncomingMessage {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const candidate = data as Record<string, unknown>;
    const payload = candidate.payload;

    if (candidate.event !== "message" || typeof payload !== "object" || payload === null) {
        return false;
    }

    const message = payload as Record<string, unknown>;

    return (
        typeof message.senderId === "string" &&
        typeof message.chatId === "string" &&
        typeof message.content === "string"
    );
}

export default function Chat() {
    const navigate = useNavigate();

    const socketRef = useRef<WebSocket | null>(null);

    const [username] = useState(
        () => sessionStorage.getItem("username") ?? "",
    );

    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [content, setContent] = useState("");

    const [status, setStatus] =
        useState<ConnectionStatus>("connecting");

    useEffect(() => {
        if (!username) {
            navigate("/login", { replace: true });
            return;
        }

        let active = true;

        const socket = new WebSocket(WS_URL);

        socketRef.current = socket;

        socket.onopen = () => {
            if (!active) return;

            setStatus("connected");

            console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event: MessageEvent<string>) => {
            // Your current server sends this as a normal text frame.
            // See the heartbeat correction below.
            if (event.data === "ping") return;

            try {
                const incoming: unknown = JSON.parse(event.data);

                if (!isIncomingMessage(incoming)) {
                    console.warn("Unknown WebSocket message:", incoming);
                    return;
                }

                const payload = incoming.payload;

                if (payload.chatId !== CHAT_ID) return;

                const receivedMessage: DisplayMessage = {
                    id: crypto.randomUUID(),
                    senderId: payload.senderId,
                    chatId: payload.chatId,
                    content: payload.content,
                    timestamp: new Date().toISOString(),
                    isOwn: false,
                };

                setMessages((previous) => [
                    ...previous,
                    receivedMessage,
                ]);
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
            console.log("WebSocket connection closed");
        };

        return () => {
            active = false;

            socket.close(1000, "Component unmounted");

            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }, [username, navigate]);

    function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const socket = socketRef.current;
        const trimmedContent = content.trim();

        if (
            !trimmedContent ||
            socket?.readyState !== WebSocket.OPEN
        ) {
            return;
        }

        const payload = {
            chatId: CHAT_ID,
            content: trimmedContent,
        } satisfies ServerSideEvents["authenticate-request"];

        socket.send(
            JSON.stringify({
                event: "authenticate-request",
                payload,
            }),
        );

        // Optimistic local display.
        // Your current backend does not send a message acknowledgement
        // or broadcast the message back to the sender.
        setMessages((previous) => [
            ...previous,
            {
                id: crypto.randomUUID(),
                senderId: null,
                chatId: CHAT_ID,
                content: trimmedContent,
                timestamp: new Date().toISOString(),
                isOwn: true,
            },
        ]);

        setContent("");
    }

    function handleLogout() {
        sessionStorage.removeItem("username");

        socketRef.current?.close(1000, "User logged out");

        navigate("/login");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-blue-950 p-4">

            <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">

                {/* Header */}
                <header className="flex items-center justify-between border-b border-white/10 p-5">

                    <div>
                        <h1 className="text-xl font-bold text-white">
                            Chat Room
                        </h1>

                        <p className="mt-1 text-sm text-blue-200/60">
                            Logged in as {username}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    status === "connected"
                                        ? "bg-green-400"
                                        : status === "connecting"
                                          ? "bg-yellow-400"
                                          : "bg-red-400"
                                }`}
                            />

                            {status}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-300 transition hover:text-red-200"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {status !== "connected" && (
                    <div className="border-b border-white/10 px-5 py-3 text-sm text-yellow-300">
                        {status === "connecting"
                            ? "Establishing WebSocket connection..."
                            : "Disconnected from the server."}
                    </div>
                )}

                {/* Messages */}
                <section className="flex-1 space-y-4 overflow-y-auto p-6">

                    {messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-white/30">
                            No messages yet. Start chatting!
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${
                                    msg.isOwn
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                        msg.isOwn
                                            ? "bg-blue-500 text-white"
                                            : "border border-white/10 bg-white/10 text-white"
                                    }`}
                                >
                                    <p className="mb-1 text-xs opacity-60">
                                        {msg.isOwn ? "You" : msg.senderId}
                                    </p>

                                    <p className="break-words">
                                        {msg.content}
                                    </p>

                                    <p className="mt-1 text-right text-[10px] opacity-50">
                                        {new Date(
                                            msg.timestamp,
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                </section>

                <form
                    onSubmit={sendMessage}
                    className="flex gap-3 border-t border-white/10 p-5"
                >
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your message..."
                        disabled={status !== "connected"}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-400 disabled:opacity-40"
                    />

                    <button
                        type="submit"
                        disabled={
                            status !== "connected" ||
                            !content.trim()
                        }
                        className="rounded-xl bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Send
                    </button>
                </form>

            </div>
        </main>
    );
}
