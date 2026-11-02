import type { Service } from "../service/service";
import type { Response, Request } from "express";
import { registerSession } from "../types/types";
import { ApiError, ErrorCode, SuccessCode } from "@workspace/http";
import type { SessionKey } from "@workspace/contracts";

export class Controller {
    constructor(private readonly service: Service) { }

    public getCache(req: Request, res: Response) { }

    public storeCache(req: Request, res: Response) { }

    public deleteCache(req: Request, res: Response) { }

    public cacheSession(req: Request, res: Response) {
        const { token, hashToken, userId, expiredAt } = req.body;

        const parsed = registerSession.safeParse({
            token: token,
            hashToken: hashToken,
            userId: userId,
            expiredAt: expiredAt,
        });

        if (!parsed.success) {
            throw new ApiError(
                "Invalid input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const session = this.service.storeSession(parsed.data.token, {
            userId: parsed.data.userId,
            hashToken: parsed.data.hashToken,
            isActive: true,
            expiredAt: parsed.data.expiredAt,
        });

        return res.status(SuccessCode.CREATED.statusCode).json({
            success: true,
            body: session,
        });
    }

    public verifySession(req: Request, res: Response) {
        const token = req.params.token as SessionKey;

        if (!token) {
            throw new ApiError(
                "Invalid input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const valid = this.service.verifySession(token);

        return valid
            ? res.status(SuccessCode.ACCEPTED.statusCode).json({
                success: valid,
            })
            : res.status(ErrorCode.UNAUTHORIZED.statusCode).json({
                success: valid,
            });
    }
}
