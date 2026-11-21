import type { PrismaClient } from "@workspace/db/client";
import { Session } from "../../domain/entities/session";

export class SessionCreationRepository implements SessionCreationRepository {
    constructor(private readonly client: PrismaClient) { }

    async createSession(
        userId: string,
        token: string,
        hashToken: string,
        expiredAt: Date,
    ) {
        const session = await this.client.session.create({
            data: {
                userId,
                token,
                hashToken,
                expiredAt,
            },
        });

        return new Session(session);
    }
}
