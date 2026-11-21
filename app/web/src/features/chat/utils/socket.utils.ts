import type {
    IncomingMessage,
    IncomingPresence,
} from "../types/chat.types";

export function isIncomingMessage(
    data: unknown,
): data is IncomingMessage {
    if (
        typeof data !== "object" ||
        data === null
    ) {
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
        typeof message.content === "string" &&
        (
            message.id === undefined ||
            typeof message.id === "string"
        ) &&
        (
            message.clientMessageId === undefined ||
            typeof message.clientMessageId === "string"
        ) &&
        (
            message.timestamp === undefined ||
            typeof message.timestamp === "string"
        )
    );
}

export function isIncomingPresence(
    data: unknown,
): data is IncomingPresence {
    if (
        typeof data !== "object" ||
        data === null
    ) {
        return false;
    }

    const candidate = data as Record<string, unknown>;

    const payload = candidate.payload;

    if (
        candidate.event !== "presence" ||
        typeof payload !== "object" ||
        payload === null
    ) {
        return false;
    }

    const presence = payload as Record<string, unknown>;

    return (
        typeof presence.chatId === "string" &&
        Array.isArray(presence.activeUsers) &&
        presence.activeUsers.every(
            (user) =>
                typeof user === "object" &&
                user !== null &&
                typeof (
                    user as Record<string, unknown>
                ).participantId === "string",
        )
    );
}
