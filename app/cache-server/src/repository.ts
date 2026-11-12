import {
    type Connections,
    type CacheStore,
    type ConnectionKey,
    type SessionStore,
    type SessionKey,
    type ChatParticipants,
    type PartitipantKey,
    type ParticipantMap,
    type CreateSessionResult,
    type ParticipantCache,
    type SessionResult,
    type ParticipantChatId,
} from "@workspace/contracts";

export class Repository<
    T extends Connections = Connections,
    K extends SessionResult = SessionResult,
    I extends ParticipantCache = ParticipantCache,
> {
    private readonly cacheMap: CacheStore<T>;
    private readonly sessionMap: SessionStore<K>;
    private readonly participantMap: ParticipantMap<I>;

    constructor() {
        this.cacheMap = new Map<ConnectionKey, T>();
        this.sessionMap = new Map<SessionKey, K>();
        this.participantMap = new Map<PartitipantKey, I>();
    }

    public cacheParticipants(participantCache: ParticipantChatId[]) {
        participantCache.forEach((idx) => {
            const cache = this.participantMap.get(idx.chatId);

            if (!cache) {
                this.participantMap.set(idx.chatId, {
                    participants: idx.participants,
                    lastFetch: idx.lastFetch,
                } as I);
            }
        });

        return true;
    }

    public getChatParticipant(chatId: string): I | undefined {
        return this.participantMap.get(chatId);
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
