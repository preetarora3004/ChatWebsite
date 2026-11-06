import type {
    CreateSessionResult,
    SessionStoreResponse,
    SessionKey,
    SessionRegister,
    SessionVerifyResponse,
    ConnectionKey,
    Connections,
    SocketCacheResponse,
} from "@workspace/contracts";
import { ApiError, ErrorCode } from "@workspace/http";

export class CacheClient {
    constructor(
        private readonly baseUrl: String = "http://localhost:4000/api/v1/cache",
    ) { }

    public async cacheUserSocket(userId: ConnectionKey, connection: Connections) {
        const res = await fetch(`${this.baseUrl}/cache-user/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(connection),
        });

        if (!res.ok) {
            throw new ApiError(
                "Internal server error",
                ErrorCode.INTERNAL_SERVER_ERROR.code,
                ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
            );
        }

        const data = (await res.json()) as SocketCacheResponse;

        return data;
    }

    public async storeSession(session: SessionRegister) {
        console.log("10");
        console.log(session);
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

        console.log("11");

        if (!res.ok) {
            throw new ApiError(
                "Unable to cache",
                ErrorCode.INTERNAL_SERVER_ERROR.code,
                ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
            );
        }

        const data = (await res.json()) as SessionStoreResponse;

        console.log("12");

        return data.body;
    }

    public async verifySession(token: SessionKey) {
        const res = await fetch(`${this.baseUrl}/session-user/${token}`, {
            method: "GET",
        });

        // if (!res.ok) {
        //     throw new ApiError(
        //         "Unable to cache",
        //         ErrorCode.INTERNAL_SERVER_ERROR.code,
        //         ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
        //     );
        // }
        //
        console.log("done")

        const data = (await res.json()) as SessionVerifyResponse;

        console.log("passed");

        return data.userId;
    }
}
