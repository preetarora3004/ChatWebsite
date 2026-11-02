import { UserService } from "../user-service/user-service";

export class UserController {
    constructor(private readonly service: UserService) { }
}
