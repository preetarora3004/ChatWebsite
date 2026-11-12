import type { Service } from "./service";
import type { Response, Request } from "express";
import { ApiError, ErrorCode, SuccessCode } from "@workspace/http";
import type { ChatMemberCacheRequest, PartitipantKey, SessionKey } from "@workspace/contracts";
import type { ConnectionKey, Connections } from "@workspace/contracts";

export class Controller {
    constructor(private readonly service: Service) { }

    public cacheParticipant(req: Request, res: Response) {
        const participants = req.body as ChatMemberCacheRequest;

        if (participants.length < 0) {
            throw new ApiError(
                "Invalid input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const result = this.service.cacheParticipants(participants);

        return res.status(result ? 201 : 500).json({
            success: result,
        });
    }

    public getParticipants(req: Request, res: Response) {
        const chatId = req.params.chatId as PartitipantKey;

        if (!chatId) {
            throw new ApiError(
                "Invalid input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const result = this.service.getParticipants(chatId);

        return res.status(result ? 200 : 404).json({
            success: result ? true : false,
            cache: result,
        });
    }

    public getCache(req: Request, res: Response) {
        const userId = req.query.token;

        if (typeof userId !== "string" || !userId.trim()) {
            throw new ApiError(
                "Invalid user ID",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const connection = this.service.retrieveCache(userId as ConnectionKey);

        if (!connection) {
            throw new ApiError(
                "Connection not found",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );
        }

        return res.status(SuccessCode.OK.statusCode).json({
            success: true,
            body: connection,
        });
    }

    public storeCache(req: Request, res: Response) {
        const userId = req.params.userId as string;
        const connection: unknown = req.body?.connection;

        if (!userId?.trim()) {
            throw new ApiError(
                "Invalid user ID",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        if (
            typeof connection !== "object" ||
            connection === null ||
            Array.isArray(connection)
        ) {
            throw new ApiError(
                "Invalid connection data",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const stored = this.service.storeCache(
            userId as ConnectionKey,
            connection as Connections,
        );

        if (!stored) {
            throw new ApiError(
                "Connection already exists",
                ErrorCode.CONFLICT.code,
                ErrorCode.CONFLICT.statusCode,
            );
        }

        return res.status(SuccessCode.CREATED.statusCode).json({
            success: true,
            body: {
                userId,
                stored,
            },
        });
    }

    public deleteCache(req: Request, res: Response) { }

    public cacheSession(req: Request, res: Response) {
        const { token, hashToken, userId, expiredAt } = req.body;

        // const parsed = registerSession.safeParse({
        //     token: token,
        //     hashToken: hashToken,
        //     userId: userId,
        //     expiredAt: expiredAt,
        // });

        // if (!parsed.success) {
        //     throw new ApiError(
        //         "Invalid input",
        //         ErrorCode.VALIDATION_ERROR.code,
        //         ErrorCode.VALIDATION_ERROR.statusCode,
        //     );
        // }

        const session = this.service.storeSession(token, {
            userId: userId,
            hashToken: hashToken,
            isActive: true,
            expiredAt: expiredAt,
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
                success: true,
                userId: valid,
            })
            : res.status(ErrorCode.UNAUTHORIZED.statusCode).json({
                success: false,
                userId: null,
            });
    }
}
