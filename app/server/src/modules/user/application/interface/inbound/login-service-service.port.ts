import type { Session } from "@workspace/server/auth/domain/entities/session";

export interface LoginServicePort {
    login(username: string, password: string): Promise<Session>
}
