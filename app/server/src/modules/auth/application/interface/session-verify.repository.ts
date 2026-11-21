import type { Session } from "@workspace/server/auth/domain/entities/session"

export interface ISessionVerifyRepository {
    verify(hash: string): Promise<Session>
}
