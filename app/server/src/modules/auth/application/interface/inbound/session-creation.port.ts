import type { Session } from "@workspace/server/auth/domain/entities/session";

export interface SessionCreationPort {
    createSession(userId: string): Promise<Session>
}
