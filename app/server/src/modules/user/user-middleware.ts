import type { Request, Response, NextFunction } from "express";
import { authService } from "../auth/auth-dependency";
import { ApiError, ErrorCode } from "@workspace/http";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const cookie = req.cookies;

    const verified = await authService.verifySession(cookie.sessionToken);

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
