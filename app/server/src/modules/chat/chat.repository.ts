import type { PrismaClient } from "@workspace/db/client";

export class ChatRepository {
    private readonly client: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.client = prisma;
    }

    public async getChatParticipant(chatId: string) {
        return this.client.chat.findUnique({
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
    }
}
