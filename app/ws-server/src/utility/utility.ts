import { serverMap, userMap } from "../repository/repository";
import type { AuthenticatedWebSocket, WebSocketEventMap } from "../types/types";
import type {
    MessageServer,
    ParticipantCache,
    ServerSideEvents,
} from "@workspace/contracts";
export function returnParams<const K extends readonly string[]>(
    url: string,
    base: string,
    ...args: K
): { [I in keyof K]: string | null } {
    const params = new URL(url, base).searchParams;

    return args.map((key) => params.get(key)) as {
        [I in keyof K]: string | null;
    };
}

export function notify<K extends keyof WebSocketEventMap>(
    event: K,
    payload: WebSocketEventMap[K],
) {
    const message = JSON.stringify(payload);

    switch (event) {
        case "presence":
            userMap.forEach((value) => {
                value.ws.send(message);
            });
            break;

        case "typing":
    }
}

export function getCookie(cookieHeader: string | undefined, name: string) {
    if (!cookieHeader) return undefined;

    const cookies = cookieHeader.split(";");

    const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`));

    return cookie?.trim().slice(name.length + 1);
}

export function getServerSocket() {
    for (const [key, value] of serverMap) {
        if (value.isOnline) {
            return value.ws;
        }
    }
}

export function sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    members: { userId: string }[],
) {
    members.forEach((idx) => {
        if (idx.userId !== senderId) {
            let connection = userMap.get(idx.userId);

            if (connection && connection.isOnline) {
                connection.ws.send(
                    JSON.stringify({
                        event: "message",
                        payload: {
                            chatId: chatId,
                            senderId: senderId,
                            content: content,
                        } satisfies ServerSideEvents["message"],
                    }),
                );
            }
        }
    });

    return;
}

export function notifyPresence(chatId: string, participants: ParticipantCache) {
    // Otpmised for 1 on 1 conversation
    // Can I do when 1 participant fetches the isOnline, whoever is online gets updated with it
    // Check for stale

    let activeUsers: Array<{ participantId: string }> = new Array();

    participants.participants.forEach((idx) => {
        let user = userMap.get(idx.userId);

        if (user && user.isOnline) {
            activeUsers.push({ participantId: idx.userId });
        }
    });

    participants.participants.forEach((idx) => {
        let user = userMap.get(idx.userId);

        if (user && user.isOnline) {
            user.ws.send(
                JSON.stringify({
                    event: "presence",
                    payload: {
                        chatId: chatId,
                        activeUsers: activeUsers,
                    } as ServerSideEvents["presence"],
                }),
            );
        }
    });

    return true;
}

export async function handleMessage<K extends MessageServer>(
    data: K,
    ws: AuthenticatedWebSocket,
) {
    switch (data.event) {
        case "authenticate-request":
            let serverSocket = getServerSocket();

            if (!serverSocket) {
                return false;
            }

            serverSocket.send(
                JSON.stringify({
                    event: "message-service",
                    payload: {
                        userId: ws.id,
                        content: data.payload.content,
                        chatId: data.payload.chatId,
                    } satisfies ServerSideEvents["message-service"],
                }),
            );
            return true;

        case "message-client":
            if (!data.payload.recieverId) {
                return;
            }
            sendMessage(
                data.payload.chatId,
                data.payload.userId,
                data.payload.content,
                data.payload.recieverId,
            );
            return;

        case "presence-service":
            if (!data.payload.chatId) {
                return;
            }

            serverSocket = getServerSocket();

            if (!serverSocket) {
                return false;
            }

            serverSocket.send(
                JSON.stringify({
                    event: "message-service",
                    payload: {
                        chatId: data.payload.chatId,
                    },
                }),
            );

            return true;

        case "presence-client":
            if (!data.payload.chatId || !data.payload.chatMembers) {
                return;
            }

            return notifyPresence(data.payload.chatId, data.payload.chatMembers);
    }
}
