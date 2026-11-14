import { ChatRepository } from "./chat.repository";
import { cacheClient } from "../dependency/dependency";

export class ChatService {
    readonly #repository: ChatRepository;
    constructor(repository: ChatRepository) {
        this.#repository = repository;
    }

    public async checkCacheParticipants(chatId: string) {
        const data = await cacheClient.getChatParticipant(chatId);

        if (data) {
            return data;
        }

        const participants = await this.#repository.getChatParticipant(chatId);

        const participant = participants?.chatMembers.map((idx) => {
            return { userId: idx.user.id, username: idx.user.username };
        });

        return { participants: participant };
    }
}
