import type { IMessageCreationService } from "../interface/inbound/message-creation.service";
import type { MessageCreationRepositoryPort } from "../interface/outbound/message-creation.repository.port";

export class MessageCreationService implements IMessageCreationService {
    constructor(
        private readonly messageCreationRepository: MessageCreationRepositoryPort,
    ) { }

    async createMessage(userId: string, chatId: string, content: string) {
        const message = await this.messageCreationRepository.create(
            userId,
            chatId,
            content,
        );

        //------------

        return message

    }
}
