import {
    type Connections,
    type CacheStore,
    type ConnectionKey,
} from "../types/types";

export class Repository<T extends Connections = Connections> {
    private readonly cacheMap: CacheStore<T>;

    constructor() {
        this.cacheMap = new Map<ConnectionKey, T>();
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
