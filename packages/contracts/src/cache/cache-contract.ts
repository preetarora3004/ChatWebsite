import type { SessionResult } from "@workspace/contracts";

//Fix
import type { WebSocket } from "bun";

export type Connections = {
    isOnline: boolean;
    ws: WebSocket;
};

export type ConnectionKey = string;

export type CacheStore<T extends Connections> = Map<ConnectionKey, T>;

export type SessionKey = string;

export type SessionStore<K extends SessionResult> = Map<SessionKey, K>;

export type SessionRegister = {
    token: string;
    userId: string;
    hashToken: string;
    expiredAt: Date;
};
