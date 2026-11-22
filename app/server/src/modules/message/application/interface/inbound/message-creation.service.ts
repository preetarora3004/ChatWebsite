import type { Message } from "@workspace/server/message/domain/entities/message";

export interface IMessageCreationService {
    createMessage(userId: string, chatId: string, content: string): Promise<Message>
}
