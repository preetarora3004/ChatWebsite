import type {
    HashToken,
    CreateSessionResult,
    SessionUserId,
} from "@workspace/contracts";
import type { AuthRepository } from "./auth-repository";
import { sessionToken, tokenHash } from "@workspace/security";
import bcrypt from "bcrypt";
import {
    type RegisterInput,
    registerSchema,
    type LoginInput,
    loginSchema,
} from "./auth-schema";
import { ApiError, ErrorCode } from "@workspace/http";

export class AuthService {
    constructor(private readonly repository: AuthRepository) { }

    private async createSession(
        userId: SessionUserId,
    ): Promise<CreateSessionResult | undefined> {
        const token = sessionToken;
        const hashToken = tokenHash(token);
        const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 1000);

        const sessionResult = await this.repository.createSession(
            userId,
            hashToken,
            expiredAt,
        );

        //Cache Session-Id

        return !sessionResult ? undefined : { ...sessionResult, token: token };
    }

    public async verifySession(token: string): Promise<boolean> {
        const hashToken = tokenHash(token) satisfies HashToken;
        //Check from Cache

        const session = await this.repository.getSessionByHash(hashToken);

        return !session ||
            session.expiredAt <= new Date(Date.now()) ||
            !session.isActive
            ? false
            : true;
    }

    public async createAccount(data: RegisterInput) {
        const parsed = registerSchema.safeParse(data);

        if (!parsed.success) {
            throw new ApiError(
                "Enter Valid Input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const account = await this.repository.registerAccount({
            ...data,
            password: hashedPassword,
        });

        if (!account.id) {
            throw new ApiError(
                "Username already taken",
                ErrorCode.CONFLICT.code,
                ErrorCode.CONFLICT.statusCode,
            );
        }

        const token = await this.createSession(account.id satisfies SessionUserId);

        return token;
    }

    public async login(data: LoginInput) {
        const parsed = loginSchema.safeParse(data);

        if (!parsed.success) {
            throw new ApiError(
                "Enter Valid Input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        const user = await this.repository.login(data.username);

        if (!user || !user.id) {
            throw new ApiError(
                "No account found",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );
        }

        const hashedPassword = await bcrypt.compare(data.password, user.password);

        if (!hashedPassword) {
            throw new ApiError(
                "Invalid credentials",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        const session = await this.createSession(user.id);

        return session;
    }

    private exponentialRetry() { }
}
