import type { Session } from "@workspace/server/auth/domain/entities/session"

export interface SessionCreation {
    create(userId: string, token: string, hashToken: string): Promise<Session>;
}
