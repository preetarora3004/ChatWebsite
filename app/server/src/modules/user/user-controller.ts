import { UserService } from "./user-service";
import type { Request, Response } from "express";

export class UserController {
    constructor(private readonly service: UserService) { }

    public async dashBoard(req: Request, res: Response) {
        const userId = req.userId;

        
    }
}
