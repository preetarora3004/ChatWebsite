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

export type DisplayMessage = {
    id: string;
    clientMessageId?: string;
    senderId: string;
    chatId: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
    status?: "sending" | "sent";
};

export type ChatSummary = {
    id: string;
    name: string;
    lastMessage: string;
};

export type IncomingMessage = {
    event: "message";
    payload: {
        id: string;
        clientMessageId?: string;
        senderId: string;
        chatId: string;
        content: string;
        timestamp?: string;
    };
};

export type ChatContext = {
    userId: string;
    username: string;
    status: ConnectionStatus;
    messages: Record<string, DisplayMessage[]>;
    chats: ChatSummary[];
    sendMessage: (chatId: string, content: string) => boolean;
};
