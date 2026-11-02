import { type WebSocket, WebSocketServer } from "ws";
import { type IncomingMessage, createServer } from "http";
import { userMap } from "./repository/repository";
import "dotenv/config";
import { notify, returnParams } from "./utility/utility";

const PORT = process.env.PORT ?? 8080;
const server = createServer();
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
        ws.emit("connection", ws, req);
    });
});

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const idArray = returnParams(
        req.url!,
        `http://${req.headers.host}`,
        "userId",
    );

    const [userId] = idArray;

    if (!userId) {
        throw Error("Invalid connection");
    }

    userMap.set(userId, { ws: ws, isOnline: true });

    ws.on("pong", () => {
        let user = userMap.get(userId);

        if (!user) {
            userMap.set(userId, { ws, isOnline: true });
            user = userMap.get(userId);
        }

        user!.isOnline = true;
        notify("presence", { userId: userId, isOnline: user!.isOnline });
    });

    setTimeout(() => {
        userMap.forEach((u, key) => {
            if (!u.isOnline) {
                u.ws.terminate();
                userMap.delete(key);
            }

            u.isOnline = false;
            u.ws.send("ping");
        });
    }, 15000);
});

try {
    server.listen(PORT, () => {
        if (!PORT) {
            console.log(`PORT undefined`);
            process.exit(1);
        }

        console.log(`Server is listening on the ${PORT}`);
    });
} catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
}
