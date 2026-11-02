import type { Repository } from "../repository/repository";
import type { ConnectionKey, Connections } from "../types/types";

export class Service<T extends Connections = Connections> {
    constructor(private readonly repository: Repository<T>) { }

    public storeCache(userId: ConnectionKey, connection: T): boolean {
        return this.repository.storeCache(userId, connection);
    }

    public retrieveCache(userId: ConnectionKey): T | null {
        return this.repository.retrieveCache(userId);
    }

    public deleteCache(userId: ConnectionKey): boolean {
        return this.repository.removeCache(userId);
    }
}
