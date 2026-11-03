import { MessageRepository } from "./message.repository";

export class MessageService {
    constructor(
        private readonly repository: MessageRepository = new MessageRepository(),
    ) { }

    private async checkChatMemberShip(userId: string, chatId: string) {
        const valid = await this.repository.checkMemberShip(userId, chatId);

        if (!valid || !valid.id) {
            return false;
        }

        return true;
    }

    private async messageCreation(
        content: string,
        chatId: string,
        userId: string,
    ) {
        const message = await this.repository.messageCreation(
            content,
            userId,
            chatId,
        );

        return true;
    }

    private async fetchMembers(chatId: string) {
        const members = await this.repository.getMembers(chatId);

        if (!members) {
            return null;
        }

        return members;
    }

    public async messageOperation(
        content: string,
        senderId: string,
        chatId: string,
    ) {
        const isValid = await this.checkChatMemberShip(senderId, chatId);

        if (!isValid) {
            //handle invalidation error
            return null
        }

        const [message, members] = await Promise.all([
            this.messageCreation(content, chatId, senderId),
            this.fetchMembers(chatId),
        ]);

        if (!members) {
            return null;
        }

        return members.chatMembers;
    }
}
