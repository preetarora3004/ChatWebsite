import type { GetChatParticipantServicePort } from "../interface/inbound/get-chat-participant.service.port";
import type { GetChatParticipantRepositoryPort } from "../interface/outbound/get-chat-participant.repository.port";

export class GetChatParticipantService implements GetChatParticipantServicePort {
    constructor(
        private readonly getChatParticipantRepository: GetChatParticipantRepositoryPort,
    ) { }

    public async getChatParticipants(chatId: string) {
        // const data = await this.getChatParticipantRepository.getChatParticipant(chatId);
        //
        // if (data) {
        //     return data;
        // }

        const chatParticipants =
            await this.getChatParticipantRepository.getChatParticipant(chatId);

        return {
            participants: chatParticipants ? chatParticipants.participants : null,
        };
    }
}
