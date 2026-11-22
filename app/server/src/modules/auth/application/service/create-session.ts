import { Security } from "../../domain/entities/security";
import type { SessionCreationPort } from "../interface/inbound/session-creation.port";
import type { ISessionActiveRepository } from "../interface/outbound/session-active";
import type { ISessionCreation } from "../interface/outbound/session-creation";

export class SessionCreation implements SessionCreationPort {
    constructor(
        private readonly sessionActiveRepository: ISessionActiveRepository,
        private readonly sessionCreationRepository: ISessionCreation,
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
