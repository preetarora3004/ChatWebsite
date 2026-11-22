import type { Message } from "@workspace/server/message/domain/entities/message";

export interface MessageCreationRepositoryPort {
    create(userId: string, chatId: string, content: string): Promise<Message>    
}
