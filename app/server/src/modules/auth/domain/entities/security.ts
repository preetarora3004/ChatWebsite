import { randomBytes, createHash } from "node:crypto";

export class Security {
    static createToken() {
        return randomBytes(32).toString("hex");
    }

    static createHash(token: string) {
        return createHash("sha256").update(token).digest("hex");
    }
}
