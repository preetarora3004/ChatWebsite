import type {
    Dashboard,
    ChatSummary,
    DisplayMessage,
} from "./chat.types";

export function getChatSummaries(
    dashboard: Dashboard,
): ChatSummary[] {
    return dashboard.chatMembers.map(({ chat }) => {
        const otherMembers = chat.chatMembers.filter(
            (member) => member.user.id !== dashboard.id,
        );

        const name =
            otherMembers.length > 0
                ? otherMembers
                    .map((member) => member.user.username)
                    .join(", ")
                : "You";

        const lastMessage = chat.messages.at(-1);

        return {
            id: chat.id,
            name,
            lastMessage: lastMessage?.content ?? "No messages yet",
        };
    });
}

export function getInitialMessages(
    dashboard: Dashboard,
): Record<string, DisplayMessage[]> {
    return Object.fromEntries(
        dashboard.chatMembers.map(({ chat }) => [
            chat.id,
            chat.messages.map((message) => ({
                id: message.id,
                senderId: message.senderId,
                chatId: message.chatId,
                content: message.content,
                timestamp: "",
                isOwn: message.senderId === dashboard.id,
                status: "sent" as const,
            })),
        ]),
    );
}
