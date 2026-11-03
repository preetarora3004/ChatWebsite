import type { PrismaClient } from "@workspace/db/client";
import { prisma } from "@workspace/db";

export class MessageRepository {
    constructor(private readonly client: PrismaClient = prisma) { }

    public async checkMemberShip(userId: string, chatId: string) {
        return this.client.chatMembers.findFirst({
            where: {
                AND: [
                    {
                        userId: userId,
                        chatId: chatId,
                    },
                ],
            },
        });
    }

    public async getMembers(chatId: string) {
        return this.client.chat.findUnique({
            where: {
                id: chatId
            },
            include: {
                chatMembers: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
    }

    public async messageCreation(
        content: string,
        userId: string,
        chatId: string,
    ) {
        return this.client.message.create({
            data: {
                chatId: chatId,
                content: content,
                senderId: userId,
            },
        });
    }
}
