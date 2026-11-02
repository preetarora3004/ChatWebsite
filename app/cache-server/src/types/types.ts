import type { WebSocket } from "bun";

export type Connections = {
    isOnline: boolean;
    ws: WebSocket;
};

export type ConnectionKey = string;

export type CacheStore<T extends Connections> = Map<ConnectionKey, T>;
