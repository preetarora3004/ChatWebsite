import type { WebSocket } from "ws";

export interface IObject {
    ws: WebSocket;
    isOnline: boolean;
}

export type WebSocketEventMap = {
    presence: {
        userId: string;
        isOnline: boolean;
    };
    message: {
        messageId: string;
        content: string;
    };
    typing: {
        userId: string;
        chatId: string;
        isTyping: boolean;
    };
};

