import { useEffect, useRef, useState } from "react";

import {
    Navigate,
    useOutletContext,
    useParams,
} from "react-router-dom";

import { Send } from "lucide-react";

import type { FormEvent } from "react";

import type { ChatContext } from "./chat.types";

export function ChatIndexRedirect() {
    const { chats } = useOutletContext<ChatContext>();

    if (chats.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                No conversations yet
            </div>
        );
    }

    return <Navigate to={chats[0].id} replace />;
}

export default function ChatConversation() {
    const { chatId } = useParams<{ chatId: string }>();

    const {
        userId,
        status,
        messages,
        chats,
        sendMessage,
    } = useOutletContext<ChatContext>();

    const [input, setInput] = useState("");

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const chat = chats.find((item) => item.id === chatId);

    const chatMessages = chatId
        ? messages[chatId] ?? []
        : [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [chatId, chatMessages.length]);

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!chatId || !input.trim()) return;

        const sent = sendMessage(chatId, input);

        if (sent) {
            setInput("");
        }
    }

    if (!chatId || !chat) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-neutral-400">
                    Conversation not found
                </p>
            </div>
        );
    }


    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}

            <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] px-7">
                <div>
                    <h2 className="text-sm font-semibold text-neutral-100">
                        {chat.name}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-600">
                        {status}
                    </p>
                </div>
            </header>


            <div className="flex-1 overflow-y-auto px-6 py-6">
                {chatMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <p className="text-sm text-neutral-400">
                                No messages yet
                            </p>

                            <p className="mt-1 text-xs text-neutral-600">
                                Send a message to start the conversation.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex max-w-4xl flex-col gap-4">
                        {chatMessages.map((message) => {
                            const isOwn =
                                message.senderId === userId;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        isOwn
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                            isOwn
                                                ? "rounded-br-md bg-white text-black"
                                                : "rounded-bl-md border border-white/[0.07] bg-[#191919] text-neutral-200"
                                        }`}
                                    >
                                        <p className="break-words text-sm leading-relaxed">
                                            {message.content}
                                        </p>

                                        <div
                                            className={`mt-1 flex items-center justify-end gap-2 text-[10px] ${
                                                isOwn
                                                    ? "text-black/50"
                                                    : "text-neutral-600"
                                            }`}
                                        >
                                            {message.timestamp && (
                                                <span>
                                                    {new Date(
                                                        message.timestamp,
                                                    ).toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </span>
                                            )}

                                            {isOwn &&
                                                message.status ===
                                                    "sending" && (
                                                    <span>
                                                        Sending...
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="shrink-0 border-t border-white/[0.07] p-5"
            >
                <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-xl border border-white/[0.08] bg-[#151515] p-2">
                    <input
                        value={input}
                        onChange={(event) =>
                            setInput(event.target.value)
                        }
                        placeholder="Write a message..."
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-600"
                    />

                    <button
                        type="submit"
                        disabled={
                            !input.trim() ||
                            status !== "connected"
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Send message"
                    >
                        <Send size={17} />
                    </button>
                </div>
            </form>
        </div>
    );
}
