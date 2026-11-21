import { User } from "../../domain/entities/user"
import type { UserCreation } from "../../domain/entities/userCreation"

export interface IUserRegisterRepository {
    registerAccount(props: UserCreation): Promise<User>
}
