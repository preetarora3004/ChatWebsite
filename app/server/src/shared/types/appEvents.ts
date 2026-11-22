export interface AppEvent {
    CHECK_CHAT_MEMBERSHIP: {
        senderId: string;
        chatId: string;
    };

    MEMBERSHIP_NOT_FOUND: {
        error: "Not a member of this chat";
    };

    MESSAEGE_CREATION: {
        content: string;
        userId: string;
        chatId: string;
    };

    FETCH_CHAT_MEMBERS: {
        chatId: string;
    };
}

