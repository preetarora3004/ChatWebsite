import type { PrismaClient } from "@workspace/db/client";
import type { ISessionVerifyRepository } from "../../application/interface/session-verify.repository";
import { Session } from "../../domain/entities/session";
import { ApiError, ErrorCode } from "@workspace/http";

export class SessionVerifyRepository implements ISessionVerifyRepository {
    constructor(private readonly client: PrismaClient) { }

    async verify(hash: string): Promise<Session> {
        const session = await this.client.session.findUnique({
            where: {
                hashToken: hash,
            },
            select: {
                token: true,
                hashToken: true,
                userId: true,
                expiredAt: true,
                isActive: true,
            },
        });

        if (!session)
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );

        return new Session(session);
    }
}
