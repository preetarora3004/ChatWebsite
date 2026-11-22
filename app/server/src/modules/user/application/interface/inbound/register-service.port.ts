import type { Session } from "@workspace/server/auth/domain/entities/session";

export interface RegisterAccountServicePort {
    register(username: string, email: string, password: string): Promise<Session>
}
