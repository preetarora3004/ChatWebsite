export type SessionResult = {
    userId: string,
    hashToken: string,
    isActive: boolean,
    expiredAt: Date
}

export type CreateSessionResult = SessionResult & {
    token: string;
};

export type SessionUserId = SessionResult["userId"]
export type HashToken = SessionResult["hashToken"]
export type ExpiredAt = SessionResult["expiredAt"]

