import { ApiError, ErrorCode } from "@workspace/http";
import { UserRepository } from "./user-repository";
import { cacheClient } from "../dependency/dependency";
import type { ChatMemberCacheRequest } from "@workspace/contracts";

export class UserService {
    constructor(private readonly repository: UserRepository) { }

    public async getDashboard(userId: string) {
        const dashboard = await this.repository.getDashboard(userId);

        if (!dashboard) {
            throw new ApiError(
                "Unable to fetch dashboard",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );
        }

        const result = dashboard?.chatMembers.map((idx) => ({
            chatId: idx.chat.id,
            participants: idx.chat.chatMembers,
        }));

        cacheClient.cacheParticipant(result as ChatMemberCacheRequest);

        return dashboard
    }
}
