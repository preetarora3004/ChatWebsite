import type { MessageServer, ServerSideEvents } from "@workspace/contracts";
import { messageService } from "../dependency/dependency";
import type WebSocket from "ws";
import { chatService } from "../chat/chat.dependency";

export async function handleMessage(message: MessageServer, ws: WebSocket) {
    switch (message.event) {
        case "message-service":
            const members = await messageService.messageOperation(
                message.payload.content,
                message.payload.userId,
                message.payload.chatId,
            );

            ws.send(
                JSON.stringify({
                    event: "message-client",
                    payload: {
                        userId: message.payload.userId,
                        content: message.payload.content,
                        chatId: message.payload.chatId,
                        clientMessageId: message.payload.clientMessageId,
                        recieverId: members,
                    } satisfies ServerSideEvents["message-client"],
                }),
            );

            return;

        case "presence-service":
            const cache = await chatService.checkCacheParticipants(
                message.payload.chatId,
            );

            ws.send(
                JSON.stringify({
                    event: "presence-client",
                    payload: {
                        chatId: message.payload.chatId,
                        chatMembers: cache,
                    },
                }),
            );

            return;
    }
}
