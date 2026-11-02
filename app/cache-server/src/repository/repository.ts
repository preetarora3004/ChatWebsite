import type { CreateSessionResult, SessionResult } from "@workspace/contracts";
import {
    type Connections,
    type CacheStore,
    type ConnectionKey,
    type SessionStore,
    type SessionKey,
} from "@workspace/contracts";

export class Repository<
    T extends Connections = Connections,
    K extends SessionResult = SessionResult,
> {
    private readonly cacheMap: CacheStore<T>;
    private readonly sessionMap: SessionStore<K>;

    constructor() {
        this.cacheMap = new Map<ConnectionKey, T>();
        this.sessionMap = new Map<SessionKey, K>();
    }

    public cacheSession(token: SessionKey, session: K): CreateSessionResult {
        let sessionObj = this.sessionMap.get(token);

        if (
            sessionObj &&
            sessionObj.isActive &&
            sessionObj.expiredAt > new Date(Date.now())
        ) {
            return { ...session, token: token };
        }

        this.sessionMap.set(token, session);

        return { ...session, token: token };
    }

    public getSession(token: SessionKey): K | null {
        let session = this.sessionMap.get(token);

        if (!session) {
            return null;
        }

        return { ...session, token };
    }

    public deleteSession(token: SessionKey): boolean {
        return this.sessionMap.delete(token);
    }

    public storeCache(userId: string, connection: T): boolean {
        let userSocket = this.cacheMap.get(userId);

        if (userSocket && userSocket.isOnline) {
            return false;
        }

        this.cacheMap.set(userId, connection);

        return true;
    }

    public removeCache(userId: ConnectionKey): boolean {
        return this.cacheMap.delete(userId);
    }

    public retrieveCache(userId: ConnectionKey): T | null {
        return this.cacheMap.get(userId) ?? null;
    }
}
