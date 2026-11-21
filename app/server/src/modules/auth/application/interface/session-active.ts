import type { Session } from "@workspace/server/auth/domain/entities/session"

export interface ISessionActiveRepository {
    getActiveSession(userId: string): Promise<Session | null>
}
