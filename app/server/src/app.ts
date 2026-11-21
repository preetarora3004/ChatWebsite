import express from "express";
import { ErrorMiddleware } from "@workspace/http";
import { registerMiddleware } from "./middleware";
import { registerRoutes } from "./routes";

export function createApp() {
    const app = express();

    registerMiddleware(app);

    app.use("/api/v1", registerRoutes());
    app.use(ErrorMiddleware);

    return app;
}
