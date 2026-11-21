import { ApiError, ErrorCode } from "@workspace/http";
import { VerifyHash } from "../../../../shared/bcrypt/verifyPassword";
import type { GetUserRepository } from "../../infrastructure/repository/get-user.repository";
import type { SessionCreation } from "@workspace/server/auth/application/service/create-session";

export class LoginService {
    constructor(
        private readonly getUserRepository: GetUserRepository,
        private readonly sessionCreation: SessionCreation,
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
