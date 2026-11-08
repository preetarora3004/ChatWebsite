import type {
    ChatMemberCacheRequest,
    ChatParticipants,
    ParticipantCache,
    ParticipantChatId,
} from "@workspace/contracts";

export class ParticipantCacheFormat {
    public participants: ParticipantChatId[] = new Array<ParticipantChatId>();
    public lastFetch: Date;

    constructor(participants: ChatMemberCacheRequest, lastFetch: Date) {
        this.addParticipants(participants);
        this.lastFetch = lastFetch;
    }

    private addParticipants(
        participants: ChatMemberCacheRequest,
    ): ParticipantChatId[] {
        participants.forEach(({ chatId, participants }) => {
            this.participants.push({
                chatId,
                participants: participants.map(({ user }) => ({
                    userId: user.id,
                    username: user.username,
                })),
                lastFetch: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            });
        });

        return this.participants;
    }
}

export function formatRequest(data: ChatMemberCacheRequest) { }
