import type { UserDTO } from "@workspace/server/user/domain/entities/user";

export interface GetChatParticipantServicePort {
    getChatParticipants(
        chatId: string,
    ): Promise<{ participants: UserDTO[] | null }>;
}
