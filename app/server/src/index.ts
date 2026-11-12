import express from "express";
import { ErrorMiddleware } from "@workspace/http";
import cookieParser from "cookie-parser";
import "./modules/websocket/websocket.client";
import "dotenv/config";
import cors from "cors";
import AuthRoutes from "./modules/auth/auth-routes";
import UserRoutes from "./modules/user/user-routes";

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
    cookieParser(),
    express.json(),
);

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);

app.use(ErrorMiddleware);

try {
    if (!PORT) {
        throw Error("PORT undefined");
    }

    app.listen(PORT, () => {
        console.log(`Server is listening on the ${PORT}`);
    });
} catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
}
