import type { PrismaClient } from "@workspace/db/client";
import type { IGetUserRepository } from "../../application/interface/outbound/get-user-repository";
import { User } from "../../domain/entities/user";
import { ApiError, ErrorCode } from "@workspace/http";

export class GetUserRepository implements IGetUserRepository {
    constructor(private readonly client: PrismaClient) { }

    async getUser(username: string) {
        const user = await this.client.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
                username: true,
                password: true
            },
        });

        if (!user) {
            throw new ApiError(
                "No user for this username",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );
        }

        return new User(user);
    }
}
