import type { PrismaClient } from "@workspace/db/client";
import type {
    SessionResult,
    HashToken,
    SessionUserId,
    ExpiredAt,
    CreateSessionResult,
} from "@workspace/contracts";
import type { RegisterInput } from "./auth-schema";

export class AuthRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async createSession(
        token: string,
        userId: SessionUserId,
        tokenHash: HashToken,
        expiresAt: ExpiredAt,
    ): Promise<CreateSessionResult | undefined> {
        return this.prisma.session.create({
            data: {
                token: token,
                userId: userId,
                hashToken: tokenHash,
                expiredAt: expiresAt,
            },
            select: {
                token: true,
                userId: true,
                hashToken: true,
                isActive: true,
                expiredAt: true,
            },
        });
    }

    public async getSessionByHash(
        hashToken: HashToken,
    ): Promise<CreateSessionResult | null> {
        return this.prisma.session.findFirst({
            where: {
                hashToken: hashToken,
                isActive: true,
                expiredAt: {
                    gte: new Date(),
                },
            },
            select: {
                token: true,
                userId: true,
                hashToken: true,
                isActive: true,
                expiredAt: true,
            },
        });
    }

    public async getActiveSession(
        userId: SessionUserId,
    ): Promise<CreateSessionResult | null> {
        return this.prisma.session.findFirst({
            where: {
                AND: [
                    {
                        userId: userId,
                    },

                    { isActive: true },
                ],
            },
            select: {
                token: true,
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
                username: username,
            },
            select: {
                id: true,
                password: true,
            },
        });
    }
}
