import type { Service } from "../service/service";
import type { Response, Request } from "express";
import type { Connections, ConnectionKey } from "../types/types";

export class Controller<T extends Connections = Connections> {
    constructor(private readonly service: Service) { }

    public getCache(req: Request, res: Response) { }

    public storeCache(req: Request, res: Response) { }

    public deleteCache(req: Request, res: Response) { }
}
