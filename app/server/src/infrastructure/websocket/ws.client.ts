import { WebSocket } from "ws";
import { wsConfig } from "./ws.config";
import type { MessageServer } from "@workspace/contracts";
import { handleMessage } from "../websocket.service";

export class WSClient {
    #instance: WebSocket;
    #port: number = wsConfig.port;
    #protocol: string = wsConfig.WS_PROTOCOL;
    #host: string = wsConfig.WS_HOST;
    #serverId: string = wsConfig.serverId;

    constructor() {
        this.#instance = new WebSocket(
            `${this.#protocol}://${this.#host}:${this.#port}/?serverId=${this.#serverId}`,
        );
        console.log(`Connected with websocket`);
    }

    get instance() {
        return this.#instance;
    }
}

const ws = new WSClient().instance;

export default ws;

ws.on("open", () => {
    console.log("Connected to websocket with serverID 1");
});

ws.on("message", (buffer: string) => {
    const message = JSON.parse(buffer);

    if (message satisfies MessageServer) {
        handleMessage(message, ws);
    }
});
