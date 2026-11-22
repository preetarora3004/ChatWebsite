import { CreateHash } from "../../../../shared/bcrypt/createHash";
import { UserCreation } from "../../domain/entities/userCreation";
import type { RegisterAccountServicePort } from "../interface/inbound/register-service.port";
import type { IUserRegisterRepository } from "../interface/outbound/create-user-repository";
import type { SessionCreationPort } from "@workspace/server/auth/application/interface/inbound/session-creation.port";

export class RegisterAccountService implements RegisterAccountServicePort{
    constructor(
        private readonly userRegisterRepository: IUserRegisterRepository,
        private readonly sessionCreationService: SessionCreationPort,
    ) { }

    async register(username: string, email: string, password: string) {
        const hashPassword = await CreateHash.hash(password);
        const userCreation = new UserCreation({ username, email, hashPassword });
        const user =
            await this.userRegisterRepository.registerAccount(userCreation);
        const session = await this.sessionCreationService.createSession(user.id);

        return session;
    }
}
