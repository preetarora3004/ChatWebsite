import type { SessionResult } from "@workspace/contracts";
import { type WebSocket } from "ws";

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

export type ServerStore = {
    isOnline: boolean;
    ws: WebSocket;
};

export type ServerKey = string;

export type ServerMap<J extends ServerStore> = Map<ServerKey, J>;
