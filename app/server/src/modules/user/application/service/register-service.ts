import type { SessionCreation } from "@workspace/server/auth/application/service/create-session";
import { CreateHash } from "../../../../shared/bcrypt/createHash";
import { UserCreation } from "../../domain/entities/userCreation";
import type { RegisterUserRepository } from "../../infrastructure/repository/create-user.repository";

export class RegisterAccountService {
    constructor(
        private readonly userRegisterRepository: RegisterUserRepository,
        private readonly sessionCreationService: SessionCreation,
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
