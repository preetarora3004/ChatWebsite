import type { PrismaClient } from "@workspace/db/client";
import type { MessageCreationRepositoryPort } from "../../application/interface/outbound/message-creation.repository.port";
import { Message } from "../../domain/entities/message";

export class MessageCreationRepository implements MessageCreationRepositoryPort {
    constructor(private readonly client: PrismaClient) { }

    public async create(content: string, userId: string, chatId: string) {
        const message = await this.client.message.create({
            data: {
                chatId: chatId,
                content: content,
                senderId: userId,
            },
            select: {
                chatId: true,
                content: true,
                senderId: true,
            },
        });

        return new Message(message);
    }
}
