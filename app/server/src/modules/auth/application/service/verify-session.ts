import { ApiError, ErrorCode } from "@workspace/http";
import { Security } from "../../domain/entities/security";
import type { SessionVerifyPort } from "../interface/inbound/session-verify.port";
import type { ISessionVerifyRepository } from "../interface/outbound/session-verify.repository";

export class VerifySession implements SessionVerifyPort {
    constructor(
        private readonly verifySessionRepository: ISessionVerifyRepository,
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
