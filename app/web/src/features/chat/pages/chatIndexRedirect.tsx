import {
    Navigate,
    useOutletContext,
} from "react-router-dom";

import type {
    ChatContext,
} from "../types/chat.types";

export default function ChatIndexRedirect() {
    const { chats } = useOutletContext<ChatContext>();

    if (chats.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                No conversations yet
            </div>
        );
    }

    return (
        <Navigate
            to={chats[0].id}
            replace
        />
    );
}
