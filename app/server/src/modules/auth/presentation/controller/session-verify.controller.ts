import { ApiError, ErrorCode, SuccessCode } from "@workspace/http";
import type { VerifySession } from "../../application/service/verify-session";
import type { Request, Response } from "express";

export class SessionVerifyController {
    constructor(private readonly verifySessionService: VerifySession) {}

    public async verifySession(req: Request, res: Response) {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        const isAuthenticated = await this.verifySessionService.verify(token);

        return res.status(SuccessCode.OK.statusCode).json({
            success: true,
            userId: isAuthenticated,
        });
    }
}
