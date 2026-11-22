import "dotenv/config";
import "./infrastructure/websocket/ws.client"
import { createApp } from "./app";
import { env } from "./config/config";
import "./infrastructure/websocket/ws.client"

const app = createApp();

const server = app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
});

server.on("error", (error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});

