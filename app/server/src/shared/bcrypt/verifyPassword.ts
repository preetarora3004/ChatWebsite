import bcrypt from "bcrypt";

export class VerifyHash {
    static async verify(data: string, hash: string) {
        return await bcrypt.compare(data, hash);
    }
}
