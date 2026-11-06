import type { ChatParticipants, ParticipantCache } from "@workspace/contracts";

export class ParticipantCacheFormat implements ParticipantCache {
    public participants: ChatParticipants[] = new Array<ChatParticipants>();
    public lastFetch: Date;

    constructor(participants: { userId: string }[], lastFetch: Date) {
        this.addParticipants(participants);
        this.lastFetch = lastFetch;
    }

    private addParticipants(participants: { userId: string }[]) {
        participants.forEach((idx) => {
            this.participants.push({ participantsId: idx.userId });
        });

        return this.participants;
    }
}
