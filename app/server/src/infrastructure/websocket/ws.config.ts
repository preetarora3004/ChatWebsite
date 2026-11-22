import "dotenv/config"

export const wsConfig = {
    port: Number(process.env.WS_PORT ?? 8080),
    WS_PROTOCOL: process.env.WS_PROTOCOL ?? "ws",
    WS_HOST: process.env.WS_HOST ?? "localhost",
    serverId: process.env.SERVER_ID ?? "dZYoC3BkAljcnSi2oXt6dRnQgL0+4K5s"
}
