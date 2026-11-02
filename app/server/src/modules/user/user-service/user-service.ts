import { UserRepository } from "../user-repository/user-repository";

export class UserService {
    constructor(private readonly repository: UserRepository) { }
}
