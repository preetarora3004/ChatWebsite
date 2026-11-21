import { ApiError, ErrorCode } from "@workspace/http";
import type { SessionVerifyRepository } from "../../infrastructure/repository/session-verify.repository";
import { Security } from "../../domain/entities/security";

export class VerifySession {
    constructor(
        private readonly verifySessionRepository: SessionVerifyRepository,
    ) { }

    async verify(token: string) {
        const hashToken = Security.createHash(token);
        const session = await this.verifySessionRepository.verify(hashToken);

        if (!session.isValid()) {
            if (session.isActive) session.markExpired();

            throw new ApiError(
                "Session expired",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        return session.userId;
    }
}
