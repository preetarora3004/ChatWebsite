import type { User } from "../../domain/entities/user";

export interface IGetUserRepository {
    getUser(username: string) : Promise<User> 
}
