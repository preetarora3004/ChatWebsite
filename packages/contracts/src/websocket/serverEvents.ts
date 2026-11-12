import type { ParticipantCache } from "../cache/cache-contract";

export type ServerSideEvents = {
    "authenticate-request": {
        chatId: string;
        content: string;
        clientMessageId: string;
    };

    "message-service": {
        userId: string;
        chatId: string;
        content: string;
        clientMessageId: string;
    };

    "message-client": {
        userId: string;
        chatId: string;
        recieverId: { userId: string }[] | null;
        content: string;
        clientMessageId: string;
    };

    message: {
        senderId: string;
        chatId: string;
        content: string;
        clientMessageId: string;
    };

    "presence-service": {
        chatId: string;
    };

    "presence-client": {
        chatId: string;
        chatMembers: ParticipantCache;
    };

    presence: {
        chatId: string;
        activeUsers: { participantId: string }[];
    };

    "invalid-message": {
        senderId: string;
        error: string;
    };
};

export type ServerEventNames = keyof ServerSideEvents;

// export type MessageServer<K extends keyof ServerSideEvents> = {
//     event: K;
//     payload: ServerSideEvents[K];
// };
//
export type MessageServer = {
    [K in keyof ServerSideEvents]: {
        event: K;
        payload: ServerSideEvents[K];
    };
}[keyof ServerSideEvents];
