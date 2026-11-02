import type { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../errors/error-code";
import { ApiError } from "../errors/app-error";

export async function ErrorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (error instanceof ApiError) {
        return res
            .status(error.statusCode ?? ErrorCode.INTERNAL_SERVER_ERROR.statusCode)
            .json({
                status: error.code ?? ErrorCode.INTERNAL_SERVER_ERROR.code,
                error: error.message ?? null,
            });
    }
}
