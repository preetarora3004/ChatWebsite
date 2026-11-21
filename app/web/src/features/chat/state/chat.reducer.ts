import type { DisplayMessage, PresenceState } from "../types/chat.types";

export type ChatState = {
    messages: Record<string, DisplayMessage[]>;

    presence: PresenceState;
};

export type ChatAction =
    | {
        type: "INITIALIZE_MESSAGES";

        payload: Record<string, DisplayMessage[]>;
    }
    | {
        type: "MESSAGE_RECEIVED";

        payload: DisplayMessage;
    }
    | {
        type: "PRESENCE_UPDATED";

        payload: {
            chatId: string;
            activeUsers: string[];
        };
    }
    | {
        type: "CLEAR_PRESENCE";
    };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
        case "INITIALIZE_MESSAGES": {
            return {
                ...state,
                messages: action.payload,
            };
        }

        case "MESSAGE_RECEIVED": {
            const message = action.payload;

            const existingMessages = state.messages[message.chatId] ?? [];

            const existingIndex = existingMessages.findIndex(
                (item) =>
                    item.id === message.id ||
                    (Boolean(message.clientMessageId) &&
                        item.clientMessageId === message.clientMessageId),
            );

            const updatedMessages = [...existingMessages];

            if (existingIndex !== -1) {
                updatedMessages[existingIndex] = {
                    ...updatedMessages[existingIndex],
                    ...message,
                    status: "sent",
                };
            } else {
                updatedMessages.push(message);
            }

            updatedMessages.sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            );

            return {
                ...state,
                messages: {
                    ...state.messages,
                    [message.chatId]: updatedMessages,
                },
            };
        }

        case "PRESENCE_UPDATED": {
            return {
                ...state,
                presence: {
                    ...state.presence,
                    [action.payload.chatId]: action.payload.activeUsers,
                },
            };
        }

        case "CLEAR_PRESENCE": {
            return {
                ...state,
                presence: {},
            };
        }

        default:
            return state;
    }
}
