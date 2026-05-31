import { client } from "@repo/db";

export async function chats(currentUserId: string) {
    try {
        const chat = await client.chat.findMany({
            where: {
                participants: {
                    some: { userId: currentUserId },
                },
            },

            include: {
                message: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },

                participants: {
                    where: {
                        NOT: {
                            userId: currentUserId,
                        },
                    },
                    include: {
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

        return chat;
    } catch (err) {
        return [];
    }
}
