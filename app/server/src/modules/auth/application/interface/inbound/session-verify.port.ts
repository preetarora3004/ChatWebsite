export interface SessionVerifyPort {
    verify(token: string): Promise<string>
}
