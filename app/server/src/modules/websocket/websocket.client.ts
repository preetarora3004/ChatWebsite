import { WebSocket } from "ws";
import type { MessageServer } from "@workspace/contracts";
import { handleMessage } from "./websocket.service";

export const ws = new WebSocket(`ws://localhost:8080/?serverId=${1}`);

ws.on("open", () => {
    console.log("Connected to websocket with serverID 1");
});

ws.on("message", (buffer: string) => {
    const message = JSON.parse(buffer);

    if (message satisfies MessageServer) {
        handleMessage(message, ws);
    }
});
