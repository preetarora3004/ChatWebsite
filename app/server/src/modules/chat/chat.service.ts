import { ChatRepository } from "./chat.repository";
import { cacheClient } from "../dependency/dependency";

export class ChatService {
    constructor(repository: ChatRepository) { }

    public async checkCacheParticipants(chatId: string) {
        const data = await cacheClient.getChatParticipant(chatId);

        return data;
    }
}
