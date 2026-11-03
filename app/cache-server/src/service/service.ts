import type { SessionResult } from "@workspace/contracts";
import type { Repository } from "../repository/repository";
import type {
    ConnectionKey,
    Connections,
    SessionKey,
} from "@workspace/contracts";
import { sessionToken } from "@workspace/security";

export class Service<
    T extends Connections = Connections,
    K extends SessionResult = SessionResult,
> {
    constructor(private readonly repository: Repository<T, K>) { }

    public storeCache(userId: ConnectionKey, connection: T): boolean {
        return this.repository.storeCache(userId, connection);
    }

    public retrieveCache(userId: ConnectionKey): T | null {
        return this.repository.retrieveCache(userId);
    }

    public deleteCache(userId: ConnectionKey): boolean {
        return this.repository.removeCache(userId);
    }

    public storeSession(token: SessionKey, session: K) {
        const sessionObj = this.repository.cacheSession(token, session);

        return sessionObj;
    }

    public verifySession(token: SessionKey): string | null {
        const session = this.repository.getSession(token);

        if (
            (session && session.expiredAt <= new Date(Date.now())) ||
            (session && !session.isActive) ||
            !session
        ) {
            return null;
        }

        return session.userId;
    }
}
