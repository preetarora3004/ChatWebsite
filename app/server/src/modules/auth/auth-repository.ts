import type { PrismaClient } from "@workspace/db/client";
import type {
    SessionResult,
    HashToken,
    SessionUserId,
    ExpiredAt,
} from "@workspace/contracts";
import type { RegisterInput } from "./auth-schema";

export class AuthRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async createSession(
        userId: SessionUserId,
        tokenHash: HashToken,
        expiresAt: ExpiredAt,
    ): Promise<SessionResult | undefined> {
        return this.prisma.session.create({
            data: {
                userId: userId,
                hashToken: tokenHash,
                expiredAt: expiresAt,
            },
            select: {
                userId: true,
                hashToken: true,
                isActive: true,
                expiredAt: true,
            },
        });
    }

    public async getSessionByHash(
        hashToken: HashToken,
    ): Promise<SessionResult | null> {
        return this.prisma.session.findFirst({
            where: {
                AND: [
                    {
                        hashToken: hashToken,
                        isActive: true,
                        expiredAt: {
                            gte: new Date(Date.now()),
                        },
                    },
                ],
            },
            select: {
                userId: true,
                hashToken: true,
                isActive: true,
                expiredAt: true,
            },
        });
    }

    public async getActiveSession(
        userId: SessionUserId,
    ): Promise<SessionResult[]> {
        return this.prisma.session.findMany({
            where: {
                AND: [
                    {
                        userId: userId,
                    },

                    { isActive: true },
                ],
            },
            select: {
                userId: true,
                hashToken: true,
                isActive: true,
                expiredAt: true,
            },
        });
    }

    public async registerAccount(data: RegisterInput) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: data.password,
            },
            select: {
                id: true,
            },
        });
    }

    public async login(username: string) {
        return this.prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                id: true,
                password: true
            }
        });
    }
}
