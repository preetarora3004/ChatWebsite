import type { PrismaClient } from "@workspace/db/client";
import type { ISessionActiveRepository } from "../../application/interface/outbound/session-active";
import { Session } from "../../domain/entities/session";

export class SessionActiveRepository implements ISessionActiveRepository {
    constructor(private readonly client: PrismaClient) { }

    async getActiveSession(userId: string): Promise<Session | null> {
        const session = await this.client.session.findFirst({
            where: {
                AND: [{ userId }, { isActive: true }],
            },
        });

        return !session ? null : new Session(session);
    }
}
