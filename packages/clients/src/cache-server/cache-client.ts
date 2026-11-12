import type {
    SessionStoreResponse,
    SessionKey,
    SessionRegister,
    SessionVerifyResponse,
    ConnectionKey,
    Connections,
    SocketCacheResponse,
    ChatMemberCacheRequest,
    ParticipantCacheResponse,
    ParticipantCache,
} from "@workspace/contracts";
import { ApiError, ErrorCode } from "@workspace/http";

export class CacheClient {
    constructor(
        private readonly baseUrl: String = "http://localhost:4000/api/v1/cache",
    ) { }

    public async cacheParticipant(chatParticipants: ChatMemberCacheRequest) {
        const res = await fetch(`${this.baseUrl}/participants-cache`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatParticipants),
        });

        if (!res.ok) {
            return false;
        }

        const data = (await res.json()) as ParticipantCacheResponse;

        return data.success ? true : false;
    }

    public async getChatParticipant(chatId: string) {
        const res = await fetch(`${this.baseUrl}/participants-cache/${chatId}`, {
            method: "GET",
        });

        if (!res.ok) {
            return null;
        }

        const data = (await res.json()) as any;

        return data ? data.cache : null;
    }

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

        // if (!res.ok) {
        //     throw new ApiError(
        //         "Unable to cache",
        //         ErrorCode.INTERNAL_SERVER_ERROR.code,
        //         ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
        //     );
        // }

        const data = (await res.json()) as SessionStoreResponse;

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

        const data = (await res.json()) as SessionVerifyResponse;

        return data.userId;
    }
}
