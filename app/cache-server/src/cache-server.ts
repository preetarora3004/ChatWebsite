import express from "express";
import "dotenv/config";
import cacheRouter from "./routes";
import { ErrorMiddleware } from "@workspace/http";

const PORT = process.env.PORT ?? 4000;
const app = express();

app.use(express.json());

app.use("/api/v1/cache", cacheRouter);
app.use(ErrorMiddleware)

try {
    if (!PORT) {
        throw Error("PORT undefined");
    }
    app.listen(PORT, () => {
        console.log(`Cache-Server is listening on the ${PORT}`);
    });
} catch (err) {
    console.log(`Server is listening on the ${PORT}`);
    process.exit(1);
}
