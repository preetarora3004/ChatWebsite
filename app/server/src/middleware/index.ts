import express, { type Express } from "express";
import cors from "cors";
import { env } from "../config/config";
import cookieParser from "cookie-parser";

export async function registerMiddleware(app: Express) {
    app.use(
        cors({
            origin: env.CLIENT_ORIGIN,
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.use(express.json());
}
