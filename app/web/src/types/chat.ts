export type ClientToServerEvents = {
    "authenticate-request": {
        chatId: string;
    };

    message: {
        chatId: string;
        content: string;
    };
};

export type ServerToClientEvents = {
    "authentication-success": {
        chatId: string;
    };

    "authentication-failed": {
        reason: string;
    };

    message: {
        senderId: string;
        chatId: string;
        content: string;
    };
};

export type ChatMessage = {
    id: string;
    senderId: string;
    chatId: string;
    content: string;
    timestamp: string;
};

export type ConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected";

export type SocketEvent<T extends object> = {
    event: string;
    payload: T;
};
