interface SessionProps {
    token: string;
    hashToken: string;
    userId: string;
    expiredAt: Date;
    isActive: boolean;
}

export class Session {
    constructor(private readonly props: SessionProps) { }

    get Token() {
        return this.props.token
    }

    get hashToken() {
        return this.props.hashToken
    }

    get userId() {
        return this.props.userId
    }

    get isActive() {
        return this.props.isActive
    }

    get expiredAt() {
        return this.props.expiredAt
    }

    isValid() {
        if (this.props.expiredAt < new Date()) return false;

        return true;
    }

    markExpired() {
        if (this.props.expiredAt > new Date())
            throw new Error("Session is still valid");

        this.props.isActive = false;
    }
}
