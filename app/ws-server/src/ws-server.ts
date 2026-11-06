import { WebSocketServer } from "ws";
import { type IncomingMessage, createServer } from "http";
import { userMap, serverMap } from "./repository/repository";
import type { AuthenticatedWebSocket } from "./types/types";
import "dotenv/config";
import { handleMessage, notify, returnParams } from "./utility/utility";
import { authClient } from "./dependency/dependency";
import { getCookie } from "./utility/utility";

const PORT = process.env.PORT ?? 8080;
const server = createServer();
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", async (req, socket, head) => {
    try {
        const [serverId] = returnParams(
            req.url!,
            `http://${req.headers.host}`,
            "serverId",
        );

        if (!serverId) {
            const sessionToken = getCookie(req.headers.cookie, "sessionToken");

            console.log(sessionToken)

            if (!sessionToken) {
                socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                socket.destroy();
                return;
            }

            const userId = await authClient.verifySession(sessionToken);

            if (!userId) {
                socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                socket.destroy();
                return;
            }

            wss.handleUpgrade(req, socket, head, (ws) => {
                const authenticatedWs = ws as AuthenticatedWebSocket;
                authenticatedWs.id = userId;

                userMap.set(userId, { ws: authenticatedWs, isOnline: true });
                wss.emit("connection", authenticatedWs, req);
            });
        } else {
            wss.handleUpgrade(req, socket, head, (ws) => {
                const serverAuthenticatedWs = ws as AuthenticatedWebSocket;
                serverAuthenticatedWs.id = serverId;

                serverMap.set(serverId, { ws: serverAuthenticatedWs, isOnline: true });
                wss.emit("connection", ws, req);
            });
        }
    } catch {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
    }
});

wss.on(
    "connection",
    async (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
        ws.on("message", (data: string) => {
            const msg = JSON.parse(data);
            handleMessage(msg, ws);
        });

        ws.on("pong", () => {
            let user = userMap.get(ws.id);

            if (!user) {
                userMap.set(ws.id, { ws, isOnline: true });
                user = userMap.get(ws.id);
            }

            user!.isOnline = true;
        });

        //Change presence simulator according to the token
        setInterval(() => {
            userMap.forEach((u, key) => {
                if (!u.isOnline) {
                    u.ws.terminate();
                    userMap.delete(key);
                    notify("presence", { userId: key, isOnline: u.isOnline });
                }

                u.isOnline = false;
                u.ws.ping();
            });
        }, 15000);
    },
);

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
