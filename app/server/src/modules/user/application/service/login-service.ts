import { ApiError, ErrorCode } from "@workspace/http";
import { VerifyHash } from "../../../../shared/bcrypt/verifyPassword";
import type { IGetUserRepository } from "../interface/outbound/get-user-repository";
import type { SessionCreationPort } from "@workspace/server/auth/application/interface/inbound/session-creation.port";
import type { LoginServicePort } from "../interface/inbound/login-service-service.port";

export class LoginService implements LoginServicePort{
    constructor(
        private readonly getUserRepository: IGetUserRepository,
        private readonly sessionCreation: SessionCreationPort,
    ) { }

    async login(username: string, password: string) {
        const user = await this.getUserRepository.getUser(username);
        const result = await VerifyHash.verify(password, user.password);

        if (!result)
            throw new ApiError(
                "Invalid credential",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );

        const session = await this.sessionCreation.createSession(user.id);

        return session;
    }
}
