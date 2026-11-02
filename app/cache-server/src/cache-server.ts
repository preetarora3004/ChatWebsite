import express from "express";
import "dotenv/config";
import cacheRouter from "./routes/routes";

const PORT = process.env.PORT ?? 4000;
const app = express();

app.use(express.json());

app.use("/api/v1/cache", cacheRouter);

try {
    if (!PORT) {
        throw Error("PORT undefined");
    }
} catch (err) {
    console.log(`Server is listening on the ${PORT}`);
    process.exit(1);
}
