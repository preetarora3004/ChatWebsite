import type { UserDTO } from "@workspace/server/user/domain/entities/user";

interface ChatParticipantsProps {
    chatMembers: {
        user: {
            id: string;
            username: string;
        };
    }[];
}

interface IChatParticipants {
    user: {
        id: string;
        username: string;
    };
}

export class ChatParticipant {
    #participants: UserDTO[];

    constructor(private readonly props: ChatParticipantsProps) {
        this.#participants = this.props.chatMembers.map(
            (idx: IChatParticipants) => {
                return { userId: idx.user.id, username: idx.user.username };
            },
        );
    }

    get participants() {
        return this.#participants;
    }

    checkMemberShip(userId: string) {
        return this.#participants.some((idx: UserDTO) => idx.userId === userId);
    }
}
