import type { PrismaClient } from "@workspace/db/client";
import type { GetChatParticipantRepositoryPort } from "../../application/interface/outbound/get-chat-participant.repository.port";
import { ChatParticipant } from "../../domain/entities/chatParticipant";

export class GetChatParticipantRepository implements GetChatParticipantRepositoryPort {
    constructor(private readonly client: PrismaClient) { }

    public async getChatParticipant(chatId: string) {
        const chatParticipants = await this.client.chat.findUnique({
            where: {
                id: chatId,
            },
            select: {
                chatMembers: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });

        return chatParticipants ? new ChatParticipant(chatParticipants) : null;
    }
}
