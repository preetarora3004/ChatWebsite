import { serverMap, userMap } from "../repository/repository";
import type { AuthenticatedWebSocket, WebSocketEventMap } from "../types/types";
import type { MessageServer, ServerSideEvents } from "@workspace/contracts";
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

export async function handleMessage<K extends MessageServer>(
    data: K,
    ws: AuthenticatedWebSocket,
) {
    switch (data.event) {
        case "authenticate-request":
            const serverSocket = getServerSocket();

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
    }
}
