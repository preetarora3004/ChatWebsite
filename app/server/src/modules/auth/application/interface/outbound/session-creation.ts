import type { Session } from "@workspace/server/auth/domain/entities/session"

export interface ISessionCreation {
    createSession(userId: string, token: string, hashToken: string, expiredAt: Date): Promise<Session>;
}
