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
import type { CacheClient } from "@workspace/clients";

export class AuthService {
    constructor(
        private readonly repository: AuthRepository,
        private readonly cacheClient: CacheClient,
    ) { }

    private async createSession(
        userId: SessionUserId,
    ): Promise<CreateSessionResult | undefined> {
        console.log("7");

        const activeSession = await this.repository.getActiveSession(userId);

        if (activeSession) {
            return activeSession;
        }

        const token = sessionToken;
        const hashToken = tokenHash(token);
        const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 1000);

        const sessionResult = await this.repository.createSession(
            token,
            userId,
            hashToken,
            expiredAt,
        );

        console.log(activeSession);

        console.log("9");

        const cacheSession = await this.cacheClient.storeSession({
            userId: userId,
            token: sessionResult!.token,
            hashToken: sessionResult!.hashToken,
            expiredAt: sessionResult!.expiredAt,
        });

        console.log("13");

        return !sessionResult ? undefined : cacheSession;
    }

    public async verifySession(token: string): Promise<string | null> {
        const hashToken = tokenHash(token) satisfies HashToken;

        console.log("hashed");
        console.log(hashToken);

        const valid = await this.cacheClient.verifySession(token);

        console.log(valid);

        if (valid) {
            return valid;
        }

        const session = await this.repository.getSessionByHash(token);

        if (
            !session ||
            session.expiredAt <= new Date(Date.now()) ||
            !session.isActive
        ) {
            return null;
        }

        const cache = await this.cacheClient.storeSession(session); //include token

        console.log(session);

        return !session ||
            session.expiredAt <= new Date(Date.now()) ||
            !session.isActive
            ? null
            : session.userId; // change return
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
        console.log("2");

        const parsed = loginSchema.safeParse(data);

        if (!parsed.success) {
            throw new ApiError(
                "Enter Valid Input",
                ErrorCode.VALIDATION_ERROR.code,
                ErrorCode.VALIDATION_ERROR.statusCode,
            );
        }

        console.log("3");

        const user = await this.repository.login(data.username);

        if (!user || !user.id) {
            throw new ApiError(
                "No account found",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );
        }

        console.log("5");

        const hashedPassword = await bcrypt.compare(data.password, user.password);

        console.log({
            hashedPassword,
            storedHashLength: user.password.length,
            storedHashPrefix: user.password.slice(0, 7),
        });

        console.log("6");

        if (!hashedPassword) {
            throw new ApiError(
                "Invalid credentials",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        const session = await this.createSession(user.id);

        console.log("14");

        return session;
    }

    private async exponentialRetry() { }
}
