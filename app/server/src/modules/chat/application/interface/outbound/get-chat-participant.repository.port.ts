import type { ChatParticipant } from "@workspace/server/chat/domain/entities/chatParticipant";

export interface GetChatParticipantRepositoryPort {
    getChatParticipant(chatId: string): Promise<ChatParticipant | null>;
}
