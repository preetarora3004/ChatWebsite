import { Security } from "../../domain/entities/security";
import type { SessionActiveRepository } from "../../infrastructure/repository/session-active.repository";
import type { SessionCreationRepository } from "../../infrastructure/repository/session-creation.repository";

export class SessionCreation {
    constructor(
        private readonly sessionActiveRepository: SessionActiveRepository,
        private readonly sessionCreationRepository: SessionCreationRepository,
    ) { }

    async createSession(userId: string) {
        const existingSession =
            await this.sessionActiveRepository.getActiveSession(userId);

        if (existingSession && existingSession.isValid()) {
            //cache session
            return existingSession;
        }

        const token = Security.createToken();
        const hashToken = Security.createHash(token);
        const expiredAt = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const session = await this.sessionCreationRepository.createSession(
            userId,
            token,
            hashToken,
            expiredAt,
        );

        //cache session
        return session;
    }
}
