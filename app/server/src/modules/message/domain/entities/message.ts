interface MessageProps {
    chatId: string;
    content: string;
    senderId: string;
}

export class Message {
    constructor(private readonly props: MessageProps) { }

    get chatId() {
        return this.props.chatId
    }

    get content() {
        return this.props.content
    }

    get senderId() {
        return this.props.senderId
    }
}
