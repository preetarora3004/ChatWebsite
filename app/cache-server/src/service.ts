import type { ChatMemberCacheRequest, SessionResult } from "@workspace/contracts";
import type { Repository } from "./repository";
import type {
    ConnectionKey,
    Connections,
    SessionKey,
} from "@workspace/contracts";
import { ParticipantCacheFormat } from "./utility";

export class Service<
    T extends Connections = Connections,
    K extends SessionResult = SessionResult,
> {
    constructor(private readonly repository: Repository<T, K>) { }

    public cacheParticipants(
        participants: ChatMemberCacheRequest,
    ) {
        const cacheParticipants = new ParticipantCacheFormat(
            participants,
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        );

        const isCached = this.repository.cacheParticipants(
            cacheParticipants.participants,
        );

        if (!isCached) {
            return false;
        }

        return isCached;
    }

    public getParticipants(chatId: string) {
        const cache = this.repository.getChatParticipant(chatId);

        if (!cache) {
            return null;
        }

        return cache;
    }

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
