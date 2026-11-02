import type {
    CreateSessionResult,
    SessionStoreResponse,
    SessionKey,
    SessionRegister,
    SessionVerifyResponse,
} from "@workspace/contracts";
import { ApiError, ErrorCode } from "@workspace/http";

export class CacheClient {
    constructor(
        private readonly baseUrl: String = "http://localhost:4000/api/v1/cache",
    ) { }

    public async storeSession(session: SessionRegister) {
        const res = await fetch(`${this.baseUrl}/session-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: session.token,
                hashToken: session.hashToken,
                userId: session.userId,
                expiredAt: session.expiredAt,
            }),
        });

        if (!res.ok) {
            throw new ApiError(
                "Unable to cache",
                ErrorCode.INTERNAL_SERVER_ERROR.code,
                ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
            );
        }

        const data = (await res.json()) as SessionStoreResponse;

        return data.body;
    }

    public async verifySession(token: SessionKey) {
        const res = await fetch(`${this.baseUrl}/session-user/${token}`, {
            method: "GET",
        });

        if (!res.ok) {
            throw new ApiError(
                "Unable to cache",
                ErrorCode.INTERNAL_SERVER_ERROR.code,
                ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
            );
        }

        const data = (await res.json()) as SessionVerifyResponse;

        return data.success;
    }
}
