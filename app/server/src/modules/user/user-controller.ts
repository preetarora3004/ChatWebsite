import { ApiError, ErrorCode } from "@workspace/http";
import { UserService } from "./user-service";
import type { Request, Response } from "express";

export class UserController {
    constructor(private readonly service: UserService) { }

    public async dashBoard(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        const dashboard = await this.service.getDashboard(userId);

        return res.status(200).json({
            success: true,
            body: dashboard,
        });
    }
}
