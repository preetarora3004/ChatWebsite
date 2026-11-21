import type { PrismaClient } from "@workspace/db/client";
import type { IUserRegisterRepository } from "../../application/interface/create-user-repository";
import { User } from "../../domain/entities/user";
import { UserCreation } from "../../domain/entities/userCreation";

export class RegisterUserRepository implements IUserRegisterRepository {
    constructor(private readonly client: PrismaClient) { }

    async registerAccount(props: UserCreation): Promise<User> {
        const user = await this.client.user.create({
            data: {
                username: props.username,
                email: props.email,
                password: props.hashPassword,
            },
            select: {
                id: true,
                username: true,
                password: true,
            },
        });

        return new User(user);
    }
}
