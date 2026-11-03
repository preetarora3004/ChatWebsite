import type { CreateSessionResult } from "../auth/session-result";

export type SessionStoreResponse = {
    success: true;
    body: CreateSessionResult;
};

export type SessionVerifyResponse = {
    success: boolean;
    userId: string | null
};

export type SocketCacheResponse = {
    success: true;
    userId: string | null
};
