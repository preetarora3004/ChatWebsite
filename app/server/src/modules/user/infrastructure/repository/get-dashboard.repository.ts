import type { PrismaClient } from "@workspace/db/client";
import { ApiError, ErrorCode } from "@workspace/http";

export class GetDashboardRepository {
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
                                    take: 10,
                                    orderBy: {
                                        createdAt: "desc",
                                    },
                                    select: {
                                        id: true,
                                        senderId: true,
                                        chatId: true,
                                        content: true,
                                        createdAt: true,
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

        if (!dashboard) {
            throw new ApiError(
                "Unable to fetch dashboard",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );
        }

        return dashboard;
    }
}
