import type { PrismaClient } from "@workspace/db/client";

export class UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async getDashboard(userId: string) {
        const dashboard = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                username: true,
                chatMembers: {
                    take: 20,
                    orderBy: {
                        updatedAt: "desc",
                    },
                    select: {
                        chat: {
                            select: {
                                id: true,
                                messages: {
                                    take: 1,
                                    orderBy: {
                                        createdAt: "desc",
                                    },
                                    select: {
                                        id: true,
                                        content: true,
                                    },
                                },
                                chatMembers: {
                                    select: {
                                        id: true,
                                        user: {
                                            select: {
                                                id: true,
                                                username: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    public async createMessage() { }

    public async getMessages() { }

    public async getChats() { }

    public async createChatParticipants() { }

    public async getChatParticipants() { }
}
