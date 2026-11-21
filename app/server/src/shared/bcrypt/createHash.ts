import bcrypt from "bcrypt";

export class CreateHash {
    static async hash(data: string) {
        return await bcrypt.hash(data, 10);
    }
}
