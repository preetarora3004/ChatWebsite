export type ConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected";

export type ChatUser = {
    id: string;
    username: string;
};

export type ChatMember = {
    id: string;
    user: ChatUser;
};

export type ChatMessage = {
    id: string;
    chatId: string;
    content: string;
    senderId: string;
    createdAt: number;
};

export type Chat = {
    id: string;
    chatMembers: ChatMember[];
    messages: ChatMessage[];
};

export type Dashboard = {
    id: string;
    username: string;
    chatMembers: {
        chat: Chat;
    }[];
};

export type DashboardApiResponse = {
    success: boolean;
    body: Dashboard;
};

export type ChatSummary = {
    id: string;
    name: string;
    lastMessage: string;
    members: {
        userId: string;
        username: string;
    }[];
};

export type DisplayMessage = {
    id: string;
    clientMessageId?: string;
    senderId: string;
    chatId: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
    status: "sending" | "sent";
};

export type IncomingMessage = {
    event: "message";
    payload: {
        id?: string;
        clientMessageId?: string;
        senderId: string;
        chatId: string;
        content: string;
        timestamp?: string;
    };
};

export type IncomingPresence = {
    event: "presence";
    payload: {
        chatId: string;
        activeUsers: {
            participantId: string;
        }[];
    };
};

export type PresenceState = Record<string, string[]>;

export type ChatContext = {
    userId: string;
    username: string;

    status: ConnectionStatus;

    messages: Record<string, DisplayMessage[]>;

    chats: ChatSummary[];

    presence: PresenceState;

    sendMessage: (
        chatId: string,
        content: string,
    ) => boolean;

    requestPresence: (
        chatId: string,
    ) => boolean;
};
