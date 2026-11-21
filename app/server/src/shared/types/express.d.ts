import type { Express } from "express";
import { Express } from "express";
import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
