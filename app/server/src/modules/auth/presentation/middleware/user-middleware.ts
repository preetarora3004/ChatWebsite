import type { Request, Response, NextFunction } from "express";
import { verifyService } from "@workspace/server/auth/auth-compsition";
import { ApiError, ErrorCode } from "@workspace/http";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const cookie = req.cookies;
    const verified = await verifyService.verify(cookie.sessionToken);

    if (!verified) {
        throw new ApiError(
            "Unauthorized access",
            ErrorCode.UNAUTHORIZED.code,
            ErrorCode.UNAUTHORIZED.statusCode,
        );
    }

    req.userId = verified;
    next();
}
