import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);

export const env = {
    PORT: port,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
} as const

