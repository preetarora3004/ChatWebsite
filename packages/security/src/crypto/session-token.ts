import { randomBytes, createHash } from "node:crypto";

export const sessionToken = randomBytes(32).toString("hex");

export const tokenHash = (sessionToken: string) => {
    return createHash("sha256")
        .update(sessionToken)
        .digest("hex")
}
