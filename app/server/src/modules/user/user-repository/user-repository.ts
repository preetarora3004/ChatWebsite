import type { PrismaClient } from "@workspace/db/generated/prisma/client";

export class UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async createMessage() { }

    public async getMessages() { }

    public async getChats() { }

    public async createChatParticipants() { }

    public async getChatParticipants() { }
}
