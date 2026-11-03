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

export interface AuthenticatedWebSocket extends WebSocket {
    id: string;
}

export interface ServerAuthenticatedWebSocket extends WebSocket {
    serverId: string;
}

export interface IdentitySocket extends WebSocket {
    userId?: string;
    serverId?: string;
}
